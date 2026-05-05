import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { resolve, join, basename, relative } from 'node:path';
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
  testsuite: string;        // describe-block title (real testsuite)
  fileLabel: string;        // file basename for traceability
  testcase: string;         // test() title
  project: string;
  status: PlaywrightTestResult['status'];
  durationMs: number;
  errorMessage?: string;
  errorLocation?: string;
  // Motivo registrado por test.fixme(true, '...') ou test.skip(true, '...')
  // ou annotation explícita ({ type: 'fixme' | 'skip', description: '...' }).
  // Usado no relatório quando status === 'skipped' para evitar a frase
  // genérica "Sem mensagem registrada pelo Playwright."
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

/**
 * Extrai o orgId (ID do ambiente Twygo) de uma URL.
 * Padrão observado: `/o/{orgId}/...` ou `/o/{orgId}/ai_consumption_analysis/{envId}/...`.
 * Retorna `{ orgId, envId }` quando ambos podem ser identificados.
 */
function extractIdsFromUrl(url: string | undefined | null): { orgId?: string; envId?: string } {
  if (!url) return {};
  const out: { orgId?: string; envId?: string } = {};
  const orgMatch = url.match(/\/o\/(\d+)/);
  if (orgMatch) out.orgId = orgMatch[1];
  const envMatch = url.match(/\/ai_consumption_analysis\/(\d+)/);
  if (envMatch) out.envId = envMatch[1];
  return out;
}

/**
 * Tenta inferir a URL onde o teste estava no momento da falha. Procura, na
 * ordem: error-context attachment (Playwright grava o URL no markdown),
 * mensagem de erro (regex `at https://...`) e, em último caso, o baseUrl.
 *
 * O regex tira aspas/parênteses/vírgulas finais que vêm coladas em mensagens
 * de stack trace (ex.: `at https://x.com/y'`).
 */
function cleanUrl(url: string): string {
  return url.replace(/[)'",;.]+$/, '');
}

function inferFailureUrl(t: FlatTest, baseUrl: string | undefined): string {
  // 1. error-context.md frequentemente contém "URL: ..." ou linha com a URL
  const errCtx = t.attachments.find((a) => a.name === 'error-context');
  if (errCtx && existsSync(errCtx.path)) {
    try {
      const md = readFileSync(errCtx.path, 'utf-8');
      const urlLine = md.match(/-\s*url:\s*(\S+)/i)?.[1] ?? md.match(/(https?:\/\/[^\s)]+)/)?.[1];
      if (urlLine) return cleanUrl(urlLine);
    } catch {
      // ignora — fallback abaixo
    }
  }
  // 2. URL no stack/erro
  const fromErr = (t.errorMessage || '').match(/(https?:\/\/[^\s)"']+)/)?.[1];
  if (fromErr) return cleanUrl(fromErr);
  // 3. Last resort
  return baseUrl ?? '—';
}

// ─── Parsing & helpers ──────────────────────────────────────────────────────

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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

/** Remove sequências ANSI usadas pelo Playwright para colorir o terminal. */
function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
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

const STATUS_ICON: Record<string, string> = {
  passed: 'check_circle',
  failed: 'cancel',
  timedOut: 'schedule',
  skipped: 'block',
  interrupted: 'pause_circle',
  unknown: 'help',
};

function statusClass(status: string): 'ok' | 'fail' | 'warn' {
  if (status === 'passed') return 'ok';
  if (status === 'skipped' || status === 'interrupted') return 'warn';
  return 'fail';
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

/**
 * Recebe a mensagem de erro crua do Playwright e tenta produzir uma frase
 * curta em PT-BR descrevendo a causa, no estilo da função
 * `_pytest_human_summary` do projeto-referência (C:\Cursor\API).
 *
 * Padrões reconhecidos cobrem os erros mais comuns: timeouts de fill/click,
 * asserções `expect().toBeVisible/toBeChecked/toContainText`, navegação
 * abortada, modal não aparecido, locators não resolvidos.
 */
function playwrightHumanSummary(rawError: string): string {
  if (!rawError) return 'Sem mensagem registrada pelo Playwright.';
  const text = stripAnsi(rawError).trim();

  // Navigation interrupted by another navigation (precisa vir ANTES do page.goto genérico
  // pra não cair no regex de net::ERR_*)
  if (/page\.goto:\s*Navigation to\s*"([^"]+)"\s*is interrupted by another navigation/.test(text)) {
    const url = text.match(/page\.goto:\s*Navigation to\s*"([^"]+)"/)?.[1] ?? '?';
    return `Navegação para "${url}" foi interrompida por outra navegação no meio do caminho.`;
  }

  // page.goto net::ERR_* (ex.: net::ERR_ABORTED, net::ERR_NAME_NOT_RESOLVED)
  const gotoNet = text.match(/page\.goto:\s*(net::[A-Z_]+)\b[\s\S]*?\bat\s+(\S+)/);
  if (gotoNet) {
    return `Falha ao carregar a página "${gotoNet[2]}" (motivo: ${gotoNet[1]}).`;
  }

  // Test timeout no nível do teste todo (último, pra dar chance dos casos específicos acima)
  if (/Test timeout of (\d+)ms exceeded/i.test(text)) {
    const ms = text.match(/Test timeout of (\d+)ms/)?.[1];
    return `O teste excedeu o tempo limite de ${ms ? Math.round(Number(ms) / 1000) : '?'}s antes de concluir.`;
  }

  // expect(...).toBeVisible() failed
  if (/toBeVisible\(\)?\s*failed/.test(text)) {
    const loc = text.match(/Locator:\s*([^\n]+)/)?.[1]?.trim();
    return `O elemento esperado não apareceu na tela${loc ? ` (locator: ${loc})` : ''}.`;
  }

  // expect(...).toBeHidden() failed
  if (/toBeHidden\(\)?\s*failed/.test(text)) {
    return 'Um elemento que deveria estar oculto continuou visível.';
  }

  // expect(...).not.toBeChecked() failed → ordem importa: tem que vir ANTES
  // do regex genérico de toBeChecked, senão a regra abaixo casa também com
  // `not.toBeChecked` e gera mensagem invertida (bug visto em 2026-05-04 nas
  // suítes de Indexação onde o XML pede toggle DESABILITADA por padrão).
  if (/not\.toBeChecked\(\)?\s*failed/.test(text)) {
    const loc = text.match(/Locator:\s*([^\n]+)/)?.[1]?.trim();
    return `O checkbox/toggle deveria estar DESMARCADO/DESABILITADO mas estava marcado${loc ? ` (locator: ${loc})` : ''}.`;
  }
  // expect(...).toBeChecked() failed — usa lookbehind pra não capturar `not.toBeChecked`
  if (/(?<!not\.)toBeChecked\(\)?\s*failed/.test(text)) {
    const loc = text.match(/Locator:\s*([^\n]+)/)?.[1]?.trim();
    return `O checkbox/toggle esperava estar MARCADO/HABILITADO mas estava desmarcado${loc ? ` (locator: ${loc})` : ''}.`;
  }

  // expect(...).toHaveURL failed
  if (/toHaveURL/i.test(text) && /(Expected|Received)/i.test(text)) {
    const expected = text.match(/Expected[^\n]*?:\s*([^\n]+)/)?.[1]?.trim();
    const received = text.match(/Received[^\n]*?:\s*([^\n]+)/)?.[1]?.trim();
    return `A URL não bateu com a esperada${expected ? ` (esperada: ${expected})` : ''}${received ? ` — atual: ${received}` : ''}.`;
  }

  // expect(...).toContainText / toHaveText failed
  if (/(toContainText|toHaveText)\(\)?\s*failed/.test(text)) {
    const expected = text.match(/Expected[^\n]*?:\s*([^\n]+)/)?.[1]?.trim();
    return `O texto esperado não foi encontrado${expected ? `: "${expected}"` : ''}.`;
  }

  // expect(...).toHaveCount failed
  if (/toHaveCount\(\)?\s*failed/.test(text)) {
    const expected = text.match(/Expected[^\n]*?:\s*([^\n]+)/)?.[1]?.trim();
    const received = text.match(/Received[^\n]*?:\s*([^\n]+)/)?.[1]?.trim();
    return `Quantidade de elementos diferente do esperado${expected ? ` (esperado: ${expected}` : ''}${received ? `, encontrado: ${received})` : ''}.`;
  }

  // locator.click / locator.fill timeout
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

  // page.waitForURL timeout
  if (/page\.waitForURL.*[Tt]imeout/.test(text)) {
    return 'A página não navegou para a URL esperada dentro do tempo limite.';
  }

  // strict mode violation
  if (/strict mode violation/i.test(text)) {
    return 'O locator usado bate com mais de um elemento ao mesmo tempo (strict mode).';
  }

  // Element is not visible (encontrado, mas oculto)
  if (/element is not visible/i.test(text)) {
    return 'O elemento foi encontrado no DOM mas estava invisível para o usuário.';
  }

  // Element is not enabled
  if (/element is not enabled/i.test(text)) {
    return 'O elemento foi encontrado mas estava desabilitado e não permitiu interação.';
  }

  // Genérico: pega a 1ª linha real (sem ANSI/cabeçalhos vazios)
  const firstMeaningful = text
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith('Call log:') && !l.startsWith('===') && !l.startsWith('-')) ?? text.slice(0, 200);
  return truncate(firstMeaningful, 240);
}

/**
 * Resumo humano para QUALQUER status não-aprovado:
 * - failed/timedOut/interrupted: usa `playwrightHumanSummary` no erro técnico.
 * - skipped: explicita o motivo do `test.fixme()`/`test.skip()` (annotation
 *   description). Sem isso, o relatório mostrava "Sem mensagem registrada
 *   pelo Playwright." para todos os pulados intencionais — comportamento
 *   reportado pelo usuário em 2026-05-05.
 */
