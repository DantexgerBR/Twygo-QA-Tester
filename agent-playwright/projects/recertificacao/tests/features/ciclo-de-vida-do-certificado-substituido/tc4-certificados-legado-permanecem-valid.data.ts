import { fixedSeed } from '../../../data/fixed-seed.data.js';

/**
 * Dados do TC4 — Certificados emitidos no fluxo legado (sem reinscrição)
 * permanecem VALID indefinidamente.
 *
 * Refatoração 2026-05-29: em vez de consultar o banco, validamos via UI que
 * um cert emitido permanece no estado "Emitido" (VALID / situation=2) enquanto
 * não houver uma NOVA emissão via reinscrição que o substitua.
 *
 * Estratégia (confirmada pelo usuário — "Richard Sebold tem linha Emitido 100%"):
 *   Richard Sebold no curso 807287 tem recert_num=1 com cert "Emitido" (VALID).
 *   Esse cert está em estado VALID desde que foi emitido (2026-05-28) e
 *   PERMANECE VALID porque não houve ainda uma TERCEIRA emissão (recert_num=2)
 *   que o substituiria. Isso demonstra o RN 20/21: `replace_previous_certificates_bulk`
 *   só atua quando há nova emissão — sem nova emissão, o cert fica VALID
 *   indefinidamente.
 *
 * TC2 usa agents.edu@claude.com (aluno secundário) — não conflita com TC4.
 * TC1 e TC4 usam Richard Sebold mas por linhas diferentes:
 *   - TC1: asserir que AMBAS as linhas (Substituído + Emitido) coexistem
 *   - TC4: asserir que a linha "Emitido" persiste VALID sem virar Substituído
 *
 * RNs cobertas: 20, 21 — o cert recert_num=1 de Richard permanece situation=2
 * (VALID / "Emitido") porque não há recert_num=2 com cert emitido no env.
 */
export const tc4Data = {
  /** Curso com alunos em diferentes estados de certificado */
  eventId: fixedSeed.cursoComSubstituidoId,
  /**
   * Richard Sebold — aluno com recert_num=1 em estado "Emitido" (VALID).
   * Esse cert permanece VALID porque não há nova emissão (recert_num=2)
   * que o substituiria. Demonstra o comportamento de permanência do RN 20/21.
   *
   * TC2 usa agents.edu@claude.com — não conflita com esta escolha.
   */
  alunoLegadoEmail: fixedSeed.alunoComReinscreverHabilitado_807287,
  /** Badge esperado: cert vigente permanece VALID (Emitido) sem nova emissão */
  expectedBadge: 'Emitido',
  /** Badge que indica REPLACED — NÃO deve estar na linha do cert vigente */
  unexpectedBadge: 'Substituído',
} as const;
