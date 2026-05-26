// Testsuite: Adicionar widgets
// TC6 — Pesquisar widget pelo nome no drawer.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { pesquisarWidgetData as data } from './pesquisar-widget-nome.data.js';
import { adicionarWidgetsSharedData as shared } from './adicionar-widgets.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar widgets', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test('Pesquisar widget pelo nome no drawer', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar widgets');
    await allure.story('Pesquisar widget pelo nome no drawer');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step('Pré-condição: criar painel e abrir drawer', async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName, shared.panelDescription);
      await painelForm.getLayoutsTab().click();
      await painelForm.openWidgetDrawer();
    });

    await allure.step(`1. Pesquisar por "${data.searchTerm}"`, async () => {
      await painelForm.getWidgetDrawerSearch().fill(data.searchTerm);
    });

    await allure.step('2. Validar que apenas Ranking está visível', async () => {
      await expect(painelForm.getWidgetCard('ranking')).toBeVisible();
      await expect(painelForm.getWidgetCard('activity_summary')).toBeHidden();
      await expect(painelForm.getWidgetCard('in_progress_contents')).toBeHidden();
      await expect(painelForm.getWidgetCard('my_certificates')).toBeHidden();
    });
  });
});