function failureOrSkipSummary(t: FlatTest): string {
  if (t.status === 'passed') return '—';
  if (t.status === 'skipped' || t.status === 'interrupted' && !t.errorMessage) {
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

// ─── Flatten do JSON do Playwright ──────────────────────────────────────────

/**
 * Caminha pela árvore de suites do JSON do Playwright e devolve a lista
 * achatada de testes. A "testsuite" reportada é o título do `describe(...)`
 * mais profundo (que casa com o nome do XML), não o caminho do arquivo —
 * isso resolve o problema histórico do índice mostrar nomes feios como
 * `features\...\foo.spec.ts › Configurar...`.
 */
function flatten(suites: PlaywrightSuite[]): FlatTest[] {
  const out: FlatTest[] = [];
  function walk(suite: PlaywrightSuite, ancestors: string[]): void {
    // Detecta se este nó parece ser arquivo (tem `file` igual ao próprio título)
    // ou um describe block real (cujo título não tem extensão).
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
        // Annotations vêm tanto no `test` quanto no `result` — preferir test
        // (mais estável). `test.fixme(true, '...')` e `test.skip(true, '...')`
        // produzem `{ type: 'fixme'|'skip', description: '...' }`.
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
 * Devolve a ordem em que as testsuites aparecem no XML (depth-first).
 * Usada para reordenar `byTestsuite` no `tests.html` — antes a ordem era
 * alfabética/inserção, o que confundia revisores acostumados ao XmindMap.
 */
function xmlSuiteOrder(parsed: ParsedAnalysis | null): string[] {
  if (!parsed) return [];
  const all = flattenSuitesFromXml(parsed.rootSuite);
  return all.map((s) => s.name.trim());
}

/**
 * Reordena o agrupamento por testsuite na mesma ordem do XML. Suites que
 * existem na execução mas não no XML (legados, seed, hand-written) são
 * descartadas com warn — protege contra "suítes inventadas" no relatório,
 * complementando o `testIgnore` do `playwright.config.ts`.
 */
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
  // Suites que sobraram (não estão no XML): logar e descartar do relatório
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

// ─── HTML / CSS / JS ────────────────────────────────────────────────────────

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
.wrap { max-width: 1080px; margin: 0 auto; padding: 28px 20px 48px; }
@media (min-width: 1200px) { .wrap { max-width: 1180px; } }
h1 { font-size: 1.5rem; font-weight: 650; margin: 0 0 6px; letter-spacing: -0.02em; }
h2 { font-size: 1.1rem; font-weight: 600; margin: 2rem 0 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border); color: var(--text-soft); }
h3 { font-size: 1rem; font-weight: 600; margin: 0 0 8px; }
h4 { font-size: 0.78rem; font-weight: 600; margin: 16px 0 6px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
.subtitle { color: var(--muted); font-size: 0.9rem; }
.lede { color: var(--text-soft); font-size: 0.95rem; margin: 14px 0 18px; max-width: 75ch; }
.muted { color: var(--muted); font-size: 0.88rem; }
.scope-banner { background: rgba(88, 166, 255, 0.08); border: 1px solid rgba(88, 166, 255, 0.3); padding: 10px 14px; border-radius: var(--radius); margin: 14px 0; color: var(--text-soft); font-size: 0.9rem; }
.attention-banner { background: rgba(248, 81, 73, 0.10); border: 1px solid rgba(248, 81, 73, 0.4); padding: 14px 16px; border-radius: var(--radius); margin: 18px 0; }
.attention-banner.empty { background: rgba(63, 185, 80, 0.08); border-color: rgba(63, 185, 80, 0.4); }
.attention-banner h3 { margin: 0 0 6px; color: var(--fail); display: flex; align-items: center; gap: 8px; }
.attention-banner.empty h3 { color: var(--ok); }
.attention-banner ul { margin: 6px 0 0; padding-left: 20px; font-size: 0.9rem; }
.attention-banner li { margin: 3px 0; }

.dashboard-caption { font-size: 0.74rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; margin: 20px 0 8px; }
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin: 8px 0; }
.kpi { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 12px; text-align: center; }
.kpi .num { font-size: 1.5rem; font-weight: 700; line-height: 1.2; font-variant-numeric: tabular-nums; }
.kpi .lbl { font-size: 0.72rem; color: var(--muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
.kpi.ok .num { color: var(--ok); } .kpi.fail .num { color: var(--fail); } .kpi.warn .num { color: var(--warn); } .kpi.info .num { color: var(--info); }

.nav { display: flex; flex-wrap: wrap; gap: 10px; margin: 18px 0 8px; }
.nav a { padding: 12px 18px; background: var(--surface); border-radius: var(--radius); text-decoration: none; border: 1px solid var(--border); font-weight: 500; color: var(--text); }
.nav a:hover { border-color: var(--link); background: var(--card); }

.section-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; margin: 10px 0; }
.section-card h3 { margin-top: 0; }

table { width: 100%; border-collapse: collapse; background: var(--surface); border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); margin: 10px 0; }
th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--border); vertical-align: top; font-size: 0.88rem; }
th { background: #0f172a; color: var(--muted); text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.05em; white-space: nowrap; }
tr:last-child td { border-bottom: none; }
.col-num { width: 2.4rem; text-align: center; font-variant-numeric: tabular-nums; color: var(--muted); }
.col-status { width: 1%; white-space: nowrap; }
.col-time { width: 1%; white-space: nowrap; color: var(--muted); font-variant-numeric: tabular-nums; }
.col-actions { width: 1%; white-space: nowrap; }

.badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 999px; font-size: 0.74rem; font-weight: 650; text-transform: uppercase; letter-spacing: 0.04em; }
.badge.ok { background: rgba(63, 185, 80, 0.15); color: var(--ok); }
.badge.fail { background: rgba(248, 81, 73, 0.15); color: var(--fail); }
.badge.warn { background: rgba(210, 153, 34, 0.15); color: var(--warn); }
.badge.info { background: rgba(88, 166, 255, 0.15); color: var(--info); }
.badge.severity-critico { background: rgba(248, 81, 73, 0.15); color: var(--fail); }
.badge.severity-normal { background: rgba(88, 166, 255, 0.15); color: var(--info); }
.badge.severity-menor { background: rgba(139, 148, 158, 0.18); color: var(--muted); }

button, select { font: inherit; padding: 8px 14px; border-radius: 6px; border: 1px solid var(--border); background: var(--card); color: var(--text); cursor: pointer; }
button:hover, select:hover { border-color: var(--link); }
.btn-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 10px 0; }
.btn-row label { font-size: 0.85rem; color: var(--muted); margin-left: 4px; }

