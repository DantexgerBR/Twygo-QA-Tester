import type { Page } from '@playwright/test';

/**
 * Faz request à API REST Twygo a partir do contexto autenticado da page.
 * Herda cookies de sessão via `credentials: 'include'` e injeta o CSRF token
 * do meta tag — exatamente o que o backend Twygo aceita pra requests non-GET.
 *
 * **Quando usar**: seed via API (bulk-create, setup de fixture), cleanup
 * (DELETE em afterAll/afterEach), e validações secundárias que não justificam
 * percorrer a UI. Bulk de 10 itens via API: ~3s. Via UI: ~3-5min.
 *
 * **Quando NÃO usar**: o teste valida o próprio fluxo UI (criar via form
 * é o objeto do teste). Aí caminho via UI é mandatório — não vale "atalhar"
 * pela API.
 *
 * **Padrão antes deste helper** (3 call sites com fetch+CSRF duplicado em
 * `bulk-repositorios-com-conteudo-no-adicional.spec.ts`, `tc4-validar-empty-state.spec.ts`,
 * `KnowledgeRepositoryListPage.deleteRepositoryByNameSafe`):
 *
 * ```ts
 * await page.evaluate(async ({ orgId, id }) => {
 *   const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
 *   const res = await fetch(`/api/v1/o/${orgId}/knowledge_repositories/${id}`, {
 *     method: 'DELETE',
 *     headers: { 'X-CSRF-Token': csrf, Accept: 'application/json' },
 *     credentials: 'include',
 *   });
 *   return res.status;
 * }, { orgId, id });
 * ```
 *
 * Com este helper:
 *
 * ```ts
 * const { ok, status } = await apiRequest(page, 'DELETE', `/api/v1/o/${orgId}/knowledge_repositories/${id}`);
 * if (!ok) console.warn(`DELETE failed: ${status}`);
 * ```
 *
 * **`path`** é relativo ao baseURL do contexto Playwright (começa com `/`).
 * Não inclua o host — `credentials: 'include'` exige same-origin.
 *
 * **`body`** (opcional): objeto JS; será stringificado e enviado com
 * `Content-Type: application/json`. Pra GET/DELETE sem body, omita.
 *
 * Retorna `{ status, ok, body }` — caller decide se quer parsear JSON
 * via `JSON.parse(body)`. Sem parse automático pra não engolir respostas
 * non-JSON (HTML de erro 500, redirect para login, etc).
 *
 * Documentação completa: skill `testar-tabs-progressivas-twygo` (seção
 * "Seed via API").
 */
export async function apiRequest(
  page: Page,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<{ status: number; ok: boolean; body: string }> {
  return page.evaluate(
    async (args) => {
      const csrf =
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
      const init: RequestInit = {
        method: args.method,
        headers: {
          'X-CSRF-Token': csrf,
          Accept: 'application/json',
        },
        credentials: 'include',
      };
      if (args.body !== undefined) {
        (init.headers as Record<string, string>)['Content-Type'] = 'application/json';
        init.body = JSON.stringify(args.body);
      }
      const res = await fetch(args.path, init);
      const text = await res.text();
      return { status: res.status, ok: res.ok, body: text };
    },
    { method, path, body },
  );
}
