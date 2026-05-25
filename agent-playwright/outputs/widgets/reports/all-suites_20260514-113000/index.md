# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 14/05/2026, 11:30:00

> **Escopo:** Todas as testsuites (modo padrão)

> ✅ **Nenhuma falha registrada** — todos os 11 caso(s) executado(s) foram aprovados.

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 11 | 10 | 0 | 1 | 293.0s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Importar abas** | 11 | `[██████████████████⊘⊘]` 10/0/1 | 91% | 0 | 1 | — | 293.0s |

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
