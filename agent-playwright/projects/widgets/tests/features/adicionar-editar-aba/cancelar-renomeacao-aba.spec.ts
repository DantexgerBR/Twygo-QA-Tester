// Testsuite: Adicionar/editar aba
// TC10 — Cancelar renomeação de aba.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { cancelarRenomeacaoData as data } from './cancelar-renomeacao-aba.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test('Cancelar renomeação de aba', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story('Cancelar renomeação de aba');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step("Pré-condição: criar painel e abrir Layouts", async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName);
      await painelForm.getLayoutsTab().click();
      await expect(page.getByText('Nova aba', { exact: true })).toBeVisible();
    });

    await allure.step("1. Abrir modal Renomear", async () => {
      await painelForm.openRenameModal('Nova aba');
    });

    await allure.step("2. Preencher nome alternativo", async () => {
      await painelForm.getRenameModalInput().fill(data.attemptedName);
    });

    await allure.step("3. Clicar Cancelar e validar nome original preservado", async () => {
      await painelForm.getRenameModalCancel().click();
      await painelForm.getRenameModal().waitFor({ state: 'hidden' });
      await expect(page.getByText('Nova aba', { exact: true })).toBeVisible();
      await expect(page.getByText(data.attemptedName, { exact: true })).toHaveCount(0);
    });
  });
});
