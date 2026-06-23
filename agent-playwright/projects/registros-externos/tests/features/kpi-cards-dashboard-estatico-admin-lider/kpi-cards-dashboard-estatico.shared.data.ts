import type { KpiStatus } from '../../../pages/RegistrosAdminPage.js';

/**
 * Dados compartilhados pela suíte "KPI cards como dashboard estático (Admin/Líder)".
 *
 * Os textos de tooltip abaixo são os DOCUMENTADOS pela AT (RN 18.3.2 — tom
 * institucional do Admin/Líder). A suíte irmã do Aluno mostrou que a UI em Stage
 * exibe cópia genérica diferente da AT (RN 18.3.1) — TC2 assere o texto
 * documentado; uma eventual falha vermelha é o sinal correto da divergência
 * produto×AT (Anti-pattern F: não esconder com fixme).
 */
export const kpiCardsAdminData = {
  /** Ordem canônica esperada dos 4 cards (RN 18). */
  cardOrder: ['Emitidos', 'Expirados', 'Pendentes', 'Recusados'] as const,

  statuses: ['emitted', 'expired', 'pending', 'rejected'] as const satisfies readonly KpiStatus[],

  /** Tooltips institucionais do Admin/Líder conforme RN 18.3.2 (fonte: test-analysis.md). */
  tooltipsAdminEsperado: {
    emitted: 'Registros aprovados e dentro do prazo de validade na organização.',
    expired: 'Registros cuja data de validade já passou. Sinaliza necessidade de recertificação.',
    pending:
      'Registros externos aguardando avaliação. Use o menu de ação ou as ações em massa pra aprovar/recusar.',
    rejected: 'Registros externos recusados na avaliação. Veja o motivo na ficha individual.',
  } satisfies Record<KpiStatus, string>,

  /** Mapeia status → rótulo do filtro padrão no drawer (TC4). */
  statusFilterLabel: 'Pendentes',

  /** Label de carga horária total da organização/escopo (RN 21). */
  workloadLabelRegex: /Carga horária total:\s*\d+\s*horas/i,
} as const;
