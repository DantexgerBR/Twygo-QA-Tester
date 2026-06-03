/**
 * Dados específicos do TC1 — "Aluno reinscrito tem progress/score/attendance
 * zerados na nova inscrição".
 *
 * Pré-condição declarada no MD §1296-1300 + passo 1 (§1315):
 *  - Curso com `has_recertification = true`.
 *  - Aluno aprovado com `recertification_number = 0`, `progress_score = 100`,
 *    certificado VALID (situation = 2 "Emitido").
 *  - Após reinscrição: novo participant com `recertification_number = 1`.
 *
 * SEED REAL (validado live 2026-05-27 via API
 * `/api/v1/o/37048/e/{id}/learning_students`, env `staging-recertificacao`):
 *  - Curso 806755 "Construindo times de alta performance" tem 6 participants
 *    aprovados (progress_score=100, certificate_situation=2/Emitido,
 *    recertification_number=0) — todos elegíveis para reinscrição.
 *  - `recertificacaoever1@twygo.com` é o aluno canônico ("Recertificação
 *    Ever 1"), userId 7090986.
 *  - O switch "Habilitar reinscrição" (has_recertification) já está ON neste
 *    curso e a feature flag `:recertificacao` está ON na org (garantida no
 *    beforeAll do spec).
 *
 * NÃO é placeholder — são IDs/e-mails reais verificados no env. Substitui os
 * antigos placeholders (`cursoIsolamentoId=1`, `aluno.reinscrito@example.com`)
 * que apontavam para o env errado (37007/base-de-conhecimento) pré-migração.
 */
export const tc1Data = {
  // Curso real com participants aprovados + switch reinscrição ON.
  cursoIsolamentoId: 806755,
  cursoIsolamentoNomeEsperado: 'Construindo times de alta performance',

  // Aluno aprovado elegível para reinscrição (progress=100, cert Emitido,
  // recertification_number=0). userId 7090986.
  alunoElegivelEmail: 'recertificacaoever1@twygo.com',

  // Progresso esperado no NOVO participant logo após a reinscrição
  // (RN 27/28: isolado do histórico — começa zerado).
  progressoEsperadoNovoParticipant: 0,
  progressoHistoricoEsperado: 100,
} as const;
