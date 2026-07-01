import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ProvedoresPage } from '../../../pages/ProvedoresPage.js';
import { provedoresData as data } from './provedores.shared.data.js';

// Read-only (só leitura/ordenação client-side) — sem cleanup (anti-pattern G exceção).
test.describe(data.suiteName, () => {
  test('Validar acesso à tab Provedores e estrutura da listagem', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar acesso à tab Provedores e estrutura da listagem');
    await allure.severity('critical');

    const prov = new ProvedoresPage(page);

    await allure.step('1. Acessar Registros e abrir a tab "Provedores"', async () => {
      await prov.gotoTab();
      expect(await prov.isTabActive()).toBe(true);
    });

    await allure.step('2. Verificar as colunas da tabela', async () => {
      const headers = await prov.columnHeaderTexts();
      for (const col of data.expectedColumns) {
        expect(headers, `coluna "${col}" deveria existir`).toContain(col);
      }
    });

    await allure.step('3. Toolbar: Adicionar + busca + Filtro; SEM toggle tabela/grid', async () => {
      await expect(prov.addButton()).toBeVisible();
      await expect(prov.searchInput()).toBeVisible();
      await expect(prov.filterButton()).toBeVisible();
      expect(await prov.gridToggle().count(), 'toggle grid NÃO deve existir (RN 83)').toBe(0);
    });

    await allure.step('4. Coluna Website exibe host limpo (sem https://www.)', async () => {
      const rowWithLink = prov.rows().filter({ has: page.locator('a[href^="http"]') }).first();
      if (await rowWithLink.count()) {
        const linkText = (await prov.websiteLinkInRow(rowWithLink).innerText()).trim();
        expect(linkText).not.toMatch(/^https?:\/\/www\./i);
      }
    });

    await allure.step('5. Ordenar pela coluna "Nome" (asc → inverte)', async () => {
      await prov.sortByColumn('Nome');
      const asc = await prov.rowNamesInOrder();
      await prov.sortByColumn('Nome');
      const desc = await prov.rowNamesInOrder();
      // a ordenação deve reagir ao click (a sequência muda entre os dois cliques)
      expect(asc.length).toBeGreaterThan(0);
      expect(desc).not.toEqual(asc);
    });
  });
});
