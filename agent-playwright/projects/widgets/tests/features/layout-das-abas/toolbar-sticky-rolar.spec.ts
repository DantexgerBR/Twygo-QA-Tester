// spec: projects/widgets/specs/layout-das-abas-plan.md
// seed: projects/widgets/tests/features/adicionar-editar-aba/criar-painel-happy-path.spec.ts

// Rodapé position:fixed (classe css-1bvxcno) — sempre visível durante scroll.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { toolbarStickyRolarData as data } from './toolbar-sticky-rolar.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Layout das abas', () => {
  test('Toolbar permanece fixa ao rolar a área de layout', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Layout das abas');
    await allure.story('Toolbar permanece fixa ao rolar a área de layout');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await step('1. Setup — painel com 4 widgets para gerar altura suficiente pra scroll', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName);
      await painelForm.goToEdit(panelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }

      for (const w of data.widgets) {
        await painelForm.openWidgetDrawer();
        await painelForm.addWidget(w);
        await painelForm.waitForToastsToClear();
      }
      await expect(painelForm.getGridItems()).toHaveCount(data.widgets.length);

      // Rodapé fixed visível antes do scroll
      await expect(page.getByTestId('panel-layout-save-button')).toBeVisible();
      await expect(page.getByTestId('panel-layout-cancel-button')).toBeVisible();
    });

    await step('2. Scroll para baixo (End) e validar rodapé permanece visível', async () => {
      await page.keyboard.press('End');

      const saveButton = page.getByTestId('panel-layout-save-button');
      const cancelButton = page.getByTestId('panel-layout-cancel-button');

      await expect(saveButton).toBeInViewport();
      await expect(cancelButton).toBeInViewport();
    });

    await step('3. Scroll para topo (Home) e validar toolbar de ações visível', async () => {
      await page.keyboard.press('Home');

      await expect(page.getByTestId('widgets-grid-actions')).toBeVisible();
      // Footer continua fixo
      await expect(page.getByTestId('panel-layout-save-button')).toBeInViewport();
    });
  });
});
