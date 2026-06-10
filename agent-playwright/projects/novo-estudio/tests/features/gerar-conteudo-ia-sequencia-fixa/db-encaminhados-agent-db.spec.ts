import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { suiteData } from './gerar-conteudo-ia-sequencia-fixa.shared.data.js';

// ============================================================================
// TC6 / TC24 — Tipo: db. Fora do escopo do agent-playwright (CONTRACT.md): a
// validação em MySQL é executada pelo agent-db. Marcados fixme com encaminhamento
// (decisão do usuário 2026-06-05: pular → encaminhar ao agent-db).
// ============================================================================

test.describe(suiteData.suiteName, () => {
  test('Validar que o roteiro persiste em "narrator_script"', async () => {
    test.fixme(
      true,
      '[db→agent-db] Tipo: db. SELECT narrator_script FROM event_contents — validação MySQL fora do escopo agent-playwright (CONTRACT.md).',
    );
  });

  test('Validar registros em studio_generation_partitions', async () => {
    test.fixme(
      true,
      '[db→agent-db] Tipo: db. Lifecycle da partition (queued→processing→completed→approved) + campos de auditoria — validação MySQL no agent-db.',
    );
  });
});
