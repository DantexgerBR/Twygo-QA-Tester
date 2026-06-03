---
name: testar-feature-flag-twygo
description: Como testar features Twygo gated por feature flag Flipper (`/admin/manage/features/<flag>`). Cobre toggle via Flipper-UI (Add/Remove actor `Organization;<orgId>`), helper POM `FlipperAdminPage` + utilitário `ensureFlipperActor`, padrão `beforeAll`/`afterAll` para setup reversível, pré-condição de user com flag elevada, e anti-patterns (Fully Enable / Disable / Delete proibidos — afetam todas as orgs). Use sempre que XML descrever transição de flag on↔off OU spec precisar habilitar/desabilitar feature em runtime, OU quando ver `fixme` "requer toggle runtime da flag" em spec existente.
when_to_use: |
  - XML/AT descreve transição de feature flag on↔off
  - Spec precisa habilitar/desabilitar feature Flipper em runtime
  - Existe `test.fixme` "requer toggle runtime da flag" no spec
  - Cenário requer ligar/desligar flag pra uma org específica
triggers:
  - "flipper"
  - "feature flag"
  - "/admin/manage/features"
  - "ensureFlipperActor"
  - "actor Organization"
  - "FlipperAdminPage"
  - "requer toggle runtime"
  - "Fully Enable"
version: 1.0.0
---

# testar-feature-flag-twygo

## Semântica Twygo

Twygo usa **Flipper** (gem Ruby `flipper-ui`) para gating de features. Cada
feature flag é controlada por uma página administrativa em
`/admin/manage/features/<flag>` que aceita 4 dimensões:

| Dimensão | Operação | Efeito |
|---|---|---|
| **Actors** | `Add an actor` / `Remove` | Habilita/desabilita para UMA org específica (`Organization;<orgId>`) |
| **Groups** | `Add a group` | Habilita por grupo predefinido (raro em Twygo) |
| **Percent of actors** | `Edit` (slider) | Rollout gradual por % do total de orgs |
| **Percent of time** | `Edit` (slider) | Rollout estatístico por % das requests |
| **Master switch** | `Fully Enable` / `Disable` | **PROIBIDO em teste** — afeta todas as orgs |
| **Danger Zone** | `Delete` | **PROIBIDO em teste** — remove a flag |

Para testes Twygo a única dimensão segura é **Actors** — adicionar/remover
`Organization;<orgId>` no escopo da org sob teste.

## Catálogo de flags conhecidas

| Flag | Domínio | Envs com flag ON (actor) | Envs com flag OFF |
|---|---|---|---|
| `paineis_do_usuario_beta_test` | Widgets / Painéis | `staging-widgets`, `staging`, demais staging principais | `staging-widgets-disabled` |

Adicione novas flags aqui quando descobrir (apenas slug de env, sem orgId).

## Pré-condição: user com flag de acesso elevado

`/admin/manage/features/...` não é acessível a users normais — exige flag
de acesso (atribuída por DBA / dev no servidor). Sintomas:

| Sintoma no recon | Causa |
|---|---|
| 404 "page doesn't exist" | User logado, sem flag elevada |
| Redirect para `/users/login` com "Para continuar, faça login" | User não existe nesse tenant |
| "Login ou senha inválidos" | Credencial errada para o tenant |
| Renderiza `paineis_do_usuario_beta_test // Features // Flipper` | ✅ user elevado, acesso OK |

**Convenção atual** (2026-05-15):
- `staging-widgets-disabled`: `claude@teste.com` (`SECONDARY_STORAGE_PATH`)
  tem flag elevada — usar esse storage para toggle nesse env.
- Outros envs: confirmar com QA Lead antes de usar — pode ser necessário
  pedir elevação no servidor.

Validar antes de criar spec novo:

```
# Logar no host alvo como o user candidato e abrir:
https://<host>/admin/manage/features/paineis_do_usuario_beta_test
```

Renderizou Flipper UI = OK. 404/redirect = pedir elevação.

## Gotchas Flipper v1.3 (descobertos em runs reais)

### 1. `<input type="submit">` NÃO é click-seguro via Playwright

Flipper-UI v1.3 renderiza submit como `<input type="submit" value="Add Actor">`,
não `<button>`. Click via `getByRole('button', { name: 'Add Actor' }).click()`
às vezes dispatcha request **sem payload completo** (POST chega 2xx mas
state NÃO persiste). Causa exata desconhecida — pode ser race entre
`fill` no input + submit nativo.

**Solução canônica**: submeter o form via `form.submit()` no contexto
do browser (`page.evaluate`). Reaproveita `authenticity_token` Rails CSRF
+ todos os hidden inputs. POMs `addActor`/`removeActor` deste agente
já fazem assim — não voltar pra click.

### 2. Cache propagation no Twygo (delay 2-30s)

