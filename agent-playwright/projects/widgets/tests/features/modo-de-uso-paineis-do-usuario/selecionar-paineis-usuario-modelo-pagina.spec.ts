// spec: projects/widgets/specs/modo-de-uso-paineis-do-usuario-plan.md
// seed: tests/seed.spec.ts

// TC 1.1 — resolve dinamicamente o primeiro painel ATIVO disponível no
// dropdown de Espaço. Antes hardcodava 'Painel Aluno', mas o painel não
// existia no env staging-widgets (validação chrome-mcp 2026-05-14). Agora
// asserção é por invariante: "ao menos 1 painel ativo listado". Cleanup
// via disassociatePanelFromMenu_safe no afterEach, com o nome capturado.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { dismissCommonModals } from '../../../../../src/utils/modals.js';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { selecionarPaineisUsuarioModeloPaginaData as data } from './selecionar-paineis-usuario-modelo-pagina.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Modo de uso - Painéis do usuário', () => {
  let itemName: string;
  let selectedPanelName: string | undefined;

  test.afterEach(async ({ page }) => {
    if (itemName) {
      const paineis = new PaineisListPage(page);
      // panelName usado só pra logs internos quando itemName é passado.
      // Fallback descritivo se o capture não rodou (falha antes do step 4).
      await paineis.disassociatePanelFromMenu_safe(
        selectedPanelName ?? '(painel não capturado)',
        data.useModeId,
        itemName,
      );
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

    await step('4. Escolher primeiro painel disponível no campo Espaço e salvar', async () => {
      // Abrir dropdown SEM filtrar — pegamos o primeiro painel ativo disponível.
      // Asserção por invariante: o app expõe ao menos 1 painel ativo no listbox.
      await paineis.getMenuItemPanelChooser().click();

      const firstOption = page.locator('[id^="react-select-"][id$="-option-0"]').first();
      await firstOption.waitFor({ state: 'visible' });
      selectedPanelName = (await firstOption.textContent())?.trim() || undefined;
      await firstOption.click();

      await paineis.getMenuItemSubmitButton().click();

      // Redirect para /use_modes/{useModeId}/edit?tab=items
      await expect(page).toHaveURL(/\/use_modes\/\d+\/edit\?tab=items/);

      // Item aparece na tabela
      await expect(paineis.getMenuItemRowByName(itemName)).toBeVisible();
    });
  });
});
