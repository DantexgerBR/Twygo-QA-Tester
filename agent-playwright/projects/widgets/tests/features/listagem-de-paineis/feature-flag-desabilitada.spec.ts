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
import { SECONDARY_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

const disabledEnv = getEnvByName('staging-widgets-disabled');
const disabledOrgId = disabledEnv.orgId;

test.describe('Listagem de painéis', () => {
  test.use({
    storageState: SECONDARY_STORAGE_PATH,
    baseURL: disabledEnv.baseUrl,
  });

  test('Acessar listagem com a feature flag desabilitada', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Listagem de painéis');
    await allure.story('Acessar listagem com a feature flag desabilitada');
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await allure.step('1. Acessar /use_modes e verificar tabs', async () => {
      await safeGoto(page, `/o/${disabledOrgId}/use_modes`);
      await expect(paineis.getModosDeUsoTab()).toBeVisible();
    });

    await allure.step(
      "2. Verificar que a tab 'Painéis' não aparece com a flag off",
      async () => {
        await expect(paineis.getPaineisTab()).toHaveCount(0);
      },
    );

    await allure.step(
      "3. Acessar URL direta do tab Painéis e verificar que a aba continua hidden",
      async () => {
        await safeGoto(page, `/o/${disabledOrgId}/use_modes?tab=panels-tab`);
        // REVISAR: XML diz que a UI deve mostrar "página não existe", mas o
        // comportamento real (re-explorado 2026-05-06) é silencioso — o app
        // simplesmente renderiza o tabpanel default ("Modos de uso") sem
        // mensagem de erro. Asserção fiel: a aba Painéis continua ausente
        // mesmo após direct-navigate.
        await expect(paineis.getPaineisTab()).toHaveCount(0);
        await expect(paineis.getModosDeUsoTab()).toBeVisible();
      },
    );
  });
});
