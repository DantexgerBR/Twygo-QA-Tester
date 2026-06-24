import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ExtracaoDrawerPage } from '../../../pages/ExtracaoDrawerPage.js';
import { extracaoData as data } from './extracao-dados-evidencias.shared.data.js';

test.describe(data.suiteName, () => {
  test('Validar estrutura do drawer no branch "Evidências"', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar estrutura do drawer no branch "Evidências"');
    await allure.severity('normal');

    const extracao = new ExtracaoDrawerPage(page);

    await allure.step('1. Abrir o drawer (branch Dados)', async () => {
      await extracao.goto();
      await extracao.open();
      expect(await extracao.getSelectedType()).toBe('Dados');
      // grupos do branch Dados presentes antes da troca
      await expect(extracao.formatRadio('csv')).toHaveCount(1);
    });

    await allure.step('2. Selecionar "Evidências" → grupos trocam por único "Escopo"', async () => {
      await extracao.selectType('Evidências');
      expect(await extracao.getSelectedType()).toBe('Evidências');
      // Formato/Linhas/Colunas somem
      await expect(extracao.formatRadio('csv')).toHaveCount(0);
      await expect(extracao.rowsRadio('filtro_atual')).toHaveCount(0);
      // Escopo: Filtro atual / Todos
      await expect(extracao.evidScopeRadio('filtro_atual')).toBeVisible();
      await expect(extracao.evidScopeRadio('todos')).toBeVisible();
      const labels = await extracao.getVisibleGroupLabels();
      expect(labels.join(' | ')).toMatch(/Filtro atual/);
      expect(labels.join(' | ')).toMatch(/Todos/);
    });
  });
});
