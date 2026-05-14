// Testsuite: Editar/Excluir widgets
// TC1 — Drawer de configurações ao 'Editar' Widget.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { drawerConfiguracoesEditarWidgetData as data } from './drawer-configuracoes-editar-widget.data.js';
import { editarExcluirWidgetsSharedData as shared } from './editar-excluir-widgets.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Editar/Excluir widgets', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test("Drawer de configurações ao 'Editar' Widget", async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Editar/Excluir widgets');
    await allure.story("Drawer de configurações ao 'Editar' Widget");
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await step('1. Criar painel e adicionar widget alvo na aba Layouts', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName, shared.panelDescription);
      await painelForm.getLayoutsTab().click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.widgetId);
      await expect(painelForm.getWidgetGridTitle(data.widgetTitle)).toBeVisible();
      expect(panelId).toBeGreaterThan(0);
    });

    await step("2. Clicar no ícone 'Editar' (lápis) do widget", async () => {
      await painelForm.getWidgetEditButton(data.widgetTitle).click();
      await expect(painelForm.getWidgetSettingsDrawer()).toBeVisible();
    });

    await step('3. Verificar campos do drawer (switches, input, seletor de ícone)', async () => {
      await expect(painelForm.getWidgetSettingsNameSwitch()).toBeVisible();
      await expect(painelForm.getWidgetSettingsNameInput()).toBeVisible();
      await expect(painelForm.getWidgetSettingsNameInput()).toHaveAttribute(
        'maxlength',
        data.expectedMaxLength,
      );
      await expect(painelForm.getWidgetSettingsIconSwitch()).toBeVisible();
      await expect(painelForm.getWidgetSettingsIconGrid()).toBeVisible();
    });

    await step("4. Verificar botões 'Cancelar' e 'Salvar' no rodapé do drawer", async () => {
      await expect(painelForm.getWidgetSettingsCancelButton()).toBeVisible();
      await expect(painelForm.getWidgetSettingsSaveButton()).toBeVisible();
      // Fecha o drawer ao final para deixar UI limpa
      await painelForm.getWidgetSettingsCancelButton().click();
      await expect(painelForm.getWidgetSettingsDrawer()).toBeHidden();
    });
  });
});
