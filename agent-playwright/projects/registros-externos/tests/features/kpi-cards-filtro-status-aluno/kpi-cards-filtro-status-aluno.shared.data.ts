import type { KpiStatus } from '../../../pages/MeuHistoricoPage.js';

/**
 * Dados compartilhados pela suíte "KPI cards como filtro de status (Aluno)".
 *
 * `tooltipsAlunoReal` = textos CORRETOS que o Aluno vê no produto, validados
 * manualmente pelo QA em 2026-06-22 e confirmados via audit live. TC2 assere
 * estes (e passa).
 *
 * `tooltipsAlunoDocAT` = textos que a AT documentou na test-analysis.md
 * (RN 18.3.1, tom "você"). Estão DESATUALIZADOS — o produto está certo, a doc
 * que precisa ser alinhada pela AT. Mantidos aqui só como referência do gap.
 */
export const kpiCardsAlunoData = {
  /** Ordem canônica esperada dos 4 cards (RN 18). */
  cardOrder: ['Emitidos', 'Expirados', 'Pendentes', 'Recusados'] as const,

  statuses: ['emitted', 'expired', 'pending', 'rejected'] as const satisfies readonly KpiStatus[],

  /** Tooltips CORRETOS exibidos ao Aluno (produto — verdade confirmada pelo QA). */
  tooltipsAlunoReal: {
    emitted: 'Registros com certificado emitido e válido.',
    expired: 'Registros cujo certificado expirou.',
    pending: 'Registros aguardando avaliação.',
    rejected: 'Registros recusados na avaliação.',
  } satisfies Record<KpiStatus, string>,

  /** DESATUALIZADO — texto da AT (RN 18.3.1). Não asserir; AT deve alinhar. */
  tooltipsAlunoDocAT: {
    emitted: 'Certificados emitidos e dentro do prazo de validade.',
    expired: 'Certificados cuja data de validade já passou. Pode ser hora de recertificar.',
    pending: 'Registros externos que você enviou aguardando avaliação do Admin.',
    rejected: 'Registros externos que foram recusados pelo Admin. Veja o motivo no detalhe.',
  } satisfies Record<KpiStatus, string>,

  /**
   * Empty state esperado pela AT ao filtrar sem resultados (RN 35). A UI real
   * usa o placeholder genérico de tabela "Não há dados para exibir" — TC9
   * valida o comportamento e marca a divergência de cópia.
   */
  emptyStateEsperadoAT: 'Nenhum registro encontrado',

  /** Label de carga horária (RN 19/20). {X} = soma das cargas do próprio aluno. */
  workloadLabelRegex: /Carga horária total:\s*\d+\s*horas/i,
} as const;
