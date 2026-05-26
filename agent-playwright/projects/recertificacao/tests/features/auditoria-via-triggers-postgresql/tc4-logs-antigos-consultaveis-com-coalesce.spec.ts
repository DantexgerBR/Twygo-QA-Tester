import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Auditoria via Triggers PostgreSQL', () => {
  // Decisão locked do QA (Suite 13 — MD §1531): validação 100% via
  // queries SQL no banco `postgres_logs`. Sem UI envolvida — Playwright
  // não tem como executar SELECT/COALESCE direto na base.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): agent-db ainda não implementado (V2 do CONTRACT.md
  // cobrirá agent-db invocado como sub-rotina). Validar via psql/DBeaver.
  test.fixme(
    true,
    'requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver.',
  );

  test('TC4 — Logs antigos (pré-deploy) consultáveis com COALESCE para nova coluna', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Auditoria via Triggers PostgreSQL');
    await allure.story(
      'Logs antigos (pré-deploy) consultáveis com COALESCE para nova coluna',
    );
    await allure.severity('normal');
    await allure.tag('DB_PURE');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Pré-condição: tabela event_participant_info_logs com rows pré-deploy (sem coluna recertification_number) e rows pós-deploy (com a coluna) → Estado típico de staging com histórico.',
      async () => {
        // Validação manual: confirmar via SELECT que existem rows com
        // recertification_number IS NULL (pré-deploy) e rows com valor
        // preenchido (pós-deploy).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Executar query SELECT COALESCE(recertification_number, 0) AS rn, COUNT(*) FROM event_participant_info_logs GROUP BY rn → Query executa sem erro retornando agrupamento por rn (rows antigas com 0, rows novas com seu valor).',
      async () => {
        // Validação manual (psql/DBeaver):
        //   SELECT COALESCE(recertification_number, 0) AS rn, COUNT(*)
        //   FROM event_participant_info_logs
        //   GROUP BY rn;
        // Esperado: query executa sem erro; agrupamento mostra rows
        // antigas com rn=0 (vindas do COALESCE) e novas com rn>=1.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Executar SELECT * FROM event_participant_info_logs ORDER BY created_at DESC LIMIT 100 → 100 rows mais recentes retornadas, mesclando rows com e sem recertification_number preenchido.',
      async () => {
        // Validação manual (psql/DBeaver):
        //   SELECT *
        //   FROM event_participant_info_logs
        //   ORDER BY created_at DESC
        //   LIMIT 100;
        // Esperado: 100 rows retornadas; inspeção visual mostra mistura
        // de rows com recertification_number IS NULL e com valor preenchido.
        expect(true).toBe(true);
      },
    );
  });
});
