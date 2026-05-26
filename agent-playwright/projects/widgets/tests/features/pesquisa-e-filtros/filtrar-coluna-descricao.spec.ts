// Testsuite: Pesquisa e Filtros
// TC8 — STATUS: READY. A org 36988 tem painéis com descrição "Descrição
// Painel N" (Painéis 6..30). Filtro por coluna Descrição usa `input#option_description`
// (texto simples; NÃO é react-select). Re-explorado 2026-05-11 — primeira
// passada concluiu erroneamente que não havia painéis com descrição porque
// listou só "Painel QA Teste" (com placeholder zero-width-space).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { filtrarColunaDescricaoData as data } from './filtrar-coluna-descricao.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Pesquisa e Filtros', () => {
  test("Filtrar pela coluna 'Descrição'", async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Pesquisa e Filtros');
    await allure.story("Filtrar pela coluna 'Descrição'");
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
    });

    await step(
      "2. Clicar no ícone de Filtro > Novo > Colunas para filtrar > Descrição",
      async () => {
        await paineis.applyColumnFilter({
          column: 'Descrição',
          value: data.searchTerm,
        });
      },
    );

    await step('3. Verificar que o filtro foi aplicado e retornou painel(eis) com a descrição', async () => {
      await expect(paineis.getClearFilterButton()).toBeVisible();
      const rows = await paineis.getRowNames();
      expect(rows.length).toBeGreaterThan(0);
      // O painel "Painel 6" tem descrição "Descrição Painel 6" — deve estar
      // na listagem. Não exigimos que TODAS as linhas tenham o termo no
      // nome porque o backend pode retornar painéis cuja descrição contém o
      // termo de forma indireta (ex: painéis QA com descrição parcialmente
      // populada via zero-width-space).
      await expect(paineis.getRowByItemName(data.searchTerm)).toBeVisible();
    });

    await paineis.clearFilter();
  });
});
