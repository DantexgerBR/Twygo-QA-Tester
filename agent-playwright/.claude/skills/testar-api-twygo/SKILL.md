---
name: testar-api-twygo
description: Como testar endpoints REST/GraphQL Twygo a partir do agent-playwright usando `request` fixture (sem browser). Cobre quando usar request fixture vs `page.evaluate` (helper `src/utils/api.ts`), organização canônica de `tests/api/` + `api/` (clientes HTTP estilo POM) + `schemas/` (JSON Schemas Ajv), padrão de spec, combinação com playbooks UI (Flipper, Super Admin) no setup, idempotência via emails únicos por run, naming e anti-patterns. Use sempre que TC tem `**Tipo**: api` no MD canônico, OU quando spec novo precisar disparar request HTTP cru com schema validation. Patterns validados live em 2026-05-28 contra recertificacao-testeqa.stage.twygoead.com (CONTRACT.md §16, v1.2).
version: 1.1.0
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

export interface AttendeeParticipant {
  email: string;
  first_name?: string;
  last_name?: string;
  cpf?: string;
  status?: string;
  /** Projeto Recertificação — feature ativa em 2026-05-28. Backend exige
   *  que user esteja APROVADO numa inscrição prévia para recertificar. */
  recertification?: boolean;
}

export interface AttendeesCreatePayload {
  participants: AttendeeParticipant[];
  /** Global — aplica TODOS os participants a TODOS os content_ids (cartesiano). */
  content_ids: number[];
}

export class EventsApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async createAttendees(
    payload: AttendeesCreatePayload,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.request.post('/api/v2/attendees', {
      data: payload,
      headers,
    });
  }
}
```

**Por que cliente (não chamada direta no spec)**:
- Endpoint muda 1× → atualizar 1 arquivo, não N specs
- Payload shape tipada via TypeScript catch erro antes do runtime
- Permite reuso entre TCs sem duplicar URL

## Anatomia de um spec — pattern validado live 2026-05-28

```ts
// projects/recertificacao/tests/api/reinscricao-via-api-v2.spec.ts
import { test, expect } from '@playwright/test';
import { EventsApiClient, type AttendeesCreateResponseBody, type AttendeesCreatePayload } from '../../api/EventsApiClient.js';
import { getApiAuthHeaders } from '../../../../src/utils/api-auth.js';
import { validateAgainstSchema } from '../../../../src/utils/schema.js';
import attendeesResponseSchema from '../../schemas/attendees-create-response.schema.json' with { type: 'json' };
import { reinscricaoV2Data as data } from './reinscricao-via-api-v2.data.js';
import { fixedSeed } from '../../data/fixed-seed.data.js';

/**
 * Gera email único por run para TCs idempotentes — pattern
 * `<base>-w<workerIndex>-<timestamp>@example.com`. Evita state pollution
 * em staging entre runs.
 */
function withUniqueEmail(payload: AttendeesCreatePayload, workerIndex: number): AttendeesCreatePayload {
  const ts = Date.now();
  return {
    ...payload,
    participants: payload.participants.map(p => ({
      ...p,
      email: p.email.replace('@', `-w${workerIndex}-${ts}@`),
    })),
  };
}

