// Testsuite: Ativar / Inativar painel
// TC2 — dados do cenário (§3.1 CLAUDE.md)
//
// useModeIds: use modes seedados na org 36988 (staging-widgets).
// 70077 = Colaborador, 70078 = Aluno.
// Documentados para referência do ambiente — TC2 não usa associação
// a menus; o painel é criado e imediatamente inativado via ensureInactive
// no beforeAll, sem vinculação a modos de uso.

export const data = {
  useModeIds: [70077, 70078] as const,
} as const;
