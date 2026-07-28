// agent-ui — interface visual pros agentes de QA. Envelopa os comandos do agent-playwright.
// Zero dependência: só stdlib do Node. Rodar: `node server.mjs` (dentro de agent-ui/).
// ponytail: um arquivo, sem framework. Cresce quando F0.3+ pedir.
import { createServer } from 'node:http';
import { readFile, readdir, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { randomBytes } from 'node:crypto';
import {
  AI_ENGINES,
  codexComplete,
  commandAvailable,
  engineLabel,
  normalizeEngine,
  parseJsonResponse,
  stripMarkdownFence,
} from './ai-engine.mjs';
import { costOf, injectApproved } from './claude-cli.mjs';
import {
  AT_ENGINES,
  atEngineConfigStatus,
  atEngineLabel,
  normalizeAtEngine,
  runAtAgent,
} from './agent-at-engine.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Localização dos agentes: env var override > sibling relativo (default). Não fixar o caminho — cada
// máquina/clone pode ter layout diferente. QA_AGENT_PLAYWRIGHT aponta pro agent-playwright; os irmãos
// (agent-db/agent-at/raiz) seguem dele. ponytail: env override, sem UI de config pra um caminho set-once.
const AP = process.env.QA_AGENT_PLAYWRIGHT || join(__dirname, '..', 'agent-playwright'); // o pipeline que envelopamos
const ADB = process.env.QA_AGENT_DB || join(AP, '..', 'agent-db'); // agente headless de validação read-only em banco (R2)
const AAT = process.env.QA_AGENT_AT || join(AP, '..', 'agent-at'); // Análise de Teste — gera o test-analysis.md que alimenta o Playwright (R2)
const REPO = process.env.QA_REPO || join(AP, '..'); // raiz do monorepo Twygo-QA-Tester (pra o auto-update dar git pull)
const TSX = join(AP, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const ORCHESTRATOR = join(AP, '.claude', 'skills', 'twygo-test-orchestrator', 'orchestrator.ts');
const PORT = process.env.PORT || 4321;
const atRunning = new Set(); // slugs de projeto com /api/at-plan ou /api/at-build em andamento (evita corrida no mesmo projeto)

const json = (res, code, obj) => {
  // no-store: resposta de API nunca cacheia (dado muda; evita servir stale/500 antigo do disk cache do browser).
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'x-content-type-options': 'nosniff', 'cache-control': 'no-store' });
  res.end(JSON.stringify(obj));
};

// Limite de corpo (256KB) contra POST gigante. Rejeita e derruba a conexão se estourar.
const readBody = (req, max = 262144) => new Promise((resolve, reject) => {
  let b = '';
  req.on('data', (d) => { b += d; if (b.length > max) { req.destroy(); reject(new Error('corpo grande demais')); } });
  req.on('end', () => resolve(b));
});
const safeSlug = (s) => s && !/[^a-z0-9-]/i.test(s);

