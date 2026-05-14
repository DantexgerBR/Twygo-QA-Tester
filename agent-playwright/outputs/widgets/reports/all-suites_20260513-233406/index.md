# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 13/05/2026, 23:34:06

> **Escopo:** Todas as testsuites (modo padrão)

> ❌ **10 caso(s) com falha precisam de atenção (4 críticos)**
>
> - 🔴 Crítico [TC1 · Acessar o fluxo de Importar de outro painel](tests.md#acessar-o-fluxo-de-importar-de-outro-painel) — O elemento esperado não apareceu na tela (locator: getByTestId('tabs-navigation-add-button')).
> -  [Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres](tests.md#auto-preencher-nome-da-nova-aba-com-nome-original-e-validar-limite-de-255-caracteres) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: getByTestId('tabs-navigation-add-button')).
> - 🟡 Normal [TC8 · Cancelar importação](tests.md#cancelar-importacao) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: getByTestId('tabs-navigation-add-button')).
> - ⚪ Menor [TC11 · Editar aba importada](tests.md#editar-aba-importada) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: getByTestId('tabs-navigation-add-button')).
> - 🔴 Crítico [TC6 · Importar aba (happy path)](tests.md#importar-aba-happy-path) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: getByTestId('tabs-navigation-add-button')).
> - 🟡 Normal [TC5 · Selecionar Categoria na importação](tests.md#selecionar-categoria-na-importacao) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: getByTestId('tabs-navigation-add-button')).
> - 🔴 Crítico [TC2 · Selecionar painel de origem e listar abas disponíveis](tests.md#selecionar-painel-de-origem-e-listar-abas-disponiveis) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: getByTestId('tabs-navigation-add-button')).
> - 🟡 Normal [TC9 · Tentar importar sem selecionar painel de origem](tests.md#tentar-importar-sem-selecionar-painel-de-origem) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: getByTestId('tabs-navigation-add-button')).
> - …e mais 2 caso(s). Veja [Casos de teste](tests.md).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 11 | 0 | 10 | 1 | 419.1s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Importar abas** | 11 | `[✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗⊘⊘]` 0/10/1 | 0% | 10 | 1 | — | 419.1s |

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
