// Testsuite: Pesquisa e Filtros
// TC1 — STATUS: READY. Search é client-side por nome OU descrição. Pegamos
// o nome do primeiro painel da listagem (sem hardcode "Vendas 2026" do XML —
// org 36988 tem painéis "Painel 1..30" do seed).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Pesquisa e Filtros', () => {
  test('Pesquisar painel pelo nome', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Pesquisa e Filtros');
    await allure.story('Pesquisar painel pelo nome');
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);
    let targetName: string;

    await step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
      targetName = await paineis.getFirstPanelName();
    });

    await step("2. Preencher campo de pesquisa com o nome do painel", async () => {
      await paineis.searchPanels(targetName);
      // Listagem deve conter o alvo (search por nome em modo exato).
      await expect(paineis.getRowByItemName(targetName)).toBeVisible();
      const names = await paineis.getRowNames();
      for (const n of names) {
        expect(n.toLowerCase()).toContain(targetName.toLowerCase());
      }
    });

    await step('3. Limpar o campo de pesquisa', async () => {
      await paineis.clearSearch();
      // Após limpar, a listagem retorna a múltiplas linhas (org tem 30 painéis).
      await expect
        .poll(async () => (await paineis.getRowNames()).length, {
          timeout: 5_000,
          message: 'aguardando listagem voltar a >1 linha após limpar search',
        })
        .toBeGreaterThan(1);
    });
  });
});
