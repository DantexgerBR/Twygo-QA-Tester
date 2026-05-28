import { fixedSeed } from '../../data/fixed-seed.data.js';
import type { MassEnrollmentPayload } from '../../api/EventsApiClient.js';

/**
 * Payloads dos TCs da suite "Reinscrição via API V2".
 *
 * Constantes vivem aqui (não inline no spec) — anti-pattern E do §7.6
 * do agent-playwright/CLAUDE.md aplicado a API: payload é constante de
 * domínio, vai em `.data.ts`.
 *
 * IDs concretos resolvidos a partir de `fixed-seed.data.ts` (que deve ser
 * populado manualmente — ver TODOs lá). Se os IDs estiverem em sentinel `0`,
 * o spec falha com mensagem clara no `beforeAll`.
 */
export const reinscricaoV2Data = {
  /**
   * TC1 — payload mínimo com `recertification: true` para o curso elegível.
   */
  payloadTC1: {
    participants: [
      {
        email: fixedSeed.alunoReinscricaoEmail,
        event_id: fixedSeed.cursoComRecertificacaoEventId,
        recertification: true,
      },
    ],
  } satisfies MassEnrollmentPayload,

  /**
   * TC2 — payload misto: item válido (curso com recertification) + item
   * inválido (curso sem). Espera HTTP 207 com 1 success + 1 error.
   */
  payloadTC2_misto: {
    participants: [
      {
        email: fixedSeed.alunoReinscricaoEmail,
        event_id: fixedSeed.cursoComRecertificacaoEventId,
        recertification: true,
      },
      {
        email: fixedSeed.alunoLegadoEmail,
        event_id: fixedSeed.cursoSemRecertificacaoEventId,
        recertification: true,
      },
    ],
  } satisfies MassEnrollmentPayload,

  /**
   * TC3 — payload SEM chave `recertification` (regressão de compatibilidade).
   * Aluno é inscrito como `recertification_number = 0` (fluxo legado).
   */
  payloadTC3_legado: {
    participants: [
      {
        email: fixedSeed.alunoLegadoEmail,
        event_id: fixedSeed.cursoComRecertificacaoEventId,
      },
    ],
  } satisfies MassEnrollmentPayload,

  /**
   * TC4 — payload com `recertification: true` em cenário "flag OFF".
   * Espera HTTP 200 sem erro de feature flag (param ignorado silenciosamente).
   */
  payloadTC4_flagOff: {
    participants: [
      {
        email: fixedSeed.alunoFlagOffEmail,
        event_id: fixedSeed.cursoComRecertificacaoEventId,
        recertification: true,
      },
    ],
  } satisfies MassEnrollmentPayload,

  /**
   * Substring esperada no `error.i18n_key` ou `error.message` do item B do TC2.
   * Backend emite `reenroll_participant.errors.recertification_disabled_for_event`
   * conforme AT.
   */
  expectedRecertificationDisabledI18nKey: 'recertification_disabled_for_event',
} as const;
