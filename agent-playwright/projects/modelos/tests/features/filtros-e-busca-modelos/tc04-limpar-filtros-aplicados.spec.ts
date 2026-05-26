import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

test.describe('Filtros e Busca - Modelos', () => {
  test('Limpar filtros aplicados', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Filtros e Busca - Modelos');
    await allure.story('Limpar filtros aplicados');
    await allure.severity('medium');

    const modelos = new ContentModelsListPage(page);

    await allure.step('1. Aplicar filtro padrão Modelos ativos', async () => {
      await modelos.goToList();
      await modelos.expectListingLoaded();
      await modelos.clearFilter();
      await modelos.applyDefaultFilter('Modelos ativos');
      await expect(modelos.clearFilterButton()).toBeVisible({ timeout: 5_000 });
    });

    await allure.step('2. Clicar Limpar filtros e validar listagem volta sem filtro', async () => {
      await modelos.clearFilter();
      await expect(modelos.clearFilterButton()).toHaveCount(0);
      // Invariante: listagem volta com pelo menos os 3 modelos seedados
      await modelos.expectAtLeastNCards(3);
    });
  });
});
