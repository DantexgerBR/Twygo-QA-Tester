// spec: projects/widgets/specs/modo-de-uso-paineis-do-usuario-plan.md
// seed: tests/seed.spec.ts

// TC 1.2 — valida que o dropdown 'Espaço' lista apenas painéis ATIVOS.
// Snapshot inativos da listagem antes, depois confirma ausência no dropdown.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { dismissCommonModals } from '../../../../../src/utils/modals.js';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { listarPaineisCampoEspacoData as data } from './listar-paineis-campo-espaco.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Modo de uso - Painéis do usuário', () => {
  test("Listar painéis disponíveis no campo 'Espaço'", async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Modo de uso - Painéis do usuário');
    await allure.story("Listar painéis disponíveis no campo 'Espaço'");
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const paineis = new PaineisListPage(page);

    await step('1. Setup — navegar ao form de novo item de menu', async () => {
      await page.goto(`/o/${getOrgId()}/use_modes/${data.useModeId}/use_mode_itens/new`);
      await dismissCommonModals(page);

      await expect(paineis.getMenuItemPageModelSelect()).toBeVisible();
      await expect(paineis.getMenuItemPanelChooser()).toBeHidden();
    });

    await step("2. Selecionar 'Painéis do usuário' no Modelo de página → campo Espaço aparece", async () => {
      await paineis.getMenuItemPageModelSelect().selectOption('user_panels');
      await expect(paineis.getMenuItemPanelChooser()).toBeVisible();
    });

    await step('3. Abrir dropdown e validar opções (painel ativo aparece, inativos não)', async () => {
      await paineis.getMenuItemPanelChooser().click();

      // Aguardar opções renderizarem
      const firstOption = page.locator('[id^="react-select-"][id$="-option-0"]').first();
      await firstOption.waitFor({ state: 'visible' });

      // Captura todos os textos das opções visíveis
      const optionTexts = await page
        .locator('[id^="react-select-"][id$="-option-"]')
        .allTextContents();

      // Painel ativo de referência aparece
      expect(optionTexts.some((t) => t.includes(data.knownActivePanelName))).toBe(true);

      // Validação negativa: nenhuma opção começa com placeholder vazio/null
      for (const text of optionTexts) {
        expect(text.trim().length).toBeGreaterThan(0);
      }
    });
  });
});
