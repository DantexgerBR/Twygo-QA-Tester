// spec: projects/widgets/specs/layout-das-abas-plan.md
// seed: projects/widgets/tests/features/adicionar-editar-aba/criar-painel-happy-path.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { estadoVazioSemWidgetsData as data } from './estado-vazio-sem-widgets.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Layout das abas', () => {
  test('Estado vazio da aba sem widgets', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Layout das abas');
    await allure.story('Estado vazio da aba sem widgets');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await step('1. Setup — criar painel SEM adicionar widgets', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName);
      await painelForm.goToEdit(panelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }

      await expect(page.getByTestId('widgets-grid-empty-state')).toBeVisible();
      await expect(painelForm.getGridItems()).toHaveCount(0);
    });

    await step('2. Validar conteúdo do empty state — título, descrição, CTA', async () => {
      const empty = page.getByTestId('widgets-grid-empty-state');
      await expect(empty).toContainText(data.emptyTitle);
      await expect(empty).toContainText(data.emptyDescription);

      const ctaButton = page.getByTestId('widgets-grid-empty-state-add-button');
      await expect(ctaButton).toBeVisible();
      await expect(ctaButton).toBeEnabled();
    });

    await step("3. Clicar 'Adicionar Widget' do empty state e validar abertura do drawer", async () => {
      await page.getByTestId('widgets-grid-empty-state-add-button').click();
      await expect(painelForm.getWidgetDrawer()).toBeVisible();
    });
  });
});
