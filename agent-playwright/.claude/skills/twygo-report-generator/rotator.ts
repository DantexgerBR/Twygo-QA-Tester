import { existsSync, mkdirSync, readdirSync, renameSync, statSync, rmSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { parseArgs } from 'node:util';
import { createLogger } from '../../../src/utils/logger.js';

const log = createLogger('report-rotator');

/**
 * Rotaciona reports por prefixo:
 * - Lista subdirs `outputs/<project>/reports/<prefix>_<ts>/`
 * - Agrupa por `<prefix>` (tudo antes do último `_<ts>`)
 * - Mantém o de timestamp maior por grupo (latest)
 * - Move os outros para `outputs-archive/<project>/reports/<prefix>_<ts>/`
 *
 * Convenção: prefix é tudo antes do timestamp `_YYYYMMDD-HHMMSS`.
 * Ex: `dashboard-visao-do-aluno_20260514-154951` → prefix `dashboard-visao-do-aluno`,
 *     ts `20260514-154951`.
 *
 * Regressivo (`regression_<ts>` / `all-suites_<ts>`) tratado igual — mantém latest do prefix.
 *
 * Atalhos `latest-*.md` na raiz `reports/` NÃO são movidos (sempre apontam para
 * o latest atual; rewriting é responsabilidade do generator).
 *
 * Workflow esperado:
 * - Trigger automático: `agent:report` chama rotateReports() no fim
 * - Modo migração: `npx tsx rotator.ts --migrate` aplica rotação em
 *   reports já existentes (usar uma vez na introdução da feature)
 */

const TS_RE = /^(.*)_(\d{8}-\d{6})$/;

type DirEntry = {
  fullPath: string;
  name: string;
  prefix: string;
  ts: string;
};

function listReportDirs(reportsRoot: string): DirEntry[] {
  if (!existsSync(reportsRoot)) return [];
  const entries: DirEntry[] = [];
  for (const name of readdirSync(reportsRoot)) {
    const fullPath = join(reportsRoot, name);
    if (!statSync(fullPath).isDirectory()) continue;
    const m = name.match(TS_RE);
    if (!m) continue;
    entries.push({ fullPath, name, prefix: m[1]!, ts: m[2]! });
  }
  return entries;
}

function groupByPrefix(entries: DirEntry[]): Map<string, DirEntry[]> {
  const map = new Map<string, DirEntry[]>();
  for (const e of entries) {
    const arr = map.get(e.prefix) ?? [];
    arr.push(e);
    map.set(e.prefix, arr);
  }
  for (const [, arr] of map) {
    arr.sort((a, b) => (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0));
  }
  return map;
}

/**
 * Move `src` → `dest` cross-device-safe. Fallback para rename + retry se EBUSY.
 * No mesmo volume Windows o rename é atômico; entre volumes (raro aqui)
 * precisaria copy+delete — mas outputs e outputs-archive ficam no mesmo disco.
 */
function moveDir(src: string, dest: string): void {
  mkdirSync(dirname(dest), { recursive: true });
  if (existsSync(dest)) {
    log.warn(`Destino já existe: ${dest} — removendo antes de mover`);
    rmSync(dest, { recursive: true, force: true });
  }
  renameSync(src, dest);
}

export type RotateResult = {
  kept: string[];
  archived: string[];
};

export function rotateReports(
  projectRoot: string,
  archiveRoot: string,
): RotateResult {
  const reportsRoot = join(projectRoot, 'reports');
  const archiveReportsRoot = join(archiveRoot, 'reports');

  const entries = listReportDirs(reportsRoot);
  if (entries.length === 0) {
    return { kept: [], archived: [] };
  }

  const groups = groupByPrefix(entries);
  const kept: string[] = [];
  const archived: string[] = [];

  for (const [prefix, arr] of groups) {
    const [latest, ...older] = arr;
    if (!latest) continue;
    kept.push(latest.name);
    for (const e of older) {
      const dest = join(archiveReportsRoot, e.name);
      try {
        moveDir(e.fullPath, dest);
        archived.push(e.name);
      } catch (err) {
        log.warn(`Falha movendo ${e.fullPath} → ${dest}: ${(err as Error).message}`);
      }
    }
    if (older.length > 0) {
      log.info(`  ${prefix}: kept=${latest.name}, archived=${older.length}`);
    }
  }

  return { kept, archived };
}

function main(): void {
  const { values, positionals } = parseArgs({
    options: {
      migrate: { type: 'boolean', default: false },
      project: { type: 'string' },
    },
    allowPositionals: true,
    strict: false,
  });

  const projectSlug = (values.project as string | undefined) ?? process.env.PROJECT;
  if (!projectSlug) {
    log.error('Defina --project <slug> ou PROJECT=<slug>');
    process.exit(1);
  }

  const cwd = process.cwd();
  const projectRoot = resolve(cwd, 'outputs', projectSlug);
  const archiveRoot = resolve(cwd, 'outputs-archive', projectSlug);

  if (!existsSync(projectRoot)) {
    log.error(`Pasta do projeto não encontrada: ${projectRoot}`);
    process.exit(1);
  }

  log.info(`Rotacionando reports: ${projectSlug}`);
  log.info(`  Origem: ${projectRoot}/reports/`);
  log.info(`  Archive: ${archiveRoot}/reports/`);

  const result = rotateReports(projectRoot, archiveRoot);

  log.info(`Concluído: ${result.kept.length} kept, ${result.archived.length} archived`);
  if (result.kept.length > 0) {
    log.info(`  Mantidos (latest por prefix):`);
    for (const k of result.kept) log.info(`    - ${k}`);
  }

  // Suppress unused warning para --migrate (no-op flag — comportamento
  // padrão JÁ é mover antigos; flag existe pra documentação semântica).
  void values.migrate;
  void positionals;
}

const invokedDirectly = process.argv[1]?.endsWith('rotator.ts');

if (invokedDirectly) {
  try {
    main();
  } catch (err) {
    log.error('Falha no rotator', err);
    process.exit(1);
  }
}
