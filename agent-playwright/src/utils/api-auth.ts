import { request as playwrightRequest } from '@playwright/test';

/**
 * Provê headers de autenticação para specs em `tests/api/` do agent-playwright.
 *
 * Skill canônica: `provisionar-token-api-twygo`.
 *
 * **Modos suportados** (selecionado via `API_AUTH_MODE` no `.env`):
 * - `fixed_token` (default) — usa `API_TOKEN` pré-gerado via Super Admin
 * - `oauth_password` — POST /oauth/token em runtime com `API_OAUTH_USERNAME`/`PASSWORD`
 * - `super_admin_generated` — reservado para v2 (throws com instruções)
 *
 * Token é cacheado em memória após a primeira chamada (singleton por processo).
 * Se um TC específico precisa de token de OUTRA org, ainda não há helper —
 * adicionar `getApiAuthHeadersForOrg(orgId)` quando o caso real aparecer.
 *
 * @example
 * ```ts
 * test.beforeAll(async () => {
 *   authHeaders = await getApiAuthHeaders();
 * });
 * ```
 */
export async function getApiAuthHeaders(): Promise<Record<string, string>> {
  if (cachedHeaders) return cachedHeaders;
  const mode = (process.env.API_AUTH_MODE ?? 'fixed_token').trim();
  switch (mode) {
    case 'fixed_token':
      cachedHeaders = buildHeadersFixedToken();
      break;
    case 'oauth_password':
      cachedHeaders = await buildHeadersOAuthPassword();
      break;
    case 'super_admin_generated':
      throw new Error(
        '[getApiAuthHeaders] API_AUTH_MODE=super_admin_generated não implementado em v1.2. ' +
          'Use fixed_token ou oauth_password. Skill: provisionar-token-api-twygo.',
      );
    default:
      throw new Error(
        `[getApiAuthHeaders] API_AUTH_MODE inválido: "${mode}". ` +
          'Valores aceitos: fixed_token | oauth_password | super_admin_generated.',
      );
  }
  return cachedHeaders;
}

/**
 * Limpa o cache de token. Útil em testes que precisam forçar nova
 * autenticação (ex: validar revogação de token).
 */
export function resetApiAuthCache(): void {
  cachedHeaders = null;
}

// ---------------------------------------------------------------------------
// Implementação interna
// ---------------------------------------------------------------------------

let cachedHeaders: Record<string, string> | null = null;

function buildHeadersFixedToken(): Record<string, string> {
  const token = (process.env.API_TOKEN ?? '').trim();
  if (!token) {
    throw new Error(
      '[getApiAuthHeaders] API_AUTH_MODE=fixed_token requer API_TOKEN no .env. ' +
        'Gere via Super Admin → org de teste → aba API → "Gerar token de acesso". ' +
        'Skill: provisionar-token-api-twygo.',
    );
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

async function buildHeadersOAuthPassword(): Promise<Record<string, string>> {
  const baseURL = (process.env.API_BASE_URL ?? '').trim();
  const username = (process.env.API_OAUTH_USERNAME ?? '').trim();
  const password = (process.env.API_OAUTH_PASSWORD ?? '').trim();
  if (!baseURL || !username || !password) {
    throw new Error(
      '[getApiAuthHeaders] API_AUTH_MODE=oauth_password requer API_BASE_URL + ' +
        'API_OAUTH_USERNAME + API_OAUTH_PASSWORD no .env. ' +
        'Skill: provisionar-token-api-twygo.',
    );
  }
  const ctx = await playwrightRequest.newContext({ baseURL });
  try {
    const response = await ctx.post('/oauth/token', {
      data: { grant_type: 'password', username, password },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok()) {
      const body = await response.text();
      throw new Error(
        `[getApiAuthHeaders] POST /oauth/token retornou ${response.status()}: ${body.slice(0, 200)}`,
      );
    }
    const body = (await response.json()) as { access_token?: string };
    const accessToken = body.access_token?.trim();
    if (!accessToken) {
      throw new Error(
        '[getApiAuthHeaders] /oauth/token response sem access_token.',
      );
    }
    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  } finally {
    await ctx.dispose();
  }
}
