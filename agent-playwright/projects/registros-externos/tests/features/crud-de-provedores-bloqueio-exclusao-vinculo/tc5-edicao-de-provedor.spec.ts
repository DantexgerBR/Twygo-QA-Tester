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

  test('Validar edição de provedor', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar edição de provedor');
    await allure.severity('high');

    const prov = new ProvedoresPage(page);
    providerName = makeName('TC5', testInfo.workerIndex);
    const novaDescricao = 'Descrição atualizada pelo teste';

    await allure.step('Pré: criar um provedor para editar', async () => {
      await prov.gotoTab();
      await prov.openAddForm();
      await prov.fillProviderForm({ name: providerName, description: 'Descrição inicial' });
      await prov.saveFormAndReturn();
      await prov.gotoTab();
      await prov.searchFor(providerName);
      await expect(prov.rowByName(providerName)).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('1. Abrir a tela "Editar provedor" pré-populada', async () => {
      await prov.openEditByName(providerName);
      await expect(prov.nameInput()).toHaveValue(providerName);
    });

    await allure.step('2. Alterar a Descrição', async () => {
      await prov.fillProviderForm({ description: novaDescricao });
    });

    await allure.step('3. Salvar → listagem reflete a descrição atualizada', async () => {
      // toast "Provedor salvo" é transiente — a evidência robusta é a listagem
      // refletir a nova descrição.
      await prov.saveForm();
      await page.waitForURL(/tab=event-sources-tab/, { timeout: 15_000 });
      await prov.gotoTab();
      await prov.searchFor(providerName);
      await expect(prov.rowByName(providerName)).toContainText(novaDescricao, { timeout: 15_000 });
    });
  });
});