Toggle Flipper grava DB imediato, mas Twygo lookup tem cache (Redis ou
ActiveSupport::Cache::MemoryStore por processo). Após `ensureFlipperActor`,
asserts no Twygo (ex `expect(paineis.getPaineisTab()).toBeVisible()`)
podem falhar nos primeiros segundos.

**Solução canônica**: envolver assert em `expect.toPass` com reload:

```ts
await expect(async () => {
  await safeGoto(page, `/o/${orgId}/use_modes`);
  await expect(paineis.getPaineisTab()).toBeVisible({ timeout: 5_000 });
}).toPass({ timeout: 60_000, intervals: [2_000, 3_000, 5_000] });
```

Sem isso, spec é flaky. Não tente `waitForTimeout` — `expect.toPass`
é o equivalente correto.

### 3. POST 2xx/3xx é confirmação SUFICIENTE de persistência

Flipper redirect-after-POST (303) reload é assíncrono e a página
re-render pode atrasar. Asserting `actorHeading.waitFor({ state: 'visible' })`
após POST adiciona flakiness sem ganho — backend já mudou. POMs
`addActor`/`removeActor` checam apenas response status; o re-render UI
é cosmético.

Se precisar confirmar persistência, faça **navegação fresca**
(`gotoFeature(flag)` de novo) e leia `isActorEnabled(actor)`. Não confie
na page atual pós-POST.

## Mecanismo Flipper Admin UI

Validado live 2026-05-15 em
`https://<host-do-env-disabled>/admin/manage/features/paineis_do_usuario_beta_test`:

```
heading h4 "paineis_do_usuario_beta_test"
text " Conditionally enabled"
heading h6 "Enabled for N actors"
button "Add an actor"  → revela:
  textbox "MODEL_NAME;ID"  (placeholder literal)
  button "Add Actor"       (exato, diferente do toggle)
  button "Cancel"
heading h6 "Organization;<orgId>"  + form com button "Remove"
heading h6 "Organization;<orgId>"  + form com button "Remove"
... (1 entry por org habilitada)
```

- **Add**: click toggle → fill `Organization;<orgId>` → click `Add Actor`
  → reload com novo heading + Remove + contador incrementa.
- **Remove**: click `Remove` adjacente ao heading → reload sem heading.
- **Sem dialog de confirmação** — Remove é imediato.
- **Estado é compartilhado entre runs E entre projetos** — toda spec que
  toca a flag DEVE reverter em `afterAll`.

## Padrão canônico — POM + helper

### 1. `FlipperAdminPage` (`src/pages/FlipperAdminPage.ts`)

Métodos relevantes:

```ts
const flipper = new FlipperAdminPage(page);
await flipper.gotoFeature('paineis_do_usuario_beta_test');

const isOn = await flipper.isActorEnabled('Organization;<orgIdAlvo>');  // boolean

// Idempotentes — retornam true se mudaram estado, false se já estava
const changed = await flipper.ensureActorEnabled('Organization;<orgIdAlvo>');
const changed = await flipper.ensureActorDisabled('Organization;<orgIdAlvo>');

// Não-idempotentes — usar só se você quer falhar em duplicata
await flipper.addActor('Organization;<orgIdAlvo>');
await flipper.removeActor('Organization;<orgIdAlvo>');
```

### 2. `ensureFlipperActor` (`src/utils/flipperFlag.ts`)

Garante estado + retorna `revert` callback. Idempotente: se já estava no
estado desejado, `revert` é no-op.

```ts
const revert = await ensureFlipperActor(browser, {
  envName: 'staging-widgets-disabled',
  storageStatePath: SECONDARY_STORAGE_PATH,
  flag: 'paineis_do_usuario_beta_test',
  actor: 'Organization;<orgIdAlvo>',
  enabled: true,    // ou false
});

// ... no final do teste:
await revert();
```

Cria contexto fresco por chamada — não polui o `page` do TC.

## Padrão de spec — transição flag off → on

```ts
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { SECONDARY_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { getEnvByName } from '../../../../../src/utils/environment.js';
import { ensureFlipperActor } from '../../../../../src/utils/flipperFlag.js';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

const env = getEnvByName('staging-widgets-disabled');
const orgId = env.orgId!;
const FLAG = 'paineis_do_usuario_beta_test';
const ACTOR = `Organization;${orgId}`;

test.describe('Feature flag', () => {
  test.use({
    storageState: SECONDARY_STORAGE_PATH,
    baseURL: env.baseUrl,
  });

  let revertFlag: () => Promise<void> = async () => {};

  test.afterAll(async () => {
    await revertFlag();
  });

  test('Transição: flag desabilitada -> habilitada', async ({ page, browser, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Feature flag');
    await allure.story('Transição: flag desabilitada -> habilitada');
    await allure.severity('critical');

    const paineis = new PaineisListPage(page);

    await step('1. Estado inicial: flag off, módulo oculto', async () => {
      await page.goto(`/o/${orgId}/use_modes`);
      await expect(paineis.getPaineisTab()).toHaveCount(0);
    });

    await step('2. Habilitar flag para a org', async () => {
      revertFlag = await ensureFlipperActor(browser, {
        envName: 'staging-widgets-disabled',
        storageStatePath: SECONDARY_STORAGE_PATH,
        flag: FLAG,
        actor: ACTOR,
        enabled: true,
      });
    });

    await step('3. Recarregar /use_modes → módulo reativado', async () => {
      await page.goto(`/o/${orgId}/use_modes`);
      await expect(paineis.getPaineisTab()).toBeVisible();
    });
  });
});
```

