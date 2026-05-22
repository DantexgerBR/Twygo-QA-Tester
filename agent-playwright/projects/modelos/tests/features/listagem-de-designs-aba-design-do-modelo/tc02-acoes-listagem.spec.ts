import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Listagem de Designs (aba Design do Modelo)', () => {
  test('Ações da listagem de designs', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Listagem de Designs (aba Design do Modelo)');
    await allure.story('Ações da listagem de designs');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Design do modelo', async () => {
      await editPage.gotoFirstModelEditStructure();
      await page.locator('[data-test-id="tab-design"]').click();
      await expect(page.locator('[data-test-id="tab-design"]')).toHaveAttribute(
        'aria-selected',
        'true',
        { timeout: 10_000 },
      );
    });

    await allure.step('2. Validar ações Editar (edit), Duplicar (content_copy), Excluir (delete) no 1º card', async () => {
      // Audit chrome-devtools-mcp 2026-05-20: IDs reais por card seguem padrão
      // template_designs-{id}-custom-element-*-button-N com [icon=...] no <span>
      // interno. AT documenta 3 ações; UI tem +1 (visibility). Validamos pelos
      // ícones canônicos.
      const firstCard = page.locator('[data-test-id^="modelos-de-conteudo-design-card-"]:not([data-test-id="modelos-de-conteudo-design-card-drag-handle"])').first();
      await expect(firstCard.locator('[icon="edit"]')).toBeVisible({ timeout: 5_000 });
      await expect(firstCard.locator('[icon="content_copy"]')).toBeVisible({ timeout: 5_000 });
      await expect(firstCard.locator('[icon="delete"]')).toBeVisible({ timeout: 5_000 });
    });
  });
});
