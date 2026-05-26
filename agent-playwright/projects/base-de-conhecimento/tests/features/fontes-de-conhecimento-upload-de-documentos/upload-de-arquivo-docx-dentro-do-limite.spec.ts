// spec: projects/base-de-conhecimento/specs/fontes-de-conhecimento-upload-de-documentos-plan.md
// seed: tests/seed.spec.ts

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
      await listPage.deleteRepositoryByNameSafe(`${repoName} EDITADO`);
      await listPage.deleteRepositoryByNameSafe(repoName);
    } finally {
      await ctx.close();
    }
  });

  test('TC2 — Upload de arquivo DOCX dentro do limite', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Fontes de Conhecimento - Upload de documentos');
    await allure.story('TC2 — Upload de arquivo DOCX dentro do limite (3 abas)');
    await allure.severity('critical');

    const stamp = `w${testInfo.workerIndex}-${Date.now()}`;
    repoName = `Repositório Upload DOCX ${stamp}`;
    const sourceName = `Fonte DOCX ${stamp}`;
    const resourceName = `Mídia JPG ${stamp}`;
    const formPage = new KnowledgeRepositoryFormPage(page);

    await allure.step('1. Identificação — criar repositório', async () => {
      await formPage.goToCreate();
      await formPage.fillName(repoName);
      await formPage.fillDescription('Teste E2E 3-abas: DOCX + JPG');
      await formPage.clickSalvar();
      await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/);
    });

    await allure.step('2. Fontes — adicionar fonte com DOCX', async () => {
      await formPage.openSourcesTab();
      await formPage.clickAdicionarFonte();
      await formPage.fillSourceName(sourceName);
      await formPage.attachFile(shared.paths.docx);
      await formPage.clickSalvarSubForm();
      await expect(page).toHaveURL(/edit\?tab=sources/);
      await expect(formPage.getSourceRow(sourceName)).toBeVisible();
    });

    await allure.step('3. Recursos de mídia — adicionar recurso com JPG', async () => {
      await formPage.openResourcesTab();
      await formPage.clickAdicionarRecurso();
      await formPage.fillResourceName(resourceName);
      // Usa JPG pequeno (~199 KB) — diversifica do TC1 que usa PNG.
      await formPage.attachFile(shared.paths.png);
      await formPage.clickSalvarSubForm();
      await expect(page).toHaveURL(/edit\?tab=resources/);
      await expect(formPage.getResourceRow(resourceName)).toBeVisible();
    });

    await allure.step('4. Identificação — editar descrição do repositório', async () => {
      await formPage.openIdentificationTab();
      await formPage.fillDescription('Descrição EDITADA pelo TC2');
      await formPage.clickSalvar();
      await expect(formPage.getDescriptionInput()).toHaveValue('Descrição EDITADA pelo TC2');
    });
  });
});
