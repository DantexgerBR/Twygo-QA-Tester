/**
 * Coletor de métricas do orchestrator (design `roadmap-agent-metrics`).
 *
 * Responsável por:
 *  - cronometrar cada fase que o orchestrator dispara (via `time()`),
 *  - derivar contagens de execução do `test-results.json`,
 *  - escrever `outputs/<slug>/metrics/<runId>.json` no fim (mesmo em abort).
 *
 * Ver `src/types/metrics.ts` para a explicação de quais campos NÃO são
 * mensuráveis a partir deste processo (plan/generate/heal rodam em subagents
 * interativos).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomBytes } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { createLogger } from '../../../src/utils/logger.js';
import { getOutputDir, getOutputPath, getProjectSlug } from '../../../src/utils/environment.js';
import type {
  ExecuteDetails,
  PhaseEntry,
  PhaseName,
  PhaseStatus,
  RunMetrics,
  RunMode,
} from '../../../src/types/metrics.js';

const log = createLogger('metrics');

const NOTE_NOT_MEASURABLE =
  'plan/generate/heal rodam em sessões interativas dos subagents do plugin Playwright — não mensuráveis a partir do orchestrator (ver src/types/metrics.ts)';

type PlaywrightAnnotation = { type: string; description?: string };
type PlaywrightTestResult = {
  status: 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted';
  annotations?: PlaywrightAnnotation[];
};
type PlaywrightSpec = {
  tests: Array<{ annotations?: PlaywrightAnnotation[]; results: PlaywrightTestResult[] }>;
};
type PlaywrightSuite = {
  specs?: PlaywrightSpec[];
  suites?: PlaywrightSuite[];
};
type PlaywrightReport = { suites?: PlaywrightSuite[] };

function genRunId(startedAt: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const stamp =
    `${startedAt.getFullYear()}${pad(startedAt.getMonth() + 1)}${pad(startedAt.getDate())}` +
    `T${pad(startedAt.getHours())}${pad(startedAt.getMinutes())}`;
  return `${stamp}-${randomBytes(2).toString('hex')}`;
}

/**
 * Acumula entradas de fase e, no fim, escreve o `metrics.json`. Use uma única
 * instância por execução do orchestrator.
 */
export class MetricsCollector {
  private readonly startedAtDate = new Date();
  private readonly startWallMs = performance.now();
  private readonly phases: PhaseEntry[] = [];
  private readonly notes: string[] = [NOTE_NOT_MEASURABLE];
  private readonly runId = genRunId(this.startedAtDate);
  private humanInterventions = 0;
  private flushed = false;

  constructor(
    private readonly mode: RunMode,
    private readonly suite: string | null,
  ) {}

  /**
   * Cronometra `fn` (um subprocesso de fase) e registra a entrada. Mapeia exit
   * code → status (0 = passed, !=0 = failed). Não engole o exit — devolve.
   */
  async time(phase: PhaseName, fn: () => Promise<number>): Promise<number> {
    const t0 = performance.now();
    const exitCode = await fn();
    const durationMs = Math.round(performance.now() - t0);
    const status: PhaseStatus = exitCode === 0 ? 'passed' : 'failed';
    this.phases.push({ phase, durationMs, status, exitCode });
    return exitCode;
  }

  /** Marca uma fase como pulada (flag `--no-*`), com duração 0. */
  markSkipped(phase: PhaseName): void {
    this.phases.push({ phase, durationMs: 0, status: 'skipped' });
  }

  /** Incrementa o contador de intervenções humanas desta execução. */
  addHumanIntervention(count = 1): void {
    this.humanInterventions += count;
  }

