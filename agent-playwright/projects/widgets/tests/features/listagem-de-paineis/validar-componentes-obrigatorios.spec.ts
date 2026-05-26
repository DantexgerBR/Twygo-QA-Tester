// Testsuite: Listagem de painéis
// TC2 — STATUS: READY. Add/Filtro/Search/Cards-container são confirmáveis com
// seed de 30 painéis na org 36988. View-toggle Lista/Cards NÃO existe na UI
// atual (re-confirmado 2026-05-06: a listagem renderiza sempre como cards;
// não há toggle no DOM) — assertion removida do TC2; reaberta se PM definir
// que a visualização tabular fará parte do roadmap.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.describe('Listagem de painéis', () => {
  test('Validar componentes obrigatórios da listagem de painéis', async ({
    page,
  }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Listagem de painéis');
    await allure.story('Validar componentes obrigatórios da listagem de painéis');
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await allure.step('1. Acessar a listagem de Painéis', async () => {
      await paineis.goToList();
    });

    await allure.step("2. Verificar botão '+ Adicionar' visível", async () => {
      // REVISAR: aguardando data-test-id "paineis-list-add-button"; é <a>,
      // não <button>.
      await expect(paineis.getAddButton()).toBeVisible();
    });

    await allure.step("3. Verificar botão 'Filtro' visível", async () => {
      // REVISAR: aguardando data-test-id "paineis-list-filter-button";
      // usando #open-filter como fallback. Componente NOVO — não estava no XML.
      await expect(paineis.getFilterButton()).toBeVisible();
    });

    await allure.step('4. Verificar campo de busca visível', async () => {
      // REVISAR: aguardando data-test-id "paineis-list-search-input"
      await expect(paineis.getSearchInput()).toBeVisible();
    });

    await allure.step(
      '5. Verificar grid de cards renderiza com pelo menos 1 painel',
      async () => {
        // Substitui a checagem antiga de toggle Lista/Cards (não existe na UI)
        // por uma asserção concreta: o container de cards renderizou e tem
        // ao menos 1 card. Re-confirmado 2026-05-06 com 30 painéis seedados.
        await expect(paineis.getCardsContainer()).toBeVisible();
        expect(await paineis.getCardCount()).toBeGreaterThan(0);
      },
    );
  });
});
