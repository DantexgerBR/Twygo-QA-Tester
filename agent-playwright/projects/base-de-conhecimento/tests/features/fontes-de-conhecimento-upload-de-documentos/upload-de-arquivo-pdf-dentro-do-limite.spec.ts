// spec: projects/base-de-conhecimento/specs/fontes-de-conhecimento-upload-de-documentos-plan.md
// seed: tests/seed.spec.ts
//
// Fluxo end-to-end das 3 abas (validado live 2026-05-20 via chrome-devtools-mcp):
//   1. Identificação — criar repo (Nome + Descrição)
//   2. Fontes — adicionar fonte com upload do PDF
//   3. Recursos de mídia — adicionar recurso com upload de PNG
//   4. Identificação — editar nome do repo

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { KnowledgeRepositoryFormPage } from '../../../pages/KnowledgeRepositoryFormPage.js';
import { fontesSharedData as shared } from './fontes.shared.data.js';

test.describe('Fontes de Conhecimento - Upload de documentos', () => {
  let repoName: string;

  test.afterEach(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: shared.storageState });
    const page = await ctx.newPage();
    try {
      const listPage = new KnowledgeRepositoryListPage(page);
      // O afterEach precisa cobrir o nome final (que pode ter sido editado no step 4).
      // Tenta primeiro o editado; cai pro original se não achar.
      await listPage.deleteRepositoryByNameSafe(`${repoName} EDITADO`);
      await listPage.deleteRepositoryByNameSafe(repoName);
    } finally {
      await ctx.close();
    }
  });

  test('TC1 — Upload de arquivo PDF dentro do limite', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Fontes de Conhecimento - Upload de documentos');
    await allure.story('TC1 — Upload de arquivo PDF dentro do limite (3 abas)');
    await allure.severity('critical');

    const stamp = `w${testInfo.workerIndex}-${Date.now()}`;
    repoName = `Repositório Upload PDF ${stamp}`;
    const sourceName = `Fonte PDF ${stamp}`;
    const resourceName = `Mídia PNG ${stamp}`;
    const formPage = new KnowledgeRepositoryFormPage(page);

    await allure.step('1. Identificação — criar repositório', async () => {
      await formPage.goToCreate();
      await formPage.fillName(repoName);
      await formPage.fillDescription('Teste E2E 3-abas: PDF + PNG');
      await formPage.clickSalvar();
      await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/);
    });

    await allure.step('2. Fontes — adicionar fonte com PDF', async () => {
      await formPage.openSourcesTab();
      await formPage.clickAdicionarFonte();
      await formPage.fillSourceName(sourceName);
      await formPage.attachFile(shared.paths.pdf);
      await formPage.clickSalvarSubForm();
      await expect(page).toHaveURL(/edit\?tab=sources/);
      await expect(formPage.getSourceRow(sourceName)).toBeVisible();
    });

    await allure.step('3. Recursos de mídia — adicionar recurso com PNG', async () => {
      await formPage.openResourcesTab();
      await formPage.clickAdicionarRecurso();
      await formPage.fillResourceName(resourceName);
      await formPage.attachFile(shared.paths.png);
      await formPage.clickSalvarSubForm();
      await expect(page).toHaveURL(/edit\?tab=resources/);
      await expect(formPage.getResourceRow(resourceName)).toBeVisible();
    });

    await allure.step('4. Identificação — editar nome do repositório', async () => {
      await formPage.openIdentificationTab();
      await formPage.fillName(`${repoName} EDITADO`);
      await formPage.clickSalvar();
      await expect(formPage.getNameInput()).toHaveValue(`${repoName} EDITADO`);
    });
  });
});
