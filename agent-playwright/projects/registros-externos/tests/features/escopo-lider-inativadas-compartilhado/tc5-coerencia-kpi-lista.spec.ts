import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getStats } from '../../../data/records-api.js';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { escopoData as data } from './escopo-lider.shared.data.js';

// Read-only — invariante de contagem (RN96.5): /stats e /list usam o mesmo
// critério (pessoa ativa + escopo + soft-delete), então o total dos KPIs bate
// exatamente com o total de linhas da lista.
test.describe(data.suiteName, () => {
  test('Validar coerência permanente entre KPI e lista', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar coerência permanente entre KPI e lista');
    await allure.severity('critical');

    let totalEntries = 0;
    const stats = await getStats(page);
    const somaStatus = Object.values(stats.by_status).reduce((a, b) => a + b, 0);

    await allure.step('1-2. total da lista (paginação) == total_general dos KPIs', async () => {
      const res = await page.request.get(`/api/v1/o/${getOrgId()}/records?per_page=1`, {
        headers: { Accept: 'application/json' },
      });
      const j = (await res.json()) as { data?: { pagination?: { total_entries?: number } } };
      totalEntries = j.data?.pagination?.total_entries ?? -1;
      expect(totalEntries, 'total de linhas deve igualar o total_general dos KPIs').toBe(stats.total_general);
    });

    await allure.step('Soma dos status dos cards == total_general (sem divergência)', async () => {
      expect(somaStatus, 'Σ by_status deve igualar total_general').toBe(stats.total_general);
    });

    // Passo 3 (mesma coerência logado como Líder) → fixme: requer login Líder.
  });
});
