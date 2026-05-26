import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { createLogger } from '../../../src/utils/logger.js';
import { FILES } from '../../../src/utils/constants.js';
import {
  getOrgId,
  getOutputPath,
  getProjectConfigPath,
} from '../../../src/utils/environment.js';
import { slugify } from '../../../src/utils/helpers.js';
import type { ParsedAnalysis, ParsedTestSuite } from '../twygo-xml-parser/parser.js';
import {
  getReconCachePath,
  getReconConfig,
  readReconCache,
  writeReconMeta,
} from './recon-cache.js';

const log = createLogger('recon');

type ProjConfig = { environment: string };
type EnvConfig = Record<string, { baseUrl: string; credentials: { email: string; password: string }; timeout: number }>;

function parseFlags(): {
  suite?: string;
  urls?: string[];
  project?: string;
  force: boolean;
  useStale: boolean;
} {
  const { values } = parseArgs({
    options: {
      suite: { type: 'string' },
      url: { type: 'string' },
      urls: { type: 'string' }, // comma-separated multiple URLs
      project: { type: 'string' },
      force: { type: 'boolean' }, // regenera mesmo com cache fresco
      'use-stale': { type: 'boolean' }, // mantém cache stale em vez de regenerar
    },
    strict: false,
  });
  // Propaga --project como env var PROJECT antes que getProjectSlug() seja
  // chamado pelos imports (mirror do orchestrator.ts).
  if (values.project) {
    process.env.PROJECT = values.project as string;
  }
  const single = values.url as string | undefined;
  const multi = values.urls as string | undefined;
  let urls: string[] | undefined;
  if (multi) urls = multi.split(',').map((u) => u.trim()).filter(Boolean);
  else if (single) urls = [single];
  return {
    suite: values.suite as string | undefined,
    urls,
    project: values.project as string | undefined,
    force: values.force === true,
    useStale: values['use-stale'] === true,
  };
}

function flattenSuites(suite: ParsedTestSuite, acc: ParsedTestSuite[] = []): ParsedTestSuite[] {
  if (suite.testCases.length > 0) acc.push(suite);
  for (const child of suite.childSuites) flattenSuites(child, acc);
  return acc;
}

function findSuite(parsed: ParsedAnalysis, query: string): ParsedTestSuite | null {
  const all = flattenSuites(parsed.rootSuite);
  return (
    all.find((s) => s.name === query) ??
    all.find((s) => s.name.toLowerCase().includes(query.toLowerCase())) ??
    null
  );
}

/**
 * Heurística de URL canônica — extrai do testcase summary/preconditions do XML.
 * Para Twygo, a maioria das testsuites tem fluxo Configurações > Créditos de IA.
 * Caso o usuário passe --url explicitamente, esse override prevalece.
 */
function inferCanonicalUrl(suite: ParsedTestSuite): string {
  // Heurísticas conhecidas (expandir conforme cobertura cresce).
  // orgId resolvido em runtime via getOrgId() — depende do PROJECT env var
  // apontar para o slug correto. NÃO hardcodar valores reais.
  const orgId = getOrgId();
  const lower = suite.name.toLowerCase();
  if (lower.includes('indexação') || lower.includes('agente de atendimento')) {
    return `/o/${orgId}/ai_consumption_analysis?tab=settings`;
  }
  if (lower.includes('histórico de consumo')) {
    return `/o/${orgId}/ai_consumption_analysis?tab=consumption`;
  }
  if (lower.includes('política de créditos')) {
    return `/o/${orgId}/ai_consumption_analysis?tab=policy`;
  }
  if (lower.includes('tabela de preços')) {
    return '/admin/edit_sys_subscription_settings/';
  }
  // Fallback: dashboard admin
  return `/o/${orgId}/dashboard`;
}

type Probe = {
  testIds: { id: string; tag: string; role?: string; name?: string }[];
  rolesAndNames: { role: string; name: string }[];
  labels: string[];
  placeholders: string[];
  signals: { hasSyncAlert: boolean; hasModal: boolean; pageTitle: string };
};

