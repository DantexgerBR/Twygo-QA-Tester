// spec: projects/base-de-conhecimento/specs/feature-flag-habilitar-base-de-conhecimento-plan.md
// seed: projects/base-de-conhecimento/tests/features/listagem-basica-de-repositorios/tc1-acessar-listagem-via-menu-aprendizagem.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { ensureFlipperActor } from '../../../../../src/utils/flipperFlag.js';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { tc2FlagData as data } from './tc2-acesso-liberado-com-flag-habilitada.data.js';

test.describe('Feature flag habilitar_base_de_conhecimento', () => {
  let revertFlag: () => Promise<void> = async () => {};

  test.beforeAll(async ({ browser }) => {
    // Garante flag ON para a org. Se já estava ON (estado atual do env),
    // revert é no-op — idempotente.
    revertFlag = await ensureFlipperActor(browser, {
      envName: data.envName,
      storageStatePath: data.storageStatePath,
      flag: data.flagName,
      actor: `Organization;${getOrgId()}`,
      enabled: true,
    });
  });

  test.afterAll(async () => {
    await revertFlag();
  });

  // Gate real `base_de_conhecimento` está Fully Enabled global no env staging
  // (confirmado audit 2026-05-22). `ensureFlipperActor(enabled:true)` é no-op
  // idempotente quando flag já está globalmente ON — o cenário "flag ON pra esta
  // org" é satisfeito por consequência do estado global. Ver
  // outputs/base-de-conhecimento/auditoria-suite-feature-flag-20260522-082022.md.
  test('TC2 — Acesso liberado com feature flag habilitada', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Feature flag habilitar_base_de_conhecimento');
    await allure.story('TC2 — Acesso liberado com feature flag habilitada');
    await allure.severity('critical');

    const listPage = new KnowledgeRepositoryListPage(page);

    // Sidebar admin: link usa class "submenu-knowledge-repositories".
    // Sem `:visible` — em viewport 1280x720 (Playwright default) a seção pai
    // "Aprendizagem" inicia colapsada, mascarando o submenu mesmo com flag ON.
    // 2 locators: `sidebarAllLinks` p/ count (validação flag ON/OFF) e
    // `sidebarFirstLink` p/ click (precisa selecionar 1 nó, sem ambiguidade).
    const sidebarAllLinks = page.locator('a.submenu-knowledge-repositories');
    const sidebarFirstLink = sidebarAllLinks.first();

    // 1+2. Acessar Dashboard admin e verificar que o submenu aparece. Combinados
    //      num único expect.toPass porque o cache Twygo (Redis) + reload da
    //      sidebar dinâmica podem atrasar a propagação do toggle de flag por
    //      até ~90s entre runs sucessivas. Gotcha #2 da skill testar-feature-flag-twygo.
    //      `not.toHaveCount(0)` em vez de toBeAttached — mais robusto ao
    //      timing porque conta elementos sem state machine de "attachment".
    await allure.step('1+2. Acessar Dashboard admin e verificar que o submenu "Base de conhecimento" está presente', async () => {
      await expect(async () => {
        await safeGoto(page, `/o/${getOrgId()}${data.dashboardPath}`);
        await expect(sidebarAllLinks).not.toHaveCount(0, { timeout: 5_000 });
      }).toPass({ timeout: 120_000, intervals: [3_000, 5_000, 10_000, 15_000] });
    });

    // 3. Clicar no submenu "Base de conhecimento" e aguardar redirect
    await allure.step('3. Clicar no item de menu "Base de conhecimento" e aguardar redirect', async () => {
      // dispatchEvent: sidebar Twygo tem overlay que intercepta clicks normais —
      // mesma estratégia validada no TC1 de listagem (spec irmão desta suíte).
      await sidebarFirstLink.dispatchEvent('click');
      await expect(page).toHaveURL(data.listUrlPattern);
    });

    // 4. Verificar que a listagem de repositórios de conhecimento é exibida
    await allure.step('4. Verificar listagem de repositórios de conhecimento carregada', async () => {
      await expect(listPage.getListContainer()).toBeVisible();
    });
  });
});
