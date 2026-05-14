# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 13/05/2026, 23:18:12

> **Escopo:** Apenas testsuite contendo "Editar/Excluir widgets"

> ❌ **4 caso(s) com falha precisam de atenção (2 críticos)**
>
> - 🔴 Crítico [TC1 · Drawer de configurações ao 'Editar' Widget](tests.md#drawer-de-configuracoes-ao-editar-widget) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('[data-test-id="widgets-grid-empty-state-add-button"]')).
> - ⚪ Menor [TC4 · Limite de 255 caracteres no campo 'Título' do drawer](tests.md#limite-de-255-caracteres-no-campo-titulo-do-drawer) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('[data-test-id="widgets-grid-empty-state-add-button"]')).
> - 🔴 Crítico [TC2 · Salvar alterações no drawer de configurações do widget](tests.md#salvar-alteracoes-no-drawer-de-configuracoes-do-widget) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('[data-test-id="widgets-grid-empty-state-add-button"]')).
> - 🟡 Normal [TC6 · Switches 'Mostrar título' e 'Mostrar ícone' desligados](tests.md#switches-mostrar-titulo-e-mostrar-icone-desligados) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('[data-test-id="widgets-grid-empty-state-add-button"]')).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 6 | 2 | 4 | 0 | 222.6s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Editar/Excluir widgets** | 6 | `[███████✗✗✗✗✗✗✗✗✗✗✗✗✗]` 2/4/0 | 33% | 4 | 0 | — | 222.6s |

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
