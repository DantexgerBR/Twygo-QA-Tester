// Testsuite: Adicionar/editar aba
// TC13 — Voltar do step 'Criar nova aba' para a seleção de tipo.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { voltarStepCriarNovaAbaData as data } from './voltar-step-criar-nova-aba.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test("Voltar do step 'Criar nova aba' para a seleção de tipo", async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story("Voltar do step 'Criar nova aba' para a seleção de tipo");
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step("Pré-condição: criar painel e abrir Layouts", async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName);
      await painelForm.getLayoutsTab().click();
    });

    await allure.step("1. Abrir modal Adicionar aba e clicar Criar nova aba", async () => {
      await painelForm.getAddTabButton().click();
      await painelForm.getCreateNewTabOption().click();
      await expect(painelForm.getCreateTabNameInput()).toBeVisible();
    });

    await allure.step("2. Clicar Voltar e validar retorno ao step de seleção", async () => {
      await painelForm.getCreateTabBackButton().click();
      await expect(painelForm.getCreateNewTabOption()).toBeVisible();
      await expect(painelForm.getImportTabOption()).toBeVisible();
    });
  });
});
