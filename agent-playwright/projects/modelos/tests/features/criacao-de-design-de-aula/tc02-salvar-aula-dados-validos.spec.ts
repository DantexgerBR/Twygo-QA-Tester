import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { DesignLessonEditPage } from '../../../pages/DesignLessonEditPage.js';

test.describe('Criação de Design de Aula', () => {
  const designName = `Aula TC2 w${process.env.TEST_WORKER_INDEX ?? '0'}-${Date.now()}`;

  test('Salvar Aula com dados válidos', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Aula');
    await allure.story('Salvar Aula com dados válidos');
    await allure.severity('critical');

    const dl = new DesignLessonEditPage(page);

    await allure.step('1. Abrir tela de criação Aula', async () => {
      await dl.gotoFromFirstModel();
    });

    await allure.step('2-4. Preencher Nome + Tipo "Introdução" + Sequência', async () => {
      await dl.nameInput().fill(designName);
      await dl.selectTipo('Introdução');
      await dl.sequenceInput().fill('1');
    });

    await allure.step('5. Salvar e validar redirect pra aba Design da Aula', async () => {
      await dl.save();
      await Promise.race([
        page.waitForURL(/template_designs\/\d+/, { timeout: 15_000 }).catch(() => undefined),
        page.locator('.chakra-toast').filter({ hasText: /sucesso/i }).waitFor({ timeout: 15_000 }).catch(() => undefined),
      ]);
      await expect(page).not.toHaveURL(/template_designs\/new/);
    });
  });
});
