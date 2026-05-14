// Testsuite: Adicionar widgets
// TC5 — Filtrar widgets pelo multi select 'Categorias'.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { filtrarCategoriasData as data } from './filtrar-widgets-categorias.data.js';
import { adicionarWidgetsSharedData as shared } from './adicionar-widgets.shared.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar widgets', () => {
  test("Filtrar widgets pelo multi select 'Categorias'", async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar widgets');
    await allure.story("Filtrar widgets pelo multi select 'Categorias'");
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step('Pré-condição: criar painel e abrir drawer', async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName, shared.panelDescription);
      await painelForm.getLayoutsTab().click();
      await painelForm.openWidgetDrawer();
    });

    await allure.step('1. Expandir Filtros', async () => {
      await painelForm.getWidgetDrawerFilterToggle().click();
      await expect(painelForm.getCategoriesMultiselectInput()).toBeAttached();
    });

    await allure.step('2. Selecionar Aprendizagem no multi-select', async () => {
      await painelForm.selectCategoryFilter('Aprendizagem');
    });

    await allure.step('3. Validar que widgets de Aprendizagem permanecem visíveis', async () => {
      for (const id of data.expectedWidgetIds) {
        await expect(painelForm.getWidgetCard(id)).toBeVisible();
      }
    });
  });
});
