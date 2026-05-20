import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { DesignPageEditPage } from '../../../pages/DesignPageEditPage.js';

test.describe('Criação de Design de Página', () => {
  test('Auto-preenchimento ao selecionar tipo "Capa"', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Página');
    await allure.story('Auto-preenchimento ao selecionar tipo "Capa"');
    await allure.severity('critical');

    const dp = new DesignPageEditPage(page);

    await allure.step('1. Abrir tela de criação Página', async () => {
      await dp.gotoFromFirstModel();
    });

    await allure.step('2. Validar contadores zerados ANTES de selecionar Tipo', async () => {
      // Audit chrome-devtools-mcp 2026-05-20: campos de instruções usam Plate.js
      // (Slate). textContent retorna vazio mas o contador de chars no rodapé
      // expõe o conteúdo real. Antes do Tipo, ambos contadores estão em 0/500.
      await expect(page.getByText('0 / 500').first()).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('3. Selecionar "Capa" no campo Tipo', async () => {
      await dp.selectTipo('Capa');
    });

    await allure.step('4. Validar auto-fill via contadores Plate (49/500 estrutura + 225/500 conteúdo)', async () => {
      // Texto canônico Capa = "Usar sempre como primeira parte de qualquer aula."
      // (49 chars) na instrução de estrutura + ~225 chars na de conteúdo.
      // Contador acima de 0 confirma auto-fill, sem precisar ler texto do Plate.
      await expect(page.getByText(/^\d{2,3}\s*\/\s*500$/).first()).toBeVisible({ timeout: 10_000 });
      // Validação stronger: ambos os campos com conteúdo (não 0/500).
      const zeroCounters = await page.getByText('0 / 500').count();
      expect(zeroCounters, 'esperava ambos contadores acima de 0 após auto-fill').toBe(0);
    });
  });
});
