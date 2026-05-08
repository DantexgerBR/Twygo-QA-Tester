/**
 * Dados específicos do testcase "Tentar inativar painel associado a modos
 * de uso exibe modal de bloqueio". Convenção: §3.1 do CLAUDE.md.
 *
 * Os useModeIds são fixos da org 36988 (staging widgets) — quando rodar
 * em outra org, basta atualizar aqui (1 ponto de mudança em vez de N).
 * O `expectedMenuLabels` casa cada id com o label que o produto renderiza
 * no modal de bloqueio — invariante pareada (id mudou ⇒ label muda também).
 */
export const inativarPainelAssociadoModalData = {
  useModes: [
    { id: 70077, label: 'Colaborador' },
    { id: 70078, label: 'Aluno' },
  ],
} as const;

export type UseMode = (typeof inativarPainelAssociadoModalData.useModes)[number];
