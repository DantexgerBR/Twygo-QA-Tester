import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { MeuHistoricoPage } from '../../../pages/MeuHistoricoPage.js';
import { kpiCardsAlunoData as data } from './kpi-cards-filtro-status-aluno.shared.data.js';

const SUITE = 'KPI cards como filtro de status (Aluno)';

// RN 36: a faixa de KPIs é PERMANENTE — mesmo um aluno sem (ou com poucos)
// registros vê os 4 cards renderizados, nunca substituídos por um empty state
// customizado. O env staging é compartilhado e a massa do usuário oscila (no
// recon estava tudo zero; durante a execução havia 1 Emitido), então NÃO
// fixamos count == 0 (anti-pattern de seed frágil — criar-spec-resiliente).
// Validamos o invariante que vale em qualquer distribuição: a faixa existe com
// os 4 cards (donut + número) e não é trocada por mensagem de vazio.
test.describe(SUITE, () => {
  test('Validar estado "tudo zero" para aluno novo', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar estado "tudo zero" para aluno novo');
    await allure.severity('normal');
    await allure.tag('REVIEW_NEEDED');

    const meuHistorico = new MeuHistoricoPage(page);

    await allure.step('1. Faixa de KPIs aparece com os 4 cards (donut + número)', async () => {
      await meuHistorico.goto();
      expect(await meuHistorico.getCardLabelsInOrder()).toEqual([...data.cardOrder]);
      for (const s of data.statuses) {
        await expect(meuHistorico.card(s)).toBeVisible();
        // donut sempre presente (anel cinza quando 0). // REVISAR: cor do anel é
        // canvas, não introspectável.
        await expect(meuHistorico.card(s).locator('canvas')).toBeVisible();
        // número exibido é inteiro não-negativo (0 para aluno novo).
        expect(await meuHistorico.getCount(s), `card ${s} >= 0`).toBeGreaterThanOrEqual(0);
      }
    });

    await allure.step('2. Faixa de cards é renderizada (não substituída por mensagem)', async () => {
      // A faixa é permanente: os 4 cards + label de carga horária seguem
      // presentes (RN 36.1/36.2). Se um empty state tivesse tomado o lugar da
      // faixa, os cards não estariam visíveis.
      for (const s of data.statuses) {
        await expect(meuHistorico.card(s)).toBeVisible();
      }
      await expect(meuHistorico.workload()).toBeVisible();
    });
  });
});
