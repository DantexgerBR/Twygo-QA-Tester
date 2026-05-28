---
name: testar-api-twygo
description: Como testar endpoints REST/GraphQL Twygo a partir do agent-playwright usando `request` fixture (sem browser). Cobre quando usar request fixture vs `page.evaluate` (helper `src/utils/api.ts`), organização canônica de `tests/api/` + `api/` (clientes HTTP estilo POM) + `schemas/` (JSON Schemas Ajv), padrão de spec, combinação com playbooks UI (Flipper, Super Admin) no setup, naming e anti-patterns. Use sempre que TC tem `**Tipo**: api` no MD canônico, OU quando spec novo precisar disparar request HTTP cru com schema validation. Decorrente da consolidação API no agent-playwright (CONTRACT.md §16, v1.2).
version: 1.0.0
---

# testar-api-twygo

## Semântica Twygo

A partir de **CONTRACT.md v1.2 (2026-05-27)**, o `agent-playwright` é o
executor único de testes UI **e** API. TCs marcados `**Tipo**: api` no MD
canônico são implementados como specs Playwright em `tests/api/`,
rodados via `--project api` (sem browser).

Existem **dois cenários** de chamada HTTP no agent-playwright. NÃO confundir:

| Cenário | Onde vive | Ferramenta | Quando |
|---|---|---|---|
| **Spec de API** (este skill) | `tests/api/<suite>.spec.ts` | `request` fixture do Playwright + Ajv | TC `Tipo: api` — o endpoint É o objeto do teste |
| **Seed/cleanup via API em spec UI** | `tests/features/<suite>/<tc>.spec.ts` | Helper `twygoApiCall()` em `src/utils/api.ts` (via `page.evaluate` + cookie de sessão) | Cria/limpa estado pré-condição de TC UI rápido (bulk 10 itens em 3s vs 5min via form) |

Este skill cobre o **primeiro cenário**. Para o segundo, ler `src/utils/api.ts`.

## Estrutura canônica

```
agent-playwright/projects/<slug>/
├── tests/
│   ├── features/<suite>/         # specs UI — TCs Tipo: ui (já existente)
│   └── api/                      # NOVO em v1.2 — specs API — TCs Tipo: api
│       └── <suite-slug>.spec.ts  # 1 arquivo por suite
├── api/                          # clientes HTTP (estilo POM, mas REST/GraphQL)
│   └── <Recurso>ApiClient.ts     # ex: EventsApiClient.ts, UsersApiClient.ts
├── schemas/                      # JSON Schemas (draft-2020-12)
│   └── <recurso>-<acao>-response.schema.json
└── pages/                        # POMs UI — usados em setup quando playbooks UI exigem
```

**Regra dura #16 (agent-playwright/CLAUDE.md)**: specs em `tests/api/`
**chamam métodos do cliente em `api/`**, NUNCA `request.post()` direto.
Mesmo princípio do POM aplicado a UI (§2.4).

## Anatomia de um API Client

Estilo POM para HTTP. Concentra construção de URL + headers + payload shape.
Não faz asserts — devolve `APIResponse` cru.

```ts
// projects/recertificacao/api/EventsApiClient.ts
import type { APIRequestContext, APIResponse } from '@playwright/test';

export interface MassEnrollmentPayload {
  participants: Array<{
    email: string;
    event_id: number;
    recertification?: boolean;
  }>;
}

export class EventsApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async createMassEnrollment(
    payload: MassEnrollmentPayload,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.request.post('/api/v2/users/mass', {
      data: payload,
      headers,
    });
  }

  async getEventParticipants(
    eventId: number,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.request.get(`/api/v2/events/${eventId}/participants`, {
      headers,
    });
  }
}
```

**Por que cliente (não chamada direta no spec)**:
- Endpoint muda 1× → atualizar 1 arquivo, não N specs
- Payload shape tipada via TypeScript catch erro antes do runtime
- Permite reuso entre TC2 (happy path) e TC3 (regression) sem duplicar URL

## Anatomia de um spec

```ts
// projects/recertificacao/tests/api/reinscricao-via-api-v2.spec.ts
import { test, expect } from '@playwright/test';
import { EventsApiClient } from '../../api/EventsApiClient';
import { getApiAuthHeaders } from '../../../../src/utils/api-auth';
import { validateAgainstSchema } from '../../../../src/utils/schema';
import massEnrollmentSchema from '../../schemas/mass-enrollment-response.schema.json';
import { reinscricaoV2Data as data } from './reinscricao-via-api-v2.data';

test.describe('Reinscrição via API V2', () => {
  let client: EventsApiClient;
  let authHeaders: Record<string, string>;

  test.beforeAll(async ({ request }) => {
    client = new EventsApiClient(request);
    authHeaders = await getApiAuthHeaders(); // ver skill provisionar-token-api-twygo
  });

  test('TC1 — POST /users/mass com recertification cria participants reinscritos', async () => {
    const response = await client.createMassEnrollment(data.payloadTC1, authHeaders);

    expect([200, 207]).toContain(response.status());

    const body = await response.json();
    validateAgainstSchema(body, massEnrollmentSchema, 'POST /users/mass');

    expect(body.data.results).toHaveLength(1);
    expect(body.data.results[0].status).toBe('success');
  });
});
```

