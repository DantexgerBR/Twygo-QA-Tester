import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { parseArgs } from 'node:util';
import { createLogger } from '../../../src/utils/logger.js';
import {
  getOutputPath,
  getProjectOutputRoot,
  loadProjectConfig,
  getBaseUrl,
} from '../../../src/utils/environment.js';

const log = createLogger('triage-report');

type Mode = 'per-suite' | 'all-suites' | 'regression';

type Args = {
  mode: Mode;
  suite?: string;
  keepHistory: boolean;
};

type PlaywrightStep = {
  title: string;
  duration?: number;
  error?: { message?: string };
  steps?: PlaywrightStep[];
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
  error?: { message?: string };
  steps?: PlaywrightStep[];
  attachments?: PlaywrightAttachment[];
  errorLocation?: { file?: string; line?: number };
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

type FlatStep = {
  number: number;
  title: string;
  status: 'passed' | 'failed';
  errorMessage?: string;
};

type FlatTest = {
  testsuite: string;
  testcase: string;
  filePath: string;
  status: PlaywrightTestResult['status'];
  durationMs: number;
  errorMessage?: string;
  errorLocation?: string;
  skipReason?: string;
  skipKind?: 'fixme' | 'skip' | 'manual' | 'other';
  attachments: Array<{ name: string; path: string; contentType: string }>;
  steps: FlatStep[];
  lastObservedUrl?: string;
  lastObservedUrlOrigin?: 'snapshot' | 'errmsg' | 'sidebar-fallback';
  urlMismatchWithSpec?: boolean;
};

type ExploratoryFinding = {
  kind: string;
  severity: 'error' | 'warn' | 'info';
  url: string;
  message: string;
};

type ExploratorySuite = {
  testsuiteName: string;
  totals: { errors: number; warnings: number; info: number };
  findings: ExploratoryFinding[];
};

type ExploratoryReport = {
  generatedAt: string;
  summary: { errors: number; warnings: number; info: number };
  testsuites: ExploratorySuite[];
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseFlags(): Args {
  const { values } = parseArgs({
    options: {
      suite: { type: 'string' },
      regression: { type: 'boolean', default: false },
      'keep-history': { type: 'boolean', default: false },
    },
    allowPositionals: true,
    strict: false,
  });
  return {
    mode: values.regression ? 'regression' : values.suite ? 'per-suite' : 'all-suites',
    suite: values.suite ? String(values.suite) : undefined,
    keepHistory: Boolean(values['keep-history']),
  };
}

function loadJson<T>(path: string): T | null {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8')) as T;
}

function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function nowHuman(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function truncate(s: string, max = 600): string {
  const cleaned = stripAnsi(s).split('\n').slice(0, 8).join('\n');
  if (cleaned.length <= max) return cleaned;
  return cleaned.slice(0, max) + ' …';
}

function relFromReport(reportPath: string, target: string): string {
  if (!target) return '';
  return relative(dirname(reportPath), target);
}

type UrlExtractResult = { url: string; origin: 'snapshot' | 'errmsg' | 'sidebar-fallback' };

function extractUrlFromErrorContext(path: string, baseUrl?: string): UrlExtractResult | undefined {
  if (!existsSync(path)) return undefined;
  try {
    const md = readFileSync(path, 'utf-8');
    // 1) URL do RootWebArea (a11y snapshot) — formato `url="https://..."` — REAL onde teste parou
    const urlInYaml = md.match(/url[:=]\s*"?(https?:\/\/[^\s"]+)"?/i)?.[1];
    if (urlInYaml) return { url: cleanUrl(urlInYaml), origin: 'snapshot' };
    // 2) "navigating to ..." do erro message embutido — URL que estava tentando navegar
    const navTo = md.match(/navigating to "(https?:\/\/[^"]+)"/i)?.[1];
    if (navTo) return { url: cleanUrl(navTo), origin: 'errmsg' };
    // 3) Primeira URL absoluta no texto
    const any = md.match(/(https?:\/\/[^\s)"']+)/)?.[1];
    if (any) return { url: cleanUrl(any), origin: 'snapshot' };
    // 4) FALLBACK FRACO: compor baseUrl + primeiro path `/o/...` observado.
    //    Esse path geralmente vem de algum link da sidebar (Dashboard, Aprendizagem, etc),
    //    NÃO da URL real do teste. Marcamos `sidebar-fallback` pra avisar QA.
    if (baseUrl) {
      const path1 = md.match(/\/url:\s*(\/o\/\d+\/[^\s)"']*)/)?.[1];
      if (path1) return { url: cleanUrl(joinUrl(baseUrl, path1)), origin: 'sidebar-fallback' };
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function joinUrl(base: string, path: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

function extractUrlFromErrorMessage(msg: string | undefined): UrlExtractResult | undefined {
  if (!msg) return undefined;
  // "page.goto: ... at https://..." OU "navigating to https://..."
  const at = msg.match(/at (https?:\/\/[^\s)"']+)/)?.[1];
  if (at) return { url: cleanUrl(at), origin: 'errmsg' };
  const navTo = msg.match(/navigating to "?(https?:\/\/[^\s"]+)"?/i)?.[1];
  if (navTo) return { url: cleanUrl(navTo), origin: 'errmsg' };
  const any = msg.match(/(https?:\/\/[^\s)"']+)/)?.[1];
  return any ? { url: cleanUrl(any), origin: 'errmsg' } : undefined;
}

/**
 * Sense check: URL bate com o que o nome do testsuite/testcase descreve?
 * Ex.: spec "Listagem de painéis" → URL deveria conter `panels` ou `use_modes`.
 * Se URL é `/dashboard` mas suite menciona painel, é incoerente — bandeira
 * "spec pode estar configurado na rota errada".
 *
 * Heurística simples: lista mapeamentos keyword-do-nome → path-esperado-no-url.
 * Falta de match positivo NÃO afirma incoerência (silêncio). Match negativo
 * (keyword presente, path errado) afirma incoerência.
 */
function isUrlMismatchedWithSpec(url: string, testsuite: string, testcase: string): boolean {
  const hay = `${testsuite} ${testcase}`.toLowerCase();
  const urlLow = url.toLowerCase();
  const mapping: Array<{ keywords: string[]; pathHints: string[] }> = [
    { keywords: ['painel', 'paineis', 'painéis', 'listagem de pain'], pathHints: ['panels', 'use_modes'] },
    { keywords: ['modo de uso', 'modos de uso'], pathHints: ['use_modes'] },
    { keywords: ['ambiente', 'ambientes'], pathHints: ['environments', 'edit'] },
    { keywords: ['indexação', 'indexacao'], pathHints: ['ai_consumption_analysis', 'environments'] },
    { keywords: ['conteúdo', 'conteudo'], pathHints: ['events'] },
    { keywords: ['certificado'], pathHints: ['certificate_models'] },
    { keywords: ['integração', 'integracao'], pathHints: ['integrations'] },
  ];
  for (const { keywords, pathHints } of mapping) {
    if (keywords.some((k) => hay.includes(k))) {
      const hasHint = pathHints.some((p) => urlLow.includes(p));
      return !hasHint;
    }
  }
  return false;
}

function cleanUrl(url: string): string {
  return url.replace(/[)'",;.]+$/, '');
}

// ─── Flatten Playwright report ──────────────────────────────────────────────

function flatten(suites: PlaywrightSuite[], baseUrl?: string): FlatTest[] {
  const out: FlatTest[] = [];

  function walk(suite: PlaywrightSuite, ancestors: string[]): void {
    const isFileNode =
      suite.file !== undefined && suite.title === suite.file.replace(/\//g, '\\');
    const nextAncestors = isFileNode ? ancestors : [...ancestors, suite.title];

    for (const spec of suite.specs ?? []) {
      const testsuite = nextAncestors[nextAncestors.length - 1] ?? spec.title;
      for (const test of spec.tests) {
        const last = test.results[test.results.length - 1];
        const steps: FlatStep[] = (last?.steps ?? []).map((s, i) => ({
          number: i + 1,
          title: s.title || '(sem título)',
          status: (s.error ? 'failed' : 'passed') as 'passed' | 'failed',
          errorMessage: s.error?.message,
        }));
        const allAnn: PlaywrightAnnotation[] = [
          ...((test.annotations as PlaywrightAnnotation[] | undefined) ?? []),
          ...((last?.annotations as PlaywrightAnnotation[] | undefined) ?? []),
        ];
        const skipAnn = allAnn.find((a) => a.type === 'fixme' || a.type === 'skip');
        const attachments = (last?.attachments ?? [])
          .filter((a): a is Required<PlaywrightAttachment> => typeof a.path === 'string')
          .map((a) => ({ name: a.name, path: a.path, contentType: a.contentType }));
        const errCtx = attachments.find((a) => a.name === 'error-context');
        const urlFromCtx = errCtx ? extractUrlFromErrorContext(errCtx.path, baseUrl) : undefined;
        const urlFromMsg = extractUrlFromErrorMessage(last?.error?.message);
        // Preferência: errmsg > snapshot > sidebar-fallback (errmsg é o que app
        // estava tentando navegar, mais preciso que o snapshot residual da
        // sidebar quando teste morre antes de carregar). Snapshot ganha de
        // sidebar-fallback porque snapshot real-RootWebArea > path inferido.
        const candidates = [urlFromMsg, urlFromCtx].filter(Boolean) as UrlExtractResult[];
        const pickOrder: Array<UrlExtractResult['origin']> = ['errmsg', 'snapshot', 'sidebar-fallback'];
        const picked = pickOrder
          .map((o) => candidates.find((c) => c.origin === o))
          .find(Boolean);
        const lastObservedUrl = picked?.url;
        const lastObservedUrlOrigin = picked?.origin;
        const urlMismatchWithSpec = lastObservedUrl
          ? isUrlMismatchedWithSpec(lastObservedUrl, testsuite, spec.title)
          : false;

        out.push({
          testsuite,
          testcase: spec.title,
          filePath: spec.file,
          status: last?.status ?? 'failed',
          durationMs: last?.duration ?? 0,
          errorMessage: last?.error?.message,
          errorLocation: last?.errorLocation
            ? `${last.errorLocation.file ?? ''}:${last.errorLocation.line ?? ''}`
            : undefined,
          skipReason: skipAnn?.description?.trim() || undefined,
          skipKind:
            skipAnn?.type === 'fixme'
              ? 'fixme'
              : skipAnn?.type === 'skip'
              ? 'skip'
              : undefined,
          attachments,
          steps,
          lastObservedUrl,
          lastObservedUrlOrigin,
          urlMismatchWithSpec,
        });
      }
    }
    for (const child of suite.suites ?? []) walk(child, nextAncestors);
  }

  for (const root of suites) walk(root, []);
  return out;
}

// ─── Diagnóstico (palpite) ──────────────────────────────────────────────────

/**
 * Tenta gerar uma 1-linha de diagnóstico PALPITE a partir do erro. NÃO é
 * categoria de triagem — só ajuda o QA a contextualizar.
 */
function guessDiagnosis(t: FlatTest): string {
  const raw = t.errorMessage ?? '';
  const msg = raw.toLowerCase();
  if (/aguardando toggle ou modal/.test(raw))
    return 'poll esgotado: click no switch não disparou nem toggle nem modal — produto não respondeu (banner sobrepondo? React handler quebrado? backend silent fail?)';
  if (/seed quebrado/.test(raw))
    return 'pré-condição de tenant não bate com data file — seed manual mudou ou IDs incorretos';
  if (/timeout/.test(msg) && /waitforurl/.test(msg))
    return 'submit/redirect não ocorreu — possível modal interceptando ou backend silencioso';
  if (/timeout/.test(msg) && /(tobechecked|tobevisible|toBeAttached)/i.test(raw))
    return 'elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido';
  if (/timeout.*locator\.click/.test(msg))
    return 'click não foi acionável — possível elemento hidden/coberto/aria-disabled';
  if (/expect.*not.*pending/i.test(raw))
    return 'poll esgotado esperando state mudar OU modal abrir — produto não respondeu ao click';
  if (/net::err_aborted|err_failed/.test(msg))
    return 'requisição abortada — possível ctx.close() antes do response (fixture/cleanup mal ordenado)';
  if (/expect.*tocontain.*text|expect.*tohave/i.test(raw))
    return 'asserção textual falhou — produto exibe label diferente do esperado pelo XML (verificar prosa)';
  if (/strict mode violation/i.test(raw))
    return 'locator casou múltiplos elementos — refinar seletor (filter, nth, getByRole com name específico)';
  return 'mensagem genérica — abra o trace pra diagnosticar';
}

// ─── Markdown render ────────────────────────────────────────────────────────

function emitHeader(
  projectName: string,
  environment: string,
  mode: Mode,
  suite: string | undefined,
  passed: number,
  failed: number,
  skipped: number,
  expl: ExploratoryReport | null,
): string {
  const scope =
    mode === 'regression'
      ? 'Regressão (todos os testsuites)'
      : mode === 'per-suite'
      ? `Testsuite: ${suite}`
      : 'Todas as suítes';
  const total = passed + failed + skipped;
  const explTotals = expl
    ? `${expl.summary.errors} erros · ${expl.summary.warnings} warnings · ${expl.summary.info} info`
    : '—';

  return [
    `# Triage Report — ${projectName} — ${nowHuman()}`,
    '',
    `**Escopo**: ${scope} · **Ambiente**: \`${environment}\``,
    '',
    '## Sumário',
    '',
    '| Total | ✅ Passed | ❌ Failed | ⊘ Skipped | Findings exploratórios |',
    '|---:|---:|---:|---:|---|',
    `| ${total} | ${passed} | ${failed} | ${skipped} | ${explTotals} |`,
    '',
    '> **Janela única de revisão.** Marque ☑ em UMA categoria por item.',
    '> Notas em PT-BR. Commit este arquivo após triagem.',
    '> Categorias: `Bug produto` / `Comportamento esperado` / `Spec/seed errado` / `Flakiness`.',
    '',
    '---',
    '',
  ].join('\n');
}

function emitFailure(
  t: FlatTest,
  idx: number,
  reportPath: string,
): string {
  const lines: string[] = [];

  lines.push(`### [F${idx + 1}] ${t.testsuite} · "${t.testcase}"`);
  lines.push('');

  lines.push(`- **Arquivo**: \`${t.filePath}\``);
  lines.push(`- **Status**: ${t.status} · **Duração**: ${(t.durationMs / 1000).toFixed(1)}s`);
  if (t.errorLocation) lines.push(`- **Local do erro**: \`${t.errorLocation}\``);
  if (t.lastObservedUrl) {
    const aproximada = t.lastObservedUrlOrigin === 'sidebar-fallback';
    const label = aproximada ? '🌐 URL aproximada (NÃO precisa)' : '🌐 Reproduzir manualmente';
    lines.push(`- **${label}**: [${t.lastObservedUrl}](${t.lastObservedUrl})`);
    lines.push(`  - URL crua (copiar): \`${t.lastObservedUrl}\``);
    if (aproximada) {
      lines.push('  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.');
    }
    if (t.urlMismatchWithSpec) {
      lines.push(`  - 🚨 **URL não bate com escopo do teste** (nome do TC menciona painel/listagem mas URL é \`${t.lastObservedUrl}\`). **Possível causa**: spec configurado em rota errada OU teste navegou pra lugar inesperado. **Verifique**: abrir trace + conferir \`goToList()\` ou rota usada pelo spec.`);
    }
  } else {
    lines.push('- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)');
  }

  const screenshot = t.attachments.find(
    (a) => a.name?.startsWith('screenshot') || a.contentType === 'image/png',
  );
  const trace = t.attachments.find((a) => a.name === 'trace');
  const errCtx = t.attachments.find((a) => a.name === 'error-context');

  if (screenshot)
    lines.push(`- **Última tela**: \`${relFromReport(reportPath, screenshot.path)}\``);
  if (trace)
    lines.push(
      `- **Trace**: \`${relFromReport(reportPath, trace.path)}\` (abrir com \`npx playwright show-trace\`)`,
    );
  if (errCtx)
    lines.push(`- **Error context**: \`${relFromReport(reportPath, errCtx.path)}\``);

  if (t.errorMessage) {
    lines.push('');
    lines.push('**Erro** (truncado):');
    lines.push('');
    lines.push('```');
    lines.push(truncate(t.errorMessage));
    lines.push('```');
  }

  if (t.steps.length > 0) {
    lines.push('');
    lines.push('**Steps executados**:');
    lines.push('');
    lines.push('| # | Step | Status |');
    lines.push('|---:|---|:---:|');
    for (const s of t.steps) {
      const emoji = s.status === 'passed' ? '✅' : '❌';
      lines.push(`| ${s.number} | ${s.title.replace(/\|/g, '\\|')} | ${emoji} |`);
    }
  }

  lines.push('');
  lines.push(`**Diagnóstico do agente** (palpite, NÃO decisão): ${guessDiagnosis(t)}`);
  lines.push('');
  lines.push('**QA decide** (marque UM):');
  lines.push('');
  lines.push('- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________');
  lines.push('- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________');
  lines.push('- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________');
  lines.push('- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________');
  lines.push('- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir');
  lines.push('');
  lines.push('**Notas QA**: ____________________________________________________________');
  lines.push('');
  lines.push('**Ticket relacionado** (opcional): ____________');
  lines.push('');
  lines.push('---');
  lines.push('');

  return lines.join('\n');
}

function emitSkips(skips: FlatTest[]): string {
  if (skips.length === 0) return '';
  const lines: string[] = [];
  lines.push('## ⊘ Skips legítimos pra revalidação periódica');
  lines.push('');
  lines.push(
    '> Items com `test.fixme` + reason. Se o motivo já não vale (seed criado, bug corrigido), abrir e re-rodar. Ver skill `debugar-bug-produto-stale`.',
  );
  lines.push('');
  lines.push('| TC | Tipo | Motivo |');
  lines.push('|---|---|---|');
  for (const t of skips) {
    const reason = (t.skipReason ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
    lines.push(`| ${t.testcase} | ${t.skipKind ?? 'skip'} | ${reason.slice(0, 200)} |`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  return lines.join('\n');
}

function emitExploratory(expl: ExploratoryReport | null): string {
  if (!expl || expl.testsuites.length === 0) return '';
  const lines: string[] = [];
  lines.push('## 🐛 Findings exploratórios não-fatais (informativo)');
  lines.push('');
  lines.push(
    '> Console errors, HTTP 5xx, axe critical. Não bloqueiam, mas merecem leitura — podem indicar bug latente.',
  );
  lines.push('');

  for (const suite of expl.testsuites) {
    const totalIssues =
      suite.totals.errors + suite.totals.warnings + suite.totals.info;
    if (totalIssues === 0) continue;
    lines.push(`### ${suite.testsuiteName}`);
    lines.push(
      `Totais: **${suite.totals.errors}** erros · ${suite.totals.warnings} warnings · ${suite.totals.info} info`,
    );
    lines.push('');
    const top = suite.findings.filter((f) => f.severity === 'error').slice(0, 10);
    if (top.length > 0) {
      lines.push('Top erros:');
      lines.push('');
      lines.push('| Kind | URL | Mensagem |');
      lines.push('|---|---|---|');
      for (const f of top) {
        const msg = f.message.slice(0, 150).replace(/\|/g, '\\|').replace(/\n/g, ' ');
        const url = (f.url || '—').slice(0, 80);
        lines.push(`| ${f.kind} | ${url} | ${msg} |`);
      }
      lines.push('');
    }
  }
  lines.push('---');
  lines.push('');
  return lines.join('\n');
}

function emitFooter(): string {
  return [
    '## Próximos passos',
    '',
    '1. Marque ☑ em **uma** categoria por falha acima.',
    '2. Preencha "Notas QA" em PT-BR — vira input do agente.',
    '3. Commit este arquivo (`outputs/<slug>/triage-report.md`).',
    '4. Próxima sessão do agente lê o report e aplica patches conforme decisão.',
    '',
    '> Categorias mutuamente exclusivas — se duvidar entre duas, escolha a mais conservadora (geralmente "Flakiness" ou "Spec errado").',
    '',
  ].join('\n');
}

// ─── Pipeline ────────────────────────────────────────────────────────────────

function main(): void {
  const args = parseFlags();
  log.info(`triage-report start — mode=${args.mode}${args.suite ? ` suite=${args.suite}` : ''}`);

  const testResultsPath = getOutputPath('test-results.json');
  const exploratoryPath = getOutputPath('exploratory-findings.json');

  const report = loadJson<PlaywrightReport>(testResultsPath);
  if (!report) {
    log.error(`Test results não encontrados em ${testResultsPath}. Rode \`npm run agent:run\` primeiro.`);
    process.exit(1);
  }

  const expl = loadJson<ExploratoryReport>(exploratoryPath);

  let baseUrl: string | undefined;
  try {
    baseUrl = getBaseUrl();
  } catch (e) {
    log.warn(`baseURL não disponível (env não resolvido) — URLs no report podem ficar incompletas. ${(e as Error).message}`);
  }

  const all = flatten(report.suites ?? [], baseUrl);
  const filtered = args.suite
    ? all.filter((t) => t.testsuite.toLowerCase().includes(args.suite!.toLowerCase()))
    : all;

  if (filtered.length === 0) {
    log.warn(`Nenhum teste casou o filtro (suite=${args.suite ?? '*'}). Abortando.`);
    process.exit(0);
  }

  const failed = filtered.filter((t) => t.status === 'failed' || t.status === 'timedOut' || t.status === 'interrupted');
  const passed = filtered.filter((t) => t.status === 'passed');
  const skipped = filtered.filter((t) => t.status === 'skipped');

  let projectName = 'Twygo';
  let environment = 'staging';
  try {
    const cfg = loadProjectConfig();
    projectName = cfg.projectName ?? projectName;
    environment = (cfg as { environment?: string }).environment ?? environment;
  } catch (e) {
    log.warn(`project.config.json não encontrado — header genérico. ${(e as Error).message}`);
  }

  const out: string[] = [];
  out.push(emitHeader(projectName, environment, args.mode, args.suite, passed.length, failed.length, skipped.length, expl));

  if (failed.length === 0) {
    out.push('## ✅ Sem falhas pra triagem');
    out.push('');
    out.push('Suite rodou limpa. Revise apenas a seção de exploratórios e skips abaixo (se houver).');
    out.push('');
    out.push('---');
    out.push('');
  } else {
    out.push('## ❌ Falhas pra triagem');
    out.push('');
  }

  // Decide path do report cedo, pra resolver rels corretamente
  const reportPath = args.keepHistory
    ? resolve(getProjectOutputRoot(), 'triage', `${timestamp()}.md`)
    : getOutputPath('triage-report.md');

  failed.forEach((t, i) => {
    out.push(emitFailure(t, i, reportPath));
  });

  out.push(emitSkips(skipped));
  out.push(emitExploratory(expl));
  out.push(emitFooter());

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, out.join('\n'), 'utf-8');

  log.info(`triage-report gerado em ${reportPath}`);
  log.info(`  ${passed.length} passed · ${failed.length} failed · ${skipped.length} skipped`);

  if (failed.length > 0) {
    printConsoleQuestions(failed, skipped, reportPath);
  } else if (skipped.length > 0) {
    printSkipsConsole(skipped, reportPath);
  }
}

/**
 * Imprime no console um bloco visual com as dúvidas pendentes pra triagem QA.
 * Formato pensado pra ser scaneado em 5s direto no terminal — cada item tem
 * número, TC, diagnóstico curto, e link clicável (file://) pro report.
 */
function printConsoleQuestions(
  failed: FlatTest[],
  skipped: FlatTest[],
  reportPath: string,
): void {
  const line = '─'.repeat(78);
  console.log('');
  console.log(line);
  console.log(`  ⚠️  ${failed.length} DÚVIDA(S) PRA TRIAGEM QA`);
  console.log(line);
  console.log('');
  failed.forEach((t, i) => {
    const num = `[F${i + 1}]`.padEnd(5);
    console.log(`  ${num} ${t.testsuite} · "${t.testcase}"`);
    console.log(`         📁 ${t.errorLocation ?? t.filePath}`);
    console.log(`         🔍 ${guessDiagnosis(t)}`);
    if (t.lastObservedUrl) {
      const aproximada = t.lastObservedUrlOrigin === 'sidebar-fallback';
      const tag = aproximada ? ' (⚠️ aproximada — sidebar)' : '';
      console.log(`         🌐 ${t.lastObservedUrl}${tag}`);
      if (t.urlMismatchWithSpec) {
        console.log('         🚨 URL não bate com escopo do TC — spec pode estar configurado na rota errada');
      }
    }
    console.log('         ❓ Categorias: [ ] Bug-IMPEDITIVO  [ ] Bug-não-impeditivo (workaround)  [ ] Esperado  [ ] Spec errado  [ ] Flakiness');
    console.log('');
  });

  if (skipped.length > 0) {
    console.log(`  ⊘  ${skipped.length} skip(s) com fixme pra revalidar:`);
    skipped.forEach((t, i) => {
      const reason = (t.skipReason ?? '—').slice(0, 80).replace(/\n/g, ' ');
      console.log(`     ${i + 1}. ${t.testcase} — ${reason}`);
    });
    console.log('');
  }

  console.log(line);
  console.log(`  📝 Abra o report, marque ☑ uma categoria por item, commit:`);
  console.log(`     file://${reportPath}`);
  console.log(line);
  console.log('');
}

function printSkipsConsole(skipped: FlatTest[], reportPath: string): void {
  const line = '─'.repeat(78);
  console.log('');
  console.log(line);
  console.log(`  ⊘  ${skipped.length} skip(s) com fixme — sem falhas pra triagem`);
  console.log(line);
  skipped.forEach((t, i) => {
    const reason = (t.skipReason ?? '—').slice(0, 80).replace(/\n/g, ' ');
    console.log(`     ${i + 1}. ${t.testcase}`);
    console.log(`        ${reason}`);
  });
  console.log('');
  console.log(`     Report: file://${reportPath}`);
  console.log(line);
  console.log('');
}

main();
