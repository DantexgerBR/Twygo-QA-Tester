// spec: projects/base-de-conhecimento/specs/listagem-basica-de-repositorios-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { tc4Data as data } from './tc4-validar-empty-state.data.js';

test.describe('Listagem básica de repositórios', () => {
  // Antes do TC4, limpa repositórios órfãos via API — garante empty state
  // determinístico independente de runs anteriores que deixaram lixo.
  // API REST documentada: GET/DELETE /api/v1/o/:org_id/knowledge_repositories.
  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: 'outputs/.auth/storage.json' });
    const page = await ctx.newPage();
    try {
      const listPage = new KnowledgeRepositoryListPage(page);
      await listPage.goToList();
      const ids = await page.evaluate(() =>
        Array.from(document.querySelectorAll('[data-item-id]')).map((el) =>
          el.getAttribute('data-item-id'),
        ),
      );
      for (const id of ids) {
        if (!id) continue;
        await page.evaluate(
          async ({ orgId, id }) => {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
            await fetch(`/api/v1/o/${orgId}/knowledge_repositories/${id}`, {
              method: 'DELETE',
              headers: { 'X-CSRF-Token': csrf, Accept: 'application/json' },
              credentials: 'include',
            });
          },
          { orgId: getOrgId(), id },
        );
      }
    } finally {
      await ctx.close();
    }
  });

  test('TC4 — Validar empty state quando não há repositórios', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Listagem básica de repositórios');
    await allure.story('TC4 — Validar empty state quando não há repositórios');
    await allure.severity('normal');

    const listPage = new KnowledgeRepositoryListPage(page);

    // Env staging-base-de-conhecimento já está vazio — navega direto, valida empty state real.
    await allure.step('1. Navegar para a listagem (env sem repositórios seedados)', async () => {
      await listPage.goToList();
      await expect(page).toHaveURL(/knowledge_repositories/);
      await expect(listPage.getListContainer()).toBeVisible();
    });

    await allure.step('2. Verificar exibição do empty state', async () => {
      await expect(page.getByText(data.emptyStateText)).toBeVisible();
      const rowCount = await listPage.getRowCount();
      expect(rowCount, 'Empty state implica 0 linhas de dados').toBe(0);
    });
  });
});
