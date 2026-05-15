// spec: testsuite XML
// seed: tests/seed.spec.ts
//
// TC de transição flag OFF → ON. Toggle runtime via Flipper Admin UI
// (`/admin/manage/features/paineis_do_usuario_beta_test`) — skill
// `testar-feature-flag-twygo`. Estado original (org 36989 sem flag)
// é restaurado no afterAll.

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

  let revertFlag: () => Promise<void> = async () => {};

  test.afterAll(async () => {
    await revertFlag();
  });

  test('Transição: flag desabilitada -> habilitada', async ({ page, browser, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Feature flag');
    await allure.story('Transição: flag desabilitada -> habilitada');
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await step('1. Estado inicial: flag off, aba Painéis oculta', async () => {
      await safeGoto(page, `/o/${disabledOrgId}/use_modes`);
      await expect(paineis.getModosDeUsoTab()).toBeVisible();
      await expect(paineis.getPaineisTab()).toHaveCount(0);
    });

    await step('2. Habilitar flag para a org via Flipper Admin', async () => {
      revertFlag = await ensureFlipperActor(browser, {
        envName: 'staging-widgets-disabled',
        storageStatePath: SECONDARY_STORAGE_PATH,
        flag: FLAG,
        actor: ACTOR,
        enabled: true,
      });
    });

    await step('3. Recarregar /use_modes → aba Painéis aparece', async () => {
      // Flipper toggle não propaga instantaneamente — Twygo cacheia a flag
      // por alguns segundos (lookup batido a cada N requests, não a cada
      // request). Poll com reload até a aba aparecer ou timeout.
      await expect(async () => {
        await safeGoto(page, `/o/${disabledOrgId}/use_modes`);
        await expect(paineis.getPaineisTab()).toBeVisible({ timeout: 5_000 });
      }).toPass({ timeout: 60_000, intervals: [2_000, 3_000, 5_000] });
    });
  });
});
