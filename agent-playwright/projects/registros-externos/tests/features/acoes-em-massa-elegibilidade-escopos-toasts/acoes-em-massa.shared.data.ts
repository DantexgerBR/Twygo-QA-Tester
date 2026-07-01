/**
 * Dados compartilhados pela suíte "Ações em massa (elegibilidade, escopos e
 * toasts com ratio)".
 *
 * A suíte muta estado persistente da org compartilhada (37079): cria registros
 * Externos Pendentes via API e age sobre eles pela UI (aprovar/recusar/excluir
 * em massa). Convenção do projeto: SEM cleanup — a massa criada fica persistente
 * entre runs (ver [[registros-externos-sem-cleanup-seed-persistente]]); markers
 * são únicos por run/worker (Date.now) para nunca colidir.
 *
 * Asserções por INVARIANTE (delta de KPI / situação dos registros) em vez do
 * texto do toast: o batch é assíncrono e o produto emite toast genérico, sem o
 * ratio "{X} aprovados ({Y} ignorados)" que a AT supunha (ver recon).
 */
export const acoesEmMassaData = {
  suiteName: 'Ações em massa (elegibilidade, escopos e toasts com ratio)',
  epic: 'Twygo - Registros de Aprendizagem',

  /** Prefixo dos markers de conteúdo dos registros criados pelos testes. */
  markerBase: 'QAMASSA',

  /** Justificativa única aplicada a todo o batch de recusa (TC5). */
  justificativaRecusa: 'Plano de desenvolvimento não cobre essa formação.',

  /** Tamanhos dos cenários. */
  aprovarSelecionados: 5, // TC3
  recusarBatch: 3, // TC5
  posAplicacao: 4, // TC8
  fecharPreservaSelecao: 4, // TC9
  estruturaSelecionados: 3, // TC2
} as const;

/** Marker único por teste/worker (evita colisão entre workers e runs). */
export function makeMarker(tc: string, workerIndex: number, suffix = ''): string {
  return `${acoesEmMassaData.markerBase}-${tc}-w${workerIndex}-${Date.now()}${suffix}`;
}
