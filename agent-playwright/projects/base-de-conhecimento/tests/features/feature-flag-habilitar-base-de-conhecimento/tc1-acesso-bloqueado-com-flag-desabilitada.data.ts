/**
 * Dados do TC1 — Acesso bloqueado com feature flag desabilitada.
 *
 * Rota inicial: /o/{orgId}/dashboard (perfil admin).
 * Confirmado no recon (2026-05-19): /play não exibe o menu; sidebar admin
 * está em /o/{orgId}/dashboard.
 *
 * storageStatePath: caminho absoluto do storage de um user com flag elevada
 * para /admin/manage/features (necessário para ensureFlipperActor).
 * O user do env principal (staging-base-de-conhecimento) precisa ter flag
 * elevada — pré-condição documentada na skill testar-feature-flag-twygo.
 */
import { resolve } from 'node:path';

export const tc1FlagData = {
  /** Nome do env alvo — deve existir em config/environment.json. */
  envName: 'staging-base-de-conhecimento',
  /** Storage do user com acesso /admin/manage/features (flag elevada). */
  storageStatePath: resolve(process.cwd(), 'outputs/.auth/storage.json'),
  /** Nome da feature flag em snake_case. */
  flagName: 'base_de_conhecimento',
  /** Rota do Dashboard admin (não /play — perfil aluno não tem sidebar de base de conhecimento). */
  dashboardPath: '/dashboard',
} as const;
