// spec: projects/base-de-conhecimento/specs/recursos-de-midia-upload-de-imagens-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { KnowledgeRepositoryFormPage } from '../../../pages/KnowledgeRepositoryFormPage.js';
import { clickTabWhenEnabled } from '../../../../../src/utils/tabs.js';
import { midiaSharedData as shared } from './midia.shared.data.js';

test.describe('Recursos de Mídia - Upload de imagens', () => {
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

  // fixme: aba "Recursos de mídia" fica disabled até salvar o repositório.
  // Spec cria repositório primeiro (afterEach limpa). Quando QA destravar
  // fixtures pra TC1-TC4, este TC5 já fica pronto pra rodar junto.
  test.fixme('TC5 — Validar exibição dos formatos aceitos', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Recursos de Mídia - Upload de imagens');
    await allure.story('TC5 — Validar exibição dos formatos aceitos');
    await allure.severity('normal');

    repoName = `Repositório Validar Formatos Midia w${testInfo.workerIndex}-${Date.now()}`;
    const formPage = new KnowledgeRepositoryFormPage(page);

    await allure.step('1. Criar repositório', async () => {
      await formPage.goToCreate();
      await formPage.fillName(repoName);
      await formPage.fillDescription('Teste validação de formatos de mídia');
      await formPage.clickSalvar();
      await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/);
    });

    await allure.step('2. Acessar aba "Recursos de mídia"', async () => {
      // clickTabWhenEnabled: tab `disabled` até save concluir (skill testar-tabs-progressivas-twygo).
      await clickTabWhenEnabled(page, 'Recursos de mídia', { selected: true });
    });

    await allure.step('3. Verificar formatos aceitos visíveis no componente de upload', async () => {
      for (const fmt of shared.acceptedFormats) {
        await expect(page.getByText(new RegExp(fmt, 'i')).first()).toBeVisible();
      }
    });

    await allure.step(`4. Verificar limite de tamanho (${shared.uploadMaxSizeMB} MB) visível`, async () => {
      await expect(page.getByText(new RegExp(`${shared.uploadMaxSizeMB}\\s*MB`, 'i')).first()).toBeVisible();
    });
  });
});
