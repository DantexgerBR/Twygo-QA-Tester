# Relatório de Execução — Twygo QA

**Projeto:** Recertificação · **Ambiente:** `staging-recertificacao` · **Browsers:** chromium · **Gerado em:** 01/06/2026, 09:05:33

> **Escopo:** Apenas testsuite contendo "Filtro Avançado Status Substituído"

> ❌ **1 caso(s) com falha precisam de atenção (1 crítico)**
>
> - 🔴 Crítico [TC4 · Opção "Substituído" NÃO aparece no filtro com flag OFF (regressão)](tests.md#tc4-opcao-substituido-nao-aparece-no-filtro-com-flag-off-regressao) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('#open-filter')).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 4 | 3 | 1 | 0 | 245.5s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Filtro Avançado Status Substituído** | 4 | `[███████████████✗✗✗✗✗]` 3/1/0 | 75% | 1 | 0 | — | 245.5s |

## Bug Reports prontos pra task

_1 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **1** modal-nao-tratado

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC4 · Opção "Substituído" NÃO aparece no filtro com flag OFF (regressão)](bug-reports/filtro-avancado-status-substituido__tc4-opcao-substituido-nao-aparece-no-filtro-com-flag-off-regressao.md) | 🪟 modal-nao-tratado | alta | baixa | Click interceptado — overlay/modal por cima do alvo |

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
