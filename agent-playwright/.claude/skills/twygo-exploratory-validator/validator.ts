import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createLogger } from '../../../src/utils/logger.js';
import { FILES, PATHS } from '../../../src/utils/constants.js';
import { ensureParentDir, slugify } from '../../../src/utils/helpers.js';
import type {
  Finding,
  SuiteFindings,
  CoverageSnapshot,
  ActiveProbeResults,
  ActiveProbeFinding,
  ActiveProbeName,
  ActiveProbeReport,
} from '../../../src/utils/exploratory.js';

const log = createLogger('exploratory-validator');

const ACTIVE_PROBES_PREFIX = 'active-probes__';

type Flags = { strict: boolean; quiet: boolean };

type CoverageEntry = CoverageSnapshot;

type ScopedBucket = {
  totals: { errors: number; warnings: number; info: number };
  byKind: Record<string, number>;
  findings: Finding[];
};

type ActiveProbesAggregate = {
  totals: { errors: number; warnings: number; info: number };
  byProbe: Partial<Record<ActiveProbeName, {
    ran: number;
    failed: number;
    findings: number;
    totalDurationMs: number;
  }>>;
  findings: Array<ActiveProbeFinding & { test: string; url: string }>;
};

type SuiteAggregate = {
  testsuiteName: string;
  totals: { errors: number; warnings: number; info: number };
  byKind: Record<string, number>;
  findings: Finding[];
  coverage: CoverageEntry[];
  outOfScope: ScopedBucket;
  activeProbes: ActiveProbesAggregate;
};

type AggregatedReport = {
  generatedAt: string;
  summary: {
    errors: number;
    warnings: number;
    info: number;
    testsuites: number;
    tests: number;
    outOfScope: { errors: number; warnings: number; info: number };
    activeProbes: { errors: number; warnings: number; info: number; tests: number };
  };
  testsuites: SuiteAggregate[];
};

function parseFlags(argv: string[]): Flags {
  return {
    strict: argv.includes('--strict'),
    quiet: argv.includes('--quiet'),
  };
}

function loadSuiteFindingsFiles(dir: string): SuiteFindings[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json') && !f.startsWith(ACTIVE_PROBES_PREFIX))
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf-8')) as SuiteFindings);
}

function loadActiveProbeFiles(dir: string): ActiveProbeResults[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f.startsWith(ACTIVE_PROBES_PREFIX))
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf-8')) as ActiveProbeResults);
}

function emptyBucket(): ScopedBucket {
  return { totals: { errors: 0, warnings: 0, info: 0 }, byKind: {}, findings: [] };
}

function emptyActiveProbes(): ActiveProbesAggregate {
  return { totals: { errors: 0, warnings: 0, info: 0 }, byProbe: {}, findings: [] };
}

function tallyFinding(bucket: ScopedBucket, f: Finding): void {
  bucket.byKind[f.kind] = (bucket.byKind[f.kind] ?? 0) + 1;
  if (f.severity === 'error') bucket.totals.errors++;
  else if (f.severity === 'warn') bucket.totals.warnings++;
  else bucket.totals.info++;
  bucket.findings.push(f);
}

function aggregate(perTest: SuiteFindings[], probeRuns: ActiveProbeResults[]): AggregatedReport {
  type Bucket = {
    inScope: ScopedBucket;
    outOfScope: ScopedBucket;
    coverage: CoverageSnapshot[];
    activeProbes: ActiveProbesAggregate;
    activeProbesTestCount: Set<string>;
  };
  const suiteIndex = new Map<string, Bucket>();

  const ensure = (name: string): Bucket => {
    let b = suiteIndex.get(name);
    if (!b) {
      b = {
        inScope: emptyBucket(),
        outOfScope: emptyBucket(),
        coverage: [],
        activeProbes: emptyActiveProbes(),
        activeProbesTestCount: new Set<string>(),
      };
      suiteIndex.set(name, b);
    }
    return b;
  };

  for (const t of perTest) {
    const b = ensure(t.suite);
    for (const f of t.findings) {
      // Findings antigos (sem inScope) tratam como in-scope pra retrocompat.
      const inScope = f.inScope === undefined ? true : f.inScope;
      tallyFinding(inScope ? b.inScope : b.outOfScope, { ...f, inScope });
    }
    b.coverage.push(...t.coverage);
  }

  for (const r of probeRuns) {
    const b = ensure(r.suite);
    b.activeProbesTestCount.add(r.test);
    for (const [probe, report] of Object.entries(r.byProbe) as Array<[ActiveProbeName, ActiveProbeReport]>) {
      const slot = b.activeProbes.byProbe[probe] ?? {
        ran: 0,
        failed: 0,
        findings: 0,
        totalDurationMs: 0,
      };
      slot.ran += report.ran ? 1 : 0;
      if (!report.ran || report.error) slot.failed++;
      slot.findings += report.findings.length;
      slot.totalDurationMs += report.durationMs;
      b.activeProbes.byProbe[probe] = slot;
      for (const f of report.findings) {
        b.activeProbes.findings.push({ ...f, test: r.test, url: r.url });
        if (f.severity === 'error') b.activeProbes.totals.errors++;
        else if (f.severity === 'warn') b.activeProbes.totals.warnings++;
        else b.activeProbes.totals.info++;
      }
    }
  }

  const testsuites: SuiteAggregate[] = [];
  for (const [name, bucket] of suiteIndex) {
    const coverageByUrl = new Map<string, CoverageSnapshot>();
    for (const c of bucket.coverage) {
      const existing = coverageByUrl.get(c.url);
      if (!existing || c.visibleInteractive > existing.visibleInteractive) {
        coverageByUrl.set(c.url, c);
      }
    }
    testsuites.push({
      testsuiteName: name,
      totals: bucket.inScope.totals,
      byKind: bucket.inScope.byKind,
      findings: bucket.inScope.findings,
      coverage: [...coverageByUrl.values()],
      outOfScope: bucket.outOfScope,
      activeProbes: bucket.activeProbes,
    });
  }

  const summary = testsuites.reduce(
    (acc, s) => {
      acc.errors += s.totals.errors;
      acc.warnings += s.totals.warnings;
      acc.info += s.totals.info;
      acc.outOfScope.errors += s.outOfScope.totals.errors;
      acc.outOfScope.warnings += s.outOfScope.totals.warnings;
      acc.outOfScope.info += s.outOfScope.totals.info;
      acc.activeProbes.errors += s.activeProbes.totals.errors;
      acc.activeProbes.warnings += s.activeProbes.totals.warnings;
      acc.activeProbes.info += s.activeProbes.totals.info;
      return acc;
    },
    {
      errors: 0,
      warnings: 0,
      info: 0,
      testsuites: testsuites.length,
      tests: perTest.length,
      outOfScope: { errors: 0, warnings: 0, info: 0 },
      activeProbes: { errors: 0, warnings: 0, info: 0, tests: probeRuns.length },
    },
  );

  return { generatedAt: new Date().toISOString(), summary, testsuites };
}

