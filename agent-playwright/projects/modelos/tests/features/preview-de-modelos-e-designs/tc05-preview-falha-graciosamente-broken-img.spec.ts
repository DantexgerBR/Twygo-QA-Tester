import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';
import { expectImageLoaded } from '../../../../../src/utils/visualAsserts.js';

test.describe('Preview de Modelos e Designs', () => {
  test('Preview falha graciosamente quando imagem do design não carrega', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Preview de Modelos e Designs');
    await allure.story('Preview falha graciosamente quando imagem do design não carrega');
    await allure.severity('high');

    const list = new ContentModelsListPage(page);

    await allure.step('1. Acessar listagem e abrir Preview', async () => {
      await list.goToList();
      await list.expectListingLoaded();
      const previewBtn = page
        .locator('[data-test-id="content-models-page"] [id*="custom-element"][id$="-button-0"]')
        .first();
      await previewBtn.waitFor({ state: 'visible', timeout: 15_000 });
      await page.waitForTimeout(800);
      await previewBtn.evaluate((el: HTMLElement) => el.click());
      await expect(
        page.locator('[data-test-id="content-models-preview-modal-image"]'),
      ).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('2-3. Validar via expectImageLoaded que thumb do design renderiza com naturalWidth>0', async () => {
      // Skill validar-preview-visual-twygo: helper detecta broken-img que
      // o toBeVisible() simples não pega. Quando img.complete=true && naturalWidth>=64,
      // helper passa; caso contrário falha com mensagem específica.
      const thumb = page.locator('[data-test-id="content-models-preview-modal-image"]');
      await expectImageLoaded(thumb, { timeout: 10_000, expectMinWidth: 1 });
    });
  });
});
