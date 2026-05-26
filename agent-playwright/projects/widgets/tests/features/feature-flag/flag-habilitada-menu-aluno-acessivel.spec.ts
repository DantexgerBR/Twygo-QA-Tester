// spec: testsuite XML
// seed: tests/seed.spec.ts
//
// TC: flag ON + painel criado + associado ao useMode Aluno → menu aparece
// na visão do aluno (mesmo usuário, switch via ProfileSwitcher — todos os
// usuários Twygo têm perfil Aluno disponível, não precisa credencial nova).
//
// Pré-condição: claude@teste.com no env staging-widgets-disabled tem flag
// elevada (acesso `/admin/manage/features`) E perfil Admin/Aluno disponível.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getEnvByName } from '../../../../../src/utils/environment.js';
import { ensureFlipperActor } from '../../../../../src/utils/flipperFlag.js';
import { ensureContractFeature } from '../../../../../src/utils/contractFeature.js';
import { SECONDARY_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { ProfileSwitcher } from '../../../../../src/pages/ProfileSwitcher.js';

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
  let panelName = '';
  let alunoUseModeId: number | undefined;

  test.afterAll(async ({ browser }) => {
    // Cleanup via contexto fresco como Admin — page do test pode estar em
    // visão Aluno ou ter fechado.
    if (panelName) {
      const ctx = await browser.newContext({
        storageState: SECONDARY_STORAGE_PATH,
        baseURL: disabledEnv.baseUrl,
      });
      const cleanupPage = await ctx.newPage();
      try {
        const paineis = new PaineisListPage(cleanupPage, disabledOrgId);
        if (alunoUseModeId) {
          await paineis.disassociatePanelFromMenu_safe(panelName, alunoUseModeId);
        }
        await paineis.deletePanelByNameSafe(panelName);
      } finally {
        await ctx.close();
      }
    }
    await revertFlag();
    await revertContract();
  });

  test('Feature flag habilitada com painéis criados - menu do aluno acessível', async ({
    page,
    browser,
    step,
  }, testInfo) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Feature flag');
    await allure.story('Feature flag habilitada com painéis criados - menu do aluno acessível');
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    panelName = `Painel TC FF-Aluno w${testInfo.workerIndex}-${Date.now()}`;
    const itemName = `Item ${panelName}`;
    const paineis = new PaineisListPage(page, disabledOrgId);
    const profile = new ProfileSwitcher(page, disabledOrgId);

    await step('1. Habilitar contrato (user_panels) + flag via Super Admin/Flipper', async () => {
      // Plan/contrato é gate independente do Flipper — feature exige AMBOS.
      // Ver skill alterar-funcionalidade-contrato-twygo.
      revertContract = await ensureContractFeature(browser, {
        envName: 'staging-widgets-disabled',
        storageStatePath: SECONDARY_STORAGE_PATH,
        orgId: disabledOrgId,
        feature: CONTRACT_FEATURE,
        enabled: true,
      });
      revertFlag = await ensureFlipperActor(browser, {
        envName: 'staging-widgets-disabled',
        storageStatePath: SECONDARY_STORAGE_PATH,
        flag: FLAG,
        actor: ACTOR,
        enabled: true,
      });
    });

    await step('2. Como Admin: criar painel novo (toggle propagação cache)', async () => {
      await expect(async () => {
        await paineis.goToList();
      }).toPass({ timeout: 60_000, intervals: [2_000, 3_000, 5_000] });
      await paineis.createPanel({ name: panelName });
    });

    await step('3. Descobrir useModeId do Aluno e associar painel ao menu', async () => {
      await paineis.goToModosDeUso();
      const row = paineis.getModoDeUsoRowByName('Aluno');
      await row.waitFor();
      const rawId = await row.getAttribute('data-item-id');
      if (!rawId) throw new Error('useModeId Aluno não descoberto na listagem');
      alunoUseModeId = Number(rawId);
      await paineis.associatePanelToMenu(panelName, alunoUseModeId, itemName);
    });

    await step('4. Switch para perfil Aluno', async () => {
      await profile.switchToViaUrl('Aluno');
    });

    await step('5. Menu Painéis (item criado) acessível na visão Aluno', async () => {
      // Item de menu na sidebar Aluno: UI Twygo TRUNCA texto após ~25
      // caracteres, então `name: itemName` (com timestamp) não bate o
      // accessible-name truncado. Filtra por `hasText` com prefixo
      // estável + valida ao menos 1 link presente.
      const menuLink = page
        .getByRole('link')
        .filter({ hasText: 'Item Painel TC FF-Aluno' });
      await expect(menuLink.first()).toBeVisible({ timeout: 30_000 });
    });
  });
});
