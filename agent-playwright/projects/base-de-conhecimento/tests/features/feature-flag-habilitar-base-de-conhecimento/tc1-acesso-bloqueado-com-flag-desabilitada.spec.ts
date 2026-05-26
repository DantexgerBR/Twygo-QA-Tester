// spec: projects/base-de-conhecimento/specs/feature-flag-habilitar-base-de-conhecimento-plan.md
// seed: projects/base-de-conhecimento/tests/features/listagem-basica-de-repositorios/tc1-acessar-listagem-via-menu-aprendizagem.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { ensureFlipperActor } from '../../../../../src/utils/flipperFlag.js';
import { tc1FlagData as data } from './tc1-acesso-bloqueado-com-flag-desabilitada.data.js';

test.describe('Feature flag habilitar_base_de_conhecimento', () => {
  let revertFlag: () => Promise<void> = async () => {};

  test.beforeAll(async ({ browser }) => {
    // Desabilita flag para a org antes do teste; revert no afterAll garante
    // que o estado não vaza para outras runs mesmo que o teste falhe no meio.
    revertFlag = await ensureFlipperActor(browser, {
      envName: data.envName,
      storageStatePath: data.storageStatePath,
      flag: data.flagName,
      actor: `Organization;${getOrgId()}`,
      enabled: false,
    });
  });

  test.afterAll(async () => {
    await revertFlag();
  });

  // IMPACTO COLATERAL: `base_de_conhecimento` é Fully Enabled global no
  // tenant — não tem gate actor-based. O `beforeAll` aciona `setGlobalState
  // ('disabled')` em `ensureFlipperActor`, o que desabilita a feature pra
  // TODAS as orgs do stage10 durante a janela do teste (~30s até afterAll
  // restaurar Fully Enabled). Auditoria 2026-05-22 documentou que essa é a
  // única forma de testar o cenário OFF com a arquitetura atual da flag.
  // Roadmap: pedir produto criar gate actor-based dedicado.
  test('TC1 — Acesso bloqueado com feature flag desabilitada', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Feature flag habilitar_base_de_conhecimento');
    await allure.story('TC1 — Acesso bloqueado com feature flag desabilitada');
    await allure.severity('critical');

    // Sidebar admin confirmada no recon (2026-05-19): link usa class
    // "submenu-knowledge-repositories". Aparece 2× no DOM (desktop + mobile
    // colapsado). Sem `:visible` — em viewport 1280x720 (Playwright default)
    // a seção pai "Aprendizagem" inicia colapsada, mascarando o submenu mesmo
    // com flag ON. Asserir DOM presence é o que a feature flag de fato
    // controla; visibilidade depende de estado de UI ortogonal.
    const sidebarLink = page.locator('a.submenu-knowledge-repositories');

    // 1. Desabilitar flag para a org via Flipper-UI e acessar o Dashboard admin
    await allure.step('1. Desabilitar flag e acessar o Dashboard admin', async () => {
      await safeGoto(page, `/o/${getOrgId()}${data.dashboardPath}`);
    });

    // 2. Verificar que o item "Base de conhecimento" NÃO aparece no menu lateral
    await allure.step('2. Verificar que o submenu "Base de conhecimento" não é exibido', async () => {
      // toHaveCount(0) é mais robusto que toBeHidden quando a flag desabilitada
      // remove o elemento do DOM por completo (não apenas o oculta via CSS).
      await expect(sidebarLink).toHaveCount(0);
    });
  });
});
