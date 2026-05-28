import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Item de payload aceito por `POST /api/v2/users/mass`.
 *
 * `recertification: true` força a criação de um participant reinscrito
 * (incrementa `recertification_number`) quando o evento tem
 * `has_recertification = true`. Quando omitido, segue o fluxo de inscrição
 * legado (regressão coberta por TC3).
 *
 * Ref: AT Recertificação suíte "Reinscrição via API V2" + endpoint catalogado
 * em `## Endpoints (referência)` do test-analysis.md.
 */
export interface MassEnrollmentParticipant {
  email: string;
  event_id: number;
  recertification?: boolean;
}

export interface MassEnrollmentPayload {
  participants: MassEnrollmentParticipant[];
}

/**
 * Shape esperado do body da response de `POST /api/v2/users/mass`.
 *
 * Cobre tanto status 200 (sucesso uniforme) quanto 207 (multi-status com
 * mix de success/error por item). Schema correspondente em
 * `projects/recertificacao/schemas/mass-enrollment-response.schema.json` —
 * validador Ajv enforce em runtime; este TS apenas narrow type após
 * `validateAgainstSchema<MassEnrollmentResponseBody>(...)`.
 */
export interface MassEnrollmentResponseBody {
  data: {
    results: Array<{
      email: string;
      status: 'success' | 'error';
      participant_id?: number;
      recertification_number?: number;
      error?: {
        code?: string;
        message?: string;
        i18n_key?: string;
        [key: string]: unknown;
      };
    }>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Cliente HTTP para endpoints `/api/v2/events` e `/api/v2/users` relacionados
 * a inscrição/reinscrição em cursos.
 *
 * Estilo POM para HTTP — concentra construção de URL + headers + shape de
 * payload. NÃO faz asserts (devolve `APIResponse` cru). Specs em
 * `tests/api/` chamam métodos deste cliente em vez de `request.post(...)`
 * direto — regra dura #16 do agent-playwright/CLAUDE.md.
 *
 * Skill canônica: `testar-api-twygo`.
 */
export class EventsApiClient {
  constructor(private readonly request: APIRequestContext) {}

  /**
   * `POST /api/v2/users/mass` — cria/inscreve participants em massa.
   * Suporta payload com `recertification: true` por item para forçar
   * reinscrição (depende de `has_recertification = true` no evento E
   * feature flag `:recertificacao` ON na org).
   *
   * @returns `APIResponse` — status pode ser 200 (sucesso uniforme) ou
   *          207 (multi-status com array de resultados, alguns success +
   *          alguns error por item)
   */
  async createMassEnrollment(
    payload: MassEnrollmentPayload,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.request.post('/api/v2/users/mass', {
      data: payload,
      headers,
    });
  }
}
