import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { extracaoData as data } from './extracao-dados-evidencias.shared.data.js';

// FIXME LEGÍTIMO — verificação 100% manual (Anti-pattern F, categoria
// "manual"): validar que um ZIP acima do limite de anexo de e-mail chega como
// LINK (sem anexo) exige (a) montar um escopo de evidências com volume de
// arquivos acima do limite e (b) inspecionar a caixa de e-mail do Admin. Nenhum
// observável é automatizável pela UI. Destinatário do sinal: QA (execução
// manual) — não é bug de produto a esconder. Spike S8 / RN 79.
test.describe(data.suiteName, () => {
  test.fixme('Validar pacote grande entregue apenas como link', async () => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar pacote grande entregue apenas como link (verificação manual)');
    await allure.severity('minor');
    // Passos manuais:
    // 1. Disparar extração de Evidências sobre escopo com volume acima do limite de anexo.
    // 2. Aguardar o e-mail de conclusão (manual) → deve conter APENAS o link, sem anexo.
  });
});
