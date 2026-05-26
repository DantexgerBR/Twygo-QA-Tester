// spec: projects/base-de-conhecimento/specs/feature-flag-habilitar-base-de-conhecimento-plan.md
// seed: projects/base-de-conhecimento/tests/features/listagem-basica-de-repositorios/tc1-acessar-listagem-via-menu-aprendizagem.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { ensureFlipperActor, setFlipperGlobalState } from '../../../../../src/utils/flipperFlag.js';
import { tc3FlagData as data } from './tc3-transicao-off-on-durante-sessao.data.js';

test.describe('Feature flag habilitar_base_de_conhecimento', () => {
  let revertFlag: () => Promise<void> = async () => {};

  test.beforeAll(async ({ browser }) => {
    // Estado inicial do cenário: flag OFF. Salva estado original para
    // restauração no afterAll, mesmo que o teste falhe no meio.
    revertFlag = await ensureFlipperActor(browser, {
      envName: data.envName,
      storageStatePath: data.storageStatePath,
      flag: data.flagName,
      actor: `Organization;${getOrgId()}`,
      enabled: false,
    });
  });

  test.afterAll(async () => {
    // Restaura estado original independentemente do resultado do teste.
    // Crítico: sem isso o env fica com flag NO estado oposto ao que estava,
    // quebrando runs subsequentes (estado Flipper é compartilhado entre runs).
    await revertFlag();
  });

  // IMPACTO COLATERAL: ver TC1 — `setGlobalState('disabled')` desabilita
  // `base_de_conhecimento` pra TODAS as orgs do tenant durante a janela
  // do teste. Step 2 re-habilita via `setGlobalState('fully_enabled')`,
  // que pode ser observado por outras orgs como flicker. afterAll garante
  // estado original mesmo se o teste falhar no meio.
  test('TC3 — Transição off → on durante a sessão', async ({ page, browser }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Feature flag habilitar_base_de_conhecimento');
    await allure.story('TC3 — Transição off → on durante a sessão');
    await allure.severity('normal');

    // Sem `:visible` — sidebar pode estar com seção "Aprendizagem" colapsada
    // em viewport 1280x720 (Playwright default), o que mascara o submenu
    // independente do estado da flag. Asserir DOM presence é o que a feature
    // flag controla.
    const sidebarLink = page.locator('a.submenu-knowledge-repositories');

    // 1. Iniciar sessão com flag desabilitada — item NÃO deve aparecer
    await allure.step('1. Iniciar sessão com flag desabilitada — submenu ausente no menu Aprendizagem', async () => {
      // expect.toPass absorve o delay de propagação inverso (cache servia
      // ON depois do TC2; setGlobalState('disabled') do beforeAll demora a
      // refletir no Twygo lookup). Mesmo padrão do step 3 — gotcha #2.
      await expect(async () => {
        await safeGoto(page, `/o/${getOrgId()}${data.dashboardPath}`);
        // flag OFF → item removido do DOM por completo (não apenas oculto via CSS)
        await expect(sidebarLink).toHaveCount(0, { timeout: 5_000 });
      }).toPass({ timeout: 120_000, intervals: [3_000, 5_000, 10_000, 15_000] });
    });

    // 2. Habilitar flag para a org via Flipper (contexto fresco — não polui a sessão do TC)
    await allure.step('2. Habilitar flag via Flipper-UI durante a sessão ativa', async () => {
      // Gate de `base_de_conhecimento` é global no Flipper — re-habilitar via
      // setGlobalState em vez de adicionar actor (que provavelmente não é
      // consultado pelo Rails). afterAll restaura estado original via revert
      // do beforeAll, então não passamos revert aqui.
      await setFlipperGlobalState(browser, {
        envName: data.envName,
        storageStatePath: data.storageStatePath,
        flag: data.flagName,
        targetState: 'fully_enabled',
      });
    });

    // 3. Recarregar a página e verificar que o item aparece após ativar a flag
    await allure.step('3. Recarregar a página e verificar submenu liberado', async () => {
      // expect.toPass absorve o delay de propagação do cache Twygo (Redis pode
      // atrasar até ~90s entre runs sucessivas que mexem na mesma flag). Retry
      // com safeGoto garante DOMContentLoaded limpo a cada tentativa.
      await expect(async () => {
        await safeGoto(page, `/o/${getOrgId()}${data.dashboardPath}`);
        // not.toHaveCount(0) é mais robusto que toBeAttached pra cache
        // propagation: conta elementos sem state machine de attachment.
        await expect(sidebarLink).not.toHaveCount(0, { timeout: 5_000 });
      }).toPass({ timeout: 120_000, intervals: [3_000, 5_000, 10_000, 15_000] });
    });
  });
});
