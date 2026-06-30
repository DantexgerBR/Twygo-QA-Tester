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

  test('Validar criação de provedor', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar criação de provedor');
    await allure.severity('critical');

    const prov = new ProvedoresPage(page);
    providerName = makeName('TC2', testInfo.workerIndex);

    await allure.step('1. Abrir a tela "Adicionar provedor"', async () => {
      await prov.gotoTab();
      await prov.openAddForm();
      await expect(prov.nameInput()).toBeVisible();
      await expect(prov.websiteInput()).toBeVisible();
      await expect(prov.descriptionInput()).toBeVisible();
    });

    await allure.step('2-4. Preencher Nome, Website e Descrição', async () => {
      await prov.fillProviderForm({
        name: providerName,
        website: 'https://provedor-qa.example.com',
        description: 'Provedor criado por teste automatizado',
      });
    });

    await allure.step('5. Salvar → volta à listagem com o provedor criado', async () => {
      await prov.saveForm();
      await page.waitForURL(/tab=event-sources-tab/, { timeout: 15_000 });
      // recarrega a lista (o SPA às vezes volta com a área de conteúdo em branco
      // logo após o POST) e busca pelo nome (lista pagina 25/pág).
      await prov.gotoTab();
      await prov.searchFor(providerName);
      await expect(prov.rowByName(providerName)).toBeVisible({ timeout: 15_000 });
    });
  });
});
