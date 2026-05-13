// spec: projects/widgets/specs/layout-das-abas-plan.md
// seed: projects/widgets/tests/features/adicionar-editar-aba/criar-painel-happy-path.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { trocarVisualizacaoMobileData as data } from './trocar-visualizacao-mobile.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Layout das abas', () => {
  test('Trocar visualização para Mobile (360) e validar alerta', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Layout das abas');
    await allure.story('Trocar visualização para Mobile (360) e validar alerta');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await step('1. Setup — painel em Layouts no modo Desktop', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName);
      await painelForm.goToEdit(panelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }
      await expect(page.getByRole('button', { name: 'Visualização: Desktop' })).toHaveClass(
        new RegExp(data.activeButtonClass),
      );
      await expect(page.getByTestId('widgets-grid-view-alert')).toBeHidden();
    });

    await step("2. Clicar 'Visualização: Mobile' e validar alerta + switch desabilitado", async () => {
      const mobileBtn = page.getByRole('button', { name: 'Visualização: Mobile' });
      await mobileBtn.click();

      await expect(mobileBtn).toHaveClass(new RegExp(data.activeButtonClass));
      await expect(page.getByRole('button', { name: 'Visualização: Desktop' })).toHaveClass(
        new RegExp(data.inactiveButtonClass),
      );

      const alert = page.getByTestId('widgets-grid-view-alert');
      await expect(alert).toBeVisible();
      await expect(alert).toHaveAttribute('role', 'alert');
      await expect(alert).toContainText(data.mobileAlertText);

      const switchInput = page
        .getByTestId('widgets-grid-reorganize-switch')
        .locator('input[type="checkbox"]');
      await expect(switchInput).toBeDisabled();

      await expect(page.getByTestId('panel-layout-cancel-button')).toBeVisible();
      await expect(page.getByTestId('panel-layout-save-button')).toBeVisible();
    });

    await step('3. Validar caráter informativo do alerta Mobile', async () => {
      const alert = page.getByTestId('widgets-grid-view-alert');
      await expect(alert).toHaveText(data.mobileAlertText);

      const switchInput = page
        .getByTestId('widgets-grid-reorganize-switch')
        .locator('input[type="checkbox"]');
      await expect(switchInput).toBeDisabled();
    });
  });
});
