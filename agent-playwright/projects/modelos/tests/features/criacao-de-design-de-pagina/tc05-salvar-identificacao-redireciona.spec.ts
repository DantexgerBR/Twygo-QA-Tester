import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { DesignPageEditPage } from '../../../pages/DesignPageEditPage.js';

test.describe('Criação de Design de Página', () => {
  const designName = `Design TC5 w${process.env.TEST_WORKER_INDEX ?? '0'}-${Date.now()}`;

  test('Salvar Identificação redireciona para aba Design', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Página');
    await allure.story('Salvar Identificação redireciona para aba Design');
    await allure.severity('critical');

    const dp = new DesignPageEditPage(page);

    await allure.step('1. Abrir tela de criação Página', async () => {
      await dp.gotoFromFirstModel();
    });

    await allure.step('2-3. Preencher Nome + Tipo "Corpo"', async () => {
      await dp.nameInput().fill(designName);
      await dp.selectTipo('Corpo');
    });

    await allure.step('4. Preencher Sequência = 1', async () => {
      await dp.sequenceInput().fill('1');
    });

    await allure.step('5. Salvar e validar redirect pra aba Design do próprio Design', async () => {
      await dp.save();
      // RN 34: redireciona pra aba Design do próprio design (não do modelo).
      // URL transita de /template_designs/new pra /template_designs/:id/edit (ou
      // similar com tab=design no query). Invariante: não está mais em /new.
      await Promise.race([
        page.waitForURL(/template_designs\/\d+/, { timeout: 15_000 }).catch(() => undefined),
        page.locator('.chakra-toast').filter({ hasText: /sucesso/i }).waitFor({ timeout: 15_000 }).catch(() => undefined),
      ]);
      await expect(page).not.toHaveURL(/template_designs\/new/);
    });
  });
});