/**
 * Função executada no contexto da página: extrai todos os data-test-id +
 * role+name + labels. Passada como Function (não string) para page.evaluate.
 */
function probePage(): Probe {
  const out: Probe = {
    testIds: [],
    rolesAndNames: [],
    labels: [],
    placeholders: [],
    signals: { hasSyncAlert: false, hasModal: false, pageTitle: document.title || '' },
  };
  const seenLabels = new Set<string>();
  const seenPlaceholders = new Set<string>();
  const seenRoles = new Set<string>();

  document.querySelectorAll('[data-test-id]').forEach((el) => {
    const id = el.getAttribute('data-test-id');
    if (!id) return;
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role') || '';
    const aria = el.getAttribute('aria-label') || (el.textContent || '').trim().slice(0, 60);
    out.testIds.push({ id, tag, role, name: aria });
  });

  document.querySelectorAll('label').forEach((el) => {
    const t = (el.textContent || '').trim();
    if (t && t.length > 0 && t.length < 80 && !seenLabels.has(t)) {
      seenLabels.add(t);
      out.labels.push(t);
    }
  });

  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((el) => {
    const p = el.getAttribute('placeholder');
    if (p && !seenPlaceholders.has(p)) {
      seenPlaceholders.add(p);
      out.placeholders.push(p);
    }
  });

  const roleSelectors: Record<string, string> = {
    button: 'button, [role="button"]',
    link: 'a[href], [role="link"]',
    textbox: 'input[type="text"], input:not([type]), textarea, [role="textbox"]',
    checkbox: 'input[type="checkbox"], [role="checkbox"]',
    tab: '[role="tab"]',
    heading: 'h1, h2, h3, h4, [role="heading"]',
    menuitem: '[role="menuitem"]',
  };
  for (const role of Object.keys(roleSelectors)) {
    document.querySelectorAll(roleSelectors[role]).forEach((el) => {
      const name = ((el as HTMLElement).getAttribute('aria-label') || el.textContent || (el as HTMLInputElement).placeholder || '').trim().slice(0, 80);
      if (!name || name.length < 2) return;
      const key = role + ':' + name;
      if (!seenRoles.has(key)) {
        seenRoles.add(key);
        out.rolesAndNames.push({ role, name });
      }
    });
  }

  out.signals.hasSyncAlert = !!document.querySelector('[role="alert"][data-status="warning"]');
  out.signals.hasModal = !!document.querySelector('[role="dialog"], [data-test-id*="modal"]');

  return out;
}

