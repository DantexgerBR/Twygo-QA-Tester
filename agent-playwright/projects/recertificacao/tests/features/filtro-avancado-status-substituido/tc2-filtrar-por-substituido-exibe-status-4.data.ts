/**
 * Dados específicos do TC2 — "Filtrar por 'Substituído' exibe apenas alunos
 * com `certificate_status = 4` (REPLACED)".
 *
 * Pré-condição declarada no MD (suite 09): ao menos 1 aluno com
 * `certificate_status = 4` (REPLACED) no curso indicado por `eventId`.
 *
 * `eventId` deve apontar para um curso pré-existente no env
 * `staging-base-de-conhecimento` (orgId 37007) cuja lista de aprendizagem
 * contenha pelo menos 1 participant em status REPLACED para que a
 * asserção da query do filtro (linhas restantes apenas REPLACED) tenha
 * sample suficiente.
 *
 * REVISAR-SEED: validar via SQL:
 *   `SELECT event_id FROM event_participant_infos
 *      WHERE certificate_status = 4 LIMIT 1;`
 */
import { fixedSeed } from '../../../data/fixed-seed.data.js';

export const tc2Data = {
  eventId: fixedSeed.emptyCursoId,
  optionLabel: 'Substituído',
  // Texto exato do badge esperado em cada linha filtrada. Mesmo label do filtro.
  expectedBadgeLabel: 'Substituído',
} as const;
