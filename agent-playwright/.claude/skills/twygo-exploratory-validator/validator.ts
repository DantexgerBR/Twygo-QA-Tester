import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createLogger } from '../../../src/utils/logger.js';
import { FILES, PATHS } from '../../../src/utils/constants.js';
import { ensureParentDir, slugify } from '../../../src/utils/helpers.js';
import type {
  Finding,
  SuiteFindings,
  CoverageSnapshot,
} from '../../../src/utils/exploratory.js';

const log = createLogger('exploratory-validator');

type Flags = { strict: boolean; quiet: boolean };

type CoverageEntry = CoverageSnapshot;

type SuiteAggregate = {
  testsuiteName: string;
  totals: { errors: number; warnings: number; info: number };
  byKind: Record<string, number>;
  findings: Finding[];
  coverage: CoverageEntry[];
};

type AggregatedReport = {
  generatedAt: string;
  summary: {
    errors: number;
    warnings: number;
    info: number;
    testsuites: number;
    tests: number;
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
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf-8')) as SuiteFindings);
}

function aggregate(perTest: SuiteFindings[]): AggregatedReport {
  const suiteIndex = new Map<string, { findings: Finding[]; coverage: CoverageSnapshot[] }>();
  for (const t of perTest) {
    const bucket = suiteIndex.get(t.suite) ?? { findings: [], coverage: [] };
    bucket.findings.push(...t.findings);
    bucket.coverage.push(...t.coverage);
    suiteIndex.set(t.suite, bucket);
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

    const byKind: Record<string, number> = {};
    const totals = bucket.findings.reduce(
      (acc, f) => {
        byKind[f.kind] = (byKind[f.kind] ?? 0) + 1;
        if (f.severity === 'error') acc.errors++;
        else if (f.severity === 'warn') acc.warnings++;
        else acc.info++;
        return acc;
      },
      { errors: 0, warnings: 0, info: 0 },
    );

    testsuites.push({
      testsuiteName: name,
      totals,
      byKind,
      findings: bucket.findings,
      coverage: [...coverageByUrl.values()],
    });
  }

  const summary = testsuites.reduce(
    (acc, s) => {
      acc.errors += s.totals.errors;
      acc.warnings += s.totals.warnings;
      acc.info += s.totals.info;
      return acc;
    },
    { errors: 0, warnings: 0, info: 0, testsuites: testsuites.length, tests: perTest.length },
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
    `Exploratory: ${summary.errors} erro(s), ${summary.warnings} warning(s), ${summary.info} info — ${summary.testsuites} testsuite(s), ${summary.tests} teste(s).`,
  );
  if (quiet) return;
  for (const s of testsuites) {
    const kindBreakdown = Object.entries(s.byKind)
      .map(([k, n]) => `${k}=${n}`)
      .join(' ');
    log.info(
      `  • ${s.testsuiteName}: ${s.totals.errors}E ${s.totals.warnings}W ${s.totals.info}I (${kindBreakdown || 'sem findings'}; ${s.coverage.length} URL[s])`,
    );
  }
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const dir = resolve(process.cwd(), PATHS.exploratory);
  const perTest = loadSuiteFindingsFiles(dir);

  if (perTest.length === 0) {
    log.warn(`Nenhum finding em ${dir}. Probes desabilitados ou Playwright não rodou.`);
  }

  const report = aggregate(perTest);
  const outputPath = resolve(process.cwd(), FILES.exploratoryFindings);
  ensureParentDir(outputPath);
  writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  log.info(`Findings consolidados → ${outputPath}`);

  if (process.env.REGRESSION === 'true') {
    writeAllureExports(report);
    log.info(`Exports Allure-compatíveis em outputs/allure-results/`);
  }

  printSummary(report, flags.quiet);

  if (flags.strict && report.summary.errors > 0) {
    log.error(`Modo strict: ${report.summary.errors} erro(s) exploratório(s) — exit 1.`);
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
