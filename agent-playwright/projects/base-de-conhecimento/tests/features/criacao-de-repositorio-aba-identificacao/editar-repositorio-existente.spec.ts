// spec: projects/base-de-conhecimento/specs/criacao-de-repositorio-aba-identificacao-plan.md
// seed: tests/seed.spec.ts

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { KnowledgeRepositoryFormPage } from '../../../pages/KnowledgeRepositoryFormPage.js';
import { tc6DataFactory } from './editar-repositorio-existente.data.js';

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Criação de repositório - Aba Identificação', () => {
  // Audit chrome-devtools-mcp 2026-05-21: env tem 51 repositórios (não está
  // mais vazio como o fixme antigo descrevia). beforeAll cria 1 repositório
  // worker-isolated via UI para garantir alvo de edição existente; afterAll
  // limpa pelo nome editado (Anti-pattern G).
  let tc6Data: ReturnType<typeof tc6DataFactory>;

  test.beforeAll(async ({ browser }, testInfo) => {
    tc6Data = tc6DataFactory(testInfo.workerIndex);
    const ctx = await browser.newContext({
      storageState: STORAGE_STATE,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const listPage = new KnowledgeRepositoryListPage(page);
      const formPage = new KnowledgeRepositoryFormPage(page);
      await listPage.goToList();
      await listPage.getAddButton().click();
      await expect(page).toHaveURL(/knowledge_repositories\/new/);
      await formPage.fillName(tc6Data.repoNameOriginal);
      await formPage.fillDescription(tc6Data.descricao);
      await formPage.selectCategory(tc6Data.categoria);
      await formPage.selectClassification(tc6Data.classificacao);
      await formPage.clickSalvar();
      // Pós-criar redireciona pra /{id}/edit — sinal que persistiu.
      await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/, { timeout: 15_000 });
    } finally {
      await ctx.close();
    }
  });

  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({
      storageState: STORAGE_STATE,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const listPage = new KnowledgeRepositoryListPage(page);
      // Cleanup pelo nome editado — é o estado final após o test;
      // se o test falhou antes de editar, tenta o nome original como fallback.
      await listPage.deleteRepositoryByNameSafe(tc6Data.repoNameEditado);
      await listPage.deleteRepositoryByNameSafe(tc6Data.repoNameOriginal);
    } finally {
      await ctx.close();
    }
  });

  test('TC6 — Editar repositório existente', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Criação de repositório - Aba Identificação');
    await allure.story('TC6 — Editar repositório existente');
    await allure.severity('high');

    const repoNameOriginal = tc6Data.repoNameOriginal;
    const repoNameEditado = tc6Data.repoNameEditado;

    const listPage = new KnowledgeRepositoryListPage(page);
    const formPage = new KnowledgeRepositoryFormPage(page);

    // 1. Acessar a listagem e verificar repositório alvo
    await allure.step('1. Acessar a listagem e verificar repositório alvo', async () => {
      await listPage.goToList();
      await expect(listPage.getListContainer()).toBeVisible();
      await listPage.searchByName(repoNameOriginal);
      await expect(listPage.getRowByName(repoNameOriginal)).toBeVisible();
    });

    // 2. Clicar em "Editar" na linha do repositório alvo
    await allure.step('2. Clicar em "Editar" e aguardar redirect para tela de edição', async () => {
      await listPage.clickEditByName(repoNameOriginal);
      await expect(formPage.getIdentificationContainer()).toBeVisible();
      await expect(formPage.getNameInput()).toHaveValue(repoNameOriginal);
    });

    // 3. Atualizar o campo "Nome"
    await allure.step('3. Atualizar o campo "Nome" para o nome editado', async () => {
      await formPage.getNameInput().clear();
      await formPage.fillName(repoNameEditado);
      await expect(formPage.getNameInput()).toHaveValue(repoNameEditado);
    });

    // 4. Clicar em "Salvar" e verificar atualização
    await allure.step('4. Clicar em "Salvar" e verificar toast de atualização', async () => {
      await formPage.clickSalvar();
      const toast = formPage.getToast(tc6Data.toastSucessoEdicao);
      await expect(toast.first()).toBeVisible({ timeout: 10_000 });
      // Verifica que o novo nome aparece na listagem e o antigo sumiu
      await listPage.goToList();
      await listPage.searchByName(repoNameEditado);
      await expect(listPage.getRowByName(repoNameEditado)).toBeVisible();
      await expect(listPage.getRowByName(repoNameOriginal)).toHaveCount(0);
    });
  });
});