test.describe('Reinscrição via API V2', () => {
  // authHeaders pode ser cached no describe (Record<string,string>, sem
  // estado de Playwright fixture). client precisa ser criado POR TEST —
  // `request` fixture de `beforeAll` tem escopo DIFERENTE de `test()`.
  // Tentar reusar dá erro: "apiRequestContext.post: Fixture { request } from
  // beforeAll cannot be reused in a test."
  let authHeaders: Record<string, string>;

  test.beforeAll(async () => {
    authHeaders = await getApiAuthHeaders();
  });

  test('TC1 — POST /api/v2/attendees com recertification=true responde 200', async ({ request }, testInfo) => {
    const client = new EventsApiClient(request);
    const payload = withUniqueEmail(data.payloadTC1, testInfo.workerIndex);
    const response = await client.createAttendees(payload, authHeaders);

    expect(response.status()).toBe(200);

    const body = await response.json();
    validateAgainstSchema<AttendeesCreateResponseBody>(body, attendeesResponseSchema, 'POST /api/v2/attendees (TC1)');

    const contentIdKey = String(fixedSeed.cursoComRecertificacaoEventId);
    const successList = body.participants.success?.[contentIdKey] ?? [];
    expect(successList).toHaveLength(1);
    expect(successList[0].email).toBe(payload.participants[0].email);
  });
});
```

**Estrutura mínima de cada `test()`**:

1. Instanciar cliente DENTRO do test (`new EventsApiClient(request)` — fixture deste test)
2. Construir payload (com email único quando TC for idempotente)
3. Chamar método do `<Recurso>ApiClient` (não `request.*` direto)
4. Assertar `response.status()` (HTTP code esperado)
5. Validar body contra schema via `validateAgainstSchema(body, schema, context)`
6. Assertions semânticas adicionais (campos específicos, contagens, mensagens de erro)

## Idempotência — pattern obrigatório para TCs que criam estado

Staging é compartilhado e persistente. Spec que cria attendee com email fixo
funciona na 1ª run mas falha em re-runs (backend rejeita email duplicado).

**Solução canônica**: helper `withUniqueEmail()` (acima) que injeta
`workerIndex + timestamp` no email antes do `@`.

```ts
// Email base no .data.ts: 'rec-v2-tc1@example.com'
// Após withUniqueEmail: 'rec-v2-tc1-w0-1748401200000@example.com'
```

**Quando NÃO usar emails únicos**: TC que TESTA reuso (ex: "tentar criar duplicado retorna 422", ou "user já inscrito mas não aprovado não recertifica"). Aí o email DEVE ser estático e o user precisa existir antes (criado por TC anterior ou seed inicial).

## Resposta multi-status — entender o shape real

API V2 attendees retorna shape COMPLEXA (validada live 2026-05-28):

```ts
{
  participants: {
    success?: {
      [content_id: string]: Array<{ email: string; cpf?: string }>
    },
    error?: {
      [content_id: string]: Array<{ email: string; cpf?: string | null; error?: string[] }>
    }
  },
  errors: string | Array<{ line: number; errors: string[] }>
}
```

- **200**: todos sucessos → `participants.success[<id>]` populado, `participants.error` ausente, `errors: []`
- **400**: payload estrutural inválido → `errors: "string descritiva"`
- **422**: validation por item (ex: user não aprovado em recertificação) → `participants.error[<id>]` populado com mensagens

**Asserção típica de sucesso**:
```ts
const contentIdKey = String(eventId);
const successList = body.participants.success?.[contentIdKey] ?? [];
expect(successList).toHaveLength(N);
```

**Asserção típica de erro 422 (regra de negócio)**:
```ts
expect(response.status()).toBe(422);
const errorList = body.participants.error?.[contentIdKey] ?? [];
const allMessages = errorList.flatMap(e => e.error ?? []).join(' ');
expect(allMessages.toLowerCase()).toContain('mensagem esperada');
```

## Dados por teste — convenção idêntica à UI

Reaproveitamos `<test-case>.data.ts` ao lado do spec (§3.1 do CLAUDE.md):

```ts
// projects/recertificacao/tests/api/reinscricao-via-api-v2.data.ts
import { fixedSeed } from '../../data/fixed-seed.data.js';
import type { AttendeesCreatePayload } from '../../api/EventsApiClient.js';

export const reinscricaoV2Data = {
  payloadTC1: {
    participants: [{
      email: fixedSeed.alunoReinscricaoEmail,
      first_name: 'Aluno',
      last_name: 'TC1',
      status: '1',
      recertification: true,
    }],
    content_ids: [fixedSeed.cursoComRecertificacaoEventId],
  } satisfies AttendeesCreatePayload,
} as const;
```

**Anti-pattern: hardcode de payload no spec.** Mesma regra do anti-pattern E
do §7.6 — payload é constante de domínio, vai em `.data.ts`.

## Setup que envolve UI (Flipper, Super Admin, contrato)

TCs API Twygo frequentemente exigem setup UI antes do request — ex: ligar
feature flag Flipper. Setup roda no `beforeAll` usando helpers canônicos
(`ensureFlipperActor`) com `chromium.launch()` manual — `--project api`
não tem device de browser.

```ts
import { test, expect, chromium, type Browser } from '@playwright/test';
import { ensureFlipperActor } from '../../../../src/utils/flipperFlag.js';
import { resolve } from 'node:path';

