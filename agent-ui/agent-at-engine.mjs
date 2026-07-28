// agent-at-engine.mjs — motor headless de AT (Análise de Teste): codex-cli (padrão) ou claude-api
// (ANTHROPIC_API_KEY). Substitui o antigo runClaudeSkill (claude-cli.mjs) — ver
// docs/superpowers/specs/2026-07-28-codex-claude-api-at-agent-design.md (motivo: os Consumer ToS da
// Anthropic pra Claude Pro/sessão pessoal proíbem automação sem API key; os 2 motores aqui não têm
// esse problema — Codex CLI é oficialmente suportado pra automação, e a Messages API cai na exceção
// explícita do ToS).
import { spawn } from 'node:child_process';
import { StringDecoder } from 'node:string_decoder';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';

import { buildCodexPrompt } from './ai-engine.mjs';
import { buildPrompt } from './agent-at-prompts.mjs';

export const AT_ENGINES = { CODEX_CLI: 'codex-cli', CLAUDE_API: 'claude-api' };

export function normalizeAtEngine(value) {
  return String(value || '').trim().toLowerCase() === AT_ENGINES.CLAUDE_API ? AT_ENGINES.CLAUDE_API : AT_ENGINES.CODEX_CLI;
}

export function atEngineLabel(engine) {
  return normalizeAtEngine(engine) === AT_ENGINES.CLAUDE_API ? 'API do Claude' : 'Codex CLI';
}

// Pura (sem I/O) — usada tanto pelo GET /api/at-engine (status dos 2 motores) quanto em testes.
export function atEngineConfigStatus({ engine, codexCliAvailable = false, hasKey = false } = {}) {
  if (normalizeAtEngine(engine) === AT_ENGINES.CLAUDE_API) return { configured: !!hasKey, needsKey: true };
  return { configured: !!codexCliAvailable, needsKey: false };
}

// Ponto de entrada único — mesmo formato de retorno do antigo runClaudeSkill: { ok, costUsd, usageIn, usageOut, model, timedOut }.
export function runAtAgent(promptKey, opts = {}) {
  return normalizeAtEngine(opts.engine) === AT_ENGINES.CLAUDE_API ? runClaudeApiAgent(promptKey, opts) : runCodexAgent(promptKey, opts);
}

// --- Motor codex-cli: `codex exec --json` via stdin, JSONL no stdout. ---

// ponytail: schema do --json do Codex CLI não pôde ser confirmado nesta sessão (sem o binário
// disponível — ver riscos no design doc). Cobre os tipos de evento conhecidos (agent_message,
// exec_command_begin, task_complete, error); se o Codex real emitir formato diferente, o fallback
// pelo exit code do processo (em runCodexAgent) ainda decide ok/not-ok corretamente. Ajustar aqui
// quando confirmado numa máquina com o binário `codex` real.
export function parseCodexJsonLine(line) {
  let o; try { o = JSON.parse(line); } catch { return null; }
  const msg = o.msg || o;
  const type = msg.type;
  if (type === 'agent_message' && msg.message) return { type: 'log', line: msg.message };
  if (type === 'exec_command_begin') return { type: 'phase', name: Array.isArray(msg.command) ? msg.command.join(' ') : String(msg.command || 'comando') };
  if (type === 'task_complete') return { type: 'result', ok: true, usageIn: msg.usage?.input_tokens || 0, usageOut: msg.usage?.output_tokens || 0 };
  if (type === 'error') return { type: 'result', ok: false, usageIn: 0, usageOut: 0 };
  return null;
}

