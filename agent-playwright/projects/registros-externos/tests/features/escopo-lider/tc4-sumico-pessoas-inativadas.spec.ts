import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { escopoLiderData as data } from './escopo-lider.shared.data.js';

const SUITE = data.suiteName;

// TC4 (critical, ui) — sumiço completo de pessoas inativadas (RN 96, 96.1–96.4).
// BLOQUEADO (fixme): seed ausente — pessoa inativável com distribuição conhecida
// de registros (ex. 3 Emitidos + 1 Pendente). Recon §9: `/o/{org}/professionals`
// veio vazio na 37093 e a rota de inativação de pessoa não foi confirmada.
// Operação cria estado persistente (inativar → reativar) ⇒ exigiria afterAll
// idempotente (Anti-pattern G) quando reativada. Destinatário: QA Lead (seed +
// confirmar rota da admin de usuários).
//
// Cobriria (AT):
//   1. Como Admin, anotar KPIs + presença dos registros da pessoa-alvo.
//   2. Inativar a pessoa na administração de usuários.
//   3. Recarregar Registros → KPIs decrementados; registros somem da lista;
//      busca pelo nome → "Nenhum registro encontrado".
//   4. Conferir ausência de toggle "mostrar inativos" (regra silenciosa).
//   5. (etapa manual) Extração CSV "Todos" → registros da pessoa NÃO constam.
test.describe(SUITE, () => {
  test('Validar sumiço completo de pessoas inativadas', async () => {
    test.fixme(
      true,
      'seed-ausente: pessoa inativável com distribuição conhecida (ex. 3 Emitidos + 1 Pendente) ' +
        'e rota da admin de usuários a confirmar (/professionals veio vazio). Destinatário: QA Lead (seed).',
    );
  });
});
