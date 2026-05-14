// Testsuite: Adicionar widgets
// TC2 — Validar componentes do drawer de widgets.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { validarComponentesDrawerData as data } from './validar-componentes-drawer.data.js';
import { adicionarWidgetsSharedData as shared } from './adicionar-widgets.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar widgets', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test('Validar componentes do drawer de widgets', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar widgets');
    await allure.story('Validar componentes do drawer de widgets');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step('Pré-condição: criar painel e abrir drawer', async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName, shared.panelDescription);
      await painelForm.getLayoutsTab().click();
      await painelForm.openWidgetDrawer();
    });

    await allure.step('1. Validar componentes essenciais do drawer', async () => {
      await expect(painelForm.getWidgetDrawer().getByText('Widgets disponíveis')).toBeVisible();
      await expect(painelForm.getWidgetDrawerSearch()).toBeVisible();
      await expect(painelForm.getWidgetDrawerFilterToggle()).toBeVisible();
      await expect(painelForm.getWidgetCategoryGroup('learning')).toBeVisible();
      await expect(painelForm.getWidgetDrawerCloseButton()).toBeVisible();
    });
  });
});
