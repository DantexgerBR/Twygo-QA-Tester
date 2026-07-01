import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { MeuHistoricoPage } from '../../../pages/MeuHistoricoPage.js';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { kpiCardsAlunoData as data } from './kpi-cards-filtro-status-aluno.shared.data.js';

const SUITE = 'KPI cards como filtro de status (Aluno)';

// A AT cita uma distribuição-exemplo (5/1/2/0). Em vez de depender desse seed
// fixo, validamos o INVARIANTE da RN 19/20: cada card reflete exatamente o
// /records/stats (que o backend já escopa ao próprio aluno) e o label de carga
// horária deriva de workload_total_seconds. Vale para qualquer distribuição.
test.describe(SUITE, () => {
  test('Validar escopo da contagem e label de carga horária do Aluno', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar escopo da contagem e label de carga horária do Aluno');
    await allure.severity('critical');

    const meuHistorico = new MeuHistoricoPage(page);
    let stats!: { data: { by_status: Record<string, number>; total_general: number; workload_total_seconds: number } };

    await allure.step('1. Contagem dos cards == stats escopado ao aluno', async () => {
      const statsPromise = page.waitForResponse(
        (r) => /\/records\/stats/.test(r.url()) && r.status() === 200,
        { timeout: 20_000 },
      );
      await meuHistorico.goto();
      stats = await (await statsPromise).json();

      for (const status of data.statuses) {
        expect(await meuHistorico.getCount(status), `card ${status}`).toBe(
          stats.data.by_status[status],
        );
      }
      allure.parameter('orgId', getOrgId());
      allure.parameter('by_status', JSON.stringify(stats.data.by_status));
    });

    await allure.step('2. Label "Carga horária total: {X} horas" deriva da carga do aluno', async () => {
      const label = await meuHistorico.getWorkloadText();
      expect(label).toMatch(data.workloadLabelRegex);

      const horasExibidas = Number.parseInt((label.match(/(\d+)\s*horas/i)?.[1] ?? '-1'), 10);
      const horasEsperadas = Math.round(stats.data.workload_total_seconds / 3600);
      expect(horasExibidas, 'carga horária = workload_total_seconds/3600').toBe(horasEsperadas);
    });
  });
});
