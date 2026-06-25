import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ProvedoresPage } from '../../../pages/ProvedoresPage.js';
import { getBaseUrl } from '../../../../../src/utils/environment.js';
import { deleteProvidersByNameSafe } from '../../../data/event-sources-api.js';
import { provedoresData as data, STORAGE_STATE } from './provedores.shared.data.js';
import { tc4WebsiteMatrix } from './tc4-validacoes-campo-website.data.js';

// nomes criados pelo teste (qualquer cenário que tenha persistido) — para cleanup.
const createdNames: string[] = [];

test.describe(data.suiteName, () => {
  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE_STATE, baseURL: getBaseUrl() });
    const page = await ctx.newPage();
    try {
      if (createdNames.length) await deleteProvidersByNameSafe(page, createdNames);
    } finally {
      await ctx.close();
    }
  });

  test('Validações do campo "Website" do provedor', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validações do campo "Website" do provedor');
    await allure.severity('normal');

    const prov = new ProvedoresPage(page);
    await prov.gotoTab();

    for (let i = 0; i < tc4WebsiteMatrix.length; i++) {
      const row = tc4WebsiteMatrix[i];
      const nome = `Prov TC4 w${testInfo.workerIndex}-${i}-${Date.now()}`;
      await allure.step(`Website "${row.cenario}"`, async () => {
        await prov.gotoTab();
        await prov.openAddForm();
        await prov.fillProviderForm({ name: nome, website: row.input });
        await prov.trySave();
        await page.waitForTimeout(1_500);

        // aceito = navegou de volta à lista; rejeitado = permaneceu no form.
        const accepted = /tab=event-sources-tab/.test(page.url());
        if (accepted) createdNames.push(nome);

        if (row.mustAccept) {
          expect(accepted, `"${row.cenario}" deveria ser aceito`).toBe(true);
        } else {
          const stillForm = /event_sources\/new/.test(page.url());
          // consistente: aceita normalizando OU rejeita (fica no form) — nunca trava mudo.
          expect(accepted || stillForm, `"${row.cenario}" deve aceitar OU rejeitar visivelmente`).toBe(true);
        }
      });
    }
  });
});
