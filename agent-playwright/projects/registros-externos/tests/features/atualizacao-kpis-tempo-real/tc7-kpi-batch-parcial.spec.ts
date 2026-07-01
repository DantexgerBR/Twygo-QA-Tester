import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AdminRegistrosPage } from '../../../pages/AdminRegistrosPage.js';
import { createPendingRecords } from '../../../data/records-api.js';
import { kpisTempoRealData as data, makeMarker } from './atualizacao-kpis-tempo-real.shared.data.js';

const SUITE = data.suiteName;

// Sem cleanup: massa criada fica persistente (convenção do projeto). Como o acúmulo
// de Pendentes (sem cleanup) empurra os Emitidos da seed pra fora da 1ª página, o
// teste cria sua PRÓPRIA massa Emitida (aprova alguns dos registros que criou),
// garantindo 4 Pendentes elegíveis + 3 Emitidos inelegíveis juntos no topo.

test.describe(SUITE, () => {
  let prefix: string;

  test('Validar KPI refletindo apenas o processado em batch parcial', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar KPI refletindo apenas o processado em batch parcial');
    await allure.severity('normal');

    const registros = new AdminRegistrosPage(page);
    prefix = makeMarker('TC7', testInfo.workerIndex);
    const { pendentes, emitidosIgnorados } = data.batchPartial;
    const total = pendentes + emitidosIgnorados;
    let markers: string[] = [];
    let pendentesAntes = 0;
    let emitidosAntes = 0;

    await allure.step(`Pré: criar ${total} registros Pendentes e aprovar ${emitidosIgnorados} (→ Emitidos inelegíveis)`, async () => {
      markers = await createPendingRecords(page, prefix, total);
      await registros.goto();
      // Aprova os últimos N (viram Emitidos = inelegíveis para "Aprovar" no batch).
      for (const m of markers.slice(pendentes)) {
        const row = registros.rowByContent(m);
        await expect(row.first()).toBeVisible({ timeout: 10_000 });
        await registros.openEvaluate(row);
        await registros.approve();
      }
    });

    await allure.step('1. Anotar "Pendentes"/"Emitidos" e marcar os 7 (4 Pendentes + 3 Emitidos)', async () => {
      pendentesAntes = await registros.getCount('pending');
      emitidosAntes = await registros.getCount('emitted');
      for (const m of markers) {
        const row = registros.rowByContent(m);
        await expect(row.first()).toBeVisible({ timeout: 10_000 });
        await registros.selectRow(row);
      }
    });

    await allure.step('2-3. Ações em massa → Aprovar registros → Executar', async () => {
      await registros.openBatchDrawer();
      const toast = await registros.applyBatchApprove();
      // A AT supunha toast com ratio "4 aprovados (3 ignorados)". O produto faz
      // aprovação ASSÍNCRONA com toast genérico ("em andamento" → "concluída"),
      // SEM expor o ratio. O ratio só é observável pelo delta do KPI (passo 4):
      // apenas os 4 Pendentes elegíveis são processados; os 3 Emitidos são
      // ignorados e não geram delta. // REVISAR (ratio não aparece na UI).
      expect(toast).toMatch(/aprovad|andamento|conclu/i);
    });

    await allure.step('4. "Pendentes" -4 e "Emitidos" +4 (os 3 ignorados não geram delta)', async () => {
      // Batch assíncrono: delta aparece no refresh seguinte (não live — ver TC6).
      await registros.goto();
      await registros.expectCount('pending', pendentesAntes - pendentes);
      await registros.expectCount('emitted', emitidosAntes + pendentes);
    });
  });
});
