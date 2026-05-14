// Testsuite: Adicionar/editar aba
// TC8 — Renomear aba existente via ícone de lápis.
// REVISAR: texto exato do toast de sucesso a confirmar no produto.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { renomearAbaData as data } from './renomear-aba-icone-lapis.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test('Renomear aba existente via ícone de lápis', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story('Renomear aba existente via ícone de lápis');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step("Pré-condição: criar painel e abrir aba Layouts", async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName);
      await painelForm.getLayoutsTab().click();
      await expect(page.getByText('Nova aba', { exact: true })).toBeVisible();
    });

    await allure.step("1. Clicar no botão Renomear (lápis) da aba 'Nova aba'", async () => {
      await painelForm.openRenameModal('Nova aba');
      await expect(painelForm.getRenameModal()).toBeVisible();
      await expect(painelForm.getRenameModalInput()).toHaveValue('Nova aba');
    });

    await allure.step("2. Preencher novo nome", async () => {
      await painelForm.getRenameModalInput().fill(data.newTabName);
      await expect(painelForm.getRenameModalInput()).toHaveValue(data.newTabName);
    });

    await allure.step("3. Confirmar renomeação", async () => {
      await painelForm.getRenameModalSubmit().click();
      await painelForm.getRenameModal().waitFor({ state: 'hidden' });
      await expect(page.getByText(data.newTabName, { exact: true })).toBeVisible();
    });
  });
});
