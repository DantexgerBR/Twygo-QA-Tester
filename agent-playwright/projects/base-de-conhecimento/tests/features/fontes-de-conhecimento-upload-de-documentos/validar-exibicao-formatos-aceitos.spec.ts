// spec: projects/base-de-conhecimento/specs/fontes-de-conhecimento-upload-de-documentos-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { KnowledgeRepositoryFormPage } from '../../../pages/KnowledgeRepositoryFormPage.js';
import { clickTabWhenEnabled } from '../../../../../src/utils/tabs.js';
import { fontesSharedData as shared } from './fontes.shared.data.js';

test.describe('Fontes de Conhecimento - Upload de documentos', () => {
  let repoName: string;

  test.afterEach(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: shared.storageState });
    const page = await ctx.newPage();
    try {
      const listPage = new KnowledgeRepositoryListPage(page);
      await listPage.deleteRepositoryByNameSafe(repoName);
    } finally {
      await ctx.close();
    }
  });

  // fixme: aba "Fontes de conhecimento" fica disabled até salvar o repositório
  // (confirmado live 2026-05-19 — tab tem aria-disabled=true em /new). Spec
  // cria repositório primeiro (afterEach limpa). Quando QA destravar fixtures
  // pra TC1-TC4, este TC5 já fica pronto pra rodar junto.
  test.fixme('TC5 — Validar exibição dos formatos aceitos no componente de upload', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Fontes de Conhecimento - Upload de documentos');
    await allure.story('TC5 — Validar exibição dos formatos aceitos no componente de upload');
    await allure.severity('normal');

    repoName = `Repositório Validar Formatos w${testInfo.workerIndex}-${Date.now()}`;
    const formPage = new KnowledgeRepositoryFormPage(page);

    await allure.step('1. Criar repositório', async () => {
      await formPage.goToCreate();
      await formPage.fillName(repoName);
      await formPage.fillDescription('Teste validação de formatos aceitos');
      await formPage.clickSalvar();
      await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/);
    });

    await allure.step('2. Acessar aba "Fontes de conhecimento"', async () => {
      // clickTabWhenEnabled: tab fica `disabled` até save concluir + React re-renderizar
      // (skill testar-tabs-progressivas-twygo).
      await clickTabWhenEnabled(page, 'Fontes de conhecimento', { selected: true });
    });

    await allure.step('3. Verificar que componente de upload exibe formatos aceitos', async () => {
      // Cada formato (DOCX/PPTX/PDF/MP4/MP3) deve aparecer em algum texto
      // do componente de upload (label de "formatos aceitos", placeholder, etc).
      for (const fmt of shared.acceptedFormats) {
        await expect(page.getByText(new RegExp(fmt, 'i')).first()).toBeVisible();
      }
    });

    await allure.step(`4. Verificar limite de tamanho (${shared.uploadMaxSizeMB} MB) visível`, async () => {
      await expect(page.getByText(new RegExp(`${shared.uploadMaxSizeMB}\\s*MB`, 'i')).first()).toBeVisible();
    });
  });
});
