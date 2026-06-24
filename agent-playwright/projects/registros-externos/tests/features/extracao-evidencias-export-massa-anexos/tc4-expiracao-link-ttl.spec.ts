import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { exportMassaData as data } from './extracao-evidencias-export-massa.shared.data.js';

// FIXME LEGÍTIMO — seed/infra ausente (Anti-pattern F, "seed faltando"): validar
// que um link de download com TTL expirado nega o download (TTL sugerido 7 dias,
// Spike S8) exige uma massa preparada — um link de export real com TTL já
// vencido. Não há como produzir isso de forma determinística no env sem
// manipular o storage/relógio do worker. Destinatário: QA Lead / infra (preparar
// massa com link expirado). Não é bug de produto a esconder. RN79.
test.describe(data.suiteName, () => {
  test.fixme('Validar expiração do link de download (TTL)', async () => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar expiração do link de download / TTL (massa preparada)');
    await allure.severity('minor');
    // Passos manuais:
    // 1. Acessar um link de download de extração com TTL expirado (massa preparada)
    //    → download é negado (link inválido/expirado).
    // 2. Disparar nova extração do mesmo escopo → novo pacote com link válido.
  });
});
