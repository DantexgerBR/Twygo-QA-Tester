// Testsuite: Adicionar/editar aba
// TC17 — Modal de confirmação do navegador ao sair com alterações não salvas.
// Pré-condição: painel salvo + dirty state (qualquer alteração não salva).
// Captura: `page.on('dialog')` antes do reload. Quando dirty, o Chrome dispara
// `beforeunload` ao tentar navegar fora — Playwright captura como dialog.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { getOrgId } from '../../../../../src/utils/environment.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
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
        panelId = await painelForm.createPanel(`Painel TC17 ${Date.now()}`);
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
      // Cleanup: navegar fora aceita o beforeunload (handler segue dismiss-ando,
      // mas o painel órfão é tolerável — será limpo manualmente se preciso).
      // Sem deleção via UI porque o handler dismiss intercepta navegação.
      if (panelId) {
        // eslint-disable-next-line no-console -- diagnóstico
        console.warn(`[TC17 cleanup] Painel ${panelId} criado e deixado órfão. URL: /o/${getOrgId()}/panels/${panelId}/edit`);
      }
    }
  });
});
