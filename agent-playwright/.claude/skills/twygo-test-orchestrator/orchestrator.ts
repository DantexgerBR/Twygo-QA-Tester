import { parseArgs } from 'node:util';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { createLogger } from '../../../src/utils/logger.js';
import { FILES } from '../../../src/utils/constants.js';
import {
  getOutputDir,
  getOutputPath,
  getProjectConfigPath,
} from '../../../src/utils/environment.js';
import { slugify } from '../../../src/utils/helpers.js';
import { MetricsCollector } from './metrics.js';
import type { RunMode } from '../../../src/types/metrics.js';
import type {
  ParsedAnalysis,
  ParsedTestSuite,
} from '../twygo-xml-parser/parser.js';

const log = createLogger('orchestrator');

type Args = {
  project?: string;
  suite?: string;
  all: boolean;
  regression: boolean;
  noExplore: boolean;
  noBugReports: boolean;
  noReport: boolean;
  noTriage: boolean;
  list: boolean;
  noPreflight: boolean;
  smokeOnly: boolean;
};

function parseFlags(): Args {
  const { values } = parseArgs({
    options: {
      project: { type: 'string' },
      suite: { type: 'string' },
      all: { type: 'boolean', default: false },
      regression: { type: 'boolean', default: false },
      'no-explore': { type: 'boolean', default: false },
      'no-bug-reports': { type: 'boolean', default: false },
      'no-report': { type: 'boolean', default: false },
      'no-triage': { type: 'boolean', default: false },
      list: { type: 'boolean', default: false },
      'no-preflight': { type: 'boolean', default: false },
      'smoke-only': { type: 'boolean', default: false },
    },
    allowPositionals: true,
    strict: false,
  });
  return {
    project: values.project as string | undefined,
    suite: values.suite as string | undefined,
    all: Boolean(values.all) || Boolean(values.regression),
    regression: Boolean(values.regression),
    noExplore: Boolean(values['no-explore']),
    noBugReports: Boolean(values['no-bug-reports']),
    noReport: Boolean(values['no-report']),
    noTriage: Boolean(values['no-triage']),
    list: Boolean(values.list),
    noPreflight: Boolean(values['no-preflight']),
    smokeOnly: Boolean(values['smoke-only']),
  };
}

function flattenSuites(suite: ParsedTestSuite, acc: ParsedTestSuite[] = []): ParsedTestSuite[] {
  if (suite.testCases.length > 0) acc.push(suite);
  for (const child of suite.childSuites) flattenSuites(child, acc);
  return acc;
}

function loadParsed(): ParsedAnalysis {
  const path = getOutputPath('test-analysis.parsed.json');
  if (!existsSync(path)) {
    throw new Error(
      `Faltando outputs/<slug>/test-analysis.parsed.json. Rode 'npm run agent:parse' antes.`,
    );
  }
  return JSON.parse(readFileSync(path, 'utf-8')) as ParsedAnalysis;
}

