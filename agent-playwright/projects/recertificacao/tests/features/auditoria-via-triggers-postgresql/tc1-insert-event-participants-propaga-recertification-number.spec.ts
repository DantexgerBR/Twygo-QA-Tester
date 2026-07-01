import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Auditoria via Triggers PostgreSQL', () => {
  // Decisão locked do QA (Suite 13 — MD §1469): validação 100% no banco
  // `postgres_logs` (TimescaleDB). Sem UI envolvida — Playwright não tem
  // como inspecionar `event_participant_info_logs.recertification_number`.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): agent-db ainda não implementado (V2 do CONTRACT.md
  // cobrirá agent-db invocado como sub-rotina). Validar via psql/DBeaver.
  test.fixme(
    true,
    'requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver.',
  );

  test('TC1 — Insert em event_participants propaga recertification_number para event_participant_info_logs', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Auditoria via Triggers PostgreSQL');
    await allure.story(
      'Insert em event_participants propaga recertification_number para event_participant_info_logs',
    );
    await allure.severity('critical');
    await allure.tag('DB_PURE');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Criar novo participant reinscrito (recertification_number = 1) pelo fluxo da suíte 2 TC3 → Participant criado.',
      async () => {
        // Validação manual: executar fluxo de reinscrição (Suite 02 TC3)
        // até o ponto em que `event_participants` recebe insert com
        // `recertification_number = 1`.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Consultar via Rails/SQL no banco postgres_logs a tabela event_participant_info_logs filtrando pelo event_participant_id recém-criado → 1 row encontrada com coluna recertification_number = 1.',
      async () => {
        // Validação manual (psql/DBeaver):
        //   SELECT recertification_number
        //   FROM event_participant_info_logs
        //   WHERE event_participant_id = <id-recem-criado>;
        // Esperado: 1 row, recertification_number = 1.
        expect(true).toBe(true);
      },
    );
  });
});
