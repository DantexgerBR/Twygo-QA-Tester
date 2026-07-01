import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { FiltrosColunasPage } from '../../../pages/FiltrosColunasPage.js';
import { filtrosDrawerData as data } from './filtros-drawer.shared.data.js';
import { PRIMARY_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';

const SUITE = 'Filtros via drawer e personalização de colunas (DnD)';

// RN 63/63.1 — botão "Filtro" abre o drawer e reflete estado ativo + "Limpar filtro".
// ADAPTAÇÃO (recon 2026-06-23): a AT aplica o filtro padrão "Pendentes" para
// ativar o botão, mas os filtros padrão não existem neste build. Exercemos o
// MESMO RN (estado ativo + limpar) via customização de coluna, que também ativa
// o botão e expõe "#clear-filter". O sufixo "(N)" da AT não foi observado.
test.describe(SUITE, () => {
  test('Validar abertura do drawer e estado ativo do botão Filtro', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar abertura do drawer e estado ativo do botão Filtro');
    await allure.severity('critical');

    const filtros = new FiltrosColunasPage(page);

    test.info().annotations.push({
      type: 'divergência',
      description:
        'Filtros padrão ausentes no build (RN 63 passo 3 não exercível como descrito). ' +
        'Estado ativo validado via customização de coluna. Sufixo "(N)" não observado.',
    });

    await allure.step('1. Acessar Registros — botão "Filtro" sem filtro aplicado', async () => {
      await filtros.goto();
      await filtros.clearFilter(); // garante baseline limpa (customização persiste entre runs)
      expect(await filtros.isFilterApplied()).toBe(false);
      await expect(filtros.filterButton()).toBeVisible();
    });

    await allure.step('2. Clicar em "Filtro" abre o drawer "Lista de filtros"', async () => {
      const mode = await filtros.openDrawer();
      expect(mode).toBe('lista');
      await expect(filtros.listTitle()).toBeVisible();
    });

    await allure.step('3. Aplicar customização → botão sólido + "Limpar filtro" aparece', async () => {
      await filtros.gotoFiltroRapido();
      await filtros.setColumn(data.toggleOffColumn, false);
      await filtros.applyFiltroRapido();
      await expect(filtros.clearFilterButton()).toBeVisible({ timeout: 10_000 });
      expect(await filtros.isFilterButtonSolid()).toBe(true);
    });

    await allure.step('4. Clicar em "Limpar filtro" volta o botão à variante outline', async () => {
      await filtros.clearFilter();
      await expect(filtros.clearFilterButton()).toBeHidden();
      expect(await filtros.isFilterButtonSolid()).toBe(false);
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
