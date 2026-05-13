// Testsuite: Editar/Excluir widgets
// TC4 — Limite de 255 caracteres no campo 'Título' do drawer.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { limiteTituloDrawerWidgetData as data } from './limite-titulo-drawer-widget.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Editar/Excluir widgets', () => {
  test("Limite de 255 caracteres no campo 'Título' do drawer", async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Editar/Excluir widgets');
    await allure.story("Limite de 255 caracteres no campo 'Título' do drawer");
    await allure.severity('minor');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await step('Pré-condição: painel com widget + drawer aberto', async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName);
      await painelForm.getLayoutsTab().click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.widgetId);
      await painelForm.openWidgetSettings(data.widgetTitle);
    });

    await step('1. Verificar atributo maxlength=255 no input Título', async () => {
      await expect(painelForm.getWidgetSettingsNameInput()).toHaveAttribute(
        'maxlength',
        String(data.maxLength),
      );
    });

    await step('2. Preencher com 256 caracteres — campo trunca em 255', async () => {
      await painelForm.setSwitch(painelForm.getWidgetSettingsNameSwitch(), true);
      await painelForm.getWidgetSettingsNameInput().fill('');
      await painelForm.getWidgetSettingsNameInput().fill(data.overflowTitle);
      const value = await painelForm.getWidgetSettingsNameInput().inputValue();
      expect(value).toHaveLength(data.maxLength);
    });

    await step('3. Fechar drawer com Cancelar', async () => {
      await painelForm.getWidgetSettingsCancelButton().click();
      await expect(painelForm.getWidgetSettingsDrawer()).toBeHidden();
    });
  });
});