export function runCodexAgent(promptKey, {
  project,
  cwd,
  send = () => {},
  timeoutMs = 20 * 60 * 1000,
  codexBin = process.env.CODEX_CLI_BIN || 'codex',
  args = ['exec', '--sandbox', 'workspace-write', '--json', '--cwd', cwd, '-'],
} = {}) {
  const { system, user } = buildPrompt(promptKey, project);
  const prompt = buildCodexPrompt({ system, user });
  const safeSend = (ev) => { try { send(ev); } catch { /* falha do caller nao pode derrubar o parser */ } };
  return new Promise((settle) => {
    const child = spawn(codexBin, args, { cwd });
    const decoder = new StringDecoder('utf8');
    let buf = '';
    let settled = false;
    // ok:null = nenhum evento de resultado reconhecido ainda -> decide pelo exit code no 'close'.
    let result = { ok: null, usageIn: 0, usageOut: 0 };
    const finish = (final) => { if (settled) return; settled = true; clearTimeout(timer); settle(final); };
    const timer = setTimeout(() => {
      try { child.kill(); } catch {}
      try { child.unref(); } catch {} // se o processo (ou um filho dele) ignorar o sinal, nao prende quem chamou
      finish({ ok: false, usageIn: result.usageIn, usageOut: result.usageOut, model: '', timedOut: true });
    }, timeoutMs);
    const onLine = (line) => {
      if (!line.trim()) return;
      const ev = parseCodexJsonLine(line);
      if (!ev) return;
      if (ev.type === 'result') { result = { ok: ev.ok, usageIn: ev.usageIn, usageOut: ev.usageOut }; return; }
      safeSend(ev.type === 'phase' ? { type: 'phase', name: ev.name } : { type: 'log', line: ev.line });
    };
    child.stdout.on('data', (chunk) => {
      buf += decoder.write(chunk); // StringDecoder guarda sequencias UTF-8 parciais entre chunks (acentos/emoji nos logs)
      let i;
      while ((i = buf.indexOf('\n')) >= 0) { onLine(buf.slice(0, i)); buf = buf.slice(i + 1); }
    });
    child.stderr.on('data', (d) => safeSend({ type: 'log', line: '[stderr] ' + d.toString() }));
    child.on('close', (code) => {
      buf += decoder.end();
      if (buf.trim()) onLine(buf);
      const ok = result.ok === null ? code === 0 : (result.ok && code === 0);
      finish({ ok, usageIn: result.usageIn, usageOut: result.usageOut, model: '', timedOut: false });
    });
    child.on('error', (e) => {
      safeSend({ type: 'log', line: 'erro ao iniciar codex: ' + e });
      finish({ ok: false, usageIn: 0, usageOut: 0, model: '', timedOut: false });
    });
    child.stdin.end(prompt);
  });
}

// --- Motor claude-api: Messages API da Anthropic com tool-use real (read/write/bash), sem CLI nenhum. ---

export function resolveInCwd(cwd, p) {
  const full = resolve(cwd, String(p || ''));
  const rel = relative(cwd, full);
  if (rel.startsWith('..') || isAbsolute(rel)) throw new Error(`caminho fora do projeto: ${p}`);
  return full;
}

const ANTHROPIC_VERSION = '2023-06-01';
const CLAUDE_API_TOOLS = [
  { name: 'read', description: 'Lê o conteúdo de um arquivo de texto dentro do diretório do projeto.', input_schema: { type: 'object', properties: { path: { type: 'string', description: 'caminho relativo ao diretório do projeto' } }, required: ['path'] } },
  { name: 'write', description: 'Escreve (cria ou sobrescreve) um arquivo de texto dentro do diretório do projeto. Cria diretórios intermediários se preciso.', input_schema: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ['path', 'content'] } },
  { name: 'bash', description: 'Roda um comando de shell dentro do diretório do projeto (ex.: os scripts Python de validação).', input_schema: { type: 'object', properties: { command: { type: 'string' } }, required: ['command'] } },
];

// bash sem allowlist de comando na v1 — mesmo nível de confiança que `codex exec --sandbox
// workspace-write` já tem (ver design doc, riscos). Guarda de path (nunca sair de `cwd`) é a única
// barreira aqui; allowlist de comando fica pra depois se algum dia isso rodar fora da máquina do Dante.
function runBash(command, cwd, timeoutMs) {
  return new Promise((settle) => {
    const child = spawn(command, [], { cwd, shell: true, timeout: timeoutMs });
    let out = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (out += d));
    child.on('close', (code) => settle(`[exit ${code}]\n${out}`.slice(0, 20000)));
    child.on('error', (e) => settle(`erro ao rodar comando: ${e}`));
  });
}

