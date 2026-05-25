// Testsuite: Pesquisa e Filtros
// TC10 — STATUS: READY. Filtro por coluna Data de criação usa 2 date inputs:
// `#option_created_at-from` (de) e `#option_created_at-to` (até). Formato ISO
// YYYY-MM-DD. A coluna persiste corretamente no accordion via fluxo "Novo"
// do drawer + click na label do menuitem (NÃO no [role=menuitem]).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { filtrarColunaDataCriacaoData as data } from './filtrar-coluna-data-criacao.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Pesquisa e Filtros', () => {
  test("Filtrar pela coluna 'Data de criação'", async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Pesquisa e Filtros');
    await allure.story("Filtrar pela coluna 'Data de criação'");
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
    });

    await step(
      "2. Clicar no ícone de Filtro > Novo > Colunas para filtrar > Data de criação",
      async () => {
        await paineis.applyColumnFilter({
          column: 'Data de criação',
          dateFrom: data.dateFrom,
          dateTo: data.dateTo,
        });
      },
    );

    await step('3. Verificar que o filtro foi aplicado', async () => {
      // Asserção mínima: o filtro aplicou (botão Limpar visível). Não
      // verificamos contagem de linhas porque o intervalo pode não casar com
      // nenhum painel seedado, dependendo da seed window.
      await expect(paineis.getClearFilterButton()).toBeVisible();
    });

    await paineis.clearFilter();
  });
});
