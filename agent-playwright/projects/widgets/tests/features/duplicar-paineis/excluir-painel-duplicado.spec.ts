// spec: projects/widgets/specs/duplicar-paineis-plan.md
// seed: projects/widgets/tests/features/ativar-inativar-painel/ativar-painel-inativo.spec.ts
// Testsuite: Duplicar painéis — TC1.5
// STATUS: READY (auto-seed via beforeAll/afterAll). Cria painel original no
// beforeAll, duplica imediatamente, confirma existência da cópia. O teste
// valida que a exclusão da cópia remove apenas ela (original permanece intacto).

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { excluirPainelDuplicadoData as data } from './excluir-painel-duplicado.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Duplicar painéis', () => {
  // panelName gerado worker-isolated em runtime para evitar colisão paralela.
  // copyName derivada de panelName (padrão live 2026-05-12: sufixo " (cópia)").
  let panelName: string;
  let copyName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `${data.panelNamePrefix} w${testInfo.workerIndex}-${Date.now()}`;
    copyName = `${panelName} (cópia)`;

    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      // Cria o painel original — nasce ATIVO por default.
      await paineis.createPanel({ name: panelName });
      // Navega à listagem em modo Lista para acessar o ícone de duplicação.
      await paineis.goToList();
      await paineis.setViewMode('lista');
      // Duplica clicando no ícone content_copy da linha do painel original.
      await paineis.getRowByName(panelName).locator('[data-icon="content_copy"]').click();
      // Toast confirma duplicação — .first() evita resolver múltiplos toasts
      // de runs anteriores (observação de estabilidade do TC4 generator anterior).
      await expect(
        page.locator('.chakra-toast').filter({ hasText: 'Painel duplicado com sucesso' }).first(),
      ).toBeVisible();
      // Pré-condição: cópia deve estar visível na listagem antes do teste.
      await expect(paineis.getRowByName(copyName)).toBeVisible();
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
      // copyName já foi excluída no teste — deletePanelByNameSafe é no-op se não existir.
      await paineis.deletePanelByNameSafe(copyName);
      await paineis.deletePanelByNameSafe(panelName);
    } finally {
      await ctx.close();
    }
  });

  test('Excluir painel duplicado', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Duplicar painéis');
    await allure.story('Excluir painel duplicado');
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    // 1. Acessar listagem e verificar que original e cópia estão presentes
    await allure.step(
      '1. Acessar a listagem de Painéis e verificar que painel original e cópia estão visíveis',
      async () => {
        await paineis.goToList();
        await paineis.setViewMode('lista');
        await expect(paineis.getRowByName(panelName)).toBeVisible();
        await expect(paineis.getRowByName(copyName)).toBeVisible();
      },
    );

    // 2. Clicar no ícone Excluir (delete) da linha da cópia
    await allure.step(
      `2. Clicar no ícone 'Excluir' da linha "${copyName}" e verificar modal de confirmação`,
      async () => {
        await paineis.getRowByName(copyName).locator('[data-icon="delete"]').click();
        await expect(paineis.getDeleteConfirmModal()).toBeVisible();
      },
    );

    // 3. Confirmar exclusão e verificar que a cópia foi removida e o original permanece
    await allure.step(
      '3. Confirmar exclusão: modal fecha, cópia desaparece e painel original permanece visível',
      async () => {
        await paineis.getDeleteConfirmButton().click();
        // Modal fecha após confirmação.
        await expect(paineis.getDeleteConfirmModal()).not.toBeVisible();
        // Cópia não deve mais existir na listagem.
        await expect(paineis.getRowByName(copyName)).toHaveCount(0);
        // Original permanece inalterado — exclusão da cópia não afeta o painel pai.
        await expect(paineis.getRowByName(panelName)).toBeVisible();
      },
    );
  });
});
