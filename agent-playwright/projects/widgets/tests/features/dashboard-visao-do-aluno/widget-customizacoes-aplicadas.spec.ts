// BLOCKED-BY-PRODUCT-BUG: feedback_panel_layout_save_no_persist (memory).
// Re-verificado live 2026-05-14 via chrome-devtools: click em "Salvar
// Layout" dispara ZERO POST/PATCH ao backend (`/api/v1/o/{org}/panels/{id}`).
// Widget customizado fica em React state e some no reload. Aluno acessa
// painel vazio → asserção do título customizado falha vermelha.
// Quando o produto corrigir o save layout, este spec passa sem mudança.
//
// Pré-condições reproduzidas em beforeAll (todas executam, todas SEM efeito
// no backend exceto criação do painel + associação do menu):
//   1. Admin cria painel
//   2. Admin adiciona widget 'Resumo de atividades' (não persiste)
//   3. Admin customiza título → 'Meu Resumo' + ícone → 'star' (não persiste)
//   4. Admin clica "Salvar Layout" (não dispara request)
//   5. Admin associa painel ao Modo de uso Aluno (esse SIM persiste, gera
//      menu item)
//   6. Spec: switch para Aluno → clica menu item → painel renderiza VAZIO
//      → asserção `Meu Resumo` falha = signal pro dev

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { ProfileSwitcher } from '../../../../../src/pages/ProfileSwitcher.js';
import { widgetCustomizacoesAplicadasData as data } from './widget-customizacoes-aplicadas.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Dashboard - Visão do aluno', () => {
  let panelName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `Painel WC w${testInfo.workerIndex}-${Date.now()}`;
    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    try {
      const painelForm = new PainelFormPage(page);
      await painelForm.goToNew();
      await painelForm.createPanel(panelName, 'Painel widget customizações');

      await painelForm.getLayoutsTab().click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget('activity_summary');
      await painelForm.customizeWidget('Resumo de atividades', {
        newTitle: data.customTitle,
        iconName: data.customIconName,
      });

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

  test('Renderização de widget configurado com título e ícone customizados', async ({
    page,
    step,
  }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Dashboard - Visão do aluno');
    await allure.story('Renderização de widget configurado com título e ícone customizados');
    await allure.severity('normal');

    const switcher = new ProfileSwitcher(page);

    await step('1. Switch para perfil Aluno via popover', async () => {
      await switcher.switchToViaUrl('Aluno');
    });

    await step(`2. Clicar no item de menu "Item ${panelName}"`, async () => {
      await page.getByRole('link', { name: `Item ${panelName}` }).click();
      await page.waitForLoadState('domcontentloaded');
    });

    await step("3. Verificar widget exibe título customizado 'Meu Resumo'", async () => {
      await expect(page.getByRole('heading', { name: data.customTitle })).toBeVisible();
    });
  });
});
