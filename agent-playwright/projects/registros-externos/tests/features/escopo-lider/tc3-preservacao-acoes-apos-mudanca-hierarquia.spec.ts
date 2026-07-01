import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { escopoLiderData as data } from './escopo-lider.shared.data.js';

const SUITE = data.suiteName;

// TC3 (high, ui) — preservação de ações antigas após mudança de hierarquia (RN 95).
// CORREÇÃO do recon §9 (recon modo-de-uso 2026-06-30): a visão de time do Líder
// EXISTE (/o/{org}/team/records) e a equipe é editável em /team_leaders/{id}/users.
// Não é mais bloqueio de feature — falta seed + confirmar a ação de remover
// liderado:
//   (a) seed: liderado com ≥1 registro aprovável sob o líder (team_leader 4301564);
//   (b) confirmar a remoção do liderado pela tela "Equipe" (/team_leaders/4301564/users)
//       — operação de estado persistente ⇒ exigirá afterAll que re-vincula (Anti-pattern G).
// Destinatário: QA Lead (seed + validar reversibilidade da remoção de liderado).
//
// Cobriria (AT):
//   1. Aprovar registro de um liderado como Líder → Emitido.
//   2. Remover o liderado da equipe (tela Equipe).
//   3. Admin: registro permanece Emitido/Aprovado.
//   4. Líder: registro some da lista do time (perdeu novas ações sobre a pessoa).
test.describe(SUITE, () => {
  test('Validar preservação de ações antigas após mudança de hierarquia', async () => {
    test.fixme(
      true,
      'seed-ausente: liderado com registro aprovável + ação de remover liderado da equipe ' +
        '(/team_leaders/4301564/users) a validar/reverter. Visão de time confirmada existente ' +
        '(corrige recon §9). Destinatário: QA Lead (seed + reversibilidade).',
    );
  });
});
