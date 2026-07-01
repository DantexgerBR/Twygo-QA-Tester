import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { escopoData as data } from './escopo-lider.shared.data.js';

// SEED AUSENTE → QA Lead: TC4 exige uma PESSOA inativável dedicada com registros
// conhecidos (ex. 3 Emitidos + 1 Pendente) que possa ser inativada e reativada
// sem contaminar o env compartilhado. Inativar uma pessoa real da org afetaria
// outras suítes/QAs. Destrava com um usuário-fixture dedicado para inativação.
test.describe(data.suiteName, () => {
  test.fixme('Validar sumiço completo de pessoas inativadas', async () => {});
});
