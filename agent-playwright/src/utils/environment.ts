import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import 'dotenv/config';
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

export type ProjectConfig = {
  projectName: string;
  testAnalysisFile: string;
  environment: string;
  browsers: string[];
  headless: boolean;
  reporting: {
    format: string;
    outputDir: string;
    screenshotsOnFailure: boolean;
  };
  performance: {
    enableTracing: boolean;
    enableVideo: boolean;
  };
  codeGeneration?: Record<string, unknown>;
  exploratory?: Record<string, unknown>;
  [k: string]: unknown;
};

type EnvFile = Record<string, EnvEntry>;

let cachedCurrent: { name: string; entry: EnvEntry } | null = null;
let cachedRaw: EnvFile | null = null;
const expandedEnvCache = new Map<string, EnvEntry>();
let cachedProjectConfig: ProjectConfig | null = null;
let cachedProjectSlug: string | null = null;

/**
 * Substitui placeholders `${VAR}` em strings por `process.env.VAR`.
 * Aplica recursivamente em arrays e objetos. Lança se a variável referenciada
 * não estiver definida — força o usuário a preencher `.env` em vez de
 * silenciosamente substituir por string vazia (que vazaria como credencial
 * inválida na primeira execução).
 */
const VAR_REF = /\$\{([A-Z_][A-Z0-9_]*)\}/g;

function expandEnvRefs<T>(value: T, ctx = 'environment.json'): T {
  if (typeof value === 'string') {
    return value.replace(VAR_REF, (_, name: string) => {
      const v = process.env[name];
      if (v === undefined || v === '') {
        throw new Error(
          `Variável de ambiente "${name}" referenciada em ${ctx} mas não definida. ` +
            `Copie .env.example para .env e preencha (ver agent-playwright/.claude/SETUP.md).`,
        );
      }
      return v;
    }) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => expandEnvRefs(v, ctx)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = expandEnvRefs(v, ctx);
    }
    return out as unknown as T;
  }
  return value;
}

function loadRaw(): EnvFile {
  if (cachedRaw) return cachedRaw;
  cachedRaw = JSON.parse(
    readFileSync(resolve(process.cwd(), FILES.environment), 'utf-8'),
  ) as EnvFile;
  return cachedRaw;
}

/**
 * Expande os `${VAR}` de UM env específico (lazy + cacheado). Só valida as
 * variáveis do env realmente usado — rodar 1 projeto NÃO exige preencher os
 * outros envs do environment.json (antes o loader expandia o arquivo inteiro
 * e falhava na primeira var vazia de qualquer env). Retorna undefined se o
 * env não existe no arquivo.
 */
function expandEntry(name: string): EnvEntry | undefined {
  const raw = loadRaw();
  if (!(name in raw)) return undefined;
  const cached = expandedEnvCache.get(name);
  if (cached) return cached;
  const expanded = expandEnvRefs(raw[name]!, `${FILES.environment} (env "${name}")`);
  // Override de baseUrl vindo da UI (Conexão → "mudar URL do stage"). Só ativa se a env var existir;
  // sem ela, comportamento inalterado. Aponta a run inteira (login/smoke/specs) pro stage escolhido.
  if (process.env.QA_UI_BASE_URL) expanded.baseUrl = process.env.QA_UI_BASE_URL;
  expandedEnvCache.set(name, expanded);
  return expanded;
}

/**
 * Carrega `config/environment.json` com placeholders `${VAR}` já expandidos
 * via `process.env`. Use este helper em vez de `JSON.parse(readFileSync(...))`
 * direto — caso contrário credenciais vazam como `${TWYGO_STAGING_PASSWORD}`
 * literal nos requests.
 */
