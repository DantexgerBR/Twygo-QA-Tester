import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AdminRegistrosPage } from '../../../pages/AdminRegistrosPage.js';
import { kpisTempoRealData as data, makeMarker } from './atualizacao-kpis-tempo-real.shared.data.js';

const SUITE = data.suiteName;

// Persona: a AT enquadra como "Aluno em Meu histórico". No env staging o user é
// Admin e o form de Adicionar abre em modo admin (campo Pessoas presente) mesmo
// no layout do aluno — então validamos o incremento de RN 32 no nível da org
// (tela Admin > Registros), que é o observável central. Persona Aluno real não
// disponível (ver recon: divergência #4).

// Sem cleanup: por convenção do projeto registros-externos, a massa criada pelos
// testes fica persistente entre runs (ver memory sem-cleanup-seed-persistente).

test.describe(SUITE, () => {
  let marker: string;

  test('Validar incremento imediato do KPI após Adicionar', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar incremento imediato do KPI após Adicionar (Aluno)');
    await allure.severity('critical');

    const registros = new AdminRegistrosPage(page);
    marker = makeMarker('TC1', testInfo.workerIndex);
    let pendentesAntes = 0;

    await allure.step('1. Acessar Registros e anotar o número do card "Pendentes"', async () => {
      await registros.goto();
      pendentesAntes = await registros.getCount('pending');
    });

    await allure.step('2-6. Abrir "Adicionar" e preencher o registro externo', async () => {
      await registros.openAddForm();
      await registros.fillExternalRecordForm(marker);
    });

    await allure.step('7. Salvar/enviar o registro → volta para a lista', async () => {
      await registros.submitRecordForm();
      await registros.expectLoaded();
    });

    await allure.step('8. Verificar o card "Pendentes" incrementou em 1 sem reload', async () => {
      await registros.expectCount('pending', pendentesAntes + 1);
    });
  });
});