**Estrutura mínima de cada `test()`**:

1. Chamar método do `<Recurso>ApiClient` (não `request.*` direto)
2. Assertar `response.status()` (HTTP code esperado)
3. Validar body contra schema via `validateAgainstSchema(body, schema, context)`
4. Assertions semânticas adicionais (campos específicos, contagens)

## Dados por teste — convenção idêntica à UI

Reaproveitamos `<test-case>.data.ts` ao lado do spec (§3.1 do CLAUDE.md):

```ts
// projects/recertificacao/tests/api/reinscricao-via-api-v2.data.ts
export const reinscricaoV2Data = {
  payloadTC1: {
    participants: [
      { email: 'aluno1@example.com', event_id: 12345, recertification: true },
    ],
  },
  payloadTC2_misto: {
    participants: [
      { email: 'aluno_valido@example.com', event_id: 12345, recertification: true },
      { email: 'aluno_invalido@example.com', event_id: 67890, recertification: true },
    ],
  },
} as const;
```

**Anti-pattern: hardcode de payload no spec.** Mesma regra do anti-pattern E
do §7.6 — payload é constante de domínio, vai em `.data.ts`.

## Setup que envolve UI (Flipper, Super Admin, contrato)

TCs API Twygo frequentemente exigem setup UI antes do request — ex: ligar
feature flag Flipper, alterar contrato via Super Admin. Esse setup roda
no `beforeAll` usando POMs canônicos de `pages/`, dentro do MESMO spec
de API. Não é violação da regra "UI+API separados" (regra dura #14) — o
SETUP/CLEANUP pode tocar UI; o que não pode é o teste em si misturar
ações UI e HTTP no `test()`.

```ts
import { test, expect, chromium } from '@playwright/test';
import { FlipperAdminPage } from '../../../../src/pages/FlipperAdminPage';
import { getOrgId } from '../../../../src/utils/environment';

test.describe('TC4 — Com flag OFF, parâmetro recertification é ignorado', () => {
  // Setup UI: ligar/desligar flag exige browser → instância manual
  test.beforeAll(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ storageState: 'outputs/.auth/storage.json' });
    const page = await context.newPage();
    const flipper = new FlipperAdminPage(page);
    await flipper.removeActor('recertificacao', `Organization;${getOrgId('staging-recertificacao')}`);
    await browser.close();
  });

  test.afterAll(async () => {
    // Revert obrigatório (skill limpar-dados-de-teste-twygo)
    const browser = await chromium.launch();
    const context = await browser.newContext({ storageState: 'outputs/.auth/storage.json' });
    const page = await context.newPage();
    const flipper = new FlipperAdminPage(page);
    await flipper.addActor('recertificacao', `Organization;${getOrgId('staging-recertificacao')}`);
    await browser.close();
  });

  test('payload com recertification:true é processado como inscrição normal', async ({ request }) => {
    const client = new EventsApiClient(request);
    const response = await client.createMassEnrollment(payload, authHeaders);
    expect(response.status()).toBe(200);
    // ... asserts
  });
});
```

**Por que `chromium.launch()` manual no setup**: o projeto `api` do
`playwright.config.ts` não tem device de browser. Para setup UI no
mesmo spec, instanciar browser manualmente. Custo: ~3s no setup,
pago 1× para toda a suite (não por TC).

**Alternativa quando setup UI é repetido**: extrair para `globalSetup` ou
fixture custom — futuro hardening, não fase 1.

## Schema validation — ver skill irmã

Detalhe completo em
[`validar-schema-api-twygo`](../validar-schema-api-twygo/SKILL.md):
organização de `schemas/`, naming, como gerar a partir de exemplo,
pretty errors.

## Auth — ver skill irmã

Provisionar token (fixed_token / oauth_password / super_admin_generated)
e fixture `authHeaders` documentados em
[`provisionar-token-api-twygo`](../provisionar-token-api-twygo/SKILL.md).

## Naming canônico

| Coisa | Convenção | Exemplo |
|---|---|---|
| Arquivo de spec | `<suite-slug>.spec.ts` (kebab-case) | `reinscricao-via-api-v2.spec.ts` |
| Arquivo de data | `<spec-slug>.data.ts` ao lado do spec | `reinscricao-via-api-v2.data.ts` |
| Cliente HTTP | `<Recurso>ApiClient.ts` (PascalCase + sufixo) | `EventsApiClient.ts` |
| Schema | `<recurso>-<acao>-response.schema.json` | `mass-enrollment-response.schema.json` |
| Título `test.describe` | Nome da suite literal do MD canônico | `'Reinscrição via API V2'` |
| Título `test()` | `'TC<N> — <título do TC do MD>'` | `'TC1 — POST /users/mass com recertification...'` |

## Anti-patterns

### A. NUNCA misturar ações UI e requests HTTP num mesmo TC

Regra dura #14. Se o AT descreve "fazer request E navegar para lista de
aprendizagem", **separar em 2 TCs** no MD (`Tipo: ui` + `Tipo: api`).

❌ **Errado**:
```ts
test('TC1', async ({ page, request }) => {
  const response = await request.post('/api/v2/users/mass', { data: payload });
  await page.goto('/learning_students');  // UI no mesmo TC — proibido
  await expect(page.getByText('aluno1@example.com')).toBeVisible();
});
```

✅ **Certo**: 2 TCs — TC1a (API: request + schema) + TC1b (UI: navegar e validar render).

### B. NUNCA pular schema validation

Regra dura #15. Asserção `expect(response.status()).toBe(200)` sozinha
permite que o backend devolva campo errado ou shape inválido sem o
teste detectar.

❌ **Errado**:
```ts
const response = await client.createMassEnrollment(payload, headers);
expect(response.status()).toBe(200);
// fim — body não foi validado
```

✅ **Certo**:
```ts
const response = await client.createMassEnrollment(payload, headers);
expect(response.status()).toBe(200);
const body = await response.json();
validateAgainstSchema(body, massEnrollmentSchema, 'POST /users/mass');
```

### C. NUNCA fazer `request.post()` direto no spec

Regra dura #16. Sempre via `<Recurso>ApiClient`.

❌ **Errado**:
```ts
test('TC1', async ({ request }) => {
  const response = await request.post('/api/v2/users/mass', { data: { /* ... */ } });
});
```

✅ **Certo**:
```ts
test('TC1', async () => {
  const response = await client.createMassEnrollment(data.payloadTC1, authHeaders);
});
```

### D. NUNCA hardcodar token/credenciais

Token vem da fixture `authHeaders` (skill `provisionar-token-api-twygo`).
NUNCA literal no spec ou `.data.ts`.

❌ **Errado**:
```ts
const authHeaders = { Authorization: 'Bearer eyJhbGciOi...' };  // PROIBIDO
```

✅ **Certo**:
```ts
const authHeaders = await getApiAuthHeaders();
```

### E. NUNCA usar `additionalProperties: false` nos schemas

Backend evolui adicionando campos. Schema com `additionalProperties: false`
quebra a cada release. Use `additionalProperties: true` (default) — valida
o que sabemos que precisa estar lá, tolera campos novos.

### F. NUNCA criar/alterar estado sem `afterAll` que limpa

Regra dura #13 + anti-pattern G do §7.6. Vale igual pra API: se TC criou
participants, `afterAll` deleta. Skill canônica:
[`limpar-dados-de-teste-twygo`](../limpar-dados-de-teste-twygo/SKILL.md).

### G. NUNCA marcar `test.fixme(true, 'token não obtido')`

Provisionar token é skill canônica. Se você não soube como gerar token
em staging, ler [`provisionar-token-api-twygo`](../provisionar-token-api-twygo/SKILL.md).
`fixme` por token é anti-pattern do incidente "seed inválido" extendido.

## Execução

```bash
# Toda suite API do projeto ativo
npm run test:api

# Spec específico
npx playwright test --project api projects/recertificacao/tests/api/reinscricao-via-api-v2.spec.ts

# Com env override (host de API diferente)
API_BASE_URL=https://eduapi-stage2.twygoead.com npm run test:api
```

## Referências

- [CONTRACT.md §16](../../../../CONTRACT.md) — Convenção v1.2
- [agent-playwright/CLAUDE.md §7 — regras duras 14-16](../../../CLAUDE.md)
- [Playwright API testing docs](https://playwright.dev/docs/api-testing)
- Skill irmã: [`provisionar-token-api-twygo`](../provisionar-token-api-twygo/SKILL.md)
- Skill irmã: [`validar-schema-api-twygo`](../validar-schema-api-twygo/SKILL.md)
- Skill complementar: [`limpar-dados-de-teste-twygo`](../limpar-dados-de-teste-twygo/SKILL.md)
- Helper: `agent-playwright/src/utils/schema.ts`
