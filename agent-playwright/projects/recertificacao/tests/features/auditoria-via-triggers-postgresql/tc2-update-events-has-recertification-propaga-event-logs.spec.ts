import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Auditoria via Triggers PostgreSQL', () => {
  // Decisão locked do QA (Suite 13 — MD §1497): validação 100% no banco
  // `postgres_logs` (TimescaleDB). Sem UI envolvida — Playwright não tem
  // como inspecionar `event_logs.has_recertification`.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): agent-db ainda não implementado (V2 do CONTRACT.md
  // cobrirá agent-db invocado como sub-rotina). Validar via psql/DBeaver.
  test.fixme(
    true,
    'requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver.',
  );

  test('TC2 — Update em events.has_recertification propaga para event_logs', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Auditoria via Triggers PostgreSQL');
    await allure.story(
      'Update em events.has_recertification propaga para event_logs',
    );
    await allure.severity('critical');
    await allure.tag('DB_PURE');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Editar um curso e ativar o switch "Habilitar reinscrição" → events.has_recertification = true persistido.',
      async () => {
        // Validação manual: executar o fluxo da Suite 01 TC3 (Ativar e
        // salvar persiste) até o ponto em que `events.has_recertification`
        // recebe update para `true`.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Consultar a tabela event_logs no banco postgres_logs filtrando pelo event_id → Row mais recente para o curso contém has_recertification = true.',
      async () => {
        // Validação manual (psql/DBeaver):
        //   SELECT has_recertification, created_at
        //   FROM event_logs
        //   WHERE event_id = <event-id>
        //   ORDER BY created_at DESC
        //   LIMIT 1;
        // Esperado: row mais recente com has_recertification = true.
        expect(true).toBe(true);
      },
    );
  });
});
