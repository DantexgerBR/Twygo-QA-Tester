import { test as base, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import {
  ExploratoryCollector,
  DEFAULT_PROBE_CONFIG,
  isStrictModeEnv,
  summarizeFindings,
  writeSuiteFindings,
  writeActiveProbeResults,
  type ProbeConfig,
} from '../utils/exploratory.js';
import { getProjectConfigPath } from '../utils/environment.js';

let cachedConfig: ProbeConfig | null = null;

function loadProbeConfig(): ProbeConfig {
  if (cachedConfig) return cachedConfig;
  // project.config.json[exploratory] tem a config de probes específica do
  // projeto ativo. Se ausente (ou nenhum projeto resolvido), cai pro default.
  let path: string;
  try {
    path = getProjectConfigPath();
  } catch {
    cachedConfig = DEFAULT_PROBE_CONFIG;
    return cachedConfig;
  }
  if (!existsSync(path)) {
    cachedConfig = DEFAULT_PROBE_CONFIG;
    return cachedConfig;
  }
  const raw = JSON.parse(readFileSync(path, 'utf-8')) as { exploratory?: Partial<ProbeConfig> };
  const userCfg = raw.exploratory ?? {};
  cachedConfig = {
    ...DEFAULT_PROBE_CONFIG,
    ...userCfg,
    probes: { ...DEFAULT_PROBE_CONFIG.probes, ...(userCfg.probes ?? {}) },
    ignoredHttpStatuses: userCfg.ignoredHttpStatuses ?? DEFAULT_PROBE_CONFIG.ignoredHttpStatuses,
    ignoredHostnames: userCfg.ignoredHostnames ?? DEFAULT_PROBE_CONFIG.ignoredHostnames,
    // Concatena defaults Twygo-wide com extensões do projeto (vs. substituir).
    // Projeto pode silenciar mais erros conhecidos sem perder os globais.
    ignoredMessagePatterns: [
      ...DEFAULT_PROBE_CONFIG.ignoredMessagePatterns,
      ...(userCfg.ignoredMessagePatterns ?? []),
    ],
    scopedRoutes: userCfg.scopedRoutes ?? DEFAULT_PROBE_CONFIG.scopedRoutes,
    scopedKeywords: userCfg.scopedKeywords ?? DEFAULT_PROBE_CONFIG.scopedKeywords,
    activeProbes: { ...DEFAULT_PROBE_CONFIG.activeProbes, ...(userCfg.activeProbes ?? {}) },
  };
  return cachedConfig;
}

type ExploratoryFixtures = {
  exploratory: ExploratoryCollector;
};

/**
 * `test` substitui o `@playwright/test` original e instala probes exploratórios:
 * console errors, page errors, HTTP 4xx/5xx, broken images e snapshot de
 * elementos interativos por URL. Findings são gravados em outputs/exploratory/
 * e agregados pelo skill twygo-exploratory-validator.
 *
 * A fixture é `auto: true` — ativa em todo teste sem precisar ser destruturada.
 */
export const test = base.extend<ExploratoryFixtures>({
  exploratory: [
    async ({ page }, use, testInfo) => {
      const config = loadProbeConfig();
      const collector = new ExploratoryCollector(config);
      collector.attach(page);
      const startedAt = new Date().toISOString();

      await use(collector);

      if (!config.enabled) return;

      await collector.runEndOfTestProbes(page);

      const suiteTitle = testInfo.titlePath[1] ?? testInfo.titlePath[0] ?? 'unknown-suite';
      writeSuiteFindings({
        suite: suiteTitle,
        test: testInfo.title,
        file: testInfo.file,
        workerIndex: testInfo.workerIndex,
        startedAt,
        finishedAt: new Date().toISOString(),
        findings: collector.findings,
        coverage: collector.coverage,
      });

      // Active probes: rodam apenas em páginas in-scope, e só os habilitados em
      // config.activeProbes. Salvam em arquivo separado pra não poluir o
      // bucket principal de findings passivos.
      const anyActiveProbeOn = Object.values(config.activeProbes).some(Boolean);
      if (anyActiveProbeOn) {
        const url = page.url();
        const byProbe = await collector.runActiveProbes(page).catch(() => ({}));
        if (Object.keys(byProbe).length > 0) {
          writeActiveProbeResults({
            suite: suiteTitle,
            test: testInfo.title,
            file: testInfo.file,
            workerIndex: testInfo.workerIndex,
            url,
            startedAt,
            finishedAt: new Date().toISOString(),
            inScope: collector.pageInScope(url),
            byProbe,
          });
        }
      }

      // Strict mode considera apenas findings in-scope — fora do escopo
      // (ex.: requests de telemetria, console errors de outros módulos) não
      // promove falha. Auditoria desses findings continua acessível no bucket
      // out-of-scope do relatório.
      if ((config.strict || isStrictModeEnv()) && collector.findings.length > 0) {
        const summary = summarizeFindings(collector.findings, { onlyInScope: true });
        if (summary.errors > 0) {
          const sample = collector.findings.find(
            (f) => f.severity === 'error' && f.inScope !== false,
          );
          throw new Error(
            `Modo strict: ${summary.errors} erro(s) exploratório(s) in-scope detectado(s). Ex.: ${sample?.message}`,
          );
        }
      }
    },
    { auto: true },
  ],
});

export { expect };
