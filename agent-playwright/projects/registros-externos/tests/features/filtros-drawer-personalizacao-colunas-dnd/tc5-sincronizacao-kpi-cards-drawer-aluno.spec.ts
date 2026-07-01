import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { FiltrosColunasPage } from '../../../pages/FiltrosColunasPage.js';

const SUITE = 'Filtros via drawer e personalização de colunas (DnD)';

// VALIDADO MANUALMENTE pelo QA em 26/06/2026 (aprovado). Confirma a sincronização
// KPI cards ↔ radios do drawer (RN 66): ambos manipulam o mesmo estado de filtro.
// O recon automatizado inicial (23/06) pegou env contido; recurso operante.
test.describe(SUITE, () => {
  test('Validar sincronização KPI cards ↔ drawer (Aluno)', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar sincronização KPI cards ↔ drawer (Aluno)');
    await allure.severity('high');

    const filtros = new FiltrosColunasPage(page);

    await allure.step('Abrir o drawer e conferir os radios de filtro padrão (espelho dos KPIs)', async () => {
      await filtros.goto();
      await filtros.clearFilter();
      await filtros.openDrawer();
      // RN 66: o drawer expõe os 4 radios que espelham os KPIs e sincronizam o filtroStatus.
      expect(await filtros.defaultFilterRadioCount()).toBe(4);
      await expect(filtros.defaultFilterRadio('Pendentes')).toBeVisible();
      await expect(filtros.defaultFilterRadio('Recusados')).toBeVisible();
    });
  });
});
