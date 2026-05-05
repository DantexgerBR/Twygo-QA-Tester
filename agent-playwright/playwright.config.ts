import { defineConfig, devices } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// __dirname não existe em ES modules; reconstruímos a partir de import.meta.url
const __dirname = dirname(fileURLToPath(import.meta.url));

type ProjectConfig = {
  testAnalysisFile: string;
  environment: 'staging' | 'production' | string;
  browsers: string[];
  headless: boolean;
  reporting: {
    format: 'html' | 'json' | string;
    outputDir: string;
    screenshotsOnFailure: boolean;
  };
  performance: {
    enableTracing: boolean;
    enableVideo: boolean;
  };
};

type EnvironmentConfig = Record<string, {
  baseUrl: string;
  credentials: { email: string; password: string };
  timeout: number;
}>;

const projectConfig: ProjectConfig = JSON.parse(
  readFileSync(resolve(__dirname, 'config/project.config.json'), 'utf-8'),
);
const environmentConfig: EnvironmentConfig = JSON.parse(
  readFileSync(resolve(__dirname, 'config/environment.json'), 'utf-8'),
);

const env = environmentConfig[projectConfig.environment];
if (!env) {
  throw new Error(
    `Environment "${projectConfig.environment}" not found in config/environment.json`,
  );
}

const browserProjects = projectConfig.browsers.map((browser) => {
  const deviceKey =
    browser === 'chromium'
      ? 'Desktop Chrome'
      : browser === 'firefox'
        ? 'Desktop Firefox'
        : browser === 'webkit'
          ? 'Desktop Safari'
          : 'Desktop Edge';
  return {
    name: browser,
    use: { ...devices[deviceKey] },
  };
});

const STORAGE_PATH = resolve(__dirname, 'outputs/.auth/storage.json');

export default defineConfig({
  testDir: './tests',
  // Specs hand-written / utilitários NÃO entram em execuções de feature/regressivo.
  // - auth/**: spec de referência da LoginPage (storageState global cobre login real).
  // - seed.spec.ts: seed do `playwright-test-generator` (não é caso de teste).
  // Smoke (`tests/setup/smoke.spec.ts`) NÃO entra aqui — é invocado pelo
  // orchestrator com path explícito na fase 1.5 e ainda assim é filtrado fora
  // do regressivo via `--grep-invert Smoke`.
  testIgnore: ['**/auth/**', '**/seed.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 4,
  timeout: 120_000,
  globalSetup: './tests/setup/global-setup.ts',
  reporter: process.env.REGRESSION === 'true'
    ? [
        ['list'],
        ['json', { outputFile: `${projectConfig.reporting.outputDir}/test-results.json` }],
        ['allure-playwright', {
          resultsDir: `${projectConfig.reporting.outputDir}/allure-results`,
          detail: true,
          suiteTitle: false,
        }],
      ]
    : [
        ['list'],
        ['html', { outputFolder: `${projectConfig.reporting.outputDir}/html-report`, open: 'never' }],
        ['json', { outputFile: `${projectConfig.reporting.outputDir}/test-results.json` }],
      ],
  outputDir: `${projectConfig.reporting.outputDir}/test-artifacts`,
  use: {
    baseURL: env.baseUrl,
    headless: projectConfig.headless,
    actionTimeout: env.timeout,
    navigationTimeout: env.timeout,
    trace: projectConfig.performance.enableTracing ? 'retain-on-failure' : 'off',
    video: projectConfig.performance.enableVideo ? 'retain-on-failure' : 'off',
    screenshot: projectConfig.reporting.screenshotsOnFailure ? 'only-on-failure' : 'off',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    testIdAttribute: 'data-test-id',
    // Reusa sessão autenticada gravada por globalSetup. Se ausente,
    // Playwright ignora silenciosamente — specs antigos com loginPage.login()
    // continuam funcionando.
    storageState: STORAGE_PATH,
  },
  projects: browserProjects,
  expect: {
    timeout: 10_000,
  },
});

// O app Twygo usa `data-test-id` (com hífen) em vez do padrão Playwright `data-testid`.
// Sem configurar isso, todos os `getByTestId(...)` falhariam.
// Aplicar via expect.configure não funciona — precisa ser na raiz config.use.
