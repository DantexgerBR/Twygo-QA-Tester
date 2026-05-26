/**
 * Dados específicos do TC3 — "Reinscrever aluno individualmente cria novo
 * participant zerado" (MD §351-368).
 *
 * Pré-condições declaradas no MD da Suite 02 §299-306:
 *  - Feature flag `:recertificacao` ATIVA.
 *  - Curso com `has_recertification = true`.
 *  - Aluno elegível (passo 1: "aluno (a) elegível com recertification_number = N").
 *
 * Cleanup do estado criado:
 * REVISAR: este TC cria um novo `EventParticipant` (RN 5). Cleanup ideal
 * seria deletar o participant criado — mas isso exige acesso DB ou
 * endpoint admin (`DELETE /api/v1/contents/{eventId}/event_participants/{id}`)
 * que ainda não foi mapeado. Workaround pragmático: usar e-mail
 * worker-isolated minimizando colisão entre runs. Participant reinscrito
 * permanece no env após teste — runs sucessivos vão acumular linhas,
 * mas como cada uma é única por timestamp, não bloqueia outros TCs.
 *
 * REVISAR-SEED: depende de seed específico no env
 * `staging-base-de-conhecimento` (orgId 37007). E-mail abaixo é
 * placeholder — o spec injeta um sufixo único em runtime via
 * `testInfo.workerIndex` + `Date.now()`.
 */
export const tc3Data = {
  // Curso com `has_recertification = true`.
  // REVISAR-SEED: confirmar via recon ou rake task.
  cursoComReinscricaoId: 1,

  // E-mail base do aluno elegível por progresso 100%. Spec deriva o
  // sufixo worker-isolated em runtime (não pode ficar estático aqui
  // porque `testInfo.workerIndex` só existe dentro do `test()`).
  // REVISAR-SEED: e-mail real depende do seed. Atualmente é placeholder
  // e o cenário "criar aluno worker-isolated em runtime" é o plano
  // definitivo quando a infra de criação de alunos em massa estiver
  // pronta.
  alunoElegivelEmail: 'aluno.elegivel.progresso@example.com',

  // Texto esperado do badge pós-reinscrição (RN 5).
  // REVISAR-FIGMA: texto exato pendente.
  badgePosReinscricaoEsperado: /Pendente|Em andamento|Aguardando/i,
} as const;
