import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

test.describe('Filtros e Busca - Modelos', () => {
  test('Filtrar modelos por Situação via drawer', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Filtros e Busca - Modelos');
    await allure.story('Filtrar modelos por Situação via drawer');
    await allure.severity('high');

    const modelos = new ContentModelsListPage(page);

    await allure.step('1. Acessar listagem e abrir drawer de filtros', async () => {
      await modelos.goToList();
      await modelos.expectListingLoaded();
      // Reverter estado se filtro residual de run anterior
      await modelos.clearFilter();
      await modelos.openFilterDrawer();
    });

    await allure.step('2. Aplicar filtro padrão "Modelos ativos"', async () => {
      // Drawer já aberto pelo step 1 — aplicamos via método que reabre se necessário
      await modelos.applyDefaultFilter('Modelos ativos');
    });

    await allure.step('3. Validar drawer fechou e #clear-filter ficou visível', async () => {
      await expect(modelos.clearFilterButton()).toBeVisible({ timeout: 5_000 });
      // Listagem ainda tem cards (seed inclui pelo menos 1 ativo)
      await modelos.expectAtLeastNCards(1);
    });

    await allure.step('cleanup: limpar filtro pra próximo TC começar limpo', async () => {
      await modelos.clearFilter();
    });
  });
});
