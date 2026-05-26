---
name: testar-ambientes-adicionais-twygo
description: Como testar funcionalidades Twygo em "ambientes adicionais" — env multi-tenant pareado a um principal. Cobre semântica (orgs separadas mas contrato compartilhado), config (subscription_plans editáveis APENAS via orgId do principal), feature flags por env, storage state pareado (`-aditional`), padrão de teste de isolamento de dados, e POM com `orgIdOverride`. Use sempre que XML descrever "ambiente adicional" ou suite mencionar isolamento entre tenants pareados.
version: 1.0.0
---

# testar-ambientes-adicionais-twygo

## Semântica Twygo

"Ambiente adicional" é uma **org separada** (orgId distinto, host distinto)
**pareada** a uma org principal. NÃO é multi-env dentro da mesma org.

Características operacionais:

| Aspecto | Comportamento |
|---|---|
| `orgId` | Distinto do principal — outra org de fato |
| Host (subdomínio) | Distinto do principal (ex.: `widgets.stage.*` ↔ `adicionalwidgets.stage.*`) |
| Contrato / Subscription plan | **Compartilhado** — config feita SOMENTE via `/admin/edit_sys_subscription_settings/{principalOrgId}`. Rota com orgId do adicional NÃO permite editar |
| Feature flag (rollout actor) | **Por env** — precisa habilitar separadamente no adicional (full enabled OU actors específicos) |
| Usuários | Distintos (cada env tem credenciais próprias em `.env`) |
| Storage state Playwright | Pareado: `outputs/.auth/storage-aditional.json` separado de `storage.json` |
| Listagens (painéis, modos uso) | **Isoladas** — painel criado no principal NÃO aparece no adicional |

Pareamento por sufixo: `staging-widgets` (principal) ↔ `staging-widgets-aditional` (adicional).

## Catálogo de envs adicionais

| Principal | Adicional |
|---|---|
| `staging-widgets` | `staging-widgets-aditional` |

> orgIds resolvidos em runtime via `getEnvByName(<slug>).orgId` (valores em `.env`).

> Novos pareamentos: adicionar entry com sufixo `-aditional` em `config/environment.json` + credenciais/orgIds em `.env` (variáveis `TWYGO_<PRINCIPAL>_ADITIONAL_*`).

## Storage state — padrão canônico

`global-setup.ts` detecta automaticamente env adicional pareado e gera storage dedicado:

```
outputs/.auth/storage-aditional.json
```

Exportado como `ADITIONAL_STORAGE_PATH` em `tests/setup/global-setup.ts`.
Specs consomem via:

```ts
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import { ADITIONAL_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { getEnvByName } from '../../../../../src/utils/environment.js';

const aditional = getEnvByName('staging-widgets-aditional');
const aditionalOrgId = aditional.orgId!;

test.describe('Suite', () => {
  test.use({
    storageState: ADITIONAL_STORAGE_PATH,
    baseURL: aditional.baseUrl,
  });

  test('...', async ({ page }) => { /* ... */ });
});
```

> **Importante**: `baseURL` precisa ser sobrescrito porque o env adicional
> tem host distinto. Sem isso, requests vão pro host do principal.

## POM com `orgIdOverride`

`PaineisListPage` e `PainelFormPage` aceitam `orgIdOverride` opcional no
constructor. Quando ausente, fallback é `getOrgId()` (org do `project.config`).
Quando presente, força paths `/o/{X}/...` com o orgId fornecido.

```ts
// Spec no env adicional:
const paineis = new PaineisListPage(page, aditionalOrgId);  // orgId do adicional

await paineis.goToList();           // GET /o/{aditionalOrgId}/use_modes?tab=panels-tab
await paineis.createPanel({ ... }); // POST /o/{aditionalOrgId}/panels
```

Especs no env principal (uso default — sem override):
```ts
const paineis = new PaineisListPage(page);  // usa getOrgId() — orgId do env principal
```

> **Backward compat**: constructor com 1 arg continua funcionando. Mudança
> não-quebra-existentes.

## Cenários canônicos da suíte "Ambientes adicionais"

### TC1 — Funcionalidade disponível no adicional
Valida que o feature flag está habilitado no adicional e a aba/módulo renderiza.

```ts
test.use({
  storageState: ADITIONAL_STORAGE_PATH,
  baseURL: aditional.baseUrl,
});

test('Funcionalidade disponível em ambiente adicional', async ({ page }) => {
  const paineis = new PaineisListPage(page, aditionalOrgId);
  await paineis.goToList();
  await expect(paineis.getPaineisTab()).toBeVisible();
});
```

### TC2 — Isolamento de dados (principal → adicional)
Pré-condição: criar painel no principal. Validar ausência no adicional.

Padrão: 2 contextos no mesmo spec — um no principal (storage default), outro no adicional (`ADITIONAL_STORAGE_PATH`).

