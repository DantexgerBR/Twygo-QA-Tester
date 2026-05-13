// Testsuite: Ativar / Inativar painel
// TC1 — dados do cenário (§3.1 CLAUDE.md)
//
// useModeIds: use modes seedados na org 36988 (staging-widgets).
// 70077 = Colaborador, 70078 = Aluno.
// Documentados aqui para referência do ambiente — TC1 NÃO usa associação
// a menus; a presença desses IDs facilita futuros refactors ou seed checks.

export const data = {
  useModeIds: [70077, 70078] as const,
} as const;