test.describe('TC4 — Com flag OFF', () => {
  let browser: Browser;
  let revertFlipper: () => Promise<void>;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    revertFlipper = await ensureFlipperActor(browser, {
      envName: 'staging-recertificacao',
      storageStatePath: resolve(process.cwd(), 'outputs/.auth/storage.json'),
      flag: 'recertificacao',
      actor: `Organization;${fixedSeed.principalOrgId}`,
      enabled: false,
    });
  });

  test.afterAll(async () => {
    await revertFlipper();
    await browser.close();
  });

  test('payload com recertification:true é processado sem erro de flag', async ({ request }, testInfo) => {
    const client = new EventsApiClient(request);
    // ... usar withUniqueEmail + asserções
  });
});
```

**Por que `chromium.launch()` manual**: o projeto `api` do `playwright.config.ts`
não tem device de browser. Setup UI no mesmo spec instancia browser
manualmente. Custo: ~3s no setup, pago 1× para toda a suite (não por TC).

## Schema validation — ver skill irmã

Detalhe completo em
[`validar-schema-api-twygo`](../validar-schema-api-twygo/SKILL.md):
organização de `schemas/`, naming, como gerar a partir de exemplo,
pretty errors.

## Auth — ver skill irmã

Provisionar token (fixed_token / oauth_password / super_admin_generated)
e helper `getApiAuthHeaders()` documentados em
[`provisionar-token-api-twygo`](../provisionar-token-api-twygo/SKILL.md).

## Naming canônico

| Coisa | Convenção | Exemplo |
|---|---|---|
| Arquivo de spec | `<suite-slug>.spec.ts` (kebab-case) | `reinscricao-via-api-v2.spec.ts` |
| Arquivo de data | `<spec-slug>.data.ts` ao lado do spec | `reinscricao-via-api-v2.data.ts` |
| Cliente HTTP | `<Recurso>ApiClient.ts` (PascalCase + sufixo) | `EventsApiClient.ts` |
| Schema | `<recurso>-<acao>-response.schema.json` | `attendees-create-response.schema.json` |
| Email de teste | `<sigla-suite>-tc<N>@example.com` (curto, suite-tied) | `rec-v2-tc1@example.com` |
| Título `test.describe` | Nome da suite literal do MD canônico | `'Reinscrição via API V2'` |
| Título `test()` | `'TC<N> — <título do TC do MD>'` | `'TC1 — POST /api/v2/attendees com recertification=true responde 200'` |

## Anti-patterns

### A. NUNCA misturar ações UI e requests HTTP num mesmo TC

Regra dura #14. Se o AT descreve "fazer request E navegar para lista de
aprendizagem", **separar em 2 TCs** no MD (`Tipo: ui` + `Tipo: api`).

❌ **Errado**:
```ts
test('TC1', async ({ page, request }) => {
  const response = await request.post('/api/v2/attendees', { data: payload });
  await page.goto('/learning_students');  // UI no mesmo TC — proibido
  await expect(page.getByText('aluno1@example.com')).toBeVisible();
});
```

✅ **Certo**: 2 TCs — TC1a (API: request + schema) + TC1b (UI: navegar e validar render).

### B. NUNCA pular schema validation

Regra dura #15. Asserção `expect(response.status()).toBe(200)` sozinha
permite que o backend devolva campo errado ou shape inválido sem o
teste detectar.

✅ **Certo**:
```ts
const response = await client.createAttendees(payload, headers);
expect(response.status()).toBe(200);
const body = await response.json();
validateAgainstSchema<AttendeesCreateResponseBody>(body, schema, 'POST /attendees');
```

### C. NUNCA fazer `request.post()` direto no spec

Regra dura #16. Sempre via `<Recurso>ApiClient`.

### D. NUNCA hardcodar token/credenciais

Token vem da fixture `authHeaders` (skill `provisionar-token-api-twygo`).
NUNCA literal no spec ou `.data.ts`.

### E. NUNCA usar `additionalProperties: false` nos schemas

Backend evolui adicionando campos. Schema com `additionalProperties: false`
quebra a cada release. Use `additionalProperties: true` (default).

### F. NUNCA criar/alterar estado sem cleanup OU email único

2 caminhos válidos:
1. **Idempotência por email único**: `withUniqueEmail()` (recomendado para TCs simples)
2. **Cleanup explícito**: `afterAll` que deleta o que foi criado (skill `limpar-dados-de-teste-twygo`)

Anti-pattern: usar email estático sem cleanup — funciona na 1ª run, falha em re-runs com 422 "já inscrito".

### G. NUNCA marcar `test.fixme(true, 'token não obtido')`

Provisionar token é skill canônica. Se você não soube como gerar token
em staging, ler [`provisionar-token-api-twygo`](../provisionar-token-api-twygo/SKILL.md).
`fixme` por token é anti-pattern.

### H. NUNCA instanciar `<Recurso>ApiClient` em `beforeAll` e usar nos `test()`

Erro real visto em produção:

```
Error: apiRequestContext.post: Fixture { request } from beforeAll cannot
be reused in a test.
```

`request` fixture de `beforeAll` tem escopo diferente de `test()`. **Sempre**
instanciar client DENTRO do `test()` (ou via custom fixture worker-scoped).

❌ **Errado**:
```ts
test.beforeAll(async ({ request }) => {
  client = new EventsApiClient(request);  // PROIBIDO — vai falhar nos tests
});
```

✅ **Certo**:
```ts
test('TC1', async ({ request }) => {
  const client = new EventsApiClient(request);  // por test — funciona
});
```

## Execução

```bash
# Toda suite API do projeto ativo
npm run test:api

# Spec específico
npx playwright test --project api projects/recertificacao/tests/api/reinscricao-via-api-v2.spec.ts

# Filtrar TC específico
npx playwright test --project=api --grep "TC1|TC3"

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
- Helper schema: `agent-playwright/src/utils/schema.ts`
- Helper auth: `agent-playwright/src/utils/api-auth.ts`
- Spec piloto validado live: `agent-playwright/projects/recertificacao/tests/api/reinscricao-via-api-v2.spec.ts`
