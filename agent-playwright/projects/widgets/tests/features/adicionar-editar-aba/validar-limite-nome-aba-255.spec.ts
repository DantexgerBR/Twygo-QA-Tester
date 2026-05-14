// Testsuite: Adicionar/editar aba
// TC9 — Validar 255 caracteres para o 'Nome da aba'.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { limiteNomeAbaData as data } from './validar-limite-nome-aba-255.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test("Validar 255 caracteres para o 'Nome da aba'", async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story("Validar 255 caracteres para o 'Nome da aba'");
    await allure.severity('critical');
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

    await allure.step("2. Tentar preencher 256 chars e validar truncamento em 255", async () => {
      await painelForm.getRenameModalInput().fill(data.name256Chars);
      const actual = await painelForm.getRenameModalInput().inputValue();
      expect(actual.length).toBe(data.maxLength);
      expect(actual).toBe(data.name255Chars);
    });

    await allure.step("3. Confirmar renomeação com 255 chars", async () => {
      await painelForm.getRenameModalSubmit().click();
      await painelForm.getRenameModal().waitFor({ state: 'hidden' });
    });
  });
});
