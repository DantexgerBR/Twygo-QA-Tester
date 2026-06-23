# Relatório de Execução — Twygo QA

**Projeto:** Registros de Aprendizagem · **Ambiente:** `staging-registros-externos` · **Browsers:** chromium · **Gerado em:** 22/06/2026, 17:13:23

> **Escopo:** Apenas testsuite contendo "KPI cards como dashboard estático (Admin/Líder)"

> ❌ **1 caso(s) com falha precisam de atenção (1 crítico)**
>
> - 🔴 Crítico [TC2 · Validar tooltips no tom institucional do Admin](tests.md#validar-tooltips-no-tom-institucional-do-admin) — Error: expect(received).toBe(expected) // Object.is equality

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 9 | 3 | 1 | 5 | 58.3s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **KPI cards como dashboard estático (Admin/Líder)** | 9 | `[███████✗✗⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 3/1/5 | 33% | 1 | 5 | — | 58.3s |

## Bug Reports prontos pra task

_1 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **1** inconclusivo

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC2 · Validar tooltips no tom institucional do Admin](bug-reports/kpi-cards-como-dashboard-estatico-admin-lider__validar-tooltips-no-tom-institucional-do-admin.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (1)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
