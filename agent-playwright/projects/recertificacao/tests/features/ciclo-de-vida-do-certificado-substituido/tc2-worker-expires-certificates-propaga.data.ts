import { fixedSeed } from '../../../data/fixed-seed.data.js';

/**
 * Dados do TC2 — Expirar certificado de aluno aprovado e validar via UI.
 *
 * Refatoração 2026-05-29: em vez de disparar o worker `ExpiresCertificates`
 * via Rails console, usamos a ação "Expirar certificado" disponível no menu
 * kebab da linha do aluno em /e/{cursoId}/learning (helper v1.7.0 da
 * LearningStudentsPage). Essa ação UI força `certificate_situation = expired`
 * no participante, que é o mesmo efeito que o RN 22/22.1 valida.
 *
 * Aluno com reinscrição habilitada no curso 807287 (recert_num=1 → cert Emitido).
 * Expirar o cert do recert_num=1 via UI → validar badge "Expirado" na listagem.
 *
 * NOTA: `alunoComReinscreverHabilitadoSecundario_807287` é usado pois o
 * aluno principal (Richard Sebold) tem linha "Emitido" em recert_num=1
 * mas também tem "Substituído" em recert_num=0 — ambos podem ser usados.
 * Escolhemos Richard (alunoComReinscreverHabilitado) para manter consistência
 * com TC1, filtrando pela linha "Emitido".
 */
export const tc2Data = {
  /** Curso seed com aluno aprovado e cert emitido */
  eventId: fixedSeed.cursoComSubstituidoId,
  /**
   * Aluno com cert "Emitido" no curso 807287 — aluno SECUNDÁRIO
   * (agents.edu@claude.com) para NÃO colidir com TC1.
   *
   * TC1 usa Richard Sebold (alunoComReinscreverHabilitado_807287) cujas
   * linhas "Substituído" e "Emitido" NÃO devem ser alteradas.
   * TC2 usa o aluno secundário (agents.edu@claude.com) que também tem
   * cert emitido no curso 807287 com "Reinscrever habilitado".
   *
   * AVISO: este TC ALTERA ESTADO PERSISTENTE do env. Após expirar
   * o cert de `agents.edu@claude.com` via UI, a linha mudará de
   * "Emitido" para "Expirado" permanentemente.
   *
   * Se o estado do env for corrompido (linha já expirada), recriar:
   *   1. Entrar em /e/807287/learning como admin
   *   2. No menu kebab da linha "Expirado" do aluno, verificar se
   *      há opção "Emitir certificado" ou aprovar novamente via critério
   *   3. Atualizar tc2Data.alunoEmail se necessário
   */
  alunoEmail: fixedSeed.alunoComReinscreverHabilitadoSecundario_807287,
  /** Estado da linha alvo antes da ação (cert mais recente/válido) */
  certStateAntes: 'Emitido',
  /** Badge esperado após "Expirar certificado" */
  expectedBadgeApos: 'Expirado',
} as const;
