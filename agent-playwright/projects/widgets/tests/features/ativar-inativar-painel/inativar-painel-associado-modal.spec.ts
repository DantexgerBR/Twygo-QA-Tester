// Testsuite: Ativar / Inativar painel
// TC3 — STATUS: READY (auto-seed via beforeAll/afterAll). Após deploy de
// 2026-05-06 que adicionou opção "Painéis do usuário" (value=user_panels)
// no `<select id="page_model">` do form de item de menu, a UI de associação
// painel↔menu ficou viável. O `beforeAll` cria painel próprio + associa em
// dois menus (Colaborador / Aluno); o test valida o modal "Painel em uso";
// o `afterAll` desassocia + deleta painel.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.use({ viewport: { width: 1920, height: 1080 } });

// storageState global é gravado em outputs/.auth/storage.json pelo
// global-setup. beforeAll/afterAll abrem context próprio (fora do `page`
// fixture do test) e precisam de path absoluto resolvido a partir do cwd.
const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

// REVISAR: ids hardcoded — 70077 (Colaborador), 70078 (Aluno) são fixos da
// org 36988 (staging). Mover para `project.config.json` quando outras suítes
// também precisarem desse seed semântico.
const MENU_IDS_TO_ASSOCIATE = [70077, 70078] as const;

test.describe('Ativar / Inativar painel', () => {
  let panelName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `Painel Vinculado TC3 w${testInfo.workerIndex}-${Date.now()}`;
    const ctx = await browser.newContext({
      storageState: STORAGE_STATE,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      await paineis.createPanel({ name: panelName });
      for (const useModeId of MENU_IDS_TO_ASSOCIATE) {
        await paineis.associatePanelToMenu(panelName, useModeId);
      }
    } finally {
      await ctx.close();
    }
  });

  test.afterAll(async ({ browser }) => {
    // Cleanup robusto: cada step usa variant `_safe` que vira no-op se o
    // item/painel não existir, em vez de mascarar a falha original.
    // ORDEM IMPORTA: desassociar PRIMEIRO; deletePanelByName trava no
    // modal "Painel em uso" enquanto algum menu estiver vinculado.
    const ctx = await browser.newContext({
      storageState: STORAGE_STATE,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      for (const useModeId of MENU_IDS_TO_ASSOCIATE) {
        await paineis.disassociatePanelFromMenu_safe(panelName, useModeId);
      }
      await paineis.goToList();
      await paineis.deletePanelByNameSafe(panelName);
    } finally {
      await ctx.close();
    }
  });

  test('Tentar inativar painel associado a modos de uso exibe modal de bloqueio', async ({
    page,
  }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Ativar / Inativar painel');
    await allure.story(
      'Tentar inativar painel associado a modos de uso exibe modal de bloqueio',
    );
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await allure.step(
      '1. Acessar a aba "Painéis" com o painel vinculado ativo',
      async () => {
        await paineis.goToList();
        await paineis.setViewMode('lista');
        await expect(paineis.getRowByName(panelName)).toBeVisible();
        await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked();
      },
    );

    await allure.step(
      `2. Clicar no switch "Ativo" da linha "${panelName}" e verificar modal "Painel em uso"`,
      async () => {
        // Click direto no label — toggleActiveByName aguardaria toggle OU modal,
        // aqui queremos garantir que o modal apareça (não o toggle).
        await paineis.getRowActiveSwitchLabelByName(panelName).click();
        await expect(paineis.getInactivationBlockedModal()).toBeVisible();
        await expect(paineis.getInactivationBlockedModalTitle()).toContainText(
          'Painel em uso',
        );
        // O body lista cada menu vinculado — asserimos que ambos os useModes
        // que associamos no beforeAll aparecem por nome.
        await expect(paineis.getInactivationBlockedModalBody()).toContainText(
          'Colaborador',
        );
        await expect(paineis.getInactivationBlockedModalBody()).toContainText(
          'Aluno',
        );
      },
    );

    await allure.step(
      '3. Fechar o modal ("Entendi") e verificar que o switch permanece ativo',
      async () => {
        await paineis.closeInactivationBlockedModal();
        await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked();
      },
    );
  });
});
