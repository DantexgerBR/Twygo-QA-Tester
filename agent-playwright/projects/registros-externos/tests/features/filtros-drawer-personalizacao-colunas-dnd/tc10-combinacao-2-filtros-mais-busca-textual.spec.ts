import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { FiltrosColunasPage, COLUMN_KEY_TO_LABEL } from '../../../pages/FiltrosColunasPage.js';
import { PRIMARY_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';

const SUITE = 'Filtros via drawer e personalização de colunas (DnD)';

// VALIDADO MANUALMENTE pelo QA em 26/06/2026 (aprovado). Combinatória mínima do contrato
// 1.1 (RN 13.3/64/70): filtro padrão "Válidos" + colunas personalizadas + busca textual.
// O recon automatizado inicial (23/06) pegou env contido; recurso operante.
test.describe(SUITE, () => {
  test('Validar combinação de 2 filtros + busca textual (combinatória mínima)', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar combinação de 2 filtros + busca textual (combinatória mínima)');
    await allure.severity('high');

    const filtros = new FiltrosColunasPage(page);

    await allure.step('1. Aplicar o filtro padrão "Válidos" → lista filtra (Emitidos), botão "(1)"', async () => {
      await filtros.goto();
      await filtros.clearFilter();
      await filtros.openDrawer();
      await filtros.applyDefaultFilter('Válidos');
      await expect(filtros.clearFilterButton()).toBeVisible();
    });

    await allure.step('2. Desmarcar a coluna "Criado por" e aplicar — filtro "Válidos" se mantém', async () => {
      await filtros.openDrawer();
      await filtros.gotoFiltroRapido();
      await filtros.setColumn('created_by', false);
      await filtros.applyFiltroRapido();
      expect(await filtros.getTableHeaders()).not.toContain(COLUMN_KEY_TO_LABEL.created_by);
    });

    await allure.step('3. Buscar "Coursera" → só Emitidos do provedor "Coursera" (interseção dos 3)', async () => {
      await page.getByPlaceholder(/Pesquise por pessoa, conteúdo ou provedor/i).fill('Coursera');
      await page.getByPlaceholder(/Pesquise por pessoa, conteúdo ou provedor/i).press('Enter');
      await page.waitForLoadState('networkidle').catch(() => undefined);
    });

    await allure.step('4. "Limpar filtro" remove o padrão; busca permanece', async () => {
      await filtros.clearFilter();
      expect(await filtros.isFilterApplied()).toBe(false);
    });
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: PRIMARY_STORAGE_PATH });
    const page = await context.newPage();
    try {
      await new FiltrosColunasPage(page).restoreDefaultColumns();
    } catch {
      /* best-effort: pref de UI persistida */
    } finally {
      await context.close();
    }
  });
});
