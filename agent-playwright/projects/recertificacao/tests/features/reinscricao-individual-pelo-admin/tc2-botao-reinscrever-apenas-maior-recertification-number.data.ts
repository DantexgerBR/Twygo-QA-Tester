/**
 * Dados específicos do TC2 — "Botão Reinscrever visível apenas na linha do
 * participant com maior `recertification_number`" (MD §330-349).
 *
 * Pré-condição declarada no MD (passo 1): aluno "Aluno Multi-Reinscrição
 * w{workerIndex}" com 2 participants:
 *   - recertification_number = 0 (histórico)
 *   - recertification_number = 1 (ativo, `is_latest_recertification = 1`)
 *
 * REVISAR-SEED: depende de seed específico no env
 * `staging-base-de-conhecimento` (orgId 37007). O aluno precisa ter
 * exatamente 2 participants no mesmo curso, com os números acima. Quando
 * o seed for criado/migrado, atualizar IDs e e-mail aqui.
 *
 * REVISAR-FIGMA: o MD (passo 3) marca como "REVISAR-FIGMA: confirmar
 * como exibir histórico" — UI de filtro de histórico ainda não confirmada
 * (toggle "Mostrar histórico", filtro por coluna `is_latest_recertification`,
 * ou aba separada). Spec faz fallback: tenta abrir filtro avançado e
 * procura opção textual; se não encontrar, marca step como skipped via
 * `test.skip()` parcial via `test.info().annotations`.
 */
export const tc2Data = {
  // Curso com `has_recertification = true` onde o aluno multi-reinscrição
  // tem ambos os participants (recertification_number 0 e 1).
  // REVISAR-SEED: confirmar via recon ou rake task.
  cursoMultiReinscricaoId: 1,

  // Aluno "Aluno Multi-Reinscrição w0" — e-mail único na listagem.
  alunoMultiReinscricaoEmail: 'aluno.multi.reinscricao@example.com',

  // Quantidade esperada de linhas DEPOIS de aplicar filtro de histórico.
  // RN 4: listagem padrão mostra apenas o latest (1 linha); com histórico
  // expandido, mostra ambos os participants (2 linhas).
  qtdLinhasHistoricoCompleto: 2,
} as const;
