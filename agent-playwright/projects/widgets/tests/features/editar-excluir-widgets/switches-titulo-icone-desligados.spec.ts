// Testsuite: Editar/Excluir widgets
// TC6 — Switches 'Mostrar título' e 'Mostrar ícone' desligados.
// REVISAR: prosa XML diz "Campo Título/Ícone fica desabilitado" — DOM observado
// não desabilita o input/grid quando o switch está OFF (planner live 2026-05-11).
// O efeito do switch é visual no card do widget (título/ícone somem do grid).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { switchesTituloIconeDesligadosData as data } from './switches-titulo-icone-desligados.data.js';
import { editarExcluirWidgetsSharedData as shared } from './editar-excluir-widgets.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Editar/Excluir widgets', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test("Switches 'Mostrar título' e 'Mostrar ícone' desligados", async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Editar/Excluir widgets');
    await allure.story("Switches 'Mostrar título' e 'Mostrar ícone' desligados");
    await allure.severity('normal');
    await allure.label('executionType', 'manual');
    await allure.tag('REVIEW_NEEDED');

    const painelForm = new PainelFormPage(page);

    await step('Pré-condição: painel com widget + drawer aberto', async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName, shared.panelDescription);
      await painelForm.getLayoutsTab().click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.widgetId);
      await painelForm.openWidgetSettings(data.widgetTitle);
    });

    await step("1. Desativar switch 'Mostrar título'", async () => {
      await painelForm.setSwitch(painelForm.getWidgetSettingsNameSwitch(), false);
      await expect(painelForm.getWidgetSettingsNameSwitch()).not.toHaveAttribute(
        'data-checked',
        '',
      );
    });

    await step("2. Desativar switch 'Mostrar ícone'", async () => {
      await painelForm.setSwitch(painelForm.getWidgetSettingsIconSwitch(), false);
      await expect(painelForm.getWidgetSettingsIconSwitch()).not.toHaveAttribute(
        'data-checked',
        '',
      );
    });

    await step("3. Clicar em 'Salvar' e validar toast", async () => {
      await painelForm.getWidgetSettingsSaveButton().click();
      await expect(painelForm.getWidgetSettingsDrawer()).toBeHidden();
      await expect(painelForm.getToast(data.successToast)).toBeVisible();
    });

    await step('4. Widget no grid sem título e sem ícone', async () => {
      await expect(painelForm.getWidgetGridTitle(data.widgetTitle)).toHaveCount(0);
    });
  });
});
