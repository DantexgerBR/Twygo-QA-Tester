// Testsuite: Pesquisa e Filtros
// TC6 — STATUS: READY com setup. A org 36988 tem todos os painéis ativos
// por default. Para validar o filtro "Painéis inativos", inativamos 1 painel
// no setup (toggle do switch Ativo) e revertemos no `afterAll`. Aplicamos
// filtro e verificamos que o painel inativo é o único na listagem.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Pesquisa e Filtros', () => {
  test("Aplicar filtro padrão 'Painéis inativos'", async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Pesquisa e Filtros');
    await allure.story("Aplicar filtro padrão 'Painéis inativos'");
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);
    let inactivatedName: string | null = null;

    await step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
    });

    // Setup local: inativa o primeiro painel para garantir ≥1 inativo.
    await step('Setup: inativar 1 painel para teste', async () => {
      inactivatedName = await paineis.getFirstPanelName();
      await paineis.ensureInactive(inactivatedName);
    });

    try {
      await step("2. Selecionar o filtro 'Painéis inativos'", async () => {
        await paineis.applyDefaultFilter('Painéis inativos');
        await expect(paineis.getClearFilterButton()).toBeVisible();
        // O painel que inativamos deve aparecer no resultado.
        await expect(paineis.getRowByItemName(inactivatedName!)).toBeVisible();
        // Todas as linhas restantes devem estar com switch Ativo = unchecked.
        const rows = await paineis.getRowNames();
        for (const name of rows) {
          await expect(
            paineis.getRowByItemName(name).locator('input[type="checkbox"]'),
          ).not.toBeChecked();
        }
      });
    } finally {
      // Revert: re-ativa e limpa filtro.
      await paineis.clearFilter();
      if (inactivatedName) {
        // Após clearFilter, listagem volta a mostrar todos; podemos re-ativar.
        await paineis.ensureActive(inactivatedName);
      }
    }
  });
});
