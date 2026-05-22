import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Listagem de Designs (aba Design do Modelo)', () => {
  test('Filtrar designs por Tipo (Aula/Página)', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Listagem de Designs (aba Design do Modelo)');
    await allure.story('Filtrar designs por Tipo (Aula/Página)');
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

    await allure.step('2. Clicar "Filtrar" e validar drawer com filtros padrão Aula/Página', async () => {
      // Botão filtro pode usar mesmo testId da listagem de modelos
      // (#open-filter / filter-control-open-button — confirmado via recon).
      await page.locator('#open-filter').dispatchEvent('click');
      await expect(
        page.locator('[role="dialog"].chakra-modal__content, .chakra-slide'),
      ).toBeVisible({ timeout: 10_000 });
      // Audit MCP 2026-05-20: UI usa "Só páginas" / "Só aulas" (não "Somente").
      // AT canônico atualizado pra refletir realidade.
      await expect(page.getByText('Só páginas', { exact: true })).toBeVisible({ timeout: 5_000 });
      await expect(page.getByText('Só aulas', { exact: true })).toBeVisible({ timeout: 5_000 });
    });

    await allure.step('3. Selecionar "Só aulas" e aplicar', async () => {
      const radioSomenteAulas = page.locator('label.chakra-radio').filter({ hasText: 'Só aulas' });
      await radioSomenteAulas.click();
      await page.locator('#list-filter-apply').dispatchEvent('click');
      await expect(page.locator('#clear-filter')).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('cleanup: limpar filtro', async () => {
      await page.locator('#clear-filter').dispatchEvent('click');
      await expect(page.locator('#clear-filter')).toHaveCount(0, { timeout: 5_000 });
    });
  });
});
