import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ensureParentDir } from '../../../src/utils/helpers.js';
import { getOutputDir, loadProjectConfig } from '../../../src/utils/environment.js';

/**
 * recon-cache — persistência e leitura do recon como cache regenerável com TTL.
 *
 * Substitui o antigo destino `projects/<slug>/inputs/recon-<slug>.md` (artefato
 * git, ficava stale em silêncio) por `outputs/<slug>/recon-cache/<slug>.md`
 * (gitignored, regenerável, com metadados de validade). Ver design em
 * `.claude/skills/roadmap-recon-cache/SKILL.md`.
 */

/** TTL default: 7 dias (168h), conforme design. */
export const DEFAULT_TTL_HOURS = 168;

/** Subdiretório do cache dentro de `outputs/<slug>/`. */
const CACHE_SUBDIR = 'recon-cache';

/** Índice do cache, com timestamp e TTL por suite. */
const META_FILENAME = '_meta.json';

/** Entrada de uma suite no `_meta.json`. */
export type ReconMetaEntry = {
  generatedAt: string;
  twygoCommitSha: string | null;
  filename: string;
};

/** Estrutura persistida em `_meta.json`. `stale` é calculado em runtime, não persistido. */
export type ReconMeta = {
  generatedAt: string;
  ttlHours: number;
  suites: Record<string, ReconMetaEntry>;
};

/** Resultado de uma leitura de cache, com flag de staleness já calculada. */
export type ReconCacheRead = {
  exists: boolean;
  stale: boolean;
  path: string;
  generatedAt: string | null;
  ttlHours: number;
  content: string | null;
};

/**
 * Lê a config de recon do `project.config.json` do projeto ativo, com defaults
 * graciosos — projetos antigos não precisam declarar a chave `recon`.
 */
export function getReconConfig(slug?: string): { ttlHours: number; autoRegenerate: boolean } {
  let ttlHours = DEFAULT_TTL_HOURS;
  let autoRegenerate = false;
  try {
    const cfg = loadProjectConfig(slug) as unknown as {
      recon?: { ttlHours?: number; autoRegenerate?: boolean };
    };
    if (cfg.recon) {
      if (typeof cfg.recon.ttlHours === 'number') ttlHours = cfg.recon.ttlHours;
      if (typeof cfg.recon.autoRegenerate === 'boolean') autoRegenerate = cfg.recon.autoRegenerate;
    }
  } catch {
    // Sem config legível → mantém defaults. Não falhar a leitura por isso.
  }
  return { ttlHours, autoRegenerate };
}

/** Diretório do cache do projeto ativo: `outputs/<slug>/recon-cache/`. */
export function getReconCacheDir(): string {
  return getOutputDir(CACHE_SUBDIR);
}

/** Path do `.md` de uma suite no cache: `outputs/<slug>/recon-cache/<suiteSlug>.md`. */
export function getReconCachePath(suiteSlug: string): string {
  return resolve(getReconCacheDir(), `${suiteSlug}.md`);
}

/** Path do `_meta.json` do cache: `outputs/<slug>/recon-cache/_meta.json`. */
export function getReconMetaPath(): string {
  return resolve(getReconCacheDir(), META_FILENAME);
}

/** Carrega o `_meta.json` do cache, ou `null` se ausente/corrompido. */
export function readReconMeta(): ReconMeta | null {
  const metaPath = getReconMetaPath();
  if (!existsSync(metaPath)) return null;
  try {
    return JSON.parse(readFileSync(metaPath, 'utf-8')) as ReconMeta;
  } catch {
    return null;
  }
}

/**
 * Grava/atualiza a entrada de uma suite no `_meta.json`, preservando entradas
 * de outras suites. Cria o arquivo se não existir.
 */
export function writeReconMeta(args: {
  suiteSlug: string;
  generatedAt: string;
  ttlHours: number;
  filename: string;
  twygoCommitSha?: string | null;
}): void {
  const existing = readReconMeta();
  const meta: ReconMeta = existing ?? {
    generatedAt: args.generatedAt,
    ttlHours: args.ttlHours,
    suites: {},
  };
  meta.generatedAt = args.generatedAt;
  meta.ttlHours = args.ttlHours;
  meta.suites[args.suiteSlug] = {
    generatedAt: args.generatedAt,
    twygoCommitSha: args.twygoCommitSha ?? null,
    filename: args.filename,
  };
  const metaPath = getReconMetaPath();
  ensureParentDir(metaPath);
  writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n', 'utf-8');
}

/**
 * Extrai `generatedAt` do header de metadados do `.md` (bloco de comentário no
 * topo). Retorna `null` se o header não existir ou não tiver o campo.
 */
export function parseReconHeaderGeneratedAt(content: string): string | null {
  const match = content.match(/generatedAt:\s*([0-9T:.\-Z]+)/);
  return match?.[1] ?? null;
}

/**
 * Decide se um cache é stale dado o timestamp de geração e o TTL em horas.
 * Timestamp ausente/inválido ⇒ stale (regenera por segurança).
 */
export function isStale(generatedAt: string | null, ttlHours: number): boolean {
  if (!generatedAt) return true;
  const generated = Date.parse(generatedAt);
  if (Number.isNaN(generated)) return true;
  const ageMs = Date.now() - generated;
  return ageMs > ttlHours * 3_600_000;
}

/**
 * Lê o cache de recon de uma suite com detecção de staleness. Fonte do
 * `generatedAt`: header do `.md` (preferido) com fallback para `_meta.json`.
 *
 * Consumidores (planner via prompts.md, futuros leitores programáticos) usam
 * isto para decidir entre carregar o catálogo ou explorar live: cache ausente
 * ⇒ explorar live; cache fresco ⇒ carregar; cache stale ⇒ regenerar/avisar.
 */
export function readReconCache(suiteSlug: string): ReconCacheRead {
  const path = getReconCachePath(suiteSlug);
  const { ttlHours } = getReconConfig();
  if (!existsSync(path)) {
    return { exists: false, stale: true, path, generatedAt: null, ttlHours, content: null };
  }
  const content = readFileSync(path, 'utf-8');
  const headerAt = parseReconHeaderGeneratedAt(content);
  const generatedAt = headerAt ?? readReconMeta()?.suites[suiteSlug]?.generatedAt ?? null;
  return {
    exists: true,
    stale: isStale(generatedAt, ttlHours),
    path,
    generatedAt,
    ttlHours,
    content,
  };
}
