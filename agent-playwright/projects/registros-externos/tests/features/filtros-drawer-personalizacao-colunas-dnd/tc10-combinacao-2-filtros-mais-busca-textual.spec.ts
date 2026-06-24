import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { FiltrosColunasPage } from '../../../pages/FiltrosColunasPage.js';
import { DEFAULT_FILTERS_ABSENT } from './filtros-drawer.shared.data.js';

const SUITE = 'Filtros via drawer e personalização de colunas (DnD)';

// RN 13.3/64/70 — interseção de filtro padrão "Válidos" + colunas personalizadas
// + busca textual (combinatória mínima do contrato 1.1).
// FIXME: a etapa "aplicar o filtro padrão Válidos" depende dos filtros padrão,
// ausentes neste build. A combinatória coluna+busca está coberta isoladamente
// por TC7 (colunas) e pela suíte de listagem (busca). Ver recon 2026-06-23.
test.describe(SUITE, () => {
  test('Validar combinação de 2 filtros + busca textual (combinatória mínima)', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar combinação de 2 filtros + busca textual (combinatória mínima)');
    await allure.severity('high');
    test.fixme(true, DEFAULT_FILTERS_ABSENT);

    // Intenção (re-habilitar quando os filtros padrão forem entregues):
    const filtros = new FiltrosColunasPage(page);
    await filtros.goto();
    await filtros.openDrawer();
    expect(await filtros.defaultFilterRadioCount()).toBeGreaterThan(0);
  });
});
