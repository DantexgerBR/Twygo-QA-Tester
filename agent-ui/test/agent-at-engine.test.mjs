import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';

import {
  AT_ENGINES,
  atEngineConfigStatus,
  atEngineLabel,
  normalizeAtEngine,
  parseCodexJsonLine,
  resolveInCwd,
  runAtAgent,
  runClaudeApiAgent,
  runCodexAgent,
} from '../agent-at-engine.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) => path.join(here, 'fixtures', name);

test('normalizeAtEngine so aceita claude-api explicito, resto cai pra codex-cli', () => {
  assert.equal(normalizeAtEngine('claude-api'), AT_ENGINES.CLAUDE_API);
  assert.equal(normalizeAtEngine('codex-cli'), AT_ENGINES.CODEX_CLI);
  assert.equal(normalizeAtEngine(''), AT_ENGINES.CODEX_CLI);
  assert.equal(normalizeAtEngine('surpresa'), AT_ENGINES.CODEX_CLI);
});

test('atEngineLabel', () => {
  assert.equal(atEngineLabel('codex-cli'), 'Codex CLI');
  assert.equal(atEngineLabel('claude-api'), 'API do Claude');
});

test('atEngineConfigStatus: codex-cli depende do binario, claude-api depende da chave', () => {
  assert.deepEqual(atEngineConfigStatus({ engine: 'codex-cli', codexCliAvailable: true }), { configured: true, needsKey: false });
  assert.deepEqual(atEngineConfigStatus({ engine: 'codex-cli', codexCliAvailable: false }), { configured: false, needsKey: false });
  assert.deepEqual(atEngineConfigStatus({ engine: 'claude-api', hasKey: true }), { configured: true, needsKey: true });
  assert.deepEqual(atEngineConfigStatus({ engine: 'claude-api', hasKey: false }), { configured: false, needsKey: true });
});

test('parseCodexJsonLine reconhece agent_message como log', () => {
  assert.deepEqual(parseCodexJsonLine(JSON.stringify({ msg: { type: 'agent_message', message: 'oi' } })), { type: 'log', line: 'oi' });
});

test('parseCodexJsonLine reconhece exec_command_begin como fase', () => {
  assert.deepEqual(parseCodexJsonLine(JSON.stringify({ msg: { type: 'exec_command_begin', command: ['ls', '-la'] } })), { type: 'phase', name: 'ls -la' });
});

test('parseCodexJsonLine reconhece task_complete como resultado ok', () => {
  assert.deepEqual(parseCodexJsonLine(JSON.stringify({ msg: { type: 'task_complete', usage: { input_tokens: 5, output_tokens: 7 } } })), { type: 'result', ok: true, usageIn: 5, usageOut: 7 });
});

test('parseCodexJsonLine reconhece error como resultado falho', () => {
  assert.deepEqual(parseCodexJsonLine(JSON.stringify({ msg: { type: 'error', message: 'falha' } })), { type: 'result', ok: false, usageIn: 0, usageOut: 0 });
});

test('parseCodexJsonLine ignora ruido/JSON invalido', () => {
  assert.equal(parseCodexJsonLine('nao e json'), null);
  assert.equal(parseCodexJsonLine(JSON.stringify({ msg: { type: 'reasoning' } })), null);
});

test('runCodexAgent resolve ok:true e repassa fases/logs via send()', async () => {
  const events = [];
  const result = await runCodexAgent('plan', {
    project: 'x', cwd: here, send: (ev) => events.push(ev),
    codexBin: process.execPath, args: [fixture('codex-cli-stub-ok.mjs')], timeoutMs: 5000,
  });
  assert.equal(result.ok, true);
  assert.equal(result.usageIn, 0);
  assert.deepEqual(events, [
    { type: 'log', line: 'ola mundo' },
    { type: 'phase', name: 'ls projects' },
  ]);
});

test('runCodexAgent marca ok:false quando o processo sai com code != 0 mesmo com task_complete', async () => {
  const result = await runCodexAgent('plan', {
    project: 'x', cwd: here, send: () => {},
    codexBin: process.execPath, args: [fixture('codex-cli-stub-badexit.mjs')], timeoutMs: 5000,
  });
  assert.equal(result.ok, false);
});

