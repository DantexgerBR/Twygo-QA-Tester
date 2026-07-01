import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Cascade de Reinscrição em Trilhas', () => {
  // Decisão locked do QA (Suite 07 — MD §952): cascade automático de
  // reinscrição em trilhas. UI dispara o reinscrever na trilha-pai, mas o
  // efeito observável (participants nos cursos filhos com
  // `recertification_number` calculado por par (user_id, course_id)) só é
  // verificável via worker assíncrono `AddParticipantToLearningPath` + DB.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): Playwright UI cobre apenas o dispatch (modal/toast);
  // validação do cascade exige Sidekiq monitor + psql em
  // `event_participants` por curso filho. agent-db ainda não implementado.
  test.fixme(
    true,
    'requer validação de worker AddParticipantToLearningPath + DB-pure de recertification_number por curso filho. UI cobre só dispatch. Validar manualmente via Sidekiq monitor + psql.',
  );

  test('TC1 — Reinscrever trilha individualmente cria participants nos cursos filhos com recertification_number correto por curso', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Cascade de Reinscrição em Trilhas');
    await allure.story(
      'Reinscrever trilha individualmente cria participants nos cursos filhos com recertification_number correto por curso',
    );
    await allure.severity('critical');
    await allure.tag('CASCADE_WORKER');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Acessar a lista de aprendizagem da trilha em "/learning_students?event_id={trilhaId}" → Lista de alunos da trilha é exibida.',
      async () => {
        // Validação manual: abrir UI logada como admin, navegar para a
        // listagem de aprendizagem da trilha "Trilha Reinscrição
        // w{workerIndex}" e confirmar exibição dos alunos.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Clicar em "Reinscrever" na linha do aluno elegível e confirmar → Modal fecha, toast de sucesso, novo participant da trilha criado com recertification_number = N_trilha + 1.',
      async () => {
        // Validação manual (UI + DB):
        //   SELECT recertification_number
        //   FROM event_participants
        //   WHERE event_id = <trilhaId> AND user_id = <alunoId>
        //   ORDER BY id DESC LIMIT 1;
        // Esperado: novo row com recertification_number = N_trilha + 1.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Aguardar até 60 segundos pelo processamento do worker AddParticipantToLearningPath → Worker processa.',
      async () => {
        // Validação manual via Sidekiq monitor: confirmar que o job
        // AddParticipantToLearningPath para o (user_id, trilhaId) saiu de
        // `enqueued` para `processed` em até 60s.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '4. Acessar a lista de aprendizagem de cada curso filho da trilha em "/learning_students?event_id={cursoFilhoId}" → Aluno aparece em cada um dos 3 cursos filhos com recertification_number = N_curso_filho + 1 (incremento INDEPENDENTE por curso, não pelo número da trilha).',
      async () => {
        // Validação manual (DB-pure) para cada um dos 3 cursos filhos:
        //   SELECT recertification_number
        //   FROM event_participants
        //   WHERE event_id = <cursoFilhoId> AND user_id = <alunoId>
        //   ORDER BY id DESC LIMIT 1;
        // Esperado: row novo por curso filho, com recertification_number
        // calculado INDEPENDENTE por par (user_id, course_id) — não
        // herda o número da trilha (RN 18.1).
        expect(true).toBe(true);
      },
    );
  });
});
