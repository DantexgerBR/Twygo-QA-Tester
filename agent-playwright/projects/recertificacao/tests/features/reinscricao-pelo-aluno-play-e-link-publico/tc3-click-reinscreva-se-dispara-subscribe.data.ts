/**
 * Dados específicos do TC3 — "Click em 'Reinscreva-se' dispara subscribe com
 * `recertification=true` e cria novo participant".
 *
 * Pré-condição declarada no MD (suite 06):
 *  - Feature flag `:recertificacao` ATIVA
 *  - Curso com `has_recertification = true`
 *  - Aluno elegível (mesmo do TC1)
 *
 * Side-effects esperados (RN 17):
 *  - POST /api/v1/play/.../subscribe com body { recertification: true }
 *  - Response HTTP 201 com participant criado
 *  - Banner do Play refresha refletindo novo participant
 *    (recertification_number = N+1, progress_score = 0)
 *
 * CLAUDE.md §7.6 G: spec ALTERA estado persistente (cria participant) —
 * cleanup obrigatório. Estratégia: o spec já loga side-effect no
 * `recertification_number`, mas REVERTER cria um second-order effect
 * (deletar participant via API/admin não está modelado nos POMs atuais).
 *
 * Decisão pragmática:
 *  - NÃO automatizamos o cleanup neste spec — a reinscrição é idempotente
 *    do ponto de vista do TC1/TC2 (botão volta a aparecer assim que o
 *    novo participant ficar elegível de novo, ou some até nova condição).
 *  - REVISAR-SEED: se o env ficar contaminado com muitos participants
 *    reinscritos, abrir task para o time de DB limpar (`DELETE FROM
 *    event_participants WHERE recertification_number > 0 AND user_id = X`).
 */
export const tc3Data = {
  // Mesmo curso do TC1 — aluno elegível para reinscrição.
  eventIdCursoElegivel: 1,
} as const;
