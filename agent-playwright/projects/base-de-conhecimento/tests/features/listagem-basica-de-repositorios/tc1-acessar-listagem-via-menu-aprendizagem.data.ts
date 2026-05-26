/**
 * Dados do TC1 — Acessar a listagem via menu Aprendizagem.
 *
 * Rota inicial de navegação: /play (Dashboard do aluno/admin).
 * Item de menu confirmado no recon (snapshot 2026-05-19): role=link,
 * name contém 'Base de conhecimento' — disponível diretamente na
 * sidebar sem agrupamento expansível intermediário.
 */
export const tc1Data = {
  // Rota admin canônica — /play vai pra perfil aluno (sem menu Base de conhecimento).
  // Confirmado via chrome-devtools-mcp (2026-05-19): sidebar admin existe em /o/{orgId}/dashboard.
  dashboardPath: '/dashboard',
  /** Padrão de URL que confirma navegação bem-sucedida para a listagem. */
  listUrlPattern: /knowledge_repositories/,
} as const;
