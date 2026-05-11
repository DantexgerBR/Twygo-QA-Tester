# Resumo Playwright — Widgets

**Última run** (per-suite) · 11/05/2026, 17:43:19

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 5 | 3 | 1 | 1 | 60.1s |

> **Escopo:** Apenas testsuite contendo "Ativar / Inativar painel"
> **Ambiente:** `staging-widgets` · **Browsers:** chromium

## Resultados

| Status | Testsuite | Caso | Duração | Resumo |
|:---:|---|---|---:|---|
| ✅ | Ativar / Inativar painel | Ativar um painel previamente inativo | 10.02s | — |
| ❌ | Ativar / Inativar painel | Tentar inativar painel associado a modos de uso exibe modal de bloqueio | 19.41s | O elemento esperado não apareceu na tela (locator: locator('.chakra-modal__content').filter({ has: locator('[data-test-id="panel-in-use-modal-confirm"]') })). |
| ✅ | Ativar / Inativar painel | Inativar um painel não associado a nenhum modo de uso | 14.70s | — |
| ✅ | Ativar / Inativar painel | Verificar persistência do estado Ativo após reload | 15.46s | — |
| ⊘ | Ativar / Inativar painel | Tentar reativar menu de modo de uso vinculado a painel inativo exibe modal | 0.50s | Marcado para revisão (test.fixme): requer (1) "Painel QA Teste" inativo + (2) menu de modo de uso vinculado a esse painel (campo "Modelo de página") e inativo. Cenário não reproduzível no seed atual (sem Painel QA Teste; menus seedados não têm vínculo conhecido com painéis inativos). Selectors do modal e da row do menu específico a confirmar live quando seed existir. |

## Onde encontrar mais

- 📋 [Detalhamento desta run](reports/ativar-inativar-painel_20260511-174319/index.md) — KPIs por testsuite, links pra cases e findings exploratórios
- 🔍 [Casos de teste detalhados](reports/ativar-inativar-painel_20260511-174319/tests.md) — passos, evidências, bug-report pronto
- 🐛 [Validação exploratória](reports/ativar-inativar-painel_20260511-174319/exploratory.md) — console errors, axe, HTTP, cobertura
- 📦 Traces de cada falha em `test-artifacts/` — abrir com `npx playwright show-trace <path>`
