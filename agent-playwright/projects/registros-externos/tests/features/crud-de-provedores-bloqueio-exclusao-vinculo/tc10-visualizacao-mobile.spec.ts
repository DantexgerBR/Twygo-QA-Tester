import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ProvedoresPage } from '../../../pages/ProvedoresPage.js';
import { provedoresData as data } from './provedores.shared.data.js';

// Read-only. Viewport mobile força auto-switch tabela → cards (RN 83).
test.use({ viewport: { width: 360, height: 740 } });

test.describe(data.suiteName, () => {
  test('Validar visualização mobile da tab Provedores', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar visualização mobile da tab Provedores');
    await allure.severity('normal');

    const prov = new ProvedoresPage(page);

    await allure.step('1. Acessar a tab Provedores em viewport mobile → cards', async () => {
      await prov.gotoTab();
      // auto-switch: em mobile não há <table>/<thead> visível — vira lista de cards
      // (probe 2026-06-25: 0 tabelas visíveis, 0 thead).
      await expect(page.locator('table:visible')).toHaveCount(0);
      // cada provedor vira card com ação de excluir (testid de delete persiste)
      await expect(page.locator('[data-test-id$="-delete"]').first()).toBeVisible({ timeout: 15_000 });
    });
  });
});
