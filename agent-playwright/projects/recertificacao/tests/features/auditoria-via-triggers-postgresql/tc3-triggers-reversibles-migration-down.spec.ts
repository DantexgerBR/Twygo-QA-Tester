import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Auditoria via Triggers PostgreSQL', () => {
  // Decisão locked do QA (Suite 13 — MD §1512): validação exige executar
  // `bin/rails db:rollback STEP=1` no servidor de staging + verificar
  // estado do trigger no banco. Fora do escopo Playwright (nem UI, nem
  // mesmo apenas SQL — envolve CLI Rails de servidor).
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): agent-db ainda não implementado (V2 do CONTRACT.md
  // cobrirá agent-db invocado como sub-rotina). Validar via psql/DBeaver
  // + acesso SSH ao servidor de staging para rodar migration.
  test.fixme(
    true,
    'requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver.',
  );

  test('TC3 — Triggers são reversíveis (migration down restaura comportamento)', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Auditoria via Triggers PostgreSQL');
    await allure.story(
      'Triggers são reversíveis (migration down restaura comportamento)',
    );
    await allure.severity('normal');
    await allure.tag('DB_PURE');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Pré-condição: ambiente de staging com migrations de triggers no STEP=último-deploy → Estado preparado.',
      async () => {
        // Validação manual: confirmar que staging está com as migrations
        // de trigger aplicadas (último deploy).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Rodar bin/rails db:rollback STEP=1 para reverter a última migration de trigger → Migration reverte sem erro.',
      async () => {
        // Validação manual no servidor de staging:
        //   bin/rails db:rollback STEP=1
        // Esperado: rollback executa sem erro; trigger volta à versão anterior.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Repetir o fluxo de TC1 (criar participant reinscrito) e consultar event_participant_info_logs → Row é gravada mas SEM a coluna recertification_number (ou com NULL — depende da versão anterior). Comportamento legado restaurado.',
      async () => {
        // Validação manual (psql/DBeaver):
        //   SELECT recertification_number
        //   FROM event_participant_info_logs
        //   WHERE event_participant_id = <id-recem-criado>;
        // Esperado: row existe, recertification_number IS NULL ou coluna
        // ausente (depende da versão anterior do trigger).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '4. Rodar bin/rails db:migrate para reaplicar a migration → Trigger atualizado volta ao estado pós-deploy. Testes subsequentes voltam a gravar recertification_number.',
      async () => {
        // Validação manual no servidor de staging:
        //   bin/rails db:migrate
        // Esperado: trigger reaplicado, comportamento atual restaurado.
        expect(true).toBe(true);
      },
    );
  });
});
