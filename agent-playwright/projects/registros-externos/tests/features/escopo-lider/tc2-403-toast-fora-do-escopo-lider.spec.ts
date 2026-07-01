import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { escopoLiderData as data } from './escopo-lider.shared.data.js';

const SUITE = data.suiteName;

// TC2 (critical, api) — 403 + toast ao atuar fora do escopo do Líder (RN 94).
// CORREÇÃO do recon §9 (recon modo-de-uso 2026-06-30): o escopo de Líder EXISTE
// (visão "Gestão de Time > Registros", stats `team_scope=true`). Logo a condição
// "Líder atuando sobre não-liderado" é PRODUZÍVEL — não é mais bloqueio de
// feature. Falta seed + recon de API:
//   (a) seed: ≥1 liderado e ≥1 pessoa FORA da equipe, cada um com registro;
//   (b) capturar a rota real de aprovação (PATCH/POST .../records/{id}/...) e o
//       shape do 403 (a sessão única do Twygo barrou essa captura no recon).
// Destinatário: QA Lead (seed) + recon de API de ação.
//
// Cobriria (AT):
//   1. Request de aprovação como Líder p/ registro de não-liderado → HTTP 403.
//   2. Toast vermelho "Sem permissão pra atuar nesse registro"; registro inalterado.
test.describe(SUITE, () => {
  test('Validar 403 e toast ao atuar fora do escopo do Líder', async () => {
    test.fixme(
      true,
      'seed-ausente: liderado + pessoa fora da equipe (cada um com registro) e rota de aprovação ' +
        'a confirmar via recon de API. Escopo de Líder confirmado existente (corrige recon §9). ' +
        'Destinatário: QA Lead (seed) + recon de API de ação.',
    );
  });
});
