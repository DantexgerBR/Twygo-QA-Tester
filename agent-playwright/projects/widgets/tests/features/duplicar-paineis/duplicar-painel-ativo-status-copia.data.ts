// Dados do TC1.2 — Duplicar painel ativo — status do painel duplicado
// O nome real do painel é gerado em runtime combinando panelNamePrefix +
// workerIndex + Date.now() para isolamento entre runs paralelos.
// A copyName é derivada de panelName + ' (cópia)' (padrão confirmado live 2026-05-12).

export const duplicarPainelAtivoStatusCopiaData = {
  /** Prefixo usado no beforeAll para construir panelName worker-isolated. */
  panelNamePrefix: 'Painel Ativo TC1.2',
} as const;
