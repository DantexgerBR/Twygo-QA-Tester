import { test as base, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  ExploratoryCollector,
  DEFAULT_PROBE_CONFIG,
  isStrictModeEnv,
  summarizeFindings,
  writeSuiteFindings,
  type ProbeConfig,
} from '../utils/exploratory.js';
import { FILES } from '../utils/constants.js';

let cachedConfig: ProbeConfig | null = null;

function loadProbeConfig(): ProbeConfig {
  if (cachedConfig) return cachedConfig;
  const path = resolve(process.cwd(), FILES.projectConfig);
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

      if ((config.strict || isStrictModeEnv()) && collector.findings.length > 0) {
        const summary = summarizeFindings(collector.findings);
        if (summary.errors > 0) {
          const sample = collector.findings.find((f) => f.severity === 'error');
          throw new Error(
            `Modo strict: ${summary.errors} erro(s) exploratório(s) detectado(s). Ex.: ${sample?.message}`,
          );
        }
      }
    },
    { auto: true },
  ],
});

export { expect };
