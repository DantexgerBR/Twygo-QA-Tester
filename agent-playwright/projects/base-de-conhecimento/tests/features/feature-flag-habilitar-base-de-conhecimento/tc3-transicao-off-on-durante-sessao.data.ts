/**
 * Dados do TC3 — Transição off → on durante a sessão.
 *
 * Cenário: sessão começa com flag OFF; durante a sessão a flag é ativada
 * via Flipper-UI; após reload da página, o item deve aparecer no menu.
 *
 * Requer que o cache Twygo (Redis) propague o toggle. O spec usa
 * expect.toPass com retry + reload pra absorver o delay (até 60s conforme
 * skill testar-feature-flag-twygo — gotcha de cache propagation).
 */
import { resolve } from 'node:path';

export const tc3FlagData = {
  /** Nome do env alvo — deve existir em config/environment.json. */
  envName: 'staging-base-de-conhecimento',
  /** Storage do user com acesso /admin/manage/features (flag elevada). */
  storageStatePath: resolve(process.cwd(), 'outputs/.auth/storage.json'),
  /** Nome da feature flag em snake_case. */
  flagName: 'base_de_conhecimento',
  /** Rota do Dashboard admin. */
  dashboardPath: '/dashboard',
} as const;
