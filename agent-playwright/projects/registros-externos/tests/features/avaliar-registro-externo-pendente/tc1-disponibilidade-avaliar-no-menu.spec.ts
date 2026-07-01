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

  test('Validar disponibilidade do "Avaliar" como item primário do menu', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar disponibilidade do "Avaliar" como item primário do menu');
    await allure.severity('critical');

    const av = new AvaliarRegistroPage(page);
    marker = makeMarker('TC1', testInfo.workerIndex);

    await allure.step('Pré: criar registro Externo Pendente', async () => {
      await createPendingRecord(page, marker);
      await av.goto();
      await av.search(marker);
    });

    await allure.step('1. Menu do Externo Pendente: "Avaliar" primário, sem Editar/Excluir (RN50)', async () => {
      const items = await av.menuItemTexts(marker);
      expect(items[0], '"Avaliar" deve ser o 1º item').toMatch(/Avaliar/i);
      // RN50: Editar/Excluir NÃO devem aparecer em Externo+Pendente.
      // BUG (laudo qa19): "Editar"/"Excluir" aparecem indevidamente → vermelho.
      const proibidos = items.filter((t) => /\bEditar\b|\bExcluir\b/i.test(t));
      expect(proibidos, `RN50: Externo Pendente não deve ter Editar/Excluir (achou: ${proibidos.join(', ')})`).toEqual([]);
    });

    // Sub-checks dependentes de seed inexistente neste env (Externo Emitido tem
    // marker desconhecido; não há Interno Pendente) — cobertos por TC4/outras
    // suítes. Aqui validamos o núcleo da RN50 no Externo+Pendente.
  });
});
