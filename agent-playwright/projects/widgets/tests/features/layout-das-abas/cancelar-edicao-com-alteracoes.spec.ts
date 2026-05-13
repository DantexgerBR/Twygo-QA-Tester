// spec: projects/widgets/specs/layout-das-abas-plan.md
// seed: projects/widgets/tests/features/adicionar-editar-aba/criar-painel-happy-path.spec.ts

// Cancelar com alterações dispara browser beforeunload dialog NATIVO
// (não modal Chakra). Em Playwright, capturamos via page.on('dialog').

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cancelarEdicaoComAlteracoesData as data } from './cancelar-edicao-com-alteracoes.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Layout das abas', () => {
  test('Cancelar edição com alterações não salvas', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Layout das abas');
    await allure.story('Cancelar edição com alterações não salvas');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);
    let dialogTriggered = false;

    await step('1. Setup — painel com 1 widget criando alteração não salva', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName);
      await painelForm.goToEdit(panelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }

      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.widget);
      await painelForm.waitForToastsToClear();

      await expect(painelForm.getGridItems()).toHaveCount(1);
      await expect(page.getByTestId('panel-layout-cancel-button')).toBeVisible();
    });

    await step("2. Clicar 'Cancelar' e capturar beforeunload dialog nativo (dismiss)", async () => {
      // Registrar handler antes do click + criar promise pro evento
      const dialogPromise = page.waitForEvent('dialog');
      page.once('dialog', () => {
        dialogTriggered = true;
      });

      await page.getByTestId('panel-layout-cancel-button').click();

      const dialog = await dialogPromise;
      await dialog.dismiss();

      // URL permanece após dismiss (não navegou)
      await expect(page).toHaveURL(/\/panels\/\d+\/edit\?tab=layouts/);
    });

    await step('3. Validar que dialog beforeunload foi disparado (sinal de alteração pendente)', async () => {
      expect(dialogTriggered).toBe(true);
    });
  });
});
