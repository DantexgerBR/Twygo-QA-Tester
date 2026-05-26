// BLOCKED-BY-PRODUCT-BUG: feedback_panel_layout_save_no_persist (memory).
// Re-verificado live 2026-05-14: click em "Salvar Layout" dispara ZERO
// POST/PATCH ao backend. Abas e widgets adicionados ficam em React state
// e somem no reload. Aluno acessa painel com apenas a aba default,
// sem widgets → asserção `toHaveCount(5)` falha vermelha.
// Quando o produto corrigir o save layout, este spec passa sem mudança.
//
// Pré-condições reproduzidas em beforeAll (todas executam, todas SEM
// efeito no backend exceto criação do painel + associação do menu):
//   1. Admin cria painel
//   2. Admin adiciona 4 abas extras → total 5 (não persistem)
//   3. Admin adiciona 1 widget em cada aba (não persistem)
//   4. Admin clica "Salvar Layout" (não dispara request)
//   5. Admin associa painel ao Modo de uso Aluno
//   6. Spec: switch Aluno → click menu item → painel renderiza com 1 aba
//      default e 0 widgets → asserção falha = signal pro dev

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { ProfileSwitcher } from '../../../../../src/pages/ProfileSwitcher.js';
import { exibirWidgetPorAbaData as data } from './exibir-widget-por-aba.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Dashboard - Visão do aluno', () => {
  let panelName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `Painel WPA w${testInfo.workerIndex}-${Date.now()}`;
    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    try {
      const painelForm = new PainelFormPage(page);
      await painelForm.goToNew();
      await painelForm.createPanel(panelName, 'Painel exibir widget por aba');

      await painelForm.getLayoutsTab().click();

      // Aba 1 já existe (Nova aba) — adiciona widget.
      await page.getByText('Nova aba', { exact: true }).click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.widgetPerTab[0]);

      // Cria 4 abas extras com 1 widget cada.
      for (let i = 0; i < data.tabsExtras.length; i++) {
        const tabName = data.tabsExtras[i]!;
        const widgetId = data.widgetPerTab[i + 1]!;
        await painelForm.addTab(tabName);
        await page.getByText(tabName, { exact: true }).click();
        await painelForm.openWidgetDrawer();
        await painelForm.addWidget(widgetId);
      }

      await painelForm.waitForToastsToClear();
      await painelForm.getSaveLayoutButton().click({ force: true });

      const paineis = new PaineisListPage(page);
      await paineis.associatePanelToMenu(panelName, data.alunoUseModeId);
    } finally {
      await ctx.close();
    }
  });

  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      await paineis.disassociatePanelFromMenu_safe(panelName, data.alunoUseModeId);
      await paineis.goToList();
      await paineis.deletePanelByNameSafe(panelName);
    } finally {
      await ctx.close();
    }
  });

  test.afterEach(async ({ page }) => {
    await new ProfileSwitcher(page).revertToAdminSafe();
  });

  test('Exibição de um widget por aba', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Dashboard - Visão do aluno');
    await allure.story('Exibição de um widget por aba');
    await allure.severity('normal');

    const switcher = new ProfileSwitcher(page);

    await step('1. Switch para perfil Aluno via popover', async () => {
      await switcher.switchToViaUrl('Aluno');
    });

    await step(`2. Clicar no item de menu "Item ${panelName}"`, async () => {
      await page.getByRole('link', { name: `Item ${panelName}` }).click();
      await page.waitForLoadState('domcontentloaded');
    });

    await step('3. Verificar painel renderiza 5 abas', async () => {
      const tabs = page.getByRole('tab');
      await expect(tabs).toHaveCount(data.expectedTabsCount);
    });
  });
});
