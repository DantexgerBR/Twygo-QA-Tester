// Testsuite: Bloquear uso por não possuírem a funcionalidade habilitada no contrato
// Testcase: Bloquear quando não tem a funcionalidade "Agente de atendimento"
//           habilitada no contrato (importance=3)
//
// Cobertura parcial: step 1 do XML automatizado (toggle "Agente de atendimento"
// fica habilitável e funcional quando contrato tem a feature). Steps 2-4
// (modal "Ops!", botão Contato, troca de contrato) requerem ambiente com
// contrato sem a feature OU operação de troca de contrato — REVISAR_MANUAL.

import { test, expect } from '../../../src/fixtures/exploratory-fixture';
import * as allure from 'allure-js-commons';
import { dismissCommonModals } from '../../../src/utils/modals';
import { CreditosIaSettingsPage } from '../../../src/pages/CreditosIaSettingsPage';

const ENV_ID = 36799; // _Ambiente (independente)

test.describe('Bloquear uso por não possuírem a funcionalidade habilitada no contrato', () => {
  test('Bloquear quando não tem a funcionalidade "Agente de atendimento" habilitada no contrato', async ({ page }) => {
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Bloquear uso por não possuírem a funcionalidade habilitada no contrato');
    await allure.story('Bloquear quando não tem a funcionalidade "Agente de atendimento" habilitada no contrato');
    await allure.severity('critical');

    const settingsPage = new CreditosIaSettingsPage(page);
    // Toggle "Agente de atendimento" — o app não expõe data-test-id; localiza
    // via input id (estável: `supportAgentEnabled`) e o label adjacente.
    const supportAgentInput = page.locator('#supportAgentEnabled');
    const supportAgentLabel = page.locator('label[for="supportAgentEnabled"]')
      .or(page.getByText('Agente de atendimento', { exact: true }))
      .first();

    await page.goto('https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=settings');
    await dismissCommonModals(page);
    await expect(settingsPage.listContainer).toBeVisible();

    await allure.step(`1. Abrir edição do ambiente independente (envId=${ENV_ID})`, async () => {
      await settingsPage.openEnvironmentEdit(ENV_ID);
      await page.waitForURL((u) => u.toString().includes(`${ENV_ID}/edit_additional_organization_permissions`));
    });

    await allure.step('2. Validar que o toggle "Agente de atendimento" existe e NÃO está bloqueado por contrato', async () => {
      // Quando contrato tem a feature, o input fica não-disabled e o label clicável
      await expect.soft(supportAgentInput).toBeVisible();
      await expect.soft(supportAgentInput).not.toBeDisabled();
      await expect.soft(supportAgentLabel).toBeVisible();
    });

    await allure.step('3. Validar que clicar no toggle alterna o estado (interagível)', async () => {
      // Estado inicial — pode ser ON ou OFF dependendo de runs anteriores. Captura
      // pra restaurar no fim.
      const initialChecked = await supportAgentInput.isChecked();

      // Clica via label (input pode estar visualmente coberto pelo switch UI)
      await supportAgentLabel.click({ force: true });
      await expect.soft(supportAgentInput).toBeChecked({ checked: !initialChecked });

      // Restaura estado original (rollback): clica de novo. NÃO salva — só
      // alterna na UI. O teste não chama saveButton, então nada é persistido.
      await supportAgentLabel.click({ force: true });
      await expect.soft(supportAgentInput).toBeChecked({ checked: initialChecked });
    });

    // Steps 2-4 do XML — REVISAR_MANUAL:
    // - Step 2: requer contrato SEM "Agente de atendimento" → modal "Ops! Essa
    //   opção não está disponível no seu plano". Stage10 admin tem a feature.
    // - Step 3: clicar "Contato" abre chat HubSpot — depende do step 2.
    // - Step 4: troca de contrato (de um com feature pra um sem) e validar que
    //   toggle desabilita automaticamente — operação destrutiva, não factível.
  });
});