/**
 * Exporta findings como attachments Allure-compatíveis.
 *
 * Cria um JSON por testsuite em `outputs/allure-results/exploratory_<slug>.json`
 * que o reporter `allure-playwright` pode incluir como attachment através do
 * mecanismo de pre-existing files (Allure CLI lê tudo dentro de allure-results
 * durante o `allure generate`).
 */
function writeAllureExports(report: AggregatedReport): void {
  const outDir = resolve(process.cwd(), 'outputs/allure-results');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  for (const ts of report.testsuites) {
    const filename = `exploratory_${slugify(ts.testsuiteName)}.json`;
    writeFileSync(
      join(outDir, filename),
      JSON.stringify(
        {
          name: `Findings exploratórios — ${ts.testsuiteName}`,
          totals: ts.totals,
          byKind: ts.byKind,
          findings: ts.findings,
          coverage: ts.coverage,
        },
        null,
        2,
      ),
      'utf-8',
    );
  }
}

function printSummary(report: AggregatedReport, quiet: boolean): void {
  const { summary, testsuites } = report;
  log.info(
    `Exploratory in-scope: ${summary.errors}E ${summary.warnings}W ${summary.info}I — ${summary.testsuites} testsuite(s), ${summary.tests} teste(s).`,
  );
  log.info(
    `Out-of-scope: ${summary.outOfScope.errors}E ${summary.outOfScope.warnings}W ${summary.outOfScope.info}I (silenciados dos KPIs).`,
  );
  log.info(
    `Active probes: ${summary.activeProbes.errors}E ${summary.activeProbes.warnings}W ${summary.activeProbes.info}I em ${summary.activeProbes.tests} execução(ões).`,
  );
  if (quiet) return;
  for (const s of testsuites) {
    const kindBreakdown = Object.entries(s.byKind)
      .map(([k, n]) => `${k}=${n}`)
      .join(' ');
    const apCount = Object.keys(s.activeProbes.byProbe).length;
    log.info(
      `  • ${s.testsuiteName}: ${s.totals.errors}E ${s.totals.warnings}W ${s.totals.info}I (${kindBreakdown || 'sem findings'}; OoS=${s.outOfScope.totals.errors + s.outOfScope.totals.warnings}; AP=${apCount} probe[s]; ${s.coverage.length} URL[s])`,
    );
  }
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const dir = resolve(process.cwd(), PATHS.exploratory);
  const perTest = loadSuiteFindingsFiles(dir);
  const probeRuns = loadActiveProbeFiles(dir);

  if (perTest.length === 0 && probeRuns.length === 0) {
    log.warn(`Nenhum finding em ${dir}. Probes desabilitados ou Playwright não rodou.`);
  }

  const report = aggregate(perTest, probeRuns);
  const outputPath = resolve(process.cwd(), FILES.exploratoryFindings);
  ensureParentDir(outputPath);
  writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  log.info(`Findings consolidados → ${outputPath}`);

  if (process.env.REGRESSION === 'true') {
    writeAllureExports(report);
    log.info(`Exports Allure-compatíveis em outputs/allure-results/`);
  }

  printSummary(report, flags.quiet);

  // Strict considera só findings in-scope (KPI principal).
  if (flags.strict && report.summary.errors > 0) {
    log.error(`Modo strict: ${report.summary.errors} erro(s) exploratório(s) in-scope — exit 1.`);
    process.exit(1);
  }
}

const invokedDirectly = process.argv[1]?.endsWith('validator.ts');

if (invokedDirectly) {
  main().catch((err) => {
    log.error('Falha no exploratory-validator', err);
    process.exit(1);
  });
}