**Por que `revertFlag` no `afterAll`**: se o teste falhar no meio, o
`afterAll` ainda roda e devolve o env ao estado original. Sem isso,
runs subsequentes (e outros projetos) veriam estado contaminado.

## Anti-patterns

### A. ❌ Clicar `Fully Enable` / `Disable` no nível da flag

```ts
// ❌ NÃO FAZER
await page.getByRole('button', { name: 'Fully Enable' }).click();
```

Esses botões mudam o master switch da flag — habilitam/desabilitam para
TODAS as orgs do banco. Vão afetar testes de outros projetos que
dependem do estado oposto. Use apenas `Add an actor` / `Remove`.

### B. ❌ Clicar `Delete` na Danger Zone

Remove a flag inteira do Flipper. Não há undo. Servidor passa a tratar
a flag como inexistente (comportamento default: disabled). Quebra prod.

### C. ❌ Mudar flag SEM `afterAll` reverter

```ts
// ❌ NÃO FAZER
test('habilita flag', async ({ browser }) => {
  await ensureFlipperActor(browser, { ..., enabled: true });
  // teste valida algo, mas flag fica ligada pra próximas runs
});
```

Estado Flipper é compartilhado entre runs. Sem revert, próxima run de
spec que espera flag OFF nesse env (ex.
`flag-desabilitada-aba-paineis-nao-exibida`) vai falhar.

### D. ❌ Usar `page` do TC pra mexer no Flipper

```ts
// ❌ NÃO FAZER
test('...', async ({ page }) => {
  await page.goto('/admin/manage/features/paineis_do_usuario_beta_test');
  // O storageState do TC pode não ter acesso /admin → 404 + redirect
});
```

Use `ensureFlipperActor` que cria contexto fresco com `storageStatePath`
explícito.

### E. ❌ Assumir flag estática por env

`staging-widgets` tem flag ON e `staging-widgets-disabled` tem flag OFF
**por convenção**, mas o estado é mutável. Se outro QA esqueceu um
revert, o env pode estar invertido. Specs robustos:

- Leem o estado inicial (sem assumir)
- Usam `ensureFlipperActor` (idempotente)
- Sempre revertem ao estado original via `revert()` retornado

### F. ❌ Skippar com `fixme` quando o caminho Flipper está disponível

Antes desta skill (2026-05-15), specs `transicao-flag-off-on.spec.ts` e
`transicao-flag-on-off-com-paineis.spec.ts` tinham `fixme` "requer
toggle runtime da flag — DevOps preparar env mutável". Com Flipper UI
acessível, esses fixme são removíveis. Anti-pattern F da §7.6 do
CLAUDE.md aplica: skip esconde bug; reescrever com `ensureFlipperActor`.

## Quando NÃO usar esta skill

- Teste valida UI do próprio Flipper Admin (não Twygo): fora do escopo.
- Teste valida API direta do servidor (Rails console, curl com cookie de
  sessão): caminho alternativo, mas exige credencial de servidor não
  documentada aqui. Usar Flipper UI é mais portável.
- Flag controlada por `ENV` var (não Flipper): não aplica — recompilação
  do servidor necessária; testar via env separado em vez de toggle.

## Validação live

Recon validado 2026-05-15 (chrome-devtools-mcp):
- URL: `https://widgetsdisabled.stage.twygoead.com/admin/manage/features/paineis_do_usuario_beta_test`
- User: `claude@teste.com` (com flag elevada)
- Fluxo end-to-end: Add `Organization;<orgIdAlvo>` (N→N+1 actors) → confirma
  heading visível → Remove (17→16 actors) → confirma heading sumiu

Revalidar quando:
- Twygo atualizar Flipper gem (sumário: `Version: 1.3.0` atual; v1.4.2 disponível)
- Surgir bug ao usar `ensureFlipperActor` em produção do agente

Para revalidar, seguir [debugar-via-network-e-console](../debugar-via-network-e-console/SKILL.md)
+ recon manual via chrome-devtools-mcp na URL acima.
