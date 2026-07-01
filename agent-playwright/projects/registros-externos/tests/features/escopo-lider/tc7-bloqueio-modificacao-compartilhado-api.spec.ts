import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { escopoLiderData as data } from './escopo-lider.shared.data.js';

const SUITE = data.suiteName;

// TC7 (high, api) — bloqueio de modificação de Compartilhado via API (403) (RN 98.1).
// BLOQUEADO (fixme): mesmo motivo do TC6 — não existe registro Compartilhado na
// org 37093 (recon §9), logo não há id de registro Compartilhado para exercer
// PATCH/DELETE. Destinatário: QA Lead (seed: origem Compartilhado).
//
// Cobriria (AT):
//   1. PATCH de edição em registro Compartilhado como Admin da org receptora →
//      HTTP 403; registro inalterado.
//   2. DELETE no mesmo registro → HTTP 403.
test.describe(SUITE, () => {
  test('Validar bloqueio de modificação de Compartilhado via API (403)', async () => {
    test.fixme(
      true,
      'seed-ausente: nenhum registro origem "Compartilhado" na org (recon modo-de-uso: ' +
        'shared_events = 0) → sem id para exercer PATCH/DELETE. Destinatário: QA Lead/infra (seed de compartilhamento).',
    );
  });
});
