---
name: safe-reload-twygo
description: Como recarregar página em specs Playwright Twygo sem cair em `TimeoutError: page.reload Timeout 30000ms exceeded`. O default do Playwright espera o evento `load`, e SPAs Twygo nunca disparam `load` porque trackers (Intercom, Segment, HubSpot/Sophia, Hotjar, GA/GTM, Sentry) mantêm websockets/long-polling abertos. Skill cobre o helper canônico `safeReload(page, opts)` análogo ao `safeGoto`, o padrão de 3 passos (domcontentloaded + asserção do que importa + bloqueio de trackers), quando bloquear via `page.route` e onde NÃO aplicar (specs de beforeunload, smoke do próprio Sophia). Use sempre que gerar/corrigir spec ou POM que chama `page.reload()`, ou diagnosticar timeout no reload de ~30s sem causa óbvia.
version: 1.0.0
---

# safe-reload-twygo

## Sintoma canônico

```
TimeoutError: page.reload Timeout 30000ms exceeded.
```

OU, quando o reload "passa" mas a próxima asserção timeout:

```
TimeoutError: locator.waitFor: Timeout 20000ms exceeded.
Call log:
  - waiting for getByTestId('knowledge-repositories-list-container') to be visible
```

E no snapshot do erro aparece `region "Widget de chat"` com `iframe`, ou network requests pendentes pra `intercom.io` / `hubspot` / `segment.io` / `googletagmanager.com`.

## Causa raiz

`page.reload()` default espera `waitUntil: 'load'`. O evento `load` só dispara quando **todas** as requisições da página completam — incluindo:

- **Intercom / HubSpot chat (Sophia)** — websocket `wss://...` aberto pra mensagens em tempo real
- **Segment / GA / GTM** — beacon de analytics + long-polling pra remote config
- **Hotjar** — gravação de sessão envia POST contínuo
- **Sentry** — fila de transações pendentes

Enquanto qualquer um desses fica pendurado, `load` nunca dispara, e `page.reload()` esgota o timeout. **Não é bug do app** — é design padrão dessas SDKs.

Auditoria 2026-05-24 do projeto `base-de-conhecimento` (suite Ambientes adicionais — isolamento) confirma o sintoma vivo: `KnowledgeRepositoryListPage.goToList` (`projects/base-de-conhecimento/pages/KnowledgeRepositoryListPage.ts:52`) cai no `waitFor` da `getListContainer` 20s, e o snapshot do erro tem o iframe da Sophia ativo na tela.

## Solução em 3 passos

### 1. Use `safeReload` (não `page.reload` direto)

Helper em `src/utils/modals.ts` análogo ao `safeGoto`:

```ts
import { safeReload } from '../../../src/utils/modals.js';

await safeReload(page);
```

Faz: `page.reload({ waitUntil: 'domcontentloaded' })` + retry transitório de `net::ERR_*` + `dismissCommonModals` no fim. Não espera tracker nenhum.

### 2. Espere o que **realmente importa** pro teste

DOM estar pronto não significa hidratação do React/Chakra completa. Após o reload, esperar o invariante concreto do cenário:

```ts
await safeReload(page);
await expect(page.getByRole('heading', { name: 'Repositórios' })).toBeVisible({ timeout: 60_000 });
```

Por que `60_000` em vez de default 30s: ver Princípio 2 da skill [`criar-spec-resiliente-twygo`](../criar-spec-resiliente-twygo/SKILL.md) — SPA Twygo hidrata tab/heading/breadcrumb **após** `domcontentloaded`, default 30s é frágil em runner sobrecarregado.

### 3. Bloqueie ruído de trackers quando a suíte chama reload várias vezes

Para POMs com retry de `goToList` (ex: `KnowledgeRepositoryListPage`) ou specs que dão F5 em loop (ex: validação de persistência), os trackers se acumulam em rede. Passe `blockTrackers: true`:

```ts
await safeReload(page, { blockTrackers: true });
```

Internamente registra (uma vez por page, idempotente) `page.route(TRACKER_URL_PATTERN, route => route.abort('blockedbyclient'))`. Padrão regex documentado em `modals.ts#TRACKER_URL_PATTERN`:

