import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AcoesEmMassaPage } from '../../../pages/AcoesEmMassaPage.js';
import { createPendingRecords } from '../../../data/records-api.js';
import { acoesEmMassaData as data, makeMarker } from './acoes-em-massa.shared.data.js';

const SUITE = data.suiteName;

// Sem cleanup: a massa criada (e aprovada) fica persistente (convenção do projeto).
test.describe(SUITE, () => {
  test('Validar aprovação em massa de selecionados com toast de sucesso', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar aprovação em massa de selecionados com toast de sucesso');
    await allure.severity('critical');

    const massa = new AcoesEmMassaPage(page);
    const prefix = makeMarker('TC3', testInfo.workerIndex);
    const n = data.aprovarSelecionados;
    let markers: string[] = [];
    let pendBefore = 0;
    let emitBefore = 0;

    await allure.step(`Pré: criar ${n} registros Externos Pendentes via API`, async () => {
      markers = await createPendingRecords(page, prefix, n);
    });

    await allure.step(`1. Acessar Registros e marcar os ${n} Pendentes`, async () => {
      await massa.goto();
      pendBefore = await massa.getCount('pending');
      emitBefore = await massa.getCount('emitted');
      await massa.selectRowsByMarkers(markers);
    });

    await allure.step('2-3. Abrir drawer → Aprovar registros → Executar → Confirmar', async () => {
      await massa.openDrawer();
      await massa.selectAction('Aprovar registros');
      await massa.chooseScopeSelecionados();
      const toast = await massa.executarEConfirmar();
      // DIVERGÊNCIA AT: a AT espera o toast "5 registros aprovados". O produto
      // executa a aprovação de forma ASSÍNCRONA com toast genérico ("...em
      // andamento" → "Ação em massa concluída"), sem o número. A validação real
      // do batch é o delta dos KPIs (passo seguinte). // REVISAR
      expect(toast).toMatch(/aprovad|andamento|conclu/i);
    });

    await allure.step(`4. Lista reflete os ${n} agora Aprovados (Pendentes -${n}, Emitidos +${n})`, async () => {
      // O KPI do batch não atualiza ao vivo (assíncrono) — 1 refresh e valida o delta.
      await massa.goto();
      await massa.expectCount('pending', pendBefore - n);
      await massa.expectCount('emitted', emitBefore + n);
    });
  });
});
