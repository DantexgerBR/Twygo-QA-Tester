// Dados do TC1.4 — Editar painel duplicado
// O nome real do painel é gerado em runtime combinando panelNamePrefix +
// workerIndex + Date.now() para isolamento entre runs paralelos.
// A copyName é derivada de panelName + ' (cópia)' (padrão confirmado live 2026-05-12).
// editedName é o valor fixo inserido no campo Nome ao editar a cópia.

export const editarPainelDuplicadoData = {
  /** Prefixo usado no beforeAll para construir panelName worker-isolated. */
  panelNamePrefix: 'Painel TC1.4 Duplicado',
  /** Nome aplicado ao editar a cópia. */
  editedName: 'Painel Editado',
} as const;
