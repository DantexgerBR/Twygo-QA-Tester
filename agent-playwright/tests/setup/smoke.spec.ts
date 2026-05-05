/**
 * Smoke test pré-planning (Fase 1.5 do CLAUDE.md).
 *
 * Roda em ~10s e valida que a infraestrutura básica está funcional:
 * 1. globalSetup conseguiu logar e gravou storageState válido
 * 2. baseURL responde
 * 3. Após o storageState, navegação direta a `/o/{orgId}/...` funciona sem
 *    re-login nem precisa de "trocar perfil" via UI
 * 4. CreditosIaSettingsPage container existe na URL alvo
 *
 * Falha aqui = NÃO prosseguir com planner/generator. O orchestrator chama
 * isso via `npm run agent:smoke` antes de Fase 3.
 */
import { test, expect } from '../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CreditosIaSettingsPage } from '../../src/pages/CreditosIaSettingsPage.js';

test.describe('Smoke — Infra Twygo', () => {
  test('Login global + navegação direta ao módulo Créditos de IA', async ({ page }) => {
    await allure.epic('Twygo - Infra');
    await allure.feature('Smoke');
    await allure.story('Login global + navegação direta');
    await allure.severity('blocker');

    await allure.step('Navegar direto à aba Configurações de Créditos de IA (sem passar por login)', async () => {
      await page.goto('/o/36602/ai_consumption_analysis?tab=settings');
      // Se a URL contém /users/login, o storageState não funcionou
      await expect(page).not.toHaveURL(/\/users\/login/);
    });

    await allure.step('Container da lista de ambientes está visível', async () => {
      const settingsPage = new CreditosIaSettingsPage(page);
      await expect(settingsPage.listContainer).toBeVisible({ timeout: 15_000 });
    });
  });
});
