import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { DesignPageEditPage } from '../../../pages/DesignPageEditPage.js';

test.describe('Criação de Design de Página', () => {
  test('Validar campos obrigatórios da aba Identificação', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Página');
    await allure.story('Validar campos obrigatórios da aba Identificação');
    await allure.severity('critical');

    const dp = new DesignPageEditPage(page);

    await allure.step('1. Abrir tela de criação Página', async () => {
      await dp.gotoFromFirstModel();
    });

    await allure.step('2. Clicar Salvar sem preencher nada', async () => {
      await dp.save();
      await page.waitForTimeout(2000);
    });

    await allure.step('3. Validar bloqueio (URL permanece em /new)', async () => {
      // Invariante: form não submeteu — URL continua em /new.
      // Sem testIds nas mensagens de erro, validamos via não-redirect.
      await expect(page).toHaveURL(/template_designs\/new/, { timeout: 5_000 });
    });
  });
});
