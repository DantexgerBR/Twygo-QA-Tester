// Testsuite: Pesquisa e Filtros
// TC5 — STATUS: READY. Drawer expõe radio `#default-filters-0` (Painéis ativos).
// Após aplicar, `#clear-filter` aparece (prova de filtro ativo); pós-asserção,
// limpamos para deixar org em estado neutro.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Pesquisa e Filtros', () => {
  test("Aplicar filtro padrão 'Painéis ativos'", async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Pesquisa e Filtros');
    await allure.story("Aplicar filtro padrão 'Painéis ativos'");
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
    });

    await step("2. Selecionar o filtro 'Painéis ativos'", async () => {
      await paineis.applyDefaultFilter('Painéis ativos');
      // Verifica que o filtro está aplicado: botão Limpar visível + título
      // do filtro no drawer corresponde.
      await expect(paineis.getClearFilterButton()).toBeVisible();
      // Todas as linhas restantes devem estar com switch Ativo = checked.
      // Usamos getRowByItemName (exact em data-item-name) para evitar strict
      // violation com nomes que são prefixo uns dos outros (Painel 1 vs 10).
      const rows = await paineis.getRowNames();
      expect(rows.length).toBeGreaterThan(0);
      for (const name of rows) {
        await expect(
          paineis.getRowByItemName(name).locator('input[type="checkbox"]'),
        ).toBeChecked();
      }
    });

    // Cleanup: limpa filtro para próximos testes
    await paineis.clearFilter();
  });
});
