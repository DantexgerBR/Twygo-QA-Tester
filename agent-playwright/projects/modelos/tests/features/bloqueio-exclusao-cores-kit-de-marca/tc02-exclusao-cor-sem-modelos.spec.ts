import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { getOrgId } from '../../../../../src/utils/environment.js';

test.describe('Bloqueio Exclusão Cores Kit de Marca', () => {
  test('Exclusão permitida de cor sem modelos associados', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Bloqueio Exclusão Cores Kit de Marca');
    await allure.story('Exclusão permitida de cor sem modelos associados');
    await allure.severity('high');

    await allure.step('1. Acessar edição do 1º Kit', async () => {
      await safeGoto(page, `/o/${getOrgId()}/appearance`);
      await page.waitForTimeout(2500);
      const firstMoreVert = page.locator('table tr').nth(1).locator('[data-icon="more_vert"], button:has-text("more_vert")').first();
      await firstMoreVert.evaluate((el: HTMLElement) => el.click());
      await page.waitForTimeout(800);
      const editMenuItem = page.getByRole('menuitem', { name: /Editar/i }).first();
      await editMenuItem.click();
      await page.waitForURL(/\/brands\/\d+\/edit/, { timeout: 15_000 });
    });

    await allure.step('2. Ir pra aba Cores', async () => {
      await page.getByRole('tab', { name: 'Cores', exact: true }).click();
      await page.waitForTimeout(2000);
      await expect(page.getByText('Paleta de cores', { exact: true })).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('3. Adicionar cor extra (não-única) e validar que pode ser removida', async () => {
      // Audit MCP: clicar #brand-form-colors-add-button adiciona nova linha
      // com botão #brand-form-colors-row-{n}-remove-button HABILITADO (porque
      // já não é a única cor).
      await page.locator('#brand-form-colors-add-button').evaluate((el: HTMLButtonElement) => el.click());
      await page.waitForTimeout(800);
      // Botão remover da nova cor (linha 1, índice 1)
      const removeRow1 = page.locator('#brand-form-colors-row-1-remove-button');
      await expect(removeRow1).toBeVisible({ timeout: 5_000 });
      await expect(removeRow1).toBeEnabled({ timeout: 5_000 });
    });

    await allure.step('4. Remover a cor adicionada e validar que sumiu do DOM', async () => {
      await page.locator('#brand-form-colors-row-1-remove-button').evaluate((el: HTMLButtonElement) => el.click());
      await page.waitForTimeout(800);
      // Após remover, só sobra row-0
      await expect(page.locator('#brand-form-colors-row-1-remove-button')).toHaveCount(0, { timeout: 5_000 });
      await expect(page.locator('#brand-form-colors-row-0-remove-button')).toBeVisible();
    });
  });
});
