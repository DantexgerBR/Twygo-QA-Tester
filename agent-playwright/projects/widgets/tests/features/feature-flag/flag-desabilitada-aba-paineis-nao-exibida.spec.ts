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
import { safeGoto } from '../../../../../src/utils/modals.js';
import { ensureFlipperActor } from '../../../../../src/utils/flipperFlag.js';
import { SECONDARY_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

const disabledEnv = getEnvByName('staging-widgets-disabled');
const disabledOrgId = disabledEnv.orgId!;
const FLAG = 'paineis_do_usuario_beta_test';
const ACTOR = `Organization;${disabledOrgId}`;

test.describe('Feature flag', () => {
  test.use({
    storageState: SECONDARY_STORAGE_PATH,
    baseURL: disabledEnv.baseUrl,
  });

  // TCs vizinhos togglam flag — força OFF no setup pra isolar.
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

    // Cache server-side da flag tem TTL — toPass com reload cobre propagação.
    await step('1+2. Acessar /use_modes + aba Painéis ausente', async () => {
      await expect(async () => {
        await safeGoto(page, `/o/${disabledOrgId}/use_modes`);
        await expect(paineis.getModosDeUsoTab()).toBeVisible({ timeout: 5_000 });
        await expect(paineis.getPaineisTab()).toHaveCount(0, { timeout: 5_000 });
      }).toPass({ timeout: 90_000, intervals: [3_000, 5_000, 8_000] });
    });
  });
});
