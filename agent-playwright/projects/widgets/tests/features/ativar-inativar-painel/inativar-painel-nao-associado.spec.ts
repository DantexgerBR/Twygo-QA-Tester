// Testsuite: Ativar / Inativar painel
// Testcase (XML): Inativar um painel não associado a nenhum modo de uso
//
// PRECONDITIONS (literal do XML do AT):
// - Ambiente Stage configurado
// - Funcionalidade 'Gestão de Painéis' habilitada no contrato
// - Feature flag 'habilitar_paineis_do_usuario' ativa
// - Usuário logado como Admin
// - Existe painel 'Painel QA Teste' cadastrado e ativo, sem associação com modo de uso
//
// ESTRATÉGIA DE SEED (auto-seed via UI, NÃO depende de painel pré-existente):
// beforeAll cria painel próprio com nome worker-isolated; afterAll deleta com
// variant _safe. Vide projects/widgets/specs/ativar-inativar-painel-plan.md
// seção 1.1 para detalhes.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
// NOTA: data.ts é importado mesmo se só usado pra docs — convenção §3.1
import { data } from './inativar-painel-nao-associado.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

// storageState global gravado pelo globalSetup — specs não fazem login (§7.6-A)
const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Ativar / Inativar painel', () => {
  // panelName gerado em runtime: worker-isolated para evitar colisão em runs paralelos.
  let panelName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `Painel Inativar TC1 w${testInfo.workerIndex}-${Date.now()}`;
    const ctx = await browser.newContext({
      storageState: STORAGE_STATE,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      // Cria painel ativo sem associação a menus — estado exigido pelas PRECONDITIONS do XML.
      await paineis.createPanel({ name: panelName });
    } finally {
      await ctx.close();
    }
  });

  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({
      storageState: STORAGE_STATE,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      await paineis.goToList();
      // _safe: cleanup robusto — não estoura se o painel foi deletado antes (ex: falha no beforeAll).
      await paineis.deletePanelByNameSafe(panelName);
    } finally {
      await ctx.close();
    }
  });

  test('Inativar um painel não associado a nenhum modo de uso', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Ativar / Inativar painel');
    await allure.story('Inativar um painel não associado a nenhum modo de uso');
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
      await expect(paineis.getRowByName(panelName)).toBeVisible();
      // Painel criado no beforeAll nasce ATIVO por padrão (confirmado live 2026-05-06).
      await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked();
    });

    await step("2. Clicar no switch da coluna 'Ativo' na linha do painel", async () => {
      await paineis.toggleActiveByName(panelName);
      await expect(paineis.getRowActiveSwitchByName(panelName)).not.toBeChecked();
    });

    await step('3. Recarregar a página', async () => {
      await page.reload();
      // goToList aguarda a tab Painéis aparecer — garante que a listagem está renderizada pós-reload.
      await paineis.goToList();
      await paineis.setViewMode('lista');
      await expect(paineis.getRowActiveSwitchByName(panelName)).not.toBeChecked();
    });
  });
});

// Referência ao data.ts satisfaz a convenção §3.1 (importar sempre, mesmo sem uso direto no spec).
void data;
