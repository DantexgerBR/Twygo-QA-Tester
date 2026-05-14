// Testsuite: Adicionar widgets
// TC4 — Validar informação literal dos widgets.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { informacaoLiteralData as data } from './validar-informacao-literal-widgets.data.js';
import { adicionarWidgetsSharedData as shared } from './adicionar-widgets.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar widgets', () => {
  test('Validar informação literal dos widgets', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar widgets');
    await allure.story('Validar informação literal dos widgets');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step('Pré-condição: criar painel e abrir drawer', async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName, shared.panelDescription);
      await painelForm.getLayoutsTab().click();
      await painelForm.openWidgetDrawer();
    });

    for (const w of data.widgets) {
      await allure.step(`Validar widget ${w.title}`, async () => {
        const card = painelForm.getWidgetCard(w.id);
        await expect(card).toContainText(w.title);
        await expect(card).toContainText(w.description);
        await expect(painelForm.getWidgetCardProfile(w.id)).toHaveText('Usuário');
        await expect(painelForm.getWidgetCardCategoryLabel(w.id)).toHaveText('Aprendizagem');
      });
    }
  });
});
