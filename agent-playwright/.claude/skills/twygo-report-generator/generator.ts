import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { resolve, join, basename, dirname, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { createLogger } from '../../../src/utils/logger.js';
import { FILES } from '../../../src/utils/constants.js';
import {
  getOutputDir,
  getOutputPath,
  getProjectConfigPath,
} from '../../../src/utils/environment.js';
import { ensureDir, slugify } from '../../../src/utils/helpers.js';
import type {
  ParsedAnalysis,
  ParsedTestCase,
  ParsedTestSuite,
} from '../twygo-xml-parser/parser.js';

const log = createLogger('report-generator');

type Mode = 'per-suite' | 'all-suites' | 'regression';

type Args = {
  mode: Mode;
  suite?: string;
};

type PlaywrightStep = {
  title: string;
  duration?: number;
  error?: { message?: string; stack?: string };
  steps?: PlaywrightStep[];
  category?: string;
};

type PlaywrightAttachment = {
  name: string;
  path?: string;
  contentType: string;
};

type PlaywrightTestResult = {
  status: 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted';
  duration: number;
  error?: { message?: string; stack?: string };
  steps?: PlaywrightStep[];
  attachments?: PlaywrightAttachment[];
  errorLocation?: { file?: string; line?: number; column?: number };
  annotations?: Array<{ type: string; description?: string }>;
};

type PlaywrightAnnotation = {
  type: string;
  description?: string;
};

type PlaywrightSpec = {
  title: string;
  file: string;
  tests: Array<{
    title: string;
    projectName: string;
    annotations?: PlaywrightAnnotation[];
    results: PlaywrightTestResult[];
  }>;
};

type PlaywrightSuite = {
  title: string;
  file?: string;
  specs: PlaywrightSpec[];
  suites?: PlaywrightSuite[];
};

type PlaywrightReport = {
  config: { rootDir: string };
  suites: PlaywrightSuite[];
  stats?: { expected: number; unexpected: number; flaky: number; skipped: number; duration: number };
};

type FlatStep = {
  number: number;
  title: string;
  durationMs: number;
  status: 'passed' | 'failed';
  errorMessage?: string;
};

type FlatTest = {
  testsuite: string;
  fileLabel: string;
  testcase: string;
  project: string;
  status: PlaywrightTestResult['status'];
  durationMs: number;
  errorMessage?: string;
  errorLocation?: string;
  skipReason?: string;
  skipKind?: 'fixme' | 'skip' | 'manual' | 'other';
  attachments: Array<{ name: string; path: string; contentType: string }>;
  steps: FlatStep[];
  failedStepIndex: number | null;
};

type ExploratoryFinding = {
  kind: string;
  severity: 'error' | 'warn' | 'info';
  url: string;
  message: string;
  detail?: Record<string, unknown>;
  inScope?: boolean;
};

type ExploratoryCoverage = {
  url: string;
  totalInteractive: number;
  visibleInteractive: number;
  samples: Array<{ role: string; name: string }>;
};

type ExploratoryScopedBucket = {
  totals: { errors: number; warnings: number; info: number };
  byKind: Record<string, number>;
  findings: ExploratoryFinding[];
};

type ActiveProbeFindingExt = {
  probe: string;
  severity: 'error' | 'warn' | 'info';
  message: string;
  detail?: Record<string, unknown>;
  test: string;
  url: string;
};

type ExploratoryActiveProbes = {
  totals: { errors: number; warnings: number; info: number };
  byProbe: Record<string, { ran: number; failed: number; findings: number; totalDurationMs: number }>;
  findings: ActiveProbeFindingExt[];
};

type ExploratorySuite = {
  testsuiteName: string;
  totals: { errors: number; warnings: number; info: number };
  byKind: Record<string, number>;
  findings: ExploratoryFinding[];
  coverage: ExploratoryCoverage[];
  outOfScope?: ExploratoryScopedBucket;
  activeProbes?: ExploratoryActiveProbes;
};

type ExploratoryReport = {
  generatedAt: string;
  summary: {
    errors: number;
    warnings: number;
    info: number;
    testsuites: number;
    tests: number;
    outOfScope?: { errors: number; warnings: number; info: number };
    activeProbes?: { errors: number; warnings: number; info: number; tests: number };
  };
  testsuites: ExploratorySuite[];
};

const PROBE_PT: Record<string, string> = {
  hoverTooltips: 'Hover em tooltips',
  keyboardNav: 'Navegação por teclado',
  formEdge: 'Valores extremos em formulário',
  clickabilitySweep: 'Varredura de clicáveis',
  a11yDeep: 'Acessibilidade (deep, por modal)',
  visualStability: 'Estabilidade visual (CLS)',
};

type ProjectConfig = {
  projectName: string;
  environment: string;
  browsers: string[];
  testAnalysisFile?: string;
};

type EnvironmentEntry = {
  baseUrl: string;
  credentials: { email: string; password: string };
  timeout?: number;
};

type EnvironmentMap = Record<string, EnvironmentEntry>;

// ─── Helpers de coleta/parsing ──────────────────────────────────────────────

function extractIdsFromUrl(url: string | undefined | null): { orgId?: string; envId?: string } {
  if (!url) return {};
  const out: { orgId?: string; envId?: string } = {};
  const orgMatch = url.match(/\/o\/(\d+)/);
  if (orgMatch) out.orgId = orgMatch[1];
  const envMatch = url.match(/\/ai_consumption_analysis\/(\d+)/);
  if (envMatch) out.envId = envMatch[1];
  return out;
}

function cleanUrl(url: string): string {
  return url.replace(/[)'",;.]+$/, '');
}

function inferFailureUrl(t: FlatTest, baseUrl: string | undefined): string {
  const errCtx = t.attachments.find((a) => a.name === 'error-context');
  if (errCtx && existsSync(errCtx.path)) {
    try {
      const md = readFileSync(errCtx.path, 'utf-8');
      const urlLine = md.match(/-\s*url:\s*(\S+)/i)?.[1] ?? md.match(/(https?:\/\/[^\s)]+)/)?.[1];
      if (urlLine) return cleanUrl(urlLine);
    } catch {
      // ignora
    }
  }
  const fromErr = (t.errorMessage || '').match(/(https?:\/\/[^\s)"']+)/)?.[1];
  if (fromErr) return cleanUrl(fromErr);
  return baseUrl ?? '—';
}

function parseFlags(): Args {
  const { values } = parseArgs({
    options: {
      suite: { type: 'string' },
      regression: { type: 'boolean', default: false },
    },
    allowPositionals: true,
    strict: false,
  });
  if (values.regression) return { mode: 'regression' };
  if (values.suite) return { mode: 'per-suite', suite: String(values.suite) };
  return { mode: 'all-suites' };
}

function loadJson<T>(path: string): T | null {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8')) as T;
}

function truncate(s: string, max = 4000): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + `\n... [truncado, ${s.length} chars total]`;
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

/**
 * Escape de pipe `|` e quebra de linha pra strings que vão dentro de células
 * de tabela GFM. Texto fora de tabela não precisa escape.
 */
function mdCell(s: string): string {
  return s.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

// ─── Traduções PT-BR ────────────────────────────────────────────────────────

const STATUS_PT: Record<string, string> = {
  passed: 'Aprovado',
  failed: 'Falhou',
  timedOut: 'Tempo esgotado',
  skipped: 'Ignorado',
  interrupted: 'Interrompido',
  unknown: '—',
};

const STATUS_EMOJI: Record<string, string> = {
  passed: '✅',
  failed: '❌',
  timedOut: '⏱️',
  skipped: '⊘',
  interrupted: '⏸️',
  unknown: '—',
};

function statusLabel(status: string): string {
  const emoji = STATUS_EMOJI[status] ?? '·';
  const label = STATUS_PT[status] ?? status;
  return `${emoji} ${label}`;
}

function severityFromImportance(importance: number): 'critico' | 'normal' | 'menor' {
  if (importance === 3) return 'critico';
  if (importance === 1) return 'menor';
  return 'normal';
}

const SEVERITY_PT: Record<'critico' | 'normal' | 'menor', string> = {
  critico: 'Crítico',
  normal: 'Normal',
  menor: 'Menor',
};

function severityLabel(importance: number | undefined): string {
  if (importance === undefined) return '—';
  const sev = severityFromImportance(importance);
  const emoji = sev === 'critico' ? '🔴' : sev === 'normal' ? '🟡' : '⚪';
  return `${emoji} ${SEVERITY_PT[sev]}`;
}

const KIND_PT: Record<string, string> = {
  console_error: 'Erro JavaScript no navegador',
  page_error: 'Erro de execução da página',
  http_error: 'Erro em chamada HTTP',
  a11y_violation: 'Acessibilidade (axe-core)',
  broken_image: 'Imagem quebrada',
  uncaught_exception: 'Exceção não tratada',
  network_failure: 'Falha de rede',
};

function kindPt(kind: string): string {
  return KIND_PT[kind] ?? kind.replace(/_/g, ' ');
}

// ─── Humanizador de erros Playwright → 1 linha PT-BR ────────────────────────

function playwrightHumanSummary(rawError: string): string {
  if (!rawError) return 'Sem mensagem registrada pelo Playwright.';
  const text = stripAnsi(rawError).trim();

  if (/page\.goto:\s*Navigation to\s*"([^"]+)"\s*is interrupted by another navigation/.test(text)) {
    const url = text.match(/page\.goto:\s*Navigation to\s*"([^"]+)"/)?.[1] ?? '?';
    return `Navegação para "${url}" foi interrompida por outra navegação no meio do caminho.`;
  }
  const gotoNet = text.match(/page\.goto:\s*(net::[A-Z_]+)\b[\s\S]*?\bat\s+(\S+)/);
  if (gotoNet) {
    return `Falha ao carregar a página "${gotoNet[2]}" (motivo: ${gotoNet[1]}).`;
  }
  if (/Test timeout of (\d+)ms exceeded/i.test(text)) {
    const ms = text.match(/Test timeout of (\d+)ms/)?.[1];
    return `O teste excedeu o tempo limite de ${ms ? Math.round(Number(ms) / 1000) : '?'}s antes de concluir.`;
  }
  if (/toBeVisible\(\)?\s*failed/.test(text)) {
    const loc = text.match(/Locator:\s*([^\n]+)/)?.[1]?.trim();
    return `O elemento esperado não apareceu na tela${loc ? ` (locator: ${loc})` : ''}.`;
  }
  if (/toBeHidden\(\)?\s*failed/.test(text)) {
    return 'Um elemento que deveria estar oculto continuou visível.';
  }
  if (/not\.toBeChecked\(\)?\s*failed/.test(text)) {
    const loc = text.match(/Locator:\s*([^\n]+)/)?.[1]?.trim();
    return `O checkbox/toggle deveria estar DESMARCADO/DESABILITADO mas estava marcado${loc ? ` (locator: ${loc})` : ''}.`;
  }
  if (/(?<!not\.)toBeChecked\(\)?\s*failed/.test(text)) {
    const loc = text.match(/Locator:\s*([^\n]+)/)?.[1]?.trim();
    return `O checkbox/toggle esperava estar MARCADO/HABILITADO mas estava desmarcado${loc ? ` (locator: ${loc})` : ''}.`;
  }
  if (/toHaveURL/i.test(text) && /(Expected|Received)/i.test(text)) {
    const expected = text.match(/Expected[^\n]*?:\s*([^\n]+)/)?.[1]?.trim();
    const received = text.match(/Received[^\n]*?:\s*([^\n]+)/)?.[1]?.trim();
    return `A URL não bateu com a esperada${expected ? ` (esperada: ${expected})` : ''}${received ? ` — atual: ${received}` : ''}.`;
  }
  if (/(toContainText|toHaveText)\(\)?\s*failed/.test(text)) {
    const expected = text.match(/Expected[^\n]*?:\s*([^\n]+)/)?.[1]?.trim();
    return `O texto esperado não foi encontrado${expected ? `: "${expected}"` : ''}.`;
  }
  if (/toHaveCount\(\)?\s*failed/.test(text)) {
    const expected = text.match(/Expected[^\n]*?:\s*([^\n]+)/)?.[1]?.trim();
    const received = text.match(/Received[^\n]*?:\s*([^\n]+)/)?.[1]?.trim();
    return `Quantidade de elementos diferente do esperado${expected ? ` (esperado: ${expected}` : ''}${received ? `, encontrado: ${received})` : ''}.`;
  }
  const action = text.match(/locator\.(click|fill|hover|type|press|check|uncheck|selectOption):\s*(?:Test )?[Tt]imeout (\d+)ms exceeded/);
  if (action) {
    const verb: Record<string, string> = {
      click: 'clicar',
      fill: 'preencher',
      hover: 'fazer hover sobre',
      type: 'digitar em',
      press: 'apertar tecla em',
      check: 'marcar',
      uncheck: 'desmarcar',
      selectOption: 'selecionar opção em',
    };
    const v = verb[action[1]] ?? action[1];
    const loc = text.match(/waiting for\s+([^\n]+)/)?.[1]?.trim() ?? text.match(/Locator:\s*([^\n]+)/)?.[1]?.trim();
    return `Não foi possível ${v} o elemento — ele não ficou disponível em ${Math.round(Number(action[2]) / 1000)}s${loc ? ` (locator: ${loc})` : ''}.`;
  }
  if (/page\.waitForURL.*[Tt]imeout/.test(text)) {
    return 'A página não navegou para a URL esperada dentro do tempo limite.';
  }
  if (/strict mode violation/i.test(text)) {
    return 'O locator usado bate com mais de um elemento ao mesmo tempo (strict mode).';
  }
  if (/element is not visible/i.test(text)) {
    return 'O elemento foi encontrado no DOM mas estava invisível para o usuário.';
  }
  if (/element is not enabled/i.test(text)) {
    return 'O elemento foi encontrado mas estava desabilitado e não permitiu interação.';
  }
  const firstMeaningful = text
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith('Call log:') && !l.startsWith('===') && !l.startsWith('-')) ?? text.slice(0, 200);
  return truncate(firstMeaningful, 240);
}

