import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { escopoLiderData as data } from './escopo-lider.shared.data.js';

const SUITE = data.suiteName;

// TC8 (high, ui) — isolamento multi-organização do Aluno (RN 20, 20.1).
// BLOQUEADO (fixme): seed/infra ausente — exige uma 2ª organização (org Y) com
// o MESMO aluno vinculado, com 10 registros na org X e 4 na org Y. A org Y não
// está provisionada nem declarada em config/environment.json (recon §4 P4).
// Destinatário: QA Lead/infra (provisionar org Y + vincular usuário + storage
// por org).
//
// Cobriria (AT):
//   1. "Meu histórico" como Aluno na org X (10 registros) → lista/KPIs só de X.
//   2. Trocar para a org Y (4 registros) → lista/KPIs só de Y; nada de X aparece.
test.describe(SUITE, () => {
  test('Validar isolamento multi-organização do Aluno', async () => {
    test.fixme(
      true,
      'seed-ausente: 2ª organização (org Y) com o MESMO aluno vinculado (10 registros na X, 4 na Y). ' +
        'Não há seletor multi-org na sessão atual nem env de org Y. Destinatário: QA Lead/infra ' +
        '(provisionar org Y + vincular usuário + entrada em environment.json).',
    );
  });
});
