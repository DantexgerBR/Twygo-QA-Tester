# Widgets — Projeto Twygo

Pasta dedicada ao projeto **Widgets** (Painéis/Modos de uso). Contém todos
os artefatos específicos deste projeto: XML do agente AT, planos do
planner, specs gerados, Page Objects e test-IDs específicos.

> **Ambiente:** este projeto roda contra o env `staging-widgets`
> declarado em `config/environment.json` — não no `staging` principal
> Twygo. O `project.config.json` desta pasta declara
> `"environment": "staging-widgets"`. Specs de bloqueio por feature flag
> usam o env secundário `staging-widgets-disabled`. Valores reais (hosts,
> orgIds) ficam em `.env` (gitignored) — confira que os pares
> `TWYGO_STAGING_WIDGETS_*` (principal + `-disabled`) estão preenchidos
> antes de rodar (ver [.env.example](../../.env.example)).
>
> **Status:** specs gerados pra "Listagem de painéis" (8) e "Ativar /
> Inativar painel" (5). Demais 20 testsuites do XML aguardando geração
> via planner+generator interativo.

---

## Como começar (testador deste projeto)

### 1. Confirmar que está na branch correta

```bash
git branch --show-current
# Deve mostrar: project/widgets
```

Se não estiver, faça `git checkout project/widgets`.

### 2. Setup do agente (se for primeira vez na máquina)

A partir da raiz do monorepo:

```bash
cd agent-playwright
npm install
npx playwright install chromium
npm run typecheck
```

Detalhes em [agent-playwright/README.md](../../README.md) e [.claude/SETUP.md](../../.claude/SETUP.md).

### 3. Receber o XML do agente AT

O agente AT gera um XML TestLink a partir do XMind. Coloque o arquivo em:

```
projects/widgets/inputs/Analise_Teste_Widgets.xml
```

> Se o nome do arquivo divergir, ajuste `testAnalysisFile` em [`project.config.json`](project.config.json).

### 4. Validar que o XML é parseado corretamente

A partir de `agent-playwright/`:

```bash
npm run agent:parse -- --project widgets
npm run agent:suites -- --project widgets
```

A última saída deve listar as testsuites do projeto Widgets.

> Como hoje só existe `creditos-fase-02` e `widgets` em `projects/`, a flag
> `--project widgets` é **obrigatória** (auto-detect só funciona com 1 projeto).

### 5. Smoke pre-flight (confirma login + ambiente)

```bash
npm run agent:smoke
```

Roda em ~10s. Se falhar, confira credenciais em `.env` e que o ambiente
staging Twygo está acessível.

### 6. Rodar a primeira suíte

Pegue um nome literal da lista do passo 4 e rode:

```bash
npm run agent:run -- --project widgets --suite "<nome literal da suíte>"
```

Saída: `outputs/widgets/reports/{slug-suite}_{timestamp}/index.md`.

### 7. Healing após mudança de UI

Quando um teste falha por seletor/timing (não bug funcional):

```bash
cd agent-playwright
claude
> Invocar o healer do plugin Playwright para projects/widgets/tests/features/<arquivo>.spec.ts
```

---

## Estrutura desta pasta

| Subpasta / arquivo | O que contém |
|---|---|
| [`inputs/`](inputs/) | XML TestLink (do agente AT) + recons gerados pelo `twygo-recon` |
| [`specs/`](specs/) | Plans gerados pelo `playwright-test-planner` (Markdown) |
| [`tests/features/`](tests/features/) | Specs gerados (1 dir por testsuite, com `.spec.ts`) |
| [`pages/`](pages/) | Page Objects específicos do projeto Widgets |
| [`utils/`](utils/) | `testIds.ts` + helpers específicos |
| [`project.config.json`](project.config.json) | Config do projeto (nome, XML, exploratory, etc.) |

> Page Objects **genéricos Twygo** (BasePage, LoginPage, DashboardPage, SuperAdminPage) ficam em [`src/pages/`](../../src/pages/) na raiz e são compartilhados entre projetos.

---

## Outputs deste projeto

Tudo que for gerado pela execução vai pra:

```
agent-playwright/outputs/widgets/
├── test-analysis.parsed.json     # parser
├── test-results.json             # Playwright reporter
├── exploratory-findings.json     # validador exploratório
├── exploratory/                  # findings por teste
├── reports/<runId>/              # HTML estruturado
├── allure-results/               # modo regressivo
├── allure-report/                # Allure CLI
└── test-artifacts/               # screenshots, traces, vídeos
```

`outputs/` está no `.gitignore` — não commitar.

---

## Notas importantes

- **`config/environment.json`** (raiz do agente) é **compartilhado** entre projetos. Use o env `staging` ou `staging-without-credits` (este último para casos de organização sem saldo).
- **Convenção de slug**: `widgets` (lowercase, sem hífens neste caso por ser palavra única).
- **Nome literal do projeto** (campo `projectName` no `project.config.json`): hoje setado como `"Widgets"`. Se o nome canônico for diferente (ex.: `"Painéis dos usuários (Widgets)"`), atualize antes do primeiro run — esse texto vai pro Allure como `epic`.

---

## Documentação relacionada

| Documento | O que tem |
|---|---|
| [agent-playwright/README.md](../../README.md) | Visão geral do agente, comandos, troubleshooting |
| [.claude/PROJECT_BOOTSTRAP.md](../../.claude/PROJECT_BOOTSTRAP.md) | Ritual completo de novo projeto |
| [.claude/commands.md](../../.claude/commands.md) | Referência de comandos npm + flags |
| [CLAUDE.md](../../CLAUDE.md) | Especificação técnica do agente (engenharia QA sênior) |
| [.claude/prose-patterns.md](../../.claude/prose-patterns.md) | Padrões prosa PT-BR → Playwright (consumido pelo planner/generator) |

---

## Histórico

- Branch criada em **2026-05-05** a partir de `master` atualizada (após merge da migração `projects/<slug>/`).
