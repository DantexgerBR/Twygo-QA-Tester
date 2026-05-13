/**
 * Dados específicos do TC3 "Tentar inativar painel associado a modos de uso".
 * Convenção: §3.1 do CLAUDE.md.
 *
 * Os useModeIds são fixos da org 36988 (staging widgets). Os labels casam
 * com cada id (Colaborador/Aluno) e aparecem no body do modal "Painel em uso".
 */
export const data = {
  useModeIds: [70077, 70078] as const,
  useModes: [
    { id: 70077, label: 'Colaborador' },
    { id: 70078, label: 'Aluno' },
  ],
  inactivationBlockedModalConfirmTestId: 'panel-in-use-modal-confirm',
} as const;

export type UseMode = (typeof data.useModes)[number];
