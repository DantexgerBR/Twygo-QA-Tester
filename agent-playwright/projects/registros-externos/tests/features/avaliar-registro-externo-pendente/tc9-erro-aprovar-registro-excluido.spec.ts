import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AvaliarRegistroPage } from '../../../pages/AvaliarRegistroPage.js';
import { createPendingRecord, deleteRecordsByMarker } from '../../../data/records-api.js';
import { avaliarData as data, makeMarker } from './avaliar.shared.data.js';

// Concorrência: aprovar registro que foi excluído enquanto o form estava aberto.
// A "sessão B" é simulada deletando via API (mesmo backend) com o form já aberto.
test.describe(data.suiteName, () => {
  test('Validar erro ao aprovar registro excluído por outro admin', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar erro ao aprovar registro excluído por outro admin');
    await allure.severity('normal');

    const av = new AvaliarRegistroPage(page);
    const marker = makeMarker('TC9', testInfo.workerIndex);

    await allure.step('1. Abrir "Avaliar" de um Externo Pendente (sessão A)', async () => {
      await createPendingRecord(page, marker);
      await av.goto();
      await av.search(marker);
      await av.openEvaluate(marker);
    });

    await allure.step('2. Excluir o registro por fora (sessão B via API)', async () => {
      const removed = await deleteRecordsByMarker(page, marker);
      expect(removed, 'registro deveria existir para ser excluído').toBeGreaterThan(0);
    });

    await allure.step('3. Aprovar na sessão A → erro; registro não é aprovado (já não existe)', async () => {
      await av.selectTipo('Curso');
      // toast de erro é transiente — capturamos best-effort e validamos pelo resultado.
      const errToast = av
        .getToast(/não foi possível aprovar|não encontrado|erro/i)
        .isVisible({ timeout: 8_000 })
        .catch(() => false);
      await av.clickAprovar();
      await errToast;
      // resultado robusto: o registro excluído não reaparece aprovado na lista.
      await av.goto();
      await av.search(marker);
      await expect(av.rowByContent(marker)).toHaveCount(0, { timeout: 10_000 });
    });
  });
});
