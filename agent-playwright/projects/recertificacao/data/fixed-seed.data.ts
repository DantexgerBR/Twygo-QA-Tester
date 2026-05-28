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
   * orgId principal do env staging-recertificacao. Embora `getOrgId()`
   * resolva isso dinamicamente, fica aqui pra docs.
   */
  principalOrgId: 37048,

  /**
   * Curso com `has_recertification = true` — consumido por specs de
   * `tests/api/reinscricao-via-api-v2.spec.ts`.
   *
   * **TODO (popular antes da primeira run da suite)**:
   * 1. Logar em https://recertificacao-testeqa.stage.twygoead.com como Admin
   * 2. Criar curso "Curso API V2 Reinscrição (fixed seed)" via `/o/{orgId}/contents/new?kind=0`
   * 3. Editar curso → tab "Acesso" → ativar switch "Habilitar reinscrição" → Salvar
   * 4. Copiar `event_id` da URL `/o/{orgId}/events/<id>/...` aqui
   *
   * Sentinel `0` faz o spec falhar com mensagem clara antes de chamar a API.
   * Validar que a flag `:recertificacao` está ON na org antes (Super Admin →
   * Flipper → `:recertificacao` → Add actor `Organization;37048`).
   */
  cursoComRecertificacaoEventId: 0 as number,

  /**
   * Curso com `has_recertification = false` (mesmo curso criado mas SEM ativar
   * o switch). Usado em TC2 do spec API V2 para validar erro por item
   * (`recertification_disabled_for_event` quando `recertification=true` em
   * curso sem essa configuração).
   */
  cursoSemRecertificacaoEventId: 0 as number,

  /**
   * Aluno pré-cadastrado na org, com participant ATIVO + concluído no
   * `cursoComRecertificacaoEventId` (elegível para reinscrição via API V2).
   * Criar usuário aluno via `/users/new`, matricular no curso, marcar
   * progresso 100% / approved (ou DB write direto na fase de seed).
   */
  alunoReinscricaoEmail: 'aluno-api-v2-reinscricao@example.com',

  /**
   * Aluno legado (para TC3) — payload de inscrição sem `recertification`.
   * Mesmo aluno pode ser usado, basta limpar o participant entre runs
   * (cleanup em `afterAll` via skill limpar-dados-de-teste-twygo).
   */
  alunoLegadoEmail: 'aluno-api-v2-legado@example.com',

  /**
   * Aluno para TC4 (cenário "flag OFF"). Idem TC3 mas em curso onde
   * flag será desativada no setup.
   */
  alunoFlagOffEmail: 'aluno-api-v2-flag-off@example.com',
} as const;
