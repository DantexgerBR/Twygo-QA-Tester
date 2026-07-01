import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ProvedoresPage } from '../../../pages/ProvedoresPage.js';
import { provedoresData as data } from './provedores.shared.data.js';

const PROVIDER = data.linkedProvider; // "Alura" — tem registros vinculados

// Read-only: a exclusão é BLOQUEADA pelo servidor (422 blocked_by_records),
// então "Alura" nunca é removida → sem cleanup. Confirmado em probe 2026-06-25.
test.describe(data.suiteName, () => {
  test('Validar bloqueio de exclusão de provedor com vínculo', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar bloqueio de exclusão de provedor com vínculo');
    await allure.severity('critical');

    const prov = new ProvedoresPage(page);
    await prov.gotoTab();
    await prov.searchFor(PROVIDER);

    await allure.step('1. Excluir provedor COM vínculo → confirmar Excluir', async () => {
      await prov.clickDeleteInRow(PROVIDER);
      const modal = prov.deleteConfirmModal();
      await expect(modal).toBeVisible({ timeout: 10_000 });
      // O bloqueio é server-side (422) e só aparece DEPOIS de confirmar Excluir.
      await modal.getByRole('button', { name: /^Excluir$/ }).click();
    });

    await allure.step('2. UI exibe bloqueio "não pode ser excluído / registros vinculados"', async () => {
      await expect(prov.blockMessage()).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('3. Provedor permanece na listagem (não foi excluído)', async () => {
      await page.getByRole('button', { name: /Entendi|Fechar|^OK$/i }).first().click().catch(() => undefined);
      await prov.gotoTab();
      await prov.searchFor(PROVIDER);
      await expect(prov.rowByName(PROVIDER)).toBeVisible({ timeout: 15_000 });
    });
  });
});
