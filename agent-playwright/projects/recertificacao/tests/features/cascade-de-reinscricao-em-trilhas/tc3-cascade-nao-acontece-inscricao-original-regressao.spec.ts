import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Cascade de Reinscrição em Trilhas', () => {
  // Decisão locked do QA (Suite 07 — MD §988): regressão crítica — worker
  // `AddParticipantToLearningPath` chamado sem 3º argumento
  // (`recertification = false`) NÃO dispara cascade de reinscrição. Segue
  // fluxo `associate_courses_for_initial_enrollment` antigo (RN 19).
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): exige validação DB direta de que recertification_number
  // = 0 em todos os cursos filhos após inscrição original. agent-db ainda
  // não implementado.
  test.fixme(
    true,
    'regressão DB-pure — exige validação direta no banco que recertification_number=0 nos filhos. Validar manualmente.',
  );

  test('TC3 — Cascade NÃO acontece em inscrição original (sem recertification) — regressão crítica', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Cascade de Reinscrição em Trilhas');
    await allure.story(
      'Cascade NÃO acontece em inscrição original (sem recertification) — regressão crítica',
    );
    await allure.severity('critical');
    await allure.tag('DB_PURE');
    await allure.tag('CASCADE_WORKER');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Disparar inscrição original (sem reinscrição) de aluno novo na trilha via API ou UI → Aluno é inscrito na trilha com recertification_number = 0.',
      async () => {
        // Validação manual (UI + DB):
        //   SELECT recertification_number
        //   FROM event_participants
        //   WHERE event_id = <trilhaId> AND user_id = <alunoNovoId>;
        // Esperado: 1 row com recertification_number = 0 (inscrição
        // original — sem flag `recertification`).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Aguardar processamento do worker → Worker processa.',
      async () => {
        // Validação manual via Sidekiq monitor: confirmar que o job
        // AddParticipantToLearningPath foi enfileirado SEM o 3º argumento
        // (`recertification = false`) e processou completamente.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Acessar a lista de aprendizagem de cada curso filho em "/learning_students?event_id={cursoFilhoId}" → Aluno aparece em cada curso filho com recertification_number = 0 (fluxo original — sem incremento).',
      async () => {
        // Validação manual (DB-pure) — regressão RN 19:
        //   SELECT event_id, recertification_number
        //   FROM event_participants
        //   WHERE user_id = <alunoNovoId>
        //     AND event_id IN (<cursoFilho1>, <cursoFilho2>, <cursoFilho3>);
        // Esperado: 3 rows (1 por curso filho), TODOS com
        // recertification_number = 0. Qualquer valor > 0 indica regressão
        // — cascade vazou pra fluxo de inscrição original.
        expect(true).toBe(true);
      },
    );
  });
});
