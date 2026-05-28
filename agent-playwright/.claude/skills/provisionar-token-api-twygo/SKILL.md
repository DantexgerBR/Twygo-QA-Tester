---
name: provisionar-token-api-twygo
description: Como obter token de acesso à API Twygo (V1/V2) em specs de `tests/api/`. Cobre 3 modos canônicos (`fixed_token` para token pré-gerado em `.env`, `oauth_password` para `POST /oauth/token` em runtime, `super_admin_generated` reservado para futuro), seleção via `API_AUTH_MODE`, helper canônico `getApiAuthHeaders()` em `src/utils/api-auth.ts` com cache de token por sessão. Resolve o REVISAR clássico das ATs de API (`Token de acesso à API V2 disponível (REVISAR: como obter token em staging)`). Use sempre que spec de API precisar de header `Authorization`, ANTES de marcar `test.fixme` por "falta token".
version: 1.0.0
---

# provisionar-token-api-twygo

## Semântica Twygo

API Twygo (V1 e V2) usa **bearer token** no header `Authorization` para
autenticação. Endpoints `/api/v1/*` e `/api/v2/*` aceitam `Bearer <token>`
e devolvem `401 Unauthorized` se ausente/inválido. Não há fallback por
cookie de sessão na API — UI usa session cookie, API usa bearer.

Token é emitido pela própria org de teste (escopo = org). NÃO compartilhar
tokens entre projetos — cada projeto tem env (e org) próprio.

## Modos de provisionamento

Selecione via env var `API_AUTH_MODE`:

| Modo | Quando usar | Como funciona |
|---|---|---|
| `fixed_token` (padrão) | Token gerado manualmente uma vez via Super Admin, colado no `.env` | Lê `API_TOKEN` do `.env` |
| `oauth_password` | Token rotacionado a cada run (mais seguro) — usuário+senha do admin gera token em runtime | `POST /oauth/token` com `grant_type=password` |
| `super_admin_generated` | Reservado para v2 deste skill | Gera token via UI Super Admin (browser) |

### Modo 1: `fixed_token` (padrão e recomendado para começar)

```env
# .env
API_AUTH_MODE=fixed_token
API_TOKEN=<token-bearer-gerado-no-super-admin>
```

**Como gerar o token**:

1. Logar no Super Admin (`/admin`)
2. Buscar a org de teste (`Pesquisar Organização` → digitar nome → `Editar/Visualizar`)
3. Aba "API" → botão "Gerar token de acesso" (ou similar)
4. Copiar o token (string longa, ~200 caracteres)
5. Colar em `API_TOKEN=` no `.env` (NUNCA commitar)

**Vantagem**: zero latência no setup, simples.
**Desvantagem**: token não rotaciona. Se vazar (acidente em screenshot, etc), revogar manualmente.

### Modo 2: `oauth_password` (rotação automática)

```env
# .env
API_AUTH_MODE=oauth_password
API_OAUTH_USERNAME=<email-do-admin-da-org>
API_OAUTH_PASSWORD=<senha-do-admin-da-org>
```

`getApiAuthHeaders()` faz:

```
POST {API_BASE_URL}/oauth/token
Content-Type: application/json

{
  "grant_type": "password",
  "username": "<email>",
  "password": "<senha>"
}
```

Response: `{ "access_token": "...", "token_type": "Bearer", ... }`

**Vantagem**: token nasce/morre na sessão de testes; baixo risco de vazar.
**Desvantagem**: 1 request HTTP extra por sessão (~200ms). Acoplamento com `/oauth/token` (se mudar, todos os testes quebram — improvável).

### Modo 3: `super_admin_generated` (reservado)

Gerar token via fluxo UI Super Admin no `globalSetup`, salvar em
`outputs/.auth/api-token.txt`, recuperar em runtime. Implementar SOMENTE
se Twygo descontinuar `/oauth/token` ou se rotação via Super Admin virar
política do time. Hoje não está implementado.

## Helper canônico: `getApiAuthHeaders()`

Localização: `agent-playwright/src/utils/api-auth.ts`

```ts
import { getApiAuthHeaders } from '../../../../src/utils/api-auth';

const authHeaders = await getApiAuthHeaders();
// → { Authorization: 'Bearer eyJhbGc...', 'Content-Type': 'application/json' }
```

**Comportamento**:
- Lê `API_AUTH_MODE` do env (default: `fixed_token`)
- Dispatcha para o handler correto
- Cacheia o token na primeira chamada (singleton in-memory por processo)
- Throws com mensagem clara se config inválida (ex: `API_TOKEN` vazio com mode `fixed_token`)

