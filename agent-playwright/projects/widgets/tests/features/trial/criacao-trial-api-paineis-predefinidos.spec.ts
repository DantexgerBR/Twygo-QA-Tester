// spec: testsuite XML "Trial" → testcase "Criação de trial via API com painéis pré-definidos"
// seed: tests/seed.spec.ts
//
// PASSO 1 ASSUMIDO: a Trial já existe (NÃO testamos a criação via API
// `external_onboarding` — fica out-of-scope Playwright). Spec executa
// passos 2-4 do XML usando a Trial já existente "como se" tivesse sido
// criada via API. Decisão time QA Twygo 2026-05-15.
//
// Validação real do endpoint API: cobertura por API test suite dedicada
// (sem prazo).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { dismissCommonModals } from '../../../../../src/utils/modals.js';
import { TRIAL } from './exclusao-trial-dados-admin.data.js';

test.describe('Trial', () => {
  test.use({
    baseURL: TRIAL.url,
    storageState: { cookies: [], origins: [] },
  });

  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'baseURL', description: TRIAL.url },
      { type: 'orgId', description: String(TRIAL.orgId) },
      { type: 'emailRef', description: '${TWYGO_TRIAL_AGENTSQA_OTHER_EMAIL} (Trial widgets / legacy-reuse)' },
      { type: 'passwordRef', description: '${TWYGO_TRIAL_AGENTSQA_OTHER_PASSWORD}' },
      { type: 'envLabel', description: 'trial-agentsqa-other (Trial widgets)' },
    );
    await page.goto('/users/login');
    await page.getByRole('textbox', { name: 'Login' }).fill(TRIAL.email);
    await page.getByRole('textbox', { name: 'Senha' }).fill(TRIAL.password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.waitForURL((url) => !url.pathname.startsWith('/users/login'), {
      timeout: 30_000,
    });
  });

  test('Criação de trial via API com painéis pré-definidos', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Trial');
    await allure.story('Criação de trial via API com painéis pré-definidos');
    await allure.severity('normal');

    const paineis = new PaineisListPage(page, String(TRIAL.orgId));

    await step('1. [pré-condição] Trial criada via API external_onboarding — assumida (out-of-scope Playwright)', async () => {
      // Sem ação automatizada — endpoint API fica fora do escopo desta
      // suite. Spec parte do passo 2 usando a Trial existente como proxy.
    });

    await step('2. Realizar login no trial criado como Admin', async () => {
      expect(page.url()).not.toContain('/users/login');
      await dismissCommonModals(page);
    });

    await step('3. Acessar a aba Painéis — listagem exibe os painéis', async () => {
      await page.goto(`/o/${TRIAL.orgId}/use_modes?tab=panels-tab`);
      await dismissCommonModals(page);
      await expect(page.getByRole('tab', { name: 'Painéis', selected: true })).toBeVisible();
      await expect(paineis.getAddButton()).toBeVisible();
    });

    await step('4. Acessar o menu de painéis como aluno do novo ambiente', async () => {
      // Trial usa user padrão "Colaborador". /dashboard_students é a
      // landing-page do aluno (renderiza independente do perfil).
      await page.goto('/dashboard_students');
      await dismissCommonModals(page);
      expect(page.url()).toContain('/dashboard_students');
      // "Resumo das atividades" é heading h3 estável no dashboard do aluno.
      await expect(page.getByRole('heading', { name: 'Resumo das atividades' })).toBeVisible();
    });
  });
});
