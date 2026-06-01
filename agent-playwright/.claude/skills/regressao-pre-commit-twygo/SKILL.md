---
name: regressao-pre-commit-twygo
description: Política de regressão obrigatória antes de commit que toque infra compartilhada (src/, pages/ shared, fixtures, modals, utils). Documenta o ritual de rodar todas as suítes do projeto e comparar com baseline ANTES de fechar PR — descoberta após sessão Recertificação 2026-06-01 onde 6 suítes verdes regrediram silenciosamente.
when_to_use: Antes de commitar qualquer change em arquivo de infra compartilhada que afete múltiplas suítes. Aplica em mudanças de POMs base (LearningStudentsPage, SuperAdminPage, BasePage), helpers em src/utils/*, src/fixtures/*, dismissCommonModals, safeGoto, getOpenChakraMenu, e em fixtures de seed (cursoSeed, alunoMatriculadoSeed etc).
---

# Política de Regressão Pré-Commit — Twygo

## Por que esta skill existe

Sessão Recertificação **2026-06-01**: durante refator de
`getOpenChakraMenu()` em `LearningStudentsPage.ts` + adição de fallback
modal beta-end-modal em `src/utils/modals.ts`, descobrimos que **6
suítes que estavam verdes regrediram silenciosamente**. Diagnóstico só
veio quando o usuário pediu análise abrangente após retornar de
ausência de 7h:

- `getOpenChakraMenu().filter({ visible: true }).first()` ficou estrito
  demais em telas com 1 menu já aberto (race com animação Chakra).
- `dismissCommonModals` ganhou fallback `getByRole('dialog').filter({
  hasText: /BETA teste/i })` que capturava drawers de Filtro Avançado e
  Inscrição em Massa — derrubando TC4 do Filtro e Suítes 5/6/7.

O problema raiz **não foi código ruim** — foi **commit sem regressão**.
Cada change passou seus testes diretos (TC focal verde), mas
ninguém rodou as outras 14 suítes que consomem o mesmo POM/util. Cada
heal cosmético deixou pegada que cumulou em retrocesso.

## Quando esta skill DISPARA (obrigatório)

Sempre que o diff contém mudança em pelo menos UM destes paths:

| Path | Razão |
|---|---|
| `src/pages/**` | Page Objects base (BasePage, LoginPage, DashboardPage, SuperAdminPage) consumidos por TODAS as suítes |
| `src/utils/modals.ts` | `safeGoto` + `dismissCommonModals` chamados em TODA navegação |
| `src/utils/environment.ts` | Resolução de baseURL/orgId — afeta todo spec |
| `src/fixtures/*` | Auto-fixtures aplicados a todo test() do projeto |
| `projects/<slug>/pages/**` (POMs shared do projeto) | Ex: `LearningStudentsPage` consumida por 8+ specs |
| `projects/<slug>/data/fixed-seed.data.ts` (ou similar shared seed) | IDs reusados entre TCs |
| `playwright.config.ts` | Timeouts, projects, reporters, workers |
| `tests/setup/global-setup.ts` | Login compartilhado entre TODOS os testes |
| `package.json` (deps Playwright) | Versão de browser/runner mudou |

**Mudanças em apenas 1 spec específico (`tc<N>-...spec.ts`) ou `*.data.ts`
de 1 caso isolado NÃO disparam esta skill** — basta o spec próprio
verde + audit MCP do TC.

## Quando esta skill NÃO se aplica (escapes legítimos)

- **Mudança em comentário/docstring/markdown** — zero impacto runtime.
- **Mudança em test específico (`tc4-*.spec.ts`)** — risk envelope =
  esse TC. Audit MCP do TC + run isolado bastam.
- **Mudança em seed de TC único (`tc4-*.data.ts`)** — mesmo escopo.
- **Commit emergencial com hotfix de produto** explicitamente autorizado
  pelo usuário — registrar no commit message `[skip-regression: <razão
  do usuário>]` e abrir issue para fechar o gap depois.

## Ritual obrigatório

Em ordem, ANTES de `git commit` (ou ANTES de propor commit se você é o
agente):

### 1. Inventário do blast radius

Liste qual infra mudou e quais suítes consomem ela:

```bash
git diff --name-only HEAD | grep -E '(src/|pages/|fixtures/|playwright.config|global-setup)'
```

Pra cada path mudado, descubra consumidores:

```bash
# Ex: LearningStudentsPage mudou — quem usa?
grep -lr "LearningStudentsPage" projects/<slug>/tests/
```

Anote no commit message ou no PR: "Blast radius: N suítes consomem
`<path>` — regressão rodada cobre Y%."

### 2. Comparar com baseline (worktree)

NUNCA rodar regressão só no HEAD e olhar o número absoluto de verdes.
Comparação relativa é o que vale:

```bash
# 1. Identifica commit baseline (último HEAD conhecido como "verde" naquelas suítes)
BASELINE=$(git log --oneline --grep="suite.*passing\|verde\|green" | head -1 | awk '{print $1}')
# Se não tiver pista, usa commit pré-mudança: git log --oneline -- src/utils/modals.ts | sed -n '2p'

# 2. Cria worktree isolado no baseline (preserva working tree atual)
git worktree add ../baseline-$BASELINE $BASELINE

# 3. Roda regressão LÁ
cd ../baseline-$BASELINE/agent-playwright
PROJECT=<slug> npm install --silent
PROJECT=<slug> npm run agent:parse
PROJECT=<slug> npm run agent:regression  # ou agent:run --all

# 4. Captura resultado: outputs/<slug>/reports/<runId>/index.md
# Anota counts: passed/failed/fixme/skipped por suíte
```

### 3. Rodar regressão no HEAD

```bash
cd <repo-original>/agent-playwright
PROJECT=<slug> npm run agent:regression
```

### 4. Comparar matrizes baseline vs HEAD

Pra cada suíte, registrar diff:

| Suíte | Baseline | HEAD | Δ |
|---|---|---|---|
| Suite 1 | 3p/1f | 3p/1f | 0 |
| Suite Filtro Avançado | 4p/0f | 3p/1f | **-1** ⚠️ |
| ... |

**Qualquer Δ negativo bloqueia o commit.** Investigar antes de prosseguir.

### 5. Investigação de regressão

Pra cada suíte com Δ negativo:

1. Compara screenshot da run baseline vs HEAD do mesmo TC.
2. Roda só o TC quebrado em `--debug` no HEAD.
3. Bisecta as mudanças do diff. Reverte 1 por vez no working tree até
   identificar qual change causou a regressão.
4. Refaz a change mantendo intent original mas sem regredir — geralmente
   significa restringir o escopo (ex: fallback de modal precisa exigir
   marker específico do modal, não match genérico em `dialog`).
5. Re-roda regressão completa.

### 6. Cleanup pós-validação

```bash
# Após regressão verde + commit feito:
git worktree remove ../baseline-$BASELINE
```

## Anti-patterns

### A. "Rodei só a suite que mexi e está verde"

❌ Mexer em `dismissCommonModals` e rodar só Suite 1 → commitar.
✅ Inventariar consumidores (`grep -lr "safeGoto" projects/`) → rodar
   amostra de cada categoria de consumidor (1 spec login, 1 com drawer,
   1 com modal de confirmação).

### B. "Heal subagent disse que está bom"

❌ Healer rodou o TC alvo, ficou verde, commitou.
✅ Healer cobre seletor/timing/asserção do TC focal. NÃO cobre
   regressão lateral. Sempre rode regressão após heal envolver
   src/ ou pages/ shared.

### C. "Vou cobrir no próximo commit"

❌ "Commitei agora porque preciso fechar entrega; rodo regressão
   amanhã."
✅ Regressão é gate de COMMIT, não de release. Adia o commit, não a
   regressão. Senão acumula débito invisível que o próximo QA descobre
   em sessão de pânico.

### D. "Não tenho baseline confiável"

❌ "Não sei qual commit estava verde mesmo, vou só rodar HEAD."
✅ Use `git log --oneline -- <path-mudado>` pra achar pré-mudança. Se
   nem isso é confiável, é sinal que a branch precisa de uma run inicial
   de baseline COMMITADA. Faça essa run primeiro (commit "chore:
   baseline regression snapshot") — depois suas mudanças seguintes têm
   referência clara.

### E. "Mudei só 1 linha"

❌ "É 1 caractere, não vai regredir nada."
✅ Mudanças triviais não existem em código de infra compartilhada.
   Trocar `.first()` por `.last()` em 1 método de POM derrubou 4
   suítes em 2026-06-01. Tamanho do diff não correlaciona com tamanho
   do impacto.

## Como propor esta regra ao usuário antes de commitar

Quando você (agente) está prestes a commitar e identifica que o diff
toca infra compartilhada, NÃO commite silenciosamente. Pause e
proponha:

> Diff toca `<src/utils/modals.ts | LearningStudentsPage.ts | etc>`.
> Consumido por `<N>` suítes. Antes de commitar, sugiro rodar
> regressão completa comparada com baseline `<commit-id>` (worktree).
> Tempo estimado: `<X>` min. Posso disparar agora?

Espere confirmação. Esse handshake garante que o custo da regressão
está sendo gasto com intenção, não por hábito cego.

## Integração com outras skills

- **`validar-heal-diff`** já cobre gate estático do diff do healer.
  Esta skill é o gate **dinâmico** complementar — heal-diff bloqueia
  drift de intent; regressão pre-commit bloqueia drift de comportamento.
- **`gerar-bug-report-de-tc-red`** consome a regressão. Se você rodou
  regressão e ficou red, gerar bug report antes de commit virar.
- **`comparar-chrome-mcp-vs-playwright`** ainda é necessária pra TCs
  novos / suspeitas de AT vs produto. Esta skill é a rede de regressão
  pra TCs já existentes.

## Quando relaxar (deliberadamente)

- Sandbox / branch experimental sem PR aberto — commits livres.
  Antes do PR, rodar regressão consolidando.
- Mudança em path explicitamente fora da lista (ex: `agent-at/output/`,
  `docs/`, `CONTRACT.md`) — nem dispara.
- Diff é puro revert de commit anterior — herda matriz do commit
  revertido. Anote no commit: `[revert: matches matrix of <sha>]`.

## Telemetria (futuro)

Plano: o orchestrator emitir `regression-snapshot.json` em
`outputs/<slug>/regression-history/<commit-sha>.json` com matriz
baseline. Comando `npm run agent:regression-diff -- <baseline-sha>`
compara automático contra HEAD e bloqueia commit no pre-commit hook.
Design doc do trend agregado em `docs/roadmap/agent-metrics/`.

Sem isso ainda, comparação é manual via os `index.md` per-run.
