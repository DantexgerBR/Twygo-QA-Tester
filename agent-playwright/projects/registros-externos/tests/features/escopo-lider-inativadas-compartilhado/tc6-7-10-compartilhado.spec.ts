import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { escopoData as data } from './escopo-lider.shared.data.js';

// SEED AUSENTE → QA Lead: TC6/TC7/TC10 exigem registros de origem "Compartilhado"
// (replicados de uma organização parceira com compartilhamento configurado). O
// env só tem origens external/internal (probe 2026-06-25: 0 registros shared) e
// não há como criar Compartilhado via API (vêm da org parceira). Destrava quando
// houver org parceira com compartilhamento + registros Compartilhados na principal.
test.describe(data.suiteName, () => {
  test.fixme('Validar apresentação e menu restrito de registros Compartilhados', async () => {});
  test.fixme('Validar bloqueio de modificação de Compartilhado via API (403)', async () => {});
  test.fixme('Validar permanência de Compartilhados após inativação da org parceira', async () => {});
});
