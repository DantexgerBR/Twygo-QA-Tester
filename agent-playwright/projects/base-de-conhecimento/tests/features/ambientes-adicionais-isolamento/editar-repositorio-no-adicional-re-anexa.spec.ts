// MD canônico §"Ambientes adicionais - Isolamento de repositórios" — TC4
// seed: tests/seed.spec.ts
//
// Cria repositório no env ADICIONAL com 1 Fonte + 1 Recurso, edita descrição,
// adiciona +1 Fonte e +1 Recurso. Valida que tudo persiste no save e que o
// repo continua isolado do principal mesmo após edits.
//
// Skill: testar-ambientes-adicionais-twygo + testar-upload-de-arquivo-twygo.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ADITIONAL_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { getEnvByName } from '../../../../../src/utils/environment.js';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { KnowledgeRepositoryFormPage } from '../../../pages/KnowledgeRepositoryFormPage.js';
import { editarRepositorioData as data } from './editar-repositorio-no-adicional-re-anexa.data.js';

const PRINCIPAL_STORAGE = resolve(process.cwd(), 'outputs/.auth/storage.json');
const aditional = getEnvByName('staging-base-de-conhecimento-aditional');
const aditionalOrgId = aditional.orgId!;

test.describe('Ambientes adicionais - Isolamento de repositórios', () => {
  let repoName: string;
  let repoId: string | null = null;

  test.afterAll(async ({ browser }) => {
    if (!repoName) return;
    const ctx = await browser.newContext({
      storageState: ADITIONAL_STORAGE_PATH,
      baseURL: aditional.baseUrl,
    });
    const page = await ctx.newPage();
    try {
      const listPage = new KnowledgeRepositoryListPage(page, aditionalOrgId);
      await listPage.deleteRepositoryByNameSafe(repoName);
    } finally {
      await ctx.close();
    }
  });

  test('TC4 — Editar repositório no adicional re-anexando arquivo persiste e isola', async ({
    browser,
  }, testInfo) => {
    // Edit + 4 uploads + listagem cross-env ≈ 3-5 min em staging.
    test.setTimeout(10 * 60_000);

    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Ambientes adicionais - Isolamento de repositórios');
    await allure.story('TC4 — Editar repositório no adicional re-anexando arquivo persiste e isola');
    await allure.severity('high');

    repoName = `${data.baseName} w${testInfo.workerIndex}-${Date.now()}`;

    await allure.step('1. Criar repositório no ADICIONAL com 1 Fonte (PDF) + 1 Recurso (JPG)', async () => {
      const ctx = await browser.newContext({
        storageState: ADITIONAL_STORAGE_PATH,
        baseURL: aditional.baseUrl,
      });
      const page = await ctx.newPage();
      try {
        const formPage = new KnowledgeRepositoryFormPage(page, aditionalOrgId);

        await formPage.goToCreate();
        await formPage.fillName(repoName);
        await formPage.fillDescription(data.descriptionInitial);
        await formPage.clickSalvar();
        await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/, { timeout: 30_000 });
        repoId = formPage.getCurrentRepoId();
        expect(repoId).not.toBeNull();

        // Fonte inicial
        await formPage.openSourcesTab();
        await formPage.clickAdicionarFonte();
        await formPage.fillSourceName(data.firstSource.name);
        await formPage.attachFile(data.firstSource.file);
        await formPage.clickSalvarSubForm();
        await page.waitForURL(/edit\?tab=sources/, { timeout: 30_000 });
        await expect(formPage.getSourceRow(data.firstSource.name)).toBeVisible({ timeout: 15_000 });

        // Recurso inicial
        await formPage.openResourcesTab();
        await formPage.clickAdicionarRecurso();
        await formPage.fillResourceName(data.firstResource.name);
        await formPage.attachFile(data.firstResource.file);
        await formPage.clickSalvarSubForm();
        await page.waitForURL(/edit\?tab=resources/, { timeout: 30_000 });
        await expect(formPage.getResourceRow(data.firstResource.name)).toBeVisible({ timeout: 15_000 });
      } finally {
        await ctx.close();
      }
    });

    await allure.step('2. Editar Descrição via tela de edição e validar persistência', async () => {
      const ctx = await browser.newContext({
        storageState: ADITIONAL_STORAGE_PATH,
        baseURL: aditional.baseUrl,
      });
      const page = await ctx.newPage();
      try {
        const formPage = new KnowledgeRepositoryFormPage(page, aditionalOrgId);
        await formPage.goToEdit(repoId!);
        await formPage.openIdentificationTab();
        await formPage.fillDescription(data.descriptionUpdated);
        await formPage.clickSalvar();
        // Edit salva sem redirect — aguarda a request voltar
        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => null);

        // Reload pra confirmar persistência server-side
        await formPage.goToEdit(repoId!);
        await expect(formPage.getDescriptionInput()).toHaveValue(data.descriptionUpdated);
      } finally {
        await ctx.close();
      }
    });

    await allure.step('3. Adicionar Fonte adicional (DOCX) e Recurso adicional (PNG)', async () => {
      const ctx = await browser.newContext({
        storageState: ADITIONAL_STORAGE_PATH,
        baseURL: aditional.baseUrl,
      });
      const page = await ctx.newPage();
      try {
        const formPage = new KnowledgeRepositoryFormPage(page, aditionalOrgId);
        await formPage.goToEdit(repoId!);

        // +1 Fonte
        await formPage.openSourcesTab();
        await formPage.clickAdicionarFonte();
        await formPage.fillSourceName(data.secondSource.name);
        await formPage.attachFile(data.secondSource.file);
        await formPage.clickSalvarSubForm();
        await page.waitForURL(/edit\?tab=sources/, { timeout: 30_000 });
        await expect(formPage.getSourceRow(data.firstSource.name)).toBeVisible({ timeout: 15_000 });
        await expect(formPage.getSourceRow(data.secondSource.name)).toBeVisible({ timeout: 15_000 });

        // +1 Recurso
        await formPage.openResourcesTab();
        await formPage.clickAdicionarRecurso();
        await formPage.fillResourceName(data.secondResource.name);
        await formPage.attachFile(data.secondResource.file);
        await formPage.clickSalvarSubForm();
        await page.waitForURL(/edit\?tab=resources/, { timeout: 30_000 });
        await expect(formPage.getResourceRow(data.firstResource.name)).toBeVisible({ timeout: 15_000 });
        await expect(formPage.getResourceRow(data.secondResource.name)).toBeVisible({ timeout: 15_000 });
      } finally {
        await ctx.close();
      }
    });

    await allure.step('4. Validar AUSÊNCIA do repositório no PRINCIPAL', async () => {
      const ctx = await browser.newContext({ storageState: PRINCIPAL_STORAGE });
      const page = await ctx.newPage();
      try {
        const listPage = new KnowledgeRepositoryListPage(page);
        await listPage.goToList();
        await listPage.searchByName(repoName);
        await expect(listPage.getRowByName(repoName)).toHaveCount(0);
      } finally {
        await ctx.close();
      }
    });
  });
});
