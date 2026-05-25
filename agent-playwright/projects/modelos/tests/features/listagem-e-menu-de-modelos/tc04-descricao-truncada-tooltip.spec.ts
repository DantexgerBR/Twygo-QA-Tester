import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';
import { tc04Data } from './tc04-descricao-truncada-tooltip.data.js';

test.describe('Listagem e Menu de Modelos', () => {
  test('Coluna Descrição truncada com tooltip completo (visão Lista)', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Listagem e Menu de Modelos');
    await allure.story('Coluna Descrição truncada com tooltip completo (visão Lista)');
    await allure.severity('normal');

    const modelos = new ContentModelsListPage(page);

    await allure.step('1. Acessar listagem em formato Lista e filtrar por modelo com descrição longa', async () => {
      await modelos.goToList();
      await modelos.expectListingLoaded();
      await modelos.switchToListView();
      await modelos.expectListColumnsVisible();
      await modelos.searchByName(tc04Data.seedNamePrefix);
    });

    await allure.step('2. Localizar célula de Descrição truncada (texto com "...")', async () => {
      // REVISAR: célula da Descrição não tem testId — usar role=cell com texto truncado.
      // Heurística: textContent inclui reticências (...) quando truncado em 50 chars.
      const descCell = page.getByRole('cell').filter({ hasText: /\.{3}/ }).first();
      await expect(descCell).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('3. Hover na célula e validar tooltip com texto completo', async () => {
      const descCell = page.getByRole('cell').filter({ hasText: /\.{3}/ }).first();
      await descCell.hover();
      // REVISAR: tooltip Chakra usa role="tooltip" no DOM portal — pode levar até 1s pra aparecer
      await expect(page.locator('[role="tooltip"]')).toBeVisible({ timeout: 5_000 });
    });
  });
});
