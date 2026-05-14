// Testsuite: Editar/Excluir widgets
// TC2 — Salvar alterações no drawer de configurações do widget.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { salvarAlteracoesDrawerWidgetData as data } from './salvar-alteracoes-drawer-widget.data.js';
import { editarExcluirWidgetsSharedData as shared } from './editar-excluir-widgets.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Editar/Excluir widgets', () => {
  test('Salvar alterações no drawer de configurações do widget', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Editar/Excluir widgets');
    await allure.story('Salvar alterações no drawer de configurações do widget');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await step('Pré-condição: painel com widget alvo + drawer de edição aberto', async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName, shared.panelDescription);
      await painelForm.getLayoutsTab().click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.widgetId);
      await painelForm.openWidgetSettings(data.widgetTitle);
    });

    await step("1. Ativar o switch 'Mostrar título'", async () => {
      await painelForm.setSwitch(painelForm.getWidgetSettingsNameSwitch(), true);
      await expect(painelForm.getWidgetSettingsNameSwitch()).toHaveAttribute('data-checked', '');
    });

    await step("2. Preencher o campo 'Título' com o valor customizado", async () => {
      await painelForm.getWidgetSettingsNameInput().fill(data.customTitle);
      await expect(painelForm.getWidgetSettingsNameInput()).toHaveValue(data.customTitle);
    });

    await step("3. Ativar o switch 'Mostrar ícone'", async () => {
      await painelForm.setSwitch(painelForm.getWidgetSettingsIconSwitch(), true);
      await expect(painelForm.getWidgetSettingsIconSwitch()).toHaveAttribute('data-checked', '');
    });

    await step('4. Selecionar um ícone no grid', async () => {
      await painelForm.getWidgetSettingsIconOption(data.iconName).click();
    });

    await step("5. Clicar em 'Salvar' e validar toast de sucesso", async () => {
      await painelForm.getWidgetSettingsSaveButton().click();
      await expect(painelForm.getWidgetSettingsDrawer()).toBeHidden();
      await expect(painelForm.getToast(data.successToast)).toBeVisible();
    });

    await step('6. Verificar widget no layout exibindo o novo título', async () => {
      await expect(painelForm.getWidgetGridTitle(data.customTitle)).toBeVisible();
    });
  });
});
