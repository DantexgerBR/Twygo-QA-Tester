import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Identificação', () => {
  test('Badge "Dica" aparece somente na criação', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Identificação');
    await allure.story('Badge "Dica" aparece somente na criação');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir tela de criação', async () => {
      await editPage.gotoNew();
    });

    await allure.step('2. Validar badge "Dica" visível com texto literal', async () => {
      const badge = editPage.dicaBadge();
      await expect(badge).toBeVisible({ timeout: 10_000 });
      await expect(badge).toContainText('Dica: Para um resultado mais rápido');
      await expect(badge).toContainText('duplicar um modelo existente');
    });
  });
});
