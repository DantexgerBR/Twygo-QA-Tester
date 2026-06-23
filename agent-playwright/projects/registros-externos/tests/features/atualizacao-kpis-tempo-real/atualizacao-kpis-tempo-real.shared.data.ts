/**
 * Dados compartilhados pela suíte "Atualização de KPIs em tempo real
 * (ações, expiração e batch)".
 *
 * A suíte muta estado persistente da org compartilhada (37079): cria registros
 * Pendentes externos via API, age sobre eles pela UI (aprovar/recusar/excluir/
 * editar/batch) e LIMPA por marker no final (ver [[limpar-dados-de-teste-twygo]]).
 * Nunca consome destrutivamente a seed QA11-* pré-existente.
 *
 * Assere DELTAS de KPI (não count absoluto) contra o estado lido na hora —
 * o env staging oscila entre runs (ver skill testar-kpi-cards-twygo).
 */
export const kpisTempoRealData = {
  suiteName: 'Atualização de KPIs em tempo real (ações, expiração e batch)',
  epic: 'Twygo - Registros de Aprendizagem',

  /** Prefixo dos markers de conteúdo dos registros criados pelos testes. */
  markerBase: 'QAKPIRT',

  /** Justificativa usada na recusa (TC3). */
  justificativaRecusa: 'Evidências não comprovam a carga horária declarada',

  /** Quantidade de registros do cenário de batch completo (TC6). */
  batchSize: 5,

  /** Cenário de batch parcial (TC7): pendentes elegíveis + emitidos ignorados. */
  batchPartial: { pendentes: 4, emitidosIgnorados: 3 },
} as const;

/** Marker único por teste/worker (evita colisão entre workers e runs — Anti-pattern G). */
export function makeMarker(tc: string, workerIndex: number, suffix = ''): string {
  return `${kpisTempoRealData.markerBase}-${tc}-w${workerIndex}-${Date.now()}${suffix}`;
}
