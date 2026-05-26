import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, basename, relative } from 'node:path';
import { parseArgs } from 'node:util';
import { execSync } from 'node:child_process';
import { createLogger } from '../../../src/utils/logger.js';
import {
  getOutputDir,
  getOutputPath,
  getCurrentEnv,
  loadProjectConfig,
  getProjectSlug,
} from '../../../src/utils/environment.js';
import { ensureDir, slugify } from '../../../src/utils/helpers.js';

const log = createLogger('bug-report-generator');

// ─── Tipos Playwright JSON reporter ─────────────────────────────────────────

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

type PlaywrightAnnotation = { type: string; description?: string };

type PlaywrightTestResult = {
  status: 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted';
  duration: number;
  error?: { message?: string; stack?: string };
  steps?: PlaywrightStep[];
  attachments?: PlaywrightAttachment[];
  errorLocation?: { file?: string; line?: number; column?: number };
  annotations?: PlaywrightAnnotation[];
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
};

// ─── Tipos exploratory ──────────────────────────────────────────────────────

type ExploratoryFinding = {
  kind: 'console_error' | 'page_error' | 'http_error' | 'broken_image' | 'a11y_violation';
  severity: 'error' | 'warn' | 'info';
  url: string;
  message: string;
  detail?: Record<string, unknown>;
  inScope?: boolean;
};

type SuiteFindingsFile = {
  suite: string;
  test: string;
  file: string;
  workerIndex: number;
  startedAt: string;
  finishedAt: string;
  findings: ExploratoryFinding[];
};

// ─── Estrutura interna do red ───────────────────────────────────────────────

type RedTest = {
  id: string;
  testsuite: string;
  testcase: string;
  file: string;
  fileLabel: string;
  status: 'failed' | 'timedOut';
  durationMs: number;
  errorMessage: string;
  errorLocation: string;
  failedStepTitle: string | null;
  failedStepNumber: number | null;
  steps: Array<{ n: number; title: string; status: 'passed' | 'failed' }>;
  attachments: Array<{ name: string; path: string; contentType: string }>;
  workerIndex: number;
  projectName: string;
};

// ─── Output schema ──────────────────────────────────────────────────────────

type BugReportNetworkRow = {
  method: string;
  url: string;
  status: number;
  responseBody?: string;
  inScope: boolean;
};

type BugReportConsoleRow = {
  level: 'error';
  message: string;
  url: string;
};

type BugReport = {
  id: string;
  title: string;
  testsuite: string;
  testcase: string;
  file: string;
  status: 'failed' | 'timedOut';
  durationMs: number;
  categoriaSugerida: 'bug-produto' | 'spec-fragil' | 'modal-nao-tratado' | 'flakiness' | 'inconclusivo';
  categoriaConfianca: 'alta' | 'media' | 'baixa';
  categoriaJustificativa: string;
  severity: 'alta' | 'media' | 'baixa';
  severityRevisar: boolean;
  environment: {
    name: string;
    baseUrl: string;
    orgId: string | null;
    browser: string;
    user: string;
  };
  buildCommit: string;
  generatedAt: string;
  reproSteps: Array<{ n: number; action: string; status: 'passed' | 'failed'; errorAtStep: boolean }>;
  expected: string;
  observed: string;
  errorLocation: string;
  network: BugReportNetworkRow[];
  console: BugReportConsoleRow[];
  attachments: Array<{ name: string; relPath: string }>;
  taxaReproducao: string;
  taxaRevisar: true;
  regressao: 'desconhecida';
  regressaoRevisar: true;
  impacto: 'desconhecido';
  impactoRevisar: true;
  isolamento: { outroUsuario: null; outraOrg: null; revisar: true };
  workaround: null;
  ids: { orgId: string | null; userId: null };
};

