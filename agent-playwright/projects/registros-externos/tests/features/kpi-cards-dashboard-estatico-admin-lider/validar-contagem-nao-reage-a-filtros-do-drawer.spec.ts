import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosAdminPage } from '../../../pages/RegistrosAdminPage.js';
import { kpiCardsAdminData as data } from './kpi-cards-dashboard-estatico.shared.data.js';

const SUITE = 'KPI cards como dashboard estático (Admin/Líder)';

test.describe(SUITE, () => {
  test('Validar que a contagem não reage a filtros do drawer', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar que a contagem não reage a filtros do drawer');
    await allure.severity('critical');

    const registros = new RegistrosAdminPage(page);

    await allure.step('1. Acessar como Admin e anotar as contagens dos 4 cards', async () => {
      await registros.goto();
    });

    await allure.step(
      '2-3. Aplicar filtro padrão "Pendentes" no drawer → contagens inalteradas (RN 31)',
      async () => {
        const before = await registros.getCounts();
        await registros.openFilterDrawer();
        if (await registros.hasDefaultFilter(data.statusFilterLabel)) {
          await registros.applyDefaultFilter(data.statusFilterLabel);
          // Lista filtra, mas as contagens dos KPIs permanecem as mesmas.
          expect(await registros.getCounts()).toEqual(before);
        } else {
          // REVISAR: no env atual o drawer de filtros não traz o filtro padrão
          // "Pendentes" (mesma limitação de seed da suíte Aluno — drawer vazio).
          // A invariante RN 31 é exercida pela busca no passo 4.
          await registros.cancelFilterDrawer();
        }
      },
    );

    await allure.step(
      '4. Buscar por uma pessoa → lista filtra, contagens dos KPIs inalteradas (RN 31)',
      async () => {
        const before = await registros.getCounts();
        const rowsBefore = await registros.getVisibleRecordCount();
        const personName = await registros.getFirstRowPersonName();
        expect(personName, 'massa de dados deve ter ao menos 1 registro para exercer a busca').not.toBe('');

        await registros.search(personName);
        // A lista reage à busca (filtra), mas os KPIs NÃO — são informativos (RN 31).
        await expect
          .poll(async () => registros.getVisibleRecordCount(), { timeout: 10_000 })
          .toBeLessThanOrEqual(rowsBefore);
        // REGRESSÃO 2026-06-22 (RN 31): no Admin os números dos cards passaram a
        // REAGIR à busca — ex.: buscar "QA11 TC3" muda emitted 156→160 e pending
        // 79→75. A contagem deveria permanecer a total da org, independente do
        // filtro da lista. Asserção mantém o comportamento esperado; o vermelho é
        // o sinal correto da regressão (bug-report em outputs/<slug>/bug-reports/).
        expect(
          await registros.getCounts(),
          'RN 31: contagem dos KPI cards do Admin deve ser informativa e NÃO reagir a filtros/busca',
        ).toEqual(before);

        await registros.clearSearch();
      },
    );
  });
});
