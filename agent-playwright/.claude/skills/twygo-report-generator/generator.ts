import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { createLogger } from '../../../src/utils/logger.js';
import { FILES, PATHS } from '../../../src/utils/constants.js';
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

type PlaywrightTestResult = {
  status: 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted';
  duration: number;
  error?: { message?: string; stack?: string };
  attachments?: Array<{ name: string; path?: string; contentType: string }>;
};

type PlaywrightSpec = {
  title: string;
  file: string;
  tests: Array<{
    title: string;
    projectName: string;
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

type FlatTest = {
  testsuite: string;
  testcase: string;
  file: string;
  project: string;
  status: string;
  durationMs: number;
  errorMessage?: string;
  attachments: Array<{ name: string; path: string; contentType: string }>;
};

type ExploratoryFinding = {
  kind: string;
  severity: 'error' | 'warn' | 'info';
  url: string;
  message: string;
  detail?: Record<string, unknown>;
};

type ExploratoryCoverage = {
  url: string;
  totalInteractive: number;
  visibleInteractive: number;
  samples: Array<{ role: string; name: string }>;
};

type ExploratorySuite = {
  testsuiteName: string;
  totals: { errors: number; warnings: number; info: number };
  byKind: Record<string, number>;
  findings: ExploratoryFinding[];
  coverage: ExploratoryCoverage[];
};

type ExploratoryReport = {
  generatedAt: string;
  summary: { errors: number; warnings: number; info: number; testsuites: number; tests: number };
  testsuites: ExploratorySuite[];
};

type ProjectConfig = {
  projectName: string;
  environment: string;
  browsers: string[];
  testAnalysisFile?: string;
};

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

function flatten(suites: PlaywrightSuite[], parentTitle = ''): FlatTest[] {
  const out: FlatTest[] = [];
  for (const suite of suites) {
    const title = parentTitle ? `${parentTitle} › ${suite.title}` : suite.title;
    for (const spec of suite.specs) {
      for (const test of spec.tests) {
        const lastResult = test.results[test.results.length - 1];
        out.push({
          testsuite: title,
          testcase: spec.title,
          file: spec.file,
          project: test.projectName,
          status: lastResult?.status ?? 'unknown',
          durationMs: lastResult?.duration ?? 0,
          errorMessage: lastResult?.error?.message,
          attachments: (lastResult?.attachments ?? [])
            .filter((a): a is Required<typeof a> => typeof a.path === 'string')
            .map((a) => ({ name: a.name, path: a.path, contentType: a.contentType })),
        });
      }
    }
    if (suite.suites) out.push(...flatten(suite.suites, title));
  }
  return out;
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const SHARED_CSS = `
:root {
  --bg: #0d1117; --surface: #161b22; --card: #21262d; --border: #30363d;
  --text: #e6edf3; --text-soft: #c9d1d9; --muted: #8b949e;
  --ok: #3fb950; --fail: #f85149; --warn: #d29922; --info: #58a6ff;
  --link: #58a6ff; --radius: 8px;
}
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  background: var(--bg); color: var(--text); margin: 0; line-height: 1.55; font-size: 15px;
}
a { color: var(--link); text-underline-offset: 2px; }
a:hover { text-decoration-thickness: 2px; }
.wrap { max-width: 1040px; margin: 0 auto; padding: 28px 20px 48px; }
h1 { font-size: 1.5rem; font-weight: 650; margin: 0 0 6px; letter-spacing: -0.02em; }
h2 { font-size: 1.1rem; font-weight: 600; margin: 2rem 0 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border); color: var(--text-soft); }
h3 { font-size: 1rem; font-weight: 600; margin: 0 0 8px; }
.subtitle { color: var(--muted); font-size: 0.9rem; }
.lede { color: var(--text-soft); font-size: 0.95rem; margin: 14px 0 18px; max-width: 70ch; }
.scope-banner { background: rgba(88, 166, 255, 0.08); border: 1px solid rgba(88, 166, 255, 0.3); padding: 10px 14px; border-radius: var(--radius); margin: 14px 0; color: var(--text-soft); font-size: 0.9rem; }
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin: 14px 0 8px; }
.kpi { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 12px; text-align: center; }
.kpi .num { font-size: 1.5rem; font-weight: 700; line-height: 1.2; }
.kpi .lbl { font-size: 0.72rem; color: var(--muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
.kpi.ok .num { color: var(--ok); } .kpi.fail .num { color: var(--fail); } .kpi.warn .num { color: var(--warn); } .kpi.info .num { color: var(--info); }
.dashboard-caption { font-size: 0.74rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; margin: 18px 0 6px; }
.nav { display: flex; flex-wrap: wrap; gap: 10px; margin: 18px 0 8px; }
.nav a { padding: 12px 18px; background: var(--surface); border-radius: var(--radius); text-decoration: none; border: 1px solid var(--border); font-weight: 500; color: var(--text); }
.nav a:hover { border-color: var(--link); background: var(--card); }
.section-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; margin: 10px 0; }
.section-card h3 { margin-top: 0; }
.muted { color: var(--muted); font-size: 0.88rem; }
table { width: 100%; border-collapse: collapse; background: var(--surface); border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); margin: 10px 0; }
th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--border); vertical-align: top; font-size: 0.88rem; }
th { background: #0f172a; color: var(--muted); text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.05em; }
tr:last-child td { border-bottom: none; }
.badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 0.72rem; font-weight: 650; text-transform: uppercase; letter-spacing: 0.04em; }
.badge.passed, .badge.ok { background: rgba(63, 185, 80, 0.15); color: var(--ok); }
.badge.failed, .badge.timedOut, .badge.interrupted, .badge.error, .badge.fail { background: rgba(248, 81, 73, 0.15); color: var(--fail); }
.badge.skipped, .badge.warn { background: rgba(210, 153, 34, 0.15); color: var(--warn); }
.badge.info { background: rgba(88, 166, 255, 0.15); color: var(--info); }
details { margin-top: 6px; }
details summary { cursor: pointer; color: var(--muted); font-size: 0.85rem; }
pre { background: #010409; border: 1px solid var(--border); border-radius: 4px; padding: 10px; overflow-x: auto; font-size: 0.78rem; white-space: pre-wrap; word-break: break-word; margin: 6px 0 0; }
.suite-block { margin-top: 18px; }
.suite-block h3 { background: var(--card); padding: 10px 12px; border-radius: var(--radius) var(--radius) 0 0; border: 1px solid var(--border); border-bottom: none; }
.testcase-card { border: 1px solid var(--border); border-top: none; background: var(--surface); padding: 14px 16px; }
.testcase-card:last-child { border-radius: 0 0 var(--radius) var(--radius); }
.testcase-card .tc-header { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.testcase-card .tc-name { font-weight: 600; font-size: 0.95rem; }
.testcase-card .tc-meta-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; font-size: 0.78rem; color: var(--muted); margin-bottom: 6px; }
.testcase-card .tc-summary { font-size: 0.85rem; color: var(--text-soft); margin: 6px 0 0; }
.testcase-card .tc-preconditions { font-size: 0.8rem; color: var(--muted); margin: 6px 0 0; padding: 8px 10px; background: #010409; border-left: 3px solid var(--info); border-radius: 0 4px 4px 0; }
.testcase-card .tc-preconditions strong { color: var(--info); display: block; margin-bottom: 2px; }
.steps-list { list-style: none; padding: 0; margin: 10px 0 0; counter-reset: step; }
.steps-list li { counter-increment: step; position: relative; padding: 8px 10px 8px 38px; background: #010409; border: 1px solid var(--border); border-radius: 4px; margin: 4px 0; font-size: 0.8rem; }
.steps-list li::before { content: counter(step); position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; background: var(--card); border: 1px solid var(--border); border-radius: 50%; text-align: center; line-height: 18px; font-weight: 600; color: var(--muted); font-size: 0.7rem; }
.steps-list .step-action { color: var(--text-soft); }
.steps-list .step-expected { color: var(--muted); margin-top: 2px; padding-top: 4px; border-top: 1px dashed var(--border); }
.steps-list .step-expected strong { color: var(--ok); font-weight: 600; }
.tc-error { background: rgba(248, 81, 73, 0.08); border: 1px solid rgba(248, 81, 73, 0.3); padding: 10px 12px; border-radius: 4px; margin-top: 8px; font-size: 0.82rem; }
.tc-error strong { color: var(--fail); display: block; margin-bottom: 4px; }
.tc-attachments { font-size: 0.8rem; margin-top: 8px; color: var(--muted); }
.severity-critical { background: rgba(248, 81, 73, 0.15); color: var(--fail); }
.severity-normal { background: rgba(88, 166, 255, 0.15); color: var(--info); }
.severity-minor { background: rgba(139, 148, 158, 0.15); color: var(--muted); }
.finding-row { padding: 8px 12px; border-bottom: 1px solid var(--border); font-size: 0.85rem; background: var(--surface); }
.finding-row:last-child { border-bottom: none; }
.kind-section { margin-top: 12px; }
.kind-section h4 { font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin: 14px 0 6px; padding: 6px 10px; background: var(--card); border-left: 3px solid var(--border); border-radius: 0 4px 4px 0; }
.kind-section.kind-error h4 { border-left-color: var(--fail); color: var(--fail); }
.kind-section.kind-warn h4 { border-left-color: var(--warn); color: var(--warn); }
.kind-section.kind-info h4 { border-left-color: var(--info); color: var(--info); }
.kind-table { font-size: 0.8rem; }
.kind-table td { padding: 6px 10px; }
.coverage-list { margin-top: 8px; padding: 10px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); font-size: 0.8rem; color: var(--text-soft); }
.coverage-bar { width: 100%; height: 6px; background: var(--card); border-radius: 3px; margin: 4px 0 8px; overflow: hidden; }
.coverage-bar-fill { height: 100%; background: linear-gradient(90deg, var(--ok), var(--info)); border-radius: 3px; }
.url-row { padding: 8px 0; border-bottom: 1px solid var(--border); }
.url-row:last-child { border-bottom: none; }
.url-row .url-label { font-family: ui-monospace, SF Mono, Consolas, monospace; font-size: 0.78rem; color: var(--text-soft); word-break: break-all; }
.url-row .url-meta { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
.a11y-rule { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 8px 10px; margin: 4px 0; }
.a11y-rule .rule-id { font-family: ui-monospace, SF Mono, Consolas, monospace; font-size: 0.8rem; color: var(--info); }
.a11y-rule .rule-meta { font-size: 0.75rem; color: var(--muted); margin: 2px 0; }
.a11y-rule .rule-html { background: #010409; padding: 6px 8px; border-radius: 3px; font-family: ui-monospace, SF Mono, Consolas, monospace; font-size: 0.72rem; margin-top: 4px; overflow-x: auto; white-space: pre; max-height: 6rem; }
hr.sep { border: none; border-top: 1px solid var(--border); margin: 24px 0; }
`;

function htmlShell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>${SHARED_CSS}</style>
</head>
<body><div class="wrap">${body}</div></body>
</html>`;
}

function summarizeTests(tests: FlatTest[]): { total: number; passed: number; failed: number; skipped: number; durationMs: number } {
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
    const key = t.testsuite;
    const arr = m.get(key) ?? [];
    arr.push(t);
    m.set(key, arr);
  }
  return m;
}

function flattenSuitesFromXml(suite: ParsedTestSuite, acc: ParsedTestSuite[] = []): ParsedTestSuite[] {
  if (suite.testCases.length > 0) acc.push(suite);
  for (const child of suite.childSuites) flattenSuitesFromXml(child, acc);
  return acc;
}

/**
 * Indexa testcases do XML pelo nome (string normalizada). Em colisões raras
 * de nome igual em testsuites diferentes, mantém a primeira ocorrência (a
 * exibição usa o nome da testsuite no agrupamento, então não há ambiguidade
 * visual no relatório).
 */
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

function severityLabelFromImportance(importance: number): string {
  switch (importance) {
    case 3: return 'critical';
    case 2: return 'normal';
    case 1: return 'minor';
    default: return 'normal';
  }
}

function renderIndex(args: {
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
}): string {
  const t = args.testsSummary;
  const e = args.exploratorySummary;

  const suiteRows = [...args.byTestsuite.entries()]
    .map(([name, tests]) => {
      const ss = summarizeTests(tests);
      const exp = args.exploratoryByTestsuite.get(name);
      const expCol = exp
        ? `<span class="badge fail">${exp.totals.errors}E</span> <span class="badge warn">${exp.totals.warnings}W</span> <span class="badge info">${exp.totals.info}I</span>`
        : '<span class="muted">—</span>';
      return `<tr>
        <td>${escapeHtml(name)}</td>
        <td>${ss.total}</td>
        <td><span class="badge passed">${ss.passed}</span></td>
        <td>${ss.failed > 0 ? `<span class="badge failed">${ss.failed}</span>` : ss.failed}</td>
        <td>${ss.skipped > 0 ? `<span class="badge skipped">${ss.skipped}</span>` : ss.skipped}</td>
        <td>${expCol}</td>
        <td>${(ss.durationMs / 1000).toFixed(1)}s</td>
      </tr>`;
    })
    .join('\n');

  const allureLink = args.mode === 'regression'
    ? '<div class="section-card"><h3>Allure (regressivo, com trend)</h3><p class="muted" style="margin:0 0 8px">Relatório executivo com histórico entre execuções (publicado em GH Pages no CI).</p><p style="margin:0"><a href="../../allure-report/index.html">Abrir Allure →</a></p></div>'
    : '';

  const body = `
    <h1>Twygo QA — Relatório de Execução</h1>
    <div class="subtitle">${escapeHtml(args.projectName)} · ${escapeHtml(args.environment)} · ${args.browsers.join(', ')} · ${escapeHtml(args.generatedAt)}</div>
    <div class="scope-banner"><strong>Escopo:</strong> ${escapeHtml(args.scopeLabel)}</div>

    <p class="dashboard-caption">Casos de teste roteirizados</p>
    <div class="kpi-grid">
      <div class="kpi"><div class="num">${t.total}</div><div class="lbl">Executados</div></div>
      <div class="kpi ok"><div class="num">${t.passed}</div><div class="lbl">Aprovados</div></div>
      <div class="kpi fail"><div class="num">${t.failed}</div><div class="lbl">Falha</div></div>
      <div class="kpi warn"><div class="num">${t.skipped}</div><div class="lbl">Pulados</div></div>
      <div class="kpi"><div class="num">${(t.durationMs / 1000).toFixed(1)}s</div><div class="lbl">Duração</div></div>
    </div>

    ${e ? `
    <p class="dashboard-caption">Validação Exploratória</p>
    <div class="kpi-grid">
      <div class="kpi fail"><div class="num">${e.errors}</div><div class="lbl">Erros</div></div>
      <div class="kpi warn"><div class="num">${e.warnings}</div><div class="lbl">Warnings</div></div>
      <div class="kpi info"><div class="num">${e.info}</div><div class="lbl">Info</div></div>
      <div class="kpi"><div class="num">${e.testsuites}</div><div class="lbl">Testsuites c/ findings</div></div>
    </div>` : ''}

    <h2>Por testsuite</h2>
    <table>
      <thead><tr><th>Testsuite</th><th>Total</th><th>OK</th><th>Falhas</th><th>Pulados</th><th>Findings</th><th>Tempo</th></tr></thead>
      <tbody>${suiteRows || '<tr><td colspan="7" class="muted">Nenhum teste executado.</td></tr>'}</tbody>
    </table>

    <h2>Onde ir agora</h2>
    <div class="nav">
      <a href="tests.html">Casos de teste →</a>
      <a href="exploratory.html">Validação Exploratória →</a>
    </div>
    ${allureLink}

    <hr class="sep">
    <h2>Dados brutos (JSON)</h2>
    <p class="muted"><a href="summary.json">summary.json</a> · <a href="tests.json">tests.json</a> · <a href="exploratory.json">exploratory.json</a> · <a href="run_context.json">run_context.json</a></p>
  `;
  return htmlShell(`Relatório — ${args.projectName}`, body);
}

function renderTestcaseCard(t: FlatTest, xml: ParsedTestCase | undefined): string {
  const sevLabel = xml ? severityLabelFromImportance(xml.importance) : null;
  const sevBadge = sevLabel ? `<span class="badge severity-${sevLabel}">${sevLabel}</span>` : '';
  const idsRow: string[] = [];
  if (xml?.internalId) idsRow.push(`internalId: ${escapeHtml(xml.internalId)}`);
  if (xml?.externalId) idsRow.push(`externalId: ${escapeHtml(xml.externalId)}`);
  const idsHtml = idsRow.length > 0 ? `<span>${idsRow.join(' · ')}</span>` : '';

  const summaryHtml = xml?.summary
    ? `<div class="tc-summary">${escapeHtml(xml.summary)}</div>`
    : '';
  const preconditionsHtml = xml?.preconditions
    ? `<div class="tc-preconditions"><strong>Pré-condições</strong>${escapeHtml(xml.preconditions)}</div>`
    : '';

  const stepsHtml = xml && xml.steps.length > 0
    ? `<ol class="steps-list">${xml.steps
        .map(
          (s) => `<li>
            <div class="step-action">${escapeHtml(s.actions || '(sem ação)')}</div>
            <div class="step-expected"><strong>esperado:</strong> ${escapeHtml(s.expectedResults || '(sem esperado)')}</div>
          </li>`,
        )
        .join('')}</ol>`
    : xml
      ? '<div class="muted" style="margin-top:8px">XML sem steps registrados.</div>'
      : '<div class="muted" style="margin-top:8px">Sem metadata XML para este testcase (provavelmente spec hand-written).</div>';

  const errorBlock = t.errorMessage
    ? `<div class="tc-error"><strong>Falha</strong><pre style="margin:0">${escapeHtml(t.errorMessage)}</pre></div>`
    : '';

  const attachmentsHtml = t.attachments.length > 0
    ? `<div class="tc-attachments">Anexos: ${t.attachments
        .map((a) => `<a href="${escapeHtml(a.path)}" target="_blank">${escapeHtml(a.name)}</a>`)
        .join(' · ')}</div>`
    : '';

  return `<div class="testcase-card">
    <div class="tc-header">
      <span class="tc-name">${escapeHtml(t.testcase)}</span>
      <span class="badge ${t.status}">${escapeHtml(t.status)}</span>
      ${sevBadge}
    </div>
    <div class="tc-meta-row">
      <span>${t.project}</span>
      <span>${(t.durationMs / 1000).toFixed(2)}s</span>
      ${idsHtml}
    </div>
    ${summaryHtml}
    ${preconditionsHtml}
    ${stepsHtml}
    ${errorBlock}
    ${attachmentsHtml}
  </div>`;
}

function renderTests(args: {
  byTestsuite: Map<string, FlatTest[]>;
  projectName: string;
  xmlByName: Map<string, ParsedTestCase>;
}): string {
  const blocks = [...args.byTestsuite.entries()]
    .map(([suiteName, tests]) => {
      const cards = tests
        .map((t) => renderTestcaseCard(t, args.xmlByName.get(t.testcase.trim())))
        .join('\n');
      return `<div class="suite-block">
        <h3>${escapeHtml(suiteName)}</h3>
        ${cards}
      </div>`;
    })
    .join('\n');
  const body = `
    <h1>Casos de teste — ${escapeHtml(args.projectName)}</h1>
    <div class="subtitle"><a href="index.html">← Voltar ao dashboard</a></div>
    <p class="muted" style="margin-top:6px">Cada caso mostra status da execução, summary e pré-condições do XML, e a lista de steps planejados (ação + resultado esperado).</p>
    ${blocks || '<p class="muted">Nenhum testcase executado.</p>'}
  `;
  return htmlShell(`Casos de teste — ${args.projectName}`, body);
}

function partitionFindings(findings: ExploratoryFinding[]): {
  consoleAndPage: ExploratoryFinding[];
  http: ExploratoryFinding[];
  a11y: ExploratoryFinding[];
  brokenImages: ExploratoryFinding[];
  other: ExploratoryFinding[];
} {
  const out = { consoleAndPage: [] as ExploratoryFinding[], http: [] as ExploratoryFinding[], a11y: [] as ExploratoryFinding[], brokenImages: [] as ExploratoryFinding[], other: [] as ExploratoryFinding[] };
  for (const f of findings) {
    if (f.kind === 'console_error' || f.kind === 'page_error') out.consoleAndPage.push(f);
    else if (f.kind === 'http_error') out.http.push(f);
    else if (f.kind === 'a11y_violation') out.a11y.push(f);
    else if (f.kind === 'broken_image') out.brokenImages.push(f);
    else out.other.push(f);
  }
  return out;
}

function renderConsoleSection(findings: ExploratoryFinding[]): string {
  if (findings.length === 0) return '';
  const items = findings
    .map((f) => {
      const stack = f.detail && typeof f.detail === 'object' && 'stack' in f.detail
        ? `<details><summary class="muted">stack</summary><pre>${escapeHtml(String(f.detail['stack']))}</pre></details>`
        : '';
      return `<div class="finding-row">
        <span class="badge ${f.severity}">${f.severity}</span>
        <strong>${escapeHtml(f.kind)}</strong> — ${escapeHtml(f.message)}
        <div class="muted" style="margin-top:2px">${escapeHtml(f.url)}</div>
        ${stack}
      </div>`;
    })
    .join('\n');
  return `<div class="kind-section kind-error">
    <h4>Erros JavaScript no navegador (${findings.length})</h4>
    ${items}
  </div>`;
}

function renderHttpSection(findings: ExploratoryFinding[]): string {
  if (findings.length === 0) return '';
  // Agrega por (status × method × URL) para reduzir ruído
  const aggregated = new Map<string, { status: number; method: string; url: string; severity: string; count: number }>();
  for (const f of findings) {
    const status = (f.detail?.['status'] as number) ?? 0;
    const method = (f.detail?.['method'] as string) ?? 'GET';
    const key = `${status}|${method}|${f.url}`;
    const existing = aggregated.get(key);
    if (existing) existing.count++;
    else aggregated.set(key, { status, method, url: f.url, severity: f.severity, count: 1 });
  }
  const sortedRows = [...aggregated.values()]
    .sort((a, b) => b.count - a.count)
    .map((r) => `<tr>
      <td><span class="badge ${r.severity}">${r.status}</span></td>
      <td>${escapeHtml(r.method)}</td>
      <td style="font-family:ui-monospace,monospace;font-size:0.78rem;word-break:break-all">${escapeHtml(r.url)}</td>
      <td style="text-align:center">${r.count}</td>
    </tr>`)
    .join('\n');
  const severity = findings.some((f) => f.severity === 'error') ? 'error' : 'warn';
  return `<div class="kind-section kind-${severity}">
    <h4>Respostas HTTP de falha (${findings.length} no total · ${aggregated.size} únicas)</h4>
    <table class="kind-table">
      <thead><tr><th>Status</th><th>Method</th><th>URL</th><th>Ocorrências</th></tr></thead>
      <tbody>${sortedRows}</tbody>
    </table>
  </div>`;
}

function renderA11ySection(findings: ExploratoryFinding[]): string {
  if (findings.length === 0) return '';
  // Agrupa por ruleId
  const byRule = new Map<string, ExploratoryFinding[]>();
  for (const f of findings) {
    const ruleId = (f.detail?.['ruleId'] as string) ?? 'unknown';
    const arr = byRule.get(ruleId) ?? [];
    arr.push(f);
    byRule.set(ruleId, arr);
  }
  const rules = [...byRule.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([ruleId, items]) => {
      const first = items[0];
      const impact = (first.detail?.['impact'] as string) ?? 'unknown';
      const tags = (first.detail?.['tags'] as string[]) ?? [];
      const helpUrl = (first.detail?.['helpUrl'] as string) ?? '';
      const sampleHtml = (first.detail?.['firstNodeHtml'] as string) ?? '';
      const sampleTarget = (first.detail?.['firstNodeTarget'] as string[] | undefined)?.join(' ');
      const urls = [...new Set(items.map((i) => i.url))];
      return `<div class="a11y-rule">
        <div><span class="rule-id">${escapeHtml(ruleId)}</span> <span class="badge ${first.severity}">${escapeHtml(impact)}</span> <span class="muted" style="margin-left:6px">${items.length} ocorrência(s) em ${urls.length} URL(s)</span></div>
        <div class="rule-meta">${escapeHtml(first.message)}${tags.length > 0 ? ` · WCAG: ${escapeHtml(tags.join(', '))}` : ''}</div>
        ${helpUrl ? `<div class="rule-meta"><a href="${escapeHtml(helpUrl)}" target="_blank">Como corrigir →</a></div>` : ''}
        ${sampleTarget ? `<div class="rule-meta">Seletor: <code style="font-family:ui-monospace,monospace;font-size:0.72rem">${escapeHtml(sampleTarget)}</code></div>` : ''}
        ${sampleHtml ? `<pre class="rule-html">${escapeHtml(sampleHtml)}</pre>` : ''}
      </div>`;
    })
    .join('\n');
  const severity = findings.some((f) => f.severity === 'error') ? 'error' : 'warn';
  return `<div class="kind-section kind-${severity}">
    <h4>Violações de acessibilidade — axe-core (${findings.length} no total · ${byRule.size} regras únicas)</h4>
    ${rules}
  </div>`;
}

function renderBrokenImagesSection(findings: ExploratoryFinding[]): string {
  if (findings.length === 0) return '';
  const items = findings
    .map((f) => {
      const src = (f.detail?.['src'] as string) ?? f.message;
      const alt = (f.detail?.['alt'] as string) ?? '';
      return `<div class="finding-row">
        <span class="badge warn">warn</span>
        <span style="font-family:ui-monospace,monospace;font-size:0.78rem">${escapeHtml(src)}</span>
        ${alt ? `<span class="muted"> — alt: "${escapeHtml(alt)}"</span>` : ''}
        <div class="muted" style="margin-top:2px">página: ${escapeHtml(f.url)}</div>
      </div>`;
    })
    .join('\n');
  return `<div class="kind-section kind-warn">
    <h4>Imagens quebradas (${findings.length})</h4>
    ${items}
  </div>`;
}

function renderCoverageSection(coverage: ExploratoryCoverage[]): string {
  if (coverage.length === 0) return '';
  const items = coverage
    .map((c) => {
      const pct = c.totalInteractive > 0
        ? Math.min(100, Math.round((c.visibleInteractive / c.totalInteractive) * 100))
        : 0;
      const samples = c.samples.slice(0, 8)
        .map((u) => `${escapeHtml(u.role)}${u.name ? ': ' + escapeHtml(u.name) : ''}`)
        .join(' · ');
      return `<div class="url-row">
        <div class="url-label">${escapeHtml(c.url)}</div>
        <div class="coverage-bar"><div class="coverage-bar-fill" style="width:${pct}%"></div></div>
        <div class="url-meta">${c.visibleInteractive}/${c.totalInteractive} interativos visíveis (${pct}%) · amostra: ${samples || '(vazio)'}</div>
      </div>`;
    })
    .join('\n');
  return `<div class="kind-section kind-info">
    <h4>Cobertura observada por URL (${coverage.length})</h4>
    <div class="coverage-list">${items}</div>
  </div>`;
}

function renderExploratory(args: { exploratoryByTestsuite: Map<string, ExploratorySuite>; projectName: string }): string {
  const blocks = [...args.exploratoryByTestsuite.values()]
    .map((s) => {
      const partitioned = partitionFindings(s.findings);
      const sections = [
        renderConsoleSection(partitioned.consoleAndPage),
        renderHttpSection(partitioned.http),
        renderA11ySection(partitioned.a11y),
        renderBrokenImagesSection(partitioned.brokenImages),
        renderCoverageSection(s.coverage),
      ].filter(Boolean).join('\n');
      const totalsBar = `<div style="padding:8px 12px;background:var(--surface);border:1px solid var(--border);border-bottom:none">
        <span class="badge fail">${s.totals.errors} erro(s)</span>
        <span class="badge warn">${s.totals.warnings} warning(s)</span>
        <span class="badge info">${s.totals.info} info</span>
      </div>`;
      return `<div class="suite-block">
        <h3>${escapeHtml(s.testsuiteName)}</h3>
        ${totalsBar}
        ${sections || '<div class="finding-row muted">Nenhum finding nesta testsuite.</div>'}
      </div>`;
    })
    .join('\n');
  const body = `
    <h1>Validação Exploratória — ${escapeHtml(args.projectName)}</h1>
    <div class="subtitle"><a href="index.html">← Voltar ao dashboard</a></div>
    <p class="muted" style="margin-top:6px">Findings agrupados por categoria: erros JS, respostas HTTP de falha, violações axe-core (a11y), imagens quebradas e snapshot de cobertura por URL.</p>
    ${blocks || '<p class="muted">Nenhum finding exploratório registrado.</p>'}
  `;
  return htmlShell(`Exploratório — ${args.projectName}`, body);
}

function metaRefresh(target: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${escapeHtml(target)}"><title>Redirecionando…</title></head><body><a href="${escapeHtml(target)}">Abrir relatório mais recente</a></body></html>`;
}

function runAllureGenerate(): boolean {
  const resultsDir = resolve(process.cwd(), 'outputs/allure-results');
  const reportDir = resolve(process.cwd(), 'outputs/allure-report');
  if (!existsSync(resultsDir)) {
    log.warn('outputs/allure-results não existe — pular geração Allure (rodou em modo regressivo?)');
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
      log.warn(
        'Dica Windows: Allure precisa de uma JRE com `tzdb.dat`. Defina JAVA_HOME apontando para uma JRE/JDK completa antes de rodar (ex.: `set JAVA_HOME=C:\\Program Files\\Eclipse Adoptium\\jdk-17.x.x-hotspot`). Veja .claude/SETUP.md.',
      );
    }
    return false;
  }
  log.info(`Relatório Allure → ${reportDir}/index.html`);
  return true;
}

async function main(): Promise<void> {
  const args = parseFlags();

  const cfg = loadJson<ProjectConfig>(resolve(process.cwd(), FILES.projectConfig));
  if (!cfg) throw new Error(`Config ausente: ${FILES.projectConfig}`);

  const playwrightReport = loadJson<PlaywrightReport>(resolve(process.cwd(), FILES.testResults));
  if (!playwrightReport) {
    throw new Error(`${FILES.testResults} ausente. Execute os testes antes (npm run agent:run).`);
  }
  const exploratoryReport = loadJson<ExploratoryReport>(resolve(process.cwd(), FILES.exploratoryFindings));
  const parsedAnalysis = loadJson<ParsedAnalysis>(resolve(process.cwd(), FILES.parsedAnalysis));
  const xmlByName = parsedAnalysis ? indexTestCasesByName(parsedAnalysis) : new Map<string, ParsedTestCase>();
  if (!parsedAnalysis) {
    log.warn(`${FILES.parsedAnalysis} ausente — tests.html não terá metadata do XML (steps, summary, preconditions).`);
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
    latestPointerName = `latest-suite-${slugify(args.suite)}.html`;
  } else if (args.mode === 'regression') {
    scopeLabel = 'Regressivo completo (todas as testsuites)';
    folderPrefix = 'regression';
    latestPointerName = 'latest-regression.html';
  } else {
    scopeLabel = 'Todas as testsuites (modo padrão)';
    folderPrefix = 'all-suites';
    latestPointerName = 'latest-all.html';
  }

  const ts = timestamp();
  const folderName = `${folderPrefix}_${ts}`;
  const reportDir = resolve(process.cwd(), PATHS.outputs, 'reports', folderName);
  ensureDir(reportDir);

  const byTestsuite = groupByTestsuite(tests);

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
    join(reportDir, 'index.html'),
    renderIndex({
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
    }),
  );
  writeFileSync(
    join(reportDir, 'tests.html'),
    renderTests({ byTestsuite, projectName: cfg.projectName, xmlByName }),
  );
  writeFileSync(
    join(reportDir, 'exploratory.html'),
    renderExploratory({ exploratoryByTestsuite, projectName: cfg.projectName }),
  );
  writeFileSync(
    join(reportDir, 'run_context.json'),
    JSON.stringify(
      {
        runId: folderName,
        mode: args.mode,
        suiteFilter: args.suite ?? null,
        projectName: cfg.projectName,
        environment: cfg.environment,
        browsers: cfg.browsers,
        generatedAt,
      },
      null,
      2,
    ),
  );
  writeFileSync(
    join(reportDir, 'summary.json'),
    JSON.stringify(
      {
        runId: folderName,
        scope: scopeLabel,
        tests: testsSummary,
        exploratory: exploratorySummary,
      },
      null,
      2,
    ),
  );
  if (existsSync(resolve(process.cwd(), FILES.testResults))) {
    copyFileSync(resolve(process.cwd(), FILES.testResults), join(reportDir, 'tests.json'));
  }
  if (existsSync(resolve(process.cwd(), FILES.exploratoryFindings))) {
    copyFileSync(resolve(process.cwd(), FILES.exploratoryFindings), join(reportDir, 'exploratory.json'));
  }

  const reportsRoot = resolve(process.cwd(), PATHS.outputs, 'reports');
  writeFileSync(join(reportsRoot, latestPointerName), metaRefresh(`${folderName}/index.html`));

  log.info(`Relatório gerado → ${reportDir}/index.html`);
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
