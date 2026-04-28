import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { createLogger } from '../../../src/utils/logger.js';
import { FILES } from '../../../src/utils/constants.js';
import { ensureParentDir } from '../../../src/utils/helpers.js';

const log = createLogger('xml-parser');

/**
 * Tipos do JSON parseado a partir de XML TestLink padrão:
 *   <testsuite name="">
 *     <testsuite name="bloco">
 *       <testcase name="...">
 *         <summary>...</summary>
 *         <preconditions>...</preconditions>
 *         <execution_type>1|2</execution_type>
 *         <importance>1|2|3</importance>
 *         <steps>
 *           <step>
 *             <step_number>1</step_number>
 *             <actions>prosa em PT-BR</actions>
 *             <expectedresults>prosa em PT-BR</expectedresults>
 *             <execution_type>1|2</execution_type>
 *           </step>
 *         </steps>
 *       </testcase>
 *     </testsuite>
 *   </testsuite>
 *
 * `<actions>` e `<expectedresults>` carregam texto livre (frequentemente em
 * PT-BR) — não há códigos semânticos como `action="fill"`. A interpretação
 * para Playwright é responsabilidade do orquestrador, não do parser.
 */

export type ParsedStep = {
  stepNumber: number;
  actions: string;
  expectedResults: string;
  executionType: number;
};

export type ParsedTestCase = {
  name: string;
  internalId?: string;
  externalId?: string;
  summary: string;
  preconditions: string;
  executionType: number;
  importance: number;
  steps: ParsedStep[];
};

export type ParsedTestSuite = {
  name: string;
  testCases: ParsedTestCase[];
  childSuites: ParsedTestSuite[];
};

export type AnalysisTotals = {
  suites: number;
  testCases: number;
  steps: number;
};

export type ParsedAnalysis = {
  rootSuite: ParsedTestSuite;
  totals: AnalysisTotals;
};

const xmlReader = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  trimValues: false,
  parseAttributeValue: false,
  isArray: (name) => ['testsuite', 'testcase', 'step'].includes(name),
});

