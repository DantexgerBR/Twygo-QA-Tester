import { fixedSeed } from '../../../data/fixed-seed.data.js';

/**
 * Dados do TC1 — Após emitir novo certificado, anteriores são marcados
 * em lote como REPLACED.
 *
 * Pré-condição de seed (preparada manualmente em 2026-05-28 via UI admin
 * no curso 807287 "curso para reinscriçao"):
 *   - Richard Sebold tem 5 inscrições (recert_num 0..4).
 *   - Emissão de certs em recert_num=0 e recert_num=1 (via UI "Emitir
 *     certificado") fez o recert_num=0 virar REPLACED (situation=4)
 *     automaticamente pelo `replace_previous_certificates_bulk`.
 *   - Confirmado via /e/807287/learning: recert_num=0 → "Substituído",
 *     recert_num=1 → "Emitido".
 *
 * A validação de UI observa o efeito do RN 20/21 já ocorrido no env:
 * a mesma linha do aluno que tem cert mais antigo exibe "Substituído" e
 * a linha com cert mais recente exibe "Emitido" — evidência de que o
 * `update_all` em lote ocorreu corretamente.
 */
export const tc1Data = {
  /** Curso com aluno Richard Sebold em estado REPLACED + Emitido */
  eventId: fixedSeed.cursoComSubstituidoId,
  /** E-mail do aluno com inscrições de múltiplos recert_nums */
  alunoEmail: fixedSeed.alunoComReinscreverHabilitado_807287,
  /** Badge esperado na linha de cert mais antigo (RN 20: REPLACED = 4) */
  expectedBadgeSubstituido: 'Substituído',
  /** Badge esperado na linha de cert mais recente (VALID = 2) */
  expectedBadgeEmitido: 'Emitido',
} as const;
