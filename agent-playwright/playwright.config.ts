import { defineConfig, devices } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getEnvByName,
  getProjectSlug,
  listAvailableProjects,
} from './src/utils/environment.js';

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
// Override runtime opcional: TWYGO_ENV sobrepõe o env do project.config.json
// sem editar esse arquivo versionado (ver src/utils/environment.ts#getCurrentEnv
// e tests/setup/global-setup.ts). Mantém login + baseURL no mesmo env.
// getEnvByName expande os `${VAR}` SÓ desta entrada (carregados de .env), então
// não exige credenciais das outras orgs no arquivo. Lança se o env não existir.
const activeEnvName = process.env.TWYGO_ENV?.trim() || projectConfig.environment;
const env = getEnvByName(activeEnvName);

// Padrões de testMatch — UI fica em tests/features/, API em tests/api/
// (CONTRACT.md §16, regra dura #14 do agent-playwright/CLAUDE.md).
const projectTestsBase = PROJECT_ALL ? 'projects/*/tests' : `projects/${activeSlug}/tests`;

const uiTestMatch = [
  'tests/setup/**/*.spec.ts',
  `${projectTestsBase}/features/**/*.spec.ts`,
];

const apiTestMatch = [
  `${projectTestsBase}/api/**/*.spec.ts`,
];

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
    testMatch: uiTestMatch,
    use: { ...devices[deviceKey] },
  };
});

// Projeto 'api' — sem device de browser, baseURL aponta para o host de API.
// Storage state inherited do globalSetup (cookie de sessão pode ser reusado se
// o backend aceitar; bearer token vem via fixture authHeaders — ver skill
// provisionar-token-api-twygo).
const apiProject = {
  name: 'api',
  testMatch: apiTestMatch,
  use: {
    // API_BASE_URL é exigido em .env quando rodar `--project api`. Se ausente,
    // requests caem em string vazia + path → mensagem de erro clara do request fixture.
    baseURL: process.env.API_BASE_URL,
  },
};

// storageState é compartilhado (mesmo Twygo, mesma credencial) — fica em
// outputs/.auth/ na raiz, NÃO subpasta por projeto. Subpasta por projeto se
// aplica apenas a artefatos gerados pela execução (reports, traces, etc.).
const STORAGE_PATH = resolve(__dirname, 'outputs/.auth/storage.json');

// Output dir: por projeto (`outputs/<slug>/`). Em PROJECT_ALL, usa `_all`.
const OUTPUT_SLUG = PROJECT_ALL ? '_all' : activeSlug;
const outputBase = `${projectConfig.reporting.outputDir}/${OUTPUT_SLUG}`;

// testMatch global = união de UI + API. Cada projeto refina via testMatch
// próprio (browserProjects → uiTestMatch; apiProject → apiTestMatch).
const testMatch = [...uiTestMatch, ...apiTestMatch];

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
  // Regressão usa 1 worker pra evitar saturação do tenant staging (criação
  // simultânea de painéis por múltiplos workers fazia listagem demorar >60s
  // pra carregar → tab "Painéis" timeout. Per-suite continua com 4 workers
  // pra rapidez no dia-a-dia. Detectado via env REGRESSION (settado pelo
  // orchestrator no modo --regression).
  workers: process.env.REGRESSION === 'true' ? 1 : 4,
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
        // Sem reporter `html` — alinhado com a decisão de Markdown em
        // chore/agentes-qa-overhaul. O resumo da última run vai pra
        // `outputs/<slug>/playwright-summary.md` (gerado pelo
        // twygo-report-generator) e o detalhamento timestamp-versionado em
        // `outputs/<slug>/reports/<slug>_<ts>/{index,tests,exploratory}.md`.
        // Pra debug profundo de step específico, use o trace de cada falha
        // (em test-artifacts/) com `npx playwright show-trace <path>`.
        ['list'],
        ['json', { outputFile: `${outputBase}/test-results.json` }],
      ],
  outputDir: `${outputBase}/test-artifacts`,
  use: {
    baseURL: env.baseUrl,
    headless: projectConfig.headless,
    actionTimeout: env.timeout,
    navigationTimeout: env.timeout,
    // Captura de evidência: sempre-on em sucesso E falha (regra dura 9.1 do
    // CLAUDE.md — relatório precisa de prova por TC, não só quando quebra).
    // Para desligar num projeto específico, basta `enableTracing: false` /
    // `enableVideo: false` / `screenshotsOnFailure: false` em
    // `projects/<slug>/project.config.json`.
    trace: projectConfig.performance.enableTracing ? 'on' : 'off',
    video: projectConfig.performance.enableVideo ? 'on' : 'retain-on-failure',
    screenshot: projectConfig.reporting.screenshotsOnFailure ? 'on' : 'off',
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
  projects: [...browserProjects, apiProject],
  expect: {
    timeout: 10_000,
  },
});

// O app Twygo usa `data-test-id` (com hífen) em vez do padrão Playwright `data-testid`.
// Sem configurar isso, todos os `getByTestId(...)` falhariam.
// Aplicar via expect.configure não funciona — precisa ser na raiz config.use.
