/**
 * twygo-md-parser
 *
 * Lê o MD canônico (test-analysis.md) produzido pelo agent-at v1+ e produz
 * um JSON estruturalmente compatível com o output do twygo-xml-parser
 * (mesmo formato consumido pelo twygo-test-orchestrator), com campos extras
 * que só existem no MD canônico (executor, playbooks, org, catálogos).
 *
 * Schema do MD: CONTRACT.md §4 (raiz do monorepo).
 *
 * Coexistência com twygo-xml-parser:
 * - Mesmos tipos `ParsedStep`, `ParsedTestCase`, `ParsedTestSuite`,
 *   `ParsedAnalysis` (campos extras opcionais).
 * - Sem flag-day: orchestrator escolhe parser baseado no path do input
 *   (.md → este parser; .xml → twygo-xml-parser legado).
 *
 * Uso (CLI):
 *   npm run agent:parse-md                       # usa testAnalysisFile do project.config.json
 *   npm run agent:parse-md -- inputs/foo.md      # explicita o arquivo
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { parse as parseYaml } from 'yaml';
import { createLogger } from '../../../src/utils/logger.js';
import {
  getOutputPath,
  getProjectConfigPath,
  loadProjectConfig,
  resolveProjectPath,
} from '../../../src/utils/environment.js';
import { ensureParentDir } from '../../../src/utils/helpers.js';

const log = createLogger('md-parser');

// ============================================================================
// Tipos (compatíveis com twygo-xml-parser + extensões do CONTRACT.md v1)
// ============================================================================

export type ParsedStep = {
  stepNumber: number;
  actions: string;
  expectedResults: string;
  executionType: number;
};

export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type TcType = 'ui' | 'api' | 'db' | 'mixed';
export type Executor = 'playwright' | 'api' | 'db' | 'pentest';

export type ParsedTestCase = {
  name: string;
  internalId?: string;
  externalId?: string;
  summary: string;
  preconditions: string;
  executionType: number;
  importance: number;
  steps: ParsedStep[];
  // ===== Extras do MD canônico (CONTRACT.md v1) =====
  priority?: Priority;
  type?: TcType;
  playbooksAdicionais?: string[];
};

export type ParsedTestSuite = {
  name: string;
  testCases: ParsedTestCase[];
  childSuites: ParsedTestSuite[];
  // ===== Extras do MD canônico =====
  executor?: Executor;
  org?: string;
  playbooks?: string[];
  preconditionsList?: string[];
};

export type AnalysisTotals = {
  suites: number;
  testCases: number;
  steps: number;
};

export type ProjectFrontmatter = {
  contract_version: number;
  at_version: number;
  project: string;
  project_name: string;
  generated_at: string;
  env: string;
  env_secondary?: string;
  source_docs?: string[];
  totals?: { suites: number; test_cases: number; steps: number };
};

export type ParsedAnalysis = {
  rootSuite: ParsedTestSuite;
  totals: AnalysisTotals;
  // ===== Extras do MD canônico =====
  projectFrontmatter?: ProjectFrontmatter;
  catalogs?: Record<string, string>;
};

// ============================================================================
// Constantes de mapeamento
// ============================================================================

// Mapeamento canônico de prioridade (decisão 2026-05-19, alinhado com
// agent-at/scripts/md_canonical_parser.py):
//   critical → importance 3 / Allure 'critical'
//   high     → importance 3 / Allure 'normal'
//   medium   → importance 2 / Allure 'normal'
//   low      → importance 1 / Allure 'minor'
const PRIORITY_TO_IMPORTANCE: Record<Priority, number> = {
  critical: 3,
  high: 3,
  medium: 2,
  low: 1,
};

const PRIORITY_TO_ALLURE_SEVERITY: Record<Priority, string> = {
  critical: 'critical',
  high: 'normal',
  medium: 'normal',
  low: 'minor',
};

function priorityImportance(p: string | undefined): number {
  if (!p) return 2;
  return PRIORITY_TO_IMPORTANCE[p.toLowerCase() as Priority] ?? 2;
}

export function priorityToAllureSeverity(p: string | undefined): string {
  if (!p) return 'normal';
  return PRIORITY_TO_ALLURE_SEVERITY[p.toLowerCase() as Priority] ?? 'normal';
}

function tcExecutionType(t: string | undefined): number {
  // ui/api/db = automated (2); mixed ou undefined = manual (1)
  if (!t) return 1;
  return ['ui', 'api', 'db'].includes(t.toLowerCase()) ? 2 : 1;
}

const CATALOG_HEADERS: Record<string, string> = {
  '## Dados de teste': 'dados_de_teste',
  '## Textos literais': 'textos_literais',
  '## Modais relevantes': 'modais_relevantes',
  '## Endpoints (referência)': 'endpoints',
  '## Endpoints': 'endpoints',
  '## Campos e validações': 'campos_e_validacoes',
};

// ============================================================================
// Helpers
// ============================================================================

function preconditionsAsText(pre: string[] | string | undefined): string {
  if (!pre) return '';
  if (typeof pre === 'string') return pre.trim();
  return pre
    .map((s) => String(s).trim())
    .filter((s) => s)
    .join('\n');
}

function splitTopLevelFrontmatter(md: string): { frontmatter: Record<string, unknown>; rest: string } {
  const trimmed = md.replace(/^\uFEFF/, '').trimStart();
  if (!trimmed.startsWith('---')) {
    throw new Error('MD canônico precisa começar com frontmatter YAML delimitado por ---');
  }
  const endIdx = trimmed.indexOf('\n---', 3);
  if (endIdx === -1) {
    throw new Error('Frontmatter de raiz não fechado (faltou --- de fechamento)');
  }
  const fmBlock = trimmed.slice(3, endIdx);
  const rest = trimmed.slice(endIdx + 4).replace(/^\n+/, '');
  let fm: unknown;
  try {
    fm = parseYaml(fmBlock);
  } catch (e) {
    throw new Error(`YAML inválido no frontmatter de projeto: ${(e as Error).message}`);
  }
  if (!fm || typeof fm !== 'object') {
    throw new Error('Frontmatter de projeto vazio ou não é objeto');
  }
  return { frontmatter: fm as Record<string, unknown>, rest };
}

function extractCatalogs(body: string): { catalogs: Record<string, string>; suitesRegion: string } {
  // Primeiro `---` em linha sozinha marca início das suítes
  const suiteStart = body.search(/^---\s*$/m);
  const catalogRegion = suiteStart === -1 ? body : body.slice(0, suiteStart);
  const suitesRegion = suiteStart === -1 ? '' : body.slice(suiteStart);

  const catalogs: Record<string, string> = {};
  const lines = catalogRegion.split('\n');
  let currentKey: string | null = null;
  let buffer: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    const matchedKey = CATALOG_HEADERS[trimmedLine];
    if (matchedKey !== undefined) {
      if (currentKey) catalogs[currentKey] = buffer.join('\n').trim();
      currentKey = matchedKey;
      buffer = [];
    } else if (currentKey !== null) {
      buffer.push(line);
    }
  }
  if (currentKey) catalogs[currentKey] = buffer.join('\n').trim();

  return { catalogs, suitesRegion };
}

function parseStepsBlock(text: string): ParsedStep[] {
  const steps: ParsedStep[] = [];
  // Encontra posições de cada passo (linhas começando com "N. ").
  // Estratégia em 2 passos (mais robusta que regex grande com lookahead):
  //   1. Captura todas as posições onde inicia "N. " no começo de linha
  //   2. Para cada uma, extrai action (resto da primeira linha) + expected
  //      (linha indentada com "→ ")
  const startPattern = /^(\d+)\.\s+/gm;
  const starts: { num: number; pos: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = startPattern.exec(text)) !== null) {
    starts.push({ num: parseInt(m[1], 10), pos: m.index });
  }
  for (let i = 0; i < starts.length; i++) {
    const { num, pos } = starts[i];
    const endPos = i + 1 < starts.length ? starts[i + 1].pos : text.length;
    const block = text.slice(pos, endPos);
    const blockMatch = block.match(/^\d+\.\s+([\s\S]+?)\n\s+→\s+([\s\S]+)$/);
    if (!blockMatch) {
      throw new Error(
        `Passo ${num} mal-formado. Formato esperado: 'N. <ação>\\n   → <resultado>'. ` +
          `Trecho: ${block.slice(0, 120)}...`,
      );
    }
    const action = blockMatch[1].replace(/\s+/g, ' ').trim();
    const expected = blockMatch[2].replace(/\s+/g, ' ').trim();
    steps.push({
      stepNumber: num,
      actions: action,
      expectedResults: expected,
      executionType: 1, // default; sobrescrito pelo TC pai via tcExecutionType
    });
  }
  if (steps.length === 0 && text.trim()) {
    throw new Error(
      `Bloco de passos vazio ou não-parseável. Cada passo precisa do formato ` +
        `'N. <ação>\\n   → <resultado>'. Trecho: ${text.slice(0, 120)}...`,
    );
  }
  // Re-numera caso o usuário tenha pulado números — preserva ordem do MD
  steps.forEach((s, i) => {
    s.stepNumber = i + 1;
  });
  return steps;
}

function parseTcMetaLine(line: string, key: string): string | null {
  // Match: **<key>**: <valor>
  const m = line.match(new RegExp(`^\\*\\*${key}\\*\\*:\\s*(.+)$`));
  return m ? m[1].trim() : null;
}

function parsePlaybooksAdicionais(value: string): string[] {
  const trimmed = value.trim();
  if (trimmed === '[]' || trimmed === '') return [];
  if (trimmed.startsWith('[')) {
    try {
      const arr = parseYaml(trimmed);
      return Array.isArray(arr) ? arr.map(String) : [];
    } catch {
      return [];
    }
  }
  return trimmed
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s);
}

function parseTestCaseBlock(
  block: string,
  suitePreconditions: string,
): ParsedTestCase {
  const lines = block.split('\n');
  const header = lines[0].trim();
  const headerMatch = header.match(/^##\s+TC(\d+)\s*[—–-]\s*(.+)$/);
  if (!headerMatch) {
    throw new Error(`Header de TC inválido: ${JSON.stringify(header)}`);
  }
  const title = headerMatch[2].trim();
  const body = lines.slice(1).join('\n');

  // Metadados estruturados
  let priority: Priority | undefined;
  let type: TcType | undefined;
  let playbooksAdicionais: string[] = [];

  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line.startsWith('**')) continue;
    const prio = parseTcMetaLine(line, 'Prioridade');
    if (prio) {
      priority = prio.toLowerCase() as Priority;
      continue;
    }
    const t = parseTcMetaLine(line, 'Tipo');
    if (t) {
      const tLower = t.toLowerCase() as TcType;
      // Restrição v1: 'mixed' é reservado para validações secundárias (V2).
      if (tLower === 'mixed') {
        throw new Error(
          `TC "${title}": type='mixed' não suportado em v1 do CONTRACT.md. ` +
            `Use ui/api/db. 'mixed' fica para V2 (validações secundárias).`,
        );
      }
      type = tLower;
      continue;
    }
    const pb = parseTcMetaLine(line, 'Playbooks adicionais');
    if (pb !== null) {
      playbooksAdicionais = parsePlaybooksAdicionais(pb);
      continue;
    }
  }

  // Split por header H3 (`### `) para isolar Objetivo / Passos / outros.
  // Evita regex com flag `m` + `$` lookahead (que casava muito cedo).
  const h3Sections = body.split(/^###\s+/m);
  let objective = '';
  let stepsText = '';
  for (const section of h3Sections.slice(1)) {
    if (/^Objetivo\b/.test(section)) {
      objective = section.replace(/^Objetivo\s*\n?/, '').trim();
    } else if (/^Passos\b/.test(section)) {
      stepsText = section.replace(/^Passos\s*\n?/, '').trim();
    }
  }
  if (!stepsText) {
    throw new Error(`TC "${title}" não tem seção '### Passos'`);
  }
  const steps = parseStepsBlock(stepsText);
  // Aplica execution_type herdado do TC
  const execType = tcExecutionType(type);
  steps.forEach((s) => {
    s.executionType = execType;
  });

  const tc: ParsedTestCase = {
    name: title,
    summary: objective,
    preconditions: suitePreconditions,
    executionType: execType,
    importance: priorityImportance(priority),
    steps,
    priority,
    type,
    playbooksAdicionais,
  };

  if (steps.length === 0) {
    throw new Error(`TC "${title}" sem passos válidos`);
  }

  return tc;
}

function parseSuites(region: string): ParsedTestSuite[] {
  const suites: ParsedTestSuite[] = [];
  // Encontra blocos --- ... --- (frontmatter de suíte)
  const fmRegex = /^---\s*\n([\s\S]*?)\n---\s*$/gm;
  const fms: { start: number; end: number; text: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = fmRegex.exec(region)) !== null) {
    fms.push({ start: m.index, end: m.index + m[0].length, text: m[1] });
  }

  for (let i = 0; i < fms.length; i++) {
    const fm = fms[i];
    const bodyStart = fm.end;
    const bodyEnd = i + 1 < fms.length ? fms[i + 1].start : region.length;
    const suiteBody = region.slice(bodyStart, bodyEnd).trim();

    let suiteFm: Record<string, unknown>;
    try {
      const parsed = parseYaml(fm.text);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('frontmatter vazio');
      }
      suiteFm = parsed as Record<string, unknown>;
    } catch (e) {
      throw new Error(`Suíte #${i + 1}: frontmatter inválido — ${(e as Error).message}`);
    }

    const suiteName = String(suiteFm.suite ?? '').trim();
    if (!suiteName) {
      throw new Error(`Suíte #${i + 1}: campo obrigatório 'suite' ausente`);
    }
    const executor = suiteFm.executor as Executor | undefined;
    if (!executor) {
      throw new Error(`Suíte "${suiteName}": campo obrigatório 'executor' ausente`);
    }
    // Restrição v1: apenas executor 'playwright' é processável pelo orchestrator.
    // api/db/pentest ficam para V2 do CONTRACT.md.
    if (executor !== 'playwright') {
      throw new Error(
        `Suíte "${suiteName}": executor='${executor}' não suportado em v1 do CONTRACT.md. ` +
          `Use 'playwright' (único valor aceito). Outros executores ficam para V2.`,
      );
    }

    const preconditionsList = Array.isArray(suiteFm.preconditions)
      ? (suiteFm.preconditions as unknown[]).map(String)
      : typeof suiteFm.preconditions === 'string'
        ? [suiteFm.preconditions]
        : [];
    const suitePreconditionsText = preconditionsAsText(preconditionsList);

    // Parsea TCs
    const tcs: ParsedTestCase[] = [];
    const tcHeaderRegex = /^##\s+TC\d+/gm;
    const tcPositions: number[] = [];
    let tcm: RegExpExecArray | null;
    while ((tcm = tcHeaderRegex.exec(suiteBody)) !== null) {
      tcPositions.push(tcm.index);
    }
    for (let ti = 0; ti < tcPositions.length; ti++) {
      const tcStart = tcPositions[ti];
      const tcEnd = ti + 1 < tcPositions.length ? tcPositions[ti + 1] : suiteBody.length;
      const tcBlock = suiteBody.slice(tcStart, tcEnd).trim();
      const tc = parseTestCaseBlock(tcBlock, suitePreconditionsText);
      tcs.push(tc);
    }

    if (tcs.length === 0) {
      throw new Error(`Suíte "${suiteName}": nenhum TC encontrado`);
    }

    suites.push({
      name: suiteName,
      testCases: tcs,
      childSuites: [],
      executor,
      org: typeof suiteFm.org === 'string' ? suiteFm.org : undefined,
      playbooks: Array.isArray(suiteFm.playbooks)
        ? (suiteFm.playbooks as unknown[]).map(String)
        : undefined,
      preconditionsList,
    });
  }

  if (suites.length === 0) {
    throw new Error(
      'Nenhuma suíte encontrada no MD canônico. Cada suíte precisa de bloco YAML --- ... --- ' +
        "com 'suite:' e 'executor:'.",
    );
  }

  return suites;
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

// ============================================================================
// Entrada pública
// ============================================================================

export function parseCanonicalMd(content: string): ParsedAnalysis {
  // Normaliza line endings (CRLF/CR → LF) para regexes funcionarem em
  // Windows (arquivos saídos do agent-at podem vir com CRLF).
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const { frontmatter: projectFmRaw, rest } = splitTopLevelFrontmatter(normalized);
  const required = ['contract_version', 'at_version', 'project', 'project_name', 'generated_at', 'env'];
  const missing = required.filter((k) => !(k in projectFmRaw));
  if (missing.length) {
    throw new Error(`Frontmatter de projeto sem campos obrigatórios: ${missing.join(', ')}`);
  }

  const projectFrontmatter: ProjectFrontmatter = {
    contract_version: Number(projectFmRaw.contract_version),
    at_version: Number(projectFmRaw.at_version),
    project: String(projectFmRaw.project),
    project_name: String(projectFmRaw.project_name),
    generated_at: String(projectFmRaw.generated_at),
    env: String(projectFmRaw.env),
    env_secondary: projectFmRaw.env_secondary ? String(projectFmRaw.env_secondary) : undefined,
    source_docs: Array.isArray(projectFmRaw.source_docs)
      ? (projectFmRaw.source_docs as unknown[]).map(String)
      : undefined,
    totals: projectFmRaw.totals as { suites: number; test_cases: number; steps: number } | undefined,
  };

  const { catalogs, suitesRegion } = extractCatalogs(rest);
  const suites = parseSuites(suitesRegion);

  const rootSuite: ParsedTestSuite = {
    name: '',
    testCases: [],
    childSuites: suites,
  };

  return {
    rootSuite,
    totals: computeTotals(rootSuite),
    projectFrontmatter,
    catalogs,
  };
}

export function validateAnalysis(analysis: ParsedAnalysis): void {
  if (analysis.totals.testCases === 0) {
    throw new Error('Nenhum testcase encontrado no MD canônico');
  }
  for (const suite of analysis.rootSuite.childSuites) {
    for (const tc of suite.testCases) {
      if (!tc.name) {
        throw new Error(`Testcase sem nome em "${suite.name}"`);
      }
      if (tc.steps.length === 0) {
        throw new Error(`Testcase "${tc.name}" sem passos em "${suite.name}"`);
      }
    }
  }
}

function resolveDefaultInputPath(): string {
  const cfgPath = getProjectConfigPath();
  if (existsSync(cfgPath)) {
    try {
      const cfg = loadProjectConfig() as { testAnalysisFile?: string };
      if (cfg.testAnalysisFile) {
        return resolveProjectPath(cfg.testAnalysisFile);
      }
    } catch {
      /* config ilegível: cai no fallback */
    }
  }
  return resolveProjectPath('inputs/test-analysis.md');
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    options: { project: { type: 'string' } },
    allowPositionals: true,
    strict: false,
  });
  if (values.project) {
    process.env.PROJECT = values.project as string;
  }

  const cliPath = positionals[0];
  const inputPath = cliPath
    ? resolve(process.cwd(), cliPath)
    : resolveDefaultInputPath();
  const outputPath = getOutputPath('test-analysis.parsed.json');

  if (!existsSync(inputPath)) {
    throw new Error(
      `MD canônico não encontrado: ${inputPath}. Passe o caminho como argumento ` +
        `ou ajuste 'testAnalysisFile' em projects/<slug>/project.config.json.`,
    );
  }

  log.info(`Lendo MD canônico: ${inputPath}`);
  const content = readFileSync(inputPath, 'utf-8');
  const analysis = parseCanonicalMd(content);
  validateAnalysis(analysis);

  ensureParentDir(outputPath);
  writeFileSync(outputPath, JSON.stringify(analysis, null, 2), 'utf-8');

  log.info(
    `Parser concluído: ${analysis.totals.suites} suíte(s), ${analysis.totals.testCases} testcase(s), ` +
      `${analysis.totals.steps} step(s) → ${outputPath}`,
  );
}

const invokedDirectly = process.argv[1]?.endsWith('parser.ts');

if (invokedDirectly) {
  main().catch((err: unknown) => {
    log.error('Falha no md-parser', err as Error);
    process.exit(1);
  });
}
