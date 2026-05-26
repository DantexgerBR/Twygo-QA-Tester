// spec: projects/base-de-conhecimento/specs/fontes-de-conhecimento-upload-de-documentos-plan.md
// seed: tests/seed.spec.ts
//
// Validado live 2026-05-20: mensagem de erro inline na dropzone quando o
// arquivo está fora do accept ("Formato do arquivo não suportado. Tente novamente.").

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

  test('TC3 — Tentar upload de arquivo com formato não suportado', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Fontes de Conhecimento - Upload de documentos');
    await allure.story('TC3 — Tentar upload de arquivo com formato não suportado (3 abas)');
    await allure.severity('normal');

    const stamp = `w${testInfo.workerIndex}-${Date.now()}`;
    repoName = `Repositório Formato Invalido ${stamp}`;
    const sourceName = `Fonte Inválida ${stamp}`;
    const formPage = new KnowledgeRepositoryFormPage(page);

    await allure.step('1. Identificação — criar repositório', async () => {
      await formPage.goToCreate();
      await formPage.fillName(repoName);
      await formPage.fillDescription('Teste de formato inválido nas abas Fontes e Mídia');
      await formPage.clickSalvar();
      await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/);
    });

    await allure.step('2. Fontes — tentar upload de arquivo .zip (formato inválido)', async () => {
      await formPage.openSourcesTab();
      await formPage.clickAdicionarFonte();
      await formPage.fillSourceName(sourceName);
      await formPage.attachFile(shared.paths.invalid);
      await expect(page.getByText(shared.erroFormatoInvalido).first()).toBeVisible({
        timeout: 10_000,
      });
    });

    await allure.step('3. Fontes — confirmar que a fonte NÃO foi criada', async () => {
      // O botão Salvar do sub-form não deve permitir submit com arquivo inválido.
      // Voltar pra listagem e validar tabela vazia.
      await page.goBack();
      await expect(page).toHaveURL(/edit\?tab=sources/);
      await expect(formPage.getSourceRow(sourceName)).toHaveCount(0);
    });

    await allure.step('4. Recursos de mídia — tentar upload de .zip (formato inválido)', async () => {
      await formPage.openResourcesTab();
      await formPage.clickAdicionarRecurso();
      await formPage.fillResourceName(`${sourceName} mídia`);
      await formPage.attachFile(shared.paths.invalid);
      await expect(page.getByText(shared.erroFormatoInvalido).first()).toBeVisible({
        timeout: 10_000,
      });
    });
  });
});
