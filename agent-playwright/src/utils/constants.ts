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
} as const;

export const FILES = {
  testAnalysis: 'inputs/test-analysis.xml',
  parsedAnalysis: 'outputs/test-analysis.parsed.json',
  xmlSchema: 'templates/xml-schema.xsd',
  testResults: 'outputs/test-results.json',
  testReport: 'outputs/test-report.html',
  pageObjectTemplate: 'templates/page-object-template.ts',
  testTemplate: 'templates/test-template.ts',
  reportTemplate: 'templates/report-template.html',
  environment: 'config/environment.json',
  projectConfig: 'config/project.config.json',
} as const;
