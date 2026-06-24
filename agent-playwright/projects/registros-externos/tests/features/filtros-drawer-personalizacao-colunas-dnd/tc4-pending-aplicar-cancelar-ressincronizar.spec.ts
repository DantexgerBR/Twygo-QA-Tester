import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { FiltrosColunasPage } from '../../../pages/FiltrosColunasPage.js';
import { DEFAULT_FILTERS_ABSENT } from './filtros-drawer.shared.data.js';

const SUITE = 'Filtros via drawer e personalização de colunas (DnD)';

// RN 65 — seleção pendente do radio só vira filtro efetivo no Aplicar, é
// descartada no Cancelar/X e ressincroniza a cada abertura.
// FIXME: requer os radios de filtro padrão, ausentes neste build. Ver recon.
test.describe(SUITE, () => {
  test('Validar comportamento de pending (aplicar, cancelar, ressincronizar)', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar comportamento de pending (aplicar, cancelar, ressincronizar)');
    await allure.severity('critical');
    test.fixme(true, DEFAULT_FILTERS_ABSENT);

    // Intenção (re-habilitar quando os filtros padrão forem entregues):
    const filtros = new FiltrosColunasPage(page);
    await filtros.goto();
    await filtros.openDrawer();
    const pendente = page.getByText('Pendentes', { exact: true });
    await pendente.click();
    await filtros.listCloseButton().click();
    expect(await filtros.isFilterApplied()).toBe(false);
  });
});
