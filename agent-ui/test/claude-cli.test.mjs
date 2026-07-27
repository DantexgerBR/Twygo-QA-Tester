import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { costOf, injectApproved, parseStreamJsonLine, runClaudeSkill } from '../claude-cli.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) => path.join(here, 'fixtures', name);

test('parseStreamJsonLine reconhece tool_use como fase', () => {
  const line = '{"type":"assistant","message":{"model":"claude-sonnet-5","content":[{"type":"tool_use","id":"toolu_1","name":"Read","input":{"file_path":"x.md"}}]}}';
  assert.deepEqual(parseStreamJsonLine(line), { type: 'phase', name: 'Read', model: 'claude-sonnet-5' });
});

test('parseStreamJsonLine reconhece texto como log', () => {
  const line = '{"type":"assistant","message":{"model":"claude-sonnet-5","content":[{"type":"text","text":"=== Fase 2: Leitura de documentacao ==="}]}}';
  assert.deepEqual(parseStreamJsonLine(line), { type: 'log', line: '=== Fase 2: Leitura de documentacao ===', model: 'claude-sonnet-5' });
});

test('parseStreamJsonLine extrai custo e tokens do result final', () => {
  const line = '{"type":"result","is_error":false,"total_cost_usd":0.1579698,"usage":{"input_tokens":2,"output_tokens":4}}';
  assert.deepEqual(parseStreamJsonLine(line), { type: 'result', ok: true, costUsd: 0.1579698, usageIn: 2, usageOut: 4 });
});

test('parseStreamJsonLine marca result com erro', () => {
  const line = '{"type":"result","is_error":true,"total_cost_usd":0.01,"usage":{"input_tokens":1,"output_tokens":1}}';
  assert.deepEqual(parseStreamJsonLine(line), { type: 'result', ok: false, costUsd: 0.01, usageIn: 1, usageOut: 1 });
});

test('parseStreamJsonLine ignora ruido (hooks, rate limit, JSON invalido)', () => {
  assert.equal(parseStreamJsonLine('{"type":"system","subtype":"hook_started"}'), null);
  assert.equal(parseStreamJsonLine('{"type":"rate_limit_event","rate_limit_info":{}}'), null);
  assert.equal(parseStreamJsonLine('nao e json'), null);
  assert.equal(parseStreamJsonLine(''), null);
});

test('injectApproved troca aprovada: false por true', () => {
  const md = '---\naprovada: false\nproject: x\n---\n\n# Proposta\n';
  assert.match(injectApproved(md), /^aprovada: true$/m);
});

test('injectApproved e idempotente quando ja aprovada', () => {
  const md = '---\naprovada: true\nproject: x\n---\n\n# Proposta\n';
  assert.equal(injectApproved(md), md);
});

test('injectApproved insere o campo quando o frontmatter nao tem aprovada', () => {
  const md = '---\nproject: x\n---\n\n# Proposta\n';
  const out = injectApproved(md);
  assert.match(out, /^aprovada: true$/m);
  assert.match(out, /project: x/);
});

test('runClaudeSkill resolve ok:true com custo/tokens e repassa fases/logs via send()', async () => {
  const events = [];
  const result = await runClaudeSkill('prompt qualquer', {
    cwd: here,
    send: (ev) => events.push(ev),
    bin: process.execPath,
    args: [fixture('claude-cli-stub-ok.mjs')],
    timeoutMs: 5000,
  });
  assert.deepEqual(result, { ok: true, costUsd: 0.05, usageIn: 10, usageOut: 20, model: 'claude-sonnet-5' });
  assert.deepEqual(events, [
    { type: 'phase', name: 'Read' },
    { type: 'log', line: 'ola mundo' },
  ]);
});

test('runClaudeSkill marca ok:false quando o processo sai com code != 0 mesmo com result is_error:false', async () => {
  const result = await runClaudeSkill('prompt qualquer', {
    cwd: here,
    send: () => {},
    bin: process.execPath,
    args: [fixture('claude-cli-stub-badexit.mjs')],
    timeoutMs: 5000,
  });
  assert.equal(result.ok, false);
});

test('runClaudeSkill resolve rapido e marca timedOut quando o processo nunca termina', async () => {
  const start = Date.now();
  const result = await runClaudeSkill('prompt qualquer', {
    cwd: here,
    send: () => {},
    bin: process.execPath,
    args: [fixture('claude-cli-stub-hang.mjs')],
    timeoutMs: 300,
  });
  const elapsed = Date.now() - start;
  assert.equal(result.ok, false);
  assert.equal(result.timedOut, true);
  assert.ok(elapsed < 2000, `esperava resolver perto do timeoutMs, levou ${elapsed}ms`);
});

test('runClaudeSkill nao quebra quando send() lanca excecao', async () => {
  const result = await runClaudeSkill('prompt qualquer', {
    cwd: here,
    send: () => { throw new Error('boom'); },
    bin: process.execPath,
    args: [fixture('claude-cli-stub-ok.mjs')],
    timeoutMs: 5000,
  });
  assert.equal(result.ok, true);
});

test('costOf usa o usd armazenado quando presente, senao estima por tabela de preco', () => {
  assert.equal(costOf({ usd: 0.42, in: 100, out: 100 }, { in: 1, out: 1 }), 0.42);
  assert.equal(costOf({ in: 1000000, out: 0 }, { in: 2, out: 0 }), 2);
});
