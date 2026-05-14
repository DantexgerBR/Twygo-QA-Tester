// Testsuite: Editar/Excluir widgets
// TC5 — Excluir widget pelo ícone 'x'.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { excluirWidgetIconeXData as data } from './excluir-widget-icone-x.data.js';
import { editarExcluirWidgetsSharedData as shared } from './editar-excluir-widgets.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Editar/Excluir widgets', () => {
  test("Excluir widget pelo ícone 'x'", async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Editar/Excluir widgets');
    await allure.story("Excluir widget pelo ícone 'x'");
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);
    let panelId = 0;

    await step('Pré-condição: painel com widget alvo na aba Layouts', async () => {
      await painelForm.goToNew();
      panelId = await painelForm.createPanel(data.panelName, shared.panelDescription);
      await painelForm.getLayoutsTab().click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.widgetId);
      await expect(painelForm.getWidgetGridTitle(data.widgetTitle)).toBeVisible();
      await expect(painelForm.getGridItems()).toHaveCount(1);
    });

    await step("1. Clicar no ícone 'Excluir' (x) do widget", async () => {
      await painelForm.getWidgetRemoveButton(data.widgetTitle).click();
      await expect(painelForm.getWidgetGridTitle(data.widgetTitle)).toHaveCount(0);
      await expect(painelForm.getGridItems()).toHaveCount(0);
    });

    await step("2. Clicar em 'Salvar Layout' para persistir", async () => {
      // Toast "Widget adicionado" + chat HubSpot interceptam click — usar force.
      await painelForm.waitForToastsToClear();
      await painelForm.getSaveLayoutButton().click({ force: true });
    });

    await step('3. Recarregar layout e validar persistência da remoção', async () => {
      await painelForm.goToEdit(panelId, 'layouts');
      await expect(painelForm.getWidgetGridTitle(data.widgetTitle)).toHaveCount(0);
    });
  });
});
