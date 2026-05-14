// Testsuite: Adicionar/editar aba
// TC12 — Cancelar criação de nova aba a partir da seleção de tipo.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { cancelarCriacaoNovaAbaData as data } from './cancelar-criacao-nova-aba.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test('Cancelar criação de nova aba a partir da seleção de tipo', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story('Cancelar criação de nova aba a partir da seleção de tipo');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await allure.step("Pré-condição: criar painel e abrir Layouts", async () => {
      await painelForm.goToNew();
      await painelForm.createPanel(data.panelName);
      await painelForm.getLayoutsTab().click();
    });

    await allure.step("1. Abrir modal Adicionar aba", async () => {
      await painelForm.getAddTabButton().click();
      await expect(painelForm.getAddTabModal()).toBeVisible();
    });

    await allure.step("2. Clicar em Cancelar e validar fechamento sem nova aba", async () => {
      await painelForm.getAddTabTypeCancel().click();
      await painelForm.getAddTabModal().waitFor({ state: 'hidden' });
      const tabs = await page.getByText('Nova aba', { exact: true }).count();
      expect(tabs).toBe(1);
    });
  });
});
