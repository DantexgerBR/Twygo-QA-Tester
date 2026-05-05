// spec: specs/politica-creditos-ia-runner.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../src/fixtures/exploratory-fixture';
import * as allure from 'allure-js-commons';
import { dismissCommonModals } from '../../../src/utils/modals';
import { getOrgId } from '../../../src/utils/environment.js';

const ORG_ID = getOrgId();
const POLICY_PATH = `/o/${ORG_ID}/ai_consumption_analysis?tab=policy`;

test.describe('Permitir a visualização da política de créditos de IA + Runner', () => {
  test('Política de créditos de IA - agente de atendimento + RUNNER', async ({ page }) => {
    // 1. SETUP ALLURE
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Permitir a visualização da política de créditos de IA + Runner');
    await allure.story('Política de créditos de IA - agente de atendimento + RUNNER');
    await allure.severity('critical');

    // 2. NAVEGAÇÃO — storageState já carregado pelo global-setup; sem login manual
    await page.goto(POLICY_PATH);
    await dismissCommonModals(page);

    // 3. ATIVAR TAB — o tab "Extrato" é selecionado por padrão mesmo com ?tab=policy
    await page.getByRole('tab', { name: 'Política de créditos de IA' }).click();

    // Aguardar container da tabela ficar visível
    await expect(
      page.getByTestId('ai-consumption-analysis-ai-credits-policy-table-container'),
    ).toBeVisible();

    // 4. Verificar linha Agente de atendimento (ID=68) — soft expects p/ acumular
    // todos os mismatches no mesmo run em vez de parar no primeiro.
    // Título usa travessão U+2013: "Agente de atendimento – Resposta" — usa toContainText parcial
    await allure.step('1. Verificar linha Agente de atendimento', async () => {
      await expect.soft(page.getByTestId('ai-credits-policy-title-68')).toContainText(
        'Agente de atendimento',
      );
      await expect.soft(page.getByTestId('ai-credits-policy-credits-68')).toContainText('~3-10');
      await expect.soft(page.getByTestId('ai-credits-policy-description-68')).toContainText(
        'Cada resposta gerada pelo assistente virtual',
      );
    });
  });
});
