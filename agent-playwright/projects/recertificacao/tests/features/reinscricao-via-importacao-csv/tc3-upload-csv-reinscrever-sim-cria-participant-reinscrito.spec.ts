import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CsvImportPage } from '../../../pages/CsvImportPage.js';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc3Data } from './tc3-upload-csv-reinscrever-sim-cria-participant-reinscrito.data.js';

test.describe('Reinscrição via Importação CSV', () => {
  // REVISAR: seed inválido — `tc3Data.eventId = 2` retorna HTTP 404 em
  // `/o/37007/events/2/import_participants` (curso não existe na org). Sem
  // chegar na página, `input[type=file]` não renderiza → timeout em
  // setInputFiles. Rota `import_participants` também ainda é REVISAR-FIGMA —
  // confirmar URL real do app via chrome-devtools-mcp.
  test.fixme(true, 'seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.');
  test('TC3 — Upload de CSV com `Reinscrever=SIM` para usuário existente cria participant reinscrito', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição via Importação CSV');
    await allure.story(
      'Upload de CSV com `Reinscrever=SIM` para usuário existente cria participant reinscrito',
    );
    await allure.severity('critical');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const csvImport = new CsvImportPage(page);
    const learning = new LearningStudentsPage(page);

    await allure.step(
      '1. Preparar arquivo "participants-reenroll.csv" com 1 linha contendo o email do "Aluno Elegível" e Reinscrever=SIM',
      async () => {
        // Arquivo é montado in-memory (Buffer) no .data.ts — sem criação no disco.
        expect(tc3Data.csvContent).toContain('SIM');
        expect(tc3Data.csvContent).toContain(tc3Data.alunoElegivelEmail);
      },
    );

    await allure.step(
      '2. Acessar a página de importação de participants',
      async () => {
        // REVISAR-FIGMA: URL exata ainda não confirmada.
        await csvImport.goToImport(tc3Data.eventId);
        await expect(page).toHaveURL(/import_participants/);
      },
    );

    await allure.step(
      '3. Fazer upload do arquivo "participants-reenroll.csv" → upload aceito + toast "Importação iniciada"',
      async () => {
        await csvImport.uploadCsv(tc3Data.csvContent, tc3Data.csvFileName);
        await csvImport.confirmUpload();
        // REVISAR-FIGMA: texto exato do toast ainda não confirmado.
        await csvImport.expectImportSuccess();
      },
    );

    await allure.step(
      '4. Aguardar até 30s pelo processamento do worker `CsvImportEventParticipantWorker`',
      async () => {
        await csvImport.waitForImportProcessing(30_000);
      },
    );

    await allure.step(
      '5. Acessar a lista de aprendizagem do curso → aluno aparece como reinscrito com status "Pendente"',
      async () => {
        await learning.goToList(tc3Data.eventId);
        const row = learning.getParticipantRow(tc3Data.alunoElegivelEmail);
        await expect(row).toBeVisible({ timeout: 15_000 });
        // Valida que o status "Pendente" aparece na linha do aluno reinscrito.
        // RN 13: novo participant entra com progress_score=0, status Pendente.
        await expect(row).toContainText(/Pendente/i);
        // REVISAR: validar `recertification_number = N+1` e `progress_score = 0`
        // requer leitura direta do banco — fora do escopo Playwright
        // (ver CONTRACT.md §validador secundário / agent-db).
        await allure.tag('NEEDS_DB_TEST');
      },
    );

    await allure.step(
      '6. Aluno também recebe e-mail de reinscrição',
      async () => {
        // REVISAR: captura de e-mail requer infra externa (Mailpit/MailHog) —
        // não configurada para o projeto Recertificação em
        // staging-base-de-conhecimento. Cross-suite com Suite 10 (Mailer).
        await allure.tag('CROSS_SUITE_MAILER');
      },
    );
  });

  // CLAUDE.md §7.6 G: spec CRIA participant reinscrito (estado persistente).
  // UI Twygo NÃO expõe deletar participant individualmente; cleanup direto via
  // produto não é viável aqui. Documentado como limitação conhecida — orgs
  // compartilhadas acumulam reinscrições do aluno-elegivel-tc3 entre runs,
  // sem efeito colateral em outros TCs (cada run cria recertification_number
  // incrementado, mas o e-mail aluno-elegivel-tc3@example.com continua válido
  // para o próximo upload SIM). Skill `limpar-dados-de-teste-twygo` registra
  // que dado persistente sem variant `*_safe` no POM exige task de seed cleanup
  // ou habilitar agent-db para limpar.
});
