import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AdminRegistrosPage } from '../../../pages/AdminRegistrosPage.js';
import { createPendingRecord } from '../../../data/records-api.js';
import { kpisTempoRealData as data, makeMarker } from './atualizacao-kpis-tempo-real.shared.data.js';

const SUITE = data.suiteName;

// Sem cleanup: massa criada fica persistente (convenção do projeto).
test.describe(SUITE, () => {
  let marker: string;

  test('Validar transição de KPI após Aprovar (-1 Pendentes, +1 Emitidos)', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar transição de KPI após Aprovar (-1 Pendentes, +1 Emitidos)');
    await allure.severity('critical');

    const registros = new AdminRegistrosPage(page);
    marker = makeMarker('TC2', testInfo.workerIndex);
    let pendentesAntes = 0;
    let emitidosAntes = 0;

    await allure.step('Pré: criar 1 registro Externo Pendente via API', async () => {
      await createPendingRecord(page, marker);
    });

    await allure.step('1. Acessar Registros e anotar "Pendentes" e "Emitidos"', async () => {
      await registros.goto();
      pendentesAntes = await registros.getCount('pending');
      emitidosAntes = await registros.getCount('emitted');
    });

    await allure.step('2-5. Abrir "Avaliar" do registro Pendente e clicar "Aprovar"', async () => {
      const row = registros.rowByContent(marker);
      await expect(row.first()).toBeVisible({ timeout: 10_000 });
      await registros.openEvaluate(row);
      await registros.approve();
    });

    await allure.step('6. "Pendentes" -1 e "Emitidos" +1 sem reload', async () => {
      await registros.expectCount('pending', pendentesAntes - 1);
      await registros.expectCount('emitted', emitidosAntes + 1);
    });
  });
});