```
intercom | segment | hotjar | googletagmanager | google-analytics | hs-scripts | hs-banner | hubspot | sentry | heapanalytics
```

Alternativa: registrar uma vez por suíte em `beforeAll`:

```ts
import { blockTrackers } from '../../../src/utils/modals.js';

test.beforeEach(async ({ page }) => {
  await blockTrackers(page);
});
```

Útil quando vários `page.reload`/`page.goto` na mesma suíte sofrem do mesmo problema.

## Onde NÃO aplicar

| Cenário | Razão |
|---|---|
| Spec que valida o próprio **beforeunload dialog** (`page.reload()` em estado dirty deve **pendurar** até o dialog ser dismissado) | Documentado em [`testar-beforeunload-dialog-twygo`](../testar-beforeunload-dialog-twygo/SKILL.md). O `page.reload()` direto com `timeout: 5_000` + `.catch()` é o padrão correto ali |
| Smoke que **valida que Sophia/Intercom carrega** | Você precisa dos trackers carregando — não bloqueie |
| Spec que **valida pixel de analytics** (raramente em Twygo, mas listado por completude) | Mesma razão |
| Tests em `tests/auth/` testando o login em si | Geralmente não precisa reload; se precisar, fluxo é diferente |

## API completa de `safeReload`

```ts
export async function safeReload(
  page: Page,
  opts: {
    dismiss?: boolean;       // default true — roda dismissCommonModals pós-reload
    timeout?: number;        // default 30_000 — cap do page.reload
    blockTrackers?: boolean; // default false — registra page.route abortando trackers
  } = {},
): Promise<void>
```

## Tabela "Sintoma → Causa → Fix"

| Sintoma | Causa provável | Fix |
|---|---|---|
| `TimeoutError: page.reload Timeout 30000ms` | Tracker (Intercom/Sophia/Segment/etc) mantém websocket aberto → `load` nunca dispara | `safeReload(page)` |
| Reload passa mas próximo `waitFor` falha 20-30s | DOM carregou mas SPA Chakra/React não hidratou completamente | `safeReload(page)` + `waitFor({ timeout: 60_000 })` na asserção pós-reload |
| Reload passa intermitente (50% das runs) e falha as outras | Race com tracker + flakiness de rede + modal oportunista (NPS) | `safeReload(page, { blockTrackers: true })` — elimina o ruído |
| `page.reload()` em test de "alterações não salvas" fica pendurado e não dismissa modal | É **comportamento esperado** do beforeunload | NÃO usar `safeReload` aqui — ver `testar-beforeunload-dialog-twygo` |
| `getByTestId('X-list-container')` 20s timeout após reload | Container renderiza mas tbody hidrata depois — strict-mode entre placeholder e empty state | Após `safeReload`, `Promise.race([rows.first().waitFor(), emptyState.waitFor()])` |

## Anti-patterns

- ❌ `await page.reload()` direto em POM/spec (sem `safeReload`) — esgota 30s quando tracker segura `load`.
- ❌ `await page.reload({ waitUntil: 'networkidle' })` — pior ainda; `networkidle` exige 500ms sem rede e tracker derruba antes.
- ❌ `await page.reload({ waitUntil: 'domcontentloaded' })` inline sem `dismissCommonModals` — NPS Sofia volta após reload (cookie de inactivity reseta em algumas orgs) e o próximo `click` quebra.
- ❌ `page.route('**/*', handler)` global no spec interceptando TUDO — performance ruim e quebra navegação real. Sempre filtrar pelo padrão de tracker (`TRACKER_URL_PATTERN`).
- ❌ Registrar `page.route` no spec via callback novo a cada `beforeEach` sem `off` — vaza handlers. Use o helper `blockTrackers(page)` que é idempotente.
- ❌ `await page.waitForLoadState('load')` pós-reload pra "tentar esperar" — mesmo problema do default.

## Catálogo de retrofit (suite por suite)

Auditoria 2026-05-24 — call sites de `page.reload()` direto que devem migrar:

