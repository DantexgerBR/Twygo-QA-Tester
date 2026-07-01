import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AdminRegistrosPage } from '../../../pages/AdminRegistrosPage.js';
import { createPendingRecord } from '../../../data/records-api.js';
import { kpisTempoRealData as data, makeMarker } from './atualizacao-kpis-tempo-real.shared.data.js';

const SUITE = data.suiteName;

// Sem cleanup: massa criada fica persistente (convenção do projeto).
test.describe(SUITE, () => {
  let marker: string;

  test('Validar transição de KPI após Recusar (-1 Pendentes, +1 Recusados)', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar transição de KPI após Recusar (-1 Pendentes, +1 Recusados)');
    await allure.severity('critical');

    const registros = new AdminRegistrosPage(page);
    marker = makeMarker('TC3', testInfo.workerIndex);
    let pendentesAntes = 0;
    let recusadosAntes = 0;

    await allure.step('Pré: criar 1 registro Externo Pendente via API', async () => {
      await createPendingRecord(page, marker);
    });

    await allure.step('1. Acessar Registros e anotar "Pendentes" e "Recusados"', async () => {
      await registros.goto();
      pendentesAntes = await registros.getCount('pending');
      recusadosAntes = await registros.getCount('rejected');
    });

    await allure.step('2-6. Avaliar → Recusar com justificativa', async () => {
      const row = registros.rowByContent(marker);
      await expect(row.first()).toBeVisible({ timeout: 10_000 });
      await registros.openEvaluate(row);
      await registros.reject(data.justificativaRecusa);
    });

    await allure.step('7. "Pendentes" -1 e "Recusados" +1 sem reload', async () => {
      await registros.expectCount('pending', pendentesAntes - 1);
      await registros.expectCount('rejected', recusadosAntes + 1);
    });
  });
});
