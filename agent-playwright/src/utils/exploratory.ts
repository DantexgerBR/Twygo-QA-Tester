import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page, Request, Response, ConsoleMessage } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ensureDir, slugify } from './helpers.js';
import { getOutputDir } from './environment.js';

export type FindingSeverity = 'error' | 'warn' | 'info';

export type FindingKind =
  | 'console_error'
  | 'page_error'
  | 'http_error'
  | 'broken_image'
  | 'coverage_snapshot'
  | 'a11y_violation';

export type Finding = {
  kind: FindingKind;
  severity: FindingSeverity;
  url: string;
  message: string;
  detail?: Record<string, unknown>;
  /**
   * `true` se o finding ocorreu numa rota/mensagem dentro do escopo configurado
   * (`exploratory.scopedRoutes` / `exploratory.scopedKeywords`). `false` caso
   * contrário — vai pro bucket "out-of-scope" do relatório, sem entrar nos KPIs
   * principais nem em strict mode.
   */
  inScope: boolean;
};

export type ActiveProbeName =
  | 'hoverTooltips'
  | 'keyboardNav'
  | 'formEdge'
  | 'clickabilitySweep'
  | 'a11yDeep'
  | 'visualStability';

export type ActiveProbeFinding = {
  probe: ActiveProbeName;
  severity: FindingSeverity;
  message: string;
  detail?: Record<string, unknown>;
};

export type ActiveProbeReport = {
  ran: boolean;
  durationMs: number;
  findings: ActiveProbeFinding[];
  error?: string;
  detail?: Record<string, unknown>;
};

export type ActiveProbeResults = {
  suite: string;
  test: string;
  file: string;
  workerIndex: number;
  url: string;
  startedAt: string;
  finishedAt: string;
  inScope: boolean;
  byProbe: Partial<Record<ActiveProbeName, ActiveProbeReport>>;
};

export type CoverageSnapshot = {
  url: string;
  totalInteractive: number;
  visibleInteractive: number;
  samples: Array<{ role: string; name: string }>;
};

export type SuiteFindings = {
  suite: string;
  test: string;
  file: string;
  workerIndex: number;
  startedAt: string;
  finishedAt: string;
  findings: Finding[];
  coverage: CoverageSnapshot[];
};

export type ProbeConfig = {
  enabled: boolean;
  strict: boolean;
  probes: {
    consoleErrors: boolean;
    httpErrors: boolean;
    brokenImages: boolean;
    untestedInteractive: boolean;
    a11y: boolean;
  };
  a11yTags: string[];
  ignoredHttpStatuses: number[];
  ignoredHostnames: string[];
  /**
   * Substring(s) que, quando presentes na URL do request/console, marcam o
   * finding como **in-scope** (entra nos KPIs principais). Default focado em
   * `ai_consumption_analysis`.
   */
  scopedRoutes: string[];
  /**
   * Palavras-chave (case-insensitive) buscadas na mensagem/payload do finding
   * para detectar relação com o domínio (créditos de IA, indexação, agente de
   * atendimento). Funciona como OR com `scopedRoutes`.
   */
  scopedKeywords: string[];
  /**
   * Probes ativos opt-in — rodam ao final de cada teste para antecipar
   * problemas além do que a prosa cobre. Resultados vão para
   * `outputs/exploratory/active-probes-*.json`, separados dos findings passivos.
   */
  activeProbes: {
    hoverTooltips: boolean;
    keyboardNav: boolean;
    formEdge: boolean;
    clickabilitySweep: boolean;
    a11yDeep: boolean;
    visualStability: boolean;
  };
};

export const DEFAULT_PROBE_CONFIG: ProbeConfig = {
  enabled: true,
  strict: false,
  probes: {
    consoleErrors: true,
    httpErrors: true,
    brokenImages: true,
    untestedInteractive: true,
    a11y: true,
  },
  a11yTags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
  ignoredHttpStatuses: [],
  ignoredHostnames: [],
  scopedRoutes: ['ai_consumption_analysis'],
  scopedKeywords: [
    'ai_consumption',
    'créditos de ia',
    'creditos de ia',
    'credits',
    'indexação',
    'indexacao',
    'indexing',
    'agente de atendimento',
    'attendant_agent',
  ],
  activeProbes: {
    hoverTooltips: false,
    keyboardNav: false,
    formEdge: false,
    clickabilitySweep: false,
    a11yDeep: false,
    visualStability: false,
  },
};

