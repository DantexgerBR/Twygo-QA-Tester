/**
 * agent-metrics — agrega o histórico de `metrics.json` emitido pelo
 * twygo-test-orchestrator e imprime trend em tabela ASCII no terminal.
 *
 * Ver SKILL.md (comandos/flags) e `src/types/metrics.ts` (schema + quais
 * campos não são mensuráveis).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { createLogger } from '../../../src/utils/logger.js';
import { getProjectSlug } from '../../../src/utils/environment.js';
import type { RunMetrics } from '../../../src/types/metrics.js';

const log = createLogger('agent-metrics');

type Args = {
  project?: string;
  last?: number;
  sinceDays?: number;
  metric?: string;
  compare?: string[];
};

function parseFlags(): Args {
  const { values } = parseArgs({
    options: {
      project: { type: 'string' },
      last: { type: 'string' },
      since: { type: 'string' },
      metric: { type: 'string' },
      compare: { type: 'string' },
    },
    allowPositionals: true,
    strict: false,
  });
  const sinceRaw = values.since ? String(values.since) : undefined;
  const sinceDays = sinceRaw ? parseSince(sinceRaw) : undefined;
  return {
    project: values.project ? String(values.project) : undefined,
    last: values.last ? Number(values.last) : undefined,
    sinceDays,
    metric: values.metric ? String(values.metric) : undefined,
    compare: values.compare
      ? String(values.compare)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined,
  };
}

/** Converte `30d` / `90d` em número de dias. Aceita também só o número. */
function parseSince(raw: string): number | undefined {
  const m = raw.match(/^(\d+)\s*d?$/i);
  if (!m) {
    log.warn(`--since "${raw}" inválido (use formato "30d"). Ignorando filtro de tempo.`);
    return undefined;
  }
  return Number(m[1]);
}

function metricsDir(slug: string): string {
  return resolve(process.cwd(), 'outputs', slug, 'metrics');
}

function loadRuns(slug: string): RunMetrics[] {
  const dir = metricsDir(slug);
  if (!existsSync(dir)) return [];
  const runs: RunMetrics[] = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.json')) continue;
    try {
      runs.push(JSON.parse(readFileSync(resolve(dir, file), 'utf-8')) as RunMetrics);
    } catch (e) {
      log.warn(`Ignorando ${file} (ilegível): ${(e as Error).message}`);
    }
  }
  // Ordena cronologicamente por startedAt (mais antigo → mais novo).
  runs.sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  return runs;
}

function filterSince(runs: RunMetrics[], sinceDays?: number): RunMetrics[] {
  if (!sinceDays) return runs;
  const cutoff = Date.now() - sinceDays * 24 * 60 * 60 * 1000;
  return runs.filter((r) => new Date(r.startedAt).getTime() >= cutoff);
}

// ─── Helpers de formatação ───────────────────────────────────────────────────

const LINE = '─'.repeat(78);

function box(title: string, body: string[]): void {
  console.log('');
  console.log(LINE);
  console.log(`  ${title}`);
  console.log(LINE);
  for (const l of body) console.log(`  ${l}`);
  console.log(LINE);
  console.log('');
}