// Profile de ambiente do projeto: baseUrl (literal) + nomes das env vars de credencial (${VAR}).
const varOf = (s) => (String(s || '').match(/\$\{([A-Z0-9_]+)\}/) || [])[1] || null;
function profileVars(envs, name) {
  const p = envs[name] || {};
  return { profileName: name, baseUrl: p.baseUrl || '', orgId: p.orgId || '', emailVar: varOf(p.credentials?.email), passVar: varOf(p.credentials?.password) };
}
async function readEnvs() { try { return JSON.parse(await readFile(join(AP, 'config', 'environment.json'), 'utf8')); } catch { return {}; } }
async function projectEnvInfo(project) {
  const cfg = JSON.parse(await readFile(join(AP, 'projects', project, 'project.config.json'), 'utf8'));
  return profileVars(await readEnvs(), cfg.environment);
}
// Profiles SECUNDÁRIOS que os specs do projeto usam (getEnvByName('X') ≠ profile principal).
// Ex.: os testes de isolamento de base-de-conhecimento usam 'staging-...-aditional' (2ª org) no import.
async function secondaryProfiles(project) {
  try {
    let mainName = '';
    try { mainName = JSON.parse(await readFile(join(AP, 'projects', project, 'project.config.json'), 'utf8')).environment; } catch {}
    const envs = JSON.parse(await readFile(join(AP, 'config', 'environment.json'), 'utf8'));
    const names = new Set();
    const dir = join(AP, 'projects', project, 'tests');
    for (const e of await readdir(dir, { recursive: true })) {
      if (!e.endsWith('.spec.ts')) continue;
      let src; try { src = await readFile(join(dir, e), 'utf8'); } catch { continue; }
      const re = /getEnvByName\(\s*['"`]([^'"`]+)['"`]/g;
      let m; while ((m = re.exec(src))) if (m[1] !== mainName) names.add(m[1]);
    }
    return [...names].map((n) => profileVars(envs, n)).filter((p) => p.emailVar);
  } catch { return []; } // nunca lança — é chamado no /api/run já com headers SSE enviados
}
async function readConn(project) {
  try { return JSON.parse(await readFile(join(__dirname, 'state', `${project}-conn.json`), 'utf8')); } catch { return {}; }
}
// Lê os pares KEY=VALUE do .env do agent-playwright (pra saber quais creds JÁ têm valor real).
async function apDotenv() {
  const m = {};
  try {
    for (const ln of (await readFile(join(AP, '.env'), 'utf8')).split(/\r?\n/)) {
      const t = ln.trim(); if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('='); if (eq < 0) continue;
      m[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    }
  } catch {}
  return m;
}

// --- Custo por token (F2): ledger de uso + preços + câmbio USD→BRL do dia ---
const usageFile = () => join(__dirname, 'state', 'usage.json');
async function readUsage() { try { return JSON.parse(await readFile(usageFile(), 'utf8')); } catch { return []; } }
async function appendUsage(ev) { const dir = join(__dirname, 'state'); await mkdir(dir, { recursive: true }); const arr = await readUsage(); arr.push(ev); await writeFile(usageFile(), JSON.stringify(arr, null, 2)); }
async function loadPrices() { try { return JSON.parse(await readFile(join(__dirname, 'ai-prices.json'), 'utf8')); } catch { return { _default: { in: 0.15, out: 0.6 } }; } }
// Modelo de IA ativo: env > state/settings.json > default. Configurável na UI (Conexão).
async function readSettings() { try { return JSON.parse(await readFile(join(__dirname, 'state', 'settings.json'), 'utf8')); } catch { return {}; } }
async function aiModel() { return process.env.OPENAI_MODEL || (await readSettings()).model || 'gpt-5.6-terra'; }
// gpt-5 / o-series (reasoning) só aceitam temperature padrão (1) → omite o custom pra não dar 400.
function tempOpt(model, t) { return /^(gpt-5|o[134])/i.test(model) ? {} : { temperature: t }; }
// gpt-5-pro (e o1-pro/o3-pro) só existem na Responses API, não no chat/completions.
function isResponsesOnly(model) { return /-pro\b/i.test(model); }
const friendlyErr = (status) => status === 401 || status === 403 ? 'Chave de API incorreta ou incompleta — confira em Conexão.' : status === 429 ? 'Limite/cota da IA atingido — tente mais tarde.' : status >= 500 ? 'A IA está indisponível no momento.' : 'Não foi possível gerar agora.';
// Chamada de IA unificada: roteia gpt-5-pro (Responses API) vs demais (chat/completions). Normaliza texto + usage.
async function aiComplete({ system, user, json = false, temp = 0.3 }) {
  const engine = await aiEngine();
  const model = await aiModel();
  if (engine === AI_ENGINES.CODEX_CLI) {
    const r = await codexComplete({ system, user, json, temp }, {
      cwd: REPO, model, timeoutMs: parseInt(process.env.CODEX_TIMEOUT_MS || '180000', 10) || 180000,
    });
    if (r.ok) return r;
    // fallback automático pra openai-api NESTA chamada — sem estado persistido, tenta o codex-cli de novo na próxima.
    console.warn('[ai] codex-cli falhou, caindo pra openai-api nesta chamada:', r.err || r.status);
  }
  const key = await codexKey();
  const base = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const headers = { 'content-type': 'application/json', authorization: `Bearer ${key}` };
  if (process.env.OPENAI_PROJECT) headers['OpenAI-Project'] = process.env.OPENAI_PROJECT;
  if (process.env.OPENAI_ORG) headers['OpenAI-Organization'] = process.env.OPENAI_ORG;
  try {
    if (isResponsesOnly(model)) {
      // Responses API: system→instructions, user→input; texto em output[].message.content[].output_text; usage input/output_tokens.
      const r = await fetch(`${base}/responses`, { method: 'POST', headers, body: JSON.stringify({ model, instructions: system, input: user, max_output_tokens: 16000 }) });
      const b = await r.json().catch(() => ({}));
      if (!r.ok) return { ok: false, status: r.status, model };
      const msg = (b.output || []).find((o) => o.type === 'message');
      const content = (msg?.content || []).find((c) => c.type === 'output_text')?.text || '';
      return { ok: true, model, content, usageIn: b.usage?.input_tokens || 0, usageOut: b.usage?.output_tokens || 0 };
    }
    const body = { model, ...tempOpt(model, temp), messages: [{ role: 'system', content: system }, { role: 'user', content: user }] };
    if (json) body.response_format = { type: 'json_object' };
    const r = await fetch(`${base}/chat/completions`, { method: 'POST', headers, body: JSON.stringify(body) });
    const b = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, status: r.status, model };
    return { ok: true, model, content: b.choices?.[0]?.message?.content || '', usageIn: b.usage?.prompt_tokens || 0, usageOut: b.usage?.completion_tokens || 0 };
  } catch (e) { return { ok: false, status: 0, model, err: String(e) }; }
}
let fxCache = null;
async function getFx() {
  const today = new Date().toISOString().slice(0, 10);
  if (fxCache && fxCache.date === today) return fxCache;
  try { const c = JSON.parse(await readFile(join(__dirname, 'state', 'fx.json'), 'utf8')); if (c.date === today) { fxCache = c; return c; } } catch {}
  try {
    const r = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
    const b = await r.json();
    const rate = parseFloat(b?.USDBRL?.bid);
    if (rate) { fxCache = { date: today, rate, source: 'awesomeapi' }; await mkdir(join(__dirname, 'state'), { recursive: true }); await writeFile(join(__dirname, 'state', 'fx.json'), JSON.stringify(fxCache)); return fxCache; }
  } catch {}
  return { date: today, rate: null, source: 'indisponível' };
}

// Motor de IA ativo: 'codex-cli' (padrão aqui — CLI local do Codex, sem chave) ou 'openai-api' (chave HTTP).
// Override: env AI_ENGINE/CODEX_AI_ENGINE > state/settings.json.engine > default codex-cli.
// (upstream twygo-qa-ui usa openai-api como default; aqui invertido a pedido do Dante.)
async function aiEngine() { return normalizeEngine(process.env.AI_ENGINE || process.env.CODEX_AI_ENGINE || (await readSettings()).engine || AI_ENGINES.CODEX_CLI); }
// codex-cli funciona sem chave (usa o CLI local); fallback automático (abaixo, em aiComplete) cobre CLI ausente/sem créditos
// caindo pra openai-api NAQUELA chamada — então "configurado" também vale se há chave de reserva, mesmo sem o CLI instalado.
async function aiConfigured() {
  const engine = await aiEngine();
  if (engine === AI_ENGINES.CODEX_CLI && await commandAvailable(process.env.CODEX_CLI_BIN || 'codex')) return true;
  return !!(await codexKey());
}

// Motor do agente de AT (Análise de Teste): 'codex-cli' (padrão, sem chave) ou 'claude-api'
// (ANTHROPIC_API_KEY, fallback manual). Separado do seletor "Motor de IA" (aiEngine/aiModel) — ali é
// completion de 1 tiro; aqui é agente autônomo com bash/arquivo (capacidade diferente, não misturar).
async function atEngine() { return normalizeAtEngine(process.env.AT_ENGINE || (await readSettings()).atEngine || AT_ENGINES.CODEX_CLI); }
// Chave da API oficial da Anthropic — cai na exceção do ToS Consumer que proíbe automação sem API key.
// Só env (sem fallback de arquivo — não há uso hoje fora deste motor).
async function anthropicKey() { return process.env.ANTHROPIC_API_KEY || ''; }
async function atConfigured(engine) {
  if (engine === AT_ENGINES.CLAUDE_API) return !!(await anthropicKey());
  return await commandAvailable(process.env.CODEX_CLI_BIN || 'codex');
}

// Chave da IA (Codex) — de .secrets/codex.key (gitignored) ou env. Aceita "NAME=valor" ou a chave crua. NUNCA logar/expor.
async function codexKey() {
  // Precedência: env > override local (.secrets, gitignored) > chave embutida no app (ai-config.mjs, versionada).
  if (process.env.CODEX_API_KEY) return process.env.CODEX_API_KEY;
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  try {
    let t = (await readFile(join(__dirname, '.secrets', 'codex.key'), 'utf8')).trim();
    if (t.includes('=')) t = t.split('=').slice(1).join('=').trim();
    t = t.replace(/^["']|["']$/g, '');
    if (t) return t;
  } catch {}
  try { const m = await import('./ai-config.mjs'); return m.CODEX_API_KEY || ''; } catch { return ''; }
}

// Estatísticas do último test-results.json (Playwright JSON reporter).
async function readStats(project) {
  try {
    const j = JSON.parse(await readFile(join(AP, 'outputs', project, 'test-results.json'), 'utf8'));
    const s = j.stats || {};
    return { passed: s.expected ?? null, failed: s.unexpected ?? null, flaky: s.flaky ?? 0, skipped: s.skipped ?? null };
  } catch { return null; }
}

// Relatórios de execuções (F0.4). Varre outputs/ E outputs-archive/ (no recert o bundle completo está no archive).
const REPORT_BASES = [['outputs', 'live'], ['outputs-archive', 'archive']];
const runWhen = (runId) => {
  const m = runId.match(/_(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}` : '';
};
async function listRuns(project) {
  const bundles = [], loose = [];
  for (const [base, source] of REPORT_BASES) {
    const dir = join(AP, base, project, 'reports');
    let entries;
    try { entries = await readdir(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      if (e.isDirectory()) {
        try {
          const sum = JSON.parse(await readFile(join(dir, e.name, 'summary.json'), 'utf8'));
          const files = ['index', 'tests', 'exploratory'].filter((f) => existsSync(join(dir, e.name, f + '.md')));
          bundles.push({ runId: e.name, source, scope: sum.scope || '', tests: sum.tests || {}, when: runWhen(e.name), files });
        } catch { /* sem summary.json (ex.: bundle vivo só com artifacts/) → pula */ }
      } else if (e.isFile() && e.name.endsWith('.md')) {
        loose.push({ name: e.name, source });
      }
    }
  }
  bundles.sort((a, b) => b.runId.localeCompare(a.runId));
  loose.sort((a, b) => a.name.localeCompare(b.name));
  return { bundles, loose };
}
const noTraversal = (s) => s && !s.includes('..') && !s.includes('\\') && !s.startsWith('/') && !/^[a-z]:/i.test(s);

// Git no monorepo (pro aviso de update + git pull pelo app). Nunca lança; timeout curto.
const git = (args, timeout = 15000) => new Promise((resolve) => {
  const p = spawn('git', args, { cwd: REPO });
  let out = '', err = '';
  const to = setTimeout(() => { try { p.kill(); } catch {} }, timeout);
  p.stdout.on('data', (d) => (out += d));
  p.stderr.on('data', (d) => (err += d));
  p.on('close', (code) => { clearTimeout(to); resolve({ code, out: out.trim(), err: err.trim() }); });
  p.on('error', (e) => { clearTimeout(to); resolve({ code: -1, out: '', err: String(e) }); });
});

// Roda um script npm dentro do agent-playwright com PROJECT=<slug>. shell:true = npm.cmd no Windows.
const runNpm = (script, project) =>
  new Promise((resolve) => {
    const p = spawn('npm', ['run', script], { cwd: AP, shell: true, env: { ...process.env, PROJECT: project } });
    let out = '', err = '';
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (err += d));
    p.on('close', (code) => resolve({ code, stdout: out, stderr: err }));
    p.on('error', (e) => resolve({ code: -1, stdout: '', stderr: String(e) }));
  });

// Interpretador Python do agent-db: env AGENT_DB_PYTHON > venv detectado > `python` do PATH. (Windows: naming varia.)
function dbPython() {
  if (process.env.AGENT_DB_PYTHON) return process.env.AGENT_DB_PYTHON;
  for (const c of [
    join(ADB, 'venv', 'Scripts', 'python.exe'), join(ADB, 'venv', 'bin', 'python'),
    join(ADB, '.venv', 'Scripts', 'python.exe'), join(ADB, '.venv', 'bin', 'python'),
  ]) if (existsSync(c)) return c;
  return 'python';
}
// Roda o agent-db (python -m src.main) headless. Erros reais sobem no log — nada engolido.
const runDb = (args) => new Promise((resolve) => {
  const p = spawn(dbPython(), ['-m', 'src.main', ...args], { cwd: ADB, env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
  let out = '', err = '';
  p.stdout.on('data', (d) => (out += d));
  p.stderr.on('data', (d) => (err += d));
  p.on('close', (code) => resolve({ code, stdout: out, stderr: err }));
  p.on('error', (e) => resolve({ code: -1, stdout: '', stderr: String(e) }));
});

// Valida um spec de validação contra o schema REAL do agent-db (src/validators/spec.py). [] = ok.
const DB_TYPES = ['count', 'presence', 'absence', 'equals', 'compare_orgs', 'view_definition', 'fk_integrity', 'time_window'];
function dbSpecErrors(spec) {
  const e = [];
  if (!spec || typeof spec !== 'object') return ['não é um objeto'];
  if (!Array.isArray(spec.validations) || !spec.validations.length) return ['sem lista de validations'];
  spec.validations.forEach((v, i) => {
    if (!v || typeof v !== 'object') { e.push(`validação ${i + 1}: não é objeto`); return; }
    if (!v.id || typeof v.id !== 'string') e.push(`validação ${i + 1}: falta "id"`);
    if (!DB_TYPES.includes(v.type)) e.push(`validação ${i + 1} (${v.id || '?'}): tipo "${v.type}" inválido`);
  });
  return e;
}

function indent(code, spaces) {
  const pad = ' '.repeat(spaces);
  return String(code).split('\n').map((l) => (l ? pad + l : l)).join('\n');
}

// Monta o .spec.ts de validação negativa (skill cenarios-negativos-twygo) de forma DETERMINÍSTICA —
// só o conteúdo (comentário/setup/cenários/asserção) vem da IA; a FORMA (1 array + 1 test() em loop,
// nunca N tests separados) é garantida aqui em código, porque testado ao vivo 2x: pedir isso só por
// prompt não é confiável (gpt-5 ignorou a instrução mesmo com exemplo de código embutido).
function buildNegativeMatrixSpec(p) {
  const suiteName = String(p?.suiteName || 'Validações negativas').trim();
  const fileComment = String(p?.fileComment || 'Validação negativa gerada por IA — revisar antes de usar.').trim();
  const extraImports = String(p?.extraImports || '').trim();
  const setupCode = String(p?.setupCode || '// TODO: setup não gerado pela IA — revisar').trim();
  const assertCode = String(p?.assertCode || '// TODO: asserção não gerada pela IA — revisar').trim();
  const cleanupCode = String(p?.cleanupCode || '').trim();
  const scenarios = Array.isArray(p?.scenarios)
    ? p.scenarios
        .map((s) => ({ nome: String(s?.nome || ''), categoria: String(s?.categoria || ''), input: String(s?.input ?? ''), esperado: String(s?.esperado || '') }))
        .filter((s) => s.nome)
    : [];
  const warn = scenarios.length ? '' : '// ⚠ AVISO: a IA não devolveu cenários — gere de novo ou preencha "cenarios" à mão.\n';
  return `/*
${fileComment}
Padrão data-driven (skill cenarios-negativos-twygo): 1 array de cenários + 1 test() em loop.
*/
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
${extraImports ? extraImports + '\n' : ''}
test.describe('${suiteName}', () => {
  async function openForm(page) {
${indent(setupCode, 4)}
  }

  ${warn}const cenarios = ${JSON.stringify(scenarios, null, 2)};

  for (const c of cenarios) {
    test(\`${suiteName}: \${c.nome} (categoria \${c.categoria})\`, async ({ page }) => {
      const { fieldInput, saveBtn, errorEl } = await openForm(page);
${indent(assertCode, 6)}
    });
  }
${cleanupCode ? `\n  test.afterAll(async () => {\n${indent(cleanupCode, 4)}\n  });\n` : ''}});
`;
}

// Enxuga a árvore do parsed.json pro que a tela precisa (nome, casos, auto/manual, tipo).
const trimSuite = (s) => ({
  name: s.name,
  org: s.org || '',                              // chave simbólica: principal|secundario|trial|... (pré-requisito de org)
  preconditions: s.preconditionsList || [],      // pré-condições da suíte (prosa) — o que precisa existir/estar ativo
  cases: (s.testCases || []).map((tc) => ({
    name: tc.name,
    exec: tc.executionType || '',
    type: tc.type || '',
    importance: tc.importance || '',
    precond: tc.preconditions || '',             // pré-condições do caso (prosa; pode citar "≥1 curso", "aluno", "flag")
    summary: tc.summary || '',
    vmatrix: tc.validationMatrix || [],          // matriz de cenários negativos (skill cenarios-negativos-twygo, categorias A-H)
  })),
  children: (s.childSuites || []).map(trimSuite),
});

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname === '/') {
      let html = await readFile(join(__dirname, 'index.html'), 'utf8');
      const nonce = randomBytes(16).toString('base64');
      html = html.replaceAll('__CSPNONCE__', nonce);
      const csp = [
        "default-src 'self'", `script-src 'self' 'nonce-${nonce}'`, "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:", "font-src 'self'", "connect-src 'self'",
        "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'",
      ].join('; ');
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store',
        'content-security-policy': csp, 'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY', 'referrer-policy': 'no-referrer',
      });
      return res.end(html);
    }

    // Assets estáticos (logo, mascotes Sophia, fontes da marca). Sem path traversal.
    if (url.pathname.startsWith('/assets/')) {
      const rel = url.pathname.replace(/^\/assets\//, '').replace(/\.\./g, '');
      const file = join(__dirname, 'assets', rel);
      const ext = rel.split('.').pop().toLowerCase();
      const ctype = { png: 'image/png', ttf: 'font/ttf', woff2: 'font/woff2', svg: 'image/svg+xml', js: 'text/javascript' }[ext] || 'application/octet-stream';
      const buf = await readFile(file);
      res.writeHead(200, { 'content-type': ctype, 'cache-control': 'max-age=86400' });
      return res.end(buf);
    }

    // Lista os projetos (pastas em agent-playwright/projects).
    if (url.pathname === '/api/projects') {
      const pdir = join(AP, 'projects');
      // Pasta ausente = agent-playwright não está onde esperamos. Não é erro fatal: devolve lista vazia
      // (UI mostra "nenhum projeto") em vez de estourar 500. Correção real = apontar QA_AGENT_PLAYWRIGHT.
      if (!existsSync(pdir)) return json(res, 200, []);
      const dirs = await readdir(pdir, { withFileTypes: true });
      return json(res, 200, dirs.filter((d) => d.isDirectory()).map((d) => d.name));
    }

    // Árvore suíte→casos de um projeto. Roda agent:parse se faltar (ou ?reparse=1 pra regenerar).
    if (url.pathname === '/api/suites') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      const parsed = join(AP, 'outputs', project, 'test-analysis.parsed.json');
      if (!existsSync(parsed) || url.searchParams.get('reparse')) {
        // projeto sem Análise de Teste (test-analysis.md) → não é erro; devolve vazio com sinal noAt.
        if (!existsSync(join(AP, 'projects', project, 'inputs', 'test-analysis.md'))) return json(res, 200, { totals: {}, suites: [], noAt: true });
        const r = await runNpm('agent:parse', project);
        if (r.code !== 0) return json(res, 500, { error: 'falha no agent:parse', detail: r.stderr || r.stdout });
      }
      const j = JSON.parse(await readFile(parsed, 'utf8'));
      return json(res, 200, { totals: j.totals, suites: (j.rootSuite.childSuites || []).map(trimSuite) });
    }

    // Execução ao vivo de uma suíte — streama a saída do `agent:run` via SSE.
    if (url.pathname === '/api/run') {
      const project = url.searchParams.get('project');
      const suite = (url.searchParams.get('suite') || '').replace(/[\r\n]/g, '').trim();
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      if (!suite) return json(res, 400, { error: 'suite obrigatória' });
      res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', connection: 'keep-alive', 'x-accel-buffering': 'no' });
      const send = (o) => res.write('data: ' + JSON.stringify(o) + '\n\n');
      send({ type: 'start', suite });
      // Injeta credenciais do form de Conexão (R3) como as env vars do profile, se salvas. Senha nunca é logada.
      const extraEnv = {};
      const conn = await readConn(project);
      if (conn.email || conn.password) {
        const info = await projectEnvInfo(project).catch(() => ({})); // não lança: headers SSE já foram enviados
        if (info.emailVar && conn.email) extraEnv[info.emailVar] = conn.email;
        if (info.passVar && conn.password) extraEnv[info.passVar] = conn.password;
      }
      // Organizações adicionais salvas na Conexão (quantas o QA quiser) → injeta as vars de cada profile.
      const envsForRun = await readEnvs();
      for (const [name, c] of Object.entries(conn.secondary || {})) {
        const pv = profileVars(envsForRun, name);
        if (pv.emailVar && c.email) extraEnv[pv.emailVar] = c.email;
        if (pv.passVar && c.password) extraEnv[pv.passVar] = c.password;
      }
      // Profiles que os specs leem no import (ex.: -aditional): sem valor o import quebra o run inteiro.
      // Se não veio da Conexão nem do .env, injeta PLACEHOLDER (login falha e o global-setup pula esses specs).
      const apEnv = await apDotenv();
      for (const p of await secondaryProfiles(project)) {
        if (p.emailVar && !extraEnv[p.emailVar]) extraEnv[p.emailVar] = apEnv[p.emailVar] || 'noauth@placeholder.local';
        if (p.passVar && !extraEnv[p.passVar]) extraEnv[p.passVar] = apEnv[p.passVar] || 'placeholder';
      }
      if (conn.stageUrl) extraEnv.QA_UI_BASE_URL = conn.stageUrl; // "mudar URL do stage" → aponta o run inteiro
      // shell:false + args como array → nome da suíte (com espaços/acentos) vai como 1 argumento, sem re-split.
      const child = spawn(process.execPath, [TSX, ORCHESTRATOR, '--suite', suite], { cwd: AP, env: { ...process.env, PROJECT: project, FORCE_COLOR: '0', ...extraEnv } });
      let buf = '', envErrVar = null;
      const onData = (chunk) => {
        buf += chunk.toString();
        let i;
        while ((i = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, i).replace(/\r$/, ''); buf = buf.slice(i + 1);
          const m = line.match(/===\s*Fase\s*([^=]+?)\s*===/i);
          if (m) send({ type: 'phase', name: m[1].trim() });
          // credencial/config ausente: o Playwright nem carrega → 0 testes. Captura a var pra mensagem honesta.
          // IGNORA avisos não-fatais do global-setup (login secundário opcional que ele pula sozinho).
          const ev = line.match(/Vari[áa]vel de ambiente "([A-Z0-9_]+)"[^]*?n[ãa]o definida/i);
          if (ev && !envErrVar && !/ser[ãa]o pulados|preparar storage|\[warn\]|storage adicional|storage secund/i.test(line)) envErrVar = ev[1];
          send({ type: 'log', line });
        }
      };
      child.stdout.on('data', onData);
      child.stderr.on('data', onData);
      child.on('close', async (code) => { if (buf) { const ev = buf.match(/Vari[áa]vel de ambiente "([A-Z0-9_]+)"[^]*?n[ãa]o definida/i); if (ev && !envErrVar && !/ser[ãa]o pulados|preparar storage|\[warn\]|storage adicional|storage secund/i.test(buf)) envErrVar = ev[1]; send({ type: 'log', line: buf }); } send({ type: 'done', exitCode: code, stats: await readStats(project), envError: envErrVar }); res.end(); });
      child.on('error', (e) => { send({ type: 'log', line: 'erro ao iniciar: ' + e }); send({ type: 'done', exitCode: -1, stats: null }); res.end(); });
      req.on('close', () => { try { child.kill(); } catch {} });
      return;
    }

    // Resultados (F0.4): lista de runs.
    if (url.pathname === '/api/runs') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      return json(res, 200, await listRuns(project));
    }

    // Status por caso (TCN) de um run — pro comentário KQA de suítes automatizadas.
    // Casa pelo NÚMERO em "TCN — ..." no título do teste (convenção do gerador) — não por texto,
    // evita fragilidade de match textual (nome do caso na AT pode ter crase/pontuação diferente do título do spec).
    if (url.pathname === '/api/run-cases') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      const base = url.searchParams.get('source') === 'archive' ? 'outputs-archive' : 'outputs';
      const run = url.searchParams.get('run') || '';
      if (!noTraversal(run) || run.includes('/')) return json(res, 400, { error: 'run inválido' });
      try {
        const raw = JSON.parse(await readFile(join(AP, base, project, 'reports', run, 'tests.json'), 'utf8'));
        const STATUS = { passed: 'pass', failed: 'fail', timedOut: 'fail', interrupted: 'fail', skipped: 'skip' };
        const byTc = {};
        const walk = (suite) => {
          for (const spec of (suite.specs || [])) {
            const m = String(spec.title || '').match(/^TC(\d+)\b/i);
            if (!m) continue;
            const last = (spec.tests || []).flatMap((t) => t.results || []).pop();
            if (!last) continue;
            // path do attachment é absoluto (fs da máquina que rodou); reports/<run>/artifacts/ tem a MESMA
            // subpasta (test-artifacts/<pasta>/...) copiada — recorta a partir de "test-artifacts" pra virar
            // um caminho relativo ao bundle do run (mesma convenção usada no tests.md/report-asset).
            const screenshots = (last.attachments || [])
              .filter((a) => a.name === 'screenshot' && a.path)
              .map((a) => { const i = a.path.replace(/\\/g, '/').indexOf('test-artifacts/'); return i < 0 ? null : 'artifacts/' + a.path.replace(/\\/g, '/').slice(i + 'test-artifacts/'.length); })
              .filter(Boolean);
            byTc[m[1]] = { status: STATUS[last.status] || '', screenshots };
          }
          for (const s of (suite.suites || [])) walk(s);
        };
        (raw.suites || []).forEach(walk);
        return json(res, 200, { cases: byTc });
      } catch { return json(res, 404, { error: 'resultados não encontrados' }); }
    }

    // Resultados: Markdown cru de um arquivo do bundle (index|tests|exploratory) ou de um .md avulso.
    if (url.pathname === '/api/report') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      const base = url.searchParams.get('source') === 'archive' ? 'outputs-archive' : 'outputs';
      const loose = url.searchParams.get('loose');
      let target;
      if (loose) {
        if (!noTraversal(loose) || loose.includes('/') || !loose.endsWith('.md')) return json(res, 400, { error: 'arquivo inválido' });
        target = join(AP, base, project, 'reports', loose);
      } else {
        const run = url.searchParams.get('run'); const file = url.searchParams.get('file');
        if (!noTraversal(run) || run.includes('/')) return json(res, 400, { error: 'run inválido' });
        if (!['index', 'tests', 'exploratory'].includes(file)) return json(res, 400, { error: 'file inválido' });
        target = join(AP, base, project, 'reports', run, file + '.md');
      }
      try { const md = await readFile(target, 'utf8'); res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }); return res.end(md); }
      catch { return json(res, 404, { error: 'relatório não encontrado' }); }
    }

    // Resultados: evidências (imagens em <bundle>/artifacts/...). Allow-list de imagem + sem traversal.
    if (url.pathname === '/api/report-asset') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      const base = url.searchParams.get('source') === 'archive' ? 'outputs-archive' : 'outputs';
      const run = url.searchParams.get('run') || ''; const p = url.searchParams.get('path') || '';
      if (!noTraversal(run) || run.includes('/') || !noTraversal(p)) return json(res, 400, { error: 'inválido' });
      const ctype = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' }[p.split('.').pop().toLowerCase()];
      if (!ctype) return json(res, 400, { error: 'tipo não permitido' });
      try { const buf = await readFile(join(AP, base, project, 'reports', run, p)); res.writeHead(200, { 'content-type': ctype, 'cache-control': 'max-age=3600' }); return res.end(buf); }
      catch { return json(res, 404, { error: 'asset não encontrado' }); }
    }

    // Status da IA (Codex) — só diz se está configurada + últimos 4 dígitos mascarados. NUNCA devolve a chave.
    if (url.pathname === '/api/ai-status') {
      const engine = await aiEngine();
      const k = await codexKey();
      const codexCliAvailable = engine === AI_ENGINES.CODEX_CLI ? await commandAvailable(process.env.CODEX_CLI_BIN || 'codex') : false;
      // sk-proj real ~164 chars; muito menor = provavelmente truncada.
      const looksShort = !!k && (k.startsWith('sk-proj-') ? k.length < 140 : k.length < 40);
      // configured: fallback automático cobre CLI ausente/sem créditos se houver chave de reserva.
      const configured = codexCliAvailable || !!k;
      return json(res, 200, { engine, engineLabel: engineLabel(engine), codexCliAvailable, configured, needsKey: engine !== AI_ENGINES.CODEX_CLI, codex: !!k, hint: k ? '••••' + k.slice(-4) : '', len: k.length, looksShort, model: await aiModel() });
    }

    // Modelo/motor de IA ativo (configurável). GET → estado; POST {model, engine} → grava em state/settings.json.
    if (url.pathname === '/api/ai-model') {
      if (req.method === 'POST') {
        let data; try { data = JSON.parse((await readBody(req)) || '{}'); } catch { return json(res, 400, { error: 'json inválido' }); }
        const m = String(data.model || '').trim();
        if (!m || !/^[\w.:-]+$/.test(m)) return json(res, 400, { error: 'modelo inválido' });
        const dir = join(__dirname, 'state'); await mkdir(dir, { recursive: true });
        const s = await readSettings(); s.model = m;
        if (data.engine !== undefined) s.engine = normalizeEngine(data.engine);
        await writeFile(join(dir, 'settings.json'), JSON.stringify(s, null, 2));
        return json(res, 200, { ok: true, model: m, engine: await aiEngine() });
      }
      const prices = await loadPrices();
      const cur = await aiModel();
      // ponytail: claude-* está no ai-prices.json só pra precificar o ledger do motor claude-api do agente de AT — não é modelo escolhível pro engine OpenAI/Codex.
      const models = [...new Set([cur, ...Object.keys(prices).filter((k) => !k.startsWith('_') && !k.startsWith('claude-'))])];
      const engine = await aiEngine();
      return json(res, 200, {
        model: cur, models, engine,
        engines: [{ id: AI_ENGINES.OPENAI_API, label: 'OpenAI API' }, { id: AI_ENGINES.CODEX_CLI, label: 'Codex CLI' }],
        envForced: !!process.env.OPENAI_MODEL,
        engineEnvForced: !!(process.env.AI_ENGINE || process.env.CODEX_AI_ENGINE),
      });
    }

    // Motor do agente de AT (Codex CLI vs API do Claude). GET → estado dos 2; POST {engine} → grava em state/settings.json.atEngine.
    if (url.pathname === '/api/at-engine') {
      if (req.method === 'POST') {
        let data; try { data = JSON.parse((await readBody(req)) || '{}'); } catch { return json(res, 400, { error: 'json inválido' }); }
        const dir = join(__dirname, 'state'); await mkdir(dir, { recursive: true });
        const s = await readSettings(); s.atEngine = normalizeAtEngine(data.engine);
        await writeFile(join(dir, 'settings.json'), JSON.stringify(s, null, 2));
        return json(res, 200, { ok: true, engine: await atEngine() });
      }
      const engine = await atEngine();
      const codexCliAvailable = await commandAvailable(process.env.CODEX_CLI_BIN || 'codex');
      const hasKey = !!(await anthropicKey());
      const engines = [AT_ENGINES.CODEX_CLI, AT_ENGINES.CLAUDE_API].map((id) => ({
        id, label: atEngineLabel(id), ...atEngineConfigStatus({ engine: id, codexCliAvailable, hasKey }),
      }));
      return json(res, 200, { engine, engines, envForced: !!process.env.AT_ENGINE });
    }

    // Custo por token (F2): agrega o ledger de uso × preço do modelo × câmbio USD→BRL do dia.
    if (url.pathname === '/api/cost') {
      const [events, prices, fx] = [await readUsage(), await loadPrices(), await getFx()];
      const priceOf = (m) => prices[m] || prices._default || { in: 0.15, out: 0.6 };
      let usd = 0, tIn = 0, tOut = 0;
      const enriched = events.map((e) => {
        const c = costOf(e, priceOf(e.model));
        usd += c; tIn += e.in || 0; tOut += e.out || 0;
        return { ...e, usd: c, brl: fx.rate ? c * fx.rate : null };
      });
      const modelPrices = Object.fromEntries(Object.entries(prices).filter(([k]) => !k.startsWith('_')));
      return json(res, 200, { fx, prices: modelPrices, events: enriched.reverse(), totals: { tokensIn: tIn, tokensOut: tOut, usd, brl: fx.rate ? usd * fx.rate : null }, count: events.length });
    }

    // Geração de casos de teste via IA (F1). OpenAI-compatível; endpoint/modelo/projeto configuráveis por env. Chave nunca é logada.
    if (url.pathname === '/api/generate' && req.method === 'POST') {
      let data; try { data = JSON.parse((await readBody(req)) || '{}'); } catch { return json(res, 400, { error: 'json inválido' }); }
      if (!(await aiConfigured())) return json(res, 400, { error: 'nenhum motor de IA configurado (ver Conexão).' });
      const desc = String(data.description || '').trim();
      if (!desc) return json(res, 400, { error: 'descreva a funcionalidade a testar.' });
      const mode = data.mode === 'manual' ? 'manual' : 'automatizado';
      const count = Math.min(Math.max(parseInt(data.count, 10) || 6, 1), 20);
      const sys = `Você é QA sênior da Twygo (educação corporativa). Gere casos de teste ${mode === 'manual' ? 'MANUAIS (execução humana)' : 'AUTOMATIZÁVEIS E2E'}, claros e específicos. Responda SOMENTE JSON: {"casos":[{"nome":"título curto","passos":["passo 1","passo 2"],"tipo":"ui|api|db","prioridade":"alta|media|baixa"}]}.`;
      const user = `Funcionalidade a testar:\n${desc}\n\nGere ${count} casos ${mode}. Cubra caminho feliz e validações negativas relevantes.`;
      const ai = await aiComplete({ system: sys, user, json: true, temp: 0.4 });
      if (!ai.ok) return json(res, 502, { error: friendlyErr(ai.status) });
      let parsed = {}; try { parsed = parseJsonResponse(ai.content || '{}'); } catch {}
      await appendUsage({ ts: new Date().toISOString(), action: 'gerar-casos', project: safeSlug(data.project) ? data.project : '', model: ai.model, in: ai.usageIn, out: ai.usageOut });
      return json(res, 200, { casos: Array.isArray(parsed.casos) ? parsed.casos : [], model: ai.model, usage: { in: ai.usageIn, out: ai.usageOut } });
    }

    // Conexão (R3): stage URL (do profile) + login/senha por projeto. Senha NUNCA volta pro cliente nem vai pra log.
    if (url.pathname === '/api/conn') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      const dir = join(__dirname, 'state');
      const file = join(dir, `${project}-conn.json`);
      if (req.method === 'POST') {
        let data;
        try { data = JSON.parse((await readBody(req)) || '{}'); } catch { return json(res, 400, { error: 'json inválido' }); }
        const prev = await readConn(project);
        // senha em branco no POST = mantém a atual (não zera por engano). stageUrl vazio = usa a URL padrão do profile.
        const conn = {
          email: String(data.email ?? prev.email ?? ''),
          password: data.password ? String(data.password) : (prev.password || ''),
          stageUrl: data.stageUrl !== undefined ? String(data.stageUrl).trim() : (prev.stageUrl || ''),
          secondary: {},
        };
        // Organizações adicionais: data.secondary é AUTORITATIVO (o que não vier = removido).
        // senha em branco mantém a anterior daquele profile. Ignora entradas sem profile.
        if (data.secondary && typeof data.secondary === 'object') {
          for (const [name, c] of Object.entries(data.secondary)) {
            if (!name || !safeSlug(name)) continue;
            const p = (prev.secondary || {})[name] || {};
            const password = c.password ? String(c.password) : (p.password || '');
            const email = String(c.email ?? '');
            if (!email && !password) continue; // linha sem cred (ex.: "necessária" em branco) não vira entrada salva
            conn.secondary[name] = { email, password };
          }
        } else {
          conn.secondary = prev.secondary || {}; // POST sem secondary (ex.: só stage/senha) não mexe nas orgs
        }
        await mkdir(dir, { recursive: true });
        await writeFile(file, JSON.stringify(conn, null, 2));
        return json(res, 200, { ok: true });
      }
      const info = await projectEnvInfo(project).catch(() => ({}));
      const conn = await readConn(project);
      const defaultUrl = info.baseUrl || '';
      const envs = await readEnvs();
      const saved = conn.secondary || {};
      const needed = await secondaryProfiles(project).catch(() => []);
      // secondary = união dos profiles que os specs pedem + os que o QA já salvou.
      const keys = [...new Set([...needed.map((p) => p.profileName), ...Object.keys(saved)])];
      const secondary = keys.map((name) => {
        const pv = profileVars(envs, name); const c = saved[name] || {};
        return { profile: name, orgId: pv.orgId, baseUrl: pv.baseUrl, email: c.email || '', hasPassword: !!c.password, needed: needed.some((n) => n.profileName === name) };
      });
      // todos os profiles disponíveis pra adicionar (menos o principal), pro dropdown.
      const availableProfiles = Object.keys(envs)
        .filter((n) => n !== info.profileName && envs[n] && envs[n].credentials)
        .map((n) => ({ profile: n, orgId: envs[n].orgId || '' }));
      return json(res, 200, { stageUrl: conn.stageUrl || defaultUrl, defaultUrl, custom: !!conn.stageUrl, orgId: info.orgId || '', profile: info.profileName || '', email: conn.email || '', hasPassword: !!conn.password, secondary, availableProfiles });
    }

    // Geração de SPEC .spec.ts no padrão do repo Twygo QA (F1 v2, beta). Salva rascunho em _ia-draft/ pra revisão.
    if (url.pathname === '/api/generate-spec' && req.method === 'POST') {
      let data; try { data = JSON.parse((await readBody(req)) || '{}'); } catch { return json(res, 400, { error: 'json inválido' }); }
      if (!(await aiConfigured())) return json(res, 400, { error: 'nenhum motor de IA configurado (ver Conexão).' });
      const project = safeSlug(data.project) ? data.project : '';
      const desc = String(data.description || '').trim();
      if (!desc) return json(res, 400, { error: 'descreva a suíte/funcionalidade.' });
      let ai, code;
      if (data.negativeMatrix) {
        // Matriz de cenários negativos: a FORMA do spec (1 array + 1 test() em loop) é montada em
        // código (buildNegativeMatrixSpec) — a IA só preenche os pedaços de conteúdo via JSON.
        const sys = [
          'Você prepara os PEDAÇOS de um spec Playwright de validação NEGATIVA data-driven (categorias A-H da skill cenarios-negativos-twygo: A=obrigatoriedade, B=boundary, C=caracteres permitidos, D=injection, E=tipo errado, F=extensão de arquivo, G=MIME mismatch, H=tamanho de arquivo). Responda SOMENTE JSON com este formato:',
          '{"fileComment":"comentário topo: o que valida + nota de cleanup","extraImports":"linhas de import extras (POMs etc.) além de test/expect, uma por linha, ou vazio","suiteName":"título curto da suíte","setupCode":"código async que roda dentro de uma função openForm(page) já declarada — navega (via safeGoto, nunca page.goto cru), abre o formulário/tela, e TERMINA com `return { fieldInput, saveBtn, errorEl };` usando os nomes de variável que fizerem sentido pra tela real","scenarios":[{"nome":"curto","categoria":"A|B|C|D|E|F|G|H","input":"valor literal do cenário","esperado":"comportamento esperado, vira comentário"}],"assertCode":"código que roda DENTRO do loop; já tem em escopo page, fieldInput, saveBtn, errorEl (o que setupCode retornou) e c (cenário atual — c.input/c.categoria/c.esperado/c.nome); preenche fieldInput com c.input e assert conforme c.esperado","cleanupCode":"corpo do test.afterAll, ou string vazia se não precisar"}',
          '- scenarios: cubra TODAS as categorias A-H que se aplicam ao campo descrito — não invente categoria que não se aplica (ex.: campo texto comum não tem F/G/H, que são de upload).',
          '- Seletores: getByTestId (data-test-id), escopados pra evitar strict-mode; nunca encadear getByTestId a partir de <input>/<button> void.',
          '- Ambiente: getBaseUrl()/getOrgId() de src/utils/environment.js dentro do setupCode se precisar — nunca hardcode URL/orgId.',
        ].join('\n');
        ai = await aiComplete({ system: sys, user: `Suíte/funcionalidade a testar (projeto ${project || '?'}):\n${desc}\n\nMonte os pedaços do spec de validação negativa.`, json: true, temp: 0.3 });
        if (!ai.ok) return json(res, 502, { error: friendlyErr(ai.status) });
        let parts = {};
        try { parts = parseJsonResponse(ai.content || '{}'); } catch { return json(res, 502, { error: 'a IA não devolveu JSON válido — tente de novo.' }); }
        code = buildNegativeMatrixSpec(parts);
      } else {
        const sys = [
          'Você gera UM arquivo .spec.ts de teste E2E Playwright NO PADRÃO do repo Twygo QA (agent-playwright). Regras OBRIGATÓRIAS:',
          '- Cabeçalho em comentário: referência ao MD canônico + o que valida + nota de cleanup.',
          "- Imports: test/expect de '../../../../../src/fixtures/exploratory-fixture.js', allure-js-commons, POMs de '../../pages/', e um .data.ts irmão pros dados.",
          '- Ambiente: use getBaseUrl()/getOrgId()/getEnvByName() de src/utils/environment.js — NUNCA hardcode URL nem orgId.',
          '- Navegação via safeGoto (retry de rede), nunca page.goto cru. Login/storageState já vêm do setup.',
          '- Seletores: prefira getByTestId (data-test-id), escopados pra evitar strict-mode; NÃO encadeie getByTestId a partir de <input> void.',
          '- Asserções por INVARIANTE (ex.: "o primeiro item mudou"), NUNCA acopladas a count exato de seed. Timeouts explícitos pós-hydration (SPA Chakra/React).',
          '- test.describe + um test() por caso; se criar dados, test.afterAll com cleanup via API DELETE.',
          '- Se a suíte envolver validações negativas de campo (obrigatoriedade/boundary/caracteres/injection), prefira o modo "Matriz de validação negativa" da tela em vez de tentar cobrir aqui — ele garante o padrão data-driven da skill cenarios-negativos-twygo.',
          '- Responda SOMENTE o código .spec.ts, sem cercas markdown, sem explicação.',
        ].join('\n');
        ai = await aiComplete({ system: sys, user: `Suíte/funcionalidade a testar (projeto ${project || '?'}):\n${desc}\n\nGere o .spec.ts completo.`, temp: 0.2 });
        if (!ai.ok) return json(res, 502, { error: friendlyErr(ai.status) });
        code = stripMarkdownFence(ai.content || '');
      }
      await appendUsage({ ts: new Date().toISOString(), action: 'gerar-spec', project, model: ai.model, in: ai.usageIn, out: ai.usageOut });
      let saved = '';
      if (project && code) { // salva rascunho pra revisão (NUNCA sobrescreve spec real) — em projects/<slug>/tests/features/_ia-draft/
        const dir = join(AP, 'projects', project, 'tests', 'features', '_ia-draft');
        const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        await mkdir(dir, { recursive: true });
        await writeFile(join(dir, `ia-${stamp}.spec.ts`), code);
        saved = `projects/${project}/tests/features/_ia-draft/ia-${stamp}.spec.ts`;
      }
      return json(res, 200, { code, saved, model: ai.model, usage: { in: ai.usageIn, out: ai.usageOut } });
    }

    // Progresso do checklist manual — persistência simples em arquivo (sem banco).
    if (url.pathname === '/api/manual') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      const dir = join(__dirname, 'state');
      const file = join(dir, `${project}-manual.json`);
      if (req.method === 'POST') {
        let data;
        try { data = JSON.parse((await readBody(req)) || '{}'); } catch { return json(res, 400, { error: 'json inválido' }); }
        await mkdir(dir, { recursive: true });
        await writeFile(file, JSON.stringify(data, null, 2));
        return json(res, 200, { ok: true });
      }
      try { return json(res, 200, JSON.parse(await readFile(file, 'utf8'))); }
      catch { return json(res, 200, {}); }
    }

    // --- agent-db (R2): hub multi-agente, agente headless de validação read-only em banco ---
    // Lista os specs de validação disponíveis em agent-db/inputs/.
    if (url.pathname === '/api/db/inputs') {
      try {
        const entries = await readdir(join(ADB, 'inputs'), { withFileTypes: true });
        return json(res, 200, { inputs: entries.filter((e) => e.isFile() && /\.(ya?ml|json)$/i.test(e.name)).map((e) => e.name).sort() });
      } catch { return json(res, 200, { inputs: [] }); }
    }

    // Testa a conexão (fase Init — SELECT 1). Read-only, seguro. Erro real vai pro log da UI.
    if (url.pathname === '/api/db/check' && req.method === 'POST') {
      const r = await runDb(['--check-connection']);
      const log = (r.stdout + r.stderr).trim().split('\n').slice(-12).join('\n');
      return json(res, 200, { ok: r.code === 0, code: r.code, log });
    }

    // Roda um spec de validação e devolve o report.json parseado.
    if (url.pathname === '/api/db/run' && req.method === 'POST') {
      let data; try { data = JSON.parse((await readBody(req)) || '{}'); } catch { return json(res, 400, { error: 'json inválido' }); }
      const input = String(data.input || '');
      // só um arquivo de inputs/ (sem path, sem traversal) — cliente não manda YAML arbitrário no v1.
      if (!input || input.includes('/') || input.includes('\\') || input.includes('..') || !/\.(ya?ml|json)$/i.test(input)) return json(res, 400, { error: 'input inválido' });
      const inPath = join(ADB, 'inputs', input);
      if (!existsSync(inPath)) return json(res, 404, { error: 'input não encontrado' });
      const outPath = join(ADB, 'output', 'ui-' + Date.now(), 'report.json');
      const r = await runDb(['--input', inPath, '--output', outPath]);
      let report = null;
      try { report = JSON.parse(await readFile(outPath, 'utf8')); } catch {}
      if (!report) {
        const log = (r.stdout + r.stderr).trim().split('\n').slice(-15).join('\n');
        return json(res, 502, { error: 'a validação não gerou report — confira a conexão/dependências do agent-db.', code: r.code, log });
      }
      return json(res, 200, { report, code: r.code });
    }

    // Gera um spec de validação do agent-db por IA (R2 v2). Aterrado no schema REAL (src/validators/spec.py).
    if (url.pathname === '/api/db/generate-spec' && req.method === 'POST') {
      let data; try { data = JSON.parse((await readBody(req)) || '{}'); } catch { return json(res, 400, { error: 'json inválido' }); }
      if (!(await aiConfigured())) return json(res, 400, { error: 'nenhum motor de IA configurado (ver Conexão).' });
      const desc = String(data.description || '').trim();
      if (!desc) return json(res, 400, { error: 'descreva o que validar no banco.' });
      const slug = safeSlug(data.slug) ? data.slug : '';
      // Prompt aterrado no ValidationInput/ValidationSpec do agent-db — MESMO padrão do repo (nomes de campo exatos).
      const sys = [
        'Você gera um spec de validação READ-ONLY de banco no formato JSON EXATO do agent-db (Twygo QA). Responda SOMENTE JSON, sem cercas markdown.',
        'Topo: {"slug":"kebab-case","connection":"default","validations":[ ... ]}.',
        'Cada item de validations: {"id":"kebab-case-único","type":"<tipo>","table":"nome_tabela","column":"col opcional","where":{coluna:valor},"expect":{...},"description":"frase clara em pt-BR"}.',
        'Tipos permitidos e o expect de cada um (use SÓ estes nomes de campo):',
        '- count: where + expect:{"count":N}  — quantidade esperada de registros.',
        '- presence: where  — garante ≥1 registro (sem expect).',
        '- absence: where  — garante NENHUM registro (sem expect).',
        '- equals: column + where + expect:{"value":X}  — a coluna vale X nos registros filtrados.',
        '- view_definition: table=nome da view + expect:{"columns":["c1","c2"]}  — a view expõe essas colunas.',
        'Existem ainda compare_orgs, fk_integrity e time_window — só use se o pedido for claramente disso; na dúvida prefira os 5 acima.',
        'REGRAS: nunca escreva SQL (o agente monta a query); where é igualdade simples coluna:valor; ids únicos e descritivos. Se o usuário não informar a tabela/coluna real, use um nome plausível do domínio e diga na description que precisa confirmar o nome.',
      ].join('\n');
      const user = `O que validar no banco${slug ? ` (slug ${slug})` : ''}:\n${desc}\n\nGere o JSON do spec no schema acima.`;
      const ai = await aiComplete({ system: sys, user, json: true, temp: 0.3 });
      if (!ai.ok) return json(res, 502, { error: friendlyErr(ai.status) });
      let spec = {}; try { spec = parseJsonResponse(ai.content || '{}'); } catch {}
      if (slug && !spec.slug) spec.slug = slug;
      if (!spec.connection) spec.connection = 'default';
      await appendUsage({ ts: new Date().toISOString(), action: 'gerar-db-spec', project: slug, model: ai.model, in: ai.usageIn, out: ai.usageOut });
      return json(res, 200, { spec, invalid: dbSpecErrors(spec), model: ai.model, usage: { in: ai.usageIn, out: ai.usageOut } });
    }

    // Salva um spec gerado em agent-db/inputs/<slug>.json (nunca sobrescreve). Valida contra o schema do repo antes.
    if (url.pathname === '/api/db/save-spec' && req.method === 'POST') {
      let data; try { data = JSON.parse((await readBody(req)) || '{}'); } catch { return json(res, 400, { error: 'json inválido' }); }
      const spec = data.spec;
      const errs = dbSpecErrors(spec);
      if (errs.length) return json(res, 400, { error: 'spec fora do padrão do agent-db: ' + errs.join('; ') });
      const slug = safeSlug(data.slug) ? data.slug : (safeSlug(spec.slug) ? spec.slug : '');
      if (!slug) return json(res, 400, { error: 'informe um slug (só letras/números/hífen).' });
      const dir = join(ADB, 'inputs');
      await mkdir(dir, { recursive: true });
      let name = slug + '.json', n = 1;
      while (existsSync(join(dir, name))) { n++; name = `${slug}-${n}.json`; } // nunca sobrescreve spec existente
      await writeFile(join(dir, name), JSON.stringify(spec, null, 2) + '\n');
      return json(res, 200, { saved: name });
    }

    // Contagem REAL de .spec.ts por suíte (título do test.describe). Cruza o catálogo (AT) com os specs em disco.
    if (url.pathname === '/api/specs') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      const dir = join(AP, 'projects', project, 'tests');
      const counts = {};
      try {
        const entries = await readdir(dir, { recursive: true });
        for (const e of entries) {
          if (!e.endsWith('.spec.ts')) continue;
          let src; try { src = await readFile(join(dir, e), 'utf8'); } catch { continue; }
          const titles = new Set();
          const re = /test\.describe\(\s*['"`]([^'"`]+)['"`]/g;
          let m; while ((m = re.exec(src))) titles.add(m[1]);
          for (const t of titles) counts[t] = (counts[t] || 0) + 1; // nº de arquivos com esse describe
        }
      } catch { /* sem pasta tests/ → counts vazio */ }
      return json(res, 200, { counts });
    }

    // --- agent-at (R2): Análise de Teste read-only. O test-analysis.md é o upstream da árvore de Testes. ---
    if (url.pathname === '/api/at') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      const atMd = join(AAT, 'projects', project, 'output', 'test-analysis.md');
      const pubMd = join(AP, 'projects', project, 'inputs', 'test-analysis.md');
      const statOf = async (p) => { try { const s = await stat(p); return { size: s.size, mtime: s.mtime.toISOString() }; } catch { return null; } };
      const atS = await statOf(atMd), pubS = await statOf(pubMd);
      let inSync = null;
      if (atS && pubS) { try { inSync = (await readFile(atMd, 'utf8')) === (await readFile(pubMd, 'utf8')); } catch { inSync = null; } }
      let docs = [];
      try { docs = (await readdir(join(AAT, 'projects', project, 'docs'))).filter((f) => !f.startsWith('.')); } catch {}
      const artifacts = { xmind: false, xml: false };
      try { const outs = await readdir(join(AAT, 'projects', project, 'output')); artifacts.xmind = outs.some((f) => f.endsWith('.xmind')); artifacts.xml = outs.some((f) => f.endsWith('.xml')); } catch {}
      return json(res, 200, { hasAt: !!atS, hasPublished: !!pubS, inSync, docs, artifacts, atWhen: atS?.mtime || '', pubWhen: pubS?.mtime || '', atSize: atS?.size || 0 });
    }

    // Markdown cru do test-analysis.md (fonte agent-at ou cópia publicada). safeSlug + source allow-list.
    if (url.pathname === '/api/at-md') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      const target = url.searchParams.get('source') === 'published'
        ? join(AP, 'projects', project, 'inputs', 'test-analysis.md')
        : join(AAT, 'projects', project, 'output', 'test-analysis.md');
      try { const md = await readFile(target, 'utf8'); res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }); return res.end(md); }
      catch { return json(res, 404, { error: 'test-analysis.md não encontrado' }); }
    }

    // Recarrega uma estrutura-proposta.md já salva em disco (sem disparar claude -p) — pra UI
    // não perder o passo 1 já pago se o QA navegar pra outra aba e voltar.
    if (url.pathname === '/api/at-estrutura' && req.method === 'GET') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      try {
        const estrutura = await readFile(join(AAT, 'projects', project, 'output', 'estrutura-proposta.md'), 'utf8');
        return json(res, 200, { estrutura, approved: /^aprovada:\s*true\s*$/m.test(estrutura) });
      } catch { return json(res, 404, { error: 'nenhuma estrutura proposta salva ainda' }); }
    }

    // Fases 1-3 do /analyze-test: propõe estrutura de suítes (sem casos ainda) via claude -p headless.
    if (url.pathname === '/api/at-plan') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      const engine = await atEngine();
      if (!(await atConfigured(engine))) return json(res, 400, { error: `motor de AT (${atEngineLabel(engine)}) não configurado — veja Conexão/AT.` });
      if (atRunning.has(project)) return json(res, 409, { error: 'já tem uma geração de AT em andamento pra este projeto' });
      atRunning.add(project);
      try {
        res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', connection: 'keep-alive', 'x-accel-buffering': 'no' });
        const send = (o) => res.write('data: ' + JSON.stringify(o) + '\n\n');
        send({ type: 'start' });
        const r = await runAtAgent('plan', { project, engine, cwd: AAT, send, apiKey: await anthropicKey() });
        // nunca lança daqui pra cima — headers SSE já foram enviados, um throw aqui vira unhandled rejection
        try { await appendUsage({ ts: new Date().toISOString(), action: 'gerar-at-plan', project, model: r.model || engine, in: r.usageIn, out: r.usageOut, usd: r.costUsd }); }
        catch (e) { console.error('appendUsage falhou (gerar-at-plan):', e); }
        let estrutura = '';
        try { estrutura = await readFile(join(AAT, 'projects', project, 'output', 'estrutura-proposta.md'), 'utf8'); } catch {}
        send({ type: 'done', ok: r.ok, timedOut: r.timedOut, estrutura });
        res.end();
      } finally {
        atRunning.delete(project);
      }
      return;
    }

    // Grava a estrutura (possivelmente editada pelo QA) como aprovada. Não dispara nada — só salva.
    if (url.pathname === '/api/at-approve' && req.method === 'POST') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      let data; try { data = JSON.parse((await readBody(req)) || '{}'); } catch { return json(res, 400, { error: 'json inválido' }); }
      const estrutura = String(data.estrutura || '').trim();
      if (!estrutura) return json(res, 400, { error: 'estrutura vazia' });
      const dir = join(AAT, 'projects', project, 'output');
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, 'estrutura-proposta.md'), injectApproved(estrutura));
      return json(res, 200, { ok: true });
    }

    // Fases 5-8 do /analyze-test: usa a estrutura já aprovada, escreve os casos + gera os 3 arquivos.
    if (url.pathname === '/api/at-build') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      const engine = await atEngine();
      if (!(await atConfigured(engine))) return json(res, 400, { error: `motor de AT (${atEngineLabel(engine)}) não configurado — veja Conexão/AT.` });
      if (atRunning.has(project)) return json(res, 409, { error: 'já tem uma geração de AT em andamento pra este projeto' });
      atRunning.add(project); // add() logo após has(), sem await no meio — trava atômica antes do check de aprovação
      try {
        // Guarda-custo: só dispara a geração (cara) se a estrutura já foi aprovada via /api/at-approve.
        let estruturaAtual = '';
        try { estruturaAtual = await readFile(join(AAT, 'projects', project, 'output', 'estrutura-proposta.md'), 'utf8'); } catch {}
        if (!/^aprovada:\s*true\s*$/m.test(estruturaAtual)) return json(res, 400, { error: 'nenhuma estrutura aprovada pra este projeto ainda — rode /api/at-plan e aprove primeiro' });
        res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', connection: 'keep-alive', 'x-accel-buffering': 'no' });
        const send = (o) => res.write('data: ' + JSON.stringify(o) + '\n\n');
        send({ type: 'start' });
        const r = await runAtAgent('build', { project, engine, cwd: AAT, send, apiKey: await anthropicKey() });
        // nunca lança daqui pra cima — headers SSE já foram enviados, um throw aqui vira unhandled rejection
        try { await appendUsage({ ts: new Date().toISOString(), action: 'gerar-at-build', project, model: r.model || engine, in: r.usageIn, out: r.usageOut, usd: r.costUsd }); }
        catch (e) { console.error('appendUsage falhou (gerar-at-build):', e); }
        let files = [];
        try { files = (await readdir(join(AAT, 'projects', project, 'output'))).filter((f) => f === 'test-analysis.md' || /^Analise_Teste_.*\.(xmind|xml)$/.test(f)); } catch {}
        send({ type: 'done', ok: r.ok, timedOut: r.timedOut, files });
        res.end();
      } finally {
        atRunning.delete(project);
      }
      return;
    }

    // Gera a AT (test-analysis.md) por IA (B). Input: descrição + .md de contexto (docs/ + output/). Salva DRAFT.
    if (url.pathname === '/api/at-generate' && req.method === 'POST') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      let data; try { data = JSON.parse((await readBody(req)) || '{}'); } catch { return json(res, 400, { error: 'json inválido' }); }
      if (!(await aiConfigured())) return json(res, 400, { error: 'nenhum motor de IA configurado (ver Conexão).' });
      const desc = String(data.description || '').trim();
      // Reúne .md de contexto (docs/ + output/), menos a própria AT e o draft. Cap 24KB.
      let context = '', used = [];
      for (const sub of ['docs', 'output']) {
        if (context.length > 24000) break;
        let files; try { files = await readdir(join(AAT, 'projects', project, sub)); } catch { continue; }
        for (const f of files) {
          if (!f.endsWith('.md') || f === 'test-analysis.md' || f === 'test-analysis.draft.md') continue;
          try { const t = await readFile(join(AAT, 'projects', project, sub, f), 'utf8'); context += `\n\n### ${sub}/${f}\n${t}`; used.push(`${sub}/${f}`); } catch {}
          if (context.length > 24000) break;
        }
      }
      context = context.slice(0, 24000);
      if (!desc && !context) return json(res, 400, { error: 'descreva a funcionalidade, ou tenha .md em agent-at/projects/<slug>/docs|output/.' });
      const sys = [
        'Você gera uma Análise de Teste (AT) da Twygo no formato test-analysis.md canônico. Responda SOMENTE o markdown, sem cercas ```.',
        'ESTRUTURA obrigatória:',
        '1) Frontmatter YAML no topo: contract_version: 1.2 / at_version: 1 / project / project_name / generated_at (ISO) / env: staging / totals: {suites, test_cases, steps}.',
        '2) `# Análise de Teste — <nome>` + 1 parágrafo de escopo.',
        '3) Para CADA suíte, um bloco separado (linha `---` sozinha entre blocos) com frontmatter da suíte e os casos:',
        '   ---',
        '   suite: <nome da suíte>',
        '   executor: playwright',
        '   org: principal            # secundario/trial só se a suíte usar outra org',
        '   preconditions:',
        '     - <pré-condição em prosa: ex. "Feature flag X ativa", "Pelo menos 1 curso pré-existente", "Usuário logado como Admin">',
        '   ---',
        '   # <nome da suíte>',
        '   ## TC1 — <título do caso>',
        '   <resumo/objetivo em 1 linha>',
        '   ### Passos',
        '   1. <ação> → <resultado esperado>',
        'REGRAS: preconditions declaram o que precisa EXISTIR (org, curso, aluno, flag) — é o que alimenta o provisionamento. org=principal por padrão. 3-8 TCs realistas por suíte, passos concretos e verificáveis. Cubra caminho feliz + validações/negativos relevantes.',
      ].join('\n');
      const user = `Projeto: ${project}.${desc ? '\n\nFuncionalidade/requisitos a cobrir (do QA):\n' + desc : ''}\n\nDocumentos de contexto (Discovery/requisitos):\n${context || '(nenhum)'}\n\nGere a AT completa no formato acima.`;
      const ai = await aiComplete({ system: sys, user, temp: 0.3 });
      if (!ai.ok) return json(res, 502, { error: friendlyErr(ai.status) });
      const md = stripMarkdownFence(ai.content || '');
      await appendUsage({ ts: new Date().toISOString(), action: 'gerar-at', project, model: ai.model, in: ai.usageIn, out: ai.usageOut });
      let saved = '';
      if (md) { // salva DRAFT — NUNCA sobrescreve test-analysis.md
        const dir = join(AAT, 'projects', project, 'output');
        await mkdir(dir, { recursive: true });
        await writeFile(join(dir, 'test-analysis.draft.md'), md + '\n');
        saved = `agent-at/projects/${project}/output/test-analysis.draft.md`;
      }
      return json(res, 200, { md, saved, usedContext: used, model: ai.model, usage: { in: ai.usageIn, out: ai.usageOut } });
    }

    // Aviso de update do repo QA: fetch + quantos commits atrás do upstream + working tree sujo.
    if (url.pathname === '/api/update-check') {
      const isRepo = (await git(['rev-parse', '--is-inside-work-tree'])).out === 'true';
      if (!isRepo) return json(res, 200, { repo: false });
      const branch = (await git(['rev-parse', '--abbrev-ref', 'HEAD'])).out;
      const fetched = await git(['fetch', '--quiet'], 25000);
      const upstream = (await git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'])).out;
      if (!upstream) return json(res, 200, { repo: true, branch, upstream: '', behind: 0, ahead: 0, dirty: 0, fetchOk: fetched.code === 0 });
      const behind = parseInt((await git(['rev-list', '--count', 'HEAD..@{u}'])).out || '0', 10) || 0;
      const ahead = parseInt((await git(['rev-list', '--count', '@{u}..HEAD'])).out || '0', 10) || 0;
      const dirty = (await git(['status', '--porcelain'])).out.split('\n').filter(Boolean).length;
      return json(res, 200, { repo: true, branch, upstream, behind, ahead, dirty, fetchOk: fetched.code === 0 });
    }

    // Atualiza o repo (git pull --ff-only — nunca faz merge/rebase; falha limpa se divergir ou tiver mudança local).
    if (url.pathname === '/api/update-pull' && req.method === 'POST') {
      const r = await git(['pull', '--ff-only'], 90000);
      return json(res, 200, { ok: r.code === 0, output: `${r.out}\n${r.err}`.trim().split('\n').slice(-10).join('\n') });
    }

    json(res, 404, { error: 'rota não encontrada' });
  } catch (e) {
    json(res, 500, { error: String(e) });
  }
});

// Bind só em 127.0.0.1 — NUNCA expor na LAN (roda /api/run que executa comandos e guarda credenciais).
server.listen(PORT, '127.0.0.1', () => console.log(`agent-ui em http://localhost:${PORT}  (só localhost · pipeline: ${AP})`));
