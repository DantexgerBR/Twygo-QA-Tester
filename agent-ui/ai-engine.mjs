import { spawn } from 'node:child_process';

export const AI_ENGINES = {
  OPENAI_API: 'openai-api',
  CODEX_CLI: 'codex-cli',
};

export function normalizeEngine(value) {
  const v = String(value || '').trim().toLowerCase();
  if (['codex', 'codex-cli', 'cli'].includes(v)) return AI_ENGINES.CODEX_CLI;
  if (['api', 'openai', 'openai-api'].includes(v)) return AI_ENGINES.OPENAI_API;
  return AI_ENGINES.OPENAI_API;
}

export function engineLabel(engine) {
  return normalizeEngine(engine) === AI_ENGINES.CODEX_CLI ? 'Codex CLI' : 'OpenAI API';
}

export function buildCodexPrompt({ system, user, json = false }) {
  return [
    'Voce esta atuando como motor de geracao de IA para a interface Twygo QA.',
    'Responda somente com o artefato final pedido. Nao altere arquivos no repositorio.',
    json ? 'A resposta final deve ser JSON valido, sem markdown, sem comentarios e sem texto fora do JSON.' : '',
    '',
    '## Instrucoes do sistema',
    String(system || '').trim(),
    '',
    '## Pedido do usuario',
    String(user || '').trim(),
  ].filter((part) => part !== '').join('\n');
}

export function stripMarkdownFence(text) {
  return String(text || '').trim().replace(/^```[a-z0-9_-]*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
}

export function parseJsonResponse(text) {
  return JSON.parse(stripMarkdownFence(text));
}

export function engineConfigStatus({ engine, key = '', codexCliAvailable = false }) {
  const normalized = normalizeEngine(engine);
  if (normalized === AI_ENGINES.CODEX_CLI) {
    return { configured: !!codexCliAvailable, needsKey: false, hint: '', len: 0, looksShort: false };
  }
  const k = String(key || '');
  const looksShort = !!k && (k.startsWith('sk-proj-') ? k.length < 140 : k.length < 40);
  return { configured: !!k, needsKey: true, hint: k ? '••••' + k.slice(-4) : '', len: k.length, looksShort };
}

export function codexExecArgs({ model = '' } = {}) {
  const args = ['exec', '--ephemeral', '--sandbox', 'read-only'];
  if (model) args.push('-m', model);
  args.push('-');
  return args;
}

export function codexComplete({ system, user, json = false }, {
  cwd,
  env = process.env,
  model = '',
  codexBin = process.env.CODEX_CLI_BIN || 'codex',
  timeoutMs = 180000,
} = {}) {
  const prompt = buildCodexPrompt({ system, user, json });
  return new Promise((resolve) => {
    const child = spawn(codexBin, codexExecArgs({ model }), { cwd, env, shell: false });
    let stdout = '', stderr = '', settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };
    const timer = setTimeout(() => {
      try { child.kill('SIGTERM'); } catch {}
      finish({ ok: false, status: 0, model, err: 'timeout ao executar Codex CLI' });
    }, timeoutMs);
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('close', (code) => {
      if (code === 0) return finish({ ok: true, model, content: stdout.trim(), usageIn: 0, usageOut: 0, engine: AI_ENGINES.CODEX_CLI });
      finish({ ok: false, status: code || 0, model, err: stderr.trim() || stdout.trim() });
    });
    child.on('error', (e) => finish({ ok: false, status: 0, model, err: String(e) }));
    child.stdin.end(prompt);
  });
}

export function commandAvailable(command, { env = process.env } = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, ['--version'], { env, shell: false });
    child.on('close', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });
}
