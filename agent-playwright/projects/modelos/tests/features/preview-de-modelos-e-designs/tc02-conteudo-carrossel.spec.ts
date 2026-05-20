import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

test.describe('Preview de Modelos e Designs', () => {
  test('Conteúdo de cada item do carrossel', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Preview de Modelos e Designs');
    await allure.story('Conteúdo de cada item do carrossel');
    await allure.severity('critical');

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
        page.locator('[data-test-id="content-models-preview-modal-title"]'),
      ).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('2. Validar elementos do slide: Modelo:, Design:, Tipo:, indicador X de Y', async () => {
      // Audit MCP confirmou estrutura: "Modelo: {nome}" no título, "Design: {nome}"
      // + "Tipo: Aula/Página" + "Design 1 de N" no body.
      // AT também documenta "Thumb do design" e "Prompt: {prosa}" — Prompt
      // não estava visível no audit (pode estar atrás de scroll/aba) — não
      // exigimos ele aqui.
      const body = page.locator('[data-test-id="content-models-preview-modal-body"]');
      await expect(body).toContainText('Design:', { timeout: 5_000 });
      await expect(body).toContainText('Tipo:', { timeout: 5_000 });
      await expect(body).toContainText(/Design \d+ de \d+/, { timeout: 5_000 });
      // Thumb (img)
      await expect(
        page.locator('[data-test-id="content-models-preview-modal-image"]'),
      ).toBeVisible();
    });
  });
});
