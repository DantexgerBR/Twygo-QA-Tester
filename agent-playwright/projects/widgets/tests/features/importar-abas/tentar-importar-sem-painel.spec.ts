// spec: projects/widgets/specs/importar-abas-plan.md
// seed: projects/widgets/tests/features/listagem-de-paineis/validar-componentes-obrigatorios.spec.ts

// Cenário negativo — Painel de origem vazio: valida estado inicial do modal
// step 2 antes de qualquer seleção (sem painel → sem aba → botão disabled).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { tentarImportarSemPainelData as data } from './tentar-importar-sem-painel.data.js';
import { importarAbasSharedData as shared } from './importar-abas.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Importar abas', () => {
  test('Tentar importar sem selecionar painel de origem', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Importar abas');
    await allure.story('Tentar importar sem selecionar painel de origem');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    // 1. Pré-condição: criar painel; abrir modal step 2 SEM selecionar painel
    await step('1. Criar painel e abrir modal step 2 de importar (sem seleção)', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName, shared.panelDescription);
      await painelForm.goToEdit(panelId, 'layouts');

      await painelForm.getAddTabButton().click();
      await painelForm.getImportTabOption().click();

      const modal = painelForm.getAddTabModal();
      await expect(modal).toBeVisible();
      await expect(modal.getByText('Importe uma aba de outro painel')).toBeVisible();

      // Painel de origem vazio (placeholder visível)
      const panelSelect = page.getByTestId('import-tab-modal-panel-select');
      await expect(panelSelect).toBeVisible();
      await expect(panelSelect.getByText('Selecione um painel...')).toBeVisible();
    });

    // 2. Verificar campos secundários ocultos antes de seleção de painel
    await step("2. Verificar que 'Aba disponível' não aparece enquanto Painel de origem estiver vazio", async () => {
      await expect(page.getByTestId('import-tab-modal-tab-select')).toBeHidden();

      // 'Nome da nova aba' container também só aparece após seleção de aba
      // (confirmado live: aparece em TC 1.3/1.4 após Aba X selecionada)
      await expect(page.getByTestId('import-tab-modal-tab-name-input')).toBeHidden();
    });

    // 3. Verificar botão 'Importar aba' disabled
    await step("3. Verificar botão 'Importar aba' está DISABLED sem painel selecionado", async () => {
      const importButton = page.getByTestId('import-tab-modal-import-button');
      await expect(importButton).toBeVisible();
      await expect(importButton).toBeDisabled();
    });
  });
});
