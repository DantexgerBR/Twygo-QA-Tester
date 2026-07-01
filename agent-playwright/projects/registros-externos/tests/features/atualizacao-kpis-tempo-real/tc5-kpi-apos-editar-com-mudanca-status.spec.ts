import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AdminRegistrosPage } from '../../../pages/AdminRegistrosPage.js';
import { createPendingRecord } from '../../../data/records-api.js';
import { kpisTempoRealData as data, makeMarker } from './atualizacao-kpis-tempo-real.shared.data.js';

const SUITE = data.suiteName;

/** Data passada (ontem) no formato yyyy-mm-dd para o input date "Data de validade". */
function yesterdayIso(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// Sem cleanup: massa criada fica persistente (convenção do projeto).
test.describe(SUITE, () => {
  let marker: string;

  test('Validar atualização do KPI após Editar com mudança de status', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar atualização do KPI após Editar com mudança de status');
    await allure.severity('normal');

    const registros = new AdminRegistrosPage(page);
    marker = makeMarker('TC5', testInfo.workerIndex);
    let emitidosAntes = 0;
    let expiradosAntes = 0;

    await allure.step('Pré: criar Pendente e aprovar (→ Emitido) via UI', async () => {
      await createPendingRecord(page, marker);
      await registros.goto();
      const row = registros.rowByContent(marker);
      await expect(row.first()).toBeVisible({ timeout: 10_000 });
      await registros.openEvaluate(row);
      await registros.approve();
    });

    await allure.step('1. Anotar "Emitidos" e "Expirados"', async () => {
      emitidosAntes = await registros.getCount('emitted');
      expiradosAntes = await registros.getCount('expired');
    });

    await allure.step('2-4. Editar o registro Emitido com Data de validade passada e Salvar', async () => {
      const row = registros.rowByContent(marker);
      await expect(row.first()).toBeVisible({ timeout: 10_000 });
      await registros.openEdit(row);
      await registros.setExpirationAndSave(yesterdayIso());
    });

    await allure.step('5. "Emitidos" -1 e "Expirados" +1 conforme a transição efetiva', async () => {
      await registros.expectCount('emitted', emitidosAntes - 1);
      await registros.expectCount('expired', expiradosAntes + 1);
    });
  });
});
