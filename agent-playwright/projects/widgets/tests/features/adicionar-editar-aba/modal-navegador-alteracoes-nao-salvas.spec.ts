// Testsuite: Adicionar/editar aba
// TC17 — Modal de confirmação do navegador ao sair com alterações não salvas.
// Pré-condição: painel salvo + dirty state (qualquer alteração não salva).
// Captura: `page.on('dialog')` antes do reload. Quando dirty, o Chrome dispara
// `beforeunload` ao tentar navegar fora — Playwright captura como dialog.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  let createdPanelName: string | undefined;

  // Contexto fresco — handler `beforeunload` da page do test não vaza aqui.
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, createdPanelName);
  });

  test('Modal de confirmação do navegador ao sair com alterações não salvas', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story('Modal de confirmação do navegador ao sair com alterações não salvas');
    await allure.severity('minor');
    await allure.label('executionType', 'automated');

    const painelForm = new PainelFormPage(page);
    let panelId!: number;
    let dialogCaptured: { type: string; message: string } | null = null;

    // Handler registrado antes de qualquer ação que possa disparar dialog —
    // listener captura o primeiro `beforeunload`. Dismiss() cancela a navegação
    // mantendo o usuário na página (comportamento esperado quando ele clica
    // "Cancelar" no prompt do navegador).
    page.on('dialog', async (dialog) => {
      if (!dialogCaptured) {
        dialogCaptured = { type: dialog.type(), message: dialog.message() };
      }
      await dialog.dismiss().catch(() => {});
    });

    try {
      await allure.step('Pré-condição: criar painel salvo', async () => {
        await painelForm.goToNew();
        createdPanelName = `Painel TC17 ${Date.now()}`;
        panelId = await painelForm.createPanel(createdPanelName);
      });

      await allure.step('Pré-condição: ir para Layouts e criar dirty state (renomear "Nova aba" sem salvar layout)', async () => {
        await painelForm.goToEdit(panelId);
        // `?tab=layouts` na URL não abre a tab — exploração live confirmou
        // que o tab Layouts só renderiza após click. Mantemos via tab click
        // até existir route guard que respeite query params.
        await painelForm.getLayoutsTab().click();
        await painelForm.getAddTabButton().waitFor({ timeout: 15_000 });
        await painelForm.openRenameModal('Nova aba');
        await painelForm.getRenameModalInput().fill('Aba A renomeada (dirty)');
        await painelForm.getRenameModalSubmit().click();
        // Não clicar em "Salvar Layout" — assim o estado fica dirty no
        // client-side e o navegador instala o listener beforeunload.
      });

      await allure.step('1. Tentar recarregar a página com alterações não salvas', async () => {
        // page.reload() em estado dirty dispara beforeunload; o handler
        // registrado captura via dialog event. reload() resolverá com timeout
        // OU navega após dismiss — em ambos os casos, o que importa é o
        // dialog ter sido capturado.
        await page.reload({ timeout: 5_000 }).catch(() => {
          // Timeout esperado se o dismiss cancelar a navegação.
        });
      });

      await allure.step('2. Verificar que o navegador exibiu o prompt de confirmação', async () => {
        // Aguarda dialog ser registrado (o handler é async).
        await expect
          .poll(() => dialogCaptured?.type ?? null, {
            timeout: 5_000,
            message: 'aguardando beforeunload do navegador',
          })
          .toBe('beforeunload');
      });
    } finally {
      // Cleanup pós-test acontece no test.afterAll — contexto fresco não
      // herda o handler `beforeunload` instalado nesta page, então a
      // remoção via UI funciona normalmente.
      void panelId;
    }
  });
});
