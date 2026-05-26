import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Ciclo de Vida do Certificado Substituído', () => {
  // Decisão locked do QA (Suite 08 — MD §1038): combinação DB + UI. Disparo
  // do `CertificateGenerationService#replace_previous_certificates_bulk`
  // requer (a) gerar reinscrição via UI e (b) inspecionar `certificates`
  // pra confirmar `update_all` em lote (situation=2→4).
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): agent-db ainda não implementado (V2 do CONTRACT.md
  // cobrirá agent-db invocado como sub-rotina). Validar manualmente
  // executando reinscrição + conclusão e consultando o banco.
  test.fixme(
    true,
    'requer trigger de emissão de certificado + validação DB-pure de update em lote (situation=4). Validar manualmente.',
  );

  test('TC1 — Após emitir novo certificado, anteriores são marcados em lote como REPLACED', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Ciclo de Vida do Certificado Substituído');
    await allure.story(
      'Após emitir novo certificado, anteriores são marcados em lote como REPLACED',
    );
    await allure.severity('critical');
    await allure.tag('DB_PURE');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Pré-condição: aluno aprovado com recertification_number = 0 e certificado VALID emitido → Estado validado no banco: 1 row em certificates com situation = 2 (VALID).',
      async () => {
        // Validação manual (psql/DBeaver):
        //   SELECT id, situation, recertification_number
        //   FROM certificates
        //   WHERE user_id = <user> AND event_id = <event>;
        // Esperado: 1 row, situation = 2 (VALID).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Reinscrever o aluno individualmente pelo fluxo da suíte 2 TC3 → Novo participant criado com recertification_number = 1.',
      async () => {
        // Validação manual: executar fluxo de reinscrição individual
        // (Suite 02 TC3) até que `event_participants` receba insert com
        // `recertification_number = 1` para o par (user_id, event_id).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Simular conclusão do conteúdo pelo novo participant: progress_score = 100 → Certificado novo é emitido (queue de geração de certificados).',
      async () => {
        // Validação manual: forçar conclusão (UI ou SQL update) para
        // disparar o `CertificateGenerationService` e a geração do novo
        // certificado pelo job de queue.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '4. Aguardar até 60 segundos e consultar tabela certificates para o par (user_id, event_id) → 2 rows: certificado anterior com situation = 4 (REPLACED) e certificado novo com situation = 2 (VALID).',
      async () => {
        // Validação manual (psql/DBeaver):
        //   SELECT id, situation, recertification_number, created_at
        //   FROM certificates
        //   WHERE user_id = <user> AND event_id = <event>
        //   ORDER BY created_at ASC;
        // Esperado: 2 rows.
        //   - row 1 (antigo, recertification_number = 0): situation = 4 (REPLACED).
        //   - row 2 (novo,  recertification_number = 1): situation = 2 (VALID).
        // Confirmar que o update foi em lote (`update_all`) inspecionando
        // o log do Rails ou via timestamp `updated_at` idêntico nas rows
        // antigas REPLACED.
        expect(true).toBe(true);
      },
    );
  });
});
