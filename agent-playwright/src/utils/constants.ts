export const TIMEOUTS = {
  short: 5_000,
  default: 10_000,
  long: 30_000,
  navigation: 45_000,
} as const;

export const PATHS = {
  inputs: 'inputs',
  outputs: 'outputs',
  pages: 'src/pages',
  features: 'tests/features',
  screenshots: 'outputs/screenshots',
  traces: 'outputs/traces',
  templates: 'templates',
  exploratory: 'outputs/exploratory',
} as const;

export const FILES = {
  testAnalysis: 'inputs/test-analysis.xml',
  parsedAnalysis: 'outputs/test-analysis.parsed.json',
  testResults: 'outputs/test-results.json',
  pageObjectTemplate: 'templates/page-object-template.ts',
  testTemplate: 'templates/test-template.ts',
  environment: 'config/environment.json',
  projectConfig: 'config/project.config.json',
  exploratoryFindings: 'outputs/exploratory-findings.json',
} as const;
