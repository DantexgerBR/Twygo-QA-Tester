// spec: projects/widgets/specs/layout-das-abas-plan.md
// seed: projects/widgets/tests/features/adicionar-editar-aba/criar-painel-happy-path.spec.ts

// SELETORES LIVE (2026-05-13):
// - Botão ativo: classe CSS css-1ei05do; inativo: css-46557t
// - Tablet alert: data-test-id='widgets-grid-view-alert' com texto
//   'Visualização (Tablet) — edição disponível no Desktop'
// - Switch reorganizar com data-disabled="" em Tablet/Mobile

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { trocarVisualizacaoTabletData as data } from './trocar-visualizacao-tablet.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Layout das abas', () => {
  test('Trocar visualização para Tablet (768) e validar alerta', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Layout das abas');
    await allure.story('Trocar visualização para Tablet (768) e validar alerta');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    // 1. Pré-condição: criar painel + abrir Layouts em modo Desktop (default)
    await step('1. Setup — painel em Layouts no modo Desktop (default)', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName);
      await painelForm.goToEdit(panelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }

      const desktopBtn = page.getByRole('button', { name: 'Visualização: Desktop' });
      await expect(desktopBtn).toBeVisible();
      await expect(desktopBtn).toHaveClass(new RegExp(data.activeButtonClass));

      // Tablet/Mobile inactives
      await expect(page.getByRole('button', { name: 'Visualização: Tablet' })).toHaveClass(
        new RegExp(data.inactiveButtonClass),
      );
      await expect(page.getByRole('button', { name: 'Visualização: Mobile' })).toHaveClass(
        new RegExp(data.inactiveButtonClass),
      );

      // Alerta não presente em Desktop
      await expect(page.getByTestId('widgets-grid-view-alert')).toBeHidden();

      // Switch habilitado em Desktop
      const switchContainer = page.getByTestId('widgets-grid-reorganize-switch');
      const switchInput = switchContainer.locator('input[type="checkbox"]');
      await expect(switchInput).toBeEnabled();
    });

    // 2. Clicar Tablet → alerta aparece, switch desabilita, footer permanece
    await step("2. Clicar 'Visualização: Tablet' e validar mudança de estado", async () => {
      const tabletBtn = page.getByRole('button', { name: 'Visualização: Tablet' });
      await tabletBtn.click();

      // Tablet ativo, Desktop inativo
      await expect(tabletBtn).toHaveClass(new RegExp(data.activeButtonClass));
      await expect(page.getByRole('button', { name: 'Visualização: Desktop' })).toHaveClass(
        new RegExp(data.inactiveButtonClass),
      );

      // Alerta visível com texto correto
      const alert = page.getByTestId('widgets-grid-view-alert');
      await expect(alert).toBeVisible();
      await expect(alert).toHaveAttribute('role', 'alert');
      await expect(alert).toContainText(data.tabletAlertText);

      // Switch desabilitado em Tablet
      const switchInput = page
        .getByTestId('widgets-grid-reorganize-switch')
        .locator('input[type="checkbox"]');
      await expect(switchInput).toBeDisabled();

      // Footer permanece visível (position:fixed)
      await expect(page.getByTestId('panel-layout-cancel-button')).toBeVisible();
      await expect(page.getByTestId('panel-layout-save-button')).toBeVisible();
    });

    // 3. Validar caráter informativo do alerta + edição bloqueada em Tablet
    await step('3. Validar que alerta é informativo e edição fica bloqueada em Tablet', async () => {
      const alert = page.getByTestId('widgets-grid-view-alert');
      await expect(alert).toHaveText(data.tabletAlertText);

      // Switch reorganizar permanece disabled (não é possível ativar enquanto Tablet)
      const switchInput = page
        .getByTestId('widgets-grid-reorganize-switch')
        .locator('input[type="checkbox"]');
      await expect(switchInput).toBeDisabled();

      // REVISAR: confirmar se botão 'Adicionar widget' fica oculto ou só disabled
      // em Tablet/Mobile. Plan supõe oculto; verificar live em CI.
    });
  });
});
