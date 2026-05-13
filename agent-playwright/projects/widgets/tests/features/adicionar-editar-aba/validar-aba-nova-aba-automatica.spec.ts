// Testsuite: Adicionar/editar aba
// TC7 — Validar exibição da aba inicial 'Nova aba' criada automaticamente.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { validarNovaAbaAutomaticaData as data } from './validar-aba-nova-aba-automatica.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test("Validar exibição da aba inicial 'Nova aba' criada automaticamente", async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story("Validar exibição da aba inicial 'Nova aba' criada automaticamente");
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step("1. Acessar tela de criação (painel em branco)", async () => {
      await painelForm.goToNew();
    });

    await allure.step("2. Validar que aba Layouts está desabilitada antes de salvar", async () => {
      await expect(painelForm.getLayoutsTab()).toBeDisabled();
    });

    await allure.step("3. Preencher Nome e salvar", async () => {
      await painelForm.createPanel(data.panelName);
      await expect(painelForm.getLayoutsTab()).toBeEnabled();
    });

    await allure.step("4. Clicar em Layouts e validar 'Nova aba' criada automaticamente", async () => {
      await painelForm.getLayoutsTab().click();
      await expect(painelForm.getLayoutsTab()).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByText('Nova aba', { exact: true })).toBeVisible();
    });
  });
});
