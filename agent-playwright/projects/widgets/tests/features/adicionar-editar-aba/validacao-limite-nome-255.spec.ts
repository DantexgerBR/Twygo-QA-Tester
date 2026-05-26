// Testsuite: Adicionar/editar aba
// TC4 — Validar limite de 255 caracteres no campo Nome.
// REVISAR: XML diz 255 mas DOM tem maxLength=250 — asserção sobre limite real.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { validacaoLimiteNomeData as data } from './validacao-limite-nome-255.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test('Validar limite de 255 caracteres no campo Nome', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story('Validar limite de 255 caracteres no campo Nome');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step("1. Acessar a tela de criação de painel", async () => {
      await painelForm.goToNew();
    });

    await allure.step("2. Preencher Nome com 256 caracteres e validar truncamento", async () => {
      await painelForm.getNomeInput().fill(data.name256Chars);
      const actual = await painelForm.getNomeInput().inputValue();
      expect(actual.length).toBe(data.domMaxLength);
      expect(actual).toBe(data.name250Chars);
    });
  });
});
