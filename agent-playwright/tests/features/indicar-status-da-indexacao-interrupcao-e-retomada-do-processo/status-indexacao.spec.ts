// Testsuite: Indicar status da indexação, interrupção e retomada do processo
// Testcases (3): Em andamento, Interrupção, Retomada e conclusão.
//
// REVISAR_MANUAL: os 3 testcases dependem de fluxos end-to-end com tempo real
// e mutação de saldo de créditos:
//   - "Em andamento": exige clicar "Confirmar e iniciar" no modal RN37 (que
//     atualmente não dispara consistentemente — ver suíte "Mensagem de aviso e
//     saldo...") e aguardar o backend começar a processar arquivos reais.
//     Steps 4-7 também exigem login com perfis Instrutor/Gestor/Aluno
//     distintos (cross-user, fora do escopo do storageState global atual).
//   - "Interrupção": requer simular esgotamento de créditos durante uma
//     indexação ativa — sem hook backend não é factível em automação UI.
//   - "Retomada e conclusão": depende do TC anterior estar em estado pausado.
//
// Os 3 testes ficam registrados (test.fixme) pra rastreabilidade no relatório
// HTML/Allure e nas annotations Allure (epic/feature/story). Quando produto
// expor uma flag de "modo de teste" ou um endpoint de mock pra simular esses
// estados, remover o `fixme` e implementar.

import { test } from '../../../src/fixtures/exploratory-fixture';
import * as allure from 'allure-js-commons';

const FIXME_REASON = 'Requer fluxo end-to-end com créditos reais + multi-perfil — não automatizável só via UI';

test.describe('Indicar status da indexação, interrupção e retomada do processo', () => {
  test('Status da indexação em andamento', async () => {
    test.fixme(true, FIXME_REASON);
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Indicar status da indexação, interrupção e retomada do processo');
    await allure.story('Status da indexação em andamento');
    await allure.severity('critical');
  });

  test('Status da indexação na interrupção', async () => {
    test.fixme(true, FIXME_REASON);
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Indicar status da indexação, interrupção e retomada do processo');
    await allure.story('Status da indexação na interrupção');
    await allure.severity('critical');
  });

  test('Status da indexação na retomada e conclusão', async () => {
    test.fixme(true, FIXME_REASON);
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Indicar status da indexação, interrupção e retomada do processo');
    await allure.story('Status da indexação na retomada e conclusão');
    await allure.severity('critical');
  });
});
