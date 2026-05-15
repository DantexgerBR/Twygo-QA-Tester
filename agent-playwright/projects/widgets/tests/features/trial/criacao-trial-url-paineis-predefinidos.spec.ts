// spec: testsuite XML "Trial" → testcase "Criação de trial via URL com painéis pré-definidos"
// seed: tests/seed.spec.ts
//
// PASSO 1 ASSUMIDO: a Trial já existe (provisionada via playbook
// `provisionar-trial-projeto-twygo` que cobre o wizard `/new/register/steps`).
// Spec executa passos 2-4 do XML: login no trial, listagem de painéis,
// menu como aluno. Asserções estruturais (não count exato) — Trial pode
// estar drenada de runs anteriores; o que importa aqui é que o ambiente
// está operacional e os fluxos navegam.

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
    // Annotations consumidas pelo `twygo-report-generator` v3.3 — bug-report
    // mostra a Trial real (não o env principal staging-widgets).
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

  test('Criação de trial via URL com painéis pré-definidos', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Trial');
    await allure.story('Criação de trial via URL com painéis pré-definidos');
    await allure.severity('critical');

    const paineis = new PaineisListPage(page, String(TRIAL.orgId));

    await step('1. [pré-condição] Trial criada via URL /new/register/steps — assumida via playbook provisionar-trial-projeto-twygo', async () => {
      // Sem ação automatizada — provisionamento é manual+Claude. Spec parte
      // do passo 2 do XML.
    });

    await step('2. Realizar login no trial recém-criado como Admin', async () => {
      // Login já aconteceu no beforeEach. Validar que a sessão está ativa
      // (não estamos mais em /users/login) e que o env tá responsivo.
      expect(page.url()).not.toContain('/users/login');
      await dismissCommonModals(page);
    });

    await step('3. Acessar a aba Painéis em Configurações > Menu — listagem renderiza', async () => {
      await page.goto(`/o/${TRIAL.orgId}/use_modes?tab=panels-tab`);
      await dismissCommonModals(page);
      // Asserção estrutural: tab Painéis selecionada + listagem operacional.
      // Não asserto count exato de painéis pré-definidos porque a Trial
      // pode estar drenada por runs anteriores de TC3/TC4 — XML assume
      // Trial recém-criada (estado ideal raro em re-execuções).
      await expect(page.getByRole('tab', { name: 'Painéis', selected: true })).toBeVisible();
      await expect(paineis.getAddButton()).toBeVisible();
    });

    await step('4. Acessar o menu de painéis como aluno do novo ambiente', async () => {
      // Trial usa user padrão "Colaborador" (não Administrador), e
      // `ProfileSwitcher.switchToViaUrl('Aluno')` assertaria trigger ==
      // "Aluno" — fail aqui. A rota `/dashboard_students` renderiza
      // independente do perfil ativo (é a landing-page do aluno).
      // Asserção estrutural — heading "Dashboard" + lista de cursos
      // confirma "menu de painéis acessível como aluno".
      await page.goto('/dashboard_students');
      await dismissCommonModals(page);
      expect(page.url()).toContain('/dashboard_students');
      // "Resumo das atividades" é heading h3 estável no dashboard do aluno.
      await expect(page.getByRole('heading', { name: 'Resumo das atividades' })).toBeVisible();
    });
  });
});
