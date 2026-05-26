// spec: projects/widgets/specs/importar-abas-plan.md
// seed: projects/widgets/tests/features/listagem-de-paineis/validar-componentes-obrigatorios.spec.ts

// SELETORES LIVE (do TC 1.1 e TC 1.2):
// - Cancel button do step 2: data-test-id='import-tab-modal-cancel-button'
// - Lista de chips de aba na lista de Layouts identificada por getTabChip(name)

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { cancelarImportacaoData as data } from './cancelar-importacao.data.js';
import { importarAbasSharedData as shared } from './importar-abas.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Importar abas', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test('Cancelar importação', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Importar abas');
    await allure.story('Cancelar importação');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    // Counts de abas/tabpanels do painel após criação — usado como baseline
    const tabsCountLocator = () => page.locator('[role="tab"]');

    // 1. Pré-condição: criar painel; abrir Layouts; abrir modal step 2 de importar
    await step('1. Criar painel, abrir Layouts e ir até o step 2 do modal de importar', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName, shared.panelDescription);
      await painelForm.goToEdit(panelId, 'layouts');

      await painelForm.getAddTabButton().click();
      await painelForm.getImportTabOption().click();

      const modal = painelForm.getAddTabModal();
      await expect(modal).toBeVisible();
      await expect(modal.getByText('Importe uma aba de outro painel')).toBeVisible();
    });

    // 2. Anotar o count de abas no Painel antes de cancelar (baseline)
    let baselineTabCount = 0;
    await step('2. Registrar count de abas como baseline antes de cancelar', async () => {
      // Modal está aberto — contar elementos role=tab fora do modal não muda.
      // Painel novo tem aba padrão 'Nova aba' → baseline esperado >=1.
      baselineTabCount = await tabsCountLocator().count();
      expect(baselineTabCount).toBeGreaterThanOrEqual(1);
    });

    // 3. Clicar Cancelar e validar que modal fecha sem criar aba nova
    await step("3. Clicar 'Cancelar' do step 2 e validar que nenhuma aba é criada", async () => {
      await page.getByTestId('import-tab-modal-cancel-button').click();

      // Modal deve fechar
      await expect(painelForm.getAddTabModal()).toBeHidden();

      // Count de abas permanece igual ao baseline
      const afterCount = await tabsCountLocator().count();
      expect(afterCount).toBe(baselineTabCount);
    });
  });
});
