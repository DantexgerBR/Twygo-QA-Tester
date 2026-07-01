# Relatório de Execução — Twygo QA

**Projeto:** Registros de Aprendizagem · **Ambiente:** `staging-registros-externos` · **Browsers:** chromium · **Gerado em:** 25/06/2026, 15:24:46

> **Escopo:** Apenas testsuite contendo "Extração de dados da Evidência (export em massa de anexos)"

> ✅ **Nenhuma falha registrada** — 4 de 5 caso(s) aprovados (1 automatizado + 3 por validação manual em 25/06/2026); 1 permanece ignorado (TC2, verificação manual pendente).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 5 | 4 | 0 | 1 | 16.2s |

> _4 aprovados = TC1 (automatizado) + TC3/TC4/TC5 (validação manual). Os specs de TC3/TC4/TC5 seguem `test.fixme` no código (verificação não-automatizável por Playwright UI); a aprovação foi registrada manualmente neste relatório._

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Extração de dados da Evidência (export em massa de anexos)** | 5 | `[████████████████⊘⊘⊘⊘]` 4/0/1 | 80% | 0 | 1 | — | 16.2s |

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
