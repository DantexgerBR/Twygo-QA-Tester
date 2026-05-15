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

  test('Exclusão de trial: dados criados pelo Admin removidos', async ({ page, step }, testInfo) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Trial');
    await allure.story('Exclusão de trial: dados criados pelo Admin removidos');
    await allure.severity('normal');

    // PaineisListPage navega via `/o/{orgId}/...`. Sem override, usaria
    // getOrgId() (env principal 36988) em vez do orgId da Trial — bug
    // latente confirmado no trace 2026-05-15. Padrão herdado da skill
    // `testar-ambientes-adicionais-twygo` (constructor orgIdOverride).
    const paineis = new PaineisListPage(page, String(TRIAL.orgId));
    const sophia = new SophiaWidget(page);
    // Nome único por run — bug-produto da exclusão Sophia (opção "Todas
    // informações" não remove painéis admin) acumula órfãos entre runs.
    // Suffix worker+timestamp isola este test. Ver
    // `testar-exclusao-dados-trial-twygo` §"Bug-produto confirmado".
    const adminPanelName = `${adminTrialData.adminPanelNameBase} w${testInfo.workerIndex}-${Date.now()}`;

    await step('Pré: Admin cria painel manual', async () => {
      await page.goto(`/o/${TRIAL.orgId}/use_modes?tab=panels-tab`);
      await dismissCommonModals(page);
      await paineis.createPanel({ name: adminPanelName });
      // createPanel redireciona pra /panels/{id}/edit — voltar pra listagem para validar.
      await page.goto(`/o/${TRIAL.orgId}/use_modes?tab=panels-tab`);
      await dismissCommonModals(page);
      await paineis.setViewMode('lista');
      await expect(paineis.getRowByItemName(adminPanelName)).toBeVisible();
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
      // BUG-PRODUTO CONFIRMADO (2026-05-15 via Network probe): a request
      // `DELETE /api/v1/o/{orgId}/delete_trial_data` é disparada pelo
      // backend mas painéis admin sobrevivem. XML diz que deveriam ser
      // removidos junto com pré-definidos. Spec vermelho aqui é SINAL
      // CORRETO até produto corrigir. Timeout 60s mantido como cinto de
      // segurança (caso comportamento mude pra async no futuro).
      // Ver skill `testar-exclusao-dados-trial-twygo` §"Bug-produto confirmado".
      await expect(paineis.getRowByItemName(adminPanelName)).toHaveCount(0, {
        timeout: 60_000,
      });
    });
  });
});
