// spec: projects/widgets/specs/duplicar-paineis-plan.md
// seed: projects/widgets/tests/features/ativar-inativar-painel/ativar-painel-inativo.spec.ts
// Testsuite: Duplicar painéis — TC1.2
// STATUS: READY (auto-seed via beforeAll/afterAll). Cria painel ATIVO no
// beforeAll, duplica no test, e valida que a cópia nasce INATIVA enquanto
// o original permanece ATIVO. Confirmado live 2026-05-12.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { duplicarPainelAtivoStatusCopiaData as data } from './duplicar-painel-ativo-status-copia.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Duplicar painéis', () => {
  // panelName gerado worker-isolated em runtime para evitar colisão paralela.
  // data.panelName é o template; o nome real usa workerIndex + Date.now().
  let panelName: string;
  let copyName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `${data.panelNamePrefix} w${testInfo.workerIndex}-${Date.now()}`;
    copyName = `${panelName} (cópia)`;

    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      // Cria o painel — nasce ATIVO por default (form de criação tem is_active=true).
      await paineis.createPanel({ name: panelName });
      // Navega à listagem para confirmar e garantir estado ativo via helper
      // idempotente (pre-condition: painel deve estar ATIVO para o TC).
      await paineis.goToList();
      await paineis.setViewMode('lista');
      await paineis.ensureActive(panelName);
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
      // Cópia primeiro: se o teste falhou antes da duplicação, é no-op.
      await paineis.deletePanelByNameSafe(copyName);
      await paineis.deletePanelByNameSafe(panelName);
    } finally {
      await ctx.close();
    }
  });

  test('Duplicar painel ativo — status do painel duplicado', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Duplicar painéis');
    await allure.story('Duplicar painel ativo — status do painel duplicado');
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    // 1. Acessar listagem e verificar que o painel original existe e está ATIVO
    await allure.step(
      '1. Acessar a listagem de Painéis e verificar que o painel está ativo',
      async () => {
        await paineis.goToList();
        await paineis.setViewMode('lista');
        await expect(paineis.getRowByName(panelName)).toBeVisible();
        await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked();
      },
    );

    // 2. Clicar no ícone Duplicar (content_copy) da linha do painel original
    await allure.step(
      `2. Clicar no ícone 'Duplicar' da linha "${panelName}" e verificar a cópia na listagem`,
      async () => {
        await paineis.getRowByName(panelName).locator('[data-icon="content_copy"]').click();
        // Toast com confirmação da duplicação — Chakra toast desaparece rapidamente;
        // aguardamos só sua aparição inicial antes de checar a nova linha.
        await expect(
          page.locator('.chakra-toast').filter({ hasText: 'Painel duplicado com sucesso' }).first(),
        ).toBeVisible();
        await expect(paineis.getRowByName(copyName)).toBeVisible();
      },
    );

    // 3. Verificar que a cópia nasce INATIVA e o original permanece ATIVO
    await allure.step(
      '3. Verificar que o switch "Ativo?" da cópia está DESMARCADO e o do original permanece MARCADO',
      async () => {
        // Comportamento confirmado live 2026-05-12: duplicar painel ativo produz
        // cópia INATIVA — independente do status do original.
        await expect(paineis.getRowActiveSwitchByName(copyName)).not.toBeChecked();
        // Original não deve ter sido afetado pela operação de duplicação.
        await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked();
      },
    );
  });
});
