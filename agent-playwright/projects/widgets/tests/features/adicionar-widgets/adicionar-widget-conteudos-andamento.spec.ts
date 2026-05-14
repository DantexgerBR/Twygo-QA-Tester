// Testsuite: Adicionar widgets
// TC8 — Adicionar widget 'Conteúdos em andamento'.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { widgetConteudosData as data } from './adicionar-widget-conteudos-andamento.data.js';
import { adicionarWidgetsSharedData as shared } from './adicionar-widgets.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar widgets', () => {
  test("Adicionar widget 'Conteúdos em andamento'", async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar widgets');
    await allure.story("Adicionar widget 'Conteúdos em andamento'");
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
