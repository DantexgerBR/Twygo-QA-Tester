// Dados do TC4 — Validar empty state quando não há repositórios.
//
// Estratégia: env staging-base-de-conhecimento já está sem repositórios
// (confirmado via chrome-devtools-mcp em 2026-05-19) — basta navegar
// direto e validar empty state real. Mock removido por simplicidade.
//
// QA: se um dia o env ganhar seed, este TC volta a precisar do mock
// (interceptar a API JSON e devolver lista vazia).
export const tc4Data = {
  /** Texto literal do empty state do componente ListControl Twygo. */
  emptyStateText: 'Não há dados para exibir',
} as const;
