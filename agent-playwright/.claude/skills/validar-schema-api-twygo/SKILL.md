---
name: validar-schema-api-twygo
description: Validar response API Twygo contra JSON Schema draft-2020-12. Helper `validateAgainstSchema()` em `src/utils/schema.ts` (Ajv 8 + ajv-formats). Padrões envelope, paginação, multi-status 207, error shapes. Skill irmã da trinca API.
when_to_use: |
  - TC `Tipo: api` precisa assertar shape de response
  - Spec falhou com `expected X to equal Y` em body de response
  - Você está criando `schemas/<recurso>-<acao>-response.schema.json`
triggers:
  - "validateAgainstSchema"
  - "JSON Schema"
  - "Ajv"
  - "ajv-formats"
  - "schemas/"
  - "expected X to equal Y"
  - "draft-2020-12"
  - "additionalProperties"
version: 1.1.0
---

# validar-schema-api-twygo

> **Trinca API** — Skill irmã. Para padrão geral, ver [[testar-api-twygo]].
> Para auth, ver [[provisionar-token-api-twygo]].

## Semântica Twygo

JSON Schema é a forma canônica de assertar **shape** (estrutura, tipos,
formatos) da response da API Twygo. Substitui asserts frágeis tipo
`expect(body.data.results[0].email).toBe(...)` que quebram a cada
renomeação de campo no backend.

**Regra dura #15** (`agent-playwright/CLAUDE.md`): toda response de API
testada **deve** ser validada contra JSON Schema. Asserts adicionais sobre
campos específicos (`expect(body.data.results).toHaveLength(1)`) são
complementares, não substitutos.

## Quando usar

| Cenário | Validar com schema? |
|---|---|
| TC `Tipo: api` em `tests/api/` | ✅ Sempre |
| Helper `twygoApiCall()` em `src/utils/api.ts` (seed/cleanup) | ❌ Não — é setup, não asserção. Validar com schema custa tempo sem ganho. |
| TC `Tipo: ui` que faz `page.waitForResponse(...)` | △ Opcional — vale se a UI depende da shape exata da response. Caso raro. |
| Smoke universal (`tests/setup/smoke.spec.ts`) | ❌ Não — smoke é existência, não contrato |

## Estrutura canônica

```
projects/<slug>/schemas/
├── <recurso>-<acao>-response.schema.json
├── <recurso>-<acao>-error.schema.json    # opcional — schema do shape de erro 4xx/5xx
└── _shared/                              # opcional — schemas reusáveis entre endpoints
    ├── pagination.schema.json
    └── envelope.schema.json
```

**Naming canônico**:
- `<recurso>` = nome do recurso no plural (`events`, `users`, `panels`)
- `<acao>` = `create` / `read` / `list` / `update` / `delete` / `mass-enrollment` / `bulk-import` / etc
- Sufixo `-response.schema.json` para sucesso; `-error.schema.json` para shape de erro 4xx/5xx específico

Exemplos:
- `mass-enrollment-response.schema.json` — POST /api/v2/users/mass
- `event-participants-list-response.schema.json` — GET /api/v2/events/:id/participants
- `users-create-error-422.schema.json` — POST /api/v2/users (campos inválidos)

## Como gerar schema a partir de exemplo

1. **Capturar response real**:
   - Via Postman/curl: rodar request manualmente, copiar body
   - Via spec dummy: `console.log(JSON.stringify(await response.json(), null, 2))`
2. **Inferir schema base** (qualquer uma):
   - https://www.jsonschema.net/ (online, copy-paste)
   - `quicktype` CLI: `quicktype -l schema -o schema.json sample.json`
   - Manual (se response é pequena)
3. **Revisar manualmente**:
   - Marcar `required: [...]` os campos garantidos pelo contrato
   - Ajustar tipos (`integer` vs `number`, `string` vs `enum`)
   - Adicionar `format: email | uri | date-time | uuid` onde aplicável
   - **Manter `additionalProperties: true`** (anti-pattern E em `testar-api-twygo`)
4. **Validar**:
   - Rodar o spec de API que usa o schema — se response real falhar, ajustar até passar
   - Rodar contra response com campo extra (simular release) — não deve falhar

