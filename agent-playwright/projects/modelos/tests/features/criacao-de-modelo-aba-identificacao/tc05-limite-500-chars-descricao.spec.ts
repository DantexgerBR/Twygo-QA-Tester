import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Identificação', () => {
  test('Validar limite de 500 caracteres da Descrição', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Identificação');
    await allure.story('Validar limite de 500 caracteres da Descrição');
    await allure.severity('medium');

    const editPage = new ContentModelEditPage(page);
    const overlongInput = 'A'.repeat(501);

    await allure.step('1. Abrir tela de criação', async () => {
      await editPage.gotoNew();
    });

    await allure.step('2. Preencher Descrição com 501 chars', async () => {
      await editPage.descriptionTextarea().fill(overlongInput);
    });

    await allure.step('3. Validar truncamento OU mensagem de limite', async () => {
      const value = await editPage.descriptionTextarea().inputValue();
      // Invariante: ou trunca para 500 OU bloqueia além de 500.
      expect(value.length).toBeLessThanOrEqual(500);
    });
  });
});
