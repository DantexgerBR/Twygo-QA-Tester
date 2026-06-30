import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AvaliarRegistroPage } from '../../../pages/AvaliarRegistroPage.js';
import { getBaseUrl } from '../../../../../src/utils/environment.js';
import { createPendingRecord, deleteRecordsByMarker } from '../../../data/records-api.js';
import { avaliarData as data, makeMarker, STORAGE_STATE } from './avaliar.shared.data.js';

test.describe(data.suiteName, () => {
  let marker: string;

  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE_STATE, baseURL: getBaseUrl() });
    const page = await ctx.newPage();
    try {
      if (marker) await deleteRecordsByMarker(page, marker);
    } finally {
      await ctx.close();
    }
  });

  test('Validar botão Cancelar do form de avaliação', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar botão Cancelar do form de avaliação');
    await allure.severity('high');

    const av = new AvaliarRegistroPage(page);
    marker = makeMarker('TC7', testInfo.workerIndex);

    await allure.step('Pré: criar Externo Pendente e abrir "Avaliar"', async () => {
      await createPendingRecord(page, marker);
      await av.goto();
      await av.search(marker);
      await av.openEvaluate(marker);
    });

    await allure.step('2-3. Selecionar Tipo (form sujo) e Cancelar → registro permanece Pendente', async () => {
      await av.selectTipo('Workshop');
      await av.cancel();
      await av.goto();
      await av.search(marker);
      await expect(av.rowByContent(marker)).toContainText(/Pendente/i, { timeout: 15_000 });
    });
  });
});
