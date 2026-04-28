import { defineConfig, devices } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
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
  },
  projects: browserProjects,
  expect: {
    timeout: 10_000,
  },
});
