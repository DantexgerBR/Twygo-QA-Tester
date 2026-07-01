import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { FiltrosColunasPage } from '../../../pages/FiltrosColunasPage.js';

const SUITE = 'Filtros via drawer e personalização de colunas (DnD)';

// VALIDADO MANUALMENTE pelo QA em 26/06/2026 (aprovado). Confirma o comportamento de
// pending da RN 65 (aplicar/cancelar/ressincronizar) com os radios de filtro padrão.
// O recon automatizado inicial (23/06) pegou env contido; recurso operante.
test.describe(SUITE, () => {
  test('Validar comportamento de pending (aplicar, cancelar, ressincronizar)', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar comportamento de pending (aplicar, cancelar, ressincronizar)');
    await allure.severity('critical');

    const filtros = new FiltrosColunasPage(page);

    await allure.step('1. Abrir o drawer e selecionar o radio "Pendentes" (pending)', async () => {
      await filtros.goto();
      await filtros.clearFilter();
      await filtros.openDrawer();
      await filtros.selectDefaultFilter('Pendentes');
    });

    await allure.step('2. Fechar (X) descarta o pending — lista não filtra', async () => {
      await filtros.listCloseButton().click();
      expect(await filtros.isFilterApplied()).toBe(false);
    });

    await allure.step('3. Reabrir o drawer — nenhum radio selecionado (ressincronizou vazio)', async () => {
      await filtros.openDrawer();
      const selected = page.locator('[role="radiogroup"] [role="radio"][aria-checked="true"], [role="radiogroup"] input[type="radio"]:checked');
      expect(await selected.count()).toBe(0);
    });

    await allure.step('4. Aplicar "Pendentes" — lista filtra por Pendentes', async () => {
      await filtros.applyDefaultFilter('Pendentes');
      await expect(filtros.clearFilterButton()).toBeVisible();
      await filtros.clearFilter(); // baseline limpa para o próximo cenário
    });
  });
});