function failureOrSkipSummary(t: FlatTest): string {
  if (t.status === 'passed') return '—';
  if (t.status === 'skipped' || (t.status === 'interrupted' && !t.errorMessage)) {
    if (t.skipReason) {
      const prefix = t.skipKind === 'manual' || /REVISAR_MANUAL/i.test(t.skipReason)
        ? 'Caso requer intervenção manual: '
        : t.skipKind === 'fixme'
          ? 'Marcado para revisão (test.fixme): '
          : 'Caso ignorado intencionalmente: ';
      return `${prefix}${t.skipReason}`;
    }
    return 'Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem).';
  }
  return playwrightHumanSummary(stripAnsi(t.errorMessage ?? ''));
}

// ─── Flatten ────────────────────────────────────────────────────────────────

function flatten(suites: PlaywrightSuite[]): FlatTest[] {
  const out: FlatTest[] = [];
  function walk(suite: PlaywrightSuite, ancestors: string[]): void {
    const isFileNode = suite.file !== undefined && suite.title === suite.file.replace(/\//g, '\\');
    const nextAncestors = isFileNode ? ancestors : [...ancestors, suite.title];
    for (const spec of suite.specs ?? []) {
      const testsuite = nextAncestors[nextAncestors.length - 1] ?? spec.title;
      const fileLabel = spec.file ? basename(spec.file) : '';
      for (const test of spec.tests) {
        const last = test.results[test.results.length - 1];
        const steps = (last?.steps ?? []).map((s, i) => ({
          number: i + 1,
          title: s.title || '(sem título)',
          durationMs: s.duration ?? 0,
          status: (s.error ? 'failed' : 'passed') as 'passed' | 'failed',
          errorMessage: s.error?.message,
        }));
        const failedIdx = steps.findIndex((s) => s.status === 'failed');
        const allAnn: PlaywrightAnnotation[] = [
          ...((test.annotations as PlaywrightAnnotation[] | undefined) ?? []),
          ...((last?.annotations as PlaywrightAnnotation[] | undefined) ?? []),
        ];
        const skipAnn = allAnn.find((a) => a.type === 'fixme' || a.type === 'skip');
        const skipReason = skipAnn?.description?.trim() || undefined;
        const skipKind: FlatTest['skipKind'] = skipAnn?.type === 'fixme'
          ? 'fixme'
          : skipAnn?.type === 'skip'
            ? 'skip'
            : (last?.status === 'skipped' && /REVISAR_MANUAL|intervenção manual/i.test(skipReason ?? '')
                ? 'manual'
                : (last?.status === 'skipped' ? 'other' : undefined));
        out.push({
          testsuite,
          fileLabel,
          testcase: spec.title,
          project: test.projectName,
          status: last?.status ?? 'failed',
          durationMs: last?.duration ?? 0,
          errorMessage: last?.error?.message,
          errorLocation: last?.errorLocation
            ? `${last.errorLocation.file ?? ''}:${last.errorLocation.line ?? ''}`
            : undefined,
          skipReason,
          skipKind,
          attachments: (last?.attachments ?? [])
            .filter((a): a is Required<PlaywrightAttachment> => typeof a.path === 'string')
            .map((a) => ({ name: a.name, path: a.path, contentType: a.contentType })),
          steps,
          failedStepIndex: failedIdx >= 0 ? failedIdx : null,
        });
      }
    }
    for (const child of suite.suites ?? []) walk(child, nextAncestors);
  }
  for (const root of suites) walk(root, []);
  return out;
}

function summarizeTests(tests: FlatTest[]) {
  const s = { total: tests.length, passed: 0, failed: 0, skipped: 0, durationMs: 0 };
  for (const t of tests) {
    s.durationMs += t.durationMs;
    if (t.status === 'passed') s.passed++;
    else if (t.status === 'skipped') s.skipped++;
    else s.failed++;
  }
  return s;
}

function groupByTestsuite(tests: FlatTest[]): Map<string, FlatTest[]> {
  const m = new Map<string, FlatTest[]>();
  for (const t of tests) {
    const arr = m.get(t.testsuite) ?? [];
    arr.push(t);
    m.set(t.testsuite, arr);
  }
  return m;
}

function flattenSuitesFromXml(suite: ParsedTestSuite, acc: ParsedTestSuite[] = []): ParsedTestSuite[] {
  if (suite.testCases.length > 0) acc.push(suite);
  for (const child of suite.childSuites) flattenSuitesFromXml(child, acc);
  return acc;
}

function indexTestCasesByName(parsed: ParsedAnalysis): Map<string, ParsedTestCase> {
  const m = new Map<string, ParsedTestCase>();
  const allSuites = flattenSuitesFromXml(parsed.rootSuite);
  for (const suite of allSuites) {
    for (const tc of suite.testCases) {
      const key = tc.name.trim();
      if (!m.has(key)) m.set(key, tc);
    }
  }
  return m;
}

/**
 * Mapeia `testcase.name.trim()` → label `TC<n>` (n = índice 1-based dentro
 * da testsuite no XML, ordem de declaração `<testsuite>...<testcase>`).
 * Usado pelo `formatTcTitle` para prefixar o título do TC no relatório.
 */
function indexTcNumbersByName(parsed: ParsedAnalysis): Map<string, string> {
  const m = new Map<string, string>();
  const allSuites = flattenSuitesFromXml(parsed.rootSuite);
  for (const suite of allSuites) {
    suite.testCases.forEach((tc, idx) => {
      const key = tc.name.trim();
      if (!m.has(key)) m.set(key, `TC${idx + 1}`);
    });
  }
  return m;
}

/**
 * Formata `TC<n> · <name>` se houver TC#, ou `<name>` como fallback.
 * Usado em index.md, tests.md e playwright-summary.md para prefixar TC#.
 */
function formatTcTitle(name: string, tcNumbers: Map<string, string>): string {
  const tc = tcNumbers.get(name.trim());
  return tc ? `${tc} · ${name}` : name;
}

function xmlSuiteOrder(parsed: ParsedAnalysis | null): string[] {
  if (!parsed) return [];
  const all = flattenSuitesFromXml(parsed.rootSuite);
  return all.map((s) => s.name.trim());
}

function reorderByXml(
  byTestsuite: Map<string, FlatTest[]>,
  xmlOrder: string[],
): Map<string, FlatTest[]> {
  if (xmlOrder.length === 0) return byTestsuite;
  const out = new Map<string, FlatTest[]>();
  const xmlSet = new Set(xmlOrder.map((n) => n.toLowerCase()));
  for (const name of xmlOrder) {
    const tests = byTestsuite.get(name);
    if (tests && tests.length > 0) out.set(name, tests);
  }
  for (const [name, tests] of byTestsuite.entries()) {
    if (!xmlSet.has(name.toLowerCase())) {
      log.warn(
        `Testsuite "${name}" (${tests.length} caso(s)) executada mas NÃO existe no XML — omitida do relatório. ` +
          `Verifique testIgnore em playwright.config.ts ou ajuste o nome do describe() no spec.`,
      );
    }
  }
  return out;
}

// ─── MD render — index.md ───────────────────────────────────────────────────

function stackedBarAscii(passed: number, failed: number, skipped: number, width = 20): string {
  const total = passed + failed + skipped;
  if (total === 0) return '`[' + '·'.repeat(width) + ']`';
  const ok = Math.round((passed / total) * width);
  const fa = Math.round((failed / total) * width);
  const sk = Math.max(0, width - ok - fa);
  return '`[' + '█'.repeat(ok) + '✗'.repeat(fa) + '⊘'.repeat(sk) + ']`';
}

function pctPassLabel(passed: number, total: number): string {
  if (total === 0) return '—';
  const pct = Math.round((passed / total) * 100);
  return `${pct}%`;
}

function renderIndexMd(args: {
  mode: Mode;
  scopeLabel: string;
  projectName: string;
  environment: string;
  browsers: string[];
  generatedAt: string;
  testsSummary: ReturnType<typeof summarizeTests>;
  exploratorySummary: ExploratoryReport['summary'] | null;
  byTestsuite: Map<string, FlatTest[]>;
  exploratoryByTestsuite: Map<string, ExploratorySuite>;
  failedTests: FlatTest[];
  xmlByName: Map<string, ParsedTestCase>;
  tcNumbers: Map<string, string>;
  runId: string;
}): string {
  const t = args.testsSummary;
  const e = args.exploratorySummary;
  const dateBR = new Date(args.generatedAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const lines: string[] = [];
  lines.push(`# Relatório de Execução — Twygo QA`);
  lines.push('');
  lines.push(`**Projeto:** ${args.projectName} · **Ambiente:** \`${args.environment}\` · **Browsers:** ${args.browsers.join(', ')} · **Gerado em:** ${dateBR}`);
  lines.push('');
  lines.push(`> **Escopo:** ${args.scopeLabel}`);
  lines.push('');

  // Painel de atenção
  if (args.failedTests.length === 0) {
    lines.push(`> ✅ **Nenhuma falha registrada** — todos os ${t.total} caso(s) executado(s) foram aprovados.`);
  } else {
    const criticalFails = args.failedTests.filter((ft) => args.xmlByName.get(ft.testcase.trim())?.importance === 3);
    lines.push(`> ❌ **${args.failedTests.length} caso(s) com falha precisam de atenção${criticalFails.length > 0 ? ` (${criticalFails.length} crítico${criticalFails.length === 1 ? '' : 's'})` : ''}**`);
    lines.push('>');
    for (const ft of args.failedTests.slice(0, 8)) {
      const xml = args.xmlByName.get(ft.testcase.trim());
      const sev = xml ? severityLabel(xml.importance) : '';
      const failedStep = ft.failedStepIndex !== null ? ft.steps[ft.failedStepIndex] : null;
      const rawErr = failedStep?.errorMessage ?? ft.errorMessage ?? '';
      lines.push(`> - ${sev} [${formatTcTitle(ft.testcase, args.tcNumbers)}](tests.md#${slugify(ft.testcase)}) — ${playwrightHumanSummary(stripAnsi(rawErr))}`);
    }
    if (args.failedTests.length > 8) {
      lines.push(`> - …e mais ${args.failedTests.length - 8} caso(s). Veja [Casos de teste](tests.md).`);
    }
  }
  lines.push('');

  // KPIs
  lines.push(`## Casos de teste (XML)`);
  lines.push('');
  lines.push(`| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |`);
  lines.push(`|---:|---:|---:|---:|---:|`);
  lines.push(`| ${t.total} | ${t.passed} | ${t.failed} | ${t.skipped} | ${(t.durationMs / 1000).toFixed(1)}s |`);
  lines.push('');

  if (e) {
    lines.push(`## Validação Exploratória`);
    lines.push('');
    lines.push(`| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |`);
    lines.push(`|---:|---:|---:|---:|`);
    lines.push(`| ${e.errors} | ${e.warnings} | ${e.info} | ${e.testsuites} |`);
    lines.push('');
  }

  // Tabela por testsuite
  lines.push(`## Por testsuite`);
  lines.push('');
  if (args.byTestsuite.size === 0) {
    lines.push(`_Nenhum teste executado._`);
  } else {
    lines.push(`| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |`);
    lines.push(`|---|---:|---|---:|---:|---:|---|---:|`);
    for (const [name, tests] of args.byTestsuite.entries()) {
      const ss = summarizeTests(tests);
      const exp = args.exploratoryByTestsuite.get(name);
      const expCol = exp
        ? [
            exp.totals.errors > 0 ? `${exp.totals.errors} err` : '',
            exp.totals.warnings > 0 ? `${exp.totals.warnings} avi` : '',
          ].filter(Boolean).join(' · ') || '—'
        : '—';
      const bar = stackedBarAscii(ss.passed, ss.failed, ss.skipped);
      lines.push(`| **${mdCell(name)}** | ${ss.total} | ${bar} ${ss.passed}/${ss.failed}/${ss.skipped} | ${pctPassLabel(ss.passed, ss.total)} | ${ss.failed} | ${ss.skipped} | ${mdCell(expCol)} | ${(ss.durationMs / 1000).toFixed(1)}s |`);
    }
  }
  lines.push('');

  lines.push(`## Onde ir agora`);
  lines.push('');
  lines.push(`- 📋 [Casos de teste detalhados](tests.md)`);
  lines.push(`- 🐛 [Validação exploratória](exploratory.md)`);
  if (args.mode === 'regression') {
    lines.push(`- 📊 [Allure (regressivo, com trend histórico)](../../allure-report/index.html) — relatório executivo HTML built-in do Allure`);
  }
  lines.push('');

  lines.push(`## Dados brutos (JSON)`);
  lines.push('');
  lines.push(`- [\`summary.json\`](summary.json) — totais agregados`);
  lines.push(`- [\`tests.json\`](tests.json) — Playwright JSON reporter`);
  lines.push(`- [\`exploratory.json\`](exploratory.json) — findings exploratórios`);
  lines.push(`- [\`run_context.json\`](run_context.json) — projectName, environment, browsers, mode, timestamp`);
  lines.push('');

  return lines.join('\n');
}

// ─── MD render — tests.md ───────────────────────────────────────────────────

/**
 * Determina o test-folder canônico do TC — a pasta `<test-id>-chromium/`
 * gerada pelo Playwright. Usado por `archiveAttachments` pra consolidar
 * todos os arquivos do mesmo TC numa única subpasta dentro do report.
 */
function canonicalTestFolder(attachments: FlatTest['attachments']): string | undefined {
  for (const att of attachments) {
    if (!att.path) continue;
    const segs = att.path.split(/[\\/]/);
    for (let i = segs.length - 1; i >= 0; i--) {
      if (/-(chromium|firefox|webkit)(-?\d*)?$/.test(segs[i])) {
        return segs[i];
      }
    }
  }
  return undefined;
}

/**
 * Copia os attachments para `<reportDir>/artifacts/<test-folder>/` e
 * re-escreve `attachment.path` para apontar pra cópia. Sem isso, runs
 * subsequentes do mesmo projeto sobrescrevem `outputs/<slug>/test-artifacts/`
 * e o relatório fica com links quebrados.
 *
 * Tolerante a arquivos faltantes (warn + skip).
 */
function archiveAttachments(tests: FlatTest[], reportDir: string): void {
  const archiveRoot = join(reportDir, 'artifacts');
  let copied = 0;
  let skipped = 0;
  for (const t of tests) {
    const canonical = canonicalTestFolder(t.attachments);
    const newAttachments: typeof t.attachments = [];
    for (const att of t.attachments) {
      if (!att.path) continue;
      if (!existsSync(att.path)) {
        skipped++;
        continue;
      }
      const destFolder = canonical ?? basename(dirname(att.path));
      const destDir = join(archiveRoot, destFolder);
      ensureDir(destDir);
      const destPath = join(destDir, basename(att.path));
      try {
        copyFileSync(att.path, destPath);
        newAttachments.push({ name: att.name, path: destPath, contentType: att.contentType });
        copied++;
      } catch (err) {
        log.warn(`Falha ao arquivar ${att.path} → ${destPath}: ${(err as Error).message}`);
        newAttachments.push(att);
        skipped++;
      }
    }
    t.attachments = newAttachments;
  }
  if (copied + skipped > 0) {
    log.info(`Attachments arquivados em ${archiveRoot}: ${copied} copiados, ${skipped} ausentes/falha.`);
  }
}

function renderEvidenceMd(t: FlatTest, reportDir: string): string {
  const screenshots = t.attachments.filter((a) => a.contentType === 'image/png');
  const errorCtx = t.attachments.find((a) => a.name === 'error-context');
  const trace = t.attachments.find((a) => a.contentType === 'application/zip');
  // Vídeos: dois arquivos por execução (video.webm + video-1.webm), o último
  // costuma ser placeholder de ~2KB; ordenamos pelo tamanho real do basename
  // pra que o vídeo principal apareça primeiro no relatório.
  const videos = t.attachments
    .filter((a) => a.contentType === 'video/webm' || /\.webm$/i.test(a.path))
    .sort((a, b) => basename(a.path).length - basename(b.path).length);
  if (screenshots.length === 0 && !errorCtx && !trace && videos.length === 0) {
    return '_Sem evidências anexadas._';
  }
  // Path relativo ao tests.md (no reportDir) — usado em links/imagens MD.
  const relPath = (p: string) => relative(reportDir, p).replace(/\\/g, '/');
  // Path relativo ao cwd da invocação (raiz do agent-playwright) — usado em
  // bloco bash do trace para que o comando funcione direto no terminal.
  const cwdPath = (p: string) => relative(process.cwd(), p).replace(/\\/g, '/');
  const lines: string[] = [];

  // Header com a pasta do TC — orienta o leitor a navegar todos os artifacts
  // do mesmo caso em um lugar só.
  const anyPath = (screenshots[0] ?? trace ?? errorCtx ?? videos[0])?.path;
  if (anyPath) {
    const folderRel = relPath(dirname(anyPath));
    lines.push(`📁 _Pasta:_ [\`${folderRel}/\`](${folderRel}/)`);
  }

  for (const ss of screenshots) {
    const file = basename(ss.path);
    const r = relPath(ss.path);
    lines.push(`- 📸 **Screenshot${ss.name ? ` (${ss.name})` : ''}** — [\`${file}\`](${r})\n\n  ![](${r})`);
  }
  for (const v of videos) {
    lines.push(`- 🎬 [Vídeo da execução (${basename(v.path)})](${relPath(v.path)})`);
  }
  if (trace) {
    const file = basename(trace.path);
    const r = relPath(trace.path);
    const cwd = cwdPath(trace.path);
    lines.push(
      `- 📦 **Trace** — [\`${file}\`](${r})\n\n  \`\`\`bash\n  npx playwright show-trace ${cwd}\n  \`\`\``,
    );
  }
  for (const v of videos) {
    const file = basename(v.path);
    const r = relPath(v.path);
    lines.push(`- 🎥 **Vídeo** — [\`${file}\`](${r})`);
  }
  if (errorCtx) {
    const file = basename(errorCtx.path);
    const r = relPath(errorCtx.path);
    lines.push(`- 📄 **DOM no momento da falha** — [\`${file}\`](${r})`);
  }
  return lines.join('\n\n');
}

function renderUnifiedStepsTableMd(xml: ParsedTestCase | undefined, t: FlatTest): string {
  const overallNote = t.status !== 'passed' ? failureOrSkipSummary(t) : '—';
  const isSkipped = t.status === 'skipped';
  const xmlNumbers = (xml?.steps ?? []).map((s, i) => s.stepNumber ?? i + 1);
  const isXmlStep = (allureTitle: string): boolean =>
    xmlNumbers.some((n) => allureTitle.startsWith(`${n}. `));
  const preconditionSteps = t.steps.filter((as) => !isXmlStep(as.title));

  const rows: string[] = [];

  // Pré-condições no topo
  for (const as of preconditionSteps) {
    const note = as.errorMessage
      ? playwrightHumanSummary(stripAnsi(as.errorMessage))
      : as.status === 'failed'
        ? (overallNote !== '—'
            ? `Falha sem mensagem específica do step. Causa geral: ${overallNote}`
            : 'Pré-condição marcada como falha sem mensagem específica.')
        : '—';
    rows.push(`| — | _Pré-condição:_ ${mdCell(as.title)} | — | ${STATUS_EMOJI[as.status] ?? '·'} | ${mdCell(note)} | ${(as.durationMs / 1000).toFixed(2)}s |`);
  }

  // XML steps
  const lastExecutedXmlIndex = (() => {
    if (!xml?.steps?.length) return -1;
    let last = -1;
    xml.steps.forEach((s, i) => {
      const matched = t.steps.find(
        (as) => as.title.startsWith(`${i + 1}. `) || as.title.startsWith(`${s.stepNumber}. `),
      );
      if (matched) last = i;
    });
    return last;
  })();

  for (const [i, s] of (xml?.steps ?? []).entries()) {
    const allureMatch = t.steps.find(
      (as) => as.title.startsWith(`${i + 1}. `) || as.title.startsWith(`${s.stepNumber}. `),
    );
    let stepStatus: 'passed' | 'failed' | 'skipped';
    let stepNote: string;
    if (allureMatch) {
      stepStatus = allureMatch.status;
      if (allureMatch.errorMessage) {
        stepNote = playwrightHumanSummary(stripAnsi(allureMatch.errorMessage));
      } else if (allureMatch.status === 'failed') {
        stepNote = overallNote !== '—'
          ? `Falha sem mensagem específica do step. Causa geral: ${overallNote}`
          : 'Step marcado como falho sem mensagem específica do Playwright.';
      } else {
        stepNote = '—';
      }
    } else if (t.status === 'passed') {
      stepStatus = 'passed';
      stepNote = '—';
    } else if (isSkipped) {
      stepStatus = 'skipped';
      stepNote = overallNote !== '—'
        ? `Step não executado — ${overallNote}`
        : 'Step não executado (caso ignorado).';
    } else if (i <= lastExecutedXmlIndex) {
      stepStatus = 'passed';
      stepNote = '—';
    } else {
      stepStatus = 'skipped';
      stepNote = `Step não executado: o teste foi interrompido antes. Causa: ${overallNote !== '—' ? overallNote : 'falha em step anterior ou timeout'}.`;
    }
    const duration = allureMatch ? `${(allureMatch.durationMs / 1000).toFixed(2)}s` : '—';
    rows.push(`| ${s.stepNumber} | ${mdCell(s.actions || '(sem ação)')} | ${mdCell(s.expectedResults || '(sem esperado)')} | ${STATUS_EMOJI[stepStatus] ?? '·'} | ${mdCell(stepNote)} | ${duration} |`);
  }

  if (!xml || xml.steps.length === 0) {
    if (preconditionSteps.length === 0) {
      return '_Sem steps Allure ou metadata XML para este testcase._';
    }
  }

  const header = '| # | Ação do passo | Resultado esperado | Status | Notas | Duração |\n|---|---|---|:---:|---|---:|';
  return `${header}\n${rows.join('\n')}`;
}

function renderManualPendingBlockMd(t: FlatTest, xml: ParsedTestCase | undefined): string {
  const sev = xml ? SEVERITY_PT[severityFromImportance(xml.importance)] : '—';
  const reason = t.skipReason ?? 'Sem motivo registrado.';
  const reproSteps: string[] = [];
  if (xml?.preconditions) {
    xml.preconditions
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((l) => reproSteps.push(`Pré: ${l}`));
  }
  for (const s of xml?.steps ?? []) {
    reproSteps.push(`${s.stepNumber}. ${s.actions}`);
  }
  if (reproSteps.length === 0) reproSteps.push('— (sem steps documentados no XML)');

  const lines: string[] = [];
  lines.push(`#### ⏳ Pendente — execução automatizada não realizada`);
  lines.push('');
  lines.push(`- **Severidade do caso (XML):** ${sev}`);
  lines.push(`- **Motivo do skip / fixme:** ${reason}`);
  lines.push('');
  lines.push(`**Roteiro do XML (para validação manual):**`);
  for (const l of reproSteps) lines.push(`1. ${l}`);
  lines.push('');
  lines.push(`> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.`);
  return lines.join('\n');
}

function renderBugReportBlockMd(
  t: FlatTest,
  xml: ParsedTestCase | undefined,
  runId: string,
  reportDir: string,
  envEntry: EnvironmentEntry | undefined,
  envName: string,
): string {
  if (t.status === 'passed') return '';
  if (t.status === 'skipped') return renderManualPendingBlockMd(t, xml);

  const sev = xml ? SEVERITY_PT[severityFromImportance(xml.importance)] : '—';
  const summary = failureOrSkipSummary(t);
  const failedStep = t.failedStepIndex !== null ? t.steps[t.failedStepIndex] : null;
  const stepRef = failedStep ? `${failedStep.number}. ${failedStep.title}` : '—';
  const bugDescription = `[${sev}] ${t.testcase} — ${summary}`;

  const reproSteps: string[] = [];
  if (xml?.preconditions) {
    xml.preconditions.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).forEach((l) => reproSteps.push(`Pré: ${l}`));
  }
  for (const s of xml?.steps ?? []) {
    reproSteps.push(`${s.stepNumber}. ${s.actions}`);
  }
  if (reproSteps.length === 0) reproSteps.push('— (sem steps documentados no XML)');

  const expectedFromFailedStep = failedStep && xml?.steps
    ? xml.steps.find((s) => s.stepNumber === failedStep.number)?.expectedResults
    : undefined;
  const expectedBehavior = expectedFromFailedStep
    || xml?.steps.map((s) => `${s.stepNumber}. ${s.expectedResults}`).join(' | ')
    || '—';

  const failureUrl = inferFailureUrl(t, envEntry?.baseUrl);
  const ids = extractIdsFromUrl(failureUrl);
  if (!ids.orgId || !ids.envId) {
    const errCtx = t.attachments.find((a) => a.name === 'error-context');
    let fullText = t.errorMessage || '';
    if (errCtx && existsSync(errCtx.path)) {
      try { fullText += '\n' + readFileSync(errCtx.path, 'utf-8'); } catch { /* ignore */ }
    }
    if (!ids.orgId) {
      const m = fullText.match(/\/o\/(\d+)/);
      if (m) ids.orgId = m[1];
    }
    if (!ids.envId) {
      const m = fullText.match(/\/ai_consumption_analysis\/(\d+)/);
      if (m) ids.envId = m[1];
    }
  }
  const others: string[] = [];
  if (ids.envId) others.push(`envId interno (rota /ai_consumption_analysis/{envId}): ${ids.envId}`);
  others.push(`Browser: ${t.project}`);
  others.push(`runId: ${runId}`);
  others.push(`Duração até a falha: ${(t.durationMs / 1000).toFixed(2)}s`);
  if (failedStep) others.push(`Step impactado: ${stepRef}`);

  const relPath = (p: string) => relative(reportDir, p).replace(/\\/g, '/');
  const evidences: string[] = [];
  for (const a of t.attachments) {
    if (a.contentType === 'image/png') {
      evidences.push(`- Screenshot capturado pelo Playwright (${a.name}): ${relPath(a.path)}`);
    } else if (a.contentType === 'video/webm' || /\.webm$/i.test(a.path)) {
      evidences.push(`- Vídeo da execução (${basename(a.path)}): ${relPath(a.path)}`);
    } else if (a.contentType === 'application/zip') {
      evidences.push(`- Trace completo do Playwright (.zip) — \`npx playwright show-trace\`: ${relPath(a.path)}`);
    } else if (a.name === 'error-context') {
      evidences.push(`- Snapshot do DOM/contexto da página (error-context.md): ${relPath(a.path)}`);
    }
  }
  const evidenceLines = evidences.length === 0 ? '  (sem anexos)' : evidences.join('\n');

  const aggregateText = `Descrição do BUG
${bugDescription}

Passo a passo para reprodução
${reproSteps.map((l) => `  ${l}`).join('\n')}

Comportamento esperado
${expectedBehavior}

Comportamento atual
${summary}

Informações
- URL: ${failureUrl}
- Login: ${envEntry?.credentials.email ?? '—'}
- Senha: ${envEntry?.credentials.password ?? '—'}
- ID do ambiente (orgId): ${ids.orgId ?? '—'}
- Outros:
${others.map((o) => `  - ${o}`).join('\n')}

Evidências
${evidenceLines}

Execução
- runId: ${runId}
- environment.json: ${envName}
- testsuite: ${t.testsuite}
- testcase: ${t.testcase}
`;

  const lines: string[] = [];
  lines.push(`#### 🐛 Pronto para registro de bug`);
  lines.push('');
  lines.push(`**Descrição do BUG:** ${bugDescription}`);
  lines.push('');
  lines.push(`**Passo a passo para reprodução:**`);
  for (const r of reproSteps) lines.push(`1. ${r}`);
  lines.push('');
  lines.push(`**Comportamento esperado:** ${expectedBehavior}`);
  lines.push('');
  lines.push(`**Comportamento atual:** ${summary}`);
  lines.push('');
  lines.push(`**Informações:**`);
  lines.push('');
  lines.push(`| Campo | Valor |`);
  lines.push(`|---|---|`);
  lines.push(`| URL | \`${failureUrl}\` |`);
  lines.push(`| Login | ${envEntry?.credentials.email ?? '—'} |`);
  lines.push(`| Senha | ${envEntry?.credentials.password ?? '—'} |`);
  lines.push(`| orgId | ${ids.orgId ?? '—'} |`);
  for (const o of others) lines.push(`| Outros | ${mdCell(o)} |`);
  lines.push('');
  lines.push(`**Evidências:**`);
  lines.push('');
  lines.push(evidences.length === 0 ? '_Sem anexos coletados pelo Playwright._' : evidences.join('\n'));
  lines.push('');
  lines.push(`<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>`);
  lines.push('');
  lines.push('```');
  lines.push(aggregateText);
  lines.push('```');
  lines.push('');
  lines.push(`</details>`);
  return lines.join('\n');
}

function renderTestcaseDetailPanelMd(
  t: FlatTest,
  xml: ParsedTestCase | undefined,
  runId: string,
  reportDir: string,
  envEntry: EnvironmentEntry | undefined,
  envName: string,
): string {
  const lines: string[] = [];
  const failedStep = t.failedStepIndex !== null ? t.steps[t.failedStepIndex] : null;
  const summary = t.status !== 'passed' ? failureOrSkipSummary(t) : null;

  if (summary) {
    const label = t.status === 'skipped' ? 'Por que foi ignorado' : 'Por que falhou';
    lines.push(`> **${STATUS_EMOJI[t.status] ?? '·'} ${label}:** ${summary}`);
    if (failedStep) lines.push(`> _Step impactado:_ **${failedStep.title}**`);
    lines.push('');
  }
  if (xml?.summary) {
    lines.push(`**Sumário (objetivo do caso):** ${xml.summary}`);
    lines.push('');
  }
  if (xml?.preconditions) {
    lines.push(`**Pré-condições:**`);
    lines.push('');
    lines.push('```');
    lines.push(xml.preconditions.trim());
    lines.push('```');
    lines.push('');
  }

  lines.push(`**Passos do caso (XML/TestLink + execução Playwright):**`);
  lines.push('');
  lines.push(`_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._`);
  lines.push('');
  lines.push(renderUnifiedStepsTableMd(xml, t));
  lines.push('');

  lines.push(`**Evidências:**`);
  lines.push('');
  lines.push(renderEvidenceMd(t, reportDir));
  lines.push('');

  const bug = renderBugReportBlockMd(t, xml, runId, reportDir, envEntry, envName);
  if (bug) {
    lines.push(bug);
    lines.push('');
  }

  if (t.errorMessage && t.status !== 'skipped') {
    lines.push(`<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>`);
    lines.push('');
    lines.push('```');
    lines.push(truncate(stripAnsi(t.errorMessage), 12000));
    lines.push('```');
    lines.push('');
    lines.push(`</details>`);
  }
  return lines.join('\n');
}

function renderTestsMd(args: {
  byTestsuite: Map<string, FlatTest[]>;
  projectName: string;
  xmlByName: Map<string, ParsedTestCase>;
  tcNumbers: Map<string, string>;
  runId: string;
  reportDir: string;
  envEntry: EnvironmentEntry | undefined;
  envName: string;
}): string {
  const lines: string[] = [];
  lines.push(`# Casos de teste — ${args.projectName}`);
  lines.push('');
  lines.push(`[← Voltar ao dashboard](index.md)`);
  lines.push('');
  lines.push(`Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.`);
  lines.push('');

  if (args.byTestsuite.size === 0) {
    lines.push(`_Nenhum testcase executado._`);
    return lines.join('\n');
  }

  for (const [suiteName, tests] of args.byTestsuite.entries()) {
    const ss = summarizeTests(tests);
    lines.push(`## ${suiteName}`);
    lines.push('');
    lines.push(`_${tests.length} caso(s) — ${ss.passed} aprovado(s), ${ss.failed} falha(s)${ss.skipped ? `, ${ss.skipped} ignorado(s)` : ''}_`);
    lines.push('');

    for (const t of tests) {
      const xml = args.xmlByName.get(t.testcase.trim());
      const sev = xml ? severityLabel(xml.importance) : '';
      const anchorId = slugify(t.testcase);
      lines.push(`### ${statusLabel(t.status)} · ${formatTcTitle(t.testcase, args.tcNumbers)} ${sev ? `· ${sev}` : ''}`);
      lines.push('');
      lines.push(`<a id="${anchorId}"></a>_Arquivo:_ \`${t.fileLabel}\` · _Duração:_ ${(t.durationMs / 1000).toFixed(2)}s · _Browser:_ ${t.project}`);
      lines.push('');
      lines.push(renderTestcaseDetailPanelMd(t, xml, args.runId, args.reportDir, args.envEntry, args.envName));
      lines.push('');
      lines.push(`---`);
      lines.push('');
    }
  }
  return lines.join('\n');
}

// ─── MD render — exploratory.md ─────────────────────────────────────────────

function partitionFindings(findings: ExploratoryFinding[]) {
  const out = {
    consoleAndPage: [] as ExploratoryFinding[],
    http: [] as ExploratoryFinding[],
    a11y: [] as ExploratoryFinding[],
    brokenImages: [] as ExploratoryFinding[],
    other: [] as ExploratoryFinding[],
  };
  for (const f of findings) {
    if (f.kind === 'console_error' || f.kind === 'page_error') out.consoleAndPage.push(f);
    else if (f.kind === 'http_error') out.http.push(f);
    else if (f.kind === 'a11y_violation') out.a11y.push(f);
    else if (f.kind === 'broken_image') out.brokenImages.push(f);
    else out.other.push(f);
  }
  return out;
}

function renderConsoleSectionMd(findings: ExploratoryFinding[]): string {
  if (findings.length === 0) return '';
  const aggregated = new Map<string, { kind: string; severity: string; message: string; urls: Set<string>; count: number }>();
  for (const f of findings) {
    const key = `${f.kind}|${f.message.slice(0, 200)}`;
    const ex = aggregated.get(key);
    if (ex) { ex.count++; ex.urls.add(f.url); }
    else aggregated.set(key, { kind: f.kind, severity: f.severity, message: f.message, urls: new Set([f.url]), count: 1 });
  }
  const lines: string[] = [];
  lines.push(`#### ❌ Erros JavaScript no navegador (${findings.length} ocorrência(s) · ${aggregated.size} mensagem(ens) distinta(s))`);
  lines.push('');
  for (const g of [...aggregated.values()].sort((a, b) => b.count - a.count)) {
    lines.push(`- **${kindPt(g.kind)}** — _${g.count} ocorrência(s) em ${g.urls.size} URL(s)_`);
    lines.push(`  > ${truncate(g.message, 400).replace(/\n/g, ' ')}`);
    if (g.urls.size === 1) lines.push(`  \`${[...g.urls][0]}\``);
  }
  return lines.join('\n');
}

function renderHttpSectionMd(findings: ExploratoryFinding[]): string {
  if (findings.length === 0) return '';
  const aggregated = new Map<string, { status: number; method: string; url: string; severity: string; count: number }>();
  for (const f of findings) {
    const status = (f.detail?.['status'] as number) ?? 0;
    const method = (f.detail?.['method'] as string) ?? 'GET';
    const key = `${status}|${method}|${f.url}`;
    const ex = aggregated.get(key);
    if (ex) ex.count++;
    else aggregated.set(key, { status, method, url: f.url, severity: f.severity, count: 1 });
  }
  const sevTitle = findings.some((f) => f.severity === 'error') ? '❌' : '⚠️';
  const lines: string[] = [];
  lines.push(`#### ${sevTitle} Respostas HTTP de falha (${findings.length} no total · ${aggregated.size} únicas)`);
  lines.push('');
  lines.push(`| Status | Método | URL | Ocorrências |`);
  lines.push(`|---:|---|---|---:|`);
  for (const r of [...aggregated.values()].sort((a, b) => b.count - a.count)) {
    lines.push(`| ${r.status} | ${r.method} | \`${mdCell(r.url)}\` | ${r.count} |`);
  }
  return lines.join('\n');
}

function renderA11ySectionMd(findings: ExploratoryFinding[]): string {
  if (findings.length === 0) return '';
  const byRule = new Map<string, ExploratoryFinding[]>();
  for (const f of findings) {
    const ruleId = (f.detail?.['ruleId'] as string) ?? 'unknown';
    const arr = byRule.get(ruleId) ?? [];
    arr.push(f);
    byRule.set(ruleId, arr);
  }
  const sevTitle = findings.some((f) => f.severity === 'error') ? '❌' : '⚠️';
  const lines: string[] = [];
  lines.push(`#### ${sevTitle} Acessibilidade — axe-core (${findings.length} no total · ${byRule.size} regra(s) única(s))`);
  lines.push('');
  for (const [ruleId, items] of [...byRule.entries()].sort((a, b) => b[1].length - a[1].length)) {
    const first = items[0];
    const impact = (first.detail?.['impact'] as string) ?? 'unknown';
    const tags = (first.detail?.['tags'] as string[]) ?? [];
    const helpUrl = (first.detail?.['helpUrl'] as string) ?? '';
    const sampleHtml = (first.detail?.['firstNodeHtml'] as string) ?? '';
    const sampleTarget = (first.detail?.['firstNodeTarget'] as string[] | undefined)?.join(' ');
    const urls = [...new Set(items.map((i) => i.url))];
    lines.push(`- **\`${ruleId}\`** _(${impact})_ — ${items.length} ocorrência(s) em ${urls.length} URL(s)`);
    lines.push(`  ${first.message}${tags.length > 0 ? ` · _WCAG: ${tags.join(', ')}_` : ''}`);
    if (helpUrl) lines.push(`  [Como corrigir →](${helpUrl})`);
    if (sampleTarget) lines.push(`  Seletor: \`${sampleTarget}\``);
    if (sampleHtml) {
      lines.push('  ```html');
      lines.push(`  ${sampleHtml.split('\n').join('\n  ')}`);
      lines.push('  ```');
    }
  }
  return lines.join('\n');
}

function renderBrokenImagesSectionMd(findings: ExploratoryFinding[]): string {
  if (findings.length === 0) return '';
  const lines: string[] = [];
  lines.push(`#### ⚠️ Imagens quebradas (${findings.length})`);
  lines.push('');
  for (const f of findings) {
    const src = (f.detail?.['src'] as string) ?? f.message;
    const alt = (f.detail?.['alt'] as string) ?? '';
    lines.push(`- \`${src}\`${alt ? ` — alt: "${alt}"` : ''}`);
    lines.push(`  _página:_ \`${f.url}\``);
  }
  return lines.join('\n');
}

function renderCoverageSectionMd(coverage: ExploratoryCoverage[]): string {
  if (coverage.length === 0) return '';
  const lines: string[] = [];
  lines.push(`#### ℹ️ Cobertura observada por URL (${coverage.length})`);
  lines.push('');
  for (const c of coverage) {
    const pct = c.totalInteractive > 0 ? Math.min(100, Math.round((c.visibleInteractive / c.totalInteractive) * 100)) : 0;
    const samples = c.samples.slice(0, 8).map((u) => `${u.role}${u.name ? ': ' + u.name : ''}`).join(' · ');
    lines.push(`- \`${c.url}\``);
    lines.push(`  ${c.visibleInteractive}/${c.totalInteractive} interativos visíveis (**${pct}%**) · amostra: ${samples || '_(vazio)_'}`);
  }
  return lines.join('\n');
}

function renderOutOfScopeSectionMd(
  bucket: ExploratoryScopedBucket | undefined,
  projectName: string,
): string {
  if (!bucket) return '';
  const total = bucket.totals.errors + bucket.totals.warnings + bucket.totals.info;
  if (total === 0) return '';
  const partitioned = partitionFindings(bucket.findings);
  const inner = [
    renderConsoleSectionMd(partitioned.consoleAndPage),
    renderHttpSectionMd(partitioned.http),
    renderA11ySectionMd(partitioned.a11y),
    renderBrokenImagesSectionMd(partitioned.brokenImages),
  ].filter(Boolean).join('\n\n');
  const totals = [
    bucket.totals.errors > 0 ? `${bucket.totals.errors} erro(s)` : '',
    bucket.totals.warnings > 0 ? `${bucket.totals.warnings} aviso(s)` : '',
    bucket.totals.info > 0 ? `${bucket.totals.info} info` : '',
  ].filter(Boolean).join(' · ');
  const lines: string[] = [];
  lines.push(`<details><summary>📁 Fora do escopo "${projectName}" — ${totals} _(silenciado dos KPIs principais)_</summary>`);
  lines.push('');
  lines.push(inner || '_Sem detalhes._');
  lines.push('');
  lines.push(`</details>`);
  return lines.join('\n');
}

function renderActiveProbesSectionMd(ap: ExploratoryActiveProbes | undefined): string {
  if (!ap) return '';
  const probeKeys = Object.keys(ap.byProbe);
  if (probeKeys.length === 0 && ap.findings.length === 0) return '';
  const lines: string[] = [];
  lines.push(`#### 🔍 Probes ativos — descobertas adicionais (${ap.findings.length} finding(s))`);
  lines.push('');
  lines.push(`| Probe | Execuções OK | Falhas internas | Findings | Tempo |`);
  lines.push(`|---|---:|---:|---:|---:|`);
  for (const key of probeKeys) {
    const stats = ap.byProbe[key];
    const findingCount = ap.findings.filter((f) => f.probe === key).length;
    lines.push(`| **${PROBE_PT[key] ?? key}** | ${stats.ran} | ${stats.failed} | ${findingCount} | ${(stats.totalDurationMs / 1000).toFixed(2)}s |`);
  }
  lines.push('');
  if (ap.findings.length === 0) {
    lines.push(`_Probes ativos rodaram sem encontrar problemas._`);
  } else {
    for (const f of ap.findings) {
      const sevEmoji = f.severity === 'error' ? '❌' : f.severity === 'warn' ? '⚠️' : 'ℹ️';
      lines.push(`- ${sevEmoji} **${PROBE_PT[f.probe] ?? f.probe}** _(teste: ${f.test})_`);
      lines.push(`  ${truncate(f.message, 400).replace(/\n/g, ' ')}`);
      lines.push(`  \`${f.url}\``);
    }
  }
  return lines.join('\n');
}

function renderExploratoryMd(args: { exploratoryByTestsuite: Map<string, ExploratorySuite>; projectName: string }): string {
  const lines: string[] = [];
  lines.push(`# Validação Exploratória — ${args.projectName}`);
  lines.push('');
  lines.push(`[← Voltar ao dashboard](index.md)`);
  lines.push('');
  lines.push(`Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.`);
  lines.push('');
  lines.push(`Os KPIs principais consideram apenas findings **dentro do escopo "${args.projectName}"** (rotas e palavras-chave em \`project.config.json\` → \`exploratory.scopedRoutes\`/\`exploratory.scopedKeywords\`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.`);
  lines.push('');

  if (args.exploratoryByTestsuite.size === 0) {
    lines.push(`_Nenhum finding exploratório registrado._`);
    return lines.join('\n');
  }

  for (const s of args.exploratoryByTestsuite.values()) {
    const partitioned = partitionFindings(s.findings);
    lines.push(`## ${s.testsuiteName}`);
    lines.push('');
    const totalsLine = [
      s.totals.errors > 0 ? `❌ ${s.totals.errors} erro(s)` : '',
      s.totals.warnings > 0 ? `⚠️ ${s.totals.warnings} aviso(s)` : '',
      s.totals.info > 0 ? `ℹ️ ${s.totals.info} info` : '',
    ].filter(Boolean).join(' · ');
    lines.push(totalsLine || `_Sem findings in-scope nesta testsuite._`);
    lines.push('');
    const sections = [
      renderConsoleSectionMd(partitioned.consoleAndPage),
      renderHttpSectionMd(partitioned.http),
      renderA11ySectionMd(partitioned.a11y),
      renderBrokenImagesSectionMd(partitioned.brokenImages),
      renderCoverageSectionMd(s.coverage),
    ].filter(Boolean).join('\n\n');
    if (sections) {
      lines.push(sections);
      lines.push('');
    }
    const oos = renderOutOfScopeSectionMd(s.outOfScope, args.projectName);
    if (oos) {
      lines.push(oos);
      lines.push('');
    }
    const probes = renderActiveProbesSectionMd(s.activeProbes);
    if (probes) {
      lines.push(probes);
      lines.push('');
    }
    lines.push(`---`);
    lines.push('');
  }
  return lines.join('\n');
}

// ─── Allure (regression mode) ───────────────────────────────────────────────

function runAllureGenerate(): boolean {
  const resultsDir = getOutputDir('allure-results');
  const reportDir = getOutputDir('allure-report');
  if (!existsSync(resultsDir)) {
    log.warn(`${resultsDir} não existe — pular geração Allure (rodou em modo regressivo?)`);
    return false;
  }
  log.info('Gerando relatório Allure...');
  const result = spawnSync('npx', ['allure', 'generate', resultsDir, '-o', reportDir, '--clean'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    log.warn(`Allure CLI exit ${result.status}`);
    if (process.platform === 'win32' && !process.env.JAVA_HOME) {
      log.warn('Dica Windows: Allure precisa de uma JRE com `tzdb.dat`. Defina JAVA_HOME apontando para uma JRE/JDK completa antes de rodar (ex.: `set JAVA_HOME=C:\\Program Files\\Eclipse Adoptium\\jdk-17.x.x-hotspot`). Veja .claude/SETUP.md.');
    }
    return false;
  }
  log.info(`Relatório Allure → ${reportDir}/index.html`);
  return true;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = parseFlags();

  const cfg = loadJson<ProjectConfig>(getProjectConfigPath());
  if (!cfg) throw new Error('Config ausente: projects/<slug>/project.config.json');

  // IMPORTANTE: lemos o environment.json CRU (sem expandir ${VAR}) de propósito.
  // O bloco "Pronto para registro de bug" do tests.md mostra Login/Senha pra
  // colar em Jira/GitHub/Linear; mostrar a senha real expandida vazaria
  // credencial em ticket público. Usuário pediu explicitamente em 2026-05-08
  // ("preciso que rode com os itens da env, não com esses [valores reais]").
  // Outros consumidores (global-setup, playwright.config) seguem usando
  // `loadEnvironmentConfig()` que expande — só este caso é proposital cru.
  const envMap = loadJson<EnvironmentMap>(resolve(process.cwd(), FILES.environment));
  const envEntry = envMap?.[cfg.environment];
  if (!envEntry) {
    log.warn(`Environment "${cfg.environment}" ausente em environment.json — campos URL/Login/Senha do bug-block ficarão como "—".`);
  }

  const playwrightReport = loadJson<PlaywrightReport>(getOutputPath('test-results.json'));
  if (!playwrightReport) {
    throw new Error('outputs/<slug>/test-results.json ausente. Execute os testes antes (npm run agent:run).');
  }
  const exploratoryReport = loadJson<ExploratoryReport>(getOutputPath('exploratory-findings.json'));
  const parsedAnalysis = loadJson<ParsedAnalysis>(getOutputPath('test-analysis.parsed.json'));
  const xmlByName = parsedAnalysis ? indexTestCasesByName(parsedAnalysis) : new Map<string, ParsedTestCase>();
  const tcNumbers = parsedAnalysis ? indexTcNumbersByName(parsedAnalysis) : new Map<string, string>();
  if (!parsedAnalysis) {
    log.warn('outputs/<slug>/test-analysis.parsed.json ausente — tests.md não terá metadata do XML (steps, summary, preconditions).');
  }

  const allTests = flatten(playwrightReport.suites);
  let tests = allTests;
  let scopeLabel: string;
  let folderPrefix: string;
  let latestPointerName: string;

  if (args.mode === 'per-suite' && args.suite) {
    tests = allTests.filter((t) => t.testsuite.includes(args.suite!));
    scopeLabel = `Apenas testsuite contendo "${args.suite}"`;
    folderPrefix = slugify(args.suite);
    latestPointerName = `latest-suite-${slugify(args.suite)}.md`;
  } else if (args.mode === 'regression') {
    scopeLabel = 'Regressivo completo (todas as testsuites)';
    folderPrefix = 'regression';
    latestPointerName = 'latest-regression.md';
  } else {
    scopeLabel = 'Todas as testsuites (modo padrão)';
    folderPrefix = 'all-suites';
    latestPointerName = 'latest-all.md';
  }

  const ts = timestamp();
  const folderName = `${folderPrefix}_${ts}`;
  const reportsRoot = getOutputDir('reports');
  const reportDir = join(reportsRoot, folderName);
  ensureDir(reportDir);

  // Arquiva attachments dentro do reportDir ANTES de renderizar tests.md, pra
  // que os links relativos apontem pra dentro do report (self-contained) — e o
  // próximo cleanRunArtifacts() do orchestrator não esvazia as evidências.
  archiveAttachments(tests, reportDir);

  const xmlOrder = xmlSuiteOrder(parsedAnalysis);
  const byTestsuite = reorderByXml(groupByTestsuite(tests), xmlOrder);
  if (xmlOrder.length > 0) {
    const allowed = new Set(xmlOrder.map((n) => n.toLowerCase()));
    tests = tests.filter((t) => allowed.has(t.testsuite.toLowerCase()));
  }
  const failedTests = tests.filter((t) => t.status !== 'passed' && t.status !== 'skipped');

  const filteredExploratory = exploratoryReport
    ? args.mode === 'per-suite' && args.suite
      ? exploratoryReport.testsuites.filter((s) => s.testsuiteName.includes(args.suite!))
      : exploratoryReport.testsuites
    : [];
  const exploratoryByTestsuite = new Map(filteredExploratory.map((s) => [s.testsuiteName, s]));
  const exploratorySummary = exploratoryReport
    ? {
        ...exploratoryReport.summary,
        errors: filteredExploratory.reduce((n, s) => n + s.totals.errors, 0),
        warnings: filteredExploratory.reduce((n, s) => n + s.totals.warnings, 0),
        info: filteredExploratory.reduce((n, s) => n + s.totals.info, 0),
        testsuites: filteredExploratory.length,
      }
    : null;

  const testsSummary = summarizeTests(tests);
  const generatedAt = new Date().toISOString();

  writeFileSync(
    join(reportDir, 'index.md'),
    renderIndexMd({
      mode: args.mode,
      scopeLabel,
      projectName: cfg.projectName,
      environment: cfg.environment,
      browsers: cfg.browsers,
      generatedAt,
      testsSummary,
      exploratorySummary,
      byTestsuite,
      exploratoryByTestsuite,
      failedTests,
      xmlByName,
      tcNumbers,
      runId: folderName,
    }),
  );
  writeFileSync(
    join(reportDir, 'tests.md'),
    renderTestsMd({
      byTestsuite,
      projectName: cfg.projectName,
      xmlByName,
      tcNumbers,
      runId: folderName,
      reportDir,
      envEntry,
      envName: cfg.environment,
    }),
  );
  writeFileSync(
    join(reportDir, 'exploratory.md'),
    renderExploratoryMd({ exploratoryByTestsuite, projectName: cfg.projectName }),
  );
  writeFileSync(
    join(reportDir, 'run_context.json'),
    JSON.stringify({ runId: folderName, mode: args.mode, suiteFilter: args.suite ?? null, projectName: cfg.projectName, environment: cfg.environment, browsers: cfg.browsers, generatedAt }, null, 2),
  );
  writeFileSync(
    join(reportDir, 'summary.json'),
    JSON.stringify({ runId: folderName, scope: scopeLabel, tests: testsSummary, exploratory: exploratorySummary }, null, 2),
  );
  const testResultsPath = getOutputPath('test-results.json');
  if (existsSync(testResultsPath)) {
    copyFileSync(testResultsPath, join(reportDir, 'tests.json'));
  }
  const exploratoryFindingsPath = getOutputPath('exploratory-findings.json');
  if (existsSync(exploratoryFindingsPath)) {
    copyFileSync(exploratoryFindingsPath, join(reportDir, 'exploratory.json'));
  }

  // Atalho `latest-*.md` na raiz: MD curto que linka pro relatório mais recente.
  // Sem `<meta refresh>` (não existe em MD); IDE/GitHub renderizam o link direto.
  const pointerContent = `# Relatório mais recente — ${folderPrefix}\n\n**[Abrir → \`${folderName}/index.md\`](${folderName}/index.md)**\n\n_Gerado em ${new Date(generatedAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}._\n`;
  writeFileSync(join(reportsRoot, latestPointerName), pointerContent);

  // playwright-summary.md na raiz de outputs/<slug>/ — substitui o html-report
  // do Playwright (reporter built-in foi removido em chore/agentes-qa-overhaul).
  // Resumo da ÚLTIMA run, sem timestamp no caminho (sobrescrito a cada execução).
  // Tem 2 papéis: (1) ponto fixo pra ferramentas que esperam um arquivo previsível,
  // (2) acesso 1-click ao último resultado sem ter que navegar pra reports/<ts>/.
  const summaryLines: string[] = [];
  summaryLines.push(`# Resumo Playwright — ${cfg.projectName}`);
  summaryLines.push('');
  summaryLines.push(`**Última run** (${args.mode}) · ${new Date(generatedAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
  summaryLines.push('');
  summaryLines.push(`| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |`);
  summaryLines.push(`|---:|---:|---:|---:|---:|`);
  summaryLines.push(`| ${testsSummary.total} | ${testsSummary.passed} | ${testsSummary.failed} | ${testsSummary.skipped} | ${(testsSummary.durationMs / 1000).toFixed(1)}s |`);
  summaryLines.push('');
  summaryLines.push(`> **Escopo:** ${scopeLabel}`);
  summaryLines.push(`> **Ambiente:** \`${cfg.environment}\` · **Browsers:** ${cfg.browsers.join(', ')}`);
  summaryLines.push('');
  summaryLines.push(`## Resultados`);
  summaryLines.push('');
  if (tests.length === 0) {
    summaryLines.push(`_Nenhum teste executado._`);
  } else {
    summaryLines.push(`| Status | Testsuite | Caso | Duração | Resumo |`);
    summaryLines.push(`|:---:|---|---|---:|---|`);
    for (const t of tests) {
      const statusEmoji = STATUS_EMOJI[t.status] ?? '·';
      const summary = t.status !== 'passed' ? failureOrSkipSummary(t) : '—';
      summaryLines.push(`| ${statusEmoji} | ${mdCell(t.testsuite)} | ${mdCell(formatTcTitle(t.testcase, tcNumbers))} | ${(t.durationMs / 1000).toFixed(2)}s | ${mdCell(summary)} |`);
    }
  }
  summaryLines.push('');
  summaryLines.push(`## Onde encontrar mais`);
  summaryLines.push('');
  summaryLines.push(`- 📋 [Detalhamento desta run](reports/${folderName}/index.md) — KPIs por testsuite, links pra cases e findings exploratórios`);
  summaryLines.push(`- 🔍 [Casos de teste detalhados](reports/${folderName}/tests.md) — passos, evidências, bug-report pronto`);
  summaryLines.push(`- 🐛 [Validação exploratória](reports/${folderName}/exploratory.md) — console errors, axe, HTTP, cobertura`);
  summaryLines.push(`- 📦 Traces de cada falha em \`reports/${folderName}/artifacts/\` (self-contained) — abrir com \`npx playwright show-trace <path>\``);
  summaryLines.push('');
  writeFileSync(getOutputPath('playwright-summary.md'), summaryLines.join('\n'));

  log.info(`Relatório gerado → ${reportDir}/index.md`);
  log.info(
    `  ${testsSummary.passed}✓ ${testsSummary.failed}✗ ${testsSummary.skipped}⊘${
      exploratorySummary
        ? ` · exploratório: ${exploratorySummary.errors}E ${exploratorySummary.warnings}W ${exploratorySummary.info}I`
        : ''
    }`,
  );
  log.info(`  Atalho: outputs/reports/${latestPointerName}`);

  if (args.mode === 'regression') {
    runAllureGenerate();
  }
}

const invokedDirectly = process.argv[1]?.endsWith('generator.ts');

if (invokedDirectly) {
  main().catch((err) => {
    log.error('Falha ao gerar relatório', err);
    process.exit(1);
  });
}
