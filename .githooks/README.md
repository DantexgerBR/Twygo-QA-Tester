# Git hooks do monorepo

Hooks versionados (compartilhados via git). **Ativar uma vez por clone:**

```bash
git config core.hooksPath .githooks
```

## `pre-commit`
Antes de cada commit, roda o gate de qualidade só nos agentes com arquivos staged:

- **agent-playwright** (arquivos `.ts/.cjs/.mjs`): `npm run typecheck` + `eslint .`
- **agentes Python** (`.py`): `ruff check` (se o `ruff` estiver instalado)

Se algo reprovar, o commit é bloqueado. Para pular pontualmente (use com parcimônia):

```bash
git commit --no-verify
```

> O mesmo gate roda no CI (`.github/workflows/ci.yml`) — o hook é a barreira
> local que pega o erro antes do push.
