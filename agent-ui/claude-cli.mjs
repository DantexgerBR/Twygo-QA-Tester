// claude-cli.mjs — helpers usados pelo fluxo de AT: aprovação da estrutura proposta e custo do ledger.
// O motor headless (antes runClaudeSkill/`claude -p`) foi substituído por agent-at-engine.mjs
// (codex-cli/claude-api) — ver docs/superpowers/specs/2026-07-28-codex-claude-api-at-agent-design.md.

// Marca a estrutura proposta como aprovada (frontmatter `aprovada: true`) — idempotente.
export function injectApproved(mdText) {
  if (/^aprovada:\s*true\s*$/m.test(mdText)) return mdText;
  if (/^aprovada:\s*false\s*$/m.test(mdText)) return mdText.replace(/^aprovada:\s*false\s*$/m, 'aprovada: true');
  if (/^---\s*$/m.test(mdText)) return mdText.replace(/^---\s*$/m, '---\naprovada: true');
  return `---\naprovada: true\n---\n\n${mdText}`;
}

// Custo de um evento do ledger: usa o usd real armazenado (Claude, via total_cost_usd) quando presente;
// senão estima por tokens × preço da tabela (fluxo antigo, OpenAI-compatível).
export function costOf(event, price) {
  if (typeof event.usd === 'number') return event.usd;
  return (event.in || 0) / 1e6 * price.in + (event.out || 0) / 1e6 * price.out;
}
