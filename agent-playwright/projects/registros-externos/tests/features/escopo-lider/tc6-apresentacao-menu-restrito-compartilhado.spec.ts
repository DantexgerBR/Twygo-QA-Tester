import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { escopoLiderData as data } from './escopo-lider.shared.data.js';

const SUITE = data.suiteName;

// TC6 (critical, ui) — apresentação e menu restrito de registros Compartilhados
// (RN 97, 97.1, 97.2, 98, 98.2).
// BLOQUEADO (fixme): seed ausente — a org 37093 só tem origens `external` e
// `internal` (recon §9); não existe origem Compartilhado nem org parceira com
// compartilhamento configurado. Destinatário: QA Lead (seed: configurar org
// parceira + replicação de registro Compartilhado).
//
// Cobriria (AT):
//   1. Como Admin, localizar registro Compartilhado → chip "Compartilhado" na
//      coluna Origem.
//   2. Menu 3 pontos → APENAS "Visualizar" + "Histórico"; Editar/Avaliar/
//      Excluir/Evidências NÃO renderizam.
//   3. "Visualizar" → certificado abre em nova aba.
//   4. "Histórico" → drawer com a trilha contendo apenas o evento "criado".
test.describe(SUITE, () => {
  test('Validar apresentação e menu restrito de registros Compartilhados', async () => {
    test.fixme(
      true,
      'seed-ausente: origem "Compartilhado" inexistente — recon modo-de-uso confirmou ' +
        'granted/received_shared_events = 0 e badges só external/internal. Exige org parceira + ' +
        'compartilhamento de registro replicado. Destinatário: QA Lead/infra (seed de compartilhamento).',
    );
  });
});
