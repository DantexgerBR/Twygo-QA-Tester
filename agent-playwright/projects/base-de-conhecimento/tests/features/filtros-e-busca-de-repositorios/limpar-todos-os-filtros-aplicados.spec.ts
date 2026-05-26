// spec: projects/base-de-conhecimento/specs/filtros-e-busca-de-repositorios-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { filtrosBuscaData as data } from './filtros-e-busca-de-repositorios.data.js';

test.describe('Filtros e busca de repositórios', () => {
  test.afterEach(async ({ page }) => {
    // Garantia final de limpeza — idempotente se #clear-filter já oculto
    const listPage = new KnowledgeRepositoryListPage(page);
    await listPage.clearAllFilters();
  });

  // Adaptado 2026-05-21: usa filtro padrão "Bases sem fontes" (radio direto no
  // drawer modo A) em vez de filtro custom de Categoria. O fluxo de Categoria
  // está bloqueado por bug-produto (cross-origin get_categories_suggest pendente —
  // ver TC2/TC3). O objetivo do TC4 — validar #clear-filter restaura listagem
  // completa — não muda com o tipo de filtro aplicado.
  test('TC4 — Limpar todos os filtros aplicados', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Filtros e busca de repositórios');
    await allure.story('TC4 — Limpar todos os filtros aplicados');
    await allure.severity('normal');

    const listPage = new KnowledgeRepositoryListPage(page);

    // 1. Navegar para a listagem de repositórios
    await allure.step('1. Navegar para a listagem de repositórios', async () => {
      await listPage.goToList();
      await expect(listPage.getListContainer()).toBeVisible();
    });

    // 2. Garantir estado inicial sem filtro aplicado
    await allure.step('2. Garantir estado inicial sem filtro aplicado', async () => {
      await listPage.clearAllFilters();
      await expect(listPage.getClearFilterButton()).toBeHidden();
    });

    // 3. Capturar total de repositórios na listagem sem filtro (baseline)
    let totalSemFiltro = 0;
    await allure.step('3. Capturar total de repositórios na listagem sem filtro', async () => {
      totalSemFiltro = await listPage.getRowCount();
      expect(
        totalSemFiltro,
        `Pré-condição: esperado ao menos ${data.totalMinimoSemFiltro} repositórios na listagem`,
      ).toBeGreaterThanOrEqual(data.totalMinimoSemFiltro);
    });

    // 4. Aplicar filtro padrão "Bases sem fontes" via drawer (modo A — radio)
    await allure.step('4. Aplicar filtro padrão "Bases sem fontes" via drawer', async () => {
      await listPage.openFilterDrawer();
      await expect(listPage.getDrawer()).toBeVisible();

      await listPage.applyDefaultFilter('Bases sem fontes');

      await expect(listPage.getDrawer()).toBeHidden();
    });

    // 5. Verificar que #clear-filter está visível (filtro ativo confirmado)
    await allure.step('5. Verificar que #clear-filter está visível (filtro ativo)', async () => {
      await expect(listPage.getClearFilterButton()).toBeVisible();
    });

    // 6. Clicar em #clear-filter (Limpar filtros) e aguardar restauração
    await allure.step('6. Clicar em #clear-filter (Limpar filtros) e aguardar restauração', async () => {
      await listPage.clearAllFilters();
    });

    // 7. Verificar que #clear-filter está oculto e listagem exibe total completo
    await allure.step(
      '7. Verificar que #clear-filter está oculto e listagem exibe total completo',
      async () => {
        // #clear-filter oculto = nenhum filtro ativo
        await expect(listPage.getClearFilterButton()).toBeHidden();

        // Listagem restaurada ao total sem filtro capturado no passo 3
        const countAposLimpar = await listPage.getRowCount();
        expect(
          countAposLimpar,
          `Após limpar filtros, esperado ${totalSemFiltro} repositórios, encontrado ${countAposLimpar}`,
        ).toBe(totalSemFiltro);
      },
    );
  });
});
