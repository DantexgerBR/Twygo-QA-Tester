// Testsuite: Adicionar/editar aba
// TC3 — Tentar salvar painel sem preencher o campo obrigatório 'Nome'.
// REVISAR: texto exato da mensagem de erro a confirmar — asserção usa
// aria-invalid + permanência na URL como prova de não-submissão.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { getOrgId } from '../../../../../src/utils/environment.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test("Tentar salvar painel sem preencher o campo obrigatório 'Nome'", async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story("Tentar salvar painel sem preencher o campo obrigatório 'Nome'");
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step("1. Acessar a tela de criação de painel", async () => {
      await painelForm.goToNew();
      await expect(painelForm.getNomeInput()).toBeVisible();
    });

    await allure.step("2. Deixar Nome vazio e clicar em Salvar", async () => {
      await expect(painelForm.getNomeInput()).toHaveValue('');
      await painelForm.getSaveButton().click();
      await expect(page).toHaveURL(new RegExp(`/o/${getOrgId()}/panels/new`));
      await expect(painelForm.getNomeInput()).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
