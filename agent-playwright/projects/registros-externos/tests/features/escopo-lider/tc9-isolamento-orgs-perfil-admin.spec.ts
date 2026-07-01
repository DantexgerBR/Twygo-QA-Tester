import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { escopoLiderData as data } from './escopo-lider.shared.data.js';

const SUITE = data.suiteName;

// TC9 (high, api) — isolamento entre organizações no perfil Admin (RN 21, 94).
// BLOQUEADO (fixme): mesma dependência do TC8 — exige 2ª organização (org Y)
// com o mesmo usuário Admin vinculado e registros em ambas. Não provisionada
// (recon §4 P4). Destinatário: QA Lead/infra.
//
// Cobriria (AT):
//   1. /stats como Admin da org Y → contagens apenas da org Y.
//   2. Request de aprovação como Admin da org Y para registro da org X → HTTP 403.
test.describe(SUITE, () => {
  test('Validar isolamento entre organizações no perfil Admin', async () => {
    test.fixme(
      true,
      'seed-ausente: 2ª organização (org Y) com o MESMO usuário Admin vinculado e registros em ambas. ' +
        'Mesma dependência do TC8. Destinatário: QA Lead/infra (provisionar org Y + vincular usuário).',
    );
  });
});
