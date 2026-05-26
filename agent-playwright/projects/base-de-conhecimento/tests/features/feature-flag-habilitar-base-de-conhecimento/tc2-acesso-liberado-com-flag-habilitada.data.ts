/**
 * Dados do TC2 — Acesso liberado com feature flag habilitada.
 *
 * Rota inicial: /o/{orgId}/dashboard (perfil admin).
 * Flag ON → link "Base de conhecimento" visível na sidebar.
 * Click no link → redirect para /knowledge_repositories + listagem carregada.
 */
import { resolve } from 'node:path';

export const tc2FlagData = {
  /** Nome do env alvo — deve existir em config/environment.json. */
  envName: 'staging-base-de-conhecimento',
  /** Storage do user com acesso /admin/manage/features (flag elevada). */
  storageStatePath: resolve(process.cwd(), 'outputs/.auth/storage.json'),
  /** Nome da feature flag em snake_case. */
  flagName: 'base_de_conhecimento',
  /** Rota do Dashboard admin. */
  dashboardPath: '/dashboard',
  /** Padrão de URL que confirma navegação para a listagem de repositórios. */
  listUrlPattern: /knowledge_repositories/,
} as const;
