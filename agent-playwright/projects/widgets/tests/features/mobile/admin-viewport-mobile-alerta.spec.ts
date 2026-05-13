// spec: testsuite XML
// seed: tests/seed.spec.ts

// Admin acessa /panels/{id}/edit?tab=layouts em viewport mobile e
// valida que o alerta de "modo Mobile" aparece + switch fica disabled.
// Não confunde com TC 1.3 da suite layout-das-abas (lá o admin TROCA
// pra Mobile via botão; aqui o viewport É mobile desde o início).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { adminViewportMobileAlertaData as data } from './admin-viewport-mobile-alerta.data.js';

// Viewport admin mobile típico: 414x896
test.use({ viewport: { width: 414, height: 896 } });

test.describe('Mobile', () => {
  test('Acesso do Admin pelo viewport Mobile - exibição do alerta', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Mobile');
    await allure.story('Acesso do Admin pelo viewport Mobile - exibição do alerta');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await step('1. Criar painel + abrir aba Layouts em viewport mobile', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName);
      await painelForm.goToEdit(panelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }
    });

    await step('2. Verificar alerta de modo Mobile visível', async () => {
      const alert = page.getByTestId('widgets-grid-view-alert');
      await expect(alert).toBeVisible();
      await expect(alert).toContainText(data.mobileAlertText);
    });

    await step("3. Verificar switch 'Permitir reorganizar widgets' desabilitado", async () => {
      const switchInput = page
        .getByTestId('widgets-grid-reorganize-switch')
        .locator('input[type="checkbox"]');
      await expect(switchInput).toBeDisabled();
      // REVISAR: tooltip 'Edição disponível apenas no modo Desktop' (verificar via hover quando relevante)
    });
  });
});