function buildMarkdownMulti(args: {
  suite: ParsedTestSuite | null;
  snapshots: { url: string; finalUrl: string; probe: Probe }[];
  generatedAt: string;
  slug: string;
  ttlHours: number;
  twygoBaseUrl: string;
}): string {
  const lines: string[] = [];
  // Header de metadados (bloco de comentário) — parseado pelo recon-cache para
  // detecção de staleness. NÃO renderiza no markdown, mas planners podem ler.
  lines.push('<!--');
  lines.push('recon-cache');
  lines.push(`generatedAt: ${args.generatedAt}`);
  lines.push(`suite: ${args.suite?.name ?? 'URL ad-hoc'}`);
  lines.push(`slug: ${args.slug}`);
  lines.push(`ttlHours: ${args.ttlHours}`);
  lines.push(`twygoBaseUrl: ${args.twygoBaseUrl}`);
  lines.push('-->');
  lines.push('');
  lines.push(`# Reconnaissance — ${args.suite?.name ?? 'URL ad-hoc'}`);
  lines.push('');
  lines.push(`> Snapshot do DOM da área desta testsuite, capturado em ${args.generatedAt}.`);
  lines.push(`> Planners DEVEM consumir este arquivo + a prosa do XML, e PULAR exploração ao vivo.`);
  lines.push('');

  if (args.suite) {
    lines.push('## Testcases desta testsuite (do XML)');
    lines.push('');
    args.suite.testCases.forEach((tc, i) => {
      const importance = tc.importance === 3 ? 'crítico' : tc.importance === 1 ? 'menor' : 'normal';
      lines.push(`${i + 1}. **${tc.name}** (importance: ${importance}, ${tc.steps.length} steps)`);
    });
    lines.push('');
  }

  args.snapshots.forEach((snap, idx) => {
    lines.push(`---\n`);
    lines.push(`# URL ${idx + 1}: \`${snap.url}\``);
    lines.push('');
    lines.push(`- Após carregamento: \`${snap.finalUrl}\``);
    lines.push(`- Page title: ${snap.probe.signals.pageTitle}`);
    lines.push(`- Sync alert: ${snap.probe.signals.hasSyncAlert ? '⚠️ SIM' : 'não'} · Modal aberto: ${snap.probe.signals.hasModal ? 'SIM' : 'não'}`);
    lines.push('');

    lines.push('## Test IDs encontrados (data-test-id)');
    lines.push('');
    if (snap.probe.testIds.length === 0) {
      lines.push('*(nenhum test-id encontrado nesta página — pode estar bloqueada por modal/sync, ou área usa apenas roles/labels)*');
    } else {
      lines.push('| data-test-id | tag | role | name (aria-label/text) |');
      lines.push('|---|---|---|---|');
      snap.probe.testIds.forEach((t) => {
        const name = t.name ? t.name.replace(/\|/g, '\\|').slice(0, 60) : '';
        lines.push(`| \`${t.id}\` | ${t.tag} | ${t.role || ''} | ${name} |`);
      });
    }
    lines.push('');

    lines.push('## Roles + accessible names');
    lines.push('');
    if (snap.probe.rolesAndNames.length === 0) {
      lines.push('*(nenhum elemento acessível encontrado)*');
    } else {
      lines.push('| role | name |');
      lines.push('|---|---|');
      snap.probe.rolesAndNames.forEach((r) => {
        lines.push(`| ${r.role} | ${r.name.replace(/\|/g, '\\|').slice(0, 60)} |`);
      });
    }
    lines.push('');

    if (snap.probe.labels.length > 0) {
      lines.push('## Labels');
      lines.push('');
      snap.probe.labels.forEach((l) => lines.push(`- \`${l}\``));
      lines.push('');
    }

    if (snap.probe.placeholders.length > 0) {
      lines.push('## Placeholders');
      lines.push('');
      snap.probe.placeholders.forEach((p) => lines.push(`- \`${p}\``));
      lines.push('');
    }

    if (snap.probe.signals.hasSyncAlert) {
      lines.push('> ⚠️ **Sync alert detectado** nesta URL: o toggle Indexação está bloqueado. Steps que requerem habilitar/marcar checkboxes vão falhar com clicks normais.');
      lines.push('> Use `.click({ force: true })` ou branch via `editPage.isSyncBlocking()` no spec.');
      lines.push('');
    }
  });

  return lines.join('\n');
}

