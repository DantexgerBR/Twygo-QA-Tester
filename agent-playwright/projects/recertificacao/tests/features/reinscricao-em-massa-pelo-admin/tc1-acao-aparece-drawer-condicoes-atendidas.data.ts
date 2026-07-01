/**
 * Dados do TC1 — "Ação 'Reinscrição em massa' aparece no drawer quando
 * todas as condições atendidas" (Suite 03, MD §443).
 *
 * Pré-condições do MD (§434-438):
 *  - Feature flag `:recertificacao` ATIVA (assumido em staging-base-de-conhecimento)
 *  - Curso com `has_recertification = true` pré-existente
 *  - Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
 *
 * REVISAR-SEED: `cursoIdRecertOn` aponta para um curso fixo no seed de
 * staging-base-de-conhecimento com `has_recertification=true` e ≥ 5
 * alunos elegíveis. Trocar quando o seed for re-criado ou quando o id
 * real for descoberto via recon live.
 */
export const tc1Data = {
  // Curso com has_recertification=true + ≥ 3 alunos elegíveis no env.
  // REVISAR-SEED: confirmar id real no env staging-base-de-conhecimento.
  cursoIdRecertOn: 3,
  // Quantidade de alunos a marcar para abrir o drawer e validar a opção.
  // MD §455 ("Selecionar 3 alunos clicando nos checkboxes correspondentes").
  studentsToSelect: 3,
} as const;
