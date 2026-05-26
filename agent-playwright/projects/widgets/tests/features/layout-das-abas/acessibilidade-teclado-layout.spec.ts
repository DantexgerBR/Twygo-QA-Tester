// spec: projects/widgets/specs/layout-das-abas-plan.md
// seed: projects/widgets/tests/features/adicionar-editar-aba/criar-painel-happy-path.spec.ts

// Valida que elementos interativos da área Layouts são focusáveis via
// teclado (Tab). Ordem exata varia com o estado da UI — focamos em
// confirmar focusabilidade individual via .focus() + assertion.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { acessibilidadeTecladoLayoutData as data } from './acessibilidade-teclado-layout.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Layout das abas', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test("Validar acessibilidade por teclado aba 'Layout'", async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Layout das abas');
    await allure.story("Validar acessibilidade por teclado aba 'Layout'");
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await step('1. Setup — painel em Layouts (grid vazio inicial)', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName);
      await painelForm.goToEdit(panelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }

      await expect(page.getByTestId('widgets-grid-container')).toBeVisible();
    });

    await step('2. Validar focusabilidade dos botões da toolbar de ações', async () => {
      const candidates = [
        page.getByTestId('tabs-navigation-add-button'),
        page.getByTestId('widgets-grid-add-button'),
        page.getByRole('button', { name: 'Visualização: Desktop' }),
        page.getByRole('button', { name: 'Visualização: Tablet' }),
        page.getByRole('button', { name: 'Visualização: Mobile' }),
      ];

      for (const el of candidates) {
        await el.focus();
        await expect(el).toBeFocused();
      }
    });

    await step('3. Validar focusabilidade do switch reorganizar (input checkbox)', async () => {
      const switchInput = page
        .getByTestId('widgets-grid-reorganize-switch')
        .locator('input[type="checkbox"]');

      await switchInput.focus();
      await expect(switchInput).toBeFocused();

      // Toggle via Space
      const initialChecked = await switchInput.isChecked();
      await page.keyboard.press('Space');
      await expect(switchInput).toBeChecked({ checked: !initialChecked });
    });

    await step('4. Validar focusabilidade dos botões do footer (Cancelar/Salvar)', async () => {
      const cancelButton = page.getByTestId('panel-layout-cancel-button');
      const saveButton = page.getByTestId('panel-layout-save-button');

      await cancelButton.focus();
      await expect(cancelButton).toBeFocused();

      await saveButton.focus();
      await expect(saveButton).toBeFocused();
    });
  });
});
