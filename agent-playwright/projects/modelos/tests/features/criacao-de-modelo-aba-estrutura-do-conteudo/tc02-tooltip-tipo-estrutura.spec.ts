import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Estrutura do Conteúdo', () => {
  test('Tooltip do Tipo de estrutura', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Estrutura do Conteúdo');
    await allure.story('Tooltip do Tipo de estrutura');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Estrutura', async () => {
      await editPage.gotoFirstModelEditStructure();
    });

    await allure.step('2. Hover no ícone info do label "Tipo de estrutura" e validar tooltip', async () => {
      // Hover no label (ou ícone help adjacente). Chakra tooltip = role="tooltip"
      const label = page.locator('label[for="content-models-structure-type-select"]');
      // Ícone help (svg) fica ao lado do texto
      const helpIcon = label.locator('svg').last();
      if (await helpIcon.isVisible().catch(() => false)) {
        await helpIcon.hover();
      } else {
        await label.hover();
      }
      await expect(
        page.locator('[role="tooltip"]').filter({ hasText: 'Define se o curso possui apenas atividades sequenciais' }),
      ).toBeVisible({ timeout: 5_000 });
    });
  });
});
