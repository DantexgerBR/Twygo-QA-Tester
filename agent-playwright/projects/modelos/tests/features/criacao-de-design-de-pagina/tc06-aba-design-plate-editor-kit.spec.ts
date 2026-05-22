import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { DesignPageEditPage } from '../../../pages/DesignPageEditPage.js';

test.describe('Criação de Design de Página', () => {
  const designName = `Design TC6 w${process.env.TEST_WORKER_INDEX ?? '0'}-${Date.now()}`;

  test('Aba Design exibe Plate Editor com Kit de Marca', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Página');
    await allure.story('Aba Design exibe Plate Editor com Kit de Marca');
    await allure.severity('high');

    const dp = new DesignPageEditPage(page);

    await allure.step('1. Criar Design via Identificação e chegar na aba Design', async () => {
      await dp.gotoFromFirstModel();
      await dp.nameInput().fill(designName);
      await dp.selectTipo('Corpo');
      await dp.sequenceInput().fill('99');
      await dp.save();
      // Redirect deve trazer ?tab=design no query string.
      await page.waitForURL(/template_designs\/\d+\/edit.*tab=design/, { timeout: 15_000 });
    });

    await allure.step('2. Validar Plate Editor renderizado (testId canônico)', async () => {
      // Audit chrome-devtools-mcp 2026-05-20: container do editor tem
      // data-test-id="modelos-de-conteudo-page-design-editor". Slate.js dentro.
      await expect(
        page.locator('[data-test-id="modelos-de-conteudo-page-design-editor"]'),
      ).toBeVisible({ timeout: 15_000 });
      // Editor Slate ativo
      await expect(
        page.locator('[data-slate-editor="true"]'),
      ).toBeVisible({ timeout: 5_000 });
    });

    await allure.step('3. Validar botão de Kit de Marca presente', async () => {
      // testId do botão de seleção de Kit no Design.
      // REVISAR: AT (RN 36.1) diz "Kit herdado do Modelo por padrão". UI mostra
      // "Selecione um kit" (vazio) — possível bug produto, validar com PO.
      // Por ora validamos apenas presença do controle.
      // Strict-mode: duplicado mobile+desktop. Usar .first().
      await expect(
        page.locator('[data-test-id="modelos-de-conteudo-page-design-brand-kit-button"]').first(),
      ).toBeVisible({ timeout: 10_000 });
    });
  });
});
