import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Design de Aula', () => {
  test('Acessar criação de Aula via menu Adicionar', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Aula');
    await allure.story('Acessar criação de Aula via menu Adicionar');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Design do modelo', async () => {
      await editPage.gotoFirstModelEditStructure();
      await page.getByRole('tab', { name: 'Design', exact: true }).click();
      await expect(page.getByRole('tab', { name: 'Design', exact: true })).toHaveAttribute(
        'aria-selected',
        'true',
        { timeout: 10_000 },
      );
    });

    await allure.step('2. Clicar Adicionar e validar menu com Aula + Página', async () => {
      await page.locator('[data-test-id="content-models-design-add-menu-button"]').click();
      await expect(
        page.locator('[data-test-id="content-models-design-add-lesson"]'),
      ).toBeVisible({ timeout: 5_000 });
      await expect(
        page.locator('[data-test-id="content-models-design-add-page"]'),
      ).toBeVisible({ timeout: 5_000 });
    });

    await allure.step('3. Clicar "Aula" e validar redirect pra criação', async () => {
      await page.locator('[data-test-id="content-models-design-add-lesson"]').click();
      await expect(page).toHaveURL(/template_designs\/new\?kind=lesson/, { timeout: 15_000 });
    });
  });
});
