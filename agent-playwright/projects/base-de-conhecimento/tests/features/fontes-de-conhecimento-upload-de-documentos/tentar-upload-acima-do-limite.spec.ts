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

  // fixme: fixture oversized-51mb.bin ausente. QA: providenciar binário >50MB.
  test.fixme('TC4 — Tentar upload de arquivo acima do limite de 50 MB', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Fontes de Conhecimento - Upload de documentos');
    await allure.story('TC4 — Tentar upload de arquivo acima do limite de 50 MB');
    await allure.severity('normal');

    repoName = `Repositório Oversize w${testInfo.workerIndex}-${Date.now()}`;
    const formPage = new KnowledgeRepositoryFormPage(page);

    await allure.step('1. Criar repositório', async () => {
      await formPage.goToCreate();
      await formPage.fillName(repoName);
      await formPage.fillDescription(`Teste upload >${shared.uploadMaxSizeMB}MB`);
      await formPage.clickSalvar();
      await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/);
    });

    await allure.step('2. Acessar aba "Fontes de conhecimento"', async () => {
      // clickTabWhenEnabled: tab `disabled` até save concluir (skill testar-tabs-progressivas-twygo).
      await clickTabWhenEnabled(page, 'Fontes de conhecimento', { selected: true });
    });

    await allure.step(`3. Tentar upload de arquivo >${shared.uploadMaxSizeMB}MB`, async () => {
      const fileInput = page.locator('input[type="file"]').last();
      await fileInput.setInputFiles(shared.paths.oversized);
      await expect(page.getByText(shared.toastErroTamanho).first()).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('4. Verificar que o arquivo NÃO foi adicionado', async () => {
      await expect(page.getByText(shared.names.oversized)).toBeHidden();
    });
  });
});
