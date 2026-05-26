import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Identificação', () => {
  test('Validação do campo Kit de marca obrigatório (matriz A)', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Identificação');
    await allure.story('Validação Kit de marca obrigatório (matriz A)');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir tela de criação', async () => {
      await editPage.gotoNew();
    });

    await allure.step('2. Categoria A — sem Kit: preencher Nome + Salvar SEM selecionar Kit', async () => {
      await editPage.nameInput().fill(`Modelo TC9 sem Kit ${Date.now()}`);
      // NÃO seleciona Kit
      await editPage.save();
      await page.waitForTimeout(2000);
      // Invariante: URL permanece em /new (validação bloqueou)
      await expect(page).toHaveURL(/\/content_models\/new/, { timeout: 5_000 });
    });
  });
});