/**
 * Determina se uma URL+mensagem cai no escopo "Créditos de IA" configurado.
 * Match em qualquer um dos dois eixos (rota ou keyword) é suficiente.
 */
export function isInScope(
  url: string,
  message: string,
  config: Pick<ProbeConfig, 'scopedRoutes' | 'scopedKeywords'>,
): boolean {
  const haystack = `${url}\n${message}`.toLowerCase();
  for (const r of config.scopedRoutes) {
    if (r && haystack.includes(r.toLowerCase())) return true;
  }
  for (const k of config.scopedKeywords) {
    if (k && haystack.includes(k.toLowerCase())) return true;
  }
  return false;
}

export function isStrictModeEnv(): boolean {
  const v = process.env.EXPLORATORY_STRICT;
  return v === '1' || v === 'true';
}

export class ExploratoryCollector {
  readonly findings: Finding[] = [];
  readonly coverage: CoverageSnapshot[] = [];
  private readonly visitedUrls = new Set<string>();

  constructor(private readonly config: ProbeConfig) {}

  private inScope(url: string, message: string): boolean {
    return isInScope(url, message, this.config);
  }

  attach(page: Page): void {
    if (!this.config.enabled) return;

    if (this.config.probes.consoleErrors) {
      page.on('console', (msg: ConsoleMessage) => {
        if (msg.type() !== 'error') return;
        const url = page.url();
        const text = msg.text();
        this.findings.push({
          kind: 'console_error',
          severity: 'error',
          url,
          message: text,
          inScope: this.inScope(url, text),
        });
      });
      page.on('pageerror', (err: Error) => {
        const url = page.url();
        this.findings.push({
          kind: 'page_error',
          severity: 'error',
          url,
          message: err.message,
          detail: { stack: err.stack },
          inScope: this.inScope(url, err.message),
        });
      });
    }

    if (this.config.probes.httpErrors) {
      page.on('response', (res: Response) => {
        const status = res.status();
        if (status < 400) return;
        if (this.config.ignoredHttpStatuses.includes(status)) return;
        const req: Request = res.request();
        const url = res.url();
        try {
          const host = new URL(url).hostname;
          if (this.config.ignoredHostnames.includes(host)) return;
        } catch {
          /* URL não-parseável: registra mesmo assim */
        }
        const message = `HTTP ${status} em ${req.method()} ${url}`;
        this.findings.push({
          kind: 'http_error',
          severity: status >= 500 ? 'error' : 'warn',
          url,
          message,
          detail: { status, method: req.method(), resourceType: req.resourceType() },
          inScope: this.inScope(url, message),
        });
      });
    }
  }

  async runEndOfTestProbes(page: Page): Promise<void> {
    if (!this.config.enabled) return;
    const currentUrl = page.url();
    if (currentUrl && currentUrl !== 'about:blank') {
      this.visitedUrls.add(currentUrl);
    }

    if (this.config.probes.brokenImages) {
      try {
        const broken = await page.evaluate(() => {
          const imgs = Array.from(document.images);
          return imgs
            .filter((img) => img.complete && img.naturalWidth === 0 && img.src)
            .map((img) => ({ src: img.src, alt: img.alt }));
        });
        for (const b of broken) {
          const message = `Imagem quebrada: ${b.src}`;
          this.findings.push({
            kind: 'broken_image',
            severity: 'warn',
            url: currentUrl,
            message,
            detail: b,
            inScope: this.inScope(b.src, message),
          });
        }
      } catch {
        /* página fechada ou navegando: ignora */
      }
    }

    if (this.config.probes.a11y) {
      try {
        const builder = new AxeBuilder({ page });
        const tags = this.config.a11yTags;
        if (tags && tags.length > 0) builder.withTags(tags);
        const results = await builder.analyze();
        const pageInScope = this.inScope(currentUrl, '');
        for (const v of results.violations) {
          this.findings.push({
            kind: 'a11y_violation',
            severity: mapAxeImpact(v.impact),
            url: currentUrl,
            message: `[a11y/${v.id}] ${v.help}`,
            detail: {
              ruleId: v.id,
              impact: v.impact,
              tags: v.tags,
              helpUrl: v.helpUrl,
              affectedNodes: v.nodes.length,
              firstNodeTarget: v.nodes[0]?.target,
              firstNodeHtml: v.nodes[0]?.html?.slice(0, 200),
            },
            inScope: pageInScope,
          });
        }
      } catch {
        /* axe falhou (página fechada ou contexto inválido): ignora */
      }
    }

    if (this.config.probes.untestedInteractive) {
      try {
        const snapshot = await page.evaluate(() => {
          const selectors = [
            'button:not([disabled])',
            'a[href]',
            'input:not([type="hidden"]):not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[role="button"]',
            '[role="link"]',
            '[role="tab"]',
            '[role="menuitem"]',
          ];
          const nodes = Array.from(
            document.querySelectorAll<HTMLElement>(selectors.join(',')),
          );
          const isVisible = (el: HTMLElement): boolean => {
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return false;
            const style = window.getComputedStyle(el);
            return style.visibility !== 'hidden' && style.display !== 'none';
          };
          const visible = nodes.filter(isVisible);
          const sampleOf = (el: HTMLElement) => {
            const role =
              el.getAttribute('role') ||
              (el.tagName === 'A' ? 'link' : el.tagName.toLowerCase());
            const name =
              el.getAttribute('aria-label') ||
              el.getAttribute('name') ||
              (el.textContent ?? '').trim().slice(0, 60) ||
              el.getAttribute('placeholder') ||
              '';
            return { role, name };
          };
          return {
            totalInteractive: nodes.length,
            visibleInteractive: visible.length,
            samples: visible.slice(0, 25).map(sampleOf),
          };
        });
        this.coverage.push({ url: currentUrl, ...snapshot });
      } catch {
        /* página inacessível: ignora */
      }
    }
  }

