// spec: projects/widgets/specs/importar-abas-plan.md
// seed: projects/widgets/tests/features/listagem-de-paineis/validar-componentes-obrigatorios.spec.ts

// AVISO: o botão "Salvar Layout" não persiste no backend (zero POST/PATCH durante
// edição — confirmado em trace 2026-05-12). A pré-condição chama getSaveLayoutButton().click()
// para satisfazer a UI, mas os widgets NÃO são gravados no servidor. O fluxo funciona
// dentro da mesma sessão browser por estado local. Ver feedback_panel_layout_save_no_persist.md.
//
// DESCOBERTA LIVE (2026-05-13):
// - O dropdown 'Categoria' possui APENAS 1 opção no env staging-widgets:
//   'Aprendizagem' (value='0'). O cenário de "trocar para outra categoria" descrito
//   no plan TC 1.5 não é executável até o produto adicionar mais categorias —
//   o teste valida o estado atual (1 opção) e o `// REVISAR` abaixo sinaliza
//   para reabrir o caso quando novas categorias existirem.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { selecionarCategoriaImportacaoData as data } from './selecionar-categoria-importacao.data.js';
import { importarAbasSharedData as shared } from './importar-abas.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Importar abas', () => {
  test('Selecionar Categoria na importação', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Importar abas');
    await allure.story('Selecionar Categoria na importação');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    // 1. Pré-condição: criar Painel Origem com Aba X (2 widgets); abrir modal de importar do Painel Destino e selecionar Aba X
    await step('1. Setup — Painel Origem + Painel Destino + Aba X selecionada no modal', async () => {
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
      await panelSelect.locator('input').fill(data.sourcePanelName);
      await page.getByRole('option', { name: data.sourcePanelName }).click();

      const tabSelect = page.getByTestId('import-tab-modal-tab-select');
      await expect(tabSelect).toBeVisible();
      await tabSelect.locator('input').click();
      await page.getByRole('option', { name: `${data.tabXName} 2 Widgets` }).click();
    });

    // 2. Verificar dropdown Categoria visível com opção padrão Aprendizagem (value='0')
    await step("2. Verificar dropdown 'Categoria' visível com 'Aprendizagem' selecionado por padrão", async () => {
      const modal = painelForm.getAddTabModal();
      const categoriaSelect = modal.getByRole('combobox');

      await expect(categoriaSelect).toBeVisible();
      await expect(categoriaSelect).toHaveValue('0');

      // Texto da opção selecionada
      const selectedText = await categoriaSelect.locator('option:checked').textContent();
      expect(selectedText?.trim()).toBe(data.defaultCategory);
    });

    // 3. Verificar que dropdown tem APENAS 1 opção (Aprendizagem) — env atual
    await step("3. Verificar quantidade de opções disponíveis (REVISAR ao adicionar categorias)", async () => {
      const modal = painelForm.getAddTabModal();
      const categoriaSelect = modal.getByRole('combobox');

      // REVISAR: env staging-widgets tem apenas 'Aprendizagem' hoje.
      // Quando produto adicionar novas categorias, ajustar este `toHaveCount`
      // e adicionar steps de troca via selectOption({ label: '<nova>' }).
      await expect(categoriaSelect.locator('option')).toHaveCount(1);
      await expect(categoriaSelect.locator('option').first()).toHaveText(data.defaultCategory);
    });

    // 4. Verificar botão 'Importar aba' permanece habilitado
    await step("4. Verificar botão 'Importar aba' habilitado após validar categoria", async () => {
      const importButton = page.getByTestId('import-tab-modal-import-button');
      await expect(importButton).toBeVisible();
      await expect(importButton).not.toBeDisabled();
    });
  });
});
