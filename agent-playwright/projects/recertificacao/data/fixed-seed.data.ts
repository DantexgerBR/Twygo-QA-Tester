/**
 * Sementes FIXAS pré-existentes no env staging-recertificacao (orgId 37048),
 * usadas como pré-condição estável por TCs que não conseguem usar seed
 * dinâmico via `beforeAll` (race condition entre browser.newContext do seed
 * e o `page` fixture do test — observada em Suite 01).
 *
 * Estratégia: cursos/recursos seed criados manualmente uma vez, mantidos
 * vivos no env entre runs. Se algum sumir (cleanup acidental), recriar via
 * MCP devtools/UI admin e atualizar o ID aqui.
 *
 * **NÃO deletar estes recursos do env staging-recertificacao** — múltiplos
 * specs dependem deles.
 *
 * Validado live 2026-05-27.
 */
export const fixedSeed = {
  /**
   * Curso vazio (sem participants/atividades) usado por TCs que apenas
   * precisam que a URL `/o/{orgId}/events/{id}/...` retorne 200 — ex:
   * filtro avançado de status, validação de presence de elementos UI.
   *
   * Criado via MCP em 2026-05-27 — "Validação seed via menu real".
   */
  emptyCursoId: 806852,

  /**
   * Curso 807287 ("curso para reinscriçao") com seed REPLACED preparada:
   * Richard Sebold (user_id 4294804) tem 5 inscrições (recert_num 0-4).
   * Em 2026-05-28 emitimos certs sucessivos via UI admin nas inscrições
   * recert_num=0 e recert_num=1 — resultado: recert_num=0 (id 44274543)
   * ficou com certificate_situation=4 (REPLACED / Substituído), e
   * recert_num=1 (id 44274544) ficou com certificate_situation=2
   * (Emitido). Pré-condição da Suite 09 Filtro Avançado Status
   * Substituído.
   *
   * Critério de aprovação do curso exige Frequência 100% — então NÃO
   * inativar a Chamada criada em 2026-05-28 nem mexer no critério, OU a
   * seed REPLACED é invalidada.
   */
  cursoComSubstituidoId: 807287,

  /**
   * orgId principal do env staging-recertificacao. Embora `getOrgId()`
   * resolva isso dinamicamente, fica aqui pra docs.
   */
  principalOrgId: 37048,

  // ==========================================================================
  // Seed da suite "Reinscrição via API V2" (tests/api/) e demais suites
  // do projeto Recertificação que dependem do estado "aluno aprovado".
  //
  // Curso seed CANÔNICO (criado 2026-05-28 via tests/setup/seed-rec-v2-curso.spec.ts):
  //   807400 — "Rec V2 Seed Curso (não-deletar)"
  //   link: https://recertificacao-testeqa.stage.twygoead.com/e/807400-rec-v2-seed-curso-nao-deletar
  //
  // Pré-requisitos manuais (configurados via UI admin uma vez):
  //   1. Switch "Habilitar reinscrição" ATIVO (tab Acesso) — pendente
  //   2. Atividades inseridas para permitir progressão e conclusão
  //   3. Critérios de aprovação configurados (Gerenciar → critérios)
  //   4. Emissão automática de certificado configurada
  //   5. Curso publicado (situation: development → released)
  //
  // Curso "sem recertification" para TC2 mix: usa 806755 (pre-existente) por
  // enquanto. Quando precisar de cenário rígido "has_recertification=false",
  // criar segundo curso seed via UI.
  // ==========================================================================

  /** Content_id usado por TC1/TC3/TC4. Curso seed dedicado do projeto. */
  cursoComRecertificacaoEventId: 807400 as number,

  /** Content_id usado em TC2 mix. Curso pre-existente da org (sem config dedicada). */
  cursoSemRecertificacaoEventId: 806755 as number,

  /**
   * Alunos pré-existentes em curso 807287 ("curso para reinscriçao") com
   * estados estáveis — validados live 2026-05-28 via recon
   * (`tests/setup/recon-alunos-reinscrever-habilitado.spec.ts`).
   *
   * Sem auto-recertification cascateando — diferente do 807403 onde a
   * fixture alunoAprovadoNoCursoFixoSeed produz estado que bloqueia
   * Reinscrever. Estes alunos têm botão "Iniciar reinscrição" HABILITADO
   * no menu kebab da linha mais recente.
   *
   * **NÃO clicar em "Iniciar reinscrição" desses alunos em testes que
   * não façam cleanup** — vai criar participants adicionais permanentes
   * no env. Use email worker-isolated em paralelo quando precisar de
   * reinscrição "limpa".
   */
  alunoComReinscreverHabilitado_807287: 'richard.sebold@twygo.com' as string,
  alunoComReinscreverHabilitadoSecundario_807287: 'agents.edu@claude.com' as string,
  // REMOVIDOS na refactor v2.0 (sem consumer após migração):
  //   - alunoComReinscreverHabilitadoEmProgresso_807287 (0 specs)
  //   - cursoComAtividadesEAprovadoEventId: 807403 (era usado por alunoAprovadoNoCursoFixoSeed
  //     que foi deletada — específico do env staging-recertificacao 37048,
  //     anti-pattern. Use fixture alunoAprovadoSeed que cria curso dinâmico.)

  /**
   * Emails de teste para TCs API. Pattern: `rec-v2-tc<N>@example.com`.
   * Curto, suite-tied, fácil de filtrar para cleanup.
   *
   * NOTA: API V2 attendees aceita emails arbitrários — não exige usuário
   * pré-cadastrado. Cada run cria/atualiza attendee. Cleanup via
   * GET /api/v2/attendees?user_id + DELETE pode ser feito num futuro
   * afterAll (skill limpar-dados-de-teste-twygo aplicada a API).
   */
  alunoReinscricaoEmail: 'rec-v2-tc1@example.com',
  alunoLegadoEmail: 'rec-v2-tc3@example.com',
  alunoFlagOffEmail: 'rec-v2-tc4@example.com',
} as const;
