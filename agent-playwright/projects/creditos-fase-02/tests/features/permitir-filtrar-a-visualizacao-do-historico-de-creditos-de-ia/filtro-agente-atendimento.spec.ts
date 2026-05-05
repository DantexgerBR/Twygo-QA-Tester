// Testsuite: Permitir filtrar a visualização do histórico de créditos de IA
// Testcase: Filtrar a visualização do agente de atendimento (XML importance=3)
//
// REVISAR steps 2 e 3 (XML): ambiente herdado/independente — requer geração
// de registros em ambientes adicionais e cross-environment validation. Pulado.
// REVISAR tipos "Aplicar e Salvar / Salvar": ver comentário no spec irmão
// (filtro-indexacao-conteudo.spec.ts) — UI atual expõe só "Aplicar" no rodapé.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { dismissCommonModals } from '../../../../../src/utils/modals.js';
import { getOrgId } from '../../../../../src/utils/environment.js';

const ORG_ID = getOrgId();
const EXTRACT_PATH = `/o/${ORG_ID}/ai_consumption_analysis`;

test.describe('Permitir filtrar a visualização do histórico de créditos de IA', () => {
  test('Filtrar a visualização do agente de atendimento', async ({ page }) => {
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Permitir filtrar a visualização do histórico de créditos de IA');
    await allure.story('Filtrar a visualização do agente de atendimento');
    await allure.severity('critical');

    await page.goto(EXTRACT_PATH);
    await dismissCommonModals(page);

    await expect(page.getByRole('tab', { name: 'Extrato' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('heading', { name: 'Histórico de créditos' })).toBeVisible();

    await allure.step('1. Abrir painel "Lista de filtros"', async () => {
      await page.getByRole('button', { name: /Filtro/i }).first().click();
      await expect(page.getByText('Lista de filtros').first()).toBeVisible();
    });

    await allure.step('2. Validar grupos de filtros (padrão / compartilhados / meus)', async () => {
      await expect.soft(page.getByRole('button', { name: /Filtros padrão/i })).toBeVisible();
      await expect.soft(page.getByRole('button', { name: /Filtros compartilhados/i })).toBeVisible();
      await expect.soft(page.getByRole('button', { name: /Meus filtros/i })).toBeVisible();
    });

    await allure.step('3. Validar botão "Aplicar" no rodapé do painel', async () => {
      await expect.soft(page.getByRole('button', { name: /^Aplicar$/i }).first()).toBeVisible();
    });

    await allure.step('4. Validar referência ao filtro "Agente de atendimento" (na tabela ou painel)', async () => {
      const visible = await page.getByText('Agente de atendimento').first().isVisible().catch(() => false);
      expect.soft(visible).toBe(true);
    });
  });
});
