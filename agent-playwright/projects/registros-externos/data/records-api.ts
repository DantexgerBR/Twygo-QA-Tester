import type { Page } from '@playwright/test';
import { getOrgId } from '../../../src/utils/environment.js';

/**
 * Helpers de API para a massa de teste de Registros de Aprendizagem.
 *
 * Usados para PREPARAR e LIMPAR dados (criar Pendentes externos, excluir por
 * marker) de forma rápida e robusta — as AÇÕES de UI (aprovar/recusar/excluir/
 * editar/batch) continuam sendo testadas pela UI nos specs. `page.request`
 * compartilha os cookies do contexto (storageState), então a auth é a mesma.
 *
 * Endpoints + payload validados em recon ao vivo 2026-06-22 (ver recon md).
 * O id retornado pelo POST NÃO é o id da listagem — exclusão é por marker.
 */

/** Catálogo de valores fixos do env staging-registros-externos (recon 2026-06-22). */
export const RECORD_FIXTURE = {
  providerAlura: { label: 'Alura', value: '1057' },
  experienceCurso: { label: 'Curso', value: '848' },
  categoryTecnologia: { label: 'Tecnologia', value: '63' },
  personId: 4298404,
} as const;

function recordsBase(): string {
  return `/api/v1/o/${getOrgId()}/records`;
}

/** Monta o payload de criação de um registro externo Pendente com conteúdo = marker. */
export function buildPendingRecordPayload(marker: string) {
  return {
    record: {
      endDate: '2026-05-10T00:00:00.000Z',
      startDate: null,
      approvalDate: null,
      certificateDate: null,
      expirationDate: null,
      competencies: null,
      contentValue: null,
      grade: null,
      website: null,
      workload_seconds: '0040:00:00',
      workload: '1',
      categories: [RECORD_FIXTURE.categoryTecnologia],
      learningExperience: [RECORD_FIXTURE.experienceCurso],
      provider: [RECORD_FIXTURE.providerAlura],
      content: [{ label: marker, value: marker, __isNew__: true }],
      people: [RECORD_FIXTURE.personId],
      description: [{ children: [{ text: '' }], type: 'p', id: 'qa' }],
    },
  };
}

/** Cria 1 registro externo Pendente com o marker dado. */
export async function createPendingRecord(page: Page, marker: string): Promise<void> {
  const res = await page.request.post(recordsBase(), {
    data: buildPendingRecordPayload(marker),
    headers: { Accept: 'application/json' },
  });
  if (!res.ok()) {
    throw new Error(`createPendingRecord(${marker}) falhou ${res.status()}: ${await res.text()}`);
  }
}

/** Cria N registros Pendentes com markers `${prefix}-i`. Devolve os markers. */
export async function createPendingRecords(page: Page, prefix: string, n: number): Promise<string[]> {
  const markers: string[] = [];
  for (let i = 1; i <= n; i++) {
    const marker = `${prefix}-${i}`;
    await createPendingRecord(page, marker);
    markers.push(marker);
  }
  return markers;
}

interface ApiRecord {
  id: number;
  content?: string;
  situation?: string;
}

/** Lista até 200 registros da org (tolerante a variações de shape). */
export async function listRecords(page: Page): Promise<ApiRecord[]> {
  const res = await page.request.get(`${recordsBase()}?per_page=200`, {
    headers: { Accept: 'application/json' },
  });
  const j = await res.json().catch(() => null);
  if (!j) return [];
  const arr = Array.isArray(j.data) ? j.data : j.data?.records ?? j.records ?? [];
  return Array.isArray(arr) ? arr : [];
}

/** Exclui (por id da listagem) todos os registros cujo conteúdo contém o marker. */
export async function deleteRecordsByMarker(page: Page, marker: string): Promise<number> {
  const all = await listRecords(page);
  const targets = all.filter((r) => typeof r.content === 'string' && r.content.includes(marker));
  for (const t of targets) {
    await page.request
      .delete(`${recordsBase()}/${t.id}`, { headers: { Accept: 'application/json' } })
      .catch(() => undefined);
  }
  return targets.length;
}

export interface RecordStats {
  by_status: { emitted: number; expired: number; pending: number; rejected: number };
  total_general: number;
  workload_total_seconds: number;
}

/**
 * Acha o `content` (usado como termo de busca na UI) do 1º registro existente que
 * casa com origin/situation. Read-only — para inspecionar menu/modal sem mutar.
 */
export async function findRecordContentByStatus(
  page: Page,
  filter: { origin?: string; situation?: string },
): Promise<string | undefined> {
  const all = await listRecords(page);
  const match = (all as Array<ApiRecord & { origin?: string; situation?: string }>).find(
    (r) =>
      (filter.origin ? r.origin === filter.origin : true) &&
      (filter.situation ? r.situation === filter.situation : true) &&
      typeof r.content === 'string' &&
      r.content.length > 0,
  );
  return match?.content;
}

/** Lê o endpoint de contagens (fonte de verdade do KPI — ver skill testar-kpi-cards-twygo). */
export async function getStats(page: Page): Promise<RecordStats> {
  const res = await page.request.get(`${recordsBase()}/stats`, { headers: { Accept: 'application/json' } });
  const j = await res.json();
  const raw = (j?.data ?? j) as {
    by_status?: Record<string, number>;
    total_general?: number;
    workload_total_seconds?: number;
  };
  const bs = raw.by_status ?? {};
  // Produto renomeou o status "Pendentes" de `pending` → `awaiting_confirmation`
  // (revalidação 2026-06-30). Normaliza p/ `pending` que o RecordStats expõe.
  return {
    by_status: {
      emitted: bs.emitted ?? 0,
      expired: bs.expired ?? 0,
      pending: bs.awaiting_confirmation ?? bs.pending ?? 0,
      rejected: bs.rejected ?? 0,
    },
    total_general: raw.total_general ?? 0,
    workload_total_seconds: raw.workload_total_seconds ?? 0,
  };
}
