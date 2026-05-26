import type { FullConfig } from '@playwright/test';
import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createLogger } from '../../src/utils/logger.js';
import { LoginPage } from '../../src/pages/LoginPage.js';
import { loadEnvironmentConfig, loadProjectConfig } from '../../src/utils/environment.js';
import { FILES } from '../../src/utils/constants.js';

const log = createLogger('global-setup');

const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');
const STORAGE_TTL_MS = 30 * 60 * 1000; // 30 min — re-login se mais antigo

/**
 * Storage secundário para o ambiente "sem saldo de créditos" — usado por
 * testes de bloqueio de funcionalidades (RN: organização sem créditos
 * disponíveis). O storage é criado quando `staging-without-credits` (ou
 * outro env terminado em `-without-credits`) está presente em
 * `environment.json`. Specs consomem via:
 *
 *   test.use({ storageState: SECONDARY_STORAGE_PATH });
 *
 * Importado como `import { SECONDARY_STORAGE_PATH } from 'tests/setup/global-setup.js'`.
 */
export const SECONDARY_STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage-without-credits.json');

/**
 * Storage do ambiente ADICIONAL (multi-tenant) — pareado ao env principal
 * via sufixo `-aditional`. Diferente do SECONDARY (bloqueio), o adicional
 * é uma org separada que compartilha contrato/planos com a principal
 * (config via /admin/edit_sys_subscription_settings/{principalOrgId}).
 *
 * Detalhamento em [skill testar-ambientes-adicionais-twygo].
 *
 * Specs consomem via:
 *   test.use({ storageState: ADITIONAL_STORAGE_PATH, baseURL: aditionalEnv.baseUrl });
 */
export const ADITIONAL_STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage-aditional.json');

type EnvConfig = Record<string, { baseUrl: string; credentials: { email: string; password: string }; timeout: number }>;

function isStorageFreshAt(path: string): boolean {
  if (!existsSync(path)) return false;
  const ageMs = Date.now() - statSync(path).mtimeMs;
  if (ageMs > STORAGE_TTL_MS) return false;
  try {
    const j = JSON.parse(readFileSync(path, 'utf-8'));
    return Array.isArray(j.cookies) && j.cookies.length > 0;
  } catch {
    return false;
  }
}

function isStorageFresh(): boolean {
  return isStorageFreshAt(STORAGE_PATH);
}

/**
 * Faz login uma vez em um ambiente alvo e grava o storageState resultante.
 * Reusa storage já existente se ainda estiver fresh.
 */
async function loginAndPersist(
  envName: string,
  envEntry: { baseUrl: string; credentials: { email: string; password: string }; timeout: number },
  destinationPath: string,
): Promise<void> {
  if (isStorageFreshAt(destinationPath)) {
    log.info(`storageState reutilizado para "${envName}" (${destinationPath})`);
    return;
  }
  log.info(`Login global "${envName}" em ${envEntry.baseUrl}users/login...`);
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ baseURL: envEntry.baseUrl, ignoreHTTPSErrors: true });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await page.goto('/users/login');
    await loginPage.login(envEntry.credentials.email, envEntry.credentials.password);
    await page.waitForURL((url) => !url.pathname.startsWith('/users/login'), { timeout: 30_000 });

    mkdirSync(dirname(destinationPath), { recursive: true });
    await context.storageState({ path: destinationPath });
    log.info(`storageState gravado para "${envName}" (${destinationPath})`);
  } finally {
    await browser.close();
  }
}

/**
 * globalSetup do Playwright: faz login 1× e grava storageState em
 * outputs/.auth/storage.json. Specs reusam via `use.storageState` configurado
 * em playwright.config.ts — não precisam mais de login boilerplate por test.
 *
 * Re-login automático se storage tem >30min ou está corrompido.
 *
 * Pode ser desligado via SKIP_GLOBAL_LOGIN=1 (útil para tests/auth/login.spec.ts
 * que valida a tela de login em si — esse spec deve rodar com `test.use({ storageState: { cookies: [], origins: [] } })`).
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  if (process.env.SKIP_GLOBAL_LOGIN === '1') {
    log.info('SKIP_GLOBAL_LOGIN=1 — pulando login global');
    return;
  }

  const projectConfig = loadProjectConfig();
  // Carrega config com placeholders `${VAR}` já resolvidos via process.env.
  const envConfig: EnvConfig = loadEnvironmentConfig() as EnvConfig;
  const env = envConfig[projectConfig.environment];
  if (!env) throw new Error(`Environment "${projectConfig.environment}" ausente em ${FILES.environment}`);

  // Login no ambiente principal (storage padrão consumido por playwright.config.ts/use.storageState)
  await loginAndPersist(projectConfig.environment, env, STORAGE_PATH);

  // Login secundário: detecta um env "negado" para specs de bloqueio.
  // Convenções aceitas (sufixos): `-without-credits` (créditos de IA) e
  // `-widgets-disabled` (Widgets/Painéis sem contrato/flag).
  //
  // Prioridade:
  //   1. Casa o sufixo com o env PRINCIPAL: ex. principal=`staging-widgets`
  //      → procura `staging-widgets-disabled` (extensão direta do principal).
  //   2. Fallback: pega o primeiro env que casa com QUALQUER sufixo —
  //      cobre o caso legado onde o principal é só `staging` e o secundário
  //      é `staging-without-credits` (independente de prefixo).
  //
  // Sem isso, ao rodar com principal=`staging-widgets` o find caía no
  // `staging-without-credits` (que tem widgets ativos!), e specs de
  // "feature-flag-desabilitada" logavam no env errado.
  const SECONDARY_SUFFIXES = ['-without-credits', '-disabled', '-widgets-disabled'];
  const principal = projectConfig.environment;
  const directMatch = SECONDARY_SUFFIXES
    .map((s) => `${principal}${s}`)
    .find((candidate) => candidate in envConfig);
  const secondaryEnvName = directMatch
    ?? Object.keys(envConfig).find((k) =>
      k !== principal && SECONDARY_SUFFIXES.some((s) => k.endsWith(s)),
    );
  if (secondaryEnvName) {
    try {
      await loginAndPersist(secondaryEnvName, envConfig[secondaryEnvName]!, SECONDARY_STORAGE_PATH);
    } catch (e) {
      log.warn(`Falha ao preparar storage secundário "${secondaryEnvName}": ${(e as Error).message}. Specs que dependem dele serão pulados.`);
    }
  }

  // Login adicional: env multi-tenant "extra" pareado ao principal via sufixo
  // `-aditional`. Diferente do secundário, NÃO é cenário de bloqueio — é uma
  // org distinta que compartilha contrato com o principal. Specs consomem
  // via ADITIONAL_STORAGE_PATH + baseURL do env adicional.
  const aditionalEnvName = `${principal}-aditional`;
  if (aditionalEnvName in envConfig) {
    try {
      await loginAndPersist(aditionalEnvName, envConfig[aditionalEnvName]!, ADITIONAL_STORAGE_PATH);
    } catch (e) {
      log.warn(`Falha ao preparar storage adicional "${aditionalEnvName}": ${(e as Error).message}. Specs que dependem dele serão pulados.`);
    }
  }
}

/**
 * Helpers exportados pro orchestrator preflight().
 */
export function storageStateIsFresh(): boolean {
  return isStorageFresh();
}

export function invalidateStorageState(): void {
  if (existsSync(STORAGE_PATH)) {
    writeFileSync(STORAGE_PATH, '{"cookies":[],"origins":[]}');
  }
}

export default globalSetup;
