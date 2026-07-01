import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Isolamento de Progresso, Score e Attendance por Inscrição', () => {
  // Decisão locked do QA (Suite 11 — MD §1341): validação 100% no banco
  // PostgreSQL via índice único `unique_participant(user_id, event_id,
  // partner_rel, recertification_number)`. Sem UI envolvida — Playwright
  // não tem como capturar `ActiveRecord::RecordNotUnique` nem 23505
  // unique_violation.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): agent-db ainda não implementado (V2 do CONTRACT.md
  // cobrirá agent-db invocado como sub-rotina). Validar manualmente via
  // psql tentando INSERT duplicado e capturando 23505 unique_violation,
  // OU via Rails console executando EventParticipant.create! duplicado.
  test.fixme(
    true,
    'Tipo: db (MD §1409). Valida índice PostgreSQL unique_participant via psql/Rails console — não há fluxo UI que tente inserir dois participants idênticos (UI sempre incrementa recertification_number). Executar manualmente via psql INSERT duplicado esperando SQLSTATE 23505, ou via agent-db (V2 do CONTRACT.md).',
  );

  test('TC3 — Índice único `unique_participant` rejeita duplicata `(user_id, event_id, partner_rel, recertification_number)`', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature(
      'Isolamento de Progresso, Score e Attendance por Inscrição',
    );
    await allure.story(
      'Índice único `unique_participant` rejeita duplicata `(user_id, event_id, partner_rel, recertification_number)`',
    );
    await allure.severity('normal');
    await allure.tag('DB_PURE');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Pré-condição: 1 participant existente com `recertification_number = 1` para par `(user_id, event_id)` → Estado preparado',
      async () => {
        // Validação manual: garantir que existe 1 row em event_participants
        // com (user_id = X, event_id = Y, partner_rel = P, recertification_number = 1).
        // Pode ser criada via Suite 02 TC3 (reinscrição) OU diretamente via
        // Rails console:
        //   EventParticipant.create!(
        //     user_id: X, event_id: Y, partner_rel: P,
        //     recertification_number: 1, ...
        //   )
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Via Rails console em staging, tentar `EventParticipant.create!(user_id: X, event_id: Y, partner_rel: P, recertification_number: 1, ...)` → Execução lança `ActiveRecord::RecordNotUnique` ou validação Rails de uniqueness',
      async () => {
        // Validação manual (Rails console):
        //   EventParticipant.create!(
        //     user_id: X, event_id: Y, partner_rel: P,
        //     recertification_number: 1, ...
        //   )
        // Esperado: ActiveRecord::RecordNotUnique
        //          PG::UniqueViolation: ERROR:  duplicate key value violates
        //          unique constraint "unique_participant"
        //          DETAIL:  Key (user_id, event_id, partner_rel,
        //          recertification_number)=(X, Y, P, 1) already exists.
        //
        // Alternativa via psql direto:
        //   INSERT INTO event_participants
        //     (user_id, event_id, partner_rel, recertification_number, ...)
        //   VALUES (X, Y, P, 1, ...);
        // Esperado: ERROR:  duplicate key value violates unique constraint
        //          "unique_participant" (SQLSTATE 23505).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Consultar a tabela "event_participants" via Rails console com "EventParticipant.where(user_id: X, event_id: Y, partner_rel: P, recertification_number: 1).count" → Contagem retorna `1` — apenas 1 row para o par `(user_id, event_id, partner_rel, recertification_number = 1)`',
      async () => {
        // Validação manual (Rails console OU psql):
        //   EventParticipant.where(
        //     user_id: X, event_id: Y, partner_rel: P,
        //     recertification_number: 1
        //   ).count
        // Esperado: 1 (a tentativa de insert duplicado foi rejeitada pelo
        // índice; o estado final tem exatamente 1 row para essa tupla).
        //
        // Alternativa via psql:
        //   SELECT COUNT(*) FROM event_participants
        //   WHERE user_id = X AND event_id = Y
        //     AND partner_rel = P AND recertification_number = 1;
        expect(true).toBe(true);
      },
    );
  });
});
