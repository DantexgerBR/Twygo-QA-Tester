// Testsuite: Adicionar/editar aba
// TC15 — Tentar excluir aba quando há apenas uma aba.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { tentarExcluirAbaUnicaData as data } from './tentar-excluir-aba-unica.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test('Tentar excluir aba quando há apenas uma aba', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story('Tentar excluir aba quando há apenas uma aba');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step("Pré-condição: criar painel com aba inicial única", async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName);
      await painelForm.getLayoutsTab().click();
      await expect(page.getByText('Nova aba', { exact: true })).toBeVisible();
    });

    await allure.step("1. Validar que Excluir está desabilitado", async () => {
      await expect(painelForm.getDeleteTabButton('Nova aba')).toBeDisabled();
    });

    await allure.step("2. Validar que Renomear permanece habilitado", async () => {
      await expect(painelForm.getRenameTabButton('Nova aba')).toBeEnabled();
    });
  });
});
