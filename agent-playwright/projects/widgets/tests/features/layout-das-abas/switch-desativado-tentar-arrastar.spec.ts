// spec: projects/widgets/specs/layout-das-abas-plan.md
// seed: projects/widgets/tests/features/adicionar-editar-aba/criar-painel-happy-path.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { switchDesativadoTentarArrastarData as data } from './switch-desativado-tentar-arrastar.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Layout das abas', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test('Switch desativado: tentar arrastar widget', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Layout das abas');
    await allure.story('Switch desativado: tentar arrastar widget');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await step('1. Setup — painel com 1 widget e switch OFF (default)', async () => {
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

      const switchLabel = page.getByTestId('widgets-grid-reorganize-switch').locator('.chakra-switch');
      await expect(switchLabel).not.toHaveAttribute('data-checked', '');

      const item = painelForm.getGridItems().first();
      await expect(item).toHaveClass(/react-resizable-hide/);
      await expect(item.locator('[data-test-id$="-drag-handle"]').first()).toBeVisible();
    });

    await step('2. Tentar arrastar widget com switch OFF — não deve mover', async () => {
      const item = painelForm.getGridItems().first();
      const initialBox = await item.boundingBox();
      expect(initialBox).not.toBeNull();

      const dragHandle = item.locator('[data-test-id$="-drag-handle"]').first();
      const handleBox = await dragHandle.boundingBox();
      expect(handleBox).not.toBeNull();

      if (handleBox && initialBox) {
        await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(handleBox.x + 300, handleBox.y + 300, { steps: 10 });
        await page.mouse.up();

        const afterBox = await item.boundingBox();
        expect(afterBox?.x).toBe(initialBox.x);
        expect(afterBox?.y).toBe(initialBox.y);
      }
    });

    await step('3. Ativar switch e validar que drag-handle volta a responder', async () => {
      const switchLabel = page.getByTestId('widgets-grid-reorganize-switch').locator('.chakra-switch');
      await switchLabel.click({ force: true });
      await expect(switchLabel).toHaveAttribute('data-checked', '');

      const item = painelForm.getGridItems().first();
      await expect(item).toHaveClass(/react-draggable/);
    });
  });
});
