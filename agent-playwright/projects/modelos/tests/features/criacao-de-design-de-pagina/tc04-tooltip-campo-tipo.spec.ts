import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { DesignPageEditPage } from '../../../pages/DesignPageEditPage.js';

test.describe('Criação de Design de Página', () => {
  test('Tooltip do campo Tipo', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Página');
    await allure.story('Tooltip do campo Tipo');
    await allure.severity('medium');

    const dp = new DesignPageEditPage(page);

    await allure.step('1. Abrir tela de criação Página', async () => {
      await dp.gotoFromFirstModel();
    });

    await allure.step('2. Hover no .tooltip-icon do campo Tipo e validar tooltip', async () => {
      // Audit chrome-devtools-mcp 2026-05-20: ícone help é <span class="tooltip-icon">
      // filho do label (não svg.last()). Hover dispara tooltip canônico
      // com role="tooltip" após delay Chakra (~800ms).
      const tooltipIcon = page.locator(
        'label[for="content-models-page-type-creatable"] .tooltip-icon',
      );
      await tooltipIcon.hover();
      await expect(
        page.locator('[role="tooltip"]').filter({ hasText: 'Classifique este design por tipo de parte' }),
      ).toBeVisible({ timeout: 5_000 });
    });
  });
});
