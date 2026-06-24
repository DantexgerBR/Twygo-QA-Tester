import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { FiltrosColunasPage, COLUMN_KEY_TO_LABEL } from '../../../pages/FiltrosColunasPage.js';

const SUITE = 'Filtros via drawer e personalização de colunas (DnD)';

// RN 67/68 — navegação Lista de filtros ↔ Filtro rápido + estrutura da view de
// personalização. DIVERGÊNCIA (recon): a AT espera toast "Em breve" ao clicar
// "+ Opções de filtro"; o build abre um MENU funcional de colunas filtráveis.
test.describe(SUITE, () => {
  test('Validar navegação para a view "Filtro rápido"', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar navegação para a view "Filtro rápido"');
    await allure.severity('high');

    const filtros = new FiltrosColunasPage(page);

    test.info().annotations.push({
      type: 'divergência',
      description:
        '"+ Opções de filtro" abre menu funcional de colunas (18 itens), não o toast "Em breve" ' +
        'que a AT esperava. Filtro avançado por coluna está implementado.',
    });

    await allure.step('1. Abrir drawer e clicar "Novo" → view "Filtro rápido"', async () => {
      await filtros.goto();
      await filtros.clearFilter();
      await filtros.openDrawer();
      await filtros.gotoFiltroRapido();
      await expect(filtros.formTitle()).toHaveText(/Filtro rápido/i);
      await expect(filtros.backToListaButton()).toBeVisible();
    });

    await allure.step('2. Grupo "Colunas para filtrar" + botão "+ Opções de filtro"', async () => {
      await expect(filtros.columnsFilterAccordion()).toBeVisible();
      await expect(filtros.optionsFilterMenuButton()).toBeVisible();
    });

    await allure.step('3. "+ Opções de filtro" abre menu de colunas (divergência: não é toast)', async () => {
      await filtros.optionsFilterMenuButton().click();
      await expect(filtros.optionsFilterMenu()).toBeVisible({ timeout: 8_000 });
      await page.keyboard.press('Escape');
    });

    await allure.step('4. Grupo "Colunas para exibir" lista colunas com checkbox', async () => {
      await filtros.expandColumnsShow();
      await expect(filtros.columnCheckbox('person')).toBeVisible();
      // colunas default vêm marcadas
      expect(await filtros.isColumnChecked('person')).toBe(true);
      expect(await filtros.isColumnChecked('content')).toBe(true);
      // cada linha é arrastável (react-beautiful-dnd handle)
      await expect(filtros.dragHandle('person')).toHaveAttribute('draggable', 'true');
      expect(Object.keys(COLUMN_KEY_TO_LABEL).length).toBeGreaterThan(10);
    });

    await allure.step('5. Link "Lista de filtros" volta para a view de lista', async () => {
      await filtros.backToLista();
      await expect(filtros.listTitle()).toBeVisible();
    });
  });
});
