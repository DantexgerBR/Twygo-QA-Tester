import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { DesignPageEditPage } from '../../../pages/DesignPageEditPage.js';

// FIXME (2026-05-20): hover no ícone help do campo Tipo não dispara tooltip Chakra.
// REVISAR com QA Lead: ícone help está visível mas o componente tooltip pode usar
// padrão diferente (popover, click instead of hover, etc). Re-tentativa com
// chrome-devtools-mcp pode revelar o seletor correto.
test.describe.fixme('Criação de Design de Página', () => {
  test('Tooltip do campo Tipo', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Página');
    await allure.story('Tooltip do campo Tipo');
    await allure.severity('medium');

    const dp = new DesignPageEditPage(page);

    await allure.step('1. Abrir tela de criação Página', async () => {
      await dp.gotoFromFirstModel();
    });

    await allure.step('2. Hover no ícone help do campo Tipo e validar tooltip', async () => {
      const label = page.locator('label[for="content-models-page-type-creatable"]');
      const helpIcon = label.locator('svg').last();
      if (await helpIcon.isVisible().catch(() => false)) {
        await helpIcon.hover();
      } else {
        await label.hover();
      }
      await expect(
        page.locator('[role="tooltip"]').filter({ hasText: 'Classifique este design por tipo de parte' }),
      ).toBeVisible({ timeout: 5_000 });
    });
  });
});
