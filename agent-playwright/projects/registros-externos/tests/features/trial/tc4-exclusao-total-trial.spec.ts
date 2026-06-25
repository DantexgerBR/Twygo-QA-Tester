// spec: testsuite "Trial (provisionamento e exclusão de dados)" → TC4
//       "Validar exclusão total do trial (pré-definidas + criadas pelos admins)"
// seed: tests/seed.spec.ts
//
// ⚠️ DESTRUTIVO E IRREVERSÍVEL: zera TODOS os dados da org Trial (37078) —
// pré-definidos + criados pelo admin. Após esta run, re-provisionar exige
// passos manuais (provisionar-trial-projeto-twygo). NÃO rodar em regressivo
// automático sem intenção explícita.
//
// Cobertura: passos 1-2 da AT (criar registro+provedor pela UI → exclusão
// total) são automatizados aqui, com asserção UI de que tudo foi removido.
// O passo 3 (consulta no banco) é VALIDAÇÃO MANUAL / agent-db — ver step
// final, que anexa o SQL no schema REAL (events/*, NÃO learning_* — a AT
// descreve tabelas fictícias; memory `registros-externos-schema-real-events`).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { SophiaWidget } from '../../../../../src/pages/SophiaWidget.js';
import { NovoRegistroExternoPage } from '../../../pages/NovoRegistroExternoPage.js';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { TRIAL } from './trial.shared.data.js';

const SUITE = 'Trial (provisionamento e exclusão de dados)';
const STORY = 'TC4 — Validar exclusão total do trial (pré-definidas + criadas pelos admins)';

interface RecordStats {
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

  test('Validar exclusão total do trial (pré-definidas + criadas pelos admins)', async ({ page, step }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story(STORY);
    await allure.severity('critical');

    const stamp = `w${test.info().workerIndex}-${Date.now()}`;
    const sophia = new SophiaWidget(page);

    await step('1. Criar registro Externo + provedor novo pela UI', async () => {
      const form = new NovoRegistroExternoPage(page, TRIAL.orgId);
      await form.goto();
      await form.createExternalRecord({
        provider: `Provedor TC4 ${stamp}`, // provedor novo (event_source)
        content: `Registro TC4 ${stamp}`,
        experience: 'Curso',
        category: 'Tecnologia',
        workload: '10:00:00',
        endDate: '2026-05-10',
      });
      await expect(page).toHaveURL(new RegExp(`/o/${TRIAL.orgId}/records`));
    });

    await step('2. Executar exclusão TOTAL (Sophia → Excluir informações → Todas)', async () => {
      await safeGoto(page, '/dashboard_students');
      await sophia.openDeleteModal();
      await sophia.selectOnly('all');
      await sophia.confirmDelete();
    });

    await step('2b. UI confirma remoção total — nenhum registro permanece', async () => {
      await expect(async () => {
        const after = await getStats(page);
        expect(after.total_general, 'total de registros deve zerar após exclusão total').toBe(0);
      }).toPass({ timeout: 60_000 });
    });

    await step('3. Validação de banco (MANUAL / agent-db) — schema REAL events/*', async () => {
      // A AT descreve tabelas learning_* FICTÍCIAS. O schema real reusa
      // events/event_sources/event_participants (+ event_participant_evidences,
      // archives). Ver memory `registros-externos-schema-real-events`.
      const sql = [
        '-- Validação manual pós-exclusão total (org Trial 37078). Banco: MySQL.',
        '-- Esperado: 0 linhas em todas as queries.',
        "SET @org := 37078;",
        'SELECT COUNT(*) AS registros FROM events             WHERE organization_id = @org;',
        'SELECT COUNT(*) AS provedores FROM event_sources     WHERE organization_id = @org;',
        'SELECT COUNT(*) AS inscricoes FROM event_participants ep',
        '  JOIN events e ON e.id = ep.event_id WHERE e.organization_id = @org;',
        'SELECT COUNT(*) AS evidencias FROM event_participant_evidences epe',
        '  JOIN event_participants ep ON ep.id = epe.event_participant_id',
        '  JOIN events e ON e.id = ep.event_id WHERE e.organization_id = @org;',
      ].join('\n');
      await allure.attachment('validacao-db-manual-tc4.sql', sql, 'text/plain');
      test.info().annotations.push({
        type: 'manual-db',
        description: 'Passo 3 (consulta no banco) é validação manual / agent-db — ver attachment SQL.',
      });
    });
  });
});
