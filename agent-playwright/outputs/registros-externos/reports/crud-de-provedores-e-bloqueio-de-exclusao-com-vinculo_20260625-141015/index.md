# Relatório de Execução — Twygo QA

**Projeto:** Registros de Aprendizagem · **Ambiente:** `staging-registros-externos` · **Browsers:** chromium · **Gerado em:** 25/06/2026, 14:10:15

> **Escopo:** Apenas testsuite contendo "CRUD de Provedores e bloqueio de exclusão com vínculo"

> ❌ **1 caso(s) com falha precisam de atenção (1 crítico)**
>
> - 🔴 Crítico [TC3 · Validações do campo "Nome" do provedor](tests.md#validacoes-do-campo-nome-do-provedor) — Error: "Emoji" deveria ser aceito

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 10 | 9 | 1 | 0 | 318.1s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **CRUD de Provedores e bloqueio de exclusão com vínculo** | 10 | `[██████████████████✗✗]` 9/1/0 | 90% | 1 | 0 | — | 318.1s |

## Bug Reports prontos pra task

_1 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **1** inconclusivo

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC3 · Validações do campo "Nome" do provedor](bug-reports/crud-de-provedores-e-bloqueio-de-exclusao-com-vinculo__validacoes-do-campo-nome-do-provedor.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |

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
