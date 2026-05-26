import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Listagem de Designs (aba Design do Modelo)', () => {
  test('Combinação de filtros + busca textual na listagem de designs', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Listagem de Designs (aba Design do Modelo)');
    await allure.story('Combinação de filtros + busca textual na listagem de designs');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Design do modelo', async () => {
      await editPage.gotoFirstModelEditStructure();
      await page.getByRole('tab', { name: 'Design', exact: true }).click();
      await page.waitForTimeout(2000);
    });

    await allure.step('2. Buscar "Design" via input de busca da aba', async () => {
      const searchInput = page.locator('input[placeholder*="ome do design" i]').first();
      if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await searchInput.fill('Design');
        await page.waitForTimeout(1000);
      }
    });

    await allure.step('3-5. Abrir drawer + filtro "Só páginas" + Aplicar', async () => {
      // Limpa filtro residual
      const clearBtn = page.locator('#clear-filter');
      if (await clearBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await clearBtn.dispatchEvent('click');
        await page.waitForTimeout(800);
      }
      await page.locator('#open-filter').dispatchEvent('click');
      await expect(page.locator('[role="dialog"].chakra-modal__content, .chakra-slide')).toBeVisible({ timeout: 10_000 });
      await page.locator('label.chakra-radio').filter({ hasText: 'Só páginas' }).click();
      await page.locator('#list-filter-apply').dispatchEvent('click');
      await expect(page.locator('#clear-filter')).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('6. Limpar filtros', async () => {
      await page.locator('#clear-filter').dispatchEvent('click');
      await expect(page.locator('#clear-filter')).toHaveCount(0, { timeout: 5_000 });
    });
  });
});
