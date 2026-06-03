/**
 * Dados específicos do TC5 — "Linha com `Reinscrever=SIM` em conteúdo com
 * `has_recertification=false` registra erro estruturado".
 *
 * Pré-condição declarada no MD (Suite 04 / TC5):
 *  - Curso "Curso sem Reinscrição" com `has_recertification = false`.
 *  - Aluno existente.
 *
 * Comportamento esperado (RN 12): linha aparece como erro com mensagem da
 * chave `reenroll_participant.errors.recertification_disabled_for_event`.
 * Nenhum participant criado para esta linha.
 *
 * REVISAR-SEED: validar email + eventId de curso SEM recertification.
 */
export const tc5Data = {
  // Curso com has_recertification=false. REVISAR-SEED: id real.
  eventIdSemRecertification: 3,
  alunoEmail: 'aluno-existente-tc5@example.com',
  alunoNome: 'Aluno TC5',
  csvFileName: 'participants-erro-tc5.csv',
  csvContent: `Nome,Email,Reinscrever
Aluno TC5,aluno-existente-tc5@example.com,SIM`,
  // Mensagem esperada (i18n key referenciada no MD). Pode variar entre
  // locales — usamos regex tolerante.
  expectedErrorPattern:
    /recertification_disabled_for_event|reinscrição (não|nao) (habilitada|permitida|disponível)/i,
} as const;
