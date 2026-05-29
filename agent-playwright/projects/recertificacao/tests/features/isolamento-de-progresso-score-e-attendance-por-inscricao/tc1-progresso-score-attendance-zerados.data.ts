/**
 * @deprecated v3 (2026-05-29) — TC1 migrou para `alunoAprovadoNoCursoFixoSeed`
 * (fixture dinâmica em `src/fixtures/seed-fixtures.ts`). Dados do aluno
 * e curso agora são resolvidos em runtime pela fixture, não via constantes
 * estáticas aqui.
 *
 * HISTÓRICO:
 *  - v1: curso 806755 / recertificacaoever1@twygo.com — descartado (422 no POST).
 *  - v2: curso 807287 / richard.sebold@twygo.com — descartado (cert Pendente,
 *    frontend bloqueia click silenciosamente, toast não vem).
 *  - v3: alunoAprovadoNoCursoFixoSeed no curso 807403 — aluno worker-isolated
 *    com cert EMITIDO garante botão Reinscrever habilitado.
 *
 * Mantido como referência histórica. Pode ser deletado se não houver outros
 * consumidores.
 */

/** @deprecated — ver comentário acima */
export const tc1Data = {
  cursoIsolamentoId: 807287,
  cursoIsolamentoNomeEsperado: 'curso para reinscriçao',
  alunoElegivelEmail: 'richard.sebold@twygo.com',
  progressoEsperadoNovoParticipant: 0,
  progressoHistoricoEsperado: 100,
} as const;
