// Testsuite: Ativar / Inativar painel
// TC2 — STATUS: READY (auto-seed via beforeAll/afterAll). Cria painel ATIVO
// no beforeAll e o INATIVA imediatamente para satisfazer pré-condição "painel
// inativo" do XML. Estado final pós-test (ativo) é arbitrário pro delete.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.use({ viewport: { width: 1920, height: 1080 } });

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Ativar / Inativar painel', () => {
  let panelName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `Painel QA Teste TC2 w${testInfo.workerIndex}-${Date.now()}`;
    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      await paineis.createPanel({ name: panelName });
      // Pré-condição do XML: painel inativo. Form de criação não expõe a
      // checkbox de forma fácil de manipular (requer click no label
      // chakra-switch e o form não é a tela do TC); preferimos navegar à
      // listagem e usar o helper já validado.
      await paineis.goToList();
      await paineis.setViewMode('lista');
      await paineis.ensureInactive(panelName);
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

  test('Ativar um painel previamente inativo', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Ativar / Inativar painel');
    await allure.story('Ativar um painel previamente inativo');
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await allure.step(
      '1. Acessar a aba "Painéis" e verificar que o painel está inativo',
      async () => {
        await paineis.goToList();
        await paineis.setViewMode('lista');
        await expect(paineis.getRowByName(panelName)).toBeVisible();
        await expect(paineis.getRowActiveSwitchByName(panelName)).not.toBeChecked();
      },
    );

    await allure.step(
      `2. Clicar no switch "Ativo" da linha "${panelName}"`,
      async () => {
        await paineis.toggleActiveByName(panelName);
        await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked();
      },
    );
  });
});
