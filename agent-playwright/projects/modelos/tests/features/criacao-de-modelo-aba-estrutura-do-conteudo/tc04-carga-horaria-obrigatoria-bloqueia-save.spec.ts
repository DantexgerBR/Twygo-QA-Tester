import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Estrutura do Conteúdo', () => {
  test('Validação obrigatoriedade da Carga horária (matriz A)', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Estrutura do Conteúdo');
    await allure.story('Validação obrigatoriedade da Carga horária (matriz A)');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('[A] Sem carga horária → save bloqueado', async () => {
      await editPage.gotoFirstModelEditStructure();
      // Modelos seedados ANTES do v1.1 não tinham carga horária preenchida.
      // Save deveria bloquear. Invariante: URL não muda + sem toast sucesso.
      const urlBefore = page.url();
      await editPage.structureSave();
      await page.waitForTimeout(2000);
      const toastSucesso = page.locator('.chakra-toast').filter({ hasText: /sucesso/i });
      await expect(toastSucesso, '[A] esperava ausência de toast sucesso (save bloqueado)').toHaveCount(0, {
        timeout: 3_000,
      });
      expect(page.url(), '[A] URL não deveria mudar quando bloqueio ativo').toBe(urlBefore);
    });
  });
});
