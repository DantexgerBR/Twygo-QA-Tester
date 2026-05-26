import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

test.describe('Preview de Modelos e Designs', () => {
  test('Abrir Preview de Modelo via card', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Preview de Modelos e Designs');
    await allure.story('Abrir Preview de Modelo via card');
    await allure.severity('critical');

    const list = new ContentModelsListPage(page);

    await allure.step('1. Acessar listagem de modelos em Cards', async () => {
      await list.goToList();
      await list.expectListingLoaded();
      await list.expectAtLeastNCards(1);
    });

    await allure.step('2. Clicar ícone visibility do 1º modelo e validar modal Preview', async () => {
      // Aguarda o botão Preview estar montado no DOM (React precisa hidratar).
      const previewBtn = page
        .locator('[data-test-id="content-models-page"] [id*="custom-element"][id$="-button-0"]')
        .first();
      await previewBtn.waitFor({ state: 'visible', timeout: 15_000 });
      await page.waitForTimeout(800);
      await previewBtn.evaluate((el: HTMLElement) => el.click());
      await expect(
        page.locator('[data-test-id="content-models-preview-modal-title"]'),
      ).toBeVisible({ timeout: 15_000 });
      await expect(
        page.locator('[data-test-id="content-models-preview-modal-title"]'),
      ).toContainText('Modelo:');
    });
  });
});
