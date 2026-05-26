import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

// FIXME (2026-05-21): user .env staging-base-de-conhecimento (agents.qa@claude.com)
// NÃO tem FLIPPER_ACCESS no env. Audit chrome-devtools-mcp:
//   GET /admin/manage/features/modelos_de_conteudo → 404 "page doesn't exist"
//   (mesmo logado como Admin).
// Sem FLIPPER_ACCESS é impossível togglar a flag em runtime via UI. Spec
// inteira (TC1/TC2/TC3) bloqueada até DBA/DevOps elevar o user OU criar
// user dedicado com flag elevada.
// Alternativas pra futuro: usar storageState secundário (claude@teste.com
// style) com acesso elevado, OU executar toggle via API direta server-side.
// Destinatário: QA Lead solicitar elevação do agents.qa@claude.com OU
// definir user com FLIPPER_ACCESS pro env base-de-conhecimento.
test.describe.fixme('Feature flag modelos_de_conteudo', () => {
  test('Acesso bloqueado com flag desabilitada', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Feature flag modelos_de_conteudo');
    await allure.story('Acesso bloqueado com flag desabilitada');
    await allure.severity('critical');

    // Implementação parcial (não roda enquanto user não tem FLIPPER_ACCESS):
    // 1. await ensureFlipperActor(browser, { envName: 'staging-base-de-conhecimento',
    //      flag: 'modelos_de_conteudo', actor: 'Organization;37007', enabled: false, ... })
    // 2. Logar como Admin + navegar /o/37007/dashboard
    // 3. Clicar menu lateral "Aprendizagem"
    // 4. Validar que NÃO há submenu "Modelos de conteúdo" (#menu a#content_models)
    await expect(page).toHaveURL(/dashboard/);
  });
});
