import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Identificação', () => {
  test('Switch "Usar designs sugeridos" exibido somente na criação', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Identificação');
    await allure.story('Switch "Usar designs sugeridos" exibido somente na criação');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir tela de criação e validar switch visível + ativo', async () => {
      await editPage.gotoNew();
      await expect(editPage.usarDesignsSugeridosLabel()).toBeVisible({ timeout: 10_000 });
      expect(await editPage.usarDesignsSugeridosChecked()).toBe(true);
    });
  });
});
