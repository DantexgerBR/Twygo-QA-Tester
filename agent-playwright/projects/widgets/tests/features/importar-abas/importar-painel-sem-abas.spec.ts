// spec: projects/widgets/specs/importar-abas-plan.md
// seed: projects/widgets/tests/features/listagem-de-paineis/validar-componentes-obrigatorios.spec.ts

// FIXME documentado: o env staging-widgets não permite estado "painel sem
// abas" — todo painel criado já vem com a aba padrão 'Nova aba'. Como esta
// aba padrão não aparece como opção importável no dropdown 'Aba disponível',
// o react-select mostra "Nenhuma aba encontrada" para qualquer painel recém-criado
// (confirmado live em TC 1.2/1.3). Destinatário: AT/QA Lead — alinhar
// com o produto se "painel com apenas Nova aba" é o equivalente de "painel
// sem abas" para fins desta funcionalidade, ou se existe outro estado
// possível. Quando o fixme for removido: criar Painel Vazio explicitamente
// "sem abas" e validar mensagem 'Nenhuma aba encontrada' no dropdown.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { importarPainelSemAbasData as data } from './importar-painel-sem-abas.data.js';
import { importarAbasSharedData as shared } from './importar-abas.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Importar abas', () => {
  test('Importar aba com painel sem abas disponíveis', async ({ page, step }) => {
    test.fixme(
      true,
      'Spec/XML desatualizado: o env staging-widgets não permite painel "sem abas" — todo painel já é criado com a aba padrão "Nova aba". A aba padrão não aparece como opção no dropdown "Aba disponível", então o react-select mostra "Nenhuma aba encontrada" para qualquer painel recém-criado. Destinatário: AT/QA Lead — confirmar com produto se este estado é equivalente de "sem abas" ou se existe outro estado possível (ver feedback_panel_layout_save_no_persist.md também).',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Importar abas');
    await allure.story('Importar aba com painel sem abas disponíveis');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    // Cenário planejado para quando o fixme for removido — código fica preparado
    await step('1. Criar Painel Vazio sem abas explícitas (se possível) e Painel Destino', async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.emptyPanelName, shared.panelDescription);

      // Aqui o produto criaria implicitamente a aba 'Nova aba'. Quando o
      // bloqueio for resolvido, a expectativa real (estado sem aba) precisa
      // de seed externo ou flag específica.

      await painelForm.goToNew();
      const destPanelId = await painelForm.createPanel(data.destPanelName, shared.panelDescription);
      await painelForm.goToEdit(destPanelId, 'layouts');
    });

    await step('2. Abrir modal step 2 de importar e selecionar Painel Vazio', async () => {
      await painelForm.getAddTabButton().click();
      await painelForm.getImportTabOption().click();

      const panelSelect = page.getByTestId('import-tab-modal-panel-select');
      await panelSelect.locator('input[role="combobox"]').fill(data.emptyPanelName);
      await page.getByRole('option', { name: data.emptyPanelName }).click();
    });

    await step("3. Verificar mensagem 'Nenhuma aba encontrada' no dropdown 'Aba disponível'", async () => {
      const tabSelect = page.getByTestId('import-tab-modal-tab-select');
      await tabSelect.locator('input[role="combobox"]').click();

      // react-select mostra esta mensagem quando não há opções
      await expect(page.getByText('Nenhuma aba encontrada')).toBeVisible();

      const importButton = page.getByTestId('import-tab-modal-import-button');
      await expect(importButton).toBeDisabled();
    });
  });
});