| Arquivo | Linha | Contexto |
|---|---|---|
| `projects/widgets/pages/PaineisListPage.ts` | 874 | Retry em `ensureMenuOption` quando cache de plan está stale — `blockTrackers: true` ajuda em runs longas |
| `projects/widgets/pages/PaineisListPage.ts` | 1242 | Reload pós-toggle de menu item — `safeReload(page)` direto |
| `projects/base-de-conhecimento/pages/KnowledgeRepositoryListPage.ts` | 63 | Retry de `goToList` quando container não aparece — `blockTrackers: true` recomendado (caso vivo do sintoma) |
| `projects/base-de-conhecimento/pages/KnowledgeRepositoryFormPage.ts` | 63, 96 | Retry de `goToNew`/`goToEdit` |
| `projects/widgets/tests/features/ativar-inativar-painel/verificar-persistencia-estado-ativo.spec.ts` | 93 | F5 validando persistência — `safeReload(page)` |
| `projects/widgets/tests/features/ativar-inativar-painel/inativar-painel-nao-associado.spec.ts` | 87 | F5 pós-inativação — `safeReload(page)` |
| `projects/widgets/tests/features/feature-flag/menu-padrao-com-flag-desabilitada.spec.ts` | 149 | Loop com `expect.toPass` + reload — `blockTrackers: true` no `beforeAll` |
| `projects/widgets/tests/features/layout-das-abas/salvar-layout-rodape.spec.ts` | 60 | F5 pós-salvar layout — `safeReload(page)` |
| `projects/widgets/tests/features/adicionar-editar-aba/modal-navegador-alteracoes-nao-salvas.spec.ts` | 70 | **NÃO MIGRAR** — valida beforeunload, comportamento esperado é pendurar |

Migração em PR separado: typecheck primeiro, suite por suite, validar localmente que o tempo médio de `goToList` cai.

## Helper irmão: `safeWaitForURL`

`page.waitForURL()` tem o **mesmo problema** do `page.reload()`: default
espera `waitUntil: 'load'`. Trackers seguram → 30s timeout mesmo com
redirect completo.

Caso clássico: `globalSetup` faz login + `page.waitForURL(url => !url.pathname.startsWith('/users/login'))`.
Sem `safeWaitForURL`, falha com `page.waitForURL: Timeout 30000ms exceeded`
em envs onde HubSpot/Sophia inicia imediatamente após login (ex:
`staging-without-credits`).

```ts
import { safeWaitForURL } from '../../src/utils/modals.js';

await Promise.all([
  safeWaitForURL(page, (url) => !url.pathname.startsWith('/users/login'), { timeout: 30_000 }),
  loginButton.click(),
]);
```

API:

```ts
export async function safeWaitForURL(
  page: Page,
  url: string | RegExp | ((url: URL) => boolean),
  opts: { timeout?: number } = {},
): Promise<void>
```

Internamente: `page.waitForURL(url, { waitUntil: 'domcontentloaded', timeout })`.

**Onde aplicar**:
- `tests/setup/global-setup.ts` — pós-login no flow de gravação de storageState
- `src/pages/LoginPage.ts` — pós-submit do form de login
- Specs em `tests/auth/` que validam o redirect pós-login
- Qualquer Page Object que faça `Promise.all([waitForURL, click])`
- Troca de perfil (`ProfileSwitcher`) e outros redirects client-side

## Skills relacionadas

- [`criar-spec-resiliente-twygo`](../criar-spec-resiliente-twygo/SKILL.md)
  — Princípio 2 (timeouts pós-hydration) e 3 (retry no safeGoto). Esta
  skill é o análogo pro `page.reload`.
- [`fechar-modais-twygo`](../fechar-modais-twygo/SKILL.md) — `dismissCommonModals` que o `safeReload` chama internamente. NPS Sofia pode reaparecer após reload.
- [`debugar-via-network-e-console`](../debugar-via-network-e-console/SKILL.md)
  — quando `safeReload` ainda não resolve, abrir Network revela qual
  tracker ficou pendurado e estender `TRACKER_URL_PATTERN`.
- [`testar-beforeunload-dialog-twygo`](../testar-beforeunload-dialog-twygo/SKILL.md)
  — exceção dura: `safeReload` NÃO se aplica em test de beforeunload.
