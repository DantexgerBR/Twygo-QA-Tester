import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Ações Duplicar e Drag and Drop', () => {
  test('Duplicar design individual', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Ações Duplicar e Drag and Drop');
    await allure.story('Duplicar design individual');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Acessar aba Design do modelo', async () => {
      await editPage.gotoFirstModelEditStructure();
      await page.getByRole('tab', { name: 'Design', exact: true }).click();
      await expect(page.getByRole('tab', { name: 'Design', exact: true })).toHaveAttribute(
        'aria-selected',
        'true',
        { timeout: 10_000 },
      );
    });

    await allure.step('2. Duplicar 1º design (icon content_copy)', async () => {
      const firstCard = page.locator('[data-test-id^="modelos-de-conteudo-design-card-"]:not([data-test-id="modelos-de-conteudo-design-card-drag-handle"])').first();
      await firstCard.locator('[icon="content_copy"]').evaluate((el: HTMLElement) => el.click());
      // Invariante robusta: toast de sucesso. Count de cards é frágil quando há
      // paginação/scroll lazy — o card duplicado pode ir pra fora do viewport
      // imediato. O backend pode usar tempo variável pra refletir na listagem.
      await expect(
        page.locator('.chakra-toast').filter({ hasText: /duplicad|copiado|sucesso/i }).first(),
      ).toBeVisible({ timeout: 15_000 });
    });
  });
});
