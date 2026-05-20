import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

// FIXME (2026-05-20): audit chrome-devtools-mcp confirma:
//   - Botão "Regerar todos" (data-test-id="modelos-de-conteudo-design-regenerate")
//     existe e renderiza na aba Design quando Kit foi alterado.
//   - Click via MCP foi executado mas NÃO retornou toast visível em 4s. Pode
//     desaparecer rápido demais OU ser ação silenciosa.
// AT (RN 59.4): toast literal "A regeração dos designs foi iniciada. Você
//   será notificado quando for concluída." — não confirmado no audit.
// Possibilidades:
//   1. Produto não emite toast (bug — falta confirmação UX da ação).
//   2. Toast aparece muito rápido (<2s) e some antes do capture.
//   3. Ação assíncrona usa websocket/notificação ao invés de toast.
// Destinatário: PO/QA Lead validar. Spec bloqueado também por TC1 (botão
// Regerar todos só aparece após Kit alterado, e TC1 não está estável).
test.describe.fixme('Sincronização e Regeração de Previews', () => {
  test('Clicar "Regerar todos" inicia processo assíncrono', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Sincronização e Regeração de Previews');
    await allure.story('Clicar "Regerar todos" inicia processo assíncrono');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await editPage.gotoFirstModelEditStructure();
    await page.locator('[data-test-id="tab-design"]').click();
    await page.waitForTimeout(2000);
    const regerarBtn = page.locator('[data-test-id="modelos-de-conteudo-design-regenerate"]');
    await expect(regerarBtn).toBeVisible({ timeout: 10_000 });
    await regerarBtn.evaluate((el: HTMLButtonElement) => el.click());
    await expect(
      page.locator('.chakra-toast').filter({ hasText: 'regeração dos designs foi iniciada' }).first(),
    ).toBeVisible({ timeout: 15_000 });
  });
});
