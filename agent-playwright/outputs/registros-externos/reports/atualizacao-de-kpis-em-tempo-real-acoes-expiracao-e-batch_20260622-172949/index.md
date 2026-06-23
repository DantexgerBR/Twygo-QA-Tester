# Relatório de Execução — Twygo QA

**Projeto:** Registros de Aprendizagem · **Ambiente:** `staging-registros-externos` · **Browsers:** chromium · **Gerado em:** 22/06/2026, 17:29:49

> **Escopo:** Apenas testsuite contendo "Atualização de KPIs em tempo real (ações, expiração e batch)"

> ❌ **1 caso(s) com falha precisam de atenção (1 crítico)**
>
> - 🔴 Crítico [TC4 · Validar decremento do KPI após Excluir](tests.md#validar-decremento-do-kpi-apos-excluir) — O elemento esperado não apareceu na tela (locator: locator('[role="alertdialog"], [role="dialog"], .chakra-modal__content').filter({ hasText: /Excluir registro|desfeita|Tem certeza|Confirmação/i }).first()).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 9 | 6 | 1 | 2 | 195.4s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Atualização de KPIs em tempo real (ações, expiração e batch)** | 9 | `[█████████████✗✗⊘⊘⊘⊘⊘]` 6/1/2 | 67% | 1 | 2 | — | 195.4s |

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
