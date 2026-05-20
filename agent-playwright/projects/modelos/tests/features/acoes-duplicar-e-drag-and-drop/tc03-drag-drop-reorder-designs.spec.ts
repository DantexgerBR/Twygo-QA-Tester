import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Ações Duplicar e Drag and Drop', () => {
  test('Drag and drop reorder designs', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Ações Duplicar e Drag and Drop');
    await allure.story('Drag and drop reorder designs');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Acessar aba Design com pelo menos 2 designs', async () => {
      await editPage.gotoFirstModelEditStructure();
      await page.locator('[data-test-id="tab-design"]').click();
      await page.waitForTimeout(2000);
      // Garante ao menos 2 cards (não-drag-handle) pra ter o que reordenar
      const cardsNonHandle = page.locator('[data-test-id^="modelos-de-conteudo-design-card-"]:not([data-test-id="modelos-de-conteudo-design-card-drag-handle"])');
      const count = await cardsNonHandle.count();
      expect(count, 'esperava pelo menos 2 designs pra reorder').toBeGreaterThanOrEqual(2);
    });

    await allure.step('2. Arrastar 2º design pra primeira posição via drag handle', async () => {
      const cardsNonHandle = page.locator('[data-test-id^="modelos-de-conteudo-design-card-"]:not([data-test-id="modelos-de-conteudo-design-card-drag-handle"])');
      const firstCardId = await cardsNonHandle.nth(0).getAttribute('data-test-id');
      const secondCardId = await cardsNonHandle.nth(1).getAttribute('data-test-id');
      // Drag handle interno do 2º card
      const secondHandle = page.locator(`[data-test-id="${secondCardId}"] [data-test-id="modelos-de-conteudo-design-card-drag-handle"]`).first();
      const firstCardEl = page.locator(`[data-test-id="${firstCardId}"]`).first();
      await secondHandle.dragTo(firstCardEl);
      await page.waitForTimeout(2000);
      // Invariante: ordem mudou (cardId que era 2º agora é 1º)
      const newFirstCardId = await cardsNonHandle.nth(0).getAttribute('data-test-id');
      expect(newFirstCardId, 'reorder não persistiu').toBe(secondCardId);
    });
  });
});
