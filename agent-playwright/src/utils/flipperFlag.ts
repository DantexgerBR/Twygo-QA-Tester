import type { Browser } from '@playwright/test';
import { FlipperAdminPage } from '../pages/FlipperAdminPage.js';
import { getEnvByName } from './environment.js';

/**
 * Helpers para manipular feature flags Twygo via Flipper Admin UI
 * (`/admin/manage/features/<flag>`) em contexto fresco — sem poluir o
 * `page` do teste em execução.
 *
 * Por que contexto fresco e não a `page` da fixture do teste:
 *  - O storage state do teste (ex `staging-widgets-disabled` como Aluno)
 *    pode não ter acesso `/admin/manage/features`. Acesso ao Flipper
 *    requer user com flag de acesso elevado.
 *  - O baseURL do teste (host do tenant em teste) é o MESMO host onde
 *    o Flipper mora — não precisa env separado, mas o storageState
 *    pode ser distinto se o teste roda como Aluno e o toggle precisa
 *    de Admin.
 *  - Mexer no estado da flag DURANTE o teste polui evidências (network
 *    requests do toggle aparecem misturados com os do TC).
 *
 * Padrão de uso em spec:
 * ```ts
 * import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
 * import { ensureFlipperActor, restoreFlipperActor } from '../../../../../src/utils/flipperFlag.js';
 *
 * let revert: () => Promise<void>;
 *
 * test.beforeAll(async ({ browser }) => {
 *   revert = await ensureFlipperActor(browser, {
 *     envName: 'staging-widgets-disabled',
 *     storageStatePath: SECONDARY_STORAGE_PATH,
 *     flag: 'paineis_do_usuario_beta_test',
 *     actor: 'Organization;36989',
 *     enabled: true,
 *   });
 * });
 *
 * test.afterAll(async () => {
 *   await revert();
 * });
 * ```
 *
 * `ensureFlipperActor` retorna um callback `revert` que reverte
 * APENAS se o setup mudou estado — se a flag já estava no estado
 * desejado, `revert` é no-op. Isso evita undo acidental quando
 * múltiplos specs paralelos requerem o mesmo estado.
 */

export type FlipperFlagConfig = {
  /** Nome do env (ex `staging-widgets-disabled`). Usado pra resolver baseURL. */
  envName: string;
  /** Path absoluto do storageState de um user com acesso `/admin/manage/features`. */
  storageStatePath: string;
  /** Nome da feature flag em snake_case (ex `paineis_do_usuario_beta_test`). */
  flag: string;
  /** Actor no formato Flipper (`Organization;<orgId>`). */
  actor: string;
  /** Estado desejado. */
  enabled: boolean;
};

/**
 * Garante que `actor` está no estado `enabled` para a feature `flag` no env
 * `envName`. Idempotente: se já está no estado desejado, no-op + revert no-op.
 *
 * Retorna callback `revert` que deve ser chamado no `afterAll` para reverter
 * o estado original. Se nada foi mudado, `revert` é no-op.
 *
 * **Lida com flag em modo Fully Enabled global** (ex: `base_de_conhecimento`):
 *  - Se `enabled=true` e flag já está Fully Enabled global → no-op idempotente
 *    (o actor é redundante, todos os actors do banco já têm a feature).
 *  - Se `enabled=false` e flag está Fully Enabled global → primeiro força
 *    `Disable` (afeta TODAS as orgs do tenant!), depois sai. Revert restaura
 *    Fully Enabled. CUIDADO: outras orgs perdem a feature durante a janela.
 *    Use apenas quando o gate de produto não tem alternativa actor-based.
 */
