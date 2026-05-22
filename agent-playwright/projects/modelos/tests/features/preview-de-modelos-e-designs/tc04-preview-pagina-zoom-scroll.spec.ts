import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

test.describe('Preview de Modelos e Designs', () => {
  test('Preview de Design tipo Página tem zoom com scroll', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Preview de Modelos e Designs');
    await allure.story('Preview de Design tipo Página tem zoom com scroll');
    await allure.severity('medium');

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
      ).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('2. Navegar até slide com Tipo: Página', async () => {
      // Audit MCP: zoom só renderiza pra slides do tipo Página. O 1º design
      // pode ser de qualquer tipo — iteramos até achar Página.
      const body = page.locator('[data-test-id="content-models-preview-modal-body"]');
      let maxIter = 40;
      while (maxIter-- > 0) {
        const text = (await body.innerText()) || '';
        if (text.includes('Tipo: Página')) break;
        await page
          .locator('[data-test-id="content-models-preview-modal-next"]')
          .evaluate((el: HTMLElement) => el.click());
        await page.waitForTimeout(400);
      }
      await expect(body).toContainText('Tipo: Página', { timeout: 5_000 });
    });

    await allure.step('3. Validar controles de zoom (aria-label Aumentar/Diminuir)', async () => {
      await expect(
        page.locator('button[aria-label="Aumentar zoom"]'),
      ).toBeVisible({ timeout: 5_000 });
      await expect(
        page.locator('button[aria-label="Diminuir zoom"]'),
      ).toBeVisible({ timeout: 5_000 });
    });
  });
});
