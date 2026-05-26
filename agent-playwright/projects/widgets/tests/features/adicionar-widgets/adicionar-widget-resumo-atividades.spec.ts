// Testsuite: Adicionar widgets
// TC7 — Adicionar widget 'Resumo das atividades'.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { widgetResumoData as data } from './adicionar-widget-resumo-atividades.data.js';
import { adicionarWidgetsSharedData as shared } from './adicionar-widgets.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar widgets', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test("Adicionar widget 'Resumo das atividades'", async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar widgets');
    await allure.story("Adicionar widget 'Resumo das atividades'");
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step('Pré-condição: criar painel e abrir Layouts', async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName, shared.panelDescription);
      await painelForm.getLayoutsTab().click();
    });

    await allure.step('1. Abrir drawer e adicionar widget', async () => {
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.widgetId);
    });

    await allure.step('2. Validar widget no grid', async () => {
      await expect(painelForm.getGridItems()).toHaveCount(1);
      await expect(painelForm.getWidgetGridTitle(data.widgetTitle)).toBeVisible();
    });
  });
});
