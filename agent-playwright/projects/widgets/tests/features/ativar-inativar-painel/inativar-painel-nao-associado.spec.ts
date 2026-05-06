// Testsuite: Ativar / Inativar painel
// TC1 — STATUS: READY (auto-seed via beforeAll/afterAll). Cada spec cria seu
// próprio painel via UI e deleta no final, sem depender de seed externo.
// Comportamento validado live em 2026-05-06: click no label do switch da
// coluna "Ativo?" alterna estado imediatamente para painéis sem associação;
// reload preserva o novo estado.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.use({ viewport: { width: 1920, height: 1080 } });

// storageState global é gravado em outputs/.auth/storage.json pelo
// global-setup. beforeAll/afterAll abrem context próprio (fora do `page`
// fixture do test) e precisam de path absoluto resolvido a partir do cwd.
const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Ativar / Inativar painel', () => {
  let panelName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    // Worker index + timestamp evitam colisão entre workers paralelos e
    // entre runs sequenciais que falhem antes do cleanup.
    panelName = `Painel QA Teste TC1 w${testInfo.workerIndex}-${Date.now()}`;
    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      await paineis.createPanel({ name: panelName });
    } finally {
      await ctx.close();
    }
  });

  test.afterAll(async ({ browser }) => {
    // Cleanup robusto: se o beforeAll falhou antes de criar, deletePanelByNameSafe
    // é no-op em vez de mascarar a falha original.
    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      await paineis.goToList();
      await paineis.deletePanelByNameSafe(panelName);
    } finally {
      await ctx.close();
    }
  });

  test('Inativar um painel não associado a nenhum modo de uso', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Ativar / Inativar painel');
    await allure.story('Inativar um painel não associado a nenhum modo de uso');
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await allure.step('1. Acessar a aba "Painéis" no Menu', async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
      await expect(paineis.getRowByName(panelName)).toBeVisible();
      await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked();
    });

    await allure.step(
      `2. Clicar no switch "Ativo" da linha "${panelName}"`,
      async () => {
        await paineis.toggleActiveByName(panelName);
        await expect(paineis.getRowActiveSwitchByName(panelName)).not.toBeChecked();
      },
    );

    await allure.step(
      '3. Recarregar a página e verificar que o estado inativo persiste',
      async () => {
        await page.reload();
        await expect(paineis.getRowActiveSwitchByName(panelName)).not.toBeChecked();
      },
    );
  });
});
