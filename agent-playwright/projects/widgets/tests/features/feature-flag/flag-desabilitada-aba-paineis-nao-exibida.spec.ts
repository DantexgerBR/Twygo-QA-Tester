// spec: testsuite XML
// seed: tests/seed.spec.ts

// TC 1.1 da suite "Feature flag" — usa env secundário staging-widgets-disabled
// (orgId 36989, host widgetsdisabled.stage.twygoead.com) que tem a flag
// habilitar_paineis_do_usuario OFF. Valida que o admin não vê a aba Painéis.
//
// Existe TC similar na suite "Listagem de painéis" (feature-flag-desabilitada.spec.ts)
// que valida o mesmo cenário em outro contexto. Este TC é mais genérico:
// valida o R1 (módulo oculto totalmente).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getEnvByName } from '../../../../../src/utils/environment.js';
import { SECONDARY_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

const disabledEnv = getEnvByName('staging-widgets-disabled');
const disabledOrgId = disabledEnv.orgId;

test.describe('Feature flag', () => {
  test.use({
    storageState: SECONDARY_STORAGE_PATH,
    baseURL: disabledEnv.baseUrl,
  });

  test("Feature flag desabilitada - aba 'Painéis' não é exibida para Admin", async ({
    page,
    step,
  }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Feature flag');
    await allure.story("Feature flag desabilitada - aba 'Painéis' não é exibida para Admin");
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await step('1. Acessar /use_modes no env com flag desabilitada', async () => {
      await page.goto(`/o/${disabledOrgId}/use_modes`);
      await expect(paineis.getModosDeUsoTab()).toBeVisible();
    });

    await step("2. Verificar que a aba 'Painéis' NÃO aparece (R1 — ocultação total)", async () => {
      await expect(paineis.getPaineisTab()).toHaveCount(0);
    });
  });
});
