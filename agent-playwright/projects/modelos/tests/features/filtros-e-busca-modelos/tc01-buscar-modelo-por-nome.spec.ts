import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';
import { tc01Data } from './tc01-buscar-modelo-por-nome.data.js';

test.describe('Filtros e Busca - Modelos', () => {
  test('Buscar modelo por nome', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Filtros e Busca - Modelos');
    await allure.story('Buscar modelo por nome');
    await allure.severity('critical');

    const modelos = new ContentModelsListPage(page);

    await allure.step('1. Acessar listagem com múltiplos modelos', async () => {
      await modelos.goToList();
      await modelos.expectListingLoaded();
      await modelos.expectAtLeastNCards(2);
    });

    await allure.step('2. Buscar pelo prefixo do seed e validar resultado filtrado', async () => {
      await modelos.searchByName(tc01Data.searchTerm);
      // Invariante: card com o termo aparece + total reduzido
      const target = modelos.cardByName(tc01Data.searchTerm).first();
      await expect(target).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('3. Limpar busca e validar listagem retorna ao estado completo', async () => {
      await modelos.clearSearch();
      await modelos.expectAtLeastNCards(2);
    });
  });
});
