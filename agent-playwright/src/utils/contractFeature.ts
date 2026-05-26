import type { Browser } from '@playwright/test';
import { SuperAdminPage } from '../pages/SuperAdminPage.js';
import { getEnvByName } from './environment.js';

/**
 * Helpers para manipular funcionalidades de contrato Twygo via Super Admin
 * (`/admin/edit_sys_subscription_settings/<orgId>` → Contratos → Vigente →
 * Editar → checkbox + Salvar) em contexto fresco — sem poluir o `page` do
 * teste em execução.
 *
 * Plan/contrato é gate **independente** do Flipper feature flag. Features
 * como `user_panels` (Painéis do usuário) exigem AMBOS ligados pra
 * funcionar end-to-end. Ver skill `alterar-funcionalidade-contrato-twygo`.
 *
 * Padrão de uso (gating duplo — plan + flag):
 * ```ts
 * test.beforeAll(async ({ browser }) => {
 *   revertContract = await ensureContractFeature(browser, {
 *     envName: 'staging-widgets-disabled',
 *     storageStatePath: SECONDARY_STORAGE_PATH,
 *     orgId: 36989,
 *     feature: 'user_panels',
 *     enabled: true,
 *   });
 *   revertFlag = await ensureFlipperActor(browser, { ... });
 * });
 *
 * test.afterAll(async () => {
 *   await revertFlag();      // ordem inversa
 *   await revertContract();
 * });
 * ```
 */

export type ContractFeatureConfig = {
  /** Nome do env (ex `staging-widgets-disabled`). Resolve baseURL. */
  envName: string;
  /** Path absoluto do storageState de user com acesso `/admin`. */
  storageStatePath: string;
  /** Id da org (orgId do tenant). */
  orgId: string | number;
  /** Nome técnico da feature (ex `user_panels`, `ai_sync_content`). */
  feature: string;
  /** Estado desejado. */
  enabled: boolean;
};

/**
 * Garante que `feature` está no estado `enabled` no contrato Vigente da
 * `orgId`. Idempotente: no-op se já está. Retorna callback `revert` que
 * restaura estado original (no-op se nada foi mudado).
 */
export async function ensureContractFeature(
  browser: Browser,
  config: ContractFeatureConfig,
): Promise<() => Promise<void>> {
  const env = getEnvByName(config.envName);
  const ctx = await browser.newContext({
    storageState: config.storageStatePath,
    baseURL: env.baseUrl,
  });
  const page = await ctx.newPage();
  let wasEnabled = false;
  let didChange = false;
  try {
    const admin = new SuperAdminPage(page);
    const { changed, wasEnabled: prev } = await admin.setContractFunctionality(
      config.orgId,
      config.feature,
      config.enabled,
    );
    wasEnabled = prev;
    didChange = changed;
    await ctx.close();
    if (!didChange) return async () => {};
    return async () => {
      await restoreContractFeature(browser, { ...config, enabled: wasEnabled });
    };
  } catch (err) {
    await ctx.close().catch(() => null);
    // Setup falhou. Se já mudamos algo, restaura. Se não, nada a fazer.
    if (didChange) {
      await restoreContractFeature(browser, { ...config, enabled: wasEnabled }).catch(() => null);
    }
    throw err;
  }
}

/**
 * Força o estado da funcionalidade. Use para teardown manual.
 */
export async function restoreContractFeature(
  browser: Browser,
  config: ContractFeatureConfig,
): Promise<void> {
  const env = getEnvByName(config.envName);
  const ctx = await browser.newContext({
    storageState: config.storageStatePath,
    baseURL: env.baseUrl,
  });
  const page = await ctx.newPage();
  try {
    const admin = new SuperAdminPage(page);
    await admin.setContractFunctionality(config.orgId, config.feature, config.enabled);
  } finally {
    await ctx.close().catch(() => null);
  }
}
