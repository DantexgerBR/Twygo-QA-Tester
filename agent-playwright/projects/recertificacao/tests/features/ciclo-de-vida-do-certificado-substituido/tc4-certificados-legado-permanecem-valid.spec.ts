import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Ciclo de Vida do Certificado Substituído', () => {
  // Decisão locked do QA (Suite 08 — MD §1091): validação regressiva
  // DB-pure. Confirma que aluno com `recertification_number = 0` que NÃO
  // foi reinscrito mantém certificado VALID indefinidamente — nenhum job
  // pode marcá-lo como REPLACED sem nova emissão pelo mesmo par
  // (user_id, event_id).
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): agent-db ainda não implementado (V2 do CONTRACT.md
  // cobrirá agent-db invocado como sub-rotina). Validar manualmente
  // observando estado do banco antes/depois de um ciclo do cron de
  // geração de certificados.
  test.fixme(
    true,
    'requer validação direta no banco — DB-pure. Validar manualmente.',
  );

  test('TC4 — Certificados emitidos no fluxo legado (sem reinscrição) permanecem VALID indefinidamente', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Ciclo de Vida do Certificado Substituído');
    await allure.story(
      'Certificados emitidos no fluxo legado (sem reinscrição) permanecem VALID indefinidamente',
    );
    await allure.severity('normal');
    await allure.tag('DB_PURE');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Pré-condição: aluno com recertification_number = 0 aprovado e VALID emitido → Estado preparado.',
      async () => {
        // Validação manual (psql/DBeaver):
        //   SELECT id, situation, recertification_number
        //   FROM certificates
        //   WHERE user_id = <user> AND event_id = <event>;
        // Esperado: 1 row, recertification_number = 0, situation = 2 (VALID).
        // Confirmar que NÃO existe participant reinscrito para o mesmo
        // par (user_id, event_id):
        //   SELECT COUNT(*) FROM event_participants
        //   WHERE user_id = <user> AND event_id = <event>
        //     AND recertification_number > 0;
        // Esperado: 0.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Esperar 1 hora (ou re-rodar cron de geração de certificados) sem disparar reinscrição → Cron de geração processa outros casos.',
      async () => {
        // Validação manual: aguardar próximo ciclo do cron OU executar
        // manualmente via Rails console em staging o job de geração de
        // certificados (sem disparar reinscrição para o aluno em questão).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Consultar tabela certificates → Certificado do aluno continua com situation = 2 (VALID). Não foi marcado como REPLACED.',
      async () => {
        // Validação manual (psql/DBeaver):
        //   SELECT id, situation, recertification_number, updated_at
        //   FROM certificates
        //   WHERE user_id = <user> AND event_id = <event>;
        // Esperado: 1 row, situation = 2 (VALID) — INALTERADA.
        //   - situation NÃO virou 4 (REPLACED).
        //   - situation NÃO virou 1 (EXPIRED) — supondo expires_at futuro.
        // Confirma comportamento regressivo: `replace_previous_certificates_bulk`
        // só atua quando há nova emissão pelo mesmo par.
        expect(true).toBe(true);
      },
    );
  });
});
