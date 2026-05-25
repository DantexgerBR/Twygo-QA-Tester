// Dados do TC1.6 — Inativar painel duplicado
// O nome real do painel é gerado em runtime combinando panelNamePrefix +
// workerIndex + Date.now() para isolamento entre runs paralelos.
// A copyName é derivada de panelName + ' (cópia)' (padrão confirmado live 2026-05-12).

export const inativarPainelDuplicadoData = {
  /** Prefixo usado no beforeAll para construir panelName worker-isolated. */
  panelNamePrefix: 'Painel Inativar Dup TC1.6',
} as const;
