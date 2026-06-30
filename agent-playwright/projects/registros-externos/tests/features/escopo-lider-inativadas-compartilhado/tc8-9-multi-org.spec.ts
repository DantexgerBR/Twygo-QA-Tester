import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { escopoData as data } from './escopo-lider.shared.data.js';

// SEED AUSENTE → QA Lead: TC8/TC9 exigem um Aluno com vínculo em DUAS organizações
// com registros distintos (cenário multi-org) e um Admin com vínculo duplo. Não há
// fixture multi-org provisionada com contagens conhecidas (X=10 / Y=4) neste env.
// Destrava com o aluno/admin multi-org seedado (principal + ambiente adicional).
test.describe(data.suiteName, () => {
  test.fixme('Validar isolamento multi-organização do Aluno', async () => {});
  test.fixme('Validar isolamento entre organizações no perfil Admin', async () => {});
});
