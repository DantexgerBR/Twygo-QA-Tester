import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FILES } from './constants.js';

export type EnvCredentials = {
  email: string;
  password: string;
};

export type EnvSuperAdmin = {
  path?: string;
  subscriptionPlansPath?: string;
  editContractPath?: string;
};

export type EnvEntry = {
  baseUrl: string;
  credentials: EnvCredentials;
  timeout: number;
  orgId?: string;
  superAdmin?: EnvSuperAdmin;
};

type EnvFile = Record<string, EnvEntry>;
type ProjectFile = { environment: string; [k: string]: unknown };

let cachedCurrent: { name: string; entry: EnvEntry } | null = null;
let cachedAll: EnvFile | null = null;

function loadAll(): EnvFile {
  if (cachedAll) return cachedAll;
  cachedAll = JSON.parse(
    readFileSync(resolve(process.cwd(), FILES.environment), 'utf-8'),
  ) as EnvFile;
  return cachedAll;
}

/**
 * Retorna o env ativo conforme `config/project.config.json[environment]`.
 *
 * USO: helper canônico para specs e Page Objects lerem baseUrl/orgId sem
 * hardcodar. Substitui literais como `https://stage10.stage.twygoead.com`
 * ou `36602` espalhados em testes — quebra ao trocar de ambiente.
 *
 * Veja CLAUDE.md §7.6 (anti-pattern B).
 */
export function getCurrentEnv(): { name: string; entry: EnvEntry } {
  if (cachedCurrent) return cachedCurrent;
  const proj = JSON.parse(
    readFileSync(resolve(process.cwd(), FILES.projectConfig), 'utf-8'),
  ) as ProjectFile;
  const all = loadAll();
  const entry = all[proj.environment];
  if (!entry) {
    throw new Error(
      `Environment "${proj.environment}" não encontrado em ${FILES.environment}`,
    );
  }
  cachedCurrent = { name: proj.environment, entry };
  return cachedCurrent;
}

export function getEnvByName(name: string): EnvEntry {
  const entry = loadAll()[name];
  if (!entry) {
    throw new Error(`Environment "${name}" não encontrado em ${FILES.environment}`);
  }
  return entry;
}

export function getBaseUrl(): string {
  return getCurrentEnv().entry.baseUrl;
}

/**
 * orgId da organização principal do env atual. Lança se não estiver
 * definido em `environment.json` — força corrigir o config em vez de
 * fallback silencioso.
 */
export function getOrgId(): string {
  const { name, entry } = getCurrentEnv();
  if (!entry.orgId) {
    throw new Error(
      `orgId não definido para o env "${name}" em ${FILES.environment}`,
    );
  }
  return entry.orgId;
}

/**
 * Path canônico de "editar contrato" no Super Admin para a org do env atual.
 * Pré-construído em `environment.json` para evitar montagem por concatenação
 * em specs.
 */
export function getEditContractPath(): string {
  const { name, entry } = getCurrentEnv();
  const path = entry.superAdmin?.editContractPath;
  if (!path) {
    throw new Error(
      `superAdmin.editContractPath não definido para o env "${name}" em ${FILES.environment}`,
    );
  }
  return path;
}
