import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ExtracaoDrawerPage } from '../../../pages/ExtracaoDrawerPage.js';
import { extracaoData as data } from './extracao-dados-evidencias.shared.data.js';

test.describe(data.suiteName, () => {
  test('Validar estrutura do drawer no branch "Dados"', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar estrutura do drawer no branch "Dados"');
    await allure.severity('critical');

    const extracao = new ExtracaoDrawerPage(page);

    await allure.step('1. Abrir o drawer → "Tipo de extração" = "Dados" (default)', async () => {
      await extracao.goto();
      await extracao.open();
      expect(await extracao.getSelectedType()).toBe('Dados');
    });

    await allure.step('2. Grupos "Formato", "Dados (linhas)" e "Colunas"', async () => {
      const labels = await extracao.getVisibleGroupLabels();
      expect(labels.join(' | ')).toMatch(/Formato/);
      expect(labels.join(' | ')).toMatch(/Dados \(linhas\)/);
      expect(labels.join(' | ')).toMatch(/Colunas/);
      // Formato: CSV / PDF
      await expect(extracao.formatRadio('csv')).toHaveCount(1);
      await expect(extracao.formatRadio('pdf')).toHaveCount(1);
      // Linhas: Filtro atual / Todos
      await expect(extracao.rowsRadio('filtro_atual')).toHaveCount(1);
      await expect(extracao.rowsRadio('todos')).toHaveCount(1);
      // Colunas: Filtro atual / Todas (a AT diz "Todos"; UI real = "Todas")
      await expect(extracao.columnsRadio('filtro_atual')).toHaveCount(1);
      await expect(extracao.columnsRadio('todos')).toHaveCount(1);
      expect(labels.join(' | ')).toMatch(/Todas/);
    });

    await allure.step('3. Footer com "Cancelar" e "Extrair"', async () => {
      await expect(extracao.dadosCancelButton()).toBeVisible();
      await expect(extracao.dadosCancelButton()).toHaveText(/Cancelar/);
      await expect(extracao.dadosExtractButton()).toBeVisible();
      await expect(extracao.dadosExtractButton()).toHaveText(/Extrair/);
    });
  });
});
