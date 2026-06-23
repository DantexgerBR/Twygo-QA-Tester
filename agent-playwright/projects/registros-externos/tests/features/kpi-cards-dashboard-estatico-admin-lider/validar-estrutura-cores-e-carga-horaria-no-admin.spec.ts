import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosAdminPage, KPI_LABEL } from '../../../pages/RegistrosAdminPage.js';
import { kpiCardsAdminData as data } from './kpi-cards-dashboard-estatico.shared.data.js';

const SUITE = 'KPI cards como dashboard estático (Admin/Líder)';

test.describe(SUITE, () => {
  test('Validar estrutura, cores e label de carga horária no Admin', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar estrutura, cores e label de carga horária no Admin');
    await allure.severity('critical');

    const registros = new RegistrosAdminPage(page);

    await allure.step('1. Acessar "Aprendizagem > Registros" como Admin', async () => {
      await registros.goto();
      // 4 cards na ordem canônica: Emitidos, Expirados, Pendentes, Recusados (RN 18).
      expect(await registros.getCardLabelsInOrder()).toEqual([...data.cardOrder]);
      // Anatomia de cada card: donut (canvas) + número + label.
      for (const status of data.statuses) {
        await registros.expectCardAnatomy(status);
      }
      // REVISAR: a cor do donut (RN 18.1/18.2) não é introspectável no DOM — o donut
      // é <canvas> (Chart.js) e os cards do Admin nunca ficam ativos, então a via do
      // border (usada na suíte Aluno) não se aplica. Estrutura/ordem/label validadas;
      // cor canônica assumida idêntica ao mesmo componente da visão Aluno.
    });

    await allure.step(
      '2. Contagens refletem registros da organização (invariante vs records/stats)',
      async () => {
        const stats = await registros.getStats();
        const counts = await registros.getCounts();
        // Invariante: cada card bate com o backend (que escopa a contagem à org
        // ativa para o Admin). Nunca cravar número de seed — o Stage oscila.
        for (const status of data.statuses) {
          expect(counts[status], `contagem de ${KPI_LABEL[status]} deve bater com records/stats`).toBe(
            stats.byStatus[status],
          );
        }
        // Os 4 cards cobrem 4 dos 6 status; a soma deve ser <= total geral da org
        // (que inclui também "Substituído" e "Em andamento", sem card — RN 23).
        const somaCards = data.statuses.reduce((acc, s) => acc + counts[s], 0);
        expect(somaCards).toBeLessThanOrEqual(stats.totalGeneral);
      },
    );

    await allure.step('3. Label "Carga horária total: {X} horas"', async () => {
      await expect(registros.workload()).toBeVisible();
      const txt = await registros.getWorkloadText();
      expect(txt).toMatch(data.workloadLabelRegex);
      // Invariante: as horas exibidas = arredondamento de workload_total_seconds/3600.
      const stats = await registros.getStats();
      const horasExibidas = Number.parseInt((txt.match(/(\d+)\s*horas/i)?.[1] ?? '-1'), 10);
      expect(horasExibidas).toBe(Math.round(stats.workloadSeconds / 3600));
    });
  });
});
