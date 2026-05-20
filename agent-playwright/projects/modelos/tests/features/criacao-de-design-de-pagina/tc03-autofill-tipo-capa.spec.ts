import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { DesignPageEditPage } from '../../../pages/DesignPageEditPage.js';

// FIXME (2026-05-20): produto não realiza auto-fill das instruções ao selecionar Tipo.
// Diagnóstico: ao selecionar "Capa" no creatable select Tipo, o campo "Instruções
// de estrutura para a IA*" permanece vazio (screenshot capturado em
// test-artifacts/...-to-ao-selecionar-tipo-Capa--chromium/). AT (RN 33.1) descreve
// que o auto-fill deveria popular o textarea com "Usar sempre como primeira parte
// de qualquer aula." mas isso não ocorre na UI. Destinatário: PO/QA Lead validar
// se é bug ou se o auto-fill foi descopado.
test.describe.fixme('Criação de Design de Página', () => {
  test('Auto-preenchimento ao selecionar tipo "Capa"', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Página');
    await allure.story('Auto-preenchimento ao selecionar tipo "Capa"');
    await allure.severity('critical');

    const dp = new DesignPageEditPage(page);

    await allure.step('1. Abrir tela de criação Página', async () => {
      await dp.gotoFromFirstModel();
    });

    await allure.step('2. Selecionar "Capa" no campo Tipo', async () => {
      await dp.selectTipo('Capa');
    });

    await allure.step('3. Validar auto-fill das instruções de estrutura', async () => {
      // Plate editor é contenteditable — texto pode ser inferido via conteúdo do label area.
      // Invariante: o texto "Usar sempre como primeira parte de qualquer aula." aparece
      // em algum lugar da seção de instruções de estrutura.
      await expect(
        page.getByText('Usar sempre como primeira parte de qualquer aula', { exact: false }).first(),
      ).toBeVisible({ timeout: 10_000 });
    });
  });
});
