/**
 * Dados específicos do TC2 — "Botão 'Reinscreva-se' NÃO aparece para aluno
 * inelegível (sem disabled visível)".
 *
 * Pré-condição declarada no MD (suite 06):
 *  - Feature flag `:recertificacao` ATIVA
 *  - Curso com `has_recertification = true`
 *  - Aluno inelegível (em andamento, sem expiração)
 *
 * RN 16.2: aluno inelegível NÃO vê o botão — não é exibido como `disabled`,
 * simplesmente não está no DOM.
 *
 * REVISAR-SEED: validar id real via recon live ou consulta SQL no env.
 * O ideal é um curso com participant do user admin em status "em andamento"
 * (progress_score < 100, sem certificado expirado).
 */
export const tc2Data = {
  // Curso pré-existente com aluno em andamento (inelegível para reinscrição).
  // REVISAR-SEED: validar id real — pode ser o mesmo do TC1 se o estado do
  // participant for diferente, OU outro curso distinto.
  eventIdCursoInelegivel: 1,
} as const;
