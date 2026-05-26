/**
 * Dados específicos do TC2 — "Aluno NÃO reinscrito (`recertification_number = 0`)
 * mantém progresso histórico após deploy".
 *
 * Pré-condição declarada no MD §1334:
 *  - Aluno pré-deploy com `recertification_number = 0`, `progress_score = 100`,
 *    e registros em `event_content_users` com `event_participant_id IS NULL`.
 *  - Estado preparado em staging.
 *
 * REVISAR-SEED: este TC depende de SEED específico no env
 * `staging-base-de-conhecimento` (orgId 37007):
 *  - `cursoLegadoId`: id do curso onde o aluno tem progresso histórico
 *    completo (100%).
 *  - `alunoLegadoEmail`/`alunoLegadoPassword`: credenciais do aluno
 *    pré-deploy (recertification_number = 0, progress_score = 100,
 *    `event_content_users.event_participant_id IS NULL` — herança da
 *    migration de backfill que preserva o histórico sem vincular ao
 *    novo modelo de participants).
 *  - Esse seed NÃO PODE ser zerado em cleanup — é a base do teste de
 *    regressão. Confirmar com QA Lead antes de qualquer reset.
 */
export const tc2Data = {
  // ID do curso onde o aluno legado tem progresso 100% histórico.
  // REVISAR-SEED: confirmar via recon ou rake task quando seed for criado.
  cursoLegadoId: 2,

  // Nome do curso conforme convenção do seed.
  cursoLegadoNomeEsperado: 'Curso Legado w0',

  // Aluno pré-deploy. Estado: recertification_number = 0, progress_score = 100,
  // `event_content_users.event_participant_id IS NULL`.
  // REVISAR-SEED: credenciais devem viver em `.env` (vars
  // TWYGO_RECERT_ALUNO_LEGADO_EMAIL/PASSWORD).
  alunoLegadoEmail: 'aluno.legado@example.com',
  alunoLegadoPassword: 'changeme-via-env',

  // RN 27.1 / 28: progresso histórico deve ser preservado (100%) mesmo
  // após o deploy que introduziu `recertification_number` em
  // `event_participants`. A migration faz backfill com
  // `recertification_number = 0` e `event_content_users.event_participant_id`
  // permanece NULL — o agregado de progresso usa COALESCE para
  // continuar contando para o participant com recertification_number = 0.
  progressoEsperadoHistorico: 100,
} as const;
