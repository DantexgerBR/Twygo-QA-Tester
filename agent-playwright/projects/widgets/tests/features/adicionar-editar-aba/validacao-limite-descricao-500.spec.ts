// Testsuite: Adicionar/editar aba
// TC5 — Validar limite de 500 caracteres no campo Descrição.
// REVISAR: campo é ProseMirror rich-text; comportamento de limite a validar
// (pode bloquear digitação OU truncar no submit).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { validacaoLimiteDescricaoData as data } from './validacao-limite-descricao-500.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test('Validar limite de 500 caracteres no campo Descrição', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story('Validar limite de 500 caracteres no campo Descrição');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step("1. Acessar a tela de criação de painel", async () => {
      await painelForm.goToNew();
    });

    await allure.step("2. Preencher Descrição com 501 caracteres e validar limite", async () => {
      await painelForm.getDescricaoEditor().fill(data.description501Chars);
      const actualText = (await painelForm.getDescricaoEditor().innerText()).trim();
      expect(actualText.length).toBeLessThanOrEqual(data.maxLength);
    });
  });
});
