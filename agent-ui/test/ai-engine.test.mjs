import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildCodexPrompt,
  engineConfigStatus,
  normalizeEngine,
  parseJsonResponse,
} from '../ai-engine.mjs';

test('normalizeEngine maps aliases to stable engine ids', () => {
  assert.equal(normalizeEngine('codex'), 'codex-cli');
  assert.equal(normalizeEngine('codex-cli'), 'codex-cli');
  assert.equal(normalizeEngine('api'), 'openai-api');
  assert.equal(normalizeEngine('openai'), 'openai-api');
  assert.equal(normalizeEngine(''), 'openai-api');
  assert.equal(normalizeEngine('surpresa'), 'openai-api');
});

test('buildCodexPrompt preserves role boundaries and requests JSON only when needed', () => {
  const prompt = buildCodexPrompt({
    system: 'Voce gera casos de teste.',
    user: 'Gere 2 casos.',
    json: true,
  });

  assert.match(prompt, /Instrucoes do sistema/);
  assert.match(prompt, /Voce gera casos de teste/);
  assert.match(prompt, /Pedido do usuario/);
  assert.match(prompt, /Gere 2 casos/);
  assert.match(prompt, /JSON valido/);
});

test('parseJsonResponse accepts plain and fenced JSON', () => {
  assert.deepEqual(parseJsonResponse('{"casos":[{"nome":"A"}]}'), { casos: [{ nome: 'A' }] });
  assert.deepEqual(parseJsonResponse('```json\n{"ok":true}\n```'), { ok: true });
});

test('engineConfigStatus requires a key only for the OpenAI API engine', () => {
  assert.deepEqual(engineConfigStatus({ engine: 'openai-api', key: 'sk-abc1234567890' }), {
    configured: true,
    needsKey: true,
    hint: '••••7890',
    len: 16,
    looksShort: true,
  });
  assert.deepEqual(engineConfigStatus({ engine: 'codex-cli', codexCliAvailable: true }), {
    configured: true,
    needsKey: false,
    hint: '',
    len: 0,
    looksShort: false,
  });
});
