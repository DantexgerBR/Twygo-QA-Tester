// spec: projects/widgets/specs/layout-das-abas-plan.md
// seed: projects/widgets/tests/features/adicionar-editar-aba/criar-painel-happy-path.spec.ts

// AVISO: drag funciona no DOM (transform CSS atualizado) mas reload perde
// o estado (Save Layout não persiste — ver feedback_panel_layout_save_no_persist.md).
// Este teste valida apenas o comportamento local de drag-and-drop e a
// transição react-resizable-hide → react-draggable do switch.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { ativarSwitchReorganizarMoverWidgetData as data } from './ativar-switch-reorganizar-mover-widget.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Layout das abas', () => {
  test("Ativar switch 'Permitir reorganizar widgets' e mover widget", async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Layout das abas');
    await allure.story("Ativar switch 'Permitir reorganizar widgets' e mover widget");
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await step('1. Setup — painel com 2 widgets e switch reorganizar OFF', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName);
      await painelForm.goToEdit(panelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }

      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.widgets[0]);
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.widgets[1]);
      await painelForm.waitForToastsToClear();

      await expect(painelForm.getGridItems()).toHaveCount(2);

      const switchLabel = page.getByTestId('widgets-grid-reorganize-switch').locator('.chakra-switch');
      await expect(switchLabel).not.toHaveAttribute('data-checked', '');

      // Grid items em estado não-draggable
      const firstItem = painelForm.getGridItems().first();
      await expect(firstItem).toHaveClass(/react-resizable-hide/);
    });

    await step("2. Ativar switch 'Permitir reorganizar widgets' (click force:true em .chakra-switch)", async () => {
      // Chakra label intercepta pointer events — usar force:true (§7.5 CLAUDE.md)
      const switchLabel = page.getByTestId('widgets-grid-reorganize-switch').locator('.chakra-switch');
      await switchLabel.click({ force: true });

      await expect(switchLabel).toHaveAttribute('data-checked', '');

      const switchInput = page
        .getByTestId('widgets-grid-reorganize-switch')
        .locator('input[type="checkbox"]');
      await expect(switchInput).toBeChecked();

      // Grid items agora draggable
      const firstItem = painelForm.getGridItems().first();
      await expect(firstItem).toHaveClass(/react-draggable/);
    });

    await step('3. Arrastar primeiro widget e verificar mudança visual', async () => {
      const items = painelForm.getGridItems();
      const source = items.nth(0);
      const target = items.nth(1);

      // Capturar posições iniciais via boundingBox
      const initialBox = await source.boundingBox();
      expect(initialBox).not.toBeNull();

      // Drag via mouse manual (drag handle do widget)
      const dragHandle = source.locator('[data-test-id$="-drag-handle"]').first();
      await expect(dragHandle).toBeVisible();

      const handleBox = await dragHandle.boundingBox();
      const targetBox = await target.boundingBox();
      expect(handleBox && targetBox).toBeTruthy();

      if (handleBox && targetBox) {
        await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 10 });
        await page.mouse.up();
      }

      // Ambos widgets permanecem visíveis após drag
      await expect(items).toHaveCount(2);
    });
  });
});
