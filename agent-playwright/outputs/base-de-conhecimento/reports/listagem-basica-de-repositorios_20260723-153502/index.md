# Relatório de Execução — Twygo QA

**Projeto:** Base de Conhecimento · **Ambiente:** `staging-base-de-conhecimento` · **Browsers:** chromium · **Gerado em:** 23/07/2026, 15:35:02

> **Escopo:** Apenas testsuite contendo "Listagem básica de repositórios"

> ❌ **2 caso(s) com falha precisam de atenção (1 crítico)**
>
> - 🔴 Crítico [TC2 · Validar colunas obrigatórias da listagem](tests.md#tc2-validar-colunas-obrigatorias-da-listagem) — O elemento esperado não apareceu na tela (locator: getByRole('columnheader', { name: 'Categoria' })).
> - 🟡 Normal [TC4 · Validar empty state quando não há repositórios](tests.md#tc4-validar-empty-state-quando-nao-ha-repositorios) — O elemento esperado não apareceu na tela (locator: getByText('Não há dados para exibir')).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 4 | 2 | 2 | 0 | 171.6s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Listagem básica de repositórios** | 4 | `[██████████✗✗✗✗✗✗✗✗✗✗]` 2/2/0 | 50% | 2 | 0 | — | 171.6s |

## Bug Reports prontos pra task

_2 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **2** inconclusivo

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC2 · Validar colunas obrigatórias da listagem](bug-reports/listagem-basica-de-repositorios__tc2-validar-colunas-obrigatorias-da-listagem.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC4 · Validar empty state quando não há repositórios](bug-reports/listagem-basica-de-repositorios__tc4-validar-empty-state-quando-nao-ha-repositorios.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |

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
