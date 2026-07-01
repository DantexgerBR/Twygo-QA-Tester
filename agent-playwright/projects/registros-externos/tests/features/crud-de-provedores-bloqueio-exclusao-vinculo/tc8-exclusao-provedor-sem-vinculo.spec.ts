import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ProvedoresPage } from '../../../pages/ProvedoresPage.js';
import { getBaseUrl } from '../../../../../src/utils/environment.js';
import { deleteProvidersByNameSafe } from '../../../data/event-sources-api.js';
import { provedoresData as data, makeName, STORAGE_STATE } from './provedores.shared.data.js';

test.describe(data.suiteName, () => {
  let providerName: string;

  // Safety: o teste já exclui o provedor; se falhar no meio, limpa por nome.
  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE_STATE, baseURL: getBaseUrl() });
    const page = await ctx.newPage();
    try {
      if (providerName) await deleteProvidersByNameSafe(page, [providerName]);
    } finally {
      await ctx.close();
    }
  });

  test('Validar exclusão de provedor sem vínculo', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar exclusão de provedor sem vínculo');
    await allure.severity('critical');

    const prov = new ProvedoresPage(page);
    providerName = makeName('TC8', testInfo.workerIndex);

    await allure.step('Pré: criar provedor sem vínculo', async () => {
      await prov.gotoTab();
      await prov.openAddForm();
      await prov.fillProviderForm({ name: providerName });
      await prov.saveFormAndReturn();
      await prov.gotoTab();
      await prov.searchFor(providerName);
      await expect(prov.rowByName(providerName)).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('1-2. Excluir → modal destrutivo → Cancelar mantém na lista', async () => {
      await prov.clickDeleteInRow(providerName);
      const modal = prov.deleteConfirmModal();
      await expect(modal).toBeVisible({ timeout: 10_000 });
      await expect(modal).toContainText(/Tem certeza|desfeit/i);
      await modal.getByRole('button', { name: /Cancelar/i }).click();
      await expect(modal).toBeHidden({ timeout: 10_000 });
      await expect(prov.rowByName(providerName)).toBeVisible();
    });

    await allure.step('3. Excluir e confirmar → toast "Provedor excluído", some da lista', async () => {
      await prov.clickDeleteInRow(providerName);
      const modal = prov.deleteConfirmModal();
      await expect(modal).toBeVisible({ timeout: 10_000 });
      await modal.getByRole('button', { name: /^Excluir$/ }).click();
      expect(await prov.waitForToastText(/Provedor excluído/i)).toMatch(/excluído/i);
      await expect(prov.rowByName(providerName)).toHaveCount(0, { timeout: 15_000 });
    });
  });
});
