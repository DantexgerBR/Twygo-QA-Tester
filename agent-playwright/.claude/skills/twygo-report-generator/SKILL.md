---
name: twygo-report-generator
description: Gera relatório HTML estruturado por execução em outputs/reports/{slug}_{timestamp}/ (index.html + tests.html + exploratory.html + JSONs). Em modo regressivo, dispara também o Allure CLI para o relatório executivo com trend histórico.
version: 2.0.0
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
├── index.html              ← Dashboard com KPIs + tabela por testsuite + cards de navegação
├── tests.html              ← Detalhamento dos casos de teste por testsuite
├── exploratory.html        ← Findings exploratórios + cobertura por URL
├── summary.json            ← Totais agregados
├── run_context.json        ← projectName, environment, browsers, mode, timestamp
├── tests.json              ← Cópia de outputs/test-results.json
└── exploratory.json        ← Cópia de outputs/exploratory-findings.json
```

## Atalhos `latest-*.html` na raiz de `outputs/reports/`

Para abrir sempre a última run de um modo:

```
outputs/reports/latest-suite-<slug>.html      # última run da suíte X
outputs/reports/latest-regression.html         # última regressão
outputs/reports/latest-all.html                # última execução all-suites
```

São arquivos HTML com `<meta http-equiv="refresh">` apontando para a pasta
mais recente correspondente.

## Identidade visual

Tema dark inspirado no GitHub (`#0d1117` background, verde `#3fb950`
para passed, vermelho `#f85149` para failed, amarelo `#d29922` para skipped/
warning, azul `#58a6ff` para info/links). CSS embutido (zero dependências
externas, funciona offline).

## Modo regressivo + Allure

Quando `--regression` é passado:

1. Gera a pasta `outputs/reports/regression_{ts}/` normalmente.
2. Invoca `npx allure generate outputs/allure-results -o outputs/allure-report --clean`.
3. Adiciona link no `index.html` apontando para o Allure (com badge "trend
   histórico").

O workflow `.github/workflows/regression.yml` (Fase 7) publica o
`outputs/allure-report/` em GitHub Pages, preservando o `history/` da
execução anterior para alimentar os trends.

## Entradas

- `outputs/test-results.json` (Playwright JSON reporter — obrigatório).
- `outputs/exploratory-findings.json` (validator — opcional, mas recomendado).
- `projects/<slug>/project.config.json` (projectName, environment, browsers).

## Saída resumida no console

```
[INFO] [report-generator] Relatório gerado → outputs/reports/.../index.html
[INFO] [report-generator]   13✓ 1✗ 3⊘ · exploratório: 0E 1W 4I
[INFO] [report-generator]   Atalho: outputs/reports/latest-suite-....html
```
