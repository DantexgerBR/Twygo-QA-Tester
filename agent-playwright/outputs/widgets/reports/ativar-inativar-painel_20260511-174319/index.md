# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 11/05/2026, 17:43:19

> **Escopo:** Apenas testsuite contendo "Ativar / Inativar painel"

> ❌ **1 caso(s) com falha precisam de atenção**
>
> -  [Tentar inativar painel associado a modos de uso exibe modal de bloqueio](tests.md#tentar-inativar-painel-associado-a-modos-de-uso-exibe-modal-de-bloqueio) — O elemento esperado não apareceu na tela (locator: locator('.chakra-modal__content').filter({ has: locator('[data-test-id="panel-in-use-modal-confirm"]') })).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 5 | 3 | 1 | 1 | 60.1s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Ativar / Inativar painel** | 5 | `[████████████✗✗✗✗⊘⊘⊘⊘]` 3/1/1 | 60% | 1 | 1 | — | 60.1s |

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
