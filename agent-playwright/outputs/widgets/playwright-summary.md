# Resumo Playwright — Widgets

**Última run** (per-suite) · 11/05/2026, 15:35:12

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 5 | 3 | 0 | 2 | 44.6s |

> **Escopo:** Apenas testsuite contendo "Ativar / Inativar painel"
> **Ambiente:** `staging-widgets` · **Browsers:** chromium

## Resultados

| Status | Testsuite | Caso | Duração | Resumo |
|:---:|---|---|---:|---|
| ✅ | Ativar / Inativar painel | Ativar um painel previamente inativo | 9.34s | — |
| ⊘ | Ativar / Inativar painel | Tentar inativar painel associado a modos de uso exibe modal de bloqueio | 0.00s | Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). |
| ✅ | Ativar / Inativar painel | Inativar um painel não associado a nenhum modo de uso | 13.91s | — |
| ✅ | Ativar / Inativar painel | Verificar persistência do estado Ativo após reload | 20.87s | — |
| ⊘ | Ativar / Inativar painel | Tentar reativar menu de modo de uso vinculado a painel inativo exibe modal | 0.48s | Marcado para revisão (test.fixme): requer (1) "Painel QA Teste" inativo + (2) menu de modo de uso vinculado a esse painel (campo "Modelo de página") e inativo. Cenário não reproduzível no seed atual (sem Painel QA Teste; menus seedados não têm vínculo conhecido com painéis inativos). Selectors do modal e da row do menu específico a confirmar live quando seed existir. |

## Onde encontrar mais

- 📋 [Detalhamento desta run](reports/ativar-inativar-painel_20260511-153512/index.md) — KPIs por testsuite, links pra cases e findings exploratórios
- 🔍 [Casos de teste detalhados](reports/ativar-inativar-painel_20260511-153512/tests.md) — passos, evidências, bug-report pronto
- 🐛 [Validação exploratória](reports/ativar-inativar-painel_20260511-153512/exploratory.md) — console errors, axe, HTTP, cobertura
- 📦 Traces de cada falha em `test-artifacts/` — abrir com `npx playwright show-trace <path>`
