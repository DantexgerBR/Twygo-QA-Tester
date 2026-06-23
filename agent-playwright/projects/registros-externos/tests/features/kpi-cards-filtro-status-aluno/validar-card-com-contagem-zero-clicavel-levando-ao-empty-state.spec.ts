import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { MeuHistoricoPage, KPI_COLOR, type KpiStatus } from '../../../pages/MeuHistoricoPage.js';
import { kpiCardsAlunoData as data } from './kpi-cards-filtro-status-aluno.shared.data.js';

const SUITE = 'KPI cards como filtro de status (Aluno)';

test.describe(SUITE, () => {
  test('Validar card com contagem 0 clicável levando ao empty state', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar card com contagem 0 clicável levando ao empty state');
    await allure.severity('critical');
    await allure.tag('REVIEW_NEEDED');

    const meuHistorico = new MeuHistoricoPage(page);
    let zero: KpiStatus = 'rejected';

    await allure.step('1. Card com 0 exibe "0" bold e anel cinza, idêntico aos demais', async () => {
      await meuHistorico.goto();
      // Escolhe um status com contagem 0 (cenário da RN 29/35).
      for (const s of data.statuses) {
        if ((await meuHistorico.getCount(s)) === 0) { zero = s; break; }
      }
      expect(await meuHistorico.getCount(zero), `card ${zero} = 0`).toBe(0);
      // Mantém borda/anatomia idênticas aos demais cards (donut canvas = REVISAR
      // para a cor do anel cinza, mas a anatomia DOM é a mesma).
      await meuHistorico.expectCardAnatomy(zero);
      expect(await meuHistorico.isActive(zero), 'inativo no load').toBe(false);
    });

    await allure.step('2. Clicar no card 0 — ganha ativo e lista mostra empty state', async () => {
      await meuHistorico.clickCard(zero);
      expect(await meuHistorico.isActive(zero)).toBe(true);
      await expect
        .poll(async () => meuHistorico.getBorderColor(zero), { timeout: 5_000 })
        .toBe(KPI_COLOR[zero]);
      // Sem registros no filtro → lista mostra o placeholder de vazio.
      // REVISAR: a AT documenta o texto "Nenhum registro encontrado"; a UI real
      // renderiza o placeholder genérico de tabela "Não há dados para exibir".
      expect(await meuHistorico.isEmptyState()).toBe(true);
      expect(await meuHistorico.getVisibleRecordCount()).toBe(0);
    });

    await allure.step('3. Clicar novamente — filtro desativa e lista volta', async () => {
      await meuHistorico.deactivateCard(zero);
      expect(await meuHistorico.isActive(zero)).toBe(false);
    });
  });
});
