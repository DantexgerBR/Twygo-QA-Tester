# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 11/05/2026, 16:55:21

> **Escopo:** Apenas testsuite contendo "Ativar / Inativar painel"

> ❌ **2 caso(s) com falha precisam de atenção**
>
> -  [Tentar inativar painel associado a modos de uso exibe modal de bloqueio](tests.md#tentar-inativar-painel-associado-a-modos-de-uso-exibe-modal-de-bloqueio) — O elemento esperado não apareceu na tela (locator: locator('.chakra-modal__content').filter({ has: locator('[data-test-id="panel-in-use-modal-confirm"]') })).
> - 🟡 Normal [Verificar persistência do estado Ativo após reload](tests.md#verificar-persistencia-do-estado-ativo-apos-reload) — O elemento esperado não apareceu na tela (locator: locator('tbody tr').filter({ has: locator('td:first-child p').filter({ hasText: 'Painel 30' }) })).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 5 | 2 | 2 | 1 | 73.1s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Ativar / Inativar painel** | 5 | `[████████✗✗✗✗✗✗✗✗⊘⊘⊘⊘]` 2/2/1 | 40% | 2 | 1 | — | 73.1s |

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
