import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

test.describe('Preview de Modelos e Designs', () => {
  test('Navegar entre slides no carrossel', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Preview de Modelos e Designs');
    await allure.story('Navegar entre slides no carrossel');
    await allure.severity('high');

    const list = new ContentModelsListPage(page);

    await allure.step('1. Abrir Preview do modelo', async () => {
      await list.goToList();
      await list.expectListingLoaded();
      const previewBtn = page
        .locator('[data-test-id="content-models-page"] [id*="custom-element"][id$="-button-0"]')
        .first();
      await previewBtn.waitFor({ state: 'visible', timeout: 15_000 });
      await page.waitForTimeout(800);
      await previewBtn.evaluate((el: HTMLElement) => el.click());
      await expect(
        page.locator('[data-test-id="content-models-preview-modal-body"]'),
      ).toContainText('Design 1', { timeout: 10_000 });
    });

    await allure.step('2. Clicar "Próximo design" e validar indicador "Design 2"', async () => {
      await page
        .locator('[data-test-id="content-models-preview-modal-next"]')
        .evaluate((el: HTMLElement) => el.click());
      await page.waitForTimeout(1000);
      await expect(
        page.locator('[data-test-id="content-models-preview-modal-body"]'),
      ).toContainText('Design 2', { timeout: 5_000 });
    });
  });
});
