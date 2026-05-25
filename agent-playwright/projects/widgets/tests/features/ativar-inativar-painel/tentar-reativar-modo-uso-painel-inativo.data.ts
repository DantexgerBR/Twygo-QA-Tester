/**
 * Dados específicos do TC4 "Tentar reativar modo de uso vinculado a um
 * painel inativo". Convenção: §3.1 do CLAUDE.md.
 *
 * Os useModeIds são fixos da org 36988 (staging-widgets). TC4 está
 * bloqueado por seed ausente (ver cabeçalho do .spec.ts) — estes valores
 * são placeholders para quando o cenário composto for seedado pelo QA Lead.
 * useModeId: 70077 (Colaborador) — use mode candidato a ter menu vinculado
 *   ao painel inativo quando o seed for criado.
 * useModeIdAluno: 70078 (Aluno) — use mode secundário da org para referência.
 */
export const data = {
  useModeId: 70077 as const,
  useModeIdAluno: 70078 as const,
} as const;
