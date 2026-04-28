import { parseArgs } from 'node:util';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { createLogger } from '../../../src/utils/logger.js';
import { FILES } from '../../../src/utils/constants.js';
import { slugify } from '../../../src/utils/helpers.js';
import type {
  ParsedAnalysis,
  ParsedTestSuite,
} from '../twygo-xml-parser/parser.js';

const log = createLogger('orchestrator');

type Args = {
  suite?: string;
  all: boolean;
  regression: boolean;
  noExplore: boolean;
  noReport: boolean;
  list: boolean;
};

function parseFlags(): Args {
  const { values } = parseArgs({
    options: {
      suite: { type: 'string' },
      all: { type: 'boolean', default: false },
      regression: { type: 'boolean', default: false },
      'no-explore': { type: 'boolean', default: false },
      'no-report': { type: 'boolean', default: false },
      list: { type: 'boolean', default: false },
    },
    allowPositionals: true,
    strict: false,
  });
  return {
    suite: values.suite as string | undefined,
    all: Boolean(values.all) || Boolean(values.regression),
    regression: Boolean(values.regression),
    noExplore: Boolean(values['no-explore']),
    noReport: Boolean(values['no-report']),
    list: Boolean(values.list),
  };
}

function flattenSuites(suite: ParsedTestSuite, acc: ParsedTestSuite[] = []): ParsedTestSuite[] {
  if (suite.testCases.length > 0) acc.push(suite);
  for (const child of suite.childSuites) flattenSuites(child, acc);
  return acc;
}

function loadParsed(): ParsedAnalysis {
  const path = resolve(process.cwd(), FILES.parsedAnalysis);
  if (!existsSync(path)) {
    throw new Error(
      `Faltando ${FILES.parsedAnalysis}. Rode 'npm run agent:parse' antes.`,
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

function runShell(
  cmd: string,
  args: string[],
  env: Record<string, string> = {},
): Promise<number> {
  return new Promise((resolvePromise) => {
    log.debug(`$ ${cmd} ${args.join(' ')}`);
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: { ...process.env, ...env },
    });
    child.on('close', (code) => resolvePromise(code ?? 1));
  });
}

async function runPlaywright(
  suites: ParsedTestSuite[],
  regression: boolean,
): Promise<number> {
  const env: Record<string, string> = {};
  if (regression) env.REGRESSION = 'true';
  const grep = regression ? null : buildGrep(suites);
  const args = ['playwright', 'test'];
  if (grep) args.push('--grep', grep);
  return runShell('npx', args, env);
}

async function chainExplore(): Promise<number> {
  return runShell('npx', [
    'tsx',
    '.claude/skills/twygo-exploratory-validator/validator.ts',
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
  const parsed = loadParsed();

  if (args.list) {
    listSuites(parsed);
    return;
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

  log.info('=== Fase 5: Execução Playwright ===');
  const playwrightExit = await runPlaywright(suites, args.regression);
  if (playwrightExit !== 0) {
    log.warn(
      `Playwright finalizou com exit ${playwrightExit}. Continuando para validador + report.`,
    );
  }

  if (!args.noExplore) {
    log.info('=== Fase 5.5: Validação Exploratória ===');
    const exploreExit = await chainExplore();
    if (exploreExit !== 0) log.warn(`Validador exploratório exit ${exploreExit}`);
  }

  if (!args.noReport) {
    log.info('=== Fase 6: Relatório ===');
    const reportExit = await chainReport(suites, args.regression);
    if (reportExit !== 0) log.warn(`Relatório exit ${reportExit}`);
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
