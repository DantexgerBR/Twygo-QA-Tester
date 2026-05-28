# api/

Clientes HTTP do projeto Recertificação — equivalente do Page Object Model, mas para REST/GraphQL.

## Convenções

- 1 arquivo por recurso/agrupamento: `<Recurso>ApiClient.ts`
  - Ex: `EventsApiClient.ts`, `UsersApiClient.ts`, `LearningStudentsApiClient.ts`
- Construtor recebe `request: APIRequestContext` (do Playwright)
- Métodos retornam `response` cru — schema validation acontece no spec via `validateAgainstSchema`
- Headers de auth via parâmetro (`headers?: Record<string, string>`) — específicos do TC
- Specs em `../tests/api/` **chamam métodos do cliente**, NUNCA `request.post()` direto (regra dura #16)

## Exemplo

```ts
// api/EventsApiClient.ts
import type { APIRequestContext, APIResponse } from '@playwright/test';

export class EventsApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async createMassEnrollment(payload: object, headers: Record<string, string>): Promise<APIResponse> {
    return this.request.post('/api/v2/users/mass', { data: payload, headers });
  }

  async getEventParticipants(eventId: number, headers: Record<string, string>): Promise<APIResponse> {
    return this.request.get(`/api/v2/events/${eventId}/participants`, { headers });
  }
}
```

## Referências

- [agent-playwright/CLAUDE.md §2.4](../../../CLAUDE.md) — POM aplicado a API
- Skill `testar-api-twygo`
