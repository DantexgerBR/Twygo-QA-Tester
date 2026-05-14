---
name: pull-antes-de-commit-push
description: Antes de cada `git commit` ou `git push` numa branch com upstream tracking, rodar `git fetch` + análise de impacto + decisão de integração ANTES de mexer no histórico local. Evita acumular commits behind silenciosamente e detecta sobreposição com working tree/commits ahead. Skill enforça protocolo de sync e fornece checklist de impactos (arquivos sensíveis, sobreposição direta, classes de risco). Use sempre que o usuário pedir "commitar", "fazer push", "atualizar branch", "sincronizar", ou quando você estiver pra emitir `git commit`/`git push` por iniciativa.
version: 1.0.0
---

# pull-antes-de-commit-push

## Por que existe

Branches de projeto Twygo (`project/<slug>`) são compartilhadas entre
múltiplas sessões Claude + QAs humanos. Trabalho convergente em paralelo
é a norma, não exceção.

**Caso real (sessão 2026-05-14)** que motivou esta skill: durante uma
sessão longa fazendo commits em `project/paineis-dos-usuarios-widgets-joao`,
outra QA (Karla Daiany) pushou 12 commits enquanto eu trabalhava. Eu não
fiz fetch entre os meus 6 commits — só descobri o desalinhamento quando
o usuário pediu "atualizar branch". Resultado:

- 12 commits behind acumulados silenciosamente
- 3 conflitos de merge (modify/delete em arquivos que viraram gitignore,
  add/add em bug-reports.json)
- 1016 arquivos no diff incoming pra avaliar
- ~15min pra resolver conflitos + auditar impactos

Se eu tivesse rodado `git fetch` antes de cada commit, teria visto a
divergência cedo, evitado conflitos cumulativos, e o usuário teria tido
visibilidade do que o time fazia em paralelo.

**Lição**: fetch é barato (200ms, sem mutação). Merge surpresa caro
(15-30min). Sempre fetch antes de mexer no histórico local.

## Quando invocar

- Usuário pediu **"commitar"** / **"fazer commit"** / **"criar commit"**
- Usuário pediu **"fazer push"** / **"push"**
- Usuário pediu **"atualizar branch"** / **"sincronizar"** / **"pull"**
- **Você** está por emitir `git commit` ou `git push` por iniciativa
  (ex.: ao concluir um trabalho)
- Início de uma nova fase de trabalho numa branch já com commits locais

## Protocolo

### Pre-flight (sempre — antes de commit OU push)

```bash
git fetch origin                              # 1
git status --short                            # 2
git rev-list --left-right --count HEAD...@{u} # 3 → "ahead	behind"
```

Decidir baseado no `behind`:

| `behind` | Ação |
|---|---|
| `0` | Pode prosseguir com commit/push. Skill termina aqui. |
| `> 0` | **PARAR**. Rodar análise de impacto abaixo antes de mexer. |

### Análise de impacto (quando `behind > 0`)

```bash
# 1. Listar commits incoming
git log --oneline HEAD..@{u}

# 2. Listar arquivos tocados pelos commits incoming
git diff HEAD..@{u} --name-only | head -50
git diff HEAD..@{u} --name-only | wc -l    # total

# 3. Detectar arquivos sensíveis (ver tabela abaixo)
git diff HEAD..@{u} --name-only | grep -E '\.gitignore|CLAUDE\.md|\.claude/skills/|package\.json|tsconfig\.json|playwright\.config\.ts|globalSetup\.ts|environment\.json'

# 4. Detectar sobreposição com working tree (arquivos que eu também mexi)
comm -12 \
  <(git status --short | awk '{print $2}' | sort) \
  <(git diff HEAD..@{u} --name-only | sed 's|^[^/]*/||' | sort)

# 5. Detectar sobreposição com meus commits ahead
git log --oneline @{u}..HEAD                                # meus commits
git diff @{u} HEAD --name-only | sort > /tmp/mine.txt       # arquivos meus
git diff HEAD..@{u} --name-only | sort > /tmp/theirs.txt
comm -12 /tmp/mine.txt /tmp/theirs.txt                      # interseção
```

### Categorias de risco (heurística)

| Categoria | Padrão de arquivo | Impacto típico |
|---|---|---|
| **🔴 Crítica** | `.gitignore`, `CLAUDE.md`, `package.json`, `tsconfig.json`, `playwright.config.ts`, `globalSetup.ts`, `config/environment.json` | Pode mudar como tudo funciona. Ler diff antes de aceitar |
| **🟠 Alta** | `.claude/skills/**`, `src/utils/**`, `src/pages/**`, `src/fixtures/**` | Pode mudar como specs/POMs funcionam. Compatível com meu trabalho? |
| **🟡 Média** | `projects/<slug>/pages/**`, `projects/<slug>/utils/**` | Pode quebrar specs que eu modifiquei. Conferir sobreposição |
| **🟢 Baixa** | `outputs/**`, `projects/<slug>/tests/features/<outra-suite>/**` | Snapshots / specs de suites que eu não toquei. Pode aceitar sem ler diff |

### Apresentação ao usuário

**Antes de aplicar pull/merge**, apresentar resumo estruturado:

