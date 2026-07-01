import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { escopoLiderData as data } from './escopo-lider.shared.data.js';

const SUITE = data.suiteName;

// TC10 (medium, ui) — permanência de Compartilhados após inativação da org
// parceira (RN 98 — política do Spike S11, confirmar com produto).
// BLOQUEADO (fixme): dupla barreira —
//   (a) seed ausente: não há origem Compartilhado nem org parceira na 37093
//       (recon §9), logo não há o que verificar permanecer;
//   (b) operação destrutiva: o passo 2 inativa uma ORGANIZAÇÃO inteira —
//       difícil de reverter e arrisca contaminar o ambiente compartilhado.
// Destinatário: QA Lead (seed) + produto (confirmar política de preservação
// antes de automatizar a inativação de org).
//
// Cobriria (AT):
//   1. Como Admin da org receptora, registros Compartilhados da parceira P visíveis.
//   2. Inativar a org parceira P (operação administrativa).
//   3. Recarregar → registros Compartilhados PERMANECEM acessíveis (preservação
//      de histórico do aluno).
test.describe(SUITE, () => {
  test('Validar permanência de Compartilhados após inativação da org parceira', async () => {
    test.fixme(
      true,
      'seed-ausente: origem "Compartilhado" / org parceira inexistente (recon: shared_events = 0); ' +
        'além disso o passo 2 inativa uma ORG inteira (destrutivo, difícil reverter). ' +
        'Destinatário: QA Lead/infra (seed) + produto (confirmar política de preservação, Spike S11).',
    );
  });
});
