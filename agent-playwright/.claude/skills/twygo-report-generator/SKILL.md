---
name: twygo-report-generator
description: Gera relatório Markdown estruturado por execução em outputs/reports/{slug}_{timestamp}/ (index.md + tests.md + exploratory.md + JSONs). Em modo regressivo, dispara também o Allure CLI para o relatório executivo com trend histórico (Allure mantém HTML — built-in).
version: 3.0.0
---

# twygo-report-generator

## Quando usar

Após execução do Playwright + agregação exploratória (Fase 5.5). É chamado
automaticamente pelo `twygo-test-orchestrator` ao final do fluxo, ou pode ser
invocado manualmente:

```bash
npm run agent:report                              # all-suites (default)
npm run agent:report -- --suite "<nome>"          # per-suite
npm run agent:report -- --regression              # regressivo + Allure
```

## Modos

| Modo | Folder de saída | Uso típico |
|---|---|---|
| `--suite "<nome>"` | `outputs/reports/{slug-suite}_{ts}/` | QA testou 1 bloco |
| (default) | `outputs/reports/all-suites_{ts}/` | Resumo de execução não-filtrada |
| `--regression` | `outputs/reports/regression_{ts}/` + `outputs/allure-report/` | CI / fim de projeto |

## Conteúdo de cada pasta de execução

```
{folder}_{YYYYMMDD-HHMMSS}/
├── index.md                ← Dashboard com KPIs + tabela por testsuite + lista de falhas
├── tests.md                ← Detalhamento dos casos de teste por testsuite
├── exploratory.md          ← Findings exploratórios + cobertura por URL
├── summary.json            ← Totais agregados (machine-readable)
├── run_context.json        ← projectName, environment, browsers, mode, timestamp
├── tests.json              ← Cópia de outputs/test-results.json (Playwright JSON)
└── exploratory.json        ← Cópia de outputs/exploratory-findings.json
```

## Atalhos `latest-*.md` na raiz de `outputs/reports/`

Para abrir sempre a última run de um modo:

```
outputs/reports/latest-suite-<slug>.md       # última run da suíte X
outputs/reports/latest-regression.md          # última regressão
outputs/reports/latest-all.md                 # última execução all-suites
```

São arquivos Markdown curtos com um link relativo apontando para a pasta
mais recente correspondente. Em IDE/GitHub o link resolve direto.

## Por que MD em vez de HTML

Decisão tomada na chore/agentes-qa-overhaul (2026-05): o gerador HTML
custom (~2k linhas com CSS embutido, JS de tabela ordenável, accordeon
de detalhes) foi substituído por Markdown. Razões:

- **Leitura nativa em IDE/GitHub** — VSCode, IntelliJ e Web do GitHub
  renderizam tabelas, code blocks, `<details>`, e screenshots inline.
  Sem dependência de browser pra abrir.
- **Manutenção 70% menor** — sem CSS/temas/sortable JS pra manter.
- **Diff-friendly** — mudança em relatório é diff legível em PR. HTML
  com 2k tags vira ruído.
- **Allure continua HTML** — onde "trend histórico" e "executivo"
  importam (regressivo), o relatório built-in do Allure cobre. MD é o
  formato do dia-a-dia (per-suite + all-suites).

## Modo regressivo + Allure

Quando `--regression` é passado:

1. Gera a pasta `outputs/reports/regression_{ts}/` com os 3 `.md` + JSONs.
2. Invoca `npx allure generate outputs/allure-results -o outputs/allure-report --clean`.
3. Adiciona link no `index.md` apontando para `../../allure-report/index.html`.

O workflow `.github/workflows/regression.yml` (Fase 7) publica o
`outputs/allure-report/` em GitHub Pages, preservando o `history/` da
execução anterior para alimentar os trends.

## Entradas

- `outputs/test-results.json` (Playwright JSON reporter — obrigatório).
- `outputs/exploratory-findings.json` (validator — opcional, mas recomendado).
- `outputs/test-analysis.parsed.json` (xml-parser — recomendado, dá metadata
  do XML pros testcases).
- `projects/<slug>/project.config.json` (projectName, environment, browsers).

## Saída resumida no console

```
[INFO] [report-generator] Relatório gerado → outputs/reports/.../index.md
[INFO] [report-generator]   13✓ 1✗ 3⊘ · exploratório: 0E 1W 4I
[INFO] [report-generator]   Atalho: outputs/reports/latest-suite-....md
```