async function runClaudeApiTool(name, input, cwd, timeoutMs) {
  try {
    if (name === 'read') return await readFile(resolveInCwd(cwd, input.path), 'utf8');
    if (name === 'write') {
      const full = resolveInCwd(cwd, input.path);
      await mkdir(dirname(full), { recursive: true });
      await writeFile(full, String(input.content ?? ''));
      return 'ok';
    }
    if (name === 'bash') return await runBash(String(input.command || ''), cwd, timeoutMs);
    return `tool desconhecida: ${name}`;
  } catch (e) { return `erro: ${e.message}`; }
}

async function claudeApiTurn({ system, messages, model, apiKey }) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION },
    body: JSON.stringify({ model, max_tokens: 8192, system, messages, tools: CLAUDE_API_TOOLS }),
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) return { ok: false, err: body?.error?.message || `HTTP ${r.status}` };
  return { ok: true, body };
}

async function runClaudeApiAgentLoop(promptKey, { project, cwd, send = () => {}, apiKey, model = 'claude-sonnet-5', maxIterations = 30, timeoutMs = 20 * 60 * 1000 } = {}) {
  if (!apiKey) { send({ type: 'log', line: 'ANTHROPIC_API_KEY não configurada.' }); return { ok: false, usageIn: 0, usageOut: 0, model }; }
  const { system, user } = buildPrompt(promptKey, project);
  const messages = [{ role: 'user', content: user }];
  let usageIn = 0, usageOut = 0;
  for (let i = 0; i < maxIterations; i++) {
    const turn = await claudeApiTurn({ system, messages, model, apiKey });
    if (!turn.ok) { send({ type: 'log', line: 'erro API Anthropic: ' + turn.err }); return { ok: false, usageIn, usageOut, model }; }
    const { body } = turn;
    usageIn += body.usage?.input_tokens || 0;
    usageOut += body.usage?.output_tokens || 0;
    const content = body.content || [];
    for (const b of content) if (b.type === 'text' && b.text) send({ type: 'log', line: b.text });
    const toolUses = content.filter((b) => b.type === 'tool_use');
    messages.push({ role: 'assistant', content });
    if (body.stop_reason !== 'tool_use' || !toolUses.length) return { ok: true, usageIn, usageOut, model };
    const toolResults = [];
    for (const tu of toolUses) {
      try { send({ type: 'phase', name: tu.name }); } catch {}
      const output = await runClaudeApiTool(tu.name, tu.input || {}, cwd, timeoutMs);
      toolResults.push({ type: 'tool_result', tool_use_id: tu.id, content: String(output) });
    }
    messages.push({ role: 'user', content: toolResults });
  }
  send({ type: 'log', line: 'parou: limite de iterações do agente atingido' });
  return { ok: false, usageIn, usageOut, model };
}

// Wrapper com timeout total — não cancela fetch/bash em andamento no timeout (loop simples o
// suficiente pra v1; a chamada some do ponto de vista de quem chamou, mas não tem cross-request
// cancellation). Mesma limitação documentada no design doc pro motor codex-cli via kill() do processo.
export function runClaudeApiAgent(promptKey, opts = {}) {
  const timeoutMs = opts.timeoutMs || 20 * 60 * 1000;
  const model = opts.model || 'claude-sonnet-5';
  return new Promise((settle) => {
    let settled = false;
    const done = (r) => { if (settled) return; settled = true; settle(r); };
    const timer = setTimeout(() => done({ ok: false, usageIn: 0, usageOut: 0, model, timedOut: true }), timeoutMs);
    runClaudeApiAgentLoop(promptKey, opts)
      .then((r) => { clearTimeout(timer); done({ ...r, timedOut: false }); })
      .catch((e) => {
        clearTimeout(timer);
        try { (opts.send || (() => {}))({ type: 'log', line: 'erro inesperado: ' + e }); } catch {}
        done({ ok: false, usageIn: 0, usageOut: 0, model, timedOut: false });
      });
  });
}
