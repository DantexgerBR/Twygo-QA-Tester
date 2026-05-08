# Resumo Playwright — Widgets

**Última run** (per-suite) · 08/05/2026, 15:27:04

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 8 | 4 | 4 | 0 | 199.0s |

> **Escopo:** Apenas testsuite contendo "Listagem de painéis"
> **Ambiente:** `staging-widgets` · **Browsers:** chromium

## Resultados

| Status | Testsuite | Caso | Duração | Resumo |
|:---:|---|---|---:|---|
| ❌ | Listagem de painéis | Acessar a listagem de Painéis a partir do Menu | 41.50s | Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('#menu a[name="settings-main-menu"]')). |
| ❌ | Listagem de painéis | Validar acessibilidade por teclado (TAB / setas / ENTER / ESC) | 52.03s | TimeoutError: locator.waitFor: Timeout 30000ms exceeded. |
| ❌ | Listagem de painéis | Alternar entre visualização em lista e cards | 42.57s | TimeoutError: locator.waitFor: Timeout 30000ms exceeded. |
| ❌ | Listagem de painéis | Acessar listagem com a feature flag desabilitada | 22.11s | O elemento esperado não apareceu na tela (locator: getByRole('tab', { name: 'Modos de uso' })). |
| ✅ | Listagem de painéis | Ordenar listagem por cada coluna | 12.41s | — |
| ✅ | Listagem de painéis | Paginação da listagem com volume de painéis | 9.35s | — |
| ✅ | Listagem de painéis | Validar colunas exibidas na visualização em lista | 9.43s | — |
| ✅ | Listagem de painéis | Validar componentes obrigatórios da listagem de painéis | 9.64s | — |

## Onde encontrar mais

- 📋 [Detalhamento desta run](reports/listagem-de-paineis_20260508-152704/index.md) — KPIs por testsuite, links pra cases e findings exploratórios
- 🔍 [Casos de teste detalhados](reports/listagem-de-paineis_20260508-152704/tests.md) — passos, evidências, bug-report pronto
- 🐛 [Validação exploratória](reports/listagem-de-paineis_20260508-152704/exploratory.md) — console errors, axe, HTTP, cobertura
- 📦 Traces de cada falha em `test-artifacts/` — abrir com `npx playwright show-trace <path>`
