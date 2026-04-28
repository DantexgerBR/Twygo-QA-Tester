import { writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import type { Page, Request, Response, ConsoleMessage } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ensureDir, slugify } from './helpers.js';
import { PATHS } from './constants.js';

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
};

export function isStrictModeEnv(): boolean {
  const v = process.env.EXPLORATORY_STRICT;
  return v === '1' || v === 'true';
}

export class ExploratoryCollector {
  readonly findings: Finding[] = [];
  readonly coverage: CoverageSnapshot[] = [];
  private readonly visitedUrls = new Set<string>();

  constructor(private readonly config: ProbeConfig) {}

  attach(page: Page): void {
    if (!this.config.enabled) return;

    if (this.config.probes.consoleErrors) {
      page.on('console', (msg: ConsoleMessage) => {
        if (msg.type() !== 'error') return;
        this.findings.push({
          kind: 'console_error',
          severity: 'error',
          url: page.url(),
          message: msg.text(),
        });
      });
      page.on('pageerror', (err: Error) => {
        this.findings.push({
          kind: 'page_error',
          severity: 'error',
          url: page.url(),
          message: err.message,
          detail: { stack: err.stack },
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
        this.findings.push({
          kind: 'http_error',
          severity: status >= 500 ? 'error' : 'warn',
          url,
          message: `HTTP ${status} em ${req.method()} ${url}`,
          detail: { status, method: req.method(), resourceType: req.resourceType() },
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
          this.findings.push({
            kind: 'broken_image',
            severity: 'warn',
            url: currentUrl,
            message: `Imagem quebrada: ${b.src}`,
            detail: b,
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
}

export function writeSuiteFindings(payload: SuiteFindings): string {
  const dir = resolve(process.cwd(), PATHS.exploratory);
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

export function summarizeFindings(findings: Finding[]): {
  errors: number;
  warnings: number;
  info: number;
} {
  let errors = 0;
  let warnings = 0;
  let info = 0;
  for (const f of findings) {
    if (f.severity === 'error') errors++;
    else if (f.severity === 'warn') warnings++;
    else info++;
  }
  return { errors, warnings, info };
}