  /**
   * Roda probes ativos (opt-in via `config.activeProbes.*`) **apenas se a URL
   * atual estiver no escopo** (`scopedRoutes` ou `scopedKeywords`). Cada probe
   * é isolado: falha de um não bloqueia os outros. Resultado é gravado pela
   * fixture em `outputs/exploratory/active-probes-*.json`.
   */
  async runActiveProbes(
    page: Page,
  ): Promise<Partial<Record<ActiveProbeName, ActiveProbeReport>>> {
    const out: Partial<Record<ActiveProbeName, ActiveProbeReport>> = {};
    const url = page.url();
    if (!isInScope(url, '', this.config)) return out;

    const ap = this.config.activeProbes;
    if (ap.hoverTooltips) out.hoverTooltips = await runProbe(() => probeHoverTooltips(page));
    if (ap.keyboardNav) out.keyboardNav = await runProbe(() => probeKeyboardNav(page));
    if (ap.formEdge) out.formEdge = await runProbe(() => probeFormEdge(page));
    if (ap.clickabilitySweep) out.clickabilitySweep = await runProbe(() => probeClickabilitySweep(page));
    if (ap.a11yDeep) out.a11yDeep = await runProbe(() => probeA11yDeep(page, this.config.a11yTags));
    if (ap.visualStability) out.visualStability = await runProbe(() => probeVisualStability(page));

    return out;
  }

  pageInScope(url: string): boolean {
    return isInScope(url, '', this.config);
  }
}

export function writeSuiteFindings(payload: SuiteFindings): string {
  const dir = getOutputDir('exploratory');
  ensureDir(dir);
  const fileName = `${slugify(payload.suite)}__${slugify(payload.test)}__w${payload.workerIndex}.json`;
  const filePath = join(dir, fileName);
  writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
  return filePath;
}

function mapAxeImpact(
  impact: 'minor' | 'moderate' | 'serious' | 'critical' | null | undefined,
): FindingSeverity {
  switch (impact) {
    case 'critical':
    case 'serious':
      return 'error';
    case 'moderate':
      return 'warn';
    case 'minor':
    default:
      return 'info';
  }
}

export function summarizeFindings(
  findings: Finding[],
  opts: { onlyInScope?: boolean } = {},
): {
  errors: number;
  warnings: number;
  info: number;
} {
  let errors = 0;
  let warnings = 0;
  let info = 0;
  for (const f of findings) {
    if (opts.onlyInScope && f.inScope === false) continue;
    if (f.severity === 'error') errors++;
    else if (f.severity === 'warn') warnings++;
    else info++;
  }
  return { errors, warnings, info };
}

// ─── Active probes (opt-in) ──────────────────────────────────────────────────

