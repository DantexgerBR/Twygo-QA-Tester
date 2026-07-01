import { fixedSeed } from '../../data/fixed-seed.data.js';
import type { AttendeesCreatePayload } from '../../api/EventsApiClient.js';

/**
 * Payloads dos TCs da suite "Reinscrição via API V2".
 *
 * **Atualizado em 2026-05-28** após validação live contra
 * `recertificacao-testeqa.stage.twygoead.com`:
 *
 * - Endpoint real é `POST /api/v2/attendees`, não `/users/mass`
 * - Body real é `{participants: [...], content_ids: [...]}` (com `content_ids`
 *   GLOBAL, aplica a TODOS os participants — não há `event_id` por participant)
 * - Campo `recertification` por participant é aceito silenciosamente; feature
 *   ainda não publicada pelos devs (ver TODOs)
 *
 * **Semântica TC2 mudou**: AT original previa "item com `recertification=true`
 * em curso com `has_recertification=false` retorna erro por item". Como
 * `content_ids` é global na V2 Beta, isso só funciona com 2 requests separados
 * OU se devs introduzirem variação per-participant no endpoint final. TC2
 * mantém intenção mas implementação aguarda definição backend.
 */
export const reinscricaoV2Data = {
  /**
   * TC1 — participant com `recertification: true` num curso com
   * has_recertification (quando feature shipped).
   */
  payloadTC1: {
    participants: [
      {
        email: fixedSeed.alunoReinscricaoEmail,
        first_name: 'Aluno',
        last_name: 'TC1',
        status: '1',
        recertification: true,  // TODO: validar quando backend implementar
      },
    ],
    content_ids: [fixedSeed.cursoComRecertificacaoEventId],
  } satisfies AttendeesCreatePayload,

  /**
   * TC2 — payload misto: 2 participants + 2 content_ids (1 com / 1 sem
   * recertification). Validar response per content_id (`participants.success.<id>`
   * vs `participants.error.<id>`).
   *
   * NOTA: como content_ids é global, ambos os participants serão inscritos em
   * AMBOS os cursos. O teste original (mix válido/inválido por participant)
   * não mapeia 1-1 aqui — comportamento esperado precisa ser revisitado.
   */
  payloadTC2_misto: {
    participants: [
      {
        email: fixedSeed.alunoReinscricaoEmail,
        first_name: 'Aluno',
        last_name: 'TC2a',
        status: '1',
        recertification: true,
      },
      {
        email: fixedSeed.alunoLegadoEmail,
        first_name: 'Aluno',
        last_name: 'TC2b',
        status: '1',
        recertification: true,
      },
    ],
    content_ids: [
      fixedSeed.cursoComRecertificacaoEventId,
      fixedSeed.cursoSemRecertificacaoEventId,
    ],
  } satisfies AttendeesCreatePayload,

  /**
   * TC3 — payload SEM chave `recertification` (regressão de compatibilidade).
   */
  payloadTC3_legado: {
    participants: [
      {
        email: fixedSeed.alunoLegadoEmail,
        first_name: 'Aluno',
        last_name: 'TC3',
        status: '1',
      },
    ],
    content_ids: [fixedSeed.cursoComRecertificacaoEventId],
  } satisfies AttendeesCreatePayload,

  /**
   * TC4 — payload com `recertification: true` em cenário "flag OFF".
   * Espera HTTP 200 sem erro de feature flag (param ignorado silenciosamente).
   */
  payloadTC4_flagOff: {
    participants: [
      {
        email: fixedSeed.alunoFlagOffEmail,
        first_name: 'Aluno',
        last_name: 'TC4',
        status: '1',
        recertification: true,
      },
    ],
    content_ids: [fixedSeed.cursoComRecertificacaoEventId],
  } satisfies AttendeesCreatePayload,

  /**
   * Substring esperada no `error.reason` ou em `errors` global do TC2.
   * Backend emite (conforme AT)
   * `reenroll_participant.errors.recertification_disabled_for_event`.
   * Quando feature shipped, validar match.
   */
  expectedRecertificationDisabledI18nKey: 'recertification_disabled_for_event',
} as const;
