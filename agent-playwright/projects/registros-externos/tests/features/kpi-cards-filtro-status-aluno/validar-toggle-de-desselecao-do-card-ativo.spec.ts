import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { MeuHistoricoPage } from '../../../pages/MeuHistoricoPage.js';

const SUITE = 'KPI cards como filtro de status (Aluno)';

test.describe(SUITE, () => {
  test('Validar toggle de desseleção do card ativo', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar toggle de desseleção do card ativo');
    await allure.severity('critical');

    const meuHistorico = new MeuHistoricoPage(page);

    await allure.step('1. Acessar "Meu histórico" — sem filtro ativo', async () => {
      await meuHistorico.goto();
      expect(await meuHistorico.isActive('pending')).toBe(false);
    });

    await allure.step('2. Clicar no card "Pendentes" — fica ativo', async () => {
      await meuHistorico.clickCard('pending');
      expect(await meuHistorico.isActive('pending')).toBe(true);
    });

    await allure.step('3. Clicar novamente no card "Pendentes" — filtro removido', async () => {
      await meuHistorico.deactivateCard('pending');
      expect(await meuHistorico.isActive('pending')).toBe(false);
      // Todos os cards voltam ao peso visual normal (sem elevação).
      for (const s of ['emitted', 'expired', 'pending', 'rejected'] as const) {
        expect(await meuHistorico.isActive(s), `${s} normal`).toBe(false);
      }
    });
  });
});
