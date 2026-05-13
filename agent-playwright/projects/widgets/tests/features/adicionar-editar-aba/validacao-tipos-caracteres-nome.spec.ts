// Testsuite: Adicionar/editar aba
// TC6 — Validar tipos de caracteres aceitos no campo Nome.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { validacaoTiposCaracteresData as data } from './validacao-tipos-caracteres-nome.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test('Validar tipos de caracteres aceitos no campo Nome', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story('Validar tipos de caracteres aceitos no campo Nome');
    await allure.severity('minor');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step("1. Acessar tela de criação", async () => {
      await painelForm.goToNew();
    });

    await allure.step("2. Preencher Nome com caracteres especiais", async () => {
      await painelForm.getNomeInput().fill(data.specialCharsName);
      await expect(painelForm.getNomeInput()).toHaveValue(data.specialCharsName);
    });

    await allure.step("3. Salvar e validar persistência", async () => {
      await painelForm.getSaveButton().click();
      await page.waitForURL(/\/panels\/\d+\/edit/);
      await expect(painelForm.getNomeInput()).toHaveValue(data.specialCharsName);
    });
  });
});
