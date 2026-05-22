import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Ações Duplicar e Drag and Drop', () => {
  test('Drag and drop desabilitado quando filtro ativo', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Ações Duplicar e Drag and Drop');
    await allure.story('Drag and drop desabilitado quando filtro ativo');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Aba Design + aplicar filtro "Só páginas"', async () => {
      await editPage.gotoFirstModelEditStructure();
      await page.locator('[data-test-id="tab-design"]').click();
      await page.waitForTimeout(1500);
      // Abre drawer e aplica filtro
      await page.locator('#open-filter').dispatchEvent('click');
      await expect(
        page.locator('[role="dialog"].chakra-modal__content, .chakra-slide'),
      ).toBeVisible({ timeout: 10_000 });
      await page.locator('label.chakra-radio').filter({ hasText: 'Só páginas' }).click();
      await page.locator('#list-filter-apply').dispatchEvent('click');
      await expect(page.locator('#clear-filter')).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('2. Validar drag handles desabilitados / não-interativos', async () => {
      // Invariante: com filtro ativo, drag handles ou ficam hidden, ou viram
      // pointer-events:none, ou ganham atributo data-disabled. Auditamos
      // computedStyle do handle do 1º card.
      const dragHandles = page.locator('[data-test-id="modelos-de-conteudo-design-card-drag-handle"]');
      const handleCount = await dragHandles.count();
      if (handleCount === 0) {
        // Drag handles removidos do DOM — invariante atendida.
        return;
      }
      const firstHandleDisabled = await dragHandles.first().evaluate((el: HTMLElement) => {
        const cs = window.getComputedStyle(el);
        return (
          cs.pointerEvents === 'none' ||
          cs.opacity === '0' ||
          el.hasAttribute('disabled') ||
          el.getAttribute('aria-disabled') === 'true' ||
          el.hasAttribute('data-disabled') ||
          cs.cursor === 'not-allowed'
        );
      });
      expect(
        firstHandleDisabled,
        'drag handle deveria estar desabilitado (pointer-events:none, opacity=0, ou data-disabled) quando filtro aplicado',
      ).toBe(true);
    });

    await allure.step('cleanup: limpar filtro', async () => {
      await page.locator('#clear-filter').dispatchEvent('click');
      await expect(page.locator('#clear-filter')).toHaveCount(0, { timeout: 5_000 });
    });
  });
});
