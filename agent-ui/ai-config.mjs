// Template — NÃO commitar chave aqui (histórico do git fica exposto pra sempre).
// A chave vem do ambiente. Precedência em codexKey(): env > .secrets/codex.key > este arquivo.
//   1. env:      CODEX_API_KEY=sk-...  (ou OPENAI_API_KEY)
//   2. local:    agent-ui/.secrets/codex.key  (gitignored)  ← distribuído 1x fora do repo
// Deixe vazio. Se preencher, a chave será versionada — não faça isso.
export const CODEX_API_KEY = '';
