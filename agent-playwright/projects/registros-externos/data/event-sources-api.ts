import type { Page } from '@playwright/test';
import { getOrgId } from '../../../src/utils/environment.js';

/**
 * Helpers de API para a suíte "CRUD de Provedores" (entidade `event_sources`).
 *
 * Usados só para LIMPAR (deletar provedores criados pelos specs) e para
 * SELECIONAR fixtures (achar provedor com/sem vínculo). As AÇÕES de CRUD
 * (criar/editar/toggle/excluir) são testadas pela UI nos specs.
 *
 * Endpoint real confirmado em probe ao vivo 2026-06-25:
 *   GET    /api/v1/o/{org}/event_sources?per_page=&page=  → { data: { event_sources: [...] } }
 *   DELETE /api/v1/o/{org}/event_sources/:id
 * (a hipótese `/learning_providers` do MD/Spike dá 404 — NÃO existe.)
 *
 * O nome do provedor aparece em records sob o campo `provider` (string),
 * usado para contar vínculos sem precisar de endpoint dedicado.
 */

export interface Provider {
  id: number;
  name: string | null;
  website_url: string | null;
  description: string | null;
  status: string;
  created_at: string;
}

function base(): string {
  return `/api/v1/o/${getOrgId()}/event_sources`;
}

/** Lista todos os provedores da org (paginado). */
export async function listProviders(page: Page): Promise<Provider[]> {
  const all: Provider[] = [];
  for (let p = 1; p <= 10; p++) {
    const res = await page.request.get(`${base()}?per_page=100&page=${p}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok()) break;
    const j = await res.json().catch(() => null);
    const list: Provider[] = j?.data?.event_sources ?? [];
    all.push(...list);
    if (list.length < 100) break;
  }
  return all;
}

export async function deleteProviderById(page: Page, id: number): Promise<boolean> {
  const res = await page.request
    .delete(`${base()}/${id}`, { headers: { Accept: 'application/json' } })
    .catch(() => null);
  return res?.ok() ?? false;
}

/**
 * Deleta TODOS os provedores cujo nome bate exatamente com algum dos nomes
 * dados (runs anteriores deixam homônimos — limpa todos). Tolerante a falha:
 * cleanup nunca derruba o afterAll. Devolve quantos foram removidos.
 */
export async function deleteProvidersByNameSafe(page: Page, names: string[]): Promise<number> {
  const wanted = new Set(names);
  let removed = 0;
  try {
    const providers = await listProviders(page);
    for (const p of providers) {
      if (p.name !== null && wanted.has(p.name)) {
        if (await deleteProviderById(page, p.id)) removed++;
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console -- diagnóstico em afterAll
    console.warn(`[deleteProvidersByNameSafe] falha no cleanup: ${(err as Error).message}`);
  }
  return removed;
}

export async function findProviderByName(page: Page, name: string): Promise<Provider | undefined> {
  const providers = await listProviders(page);
  return providers.find((p) => p.name === name);
}

/** Conta registros vinculados a um provedor (pelo nome no campo `provider`). */
export async function countRecordsByProvider(page: Page, providerName: string): Promise<number> {
  const res = await page.request.get(`/api/v1/o/${getOrgId()}/records?per_page=200`, {
    headers: { Accept: 'application/json' },
  });
  const j = await res.json().catch(() => null);
  const arr = Array.isArray(j?.data) ? j.data : (j?.data?.records ?? j?.records ?? []);
  return (arr as Array<{ provider?: string }>).filter((r) => r.provider === providerName).length;
}
