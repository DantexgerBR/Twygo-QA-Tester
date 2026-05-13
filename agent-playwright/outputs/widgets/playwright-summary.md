# Resumo Playwright — Widgets

**Última run** (per-suite) · 12/05/2026, 22:11:50

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 5 | 0 | 4 | 1 | 43.6s |

> **Escopo:** Apenas testsuite contendo "Ativar / Inativar painel"
> **Ambiente:** `staging-widgets` · **Browsers:** chromium

## Resultados

| Status | Testsuite | Caso | Duração | Resumo |
|:---:|---|---|---:|---|
| ❌ | Ativar / Inativar painel | Ativar um painel previamente inativo | 0.00s | Error: aguardando toggle ou modal após click no switch de "Painel Ativar TC2 w0-1778634638418" |
| ❌ | Ativar / Inativar painel | Inativar um painel não associado a nenhum modo de uso | 12.78s | Error: aguardando toggle ou modal após click no switch de "Painel Inativar TC1 w1-1778634638397" |
| ❌ | Ativar / Inativar painel | Tentar inativar painel associado a um ou mais modos de uso | 18.32s | O elemento esperado não apareceu na tela (locator: locator('.chakra-modal__content').filter({ has: locator('[data-test-id="panel-in-use-modal-confirm"]') })). |
| ⊘ | Ativar / Inativar painel | Tentar reativar modo de uso vinculado a um painel inativo | 0.62s | Marcado para revisão (test.fixme): Bloqueado por bug env-específico no staging-widgets (org 36988): GET /panels/{id}/linked_menus retorna 500 (NoMethodError em use_mode_item.rb#title_for, mesma raiz do TC3) APENAS na sessão automatizada como user "Claude Agents", causando PATCH /panels/{id}/change_status → 422 e falha em ensureInactive() do seed. Fluxo manual passa no mesmo env via Jam: jam.dev/c/89dc08fe-9048-4701-a018-9b34c1ddcc80. Infra do spec (POM helpers, beforeAll completo, asserção #toast-inactive-panel) está pronta — quando o backend fixar title_for, remover este fixme destrava o teste sem mais mudanças. |
| ❌ | Ativar / Inativar painel | Verificar persistência do estado Ativo após reload | 11.92s | Error: aguardando toggle ou modal após click no switch de "Painel Persistencia TC5 w4-1778634665234" |

## Onde encontrar mais

- 📋 [Detalhamento desta run](reports/ativar-inativar-painel_20260512-221150/index.md) — KPIs por testsuite, links pra cases e findings exploratórios
- 🔍 [Casos de teste detalhados](reports/ativar-inativar-painel_20260512-221150/tests.md) — passos, evidências, bug-report pronto
- 🐛 [Validação exploratória](reports/ativar-inativar-painel_20260512-221150/exploratory.md) — console errors, axe, HTTP, cobertura
- 📦 Traces de cada falha em `reports/ativar-inativar-painel_20260512-221150/artifacts/` (self-contained) — abrir com `npx playwright show-trace <path>`