export async function ensureFlipperActor(
  browser: Browser,
  config: FlipperFlagConfig,
): Promise<() => Promise<void>> {
  const env = getEnvByName(config.envName);
  const ctx = await browser.newContext({
    storageState: config.storageStatePath,
    baseURL: env.baseUrl,
  });
  const page = await ctx.newPage();
  let wasEnabled = false;
  let originalGlobalState: 'fully_enabled' | 'conditionally_enabled' | 'disabled' = 'disabled';
  let snapshotTaken = false;
  try {
    const flipper = new FlipperAdminPage(page);
    await flipper.gotoFeature(config.flag);

    originalGlobalState = await flipper.getGlobalState();
    wasEnabled = originalGlobalState === 'fully_enabled' || (await flipper.isActorEnabled(config.actor));
    snapshotTaken = true;

    // Se a flag está Fully Enabled global, actor-based toggle é inútil:
    //  - enabled:true  → no-op (todos os actors já enabled implicitamente)
    //  - enabled:false → precisa Disable global pra "esconder" da org alvo
    if (originalGlobalState === 'fully_enabled') {
      if (config.enabled) {
        await ctx.close();
        return async () => {};
      }
      // Disable global pra permitir testar estado OFF da org. Afeta tudo.
      await flipper.setGlobalState('disabled');
      await ctx.close();
      return async () => {
        await restoreFlipperGlobalState(browser, config, originalGlobalState);
      };
    }

    // Estado normal actor-based: usa add/remove actor.
    const changed = config.enabled
      ? await flipper.ensureActorEnabled(config.actor)
      : await flipper.ensureActorDisabled(config.actor);

    await ctx.close();

    if (!changed) {
      return async () => {};
    }

    return async () => {
      await restoreFlipperActor(browser, {
        ...config,
        enabled: wasEnabled,
      });
    };
  } catch (err) {
    await ctx.close().catch(() => null);
    // Setup falhou no meio. Tenta restaurar estado original num novo
    // contexto antes de propagar — evita state leak entre runs.
    if (snapshotTaken) {
      if (originalGlobalState === 'fully_enabled') {
        await restoreFlipperGlobalState(browser, config, originalGlobalState).catch(() => null);
      } else {
        await restoreFlipperActor(browser, {
          ...config,
          enabled: wasEnabled,
        }).catch(() => null);
      }
    }
    throw err;
  }
}

/**
 * Força o estado global da flag (Fully Enabled / Disabled) em contexto fresco.
 * Use em specs que precisam transicionar uma flag de gate global DURANTE
 * a execução do teste (ex: TC3 da suite feature-flag-habilitar-base-de-conhecimento).
 *
 * Diferente de `ensureFlipperActor`, NÃO retorna revert — caller é responsável
 * por restaurar estado original no afterAll. Use quando snapshot+revert já
 * está coberto por outra chamada (ex: o `ensureFlipperActor` do beforeAll).
 */
export async function setFlipperGlobalState(
  browser: Browser,
  config: {
    envName: string;
    storageStatePath: string;
    flag: string;
    targetState: 'fully_enabled' | 'disabled';
  },
): Promise<void> {
  const env = getEnvByName(config.envName);
  const ctx = await browser.newContext({
    storageState: config.storageStatePath,
    baseURL: env.baseUrl,
  });
  const page = await ctx.newPage();
  try {
    const flipper = new FlipperAdminPage(page);
    await flipper.gotoFeature(config.flag);
    await flipper.setGlobalState(config.targetState);
  } finally {
    await ctx.close();
  }
}

/**
 * Restaura o estado global da flag (Fully Enabled / Disabled). Usado pelo
 * revert quando `ensureFlipperActor` precisou mexer no estado global porque
 * a flag não tinha gate actor-based.
 */
async function restoreFlipperGlobalState(
  browser: Browser,
  config: FlipperFlagConfig,
  target: 'fully_enabled' | 'conditionally_enabled' | 'disabled',
): Promise<void> {
  // `conditionally_enabled` é equivalente a `disabled` no DOM (mesmo botão
  // exposto). O revert volta pra `disabled` neste caso, perdendo o histórico
  // de actors pré-existentes — não há API Flipper pra reconstruir estado
  // intermediário sem listar actors um a um. Aceitável porque o cenário
  // alvo (gate global) não usa actors em produção.
  if (target === 'conditionally_enabled') return;

  const env = getEnvByName(config.envName);
  const ctx = await browser.newContext({
    storageState: config.storageStatePath,
    baseURL: env.baseUrl,
  });
  const page = await ctx.newPage();
  try {
    const flipper = new FlipperAdminPage(page);
    await flipper.gotoFeature(config.flag);
    await flipper.setGlobalState(target);
  } finally {
    await ctx.close();
  }
}

/**
 * Força o estado do actor para `config.enabled`. Diferente de
 * `ensureFlipperActor`, NÃO retorna revert — use para teardown ou para
 * setup quando você gerencia o revert manualmente.
 */
export async function restoreFlipperActor(
  browser: Browser,
  config: FlipperFlagConfig,
): Promise<void> {
  const env = getEnvByName(config.envName);
  const ctx = await browser.newContext({
    storageState: config.storageStatePath,
    baseURL: env.baseUrl,
  });
  const page = await ctx.newPage();
  try {
    const flipper = new FlipperAdminPage(page);
    await flipper.gotoFeature(config.flag);
    if (config.enabled) {
      await flipper.ensureActorEnabled(config.actor);
    } else {
      await flipper.ensureActorDisabled(config.actor);
    }
  } finally {
    await ctx.close();
  }
}
