# Resumo Playwright — Widgets

**Última run** (per-suite) · 14/05/2026, 11:09:59

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 11 | 10 | 1 | 0 | 847.5s |

> **Escopo:** Apenas testsuite contendo "Layout das abas"
> **Ambiente:** `staging-widgets` · **Browsers:** chromium

## Resultados

| Status | Testsuite | Caso | Duração | Resumo |
|:---:|---|---|---:|---|
| ✅ | Layout das abas | TC11 · Validar acessibilidade por teclado aba 'Layout' | 81.68s | — |
| ✅ | Layout das abas | TC5 · Ativar switch 'Permitir reorganizar widgets' e mover widget | 83.33s | — |
| ✅ | Layout das abas | TC9 · Cancelar edição com alterações não salvas | 90.24s | — |
| ✅ | Layout das abas | TC7 · Estado vazio da aba sem widgets | 80.65s | — |
| ❌ | Layout das abas | TC8 · Salvar layout pela barra de rodapé | 84.35s | Error: expect(locator).toHaveCount(expected) failed |
| ✅ | Layout das abas | TC6 · Switch desativado: tentar arrastar widget | 67.36s | — |
| ✅ | Layout das abas | TC10 · Toolbar permanece fixa ao rolar a área de layout | 108.76s | — |
| ✅ | Layout das abas | TC3 · Trocar visualização para Mobile (360) e validar alerta | 79.31s | — |
| ✅ | Layout das abas | TC2 · Trocar visualização para Tablet (768) e validar alerta | 49.25s | — |
| ✅ | Layout das abas | TC1 · Validar barra de ferramentas fixa no topo da área de layout | 67.95s | — |
| ✅ | Layout das abas | TC4 · Voltar para visualização Desktop após Tablet/Mobile | 54.61s | — |

## Onde encontrar mais

- 📋 [Detalhamento desta run](reports/layout-das-abas_20260514-110959/index.md) — KPIs por testsuite, links pra cases e findings exploratórios
- 🔍 [Casos de teste detalhados](reports/layout-das-abas_20260514-110959/tests.md) — passos, evidências, bug-report pronto
- 🐛 [Validação exploratória](reports/layout-das-abas_20260514-110959/exploratory.md) — console errors, axe, HTTP, cobertura
- 📦 Traces de cada falha em `reports/layout-das-abas_20260514-110959/artifacts/` (self-contained) — abrir com `npx playwright show-trace <path>`
