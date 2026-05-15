// spec: testsuite XML "Trial" → testcase "Exclusão de trial: dados pré-definidos da SophiaTech removidos"
// seed: tests/seed.spec.ts
//
// Destrutivo: zera dados pré-definidos da Trial. Após esta run, o env
// (orgId 36981 / trial-agentsqa-other) precisa ser re-provisionado para
// novas execuções — ver skill `provisionar-trial-projeto-twygo`.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { SophiaWidget } from '../../../../../src/pages/SophiaWidget.js';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { dismissCommonModals } from '../../../../../src/utils/modals.js';
import { TRIAL } from './exclusao-trial-dados-sophiatech.data.js';

test.describe('Trial', () => {
  // Login explícito autorizado para Trial — globalSetup cobre só env principal/secundário
  // do projeto. Ver `testar-exclusao-dados-trial-twygo` §"Storage state da Trial".
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

  test('Exclusão de trial: dados pré-definidos da SophiaTech removidos', async ({
    page,
    step,
  }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Trial');
    await allure.story('Exclusão de trial: dados pré-definidos da SophiaTech removidos');
    await allure.severity('critical');

    // orgIdOverride: navega na Trial (36981), não no env principal (36988).
    // Ver skill `testar-ambientes-adicionais-twygo` § "POM com orgIdOverride".
    const paineis = new PaineisListPage(page, String(TRIAL.orgId));
    const sophia = new SophiaWidget(page);

    let initialCount = 0;

    await step('Pré: contar painéis pré-definidos atuais', async () => {
      await page.goto(`/o/${TRIAL.orgId}/use_modes?tab=panels-tab`);
      await dismissCommonModals(page);
      await paineis.setViewMode('lista');
      // `getRowCount` conta a row "Não há dados para exibir" como 1 — usar
      // o getter de empty-state pra detectar Trial drenada antes de seguir.
      const isEmpty = (await paineis.getEmptyStateText().count()) > 0;
      initialCount = isEmpty ? 0 : await paineis.getRowCount();
      test.skip(
        initialCount === 0,
        'Trial sem painéis pré-definidos — re-provisione via `provisionar-trial-projeto-twygo`.',
      );
    });

    await step('1. Executar rotina de exclusão (Sophia → Excluir informações → SophiaTech)', async () => {
      await sophia.openDeleteModal();
      await sophia.selectOnly('sophiatech');
      await sophia.confirmDelete();
    });

    await step('2. Verificar base após exclusão — registros SophiaTech removidos', async () => {
      // Backend processa exclusão como job async (endpoint
      // `trial_deletion_progress` polling). Aguardar invariante "contagem
      // diminuiu" com timeout 60s — default 10s é insuficiente.
      await expect(async () => {
        await page.goto(`/o/${TRIAL.orgId}/use_modes?tab=panels-tab`);
        await dismissCommonModals(page);
        await paineis.setViewMode('lista');
        const finalCount = await paineis.getRowCount();
        expect(
          finalCount,
          `Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=${initialCount}, final=${finalCount}).`,
        ).toBeLessThan(initialCount);
      }).toPass({ timeout: 60_000 });
    });
  });
});
