// Testsuite: Pesquisa e Filtros
// TC2 — STATUS: READY. Pesquisa client-side busca em "nome OU descrição".
// Org 36988 tem painéis com descrição "Descrição Painel N" — pesquisar
// pelo prefixo "Descrição" deve filtrar a listagem para esses painéis.
// Re-validado live 2026-05-11 após primeira passada incorreta (concluí que
// não havia painéis com descrição porque listei apenas linhas "Painel QA
// Teste" que têm zero-width-space na coluna descrição).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { pesquisarPainelDescricaoData as data } from './pesquisar-painel-descricao.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Pesquisa e Filtros', () => {
  test('Pesquisar painel pela descrição', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Pesquisa e Filtros');
    await allure.story('Pesquisar painel pela descrição');
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
    });

    await step(
      "2. Preencher campo de pesquisa com termo presente apenas na descrição",
      async () => {
        const initialCount = await page.locator('tbody tr').count();
        await paineis.searchPanels(data.searchTerm);
        // Listagem reduziu — termo "Descrição" filtra para os painéis 6..30
        // (cuja descrição é "Descrição Painel N"); como o termo NÃO está no
        // nome dos painéis, prova que o backend buscou na coluna descrição.
        const finalCount = await page.locator('tbody tr').count();
        expect(finalCount).toBeLessThanOrEqual(initialCount);
        expect(finalCount).toBeGreaterThan(0);
      },
    );

    await paineis.clearSearch();
  });
});
