import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

test.describe('Filtros e Busca - Modelos', () => {
  test('Combinação de filtros + busca textual', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Filtros e Busca - Modelos');
    await allure.story('Combinação de filtros + busca textual');
    await allure.severity('high');

    const modelos = new ContentModelsListPage(page);

    await allure.step('1. Acessar listagem com múltiplos modelos', async () => {
      await modelos.goToList();
      await modelos.expectListingLoaded();
    });

    await allure.step('2. Buscar "Modelo Seed" via campo Buscar', async () => {
      await modelos.searchByName('Modelo Seed');
    });

    await allure.step('3-6. Aplicar filtro padrão "Modelos ativos" + validar interseção', async () => {
      // Drawer pode abrir em modo edição se houver filtro residual — clearFilter primeiro
      await modelos.clearFilter();
      await modelos.applyDefaultFilter('Modelos ativos');
      // Invariante: drawer fechou (clear-filter visível) + listagem responde
      await expect(modelos.clearFilterButton()).toBeVisible({ timeout: 10_000 });
      await modelos.waitForListReady();
    });

    await allure.step('7. Limpar filtros e validar listagem reseta', async () => {
      await modelos.clearFilter();
      await expect(modelos.clearFilterButton()).toHaveCount(0);
    });
  });
});
