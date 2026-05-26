// spec: projects/modelos/specs/listagem-e-menu-de-modelos.md

import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

test.describe('Listagem e Menu de Modelos', () => {
  test('Visualização padrão em Cards', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Listagem e Menu de Modelos');
    await allure.story('Visualização padrão em Cards');
    await allure.severity('critical');

    const modelos = new ContentModelsListPage(page);

    await allure.step('1. Acessar listagem e aguardar Cards renderizados', async () => {
      await modelos.goToList();
      await modelos.expectListingLoaded();
    });

    await allure.step('2. Validar visualização padrão é Cards (toggle grid_view ativo)', async () => {
      await expect(modelos.gridViewIcon()).toBeVisible();
    });

    await allure.step('3. Validar pelo menos 1 card renderizado com nome visível', async () => {
      await modelos.expectAtLeastNCards(1);
    });
  });
});
