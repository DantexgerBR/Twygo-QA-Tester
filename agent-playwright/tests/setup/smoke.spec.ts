/**
 * Smoke test pré-planning (Fase 1.5 do CLAUDE.md).
 *
 * Roda em ~10s e valida que a infraestrutura básica está funcional:
 * 1. globalSetup conseguiu logar e gravou storageState válido
 * 2. baseURL responde
 * 3. Storage de sessão é aceito (não redireciona para /users/login)
 * 4. Landing autenticada padrão Twygo (`/play`) carrega
 *
 * Falha aqui = NÃO prosseguir com planner/generator. O orchestrator chama
 * isso via `npm run agent:smoke` antes de Fase 3.
 *
 * REGRA: este smoke é UNIVERSAL (infra Twygo genérica). NÃO importar Page
 * Objects específicos de projeto nem navegar para rotas de feature — smoke
 * de feature pertence aos specs do próprio projeto.
 */
import { test, expect } from '../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { safeGoto } from '../../src/utils/modals.js';

test.describe('Smoke — Infra Twygo', () => {
  test('Login global aceita storageState e landing pós-login carrega', async ({ page }) => {
    await allure.epic('Twygo - Infra');
    await allure.feature('Smoke');
    await allure.story('Login global + landing pós-login');
    await allure.severity('blocker');

    await allure.step('Acessar landing pós-login (`/play?menu_id=play`)', async () => {
      // Twygo redireciona pós-login para /play?menu_id=play (CLAUDE.md §7.5).
      // safeGoto: domcontentloaded + dismissCommonModals — NPS Sofia bloqueia
      // o evento `load` de firar se ainda não foi respondida. Regra dura
      // do CLAUDE.md raiz §"page.goto + dismissCommonModals".
      await safeGoto(page, '/play?menu_id=play');
    });

    await allure.step('Sessão é aceita — não cai em /users/login', async () => {
      // Se storageState global falhou, app redireciona para a tela de login.
      await expect(page).not.toHaveURL(/\/users\/login/);
    });

    await allure.step('URL final está dentro do contexto autenticado (/play)', async () => {
      await expect(page).toHaveURL(/\/play/);
    });
  });
});
