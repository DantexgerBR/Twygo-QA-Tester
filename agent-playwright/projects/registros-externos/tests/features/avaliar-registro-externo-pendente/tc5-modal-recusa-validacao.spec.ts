import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import type { Locator } from '@playwright/test';
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

  test('Validar estrutura e bloqueio do modal de Recusa', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar estrutura e bloqueio do modal de Recusa');
    await allure.severity('critical');

    const av = new AvaliarRegistroPage(page);
    marker = makeMarker('TC5', testInfo.workerIndex);
    let modal: Locator;

    await allure.step('Pré: criar Externo Pendente e abrir "Avaliar"', async () => {
      await createPendingRecord(page, marker);
      await av.goto();
      await av.search(marker);
      await av.openEvaluate(marker);
    });

    await allure.step('1-2. Abrir modal de recusa → botão desabilitado com justificativa vazia', async () => {
      modal = await av.openRejectModal();
      await expect(av.modalRecusarButton(modal)).toBeDisabled();
    });

    await allure.step('3-4. Preencher justificativa habilita; Cancelar fecha sem recusar', async () => {
      await av.justificativaTextarea(modal).fill('As evidências não comprovam a carga horária declarada.');
      await expect(av.modalRecusarButton(modal)).toBeEnabled();
      await av.modalCancelarButton(modal).click();
      await expect(modal).toBeHidden({ timeout: 10_000 });
    });
  });
});
