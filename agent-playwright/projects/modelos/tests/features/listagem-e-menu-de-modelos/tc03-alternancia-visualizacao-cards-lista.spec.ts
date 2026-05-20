import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

test.describe('Listagem e Menu de Modelos', () => {
  test('Alternância entre visualização Cards e Lista', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Listagem e Menu de Modelos');
    await allure.story('Alternância entre visualização Cards e Lista');
    await allure.severity('critical');

    const modelos = new ContentModelsListPage(page);

    await allure.step('1. Acessar listagem em formato Cards', async () => {
      await modelos.goToList();
      await modelos.expectListingLoaded();
    });

    await allure.step('2. Clicar toggle Lista e validar colunas esperadas', async () => {
      await modelos.switchToListView();
      await modelos.expectListColumnsVisible();
    });

    await allure.step('3. Voltar para Cards e validar container visível', async () => {
      await modelos.switchToCardsView();
      await expect(modelos.gridViewIcon()).toBeVisible();
      await modelos.expectAtLeastNCards(1);
    });
  });
});
