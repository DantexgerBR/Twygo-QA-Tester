// spec: projects/widgets/specs/importar-abas-plan.md
// seed: projects/widgets/tests/features/listagem-de-paineis/validar-componentes-obrigatorios.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { acessarFluxoImportarPainelData as data } from './acessar-fluxo-importar-painel.data.js';
import { importarAbasSharedData as shared } from './importar-abas.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Importar abas', () => {
  test('Acessar o fluxo de Importar de outro painel', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Importar abas');
    await allure.story('Acessar o fluxo de Importar de outro painel');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    // 1. Pré-condição: criar Painel Destino e abrir tab Layouts
    await step('1. Criar Painel Destino e abrir tab Layouts', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.destPanelName, shared.panelDescription);
      // goToEdit com tab=layouts evita o dialog "Sair e salvar" do Chakra
      await painelForm.goToEdit(panelId, 'layouts');

      await expect(painelForm.getLayoutsTab()).toBeVisible();
      await expect(painelForm.getAddTabButton()).toBeVisible();
    });

    // 2. Clicar em 'Adicionar aba' — verificar modal step 1 abre com título, subtítulo e opções
    await step('2. Clicar em "Adicionar aba" e verificar modal step 1', async () => {
      await painelForm.getAddTabButton().click();

      const modal = painelForm.getAddTabModal();
      await expect(modal).toBeVisible();
      await expect(modal.getByText('Adicionar nova aba')).toBeVisible();
      await expect(modal.getByText('Escolha como deseja criar a nova aba')).toBeVisible();
      await expect(painelForm.getCreateNewTabOption()).toBeVisible();
      await expect(painelForm.getImportTabOption()).toBeVisible();
      await expect(painelForm.getAddTabTypeCancel()).toBeVisible();
    });

    // 3. Verificar opção 'Importar de outro painel' exibe texto, subtexto e ícone download
    await step('3. Verificar opção "Importar de outro painel" com descrição e ícone download', async () => {
      const importBtn = painelForm.getImportTabOption();
      await expect(importBtn).toContainText('Importar de outro painel');
      await expect(importBtn).toContainText('Reutilize uma aba existente de outro painel');
      // Ícone "download" é um span de Material Icons dentro do botão
      await expect(importBtn.locator('text=download')).toBeVisible();
    });

    // 4. Clicar em 'Importar de outro painel' — verificar modal avança para step 2
    await step('4. Clicar em "Importar de outro painel" e verificar step 2 do modal', async () => {
      await painelForm.getImportTabOption().click();

      const modal = painelForm.getAddTabModal();
      await expect(modal).toBeVisible();
      // Título permanece o mesmo; subtítulo muda para o contexto de importação
      await expect(modal.getByText('Adicionar nova aba')).toBeVisible();
      await expect(modal.getByText('Importe uma aba de outro painel')).toBeVisible();

      // Campo 'Painel de origem*' visível com placeholder
      const panelSelect = page.getByTestId('import-tab-modal-panel-select');
      await expect(panelSelect).toBeVisible();
      await expect(panelSelect.getByText('Selecione um painel...')).toBeVisible();

      // Campo 'Aba disponível' NÃO aparece antes de painel ser selecionado
      await expect(page.getByTestId('import-tab-modal-tab-select')).toBeHidden();
    });

    // 5. Verificar botões do step 2: Voltar, Cancelar e Importar aba (disabled)
    await step('5. Verificar botões do step 2: Voltar, Cancelar e Importar aba (disabled)', async () => {
      await expect(page.getByTestId('import-tab-modal-back-button')).toBeVisible();
      // Ícone arrow_back confirma que é o botão Voltar
      await expect(page.getByTestId('import-tab-modal-back-button').locator('text=arrow_back')).toBeVisible();

      await expect(page.getByTestId('import-tab-modal-cancel-button')).toBeVisible();

      const importButton = page.getByTestId('import-tab-modal-import-button');
      await expect(importButton).toBeVisible();
      await expect(importButton).toBeDisabled();
    });
  });
});
