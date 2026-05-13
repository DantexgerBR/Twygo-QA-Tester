// Testsuite: Pesquisa e Filtros
// TC7 — STATUS: READY. Filtro por coluna "Nome" via fluxo "Novo" do drawer.
// O input de Nome é um react-select multi (`#option_name`) — click abre o
// dropdown, fill no input dinâmico, click na option. Re-explorado 2026-05-11
// após primeira tentativa que confundiu o componente (estava usando preset +
// Opções de filtro, e o click em `[role=menuitem]` não togglava o checkbox).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { filtrarColunaNomeData as data } from './filtrar-coluna-nome.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Pesquisa e Filtros', () => {
  test("Filtrar pela coluna 'Nome'", async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Pesquisa e Filtros');
    await allure.story("Filtrar pela coluna 'Nome'");
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
    });

    await step(
      "2. Clicar no ícone de Filtro > Novo > Colunas para filtrar > Nome",
      async () => {
        await paineis.applyColumnFilter({ column: 'Nome', value: data.targetName });
      },
    );

    await step('3. Verificar que a listagem mostra apenas o painel selecionado', async () => {
      await expect(paineis.getClearFilterButton()).toBeVisible();
      await expect(paineis.getRowByItemName(data.targetName)).toBeVisible();
      const rows = await paineis.getRowNames();
      expect(rows).toEqual([data.targetName]);
    });

    await paineis.clearFilter();
  });
});
