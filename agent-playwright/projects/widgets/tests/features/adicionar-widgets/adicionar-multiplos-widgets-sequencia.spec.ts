// Testsuite: Adicionar widgets
// TC11 — Adicionar múltiplos widgets em sequência.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { multiplosWidgetsData as data } from './adicionar-multiplos-widgets-sequencia.data.js';
import { adicionarWidgetsSharedData as shared } from './adicionar-widgets.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar widgets', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test('Adicionar múltiplos widgets em sequência', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar widgets');
    await allure.story('Adicionar múltiplos widgets em sequência');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step('Pré-condição: criar painel e abrir Layouts', async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName, shared.panelDescription);
      await painelForm.getLayoutsTab().click();
    });

    for (const [i, w] of data.widgets.entries()) {
      await allure.step(`Adicionar widget ${i + 1}: ${w.title}`, async () => {
        await painelForm.openWidgetDrawer();
        await painelForm.addWidget(w.id);
        await expect(painelForm.getGridItems()).toHaveCount(i + 1);
        await expect(painelForm.getWidgetGridTitle(w.title)).toBeVisible();
      });
    }

    await allure.step('Validar total final de 4 widgets', async () => {
      await expect(painelForm.getGridItems()).toHaveCount(data.widgets.length);
    });
  });
});
