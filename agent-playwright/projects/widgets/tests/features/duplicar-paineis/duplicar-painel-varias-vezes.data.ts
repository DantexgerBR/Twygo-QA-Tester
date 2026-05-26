// Dados do TC1.3 — Duplicar painel várias vezes
// O nome real do painel é gerado em runtime combinando panelNamePrefix +
// workerIndex + Date.now() para isolamento entre runs paralelos.
// copyName e copy2Name são derivados em runtime no beforeAll:
//   copyName  = panelName + ' (cópia)'
//   copy2Name = copyName  + ' (cópia)'
// Padrão de nomenclatura confirmado live 2026-05-12: sufixo ' (cópia)' é
// concatenado a cada duplicação sem numeração sequencial.

export const duplicarPainelVariasVezesData = {
  /** Prefixo usado no beforeAll para construir panelName worker-isolated. */
  panelNamePrefix: 'Painel Original TC1.3',
} as const;
