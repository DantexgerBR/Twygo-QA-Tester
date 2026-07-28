# Relatório de Execução — Twygo QA

**Projeto:** Recertificação · **Ambiente:** `staging-recertificacao` · **Browsers:** chromium · **Gerado em:** 27/07/2026, 13:56:50

> **Escopo:** Apenas testsuite contendo "Filtro Avançado Status Substituído"

> ❌ **1 caso(s) com falha precisam de atenção**
>
> -  [TC2 — Filtrar por "Substituído" exibe apenas alunos com certificate_status = 4](tests.md#tc2-filtrar-por-substituido-exibe-apenas-alunos-com-certificate-status-4) — Error: expect(received).toContain(expected) // indexOf

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 4 | 3 | 1 | 0 | 197.6s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Filtro Avançado Status Substituído** | 4 | `[███████████████✗✗✗✗✗]` 3/1/0 | 75% | 1 | 0 | — | 197.6s |

## Bug Reports prontos pra task

_1 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **1** spec-fragil

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC2 — Filtrar por "Substituído" exibe apenas alunos com certificate_status = 4](bug-reports/filtro-avancado-status-substituido__tc2-filtrar-por-substituido-exibe-apenas-alunos-com-certificate-status-4.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |

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
