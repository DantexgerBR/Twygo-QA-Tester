import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

test.describe('Criação de Modelo - Aba Identificação', () => {
  test('Badge "Dica" NÃO aparece na edição', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Identificação');
    await allure.story('Badge "Dica" NÃO aparece na edição');
    await allure.severity('high');

    const listPage = new ContentModelsListPage(page);
    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Acessar listagem com pelo menos 1 modelo seedado', async () => {
      await listPage.goToList();
      await listPage.expectListingLoaded();
      await listPage.expectAtLeastNCards(1);
    });

    await allure.step('2. Clicar Editar do primeiro card e abrir /edit', async () => {
      // Edit icon id pattern: content_models-{id}-edit-element-*-button-1
      const editIcon = page
        .locator('[data-test-id="content-models-page"] [id*="-edit-element-"]')
        .first();
      await editIcon.evaluate((el: HTMLElement) => el.click());
      await expect(page).toHaveURL(/\/content_models\/\d+\/edit/, { timeout: 15_000 });
      await editPage.expectIdentificationTabActive();
    });

    await allure.step('3. Validar badge "Dica" NÃO está visível', async () => {
      // Aguarda render pra evitar false-positive de "ainda não montou"
      await page.waitForTimeout(1500);
      await expect(editPage.dicaBadge()).toHaveCount(0);
    });
  });
});
