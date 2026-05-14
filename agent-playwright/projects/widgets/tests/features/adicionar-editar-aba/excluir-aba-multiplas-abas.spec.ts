// Testsuite: Adicionar/editar aba
// TC14 — Excluir aba quando há mais de uma aba.
// REVISAR: confirmar se há modal de confirmação ou exclusão imediata.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { excluirAbaMultiplasData as data } from './excluir-aba-multiplas-abas.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test('Excluir aba quando há mais de uma aba', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story('Excluir aba quando há mais de uma aba');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step("Pré-condição: criar painel com 2 abas", async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName);
      await painelForm.getLayoutsTab().click();
      await painelForm.addTab(data.segundaAba);
      await expect(page.getByText(data.segundaAba, { exact: true })).toBeVisible();
    });

    await allure.step("1. Validar que botão Excluir está habilitado com 2 abas", async () => {
      await expect(painelForm.getDeleteTabButton(data.segundaAba)).toBeEnabled();
    });

    await allure.step("2. Clicar Excluir na segunda aba", async () => {
      await painelForm.getDeleteTabButton(data.segundaAba).click();
      await expect(page.getByText(data.segundaAba, { exact: true })).toHaveCount(0);
    });

    await allure.step("3. Validar que Excluir fica desabilitado com 1 aba restante", async () => {
      await expect(painelForm.getDeleteTabButton('Nova aba')).toBeDisabled();
    });
  });
});
