// Testsuite: Adicionar/editar aba
// TC11 — Adicionar nova aba via opção 'Criar nova aba'.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { adicionarNovaAbaData as data } from './adicionar-nova-aba-criar.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test("Adicionar nova aba via opção 'Criar nova aba'", async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story("Adicionar nova aba via opção 'Criar nova aba'");
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step("Pré-condição: criar painel e abrir Layouts", async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName);
      await painelForm.getLayoutsTab().click();
    });

    await allure.step("1. Clicar em Adicionar aba e validar modal", async () => {
      await painelForm.getAddTabButton().click();
      await expect(painelForm.getAddTabModal()).toBeVisible();
      await expect(painelForm.getCreateNewTabOption()).toBeVisible();
      await expect(painelForm.getImportTabOption()).toBeVisible();
    });

    await allure.step("2. Selecionar 'Criar nova aba'", async () => {
      await painelForm.getCreateNewTabOption().click();
      await expect(painelForm.getCreateTabNameInput()).toBeVisible();
      await expect(painelForm.getCreateTabSubmitButton()).toBeDisabled();
    });

    await allure.step("3. Preencher nome e validar habilitação do botão", async () => {
      await painelForm.getCreateTabNameInput().fill(data.newTabName);
      await expect(painelForm.getCreateTabSubmitButton()).toBeEnabled();
    });

    await allure.step("4. Submeter e validar aba criada na lista", async () => {
      await painelForm.getCreateTabSubmitButton().click();
      await painelForm.getAddTabModal().waitFor({ state: 'hidden' });
      await expect(page.getByText(data.newTabName, { exact: true })).toBeVisible();
    });
  });
});
