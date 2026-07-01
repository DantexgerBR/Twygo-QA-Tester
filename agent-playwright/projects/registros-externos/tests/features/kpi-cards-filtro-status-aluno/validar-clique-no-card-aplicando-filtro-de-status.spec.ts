import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { MeuHistoricoPage } from '../../../pages/MeuHistoricoPage.js';

const SUITE = 'KPI cards como filtro de status (Aluno)';

test.describe(SUITE, () => {
  test('Validar clique no card aplicando filtro de status', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar clique no card aplicando filtro de status');
    await allure.severity('critical');

    const meuHistorico = new MeuHistoricoPage(page);

    await allure.step('1. Acessar "Meu histórico" — nenhum card ativo', async () => {
      await meuHistorico.goto();
      for (const s of ['emitted', 'expired', 'pending', 'rejected'] as const) {
        expect(await meuHistorico.isActive(s), `${s} inativo no load`).toBe(false);
      }
    });

    await allure.step('2. Clicar no card "Pendentes" — lista filtra por Pendente', async () => {
      await meuHistorico.clickCard('pending');
      expect(await meuHistorico.isActive('pending')).toBe(true);
      // Linhas exibidas batem com o número do card (RN 26.2). Com 0, lista vazia.
      const pendentes = await meuHistorico.getCount('pending');
      expect(await meuHistorico.getVisibleRecordCount()).toBe(pendentes);
    });

    await allure.step('3. Clicar no card "Emitidos" — só um card ativo por vez', async () => {
      await meuHistorico.clickCard('emitted');
      expect(await meuHistorico.isActive('emitted')).toBe(true);
      // A desativação do card anterior tem transição CSS — poll até assentar.
      await expect
        .poll(async () => meuHistorico.isActive('pending'), { timeout: 5_000 })
        .toBe(false);
    });
  });
});
