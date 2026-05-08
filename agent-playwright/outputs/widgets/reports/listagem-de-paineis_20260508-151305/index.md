# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 08/05/2026, 15:13:05

> **Escopo:** Apenas testsuite contendo "Listagem de painéis"

> ❌ **7 caso(s) com falha precisam de atenção (2 críticos)**
>
> -  [Acessar a listagem de Painéis a partir do Menu](tests.md#acessar-a-listagem-de-paineis-a-partir-do-menu) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('#menu a[name="settings-main-menu"]')).
> -  [Validar acessibilidade por teclado (TAB / setas / ENTER / ESC)](tests.md#validar-acessibilidade-por-teclado-tab-setas-enter-esc) — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
> - 🟡 Normal [Alternar entre visualização em lista e cards](tests.md#alternar-entre-visualizacao-em-lista-e-cards) — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
> - 🔴 Crítico [Acessar listagem com a feature flag desabilitada](tests.md#acessar-listagem-com-a-feature-flag-desabilitada) — O elemento esperado não apareceu na tela (locator: getByRole('tab', { name: 'Modos de uso' })).
> - 🟡 Normal [Ordenar listagem por cada coluna](tests.md#ordenar-listagem-por-cada-coluna) — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
> - 🟡 Normal [Paginação da listagem com volume de painéis](tests.md#paginacao-da-listagem-com-volume-de-paineis) — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
> - 🔴 Crítico [Validar colunas exibidas na visualização em lista](tests.md#validar-colunas-exibidas-na-visualizacao-em-lista) — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 8 | 1 | 7 | 0 | 272.9s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Listagem de painéis** | 8 | `[███✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗]` 1/7/0 | 13% | 7 | 0 | — | 272.9s |

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
