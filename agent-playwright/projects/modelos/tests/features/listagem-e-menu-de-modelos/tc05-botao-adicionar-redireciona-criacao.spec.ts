import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

test.describe('Listagem e Menu de Modelos', () => {
  test('Botão Adicionar redireciona para criação', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Listagem e Menu de Modelos');
    await allure.story('Botão Adicionar redireciona para criação');
    await allure.severity('critical');

    const modelos = new ContentModelsListPage(page);

    await allure.step('1. Acessar listagem e validar botão Adicionar visível', async () => {
      await modelos.goToList();
      await expect(modelos.addButton()).toBeVisible({ timeout: 60_000 });
    });

    await allure.step('2. Clicar Adicionar e validar redirect para tela de criação', async () => {
      await modelos.clickAdd();
      await expect(page).toHaveURL(/\/content_models\/new/, { timeout: 30_000 });
    });

    await allure.step('3. Validar aba Identificação ativa por default no form', async () => {
      const identTab = page.locator('[data-test-id="tab-identification"]');
      await expect(identTab).toBeVisible({ timeout: 10_000 });
      await expect(identTab).toHaveAttribute('aria-selected', 'true');
    });
  });
});
