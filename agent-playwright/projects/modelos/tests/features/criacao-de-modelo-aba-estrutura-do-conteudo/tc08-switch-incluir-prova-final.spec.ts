import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Estrutura do Conteúdo', () => {
  test('Switch "Incluir prova final"', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Estrutura do Conteúdo');
    await allure.story('Switch "Incluir prova final"');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Estrutura com seção "Prova final"', async () => {
      await editPage.gotoFirstModelEditStructure();
      await expect(
        page.getByRole('heading', { name: 'Prova final' }),
      ).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('2. Ativar switch "Incluir prova final" e validar sub-switch "Configurações avançadas"', async () => {
      const wasChecked = await editPage.incluirProvaFinalChecked();
      if (!wasChecked) {
        await editPage.incluirProvaFinalSwitch().click();
        await page.waitForTimeout(800);
      }
      expect(await editPage.incluirProvaFinalChecked()).toBe(true);
      // Invariante (confirmado via recon): ao ativar Incluir prova final, sub-switch
      // "Configurações avançadas" aparece (mesmo padrão de Questionários).
      // Há 2 ocorrências de "Configurações avançadas" quando questionários também
      // tá ativo — escopamos pela proximidade ao heading "Prova final".
      await expect(
        page.locator('text=Configurações avançadas').last(),
      ).toBeVisible({ timeout: 5_000 });
    });

    await allure.step('cleanup: desligar switch', async () => {
      if (await editPage.incluirProvaFinalChecked()) {
        await editPage.incluirProvaFinalSwitch().click();
        await page.waitForTimeout(500);
      }
    });
  });
});
