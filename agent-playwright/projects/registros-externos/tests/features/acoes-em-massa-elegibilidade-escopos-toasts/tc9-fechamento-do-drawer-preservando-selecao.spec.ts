import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AcoesEmMassaPage } from '../../../pages/AcoesEmMassaPage.js';
import { acoesEmMassaData as data } from './acoes-em-massa.shared.data.js';

const SUITE = data.suiteName;

// Sem cleanup: somente leitura (marca checkboxes em memória, fecha sem aplicar).
test.describe(SUITE, () => {
  test('Validar fechamento do drawer preservando a seleção', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar fechamento do drawer preservando a seleção');
    await allure.severity('medium');

    const massa = new AcoesEmMassaPage(page);
    const n = data.fecharPreservaSelecao;

    await allure.step(`1. Marcar ${n} linhas`, async () => {
      await massa.goto();
      const rows = massa.allRows();
      const pick = Math.min(n, await rows.count());
      for (let i = 0; i < pick; i++) await massa.selectRow(rows.nth(i));
      expect(await massa.countCheckedRows()).toBe(n);
    });

    await allure.step('2-3. Abrir o drawer e fechar pelo X', async () => {
      await massa.openDrawer();
      await massa.closeDrawerX();
    });

    await allure.step(`As ${n} linhas permanecem selecionadas`, async () => {
      expect(await massa.countCheckedRows()).toBe(n);
    });
  });
});