```ts
import { STORAGE_PATH } from '...'; // ou usar a global padrão via project default

test('Painel do principal não aparece no adicional', async ({ browser, step }) => {
  const panelName = `Painel Principal TC2 w${testInfo.workerIndex}-${Date.now()}`;

  // 1. Cria no principal (org do env staging-widgets)
  const principalCtx = await browser.newContext({
    storageState: 'outputs/.auth/storage.json',
    baseURL: principal.baseUrl,
  });
  const principalPage = await principalCtx.newPage();
  const paineisPrincipal = new PaineisListPage(principalPage); // sem override
  await paineisPrincipal.goToList();
  await paineisPrincipal.createPanel({ name: panelName });
  await principalCtx.close();

  // 2. Verifica AUSÊNCIA no adicional (org 37002, host adicionalwidgets.stage.*)
  const aditionalCtx = await browser.newContext({
    storageState: ADITIONAL_STORAGE_PATH,
    baseURL: aditional.baseUrl,
  });
  const aditionalPage = await aditionalCtx.newPage();
  const paineisAditional = new PaineisListPage(aditionalPage, aditionalOrgId);
  await paineisAditional.goToList();
  await expect(paineisAditional.getRowByItemName(panelName)).toHaveCount(0);
  await aditionalCtx.close();
});

test.afterAll(async ({ browser }) => {
  // Cleanup no PRINCIPAL — painel criado lá. Skill `limpar-dados-de-teste-twygo`.
  const ctx = await browser.newContext({
    storageState: 'outputs/.auth/storage.json',
    baseURL: principal.baseUrl,
  });
  const page = await ctx.newPage();
  const paineis = new PaineisListPage(page);
  await paineis.goToList();
  await paineis.deletePanelByNameSafe(panelName);
  await ctx.close();
});
```

### TC3 — Modo de uso adicional usa painel local
Cria painel no adicional, valida dropdown 'Espaço' em form de modo-uso lista APENAS painéis do adicional.

```ts
test.use({
  storageState: ADITIONAL_STORAGE_PATH,
  baseURL: aditional.baseUrl,
});

test('Modo uso adicional usa painel local', async ({ page }) => {
  const panelName = `Painel Local TC3 w${workerIndex}-${Date.now()}`;
  const paineis = new PaineisListPage(page, aditionalOrgId);

  // Setup: criar painel no adicional
  await paineis.goToList();
  await paineis.createPanel({ name: panelName });

  // Asserção: dropdown Espaço do form de modo-uso lista o painel criado
  await page.goto(`/o/${aditionalOrgId}/use_modes/${useModeId}/use_mode_itens/new`);
  await paineis.getMenuItemPageModelSelect().selectOption('user_panels');
  await paineis.getMenuItemPanelChooser().click();
  const optionTexts = await page
    .locator('[id^="react-select-"][id*="-option-"]')
    .allTextContents();
  expect(optionTexts).toContain(panelName);
});

test.afterAll(async () => {
  // Cleanup no adicional (mesmo contexto storage)
  // ...usar contexto novo conforme limpar-dados-de-teste-twygo
});
```

## Anti-patterns

### ❌ Esquecer `baseURL` no `test.use`
Sem `baseURL`, request vai pro host do principal mesmo com storage adicional. Sintoma: spec passa storage mas todos `page.goto` resolvem pro env errado.

### ❌ Usar `getOrgId()` direto em spec adicional
`getOrgId()` puxa do `project.config.json` (principal). Em spec adicional precisa `getEnvByName('staging-widgets-aditional').orgId`. Ver Anti-pattern B do CLAUDE.md (não hardcodar, mas USAR HELPER CERTO).

### ❌ Reusar mesma `page`/`context` pra principal + adicional
Storage e baseURL são fixos por context. Em testes cross-env (TC2), criar 2 `browser.newContext()` distintos é obrigatório.

### ❌ Tentar editar subscription_plans com orgId do adicional
A rota `/admin/edit_sys_subscription_settings/{aditionalOrgId}` existe mas NÃO permite editar. Específico: contrato é compartilhado e config é feita no principal apenas. Se spec precisa habilitar/desabilitar feature por contrato, usa orgId do principal.

### ❌ Cleanup sem trocar contexto
Painel criado no principal precisa ser deletado no principal. Painel criado no adicional, no adicional. `afterAll` deve criar contexto fresco apropriado a CADA cleanup — ver `limpar-dados-de-teste-twygo`.

## Quando NÃO usar este padrão

- Spec só valida feature flag desligada → use `SECONDARY_STORAGE_PATH` + sufixo `-disabled`. Cenário distinto (bloqueio, não multi-tenant).
- Spec roda só no env principal → constructor sem override, storage default. Padrão regular.
- Spec valida config de contrato → roda no Super Admin do principal (`/admin/edit_sys_subscription_settings/{principalOrgId}`).

## Validações operacionais antes de gerar spec novo

1. Env adicional declarado em `config/environment.json`? (sufixo `-aditional`)
2. Credenciais em `.env`? (`TWYGO_<NAME>_EMAIL`/`_PASSWORD`)
3. Feature flag habilitada manualmente no env adicional? (DevOps/QA Lead)
4. `global-setup` gera `storage-aditional.json` na primeira run? Confirma com `ls outputs/.auth/`.
5. Para TC com setup no principal: revisar afterAll com 2 contextos.

## Referências

- `agent-playwright/tests/setup/global-setup.ts` — implementa pareamento sufixo `-aditional`.
- `agent-playwright/projects/widgets/pages/PaineisListPage.ts` — POM com `orgIdOverride`.
- Skill [[limpar-dados-de-teste-twygo]] — cleanup com 2 contextos em testes cross-env.
- CLAUDE.md §7.5 (ambientes em environment.json) e §7.6 anti-patterns.
