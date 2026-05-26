import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Reinscrição em Massa pelo Admin', () => {
  // Decisão locked do QA (Suite 03 TC5 — MD §519): cenário precisa
  // garantir aluno com `deleted_at` recente no meio do lote. Validação
  // de "erro reportado a Datadog/NewRelic" é externa ao Playwright; UI
  // só permite dispatch e visualizar o resultado pós-worker. Cobertura
  // determinística depende de:
  //   - Seed com 1 aluno `deleted_at` recente + 4 elegíveis.
  //   - Inspeção da DLQ/log do Sidekiq.
  //   - Validação DB do estado final (4 incrementados, 1 ausente).
  // Nada disso é UI-puro.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): habilitar quando agent-db + monitor Sidekiq estiverem
  // disponíveis no V2 do contrato.
  test.fixme(
    true,
    'requer monitoramento do worker + validação de DLQ/logs. Validar manualmente.',
  );

  test('TC5 — Erro em aluno individual não interrompe o lote', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição em Massa pelo Admin');
    await allure.story('Erro em aluno individual não interrompe o lote');
    await allure.severity('normal');
    await allure.tag('WORKER_VALIDATION');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Pré-condição: 4 alunos elegíveis + 1 aluno com `deleted_at` recente → 5 selecionáveis na lista',
      async () => {
        // Validação manual: confirmar via SQL que 1 aluno tem deleted_at IS NOT NULL recente,
        // e outros 4 estão ativos e elegíveis no curso.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Selecionar os 5 alunos e disparar reinscrição em massa (fluxo TC3) → Toast de processamento',
      async () => {
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Aguardar 60s e recarregar → 4 alunos com recertification_number=N+1; deletado ausente; erro no Datadog/NewRelic',
      async () => {
        // Validação manual:
        //   - UI: 4 alunos visíveis com recertification_number incrementado.
        //   - Datadog/NewRelic: 1 log de erro para o user deletado, sem
        //     interromper o restante do lote.
        expect(true).toBe(true);
      },
    );
  });
});
