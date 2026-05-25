// spec: projects/widgets/inputs/Analise_Teste_Paineis_Widgets.xml — Ambientes adicionais TC1
// seed: tests/seed.spec.ts
// Skill: testar-ambientes-adicionais-twygo

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { getEnvByName } from '../../../../../src/utils/environment.js';
import { ADITIONAL_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { ambientesAdicionaisSharedData as shared } from './ambientes-adicionais.shared.data.js';

const aditional = getEnvByName(shared.aditionalEnvName);
const aditionalOrgId = aditional.orgId!;

test.use({
  storageState: ADITIONAL_STORAGE_PATH,
  baseURL: aditional.baseUrl,
  viewport: { width: 1920, height: 1080 },
});

test.describe('Ambientes adicionais', () => {
  test('Funcionalidade de Painéis em ambiente adicional', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Ambientes adicionais');
    await allure.story('Funcionalidade de Painéis em ambiente adicional');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const paineis = new PaineisListPage(page, aditionalOrgId);

    await step('1. Acessar Menu > Modos de uso no ambiente adicional', async () => {
      await paineis.openByMenu();
      await expect(paineis.getModosDeUsoTab()).toBeVisible();
    });

    await step("2. Verificar a aba 'Painéis' (exibida + listagem carrega)", async () => {
      await expect(paineis.getPaineisTab()).toBeVisible();
      await paineis.getPaineisTab().click();
      await page.waitForURL(/tab=panels-tab/);
      // Invariante "listagem carregada": botão Adicionar visível
      // (componente da listagem terminou de hidratar).
      await expect(paineis.getAddButton()).toBeVisible();
    });
  });
});
