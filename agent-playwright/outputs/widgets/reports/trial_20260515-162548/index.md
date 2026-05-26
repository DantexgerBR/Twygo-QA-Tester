# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 15/05/2026, 16:25:48

> **Escopo:** Apenas testsuite contendo "Trial"

> ❌ **2 caso(s) com falha precisam de atenção (2 críticos)**
>
> - 🔴 Crítico [TC4 · Exclusão de trial: dados criados pelo Admin removidos](tests.md#exclusao-de-trial-dados-criados-pelo-admin-removidos) — Error: expect(locator).toHaveCount(expected) failed
> - 🔴 Crítico [TC3 · Exclusão de trial: dados pré-definidos da SophiaTech removidos](tests.md#exclusao-de-trial-dados-pre-definidos-da-sophiatech-removidos) — Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=5, final=6).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 4 | 2 | 2 | 0 | 293.3s |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Trial** | 4 | `[██████████✗✗✗✗✗✗✗✗✗✗]` 2/2/0 | 50% | 2 | 0 | — | 293.3s |

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