  /**
   * Lê o `test-results.json` (Playwright) e deriva contagens de execução.
   * Anexa os detalhes à fase `execute` já registrada. Tolerante: se o arquivo
   * não existir, registra nota e segue.
   */
  attachExecuteDetails(): void {
    const path = getOutputPath('test-results.json');
    if (!existsSync(path)) {
      this.notes.push('test-results.json ausente — contagens de execução não derivadas');
      return;
    }
    let report: PlaywrightReport;
    try {
      report = JSON.parse(readFileSync(path, 'utf-8')) as PlaywrightReport;
    } catch (e) {
      this.notes.push(`test-results.json ilegível: ${(e as Error).message}`);
      return;
    }
    const details = this.deriveExecute(report);
    const executePhase = this.phases.find((p) => p.phase === 'execute');
    if (executePhase) executePhase.details = details as unknown as Record<string, unknown>;
  }

  private deriveExecute(report: PlaywrightReport): ExecuteDetails {
    let passed = 0;
    let failed = 0;
    let fixmeSkipped = 0;
    let otherSkipped = 0;

    const walk = (suite: PlaywrightSuite): void => {
      for (const spec of suite.specs ?? []) {
        for (const test of spec.tests) {
          const last = test.results[test.results.length - 1];
          const status = last?.status ?? 'failed';
          const annotations = [
            ...(test.annotations ?? []),
            ...(last?.annotations ?? []),
          ];
          const hasFixme = annotations.some((a) => a.type === 'fixme');
          if (status === 'passed') passed += 1;
          else if (status === 'failed' || status === 'timedOut' || status === 'interrupted')
            failed += 1;
          else if (status === 'skipped') {
            if (hasFixme) fixmeSkipped += 1;
            else otherSkipped += 1;
          }
        }
      }
      for (const child of suite.suites ?? []) walk(child);
    };
    for (const root of report.suites ?? []) walk(root);

    return { passed, failed, fixmeSkipped, otherSkipped, total: passed + failed + fixmeSkipped + otherSkipped };
  }

  /**
   * Escreve `outputs/<slug>/metrics/<runId>.json`. Idempotente — só grava uma
   * vez (chame em try/finally; segundas chamadas no-op). Tolerante a erro de
   * I/O (loga e segue, nunca derruba a run por causa de métricas).
   */
  flush(exitCode: number): void {
    if (this.flushed) return;
    this.flushed = true;

    const execute = this.phases.find((p) => p.phase === 'execute');
    const exec = execute?.details as ExecuteDetails | undefined;
    const fixmeRate =
      exec && exec.total > 0 ? Number((exec.fixmeSkipped / exec.total).toFixed(4)) : null;

    let project: string;
    try {
      project = getProjectSlug();
    } catch {
      project = '_unknown';
    }

    const metrics: RunMetrics = {
      runId: this.runId,
      startedAt: this.startedAtDate.toISOString(),
      completedAt: new Date().toISOString(),
      mode: this.mode,
      scope: { project, suite: this.suite },
      phases: this.phases,
      totals: {
        durationMs: Math.round(performance.now() - this.startWallMs),
        humanInterventions: this.humanInterventions,
        exitCode,
      },
      kpis: {
        fixmeRate,
        typecheckFirstPassRate: null,
        healValidatorBlockedRate: null,
        plannerMsPerTestcase: null,
        humanInterventionRate: this.humanInterventions > 0 ? 1 : 0,
      },
      agentVersion: { twygoTestAgent: readAgentVersion() },
      _meta: { notes: this.notes },
    };

    try {
      const dir = getOutputDir('metrics');
      mkdirSync(dir, { recursive: true });
      const outPath = resolve(dir, `${this.runId}.json`);
      writeFileSync(outPath, JSON.stringify(metrics, null, 2), 'utf-8');
      log.info(`metrics gravadas → ${outPath}`);
    } catch (e) {
      log.warn(`falha ao gravar metrics.json (não-fatal): ${(e as Error).message}`);
    }
  }
}

function readAgentVersion(): string {
  try {
    const pkgPath = resolve(process.cwd(), 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version?: string };
    return pkg.version ?? 'unknown';
  } catch {
    return 'unknown';
  }
}
