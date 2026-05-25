// Testsuite: Listagem de painéis
// TC6 — STATUS: READY. Re-explorado 2026-05-06 com 30 painéis seedados na
// org 36988 (>25 → paginação interativa, página 2 disponível). IDs estáveis
// dos botões: `first-page-button`, `previous-page-button`, `page-button-N`,
// `next-page-button`.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.describe('Listagem de painéis', () => {
  test('Paginação da listagem com volume de painéis', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Listagem de painéis');
    await allure.story('Paginação da listagem com volume de painéis');
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await allure.step(
      "1. Acessar a listagem e verificar paginação visível com botão '1' ativo",
      async () => {
        await paineis.goToList();
        await expect(paineis.getPagination()).toBeVisible();
        // REVISAR: aguardando data-test-id no `#page-button-1` para asserir
        // estado "ativo" (atualmente capturado por classe css-1xp0shu vs
        // css-dqs8do — frágil). Por ora valida-se apenas presença + click.
        await expect(paineis.getPageButton(1)).toBeVisible();
      },
    );

    await allure.step('2. Avançar para a próxima página', async () => {
      const cardsBefore = await paineis.getCardCount();
      await paineis.goToNextPage();
      // Página 2 tem 5 cards (30 - 25); a contagem muda — prova de que
      // navegou. REVISAR: alternativa estável seria assertar que o nome do
      // primeiro card mudou.
      await expect(paineis.getPageButton(2)).toBeVisible();
      const cardsAfter = await paineis.getCardCount();
      expect(cardsAfter).not.toEqual(cardsBefore);
    });

    await allure.step('3. Voltar para a página anterior', async () => {
      await paineis.goToPreviousPage();
      // De volta à página 1 — botão `previous-page-button` volta a estar
      // disabled (primeira página).
      await expect(paineis.getPreviousPageButton()).toBeDisabled();
    });
  });
});
