/**
 * Dados específicos do TC1 — "Botão Reinscrever visível e habilitado apenas
 * para aluno elegível" (MD §311-328).
 *
 * Pré-condições declaradas no MD da Suite 02 §299-306:
 *  - Feature flag `:recertificacao` ATIVA na organização (assumida ON em
 *    `staging-base-de-conhecimento`).
 *  - Curso com `has_recertification = true` (cursoComReinscricaoId).
 *  - 3 alunos pré-cadastrados em estados distintos:
 *      (a) elegível por progresso 100% → alunoElegivelProgressoEmail
 *      (b) elegível por certificado expirado → alunoElegivelCertificadoExpiradoEmail
 *      (c) inelegível (em andamento, progresso < 100%) → alunoInelegivelEmail
 *
 * REVISAR-SEED: este TC depende de seed específico no env
 * `staging-base-de-conhecimento` (orgId 37007). Os IDs e e-mails abaixo
 * são placeholders — quando o seed for criado/migrado, atualizar aqui.
 */
export const tc1Data = {
  // Curso "Curso com Reinscrição w0" com `has_recertification = true`.
  // REVISAR-SEED: confirmar via recon ou rake task.
  cursoComReinscricaoId: 1,

  // (a) Aluno aprovado com progresso 100% (sem certificado expirado).
  alunoElegivelProgressoEmail: 'aluno.elegivel.progresso@example.com',

  // (b) Aluno com certificado emitido mas expirado (`expires_at < hoje`).
  alunoElegivelCertificadoExpiradoEmail:
    'aluno.elegivel.certificado.expirado@example.com',

  // (c) Aluno em andamento, progresso < 100%, sem aprovação, sem certificado.
  alunoInelegivelEmail: 'aluno.inelegivel.em.andamento@example.com',
} as const;
