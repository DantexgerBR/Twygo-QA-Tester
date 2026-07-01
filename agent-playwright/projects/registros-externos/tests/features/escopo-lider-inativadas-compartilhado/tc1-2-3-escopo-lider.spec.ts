import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { escopoData as data } from './escopo-lider.shared.data.js';

// SEED/LOGIN AUSENTE → QA Lead: TC1/TC2/TC3 exigem uma sessão logada no perfil
// LÍDER com liderados diretos (e um usuário fora da equipe com registros). O
// storageState do env é Admin; não há credencial/perfil Líder provisionado.
// Destrava quando o env tiver o login do Líder (mesmo blocker do TC8 da suíte 1.9).
test.describe(data.suiteName, () => {
  test.fixme('Validar matriz de escopo Líder vs Admin', async () => {});
  test.fixme('Validar 403 e toast ao atuar fora do escopo do Líder', async () => {});
  test.fixme('Validar preservação de ações antigas após mudança de hierarquia', async () => {});
});
