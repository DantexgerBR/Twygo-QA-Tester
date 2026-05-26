/**
 * twygo-input-parser/dispatcher.ts
 *
 * Entry-point unificado para `npm run agent:parse`. Detecta o formato do
 * arquivo de entrada (MD canônico vs XML TestLink legado) e delega ao
 * parser correspondente. Preserva coexistência durante a migração para o
 * MD canônico (CONTRACT.md v1, 2026-05-18) — sem flag-day.
 *
 * Heurística de detecção (em ordem):
 * 1. Extensão do arquivo (`.md` → md-parser; `.xml` → xml-parser).
 * 2. Conteúdo inicial (`---` na primeira linha → md; `<?xml` → xml).
 * 3. Fallback: erro explícito.
 *
 * Os parsers downstream produzem JSON na mesma forma estrutural
 * (`ParsedAnalysis`) em `outputs/<slug>/test-analysis.parsed.json`. Campos
 * extras do MD canônico (executor, playbooks, org, catalogs) ficam
 * `undefined` quando o input foi XML — orchestrator trata isso.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { createLogger } from '../../../src/utils/logger.js';
import {
  getOutputPath,
  getProjectConfigPath,
  loadProjectConfig,
  resolveProjectPath,
} from '../../../src/utils/environment.js';
import { ensureParentDir } from '../../../src/utils/helpers.js';
import { parseTestLinkXml, validateAnalysis as validateXmlAnalysis } from '../twygo-xml-parser/parser.js';
import { parseCanonicalMd, validateAnalysis as validateMdAnalysis } from '../twygo-md-parser/parser.js';

const log = createLogger('input-parser');

type InputFormat = 'md' | 'xml';

function detectFormat(path: string, content: string): InputFormat {
  const lower = path.toLowerCase();
  if (lower.endsWith('.md')) return 'md';
  if (lower.endsWith('.xml')) return 'xml';
  // Fallback: olha o início do conteúdo
  const head = content.trimStart().slice(0, 64);
  if (head.startsWith('---')) return 'md';
  if (head.startsWith('<?xml') || head.startsWith('<testsuite')) return 'xml';
  throw new Error(
    `Não foi possível detectar formato do arquivo de entrada: ${path}. ` +
      'Esperado: extensão .md (canônico) ou .xml (TestLink legado).',
  );
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
      /* ignora — cai no fallback */
    }
  }
  // Preferência ao MD canônico se houver; senão XML
  const mdFallback = resolveProjectPath('inputs/test-analysis.md');
  if (existsSync(mdFallback)) return mdFallback;
  return resolveProjectPath('inputs/test-analysis.xml');
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
  const inputPath = cliPath ? resolve(process.cwd(), cliPath) : resolveDefaultInputPath();

  if (!existsSync(inputPath)) {
    throw new Error(
      `Arquivo de entrada não encontrado: ${inputPath}. ` +
        "Passe caminho como argumento ou configure 'testAnalysisFile' em projects/<slug>/project.config.json.",
    );
  }

  const content = readFileSync(inputPath, 'utf-8');
  const format = detectFormat(inputPath, content);
  log.info(`Lendo ${format.toUpperCase()} de entrada: ${inputPath}`);

  let analysis;
  if (format === 'md') {
    analysis = parseCanonicalMd(content);
    validateMdAnalysis(analysis);
  } else {
    analysis = parseTestLinkXml(content);
    validateXmlAnalysis(analysis);
  }

  const outputPath = getOutputPath('test-analysis.parsed.json');
  ensureParentDir(outputPath);
  writeFileSync(outputPath, JSON.stringify(analysis, null, 2), 'utf-8');

  log.info(
    `Parser (${format}) concluído: ${analysis.totals.suites} suíte(s), ` +
      `${analysis.totals.testCases} testcase(s), ${analysis.totals.steps} step(s) → ${outputPath}`,
  );
}

const invokedDirectly = process.argv[1]?.endsWith('dispatcher.ts');

if (invokedDirectly) {
  main().catch((err: unknown) => {
    log.error('Falha no dispatcher', err as Error);
    process.exit(1);
  });
}
