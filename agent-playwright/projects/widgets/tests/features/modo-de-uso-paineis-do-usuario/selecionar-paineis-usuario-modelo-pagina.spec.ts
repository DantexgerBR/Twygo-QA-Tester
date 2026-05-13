// spec: projects/widgets/specs/modo-de-uso-paineis-do-usuario-plan.md
// seed: tests/seed.spec.ts

// TC 1.1 — usa painel 'Painel Aluno' existente no env staging-widgets
// (evita orphan pollution). Cleanup via disassociatePanelFromMenu_safe
// no afterEach.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { dismissCommonModals } from '../../../../../src/utils/modals.js';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { selecionarPaineisUsuarioModeloPaginaData as data } from './selecionar-paineis-usuario-modelo-pagina.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Modo de uso - Painéis do usuário', () => {
  let itemName: string;

  test.afterEach(async ({ page }) => {
    if (itemName) {
      const paineis = new PaineisListPage(page);
      await paineis.disassociatePanelFromMenu_safe(data.panelName, data.useModeId, itemName);
    }
  });

  test("Selecionar 'Painéis do usuário' como modelo de página no modo de uso", async ({
    page,
    step,
  }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Modo de uso - Painéis do usuário');
    await allure.story("Selecionar 'Painéis do usuário' como modelo de página no modo de uso");
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const paineis = new PaineisListPage(page);
    itemName = `${data.itemNamePrefix} ${Date.now()}`.slice(0, 25);

    await step('1. Setup — navegar ao form de novo item de menu', async () => {
      await page.goto(`/o/${getOrgId()}/use_modes/${data.useModeId}/use_mode_itens/new`);
      await dismissCommonModals(page);

      await expect(paineis.getMenuItemNameInput()).toBeVisible();
      await expect(paineis.getMenuItemPageModelSelect()).toBeVisible();
      // Espaço só aparece após escolher user_panels
      await expect(paineis.getMenuItemPanelChooser()).toBeHidden();
    });

    await step('2. Preencher Nome do menu', async () => {
      await paineis.getMenuItemNameInput().fill(itemName);
      await expect(paineis.getMenuItemNameInput()).toHaveValue(itemName);
    });

    await step("3. Selecionar 'Painéis do usuário' no Modelo de página", async () => {
      await paineis.getMenuItemPageModelSelect().selectOption('user_panels');
      await expect(paineis.getMenuItemPanelChooser()).toBeVisible();
    });

    await step("4. Escolher 'Painel Aluno' no campo Espaço e salvar", async () => {
      // Abrir dropdown e filtrar pelo nome
      await paineis.getMenuItemPanelChooser().click();
      await paineis.getMenuItemPanelChooserInput().fill(data.panelName);

      // Selecionar primeira opção visível (filtrada)
      const firstOption = page.locator('[id^="react-select-"][id$="-option-0"]').first();
      await firstOption.click();

      await paineis.getMenuItemSubmitButton().click();

      // Redirect para /use_modes/{useModeId}/edit?tab=items
      await expect(page).toHaveURL(/\/use_modes\/\d+\/edit\?tab=items/);

      // Item aparece na tabela
      await expect(paineis.getMenuItemRowByName(itemName)).toBeVisible();
    });
  });
});
