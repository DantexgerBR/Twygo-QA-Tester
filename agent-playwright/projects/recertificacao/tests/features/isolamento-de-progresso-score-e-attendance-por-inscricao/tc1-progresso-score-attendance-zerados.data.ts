/**
 * Dados específicos do TC1 — "Aluno reinscrito tem progress/score/attendance
 * zerados na nova inscrição".
 *
 * Pré-condição declarada no MD §1296-1300 + passo 1 (§1315):
 *  - Curso "Curso Isolamento w{workerIndex}" com `has_recertification = true`.
 *  - Aluno aprovado com `recertification_number = 0`, `progress_score = 100`,
 *    certificado VALID.
 *  - Banco com índice `unique_participant` aplicado.
 *  - Após reinscrição (Suite 02 TC3): novo participant com
 *    `recertification_number = 1`.
 *
 * REVISAR-SEED: este TC depende de SEED específico no env
 * `staging-base-de-conhecimento` (orgId 37007):
 *  - `cursoIsolamentoId`: id do curso "Curso Isolamento" com
 *    `has_recertification = true`.
 *  - `alunoReinscritoEmail`/`alunoReinscritoPassword`: credenciais do aluno
 *    que foi reinscrito (recertification_number = 1 na nova inscrição,
 *    recertification_number = 0 no histórico). Validar pelo flow da Suite
 *    02 TC3 antes de rodar este spec.
 *  - Quando o seed for re-criado, ajustar IDs aqui ou mover a reinscrição
 *    para um `beforeAll` que invoque o helper da Suite 02 TC3.
 */
export const tc1Data = {
  // ID do curso "Curso Isolamento w{workerIndex}" no env do projeto.
  // REVISAR-SEED: confirmar via recon ou rake task quando seed for criado.
  cursoIsolamentoId: 1,

  // Nome do curso conforme convenção (worker-isolated para evitar colisão).
  cursoIsolamentoNomeEsperado: 'Curso Isolamento w0',

  // Aluno que JÁ FOI reinscrito (recertification_number = 1 na inscrição
  // ativa, recertification_number = 0 no histórico). Suite 02 TC3 deve ter
  // rodado antes — OU este TC se encarrega de reinscrever no beforeAll
  // quando o helper da Suite 02 existir.
  // REVISAR-SEED: credenciais devem viver em `.env` (vars
  // TWYGO_RECERT_ALUNO_REINSCRITO_EMAIL/PASSWORD) e o seed deve garantir
  // o aluno no estado descrito.
  alunoReinscritoEmail: 'aluno.reinscrito@example.com',
  alunoReinscritoPassword: 'changeme-via-env',

  // Progresso esperado APÓS avançar 1 aula (passo 3 do MD §1319).
  // RN 27/28: o `event_content_user` é vinculado ao novo participant
  // (recertification_number = 1) com progress_score = 25 nesta unidade.
  progressoEsperadoNoStep3: 25,
} as const;
