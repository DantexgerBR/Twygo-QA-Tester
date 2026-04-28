import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { createLogger } from '../../src/utils/logger.js';
import { FILES } from '../../src/utils/constants.js';
import { ensureParentDir } from '../../src/utils/helpers.js';

const log = createLogger('xml-parser');

export type ParsedStep = {
  id: string;
  action: string;
  target?: string;
  locator?: string;
  value?: string;
  description: string;
};

export type ParsedAssertion = {
  id: string;
  type: string;
  target?: string;
  locator?: string;
  value?: string;
  description: string;
};

export type ParsedTestCase = {
  id: string;
  name: string;
  preconditions: string[];
  steps: ParsedStep[];
  assertions: ParsedAssertion[];
};

export type ParsedScenario = {
  id: string;
  name: string;
  description: string;
  testCases: ParsedTestCase[];
};

export type ParsedAnalysis = {
  project: string;
  version: string;
  date: string;
  author?: string;
  scenarios: ParsedScenario[];
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  trimValues: true,
  parseAttributeValue: false,
  isArray: (name) =>
    ['scenario', 'test-case', 'step', 'result', 'condition'].includes(name),
});

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function textOf(node: unknown): string {
  if (typeof node === 'string') return node.trim();
  if (node && typeof node === 'object' && '#text' in (node as Record<string, unknown>)) {
    return String((node as Record<string, unknown>)['#text'] ?? '').trim();
  }
  return '';
}

type RawStep = Record<string, unknown>;
type RawCase = Record<string, unknown>;
type RawScenario = Record<string, unknown>;

function mapStep(raw: RawStep): ParsedStep {
  return {
    id: String(raw['@_id'] ?? ''),
    action: String(raw['@_action'] ?? ''),
    target: raw['@_target'] ? String(raw['@_target']) : undefined,
    locator: raw['@_locator'] ? String(raw['@_locator']) : undefined,
    value: raw['@_value'] ? String(raw['@_value']) : undefined,
    description: textOf(raw),
  };
}

function mapAssertion(raw: RawStep): ParsedAssertion {
  return {
    id: String(raw['@_id'] ?? ''),
    type: String(raw['@_assertion'] ?? ''),
    target: raw['@_target'] ? String(raw['@_target']) : undefined,
    locator: raw['@_locator'] ? String(raw['@_locator']) : undefined,
    value: raw['@_value'] ? String(raw['@_value']) : undefined,
    description: textOf(raw),
  };
}

function mapTestCase(raw: RawCase): ParsedTestCase {
  const preconditionsNode = (raw['preconditions'] as Record<string, unknown>) ?? {};
  const stepsNode = (raw['steps'] as Record<string, unknown>) ?? {};
  const expectedNode = (raw['expected-results'] as Record<string, unknown>) ?? {};

  return {
    id: String(raw['@_id'] ?? ''),
    name: String(raw['@_name'] ?? ''),
    preconditions: asArray<Record<string, unknown> | string>(
      preconditionsNode['condition'] as Record<string, unknown> | string | undefined,
    ).map((c) => textOf(c)),
    steps: asArray<RawStep>(stepsNode['step'] as RawStep | RawStep[] | undefined).map(mapStep),
    assertions: asArray<RawStep>(expectedNode['result'] as RawStep | RawStep[] | undefined).map(
      mapAssertion,
    ),
  };
}

function mapScenario(raw: RawScenario): ParsedScenario {
  return {
    id: String(raw['@_id'] ?? ''),
    name: String(raw['@_name'] ?? ''),
    description: textOf(raw['description']),
    testCases: asArray<RawCase>(raw['test-case'] as RawCase | RawCase[] | undefined).map(
      mapTestCase,
    ),
  };
}

export function parseAnalysisXml(xmlContent: string): ParsedAnalysis {
  const validation = XMLValidator.validate(xmlContent);
  if (validation !== true) {
    throw new Error(`XML inválido: ${validation.err.msg} (linha ${validation.err.line})`);
  }

  const doc = parser.parse(xmlContent) as Record<string, unknown>;
  const root = doc['test-analysis'] as Record<string, unknown> | undefined;
  if (!root) {
    throw new Error('Elemento raiz <test-analysis> ausente.');
  }

  const metadata = (root['metadata'] as Record<string, unknown>) ?? {};
  const scenariosNode = (root['test-scenarios'] as Record<string, unknown>) ?? {};

  return {
    project: textOf(metadata['project']),
    version: textOf(metadata['version']),
    date: textOf(metadata['date']),
    author: textOf(metadata['author']) || undefined,
    scenarios: asArray<RawScenario>(
      scenariosNode['scenario'] as RawScenario | RawScenario[] | undefined,
    ).map(mapScenario),
  };
}

export function validateAnalysis(analysis: ParsedAnalysis): void {
  if (!analysis.project) throw new Error('Metadata <project> obrigatório.');
  if (analysis.scenarios.length === 0) throw new Error('Nenhum <scenario> encontrado.');
  for (const scenario of analysis.scenarios) {
    if (!scenario.id) throw new Error(`Cenário sem id: ${scenario.name}`);
    if (scenario.testCases.length === 0)
      throw new Error(`Cenário ${scenario.id} sem <test-case>.`);
    for (const testCase of scenario.testCases) {
      if (!testCase.id) throw new Error(`Test case sem id no cenário ${scenario.id}.`);
      if (testCase.steps.length === 0)
        throw new Error(`Test case ${testCase.id} sem <step>.`);
    }
  }
}

async function main(): Promise<void> {
  const inputPath = resolve(process.cwd(), process.argv[2] ?? FILES.testAnalysis);
  const outputPath = resolve(process.cwd(), FILES.parsedAnalysis);

  log.info(`Lendo XML: ${inputPath}`);
  const xmlContent = readFileSync(inputPath, 'utf-8');

  const analysis = parseAnalysisXml(xmlContent);
  validateAnalysis(analysis);

  ensureParentDir(outputPath);
  writeFileSync(outputPath, JSON.stringify(analysis, null, 2), 'utf-8');

  const totalCases = analysis.scenarios.reduce((n, s) => n + s.testCases.length, 0);
  log.info(
    `Parser concluído: ${analysis.scenarios.length} cenário(s), ${totalCases} caso(s) de teste → ${outputPath}`,
  );
}

const invokedDirectly =
  import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` ||
  process.argv[1]?.endsWith('parser.ts');

if (invokedDirectly) {
  main().catch((err) => {
    log.error('Falha no parser', err);
    process.exit(1);
  });
}