test('runCodexAgent marca ok:false quando um evento de erro explicito aparece mesmo com exit code 0', async () => {
  const result = await runCodexAgent('plan', {
    project: 'x', cwd: here, send: () => {},
    codexBin: process.execPath, args: [fixture('codex-cli-stub-error.mjs')], timeoutMs: 5000,
  });
  assert.equal(result.ok, false);
});

test('runCodexAgent resolve rapido e marca timedOut quando o processo nunca termina', async () => {
  const start = Date.now();
  const result = await runCodexAgent('plan', {
    project: 'x', cwd: here, send: () => {},
    codexBin: process.execPath, args: [fixture('codex-cli-stub-hang.mjs')], timeoutMs: 300,
  });
  const elapsed = Date.now() - start;
  assert.equal(result.ok, false);
  assert.equal(result.timedOut, true);
  assert.ok(elapsed < 2000, `esperava resolver perto do timeoutMs, levou ${elapsed}ms`);
});

test('resolveInCwd bloqueia caminho fora do diretorio do projeto', () => {
  assert.throws(() => resolveInCwd('/tmp/projeto', '../../etc/passwd'));
  assert.throws(() => resolveInCwd('/tmp/projeto', '/etc/passwd'));
  assert.doesNotThrow(() => resolveInCwd('/tmp/projeto', 'output/test-analysis.md'));
});

test('runClaudeApiAgent sem apiKey resolve ok:false sem chamar fetch', async () => {
  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => { called = true; throw new Error('nao deveria chamar'); };
  try {
    const result = await runClaudeApiAgent('plan', { project: 'x', cwd: here, send: () => {} });
    assert.equal(result.ok, false);
    assert.equal(called, false);
  } finally { globalThis.fetch = originalFetch; }
});

test('runClaudeApiAgent roda um tool_use de write e depois termina em end_turn', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'at-claude-api-'));
  const originalFetch = globalThis.fetch;
  let call = 0;
  globalThis.fetch = async () => {
    call++;
    if (call === 1) {
      return { ok: true, json: async () => ({
        stop_reason: 'tool_use',
        usage: { input_tokens: 10, output_tokens: 5 },
        content: [{ type: 'tool_use', id: 't1', name: 'write', input: { path: 'output/nota.md', content: 'ok' } }],
      }) };
    }
    return { ok: true, json: async () => ({ stop_reason: 'end_turn', usage: { input_tokens: 3, output_tokens: 2 }, content: [{ type: 'text', text: 'pronto' }] }) };
  };
  try {
    const events = [];
    const result = await runClaudeApiAgent('plan', { project: 'x', cwd: dir, apiKey: 'sk-ant-teste', send: (ev) => events.push(ev) });
    assert.equal(result.ok, true);
    assert.equal(result.usageIn, 13);
    assert.equal(result.usageOut, 7);
    assert.equal(await readFile(path.join(dir, 'output', 'nota.md'), 'utf8'), 'ok');
    assert.ok(events.some((e) => e.type === 'phase' && e.name === 'write'));
  } finally { globalThis.fetch = originalFetch; await rm(dir, { recursive: true, force: true }); }
});

test('runClaudeApiAgent devolve ok:false quando a API responde erro HTTP', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 401, json: async () => ({ error: { message: 'chave invalida' } }) });
  try {
    const events = [];
    const result = await runClaudeApiAgent('plan', { project: 'x', cwd: here, apiKey: 'sk-ant-teste', send: (ev) => events.push(ev) });
    assert.equal(result.ok, false);
    assert.ok(events.some((e) => e.line && e.line.includes('chave invalida')));
  } finally { globalThis.fetch = originalFetch; }
});

test('runAtAgent despacha pro motor certo por opts.engine', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ stop_reason: 'end_turn', usage: { input_tokens: 1, output_tokens: 1 }, content: [] }) });
  try {
    const viaApi = await runAtAgent('plan', { engine: 'claude-api', project: 'x', cwd: here, apiKey: 'sk-ant-teste' });
    assert.equal(viaApi.ok, true);
  } finally { globalThis.fetch = originalFetch; }
  const viaCodex = await runAtAgent('plan', {
    engine: 'codex-cli', project: 'x', cwd: here, codexBin: process.execPath, args: [fixture('codex-cli-stub-ok.mjs')], timeoutMs: 5000,
  });
  assert.equal(viaCodex.ok, true);
});
