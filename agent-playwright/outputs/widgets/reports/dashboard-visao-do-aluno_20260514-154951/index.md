# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 14/05/2026, 15:49:51

> **Escopo:** Apenas testsuite contendo "Dashboard - Visão do aluno"

> ❌ **2 caso(s) com falha precisam de atenção**
>
> - 🟡 Normal [TC8 · Exibição de um widget por aba](tests.md#exibicao-de-um-widget-por-aba) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: getByRole('link', { name: 'Item Painel WPA w1-1778784497809' })).
> - 🟡 Normal [TC5 · Renderização de widget configurado com título e ícone customizados](tests.md#renderizacao-de-widget-configurado-com-titulo-e-icone-customizados) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: getByRole('link', { name: 'Item Painel WC w0-1778784508756' })).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 8 | 6 | 2 | 0 | 129.5s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Dashboard - Visão do aluno** | 8 | `[███████████████✗✗✗✗✗]` 6/2/0 | 75% | 2 | 0 | — | 129.5s |

## Bug Reports prontos pra task

_2 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **2** spec-fragil

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC8 · Exibição de um widget por aba](bug-reports/dashboard-visao-do-aluno__exibicao-de-um-widget-por-aba.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC5 · Renderização de widget configurado com título e ícone customizados](bug-reports/dashboard-visao-do-aluno__renderizacao-de-widget-configurado-com-titulo-e-icone-customizados.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (2)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
