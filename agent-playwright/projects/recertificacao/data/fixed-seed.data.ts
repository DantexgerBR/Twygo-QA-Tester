/**
 * Sementes FIXAS pré-existentes no env staging-recertificacao (orgId 37048),
 * usadas como pré-condição estável por TCs que não conseguem usar seed
 * dinâmico via `beforeAll` (race condition entre browser.newContext do seed
 * e o `page` fixture do test — observada em Suite 01).
 *
 * Estratégia: cursos/recursos seed criados manualmente uma vez, mantidos
 * vivos no env entre runs. Se algum sumir (cleanup acidental), recriar via
 * MCP devtools/UI admin e atualizar o ID aqui.
 *
 * **NÃO deletar estes recursos do env staging-recertificacao** — múltiplos
 * specs dependem deles.
 *
 * Validado live 2026-05-27.
 */
export const fixedSeed = {
  /**
   * Curso vazio (sem participants/atividades) usado por TCs que apenas
   * precisam que a URL `/o/{orgId}/events/{id}/...` retorne 200 — ex:
   * filtro avançado de status, validação de presence de elementos UI.
   *
   * Criado via MCP em 2026-05-27 — "Validação seed via menu real".
   */
  emptyCursoId: 806852,

  /**
   * orgId principal do env staging-recertificacao. Embora `getOrgId()`
   * resolva isso dinamicamente, fica aqui pra docs.
   */
  principalOrgId: 37048,
} as const;
