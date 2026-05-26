/**
 * Dados específicos do TC4 — "Botão Reinscrever fica visível mas DESABILITADO
 * quando `event.has_recertification = false`" (MD §370-387).
 *
 * Pré-condições declaradas no MD (passo 1):
 *  - Curso "Curso sem Reinscrição w{workerIndex}" com `has_recertification = false`.
 *  - Ao menos 1 aluno elegível por progresso 100% no curso.
 *
 * REVISAR-SEED: depende de seed específico no env
 * `staging-base-de-conhecimento` (orgId 37007) — curso onde o switch
 * "Habilitar reinscrição" NÃO foi ativado. ID/e-mail abaixo são
 * placeholders.
 *
 * REVISAR-FIGMA: texto exato do tooltip pendente — MD §387 indica
 * "conteúdo não permite reinscrição" como provável. Regex no spec é
 * tolerante.
 */
export const tc4Data = {
  // Curso "Curso sem Reinscrição w0" com `has_recertification = false`.
  // REVISAR-SEED: confirmar via recon ou rake task.
  cursoSemReinscricaoId: 2,

  // Aluno elegível por progresso 100% neste curso.
  alunoElegivelEmail: 'aluno.elegivel.sem.reinscricao@example.com',

  // Tooltip esperado no hover (RN 4.2).
  // REVISAR-FIGMA: texto exato pendente.
  tooltipDesabilitadoRegex: /conteúdo não permite reinscri|não permite reinscri/i,
} as const;
