# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 13/05/2026, 23:45:24

> **Escopo:** Apenas testsuite contendo "Importar abas"

> ❌ **6 caso(s) com falha precisam de atenção (3 críticos)**
>
> -  [Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres](tests.md#auto-preencher-nome-da-nova-aba-com-nome-original-e-validar-limite-de-255-caracteres) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('[data-test-id="panel-layout-save-button"]')).
> - ⚪ Menor [TC11 · Editar aba importada](tests.md#editar-aba-importada) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('[data-test-id="panel-layout-save-button"]')).
> - 🔴 Crítico [TC6 · Importar aba (happy path)](tests.md#importar-aba-happy-path) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('[data-test-id="panel-layout-save-button"]')).
> - 🟡 Normal [TC5 · Selecionar Categoria na importação](tests.md#selecionar-categoria-na-importacao) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('[data-test-id="panel-layout-save-button"]')).
> - 🔴 Crítico [TC2 · Selecionar painel de origem e listar abas disponíveis](tests.md#selecionar-painel-de-origem-e-listar-abas-disponiveis) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('[data-test-id="panel-layout-save-button"]')).
> - 🔴 Crítico [TC3 · Visualizar preview da aba selecionada](tests.md#visualizar-preview-da-aba-selecionada) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('[data-test-id="panel-layout-save-button"]')).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 11 | 4 | 6 | 1 | 336.9s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Importar abas** | 11 | `[███████✗✗✗✗✗✗✗✗✗✗✗⊘⊘]` 4/6/1 | 36% | 6 | 1 | — | 336.9s |

## Bug Reports prontos pra task

_6 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **6** modal-nao-tratado

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres](bug-reports/importar-abas__auto-preencher-nome-da-nova-aba-com-nome-original-e-validar-limite-de-255-caracteres.md) | 🪟 modal-nao-tratado | alta | baixa | Click interceptado — overlay/modal por cima do alvo |
| [TC11 · Editar aba importada](bug-reports/importar-abas__editar-aba-importada.md) | 🪟 modal-nao-tratado | alta | baixa | Click interceptado — overlay/modal por cima do alvo |
| [TC6 · Importar aba (happy path)](bug-reports/importar-abas__importar-aba-happy-path.md) | 🪟 modal-nao-tratado | alta | baixa | Click interceptado — overlay/modal por cima do alvo |
| [TC5 · Selecionar Categoria na importação](bug-reports/importar-abas__selecionar-categoria-na-importacao.md) | 🪟 modal-nao-tratado | alta | baixa | Click interceptado — overlay/modal por cima do alvo |
| [TC2 · Selecionar painel de origem e listar abas disponíveis](bug-reports/importar-abas__selecionar-painel-de-origem-e-listar-abas-disponiveis.md) | 🪟 modal-nao-tratado | alta | baixa | Click interceptado — overlay/modal por cima do alvo |
| [TC3 · Visualizar preview da aba selecionada](bug-reports/importar-abas__visualizar-preview-da-aba-selecionada.md) | 🪟 modal-nao-tratado | alta | baixa | Click interceptado — overlay/modal por cima do alvo |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (6)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
