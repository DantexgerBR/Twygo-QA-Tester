import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { getOrgId } from '../../../../../src/utils/environment.js';

test.describe('Bloqueio Exclusão Cores Kit de Marca', () => {
  test('Bloqueio de exclusão de cor em uso por modelo', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Bloqueio Exclusão Cores Kit de Marca');
    await allure.story('Bloqueio de exclusão de cor em uso por modelo');
    await allure.severity('critical');

    await allure.step('1. Acessar edição do 1º Kit (em uso por modelos seedados)', async () => {
      await safeGoto(page, `/o/${getOrgId()}/appearance`);
      await page.waitForTimeout(2500);
      // Aba "Kit de marca" já é default. Pega href do botão "Adicionar" pra
      // descobrir prefix de rotas, depois clica edit do 1º Kit.
      // O 1º Kit listado é o seedado mais antigo, usado pelos modelos atuais.
      // Listagem usa menu more_vert (3 pontinhos). Vamos abrir o menu do 1º
      // Kit e clicar Editar nele.
      const firstMoreVert = page.locator('table tr').nth(1).locator('[data-icon="more_vert"], button:has-text("more_vert")').first();
      await firstMoreVert.evaluate((el: HTMLElement) => el.click());
      await page.waitForTimeout(800);
      // Item de menu "Editar"
      const editMenuItem = page.getByRole('menuitem', { name: /Editar/i }).first();
      await editMenuItem.click();
      await page.waitForURL(/\/brands\/\d+\/edit/, { timeout: 15_000 });
    });

    await allure.step('2. Ir pra aba Cores e validar botão Remover desabilitado quando há 1 cor única', async () => {
      // Aba Cores via getByText (abas usam role=tab — getByRole('tab') é robusto)
      await page.getByRole('tab', { name: 'Cores', exact: true }).click();
      await page.waitForTimeout(2500);
      // Audit MCP: botão #brand-form-colors-row-0-remove-button fica disabled
      // quando há só 1 cor (única). AT (RN 64) interpretado: kit em uso por
      // modelo não pode ter sua cor única removida.
      const removeBtn = page.locator('#brand-form-colors-row-0-remove-button');
      await expect(removeBtn).toBeVisible({ timeout: 10_000 });
      // Invariante de bloqueio: ou disabled OR aria-disabled OR sem handler.
      const disabledStatus = await removeBtn.evaluate((el: HTMLButtonElement) => ({
        disabled: el.disabled,
        ariaDisabled: el.getAttribute('aria-disabled') || '',
      }));
      expect(
        disabledStatus.disabled || disabledStatus.ariaDisabled === 'true',
        `esperava botão "Remover cor" desabilitado quando única cor (regra de bloqueio). Estado: ${JSON.stringify(disabledStatus)}`,
      ).toBe(true);
    });
  });
});
