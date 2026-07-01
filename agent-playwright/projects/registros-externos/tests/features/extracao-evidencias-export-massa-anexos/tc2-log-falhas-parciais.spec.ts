import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { exportMassaData as data } from './extracao-evidencias-export-massa.shared.data.js';

// FIXME LEGÍTIMO — verificação manual + seed/infra ausente (Anti-pattern F,
// categorias "manual" + "seed faltando"): validar que falhas parciais não
// abortam o export e geram "export_errors.txt" no ZIP exige (a) um arquivo
// corrompido/removido do storage (condição simulada não disponível no env) e
// (b) baixar/descompactar o ZIP para inspecionar o arquivo de erros. Nenhum
// observável é automatizável pela UI. Destinatários: QA (execução manual) +
// infra/seed (preparar arquivo corrompido). Não é bug de produto a esconder. RN79.
test.describe(data.suiteName, () => {
  test.fixme('Validar registro de falhas parciais no export', async () => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar registro de falhas parciais no export (verificação manual)');
    await allure.severity('normal');
    // Passos manuais:
    // 1. Disparar extração de Evidências sobre escopo com arquivo corrompido/removido do storage.
    //    → Extração processa sem abortar.
    // 2. Baixar o ZIP (manual) → contém "export_errors.txt" listando os arquivos que falharam;
    //    demais arquivos íntegros.
  });
});
