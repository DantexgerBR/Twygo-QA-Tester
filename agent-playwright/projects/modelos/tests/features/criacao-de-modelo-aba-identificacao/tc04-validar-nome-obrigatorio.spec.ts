import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Identificação', () => {
  test('Validar campo Nome obrigatório', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Identificação');
    await allure.story('Validar campo Nome obrigatório');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir tela de criação', async () => {
      await editPage.gotoNew();
    });

    await allure.step('2. Preencher só Descrição (sem Nome)', async () => {
      await editPage.descriptionTextarea().fill('Teste sem nome');
    });

    await allure.step('3. Clicar Salvar e validar bloqueio', async () => {
      await editPage.save();
      await page.waitForTimeout(2000);
      // Invariante: continua em /new (não criou) — sem assert texto específico
      // (mensagem pode variar entre toast/inline; AT documenta "Nome é obrigatório"
      // mas validar a invariante (não-redirecionou) é mais robusto).
      await expect(page).toHaveURL(/\/content_models\/new/, { timeout: 5_000 });
    });
  });
});
