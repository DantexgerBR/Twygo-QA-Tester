import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AvaliarRegistroPage } from '../../../pages/AvaliarRegistroPage.js';
import { getBaseUrl } from '../../../../../src/utils/environment.js';
import { createPendingRecord, deleteRecordsByMarker } from '../../../data/records-api.js';
import { avaliarData as data, makeMarker, STORAGE_STATE } from './avaliar.shared.data.js';

// O laudo QA 1.9 apontou que o drawer "Histórico" do registro recusado não abre.
// Se persistir, o passo do histórico fica VERMELHO documentando o bug.
test.describe(data.suiteName, () => {
  let marker: string;
  const justificativa = 'Plano de desenvolvimento não cobre essa formação.';

  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE_STATE, baseURL: getBaseUrl() });
    const page = await ctx.newPage();
    try {
      if (marker) await deleteRecordsByMarker(page, marker);
    } finally {
      await ctx.close();
    }
  });

  test('Validar fluxo completo de recusa e visibilidade da justificativa', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar fluxo completo de recusa e visibilidade da justificativa');
    await allure.severity('critical');

    const av = new AvaliarRegistroPage(page);
    marker = makeMarker('TC6', testInfo.workerIndex);

    await allure.step('Pré: criar Externo Pendente e abrir "Avaliar"', async () => {
      await createPendingRecord(page, marker);
      await av.goto();
      await av.search(marker);
      await av.openEvaluate(marker);
    });

    await allure.step('1-3. Recusar com justificativa → registro fica Recusado', async () => {
      await av.reject(justificativa); // toast "Registro recusado" é transiente — valida pelo resultado
      await av.goto();
      await av.search(marker);
      await expect(av.rowByContent(marker)).toContainText(/Recusado/i, { timeout: 15_000 });
    });

    await allure.step('4. Histórico do registro recusado exibe a justificativa', async () => {
      const drawer = await av.openHistorico(marker);
      await expect(drawer).toContainText(justificativa, { timeout: 10_000 });
    });

    // Passo 5 (banner vermelho na visão do Aluno DONO do registro) requer login
    // do colaborador dono — seed ausente: registro é da pessoa 4298404, não do
    // login de teste. Coberto pela suíte 1.8 (Visualizar registro Recusado).
  });
});
