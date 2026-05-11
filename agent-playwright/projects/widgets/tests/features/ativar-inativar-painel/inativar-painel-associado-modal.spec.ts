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
import { inativarPainelAssociadoModalData as data } from './inativar-painel-associado-modal.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

// storageState global é gravado em outputs/.auth/storage.json pelo
// global-setup. beforeAll/afterAll abrem context próprio (fora do `page`
// fixture do test) e precisam de path absoluto resolvido a partir do cwd.
const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

// BLOCKED-BY-PRODUCT-BUG: bug no servidor twyg-app em
// `app/models/use_mode_item.rb#title_for` (commit 6461dbf499, 06/05/2026):
//
//   def title_for(locale)
//     use_mode_item_translations.blank? ?
//       I18n.t("menu.#{self.title}") :
//       use_mode_item_translations.find { |t| t.locale == locale }.title
//   end
//
// Quando o item tem translations mas nenhuma com locale 'pt-BR', `find`
// retorna nil e `nil.title` lança NoMethodError. Itens criados via POST
// /api/v1/o/{org}/use_modes/{id}/use_mode_itens (que `associatePanelToMenu`
// faz no beforeAll) caem nesse caso: o GET subsequente em
// /api/v1/o/{org}/panels/{id}/linked_menus retorna 500 em ~21ms Rails runtime
// (confirmado via trace 2026-05-11: x-runtime: 0.021308).
//
// Sintoma: ao clicar no switch "Ativo?" do painel já associado, a UI chama
// /linked_menus → 500 → trata como "sem menus vinculados" → inativa direto
// sem mostrar o modal "Painel em uso".
//
// Cobertura confirmada via traces — o agente faz a parte dele certo:
//   POST /panels                                       → 201
//   POST /use_modes/70077/use_mode_itens               → 201
//   PATCH /use_modes/70077/use_mode_itens/bulk_update  → 200
//   POST /use_modes/70078/use_mode_itens               → 201
//   PATCH /use_modes/70078/use_mode_itens/bulk_update  → 200
//   GET  /panels/{id}/linked_menus                     → 500  ← BUG produto
//
// Usamos `test.describe.fixme` (não `test.fixme` inline) pra pular também o
// beforeAll/afterAll — caso contrário a cada run o agente criaria+associaria
// o painel só pra abortar antes do body, poluindo o tenant à toa.
//
// Reabrir (trocar `.fixme` por `()`) quando o bug for corrigido upstream
// (sugestão: `&.title` no find, ou criar translation pt-BR no POST).
test.describe.fixme('Ativar / Inativar painel', () => {
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
      for (const { id: useModeId } of data.useModes) {
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
      for (const { id: useModeId } of data.useModes) {
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
        for (const { label } of data.useModes) {
          await expect(paineis.getInactivationBlockedModalBody()).toContainText(label);
        }
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
