import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { MeuHistoricoPage } from '../../../pages/MeuHistoricoPage.js';
import { kpiCardsAlunoData as data } from './kpi-cards-filtro-status-aluno.shared.data.js';

const SUITE = 'KPI cards como filtro de status (Aluno)';

// Os tooltips do Aluno foram validados manualmente pelo QA (2026-06-22) e estão
// CORRETOS no produto — este teste assere o texto real e passa.
// NOTA p/ a AT: a test-analysis.md (RN 18.3.1) documenta um texto diferente
// (tom "você": "Certificados emitidos e dentro do prazo de validade." etc.) que
// está DESATUALIZADO. A doc canônica deveria ser alinhada ao produto pela AT —
// ver tooltipsAlunoDocAT no .data.ts. Não é bug de produto.
test.describe(SUITE, () => {
  test('Validar tooltips dos cards no tom do Aluno', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar tooltips dos cards no tom do Aluno');
    await allure.severity('critical');
    allure.parameter('obs_AT', 'test-analysis.md RN 18.3.1 desatualizada — alinhar à cópia real');

    const meuHistorico = new MeuHistoricoPage(page);

    await allure.step('1. Acessar a tela "Meu histórico"', async () => {
      await meuHistorico.goto();
    });

    await allure.step('2. Tooltip do card "Emitidos"', async () => {
      expect(await meuHistorico.readTooltip('emitted')).toBe(data.tooltipsAlunoReal.emitted);
    });

    await allure.step('3. Tooltip do card "Expirados"', async () => {
      expect(await meuHistorico.readTooltip('expired')).toBe(data.tooltipsAlunoReal.expired);
    });

    await allure.step('4. Tooltip do card "Pendentes"', async () => {
      expect(await meuHistorico.readTooltip('pending')).toBe(data.tooltipsAlunoReal.pending);
    });

    await allure.step('5. Tooltip do card "Recusados"', async () => {
      expect(await meuHistorico.readTooltip('rejected')).toBe(data.tooltipsAlunoReal.rejected);
    });
  });
});
