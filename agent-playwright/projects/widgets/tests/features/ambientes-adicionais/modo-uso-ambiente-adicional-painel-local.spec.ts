// spec: projects/widgets/inputs/Analise_Teste_Paineis_Widgets.xml — Ambientes adicionais TC3
// seed: tests/seed.spec.ts
// Skill: testar-ambientes-adicionais-twygo + limpar-dados-de-teste-twygo

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { dismissCommonModals } from '../../../../../src/utils/modals.js';
import { getEnvByName } from '../../../../../src/utils/environment.js';
import { ADITIONAL_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { ambientesAdicionaisSharedData as shared } from './ambientes-adicionais.shared.data.js';
import { modoUsoAmbienteAdicionalPainelLocalData as data } from './modo-uso-ambiente-adicional-painel-local.data.js';

const aditional = getEnvByName(shared.aditionalEnvName);
const aditionalOrgId = aditional.orgId!;

test.use({
  storageState: ADITIONAL_STORAGE_PATH,
  baseURL: aditional.baseUrl,
  viewport: { width: 1920, height: 1080 },
});

test.describe('Ambientes adicionais', () => {
  let panelName: string | undefined;
  let useModeId: number | undefined;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `${data.panelNamePrefix} w${testInfo.workerIndex}-${Date.now()}`;
    const ctx = await browser.newContext({
      storageState: ADITIONAL_STORAGE_PATH,
      baseURL: aditional.baseUrl,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page, aditionalOrgId);
      // Criar painel local no env adicional (seed do TC3).
      await paineis.goToList();
      await paineis.createPanel({ name: panelName });

      // Descobrir useModeId existente no adicional via listagem.
      // Listagem usa `<tr data-item-id="{useModeId}">` (não link com href —
      // ver getModoDeUsoRowByName no POM). Twygo cria modos de uso default
      // (Colaborador/Aluno) ao provisionar env; pegamos o primeiro.
      await paineis.goToModosDeUso();
      const firstRow = page.locator('tbody tr[data-item-id]').first();
      await firstRow.waitFor();
      const rawId = await firstRow.getAttribute('data-item-id');
      if (!rawId) {
        throw new Error(
          `Não foi possível descobrir useModeId no env "${shared.aditionalEnvName}". ` +
            `Esperado: ao menos 1 modo de uso configurado.`,
        );
      }
      useModeId = Number(rawId);
    } finally {
      await ctx.close();
    }
  });

  test('Modo de uso configurado em ambiente adicional usa painel local', async ({
    page,
    step,
  }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Ambientes adicionais');
    await allure.story('Modo de uso configurado em ambiente adicional usa painel local');
    await allure.severity('minor');
    await allure.label('executionType', 'manual');

    expect(useModeId, 'useModeId discoverable no beforeAll').toBeDefined();
    expect(panelName, 'panelName criado no beforeAll').toBeDefined();

    const paineis = new PaineisListPage(page, aditionalOrgId);

    await step('1. Acessar a configuração de modo de uso no ambiente adicional', async () => {
      await page.goto(
        `/o/${aditionalOrgId}/use_modes/${useModeId}/use_mode_itens/new`,
      );
      await dismissCommonModals(page);
      await expect(paineis.getMenuItemPageModelSelect()).toBeVisible();
    });

    await step("2. Selecionar 'Painéis do usuário' e abrir dropdown 'Espaço'", async () => {
      await paineis.getMenuItemPageModelSelect().selectOption('user_panels');
      await expect(paineis.getMenuItemPanelChooser()).toBeVisible();

      await paineis.getMenuItemPanelChooser().click();
      const firstOption = page.locator('[id^="react-select-"][id$="-option-0"]').first();
      await firstOption.waitFor({ state: 'visible' });

      const optionTexts = await page
        .locator('[id^="react-select-"][id*="-option-"]')
        .allTextContents();

      // Invariante: dropdown contém o painel local criado no adicional.
      // Validação de isolamento (lista APENAS painéis do adicional) é
      // coberta por TC2 — aqui validamos a presença do local.
      expect(optionTexts.map((t) => t.trim())).toContain(panelName);

      // Nenhuma option vazia (placeholder bug)
      for (const text of optionTexts) {
        expect(text.trim().length).toBeGreaterThan(0);
      }
    });
  });

  test.afterAll(async ({ browser }) => {
    if (!panelName) return;
    const ctx = await browser.newContext({
      storageState: ADITIONAL_STORAGE_PATH,
      baseURL: aditional.baseUrl,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page, aditionalOrgId);
      await paineis.goToList();
      await paineis.deletePanelByNameSafe(panelName);
    } finally {
      await ctx.close();
    }
  });
});
