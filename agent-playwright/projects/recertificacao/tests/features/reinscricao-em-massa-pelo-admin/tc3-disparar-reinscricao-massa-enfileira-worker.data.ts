/**
 * Dados do TC3 — "Disparar reinscrição em massa enfileira worker e
 * processa todos os alunos elegíveis" (Suite 03, MD §479).
 *
 * Pré-condição MD §490: lista com ≥ 5 alunos elegíveis em curso com
 * `has_recertification=true`.
 *
 * REVISAR: cleanup via DB ainda não implementado. Usar conjunto
 * worker-isolated de alunos pré-criados pra essa suíte; não disparar
 * massa em alunos compartilhados (cada run cria 5 participants reinscritos
 * permanentes no env).
 */
export const tc3Data = {
  // Curso com has_recertification=true + ≥ 5 alunos elegíveis.
  // REVISAR-SEED: confirmar id real no env.
  cursoIdRecertOn: 3,
  studentsToSelect: 5,
} as const;
