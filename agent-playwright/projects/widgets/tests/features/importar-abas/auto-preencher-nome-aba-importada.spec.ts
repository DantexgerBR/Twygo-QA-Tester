// spec: projects/widgets/specs/importar-abas-plan.md
// seed: projects/widgets/tests/features/listagem-de-paineis/validar-componentes-obrigatorios.spec.ts

// AVISO: o botão "Salvar Layout" não persiste no backend (zero POST/PATCH durante
// edição — confirmado em trace 2026-05-12). A pré-condição chama getSaveLayoutButton().click()
// para satisfazer a UI, mas os widgets NÃO são gravados no servidor. O fluxo funciona
// dentro da mesma sessão browser por estado local. Ver feedback_panel_layout_save_no_persist.md.
//
// SELETORES CONFIRMADOS LIVE (2026-05-13, herdados do TC 1.3):
// - 'Nome da nova aba' input: getByTestId('import-tab-modal-tab-name-input').getByPlaceholder('Digite o nome da aba')
// - maxLength=255 enforçado client-side via atributo HTML

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { autoPreencherNomeAbaImportadaData as data } from './auto-preencher-nome-aba-importada.data.js';
import { importarAbasSharedData as shared } from './importar-abas.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Importar abas', () => {
  test("Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres", async ({
    page,
    step,
  }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Importar abas');
    await allure.story("Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres");
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    // 1. Pré-condição: criar Painel Origem com Aba X (2 widgets); abrir modal de importar do Painel Destino e selecionar Aba X
    await step('1. Criar Painel Origem com Aba X seedada e abrir modal de importar do Painel Destino', async () => {
      await painelForm.goToNew();
      const sourcePanelId = await painelForm.createPanel(data.sourcePanelName, shared.panelDescription);

      // goToEdit com tab=layouts pode disparar dialog "Sair sem salvar" do Chakra
      await painelForm.goToEdit(sourcePanelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }
      await expect(painelForm.getLayoutsTab()).toBeVisible();

      // Aba X com 2 widgets
      await painelForm.addTab(data.tabXName);
      await page.getByText(data.tabXName, { exact: true }).click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.tabXWidgets[0]);
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.tabXWidgets[1]);
      await painelForm.getSaveLayoutButton().click();
      await painelForm.waitForToastsToClear();

      // Criar Painel Destino, abrir Layouts, abrir modal de importar
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

      // Selecionar Painel Origem
      const panelSelect = page.getByTestId('import-tab-modal-panel-select');
      await panelSelect.locator('input[role="combobox"]').fill(data.sourcePanelName);
      await page.getByRole('option', { name: data.sourcePanelName }).click();

      // Selecionar Aba X (formato "Aba X 2 Widgets" confirmado live)
      const tabSelect = page.getByTestId('import-tab-modal-tab-select');
      await expect(tabSelect).toBeVisible();
      await tabSelect.locator('input[role="combobox"]').click();
      await page.getByRole('option', { name: `${data.tabXName} 2 Widgets` }).click();
    });

    // 2. Verificar preview exibido e botão Importar aba habilitado após seleção
    await step('2. Verificar preview exibido e botão "Importar aba" habilitado', async () => {
      const modal = painelForm.getAddTabModal();
      await expect(modal.getByText('Preview da aba')).toBeVisible();

      const importButton = page.getByTestId('import-tab-modal-import-button');
      await expect(importButton).toBeVisible();
      await expect(importButton).not.toBeDisabled();
    });

    // 3. Verificar campo 'Nome da nova aba' tem value auto-preenchido com 'Aba X'
    await step('3. Verificar auto-preenchimento de "Nome da nova aba" com nome original (Aba X)', async () => {
      const nomeInput = page
        .getByTestId('import-tab-modal-tab-name-input')
        .getByPlaceholder('Digite o nome da aba');

      await expect(nomeInput).toBeVisible();
      await expect(nomeInput).toHaveValue(data.tabXName);
    });

    // 4. Limpar e preencher com novo nome — verificar aceitação da edição
    await step('4. Limpar campo e preencher com novo nome "Aba Importada"', async () => {
      const nomeInput = page
        .getByTestId('import-tab-modal-tab-name-input')
        .getByPlaceholder('Digite o nome da aba');

      await nomeInput.fill(data.newTabName);
      await expect(nomeInput).toHaveValue(data.newTabName);
    });

    // 5. Tentar preencher 256 chars — verificar maxLength=255 enforçado client-side
    await step('5. Tentar preencher 256 chars e validar limite de 255 (maxLength HTML)', async () => {
      const nomeInput = page
        .getByTestId('import-tab-modal-tab-name-input')
        .getByPlaceholder('Digite o nome da aba');

      // Browser trunca automaticamente ao maxLength quando fill excede o limite
      await nomeInput.fill(data.name256Chars);
      await expect(nomeInput).toHaveValue(data.name255Chars);
    });
  });
});
