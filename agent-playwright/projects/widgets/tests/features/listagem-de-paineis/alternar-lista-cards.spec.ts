// Testsuite: Listagem de painéis
// TC4 — STATUS: READY (2026-05-06). Toggle Lista/Cards confirmado live: dois
// `<span>` Material Symbols — `#grid-view-icon` (cards) e `#list-icon` (lista).
// No viewport 1920x1080 o default é Lista; o spec testa as duas transições
// (lista → cards → lista) para validar o toggle nos dois sentidos.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

// 1920x1080 porque o default Lista/Cards depende do viewport.
test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Listagem de painéis', () => {
  test('Alternar entre visualização em lista e cards', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Listagem de painéis');
    await allure.story('Alternar entre visualização em lista e cards');
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await allure.step(
      "1. Acessar a listagem (default em 1920x1080 é 'Lista')",
      async () => {
        await paineis.goToList();
        await paineis.setViewMode('lista');
        expect(await paineis.getCurrentViewMode()).toBe('lista');
        await expect(paineis.getColumnHeader('Nome')).toBeVisible();
      },
    );

    await allure.step("2. Alternar para visualização 'Cards'", async () => {
      await paineis.setViewMode('cards');
      expect(await paineis.getCurrentViewMode()).toBe('cards');
      await expect(paineis.getCardsContainer()).toBeVisible();
    });

    await allure.step("3. Voltar para visualização 'Lista'", async () => {
      await paineis.setViewMode('lista');
      expect(await paineis.getCurrentViewMode()).toBe('lista');
      await expect(paineis.getColumnHeader('Nome')).toBeVisible();
    });
  });
});
