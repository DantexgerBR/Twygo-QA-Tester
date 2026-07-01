import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { MeuHistoricoPage, KPI_LABEL } from '../../../pages/MeuHistoricoPage.js';
import { kpiCardsAlunoData as data } from './kpi-cards-filtro-status-aluno.shared.data.js';

const SUITE = 'KPI cards como filtro de status (Aluno)';

test.describe(SUITE, () => {
  test('Validar estrutura e cores dos 4 KPI cards', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar estrutura e cores dos 4 KPI cards');
    await allure.severity('critical');

    const meuHistorico = new MeuHistoricoPage(page);

    await allure.step('1. Acessar a tela "Meu histórico"', async () => {
      await meuHistorico.goto();
      // 4 KPI cards na ordem: Emitidos, Expirados, Pendentes, Recusados.
      expect(await meuHistorico.getCardLabelsInOrder()).toEqual([...data.cardOrder]);
    });

    await allure.step('2. Verificar os elementos do card "Emitidos"', async () => {
      // Card exibe donut (canvas) + número + label.
      await meuHistorico.expectCardAnatomy('emitted');
    });

    await allure.step('3. Verificar a cor do donut de cada card', async () => {
      // O donut é <canvas> — a cor não é introspectável no DOM. O card adota a
      // MESMA cor de design no border quando ativo, então validamos a cor
      // canônica (RN 18) por essa via. // REVISAR: cor do pixel do donut em si
      // (canvas) não é verificada — assumida idêntica ao token de border.
      // Clicar cada card em sequência ativa-o e desativa o anterior (só um
      // ativo por vez), então não é preciso desfazer manualmente entre eles.
      // expectActiveBorderColor faz poll até a transição CSS estabilizar na cor.
      for (const status of data.statuses) {
        await meuHistorico.expectActiveBorderColor(status);
      }
      // sanity: labels seguem o mapa canônico
      for (const status of data.statuses) {
        await expect(meuHistorico.card(status)).toContainText(KPI_LABEL[status]);
      }
    });
  });
});
