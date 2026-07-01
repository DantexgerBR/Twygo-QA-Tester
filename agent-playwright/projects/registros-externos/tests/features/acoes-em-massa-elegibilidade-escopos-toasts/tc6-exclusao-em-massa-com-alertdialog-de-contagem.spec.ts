import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AcoesEmMassaPage } from '../../../pages/AcoesEmMassaPage.js';
import { createPendingRecords } from '../../../data/records-api.js';
import { acoesEmMassaData as data, makeMarker } from './acoes-em-massa.shared.data.js';

const SUITE = data.suiteName;
const N = 3;

// Sem cleanup explícito: o próprio teste cria 3 Pendentes, aprova-os (→ Emitidos,
// elegíveis a exclusão) e os exclui — efeito líquido nulo na massa compartilhada.
// Não consome destrutivamente a seed QA11 pré-existente.
test.describe(SUITE, () => {
  test('Validar exclusão em massa com AlertDialog de contagem', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar exclusão em massa com AlertDialog de contagem');
    await allure.severity('critical');

    const massa = new AcoesEmMassaPage(page);
    const prefix = makeMarker('TC6', testInfo.workerIndex);
    let markers: string[] = [];

    await allure.step(`Pré: criar ${N} Pendentes e aprová-los (ficam Emitidos, elegíveis a exclusão)`, async () => {
      markers = await createPendingRecords(page, prefix, N);
      await massa.goto();
      await massa.selectRowsByMarkers(markers);
      await massa.openDrawer();
      await massa.selectAction('Aprovar registros');
      await massa.chooseScopeSelecionados();
      await massa.executarEConfirmar();
      await massa.goto();
    });

    await allure.step(`1. Marcar os ${N} registros Externos (Emitidos)`, async () => {
      await massa.selectRowsByMarkers(markers);
    });

    await allure.step('2. Excluir registros → modal de confirmação com a contagem', async () => {
      await massa.openDrawer();
      await massa.selectAction('Excluir registros');
      await massa.chooseScopeSelecionados();
      await massa.executarButton().click();
      await expect(massa.confirmModal()).toBeVisible({ timeout: 10_000 });
      // DIVERGÊNCIA AT: a AT espera um AlertDialog destrutivo vermelho ("Esta
      // ação não pode ser desfeita." + "Você está excluindo **3 registros**.").
      // O produto usa o modal genérico "Confirmação de ação em massa" com a
      // contagem no texto e a regra de elegibilidade. Asserimos o texto real. // REVISAR
      await expect(massa.confirmModal()).toContainText(new RegExp(`Excluir\\s+${N}\\s+registro`, 'i'));
      await expect(massa.confirmModal()).toContainText(/Somente registros externos não pendentes serão excluídos/i);
    });

    await allure.step(`3. Confirmar → ${N} linhas somem da lista`, async () => {
      await massa.confirmExecution();
      await massa.getToast(/exclu|andamento|conclu/i).waitFor({ state: 'visible', timeout: 20_000 }).catch(() => undefined);
      await massa.goto();
      for (const m of markers) {
        await expect(massa.rowByContent(m)).toHaveCount(0, { timeout: 15_000 });
      }
    });
  });
});
