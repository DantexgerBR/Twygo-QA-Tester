// spec: projects/widgets/specs/duplicar-paineis-plan.md
// seed: projects/widgets/tests/features/ativar-inativar-painel/inativar-painel-nao-associado.spec.ts
// Testsuite: Duplicar painéis — TC1.6
// STATUS: READY (auto-seed via beforeAll/afterAll). Cria painel no beforeAll,
// duplica imediatamente, e valida o ciclo ativar → inativar no painel duplicado.
// NOTA: a UI NÃO possui ícone 'Inativar' separado (confirmado live 2026-05-12);
// o controle é o switch "Ativo?" da coluna — mapeado em PaineisListPage.
// Painel duplicado nasce INATIVO — este TC valida que é possível ativá-lo e
// depois inativá-lo sem modal de bloqueio (não está associado a menus).

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { inativarPainelDuplicadoData as data } from './inativar-painel-duplicado.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Duplicar painéis', () => {
  // panelName e copyName gerados em runtime: worker-isolated para evitar
  // colisão entre runs paralelos. data.panelNamePrefix é o template estável.
  let panelName: string;
  let copyName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `${data.panelNamePrefix} w${testInfo.workerIndex}-${Date.now()}`;
    copyName = `${panelName} (cópia)`;

    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      // Cria o painel original
      await paineis.createPanel({ name: panelName });
      // Navega à listagem e duplica
      await paineis.goToList();
      await paineis.setViewMode('lista');
      await paineis.getRowByName(panelName).locator('[data-icon="content_copy"]').click();
      // Toast confirma duplicação; .first() por estabilidade (OBSERVAÇÃO de estabilidade do plano)
      await expect(
        page.locator('.chakra-toast').filter({ hasText: 'Painel duplicado com sucesso' }).first(),
      ).toBeVisible();
      // Confirma que a cópia apareceu na listagem
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
      // Cópia primeiro; se o teste falhou antes da duplicação, é no-op
      await paineis.deletePanelByNameSafe(copyName);
      await paineis.deletePanelByNameSafe(panelName);
    } finally {
      await ctx.close();
    }
  });

  test('Inativar painel duplicado', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Duplicar painéis');
    await allure.story('Inativar painel duplicado');
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    // 1. Acessar listagem e verificar que ambos os painéis existem; cópia nasce inativa
    await allure.step(
      '1. Acessar a listagem de Painéis, verificar original e cópia visíveis, e confirmar que cópia está INATIVA',
      async () => {
        await paineis.goToList();
        await paineis.setViewMode('lista');
        await expect(paineis.getRowByName(panelName)).toBeVisible();
        await expect(paineis.getRowByName(copyName)).toBeVisible();
        // Painel duplicado nasce INATIVO — confirmado live 2026-05-12
        await expect(paineis.getRowActiveSwitchByName(copyName)).not.toBeChecked();
      },
    );

    // 2. Ativar o painel duplicado via switch
    await allure.step(
      `2. Ativar o painel duplicado "${copyName}" clicando no switch "Ativo?"`,
      async () => {
        await paineis.toggleActiveByName(copyName);
        await expect(paineis.getRowActiveSwitchByName(copyName)).toBeChecked();
      },
    );

    // 3. Inativar o painel duplicado via switch; não deve abrir modal de bloqueio
    await allure.step(
      `3. Inativar o painel duplicado "${copyName}" clicando novamente no switch "Ativo?" — sem modal de bloqueio`,
      async () => {
        await paineis.toggleActiveByName(copyName);
        await expect(paineis.getRowActiveSwitchByName(copyName)).not.toBeChecked();
        // Painel duplicado não está associado a menus — modal "Painel em uso" NÃO deve aparecer
        await expect(paineis.getInactivationBlockedModal()).not.toBeVisible();
      },
    );
  });
});
