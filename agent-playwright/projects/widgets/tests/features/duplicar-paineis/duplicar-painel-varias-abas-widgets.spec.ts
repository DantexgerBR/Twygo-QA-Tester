// spec: projects/widgets/specs/duplicar-paineis-plan.md
// seed: projects/widgets/tests/features/ativar-inativar-painel/ativar-painel-inativo.spec.ts
// Testsuite: Duplicar painéis — TC1.1

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { duplicarPainelVariasAbasWidgetsData as data } from './duplicar-painel-varias-abas-widgets.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Duplicar painéis', () => {
  let panelName: string;
  let copyName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `Painel Original TC1.1 w${testInfo.workerIndex}-${Date.now()}`;
    copyName = `${panelName} (cópia)`;

    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    try {
      const painelForm = new PainelFormPage(page);

      // Cria painel; redirect pós-save abre o form de edição (Layouts é tab).
      await painelForm.goToNew();
      await painelForm.createPanel(panelName);

      // Layouts é uma TAB no form de edição — clicar nela (URL ?tab=layouts é ignorada)
      await painelForm.getLayoutsTab().click();

      for (const tabName of data.abasExtras) {
        await painelForm.addTab(tabName);
      }

      // Aba 1 ('Nova aba') — clicar na aba para garantir foco, adicionar widget
      await page.getByText('Nova aba', { exact: true }).click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget('activity_summary');

      // Aba 2 — adicionar widget
      await page.getByText('Aba 2', { exact: true }).click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget('in_progress_contents');

      // Aba 3 — adicionar 2 widgets
      await page.getByText('Aba 3', { exact: true }).click();
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget('ranking');
      await painelForm.openWidgetDrawer();
      await painelForm.addWidget('my_certificates');

      // Salvar layout; waitForToastsToClear evita que o toast "Widget adicionado"
      // intercepte o click no botão Salvar Layout (skill testar-toast-chakra-twygo).
      // REVISAR: o auto-seed via UI ainda apresenta intermitência em persistir
      // abas/widgets antes da duplicação (teste manual em 2026-05-12 funciona;
      // automatizado falha porque trace mostra zero POST/PATCH ao backend
      // durante beforeAll exceto criação do painel). Investigação separada.
      await painelForm.waitForToastsToClear();
      await painelForm.getSaveLayoutButton().click({ force: true });
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
      await paineis.deletePanelByNameSafe(copyName);
      await paineis.deletePanelByNameSafe(panelName);
    } finally {
      await ctx.close();
    }
  });

  test('Duplicar painel próprio com várias abas e widgets', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Duplicar painéis');
    await allure.story('Duplicar painel próprio com várias abas e widgets');
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);
    const painelForm = new PainelFormPage(page);

    // XML step 1: Acessar a aba 'Painéis' em Configurações > Menu
    await allure.step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
      await expect(paineis.getRowByName(panelName)).toBeVisible();
    });

    // XML step 2: Clicar no ícone 'Duplicar' na linha do 'Painel Original'
    await allure.step("2. Clicar no ícone 'Duplicar' na linha do 'Painel Original'", async () => {
      await paineis.getRowByName(panelName).locator('[data-icon="content_copy"]').click();
      await expect(
        page.locator('.chakra-toast').filter({ hasText: 'Painel duplicado com sucesso' }).first(),
      ).toBeVisible();
      await expect(paineis.getRowByName(copyName)).toBeVisible();
    });

    // XML step 3: Verificar o novo painel na listagem.
    // REVISAR: o XML afirma "última posição" mas o comportamento real do
    // produto (validado manualmente com QA 2026-05-12) é PRIMEIRA posição —
    // ordenação por data de criação decrescente. A asserção reflete o
    // comportamento atual; XML precisa ser atualizado pelo AT.
    await allure.step('3. Verificar o novo painel na primeira posição da listagem', async () => {
      const names = await paineis.getRowNames();
      expect(names[0]).toBe(copyName);
    });

    // XML step 4: Abrir o painel '[Cópia] Painel Original' e verificar conteúdo
    await allure.step("4. Abrir o painel '[Cópia] Painel Original' e verificar abas e widgets copiados", async () => {
      await paineis.getRowByName(copyName).locator('[data-icon="edit"]').click();
      await page.waitForURL(/\/panels\/\d+\/edit/);

      // Layouts é tab no form — URL ?tab=layouts é ignorada; clicar a tab é o caminho.
      await painelForm.getLayoutsTab().click();

      // Verificar 3 abas visíveis
      await expect(page.getByText('Nova aba', { exact: true })).toBeVisible();
      await expect(page.getByText('Aba 2', { exact: true })).toBeVisible();
      await expect(page.getByText('Aba 3', { exact: true })).toBeVisible();

      // Aba 1 — widget 'Resumo de atividades'
      await page.getByText('Nova aba', { exact: true }).click();
      await expect(painelForm.getWidgetGridTitle('Resumo de atividades')).toBeVisible();

      // Aba 2 — widget 'Conteúdos em andamento'
      await page.getByText('Aba 2', { exact: true }).click();
      await expect(painelForm.getWidgetGridTitle('Conteúdos em andamento')).toBeVisible();

      // Aba 3 — 2 widgets: 'Ranking' e 'Meus certificados'
      await page.getByText('Aba 3', { exact: true }).click();
      await expect(painelForm.getGridItems()).toHaveCount(2);
    });
  });
});
