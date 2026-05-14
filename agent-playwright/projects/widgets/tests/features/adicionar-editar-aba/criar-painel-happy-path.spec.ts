// Testsuite: Adicionar/editar aba
// TC2 — Criar painel com Nome e Descrição preenchidos (happy path).
// REVISAR: prosa XML diz que ao salvar redireciona pra listagem; comportamento
// real (observado live 2026-05-11): redireciona pra tela de edição /panels/{id}/edit.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { criarPainelHappyPathData as data } from './criar-painel-happy-path.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test('Criar painel com Nome e Descrição preenchidos (happy path)', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story('Criar painel com Nome e Descrição preenchidos (happy path)');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step("1. Acessar a tela de criação clicando em '+ Adicionar'", async () => {
      await painelForm.goToNew();
      await expect(painelForm.getIdentificacaoTab()).toHaveAttribute('aria-selected', 'true');
    });

    await allure.step("2. Preencher o campo 'Nome'", async () => {
      await painelForm.getNomeInput().fill(data.panelName);
      await expect(painelForm.getNomeInput()).toHaveValue(data.panelName);
    });

    await allure.step("3. Preencher o campo 'Descrição'", async () => {
      await painelForm.getDescricaoEditor().fill(data.description);
      await expect(painelForm.getDescricaoEditor()).toContainText(data.description);
    });

    await allure.step("4. Clicar no botão Salvar e validar redirect pra edição", async () => {
      await painelForm.getSaveButton().click();
      await page.waitForURL(/\/panels\/\d+\/edit/);
      await expect(painelForm.getLayoutsTab()).toBeEnabled();
    });

    await allure.step("5. Clicar na aba 'Layouts' e validar aba 'Nova aba'", async () => {
      await painelForm.getLayoutsTab().click();
      await expect(painelForm.getLayoutsTab()).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByText('Nova aba', { exact: true })).toBeVisible();
    });
  });
});