export function writeActiveProbeResults(payload: ActiveProbeResults): string {
  const dir = getOutputDir('exploratory');
  ensureDir(dir);
  const fileName = `active-probes__${slugify(payload.suite)}__${slugify(payload.test)}__w${payload.workerIndex}.json`;
  const filePath = join(dir, fileName);
  writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
  return filePath;
}

async function runProbe(
  fn: () => Promise<Omit<ActiveProbeReport, 'durationMs'>>,
): Promise<ActiveProbeReport> {
  const t0 = Date.now();
  try {
    const r = await fn();
    return { ...r, durationMs: Date.now() - t0 };
  } catch (err) {
    return {
      ran: false,
      durationMs: Date.now() - t0,
      findings: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Hover em todo elemento com `[data-test-id$="-tooltip"]`, `.tooltip-icon` ou
 * `[data-tooltip]`. Reporta:
 * - tooltips que não aparecem em até 600ms;
 * - tooltips que aparecem com texto vazio.
 */
async function probeHoverTooltips(
  page: Page,
): Promise<Omit<ActiveProbeReport, 'durationMs'>> {
  const findings: ActiveProbeFinding[] = [];
  const handles = await page
    .locator('[data-test-id$="-tooltip"], .tooltip-icon, [data-tooltip], [data-test-id*="-tooltip-"]')
    .all();
  let probed = 0;
  let neverAppeared = 0;
  let withText = 0;
  let withoutText = 0;
  for (const h of handles.slice(0, 25)) {
    if (!(await h.isVisible().catch(() => false))) continue;
    probed++;
    let descriptor = '(elemento)';
    try {
      descriptor =
        (await h.getAttribute('data-test-id').catch(() => null)) ??
        (await h.getAttribute('aria-label').catch(() => null)) ??
        (await h.evaluate((el) => (el as HTMLElement).outerHTML.slice(0, 80)).catch(() => '(elemento)')) ??
        '(elemento)';
    } catch { /* ignore */ }
    try {
      await h.hover({ timeout: 1500 });
      await page.waitForTimeout(200);
      const tip = page
        .locator('[role="tooltip"], .tooltip-inner, [data-popper-placement], .tippy-content')
        .filter({ has: page.locator(':visible') });
      const visible = await tip.first().isVisible().catch(() => false);
      if (!visible) {
        neverAppeared++;
        findings.push({
          probe: 'hoverTooltips',
          severity: 'info',
          message: `Tooltip não apareceu ao passar o mouse sobre "${descriptor}"`,
          detail: { selector: descriptor },
        });
        continue;
      }
      const text = ((await tip.first().textContent({ timeout: 600 }).catch(() => '')) ?? '').trim();
      if (text.length === 0) {
        withoutText++;
        findings.push({
          probe: 'hoverTooltips',
          severity: 'warn',
          message: `Tooltip apareceu sem texto em "${descriptor}"`,
          detail: { selector: descriptor },
        });
      } else {
        withText++;
      }
    } catch {
      neverAppeared++;
    }
  }
  return {
    ran: true,
    findings,
    detail: { probed, withText, withoutText, neverAppeared, candidates: handles.length },
  };
}

/**
 * Tab por todos os elementos focáveis no escopo do `<main>` (ou `body`) e
 * verifica se o `:focus` é visualmente perceptível: outline diferente de
 * `none` OU box-shadow customizado OU border modificada.
 */
async function probeKeyboardNav(
  page: Page,
): Promise<Omit<ActiveProbeReport, 'durationMs'>> {
  const findings: ActiveProbeFinding[] = [];
  // Move foco para o início da página
  await page.evaluate(() => {
    const root = (document.querySelector('main') as HTMLElement | null) ?? document.body;
    root.focus();
    return null;
  }).catch(() => null);

  const maxTabs = 30;
  let invisible = 0;
  let probed = 0;
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press('Tab').catch(() => null);
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const visible = rect.width > 0 && rect.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
      const outlineNone = cs.outlineStyle === 'none' || cs.outlineWidth === '0px';
      const boxShadowDefault = cs.boxShadow === 'none' || cs.boxShadow === '';
      const noFocusVisual = outlineNone && boxShadowDefault;
      return {
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role') ?? '',
        name:
          el.getAttribute('aria-label') ??
          el.getAttribute('data-test-id') ??
          (el.textContent ?? '').trim().slice(0, 50),
        visible,
        noFocusVisual,
      };
    }).catch(() => null);
    if (!info) break;
    probed++;
    if (!info.visible) {
      invisible++;
      continue;
    }
    if (info.noFocusVisual) {
      findings.push({
        probe: 'keyboardNav',
        severity: 'warn',
        message: `Elemento focável "${info.name || info.tag}" não tem indicador visual de foco`,
        detail: info,
      });
    }
  }
  return {
    ran: true,
    findings,
    detail: { probed, invisible },
  };
}

