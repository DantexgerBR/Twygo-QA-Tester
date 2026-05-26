// spec: projects/widgets/specs/duplicar-paineis-plan.md
// seed: projects/widgets/tests/features/ativar-inativar-painel/ativar-painel-inativo.spec.ts
// Testsuite: Duplicar painéis — TC1.3
// STATUS: READY (auto-seed via beforeAll/afterAll). Cria painel no beforeAll,
// duplica duas vezes e valida que os três painéis coexistem na listagem com
// nomes concatenados por ' (cópia)'. Confirmado live 2026-05-12.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { duplicarPainelVariasVezesData as data } from './duplicar-painel-varias-vezes.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Duplicar painéis', () => {
  // Nomes gerados worker-isolated em runtime para evitar colisão em runs paralelas.
  let panelName: string;
  let copyName: string;
  let copy2Name: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `${data.panelNamePrefix} w${testInfo.workerIndex}-${Date.now()}`;
    copyName = `${panelName} (cópia)`;
    copy2Name = `${copyName} (cópia)`;

    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      // Cria o painel original que servirá de base para as duas duplicações.
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
      // Ordem de exclusão: cópia 2 → cópia 1 → original (mais recentes primeiro).
      // Se qualquer um não existir (falha antes da criação), deletePanelByNameSafe é no-op.
      await paineis.deletePanelByNameSafe(copy2Name);
      await paineis.deletePanelByNameSafe(copyName);
      await paineis.deletePanelByNameSafe(panelName);
    } finally {
      await ctx.close();
    }
  });

  test('Duplicar painel várias vezes', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Duplicar painéis');
    await allure.story('Duplicar painel várias vezes');
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    // 1. Acessar listagem e verificar que o painel original está visível
    await allure.step(
      '1. Acessar a listagem de Painéis e verificar que o painel original está presente',
      async () => {
        await paineis.goToList();
        await paineis.setViewMode('lista');
        await expect(paineis.getRowByName(panelName)).toBeVisible();
      },
    );

    // 2. Primeira duplicação: clicar no ícone Duplicar do painel original
    await allure.step(
      `2. Clicar no ícone 'Duplicar' da linha "${panelName}" — primeira duplicação`,
      async () => {
        await paineis.getRowByName(panelName).locator('[data-icon="content_copy"]').click();
        // Toast com confirmação — Chakra toast desaparece rapidamente;
        // aguardamos só sua aparição inicial antes de checar a nova linha.
        await expect(
          page.locator('.chakra-toast').filter({ hasText: 'Painel duplicado com sucesso' }).first(),
        ).toBeVisible();
        await expect(paineis.getRowByName(copyName)).toBeVisible();
      },
    );

    // 3. Segunda duplicação: clicar no ícone Duplicar da primeira cópia
    await allure.step(
      `3. Clicar no ícone 'Duplicar' da linha "${copyName}" — segunda duplicação — e verificar coexistência dos três painéis`,
      async () => {
        await paineis.getRowByName(copyName).locator('[data-icon="content_copy"]').click();
        // Padrão de nomenclatura confirmado live 2026-05-12: ' (cópia)' é
        // concatenado a cada duplicação sem numeração sequencial (não gera '(2)').
        await expect(
          page.locator('.chakra-toast').filter({ hasText: 'Painel duplicado com sucesso' }).first(),
        ).toBeVisible();
        await expect(paineis.getRowByName(copy2Name)).toBeVisible();
        // Os três painéis devem coexistir na listagem com nomes únicos.
        await expect(paineis.getRowByName(panelName)).toBeVisible();
        await expect(paineis.getRowByName(copyName)).toBeVisible();
        await expect(paineis.getRowByName(copy2Name)).toBeVisible();
      },
    );
  });
});
