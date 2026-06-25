// spec: testsuite "Trial (provisionamento e exclusão de dados)" → TC1
//       "Validar feature de Registros em trial criado via URL"
// seed: tests/seed.spec.ts
//
// Roda contra a org Trial dedicada (37078) provisionada via fluxo de
// criação web (a URL de registro é o próprio artefato do passo 1 da AT —
// a Trial já existe e está provisionada, ver data/trial-env.json). O teste
// valida que a feature de Registros está OPERANTE na Trial e que um registro
// Externo pode ser criado pela UI.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { NovoRegistroExternoPage } from '../../../pages/NovoRegistroExternoPage.js';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { TRIAL } from './trial.shared.data.js';
import { buildTc1RecordInput } from './tc1-feature-registros-trial-via-url.data.js';

const SUITE = 'Trial (provisionamento e exclusão de dados)';
const STORY = 'TC1 — Validar feature de Registros em trial criado via URL';

interface RecordStats {
  by_status: { emitted: number; expired: number; pending: number; rejected: number };
  total_general: number;
}

async function getStats(page: import('@playwright/test').Page): Promise<RecordStats> {
  const res = await page.request.get(`/api/v1/o/${TRIAL.orgId}/records/stats`, {
    headers: { Accept: 'application/json' },
  });
  const j = await res.json();
  return (j?.data ?? j) as RecordStats;
}

async function listContents(page: import('@playwright/test').Page): Promise<string[]> {
  const res = await page.request.get(`/api/v1/o/${TRIAL.orgId}/records?per_page=200`, {
    headers: { Accept: 'application/json' },
  });
  const j = await res.json().catch(() => null);
  const arr = j && (Array.isArray(j.data) ? j.data : j.data?.records ?? j.records ?? []);
  return (Array.isArray(arr) ? arr : []).map((r: { content?: string }) => r.content ?? '');
}

test.describe(SUITE, () => {
  // Login explícito autorizado para Trial — globalSetup cobre só env principal/secundário
  // do projeto. Ver `testar-exclusao-dados-trial-twygo` §"Storage state da Trial".
  test.use({
    baseURL: TRIAL.url,
    storageState: { cookies: [], origins: [] },
  });

  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'baseURL', description: TRIAL.url },
      { type: 'orgId', description: String(TRIAL.orgId) },
      { type: 'emailRef', description: `\${${TRIAL.emailEnvVar}}` },
      { type: 'passwordRef', description: `\${${TRIAL.passwordEnvVar}}` },
      { type: 'envLabel', description: 'trial-registros-externos (Trial registros-externos)' },
    );
    await page.goto('/users/login');
    await page.getByRole('textbox', { name: 'Login' }).fill(TRIAL.email);
    await page.getByRole('textbox', { name: 'Senha' }).fill(TRIAL.password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.waitForURL((url) => !url.pathname.startsWith('/users/login'), { timeout: 30_000 });
  });

  test('Validar feature de Registros em trial criado via URL', async ({ page, step }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story(STORY);
    await allure.severity('critical');

    const data = buildTc1RecordInput(test.info().workerIndex);

    await step('1. Trial provisionada via URL — login do admin disponível', async () => {
      // O passo "criar org trial pela URL" é o provisionamento (data/trial-env.json).
      // Aqui validamos o seu efeito: o admin loga e a org responde.
      await safeGoto(page, `/o/${TRIAL.orgId}/records`);
      await expect(page).toHaveURL(new RegExp(`/o/${TRIAL.orgId}/records`));
    });

    await step('2. Tela Registros carrega com tabs Registros/Provedores + seed SophiaTech', async () => {
      await expect(page.getByRole('tab', { name: 'Registros' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Provedores' })).toBeVisible();
      // Seed pré-definido da SophiaTech presente: KPI de emitidos > 0.
      const stats = await getStats(page);
      expect(stats.by_status.emitted, 'Trial deve ter registros pré-definidos da SophiaTech (emitidos > 0)').toBeGreaterThan(0);
    });

    await step('3. Criar registro Externo pela UI → aparece na lista e KPIs atualizam', async () => {
      const before = await getStats(page);

      const form = new NovoRegistroExternoPage(page, TRIAL.orgId);
      await form.goto();
      await form.createExternalRecord({
        provider: data.provider,
        content: data.contentMarker,
        experience: data.experience,
        category: data.category,
        workload: data.workload,
        endDate: data.endDate,
      });

      // Redirecionou pra listagem; registro persistido e contagem subiu.
      await expect(page).toHaveURL(new RegExp(`/o/${TRIAL.orgId}/records`));
      await expect(async () => {
        const contents = await listContents(page);
        expect(contents, 'registro criado deve aparecer na listagem').toContain(data.contentMarker);
        const after = await getStats(page);
        expect(
          after.total_general,
          `total de registros deve aumentar (antes=${before.total_general})`,
        ).toBeGreaterThan(before.total_general);
      }).toPass({ timeout: 30_000 });
    });
  });
});
