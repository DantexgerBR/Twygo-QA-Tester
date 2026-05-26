// spec: projects/widgets/specs/importar-abas-plan.md
// seed: projects/widgets/tests/features/listagem-de-paineis/validar-componentes-obrigatorios.spec.ts

// SELETORES LIVE (do TC 1.1):
// - back button do step 2: data-test-id='import-tab-modal-back-button' (com ícone arrow_back)
// - step 1 options: add-tab-type-modal-create-new-button, add-tab-type-modal-import-button, add-tab-type-modal-cancel-button

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { voltarStepImportacaoData as data } from './voltar-step-importacao.data.js';
import { importarAbasSharedData as shared } from './importar-abas.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Importar abas', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test('Voltar do step de importação para a seleção de tipo', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Importar abas');
    await allure.story('Voltar do step de importação para a seleção de tipo');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    // 1. Pré-condição: criar painel; abrir Layouts; abrir modal e ir pro step 2 de importar
    await step('1. Criar painel, abrir Layouts e navegar até o step 2 de "Importar de outro painel"', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName, shared.panelDescription);
      await painelForm.goToEdit(panelId, 'layouts');

      await painelForm.getAddTabButton().click();
      await painelForm.getImportTabOption().click();

      const modal = painelForm.getAddTabModal();
      await expect(modal).toBeVisible();
      // Subtítulo do step 2 confirma que estamos no ponto certo
      await expect(modal.getByText('Importe uma aba de outro painel')).toBeVisible();
      await expect(page.getByTestId('import-tab-modal-back-button')).toBeVisible();
    });

    // 2. Clicar no botão Voltar do step 2
    await step("2. Clicar no botão 'Voltar' (arrow_back) do step 2", async () => {
      await page.getByTestId('import-tab-modal-back-button').click();
    });

    // 3. Verificar que modal retorna ao step 1 com opções e Cancelar visíveis
    await step('3. Verificar que modal retorna ao step 1 com as opções iniciais visíveis', async () => {
      const modal = painelForm.getAddTabModal();

      // Step 1: subtítulo de seleção de tipo + duas opções + Cancelar
      await expect(modal.getByText('Escolha como deseja criar a nova aba')).toBeVisible();
      await expect(painelForm.getCreateNewTabOption()).toBeVisible();
      await expect(painelForm.getImportTabOption()).toBeVisible();
      await expect(painelForm.getAddTabTypeCancel()).toBeVisible();
    });
  });
});
