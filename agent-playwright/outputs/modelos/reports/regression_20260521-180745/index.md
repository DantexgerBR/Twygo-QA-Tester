# Relatório de Execução — Twygo QA

**Projeto:** Modelos de conteúdo · **Ambiente:** `staging-base-de-conhecimento` · **Browsers:** chromium · **Gerado em:** 21/05/2026, 18:07:46

> **Escopo:** Regressivo completo (todas as testsuites)

> ❌ **8 caso(s) com falha precisam de atenção (8 críticos)**
>
> - 🔴 Crítico [TC1 · Duplicar modelo com cópia profunda](tests.md#duplicar-modelo-com-copia-profunda) — O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: 'duplicado com sucesso' }).first()).
> - 🔴 Crítico [TC1 · Botão "Adicionar mais dados" exibe menu com 6 opções](tests.md#botao-adicionar-mais-dados-exibe-menu-com-6-opcoes) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('[data-test-id="content-models-style-add-more-data-button"]')).
> - 🔴 Crítico [TC2 · Adicionar campo Idade via menu](tests.md#adicionar-campo-idade-via-menu) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('[data-test-id="content-models-style-add-more-data-button"]')).
> - 🔴 Crítico [TC4 · Carga horária obrigatória bloqueia salvamento](tests.md#carga-horaria-obrigatoria-bloqueia-salvamento) — Error: expect(locator).toHaveCount(expected) failed
> - 🔴 Crítico [TC6 · Switch "Incluir questionários" exibe configurações básicas](tests.md#switch-incluir-questionarios-exibe-configuracoes-basicas) — O elemento esperado não apareceu na tela (locator: getByText('Configurações avançadas', { exact: true })).
> - 🔴 Crítico [TC3 · Default "Sem imagens, somente textos"](tests.md#default-sem-imagens-somente-textos) — Error: expect(received).toBe(expected) // Object.is equality
> - 🔴 Crítico [TC2 · Filtrar modelos por Situação via drawer](tests.md#filtrar-modelos-por-situacao-via-drawer) — Error: esperava ao menos 1 cards, encontrei 0
> - 🔴 Crítico [TC2 · Conteúdo de cada item do carrossel](tests.md#conteudo-de-cada-item-do-carrossel) — O elemento esperado não apareceu na tela (locator: locator('[data-test-id="content-models-preview-modal-image"]')).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 67 | 48 | 8 | 11 | 1014.3s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Listagem e Menu de Modelos** | 6 | `[████████████████████]` 6/0/0 | 100% | 0 | 0 | — | 86.6s |
| **Filtros e Busca - Modelos** | 4 | `[███████████████✗✗✗✗✗]` 3/1/0 | 75% | 1 | 0 | — | 41.2s |
| **Criação de Modelo - Aba Identificação** | 8 | `[██████████████████⊘⊘]` 7/0/1 | 88% | 0 | 1 | — | 72.9s |
| **Criação de Modelo - Aba Estilo do Conteúdo** | 2 | `[✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗]` 0/2/0 | 0% | 2 | 0 | — | 90.1s |
| **Criação de Modelo - Aba Estrutura do Conteúdo** | 8 | `[███████████████✗✗✗✗✗]` 6/2/0 | 75% | 2 | 0 | — | 127.6s |
| **Criação de Modelo - Aba Imagem** | 3 | `[█████████████✗✗✗✗✗✗✗]` 2/1/0 | 67% | 1 | 0 | — | 42.8s |
| **Criação de Modelo - Aba Áudio** | 4 | `[████████████████████]` 4/0/0 | 100% | 0 | 0 | — | 57.7s |
| **Criação de Design de Página** | 7 | `[████████████████████]` 7/0/0 | 100% | 0 | 0 | — | 184.7s |
| **Criação de Design de Aula** | 4 | `[██████████⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 2/0/2 | 50% | 0 | 2 | — | 51.9s |
| **Listagem de Designs (aba Design do Modelo)** | 3 | `[████████████████████]` 3/0/0 | 100% | 0 | 0 | — | 45.8s |
| **Ações Duplicar e Drag and Drop** | 4 | `[███████████████✗✗✗✗✗]` 3/1/0 | 75% | 1 | 0 | — | 97.0s |
| **Preview de Modelos e Designs** | 4 | `[███████████████✗✗✗✗✗]` 3/1/0 | 75% | 1 | 0 | — | 64.6s |
| **Sincronização e Regeração de Previews** | 3 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/3 | 0% | 0 | 3 | — | 0.0s |
| **Bloqueio Exclusão Cores Kit de Marca** | 2 | `[████████████████████]` 2/0/0 | 100% | 0 | 0 | — | 51.2s |
| **Feature flag modelos_de_conteudo** | 3 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/3 | 0% | 0 | 3 | — | 0.0s |
| **Ambientes adicionais - Modelos** | 2 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/2 | 0% | 0 | 2 | — | 0.0s |

## Bug Reports prontos pra task

_8 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **4** inconclusivo · **4** spec-fragil

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC1 · Duplicar modelo com cópia profunda](bug-reports/acoes-duplicar-e-drag-and-drop__duplicar-modelo-com-copia-profunda.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC1 · Botão "Adicionar mais dados" exibe menu com 6 opções](bug-reports/criacao-de-modelo-aba-estilo-do-conteudo__botao-adicionar-mais-dados-exibe-menu-com-6-opcoes.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC2 · Adicionar campo Idade via menu](bug-reports/criacao-de-modelo-aba-estilo-do-conteudo__adicionar-campo-idade-via-menu.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC4 · Carga horária obrigatória bloqueia salvamento](bug-reports/criacao-de-modelo-aba-estrutura-do-conteudo__carga-horaria-obrigatoria-bloqueia-salvamento.md) | 🧪 spec-fragil | alta | baixa | Locator bate em N elementos — seletor não-único |
| [TC6 · Switch "Incluir questionários" exibe configurações básicas](bug-reports/criacao-de-modelo-aba-estrutura-do-conteudo__switch-incluir-questionarios-exibe-configuracoes-basicas.md) | 🧪 spec-fragil | alta | baixa | Locator bate em N elementos — seletor não-único |
| [TC3 · Default "Sem imagens, somente textos"](bug-reports/criacao-de-modelo-aba-imagem__default-sem-imagens-somente-textos.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC2 · Filtrar modelos por Situação via drawer](bug-reports/filtros-e-busca-modelos__filtrar-modelos-por-situacao-via-drawer.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC2 · Conteúdo de cada item do carrossel](bug-reports/preview-de-modelos-e-designs__conteudo-de-cada-item-do-carrossel.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (8)
- 📊 [Allure (regressivo, com trend histórico)](../../allure-report/index.html) — relatório executivo HTML built-in do Allure

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
