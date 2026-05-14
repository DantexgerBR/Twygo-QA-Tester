# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 14/05/2026, 08:25:31

> **Escopo:** Apenas testsuite contendo "Importar abas"

> ❌ **4 caso(s) com falha precisam de atenção (1 crítico)**
>
> -  [Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres](tests.md#auto-preencher-nome-da-nova-aba-com-nome-original-e-validar-limite-de-255-caracteres) — O elemento esperado não apareceu na tela (locator: getByTestId('import-tab-modal-tab-name-input').getByPlaceholder('Digite o nome da aba')).
> - ⚪ Menor [TC11 · Editar aba importada](tests.md#editar-aba-importada) — Não foi possível preencher o elemento — ele não ficou disponível em 30s (locator: getByTestId('import-tab-modal-tab-name-input').getByPlaceholder('Digite o nome da aba')).
> - 🟡 Normal [TC5 · Selecionar Categoria na importação](tests.md#selecionar-categoria-na-importacao) — O elemento esperado não apareceu na tela (locator: getByRole('dialog').filter({ hasText: 'Adicionar nova aba' }).getByRole('combobox')).
> - 🔴 Crítico [TC3 · Visualizar preview da aba selecionada](tests.md#visualizar-preview-da-aba-selecionada) — O elemento esperado não apareceu na tela (locator: getByRole('dialog').filter({ hasText: 'Adicionar nova aba' }).getByText('Aba X', { exact: true })).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 11 | 6 | 4 | 1 | 324.4s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Importar abas** | 11 | `[███████████✗✗✗✗✗✗✗⊘⊘]` 6/4/1 | 55% | 4 | 1 | — | 324.4s |

## Bug Reports prontos pra task

_4 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **1** inconclusivo · **3** spec-fragil

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres](bug-reports/importar-abas__auto-preencher-nome-da-nova-aba-com-nome-original-e-validar-limite-de-255-caracteres.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC11 · Editar aba importada](bug-reports/importar-abas__editar-aba-importada.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC5 · Selecionar Categoria na importação](bug-reports/importar-abas__selecionar-categoria-na-importacao.md) | 🧪 spec-fragil | alta | baixa | Locator bate em N elementos — seletor não-único |
| [TC3 · Visualizar preview da aba selecionada](bug-reports/importar-abas__visualizar-preview-da-aba-selecionada.md) | 🧪 spec-fragil | alta | baixa | Locator bate em N elementos — seletor não-único |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (4)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
