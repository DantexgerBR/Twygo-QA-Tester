import assert from 'node:assert/strict';
import test from 'node:test';

import { costOf, injectApproved } from '../claude-cli.mjs';

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

test('costOf usa o usd armazenado quando presente, senao estima por tabela de preco', () => {
  assert.equal(costOf({ usd: 0.42, in: 100, out: 100 }, { in: 1, out: 1 }), 0.42);
  assert.equal(costOf({ in: 1000000, out: 0 }, { in: 2, out: 0 }), 2);
});

test('costOf respeita usd: 0 (run gratis) em vez de cair pro fallback de tabela de preco', () => {
  assert.equal(costOf({ usd: 0, in: 1000000, out: 1000000 }, { in: 2, out: 2 }), 0);
});
