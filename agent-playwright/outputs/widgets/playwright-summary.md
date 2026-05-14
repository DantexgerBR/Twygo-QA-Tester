# Resumo Playwright — Widgets

**Última run** (per-suite) · 14/05/2026, 13:08:56

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 3 | 2 | 0 | 1 | 58.7s |

> **Escopo:** Apenas testsuite contendo "Modo de uso - Painéis do usuário"
> **Ambiente:** `staging-widgets` · **Browsers:** chromium

## Resultados

| Status | Testsuite | Caso | Duração | Resumo |
|:---:|---|---|---:|---|
| ✅ | Modo de uso - Painéis do usuário | TC2 · Listar painéis disponíveis no campo 'Espaço' | 19.50s | — |
| ⊘ | Modo de uso - Painéis do usuário | TC3 · Não permitir reabilitar menu inativado quando 'Espaço' do 'Painel do usuário' inativo | 1.13s | Marcado para revisão (test.fixme): seed ausente: TC depende de painel inativo COM menu vinculado, mas o backend dispara 500 (title_for#NoMethodError em GET /panels/{id}/linked_menus) impedindo PATCH /change_status. Bug bloqueia ensureInactive() apenas em sessão automatizada (user 'Claude Agents'); manual passa. Ver bug_title_for_linked_menus.md. |
| ✅ | Modo de uso - Painéis do usuário | TC1 · Selecionar 'Painéis do usuário' como modelo de página no modo de uso | 38.11s | — |

## Onde encontrar mais

- 📋 [Detalhamento desta run](reports/modo-de-uso-paineis-do-usuario_20260514-130856/index.md) — KPIs por testsuite, links pra cases e findings exploratórios
- 🔍 [Casos de teste detalhados](reports/modo-de-uso-paineis-do-usuario_20260514-130856/tests.md) — passos, evidências, bug-report pronto
- 🐛 [Validação exploratória](reports/modo-de-uso-paineis-do-usuario_20260514-130856/exploratory.md) — console errors, axe, HTTP, cobertura
- 📦 Traces de cada falha em `reports/modo-de-uso-paineis-do-usuario_20260514-130856/artifacts/` (self-contained) — abrir com `npx playwright show-trace <path>`
