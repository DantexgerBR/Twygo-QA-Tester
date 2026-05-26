import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Estrutura do Conteúdo', () => {
  test('Switch "Configurações avançadas" exibe campos adicionais', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Estrutura do Conteúdo');
    await allure.story('Switch "Configurações avançadas" exibe campos adicionais');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Estrutura', async () => {
      await editPage.gotoFirstModelEditStructure();
    });

    await allure.step('2. Ativar "Incluir questionários" (campos básicos)', async () => {
      if (!(await editPage.incluirQuestionariosChecked())) {
        await editPage.incluirQuestionariosSwitch().click();
        await page.waitForTimeout(800);
      }
    });

    await allure.step('3. Ativar "Configurações avançadas" e validar campos adicionais', async () => {
      // Switch identificado por label texto literal — sem testId específico no recon.
      // REVISAR: caso o produto adicione testId no futuro, refatorar pra ele.
      const advancedSwitch = page.locator('label').filter({ hasText: /^Configurações avançadas$/ }).first();
      await advancedSwitch.click();
      await page.waitForTimeout(800);
      // Invariante mínima: pelo menos 1 input/textarea adicional aparece além
      // dos campos básicos. Validamos via aumento na quantidade de inputs visíveis
      // no painel de questionários.
      // Asserção robusta: alguma label nova específica (ex: "Tempo limite",
      // "Tentativas", "Mostrar respostas") aparece.
      // Labels confirmados via recon: "Perguntas em ordem aleatória" + "Respostas obrigatórias"
      await expect(
        page.getByText('Perguntas em ordem aleatória', { exact: true }),
      ).toBeVisible({ timeout: 5_000 });
      await expect(
        page.getByText('Respostas obrigatórias', { exact: true }),
      ).toBeVisible({ timeout: 5_000 });
    });

    await allure.step('cleanup: desligar switches', async () => {
      if (await editPage.incluirQuestionariosChecked()) {
        await editPage.incluirQuestionariosSwitch().click();
        await page.waitForTimeout(500);
      }
    });
  });
});
