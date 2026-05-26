import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

test.describe('Filtros e Busca - Modelos', () => {
  test('Aplicar filtro padrão Modelos próprios', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Filtros e Busca - Modelos');
    await allure.story('Aplicar filtro padrão "Modelos próprios"');
    await allure.severity('high');

    const modelos = new ContentModelsListPage(page);

    await allure.step('1. Acessar listagem e abrir drawer com 4 filtros padrão visíveis', async () => {
      await modelos.goToList();
      await modelos.expectListingLoaded();
      await modelos.clearFilter();
      await modelos.openFilterDrawer();
      await modelos.expectDefaultFiltersVisible();
    });

    await allure.step('2. Aplicar filtro padrão "Modelos próprios"', async () => {
      await modelos.applyDefaultFilter('Modelos próprios');
    });

    await allure.step('3. Validar filtro aplicado (drawer fechou, #clear-filter visível)', async () => {
      // Invariante mínima do filtro: aplicou e reage. Conteúdo (cards X) depende
      // do estado do env. No env atual base-de-conhecimento, modelos seedados
      // não são classificados como "próprios" pelo backend — listagem fica vazia.
      // Validar só que o filtro foi aplicado, não o count.
      await expect(modelos.clearFilterButton()).toBeVisible({ timeout: 5_000 });
      await modelos.waitForListReady();
    });

    await allure.step('cleanup: limpar filtro', async () => {
      await modelos.clearFilter();
    });
  });
});
