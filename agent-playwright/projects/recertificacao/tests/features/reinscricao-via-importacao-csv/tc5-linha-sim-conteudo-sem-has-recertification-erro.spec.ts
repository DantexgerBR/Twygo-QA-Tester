import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CsvImportPage } from '../../../pages/CsvImportPage.js';
import { tc5Data } from './tc5-linha-sim-conteudo-sem-has-recertification-erro.data.js';

test.describe('Reinscrição via Importação CSV', () => {
  // REVISAR: seed inválido — `tc5Data.eventIdSemRecertification = 3` retorna
  // HTTP 404 em `/o/37007/events/3/import_participants`. Página de import
  // não renderiza → input[type=file] timeout. Pré-condição "curso com
  // has_recertification=false" exige curso real no env. Rota também REVISAR-FIGMA.
  test.fixme(true, 'seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.');
  test('TC5 — Linha com `Reinscrever=SIM` em conteúdo com `has_recertification=false` registra erro estruturado', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição via Importação CSV');
    await allure.story(
      'Linha com `Reinscrever=SIM` em conteúdo com `has_recertification=false` registra erro estruturado',
    );
    await allure.severity('high');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const csvImport = new CsvImportPage(page);

    await allure.step(
      '1. Pré-condição: curso "Curso sem Reinscrição" com `has_recertification = false` pré-existe',
      async () => {
        // REVISAR-SEED: pré-condição depende do seed do env conter o curso
        // tc5Data.eventIdSemRecertification com has_recertification=false.
        // Se falhar aqui, ajustar `tc5Data` ou criar seed dedicado.
        expect(tc5Data.eventIdSemRecertification).toBeGreaterThan(0);
      },
    );

    await allure.step(
      '2. Preparar CSV com 1 linha contendo email de aluno existente + Reinscrever=SIM',
      async () => {
        // Arquivo montado in-memory no .data.ts.
        expect(tc5Data.csvContent).toContain('SIM');
        expect(tc5Data.csvContent).toContain(tc5Data.alunoEmail);
      },
    );

    await allure.step(
      '3. Fazer upload na página de importação → upload aceito, worker processa',
      async () => {
        // REVISAR-FIGMA: URL exata ainda não confirmada.
        await csvImport.goToImport(tc5Data.eventIdSemRecertification);
        await csvImport.uploadCsv(tc5Data.csvContent, tc5Data.csvFileName);
        await csvImport.confirmUpload();
        await csvImport.expectImportSuccess();
      },
    );

    await allure.step(
      '4. Aguardar processamento e verificar tela de "Resultado da importação" → linha com mensagem de erro `recertification_disabled_for_event`',
      async () => {
        await csvImport.waitForImportProcessing(30_000);

        // REVISAR-FIGMA: URL exata da tela de "Resultado da importação"
        // ainda não confirmada. Heurística: a tela pode aparecer
        // inline após confirmar upload OU redirecionar para uma rota
        // dedicada — em ambos os casos a mensagem de erro fica acessível
        // via texto na página.
        const errorMessage = await csvImport.getErrorMessageForRow(
          tc5Data.alunoEmail,
        );

        // Se o e-mail não foi encontrado na lista de erros, tenta o texto da
        // página inteira como fallback (algumas UIs Twygo renderizam erros
        // como bullet list sem âncora por e-mail).
        if (!errorMessage) {
          const bodyText = (await page.textContent('body').catch(() => '')) ?? '';
          expect(bodyText).toMatch(tc5Data.expectedErrorPattern);
        } else {
          expect(errorMessage).toMatch(tc5Data.expectedErrorPattern);
        }

        // RN 12: nenhum participant criado para esta linha — não asserimos
        // ausência via UI porque o aluno existente JÁ pode estar inscrito
        // no curso (estado pré-condição). Validação fina exige DB.
        await allure.tag('NEEDS_DB_TEST');
      },
    );
  });
});
