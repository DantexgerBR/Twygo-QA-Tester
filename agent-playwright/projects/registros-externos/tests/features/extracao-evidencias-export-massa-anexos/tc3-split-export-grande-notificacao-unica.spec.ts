import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { exportMassaData as data } from './extracao-evidencias-export-massa.shared.data.js';

// FIXME LEGÍTIMO — verificação manual + seed ausente (Anti-pattern F): validar
// que um export grande gera MÚLTIPLOS ZIPs com uma ÚNICA notificação contendo
// todos os links exige (a) escopo de evidências acima do threshold de split
// (threshold não conhecido/garantido no env) e (b) inspecionar a notificação do
// sino / e-mail. O DISPATCH do job já é coberto pela TC1 (201) — reasertá-lo
// aqui não adiciona sinal. A parte distintiva (split + notificação única) é
// 100% manual. Destinatários: QA (manual) + seed (volume). RN79.
test.describe(data.suiteName, () => {
  test.fixme('Validar split de export grande em múltiplos pacotes com notificação única', async () => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar split de export grande em múltiplos pacotes (verificação manual)');
    await allure.severity('minor');
    // Passos manuais:
    // 1. Disparar extração de Evidências sobre escopo de alto volume (acima do threshold de split).
    // 2. Aguardar a conclusão e abrir a notificação no sino (manual)
    //    → uma única notificação/e-mail contendo TODOS os links dos pacotes gerados.
  });
});
