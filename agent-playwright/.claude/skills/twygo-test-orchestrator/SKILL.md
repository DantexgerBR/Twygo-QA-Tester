---
name: twygo-test-orchestrator
description: Orquestra o ciclo completo de geração e execução de testes Playwright a partir do JSON parseado do XML TestLink. Delega planejamento, geração e healing aos subagentes do plugin oficial Playwright (playwright-test-planner / playwright-test-generator / playwright-test-healer) com contexto Twygo. Suporta modo per-suite (dia-a-dia) e modo regressivo (CI).
version: 1.0.0
---

# twygo-test-orchestrator

## Quando usar

Sempre que o time de QA precisa **gerar, executar ou consertar specs Playwright**
a partir da análise de testes em XML TestLink. Cobre dois cenários:

| Cenário | Quem invoca | Como |
|---|---|---|
| **Per-suite (dia-a-dia)** | QA da Twygo, localmente | `claude` interativo + esta skill |
| **Regressivo / CI** | GitHub Actions | `npm run agent:regression` |

## Pré-requisitos

- `outputs/test-analysis.parsed.json` existe (rode `npm run agent:parse` antes).
- Plugin oficial Playwright instalado (ver [SETUP.md](../../SETUP.md)).
- Playwright MCP rodando (`.mcp.json` registrado).
- Ambiente Twygo acessível (URL configurada em `config/environment.json`).
- Page Objects existentes em `src/pages/` para reuso.
- `src/utils/testIds.ts` central (cria sob demanda se não existir).

## Fluxo orquestrado

### Etapa 1 — Determinar escopo

| Argumento | Comportamento |
|---|---|
| `--suite "<nome literal>"` | Filtra por nome exato ou substring da `<testsuite>` |
| `--all` | Todas as testsuites |
| `--regression` | `--all` + `REGRESSION=true` (ativa reporter Allure) |

Se nenhum, padrão é executar `--all` (regressivo curto, sem Allure).

### Etapa 2 — Planejamento (planner)

Para cada `<testcase>` no escopo:

1. Carregar do JSON parseado: `name`, `summary`, `preconditions`, `importance`,
   `executionType`, `steps[]`.
2. Invocar o subagent **`playwright-test-planner`** (definido em `.claude/agents/`, MCP `playwright-test`) com o template canônico — **ver [prompts.md](prompts.md) seção "Planner — Etapa 2"** para o template completo + contexto adicional (prose-patterns, recon, Page Objects existentes) que deve ser carregado junto.
3. Validar que o plano contempla **todos** os steps do XML — não pode pular.
4. Se o planner reportar ambiguidade ou impossibilidade, marcar como
   `// REVISAR` e prosseguir (não chutar).

### Etapa 3 — Geração de Page Objects (sob demanda)

Antes do generator escrever o spec:

1. Listar pages únicas referenciadas no plano (ex.: `LoginPage`, `KitMarcaListPage`).
2. Para cada page:
   - Se já existe em `src/pages/`, reutilizar — NÃO sobrescrever locators existentes.
   - Se não existe, gerar com `templates/page-object-template.ts` + Playwright MCP
     para descobrir locators reais no DOM.
3. Atualizar `src/utils/testIds.ts` com novos `data-testid` mapeados.

### Etapa 4 — Geração de spec (generator)

Para cada testcase planejado:

