import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Participant aceito por `POST /api/v2/attendees`.
 *
 * Doc V2 Beta (validada live 2026-05-28) lista campos amplos de cadastro de
 * usuário no participant. Aqui mantemos apenas os campos mínimos necessários
 * para inscrição em conteúdo via API + o campo experimental `recertification`
 * que será validado pelo backend quando devs publicarem.
 *
 * **Status do campo `recertification`** (2026-05-28, validado live):
 * IMPLEMENTADO E ATIVO no backend. Regra de negócio descoberta:
 * - Quando `recertification: true`, backend tenta criar participant
 *   REINSCRITO (recertification_number+1)
 * - Pré-condição: user precisa estar APROVADO na inscrição anterior do
 *   mesmo conteúdo. Senão retorna 422 com erro:
 *   "Aluno já inscrito mas não aprovado — recertificação não criada"
 * - Quando user é novo (sem inscrição prévia) + `recertification: true`,
 *   backend cria inscrição normal (não recertificação) — sem erro
 */
export interface AttendeeParticipant {
  email: string;
  first_name?: string;
  last_name?: string;
  cpf?: string;
  status?: string;
  /** Ativo (validado live 2026-05-28). Ver nota acima sobre regra "user precisa estar aprovado". */
  recertification?: boolean;
}

/**
 * Body do request `POST /api/v2/attendees`.
 *
 * `content_ids` aplica TODOS os participants a CADA content listado (produto
 * cartesiano N×M). Não há `event_id` por participant — é flag global.
 */
export interface AttendeesCreatePayload {
  participants: AttendeeParticipant[];
  content_ids: number[];
}

/**
 * Response real de `POST /api/v2/attendees` (validada live 2026-05-28).
 *
 * **Atenção**: shape difere ligeiramente da Postman doc V2 Beta. Doc mostrava
 * `{participants: {contents: {<id>: {success, error}}}, errors}` (com
 * `.contents` no path); real é `{participants: {success: {<id>: [...]}, error: {<id>: [...]}}, errors}`
 * (sem `.contents`, com `success` e `error` no mesmo nível por content_id).
 *
 * Quando todos os items dão sucesso, response tem apenas `participants.success.<id>`;
 * `participants.error` pode não aparecer. Aceitar `error` opcional via TS.
 */
export interface AttendeesCreateResponseBody {
  participants: {
    success?: { [content_id: string]: Array<{ email: string; cpf?: string }> };
    error?: { [content_id: string]: Array<{ email: string; cpf?: string | null; error?: string[] }> };
  };
  errors: string | Array<{ line: number; errors: string[] }>;
}

/**
 * Cliente HTTP para endpoints V2 de inscrição em conteúdos do projeto
 * Recertificação. Estilo POM para HTTP — concentra construção de URL +
 * headers + payload shape. NÃO faz asserts (devolve `APIResponse` cru).
 *
 * Skill canônica: `testar-api-twygo`.
 *
 * Naming nota: nome original era `EventsApiClient` baseado em hipótese
 * (endpoint `POST /api/v2/users/mass`). Após validação live (2026-05-28)
 * confirmamos que o endpoint real é `POST /api/v2/attendees` — manter
 * nome da classe genérico (cobre mais tipos de inscrição) por enquanto.
 */
export class EventsApiClient {
  constructor(private readonly request: APIRequestContext) {}

  /**
   * `POST /api/v2/attendees` — inscreve participants em 1+ conteúdos.
   *
   * Aceita payload com campo experimental `recertification: true` por
   * participant (ignorado silenciosamente até devs implementarem a feature).
   *
   * @returns `APIResponse` — 200 em sucesso (mass uniforme), 400 quando
   *          payload estrutural inválido OU content_id não-encontrado.
   *          Pode retornar 207 multi-status quando alguns items falham
   *          (não confirmado live ainda).
   */
  async createAttendees(
    payload: AttendeesCreatePayload,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.request.post('/api/v2/attendees', {
      data: payload,
      headers,
    });
  }
}
