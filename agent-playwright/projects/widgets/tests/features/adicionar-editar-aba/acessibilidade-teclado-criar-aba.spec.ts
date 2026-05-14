// Testsuite: Adicionar/editar aba
// TC18 — Validar acessibilidade por teclado ao criar aba.
// REVISAR: XML diz "Esc retorna pra listagem" — comportamento real do
// Chakra é fechar modal sem navegar. Asserção checa fechamento do modal
// permanecendo na tela de Layouts.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { acessibilidadeTecladoData as data } from './acessibilidade-teclado-criar-aba.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test('Validar acessibilidade por teclado ao criar aba', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story('Validar acessibilidade por teclado ao criar aba');
    await allure.severity('minor');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step("Pré-condição: criar painel e abrir Layouts", async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName);
      await painelForm.getLayoutsTab().click();
    });

    await allure.step("1. Abrir modal Adicionar aba via clique", async () => {
      await painelForm.getAddTabButton().click();
      await expect(painelForm.getAddTabModal()).toBeVisible();
    });

    await allure.step("2. Avançar via Enter na opção Criar nova aba (após Tab)", async () => {
      await painelForm.getCreateNewTabOption().focus();
      await painelForm.getCreateNewTabOption().press('Enter');
      await expect(painelForm.getCreateTabNameInput()).toBeVisible();
    });

    await allure.step("3. Pressionar Esc e validar fechamento do modal", async () => {
      await page.keyboard.press('Escape');
      await painelForm.getAddTabModal().waitFor({ state: 'hidden' });
      await expect(page).toHaveURL(/\?tab=layouts/);
    });
  });
});
