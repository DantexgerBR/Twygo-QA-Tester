# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 13/05/2026, 23:40:17

> **Escopo:** Apenas testsuite contendo "Importar abas"

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
| 11 | 0 | 10 | 1 | 411.8s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Importar abas** | 11 | `[✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗⊘⊘]` 0/10/1 | 0% | 10 | 1 | — | 411.8s |

## Bug Reports prontos pra task

_10 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **1** inconclusivo · **9** spec-fragil

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC1 · Acessar o fluxo de Importar de outro painel](bug-reports/importar-abas__acessar-o-fluxo-de-importar-de-outro-painel.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres](bug-reports/importar-abas__auto-preencher-nome-da-nova-aba-com-nome-original-e-validar-limite-de-255-caracteres.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC8 · Cancelar importação](bug-reports/importar-abas__cancelar-importacao.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC11 · Editar aba importada](bug-reports/importar-abas__editar-aba-importada.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC6 · Importar aba (happy path)](bug-reports/importar-abas__importar-aba-happy-path.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC5 · Selecionar Categoria na importação](bug-reports/importar-abas__selecionar-categoria-na-importacao.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC2 · Selecionar painel de origem e listar abas disponíveis](bug-reports/importar-abas__selecionar-painel-de-origem-e-listar-abas-disponiveis.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC9 · Tentar importar sem selecionar painel de origem](bug-reports/importar-abas__tentar-importar-sem-selecionar-painel-de-origem.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC3 · Visualizar preview da aba selecionada](bug-reports/importar-abas__visualizar-preview-da-aba-selecionada.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC7 · Voltar do step de importação para a seleção de tipo](bug-reports/importar-abas__voltar-do-step-de-importacao-para-a-selecao-de-tipo.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (10)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
