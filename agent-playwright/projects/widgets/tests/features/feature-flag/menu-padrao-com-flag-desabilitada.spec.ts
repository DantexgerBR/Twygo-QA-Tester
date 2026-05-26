// spec: testsuite XML
// seed: tests/seed.spec.ts
//
// TC4 — Menu de painel marcado como "Página inicial" (padrão) + flag
// desabilitada. Setup como TC3 mais um passo extra: marcar o item painel
// como página padrão do useMode Aluno antes de desligar a flag.
//
// Cenário: aluno tinha painel definido como landing → flag OFF → app NÃO
// pode quebrar a tela nem exibir "sem permissão" → DEVE redirecionar pra
// rota disponível (fallback) ao acessar como aluno.

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
// Prefixo amplo cobre TC1/TC3/TC4 (mesmo useMode Aluno) — ver TC3 spec.
const ORPHAN_PREFIX = 'Item Painel TC FF';

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
    if (panelName) {
      const tempContract = await ensureContractFeature(browser, {
        envName: 'staging-widgets-disabled',
        storageStatePath: SECONDARY_STORAGE_PATH,
        orgId: disabledOrgId,
        feature: CONTRACT_FEATURE,
        enabled: true,
      });
      const tempFlag = await ensureFlipperActor(browser, {
        envName: 'staging-widgets-disabled',
        storageStatePath: SECONDARY_STORAGE_PATH,
        flag: FLAG,
        actor: ACTOR,
        enabled: true,
      });
      const ctx = await browser.newContext({
        storageState: SECONDARY_STORAGE_PATH,
        baseURL: disabledEnv.baseUrl,
      });
      const cleanupPage = await ctx.newPage();
      try {
        const paineis = new PaineisListPage(cleanupPage, disabledOrgId);
        if (alunoUseModeId) {
          // Restaurar Dashboard como página padrão ANTES de desassociar
          // (senão o item painel fica órfão como padrão).
          await paineis.setMenuItemAsHomepage(alunoUseModeId, 'Dashboard').catch(() => null);
          await paineis.disassociatePanelFromMenu_safe(panelName, alunoUseModeId);
        }
        await paineis.deletePanelByNameSafe(panelName);
      } finally {
        await ctx.close();
        await tempFlag();
        await tempContract();
      }
    }
    await revertFlag();
    await revertContract();
  });

  test("Menu marcado como 'Padrão' com flag desabilitada", async ({
    page,
    browser,
    step,
  }, testInfo) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Feature flag');
    await allure.story("Menu marcado como 'Padrão' com flag desabilitada");
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    panelName = `Painel TC FF-Padrao w${testInfo.workerIndex}-${Date.now()}`;
    const itemName = `Item ${panelName}`;
    const paineis = new PaineisListPage(page, disabledOrgId);
    const profile = new ProfileSwitcher(page, disabledOrgId);

    await step('1. Habilitar contrato + flag', async () => {
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

    await step('2. Descobrir useModeId Aluno + limpar órfãos', async () => {
      await expect(async () => {
        await paineis.goToList();
      }).toPass({ timeout: 180_000, intervals: [5_000, 10_000, 15_000] });

      await paineis.goToModosDeUso();
      const row = paineis.getModoDeUsoRowByName('Aluno');
      await row.waitFor();
      const rawId = await row.getAttribute('data-item-id');
      if (!rawId) throw new Error('useModeId Aluno não descoberto');
      alunoUseModeId = Number(rawId);
      await paineis.deleteOrphanMenuItemsByPrefix(alunoUseModeId, ORPHAN_PREFIX);
    });

    await step('3. Admin: criar painel + associar ao useMode Aluno', async () => {
      await paineis.goToList();
      await paineis.createPanel({ name: panelName });
      await paineis.associatePanelToMenu(panelName, alunoUseModeId!, itemName);
    });

    await step('4. Marcar item painel como Página inicial (padrão) do useMode Aluno', async () => {
      await paineis.setMenuItemAsHomepage(alunoUseModeId!, itemName);
    });

    await step('5. Switch Admin + desabilitar flag', async () => {
      await profile.switchToViaUrl('Administrador');
      await revertFlag();
      revertFlag = async () => {}; // já revertido — afterAll vira no-op
    });

    await step('6. Switch Aluno: app não quebra + redireciona pra rota disponível', async () => {
      // Sem flag, a rota de painel do aluno não existe mais. App deveria
      // fazer fallback automático pra outra rota (ex /dashboard_students)
      // sem 500/404/mensagem "sem permissão".
      await expect(async () => {
        await profile.switchToViaUrl('Aluno');
        await page.reload({ waitUntil: 'domcontentloaded' });
        // 1. URL final NÃO deve estar em /panel_viewer/ (item padrão original)
        await expect(page).not.toHaveURL(/\/panel_viewer\//, { timeout: 5_000 });
        // 2. Não deve mostrar mensagem de erro "sem permissão" / "não autorizado"
        const errorMsg = page.getByText(/sem\s+permiss[aã]o|n[aã]o\s+autorizado|access\s+denied/i);
        await expect(errorMsg).toHaveCount(0, { timeout: 5_000 });
        // 3. Sidebar Aluno deve renderizar (algum link conhecido)
        const dashboardLink = page.getByRole('link', { name: /dashboard/i }).first();
        await expect(dashboardLink).toBeVisible({ timeout: 10_000 });
      }).toPass({ timeout: 60_000, intervals: [3_000, 5_000, 8_000] });
    });
  });
});
