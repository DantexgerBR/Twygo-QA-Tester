/**
 * Cleanup de recursos seed orfãos no env staging-recertificacao.
 *
 * Phase 6 do roadmap "zero hardcoded" (2026-06-03). Fixtures dinâmicas
 * (cursoSeed, trilhaSeed, alunoComSenhaSeed, alunoAprovadoSeed) criam
 * recursos com nome worker-isolated `<Tipo> Seed w<workerIndex>-<timestamp>`.
 * Quando um cleanup `afterAll` falha por crash do worker, timeout, ou run
 * interrompida (Ctrl+C, OOM), o recurso fica orfão no env. Sem este script,
 * o env acumula linearmente.
 *
 * **Política de retenção**: recursos com timestamp > 24h são considerados
 * orfãos (uma run normal não dura > 1h). Recursos < 24h podem ser de uma
 * run em andamento em paralelo — não deletar.
 *
 * **Uso**:
 *
 * ```bash
 * # Dry run (default) — lista o que seria deletado
 * npx tsx scripts/cleanup-env-orphans.ts
 *
 * # Apply — efetivamente deleta
 * npx tsx scripts/cleanup-env-orphans.ts --apply
 *
 * # Threshold customizado (default 24h)
 * npx tsx scripts/cleanup-env-orphans.ts --apply --hours=48
 * ```
 *
 * **Pré-requisito**: `outputs/.auth/storage.json` válido. Rode o `globalSetup`
 * via qualquer spec antes (ou `PROJECT=recertificacao npx playwright test
 * tests/setup/smoke.spec.ts`).
 *
 * **Cron** (sugestão): rodar diariamente via GitHub Actions/cron local.
 * Hoje é manual — habilitação via cron fica pra V2 quando tiver pipeline CI.
 */
import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { SeedAdminPage } from '../projects/recertificacao/pages/SeedAdminPage.js';
import { getBaseUrl, getOrgId } from '../src/utils/environment.js';
import { safeGoto } from '../src/utils/modals.js';

const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');

interface CliOpts {
  apply: boolean;
  hours: number;
}

function parseArgs(argv: string[]): CliOpts {
  const apply = argv.includes('--apply');
  const hoursArg = argv.find((a) => a.startsWith('--hours='));
  const hours = hoursArg ? Number(hoursArg.split('=')[1]) : 24;
  if (!Number.isFinite(hours) || hours <= 0) {
    throw new Error(`[cleanup-env-orphans] --hours inválido: ${hoursArg}`);
  }
  return { apply, hours };
}

/**
 * Parseia o sufixo `w<workerIndex>-<timestamp>` que as fixtures aplicam.
 * Retorna o timestamp em ms, ou null se o nome não casa o padrão.
 */
function extractTimestamp(name: string): number | null {
  const m = name.match(/w\d+-(\d{10,16})$/);
  return m ? Number(m[1]) : null;
}

interface Orphan {
  id: number;
  name: string;
  ageHours: number;
  kind: 'curso' | 'trilha';
}

async function listOrphans(
  page: import('@playwright/test').Page,
  cutoffMs: number,
): Promise<Orphan[]> {
  await safeGoto(page, `/o/${getOrgId()}/events?tab=events`);

  // Cada linha da listagem tem link pra `/e/{id}/edit` com texto = nome do curso.
  // Coletamos todos os pares (nome, id) sem assumir estrutura tbody específica —
  // safe contra mudanças de layout.
  const rows = await page
    .locator('a[href*="/e/"][href*="/edit"], a[href*="/contents/"][href*="/edit"]')
    .evaluateAll((els) =>
      els.map((el) => {
        const a = el as HTMLAnchorElement;
        const href = a.getAttribute('href') ?? '';
        const idMatch = href.match(/\/(?:e|contents)\/(\d+)\/edit/);
        return {
          name: (a.textContent ?? '').trim(),
          id: idMatch ? Number(idMatch[1]) : null,
        };
      }),
    );

  const orphans: Orphan[] = [];
  const now = Date.now();
  const seen = new Set<number>();

  for (const { name, id } of rows) {
    if (id === null || seen.has(id)) continue;
    seen.add(id);

    const ts = extractTimestamp(name);
    if (ts === null) continue;

    const ageMs = now - ts;
    if (ageMs < cutoffMs) continue;

    const kind: Orphan['kind'] = name.startsWith('Trilha Seed') ? 'trilha' : 'curso';
    orphans.push({
      id,
      name,
      ageHours: Math.round((ageMs / (60 * 60 * 1000)) * 10) / 10,
      kind,
    });
  }

  return orphans;
}

async function main(): Promise<void> {
  const { apply, hours } = parseArgs(process.argv.slice(2));
  const cutoffMs = hours * 60 * 60 * 1000;

  // eslint-disable-next-line no-console -- saída esperada de CLI
  console.log(
    `[cleanup-env-orphans] modo=${apply ? 'APPLY' : 'DRY-RUN'} threshold=${hours}h baseUrl=${getBaseUrl()} orgId=${getOrgId()}`,
  );

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ storageState: STORAGE_PATH });
  const page = await ctx.newPage();
  const seed = new SeedAdminPage(page);

  try {
    const orphans = await listOrphans(page, cutoffMs);

    if (orphans.length === 0) {
      // eslint-disable-next-line no-console
      console.log('[cleanup-env-orphans] Nenhum orfão acima do threshold. Limpeza nada-a-fazer.');
      return;
    }

    // eslint-disable-next-line no-console
    console.log(`[cleanup-env-orphans] ${orphans.length} orfão(s) identificado(s):`);
    for (const o of orphans) {
      // eslint-disable-next-line no-console
      console.log(`  - [${o.kind}] id=${o.id}  age=${o.ageHours}h  name="${o.name}"`);
    }

    if (!apply) {
      // eslint-disable-next-line no-console
      console.log('[cleanup-env-orphans] DRY-RUN — nada deletado. Re-rode com --apply.');
      return;
    }

    let deleted = 0;
    let failed = 0;
    for (const o of orphans) {
      try {
        await seed.deleteCursoByIdSafe(o.id);
        deleted++;
        // eslint-disable-next-line no-console
        console.log(`  ✓ deletado id=${o.id}`);
      } catch (err) {
        failed++;
        // eslint-disable-next-line no-console
        console.warn(`  ✗ falha id=${o.id}: ${(err as Error).message}`);
      }
    }

    // eslint-disable-next-line no-console
    console.log(`[cleanup-env-orphans] deletados=${deleted} falhas=${failed}`);
  } finally {
    await ctx.close();
    await browser.close();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[cleanup-env-orphans] erro fatal:', err);
  process.exit(1);
});
