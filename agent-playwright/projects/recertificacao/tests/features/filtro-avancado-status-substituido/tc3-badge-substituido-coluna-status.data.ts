/**
 * Dados específicos do TC3 — "Badge 'Substituído' é exibido na coluna de
 * Status para participants com `certificate_status = 4`".
 *
 * Seed criada em 2026-05-28 no curso 807287 ("curso para reinscriçao"):
 * Richard Sebold tem 5 inscrições (recert_num 0..4). recert_num=0
 * (id 44274543) tem certificate_situation=4 (REPLACED). Mesma seed do TC2.
 *
 * `participantIdentifier` está VAZIO de propósito: como o Richard tem 5
 * inscrições no mesmo curso (apenas a recert_num=0 é REPLACED), filtrar
 * por "Richard Sebold" + .first() pega uma row qualquer. O spec usa o
 * branch alternativo: aplica filtro "Substituído", garantindo que TODA
 * linha visível é REPLACED, e valida o badge na primeira.
 */
import { fixedSeed } from '../../../data/fixed-seed.data.js';

export const tc3Data = {
  eventId: fixedSeed.cursoComSubstituidoId,
  expectedBadgeLabel: 'Substituído',
  participantIdentifier: '',
} as const;
