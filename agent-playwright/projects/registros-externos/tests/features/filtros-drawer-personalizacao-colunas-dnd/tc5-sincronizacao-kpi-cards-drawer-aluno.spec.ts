import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { FiltrosColunasPage } from '../../../pages/FiltrosColunasPage.js';
import { DEFAULT_FILTERS_ABSENT } from './filtros-drawer.shared.data.js';

const SUITE = 'Filtros via drawer e personalização de colunas (DnD)';

// RN 66 — KPI card e radios do drawer manipulam o mesmo estado de filtro (Aluno).
// FIXME: o lado "radio do drawer" não existe neste build (filtros padrão ausentes),
// então não há como validar a sincronização KPI ↔ drawer. O lado KPI-card-como-filtro
// já é coberto pela suíte "KPI cards como filtro de status (Aluno)". Ver recon.
test.describe(SUITE, () => {
  test('Validar sincronização KPI cards ↔ drawer (Aluno)', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar sincronização KPI cards ↔ drawer (Aluno)');
    await allure.severity('high');
    test.fixme(true, DEFAULT_FILTERS_ABSENT);

    // Intenção (re-habilitar quando os filtros padrão forem entregues): no perfil
    // Aluno, clicar o KPI "Pendentes" e confirmar que o drawer abre com o radio
    // correspondente já selecionado; aplicar "Recusados" no drawer e ver o KPI
    // "Recusados" assumir o estado ativo.
    const filtros = new FiltrosColunasPage(page);
    await filtros.goto();
    await filtros.openDrawer();
    expect(await filtros.defaultFilterRadioCount()).toBeGreaterThan(0);
  });
});