async function main(): Promise<void> {
  const args = parseFlags();
  if (!args.suite && !args.urls) {
    log.error('Use: npm run agent:recon -- --suite "<nome>" [--urls "/url1,/url2"]');
    process.exit(1);
  }

  // Carrega configs
  const projectConfig: ProjConfig = JSON.parse(
    readFileSync(getProjectConfigPath(), 'utf-8'),
  );
  const envConfig: EnvConfig = JSON.parse(
    readFileSync(resolve(process.cwd(), FILES.environment), 'utf-8'),
  );
  const env = envConfig[projectConfig.environment];

  // Resolve testsuite
  let suite: ParsedTestSuite | null = null;
  if (args.suite) {
    const parsedPath = getOutputPath('test-analysis.parsed.json');
    if (!existsSync(parsedPath)) {
      log.error(`outputs/<slug>/test-analysis.parsed.json ausente — rode 'npm run agent:parse' primeiro.`);
      process.exit(2);
    }
    const parsed: ParsedAnalysis = JSON.parse(readFileSync(parsedPath, 'utf-8'));
    suite = findSuite(parsed, args.suite);
    if (!suite) {
      log.error(`Testsuite não encontrada: "${args.suite}"`);
      process.exit(2);
    }
  }

  const urls = args.urls ?? (suite ? [inferCanonicalUrl(suite)] : ['/']);
  const slug = suite ? slugify(suite.name) : slugify(urls[0]);
  const outputPath = getReconCachePath(slug);
  const { ttlHours } = getReconConfig();

  // Self-check de cache: se já existe e está fresco, pular varredura (a menos
  // que --force). Se está stale, regenerar por padrão (ou manter com --use-stale).
  if (!args.force) {
    const cache = readReconCache(slug);
    if (cache.exists && !cache.stale) {
      log.info(`Cache fresco (gerado ${cache.generatedAt}, TTL ${ttlHours}h) → ${outputPath}`);
      log.info('Use --force para regenerar.');
      return;
    }
    if (cache.exists && cache.stale && args.useStale) {
      log.warn(`Cache stale (gerado ${cache.generatedAt}), mas --use-stale → mantendo.`);
      return;
    }
    if (cache.exists && cache.stale) {
      log.warn(`Cache stale (gerado ${cache.generatedAt}, TTL ${ttlHours}h) → regenerando.`);
    }
  }

  // Verifica storageState válido
  const storagePath = resolve(process.cwd(), 'outputs/.auth/storage.json');
  if (!existsSync(storagePath)) {
    log.error('storageState ausente — rode `npm run agent:smoke` primeiro pra logar globalmente.');
    process.exit(3);
  }

  log.info(`Recon: ${urls.length} URL(s) a varrer (${env.baseUrl})`);
  const browser = await chromium.launch();
  type Snapshot = { url: string; finalUrl: string; probe: Probe };
  const snapshots: Snapshot[] = [];
  try {
    const context = await browser.newContext({
      baseURL: env.baseUrl,
      ignoreHTTPSErrors: true,
      storageState: storagePath,
    });
    const page = await context.newPage();
    for (const url of urls) {
      log.info(`  → ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('load', { timeout: 15_000 }).catch(() => undefined);
      // Dismiss modais comuns que aparecem no 1º load (Modo administrador, Continuar mesmo assim)
      for (const dismissText of ['Continuar mesmo assim', 'OK', 'Entendi']) {
        const btn = page.getByRole('button', { name: dismissText, exact: true });
        if (await btn.isVisible().catch(() => false)) {
          await btn.click({ timeout: 2_000 }).catch(() => undefined);
          await page.waitForTimeout(500);
          break;
        }
      }
      const finalUrl = page.url();
      const probe = await page.evaluate(probePage);
      snapshots.push({ url, finalUrl, probe });
      log.info(`     ${probe.testIds.length} test-ids · ${probe.rolesAndNames.length} roles · ${probe.labels.length} labels`);
    }
  } finally {
    await browser.close();
  }

  if (snapshots.some((s) => s.probe.signals.hasSyncAlert)) log.warn('⚠️ Sync alert detectado em alguma URL');

  const generatedAt = new Date().toISOString();
  const md = buildMarkdownMulti({
    suite,
    snapshots,
    generatedAt,
    slug,
    ttlHours,
    twygoBaseUrl: env.baseUrl,
  });
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, md, 'utf-8');
  writeReconMeta({
    suiteSlug: slug,
    generatedAt,
    ttlHours,
    filename: basename(outputPath),
  });
  log.info(`Recon salvo → ${outputPath}`);
}

const invokedDirectly = process.argv[1]?.endsWith('recon.ts');
if (invokedDirectly) {
  main().catch((err) => {
    log.error('Recon falhou', err);
    process.exit(1);
  });
}
