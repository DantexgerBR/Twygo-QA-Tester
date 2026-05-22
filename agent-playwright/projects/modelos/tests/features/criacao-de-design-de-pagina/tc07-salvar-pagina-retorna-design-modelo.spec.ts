import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { DesignPageEditPage } from '../../../pages/DesignPageEditPage.js';

test.describe('Criação de Design de Página', () => {
  const designName = `Design TC7 w${process.env.TEST_WORKER_INDEX ?? '0'}-${Date.now()}`;

  test('Salvar Página retorna para aba Design do Modelo', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Página');
    await allure.story('Salvar Página retorna para aba Design do Modelo');
    await allure.severity('critical');

    const dp = new DesignPageEditPage(page);

    await allure.step('1. Criar Página até aba Design', async () => {
      await dp.gotoFromFirstModel();
      await dp.nameInput().fill(designName);
      await dp.selectTipo('Corpo');
      await dp.sequenceInput().fill('100');
      await dp.save();
      await page.waitForURL(/template_designs\/\d+/, { timeout: 15_000 });
      await page.waitForTimeout(2000);
    });

    await allure.step('2. Clicar Salvar (Design) e validar retorno pra aba Design do Modelo', async () => {
      // Botão Salvar da aba Design — clica o último submit ou Salvar visível.
      const saveBtn = page.locator('button').filter({ hasText: /^Salvar$/ }).last();
      await saveBtn.evaluate((el: HTMLButtonElement) => el.click());
      // Aguarda redirect pra /content_models/:id/edit (aba Design)
      await page.waitForURL(/\/content_models\/\d+\/edit/, { timeout: 20_000 });
    });

    await allure.step('3. Validar listagem atualizada com o novo Design', async () => {
      // Aguarda tab-design ativo
      await expect(page.locator('[data-test-id="tab-design"]')).toHaveAttribute(
        'aria-selected',
        'true',
        { timeout: 10_000 },
      );
      // Invariante: aparece o nome do design na listagem.
      // REVISAR: se a listagem usa virtual scrolling ou paginação, pode precisar
      // filtrar/scrollar até encontrar. Por ora, validamos presença textual direta.
      await expect(page.getByText(designName, { exact: true }).first()).toBeVisible({ timeout: 10_000 });
    });
  });
});
