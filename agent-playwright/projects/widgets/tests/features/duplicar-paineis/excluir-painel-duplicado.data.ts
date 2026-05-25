// Dados do TC1.5 — Excluir painel duplicado
// O nome real do painel é gerado em runtime combinando panelNamePrefix +
// workerIndex + Date.now() para isolamento entre runs paralelos.
// copyName é derivada de panelName + ' (cópia)' (padrão confirmado live 2026-05-12).

export const excluirPainelDuplicadoData = {
  /** Prefixo usado no beforeAll para construir panelName worker-isolated. */
  panelNamePrefix: 'Painel TC1.5 Excluir Duplicado',
} as const;
