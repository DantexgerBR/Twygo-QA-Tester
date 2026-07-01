import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosAdminPage } from '../../../pages/RegistrosAdminPage.js';
import { kpiCardsAdminData as data } from './kpi-cards-dashboard-estatico.shared.data.js';

const SUITE = 'KPI cards como dashboard estático (Admin/Líder)';

// A suíte irmã do Aluno mostrou que a UI em Stage exibe tooltips genéricos, não o
// tom da AT (lá foi a RN 18.3.1). Aqui asseramos o tom institucional DOCUMENTADO
// (RN 18.3.2). Se a UI divergir, a falha vermelha é o sinal correto da divergência
// produto×AT — NÃO esconder com fixme (Anti-pattern F do CLAUDE.md).
test.describe(SUITE, () => {
  test('Validar tooltips no tom institucional do Admin', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar tooltips no tom institucional do Admin');
    await allure.severity('normal');
    await allure.tag('REVIEW_NEEDED');

    const registros = new RegistrosAdminPage(page);

    await allure.step('1. Acessar "Aprendizagem > Registros" como Admin', async () => {
      await registros.goto();
    });

    await allure.step('2. Tooltip do card "Emitidos"', async () => {
      expect(await registros.readTooltip('emitted')).toBe(data.tooltipsAdminEsperado.emitted);
    });

    await allure.step('3. Tooltip do card "Expirados"', async () => {
      expect(await registros.readTooltip('expired')).toBe(data.tooltipsAdminEsperado.expired);
    });

    await allure.step('4. Tooltip do card "Pendentes"', async () => {
      expect(await registros.readTooltip('pending')).toBe(data.tooltipsAdminEsperado.pending);
    });

    await allure.step('5. Tooltip do card "Recusados"', async () => {
      expect(await registros.readTooltip('rejected')).toBe(data.tooltipsAdminEsperado.rejected);
    });
  });
});
