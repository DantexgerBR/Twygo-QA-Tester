import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ProvedoresPage } from '../../../pages/ProvedoresPage.js';
import { getBaseUrl } from '../../../../../src/utils/environment.js';
import { provedoresData as data, STORAGE_STATE } from './provedores.shared.data.js';

const PROVIDER = data.linkedProvider; // "Alura" — provedor com registros vinculados

test.describe(data.suiteName, () => {
  // Cleanup: garantir que o provedor compartilhado volte a ATIVO (toggle reversível).
  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE_STATE, baseURL: getBaseUrl() });
    const page = await ctx.newPage();
    try {
      const prov = new ProvedoresPage(page);
      await prov.gotoTab();
      await prov.searchFor(PROVIDER);
      await prov.setRowActive(PROVIDER, true);
    } finally {
      await ctx.close();
    }
  });

  test('Validar efeito do provedor inativo nos dropdowns e registros existentes', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar efeito do provedor inativo nos dropdowns e registros existentes');
    await allure.severity('critical');

    const prov = new ProvedoresPage(page);

    await allure.step(`1. Desativar o provedor vinculado "${PROVIDER}"`, async () => {
      await prov.gotoTab();
      await prov.searchFor(PROVIDER);
      await prov.setRowActive(PROVIDER, true); // parte de estado conhecido (ativo)
      await prov.clickRowToggle(PROVIDER);
      await expect(async () => expect(await prov.isRowActive(PROVIDER)).toBe(false)).toPass({ timeout: 10_000 });
      await prov.waitForToastsToClear();
    });

    await allure.step('2. Dropdown "Provedor" do novo registro NÃO lista o desativado', async () => {
      const present = await prov.recordFormProviderHasOption(PROVIDER);
      expect(present, `"${PROVIDER}" inativo não deve aparecer no dropdown`).toBe(false);
    });

    await allure.step('3. Registros existentes continuam exibindo o provedor', async () => {
      await prov.gotoTab();
      await prov.tabRegistros().click();
      await expect(page.locator('table').first()).toContainText(PROVIDER, { timeout: 15_000 });
    });

    await allure.step('4. Reativar o provedor (restauração)', async () => {
      await prov.gotoTab();
      await prov.searchFor(PROVIDER);
      await prov.clickRowToggle(PROVIDER);
      await expect(async () => expect(await prov.isRowActive(PROVIDER)).toBe(true)).toPass({ timeout: 10_000 });
    });
  });
});
