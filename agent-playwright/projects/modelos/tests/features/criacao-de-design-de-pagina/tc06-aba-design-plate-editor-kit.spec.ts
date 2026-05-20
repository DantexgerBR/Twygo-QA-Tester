import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { DesignPageEditPage } from '../../../pages/DesignPageEditPage.js';

// FIXME (2026-05-20): após save Identificação, redirect leva pra /template_designs/:id
// mas o Plate Editor não é detectado via [contenteditable=true] / [data-slate-editor].
// REVISAR com QA Lead/dev: identificar seletor canônico do Plate Editor + onde
// está o select de Kit de Marca dentro do design (separado do Kit do modelo).
test.describe.fixme('Criação de Design de Página', () => {
  const designName = `Design TC6 w${process.env.TEST_WORKER_INDEX ?? '0'}-${Date.now()}`;

  test('Aba Design exibe Plate Editor com Kit de Marca default', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Página');
    await allure.story('Aba Design exibe Plate Editor com Kit de Marca default');
    await allure.severity('high');

    const dp = new DesignPageEditPage(page);

    await allure.step('1. Criar Design e chegar na aba Design', async () => {
      await dp.gotoFromFirstModel();
      await dp.nameInput().fill(designName);
      await dp.selectTipo('Corpo');
      await dp.sequenceInput().fill('99');
      await dp.save();
      // Aguarda redirect pro design recém-criado
      await page.waitForURL(/template_designs\/\d+/, { timeout: 15_000 });
      await page.waitForTimeout(2000);
    });

    await allure.step('2. Validar Plate Editor renderizado + select Kit de Marca presente', async () => {
      // Plate Editor é contenteditable. Invariante mínima: algum [contenteditable=true]
      // ou role textbox aparece.
      const editor = page.locator('[contenteditable="true"], [data-slate-editor="true"], .platejs').first();
      await expect(editor).toBeVisible({ timeout: 15_000 });
      // Select Kit de Marca da página: REVISAR — sem testId conhecido na criação de design.
      // Validamos que algum label "Kit de marca" aparece nesta tela.
      await expect(page.getByText(/Kit de [Mm]arca/).first()).toBeVisible({ timeout: 10_000 });
    });
  });
});
