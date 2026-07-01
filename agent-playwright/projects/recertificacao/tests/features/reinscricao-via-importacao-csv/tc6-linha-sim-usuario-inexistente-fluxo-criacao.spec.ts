import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CsvImportPage } from '../../../pages/CsvImportPage.js';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc6Data, buildTc6Csv } from './tc6-linha-sim-usuario-inexistente-fluxo-criacao.data.js';

test.describe('Reinscrição via Importação CSV', () => {
  // REVISAR: seed inválido — `tc6Data.eventId = 2` retorna HTTP 404 em
  // `/o/37007/events/2/import_participants`. Página de import não renderiza
  // → input[type=file] timeout. Rota também REVISAR-FIGMA.
  test.fixme(true, 'seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.');
  test('TC6 — Linha com `Reinscrever=SIM` para usuário INEXISTENTE cai no fluxo normal de criação (sem reinscrição)', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição via Importação CSV');
    await allure.story(
      'Linha com `Reinscrever=SIM` para usuário INEXISTENTE cai no fluxo normal de criação (sem reinscrição)',
    );
    await allure.severity('normal');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const csvImport = new CsvImportPage(page);
    const learning = new LearningStudentsPage(page);

    // E-mail único por run — garante usuário inexistente na org.
    const uniqueTs = Date.now();
    const { csvContent, email } = buildTc6Csv(uniqueTs);
    await allure.parameter('novoAlunoEmail', email);

    await allure.step(
      '1. Preparar CSV com 1 linha contendo email "novo-aluno-w{workerIndex}-{ts}@example.com" e Reinscrever=SIM',
      async () => {
        expect(csvContent).toContain('SIM');
        expect(csvContent).toContain(email);
      },
    );

    await allure.step(
      '2. Fazer upload do CSV → upload aceito, worker processa',
      async () => {
        // REVISAR-FIGMA: URL exata ainda não confirmada.
        await csvImport.goToImport(tc6Data.eventId);
        await csvImport.uploadCsv(csvContent, tc6Data.csvFileName);
        await csvImport.confirmUpload();
        await csvImport.expectImportSuccess();
      },
    );

    await allure.step(
      '3. Aguardar processamento e verificar a lista de aprendizagem → novo aluno aparece (fluxo de criação original, recertification_number = 0)',
      async () => {
        await csvImport.waitForImportProcessing(30_000);
        await learning.goToList(tc6Data.eventId);
        const row = learning.getParticipantRow(email);
        await expect(
          row,
          `Novo aluno ${email} deveria aparecer no curso (fluxo legado de inscrição)`,
        ).toBeVisible({ timeout: 15_000 });

        // RN 12: novo usuário entra como inscrição original
        // (recertification_number = 0), NÃO como reinscrição. Distinção via
        // UI sem coluna/badge dedicada é inviável — validação fina via DB.
        await allure.tag('NEEDS_DB_TEST');
      },
    );

    await allure.step(
      '4. Inspecionar caixa de entrada do novo aluno → recebe e-mail de inscrição legado (NÃO o template reenrollment_mail)',
      async () => {
        // REVISAR: captura de e-mail requer infra externa (Mailpit/MailHog)
        // não configurada. Cross-suite com Suite 10 (Mailer).
        await allure.tag('CROSS_SUITE_MAILER');
      },
    );
  });

  // CLAUDE.md §7.6 G: spec cria usuário novo + participant (estado persistente).
  // UI Twygo NÃO expõe deletar usuário/participant criado por import em lote
  // de forma segura via produto. Cleanup via DB seria a forma correta — fora
  // do escopo Playwright. Mitigação: e-mail único por timestamp evita que
  // runs sucessivos colidam, mas a org acumula registros entre runs.
  // Skill `limpar-dados-de-teste-twygo` registra a lacuna.
});
