// spec: projects/base-de-conhecimento/specs/listagem-basica-de-repositorios-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { tc1Data as data } from './tc1-acessar-listagem-via-menu-aprendizagem.data.js';

test.describe('Listagem básica de repositórios', () => {
  test('TC1 — Acessar a listagem via menu Aprendizagem', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Listagem básica de repositórios');
    await allure.story('TC1 — Acessar a listagem via menu Aprendizagem');
    await allure.severity('critical');

    const listPage = new KnowledgeRepositoryListPage(page);

    // Sidebar admin (chrome-devtools-mcp 2026-05-19): link tem class
    // "submenu-knowledge-repositories". Aparece 2× no DOM (sidebar desktop +
    // drawer mobile colapsado). Filtrar pelo visível pra evitar click no oculto.
    // /play (perfil aluno) NÃO tem esse item; usar /o/{orgId}/dashboard.
    const sidebarBaseConhecimento = page
      .locator('a.submenu-knowledge-repositories:visible')
      .first();

    // 1. Navegar ao Dashboard admin e descartar modais oportunistas
    await allure.step('1. Navegar para o Dashboard admin e verificar menu lateral visível', async () => {
      await safeGoto(page, `/o/${getOrgId()}${data.dashboardPath}`);
      await expect(sidebarBaseConhecimento).toBeVisible();
    });

    // Click no menu Twygo dispara handler JS que navega — Playwright actionability
    // diz "stable" mas algum overlay invisível trava o click real. dispatchEvent
    // pula o check de actionability e dispara o handler diretamente.
    await allure.step('2. Clicar no item de menu "Base de conhecimento" e aguardar redirect', async () => {
      await sidebarBaseConhecimento.dispatchEvent('click');
      await expect(page).toHaveURL(data.listUrlPattern);
    });

    // 3. Aguardar a listagem carregar
    await allure.step('3. Aguardar a listagem carregar com o componente ListControl', async () => {
      await expect(listPage.getListContainer()).toBeVisible();
      // Coluna "Nome" confirma que a ListControl renderizou com cabeçalhos
      await expect(page.getByRole('columnheader', { name: 'Nome' })).toBeVisible();
    });
  });
});
