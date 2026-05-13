// spec: projects/widgets/specs/layout-das-abas-plan.md
// seed: projects/widgets/tests/features/adicionar-editar-aba/criar-painel-happy-path.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { voltarDesktopData as data } from './voltar-desktop.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Layout das abas', () => {
  test('Voltar para visualização Desktop após Tablet/Mobile', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Layout das abas');
    await allure.story('Voltar para visualização Desktop após Tablet/Mobile');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await step('1. Setup — painel em Layouts e trocar para Tablet primeiro', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName);
      await painelForm.goToEdit(panelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }

      await page.getByRole('button', { name: 'Visualização: Tablet' }).click();
      await expect(page.getByTestId('widgets-grid-view-alert')).toBeVisible();
    });

    await step('2. Verificar estado em Tablet antes de voltar', async () => {
      await expect(page.getByRole('button', { name: 'Visualização: Tablet' })).toHaveClass(
        new RegExp(data.activeButtonClass),
      );

      const switchInput = page
        .getByTestId('widgets-grid-reorganize-switch')
        .locator('input[type="checkbox"]');
      await expect(switchInput).toBeDisabled();
    });

    await step("3. Clicar 'Visualização: Desktop' e validar retorno", async () => {
      const desktopBtn = page.getByRole('button', { name: 'Visualização: Desktop' });
      await desktopBtn.click();

      await expect(desktopBtn).toHaveClass(new RegExp(data.activeButtonClass));
      await expect(page.getByRole('button', { name: 'Visualização: Tablet' })).toHaveClass(
        new RegExp(data.inactiveButtonClass),
      );
      await expect(page.getByTestId('widgets-grid-view-alert')).toBeHidden();
    });

    await step('4. Validar reativação do switch reorganizar em Desktop', async () => {
      const switchInput = page
        .getByTestId('widgets-grid-reorganize-switch')
        .locator('input[type="checkbox"]');
      await expect(switchInput).toBeEnabled();
    });
  });
});
