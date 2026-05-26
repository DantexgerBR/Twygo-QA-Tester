// spec: projects/base-de-conhecimento/specs/filtros-e-busca-de-repositorios-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { filtrosBuscaData as data } from './filtros-e-busca-de-repositorios.data.js';

test.describe('Filtros e busca de repositórios', () => {
  // Pré-condição confirmada 2026-05-21: env tem 25+ repositórios seedados, incluindo
  // "Repositório TC1 w2-1779363231364" com Categoria=Geral/Classificação=Interno.
  test('TC1 — Buscar repositório por nome', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Filtros e busca de repositórios');
    await allure.story('TC1 — Buscar repositório por nome');
    await allure.severity('critical');

    const listPage = new KnowledgeRepositoryListPage(page);

    // 1. Navegar para a listagem e verificar pré-condição (≥3 repositórios)
    await allure.step('1. Navegar para a listagem e verificar pré-condição (≥3 repositórios)', async () => {
      await listPage.goToList();

      const rowCount = await listPage.getRowCount();
      expect(
        rowCount,
        `Pré-condição falhou: esperado ao menos ${data.totalMinimoSemFiltro} repositórios, encontrado ${rowCount}. ` +
          `Verifique a seed do env staging-base-de-conhecimento.`,
      ).toBeGreaterThanOrEqual(data.totalMinimoSemFiltro);
    });

    // 2. Verificar que a listagem é exibida com múltiplos repositórios
    await allure.step('2. Verificar que a listagem é exibida com múltiplos repositórios', async () => {
      await expect(listPage.getListContainer()).toBeVisible();
    });

    // 3. Preencher o campo de busca e aguardar filtro server-side
    await allure.step(`3. Buscar por "${data.buscaQuery}" e aguardar listagem filtrar`, async () => {
      await listPage.searchByName(data.buscaQuery);
      await expect(listPage.getListContainer()).toBeVisible();
    });

    // 4. Verificar que linhas exibidas contêm o nome buscado
    await allure.step('4. Verificar que linhas exibidas contêm o nome buscado', async () => {
      const rows = listPage.getTableRows();
      const count = await rows.count();

      expect(count, 'Nenhum resultado retornado para a busca').toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const rowText = await rows.nth(i).textContent();
        expect(
          rowText,
          `Linha ${i + 1} não contém "${data.buscaQuery}" no nome`,
        ).toContain(data.buscaQuery);
      }
    });

    // 5. Limpar busca e verificar restauração da listagem completa
    await allure.step('5. Limpar busca e verificar restauração da listagem completa', async () => {
      await listPage.clearSearch();

      const countAposClear = await listPage.getRowCount();
      expect(
        countAposClear,
        `Após limpar busca, esperado ao menos ${data.totalMinimoSemFiltro} repositórios restaurados`,
      ).toBeGreaterThanOrEqual(data.totalMinimoSemFiltro);
    });
  });
});
