import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { FiltrosColunasPage } from '../../../pages/FiltrosColunasPage.js';
import { DEFAULT_FILTERS_ABSENT } from './filtros-drawer.shared.data.js';

const SUITE = 'Filtros via drawer e personalização de colunas (DnD)';

// RN 64 — busca interna filtra os filtros pelo label.
// FIXME: depende dos filtros padrão (Válidos/Expirados/Pendentes/Recusados), que
// não existem neste build — não há o que buscar. Categoria fixme legítima
// (feature/AT, não bug de produto). Ver recon 2026-06-23.
test.describe(SUITE, () => {
  test('Validar busca interna da lista de filtros', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar busca interna da lista de filtros');
    await allure.severity('normal');
    test.fixme(true, DEFAULT_FILTERS_ABSENT);

    // Intenção (re-habilitar quando os filtros padrão forem entregues):
    const filtros = new FiltrosColunasPage(page);
    await filtros.goto();
    await filtros.openDrawer();
    await filtros.listSearchInput().fill('Pend');
    await expect(page.getByText('Pendentes', { exact: true })).toBeVisible();
    await filtros.listSearchInput().fill('');
    expect(await filtros.defaultFilterRadioCount()).toBe(4);
  });
});
