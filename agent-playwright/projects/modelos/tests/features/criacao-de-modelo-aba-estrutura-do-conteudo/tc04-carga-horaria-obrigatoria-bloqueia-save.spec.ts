import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Estrutura do Conteúdo', () => {
  test('Carga horária obrigatória bloqueia salvamento', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Estrutura do Conteúdo');
    await allure.story('Carga horária obrigatória bloqueia salvamento');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Estrutura sem carga horária preenchida', async () => {
      await editPage.gotoFirstModelEditStructure();
      // Modelos seedados foram criados sem carga horária — então o save daqui
      // deve bloquear.
    });

    await allure.step('2. Clicar Salvar e validar bloqueio (sem redirect/sem toast sucesso)', async () => {
      const urlBefore = page.url();
      await editPage.structureSave();
      await page.waitForTimeout(2000);
      // Invariante: URL não mudou OU houve toast de erro (não-sucesso).
      // Como toasts/alerts variam, validamos só que NÃO houve toast de sucesso.
      const toast = page.locator('.chakra-toast').filter({ hasText: /sucesso/i });
      await expect(toast).toHaveCount(0, { timeout: 3_000 });
      // URL permanece na aba structure
      expect(page.url()).toBe(urlBefore);
    });
  });
});
