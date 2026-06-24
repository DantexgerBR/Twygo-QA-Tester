import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ExtracaoDrawerPage } from '../../../pages/ExtracaoDrawerPage.js';
import { extracaoData as data } from './extracao-dados-evidencias.shared.data.js';

test.describe(data.suiteName, () => {
  test('Validar reset do drawer ao reabrir', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar reset do drawer ao reabrir');
    await allure.severity('minor');

    const extracao = new ExtracaoDrawerPage(page);

    await allure.step('1. Abrir, selecionar "Evidências" e fechar pelo X', async () => {
      await extracao.goto();
      await extracao.open();
      await extracao.selectType('Evidências');
      expect(await extracao.getSelectedType()).toBe('Evidências');
      await extracao.closeByX();
    });

    await allure.step('2. Reabrir → "Tipo" volta a "Dados" e radios nos defaults', async () => {
      await extracao.open();
      expect(await extracao.getSelectedType()).toBe('Dados');
      // defaults do branch Dados: CSV + Filtro atual (linhas) + Filtro atual (colunas)
      await expect(extracao.formatRadio('csv')).toBeChecked();
      await expect(extracao.rowsRadio('filtro_atual')).toBeChecked();
      await expect(extracao.columnsRadio('filtro_atual')).toBeChecked();
    });
  });
});
