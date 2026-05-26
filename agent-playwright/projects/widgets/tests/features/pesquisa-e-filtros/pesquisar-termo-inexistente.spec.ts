// Testsuite: Pesquisa e Filtros
// TC12 — STATUS: READY. Termo "XXXYYY9999" não existe; assert empty state.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { pesquisarTermoInexistenteData as data } from './pesquisar-termo-inexistente.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Pesquisa e Filtros', () => {
  test('Pesquisar termo inexistente', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Pesquisa e Filtros');
    await allure.story('Pesquisar termo inexistente');
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
    });

    await step("2. Preencher campo de pesquisa com termo inexistente", async () => {
      await paineis.searchPanels(data.nonExistentTerm);
      // Empty state: o produto renderiza "Não há dados para exibir" como
      // placeholder dentro de uma linha do tbody. NÃO assertamos rowCount=0
      // porque a linha do empty state conta como 1 `<tr>`.
      await expect(paineis.getEmptyStateNoResults()).toBeVisible({ timeout: 5_000 });
    });

    await paineis.clearSearch();
  });
});