const ENTITY_MAP: Record<string, string> = {
  gt: '>',
  lt: '<',
  amp: '&',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeHtmlEntities(text: string): string {
  return text.replace(
    /&(gt|lt|amp|quot|apos|nbsp);/g,
    (match, name: string) => ENTITY_MAP[name] ?? match,
  );
}

function cleanText(input: unknown): string {
  if (input === null || input === undefined) return '';
  let text: string;
  if (typeof input === 'string') {
    text = input;
  } else if (typeof input === 'number' || typeof input === 'boolean') {
    text = String(input);
  } else if (typeof input === 'object' && '#text' in (input as Record<string, unknown>)) {
    const t = (input as Record<string, unknown>)['#text'];
    text = typeof t === 'string' ? t : String(t ?? '');
  } else {
    text = String(input);
  }
  text = decodeHtmlEntities(text);
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

type RawNode = Record<string, unknown>;

function mapStep(raw: RawNode): ParsedStep {
  return {
    stepNumber: Number(cleanText(raw['step_number'])) || 0,
    actions: cleanText(raw['actions']),
    expectedResults: cleanText(raw['expectedresults']),
    executionType: Number(cleanText(raw['execution_type'])) || 1,
  };
}

function mapTestCase(raw: RawNode): ParsedTestCase {
  const stepsContainer = (raw['steps'] as RawNode | undefined) ?? {};
  const stepsRaw = asArray<RawNode>(
    stepsContainer['step'] as RawNode | RawNode[] | undefined,
  );
  const tc: ParsedTestCase = {
    name: cleanText(raw['@_name']),
    summary: cleanText(raw['summary']),
    preconditions: cleanText(raw['preconditions']),
    executionType: Number(cleanText(raw['execution_type'])) || 1,
    importance: Number(cleanText(raw['importance'])) || 2,
    steps: stepsRaw.map(mapStep),
  };
  if (raw['@_internalid']) tc.internalId = String(raw['@_internalid']);
  if (raw['@_externalid']) tc.externalId = String(raw['@_externalid']);
  return tc;
}

function mapTestSuite(raw: RawNode): ParsedTestSuite {
  return {
    name: cleanText(raw['@_name']),
    testCases: asArray<RawNode>(
      raw['testcase'] as RawNode | RawNode[] | undefined,
    ).map(mapTestCase),
    childSuites: asArray<RawNode>(
      raw['testsuite'] as RawNode | RawNode[] | undefined,
    ).map(mapTestSuite),
  };
}

function computeTotals(suite: ParsedTestSuite): AnalysisTotals {
  let suites = 1;
  let testCases = suite.testCases.length;
  let steps = suite.testCases.reduce((n, tc) => n + tc.steps.length, 0);
  for (const child of suite.childSuites) {
    const c = computeTotals(child);
    suites += c.suites;
    testCases += c.testCases;
    steps += c.steps;
  }
  return { suites, testCases, steps };
}

export function parseTestLinkXml(xmlContent: string): ParsedAnalysis {
  const validation = XMLValidator.validate(xmlContent);
  if (validation !== true) {
    throw new Error(
      `XML mal-formado: ${validation.err.msg} (linha ${validation.err.line})`,
    );
  }
  const doc = xmlReader.parse(xmlContent) as Record<string, unknown>;
  const rootRaw = doc['testsuite'];
  if (!rootRaw) {
    throw new Error(
      'Elemento raiz <testsuite> ausente. O XML deve seguir o formato TestLink.',
    );
  }
  const rootNode = (Array.isArray(rootRaw) ? rootRaw[0] : rootRaw) as RawNode;
  const rootSuite = mapTestSuite(rootNode);
  return { rootSuite, totals: computeTotals(rootSuite) };
}

function walkAndValidate(suite: ParsedTestSuite, path: string[]): void {
  const here = [...path, suite.name || '<root>'];
  for (const tc of suite.testCases) {
    if (!tc.name) {
      throw new Error(`Testcase sem nome em ${here.join(' > ')}`);
    }
    if (tc.steps.length === 0) {
      throw new Error(`Testcase "${tc.name}" sem <step> em ${here.join(' > ')}`);
    }
  }
  for (const child of suite.childSuites) {
    walkAndValidate(child, here);
  }
}

export function validateAnalysis(analysis: ParsedAnalysis): void {
  if (analysis.totals.testCases === 0) {
    throw new Error('Nenhum <testcase> encontrado no XML.');
  }
  walkAndValidate(analysis.rootSuite, []);
}

type ProjectConfigPartial = { testAnalysisFile?: string };

function resolveDefaultInputPath(): string {
  const cfgPath = resolve(process.cwd(), FILES.projectConfig);
  if (existsSync(cfgPath)) {
    try {
      const cfg = JSON.parse(readFileSync(cfgPath, 'utf-8')) as ProjectConfigPartial;
      if (cfg.testAnalysisFile) {
        return resolve(process.cwd(), cfg.testAnalysisFile);
      }
    } catch {
      /* config ilegível: cai no fallback */
    }
  }
  return resolve(process.cwd(), 'inputs/test-analysis.xml');
}

async function main(): Promise<void> {
  const cliArg = process.argv[2];
  const inputPath = cliArg
    ? resolve(process.cwd(), cliArg)
    : resolveDefaultInputPath();
  const outputPath = resolve(process.cwd(), FILES.parsedAnalysis);

  if (!existsSync(inputPath)) {
    throw new Error(
      `XML não encontrado: ${inputPath}. Passe o caminho como argumento ou ajuste 'testAnalysisFile' em ${FILES.projectConfig}.`,
    );
  }

  log.info(`Lendo XML TestLink: ${inputPath}`);
  const xmlContent = readFileSync(inputPath, 'utf-8');

  const analysis = parseTestLinkXml(xmlContent);
  validateAnalysis(analysis);

  ensureParentDir(outputPath);
  writeFileSync(outputPath, JSON.stringify(analysis, null, 2), 'utf-8');

  log.info(
    `Parser concluído: ${analysis.totals.suites} testsuite(s), ${analysis.totals.testCases} testcase(s), ${analysis.totals.steps} step(s) → ${outputPath}`,
  );
}

const invokedDirectly = process.argv[1]?.endsWith('parser.ts');

if (invokedDirectly) {
  main().catch((err) => {
    log.error('Falha no parser', err);
    process.exit(1);
  });
}
