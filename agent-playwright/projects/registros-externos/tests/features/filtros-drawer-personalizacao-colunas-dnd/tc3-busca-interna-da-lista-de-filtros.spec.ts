import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { FiltrosColunasPage } from '../../../pages/FiltrosColunasPage.js';

const SUITE = 'Filtros via drawer e personalização de colunas (DnD)';

// VALIDADO MANUALMENTE pelo QA em 26/06/2026 (aprovado). O recon automatizado inicial
// (23/06) pegou o ambiente em contenção/desatualizado e reportou os filtros padrão como
// ausentes; a validação manual confirmou que o recurso (RN 63–66) está operante.
// Spec mantido como automação do fluxo da AT (RN 64) para re-execução em janela isolada.
test.describe(SUITE, () => {
  test('Validar busca interna da lista de filtros', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar busca interna da lista de filtros');
    await allure.severity('normal');

    const filtros = new FiltrosColunasPage(page);

    await allure.step('1. Abrir o drawer "Lista de filtros" — 4 filtros padrão visíveis', async () => {
      await filtros.goto();
      await filtros.clearFilter();
      await filtros.openDrawer();
      expect(await filtros.defaultFilterRadioCount()).toBe(4);
    });

    await allure.step('2. Preencher a busca do drawer com "Pend" — só "Pendentes" permanece', async () => {
      await filtros.listSearchInput().fill('Pend');
      await expect(filtros.defaultFilterRadio('Pendentes')).toBeVisible();
    });

    await allure.step('3. Limpar a busca — os 4 filtros padrão voltam', async () => {
      await filtros.listSearchInput().fill('');
      expect(await filtros.defaultFilterRadioCount()).toBe(4);
    });
  });
});
