import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AdminRegistrosPage } from '../../../pages/AdminRegistrosPage.js';
import { createPendingRecord } from '../../../data/records-api.js';
import { kpisTempoRealData as data, makeMarker } from './atualizacao-kpis-tempo-real.shared.data.js';

const SUITE = data.suiteName;

// A AT exemplifica excluir um Recusado; o invariante de RN 32 ("decrementa o card
// do status atual") é independente do status. Excluir só é permitido em registros
// ELEGÍVEIS (Emitido/Recusado/Expirado) — em Pendente o item "Excluir" fica
// desabilitado. Então criamos um Pendente, aprovamos (→ Emitido, elegível) e
// validamos o decremento de "Emitidos" após excluir.
// Sem cleanup: a exclusão é a própria ação final do teste (não sobra massa).

test.describe(SUITE, () => {
  let marker: string;

  test('Validar decremento do KPI após Excluir', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar decremento do KPI após Excluir');
    await allure.severity('critical');

    const registros = new AdminRegistrosPage(page);
    marker = makeMarker('TC4', testInfo.workerIndex);
    let emitidosAntes = 0;

    await allure.step('Pré: criar Pendente e aprovar (→ Emitido, elegível a exclusão)', async () => {
      await createPendingRecord(page, marker);
      await registros.goto();
      const row = registros.rowByContent(marker);
      await expect(row.first()).toBeVisible({ timeout: 10_000 });
      await registros.openEvaluate(row);
      await registros.approve();
    });

    await allure.step('1. Anotar o card "Emitidos"', async () => {
      emitidosAntes = await registros.getCount('emitted');
    });

    await allure.step('2-4. Menu 3 pontos → Excluir → confirmar no modal', async () => {
      const row = registros.rowByContent(marker);
      await expect(row.first()).toBeVisible({ timeout: 10_000 });
      await registros.deleteRow(row);
    });

    await allure.step('5. Card "Emitidos" decrementou 1 sem reload', async () => {
      await registros.expectCount('emitted', emitidosAntes - 1);
    });
  });
});
