// spec: projects/base-de-conhecimento/specs/extracao-de-dados-de-repositorios-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { tc2Data as data } from './exportacao-respeita-filtros-aplicados.data.js';

// PARTIAL-FAILING-BY-PRODUCT-BUG (revalidado live 2026-05-24 via chrome-devtools-mcp).
//
// Causa raiz: GET /api/v1/o/36602/knowledge_repositories?
//   filter_cache_key=quick_filter:{userId}:{ts}
// retorna HTTP 500 com body:
//   {"message":"Erro ao listar repositórios de conhecimento",
//    "errors":["no implicit conversion of String into Integer"]}
//
// Mesmo bug que o TC2 da suite "Filtros e busca de repositórios" documentou
// em 2026-05-21 — **NÃO foi corrigido** até 2026-05-24. POST /filters retorna
// 200 (filtro salvo), GET subsequente quebra. Frontend engole o 500
// silenciosamente e renderiza a listagem sem filtro aplicado (todos os 25
// repositórios visíveis), mantendo "Limpar filtro" como se filtro estivesse
// ativo.
//
// Implicação pra este spec: passos UI funcionam (filtro UI aplicado, modal
// abre, toast aparece). O que NÃO é validável aqui é o CONTEÚDO do export
// — porque o backend está exportando a lista completa (filtro perdeu no 500).
// Validação de conteúdo já era out-of-scope Playwright (extração é async),
// mas registramos esse contexto pra agent-db/api quando rodar.
//
// Destinatário: DEV PRODUTO (Rails). Investigar coerção String/Integer no
// controller que serve listagem com filter_cache_key=quick_filter:* na
// base_de_conhecimento Twygo.

test.describe('Extração de dados de repositórios', () => {
  test('TC2 — Exportação respeita filtros aplicados', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Extração de dados de repositórios');
    await allure.story('TC2 — Exportação respeita filtros aplicados');
    await allure.severity('normal');
    await allure.label('tag', 'AT_OUTDATED_ASYNC_EXPORT');
    await allure.label('tag', 'BLOCKED_BY_RAILS_500_FILTER_CACHE_KEY');

    const listPage = new KnowledgeRepositoryListPage(page);

    await allure.step('1. Navegar para a listagem de repositórios', async () => {
      await listPage.goToList();
      await expect(listPage.getListContainer()).toBeVisible();
    });

    await allure.step('2. Garantir estado limpo (sem filtro residual)', async () => {
      await listPage.clearAllFilters();
      await expect(listPage.getClearFilterButton()).toBeHidden();
    });

    await allure.step(`3. Aplicar filtro Categoria="${data.categoriaFiltro}" via drawer`, async () => {
      await listPage.openFilterDrawer();
      await listPage.selectCategoryFilter(data.categoriaFiltro);
      await listPage.applyFilters();
      await expect(listPage.getDrawer()).toBeHidden();
      // **BUG**: a UI mostra "Limpar filtro" como se filtro estivesse ativo,
      // mesmo o GET subsequente tendo retornado 500. Asserção válida no
      // nível de UI; conteúdo real da listagem está sem filtro.
      await expect(listPage.getClearFilterButton()).toBeVisible();
    });

    await allure.step('4. Abrir modal "Configurações da extração"', async () => {
      await listPage.openExtractDataModal();
      await expect(listPage.getExtractDataModal()).toBeVisible();
    });

    await allure.step('5. Marcar Formato=CSV, Dados=Filtro atual, Colunas=Todas', async () => {
      await listPage.configureExtraction(data.extractOptions);
    });

    await allure.step('6. Click "Extrair" e aguardar toast de progresso', async () => {
      await listPage.confirmExtraction();
      await expect(listPage.getExtractionInProgressToast()).toBeVisible();
    });

    // Validação do conteúdo do export ("apenas Categoria=Geral") é
    // out-of-scope Playwright duas vezes:
    //   1. extração é assíncrona (arquivo via notificação minutos depois)
    //   2. bug Rails 500 do filter_cache_key faz backend exportar tudo
    // Tag sinaliza pro agent-db/api quando rodarem.
    await allure.label('tag', 'NEEDS_CONTENT_VALIDATION');
  });
});
