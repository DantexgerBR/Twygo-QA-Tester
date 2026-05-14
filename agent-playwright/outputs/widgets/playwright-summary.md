# Resumo Playwright — Widgets

**Última run** (all-suites) · 14/05/2026, 09:56:39

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 11 | 8 | 3 | 0 | 889.4s |

> **Escopo:** Todas as testsuites (modo padrão)
> **Ambiente:** `staging-widgets` · **Browsers:** chromium

## Resultados

| Status | Testsuite | Caso | Duração | Resumo |
|:---:|---|---|---:|---|
| ✅ | Layout das abas | TC11 · Validar acessibilidade por teclado aba 'Layout' | 85.25s | — |
| ✅ | Layout das abas | TC5 · Ativar switch 'Permitir reorganizar widgets' e mover widget | 82.20s | — |
| ❌ | Layout das abas | TC9 · Cancelar edição com alterações não salvas | 228.76s | Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: getByTestId('panel-layout-cancel-button')). |
| ✅ | Layout das abas | TC7 · Estado vazio da aba sem widgets | 86.47s | — |
| ❌ | Layout das abas | TC8 · Salvar layout pela barra de rodapé | 81.08s | Error: expect(locator).toHaveCount(expected) failed |
| ✅ | Layout das abas | TC6 · Switch desativado: tentar arrastar widget | 60.83s | — |
| ❌ | Layout das abas | TC10 · Toolbar permanece fixa ao rolar a área de layout | 38.80s | TimeoutError: page.goto: Timeout 30000ms exceeded. |
| ✅ | Layout das abas | TC3 · Trocar visualização para Mobile (360) e validar alerta | 63.12s | — |
| ✅ | Layout das abas | TC2 · Trocar visualização para Tablet (768) e validar alerta | 65.00s | — |
| ✅ | Layout das abas | TC1 · Validar barra de ferramentas fixa no topo da área de layout | 55.85s | — |
| ✅ | Layout das abas | TC4 · Voltar para visualização Desktop após Tablet/Mobile | 42.01s | — |

## Onde encontrar mais

- 📋 [Detalhamento desta run](reports/all-suites_20260514-095639/index.md) — KPIs por testsuite, links pra cases e findings exploratórios
- 🔍 [Casos de teste detalhados](reports/all-suites_20260514-095639/tests.md) — passos, evidências, bug-report pronto
- 🐛 [Validação exploratória](reports/all-suites_20260514-095639/exploratory.md) — console errors, axe, HTTP, cobertura
- 📦 Traces de cada falha em `reports/all-suites_20260514-095639/artifacts/` (self-contained) — abrir com `npx playwright show-trace <path>`