1. Invocar o subagent **`playwright-test-generator`** (definido em `.claude/agents/`, MCP `playwright-test`) com:
   - O plano da Etapa 2.
   - Lista de Page Objects disponíveis (e quais métodos eles expõem).
   - Acesso ao Playwright MCP para validar seletores ao vivo.
   - Convenções do CLAUDE.md (importar de `exploratory-fixture`).
   - **Anti-patterns proibidos no output (CLAUDE.md §7.6)** — comunicar
     literalmente ao generator antes da geração:
     - **A. Não fazer login no spec.** `globalSetup` já cobre via
       `storageState`. Não chamar `loginPage.login()` nem `page.goto('/users/login')`.
       Excetua-se apenas specs em `tests/auth/` (que testam a tela de login).
     - **B. Não hardcodar URL/orgId/credenciais.** Importar de
       `src/utils/environment.ts` (`getBaseUrl()`, `getOrgId()`,
       `getEnvByName('<env>')`, `getEditContractPath()`). Rotas livres de env
       (`/users/login`, `/play`) podem ficar literais.
     - **C. Não inline helpers de UI no `test()`.** Lógica com seletores ou
       fluxos UI multi-step vai como método na Page Object correspondente
       (regra dura #3 de POM). Se ambígua, criar método nomeado conforme a
       intenção e referenciar no spec via `pageObject.metodo()`.
     - **D. Comentários só WHY, nunca WHAT.** Allure `step()` já narra o
       fluxo. Comentário no código serve só pra capturar invariante não-óbvia
       (sync alert que força `force:true`, tabela compartilhada que exige
       revert, prosa ambígua marcada `// REVISAR`).
     - **E. Constantes-de-domínio em `<test-case>.data.ts`, não inline.**
       IDs (`envId: 36799`), slugs, listas de fixtures vão num arquivo
       `<mesmo-nome>.data.ts` ao lado do spec, exportando um objeto `as const`.
       O spec só importa e referencia (`data.envId`). Convenção em CLAUDE.md
       §3.1. Generator deve emitir o `.data.ts` SEMPRE que o teste tiver ≥1
       constante de domínio — mesmo que seja só uma. Não inline.
2. Annotations Allure obrigatórias no início de cada `test()`:
   ```ts
   await allure.epic(`Twygo - ${projectName}`);                    // do projectName em config
   await allure.feature(`${testsuiteName}`);                       // do <testsuite name>
   await allure.story(`${testcaseName}`);                          // do <testcase name>
   await allure.severity(severityFromImportance(importance));      // 1=minor, 2=normal, 3=critical
   if (executionType === 1) await allure.label('executionType', 'manual');
   else if (executionType === 2) await allure.label('executionType', 'automated');
   for (const step of steps) {
     await allure.step(`${step.stepNumber}. ${step.actions}`, async () => {
       // ... ações Playwright
     });
   }
   ```
3. Escrever em `tests/features/<slug-suite>/<slug-testcase>.spec.ts`
   (organização por suíte facilita filtro `--grep` e leitura).
4. Rodar `npm run typecheck` — se falhar, **parar** e pedir correção ao
   generator antes de seguir.

### Etapa 5 — Execução

Delegar ao Node helper [`orchestrator.ts`](orchestrator.ts) que:

1. Constrói `--grep` apropriado para o escopo (suite filter ou tudo).
2. Define `REGRESSION=true` se modo regressivo.
3. Invoca `npx playwright test`.
4. Captura exit code para retornar ao final.

### Etapa 6 — Validação Exploratória

Após a execução, **sempre**:

```bash
npm run agent:explore
```

Que invoca `twygo-exploratory-validator` para agregar findings.

### Etapa 7 — Relatório

```bash
npm run agent:report -- --suite "<nome>"        # per-suite
# OU
npm run agent:report -- --regression             # regressivo
```

### Etapa 8 — Healing (opcional, sob falha)

Se houve falhas que parecem **mudança de UI** (não bug funcional):

1. Identificar specs com falha por seletor não encontrado / timeout.
2. Para cada um, invocar o subagent **`playwright-test-healer`** (definido em `.claude/agents/`, MCP `playwright-test`):
   - Input: spec + screenshot da falha + DOM atual via Playwright MCP.
   - O healer propõe correção minimal (apenas seletor/espera/asserção,
     **nunca** muda o que o teste valida).
3. Apresentar diff ao QA para aprovação antes de aplicar.

### Etapa 8.1 — Validar diff do heal (gate estático)

**Disparada sempre** que Etapa 8 produziu correções aceitas pelo QA, antes
de commitar/aplicar. Invoca a skill [`validar-heal-diff`](../validar-heal-diff/SKILL.md)
com:

- Lista de arquivos modificados (em `tests/`, `src/pages/`, `projects/`)
- Diff completo (`git diff --no-color --unified=0`)

A skill classifica cada hunk como `passed` / `needs_review` / `blocked` e
retorna veredito agregado:

| Veredito | Ação do orquestrador |
|---|---|
| `passed` | Segue pra Etapa 8.5 ou commit local |
| `needs_review` | Mostra hunks suspeitos ao QA, pede confirmação por hunk; se QA rejeitar qualquer, escala pra `blocked` |
| `blocked` | Reverte (`git checkout -- <arquivos>`), apresenta relatório com hunks bloqueados, instrui QA a atualizar XML do AT (caminho legítimo pra mudar intenção do teste) |

Esta etapa **enforce a regra dura #11** ("healer só toca seletor/timing/
asserção, nunca intenção") de forma estática — em vez de depender só do
prompt do healer respeitar a regra. Bloqueios típicos: assertion polarity
flip (`toBeVisible` → `toBeHidden`), mudança de título de `test()` ou
`test.describe()`, reorder de steps, adição/remoção de `test.fixme(true,)`.

### Etapa 8.5 — Post-heal: abrir PR (opt-in via GitHub MCP)

Disparada **só** quando (a) Etapa 8 aceitou correções E (b) o GitHub MCP
está ativo (ver [SETUP.md §3.2](../../SETUP.md)). Se o MCP `github` não
estiver em `/mcp`, pula silenciosamente — não bloquear.

1. Detectar que o heal modificou arquivos: `git status -s tests/ src/pages/ projects/`.
   Se vazio, encerrar (não havia o que aplicar).
2. Determinar branch alvo:
   - Se branch atual é `master`: criar `fix/heal-<slug-suite>-<YYYYMMDD-HHmm>`.
   - Se branch atual é `project/<slug>` ou `fix/*`: commitar nela mesma.
3. Commit dos arquivos modificados:
   ```bash
   git add tests/ src/pages/ projects/<slug>/
   git commit -m "chore(heal): conserta seletor/timing em <slug-suite>

   Healer aplicou correções minimais (seletor, espera, asserção).
   Intenção dos testes preservada — XML do AT não foi alterado.

   Refs: <link pro relatório que expôs a falha>"
   ```
4. Push: `git push -u origin <branch>`.
5. Abrir PR via GitHub MCP (`mcp__github__create_pull_request` ou similar):
   - Título: `[heal] <slug-suite> — conserta seletor/timing pós-mudança UI`
   - Body com:
     - Lista de specs alterados (caminho + 1 linha de resumo da mudança)
     - Link pro relatório que mostrou a falha original
     - Checklist: "Healer só corrige seletor/timing/asserção (regra dura
       #11 do CLAUDE.md). Reviewer confirma que a intenção do teste
       não mudou."
6. Retornar ao QA: URL do PR + branch + 1 linha de resumo.

**Trigger condicional** (pseudo-lógica que o orchestrator implementa):

```
if (etapa8.aplicouCorrecoes && mcpAtivo('github')) {
  rodarEtapa85();
} else if (etapa8.aplicouCorrecoes) {
  loggar("PR não aberto — GitHub MCP não está ativo. " +
         "Para ativar: ver SETUP.md §3.2.");
}
```

**Não disparar etapa 8.5 quando**:
- Modificações fora de `tests/`, `src/pages/`, `projects/` (heal só toca
  esses três caminhos por construção).
- Working tree tem mudanças não-heal misturadas (typecheck mexido,
  Page Object reescrito por outra razão) — pedir ao QA pra commitar
  separado primeiro.
- A branch atual é `master` E o repo está em modo "branch protegida" — o
  push falha; pedir ao QA pra criar branch manualmente.

## Modos de uso

### Modo interativo (per-suite, dev local)

```
$ cd agent-playwright
$ claude
> Execute o orquestrador para a suíte "[Kit de marca] QA 2.1 - ..."
```

Claude carrega `CLAUDE.md` + esta SKILL.md, executa Etapas 1–7 acima,
mostra resumo + link para o relatório.

### Modo CLI (apenas execução, sem regenerar)

Quando os specs já estão commitados e você só quer **executar**:

```bash
# Per-suite
npm run agent:run -- --suite "[Kit de marca] QA 2.1 - ..."

# Regressivo
npm run agent:regression
```

### Modo regeneração forçada

Quando o XML mudou e precisa regerar specs:

```
$ claude
> Regenere os specs da suíte "<nome>" — XML foi atualizado pelo AT
```

O orquestrador detecta `tests/features/<slug>/*.spec.ts` existentes,
compara com o JSON, regenera os que mudaram, preserva os outros.

## Saídas

Após orquestração completa:

```
tests/features/<slug-suite>/*.spec.ts        # specs gerados/atualizados
src/pages/<NewPage>.ts                       # POMs gerados/atualizados
src/utils/testIds.ts                         # data-testids registrados
outputs/test-results.json                    # do Playwright
outputs/exploratory/*.json                   # da fixture
outputs/exploratory-findings.json            # do validator
outputs/reports/{slug-suite}_{timestamp}/    # do report-generator (per-suite)
outputs/allure-report/                       # do Allure CLI (regressivo)
```

E quando a Etapa 8.5 dispara (heal aceito + GitHub MCP ativo):

```
fix/heal-<slug-suite>-<timestamp>            # branch nova (se vinha de master)
PR aberto em github.com/Twygo/twygo-agents-qa  # URL retornada ao QA
```

## Regras

1. **Nunca** gerar testcase que não está no XML — XML é fonte única de verdade.
2. **Sempre** preservar Page Objects existentes — só estender, não sobrescrever.
3. **Sempre** rodar typecheck antes de tentar executar.
4. **Sempre** invocar validator + report-generator após execução.
5. **Não** modificar `inputs/` ou `outputs/` durante a orquestração (somente `outputs/` é gravado pelos sub-skills).
6. Healer **só** corrige seletor/timing/asserção. Para mudanças de intenção,
   o XML do AT precisa ser atualizado primeiro.