pre { background: #010409; border: 1px solid var(--border); border-radius: 4px; padding: 10px; overflow-x: auto; font-size: 0.78rem; white-space: pre-wrap; word-break: break-word; margin: 6px 0 0; }
details { margin-top: 6px; }
details summary { cursor: pointer; color: var(--muted); font-size: 0.85rem; }

/* Linha-resumo + linha-detalhe (acordeon) */
.tc-summary-row { cursor: pointer; }
.tc-summary-row.is-expanded { background: var(--card); }
.tc-detail-row { display: none; }
.tc-detail-row.is-expanded { display: table-row; }
.tc-detail-row td { padding: 0; background: #0a0e14; border-bottom: 2px solid var(--border); }
.tc-detail-panel { padding: 18px 20px 20px; }

/* Strip de status grande */
.status-strip { margin: -18px -20px 16px; padding: 12px 20px; font-weight: 600; font-size: 0.92rem; display: flex; align-items: center; gap: 10px; }
.status-strip.ok { background: rgba(63, 185, 80, 0.18); color: var(--ok); border-bottom: 1px solid rgba(63, 185, 80, 0.4); }
.status-strip.fail { background: rgba(248, 81, 73, 0.15); color: var(--fail); border-bottom: 1px solid rgba(248, 81, 73, 0.4); }
.status-strip.warn { background: rgba(210, 153, 34, 0.15); color: var(--warn); border-bottom: 1px solid rgba(210, 153, 34, 0.4); }
.status-strip .material-symbols-outlined { font-size: 1.6rem; }

/* Bloco "Por que falhou" */
.failure-summary { background: rgba(248, 81, 73, 0.06); border: 1px solid rgba(248, 81, 73, 0.3); border-radius: 6px; padding: 12px 14px; margin: 0 0 14px; font-size: 0.92rem; }
.failure-summary .label { font-size: 0.72rem; font-weight: 700; color: var(--fail); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
.failure-summary .text { color: var(--text); }
.failure-summary .step-ref { color: var(--muted); font-size: 0.82rem; margin-top: 6px; }

.meta-block { margin-bottom: 14px; max-width: 90ch; }
.meta-block p { margin: 6px 0 0; color: var(--text-soft); }
.preconditions { padding: 10px 12px; background: #010409; border-left: 3px solid var(--info); border-radius: 0 4px 4px 0; font-size: 0.86rem; color: var(--text-soft); margin-top: 6px; white-space: pre-wrap; }

/* Tabelas internas (steps XML / steps Allure) */
.inner-scroll { overflow-x: auto; border: 1px solid var(--border); border-radius: 6px; margin: 6px 0 0; background: #010409; }
.inner-table { width: 100%; font-size: 0.84rem; border: none; border-radius: 0; margin: 0; min-width: 540px; background: transparent; }
.inner-table th { background: #1a2f4a; color: var(--text-soft); font-size: 0.72rem; padding: 8px 10px; }
.inner-table td { padding: 9px 10px; border-bottom: 1px solid #21262d; word-break: break-word; }
.inner-table tbody tr:nth-child(even) { background: #0d111766; }
.inner-table tbody tr:last-child td { border-bottom: none; }
.inner-table .step-failed { background: rgba(248, 81, 73, 0.08); }
.inner-table .step-failed td { border-bottom-color: rgba(248, 81, 73, 0.3); }

/* Evidências */
.evidence-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; margin-top: 6px; }
.evidence-card { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
.evidence-card .thumb { display: block; width: 100%; height: 140px; background: #010409; }
.evidence-card .thumb img { width: 100%; height: 100%; object-fit: contain; }
.evidence-card .thumb.no-img { display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 0.78rem; padding: 20px; text-align: center; }
.evidence-card .meta { padding: 8px 10px; font-size: 0.78rem; color: var(--muted); display: flex; justify-content: space-between; align-items: center; }
.evidence-card .meta a { color: var(--link); }

/* Bug-report */
.bug-block { background: #010409; border: 1px solid var(--border); border-radius: 6px; padding: 12px 14px; margin-top: 14px; }
.bug-block textarea { width: 100%; height: 12rem; background: transparent; color: var(--text-soft); border: none; resize: vertical; font-family: ui-monospace, SF Mono, Consolas, monospace; font-size: 0.78rem; padding: 0; }
.bug-block textarea:focus { outline: none; }
.bug-block .btn-row { margin-top: 8px; }

.material-symbols-outlined { font-family: "Material Symbols Outlined"; font-weight: normal; font-style: normal; font-size: 1.4rem; line-height: 1; vertical-align: middle; display: inline-block; font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24; }
.icon-ok { color: var(--ok); } .icon-fail { color: var(--fail); } .icon-warn { color: var(--warn); }

/* Status ícone-only (inspirado na referência API: print do projeto C:\Cursor\API).
   Evita quebra vertical do texto em colunas estreitas de tabelas internas. */
.status-icon { display: inline-flex; align-items: center; justify-content: center; cursor: help; }
.status-icon .material-symbols-outlined { font-size: 1.4rem; }
.status-icon.icon-ok .material-symbols-outlined { color: var(--ok); }
.status-icon.icon-fail .material-symbols-outlined { color: var(--fail); }
.status-icon.icon-warn .material-symbols-outlined { color: var(--warn); }
.inner-table .col-status, .inner-table th.col-status { width: 3rem; text-align: center; }
.inner-table .precond-row td { background: rgba(88, 166, 255, 0.06); font-style: italic; }
.inner-table .precond-row .precond-tag { font-style: normal; font-weight: 600; color: var(--info); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; margin-right: 6px; }

hr.sep { border: none; border-top: 1px solid var(--border); margin: 24px 0; }

/* Tabela ordenável (inspirado em session-report) */
table.sortable th[data-sort-key] { cursor: pointer; user-select: none; }
table.sortable th[data-sort-key]:hover { color: var(--text); }
table.sortable th.sorted-asc::after { content: ' ↑'; color: var(--info); }
table.sortable th.sorted-desc::after { content: ' ↓'; color: var(--info); }

/* Stacked progress bar (padrão da indústria — PractiTest, Allure, Zephyr) */
.stacked-bar {
  display: flex; height: 18px; border-radius: 3px; overflow: hidden;
  background: var(--card); border: 1px solid var(--border); min-width: 120px;
  font-size: 0.7rem; font-weight: 700; color: #fff;
}
.stacked-bar > span { display: flex; align-items: center; justify-content: center; transition: filter 0.15s; }
.stacked-bar > span:hover { filter: brightness(1.15); }
.stacked-bar .seg-ok { background: var(--ok); }
.stacked-bar .seg-fail { background: var(--fail); }
.stacked-bar .seg-skip { background: var(--warn); }
.stacked-bar .seg-empty { color: var(--muted); font-weight: 500; }

.pct-pass { font-variant-numeric: tabular-nums; font-weight: 600; }
.pct-pass.high { color: var(--ok); }
.pct-pass.mid { color: var(--warn); }
.pct-pass.low { color: var(--fail); }

.kind-section { margin-top: 14px; }
.kind-section .header { padding: 8px 12px; background: var(--card); border-left: 3px solid var(--border); border-radius: 0 4px 4px 0; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin: 0 0 8px; }
.kind-section.kind-error .header { border-left-color: var(--fail); color: var(--fail); }
.kind-section.kind-warn .header { border-left-color: var(--warn); color: var(--warn); }
.kind-section.kind-info .header { border-left-color: var(--info); color: var(--info); }
.finding-row { padding: 10px 12px; border-bottom: 1px solid var(--border); font-size: 0.85rem; background: var(--surface); border-radius: 4px; margin-bottom: 4px; }
.finding-row .url { font-family: ui-monospace, SF Mono, Consolas, monospace; font-size: 0.76rem; color: var(--muted); margin-top: 4px; word-break: break-all; }
.a11y-rule { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 10px 12px; margin: 4px 0; }
.a11y-rule .rule-id { font-family: ui-monospace, SF Mono, Consolas, monospace; font-size: 0.82rem; color: var(--info); font-weight: 600; }
`;

const SHARED_HEAD_LINKS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0" />`;

function htmlShell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
${SHARED_HEAD_LINKS}
<style>${SHARED_CSS}</style>
</head>
<body><div class="wrap">${body}</div></body>
</html>`;
}

function statusBadge(status: string): string {
  const cls = statusClass(status);
  const icon = STATUS_ICON[status] ?? STATUS_ICON.unknown;
  const label = STATUS_PT[status] ?? status;
  return `<span class="badge ${cls}"><span class="material-symbols-outlined" style="font-size:1rem">${icon}</span>${escapeHtml(label)}</span>`;
}

/**
 * Versão ícone-only do status — usada em colunas estreitas de tabelas internas
 * (linha de step), onde o badge com texto quebraria verticalmente uma letra
 * por linha (referência: print do usuário em 2026-04-30).
 */
function statusIcon(status: string): string {
  const cls = statusClass(status);
  const icon = STATUS_ICON[status] ?? STATUS_ICON.unknown;
  const label = STATUS_PT[status] ?? status;
  return `<span class="status-icon icon-${cls}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}"><span class="material-symbols-outlined">${icon}</span></span>`;
}

function statusStrip(status: string, durationMs: number): string {
  const cls = statusClass(status);
  const icon = STATUS_ICON[status] ?? STATUS_ICON.unknown;
  const label = STATUS_PT[status] ?? status;
  return `<div class="status-strip ${cls}">
    <span class="material-symbols-outlined">${icon}</span>
    <span>${escapeHtml(label)}</span>
    <span style="margin-left:auto;font-weight:500;color:var(--text-soft);font-size:0.84rem">${(durationMs / 1000).toFixed(2)}s</span>
  </div>`;
}

function severityBadge(importance: number | undefined): string {
  if (importance === undefined) return '';
  const sev = severityFromImportance(importance);
  return `<span class="badge severity-${sev}">${SEVERITY_PT[sev]}</span>`;
}

// ─── Index ──────────────────────────────────────────────────────────────────

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
  failedTests: FlatTest[];
  xmlByName: Map<string, ParsedTestCase>;
  runId: string;
}): string {
  const t = args.testsSummary;
  const e = args.exploratorySummary;

  const dateBR = new Date(args.generatedAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  // Painel "Precisa de atenção"
  const criticalFails = args.failedTests.filter((ft) => {
    const xml = args.xmlByName.get(ft.testcase.trim());
    return xml?.importance === 3;
  });
  const attention = args.failedTests.length === 0
    ? `<div class="attention-banner empty">
        <h3><span class="material-symbols-outlined">check_circle</span>Nenhuma falha registrada</h3>
        <p class="muted" style="margin:0">Todos os ${t.total} caso(s) executado(s) foram aprovados.</p>
      </div>`
    : `<div class="attention-banner">
        <h3><span class="material-symbols-outlined">warning</span>${args.failedTests.length} caso(s) com falha precisam de atenção${criticalFails.length > 0 ? ` (${criticalFails.length} crítico${criticalFails.length === 1 ? '' : 's'})` : ''}</h3>
        <ul>
          ${args.failedTests.slice(0, 8).map((ft) => {
            const xml = args.xmlByName.get(ft.testcase.trim());
            const sev = xml ? severityBadge(xml.importance) : '';
            const failedStep = ft.failedStepIndex !== null ? ft.steps[ft.failedStepIndex] : null;
            const rawErr = failedStep?.errorMessage ?? ft.errorMessage ?? '';
            return `<li>${sev} <a href="tests.html#tc-${slugify(ft.testcase)}">${escapeHtml(ft.testcase)}</a> <span class="muted">— ${escapeHtml(playwrightHumanSummary(stripAnsi(rawErr)))}</span></li>`;
          }).join('\n')}
          ${args.failedTests.length > 8 ? `<li class="muted">…e mais ${args.failedTests.length - 8} caso(s). Veja a lista completa em <a href="tests.html">Casos de teste</a>.</li>` : ''}
        </ul>
      </div>`;

  // Stacked progress bar (padrão indústria — PractiTest/Zephyr/Allure)
  const stackedBar = (passed: number, failed: number, skipped: number): string => {
    const total = passed + failed + skipped;
    if (total === 0) return '<span class="muted">—</span>';
    const pctOk = (passed / total) * 100;
    const pctFail = (failed / total) * 100;
    const pctSkip = (skipped / total) * 100;
    const seg = (cls: string, pct: number, label: number) =>
      pct > 0 ? `<span class="${cls}" style="width:${pct.toFixed(2)}%" title="${label} ${cls === 'seg-ok' ? 'aprovado(s)' : cls === 'seg-fail' ? 'falha(s)' : 'ignorado(s)'} (${pct.toFixed(0)}%)">${pct >= 12 ? label : ''}</span>` : '';
    return `<div class="stacked-bar">${seg('seg-ok', pctOk, passed)}${seg('seg-fail', pctFail, failed)}${seg('seg-skip', pctSkip, skipped)}</div>`;
  };

  const pctPassCell = (passed: number, total: number): string => {
    if (total === 0) return '<span class="muted">—</span>';
    const pct = Math.round((passed / total) * 100);
    const cls = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
    return `<span class="pct-pass ${cls}">${pct}%</span>`;
  };

  // Tabela por testsuite (sortable + stacked bar + %pass)
  const suiteRows = [...args.byTestsuite.entries()]
    .map(([name, tests]) => {
      const ss = summarizeTests(tests);
      const exp = args.exploratoryByTestsuite.get(name);
      const expCol = exp
        ? `${exp.totals.errors > 0 ? `<span class="badge fail">${exp.totals.errors} erro${exp.totals.errors === 1 ? '' : 's'}</span> ` : ''}${exp.totals.warnings > 0 ? `<span class="badge warn">${exp.totals.warnings} aviso${exp.totals.warnings === 1 ? '' : 's'}</span>` : ''}${exp.totals.errors === 0 && exp.totals.warnings === 0 ? '<span class="muted">—</span>' : ''}`
        : '<span class="muted">—</span>';
      const pctPass = ss.total > 0 ? Math.round((ss.passed / ss.total) * 100) : 0;
      return `<tr data-fail-count="${ss.failed}" data-total="${ss.total}" data-duration="${ss.durationMs}" data-pct-pass="${pctPass}">
        <td><strong>${escapeHtml(name)}</strong></td>
        <td style="text-align:center">${ss.total}</td>
        <td>${stackedBar(ss.passed, ss.failed, ss.skipped)}</td>
        <td style="text-align:center">${pctPassCell(ss.passed, ss.total)}</td>
        <td style="text-align:center">${ss.failed > 0 ? `<span class="badge fail">${ss.failed}</span>` : '<span class="muted">0</span>'}</td>
        <td style="text-align:center">${ss.skipped > 0 ? `<span class="badge warn">${ss.skipped}</span>` : '<span class="muted">0</span>'}</td>
        <td>${expCol}</td>
        <td class="col-time">${(ss.durationMs / 1000).toFixed(1)}s</td>
      </tr>`;
    })
    .join('\n');

  // JSON data block (inspirado em session-report — permite queries client-side)
  const dataBlock = JSON.stringify({
    runId: args.runId,
    generatedAt: args.generatedAt,
    scope: args.scopeLabel,
    summary: t,
    failedTests: args.failedTests.map((ft) => ({
      testcase: ft.testcase,
      testsuite: ft.testsuite,
      status: ft.status,
      durationMs: ft.durationMs,
      summary: playwrightHumanSummary(stripAnsi(ft.errorMessage ?? '')),
    })),
    bySuite: [...args.byTestsuite.entries()].map(([name, tests]) => ({ name, ...summarizeTests(tests) })),
  });

  const allureLink = args.mode === 'regression'
    ? '<div class="section-card"><h3>Allure (regressivo, com histórico)</h3><p class="muted" style="margin:0 0 8px">Relatório executivo com trend entre execuções (publicado em GH Pages no CI).</p><p style="margin:0"><a href="../../allure-report/index.html">Abrir Allure →</a></p></div>'
    : '';

  const body = `
    <h1>Relatório de Execução — Twygo QA</h1>
    <p class="subtitle">${escapeHtml(args.projectName)} · ambiente <strong>${escapeHtml(args.environment)}</strong> · ${args.browsers.join(', ')} · ${escapeHtml(dateBR)}</p>
    <div class="scope-banner"><strong>Escopo:</strong> ${escapeHtml(args.scopeLabel)}</div>

    ${attention}

    <p class="dashboard-caption">Casos de teste roteirizados (XML)</p>
    <div class="kpi-grid">
      <div class="kpi"><div class="num">${t.total}</div><div class="lbl">Executados</div></div>
      <div class="kpi ok"><div class="num">${t.passed}</div><div class="lbl">Aprovados</div></div>
      <div class="kpi fail"><div class="num">${t.failed}</div><div class="lbl">Falhas</div></div>
      <div class="kpi warn"><div class="num">${t.skipped}</div><div class="lbl">Ignorados</div></div>
      <div class="kpi"><div class="num">${(t.durationMs / 1000).toFixed(1)}s</div><div class="lbl">Duração total</div></div>
    </div>

    ${e ? `
    <p class="dashboard-caption">Validação Exploratória (achados durante a execução)</p>
    <div class="kpi-grid">
      <div class="kpi fail"><div class="num">${e.errors}</div><div class="lbl">Erros</div></div>
      <div class="kpi warn"><div class="num">${e.warnings}</div><div class="lbl">Avisos</div></div>
      <div class="kpi info"><div class="num">${e.info}</div><div class="lbl">Informativos</div></div>
      <div class="kpi"><div class="num">${e.testsuites}</div><div class="lbl">Testsuites c/ findings</div></div>
    </div>` : ''}

    <h2>Por testsuite <span class="muted" style="font-size:0.78rem;font-weight:normal">— clique nos cabeçalhos pra ordenar; passe o mouse na barra pra ver detalhes</span></h2>
    <table class="sortable" id="suiteTable">
      <thead><tr>
        <th>Testsuite</th>
        <th style="text-align:center" data-sort-key="total" data-sort-type="num">Total</th>
        <th>Distribuição (aprovados / falhas / ignorados)</th>
        <th style="text-align:center" data-sort-key="pct-pass" data-sort-type="num">% Pass</th>
        <th style="text-align:center" data-sort-key="failed" data-sort-type="num">Falhas</th>
        <th style="text-align:center" data-sort-key="skipped" data-sort-type="num">Ignorados</th>
        <th>Findings exploratórios</th>
        <th data-sort-key="duration" data-sort-type="num">Tempo</th>
      </tr></thead>
      <tbody>${suiteRows || '<tr><td colspan="8" class="muted" style="text-align:center">Nenhum teste executado.</td></tr>'}</tbody>
    </table>
    <script>
    // Tabela ordenável (inspirado em session-report). Vanilla JS, sem libs.
    document.querySelectorAll('table.sortable').forEach((tbl) => {
      const ths = tbl.querySelectorAll('th[data-sort-key]');
      ths.forEach((th, idx) => {
        th.addEventListener('click', () => {
          const key = th.dataset.sortKey;
          const type = th.dataset.sortType || 'str';
          const tbody = tbl.querySelector('tbody');
          const rows = [...tbody.querySelectorAll('tr')];
          const dir = th.classList.contains('sorted-asc') ? 'desc' : 'asc';
          ths.forEach((o) => o.classList.remove('sorted-asc', 'sorted-desc'));
          th.classList.add('sorted-' + dir);
          // Mapa key → atributo data-* (camelCase) ou fallback texto da célula
          const datasetKey = (k) => ({
            duration: 'duration',
            failed: 'failCount',
            'pct-pass': 'pctPass',
            total: 'total',
          })[k] || k;
          const cellIdx = [...th.parentElement.children].indexOf(th);
          rows.sort((a, b) => {
            let va, vb;
            if (type === 'num') {
              const dk = datasetKey(key);
              va = a.dataset[dk] !== undefined ? Number(a.dataset[dk]) : (parseFloat(a.children[cellIdx].textContent) || 0);
              vb = b.dataset[dk] !== undefined ? Number(b.dataset[dk]) : (parseFloat(b.children[cellIdx].textContent) || 0);
            } else {
              va = a.children[idx].textContent.trim();
              vb = b.children[idx].textContent.trim();
            }
            if (va < vb) return dir === 'asc' ? -1 : 1;
            if (va > vb) return dir === 'asc' ? 1 : -1;
            return 0;
          });
          rows.forEach((r) => tbody.appendChild(r));
        });
      });
    });
    </script>

    <h2>Onde ir agora</h2>
    <div class="nav">
      <a href="tests.html"><span class="material-symbols-outlined" style="vertical-align:bottom;font-size:1.1rem">list_alt</span> Casos de teste detalhados →</a>
      <a href="exploratory.html"><span class="material-symbols-outlined" style="vertical-align:bottom;font-size:1.1rem">bug_report</span> Validação Exploratória →</a>
    </div>
    ${allureLink}

    <hr class="sep">
    <h2>Dados brutos (JSON)</h2>
    <p class="muted"><a href="summary.json">summary.json</a> · <a href="tests.json">tests.json</a> · <a href="exploratory.json">exploratory.json</a> · <a href="run_context.json">run_context.json</a></p>
    <p class="muted" style="font-size:0.78rem">Dica: o índice também inclui um bloco <code>&lt;script id="report-data" type="application/json"&gt;</code> com os dados consolidados — útil pra queries no console do navegador.</p>

    <script id="report-data" type="application/json">${dataBlock.replace(/</g, '\\u003c')}</script>
  `;
  return htmlShell(`Relatório — ${args.projectName}`, body);
}

// ─── Tests page (acordeon expansível) ───────────────────────────────────────

function renderEvidenceCards(t: FlatTest, reportDir: string): string {
  // Filtra anexos: pega screenshots, error-context, trace
  const screenshots = t.attachments.filter((a) => a.contentType === 'image/png');
  const errorCtx = t.attachments.find((a) => a.name === 'error-context');
  const trace = t.attachments.find((a) => a.contentType === 'application/zip');

  if (screenshots.length === 0 && !errorCtx && !trace) {
    return '<p class="muted" style="margin:0">Sem evidências anexadas.</p>';
  }

  // Os paths dos attachments do Playwright são absolutos. Pra funcionarem
  // dentro do report HTML (que vive em `outputs/reports/<runId>/`), calculamos
  // o caminho relativo do reportDir até o arquivo de anexo.
  const relPath = (p: string) => relative(reportDir, p).replace(/\\/g, '/');

  const cards: string[] = [];
  for (const ss of screenshots) {
    cards.push(`<div class="evidence-card">
      <a class="thumb" href="${escapeHtml(relPath(ss.path))}" target="_blank"><img src="${escapeHtml(relPath(ss.path))}" alt="screenshot da falha" loading="lazy"></a>
      <div class="meta"><span>${escapeHtml(ss.name)}</span><a href="${escapeHtml(relPath(ss.path))}" target="_blank">abrir</a></div>
    </div>`);
  }
  if (trace) {
    cards.push(`<div class="evidence-card">
      <div class="thumb no-img">Trace do Playwright<br><span class="muted" style="font-size:0.7rem">.zip — abra com <code>npx playwright show-trace</code></span></div>
      <div class="meta"><span>trace.zip</span><a href="${escapeHtml(relPath(trace.path))}" target="_blank">baixar</a></div>
    </div>`);
  }
  if (errorCtx) {
    cards.push(`<div class="evidence-card">
      <div class="thumb no-img">Contexto do erro<br><span class="muted" style="font-size:0.7rem">snapshot do DOM no momento da falha</span></div>
      <div class="meta"><span>error-context.md</span><a href="${escapeHtml(relPath(errorCtx.path))}" target="_blank">abrir</a></div>
    </div>`);
  }

  return `<div class="evidence-grid">${cards.join('\n')}</div>`;
}

/**
 * Tabela unificada de execução: combina os steps do XML com a execução
 * Allure correspondente em uma única tabela (decisão tomada após feedback
 * do usuário em 2026-04-30, ref. ao print do projeto C:\Cursor\API onde
 * existe apenas uma tabela "Passos do caso (XML/TestLink)").
 *
 * Cada XML step é mapeado pelo número ao Allure step `${n}. <action>`
 * (convenção do generator). Steps Allure que NÃO correspondem a um XML
 * step (ex.: `Pré-condição: Login...`) viram linhas no topo da tabela
 * destacadas como "PRÉ-CONDIÇÃO".
 */
function renderUnifiedStepsTable(xml: ParsedTestCase | undefined, t: FlatTest): string {
  const overallNote = t.status !== 'passed' ? failureOrSkipSummary(t) : '—';
  const isSkipped = t.status === 'skipped';

  // 1. Identificar steps Allure que NÃO casam com nenhum XML step
  const xmlNumbers = (xml?.steps ?? []).map((s, i) => s.stepNumber ?? i + 1);
  const isXmlStep = (allureTitle: string): boolean =>
    xmlNumbers.some((n) => allureTitle.startsWith(`${n}. `));
  const preconditionSteps = t.steps.filter((as) => !isXmlStep(as.title));

  // 2. Linhas de pré-condição (no topo)
  const preRows = preconditionSteps.map((as) => {
    const note = as.errorMessage
      ? playwrightHumanSummary(stripAnsi(as.errorMessage))
      : as.status === 'failed'
        ? (overallNote !== '—'
            ? `Falha sem mensagem específica do step. Causa geral do teste: ${overallNote}`
            : 'Pré-condição marcada como falha sem mensagem específica do Playwright.')
        : '—';
    const cls = as.status === 'failed' ? 'step-failed precond-row' : 'precond-row';
    return `<tr class="${cls}">
      <td class="col-num">—</td>
      <td colspan="2"><span class="precond-tag">Pré-condição</span>${escapeHtml(as.title)}</td>
      <td style="text-align:center">${statusIcon(as.status)}</td>
      <td style="font-size:0.82rem;color:var(--text-soft)">${escapeHtml(note)}</td>
      <td class="col-time">${(as.durationMs / 1000).toFixed(2)}s</td>
    </tr>`;
  }).join('\n');

  // 3. Linhas dos steps do XML (com status do Allure correspondente)
  // Identifica o último step Allure que efetivamente rodou (passou ou falhou)
  // pra marcar steps subsequentes como "não executado" quando o teste foi
  // interrompido por timeout ou falha catastrófica antes de chegar lá.
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

  const xmlRows = (xml?.steps ?? []).map((s, i) => {
    const allureMatch = t.steps.find(
      (as) => as.title.startsWith(`${i + 1}. `) || as.title.startsWith(`${s.stepNumber}. `),
    );

    // Determina status do step:
    // - allureMatch existe → usa o status do Allure (passed/failed)
    // - sem match + teste passou → step também passou (caso raro de step sem instrumentação)
    // - sem match + teste falhou + step antes do último executado → "passed" (já passou; só não foi instrumentado)
    // - sem match + teste falhou + step depois do último executado → "skipped" (não chegou aqui — interrompido)
    let stepStatus: 'passed' | 'failed' | 'skipped';
    let stepNote: string;
    if (allureMatch) {
      stepStatus = allureMatch.status;
      // Mesmo se errorMessage for vazio mas status=failed (caso raro), usa overallNote
      // ao invés de '—' para garantir que uma falha sempre tenha justificativa.
      if (allureMatch.errorMessage) {
        stepNote = playwrightHumanSummary(stripAnsi(allureMatch.errorMessage));
      } else if (allureMatch.status === 'failed') {
        stepNote = overallNote !== '—'
          ? `Falha sem mensagem específica do step. Causa geral do teste: ${overallNote}`
          : 'Step marcado como falho sem mensagem específica do Playwright.';
      } else {
        stepNote = '—';
      }
    } else if (t.status === 'passed') {
      stepStatus = 'passed';
      stepNote = '—';
    } else if (isSkipped) {
      // Teste skipado/fixme: nenhum step executou — todos compartilham o motivo do skip.
      stepStatus = 'skipped';
      stepNote = overallNote !== '—'
        ? `Step não executado — ${overallNote}`
        : 'Step não executado (caso ignorado, sem justificativa registrada).';
    } else if (i <= lastExecutedXmlIndex) {
      // Casos raros: step não capturado pelo Allure mas teste tentou continuar
      stepStatus = 'passed';
      stepNote = '—';
    } else {
      // Step depois do último executado e teste falhou → não rodou
      stepStatus = 'skipped';
      stepNote = `Step não executado: o teste foi interrompido antes de chegar aqui. Causa: ${overallNote !== '—' ? overallNote : 'falha em step anterior ou timeout do teste'}.`;
    }

    const cls = stepStatus === 'failed' ? 'step-failed' : '';
    const duration = allureMatch ? `${(allureMatch.durationMs / 1000).toFixed(2)}s` : '—';
    return `<tr class="${cls}">
      <td class="col-num">${s.stepNumber}</td>
      <td>${escapeHtml(s.actions || '(sem ação)')}</td>
      <td>${escapeHtml(s.expectedResults || '(sem esperado)')}</td>
      <td style="text-align:center">${statusIcon(stepStatus)}</td>
      <td style="font-size:0.82rem;color:var(--text-soft)">${escapeHtml(stepNote)}</td>
      <td class="col-time">${duration}</td>
    </tr>`;
  }).join('\n');

  // 4. Casos de borda
  if (!xml || xml.steps.length === 0) {
    if (preconditionSteps.length === 0) {
      return '<p class="muted" style="margin:0">Sem steps Allure ou metadata XML para este testcase.</p>';
    }
    // Só pré-condição (sem XML)
    return `<div class="inner-scroll"><table class="inner-table">
      <thead><tr>
        <th class="col-num">#</th>
        <th colspan="2">Step executado</th>
        <th class="col-status">Status</th>
        <th>Notas da execução</th>
        <th class="col-time">Duração</th>
      </tr></thead>
      <tbody>${preRows}</tbody>
    </table></div>
    <p class="muted" style="margin:6px 0 0;font-size:0.78rem">Sem metadata XML para mapear roteiro planejado.</p>`;
  }

  return `<div class="inner-scroll"><table class="inner-table">
    <thead><tr>
      <th class="col-num">#</th>
      <th>Ação do passo</th>
      <th>Resultado esperado</th>
      <th class="col-status">Status</th>
      <th>Notas da execução</th>
      <th class="col-time">Duração</th>
    </tr></thead>
    <tbody>${preRows}${xmlRows}</tbody>
  </table></div>`;
}

function renderManualPendingBlock(t: FlatTest, xml: ParsedTestCase | undefined): string {
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
  if (reproSteps.length === 0) {
    reproSteps.push('— (sem steps documentados no XML)');
  }
  const reproHtml = `<ol style="margin:0;padding-left:20px;color:var(--text-soft);font-size:0.86rem">${reproSteps.map((l) => `<li style="margin:3px 0">${escapeHtml(l)}</li>`).join('\n')}</ol>`;
  const labelStyle = 'font-size:0.74rem;font-weight:700;color:var(--warn);text-transform:uppercase;letter-spacing:0.06em;margin-top:14px;margin-bottom:4px;display:block';
  const fieldStyle = 'background:#010409;border:1px solid var(--border);border-radius:4px;padding:8px 10px;margin:4px 0 10px;font-size:0.86rem;color:var(--text-soft);white-space:pre-wrap;word-break:break-word';

  return `<h4>Pendente — execução automatizada não realizada</h4>
    <div class="bug-block" style="padding:14px 16px;border-color:var(--warn)">
      <span style="${labelStyle}">Severidade do caso (XML)</span>
      <div style="${fieldStyle}">${escapeHtml(sev)}</div>

      <span style="${labelStyle}">Motivo do skip / fixme</span>
      <div style="${fieldStyle}">${escapeHtml(reason)}</div>

      <span style="${labelStyle}">Roteiro do XML (para validação manual)</span>
      <div style="${fieldStyle.replace('white-space:pre-wrap;', '')}">${reproHtml}</div>

      <p class="muted" style="margin:10px 0 0;font-size:0.82rem">Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente para passar a rodar automaticamente.</p>
    </div>`;
}

function renderBugReportBlock(
  t: FlatTest,
  xml: ParsedTestCase | undefined,
  runId: string,
  reportDir: string,
  envEntry: EnvironmentEntry | undefined,
  envName: string,
): string {
  if (t.status === 'passed') return '';
  // Skipped/fixme não é bug — é pendência manual. Renderiza bloco diferente.
  if (t.status === 'skipped') return renderManualPendingBlock(t, xml);
  const sev = xml ? SEVERITY_PT[severityFromImportance(xml.importance)] : '—';
  const summary = failureOrSkipSummary(t);
  const failedStep = t.failedStepIndex !== null ? t.steps[t.failedStepIndex] : null;
  const stepRef = failedStep ? `${failedStep.number}. ${failedStep.title}` : '—';

  // ─── Descrição do BUG: 1ª linha = severidade + nome + resumo
  const bugDescription = `[${sev}] ${t.testcase} — ${summary}`;

  // ─── Passo a passo para reprodução: pré-condições + steps do XML
  const reproSteps: string[] = [];
  if (xml?.preconditions) {
    const lines = xml.preconditions
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    for (const l of lines) reproSteps.push(`Pré: ${l}`);
  }
  for (const s of xml?.steps ?? []) {
    reproSteps.push(`${s.stepNumber}. ${s.actions}`);
  }
  if (reproSteps.length === 0) {
    reproSteps.push('— (sem steps documentados no XML)');
  }

  // ─── Comportamento esperado vs. atual
  const expectedFromFailedStep = failedStep && xml?.steps
    ? xml.steps.find((s) => s.stepNumber === failedStep.number)?.expectedResults
    : undefined;
  const expectedBehavior = expectedFromFailedStep
    || xml?.steps.map((s) => `${s.stepNumber}. ${s.expectedResults}`).join(' | ')
    || '—';
  const actualBehavior = summary;

  // ─── Informações: URL, Login, Senha, ID do ambiente, Outros
  const failureUrl = inferFailureUrl(t, envEntry?.baseUrl);
  const ids = extractIdsFromUrl(failureUrl);
  // Fallback: se não achou orgId/envId na URL de falha, varre todas as URLs do
  // error-context (Playwright lista várias URLs intermediárias) ou do erro completo.
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

  // ─── Evidências: para cada attachment relevante, descrição + caminho relativo
  const relPath = (p: string) => relative(reportDir, p).replace(/\\/g, '/');
  type EvidenceItem = { description: string; href: string; isImage: boolean };
  const evidences: EvidenceItem[] = [];
  for (const a of t.attachments) {
    if (a.contentType === 'image/png') {
      evidences.push({
        description: `Screenshot capturado pelo Playwright no momento da falha (${a.name})`,
        href: relPath(a.path),
        isImage: true,
      });
    } else if (a.contentType === 'application/zip') {
      evidences.push({
        description: 'Trace completo do Playwright (.zip) — abrir com `npx playwright show-trace`',
        href: relPath(a.path),
        isImage: false,
      });
    } else if (a.name === 'error-context') {
      evidences.push({
        description: 'Snapshot do DOM/contexto da página no momento da falha (error-context.md)',
        href: relPath(a.path),
        isImage: false,
      });
    }
  }

  // ─── Texto agregado para botão "Copiar"
  const evidenceLines = evidences.length === 0
    ? '  (sem anexos)'
    : evidences.map((e) => `  - ${e.description}: ${e.href}`).join('\n');
  const aggregateText = `Descrição do BUG
${bugDescription}

Passo a passo para reprodução
${reproSteps.map((l) => `  ${l}`).join('\n')}

Comportamento esperado
${expectedBehavior}

Comportamento atual
${actualBehavior}

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

  // ─── Render visual estruturado por campos padrão
  const fieldStyle = 'background:#010409;border:1px solid var(--border);border-radius:4px;padding:8px 10px;margin:4px 0 10px;font-size:0.86rem;color:var(--text-soft);white-space:pre-wrap;word-break:break-word';
  const labelStyle = 'font-size:0.74rem;font-weight:700;color:var(--info);text-transform:uppercase;letter-spacing:0.06em;margin-top:14px;margin-bottom:4px;display:block';

  const reproHtml = `<ol style="margin:0;padding-left:20px;color:var(--text-soft);font-size:0.86rem">${reproSteps.map((l) => `<li style="margin:3px 0">${escapeHtml(l)}</li>`).join('\n')}</ol>`;
  const othersHtml = `<ul style="margin:0;padding-left:18px;color:var(--text-soft);font-size:0.86rem">${others.map((o) => `<li style="margin:2px 0">${escapeHtml(o)}</li>`).join('\n')}</ul>`;
  const infoTable = `<table class="inner-table" style="margin:4px 0 8px">
    <tbody>
      <tr><td style="width:14rem;color:var(--muted);font-weight:600">URL</td><td style="font-family:ui-monospace,monospace;font-size:0.8rem;word-break:break-all">${escapeHtml(failureUrl)}</td></tr>
      <tr><td style="color:var(--muted);font-weight:600">Login</td><td>${escapeHtml(envEntry?.credentials.email ?? '—')}</td></tr>
      <tr><td style="color:var(--muted);font-weight:600">Senha</td><td>${escapeHtml(envEntry?.credentials.password ?? '—')}</td></tr>
      <tr><td style="color:var(--muted);font-weight:600">ID do ambiente (orgId)</td><td>${escapeHtml(ids.orgId ?? '—')}</td></tr>
      <tr><td style="color:var(--muted);font-weight:600;vertical-align:top">Outros</td><td>${othersHtml}</td></tr>
    </tbody>
  </table>`;

  const evidenceHtml = evidences.length === 0
    ? '<p class="muted" style="margin:4px 0 8px">Sem anexos coletados pelo Playwright.</p>'
    : evidences.map((e) => `<div style="display:flex;gap:10px;align-items:flex-start;padding:6px 0;border-bottom:1px dashed var(--border)">
        <div style="flex:1">
          <div style="font-size:0.86rem;color:var(--text-soft)">${escapeHtml(e.description)}</div>
          <div style="margin-top:4px;font-size:0.78rem"><a href="${escapeHtml(e.href)}" target="_blank">${escapeHtml(e.href)}</a></div>
        </div>
        ${e.isImage ? `<a href="${escapeHtml(e.href)}" target="_blank" style="flex-shrink:0"><img src="${escapeHtml(e.href)}" alt="evidência" style="max-width:160px;max-height:90px;border-radius:4px;border:1px solid var(--border);object-fit:contain"></a>` : ''}
      </div>`).join('\n');

  const id = `bug-${slugify(t.testcase)}`;
  const aggregateId = `${id}-text`;
  return `<h4>Pronto para registro de bug</h4>
    <div class="bug-block" style="padding:14px 16px">
      <span style="${labelStyle}">Descrição do BUG</span>
      <div style="${fieldStyle}">${escapeHtml(bugDescription)}</div>

      <span style="${labelStyle}">Passo a passo para reprodução</span>
      <div style="${fieldStyle.replace('white-space:pre-wrap;', '')}">${reproHtml}</div>

      <span style="${labelStyle}">Comportamento esperado</span>
      <div style="${fieldStyle}">${escapeHtml(expectedBehavior)}</div>

      <span style="${labelStyle}">Comportamento atual</span>
      <div style="${fieldStyle}">${escapeHtml(actualBehavior)}</div>

      <span style="${labelStyle}">Informações</span>
      ${infoTable}

      <span style="${labelStyle}">Evidências</span>
      <div style="background:#010409;border:1px solid var(--border);border-radius:4px;padding:8px 12px;margin:4px 0 10px">${evidenceHtml}</div>

      <details style="margin-top:14px">
        <summary>Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>
        <textarea id="${aggregateId}" readonly style="width:100%;height:18rem;background:#010409;color:var(--text-soft);border:1px solid var(--border);resize:vertical;font-family:ui-monospace,SF Mono,Consolas,monospace;font-size:0.78rem;padding:10px;margin-top:8px;border-radius:4px">${escapeHtml(aggregateText)}</textarea>
        <div class="btn-row">
          <button type="button" onclick="copyBug('${aggregateId}', this)">Copiar texto agregado</button>
          <span class="muted" style="margin-left:6px">Cola direto na descrição do ticket.</span>
        </div>
      </details>
    </div>`;
}

function renderTestcaseDetailPanel(
  t: FlatTest,
  xml: ParsedTestCase | undefined,
  runId: string,
  reportDir: string,
  envEntry: EnvironmentEntry | undefined,
  envName: string,
): string {
  const failedStep = t.failedStepIndex !== null ? t.steps[t.failedStepIndex] : null;
  const summary = t.status !== 'passed' ? failureOrSkipSummary(t) : null;

  const failureBlockLabel = t.status === 'skipped'
    ? 'Por que foi ignorado'
    : 'Por que falhou';
  const failureBlock = summary
    ? `<div class="failure-summary">
        <div class="label">${failureBlockLabel}</div>
        <div class="text">${escapeHtml(summary)}</div>
        ${failedStep ? `<div class="step-ref">Step impactado: <strong>${escapeHtml(failedStep.title)}</strong></div>` : ''}
      </div>`
    : '';

  const summaryBlock = xml?.summary
    ? `<h4>Sumário (objetivo do caso)</h4><p style="margin:0;color:var(--text-soft)">${escapeHtml(xml.summary)}</p>`
    : '';

  const preconditionsBlock = xml?.preconditions
    ? `<h4>Pré-condições</h4><div class="preconditions">${escapeHtml(xml.preconditions)}</div>`
    : '';

  return `<div class="tc-detail-panel">
    ${statusStrip(t.status, t.durationMs)}
    ${failureBlock}
    ${summaryBlock}
    ${preconditionsBlock}

    <h4>Passos do caso (XML/TestLink + execução Playwright)</h4>
    <p class="muted" style="margin:0 0 6px;font-size:0.82rem">Cada linha reproduz um passo do XML; a coluna <strong>Status</strong> traz o resultado da execução automatizada (do step Allure correspondente). Linhas em azul claro são <strong>pré-condições</strong> da execução (login, navegação inicial) que não fazem parte do roteiro do XML mas são necessárias pra rodar o teste.</p>
    ${renderUnifiedStepsTable(xml, t)}

    <h4>Evidências</h4>
    ${renderEvidenceCards(t, reportDir)}

    ${renderBugReportBlock(t, xml, runId, reportDir, envEntry, envName)}

    ${t.errorMessage && t.status !== 'skipped' ? `<details><summary>Stack trace técnica completa (para desenvolvedor)</summary>
      <pre>${escapeHtml(truncate(stripAnsi(t.errorMessage), 12000))}</pre>
    </details>` : ''}
  </div>`;
}

function renderTests(args: {
  byTestsuite: Map<string, FlatTest[]>;
  projectName: string;
  xmlByName: Map<string, ParsedTestCase>;
  runId: string;
  reportDir: string;
  envEntry: EnvironmentEntry | undefined;
  envName: string;
}): string {
  const blocks = [...args.byTestsuite.entries()]
    .map(([suiteName, tests]) => {
      const rows = tests
        .map((t, idx) => {
          const xml = args.xmlByName.get(t.testcase.trim());
          const importance = xml?.importance;
          const sev = importance !== undefined ? severityBadge(importance) : '';
          const detailId = `tc-${slugify(t.testcase)}`;
          const summaryHint = t.status !== 'passed'
            ? `<div style="font-size:0.82rem;color:var(--muted);margin-top:4px">${escapeHtml(failureOrSkipSummary(t))}</div>`
            : '';
          return `<tr class="tc-summary-row" data-idx="${idx}-${slugify(suiteName)}" data-status="${t.status}" data-importance="${importance ?? ''}" id="${detailId}">
            <td><strong>${escapeHtml(t.testcase)}</strong> ${sev}${summaryHint}<div class="muted" style="font-size:0.74rem;margin-top:3px">${escapeHtml(t.fileLabel)}</div></td>
            <td class="col-status">${statusBadge(t.status)}</td>
            <td class="col-time">${(t.durationMs / 1000).toFixed(2)}s</td>
            <td class="col-actions"><button type="button" class="tc-toggle" data-idx="${idx}-${slugify(suiteName)}" aria-expanded="false">Expandir detalhes</button></td>
          </tr>
          <tr class="tc-detail-row" data-idx="${idx}-${slugify(suiteName)}">
            <td colspan="4">${renderTestcaseDetailPanel(t, xml, args.runId, args.reportDir, args.envEntry, args.envName)}</td>
          </tr>`;
        })
        .join('\n');
      const ss = summarizeTests(tests);
      const sumLine = `<span class="muted">${tests.length} caso(s) — ${ss.passed} aprovado(s), ${ss.failed} falha(s)${ss.skipped ? `, ${ss.skipped} ignorado(s)` : ''}</span>`;
      return `<h3 style="margin-top:24px">${escapeHtml(suiteName)}</h3>
        <p style="margin:0 0 8px">${sumLine}</p>
        <table>
          <thead><tr>
            <th>Caso</th>
            <th class="col-status">Status</th>
            <th class="col-time">Duração</th>
            <th class="col-actions">Ações</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>`;
    })
    .join('\n');

  const filterBar = `<div class="btn-row">
    <button type="button" onclick="expandAllTests()">Expandir todos os detalhes</button>
    <button type="button" onclick="collapseAllTests()">Retrair todos os detalhes</button>
    <label for="statusFilter">Filtrar por status:</label>
    <select id="statusFilter" onchange="filterByStatus()">
      <option value="">Todos os status</option>
      <option value="passed">Só aprovados</option>
      <option value="failed">Só falhas</option>
      <option value="timedOut">Só tempo esgotado</option>
      <option value="skipped">Só ignorados</option>
    </select>
    <label for="severityFilter">Severidade:</label>
    <select id="severityFilter" onchange="filterByStatus()">
      <option value="">Todas</option>
      <option value="3">Críticos</option>
      <option value="2">Normais</option>
      <option value="1">Menores</option>
    </select>
  </div>`;

  const js = `<script>
function syncDetail(det) { if (!det) return; det.style.display = det.classList.contains('is-expanded') ? 'table-row' : 'none'; }
function toggleDetail(idx) {
  const det = document.querySelector('tr.tc-detail-row[data-idx="' + idx + '"]');
  const sum = document.querySelector('tr.tc-summary-row[data-idx="' + idx + '"]');
  const btn = document.querySelector('button.tc-toggle[data-idx="' + idx + '"]');
  if (!det || !btn) return;
  const open = !det.classList.contains('is-expanded');
  det.classList.toggle('is-expanded', open);
  sum?.classList.toggle('is-expanded', open);
  syncDetail(det);
  btn.textContent = open ? 'Retrair detalhes' : 'Expandir detalhes';
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('button.tc-toggle');
  if (btn) { ev.stopPropagation(); toggleDetail(btn.dataset.idx); return; }
  const row = ev.target.closest('tr.tc-summary-row');
  if (row && !ev.target.closest('a, button')) toggleDetail(row.dataset.idx);
});
function expandAllTests() {
  document.querySelectorAll('tr.tc-summary-row').forEach((row) => {
    if (row.style.display === 'none') return;
    const idx = row.dataset.idx;
    const det = document.querySelector('tr.tc-detail-row[data-idx="' + idx + '"]');
    const btn = document.querySelector('button.tc-toggle[data-idx="' + idx + '"]');
    if (det) { det.classList.add('is-expanded'); syncDetail(det); }
    row.classList.add('is-expanded');
    if (btn) { btn.textContent = 'Retrair detalhes'; btn.setAttribute('aria-expanded', 'true'); }
  });
}
function collapseAllTests() {
  document.querySelectorAll('tr.tc-detail-row').forEach((det) => { det.classList.remove('is-expanded'); syncDetail(det); });
  document.querySelectorAll('tr.tc-summary-row').forEach((row) => row.classList.remove('is-expanded'));
  document.querySelectorAll('button.tc-toggle').forEach((btn) => { btn.textContent = 'Expandir detalhes'; btn.setAttribute('aria-expanded', 'false'); });
}
function filterByStatus() {
  const st = document.getElementById('statusFilter').value;
  const sv = document.getElementById('severityFilter').value;
  document.querySelectorAll('tr.tc-summary-row').forEach((row) => {
    const matchSt = !st || row.dataset.status === st;
    const matchSv = !sv || row.dataset.importance === sv;
    const show = matchSt && matchSv;
    row.style.display = show ? '' : 'none';
    const idx = row.dataset.idx;
    const det = document.querySelector('tr.tc-detail-row[data-idx="' + idx + '"]');
    if (det) {
      if (!show) { det.classList.remove('is-expanded'); det.style.display = 'none'; }
      else syncDetail(det);
    }
  });
}
function copyBug(id, btn) {
  const ta = document.getElementById(id);
  if (!ta) return;
  ta.select(); ta.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(ta.value).then(() => {
    const original = btn.textContent;
    btn.textContent = '✓ Copiado';
    setTimeout(() => { btn.textContent = original; }, 1800);
  });
}
// Auto-expand if URL hash points to a testcase
window.addEventListener('load', () => {
  if (location.hash) {
    const row = document.querySelector(location.hash);
    if (row) toggleDetail(row.dataset.idx);
  }
});
</script>`;

  const body = `
    <h1>Casos de teste — ${escapeHtml(args.projectName)}</h1>
    <p class="subtitle"><a href="index.html">← Voltar ao dashboard</a></p>
    <p class="lede">Lista detalhada por testsuite. Clique em uma linha (ou em "Expandir detalhes") para ver: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots / trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.</p>

    ${filterBar}

    ${blocks || '<p class="muted">Nenhum testcase executado.</p>'}

    ${js}
  `;
  return htmlShell(`Casos de teste — ${args.projectName}`, body);
}

// ─── Exploratory ────────────────────────────────────────────────────────────

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

function renderConsoleSection(findings: ExploratoryFinding[]): string {
  if (findings.length === 0) return '';
  // Agrega por mensagem para reduzir ruído (ex.: erro repetido em todas as páginas)
  const aggregated = new Map<string, { kind: string; severity: string; message: string; urls: Set<string>; count: number }>();
  for (const f of findings) {
    const key = `${f.kind}|${f.message.slice(0, 200)}`;
    const ex = aggregated.get(key);
    if (ex) { ex.count++; ex.urls.add(f.url); }
    else aggregated.set(key, { kind: f.kind, severity: f.severity, message: f.message, urls: new Set([f.url]), count: 1 });
  }
  const items = [...aggregated.values()]
    .sort((a, b) => b.count - a.count)
    .map((g) => `<div class="finding-row">
      <span class="badge fail">${escapeHtml(kindPt(g.kind))}</span>
      <span style="margin-left:6px;color:var(--muted);font-size:0.78rem">${g.count} ocorrência(s) em ${g.urls.size} URL(s)</span>
      <div style="margin-top:6px">${escapeHtml(truncate(g.message, 400))}</div>
      ${g.urls.size === 1 ? `<div class="url">${escapeHtml([...g.urls][0])}</div>` : ''}
    </div>`)
    .join('\n');
  return `<div class="kind-section kind-error">
    <h4 class="header">Erros JavaScript no navegador (${findings.length} ocorrência(s) · ${aggregated.size} mensagens distintas)</h4>
    ${items}
  </div>`;
}

function renderHttpSection(findings: ExploratoryFinding[]): string {
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
  const sortedRows = [...aggregated.values()]
    .sort((a, b) => b.count - a.count)
    .map((r) => `<tr>
      <td><span class="badge ${r.severity === 'error' ? 'fail' : 'warn'}">${r.status}</span></td>
      <td>${escapeHtml(r.method)}</td>
      <td style="font-family:ui-monospace,monospace;font-size:0.78rem;word-break:break-all">${escapeHtml(r.url)}</td>
      <td style="text-align:center">${r.count}</td>
    </tr>`)
    .join('\n');
  const sevCls = findings.some((f) => f.severity === 'error') ? 'kind-error' : 'kind-warn';
  return `<div class="kind-section ${sevCls}">
    <h4 class="header">Respostas HTTP de falha (${findings.length} no total · ${aggregated.size} únicas)</h4>
    <table class="inner-table" style="border-radius:6px;border:1px solid var(--border);background:var(--surface)">
      <thead><tr><th>Status</th><th>Método</th><th>URL</th><th style="text-align:center">Ocorrências</th></tr></thead>
      <tbody>${sortedRows}</tbody>
    </table>
  </div>`;
}

function renderA11ySection(findings: ExploratoryFinding[]): string {
  if (findings.length === 0) return '';
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
      const sevCls = first.severity === 'error' ? 'fail' : 'warn';
      return `<div class="a11y-rule">
        <div><span class="rule-id">${escapeHtml(ruleId)}</span> <span class="badge ${sevCls}">${escapeHtml(impact)}</span> <span class="muted" style="margin-left:6px">${items.length} ocorrência(s) em ${urls.length} URL(s)</span></div>
        <div class="muted" style="margin:4px 0;font-size:0.82rem">${escapeHtml(first.message)}${tags.length > 0 ? ` · WCAG: ${escapeHtml(tags.join(', '))}` : ''}</div>
        ${helpUrl ? `<div style="font-size:0.78rem;margin:4px 0"><a href="${escapeHtml(helpUrl)}" target="_blank">Como corrigir →</a></div>` : ''}
        ${sampleTarget ? `<div class="muted" style="font-size:0.78rem">Seletor: <code style="font-family:ui-monospace,monospace">${escapeHtml(sampleTarget)}</code></div>` : ''}
        ${sampleHtml ? `<pre style="font-size:0.72rem;max-height:6rem">${escapeHtml(sampleHtml)}</pre>` : ''}
      </div>`;
    })
    .join('\n');
  const sevCls = findings.some((f) => f.severity === 'error') ? 'kind-error' : 'kind-warn';
  return `<div class="kind-section ${sevCls}">
    <h4 class="header">Acessibilidade — axe-core (${findings.length} no total · ${byRule.size} regra(s) única(s))</h4>
    ${rules}
  </div>`;
}

function renderBrokenImagesSection(findings: ExploratoryFinding[]): string {
  if (findings.length === 0) return '';
  const items = findings.map((f) => {
    const src = (f.detail?.['src'] as string) ?? f.message;
    const alt = (f.detail?.['alt'] as string) ?? '';
    return `<div class="finding-row">
      <span class="badge warn">${escapeHtml(kindPt('broken_image'))}</span>
      <span style="font-family:ui-monospace,monospace;font-size:0.78rem;margin-left:6px;word-break:break-all">${escapeHtml(src)}</span>
      ${alt ? `<span class="muted" style="margin-left:6px"> — alt: "${escapeHtml(alt)}"</span>` : ''}
      <div class="url">página: ${escapeHtml(f.url)}</div>
    </div>`;
  }).join('\n');
  return `<div class="kind-section kind-warn">
    <h4 class="header">Imagens quebradas (${findings.length})</h4>
    ${items}
  </div>`;
}

function renderCoverageSection(coverage: ExploratoryCoverage[]): string {
  if (coverage.length === 0) return '';
  const items = coverage.map((c) => {
    const pct = c.totalInteractive > 0 ? Math.min(100, Math.round((c.visibleInteractive / c.totalInteractive) * 100)) : 0;
    const samples = c.samples.slice(0, 8).map((u) => `${escapeHtml(u.role)}${u.name ? ': ' + escapeHtml(u.name) : ''}`).join(' · ');
    return `<div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="font-family:ui-monospace,monospace;font-size:0.78rem;color:var(--text-soft);word-break:break-all">${escapeHtml(c.url)}</div>
      <div style="height:6px;background:var(--card);border-radius:3px;margin:4px 0 6px;overflow:hidden"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--ok),var(--info));border-radius:3px"></div></div>
      <div class="muted" style="font-size:0.76rem">${c.visibleInteractive}/${c.totalInteractive} elementos interativos visíveis (${pct}%) · amostra: ${samples || '(vazio)'}</div>
    </div>`;
  }).join('\n');
  return `<div class="kind-section kind-info">
    <h4 class="header">Cobertura observada por URL (${coverage.length})</h4>
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:10px 14px">${items}</div>
  </div>`;
}

function renderOutOfScopeSection(bucket: ExploratoryScopedBucket | undefined): string {
  if (!bucket) return '';
  const total = bucket.totals.errors + bucket.totals.warnings + bucket.totals.info;
  if (total === 0) return '';
  const partitioned = partitionFindings(bucket.findings);
  const inner = [
    renderConsoleSection(partitioned.consoleAndPage),
    renderHttpSection(partitioned.http),
    renderA11ySection(partitioned.a11y),
    renderBrokenImagesSection(partitioned.brokenImages),
  ].filter(Boolean).join('\n');
  return `<details style="margin-top:14px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:10px 14px">
    <summary style="cursor:pointer;color:var(--muted);font-size:0.88rem">
      <strong style="color:var(--text-soft)">Fora do escopo "Créditos de IA"</strong>
      <span style="margin-left:8px">${bucket.totals.errors > 0 ? `<span class="badge fail">${bucket.totals.errors} erro(s)</span>` : ''}${bucket.totals.warnings > 0 ? `<span class="badge warn" style="margin-left:6px">${bucket.totals.warnings} aviso(s)</span>` : ''}${bucket.totals.info > 0 ? `<span class="badge info" style="margin-left:6px">${bucket.totals.info} info</span>` : ''}</span>
      <span class="muted" style="margin-left:6px">(silenciado dos KPIs principais — telemetria, módulos não relacionados etc.)</span>
    </summary>
    <div style="padding:10px 0">${inner || '<p class="muted">Sem detalhes.</p>'}</div>
  </details>`;
}

function renderActiveProbesSection(ap: ExploratoryActiveProbes | undefined): string {
  if (!ap) return '';
  const probeKeys = Object.keys(ap.byProbe);
  if (probeKeys.length === 0 && ap.findings.length === 0) return '';

  const probeRows = probeKeys
    .map((key) => {
      const stats = ap.byProbe[key];
      const findingCount = ap.findings.filter((f) => f.probe === key).length;
      const sevCls = findingCount === 0 ? 'ok' : ap.findings.some((f) => f.probe === key && f.severity === 'error') ? 'fail' : 'warn';
      return `<tr>
        <td><strong>${escapeHtml(PROBE_PT[key] ?? key)}</strong></td>
        <td style="text-align:center">${stats.ran}</td>
        <td style="text-align:center">${stats.failed > 0 ? `<span class="badge fail">${stats.failed}</span>` : '<span class="muted">0</span>'}</td>
        <td style="text-align:center">${findingCount > 0 ? `<span class="badge ${sevCls}">${findingCount}</span>` : '<span class="muted">0</span>'}</td>
        <td class="col-time">${(stats.totalDurationMs / 1000).toFixed(2)}s</td>
      </tr>`;
    })
    .join('\n');

  const findingsItems = ap.findings.length === 0
    ? '<p class="muted">Probes ativos rodaram sem encontrar problemas.</p>'
    : ap.findings.map((f) => {
        const sevCls = f.severity === 'error' ? 'fail' : f.severity === 'warn' ? 'warn' : 'info';
        return `<div class="finding-row">
          <span class="badge ${sevCls}">${escapeHtml(PROBE_PT[f.probe] ?? f.probe)}</span>
          <span class="muted" style="margin-left:6px;font-size:0.78rem">teste: ${escapeHtml(f.test)}</span>
          <div style="margin-top:6px">${escapeHtml(truncate(f.message, 400))}</div>
          <div class="url">${escapeHtml(f.url)}</div>
        </div>`;
      }).join('\n');

  return `<div class="kind-section kind-info" style="margin-top:18px">
    <h4 class="header">Probes ativos — descobertas adicionais (${ap.findings.length} finding(s))</h4>
    <table class="inner-table" style="margin-bottom:10px">
      <thead><tr><th>Probe</th><th style="text-align:center">Execuções OK</th><th style="text-align:center">Falhas internas</th><th style="text-align:center">Findings</th><th>Tempo total</th></tr></thead>
      <tbody>${probeRows}</tbody>
    </table>
    ${findingsItems}
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
      const totalsBar = `<div style="padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);margin:8px 0">
        ${s.totals.errors > 0 ? `<span class="badge fail">${s.totals.errors} erro(s)</span>` : ''}
        ${s.totals.warnings > 0 ? `<span class="badge warn" style="margin-left:6px">${s.totals.warnings} aviso(s)</span>` : ''}
        ${s.totals.info > 0 ? `<span class="badge info" style="margin-left:6px">${s.totals.info} info</span>` : ''}
        ${s.totals.errors === 0 && s.totals.warnings === 0 && s.totals.info === 0 ? '<span class="muted">Sem findings in-scope nesta testsuite.</span>' : ''}
      </div>`;
      return `<h3 style="margin-top:24px">${escapeHtml(s.testsuiteName)}</h3>
        ${totalsBar}
        ${sections}
        ${renderOutOfScopeSection(s.outOfScope)}
        ${renderActiveProbesSection(s.activeProbes)}`;
    })
    .join('\n');
  const body = `
    <h1>Validação Exploratória — ${escapeHtml(args.projectName)}</h1>
    <p class="subtitle"><a href="index.html">← Voltar ao dashboard</a></p>
    <p class="lede">Achados capturados pelas probes da fixture exploratória durante a execução dos testes: erros de JavaScript no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL. Os KPIs principais consideram apenas findings <strong>dentro do escopo "Créditos de IA"</strong> (rotas <code>ai_consumption_analysis</code> ou mensagens com palavras-chave do domínio). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite. A seção <strong>"Probes ativos"</strong> reúne descobertas além do que os casos do XML cobrem (hover em tooltips, navegação por teclado, valores extremos em forms, varredura de clicáveis, axe deep e estabilidade visual).</p>
    ${blocks || '<p class="muted">Nenhum finding exploratório registrado.</p>'}
  `;
  return htmlShell(`Exploratório — ${args.projectName}`, body);
}

// ─── Allure helpers (regression mode) ───────────────────────────────────────

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

  const cfg = loadJson<ProjectConfig>(resolve(process.cwd(), FILES.projectConfig));
  if (!cfg) throw new Error(`Config ausente: ${FILES.projectConfig}`);

  // Carrega environment.json pro bloco "Pronto para registro de bug" — extrai
  // URL/Login/Senha/orgId pra encaixar nos campos padrão do template de bug.
  const envMap = loadJson<EnvironmentMap>(resolve(process.cwd(), FILES.environment));
  const envEntry = envMap?.[cfg.environment];
  if (!envEntry) {
    log.warn(`Environment "${cfg.environment}" ausente em environment.json — campos URL/Login/Senha do bug-block ficarão como "—".`);
  }

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
  const reportsRoot = resolve(process.cwd(), PATHS.outputs, 'reports');
  const reportDir = join(reportsRoot, folderName);
  ensureDir(reportDir);

  const byTestsuite = groupByTestsuite(tests);
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
      failedTests,
      xmlByName,
      runId: folderName,
    }),
  );
  writeFileSync(
    join(reportDir, 'tests.html'),
    renderTests({
      byTestsuite,
      projectName: cfg.projectName,
      xmlByName,
      runId: folderName,
      reportDir,
      envEntry,
      envName: cfg.environment,
    }),
  );
  writeFileSync(
    join(reportDir, 'exploratory.html'),
    renderExploratory({ exploratoryByTestsuite, projectName: cfg.projectName }),
  );
  writeFileSync(
    join(reportDir, 'run_context.json'),
    JSON.stringify({ runId: folderName, mode: args.mode, suiteFilter: args.suite ?? null, projectName: cfg.projectName, environment: cfg.environment, browsers: cfg.browsers, generatedAt }, null, 2),
  );
  writeFileSync(
    join(reportDir, 'summary.json'),
    JSON.stringify({ runId: folderName, scope: scopeLabel, tests: testsSummary, exploratory: exploratorySummary }, null, 2),
  );
  if (existsSync(resolve(process.cwd(), FILES.testResults))) {
    copyFileSync(resolve(process.cwd(), FILES.testResults), join(reportDir, 'tests.json'));
  }
  if (existsSync(resolve(process.cwd(), FILES.exploratoryFindings))) {
    copyFileSync(resolve(process.cwd(), FILES.exploratoryFindings), join(reportDir, 'exploratory.json'));
  }

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
