import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

const SUITE = 'KPI cards como dashboard estático (Admin/Líder)';

// fixme LEGÍTIMO (Anti-pattern F — categoria "dependência externa / Spike"; destinatário: QA Lead + dev).
// TC exige um registro Emitido cuja data de validade VENÇA durante o teste (massa de
// dados manipulada) e validar que, sem reload, "Emitidos" decrementa e "Expirados"
// incrementa no próximo ciclo de refresh (RN 25). A própria AT marca como Spike S1 —
// "a estratégia de detecção é decisão do dev" — e o refresh é assíncrono/não-determinístico.
// Sem massa manipulável (validade no minuto corrente) nem contrato de refresh definido,
// não há como automatizar de forma estável. Destrava com: seed de registro expirando
// no instante do teste + definição do mecanismo de refresh (polling/websocket).
test.describe(SUITE, () => {
  test('Validar transição Emitido → Expirado ao cruzar a data de validade', async () => {
    test.fixme(
      true,
      'dependência externa/Spike S1: massa com validade no instante do teste + refresh async não definido (RN 25). Destinatário: QA Lead + dev.',
    );
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar transição Emitido → Expirado ao cruzar a data de validade');
  });
});