## Anatomia de um schema (Twygo response típica)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Mass enrollment response (POST /api/v2/users/mass)",
  "type": "object",
  "additionalProperties": true,
  "required": ["data"],
  "properties": {
    "data": {
      "type": "object",
      "additionalProperties": true,
      "required": ["results"],
      "properties": {
        "results": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": true,
            "required": ["email", "status"],
            "properties": {
              "email": { "type": "string", "format": "email" },
              "status": { "enum": ["success", "error"] },
              "participant_id": { "type": "integer", "minimum": 1 },
              "error": {
                "type": "object",
                "properties": {
                  "code": { "type": "string" },
                  "message": { "type": "string" }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

**Por que esse shape**:
- `"$schema": "...draft/2020-12/schema"` — declara versão (Ajv 8 usa `dist/2020.js`)
- `additionalProperties: true` em TODOS os níveis — tolera campos novos do backend
- `required` lista apenas os campos do CONTRATO (não TODOS os que aparecem em produção)
- `enum` em `status` impede o backend devolver valor novo silenciosamente — diferente de `additionalProperties`, enum força revisão se mudar
- `format: email` valida via ajv-formats

## Padrões Twygo recorrentes

### Envelope `{ data: {...} }`

A maioria das responses Twygo (V1 e V2) envelopa em `data`:

```json
{ "data": { "user": { "id": 1, "email": "..." } } }
{ "data": { "users": [...] } }
{ "data": { "results": [...] } }
```

Reflita no schema:
```json
{
  "type": "object",
  "required": ["data"],
  "properties": {
    "data": { /* shape interno */ }
  }
}
```

### Multi-status 207 (criação em massa)

Endpoints `*_mass` / `bulk_*` devolvem 207 com array de resultados por item:

```json
{
  "data": {
    "results": [
      { "email": "ok@x.com", "status": "success", "participant_id": 123 },
      { "email": "bad@x.com", "status": "error", "error": { "code": "...", "message": "..." } }
    ]
  }
}
```

Schema deve permitir AMBAS as variantes (item com `participant_id` OU com `error`) — use `oneOf` se quiser ser estrito, ou só liste `participant_id` e `error` ambos como opcionais.

### Paginação

V2 padrão: `{ data: { results: [...], pagination: { page, per_page, total } } }`

Crie schema reusável em `_shared/pagination.schema.json` e referencie via `$ref`.

### Erros 4xx/5xx

V2 padrão: `{ errors: [{ code, message, field? }] }` — diferente do envelope `data`.

Crie schema separado `<recurso>-<acao>-error.schema.json` e use no TC negativo:

```ts
test('TC2 — POST sem campos obrigatórios retorna 422', async () => {
  const response = await client.create(invalidPayload, authHeaders);
  expect(response.status()).toBe(422);
  validateAgainstSchema(await response.json(), createErrorSchema, 'POST /users 422');
});
```

## Uso do helper

```ts
import { validateAgainstSchema } from '../../../../src/utils/schema';
import schema from '../../schemas/mass-enrollment-response.schema.json';

const body = await response.json();
validateAgainstSchema(body, schema, 'POST /api/v2/users/mass');
```

**Argumentos**:
- `data` — payload a validar (geralmente `await response.json()`)
- `schema` — JSON Schema importado (TypeScript trata como `any` por default; ok para Ajv)
- `context` (opcional) — string descritiva para a mensagem de erro (default: `'response'`)

**Comportamento**:
- Compila schema na primeira chamada e cacheia via `WeakMap` (mesmo objeto = mesma `ValidateFunction`)
- Reporta TODOS os erros (`allErrors: true` no Ajv)
- Throws `Error` com mensagem agregada se validação falha

## Pretty error messages

Quando schema falha, o helper produz:

```
Schema validation failed for POST /api/v2/users/mass (3 errors):
  1. /data/results/0/status: must be equal to one of the allowed values — {"allowedValues":["success","error"]}
  2. /data/results/0/participant_id: must be integer — {"type":"integer"}
  3. /data: must have required property 'results' — {"missingProperty":"results"}
```

Útil em CI / report — basta abrir o report.md e a mensagem aponta o caminho exato (`/data/results/0/status`).

## TypeScript: importar JSON como módulo

`tsconfig.json` precisa de `"resolveJsonModule": true` (já habilitado no agent-playwright). Import direto:

```ts
import schema from '../../schemas/mass-enrollment-response.schema.json';
```

TypeScript trata o JSON como objeto literal — não precisa cast. Se quiser tipar a response, declarar interface separada:

```ts
interface MassEnrollmentResponse {
  data: {
    results: Array<{
      email: string;
      status: 'success' | 'error';
      participant_id?: number;
      error?: { code: string; message: string };
    }>;
  };
}

const body = await response.json() as MassEnrollmentResponse;
validateAgainstSchema<MassEnrollmentResponse>(body, schema);
// body agora é narrow-typed para uso no resto do test
```

O 4º generic do helper (`validateAgainstSchema<T>`) é `asserts data is T` — após validação, TS sabe a forma.

## Anti-patterns

### A. NUNCA usar `additionalProperties: false`

Schema com `additionalProperties: false` quebra a cada release do backend que adiciona campo novo. Anti-pattern E em `testar-api-twygo`.

❌ **Errado**:
```json
{ "type": "object", "additionalProperties": false, "properties": {...} }
```

✅ **Certo**:
```json
{ "type": "object", "additionalProperties": true, "properties": {...} }
```

### B. NUNCA listar TODOS os campos em `required`

Só os campos do CONTRATO da API (documentados, gateados por testes upstream). Campos ricos opcionais ficam em `properties` mas fora de `required`.

❌ **Errado**: `"required": ["id", "email", "name", "created_at", "updated_at", "last_login_ip"]`

✅ **Certo**: `"required": ["id", "email"]` (resto vive em `properties` mas opcional)

### C. NUNCA validar URL ou ID como string genérica quando há formato

Twygo emails são `email`. URLs são `uri`. IDs numéricos são `integer` com `minimum: 1`. UUIDs são `format: uuid`.

❌ **Errado**:
```json
"email": { "type": "string" }
```

✅ **Certo**:
```json
"email": { "type": "string", "format": "email" }
```

### D. NUNCA copiar response inteira de produção em `schemas/`

Schema é CONTRATO, não snapshot. Se schema vira clone literal da response, qualquer mudança quebra — derrota o propósito.

### E. NUNCA pular schema porque "é só um GET"

Mesmo GET simples: schema valida que o backend não regrediu o shape. Custo: 30s pra escrever schema. Benefício: detecção de regressão por release.

### F. NUNCA hardcodar valores específicos como `enum` quando deveria ser tipo aberto

Se valor depende do tenant (ex: nome de organização), tipo é `string`, não `enum`. `enum` só para conjuntos fechados pelo backend (status, kind, role).

❌ **Errado**:
```json
"organization_name": { "enum": ["Org A", "Org B"] }
```

✅ **Certo**:
```json
"organization_name": { "type": "string", "minLength": 1 }
```

## Quando schema falha — diagnóstico

| Erro do helper | Causa típica | Fix |
|---|---|---|
| `must have required property 'X'` | Backend removeu campo OU schema lista campo opcional como required | Verificar release notes da API; se backend mudou, ajustar `required` |
| `must be string` (recebeu number) | Backend mudou tipo (int → string para ID grande) | Confirmar via curl manual; ajustar schema |
| `must be equal to one of the allowed values` (enum) | Backend adicionou valor novo ao enum (ex: novo `status`) | Decidir: atualizar enum no schema, OU manter strict (teste vai falhar até backend voltar valor antigo, sinalizando que precisa revisar) |
| `must match format "email"` | Backend devolveu placeholder/empty | Bug do backend OU dado seed mal formado |

## Referências

- [JSON Schema draft-2020-12 release notes](https://json-schema.org/draft/2020-12/release-notes)
- [Ajv 8 docs](https://ajv.js.org/)
- [ajv-formats list](https://github.com/ajv-validator/ajv-formats)
- Helper: `agent-playwright/src/utils/schema.ts`
- Skill principal: [`testar-api-twygo`](../testar-api-twygo/SKILL.md)
- Skill irmã: [`provisionar-token-api-twygo`](../provisionar-token-api-twygo/SKILL.md)
