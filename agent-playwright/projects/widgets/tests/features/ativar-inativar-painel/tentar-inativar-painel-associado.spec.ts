// spec: projects/widgets/specs/ativar-inativar-painel-plan.md
// seed: tests/seed.spec.ts

// Testsuite: Ativar / Inativar painel
// Testcase (XML): Tentar inativar painel associado a um ou mais modos de uso
//
// PRECONDITIONS (literal do XML do AT):
// - Ambiente Stage configurado
// - Funcionalidade 'Gestão de Painéis' habilitada no contrato
// - Feature flag 'habilitar_paineis_do_usuario' ativa
// - Usuário logado como Admin
// - Existe painel 'Painel Vinculado' associado a 2 menus de modos de uso ativos
//
// ESTRATÉGIA DE SEED (auto-seed via UI):
// - beforeAll: createPanel + loop associatePanelToMenu(panel, 70077) + (panel, 70078)
// - afterAll: ORDEM IMPORTA — desassociar PRIMEIRO (senão deletePanel trava
//   no modal "Painel em uso"), depois deletePanelByNameSafe.
//
// FAILING-BY-PRODUCT-BUG: este teste FALHA INTENCIONALMENTE porque há bug
// no servidor twyg-app em `app/models/use_mode_item.rb#title_for` (commit
// 6461dbf499, 06/05/2026):
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
// (trace 2026-05-11: x-runtime: 0.021308).
//
// Sintoma observável: ao clicar no switch "Ativo?" do painel já associado,
// a UI chama /linked_menus → 500 → trata como "sem menus vinculados" →
// inativa direto sem mostrar o modal "Painel em uso". A asserção
// `expect(modal).toBeVisible()` no Step 2 falha por timeout.
//
// Cobertura confirmada via traces — o agente faz a parte dele certo:
//   POST /panels                                       → 201
//   POST /use_modes/70077/use_mode_itens               → 201
//   PATCH /use_modes/70077/use_mode_itens/bulk_update  → 200
//   POST /use_modes/70078/use_mode_itens               → 201
//   PATCH /use_modes/70078/use_mode_itens/bulk_update  → 200
//   GET  /panels/{id}/linked_menus                     → 500  ← BUG produto
//
// Fix sugerido upstream: `&.title` no find, OU criar translation pt-BR
// no POST de use_mode_itens. Quando corrigido, este teste passa
// automaticamente sem mudança no código.
//
// NÃO marcado com test.fixme por opção deliberada — bug de produto deve
// falhar vermelho pra ficar visível no relatório do dev. Ver Anti-pattern F
// em CLAUDE.md §7.6.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { data } from './tentar-inativar-painel-associado.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

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
      for (const useModeId of data.useModeIds) {
        await paineis.associatePanelToMenu(panelName, useModeId);
      }
    } finally {
      await ctx.close();
    }
  });

  test.afterAll(async ({ browser }) => {
    // ORDEM IMPORTA: desassociar PRIMEIRO; deletePanel trava no modal
    // "Painel em uso" enquanto algum menu estiver vinculado.
    const ctx = await browser.newContext({
      storageState: STORAGE_STATE,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      for (const useModeId of data.useModeIds) {
        await paineis.disassociatePanelFromMenu_safe(panelName, useModeId);
      }
      await paineis.goToList();
      await paineis.deletePanelByNameSafe(panelName);
    } finally {
      await ctx.close();
    }
  });

  test('Tentar inativar painel associado a um ou mais modos de uso', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Ativar / Inativar painel');
    await allure.story('Tentar inativar painel associado a um ou mais modos de uso');
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    // 1. Acessar a aba 'Painéis' em Configurações > Menu
    await step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
      await expect(paineis.getRowByName(panelName)).toBeVisible();
      await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked();
    });

    // 2. Clicar no switch da coluna 'Ativo' na linha 'Painel Vinculado'
    await step("2. Clicar no switch da coluna 'Ativo' na linha 'Painel Vinculado'", async () => {
      // Click direto no label — toggleActiveByName aguardaria toggle OU modal,
      // aqui queremos garantir que o modal apareça (não o toggle).
      await paineis.getRowActiveSwitchLabelByName(panelName).click();
      await expect(paineis.getInactivationBlockedModal()).toBeVisible();
      await expect(paineis.getInactivationBlockedModalTitle()).toContainText('Painel em uso');
      await expect(paineis.getInactivationBlockedModalBody()).toContainText('Não é possível desabilitar');
      for (const { label } of data.useModes) {
        await expect(paineis.getInactivationBlockedModalBody()).toContainText(label);
      }
    });

    // 3. Clicar no botão 'Fechar'/'Entendi' do modal
    await step("3. Clicar no botão 'Fechar'/'Entendi' do modal", async () => {
      await paineis.closeInactivationBlockedModal();
      await expect(paineis.getInactivationBlockedModal()).toBeHidden();
      await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked();
    });
  });
});