/**
 * Para cada `input[type=number]` ou `input[type=date]` visível, tenta valores
 * extremos (negativo, zero, máximo, formato inválido) e captura se há mensagem
 * de validação OU se o submit dispara crash silencioso (página/console error).
 *
 * Restaura o valor original ao final pra não poluir o estado do teste.
 */
async function probeFormEdge(
  page: Page,
): Promise<Omit<ActiveProbeReport, 'durationMs'>> {
  const findings: ActiveProbeFinding[] = [];
  const numbers = await page.locator('input[type="number"]:visible, input[type="date"]:visible').all();
  let consoleErrCount = 0;
  const onErr = () => consoleErrCount++;
  page.on('pageerror', onErr);

  let probed = 0;
  for (const input of numbers.slice(0, 8)) {
    const type = (await input.getAttribute('type').catch(() => 'number')) ?? 'number';
    const original = (await input.inputValue().catch(() => '')) ?? '';
    const descriptor =
      (await input.getAttribute('data-test-id').catch(() => null)) ??
      (await input.getAttribute('name').catch(() => null)) ??
      `(${type})`;
    const cases = type === 'date'
      ? ['1900-01-01', '9999-12-31', 'abc', '']
      : ['-1', '0', '999999999', 'abc'];
    probed++;
    for (const v of cases) {
      const before = consoleErrCount;
      try {
        await input.fill(v, { timeout: 1000 });
        await page.waitForTimeout(80);
      } catch {
        continue;
      }
      const after = consoleErrCount;
      const validity = await input.evaluate(
        (el) => (el as HTMLInputElement).validity?.valid ?? true,
      ).catch(() => true);
      if (after > before) {
        findings.push({
          probe: 'formEdge',
          severity: 'error',
          message: `Campo "${descriptor}" disparou erro no console ao receber "${v}"`,
          detail: { input: descriptor, value: v, errorsAdded: after - before },
        });
      }
      if (!validity && v !== '') {
        // Validação HTML rejeitou — esperado, mas registra como info pra auditoria
        findings.push({
          probe: 'formEdge',
          severity: 'info',
          message: `Campo "${descriptor}" rejeitou o valor "${v}" via validity API`,
          detail: { input: descriptor, value: v },
        });
      }
    }
    // Restaura
    await input.fill(original, { timeout: 1000 }).catch(() => null);
  }
  page.off('pageerror', onErr);
  return {
    ran: true,
    findings,
    detail: { probed, candidates: numbers.length },
  };
}

/**
 * Identifica botões/links visíveis com aparência informativa (não destrutivos:
 * sem texto "Salvar/Excluir/Confirmar", sem `type=submit`) e clica em cada um
 * pra checar se respondem sem disparar erro de console. Se a URL muda, navega
 * de volta via history.
 */
async function probeClickabilitySweep(
  page: Page,
): Promise<Omit<ActiveProbeReport, 'durationMs'>> {
  const findings: ActiveProbeFinding[] = [];
  const dangerous = /(salvar|save|excluir|delete|confirmar|confirm|sim|yes|cancelar|cancel|sair|logout|enviar|submit)/i;

  const candidates = await page.evaluate(({ dangerousSrc }) => {
    const dangerousRe = new RegExp(dangerousSrc, 'i');
    const sel = 'button:not([type="submit"]):not([disabled]),a:not([target="_blank"]),[role="button"]:not([aria-disabled="true"])';
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(sel));
    const safe: Array<{ idx: number; descriptor: string }> = [];
    nodes.forEach((el, idx) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const cs = window.getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') return;
      const text = (el.textContent ?? '').trim();
      if (text.length === 0) return; // só com label
      if (dangerousRe.test(text)) return;
      const id = el.getAttribute('data-test-id') ?? '';
      if (dangerousRe.test(id)) return;
      const formAction = el.getAttribute('formaction');
      if (formAction) return;
      const href = el.getAttribute('href');
      if (href && (href.startsWith('http') || href.includes('logout'))) return;
      el.setAttribute('data-active-probe-idx', String(idx));
      safe.push({ idx, descriptor: id || text.slice(0, 60) });
    });
    return safe;
  }, { dangerousSrc: dangerous.source }).catch(() => []);

  let consoleErrCount = 0;
  const onErr = () => consoleErrCount++;
  page.on('pageerror', onErr);

  const startUrl = page.url();
  let clicked = 0;
  for (const c of candidates.slice(0, 8)) {
    const target = page.locator(`[data-active-probe-idx="${c.idx}"]`);
    if (!(await target.isVisible().catch(() => false))) continue;
    const before = consoleErrCount;
    try {
      await target.click({ timeout: 1500, trial: false });
      clicked++;
    } catch {
      continue;
    }
    await page.waitForTimeout(300);
    const after = consoleErrCount;
    if (after > before) {
      findings.push({
        probe: 'clickabilitySweep',
        severity: 'error',
        message: `Click em "${c.descriptor}" disparou erro de página`,
        detail: { errorsAdded: after - before },
      });
    }
    if (page.url() !== startUrl) {
      // Volta pra origem pra não poluir o teste seguinte
      await page.goBack({ timeout: 3000, waitUntil: 'domcontentloaded' }).catch(() => null);
    }
  }
  page.off('pageerror', onErr);
  return {
    ran: true,
    findings,
    detail: { clicked, candidates: candidates.length },
  };
}

