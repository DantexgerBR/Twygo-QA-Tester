import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Imagem', () => {
  test('Opções de padrão de imagem disponíveis', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Imagem');
    await allure.story('Opções de padrão de imagem disponíveis');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Imagem', async () => {
      await editPage.gotoFirstModelEditImage();
    });

    await allure.step('2. Validar 4 opções renderizadas (heading literal)', async () => {
      for (const label of editPage.imageOptionLabels) {
        await expect(
          page.locator('[data-test-id="content-models-image-options"]').getByText(label, { exact: true }),
        ).toBeVisible({ timeout: 5_000 });
      }
    });
  });
});
