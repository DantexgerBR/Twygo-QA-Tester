import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Cascade de Reinscrição em Trilhas', () => {
  // Decisão locked do QA (Suite 07 — MD §971): filtro
  // `event_and_user_id_subscribed` é bypassado em fluxos de reinscrição,
  // permitindo cascade mesmo quando o aluno já tem participant em alguns
  // cursos filhos (RN 18.2). UI consegue mostrar listagem com N inscrições
  // (parcial), mas a validação core (filter bypass + N inscrições com
  // recertification_number distintos) exige DB direto.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): agent-db ainda não implementado (V2 do CONTRACT.md).
  test.fixme(
    true,
    'requer validação DB-pure de filter bypass + presença de N inscrições com recertification_number distintos. Validar manualmente.',
  );

  test('TC2 — Filtro "já inscrito" é bypassado em fluxos de reinscrição (cria segunda/N-ésima inscrição)', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Cascade de Reinscrição em Trilhas');
    await allure.story(
      'Filtro "já inscrito" é bypassado em fluxos de reinscrição (cria segunda/N-ésima inscrição)',
    );
    await allure.severity('critical');
    await allure.tag('DB_PURE');
    await allure.tag('CASCADE_WORKER');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Pré-condição: aluno com participant ativo em 2 dos 3 cursos filhos da trilha, e sem participant no 3º. → Estado preparado.',
      async () => {
        // Validação manual (seed + DB):
        //   SELECT event_id, recertification_number
        //   FROM event_participants
        //   WHERE user_id = <alunoId>
        //     AND event_id IN (<cursoFilho1>, <cursoFilho2>, <cursoFilho3>);
        // Esperado: 2 rows (cursos 1 e 2), 0 rows para curso 3.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Reinscrever o aluno na trilha pelo fluxo do TC1 → Worker processa.',
      async () => {
        // Validação manual: reproduzir UI de reinscrever (Suite 07 TC1) e
        // aguardar AddParticipantToLearningPath via Sidekiq monitor.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Acessar a lista de aprendizagem de cada um dos 3 cursos filhos em "/learning_students?event_id={cursoFilhoId}" → Aluno aparece nos 3 cursos com recertification_number > 0 (mesmo nos 2 onde já estava inscrito antes — filtro event_and_user_id_subscribed bypassado).',
      async () => {
        // Validação manual (DB-pure) — filter bypass:
        //   SELECT event_id, recertification_number, id
        //   FROM event_participants
        //   WHERE user_id = <alunoId>
        //     AND event_id IN (<cursoFilho1>, <cursoFilho2>, <cursoFilho3>)
        //   ORDER BY event_id, recertification_number;
        // Esperado: nos cursos 1 e 2, MAIS de 1 row (inscrição antiga
        // recertification_number=0 + nova com recertification_number>0).
        // Curso 3: 1 row com recertification_number>0. Filtro
        // `event_and_user_id_subscribed` foi bypassado — caso contrário
        // os cursos 1 e 2 manteriam só 1 row (RN 18.2).
        expect(true).toBe(true);
      },
    );
  });
});
