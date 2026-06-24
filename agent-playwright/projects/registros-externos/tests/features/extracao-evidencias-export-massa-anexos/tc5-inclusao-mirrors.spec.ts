import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { exportMassaData as data } from './extracao-evidencias-export-massa.shared.data.js';

// FIXME LEGÍTIMO — verificação manual + seed ausente (Anti-pattern F): validar
// que o export inclui anexos de participantes de conteúdo ESPELHADO (mirror —
// lição do spike: query precisa de UNION) exige (a) conteúdo compartilhado com
// participantes e certificados no escopo e (b) baixar/descompactar o ZIP para
// confirmar que os anexos dos mirrors CONSTAM (não foram omitidos). O DISPATCH
// do job já é coberto pela TC1 (201); a parte distintiva (presença dos mirrors
// no pacote) é 100% manual. Destinatários: QA (manual) + seed (mirror). RN79/97.
test.describe(data.suiteName, () => {
  test.fixme('Validar inclusão de participantes de conteúdos compartilhados (mirror)', async () => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar inclusão de mirrors no export (verificação manual)');
    await allure.severity('normal');
    // Passos manuais:
    // 1. Disparar extração de Evidências sobre escopo que inclui conteúdo compartilhado (mirror)
    //    com participantes e certificados → extração processa.
    // 2. Baixar o ZIP (manual) → anexos dos participantes do conteúdo espelhado CONSTAM no pacote.
  });
});
