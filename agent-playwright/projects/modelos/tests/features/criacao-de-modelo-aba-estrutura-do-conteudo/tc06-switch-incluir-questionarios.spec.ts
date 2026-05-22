import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Estrutura do Conteúdo', () => {
  test('Switch "Incluir questionários" exibe configurações básicas', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Estrutura do Conteúdo');
    await allure.story('Switch "Incluir questionários" exibe configurações básicas');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Estrutura com seção "Questionários ao longo do conteúdo"', async () => {
      await editPage.gotoFirstModelEditStructure();
      await expect(
        page.getByRole('heading', { name: 'Questionários ao longo do conteúdo' }),
      ).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('2. Ativar switch "Incluir questionários" e validar configurações expostas', async () => {
      const wasChecked = await editPage.incluirQuestionariosChecked();
      if (!wasChecked) {
        await editPage.incluirQuestionariosSwitch().click();
        await page.waitForTimeout(800);
      }
      expect(await editPage.incluirQuestionariosChecked()).toBe(true);
      // Invariante: switch "Configurações avançadas" (sub-switch) aparece quando
      // questionários ativo. Texto literal "Configurações avançadas".
      await expect(
        page.getByText('Configurações avançadas', { exact: true }),
      ).toBeVisible({ timeout: 5_000 });
    });

    await allure.step('cleanup: desativar switch pra próximo TC começar limpo', async () => {
      if (await editPage.incluirQuestionariosChecked()) {
        await editPage.incluirQuestionariosSwitch().click();
        await page.waitForTimeout(500);
      }
    });
  });
});