function selectSuites(parsed: ParsedAnalysis, args: Args): ParsedTestSuite[] {
  const all = flattenSuites(parsed.rootSuite);
  if (args.suite) {
    const exact = all.filter((s) => s.name === args.suite);
    if (exact.length > 0) return exact;
    const partial = all.filter((s) =>
      s.name.toLowerCase().includes(args.suite!.toLowerCase()),
    );
    if (partial.length === 0) {
      const list = all.map((s) => `  - ${s.name}`).join('\n');
      throw new Error(
        `Nenhuma testsuite contém "${args.suite}".\nDisponíveis:\n${list}`,
      );
    }
    return partial;
  }
  return all;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildGrep(suites: ParsedTestSuite[]): string | null {
  if (suites.length === 0) return null;
  const escaped = suites.map((s) => escapeRegex(s.name));
  return escaped.length === 1 ? escaped[0] : `(${escaped.join('|')})`;
}

function quoteArg(a: string): string {
  // Windows + shell:true concatena args sem quotar — args com espaços/acentos
  // viram tokens distintos no cmd.exe. Sempre quotar com aspas duplas.
  if (process.platform !== 'win32') return a;
  if (a === '') return '""';
  if (!/[\s"&|<>^()]/.test(a)) return a;
  return `"${a.replace(/"/g, '\\"')}"`;
}

function runShell(
  cmd: string,
  args: string[],
  env: Record<string, string> = {},
): Promise<number> {
  return new Promise((resolvePromise) => {
    log.debug(`$ ${cmd} ${args.join(' ')}`);
    const useShell = process.platform === 'win32';
    const finalArgs = useShell ? args.map(quoteArg) : args;
    const child = spawn(cmd, finalArgs, {
      stdio: 'inherit',
      shell: useShell,
      env: { ...process.env, ...env },
    });
    child.on('close', (code) => resolvePromise(code ?? 1));
  });
}

/**
 * Limpa findings exploratórios e artifacts do run anterior, ANTES do
 * Playwright iniciar uma nova execução. Sem isso, JSONs nomeados por
 * `__w{workerIndex}` acumulam entre runs (Playwright pode atribuir
 * worker diferente) e o validator agrega findings stale (potencialmente
 * de envs/orgIds removidos).
 */
function cleanRunArtifacts(): void {
  const dirsToClean = [
    getOutputDir('exploratory'),
    getOutputDir('test-artifacts'),
  ];
  for (const d of dirsToClean) {
    if (existsSync(d)) {
      rmSync(d, { recursive: true, force: true });
      log.debug(`Limpou ${d} (run anterior)`);
    }
  }
}

async function runPlaywright(
  suites: ParsedTestSuite[],
  regression: boolean,
): Promise<number> {
  cleanRunArtifacts();
  const env: Record<string, string> = {};
  if (regression) env.REGRESSION = 'true';
  const grep = regression ? null : buildGrep(suites);
  const args = ['playwright', 'test', '--grep-invert', 'Smoke'];
  if (grep) args.push('--grep', grep);
  return runShell('npx', args, env);
}

/**
 * Pre-flight (Fase 1.5): valida configs + smoke test antes de qualquer planner
 * ou execução pesada. Falha cedo, falha barato.
 *
 * O smoke (`tests/setup/smoke.spec.ts`) também dispara o globalSetup, que faz
 * login e grava storageState — então este pre-flight também aquece o cache de
 * autenticação pra próximas rodadas.
 */
async function preflight(): Promise<number> {
  log.info('=== Fase 1.5: Pre-flight ===');
  // Valida configs presentes
  const requiredConfigs: { path: string; label: string }[] = [
    { path: getProjectConfigPath(), label: 'projects/<slug>/project.config.json' },
    { path: resolve(process.cwd(), FILES.environment), label: FILES.environment },
  ];
  for (const required of requiredConfigs) {
    if (!existsSync(required.path)) {
      log.error(`Config ausente: ${required.label}`);
      return 2;
    }
  }
  // Smoke test (login + nav direta + container visível)
  const smokeExit = await runShell('npx', ['playwright', 'test', 'tests/setup/smoke.spec.ts', '--reporter=list']);
  if (smokeExit !== 0) {
    log.error('Smoke test falhou — não vou prosseguir com planner/execução. Verifique LoginPage, baseURL, credenciais.');
    return smokeExit;
  }
  log.info('Pre-flight OK — pode avançar para planning/execução.');
  return 0;
}

async function chainExplore(): Promise<number> {
  return runShell('npx', [
    'tsx',
    '.claude/skills/twygo-exploratory-validator/validator.ts',
  ]);
}

async function chainBugReports(): Promise<number> {
  return runShell('npx', [
    'tsx',
    '.claude/skills/gerar-bug-report-de-tc-red/generator.ts',
  ]);
}

async function chainReport(suites: ParsedTestSuite[], regression: boolean): Promise<number> {
  const args = ['tsx', '.claude/skills/twygo-report-generator/generator.ts'];
  if (regression) {
    args.push('--regression');
  } else if (suites.length === 1) {
    args.push('--suite', suites[0].name);
  }
  return runShell('npx', args);
}

async function chainTriage(suites: ParsedTestSuite[], regression: boolean): Promise<number> {
  const args = ['tsx', '.claude/skills/twygo-triage-report/generator.ts'];
  if (regression) {
    args.push('--regression');
  } else if (suites.length === 1) {
    args.push('--suite', suites[0].name);
  }
  return runShell('npx', args);
}

function listSuites(parsed: ParsedAnalysis): void {
  const all = flattenSuites(parsed.rootSuite);
  log.info(`Total: ${all.length} testsuite(s) com testcases.`);
  for (const s of all) {
    const slug = slugify(s.name);
    log.info(`  ${s.testCases.length.toString().padStart(3)} casos | ${slug}`);
    log.info(`              ${s.name}`);
  }
}

async function main(): Promise<void> {
  const args = parseFlags();

  // Propaga --project como env var PROJECT para que playwright.config.ts,
  // global-setup, exploratory-fixture e demais helpers leiam o slug correto.
  // Em modo regressivo cumulativo, usuário define PROJECT_ALL=true diretamente.
  if (args.project) {
    process.env.PROJECT = args.project;
  }

  const parsed = loadParsed();

  if (args.list) {
    listSuites(parsed);
    return;
  }

  // Coletor de métricas (design roadmap-agent-metrics). Modo e suite são
  // resolvidos cedo; o suite só é único quando --suite casa exatamente 1.
  const mode: RunMode = args.regression
    ? 'regression'
    : args.suite
      ? 'per-suite'
      : 'all-suites';
  const metrics = new MetricsCollector(mode, args.suite ?? null);

  // --smoke-only: roda só o smoke e sai (instrumentado como fase preflight).
  if (args.smokeOnly) {
    const pre = await metrics.time('preflight', preflight);
    if (pre !== 0) metrics.addHumanIntervention();
    metrics.flush(pre);
    process.exit(pre);
  }

  // Pre-flight (1.5) — sempre, exceto se --no-preflight.
  if (!args.noPreflight) {
    const pre = await metrics.time('preflight', preflight);
    if (pre !== 0) {
      log.error('Abortando: pre-flight falhou.');
      metrics.addHumanIntervention();
      metrics.flush(pre);
      process.exit(pre);
    }
  } else {
    metrics.markSkipped('preflight');
  }

  const suites = selectSuites(parsed, args);

  if (args.regression) {
    log.info(
      `Modo regressivo: ${suites.length} testsuite(s), ${parsed.totals.testCases} testcase(s) total.`,
    );
  } else {
    log.info(`Executando ${suites.length} testsuite(s):`);
    for (const s of suites) {
      log.info(`  • ${s.name} (${s.testCases.length} testcase(s))`);
    }
  }

  let playwrightExit = 1;
  try {
    log.info('=== Fase 5: Execução Playwright ===');
    playwrightExit = await metrics.time('execute', () =>
      runPlaywright(suites, args.regression),
    );
    // Deriva contagens (passed/failed/fixmeSkipped) do test-results.json recém-gravado.
    metrics.attachExecuteDetails();
    if (playwrightExit !== 0) {
      log.warn(
        `Playwright finalizou com exit ${playwrightExit}. Continuando para validador + report.`,
      );
    }

    if (!args.noExplore) {
      log.info('=== Fase 5.5: Validação Exploratória ===');
      const exploreExit = await metrics.time('validate', chainExplore);
      if (exploreExit !== 0) log.warn(`Validador exploratório exit ${exploreExit}`);
    } else {
      metrics.markSkipped('validate');
    }

    if (!args.noBugReports) {
      log.info('=== Fase 5.7: Bug Reports prontos pra task ===');
      const bugExit = await metrics.time('bug-reports', chainBugReports);
      if (bugExit !== 0) log.warn(`Bug-reports generator exit ${bugExit}`);
    } else {
      metrics.markSkipped('bug-reports');
    }

    if (!args.noReport) {
      log.info('=== Fase 6: Relatório ===');
      const reportExit = await metrics.time('report', () =>
        chainReport(suites, args.regression),
      );
      if (reportExit !== 0) log.warn(`Relatório exit ${reportExit}`);
    } else {
      metrics.markSkipped('report');
    }

    if (!args.noTriage) {
      log.info('=== Fase 6.5: Triage Report (lista dúvidas pra QA) ===');
      const triageExit = await metrics.time('triage', () =>
        chainTriage(suites, args.regression),
      );
      if (triageExit !== 0) log.warn(`Triage exit ${triageExit}`);
    } else {
      metrics.markSkipped('triage');
    }
  } finally {
    metrics.flush(playwrightExit);
  }

  process.exit(playwrightExit);
}

const invokedDirectly = process.argv[1]?.endsWith('orchestrator.ts');

if (invokedDirectly) {
  main().catch((err) => {
    log.error('Falha no orquestrador', err);
    process.exit(1);
  });
}
