// spec: projects/widgets/specs/importar-abas-plan.md
// seed: projects/widgets/tests/features/listagem-de-paineis/validar-componentes-obrigatorios.spec.ts

// AVISO: o botão "Salvar Layout" não persiste no backend (zero POST/PATCH durante
// edição — confirmado em trace 2026-05-12). A pré-condição chama getSaveLayoutButton().click()
// para satisfazer a UI, mas os widgets NÃO são gravados no servidor. O campo "Aba X 2 Widgets"
// e "Aba Y 3 Widgets" listados no dropdown refletem o estado local do painel no momento
// da importação. Ver feedback_panel_layout_save_no_persist.md.
//
// SELETORES CONFIRMADOS LIVE (2026-05-13):
// - Preview area: sem data-test-id — usar getByText('Preview da aba') como âncora
// - Nome da nova aba: data-test-id='import-tab-modal-tab-name-input' (container ancestral)
// - Categoria: sem data-test-id — chakra-select com opção padrão 'Aprendizagem'

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { visualizarPreviewAbaData as data } from './visualizar-preview-aba.data.js';
import { importarAbasSharedData as shared } from './importar-abas.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Importar abas', () => {
  test('Visualizar preview da aba selecionada', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Importar abas');
    await allure.story('Visualizar preview da aba selecionada');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    // 1. Pré-condição: criar Painel Origem com Aba X (2 widgets) + Aba Y (3 widgets)
    await step('1. Criar Painel Origem com Aba X e Aba Y seedadas', async () => {
      await painelForm.goToNew();
      const sourcePanelId = await painelForm.createPanel(data.sourcePanelName, shared.panelDescription);

      // goToEdit com tab=layouts pode disparar dialog "Sair sem salvar" do Chakra
      await painelForm.goToEdit(sourcePanelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }
      await expect(painelForm.getLayoutsTab()).toBeVisible();

      // Criar Aba X e adicionar 2 widgets (activity_summary + in_progress_contents)
      await painelForm.addTab(data.tabXName);
      await page.getByText(data.tabXName, { exact: true }).click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.tabXWidgets[0]);
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.tabXWidgets[1]);
      await painelForm.getSaveLayoutButton().click();
      await painelForm.waitForToastsToClear();

      // Criar Aba Y e adicionar 3 widgets (activity_summary + in_progress_contents + ranking)
      await painelForm.addTab(data.tabYName);
      await page.getByText(data.tabYName, { exact: true }).click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.tabYWidgets[0]);
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.tabYWidgets[1]);
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.tabYWidgets[2]);
      await painelForm.getSaveLayoutButton().click();
      await painelForm.waitForToastsToClear();

      await expect(page.getByText(data.tabXName, { exact: true })).toBeVisible();
      await expect(page.getByText(data.tabYName, { exact: true })).toBeVisible();
    });

    // 2. Criar Painel Destino, abrir step 2 do modal e selecionar Painel Origem
    await step('2. Criar Painel Destino e selecionar Painel Origem no modal de importar aba', async () => {
      await painelForm.goToNew();
      const destPanelId = await painelForm.createPanel(data.destPanelName, shared.panelDescription);
      await painelForm.goToEdit(destPanelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }
      await expect(painelForm.getLayoutsTab()).toBeVisible();

      await painelForm.getAddTabButton().click();
      await expect(painelForm.getImportTabOption()).toBeVisible();
      await painelForm.getImportTabOption().click();

      const modal = painelForm.getAddTabModal();
      await expect(modal).toBeVisible();
      await expect(modal.getByText('Importe uma aba de outro painel')).toBeVisible();

      // Selecionar o Painel Origem no react-select
      const panelSelect = page.getByTestId('import-tab-modal-panel-select');
      await panelSelect.locator('input[role="combobox"]').fill(data.sourcePanelName);
      await page.getByRole('option', { name: data.sourcePanelName }).click();

      // Campo 'Aba disponível*' deve aparecer após seleção do painel
      const tabSelect = page.getByTestId('import-tab-modal-tab-select');
      await expect(tabSelect).toBeVisible();
    });

    // 3. Selecionar 'Aba X' no react-select 'Aba disponível' e verificar preview
    await step('3. Selecionar Aba X e verificar preview da aba no modal', async () => {
      const tabSelect = page.getByTestId('import-tab-modal-tab-select');
      const modal = painelForm.getAddTabModal();

      // Abrir dropdown e selecionar "Aba X 2 Widgets"
      // Formato "Aba X 2 Widgets" confirmado live em 2026-05-12/13
      await tabSelect.locator('input[role="combobox"]').click();
      await page.getByRole('option', { name: `${data.tabXName} 2 Widgets` }).click();

      // Área de preview — sem data-test-id; identificada pelo heading "Preview da aba"
      await expect(modal.getByText('Preview da aba')).toBeVisible();

      // Preview exibe nome da aba selecionada
      await expect(modal.getByText('Nome:')).toBeVisible();
      await expect(modal.getByText(data.tabXName, { exact: true })).toBeVisible();

      // Preview exibe quantidade de widgets (2)
      await expect(modal.getByText('Widgets:')).toBeVisible();
      await expect(modal.getByText('2', { exact: true })).toBeVisible();

      // Preview exibe lista dos widgets inclusos — nomes confirmados live via PainelFormPage.WIDGET_IDS
      await expect(modal.getByText('Widgets inclusos:')).toBeVisible();
      await expect(modal.getByText('Resumo de atividades')).toBeVisible();
      await expect(modal.getByText('Conteúdos em andamento')).toBeVisible();
    });

    // 4. Verificar campo 'Nome da nova aba' auto-preenchido com nome original
    await step('4. Verificar campo "Nome da nova aba" auto-preenchido com "Aba X"', async () => {
      // Container com data-test-id='import-tab-modal-tab-name-input' confirmado via DOM live (2026-05-13)
      const nomeInput = page
        .getByTestId('import-tab-modal-tab-name-input')
        .getByPlaceholder('Digite o nome da aba');

      await expect(nomeInput).toBeVisible();
      await expect(nomeInput).toHaveValue(data.tabXName);
    });

    // 5. Verificar campo 'Categoria' aparece com opção padrão selecionada
    await step('5. Verificar campo "Categoria" com opção padrão "Aprendizagem"', async () => {
      const modal = painelForm.getAddTabModal();

      // Categoria não tem data-test-id — chakra-select com opção padrão "Aprendizagem"
      // confirmada via DOM live (select.value="0", options[0].text="Aprendizagem")
      const categoriaSelect = modal.getByRole('combobox');
      await expect(categoriaSelect).toBeVisible();
      await expect(categoriaSelect).toHaveValue('0');
    });
  });
});
