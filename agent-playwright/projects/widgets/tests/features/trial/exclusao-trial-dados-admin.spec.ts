// spec: testsuite XML "Trial" → testcase "Exclusão de trial: dados criados pelo Admin removidos"
// seed: tests/seed.spec.ts
//
// Destrutivo: marca opção "Todas informações (pré-definidas e criadas pelos
// administradores)" — zera o tenant inteiro. Após esta run, o env (orgId 36981
// / trial-agentsqa-other) precisa ser re-provisionado — ver skill
// `provisionar-trial-projeto-twygo`.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { SophiaWidget } from '../../../../../src/pages/SophiaWidget.js';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { dismissCommonModals } from '../../../../../src/utils/modals.js';
import { TRIAL, adminTrialData } from './exclusao-trial-dados-admin.data.js';

test.describe('Trial', () => {
  test.use({
    baseURL: TRIAL.url,
    storageState: { cookies: [], origins: [] },
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/users/login');
    await page.getByRole('textbox', { name: 'Login' }).fill(TRIAL.email);
    await page.getByRole('textbox', { name: 'Senha' }).fill(TRIAL.password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.waitForURL((url) => !url.pathname.startsWith('/users/login'), {
      timeout: 30_000,
    });
  });

  test('Exclusão de trial: dados criados pelo Admin removidos', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Trial');
    await allure.story('Exclusão de trial: dados criados pelo Admin removidos');
    await allure.severity('normal');

    const paineis = new PaineisListPage(page);
    const sophia = new SophiaWidget(page);

    await step('Pré: Admin cria "Painel do Admin Trial"', async () => {
      await page.goto(`/o/${TRIAL.orgId}/use_modes?tab=panels-tab`);
      await dismissCommonModals(page);
      await paineis.createPanel({ name: adminTrialData.adminPanelName });
      // createPanel redireciona pra /panels/{id}/edit — voltar pra listagem para validar.
      await page.goto(`/o/${TRIAL.orgId}/use_modes?tab=panels-tab`);
      await dismissCommonModals(page);
      await paineis.setViewMode('lista');
      await expect(paineis.getRowByName(adminTrialData.adminPanelName)).toBeVisible();
    });

    await step('1. Executar rotina de exclusão (Sophia → Excluir informações → Todas informações)', async () => {
      await sophia.openDeleteModal();
      await sophia.selectOnly('all');
      await sophia.confirmDelete();
    });

    await step('2. Verificar base após exclusão — painel do Admin removido junto com pré-definidos', async () => {
      await page.goto(`/o/${TRIAL.orgId}/use_modes?tab=panels-tab`);
      await dismissCommonModals(page);
      await paineis.setViewMode('lista');
      await expect(paineis.getRowByName(adminTrialData.adminPanelName)).toHaveCount(0);
    });
  });
});