type BugReportsBundle = {
  generatedAt: string;
  project: string;
  totalRed: number;
  reports: BugReport[];
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseFlags(): { project?: string } {
  const { values } = parseArgs({
    options: { project: { type: 'string' } },
    allowPositionals: true,
    strict: false,
  });
  return { project: values.project ? String(values.project) : undefined };
}

function loadJson<T>(path: string): T | null {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8')) as T;
}

function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

function truncate(s: string, max = 600): string {
  return s.length <= max ? s : s.slice(0, max) + ` …[+${s.length - max} chars]`;
}

function gitHeadShort(): string {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
}

// ─── Flatten Playwright suites pra lista plana ──────────────────────────────

function flattenSuites(report: PlaywrightReport): Array<{
  testsuite: string;
  testcase: string;
  file: string;
  fileLabel: string;
  result: PlaywrightTestResult;
  annotations: PlaywrightAnnotation[];
  projectName: string;
}> {
  const out: ReturnType<typeof flattenSuites> = [];
  function walk(suite: PlaywrightSuite, ancestors: string[]): void {
    const isFileNode = suite.file !== undefined && suite.title === suite.file.replace(/\//g, '\\');
    const next = isFileNode ? ancestors : [...ancestors, suite.title];
    for (const spec of suite.specs ?? []) {
      const testsuite = next[next.length - 1] ?? spec.title;
      const fileLabel = spec.file ? basename(spec.file) : '';
      for (const test of spec.tests) {
        const last = test.results[test.results.length - 1];
        if (!last) continue;
        const annotations: PlaywrightAnnotation[] = [
          ...(test.annotations ?? []),
          ...(last.annotations ?? []),
        ];
        out.push({
          testsuite,
          testcase: spec.title,
          file: spec.file,
          fileLabel,
          result: last,
          annotations,
          projectName: test.projectName,
        });
      }
    }
    for (const child of suite.suites ?? []) walk(child, next);
  }
  for (const root of report.suites) walk(root, []);
  return out;
}

function isRed(r: PlaywrightTestResult, annotations: PlaywrightAnnotation[]): boolean {
  if (r.status !== 'failed' && r.status !== 'timedOut') return false;
  const skipAnn = annotations.find((a) => a.type === 'fixme' || a.type === 'skip');
  return !skipAnn;
}

function buildRedTests(flat: ReturnType<typeof flattenSuites>): RedTest[] {
  const reds: RedTest[] = [];
  for (const entry of flat) {
    if (!isRed(entry.result, entry.annotations)) continue;
    const r = entry.result;
    const steps = (r.steps ?? []).map((s, i) => ({
      n: i + 1,
      title: s.title || '(sem título)',
      status: (s.error ? 'failed' : 'passed') as 'passed' | 'failed',
    }));
    const failedIdx = steps.findIndex((s) => s.status === 'failed');
    const id = `${slugify(entry.testsuite)}__${slugify(entry.testcase)}`;
    reds.push({
      id,
      testsuite: entry.testsuite,
      testcase: entry.testcase,
      file: entry.file,
      fileLabel: entry.fileLabel,
      status: r.status as 'failed' | 'timedOut',
      durationMs: r.duration,
      errorMessage: stripAnsi(r.error?.message ?? ''),
      errorLocation: r.errorLocation
        ? `${r.errorLocation.file ?? ''}:${r.errorLocation.line ?? ''}:${r.errorLocation.column ?? ''}`
        : '',
      failedStepTitle: failedIdx >= 0 ? steps[failedIdx]!.title : null,
      failedStepNumber: failedIdx >= 0 ? failedIdx + 1 : null,
      steps,
      attachments: (r.attachments ?? [])
        .filter((a): a is Required<PlaywrightAttachment> => typeof a.path === 'string')
        .map((a) => ({ name: a.name, path: a.path, contentType: a.contentType })),
      workerIndex: 0,
      projectName: entry.projectName,
    });
  }
  return reds;
}

// ─── Exploratory lookup ─────────────────────────────────────────────────────

function findExploratoryForTest(
  exploratoryDir: string,
  testsuite: string,
  testcase: string,
): SuiteFindingsFile | null {
  if (!existsSync(exploratoryDir)) return null;
  const suiteSlug = slugify(testsuite);
  const testSlug = slugify(testcase);
  const expectedPrefix = `${suiteSlug}__${testSlug}__w`;
  const files = readdirSync(exploratoryDir).filter(
    (f) => f.startsWith(expectedPrefix) && f.endsWith('.json'),
  );
  if (files.length === 0) return null;
  files.sort((a, b) => statSync(resolve(exploratoryDir, b)).mtimeMs - statSync(resolve(exploratoryDir, a)).mtimeMs);
  return loadJson<SuiteFindingsFile>(resolve(exploratoryDir, files[0]!));
}

function extractNetworkRows(findings: ExploratoryFinding[]): BugReportNetworkRow[] {
  return findings
    .filter((f) => f.kind === 'http_error')
    .map((f) => {
      const detail = f.detail ?? {};
      const status = typeof detail.status === 'number' ? detail.status : 0;
      const method = typeof detail.method === 'string' ? detail.method : '?';
      const body = typeof detail.responseBody === 'string'
        ? truncate(detail.responseBody)
        : undefined;
      return {
        method,
        url: f.url,
        status,
        responseBody: body,
        inScope: f.inScope ?? false,
      };
    });
}

function extractConsoleRows(findings: ExploratoryFinding[]): BugReportConsoleRow[] {
  return findings
    .filter((f) => (f.kind === 'console_error' || f.kind === 'page_error') && f.inScope !== false)
    .map((f) => ({ level: 'error' as const, message: truncate(f.message, 300), url: f.url }));
}

// ─── Categorização heurística ───────────────────────────────────────────────

function classify(red: RedTest, network: BugReportNetworkRow[]): {
  categoria: BugReport['categoriaSugerida'];
  confianca: BugReport['categoriaConfianca'];
  justificativa: string;
} {
  const err = red.errorMessage.toLowerCase();

  const http5xx = network.find((n) => n.status >= 500 && n.inScope);
  if (http5xx) {
    return {
      categoria: 'bug-produto',
      confianca: 'alta',
      justificativa: `HTTP ${http5xx.status} in-scope em ${http5xx.method} ${http5xx.url}`,
    };
  }

  const http4xx = network.find((n) => n.status >= 400 && n.status < 500 && n.inScope);
  if (http4xx) {
    return {
      categoria: 'bug-produto',
      confianca: 'media',
      justificativa: `HTTP ${http4xx.status} in-scope em ${http4xx.method} ${http4xx.url}${http4xx.responseBody ? ` — "${http4xx.responseBody}"` : ''}`,
    };
  }

  if (/strict mode violation|resolved to \d+ element/i.test(red.errorMessage)) {
    return {
      categoria: 'spec-fragil',
      confianca: 'alta',
      justificativa: 'Locator bate em N elementos — seletor não-único',
    };
  }

  if (/intercepts pointer events|subtree intercepts/i.test(red.errorMessage)) {
    return {
      categoria: 'modal-nao-tratado',
      confianca: 'alta',
      justificativa: 'Click interceptado — overlay/modal por cima do alvo',
    };
  }

  if (/timeout.*exceeded/i.test(err) && !http5xx && !http4xx) {
    return {
      categoria: 'spec-fragil',
      confianca: 'media',
      justificativa: 'Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp',
    };
  }

  return {
    categoria: 'inconclusivo',
    confianca: 'baixa',
    justificativa: 'Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace',
  };
}

function inferSeverity(
  categoria: BugReport['categoriaSugerida'],
  network: BugReportNetworkRow[],
): BugReport['severity'] {
  if (categoria === 'bug-produto') {
    const has5xx = network.some((n) => n.status >= 500 && n.inScope);
    return has5xx ? 'alta' : 'media';
  }
  if (categoria === 'spec-fragil' || categoria === 'modal-nao-tratado') return 'baixa';
  return 'media';
}

// ─── Render ─────────────────────────────────────────────────────────────────

function toRelPath(absPath: string, baseDir: string): string {
  return relative(baseDir, absPath).replace(/\\/g, '/');
}

function buildReport(
  red: RedTest,
  exploratoryFile: SuiteFindingsFile | null,
  env: ReturnType<typeof getCurrentEnv>,
  projectOutputRoot: string,
  generatedAt: string,
  buildCommit: string,
): BugReport {
  const findings = exploratoryFile?.findings ?? [];
  const network = extractNetworkRows(findings);
  const consoleRows = extractConsoleRows(findings);
  const classification = classify(red, network);
  const severity = inferSeverity(classification.categoria, network);

  const titleShort = red.errorMessage.split('\n')[0]?.slice(0, 80) ?? 'falha';
  const reproSteps = red.steps.map((s) => ({
    n: s.n,
    action: s.title,
    status: s.status,
    errorAtStep: s.status === 'failed',
  }));

  const attachments = red.attachments.map((a) => ({
    name: a.name,
    relPath: toRelPath(a.path, projectOutputRoot),
  }));

  return {
    id: red.id,
    title: `${red.testcase} — ${titleShort}`,
    testsuite: red.testsuite,
    testcase: red.testcase,
    file: red.file,
    status: red.status,
    durationMs: red.durationMs,
    categoriaSugerida: classification.categoria,
    categoriaConfianca: classification.confianca,
    categoriaJustificativa: classification.justificativa,
    severity,
    severityRevisar: true,
    environment: {
      name: env.name,
      baseUrl: env.entry.baseUrl,
      orgId: env.entry.orgId ?? null,
      browser: red.projectName,
      user: env.entry.credentials.email,
    },
    buildCommit,
    generatedAt,
    reproSteps,
    expected: '[REVISAR — preencher com expectedresults do XML do step que falhou]',
    observed: red.errorMessage ? truncate(red.errorMessage, 800) : '[sem mensagem — checar trace.zip]',
    errorLocation: red.errorLocation,
    network,
    console: consoleRows,
    attachments,
    taxaReproducao: '1/1 nesta execução',
    taxaRevisar: true,
    regressao: 'desconhecida',
    regressaoRevisar: true,
    impacto: 'desconhecido',
    impactoRevisar: true,
    isolamento: { outroUsuario: null, outraOrg: null, revisar: true },
    workaround: null,
    ids: { orgId: env.entry.orgId ?? null, userId: null },
  };
}

function renderMd(b: BugReport): string {
  const lines: string[] = [];
  lines.push(`# [${b.categoriaSugerida}] ${b.testcase}`);
  lines.push('');
  lines.push(`> _Categoria confiança: **${b.categoriaConfianca}** — ${b.categoriaJustificativa}_`);
  lines.push(`> _Gerado em ${b.generatedAt} · commit ${b.buildCommit}_`);
  lines.push('');

  lines.push('## Identificação');
  lines.push(`- **Suite**: ${b.testsuite}`);
  lines.push(`- **TC**: ${b.testcase}`);
  lines.push(`- **Spec**: \`${b.file}\``);
  lines.push(`- **Erro em**: \`${b.errorLocation || '—'}\``);
  lines.push(`- **Status**: ${b.status} (${b.durationMs}ms)`);
  lines.push('');

  lines.push('## Ambiente');
  lines.push(`- **Env**: ${b.environment.name} (\`${b.environment.baseUrl}\`)`);
  lines.push(`- **OrgId**: ${b.environment.orgId ?? '—'}`);
  lines.push(`- **Usuário**: ${b.environment.user}`);
  lines.push(`- **Browser**: ${b.environment.browser}`);
  lines.push(`- **Build/commit**: ${b.buildCommit}`);
  lines.push('');

  lines.push('## Reprodução');
  lines.push('- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.');
  lines.push('- **Passo-a-passo**:');
  for (const s of b.reproSteps) {
    const icon = s.errorAtStep ? '❌ **falhou aqui**' : s.status === 'passed' ? '✅' : '·';
    lines.push(`  ${s.n}. ${s.action} — ${icon}`);
  }
  lines.push(`- **Taxa**: ${b.taxaReproducao} \`[REVISAR taxa real — rodar 3+ vezes]\``);
  lines.push('');

  lines.push('## Comportamento');
  lines.push(`- **Esperado**: ${b.expected}`);
  lines.push('- **Observado**:');
  lines.push('  ```');
  lines.push(`  ${b.observed.split('\n').slice(0, 8).join('\n  ')}`);
  lines.push('  ```');
  lines.push('');

  lines.push('## Evidência técnica');
  lines.push('');
  if (b.network.length > 0) {
    lines.push('### Network');
    lines.push('| Método | URL | Status | In-scope | Body |');
    lines.push('|---|---|---|---|---|');
    for (const n of b.network) {
      const body = (n.responseBody ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
      lines.push(`| ${n.method} | \`${n.url}\` | **${n.status}** | ${n.inScope ? 'sim' : 'não'} | ${body} |`);
    }
    lines.push('');
  } else {
    lines.push('### Network');
    lines.push('_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._');
    lines.push('');
  }

  if (b.console.length > 0) {
    lines.push('### Console (in-scope)');
    for (const c of b.console) {
      lines.push(`- \`${c.level}\`: ${c.message} _em ${c.url}_`);
    }
    lines.push('');
  }

  if (b.attachments.length > 0) {
    lines.push('### Attachments');
    for (const a of b.attachments) {
      if (a.relPath.toLowerCase().endsWith('.png')) {
        lines.push(`- ![${a.name}](../${a.relPath})`);
      } else {
        lines.push(`- [${a.name}](../${a.relPath})`);
      }
    }
    lines.push('');
  }

  lines.push('### IDs envolvidos');
  lines.push(`- orgId: ${b.ids.orgId ?? '—'}`);
  lines.push('');

  lines.push('## Escopo');
  lines.push('- **Reproduz em outro usuário?** `[REVISAR isolamento]`');
  lines.push('- **Reproduz em outro env?** `[REVISAR isolamento]`');
  lines.push(`- **Regressão?** ${b.regressao} \`[REVISAR regressão]\``);
  lines.push(`- **Workaround**: ${b.workaround ?? 'nenhum identificado'} \`[REVISAR workaround]\``);
  lines.push('');

  lines.push('## Impacto');
  lines.push(`- **Severity sugerida**: **${b.severity}** \`[REVISAR severity]\``);
  lines.push(`- **Impacto qualitativo**: ${b.impacto} \`[REVISAR impacto]\``);
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem validação humana antes de abrir task._');

  return lines.join('\n');
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main(): void {
  const flags = parseFlags();
  const slug = getProjectSlug(flags.project);
  log.info(`Projeto ativo: ${slug}`);

  const testResultsPath = getOutputPath('test-results.json');
  const report = loadJson<PlaywrightReport>(testResultsPath);
  if (!report) {
    log.error(`Não achei ${testResultsPath}. Rode os testes antes (npm run agent:run).`);
    process.exit(1);
  }

  const flat = flattenSuites(report);
  const reds = buildRedTests(flat);
  log.info(`${flat.length} TC(s) executados — ${reds.length} red (failed/timedOut, sem fixme/skip)`);

  if (reds.length === 0) {
    log.info('Nada a reportar — run inteiro green ou só fixmes.');
    const projectRoot = getOutputDir('.');
    writeFileSync(
      resolve(projectRoot, 'bug-reports.json'),
      JSON.stringify(
        { generatedAt: new Date().toISOString(), project: slug, totalRed: 0, reports: [] },
        null,
        2,
      ),
      'utf-8',
    );
    return;
  }

  loadProjectConfig();
  const env = getCurrentEnv();
  const projectOutputRoot = getOutputDir('.');
  const exploratoryDir = getOutputDir('exploratory');
  const bugReportsDir = getOutputDir('bug-reports');
  ensureDir(bugReportsDir);
  const generatedAt = new Date().toISOString();
  const buildCommit = gitHeadShort();

  const reports: BugReport[] = [];
  for (const red of reds) {
    const exploratoryFile = findExploratoryForTest(exploratoryDir, red.testsuite, red.testcase);
    const bugReport = buildReport(red, exploratoryFile, env, projectOutputRoot, generatedAt, buildCommit);
    reports.push(bugReport);

    const mdPath = resolve(bugReportsDir, `${red.id}.md`);
    writeFileSync(mdPath, renderMd(bugReport), 'utf-8');
    log.info(`  → ${red.id}.md (${bugReport.categoriaSugerida}/${bugReport.categoriaConfianca})`);
  }

  const bundle: BugReportsBundle = {
    generatedAt,
    project: slug,
    totalRed: reports.length,
    reports,
  };
  const jsonPath = resolve(projectOutputRoot, 'bug-reports.json');
  writeFileSync(jsonPath, JSON.stringify(bundle, null, 2), 'utf-8');

  log.info(`Gerados ${reports.length} bug-report(s):`);
  log.info(`  - JSON: ${jsonPath}`);
  log.info(`  - MDs:  ${bugReportsDir}/<id>.md`);

  const byCategoria = new Map<string, number>();
  for (const r of reports) byCategoria.set(r.categoriaSugerida, (byCategoria.get(r.categoriaSugerida) ?? 0) + 1);
  const breakdown = Array.from(byCategoria.entries()).map(([k, v]) => `${v} ${k}`).join(' · ');
  log.info(`Categorias: ${breakdown}`);
}

main();
