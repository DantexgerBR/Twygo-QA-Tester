// Testsuite: Adicionar widgets
// TC3 — Validar widgets disponíveis na categoria Aprendizagem.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { widgetsAprendizagemData as data } from './validar-widgets-categoria-aprendizagem.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar widgets', () => {
  test('Validar widgets disponíveis na categoria Aprendizagem', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar widgets');
    await allure.story('Validar widgets disponíveis na categoria Aprendizagem');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step('Pré-condição: criar painel e abrir drawer', async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName);
      await painelForm.getLayoutsTab().click();
      await painelForm.openWidgetDrawer();
    });

    await allure.step('1. Validar que existem 4 widgets na categoria Aprendizagem', async () => {
      await expect(painelForm.getWidgetCategoryGroup('learning')).toBeVisible();
      for (const id of data.expectedWidgetIds) {
        await expect(painelForm.getWidgetCard(id)).toBeVisible();
      }
    });
  });
});
