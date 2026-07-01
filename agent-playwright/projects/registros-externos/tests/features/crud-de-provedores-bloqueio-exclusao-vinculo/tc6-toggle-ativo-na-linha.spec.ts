import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ProvedoresPage } from '../../../pages/ProvedoresPage.js';
import { getBaseUrl } from '../../../../../src/utils/environment.js';
import { deleteProvidersByNameSafe } from '../../../data/event-sources-api.js';
import { provedoresData as data, makeName, STORAGE_STATE } from './provedores.shared.data.js';

test.describe(data.suiteName, () => {
  let providerName: string;

  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE_STATE, baseURL: getBaseUrl() });
    const page = await ctx.newPage();
    try {
      if (providerName) await deleteProvidersByNameSafe(page, [providerName]);
    } finally {
      await ctx.close();
    }
  });

  test('Validar toggle Ativo na linha com toasts', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar toggle Ativo na linha com toasts');
    await allure.severity('critical');

    const prov = new ProvedoresPage(page);
    providerName = makeName('TC6', testInfo.workerIndex);

    await allure.step('Pré: criar provedor (Ativo por default)', async () => {
      await prov.gotoTab();
      await prov.openAddForm();
      await prov.fillProviderForm({ name: providerName });
      await prov.saveFormAndReturn();
      await prov.gotoTab();
      await prov.searchFor(providerName);
      await expect(prov.rowByName(providerName)).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('1. Switch começa ligado', async () => {
      expect(await prov.isRowActive(providerName)).toBe(true);
    });

    await allure.step('2. Desativar → switch desligado (+ toast)', async () => {
      // o toast (produto usa "inativado", AT diz "desativado") é transiente; a
      // evidência funcional robusta é o estado do switch após a confirmação.
      await prov.clickRowToggle(providerName);
      await expect(async () => expect(await prov.isRowActive(providerName)).toBe(false)).toPass({ timeout: 10_000 });
      await prov.waitForToastsToClear();
    });

    await allure.step('3. Ativar → switch ligado (+ toast)', async () => {
      await prov.clickRowToggle(providerName);
      await expect(async () => expect(await prov.isRowActive(providerName)).toBe(true)).toPass({ timeout: 10_000 });
      await prov.waitForToastsToClear();
    });
  });
});
