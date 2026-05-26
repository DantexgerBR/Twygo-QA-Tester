import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CsvImportPage } from '../../../pages/CsvImportPage.js';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc4Data } from './tc4-valores-aceitos-case-insensitive.data.js';

test.describe('Reinscrição via Importação CSV', () => {
  // REVISAR: seed inválido — `tc4Data.eventId = 2` retorna HTTP 404 em
  // `/o/37007/events/2/import_participants`. Página de import não renderiza
  // → `input[type=file]` timeout em setInputFiles. Rota também é REVISAR-FIGMA.
  test.fixme(true, 'seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.');
  test('TC4 — Valores de `Reinscrever` aceitos (case-insensitive: SIM/sim/true/1)', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição via Importação CSV');
    await allure.story(
      'Valores de `Reinscrever` aceitos (case-insensitive: SIM/sim/true/1)',
    );
    await allure.severity('normal');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );
    await allure.parameter(
      'matrix',
      'aceitos: SIM/sim/true/1 — ignorados: NÃO/vazio/talvez',
    );

    const csvImport = new CsvImportPage(page);
    const learning = new LearningStudentsPage(page);

    await allure.step(
      '1. Preparar arquivo CSV contendo 7 linhas com os 7 valores da matriz acima para 7 alunos distintos',
      async () => {
        // CSV montado in-memory no .data.ts (sem arquivo no disco).
        // Linhas validadas: 4 aceitas + 3 ignoradas + header = 8 linhas.
        const lines = tc4Data.csvContent.split(/\r?\n/).filter(Boolean);
        expect(lines).toHaveLength(8);
      },
    );

    await allure.step(
      '2. Fazer upload pela página de importação → worker processa',
      async () => {
        // REVISAR-FIGMA: URL exata ainda não confirmada.
        await csvImport.goToImport(tc4Data.eventId);
        await csvImport.uploadCsv(tc4Data.csvContent, tc4Data.csvFileName);
        await csvImport.confirmUpload();
        await csvImport.expectImportSuccess();
      },
    );

    await allure.step(
      '3. Aguardar processamento e abrir lista de aprendizagem → 4 alunos aceitos aparecem; 3 ignorados não aparecem como reinscritos',
      async () => {
        await csvImport.waitForImportProcessing(30_000);
        await learning.goToList(tc4Data.eventId);

        // Os 4 aceitos (SIM/sim/true/1) DEVEM aparecer na listagem do curso
        // (já reinscritos = recertification_number > 0).
        for (const email of tc4Data.acceptedEmails) {
          const row = learning.getParticipantRow(email);
          await expect(
            row,
            `Aluno ${email} deveria aparecer como reinscrito`,
          ).toBeVisible({ timeout: 15_000 });
        }

        // Os 3 ignorados (NÃO/vazio/talvez) — fluxo normal de inscrição
        // (ou nenhuma ação se já estavam inscritos). Não há assertion
        // negativa de UI que distinga "inscrito normal" de "reinscrito" sem
        // ler `recertification_number` via DB. Marcamos NEEDS_DB_TEST.
        await allure.tag('NEEDS_DB_TEST');
        for (const email of tc4Data.ignoredEmails) {
          // REVISAR: distinguir inscrição original vs reinscrição via UI
          // requer coluna/badge "Reinscrito" ainda não confirmada na
          // listagem (RN 11.1). Por hora apenas registramos o e-mail no
          // Allure para inspeção manual.
          await allure.parameter(`ignored.${email}`, 'fluxo_normal_esperado');
        }
      },
    );
  });
});
