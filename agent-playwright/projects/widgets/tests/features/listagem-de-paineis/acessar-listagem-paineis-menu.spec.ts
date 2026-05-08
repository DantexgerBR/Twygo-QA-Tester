// Testsuite: Listagem de painéis
// TC1 — STATUS: READY (feature liberada na org 36908; sem test.fixme).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.describe('Listagem de painéis', () => {
  test('Acessar a listagem de Painéis a partir do Menu', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Listagem de painéis');
    await allure.story('Acessar a listagem de Painéis a partir do Menu');
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await allure.step("1. Clicar no link 'Menu' da sidebar lateral", async () => {
      // Storage state sozinho não navega — precisamos abrir um contexto
      // admin antes de o link "Menu" existir na sidebar.
      await paineis.openAdminContext();
      await paineis.clickMenuLink();
    });

    await allure.step(
      "2. Verificar que a tab 'Modos de uso' está selecionada e o breadcrumb",
      async () => {
        await expect(paineis.getModosDeUsoTab()).toHaveAttribute(
          'aria-selected',
          'true',
        );
        // REVISAR: XML diz "Navegação > Modos de uso", real é
        // "Menu > Modos de uso" (re-confirmado 2026-05-05).
        await expect(paineis.getBreadcrumb()).toHaveText('Menu > Modos de uso');
      },
    );

    await allure.step("3. Clicar na tab 'Painéis'", async () => {
      await paineis.getPaineisTab().click();
      await page.waitForURL(/tab=panels-tab/);
    });

    await allure.step('4. Verificar que a listagem renderiza', async () => {
      await expect(paineis.getPaineisTab()).toHaveAttribute(
        'aria-selected',
        'true',
      );
      // REVISAR: XML diz "renderiza como list-control"; o DOM real não tem
      // web-component nomeado, validamos via sub-componentes (add + search)
      // que são prova de que a listagem renderizou.
      await expect(paineis.getAddButton()).toBeVisible();
      await expect(paineis.getSearchInput()).toBeVisible();
    });
  });
});
