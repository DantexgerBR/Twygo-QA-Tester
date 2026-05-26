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

  // Requer fixture em test-assets/uploads/images/jpg-valid-small.jpg (~2 MB).
  // Catálogo em test-assets/README.md.
  test('TC2 — Upload de arquivo JPG dentro do limite', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Recursos de Mídia - Upload de imagens');
    await allure.story('TC2 — Upload de arquivo JPG dentro do limite');
    await allure.severity('critical');

    repoName = `Repositório Upload JPG w${testInfo.workerIndex}-${Date.now()}`;
    const formPage = new KnowledgeRepositoryFormPage(page);

    await allure.step('1. Criar repositório', async () => {
      await formPage.goToCreate();
      await formPage.fillName(repoName);
      await formPage.fillDescription('Teste upload JPG');
      await formPage.clickSalvar();
      await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/);
    });

    await allure.step('2. Acessar aba "Recursos de mídia"', async () => {
      await clickTabWhenEnabled(page, 'Recursos de mídia', { selected: true });
    });

    await allure.step('3. Upload de arquivo JPG', async () => {
      const fileInput = page.locator('input[type="file"]').last();
      await fileInput.setInputFiles(shared.paths.jpg);
      await expect(page.getByText(shared.toastSucesso).first()).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('4. Verificar arquivo na listagem', async () => {
      await expect(page.getByText(shared.names.jpg)).toBeVisible();
    });
  });
});
