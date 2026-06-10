import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { suiteData } from './exclusao-do-banco-historico.shared.data.js';

// ============================================================================
// Suíte "Exclusão do Banco Histórico" (Tipo: db) — 1 TC (1.18). Card 19722.
//
// Bloqueado neste ambiente por TRÊS razões independentes (recon 2026-06-09):
//  1. [exclusao-destrutiva] o TC valida que, ao EXCLUIR uma organização, os
//     registros somem das tabelas. Excluir uma org é destrutivo — inviável na
//     37061 (org principal de todos os QAs). Exigiria provisionar uma org Trial
//     descartável, povoá-la com dados de Estúdio, excluí-la e então verificar.
//  2. [multi-banco] as tabelas abrangem MySQL + PostgreSQL + DynamoDB
//     (studio_checkpoints, messages no Dynamo). Não há, neste agente, acesso a
//     PostgreSQL nem DynamoDB.
//  3. [db-sem-acesso] não há acesso a banco read-only configurado no
//     agent-playwright (sem DB_*_RC no .env; agent-db é esqueleto).
//
// Executor real é agent-db (CONTRACT.md) quando o acesso a banco existir.
// Evidência/contexto: inputs/recon-exclusao-banco-historico.md.
// ============================================================================

test.describe(suiteData.suiteName, () => {
  test('Exclusão do ambiente e dos registros das tabelas do banco de dados', async () => {
    test.fixme(
      true,
      `[exclusao-destrutiva] + [multi-banco] + [db-sem-acesso] valida ausência de registros após excluir uma organização, em MySQL + PostgreSQL + DynamoDB. Requer org Trial descartável (não a 37061) + acesso aos 3 bancos (executor agent-db). Card ${suiteData.trackingCard}. Recon ${suiteData.reconDate}.`,
    );
  });
});
