// Testsuite: Ativar / Inativar painel
// TC5 — STATUS: READY (auto-seed via beforeAll/afterAll). Antes deste refactor
// o spec apontava para "Painel 30" do seed estático de 2026-05-06, assumindo
// que estaria na primeira página da listagem. Quando o env staging-widgets
// acumulou painéis de outros runs (~75 itens, paginação 25/pág), Painel 30
// foi empurrado pra página 2+ e o spec quebrou. Self-seed elimina a dependência
// do estado do env — cada execução cria e destrói seu próprio painel.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.use({ viewport: { width: 1920, height: 1080 } });

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Ativar / Inativar painel', () => {
  let panelName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `Painel QA Teste TC5 w${testInfo.workerIndex}-${Date.now()}`;
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

  test('Verificar persistência do estado Ativo após reload', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Ativar / Inativar painel');
    await allure.story('Persistência do estado Ativo do painel após reload');
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);
    let estadoInicial: boolean;

    await allure.step('1. Acessar a aba "Painéis" e capturar estado inicial', async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
      await expect(paineis.getRowByName(panelName)).toBeVisible();
      estadoInicial = await paineis.getActiveStateByName(panelName);
    });

    await allure.step(
      `2. Alternar o switch "Ativo" de "${panelName}" para o estado oposto`,
      async () => {
        await paineis.toggleActiveByName(panelName);
        await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked({
          checked: !estadoInicial,
        });
      },
    );

    await allure.step(
      '3. Recarregar a página e verificar que o novo estado persiste',
      async () => {
        await page.reload();
        await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked({
          checked: !estadoInicial,
        });
      },
    );
  });
});
