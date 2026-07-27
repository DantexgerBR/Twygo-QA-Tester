import assert from 'node:assert/strict';
import test from 'node:test';

import { injectApproved, parseStreamJsonLine } from '../claude-cli.mjs';

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
