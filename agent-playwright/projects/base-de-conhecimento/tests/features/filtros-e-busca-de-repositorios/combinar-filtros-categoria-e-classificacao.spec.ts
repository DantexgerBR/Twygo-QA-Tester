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

  // FAILING-BY-PRODUCT-BUG (mesma causa raiz do TC2 — revalidado live 2026-05-21).
  //
  // - Bug CORS original em get_categories_suggest está CORRIGIDO.
  // - Bug atual: GET /api/v1/o/36602/knowledge_repositories?...&filter_cache_key=
  //   quick_filter:{userId}:{ts} retorna **HTTP 500** com Rails TypeError
  //   "no implicit conversion of String into Integer". POST /filters retorna 200
  //   mas a listagem subsequente quebra no controller. UI engole 500
  //   silenciosamente.
  //
  // Destinatário: DEV PRODUTO (Rails). Mesmo controller que afeta TC2.
  // Quando corrigido, este spec (Categoria + Classificação combinados) passa
  // sem alteração — backend só precisa coercer corretamente o quick_filter.
  test('TC3 — Combinar filtros de Categoria e Classificação', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Filtros e busca de repositórios');
    await allure.story('TC3 — Combinar filtros de Categoria e Classificação');
    await allure.severity('normal');

    const listPage = new KnowledgeRepositoryListPage(page);

    // 1. Navegar para a listagem de repositórios
    await allure.step('1. Navegar para a listagem de repositórios', async () => {
      await listPage.goToList();
      await expect(listPage.getListContainer()).toBeVisible();
    });

    // 2. Limpar filtro residual para garantir modo A na abertura do drawer
    await allure.step('2. Limpar filtro residual se presente', async () => {
      await listPage.clearAllFilters();
      await expect(listPage.getClearFilterButton()).toBeHidden();
    });

    // 3. Abrir drawer de filtros
    await allure.step('3. Abrir drawer de filtros', async () => {
      await listPage.openFilterDrawer();
      await expect(listPage.getDrawer()).toBeVisible();
      await expect(page.locator('#list-filter-apply')).toBeVisible();
    });

    // 4. Selecionar 'Geral' no filtro Categoria
    await allure.step(`4. Selecionar Categoria="${data.categoriaFiltro}" no drawer`, async () => {
      await listPage.selectCategoryFilter(data.categoriaFiltro);
      await expect(listPage.getDrawer()).toBeVisible();
    });

    // 5. Selecionar 'Interno' no filtro Classificação dentro do mesmo drawer
    await allure.step(`5. Selecionar Classificação="${data.classificacaoFiltro}" no drawer`, async () => {
      // REVISAR-FIGMA: recon não capturou drawer aberto — seleção usa padrão Chakra
      // com label do accordion "Colunas para filtrar". Se o produto usar componente
      // diferente (react-select, radio exclusivo por grupo), atualizar POM.
      await listPage.selectClassificationFilter(data.classificacaoFiltro);
      await expect(listPage.getDrawer()).toBeVisible();
    });

    // 6. Aplicar ambos os filtros e verificar drawer fechou
    await allure.step('6. Aplicar ambos os filtros e verificar drawer fechou', async () => {
      await listPage.applyFilters();
      await expect(listPage.getDrawer()).toBeHidden();
      await expect(listPage.getClearFilterButton()).toBeVisible();
    });

    // 7. Asserir que linhas têm Categoria='Geral' E Classificação='Interno'
    await allure.step(
      `7. Asserir que linhas têm Categoria="${data.categoriaFiltro}" E Classificação="${data.classificacaoFiltro}"`,
      async () => {
        const rows = listPage.getTableRows();
        const count = await rows.count();

        expect(
          count,
          `Esperado ao menos 1 repositório com Categoria=${data.categoriaFiltro} E Classificação=${data.classificacaoFiltro}`,
        ).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          const rowText = await rows.nth(i).textContent();
          expect(
            rowText,
            `Linha ${i + 1} não contém Categoria="${data.categoriaFiltro}"`,
          ).toContain(data.categoriaFiltro);
          expect(
            rowText,
            `Linha ${i + 1} não contém Classificação="${data.classificacaoFiltro}"`,
          ).toContain(data.classificacaoFiltro);
        }
      },
    );
  });
});
