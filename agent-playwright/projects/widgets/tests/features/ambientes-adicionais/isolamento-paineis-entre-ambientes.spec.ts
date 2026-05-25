// spec: projects/widgets/inputs/Analise_Teste_Paineis_Widgets.xml — Ambientes adicionais TC2
// seed: tests/seed.spec.ts
// Skill: testar-ambientes-adicionais-twygo + limpar-dados-de-teste-twygo (cleanup cross-env)

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { resolve } from 'node:path';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { getEnvByName } from '../../../../../src/utils/environment.js';
import { ADITIONAL_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { ambientesAdicionaisSharedData as shared } from './ambientes-adicionais.shared.data.js';
import { isolamentoPaineisEntreAmbientesData as data } from './isolamento-paineis-entre-ambientes.data.js';

const principal = getEnvByName(shared.principalEnvName);
const principalOrgId = principal.orgId!;
const aditional = getEnvByName(shared.aditionalEnvName);
const aditionalOrgId = aditional.orgId!;

// Storage do principal — globalSetup grava em outputs/.auth/storage.json (default).
const PRINCIPAL_STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');

// Spec roda primariamente NO ADICIONAL (asserção de ausência). Setup/cleanup
// usam contextos separados pro principal (onde o painel é criado/deletado).
test.use({
  storageState: ADITIONAL_STORAGE_PATH,
  baseURL: aditional.baseUrl,
  viewport: { width: 1920, height: 1080 },
});

test.describe('Ambientes adicionais', () => {
  let panelName: string | undefined;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `${data.panelNamePrefix} w${testInfo.workerIndex}-${Date.now()}`;
    const ctx = await browser.newContext({
      storageState: PRINCIPAL_STORAGE_PATH,
      baseURL: principal.baseUrl,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page); // org default = principal (36988)
      await paineis.goToList();
      await paineis.createPanel({ name: panelName });
    } finally {
      await ctx.close();
    }
  });

  test('Painéis criados no ambiente principal não são exibidos no ambiente adicional', async ({
    page,
    step,
  }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Ambientes adicionais');
    await allure.story('Painéis criados no ambiente principal não são exibidos no ambiente adicional');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    const paineis = new PaineisListPage(page, aditionalOrgId);

    await step("1. Acessar a aba 'Painéis' no ambiente adicional", async () => {
      await paineis.goToList();
      await expect(paineis.getAddButton()).toBeVisible();
    });

    await step("2. Validar AUSÊNCIA do painel do principal no adicional", async () => {
      // Asserção forte: row com data-item-name exato do painel criado no
      // principal não existe na listagem do adicional. Isolamento de dados (R1).
      await expect(paineis.getRowByItemName(panelName!)).toHaveCount(0);
    });
  });

  test.afterAll(async ({ browser }) => {
    if (!panelName) return;
    const ctx = await browser.newContext({
      storageState: PRINCIPAL_STORAGE_PATH,
      baseURL: principal.baseUrl,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      await paineis.goToList();
      await paineis.deletePanelByNameSafe(panelName);
    } finally {
      await ctx.close();
    }
  });
});

// Anti-pattern B exception: principalOrgId é consumido apenas via getEnvByName
// (helper centralizado em src/utils/environment.ts). Os literais 36988/37002
// vivem só em config/environment.json — specs só conhecem os nomes dos envs
// via shared.data.ts.
void principalOrgId;
