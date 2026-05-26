import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Ciclo de Vida do Certificado Substituído', () => {
  // Decisão locked do QA (Suite 08 — MD §1057): validação cron-pure. Disparo
  // do worker `ExpiresCertificates#expire_replaced_certificates` requer
  // acesso a Rails console / SSH em staging + inspeção da tabela
  // `certificates` pra confirmar transição VALID→EXPIRED e propagação
  // REPLACED→EXPIRED no mesmo par (user_id, event_id).
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): agent-db ainda não implementado (V2 do CONTRACT.md
  // cobrirá agent-db invocado como sub-rotina). Validar manualmente
  // executando `ExpiresCertificates.new.perform` via Rails console e
  // consultando o banco.
  test.fixme(
    true,
    'requer execução do worker ExpiresCertificates + validação direta no banco. Validar manualmente.',
  );

  test('TC2 — Worker ExpiresCertificates expira VALID e propaga para REPLACED do mesmo par', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Ciclo de Vida do Certificado Substituído');
    await allure.story(
      'Worker ExpiresCertificates expira VALID e propaga para REPLACED do mesmo par',
    );
    await allure.severity('normal');
    await allure.tag('DB_PURE');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Pré-condição: aluno com 2 certificados — 1 REPLACED (do participant recertification_number = 0) e 1 VALID (do participant recertification_number = 1) com expires_at = hoje → Estado preparado no banco.',
      async () => {
        // Validação manual (psql/DBeaver):
        //   SELECT id, situation, recertification_number, expires_at
        //   FROM certificates
        //   WHERE user_id = <user> AND event_id = <event>
        //   ORDER BY recertification_number ASC;
        // Esperado: 2 rows.
        //   - row 1 (recertification_number = 0): situation = 4 (REPLACED).
        //   - row 2 (recertification_number = 1): situation = 2 (VALID), expires_at = CURRENT_DATE.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Disparar manualmente o cron ExpiresCertificates.new.perform → Worker processa.',
      async () => {
        // Validação manual (Rails console em staging):
        //   ExpiresCertificates.new.perform
        // Capturar o log de queries SQL emitidas — esperar UPDATE em
        // lote sobre `certificates` filtrando pelo par (user_id, event_id).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Consultar a tabela certificates para o par (user_id, event_id) → Ambos os certificados estão com situation = 1 (EXPIRED): o que era VALID e o que era REPLACED.',
      async () => {
        // Validação manual (psql/DBeaver):
        //   SELECT id, situation, recertification_number
        //   FROM certificates
        //   WHERE user_id = <user> AND event_id = <event>
        //   ORDER BY recertification_number ASC;
        // Esperado: 2 rows, ambos situation = 1 (EXPIRED).
        //   - row 1 (recertification_number = 0): situation = 1 (era 4 REPLACED).
        //   - row 2 (recertification_number = 1): situation = 1 (era 2 VALID).
        expect(true).toBe(true);
      },
    );
  });
});
