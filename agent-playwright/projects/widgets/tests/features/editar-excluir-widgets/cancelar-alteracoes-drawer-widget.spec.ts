// Testsuite: Editar/Excluir widgets
// TC3 — Cancelar alterações no drawer de configurações do widget.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { cancelarAlteracoesDrawerWidgetData as data } from './cancelar-alteracoes-drawer-widget.data.js';
import { editarExcluirWidgetsSharedData as shared } from './editar-excluir-widgets.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Editar/Excluir widgets', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test('Cancelar alterações no drawer de configurações do widget', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Editar/Excluir widgets');
    await allure.story('Cancelar alterações no drawer de configurações do widget');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await step('Pré-condição: painel com widget alvo + drawer aberto', async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName, shared.panelDescription);
      await painelForm.getLayoutsTab().click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.widgetId);
      await expect(painelForm.getWidgetGridTitle(data.widgetTitle)).toBeVisible();
      await painelForm.openWidgetSettings(data.widgetTitle);
    });

    await step("1. Ativar switch 'Mostrar título'", async () => {
      await painelForm.setSwitch(painelForm.getWidgetSettingsNameSwitch(), true);
    });

    await step("2. Preencher 'Título' com valor descartável", async () => {
      await painelForm.getWidgetSettingsNameInput().fill(data.cancelledTitle);
      await expect(painelForm.getWidgetSettingsNameInput()).toHaveValue(data.cancelledTitle);
    });

    await step("3. Clicar em 'Cancelar' — drawer fecha sem persistir", async () => {
      await painelForm.getWidgetSettingsCancelButton().click();
      await expect(painelForm.getWidgetSettingsDrawer()).toBeHidden();
    });

    await step('4. Widget mantém o título original (alteração descartada)', async () => {
      await expect(painelForm.getWidgetGridTitle(data.widgetTitle)).toBeVisible();
      await expect(painelForm.getWidgetGridTitle(data.cancelledTitle)).toHaveCount(0);
    });
  });
});
