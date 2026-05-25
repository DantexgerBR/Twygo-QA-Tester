import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Estilo do Conteúdo', () => {
  test('Botão "Adicionar mais dados" exibe menu com 6 opções', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Estilo do Conteúdo');
    await allure.story('Botão "Adicionar mais dados" exibe menu com 6 opções');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir modelo seedado na aba Estilo', async () => {
      await editPage.gotoFirstModelEditStyle();
    });

    await allure.step('2. Clicar "Adicionar mais dados" e validar 6 opções no menu', async () => {
      await editPage.openStyleAddMenu();
      for (const option of Object.keys(editPage.styleAddOptionByTestId)) {
        const tid = editPage.styleAddOptionByTestId[option as keyof typeof editPage.styleAddOptionByTestId];
        await expect(
          page.locator(`[data-test-id="${tid}"]`),
          `opção "${option}" deveria estar visível`,
        ).toBeVisible({ timeout: 5_000 });
      }
    });
  });
});
