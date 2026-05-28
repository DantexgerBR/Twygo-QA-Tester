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
   * Curso 807287 ("curso para reinscriçao") com seed REPLACED preparada:
   * Richard Sebold (user_id 4294804) tem 5 inscrições (recert_num 0-4).
   * Em 2026-05-28 emitimos certs sucessivos via UI admin nas inscrições
   * recert_num=0 e recert_num=1 — resultado: recert_num=0 (id 44274543)
   * ficou com certificate_situation=4 (REPLACED / Substituído), e
   * recert_num=1 (id 44274544) ficou com certificate_situation=2
   * (Emitido). Pré-condição da Suite 09 Filtro Avançado Status
   * Substituído.
   *
   * Critério de aprovação do curso exige Frequência 100% — então NÃO
   * inativar a Chamada criada em 2026-05-28 nem mexer no critério, OU a
   * seed REPLACED é invalidada.
   */
  cursoComSubstituidoId: 807287,

  /**
   * orgId principal do env staging-recertificacao. Embora `getOrgId()`
   * resolva isso dinamicamente, fica aqui pra docs.
   */
  principalOrgId: 37048,

  // ==========================================================================
  // Seed da suite "Reinscrição via API V2" (tests/api/)
  // Validado live 2026-05-28: cursos pre-existentes na org 37048 (todos sem
  // has_recertification ainda — feature aguarda dev shippar). Quaisquer 2 dos
  // 3 cursos abaixo servem para validar o PIPELINE (URL, body, schema).
  //
  //   806755 — "Construindo times de alta performance"
  //   806756 — "Gestão para resultados"
  //   806757 — "Cultura de feedback"
  //
  // Quando feature shipped, atualizar `cursoComRecertificacaoEventId` para
  // apontar a um curso com `has_recertification=true` (criar via UI admin
  // ou esperar curso seed específico do projeto).
  // ==========================================================================

  /** Content_id usado por TC1/TC3/TC4. Hoje aceita qualquer ID válido. */
  cursoComRecertificacaoEventId: 806755 as number,

  /** Content_id usado em TC2 mix. Pode ser igual ao acima até feature shipped. */
  cursoSemRecertificacaoEventId: 806756 as number,

  /**
   * Emails de teste para TCs API. Pattern: `rec-v2-tc<N>@example.com`.
   * Curto, suite-tied, fácil de filtrar para cleanup.
   *
   * NOTA: API V2 attendees aceita emails arbitrários — não exige usuário
   * pré-cadastrado. Cada run cria/atualiza attendee. Cleanup via
   * GET /api/v2/attendees?user_id + DELETE pode ser feito num futuro
   * afterAll (skill limpar-dados-de-teste-twygo aplicada a API).
   */
  alunoReinscricaoEmail: 'rec-v2-tc1@example.com',
  alunoLegadoEmail: 'rec-v2-tc3@example.com',
  alunoFlagOffEmail: 'rec-v2-tc4@example.com',
} as const;
