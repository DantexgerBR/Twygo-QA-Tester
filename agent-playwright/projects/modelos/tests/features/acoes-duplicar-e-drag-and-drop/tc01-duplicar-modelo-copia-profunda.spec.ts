import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Ações Duplicar e Drag and Drop', () => {
  const baseName = 'Modelo Seed Ativo';

  test.afterAll(async ({ browser }) => {
    // Cleanup: deleta qualquer modelo "[Cópia]" deixado pela duplicação.
    const ctx = await browser.newContext({ storageState: 'outputs/.auth/storage.json' });
    const page = await ctx.newPage();
    const ep = new ContentModelEditPage(page);
    await ep.deleteByNameSafe('[Cópia]');
    await ctx.close();
  });

  test('Duplicar modelo com cópia profunda', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Ações Duplicar e Drag and Drop');
    await allure.story('Duplicar modelo com cópia profunda');
    await allure.severity('critical');

    const list = new ContentModelsListPage(page);

    await allure.step('1. Acessar listagem de modelos', async () => {
      await list.goToList();
      await list.expectListingLoaded();
      await list.searchByName(baseName);
      await expect(list.cardByName(baseName).first()).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('2. Clicar Duplicar (icon content_copy) do 1º modelo', async () => {
      const targetCard = list.cardByName(baseName).first();
      await targetCard.locator('[icon="content_copy"]').evaluate((el: HTMLElement) => el.click());
      // UI real exibe "Modelo duplicado com sucesso." (AT documentou "Modelo de
      // conteúdo duplicado com sucesso." — outra divergência de copy).
      // Múltiplos toasts podem empilhar — usar .first().
      await expect(
        page.locator('.chakra-toast').filter({ hasText: 'duplicado com sucesso' }).first(),
      ).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('3. Validar listagem exibe novo modelo "[Cópia] ..."', async () => {
      await list.clearSearch();
      await list.searchByName('[Cópia]');
      await expect(
        page.locator('[data-test-id="content-models-page"]').getByText(/^\[Cópia\]/).first(),
      ).toBeVisible({ timeout: 10_000 });
    });
  });
});
