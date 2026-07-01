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

  test('Validar form em modo avaliação (banner, campos e rodapé)', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar form em modo avaliação (banner, campos e rodapé)');
    await allure.severity('critical');

    const av = new AvaliarRegistroPage(page);
    marker = makeMarker('TC2', testInfo.workerIndex);

    await allure.step('Pré: criar Externo Pendente e abrir "Avaliar"', async () => {
      await createPendingRecord(page, marker);
      await av.goto();
      await av.search(marker);
      await av.openEvaluate(marker);
    });

    // DIVERGÊNCIA RN51 (achado 2026-06-25): o modo "Avaliar" abre um form com
    // cabeçalho "Registros > Editar", campos editáveis (Website/Evidência/Pessoas)
    // e SEM o banner "Avaliação pendente". soft-asserts documentam cada ponto.
    await allure.step('2. Banner amarelo "Avaliação pendente"', async () => {
      await expect.soft(av.bannerPendente(), 'RN51: banner "Avaliação pendente" ausente').toBeVisible({ timeout: 8_000 });
    });

    await allure.step('3. Demais campos desabilitados (ex.: Carga horária)', async () => {
      expect.soft(await av.isInputDisabledByName('workload_seconds'), 'RN51: Carga horária deveria estar desabilitada').toBe(true);
    });

    await allure.step('5. Rodapé com Aprovar, Recusar e Cancelar', async () => {
      await expect.soft(av.aprovarButton()).toBeVisible();
      await expect.soft(av.recusarButton()).toBeVisible();
      await expect.soft(av.cancelarButton()).toBeVisible();
    });
  });
});
