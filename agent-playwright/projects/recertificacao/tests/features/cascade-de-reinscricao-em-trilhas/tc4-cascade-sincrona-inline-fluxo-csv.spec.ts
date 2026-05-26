import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Cascade de Reinscrição em Trilhas', () => {
  // Decisão locked do QA (Suite 07 — MD §1005): para importação CSV em
  // trilha, o cascade para cursos filhos é executado SÍNCRONO inline
  // dentro do worker `CsvImportEventParticipantWorker` (RN 18 —
  // `LearningPathActionMassService#create_course_participants`).
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): cross-suite com Suite 04 (CSV) — depende dela estar
  // verde primeiro. Validação core (cascade síncrono inline + ausência
  // de job adicional + N>0 em cada curso filho) exige DB direto.
  test.fixme(
    true,
    'cross-suite com Suite 04 (CSV) + cascade DB. Compound test — validar manualmente após Suite 04 estar verde + DB checks.',
  );

  test('TC4 — Cascade síncrona inline no fluxo CSV', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Cascade de Reinscrição em Trilhas');
    await allure.story('Cascade síncrona inline no fluxo CSV');
    await allure.severity('normal');
    await allure.tag('DB_PURE');
    await allure.tag('CASCADE_WORKER');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Preparar CSV com 1 linha contendo email de aluno existente, trilha destino e Reinscrever=SIM → CSV criado.',
      async () => {
        // Validação manual (prep): gerar arquivo CSV no formato esperado
        // pela tela de importação da trilha — header + linha contendo
        // (email, trilhaId, Reinscrever=SIM). Reaproveitar layout do
        // template da Suite 04 (CSV).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Fazer upload do CSV pela tela de importação da trilha → Worker CsvImportEventParticipantWorker processa.',
      async () => {
        // Validação manual via Sidekiq monitor: confirmar que o job
        // CsvImportEventParticipantWorker foi processado e que NÃO houve
        // enfileiramento adicional de AddParticipantToLearningPath para o
        // par (user_id, trilhaId) — cascade rodou INLINE dentro do worker
        // do CSV (RN 18, `LearningPathActionMassService#create_course_participants`).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Inspecionar listagem dos 3 cursos filhos IMEDIATAMENTE após o worker concluir → Aluno aparece nos 3 cursos filhos com recertification_number > 0 (cascade já completou — síncrono inline, sem job adicional).',
      async () => {
        // Validação manual (DB-pure) imediatamente após CSV worker concluir:
        //   SELECT event_id, recertification_number
        //   FROM event_participants
        //   WHERE user_id = <alunoId>
        //     AND event_id IN (<cursoFilho1>, <cursoFilho2>, <cursoFilho3>)
        //   ORDER BY event_id;
        // Esperado: 3 rows (1 por curso filho), TODOS com
        // recertification_number > 0 já visíveis SEM aguardar nenhum job
        // adicional. Diferença de TC1: lá há gap até 60s do worker
        // async; aqui é instantâneo (síncrono inline).
        expect(true).toBe(true);
      },
    );
  });
});
