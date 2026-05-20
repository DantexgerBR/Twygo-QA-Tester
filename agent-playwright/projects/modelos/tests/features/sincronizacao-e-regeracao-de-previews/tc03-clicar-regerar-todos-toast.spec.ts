import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

// FIXME (2026-05-20): bloqueado pelo mesmo problema do TC1/TC2 — botão
// "Regerar todos" não chegou a renderizar no spec (depende de Kit alterado
// previamente). Destinatário: QA Lead — destravar TC1 destrava TC2 e TC3.
test.describe.fixme('Sincronização e Regeração de Previews', () => {
  test('Clicar "Regerar todos" inicia processo assíncrono', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Sincronização e Regeração de Previews');
    await allure.story('Clicar "Regerar todos" inicia processo assíncrono');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Acessar aba Design (Kit alterado)', async () => {
      await editPage.gotoFirstModelEditStructure();
      await page.locator('[data-test-id="tab-design"]').click();
      await page.waitForTimeout(2000);
    });

    await allure.step('2. Clicar "Regerar todos" e validar toast literal', async () => {
      const regerarBtn = page.getByRole('button', { name: /Regerar todos/i }).first();
      await expect(regerarBtn).toBeVisible({ timeout: 10_000 });
      await regerarBtn.evaluate((el: HTMLButtonElement) => el.click());
      await expect(
        page.locator('.chakra-toast').filter({ hasText: 'regeração dos designs foi iniciada' }).first(),
      ).toBeVisible({ timeout: 15_000 });
    });
  });
});
