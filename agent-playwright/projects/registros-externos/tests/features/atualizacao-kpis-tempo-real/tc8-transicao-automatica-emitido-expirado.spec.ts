import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { kpisTempoRealData as data } from './atualizacao-kpis-tempo-real.shared.data.js';

const SUITE = data.suiteName;

test.describe(SUITE, () => {
  test('Validar transição automática Emitido → Expirado com tela aberta', async () => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar transição automática Emitido → Expirado com tela aberta');
    await allure.severity('normal');

    // fixme LEGÍTIMO (Anti-pattern F — categoria "seed/massa ausente"). RN 33 / Spike S1.
    // Requer um registro Emitido cuja Data de validade CRUZE o instante atual DURANTE
    // a sessão aberta, e que o ciclo de refresh natural do produto reclassifique
    // Emitido→Expirado sem reload. Não é automatizável de forma determinística sem
    // manipulação de massa/relógio no servidor (a estratégia de detecção é decisão
    // do dev — Spike S1). Destinatário: QA Lead / dev de produto.
    test.fixme(
      true,
      'seed/massa ausente: requer registro com validade cruzando durante a sessão + ciclo de refresh do produto (RN 33, Spike S1)',
    );
  });
});