**Quando NÃO cachear**: se um TC específico precisa de token de OUTRA org
(ex: testar isolamento multi-tenant), chamar `getApiAuthHeadersForOrg(orgId)`
que NÃO usa cache. v1 do helper não implementa — adicionar quando aparecer
o caso real.

## Padrão de uso no spec

```ts
import { test, expect } from '@playwright/test';
import { EventsApiClient } from '../../api/EventsApiClient';
import { getApiAuthHeaders } from '../../../../src/utils/api-auth';

test.describe('Reinscrição via API V2', () => {
  let client: EventsApiClient;
  let authHeaders: Record<string, string>;

  test.beforeAll(async ({ request }) => {
    client = new EventsApiClient(request);
    authHeaders = await getApiAuthHeaders();
  });

  test('TC1 — ...', async () => {
    const response = await client.createMassEnrollment(payload, authHeaders);
    // ...
  });
});
```

**Por que `beforeAll` e não `beforeEach`**: token é estável durante a
sessão. Re-chamar a cada TC desperdiça 200ms por TC em modo
`oauth_password`. `beforeAll` chama 1× e reusa.

## Erros comuns e diagnóstico

| Sintoma | Causa | Fix |
|---|---|---|
| `Error: API_TOKEN vazio` no setup | `.env` não preenchido OU env não carregado | Verificar `.env` existe e `API_TOKEN=` tem valor |
| `401 Unauthorized` em todas as chamadas | Token expirou OU token de outra org | Regenerar via Super Admin OR conferir orgId do token bate com `API_BASE_URL` |
| `404` em `POST /oauth/token` | `API_BASE_URL` aponta UI host (não API) | Trocar `API_BASE_URL` para host de API (ex: `eduapi.stage.twygoead.com`, NÃO `stage.twygoead.com`) |
| `403 Forbidden` em endpoints específicos | Usuário tem token mas perfil não é Admin | Conferir perfil do user no Super Admin |
| Timeout no POST `/oauth/token` | Host de API offline OR firewall | Curl manual: `curl -X POST $API_BASE_URL/oauth/token -d '{"grant_type":"password","username":"...","password":"..."}' -H 'Content-Type: application/json'` |

## Anti-patterns

### A. NUNCA hardcodar token no spec ou `.data.ts`

❌ **Errado**:
```ts
const authHeaders = { Authorization: 'Bearer eyJhbGc...' };
```

✅ **Certo**: sempre via `getApiAuthHeaders()`.

### B. NUNCA commitar `.env`

`.gitignore` já cobre. Se acidentalmente commitar com token, revogar IMEDIATAMENTE no Super Admin e gerar novo.

### C. NUNCA marcar `test.fixme(true, 'falta token')`

Extensão do anti-pattern "seed inválido" (skill `provisionar-seed`). Token é provisionável — ler este skill, não usar `fixme`.

### D. NUNCA reusar token entre projetos diferentes

Cada projeto Twygo tem org própria. Token de `recertificacao` não vale em `widgets`. Cada projeto tem seu próprio `API_TOKEN` (ou seu próprio OAuth credentials).

### E. NUNCA logar o token em console/output

```ts
console.log('Headers:', authHeaders);  // ❌ vaza token em log
```

Logs vão para `outputs/<slug>/playwright-summary.md` que pode acabar em
PR/screenshot/CI. Use apenas `authHeaders.Authorization?.slice(0, 20) + '...'`
se precisar debug.

## Implementação do helper (referência — fica em `src/utils/api-auth.ts`)

Forma esperada (assinatura, não implementação completa — a implementação
acompanha Fase 4 do plano de integração v1.2):

```ts
export async function getApiAuthHeaders(): Promise<Record<string, string>> {
  // 1. Lê API_AUTH_MODE (default: 'fixed_token')
  // 2. Cache hit? retorna
  // 3. Dispatcha:
  //    - fixed_token: monta header com API_TOKEN
  //    - oauth_password: POST /oauth/token, extrai access_token
  //    - super_admin_generated: throw 'not implemented'
  // 4. Cacheia e retorna
}
```

## Referências

- [agent-playwright/.env.example](../../../.env.example) — variáveis necessárias
- Skill principal: [`testar-api-twygo`](../testar-api-twygo/SKILL.md)
- Skill irmã: [`validar-schema-api-twygo`](../validar-schema-api-twygo/SKILL.md)
- Padrão de auth no monorepo: [`shared/twygo-platform.md §2`](../../../../shared/twygo-platform.md)
