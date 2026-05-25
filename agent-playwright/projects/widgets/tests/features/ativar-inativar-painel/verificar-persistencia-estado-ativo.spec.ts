// Testsuite: Ativar / Inativar painel
// Testcase (XML): Verificar persistência do estado Ativo após reload
//
// PRECONDITIONS (literal do XML do AT):
// - Ambiente Stage configurado
// - Funcionalidade 'Gestão de Painéis' habilitada no contrato
// - Feature flag 'habilitar_paineis_do_usuario' ativa
// - Usuário logado como Admin
// - Existem painéis ativos e inativos
//
// ESTRATÉGIA DE SEED (auto-seed via UI):
// Antes deste padrão o spec apontava pra "Painel 30" do seed estático, que
// acabou empurrado pra página 2+ quando o env acumulou ~75 painéis (paginação
// 25/pág). Self-seed elimina dependência do estado do env — cada execução
// cria e destrói seu próprio painel com nome worker-isolated.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
// NOTA: data.ts é importado mesmo se só usado pra docs — convenção §3.1
import { data } from './verificar-persistencia-estado-ativo.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

// storageState global gravado pelo globalSetup — specs não fazem login (§7.6-A)
const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Ativar / Inativar painel', () => {
  // panelName gerado em runtime: worker-isolated para evitar colisão em runs paralelos.
  let panelName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `Painel Persistencia TC5 w${testInfo.workerIndex}-${Date.now()}`;
    const ctx = await browser.newContext({
      storageState: STORAGE_STATE,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      // Cria painel ativo sem associação a menus — nasce ATIVO por padrão.
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

  test('Verificar persistência do estado Ativo após reload', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Ativar / Inativar painel');
    await allure.story('Verificar persistência do estado Ativo após reload');
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);
    let estadoInicial: boolean;

    // 1. Acessar a aba 'Painéis' em Configurações > Menu
    await step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await paineis.setViewMode('lista');
      await expect(paineis.getRowByName(panelName)).toBeVisible();
      estadoInicial = await paineis.getActiveStateByName(panelName);
    });

    // 2. Alterar o switch 'Ativo' do painel para o estado oposto
    await step("2. Alterar o switch 'Ativo' do painel para o estado oposto", async () => {
      await paineis.toggleActiveByName(panelName);
      await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked({
        checked: !estadoInicial,
      });
    });

    // 3. Recarregar a página (F5)
    await step('3. Recarregar a página (F5)', async () => {
      await page.reload();
      await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked({
        checked: !estadoInicial,
      });
    });
  });
});

// Referência ao data.ts satisfaz a convenção §3.1 (importar sempre, mesmo sem uso direto no spec).
void data;
