import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createLogger } from '../../src/utils/logger.js';
import { FILES } from '../../src/utils/constants.js';
import { ensureParentDir } from '../../src/utils/helpers.js';

const log = createLogger('report-generator');

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
  stats?: {
    expected: number;
    unexpected: number;
    flaky: number;
    skipped: number;
    duration: number;
  };
};

type Summary = {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  durationMs: number;
};

type FlatTest = {
  suite: string;
  file: string;
  title: string;
  project: string;
  status: string;
  durationMs: number;
  errorMessage?: string;
  attachments: Array<{ name: string; path: string; contentType: string }>;
};

function flatten(suites: PlaywrightSuite[], parentTitle = ''): FlatTest[] {
  const out: FlatTest[] = [];
  for (const suite of suites) {
    const title = parentTitle ? `${parentTitle} › ${suite.title}` : suite.title;
    for (const spec of suite.specs) {
      for (const test of spec.tests) {
        const lastResult = test.results[test.results.length - 1];
        out.push({
          suite: title,
          file: spec.file,
          title: spec.title,
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
    if (suite.suites) {
      out.push(...flatten(suite.suites, title));
    }
  }
  return out;
}

function summarize(tests: FlatTest[]): Summary {
  const summary: Summary = {
    total: tests.length,
    passed: 0,
    failed: 0,
    skipped: 0,
    flaky: 0,
    durationMs: 0,
  };
  for (const t of tests) {
    summary.durationMs += t.durationMs;
    if (t.status === 'passed') summary.passed++;
    else if (t.status === 'skipped') summary.skipped++;
    else summary.failed++;
  }
  return summary;
}

function renderHtml(template: string, summary: Summary, tests: FlatTest[]): string {
  const rows = tests
    .map((t) => {
      const badgeClass = `badge badge-${t.status}`;
      const errorBlock = t.errorMessage
        ? `<details><summary>Erro</summary><pre>${escapeHtml(t.errorMessage)}</pre></details>`
        : '';
      const attachments = t.attachments
        .map(
          (a) =>
            `<a href="${escapeAttr(a.path)}" target="_blank">${escapeHtml(a.name)}</a>`,
        )
        .join(' · ');
      return `
        <tr>
          <td>${escapeHtml(t.suite)}</td>
          <td>${escapeHtml(t.title)}</td>
          <td>${escapeHtml(t.project)}</td>
          <td><span class="${badgeClass}">${escapeHtml(t.status)}</span></td>
          <td>${(t.durationMs / 1000).toFixed(2)}s</td>
          <td>${errorBlock}${attachments}</td>
        </tr>`;
    })
    .join('\n');

  return template
    .replace(/\{\{TOTAL\}\}/g, String(summary.total))
    .replace(/\{\{PASSED\}\}/g, String(summary.passed))
    .replace(/\{\{FAILED\}\}/g, String(summary.failed))
    .replace(/\{\{SKIPPED\}\}/g, String(summary.skipped))
    .replace(/\{\{DURATION\}\}/g, `${(summary.durationMs / 1000).toFixed(2)}s`)
    .replace(/\{\{GENERATED_AT\}\}/g, new Date().toISOString())
    .replace(/\{\{ROWS\}\}/g, rows);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}

async function main(): Promise<void> {
  const resultsPath = resolve(process.cwd(), FILES.testResults);
  const templatePath = resolve(process.cwd(), FILES.reportTemplate);
  const outputPath = resolve(process.cwd(), FILES.testReport);

  if (!existsSync(resultsPath)) {
    throw new Error(
      `Arquivo de resultados não encontrado: ${resultsPath}. Execute os testes antes.`,
    );
  }
  if (!existsSync(templatePath)) {
    throw new Error(`Template de relatório ausente: ${templatePath}`);
  }

  log.info('Lendo resultados do Playwright');
  const report = JSON.parse(readFileSync(resultsPath, 'utf-8')) as PlaywrightReport;
  const template = readFileSync(templatePath, 'utf-8');

  const tests = flatten(report.suites);
  const summary = summarize(tests);
  const html = renderHtml(template, summary, tests);

  ensureParentDir(outputPath);
  writeFileSync(outputPath, html, 'utf-8');

  log.info(
    `Relatório gerado: ${summary.passed}✓ ${summary.failed}✗ ${summary.skipped}⊘ → ${outputPath}`,
  );
}

const invokedDirectly = process.argv[1]?.endsWith('generator.ts');

if (invokedDirectly) {
  main().catch((err) => {
    log.error('Falha ao gerar relatório', err);
    process.exit(1);
  });
}
