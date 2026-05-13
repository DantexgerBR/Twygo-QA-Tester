// Testsuite: Adicionar/editar aba
// TC1 — Acessar a tela de criação de painel.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { getOrgId } from '../../../../../src/utils/environment.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test('Acessar a tela de criação de painel', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story('Acessar a tela de criação de painel');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const paineis = new PaineisListPage(page);
    const painelForm = new PainelFormPage(page);

    await allure.step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
      await paineis.goToList();
      await expect(paineis.getAddButton()).toBeVisible();
    });

    await allure.step("2. Clicar no botão '+ Adicionar'", async () => {
      await paineis.getAddButton().click();
      await page.waitForURL(new RegExp(`/o/${getOrgId()}/panels/new`));
      await expect(page.getByRole('heading', { name: 'Adicionar painel' })).toBeVisible();
      await expect(painelForm.getIdentificacaoTab()).toHaveAttribute('aria-selected', 'true');
      await expect(painelForm.getLayoutsTab()).toBeDisabled();
    });
  });
});
