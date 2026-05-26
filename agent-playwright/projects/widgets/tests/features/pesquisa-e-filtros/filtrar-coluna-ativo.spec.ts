// Testsuite: Pesquisa e Filtros
// TC11 — STATUS: READY. Filtra por coluna Ativo = Sim e verifica que todas
// as linhas restantes têm checkbox marcado.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Pesquisa e Filtros', () => {
  test("Filtrar pela coluna 'Ativo'", async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Pesquisa e Filtros');
    await allure.story("Filtrar pela coluna 'Ativo'");
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
    });

    await step(
      "2. Clicar no ícone de Filtro > Novo > Colunas para filtrar > Ativo (Sim)",
      async () => {
        await paineis.applyColumnFilter({ column: 'Ativo', value: 'Sim' });
      },
    );

    await step('3. Verificar que a listagem só mostra painéis ativos', async () => {
      await expect(paineis.getClearFilterButton()).toBeVisible();
      const rows = await paineis.getRowNames();
      expect(rows.length).toBeGreaterThan(0);
      // Usamos getRowByItemName (exact match em data-item-name) para evitar
      // strict-mode violation quando "Painel 1" é prefixo de "Painel 10/11/12...".
      for (const name of rows) {
        await expect(
          paineis.getRowByItemName(name).locator('input[type="checkbox"]'),
        ).toBeChecked();
      }
    });

    await paineis.clearFilter();
  });
});
