// MD canônico §"Ambientes adicionais - Isolamento de repositórios" — TC1
// seed: tests/seed.spec.ts
//
// Padrão: skill testar-ambientes-adicionais-twygo.
// Cross-env via 2 contextos distintos:
//   - PRINCIPAL: storage default (outputs/.auth/storage.json) + env `staging` (stage10 / orgId 36602)
//   - ADICIONAL: ADITIONAL_STORAGE_PATH + env `staging-base-de-conhecimento-aditional` (stage101parceira / orgId 36690)
//
// Pré-condição operacional: feature flag `habilitar_base_de_conhecimento`
// habilitada em AMBAS as orgs (36602 e 36690) via Flipper-UI.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ADITIONAL_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { getEnvByName } from '../../../../../src/utils/environment.js';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { KnowledgeRepositoryFormPage } from '../../../pages/KnowledgeRepositoryFormPage.js';

const PRINCIPAL_STORAGE = resolve(process.cwd(), 'outputs/.auth/storage.json');
const aditional = getEnvByName('staging-base-de-conhecimento-aditional');
const aditionalOrgId = aditional.orgId!;

test.describe('Ambientes adicionais - Isolamento de repositórios', () => {
  let repoName: string;

  test.afterAll(async ({ browser }) => {
    // Cleanup no PRINCIPAL — repositório foi criado lá. Skill: limpar-dados-de-teste-twygo.
    // Contexto fresco obrigatório (page do test já foi fechada). Variant *_safe
    // tolera ausência (se o test falhou antes da criação, deleta no-op).
    if (!repoName) return;
    const ctx = await browser.newContext({ storageState: PRINCIPAL_STORAGE });
    const page = await ctx.newPage();
    try {
      const listPage = new KnowledgeRepositoryListPage(page);
      await listPage.deleteRepositoryByNameSafe(repoName);
    } finally {
      await ctx.close();
    }
  });

  test('TC1 — Repositórios criados no ambiente principal não aparecem no adicional', async ({ browser }, testInfo) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Ambientes adicionais - Isolamento de repositórios');
    await allure.story('TC1 — Repositórios criados no ambiente principal não aparecem no adicional');
    await allure.severity('critical');

    repoName = `Repositório Isol TC1 w${testInfo.workerIndex}-${Date.now()}`;

    await allure.step('1. Criar repositório no ambiente PRINCIPAL (staging / orgId 36602)', async () => {
      const principalCtx = await browser.newContext({ storageState: PRINCIPAL_STORAGE });
      const page = await principalCtx.newPage();
      try {
        const formPage = new KnowledgeRepositoryFormPage(page);
        await formPage.goToCreate();
        await formPage.fillName(repoName);
        await formPage.fillDescription('Repositório de isolamento — criado no principal');
        await formPage.clickSalvar();
        await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/);
      } finally {
        await principalCtx.close();
      }
    });

    await allure.step('2. Verificar AUSÊNCIA do repositório no ambiente ADICIONAL (staging-aditional / orgId 36690)', async () => {
      const aditionalCtx = await browser.newContext({
        storageState: ADITIONAL_STORAGE_PATH,
        baseURL: aditional.baseUrl,
      });
      const page = await aditionalCtx.newPage();
      try {
        const listPage = new KnowledgeRepositoryListPage(page, aditionalOrgId);
        await listPage.goToList();
        await listPage.searchByName(repoName);
        await expect(listPage.getRowByName(repoName)).toHaveCount(0);
      } finally {
        await aditionalCtx.close();
      }
    });
  });
});
