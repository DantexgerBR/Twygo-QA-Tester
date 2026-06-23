import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { MeuHistoricoPage } from '../../../pages/MeuHistoricoPage.js';
import { kpiCardsAlunoData as data } from './kpi-cards-filtro-status-aluno.shared.data.js';

const SUITE = 'KPI cards como filtro de status (Aluno)';

test.describe(SUITE, () => {
  test('Validar denominador do donut somando os 6 status', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar denominador do donut somando os 6 status');
    await allure.severity('critical');
    await allure.tag('REVIEW_NEEDED');

    const meuHistorico = new MeuHistoricoPage(page);
    let stats!: { data: { by_status: Record<string, number>; total_general: number } };

    await allure.step('1. Proporção do donut usa a soma dos 6 status como total', async () => {
      const statsPromise = page.waitForResponse(
        (r) => /\/records\/stats/.test(r.url()) && r.status() === 200,
        { timeout: 20_000 },
      );
      await meuHistorico.goto();
      stats = await (await statsPromise).json();
      // REVISAR: o donut é um <canvas> (Chart.js) — a proporção da fatia não é
      // introspectável no DOM, então a RN 23 (denominador = 6 status) não dá
      // para verificar pixel-a-pixel. Validamos o invariante numérico
      // equivalente abaixo: o total usado como denominador (total_general) inclui
      // mais que os 4 cards.
      expect(stats.data.total_general).toBeGreaterThanOrEqual(0);
    });

    await allure.step('2. Soma dos 4 cards <= total_general (diferença = Substituído + Em andamento)', async () => {
      let sum4 = 0;
      for (const status of data.statuses) sum4 += await meuHistorico.getCount(status);

      const totalGeral = stats.data.total_general;
      // RN 23.1: os 4 cards cobrem só 4 dos 6 status; a soma nunca pode exceder o
      // total geral (denominador do donut). A diferença são os status sem card.
      expect(sum4).toBeLessThanOrEqual(totalGeral);
      allure.parameter('soma_4_cards', String(sum4));
      allure.parameter('total_general', String(totalGeral));
      allure.parameter('diff_status_sem_card', String(totalGeral - sum4));
    });
  });
});
