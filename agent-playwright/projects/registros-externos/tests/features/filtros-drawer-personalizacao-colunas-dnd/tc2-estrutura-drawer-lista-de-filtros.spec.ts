import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { FiltrosColunasPage } from '../../../pages/FiltrosColunasPage.js';
import { filtrosDrawerData as data } from './filtros-drawer.shared.data.js';

const SUITE = 'Filtros via drawer e personalização de colunas (DnD)';

// RN 64 — estrutura do drawer "Lista de filtros".
// A AT espera 4 radios padrão + ícone info + duplicar + toast "Em breve", e
// copy "Em breve — ..." nos grupos compartilhados/meus. No build atual os 3
// grupos exibem "Não há filtros nessa seção." e não há radios/duplicar.
// Validamos a ESTRUTURA real (header, busca, Novo, 3 grupos colapsáveis, footer)
// e documentamos as divergências (assert do empty state real).
test.describe(SUITE, () => {
  test('Validar estrutura do drawer "Lista de filtros"', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar estrutura do drawer "Lista de filtros"');
    await allure.severity('critical');

    const filtros = new FiltrosColunasPage(page);

    test.info().annotations.push({
      type: 'divergência',
      description:
        'AT esperava 4 filtros padrão (radio) + ícone info + duplicar + toast "Em breve" e copy ' +
        '"Em breve — ..." nos grupos. Build exibe "Não há filtros nessa seção." nos 3 grupos e ' +
        'não tem radios/duplicar. Destinatário: AT / QA Lead.',
    });

    await allure.step('1. Abrir drawer — header, busca e botão "Novo"', async () => {
      await filtros.goto();
      await filtros.clearFilter();
      await filtros.openDrawer();
      await expect(filtros.listTitle()).toHaveText(/Lista de filtros/i);
      await expect(filtros.listSearchInput()).toBeVisible();
      await expect(filtros.newButton()).toBeVisible();
    });

    await allure.step('2. Grupo "Filtros padrão" — divergência: vazio neste build', async () => {
      await expect(filtros.defaultFiltersGroup()).toBeVisible();
      expect(await filtros.defaultFilterRadioCount()).toBe(0); // AT esperava 4 radios
      expect(await filtros.groupText('default')).toContain(data.emptyGroupText);
    });

    await allure.step('3. Grupo "Filtros compartilhados" expande com empty state', async () => {
      await filtros.sharedFiltersGroup().click();
      expect(await filtros.groupText('shared')).toContain(data.emptyGroupText);
    });

    await allure.step('4. Grupo "Meus filtros" expande com empty state', async () => {
      await filtros.myFiltersGroup().click();
      expect(await filtros.groupText('my')).toContain(data.emptyGroupText);
    });

    await allure.step('5. Footer com "Cancelar" e "Aplicar"', async () => {
      await expect(filtros.listCancelButton()).toBeVisible();
      await expect(filtros.listApplyButton()).toBeVisible();
    });
  });
});