export function loadEnvironmentConfig(): EnvFile {
  // Proxy: expande `${VAR}` SÓ no env acessado (lazy). `name in cfg` e
  // `Object.keys(cfg)` continuam operando sobre o arquivo cru — só a leitura
  // de um env por nome dispara a validação/expansão daquele env.
  const raw = loadRaw();
  return new Proxy(raw, {
    get(target, prop, receiver) {
      if (typeof prop === 'string' && prop in target) {
        return expandEntry(prop);
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}

/**
 * Lista os slugs de projetos disponíveis em `projects/`. Cada slug é o nome
 * de um subdiretório imediato.
 */
export function listAvailableProjects(): string[] {
  const projectsDir = resolve(process.cwd(), 'projects');
  if (!existsSync(projectsDir)) return [];
  return readdirSync(projectsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

/**
 * Resolve qual projeto está ativo na execução atual. Ordem de prioridade:
 * 1. Argumento explícito (passado pelo orchestrator via flag --project)
 * 2. Variável de ambiente PROJECT
 * 3. Auto-detect: se existe exatamente 1 projeto em `projects/`, usa ele
 * 4. Erro com lista de projetos disponíveis
 */
export function getProjectSlug(explicit?: string): string {
  if (explicit) {
    cachedProjectSlug = explicit;
    return explicit;
  }
  if (cachedProjectSlug) return cachedProjectSlug;
  if (process.env.PROJECT) {
    cachedProjectSlug = process.env.PROJECT;
    return cachedProjectSlug;
  }
  const available = listAvailableProjects();
  if (available.length === 0) {
    throw new Error(
      'Nenhum projeto em projects/. Crie projects/<slug>/ com project.config.json (ver .claude/PROJECT_BOOTSTRAP.md).',
    );
  }
  if (available.length === 1) {
    cachedProjectSlug = available[0]!;
    return cachedProjectSlug;
  }
  throw new Error(
    `Múltiplos projetos em projects/: ${available.join(', ')}. ` +
      `Use --project <slug> ou export PROJECT=<slug>.`,
  );
}

export function getProjectDir(slug?: string): string {
  return resolve(process.cwd(), 'projects', slug ?? getProjectSlug());
}

/**
 * Slug do projeto a ser usado em paths de saída. Em PROJECT_ALL=true
 * (regressivo cumulativo), usa `_all` para não colidir com runs por projeto.
 * Tolerante: se nenhum projeto puder ser resolvido, usa `_unknown`.
 */
function safeOutputSlug(): string {
  try {
    return process.env.PROJECT_ALL === 'true' ? '_all' : getProjectSlug();
  } catch {
    return '_unknown';
  }
}

/**
 * Diretório de saída por projeto: `outputs/<slug>/`.
 *
 * Estrutura completa esperada dentro de `outputs/<slug>/`:
 *   - `test-analysis.parsed.json` (parser)
 *   - `test-results.json` (Playwright reporter)
 *   - `exploratory-findings.json` (validator)
 *   - `exploratory/` (fixture writes per-test findings)
 *   - `reports/<runId>/` (report-generator HTML)
 *   - `allure-results/`, `allure-report/` (regressivo)
 *   - `test-artifacts/` (screenshots, traces, vídeos)
 */
export function getProjectOutputRoot(): string {
  return resolve(process.cwd(), 'outputs', safeOutputSlug());
}

/**
 * Subdir de saída específico do projeto: `outputs/<slug>/<subdir>/`.
 * Use para diretórios como `exploratory`, `reports`, `allure-results`.
 */
export function getOutputDir(subdir: string): string {
  return resolve(getProjectOutputRoot(), subdir);
}

/**
 * Arquivo no root de saída do projeto: `outputs/<slug>/<filename>`.
 * Use para arquivos como `test-results.json`, `test-analysis.parsed.json`.
 */
export function getOutputPath(filename: string): string {
  return resolve(getProjectOutputRoot(), filename);
}

export function getProjectConfigPath(slug?: string): string {
  return resolve(getProjectDir(slug), 'project.config.json');
}

/**
 * Carrega `projects/<slug>/project.config.json` do projeto ativo.
 */
export function loadProjectConfig(slug?: string): ProjectConfig {
  if (cachedProjectConfig && !slug) return cachedProjectConfig;
  const path = getProjectConfigPath(slug);
  const cfg = JSON.parse(readFileSync(path, 'utf-8')) as ProjectConfig;
  if (!slug) cachedProjectConfig = cfg;
  return cfg;
}

/**
 * Resolve um path declarado em `project.config.json` (relativo ao diretório
 * do projeto) para um path absoluto.
 *
 * Exemplo: `testAnalysisFile: "inputs/Analise.xml"` em
 * `projects/widgets/project.config.json` resolve para
 * `<root>/projects/widgets/inputs/Analise.xml`.
 */
export function resolveProjectPath(relativePath: string, slug?: string): string {
  return resolve(getProjectDir(slug), relativePath);
}

/**
 * Retorna o env ativo conforme `projects/<slug>/project.config.json[environment]`.
 *
 * USO: helper canônico para specs e Page Objects lerem baseUrl/orgId sem
 * hardcodar. Substitui literais como `https://stage10.stage.twygoead.com`
 * ou `36602` espalhados em testes — quebra ao trocar de ambiente.
 *
 * Veja CLAUDE.md §7.6 (anti-pattern B).
 */
export function getCurrentEnv(): { name: string; entry: EnvEntry } {
  if (cachedCurrent) return cachedCurrent;
  const proj = loadProjectConfig();
  const entry = expandEntry(proj.environment);
  if (!entry) {
    throw new Error(
      `Environment "${proj.environment}" não encontrado em ${FILES.environment}`,
    );
  }
  cachedCurrent = { name: proj.environment, entry };
  return cachedCurrent;
}

export function getEnvByName(name: string): EnvEntry {
  const entry = expandEntry(name);
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
