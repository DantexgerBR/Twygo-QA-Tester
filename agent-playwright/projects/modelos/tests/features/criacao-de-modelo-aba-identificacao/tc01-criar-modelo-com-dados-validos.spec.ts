import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Identificação', () => {
  // Worker-isolated naming pra rodar em paralelo sem colisão de seed.
  const nome = `Modelo TC1 w${process.env.TEST_WORKER_INDEX ?? '0'}-${Date.now()}`;

  test.afterAll(async ({ browser }) => {
    // Cleanup: deletar modelo criado pra evitar acúmulo no env (Anti-pattern G).
    const ctx = await browser.newContext({ storageState: 'outputs/.auth/storage.json' });
    const page = await ctx.newPage();
    const editPage = new ContentModelEditPage(page);
    await editPage.deleteByNameSafe(nome);
    await ctx.close();
  });

  test('Criar modelo com dados válidos', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Identificação');
    await allure.story('Criar modelo com dados válidos');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir tela de criação', async () => {
      await editPage.gotoNew();
    });

    await allure.step('2-5. Preencher Nome + Descrição + Kit de marca', async () => {
      await editPage.nameInput().fill(nome);
      await editPage.descriptionTextarea().fill('Modelo de teste automatizado');
      await editPage.selectKitDeMarca();
    });

    await allure.step('6. Clicar Salvar e validar criação', async () => {
      await editPage.save();
      // Sucesso: ou redireciona pra /:id/edit ou listagem, OU mostra toast
      await Promise.race([
        page.waitForURL(/\/content_models\/\d+(\/edit)?/, { timeout: 15_000 }).catch(() => undefined),
        editPage.toastSuccess().waitFor({ timeout: 15_000 }).catch(() => undefined),
      ]);
      // Invariante: não está mais em /new
      await expect(page).not.toHaveURL(/\/content_models\/new$/);
    });
  });
});
