import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

// TC24 — validação de LOGS gravados pela reorder API. É verificação de
// banco/logs, fora do escopo do executor Playwright UI. Pertence ao agent-db
// (validador de banco) OU a um TC de API em tests/api/ consumindo o endpoint de
// logs. Categoria `dep-externa` (§7.6 F): destinatário é o executor de banco.
test.describe(suiteData.suiteName, () => {
  test('Validar logs da reorder API', async () => {
    test.fixme(
      true,
      '[dep-externa] validação de logs/DB da reorder API → executor agent-db (ou TC de API em tests/api/), não Playwright UI.',
    );
  });
});
