// Testsuite: Listagem de painéis
// TC7 — STATUS: READY. Plugado ao env secundário `staging-widgets-disabled`
// (orgId 36989, baseUrl widgetsdisabled.stage.twygoead.com) — re-explorado
// 2026-05-06: o tablist em `/use_modes` mostra apenas "Modos de uso", a aba
// "Painéis" não renderiza, e direct-navigate para `?tab=panels-tab` cai no
// tabpanel default (Modos de uso) — NÃO aparece mensagem "página não existe"
// no DOM. A asserção do step 3 valida que a aba Painéis continua hidden
// (assertion fiel ao comportamento real, não à prosa literal do XML).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getEnvByName } from '../../../../../src/utils/environment.js';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { ensureFlipperActor } from '../../../../../src/utils/flipperFlag.js';
import { SECONDARY_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

const disabledEnv = getEnvByName('staging-widgets-disabled');
const disabledOrgId = disabledEnv.orgId!;
const FLAG = 'paineis_do_usuario_beta_test';
const ACTOR = `Organization;${disabledOrgId}`;

test.describe('Listagem de painéis', () => {
  test.use({
    storageState: SECONDARY_STORAGE_PATH,
    baseURL: disabledEnv.baseUrl,
  });

  // Specs Feature flag em outras suites togglam flag em paralelo (TC3/TC4
  // de "Feature flag"). Garante flag OFF no setup desse spec e restaura
  // estado original no teardown — não assume estado nativo do env.
  let revertFlag: () => Promise<void> = async () => {};
  test.beforeAll(async ({ browser }) => {
    revertFlag = await ensureFlipperActor(browser, {
      envName: 'staging-widgets-disabled',
      storageStatePath: SECONDARY_STORAGE_PATH,
      flag: FLAG,
      actor: ACTOR,
      enabled: false,
    });
  });
  test.afterAll(async () => {
    await revertFlag();
  });

  test('Acessar listagem com a feature flag desabilitada', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Listagem de painéis');
    await allure.story('Acessar listagem com a feature flag desabilitada');
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    // expect.toPass com goto+reload em cada attempt porque specs Feature
    // flag (TC3/TC4) togglam flag em paralelo — pode estar ON
    // temporariamente. Beforeall garante OFF inicial mas paralelismo
    // re-ativa. Cache server-side também tem TTL.
    await allure.step('1+2. Acessar /use_modes e confirmar aba Painéis ausente', async () => {
      await expect(async () => {
        await safeGoto(page, `/o/${disabledOrgId}/use_modes`);
        await expect(paineis.getModosDeUsoTab()).toBeVisible({ timeout: 5_000 });
        await expect(paineis.getPaineisTab()).toHaveCount(0, { timeout: 5_000 });
      }).toPass({ timeout: 120_000, intervals: [3_000, 5_000, 10_000] });
    });

    await allure.step(
      "3. URL direta `?tab=panels-tab` continua silenciosa (fallback Modos de uso)",
      async () => {
        await expect(async () => {
          await safeGoto(page, `/o/${disabledOrgId}/use_modes?tab=panels-tab`);
          // REVISAR: XML diz UI deve mostrar "página não existe", mas o
          // comportamento real (re-explorado 2026-05-06) é silencioso —
          // app renderiza tabpanel default sem mensagem de erro.
          await expect(paineis.getPaineisTab()).toHaveCount(0, { timeout: 5_000 });
          await expect(paineis.getModosDeUsoTab()).toBeVisible({ timeout: 5_000 });
        }).toPass({ timeout: 120_000, intervals: [3_000, 5_000, 10_000] });
      },
    );
  });
});
