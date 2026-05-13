// spec: projects/widgets/specs/importar-abas-plan.md
// seed: projects/widgets/tests/features/listagem-de-paineis/validar-componentes-obrigatorios.spec.ts

// AVISO: o botão "Salvar Layout" não persiste no backend (zero POST/PATCH durante
// edição — confirmado em trace 2026-05-12). A pré-condição chama getSaveLayoutButton().click()
// para satisfazer a UI, mas os widgets NÃO são gravados no servidor. O campo "Aba X 2 Widgets"
// e "Aba Y 3 Widgets" listados no dropdown refletem o estado local do painel no momento
// da importação. Ver feedback_panel_layout_save_no_persist.md.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { selecionarPainelOrigemListarAbasData as data } from './selecionar-painel-origem-listar-abas.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Importar abas', () => {
  test('Selecionar painel de origem e listar abas disponíveis', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Importar abas');
    await allure.story('Selecionar painel de origem e listar abas disponíveis');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    // 1. Pré-condição: criar Painel Origem com Aba X (2 widgets) + Aba Y (3 widgets)
    await step('1. Criar Painel Origem com Aba X e Aba Y seedadas', async () => {
      await painelForm.goToNew();
      const sourcePanelId = await painelForm.createPanel(data.sourcePanelName);

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

    // 2. Criar Painel Destino e abrir step 2 do modal de importar aba
    await step('2. Criar Painel Destino e abrir modal "Importar de outro painel" (step 2)', async () => {
      await painelForm.goToNew();
      const destPanelId = await painelForm.createPanel(data.destPanelName);
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

      // Campo 'Painel de origem*' visível com placeholder
      const panelSelect = page.getByTestId('import-tab-modal-panel-select');
      await expect(panelSelect).toBeVisible();
      await expect(panelSelect.getByText('Selecione um painel...')).toBeVisible();

      // Campo 'Aba disponível' NÃO aparece antes de painel ser selecionado
      await expect(page.getByTestId('import-tab-modal-tab-select')).toBeHidden();
    });

    // 3. Selecionar o Painel Origem no react-select e verificar que 'Aba disponível' aparece
    await step('3. Selecionar painel de origem e verificar campo "Aba disponível" aparece', async () => {
      const panelSelect = page.getByTestId('import-tab-modal-panel-select');

      // Digitar o nome do painel no input do react-select para filtrar as opções
      await panelSelect.locator('input').fill(data.sourcePanelName);

      // Clicar na opção com o nome real do painel (react-select mostra nomes reais ao filtrar)
      await page.getByRole('option', { name: data.sourcePanelName }).click();

      // Campo 'Aba disponível*' deve aparecer após seleção do painel
      const tabSelect = page.getByTestId('import-tab-modal-tab-select');
      await expect(tabSelect).toBeVisible();
      await expect(tabSelect.getByText('Selecione uma aba...')).toBeVisible();
    });

    // 4. Verificar que dropdown 'Aba disponível' lista Aba X (2 Widgets) e Aba Y (3 Widgets)
    await step('4. Abrir dropdown "Aba disponível" e verificar opções Aba X e Aba Y listadas', async () => {
      const tabSelect = page.getByTestId('import-tab-modal-tab-select');

      // Clicar no input do react-select para abrir o dropdown de abas
      await tabSelect.locator('input').click();

      // Formato confirmado live 2026-05-12: "Aba X 2 Widgets" e "Aba Y 3 Widgets"
      await expect(page.getByRole('option', { name: `${data.tabXName} 2 Widgets` })).toBeVisible();
      await expect(page.getByRole('option', { name: `${data.tabYName} 3 Widgets` })).toBeVisible();
    });
  });
});
