import assert from 'node:assert/strict';
import test from 'node:test';

import { buildBuildPrompt, buildPlanPrompt, buildPrompt } from '../agent-at-prompts.mjs';

test('buildPlanPrompt referencia o projeto e o formato exato de estrutura-proposta.md', () => {
  const { system, user } = buildPlanPrompt('recertificacao');
  assert.match(user, /Projeto: recertificacao\./);
  assert.match(user, /aprovada: false/);
  assert.match(user, /NÃO escreva casos de teste/);
  assert.doesNotMatch(system, /\/analyze-test/);
  assert.match(system, /MCP playwright NÃO está disponível/);
});

test('buildBuildPrompt referencia a estrutura já aprovada e a validação obrigatória', () => {
  const { system, user } = buildBuildPrompt('recertificacao');
  assert.match(user, /aprovada: true/);
  assert.match(user, /md_canonical_parser\.py/);
  assert.match(user, /validate_md_canonical\.py/);
  assert.match(system, /generate-md-canonical\/SKILL\.md/);
});

test('buildPrompt despacha por promptKey (default = plan)', () => {
  assert.deepEqual(buildPrompt('plan', 'x'), buildPlanPrompt('x'));
  assert.deepEqual(buildPrompt('build', 'x'), buildBuildPrompt('x'));
  assert.deepEqual(buildPrompt('outro', 'x'), buildPlanPrompt('x'));
});
