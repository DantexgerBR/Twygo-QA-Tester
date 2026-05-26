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

  // Requer fixture em test-assets/uploads/images/unsupported.bmp (~50 KB,
  // BMP — fora da lista aceita [JPG, JPEG, PNG]).
  test('TC3 — Tentar upload de arquivo com formato não suportado', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Recursos de Mídia - Upload de imagens');
    await allure.story('TC3 — Tentar upload de arquivo com formato não suportado');
    await allure.severity('normal');

    repoName = `Repositório Midia Formato Invalido w${testInfo.workerIndex}-${Date.now()}`;
    const formPage = new KnowledgeRepositoryFormPage(page);

    await allure.step('1. Criar repositório', async () => {
      await formPage.goToCreate();
      await formPage.fillName(repoName);
      await formPage.fillDescription('Teste upload mídia formato inválido');
      await formPage.clickSalvar();
      await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/);
    });

    await allure.step('2. Acessar aba "Recursos de mídia"', async () => {
      await clickTabWhenEnabled(page, 'Recursos de mídia', { selected: true });
    });

    await allure.step('3. Tentar upload de arquivo .exe', async () => {
      const fileInput = page.locator('input[type="file"]').last();
      await fileInput.setInputFiles(shared.paths.invalid);
      await expect(page.getByText(shared.toastErroFormato).first()).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('4. Verificar que o arquivo NÃO foi adicionado', async () => {
      await expect(page.getByText(shared.names.invalid)).toBeHidden();
    });
  });
});
