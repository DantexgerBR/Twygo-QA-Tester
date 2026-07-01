import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosAdminPage } from '../../../pages/RegistrosAdminPage.js';

const SUITE = 'KPI cards como dashboard estático (Admin/Líder)';

test.describe(SUITE, () => {
  test('Validar não-clicabilidade dos cards no Admin', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar não-clicabilidade dos cards no Admin');
    await allure.severity('critical');

    const registros = new RegistrosAdminPage(page);

    await allure.step('1. Acessar "Aprendizagem > Registros" como Admin', async () => {
      await registros.goto();
      // Cards estáticos não devem entrar em estado ativo (sem elevação) (RN 30).
      expect(await registros.isActive('pending')).toBe(false);
    });

    await allure.step('2. Hover no card "Pendentes" não eleva nem seleciona', async () => {
      await registros.card('pending').hover();
      // Apenas o tooltip pode aparecer; nenhuma elevação/seleção (RN 30).
      expect(await registros.isActive('pending')).toBe(false);
    });

    await allure.step('3. Clicar no card "Pendentes" não filtra nem seleciona', async () => {
      const counts = await registros.getCounts();
      const rowsBefore = await registros.getVisibleRecordCount();

      await registros.clickCardRaw('pending');

      // Invariante RN 30: nenhum card fica ativo, a lista não filtra e as
      // contagens não mudam após o clique.
      await expect
        .poll(async () => registros.isActive('pending'), { timeout: 4_000 })
        .toBe(false);
      expect(await registros.isActive('emitted')).toBe(false);
      expect(await registros.getVisibleRecordCount()).toBe(rowsBefore);
      expect(await registros.getCounts()).toEqual(counts);
    });
  });
});
