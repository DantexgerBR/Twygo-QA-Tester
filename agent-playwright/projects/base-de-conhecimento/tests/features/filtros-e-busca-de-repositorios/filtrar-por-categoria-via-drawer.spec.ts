// spec: projects/base-de-conhecimento/specs/filtros-e-busca-de-repositorios-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { filtrosBuscaData as data } from './filtros-e-busca-de-repositorios.data.js';

test.describe('Filtros e busca de repositórios', () => {
  test.afterEach(async ({ page }) => {
    // Limpar filtros residuais — idempotente (no-op se #clear-filter oculto)
    const listPage = new KnowledgeRepositoryListPage(page);
    await listPage.clearAllFilters();
  });

  // FAILING-BY-PRODUCT-BUG (revalidado live 2026-05-21 via chrome-devtools-mcp).
  //
  // Histórico:
  // - Bug original (CORS em get_categories_suggest) está CORRIGIDO desde
  //   2026-05-21 — app consolidada em stage10.stage.twygoead.com same-origin.
  //   Dropdown Categoria carrega opções normalmente.
  //
  // Bug atual (novo, descoberto na revalidação):
  // - Fluxo UI completo funciona: click Filtro → Novo → marca Categoria →
  //   digita "Geral" → clica opção → chip aparece → clica Aplicar.
  // - Frontend faz POST /api/v1/o/36602/filters → 200 (filter salvo OK).
  // - Frontend faz GET /api/v1/o/36602/knowledge_repositories?...
  //   &filter_cache_key=quick_filter%3A{userId}%3A{ts} → **HTTP 500**.
  // - Response body: {"message":"Erro ao listar repositórios de conhecimento",
  //   "errors":["no implicit conversion of String into Integer"]} (TypeError Rails).
  // - Frontend engole o 500 silenciosamente e renderiza a listagem sem filtro
  //   (todos os 25 repositórios visíveis). UI ainda mostra "Limpar filtro"
  //   como se o filtro tivesse sido aplicado.
  //
  // Destinatário: DEV PRODUTO (Rails). x-request-id de exemplo:
  // 951a71489ed0e314cd6be88f9ce58461. Investigar coerção String/Integer no
  // controller que serve listagem com filter_cache_key=quick_filter:* na
  // base_de_conhecimento Twygo. Quando corrigido, este spec passa sem
  // alteração de código (a asserção da linha 1 conter "Geral" volta a bater).
  test('TC2 — Filtrar por Categoria via drawer de filtros', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Filtros e busca de repositórios');
    await allure.story('TC2 — Filtrar por Categoria via drawer de filtros');
    await allure.severity('critical');

    const listPage = new KnowledgeRepositoryListPage(page);

    // 1. Navegar para a listagem de repositórios
    await allure.step('1. Navegar para a listagem de repositórios', async () => {
      await listPage.goToList();
      await expect(listPage.getListContainer()).toBeVisible();
    });

    // 2. Limpar filtro residual se #clear-filter estiver visível (garante modo A na abertura do drawer)
    await allure.step('2. Limpar filtro residual se #clear-filter estiver visível', async () => {
      await listPage.clearAllFilters();
      await expect(listPage.getClearFilterButton()).toBeHidden();
    });

    // 3. Abrir drawer de filtros e verificar modo A
    await allure.step('3. Abrir drawer de filtros (botão Filtrar)', async () => {
      await listPage.openFilterDrawer();
      await expect(listPage.getDrawer()).toBeVisible();
      await expect(page.locator('#list-filter-apply')).toBeVisible();
    });

    // 4. Selecionar Categoria no drawer
    await allure.step(`4. Selecionar Categoria="${data.categoriaFiltro}" dentro do drawer`, async () => {
      await listPage.selectCategoryFilter(data.categoriaFiltro);
      // Drawer permanece aberto após seleção
      await expect(listPage.getDrawer()).toBeVisible();
    });

    // 5. Aplicar filtro e verificar que drawer fechou com #clear-filter visível
    await allure.step('5. Aplicar filtro e verificar que drawer fechou', async () => {
      await listPage.applyFilters();
      await expect(listPage.getDrawer()).toBeHidden();
      await expect(listPage.getClearFilterButton()).toBeVisible();
    });

    // 6. Asserir que todas as linhas têm Categoria='Geral' e #clear-filter está visível
    await allure.step(`6. Asserir que todas as linhas têm Categoria="${data.categoriaFiltro}"`, async () => {
      const rows = listPage.getTableRows();
      const count = await rows.count();

      expect(count, 'Esperado ao menos 1 repositório com Categoria=Geral').toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const rowText = await rows.nth(i).textContent();
        expect(
          rowText,
          `Linha ${i + 1} não contém Categoria="${data.categoriaFiltro}"`,
        ).toContain(data.categoriaFiltro);
      }
    });
  });
});
