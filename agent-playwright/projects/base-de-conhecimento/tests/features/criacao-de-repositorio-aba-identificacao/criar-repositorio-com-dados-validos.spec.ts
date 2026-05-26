// spec: projects/base-de-conhecimento/specs/criacao-de-repositorio-aba-identificacao-plan.md
// seed: tests/seed.spec.ts

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { KnowledgeRepositoryFormPage } from '../../../pages/KnowledgeRepositoryFormPage.js';
import { tc1Data as data } from './criar-repositorio-com-dados-validos.data.js';

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Criação de repositório - Aba Identificação', () => {
  let repoName: string;

  test.afterEach(async ({ browser }) => {
    // Cleanup obrigatório — TC1 cria estado persistente (repositório).
    // afterEach garante cleanup mesmo se o test falhou durante execução.
    // Contexto fresco: a page do test já está fechada quando afterEach roda.
    const ctx = await browser.newContext({
      storageState: STORAGE_STATE,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const listPage = new KnowledgeRepositoryListPage(page);
      await listPage.deleteRepositoryByNameSafe(repoName);
    } finally {
      await ctx.close();
    }
  });

  test('TC1 — Criar repositório com dados válidos', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Criação de repositório - Aba Identificação');
    await allure.story('TC1 — Criar repositório com dados válidos');
    await allure.severity('critical');

    // Nome worker-isolated: evita colisão em runs paralelos
    repoName = `Repositório TC1 w${testInfo.workerIndex}-${Date.now()}`;

    const listPage = new KnowledgeRepositoryListPage(page);
    const formPage = new KnowledgeRepositoryFormPage(page);

    // 1. Acessar a URL de listagem
    await allure.step('1. Acessar a URL de listagem de repositórios', async () => {
      await listPage.goToList();
      await expect(listPage.getListContainer()).toBeVisible();
    });

    // 2. Clicar no botão "+ Adicionar"
    await allure.step('2. Clicar no botão "+ Adicionar" e aguardar redirect para criação', async () => {
      await listPage.getAddButton().click();
      await expect(page).toHaveURL(/knowledge_repositories\/new/);
      await expect(formPage.getIdentificationContainer()).toBeVisible();
    });

    // 3. Preencher o campo "Nome"
    await allure.step('3. Preencher o campo "Nome"', async () => {
      await formPage.fillName(repoName);
      await expect(formPage.getNameInput()).toHaveValue(repoName);
    });

    // 4. Preencher o campo "Descrição"
    await allure.step('4. Preencher o campo "Descrição"', async () => {
      await formPage.fillDescription(data.descricao);
      await expect(formPage.getDescriptionInput()).toHaveValue(data.descricao);
    });

    // 5. Selecionar "Geral" no dropdown "Categoria"
    // REVISAR: confirmar se Categoria é select nativo ou react-select ao vivo
    await allure.step('5. Selecionar "Geral" no dropdown "Categoria"', async () => {
      await formPage.selectCategory(data.categoria);
    });

    // 6. Selecionar "Interno" no dropdown "Classificação"
    // REVISAR: confirmar se Classificação é select nativo ou react-select ao vivo
    await allure.step('6. Selecionar "Interno" no dropdown "Classificação"', async () => {
      await formPage.selectClassification(data.classificacao);
    });

    // 7. Clicar em "Salvar" e verificar sucesso
    // REVISAR-FIGMA: texto exato do toast de sucesso na criação
    await allure.step('7. Clicar em "Salvar" e verificar toast de sucesso', async () => {
      await formPage.clickSalvar();
      const toast = formPage.getToast(data.toastSucesso);
      await expect(toast.first()).toBeVisible({ timeout: 10_000 });
      // Produto redireciona pra tela de edição (/{id}/edit) após criar com sucesso.
      await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/);
    });
  });
});
