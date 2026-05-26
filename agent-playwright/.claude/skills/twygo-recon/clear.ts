import { existsSync, rmSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { createLogger } from '../../../src/utils/logger.js';
import { getReconCacheDir } from './recon-cache.js';

/**
 * Invalidação manual do cache de recon do projeto ativo — apaga todo o
 * diretório `outputs/<slug>/recon-cache/`. Raro: usar quando a UI Twygo
 * sofreu redesign e todo o catálogo ficou inválido. Ver design em
 * `.claude/skills/roadmap-recon-cache/SKILL.md` §"Invalidação manual".
 *
 * Uso: npm run agent:recon:clear -- --project <slug>
 */

const log = createLogger('recon:clear');

function main(): void {
  const { values } = parseArgs({
    options: { project: { type: 'string' } },
    strict: false,
  });
  if (values.project) {
    process.env.PROJECT = values.project as string;
  }
  const dir = getReconCacheDir();
  if (!existsSync(dir)) {
    log.info(`Nada a limpar — cache não existe: ${dir}`);
    return;
  }
  rmSync(dir, { recursive: true, force: true });
  log.info(`Cache de recon apagado → ${dir}`);
}

const invokedDirectly = process.argv[1]?.endsWith('clear.ts');
if (invokedDirectly) {
  main();
}
