import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { DesignPageEditPage } from '../../../pages/DesignPageEditPage.js';
import { PlateEditorPage } from '../../../../../src/pages/PlateEditorPage.js';

test.describe('Criação de Design de Página', () => {
  const designName = `Design TC8 w${process.env.TEST_WORKER_INDEX ?? '0'}-${Date.now()}`;
  const conteudoTexto = 'Texto inserido pelo TC8';

  test('Plate Editor — inserir texto via teclado', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Página');
    await allure.story('Plate Editor — inserir texto via teclado');
    await allure.severity('critical');

    const dp = new DesignPageEditPage(page);
    const editor = new PlateEditorPage(page);

    await allure.step('1. Criar Página e chegar na aba Design', async () => {
      await dp.gotoFromFirstModel();
      await dp.nameInput().fill(designName);
      await dp.selectTipo('Corpo');
      await dp.sequenceInput().fill('99');
      await dp.save();
      await page.waitForURL(/template_designs\/\d+\/edit.*tab=design/, { timeout: 15_000 });
      await page.waitForTimeout(2000);
    });

    await allure.step('2-3. Clicar no editor e digitar texto via keyboard', async () => {
      // Skill testar-plate-editor-twygo: typeText via page.keyboard (não fill)
      await editor.typeText(conteudoTexto);
      await page.waitForTimeout(500);
    });

    await allure.step('4. Validar texto no editor (via charCount + readText)', async () => {
      // textContent direto pode dar whitespace estranho; charCount confirma
      // que algo foi digitado (Plate atualiza contador conforme digita).
      const text = await editor.readText();
      expect(text, 'texto esperado deve aparecer no editor').toContain(conteudoTexto);
    });
  });
});
