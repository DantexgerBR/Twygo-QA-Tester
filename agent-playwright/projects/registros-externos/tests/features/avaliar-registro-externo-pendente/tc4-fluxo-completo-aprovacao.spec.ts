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

  test('Validar fluxo completo de aprovação', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar fluxo completo de aprovação');
    await allure.severity('critical');

    const av = new AvaliarRegistroPage(page);
    marker = makeMarker('TC4', testInfo.workerIndex);

    await allure.step('Pré: criar Externo Pendente e abrir "Avaliar"', async () => {
      await createPendingRecord(page, marker);
      await av.goto();
      await av.search(marker);
      await av.openEvaluate(marker);
    });

    await allure.step('2-4. Tipo "Curso" + Categoria "Tecnologia" + Aprovar', async () => {
      await av.selectTipo('Curso');
      await av.addCategoria('Tecnologia');
      await av.approve(); // toast "Registro aprovado" é transiente — validado pelo resultado abaixo
    });

    await allure.step('5. Linha exibe situação Aprovado / certificado Emitido', async () => {
      await av.goto();
      await av.search(marker);
      await expect(av.rowByContent(marker)).toContainText(/Aprovado|Emitido/i, { timeout: 15_000 });
    });
  });
});
