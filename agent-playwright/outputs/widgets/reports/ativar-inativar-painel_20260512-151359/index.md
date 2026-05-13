# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 12/05/2026, 15:13:59

> **Escopo:** Apenas testsuite contendo "Ativar / Inativar painel"

> ❌ **2 caso(s) com falha precisam de atenção (2 críticos)**
>
> - 🔴 Crítico [Tentar inativar painel associado a um ou mais modos de uso](tests.md#tentar-inativar-painel-associado-a-um-ou-mais-modos-de-uso) — O elemento esperado não apareceu na tela (locator: locator('.chakra-modal__content').filter({ has: locator('[data-test-id="panel-in-use-modal-confirm"]') })).
> - 🔴 Crítico [Tentar reativar modo de uso vinculado a um painel inativo](tests.md#tentar-reativar-modo-de-uso-vinculado-a-um-painel-inativo) — A página não navegou para a URL esperada dentro do tempo limite.

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 5 | 3 | 2 | 0 | 62.2s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Ativar / Inativar painel** | 5 | `[████████████✗✗✗✗✗✗✗✗]` 3/2/0 | 60% | 2 | 0 | — | 62.2s |

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
