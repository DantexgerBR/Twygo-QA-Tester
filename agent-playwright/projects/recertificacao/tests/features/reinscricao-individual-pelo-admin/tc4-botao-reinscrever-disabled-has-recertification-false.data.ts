/**
 * Dados específicos do TC4 — "Botão Reinscrever fica visível mas DESABILITADO
 * quando `event.has_recertification = false`" (MD §370-387).
 *
 * Pré-condições declaradas no MD (passo 1):
 *  - Curso com `has_recertification = false`.
 *  - Ao menos 1 aluno elegível matriculado no curso.
 *
 * Pós refator 2026-05-28 (skill provisionar-seed v1.6): o cursoId e o
 * email do aluno NÃO vêm mais daqui — vêm da fixture canônica
 * `alunoMatriculadoSeed` que reusa `cursoSeed` (default
 * `has_recertification = false`). Sobrou apenas o regex do tooltip,
 * que continua sendo dado específico do TC.
 *
 * REVISAR-FIGMA: texto exato do tooltip pendente — MD §387 indica
 * "conteúdo não permite reinscrição" como provável. Regex tolerante
 * cobre variações até o Figma final.
 */
export const tc4Data = {
  // Tooltip esperado no hover (RN 4.2).
  tooltipDesabilitadoRegex: /conteúdo não permite reinscri|não permite reinscri/i,
} as const;
