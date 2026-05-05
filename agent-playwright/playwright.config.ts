import { defineConfig, devices } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getProjectSlug, listAvailableProjects } from './src/utils/environment.js';

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

// Resolve qual projeto está ativo nesta execução. Em modo "PROJECT_ALL=true"
// (regressivo cumulativo), não há projeto ativo único — usamos o primeiro
// disponível só para herdar `environment` e `headless`/`browsers`/etc.
// Specs de TODOS os projetos são incluídos via testMatch.
const PROJECT_ALL = process.env.PROJECT_ALL === 'true';
const activeSlug = PROJECT_ALL
  ? (listAvailableProjects()[0] ?? (() => { throw new Error('Nenhum projeto em projects/.'); })())
  : getProjectSlug();

const projectConfig: ProjectConfig = JSON.parse(
  readFileSync(
    resolve(__dirname, 'projects', activeSlug, 'project.config.json'),
    'utf-8',
  ),
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

// storageState é compartilhado (mesmo Twygo, mesma credencial) — fica em
// outputs/.auth/ na raiz, NÃO subpasta por projeto. Subpasta por projeto se
// aplica apenas a artefatos gerados pela execução (reports, traces, etc.).
const STORAGE_PATH = resolve(__dirname, 'outputs/.auth/storage.json');

// Output dir: por projeto (`outputs/<slug>/`). Em PROJECT_ALL, usa `_all`.
const OUTPUT_SLUG = PROJECT_ALL ? '_all' : activeSlug;
const outputBase = `${projectConfig.reporting.outputDir}/${OUTPUT_SLUG}`;

// testMatch controla quais specs entram. tests/setup/ + tests/auth/ são
// genéricos (sempre rodam). projects/<slug>/tests/ depende do modo:
// - PROJECT específico: só aquele projeto
// - PROJECT_ALL=true: todos os projetos
const testMatch = PROJECT_ALL
  ? [
      'tests/setup/**/*.spec.ts',
      'tests/auth/**/*.spec.ts',
      'projects/*/tests/**/*.spec.ts',
    ]
  : [
      'tests/setup/**/*.spec.ts',
      'tests/auth/**/*.spec.ts',
      `projects/${activeSlug}/tests/**/*.spec.ts`,
    ];

export default defineConfig({
  testDir: './',
  testMatch,
  // Specs hand-written / utilitários NÃO entram em execuções de feature/regressivo.
  // - auth/**: spec de referência da LoginPage (storageState global cobre login real).
  // - seed.spec.ts: seed do `playwright-test-generator` (não é caso de teste).
  // Smoke (`tests/setup/smoke.spec.ts`) NÃO entra aqui — é invocado pelo
  // orchestrator com path explícito na fase 1.5 e ainda assim é filtrado fora
  // do regressivo via `--grep-invert Smoke`.
  testIgnore: ['**/auth/**', '**/seed.spec.ts', '**/node_modules/**'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 4,
  timeout: 120_000,
  globalSetup: './tests/setup/global-setup.ts',
  reporter: process.env.REGRESSION === 'true'
    ? [
        ['list'],
        ['json', { outputFile: `${outputBase}/test-results.json` }],
        ['allure-playwright', {
          resultsDir: `${outputBase}/allure-results`,
          detail: true,
          suiteTitle: false,
        }],
      ]
    : [
        ['list'],
        ['html', { outputFolder: `${outputBase}/html-report`, open: 'never' }],
        ['json', { outputFile: `${outputBase}/test-results.json` }],
      ],
  outputDir: `${outputBase}/test-artifacts`,
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
