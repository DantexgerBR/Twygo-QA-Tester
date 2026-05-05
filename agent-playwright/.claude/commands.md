# Comandos e iniciação do agente Playwright Twygo

> Para a configuração inicial (deps, MCPs, plugin), veja [SETUP.md](SETUP.md).
> Para o ritual completo de novo projeto (branches, commits), veja [PROJECT_BOOTSTRAP.md](PROJECT_BOOTSTRAP.md).

## 1. Setup por novo projeto (uma vez por projeto Twygo)

1. `mkdir -p projects/<slug>/{inputs,specs,tests/features,pages,utils}`.
2. Copiar o XML do agente AT para `projects/<slug>/inputs/Analise_Teste_<projeto>.xml`.
3. Criar `projects/<slug>/project.config.json` com:
   - `testAnalysisFile`: caminho do XML do passo 2 (relativo ao projeto).
   - `projectName`: nome do projeto (vai pro `allure.epic`).
   - `environment`: `staging` | `production`.
   - `browsers`: `["chromium"]` (ou multi-browser).
4. Garantir que `.mcp.json` tem o Playwright MCP registrado (já vem por padrão).

## 2. Fluxo dia-a-dia (per-suite)

Quando o dev entrega um bloco e o QA quer validar só aquela suíte:

```bash
# Lista as suítes disponíveis no XML para confirmar o nome
npm run agent:suites

# Roda parse + planner + generator + execução + validador + report
npm run agent:run -- --suite "[Kit de marca] QA 2.1 - ..."
```

Resultado:
- `outputs/reports/{slug-suite}_{timestamp}/index.html` (relatório estruturado).
- `outputs/reports/latest-suite-{slug}.html` (atalho para a última run).

## 3. Fluxo regressivo (fim de projeto / CI)

```bash
npm run agent:regression
```

Internamente equivale a:

```bash
npm run agent:parse \
  && REGRESSION=true npm run agent:run -- --regression \
  && npm run agent:explore \
  && npm run agent:report -- --regression
```

Resultado:
- `outputs/reports/regression_{timestamp}/index.html` (HTML estruturado).
- `outputs/allure-report/` (Allure com trend, publicado em GH Pages pelo
  workflow [`.github/workflows/regression.yml`](../../.github/workflows/regression.yml)).

## 4. Healing após falha (interativo)

Quando um teste falha após mudança de UI:

```bash
# Abrir Claude Code no diretório do agente
cd agent-playwright
claude

# Pedir ao agente:
> Invocar o healer do plugin Playwright para o spec tests/features/<arquivo>.spec.ts
```

O healer inspeciona o DOM atual via Playwright MCP, identifica seletor/
timing/asserção que mudou e propõe correção via diff. **Healer nunca muda
intenção do teste** — só seletor, espera ou asserção.

## 5. Comandos individuais (debug e operações pontuais)

```bash
npm run agent:parse                    # XML TestLink → JSON
npm run agent:suites                   # Lista as testsuites do XML parseado
npm run agent:explore                  # Consolida findings exploratórios
npm run agent:report                   # Gera relatório no modo all-suites
npm run typecheck                      # tsc --noEmit
npm run test                           # playwright test puro (sem orquestração)
npm run test:headed                    # Playwright com browser visível
npm run test:ui                        # Playwright UI mode
npm run clean                          # Apaga outputs/ gerados
```

## 6. Variáveis de ambiente

Definidas em `agent-playwright/.env` (gitignored):

- `TWYGO_STAGING_USER`, `TWYGO_STAGING_PASS` — credenciais resolvidas via
  `${VAR}` em `config/environment.json`.
- `EXPLORATORY_STRICT=1` — promove findings exploratórios `error` a falhas
  do teste (use em CI quando quiser zero tolerância a console errors / 5xx).
- `REGRESSION=true` — ativa reporter Allure em vez do HTML do Playwright.
- `LOG_LEVEL=debug` — output verbose dos scripts.

## 7. Argumentos do orquestrador (`npm run agent:run`)

| Flag | Comportamento |
|---|---|
| `--project <slug>` | Projeto ativo (`projects/<slug>/`). Opcional se há só 1 projeto em `projects/` (auto-detect). Obrigatório quando há 2+ |
| `--suite "<nome>"` | Filtra por nome literal ou substring de uma testsuite |
| `--all` | Todas as testsuites do projeto (sem filtro) |
| `--regression` | `--all` + ativa Allure |
| `--no-explore` | Pula a Fase 5.5 (validador exploratório) |
| `--no-report` | Pula a Fase 6 (gerador de relatório) |
| `--no-preflight` | Pula a Fase 1.5 (smoke pre-flight) |
| `--smoke-only` | Roda só o smoke e sai |
| `--list` | Apenas lista as testsuites disponíveis e sai |

> Alternativa a `--project <slug>`: `export PROJECT=<slug>` antes do comando
> (ou `$env:PROJECT="<slug>"` em PowerShell). Para regressivo cumulativo
> (todos os projetos juntos em master), use `PROJECT_ALL=true`.
