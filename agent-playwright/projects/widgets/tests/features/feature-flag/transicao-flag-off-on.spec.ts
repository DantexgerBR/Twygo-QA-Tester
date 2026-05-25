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
import { ensureContractFeature } from '../../../../../src/utils/contractFeature.js';
import { SECONDARY_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

const disabledEnv = getEnvByName('staging-widgets-disabled');
const disabledOrgId = disabledEnv.orgId!;
const FLAG = 'paineis_do_usuario_beta_test';
const ACTOR = `Organization;${disabledOrgId}`;
const CONTRACT_FEATURE = 'user_panels';

test.describe('Feature flag', () => {
  test.use({
    storageState: SECONDARY_STORAGE_PATH,
    baseURL: disabledEnv.baseUrl,
  });

  let revertFlag: () => Promise<void> = async () => {};
  let revertContract: () => Promise<void> = async () => {};

  test.afterAll(async () => {
    await revertFlag();
    await revertContract();
  });

  test('Transição: flag desabilitada -> habilitada', async ({ page, browser, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Feature flag');
    await allure.story('Transição: flag desabilitada -> habilitada');
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await step('0. Setup: contrato ON (plan), flag OFF (estado inicial do TC)', async () => {
      // Plan/contract precisa estar ON pra aba Painéis aparecer quando flag for ativada.
      // TCs vizinhos podem ter revertido pra OFF — força ON aqui, revert depois.
      revertContract = await ensureContractFeature(browser, {
        envName: 'staging-widgets-disabled',
        storageStatePath: SECONDARY_STORAGE_PATH,
        orgId: disabledOrgId,
        feature: CONTRACT_FEATURE,
        enabled: true,
      });
      // Força flag OFF — TCs vizinhos podem ter deixado ON (cache server-side
      // pode persistir alguns segundos após revert do TC anterior).
      await ensureFlipperActor(browser, {
        envName: 'staging-widgets-disabled',
        storageStatePath: SECONDARY_STORAGE_PATH,
        flag: FLAG,
        actor: ACTOR,
        enabled: false,
      });
    });

    await step('1. Estado inicial: flag off, aba Painéis oculta', async () => {
      // Cache server-side da flag tem TTL — espera propagação do OFF antes
      // de assertar count 0.
      await expect(async () => {
        await safeGoto(page, `/o/${disabledOrgId}/use_modes`);
        await expect(paineis.getModosDeUsoTab()).toBeVisible({ timeout: 5_000 });
        await expect(paineis.getPaineisTab()).toHaveCount(0, { timeout: 5_000 });
      }).toPass({ timeout: 60_000, intervals: [3_000, 5_000, 8_000] });
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