function fmtMs(ms: number | null | undefined): string {
  if (ms == null) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function fmtPct(v: number | null | undefined): string {
  if (v == null) return '—';
  return `${(v * 100).toFixed(0)}%`;
}

function fmtDateShort(iso: string): string {
  return iso.replace('T', ' ').slice(0, 16);
}

/** Média ignorando null/undefined (não-mensuráveis). null se não há amostra. */
function avg(values: Array<number | null | undefined>): number | null {
  const nums = values.filter((v): v is number => typeof v === 'number');
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function executeOf(run: RunMetrics): {
  passed: number;
  failed: number;
  fixmeSkipped: number;
} {
  const exec = run.phases.find((p) => p.phase === 'execute')?.details as
    | { passed?: number; failed?: number; fixmeSkipped?: number }
    | undefined;
  return {
    passed: exec?.passed ?? 0,
    failed: exec?.failed ?? 0,
    fixmeSkipped: exec?.fixmeSkipped ?? 0,
  };
}

function phaseDuration(run: RunMetrics, phase: string): number | null {
  const p = run.phases.find((x) => x.phase === phase);
  return p ? p.durationMs : null;
}

// ─── Modos de saída ──────────────────────────────────────────────────────────

function showLast(slug: string, runs: RunMetrics[], n: number): void {
  const tail = runs.slice(-n).reverse();
  const body: string[] = [];
  body.push('data             | modo        | total | ✓  | ✗  | fixme | dur    | exit');
  body.push('-----------------|-------------|-------|----|----|-------|--------|-----');
  for (const r of tail) {
    const e = executeOf(r);
    const total = e.passed + e.failed + e.fixmeSkipped;
    body.push(
      [
        fmtDateShort(r.startedAt).padEnd(16),
        r.mode.padEnd(11),
        String(total).padStart(5),
        String(e.passed).padStart(2),
        String(e.failed).padStart(2),
        fmtPct(r.kpis.fixmeRate).padStart(5),
        fmtMs(r.totals.durationMs).padStart(6),
        String(r.totals.exitCode).padStart(4),
      ].join(' | '),
    );
  }
  box(`agent-metrics · ${slug} · últimas ${tail.length} execução(ões)`, body);
}

function showSummary(slug: string, runs: RunMetrics[], sinceDays?: number): void {
  const totalRuns = runs.length;
  const avgDuration = avg(runs.map((r) => r.totals.durationMs));
  const avgFixme = avg(runs.map((r) => r.kpis.fixmeRate));
  const avgFailed = avg(runs.map((r) => executeOf(r).failed));
  const avgPassed = avg(runs.map((r) => executeOf(r).passed));
  const humanRate = avg(runs.map((r) => r.kpis.humanInterventionRate));
  const greenRuns = runs.filter((r) => r.totals.exitCode === 0).length;

  const window = sinceDays ? `últimos ${sinceDays}d` : 'todo o histórico';
  const body: string[] = [
    `Execuções:                 ${totalRuns}  (${greenRuns} verde${greenRuns === 1 ? '' : 's'} · exit 0)`,
    `Duração média:             ${fmtMs(avgDuration == null ? null : Math.round(avgDuration))}`,
    `Média passed / execução:   ${avgPassed == null ? '—' : avgPassed.toFixed(1)}`,
    `Média failed / execução:   ${avgFailed == null ? '—' : avgFailed.toFixed(1)}`,
    `fixmeRate médio:           ${fmtPct(avgFixme)}`,
    `humanInterventionRate:     ${fmtPct(humanRate)}`,
    '',
    'Não-mensuráveis a partir do orchestrator (subagents interativos):',
    '  plannerMsPerTestcase · typecheckFirstPassRate · healValidatorBlockedRate',
  ];
  box(`agent-metrics · ${slug} · sumário (${window}) · ${totalRuns} run(s)`, body);
}

/** Extrai o valor numérico de uma métrica nomeada para uma run. */
function metricValue(run: RunMetrics, metric: string): number | null {
  switch (metric) {
    case 'durationMs':
      return run.totals.durationMs;
    case 'fixmeRate':
      return run.kpis.fixmeRate;
    case 'humanInterventionRate':
      return run.kpis.humanInterventionRate;
    case 'typecheckFirstPassRate':
      return run.kpis.typecheckFirstPassRate;
    case 'healValidatorBlockedRate':
      return run.kpis.healValidatorBlockedRate;
    case 'plannerMsPerTestcase':
      return run.kpis.plannerMsPerTestcase;
    case 'passed':
      return executeOf(run).passed;
    case 'failed':
      return executeOf(run).failed;
    case 'fixmeSkipped':
      return executeOf(run).fixmeSkipped;
    default:
      // Trata como nome de fase → sua duração.
      return phaseDuration(run, metric);
  }
}

const PCT_METRICS = new Set([
  'fixmeRate',
  'humanInterventionRate',
  'typecheckFirstPassRate',
  'healValidatorBlockedRate',
]);
const MS_METRICS = new Set([
  'durationMs',
  'preflight',
  'execute',
  'validate',
  'bug-reports',
  'report',
  'triage',
  'plannerMsPerTestcase',
]);

function fmtMetric(metric: string, v: number | null): string {
  if (v == null) return '—';
  if (PCT_METRICS.has(metric)) return fmtPct(v);
  if (MS_METRICS.has(metric)) return fmtMs(v);
  return String(v);
}

function showTrend(slug: string, runs: RunMetrics[], metric: string): void {
  const series = runs.map((r) => ({ at: r.startedAt, v: metricValue(r, metric) }));
  const measured = series.map((s) => s.v).filter((v): v is number => v != null);
  const body: string[] = [];
  body.push('data             | valor');
  body.push('-----------------|--------');
  for (const s of series) {
    body.push(`${fmtDateShort(s.at).padEnd(16)} | ${fmtMetric(metric, s.v)}`);
  }
  body.push('-----------------|--------');
  const mean = avg(measured);
  body.push(`média            | ${fmtMetric(metric, mean)}`);
  if (measured.length === 0) {
    body.push('');
    body.push('(métrica não-mensurável ou sem amostra — ver src/types/metrics.ts)');
  }
  box(`agent-metrics · ${slug} · trend de "${metric}" · ${runs.length} run(s)`, body);
}

function showCompare(projects: string[], sinceDays?: number): void {
  const body: string[] = [];
  body.push('projeto              | runs | dur méd | fixme | failed méd | human');
  body.push('---------------------|------|---------|-------|------------|------');
  for (const slug of projects) {
    const runs = filterSince(loadRuns(slug), sinceDays);
    if (runs.length === 0) {
      body.push(`${slug.padEnd(20)} | (sem métricas)`);
      continue;
    }
    const avgDur = avg(runs.map((r) => r.totals.durationMs));
    const avgFixme = avg(runs.map((r) => r.kpis.fixmeRate));
    const avgFailed = avg(runs.map((r) => executeOf(r).failed));
    const human = avg(runs.map((r) => r.kpis.humanInterventionRate));
    body.push(
      [
        slug.padEnd(20),
        String(runs.length).padStart(4),
        fmtMs(avgDur == null ? null : Math.round(avgDur)).padStart(7),
        fmtPct(avgFixme).padStart(5),
        (avgFailed == null ? '—' : avgFailed.toFixed(1)).padStart(10),
        fmtPct(human).padStart(5),
      ].join(' | '),
    );
  }
  const window = sinceDays ? ` (últimos ${sinceDays}d)` : '';
  box(`agent-metrics · comparação${window}`, body);
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main(): void {
  const args = parseFlags();

  if (args.compare && args.compare.length > 0) {
    showCompare(args.compare, args.sinceDays);
    return;
  }

  let slug: string;
  try {
    slug = args.project ?? getProjectSlug();
  } catch (e) {
    log.error(
      `Não consegui resolver o projeto: ${(e as Error).message}. Use --project <slug> ou --compare a,b.`,
    );
    process.exit(1);
  }

  const allRuns = loadRuns(slug);
  if (allRuns.length === 0) {
    log.warn(
      `Nenhuma métrica em outputs/${slug}/metrics/. Rode \`npm run agent:run\` ou \`agent:regression\` primeiro.`,
    );
    return;
  }

  const runs = filterSince(allRuns, args.sinceDays);
  if (runs.length === 0) {
    log.warn(`Nenhuma execução nos últimos ${args.sinceDays}d para "${slug}".`);
    return;
  }

  if (args.metric) {
    showTrend(slug, runs, args.metric);
  } else if (args.last) {
    showLast(slug, runs, args.last);
  } else {
    showSummary(slug, runs, args.sinceDays);
  }
}

main();
