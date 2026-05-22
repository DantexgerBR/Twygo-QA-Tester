import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Estilo do Conteúdo', () => {
  test('Adicionar campo Idade via menu', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Estilo do Conteúdo');
    await allure.story('Adicionar campo Idade via menu');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir modelo seedado na aba Estilo', async () => {
      await editPage.gotoFirstModelEditStyle();
    });

    await allure.step('2. Abrir menu "Adicionar mais dados"', async () => {
      await editPage.openStyleAddMenu();
    });

    await allure.step('3. Clicar opção "Idade" e validar campo inserido', async () => {
      await editPage.clickStyleAddOption('Idade');
      // Invariante: o menuitem Idade some (foi consumido) E aparece label "Idade"
      // na seção de estilo. REVISAR: seletor exato do campo recém-inserido não
      // confirmado — vamos validar pelo desaparecimento do menuitem (campo já
      // criado) + presença textual de "Idade" no main content.
      await expect(
        page.locator('[data-test-id="content-models-style-add-style-age-range"]'),
      ).toHaveCount(0, { timeout: 5_000 });
      // Verifica que o texto "Idade" agora aparece na área de campos (fora do menu)
      await expect(page.getByText('Idade', { exact: true }).first()).toBeVisible({ timeout: 5_000 });
    });
  });
});