/**
 * Re-roda axe-core escopado a cada modal/popover/drawer atualmente visível.
 * Detecta violações que aparecem só quando esse container está aberto e que o
 * scan global (probe passivo) pode ter perdido.
 */
async function probeA11yDeep(
  page: Page,
  tags: string[],
): Promise<Omit<ActiveProbeReport, 'durationMs'>> {
  const findings: ActiveProbeFinding[] = [];
  // CSS puro — axe-core não entende `:visible` (extensão do Playwright).
  // Filtramos visibilidade via locator antes de mandar pra axe.
  const containerSelectors = [
    '[role="dialog"]',
    '[role="alertdialog"]',
    '.modal.show',
    '[role="menu"]',
    '[role="tooltip"]',
    '.dropdown-menu.show',
    '[data-state="open"]',
  ];
  for (const sel of containerSelectors) {
    const container = page.locator(sel).first();
    if (!(await container.isVisible().catch(() => false))) continue;
    try {
      const builder = new AxeBuilder({ page }).include(sel);
      if (tags && tags.length > 0) builder.withTags(tags);
      const result = await builder.analyze();
      for (const v of result.violations) {
        findings.push({
          probe: 'a11yDeep',
          severity: mapAxeImpact(v.impact),
          message: `[${sel}] ${v.id}: ${v.help}`,
          detail: {
            container: sel,
            ruleId: v.id,
            impact: v.impact,
            affectedNodes: v.nodes.length,
          },
        });
      }
    } catch {
      /* axe pode falhar se o container some entre o isVisible e o analyze */
    }
  }
  return { ran: true, findings };
}

/**
 * Lê `performance.getEntriesByType('layout-shift')` e calcula um proxy de CLS
 * (Cumulative Layout Shift). Flag se score > 0.1 ("needs improvement" do
 * Google Web Vitals).
 */
async function probeVisualStability(
  page: Page,
): Promise<Omit<ActiveProbeReport, 'durationMs'>> {
  const findings: ActiveProbeFinding[] = [];
  const cls = await page.evaluate(() => {
    type LayoutShift = PerformanceEntry & { value: number; hadRecentInput: boolean };
    const entries = performance.getEntriesByType('layout-shift') as LayoutShift[];
    let score = 0;
    let largest = 0;
    let count = 0;
    for (const e of entries) {
      if (e.hadRecentInput) continue;
      score += e.value;
      if (e.value > largest) largest = e.value;
      count++;
    }
    return { score, largest, count };
  }).catch(() => ({ score: 0, largest: 0, count: 0 }));

  if (cls.score > 0.25) {
    findings.push({
      probe: 'visualStability',
      severity: 'error',
      message: `CLS=${cls.score.toFixed(3)} indica instabilidade visual severa (>0.25)`,
      detail: cls,
    });
  } else if (cls.score > 0.1) {
    findings.push({
      probe: 'visualStability',
      severity: 'warn',
      message: `CLS=${cls.score.toFixed(3)} acima do limite "good" do Web Vitals (0.1)`,
      detail: cls,
    });
  }
  return { ran: true, findings, detail: cls };
}
