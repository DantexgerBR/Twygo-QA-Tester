// spec: testsuite "Trial (provisionamento e exclusão de dados)" → TC3
//       "Validar exclusão das informações pré-definidas da SophiaTech"
// seed: tests/seed.spec.ts
//
// ⚠️ DESTRUTIVO E IRREVERSÍVEL: zera os dados pré-definidos da SophiaTech na
// org Trial (37078). Após esta run, re-provisionar exige passos manuais
// (provisionar-trial-projeto-twygo: DB icp5 + unlock email). NÃO rodar como
// parte de regressivo automático sem intenção explícita.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { SophiaWidget } from '../../../../../src/pages/SophiaWidget.js';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { TRIAL } from './trial.shared.data.js';

const SUITE = 'Trial (provisionamento e exclusão de dados)';
const STORY = 'TC3 — Validar exclusão das informações pré-definidas da SophiaTech';

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

test.describe(SUITE, () => {
  test.use({
    baseURL: TRIAL.url,
    storageState: { cookies: [], origins: [] },
  });

  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'baseURL', description: TRIAL.url },
      { type: 'orgId', description: String(TRIAL.orgId) },
      { type: 'envLabel', description: 'trial-registros-externos (Trial registros-externos)' },
    );
    await page.goto('/users/login');
    await page.getByRole('textbox', { name: 'Login' }).fill(TRIAL.email);
    await page.getByRole('textbox', { name: 'Senha' }).fill(TRIAL.password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.waitForURL((url) => !url.pathname.startsWith('/users/login'), { timeout: 30_000 });
  });

  test('Validar exclusão das informações pré-definidas da SophiaTech', async ({ page, step }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story(STORY);
    await allure.severity('critical');

    const sophia = new SophiaWidget(page);
    let before: RecordStats;

    await step('Pré: estado inicial dos registros (seed SophiaTech presente)', async () => {
      before = await getStats(page);
      test.skip(
        before.by_status.emitted === 0,
        'Trial sem registros pré-definidos (emitidos=0) — re-provisione via provisionar-trial-projeto-twygo.',
      );
    });

    await step('1. Executar exclusão (Sophia → Excluir informações → SophiaTech)', async () => {
      // Widget Sophia só aparece em rota com layout de aluno/dashboard.
      await safeGoto(page, '/dashboard_students');
      await sophia.openDeleteModal();
      await sophia.selectOnly('sophiatech');
      await sophia.confirmDelete();
    });

    await step('2. Nenhum registro pré-definido da SophiaTech permanece (emitidos zeram/diminuem)', async () => {
      // Exclusão é assíncrona — invariante "emitidos diminuiu" com timeout tolerante.
      await expect(async () => {
        const after = await getStats(page);
        expect(
          after.by_status.emitted,
          `emitidos devem diminuir após exclusão SophiaTech (antes=${before.by_status.emitted})`,
        ).toBeLessThan(before.by_status.emitted);
      }).toPass({ timeout: 60_000 });
    });
  });
});