```
⚠️ N commits novos no remoto (ahead M, behind N)

Commits incoming:
- <hash> <subject curta>
- ...

Arquivos tocados: X total
- 🔴 Crítica: a, b
- 🟠 Alta: c, d
- 🟡 Média: e
- 🟢 Baixa: f (oculto, +Y arquivos)

Sobreposição direta:
- working tree: arquivo X (eu modifiquei sem commitar)
- meus commits ahead: arquivo Y (commit Z tocou também)

Recomendação: <merge | rebase | stash+merge+pop | abortar>
```

Esperar decisão do usuário antes de prosseguir.

### Estratégia de integração

Sugerir baseado na análise:

| Cenário | Estratégia recomendada |
|---|---|
| 0 sobreposição direta · working tree limpo | `git pull` (merge auto) |
| 0 sobreposição · working tree sujo com mudanças importantes | `git stash` → `git pull` → `git stash pop` |
| 0 sobreposição · working tree sujo só com lixo (D's não-úteis) | `git restore .` → `git pull` |
| Sobreposição direta · poucos arquivos | `git pull` → resolver conflitos |
| Sobreposição direta · muitos arquivos | Apresentar 3 opções (merge/rebase/abortar) ao usuário |
| Arquivos críticos (CLAUDE.md, .gitignore, etc) mudaram | **Sempre apresentar diff ao usuário antes de aceitar** |

### Pós-integração

Depois do pull/merge bem-sucedido:

1. `git rev-list --left-right --count HEAD...@{u}` → confirmar `behind=0`
2. `npm run typecheck` (se mudanças tocaram TS) — pra detectar regressão de imports/types
3. Reportar ao usuário: "Sincronizado. Pode commitar."
4. **Só agora** prosseguir com o `git commit` ou `git push` originalmente solicitado

## Aborto / casos especiais

| Situação | Comportamento |
|---|---|
| `git fetch` falhou (rede, DNS) | Avisar usuário, perguntar se prossegue offline. Não bloquear o workflow inteiro |
| Detached HEAD | Skill não se aplica. Avisar e parar |
| Branch sem upstream tracking (`@{u}` resolve nothing) | Skill não se aplica (não há "remoto" pra puxar). Avisar e prosseguir |
| Conflito durante pull/merge | Apresentar lista de conflitos ao usuário. NÃO resolver automaticamente sem aprovação |
| Usuário disse explicitamente `--no-pull` ou "pula isso" | Skill respeita. Loga decisão e prossegue |

## Anti-patterns

- ❌ **Fazer `git commit` direto sem fetch** — pode acumular commits behind silenciosamente. Foi o erro da sessão 2026-05-14.
- ❌ **Fazer `git push` sem fetch primeiro** — push pode falhar com `non-fast-forward`, forçando você a entender o estado em pânico.
- ❌ **Aplicar `--theirs`/`--ours` cegamente sem inspecionar diff** — pode descartar trabalho real.
- ❌ **Fazer `git pull --rebase` sem confirmar** — reescreve hashes dos meus commits ahead, perde rastreabilidade se algo der errado.
- ❌ **Resolver conflitos sem apresentar pro usuário** — usuário precisa ver o estado pra decidir; resolução automática vira surpresa.
- ❌ **Pular a análise quando `behind` é "só 1-2 commits"** — número não importa, pode ser commit no `.gitignore` que muda o jogo. Sempre rodar análise.

## Quando NÃO usar

- Repos recém-clonados sem commits locais (`@{u}` é mesma SHA que HEAD)
- Operações destrutivas explicitamente autorizadas (`git reset --hard`, `git push --force`) — aí Git Safety Protocol do CLAUDE.md raiz toma precedência
- Hotfix urgente onde o usuário disse "push imediato sem nada" — respeitar a ordem direta
- Branches privadas locais (sem `origin` configurado pra elas)

## Integração com Git Safety Protocol do CLAUDE.md

Esta skill **complementa**, não substitui, o Git Safety Protocol do
[CLAUDE.md raiz](../../../../CLAUDE.md):

- **GSP**: nunca update git config, nunca force push sem autorização,
  evitar destrutivo
- **Esta skill**: antes de qualquer commit/push, sempre fetch + análise

Conflito potencial: `git pull --rebase` reescreve hashes — toca regra
GSP "evitar destrutivo". Resolução: skill sugere `merge` como default;
rebase só se usuário pediu explícito.

## Referência

- Commit `83f75fc` (merge da sessão 2026-05-14) — caso real onde a falta
  deste protocolo gerou 12 commits behind + 3 conflitos de merge
- CLAUDE.md raiz §"Git Safety Protocol"
- Skill `debugar-filename-too-long-windows` — diagnóstico de erros git
  no Windows (complementar)

## Escopo: agent-playwright ou monorepo?

Esta skill é **operacional (git)**, não específica de Playwright. Pode
ser promovida pra nível monorepo (`twygo-agents-qa/.claude/skills/`) se
agent-at e agent-db quiserem o mesmo protocolo. Hoje vive em
`agent-playwright/.claude/skills/` porque é onde nasceu — mover não
custa, mas requer decisão de QA Lead.
