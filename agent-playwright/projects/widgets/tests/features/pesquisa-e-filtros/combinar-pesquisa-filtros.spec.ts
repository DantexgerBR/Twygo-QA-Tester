// Testsuite: Pesquisa e Filtros
// TC13 — STATUS: READY. Aplica filtro "Painéis ativos" + search por nome
// existente; resultado deve interseccionar ambos (AND).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Pesquisa e Filtros', () => {
  test('Combinar pesquisa e filtros padrão', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Pesquisa e Filtros');
    await allure.story('Combinar pesquisa e filtros padrão');
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);
    // Substring "Painel" bate em qualquer painel "Painel N" da org — independe
    // de qual workers/cleanup outras specs deixaram em estado intermediário.
    // Tornar o spec robusto a execuções paralelas (4 workers concorrentes na
    // mesma org 36988 do staging-widgets).
    const searchTerm = 'Painel';

    await step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
    });

    await step("2. Selecionar o filtro 'Painéis ativos'", async () => {
      await paineis.applyDefaultFilter('Painéis ativos');
      await expect(paineis.getClearFilterButton()).toBeVisible();
    });

    await step("3. Preencher o campo de pesquisa", async () => {
      // Para o combo (filtro + search), validamos que TODAS as linhas
      // resultantes (a) contêm o termo e (b) estão ativas. Não exigimos
      // que um painel específico apareça — outras suítes paralelas podem
      // estar inativando temporariamente algum painel.
      const initialCount = await page.locator('tbody tr').count();
      await paineis.searchPanels(searchTerm);
      // Listagem reduziu (busca aplicou) OU manteve mesma contagem (todos
      // os ativos casam com "Painel" — caso onde o filtro já reduziu).
      const finalCount = await page.locator('tbody tr').count();
      expect(finalCount).toBeLessThanOrEqual(initialCount);
      const rows = await paineis.getRowNames();
      expect(rows.length).toBeGreaterThan(0);
      for (const name of rows) {
        expect(name.toLowerCase()).toContain(searchTerm.toLowerCase());
        await expect(
          paineis.getRowByItemName(name).locator('input[type="checkbox"]'),
        ).toBeChecked();
      }
    });

    // Cleanup: limpa pesquisa + filtro.
    await paineis.clearSearch();
    await paineis.clearFilter();
  });
});
