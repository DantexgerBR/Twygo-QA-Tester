// spec: projects/widgets/specs/importar-abas-plan.md
// seed: projects/widgets/tests/features/listagem-de-paineis/validar-componentes-obrigatorios.spec.ts

// AVISO: o botão "Salvar Layout" não persiste no backend (zero POST/PATCH durante
// edição — confirmado em trace 2026-05-12). A pré-condição cria toda a cadeia
// (Painel Origem → Painel Destino → Importar Aba → Editar) dentro da MESMA
// sessão browser para que o estado local seja suficiente. Quando rodado em
// sessão fresh (após reload), a aba importada não persistiria por causa
// deste bug. Ver feedback_panel_layout_save_no_persist.md.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { editarAbaImportadaData as data } from './editar-aba-importada.data.js';
import { importarAbasSharedData as shared } from './importar-abas.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Importar abas', () => {
  test('Editar aba importada', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Importar abas');
    await allure.story('Editar aba importada');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    // 1. Pré-condição: replicar happy path do TC 1.6 para ter Painel Destino com 'Aba Importada'
    await step('1. Setup — Painel Origem + Painel Destino + importar Aba X como "Aba Importada"', async () => {
      await painelForm.goToNew();
      const sourcePanelId = await painelForm.createPanel(data.sourcePanelName, shared.panelDescription);
      await painelForm.goToEdit(sourcePanelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }
      await expect(painelForm.getLayoutsTab()).toBeVisible();

      await painelForm.addTab(data.tabXName);
      await page.getByText(data.tabXName, { exact: true }).click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.tabXWidgets[0]);
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.tabXWidgets[1]);
      await painelForm.getSaveLayoutButton().click();
      await painelForm.waitForToastsToClear();

      // Painel Destino + importar Aba X como 'Aba Importada'
      await painelForm.goToNew();
      const destPanelId = await painelForm.createPanel(data.destPanelName, shared.panelDescription);
      await painelForm.goToEdit(destPanelId, 'layouts');
      const sairBtn2 = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn2.isVisible().catch(() => false)) {
        await sairBtn2.click();
      }
      await expect(painelForm.getLayoutsTab()).toBeVisible();

      await painelForm.getAddTabButton().click();
      await painelForm.getImportTabOption().click();

      const panelSelect = page.getByTestId('import-tab-modal-panel-select');
      await panelSelect.locator('input[role="combobox"]').fill(data.sourcePanelName);
      await page.getByRole('option', { name: data.sourcePanelName }).click();

      const tabSelect = page.getByTestId('import-tab-modal-tab-select');
      await tabSelect.locator('input[role="combobox"]').click();
      await page.getByRole('option', { name: `${data.tabXName} 2 Widgets` }).click();

      const nomeInput = page
        .getByTestId('import-tab-modal-tab-name-input')
        .getByPlaceholder('Digite o nome da aba');
      await nomeInput.fill(data.importedTabName);

      await page.getByTestId('import-tab-modal-import-button').click();
      await expect(painelForm.getAddTabModal()).toBeHidden();
      await expect(page.getByText(data.importedTabName, { exact: true })).toBeVisible();
    });

    // 2. Renomear a aba importada via modal Renomear
    await step('2. Renomear "Aba Importada" para "Aba Renomeada"', async () => {
      await painelForm.openRenameModal(data.importedTabName);

      const renameInput = painelForm.getRenameModalInput();
      await expect(renameInput).toHaveValue(data.importedTabName);

      await renameInput.fill(data.editedTabName);
      await painelForm.getRenameModalSubmit().click();

      await expect(painelForm.getRenameModal()).toBeHidden();
      await expect(page.getByText(data.editedTabName, { exact: true })).toBeVisible();
    });

    // 3. Adicionar um widget à aba importada e salvar layout
    await step("3. Adicionar widget 'ranking' à aba renomeada e salvar layout", async () => {
      // Garantir que a aba renomeada está ativa
      await page.getByText(data.editedTabName, { exact: true }).click();

      // Snapshot do count antes
      const initialCount = await painelForm.getGridItems().count();

      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.newWidget);

      await expect(painelForm.getGridItems()).toHaveCount(initialCount + 1);
      await expect(painelForm.getWidgetGridTitle('Ranking')).toBeVisible();

      await painelForm.getSaveLayoutButton().click();
      await painelForm.waitForToastsToClear();
    });
  });
});
