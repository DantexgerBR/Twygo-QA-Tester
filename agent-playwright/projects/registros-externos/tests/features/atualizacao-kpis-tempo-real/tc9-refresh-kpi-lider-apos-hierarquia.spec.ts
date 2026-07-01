import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { kpisTempoRealData as data } from './atualizacao-kpis-tempo-real.shared.data.js';

const SUITE = data.suiteName;

test.describe(SUITE, () => {
  test('Validar refresh do KPI do Líder após mudança de hierarquia', async () => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar refresh do KPI do Líder após mudança de hierarquia');
    await allure.severity('minor');

    // fixme LEGÍTIMO (Anti-pattern F — categoria "dependência externa"). RN 34 / Spike S4.
    // Requer persona Líder com liderados diretos e a REMOÇÃO de um liderado via
    // estrutura organizacional (operação administrativa externa à tela de Registros),
    // mais o refresh natural do KPI do Líder. Sem persona Líder provisionada nem massa
    // de liderados no env, não há como executar. Destinatário: QA Lead (provisionar
    // persona + estrutura) / dev (política exata de refresh é decisão do dev — Spike S4).
    test.fixme(
      true,
      'dependência externa: persona Líder + liderados + remoção via estrutura organizacional (RN 34, Spike S4)',
    );
  });
});
