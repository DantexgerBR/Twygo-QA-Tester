/**
 * Dados do TC5 (1.16) — coerência permanente KPI × lista.
 *
 * O TC5 é por INVARIANTE: o total de linhas da listagem deve bater com
 * `total_general` de `/records/stats` (mesmo critério pessoa-ativa + escopo +
 * soft-delete em /stats e /list — RN 96.5). Nenhum número fixo de seed é
 * hardcodado; o `total_general` é lido em runtime. Mantemos aqui apenas a
 * referência ao valor observado no recon, como documentação (NÃO usado em
 * asserção — a lista pode mudar no Stage).
 */
export const tc5Data = {
  /** total_general observado no recon 2026-06-29 (org 37093) — só referência. */
  observedTotalGeneralAtRecon: 89,
} as const;
