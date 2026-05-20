import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

// FIXME (2026-05-20): TC depende de fluxo encadeado + testIds não-mapeados:
//   1. Trocar Kit de Marca via react-select Backspace+ArrowDown não estabilizou
//      (audit MCP confirmou Kit atual "Kit Padrao Seed 1779280779053" inalterado
//      pós-save). Talvez requeira flow específico (clear via X + reselect).
//   2. Ícone de alerta no card: testId/icon canônico desconhecido. Heurística
//      por warning/error_outline/report não bateu — pode usar testId customizado.
// Destinatário: QA Lead — audit MCP precisa ser feito com sessão livre pra
// mapear o ícone de alerta + validar fluxo de troca de Kit.
test.describe.fixme('Sincronização e Regeração de Previews', () => {
  test('Alterar Kit de Marca exibe ícone de alerta no card', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Sincronização e Regeração de Previews');
    await allure.story('Alterar Kit de Marca exibe ícone de alerta no card');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);
    const listPage = new ContentModelsListPage(page);

    await allure.step('1. Abrir aba Identificação do 1º modelo', async () => {
      await listPage.goToList();
      await listPage.expectListingLoaded();
      const editIcon = page
        .locator('[data-test-id="content-models-page"] [id*="edit-element"][id$="-button-1"]')
        .first();
      await editIcon.waitFor({ state: 'visible', timeout: 15_000 });
      await editIcon.evaluate((el: HTMLElement) => el.click());
      await editPage.expectIdentificationTabActive();
    });

    await allure.step('2-3. Selecionar Kit DIFERENTE e Salvar', async () => {
      // Trocar Kit: limpar atual + selecionar outro via keyboard
      const kitInput = editPage.kitDeMarcaInput();
      await kitInput.focus();
      // Limpa seleção atual (Backspace no react-select clear)
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(500);
      // Re-seleciona outra opção via ArrowDown + ArrowDown + Enter
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      await editPage.save();
      // Toast sucesso (texto exato REVISAR-FIGMA no AT)
      await expect(
        page.locator('.chakra-toast').filter({ hasText: /sucesso/i }).first(),
      ).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('4. Voltar pra listagem e validar ícone alerta no card', async () => {
      await listPage.goToList();
      await listPage.expectListingLoaded();
      // Ícone de alerta — pode ser um warning material icon ou um testId específico.
      // REVISAR: testId canônico não conhecido — heurística por icon material.
      const alertIcon = page
        .locator('[data-test-id="content-models-page"] [icon="warning"], [data-test-id="content-models-page"] [icon="error_outline"], [data-test-id="content-models-page"] [icon="report"]')
        .first();
      await expect(alertIcon).toBeVisible({ timeout: 10_000 });
    });
  });
});
