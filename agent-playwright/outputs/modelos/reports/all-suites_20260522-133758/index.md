# Relatório de Execução — Twygo QA

**Projeto:** Modelos de conteúdo · **Ambiente:** `staging-base-de-conhecimento` · **Browsers:** chromium · **Gerado em:** 22/05/2026, 13:37:59

> **Escopo:** Todas as testsuites (modo padrão)

> ❌ **7 caso(s) com falha precisam de atenção (5 críticos)**
>
> - 🔴 Crítico [TC1 · Duplicar modelo com cópia profunda](tests.md#duplicar-modelo-com-copia-profunda) — O elemento esperado não apareceu na tela (locator: getByRole('heading', { name: 'Modelos de conteúdo' })).
> -  [Drag and drop reorder designs](tests.md#drag-and-drop-reorder-designs) — TimeoutError: locator.dragTo: Timeout 30000ms exceeded.
> - 🔴 Crítico [TC2 · Salvar Aula com dados válidos](tests.md#salvar-aula-com-dados-validos) — A URL não bateu com a esperada (esperada: not /template_designs\/new/) — atual: "https://basedeconhecimento.stage.twygoead.com/o/37007/content_models/7/template_designs/new?kind=lesson".
> - 🔴 Crítico [TC7 · Salvar Página retorna para aba Design do Modelo](tests.md#salvar-pagina-retorna-para-aba-design-do-modelo) — O elemento esperado não apareceu na tela (locator: getByText('Design TC7 w4-1779451715441', { exact: true }).first()).
> - 🔴 Crítico [TC3 · Default "Sem imagens, somente textos"](tests.md#default-sem-imagens-somente-textos) — Condição esperada não foi atendida: esperava verdadeiro (true), mas obteve falso (false).
> - 🟡 Normal [TC4 · Coluna Descrição truncada com tooltip completo (visão Lista)](tests.md#coluna-descricao-truncada-com-tooltip-completo-visao-lista) — O elemento esperado não apareceu na tela (locator: locator('[role="tooltip"]')).
> - 🔴 Crítico [TC2 · Conteúdo de cada item do carrossel](tests.md#conteudo-de-cada-item-do-carrossel) — O elemento esperado não apareceu na tela (locator: locator('[data-test-id="content-models-preview-modal-image"]')).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 67 | 49 | 7 | 11 | 1471.2s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Listagem e Menu de Modelos** | 6 | `[█████████████████✗✗✗]` 5/1/0 | 83% | 1 | 0 | — | 113.7s |
| **Filtros e Busca - Modelos** | 4 | `[████████████████████]` 4/0/0 | 100% | 0 | 0 | — | 71.1s |
| **Criação de Modelo - Aba Identificação** | 8 | `[██████████████████⊘⊘]` 7/0/1 | 88% | 0 | 1 | — | 117.5s |
| **Criação de Modelo - Aba Estilo do Conteúdo** | 2 | `[████████████████████]` 2/0/0 | 100% | 0 | 0 | — | 45.4s |
| **Criação de Modelo - Aba Estrutura do Conteúdo** | 8 | `[████████████████████]` 8/0/0 | 100% | 0 | 0 | — | 199.7s |
| **Criação de Modelo - Aba Imagem** | 3 | `[█████████████✗✗✗✗✗✗✗]` 2/1/0 | 67% | 1 | 0 | — | 72.3s |
| **Criação de Modelo - Aba Áudio** | 4 | `[████████████████████]` 4/0/0 | 100% | 0 | 0 | — | 89.8s |
| **Criação de Design de Página** | 7 | `[█████████████████✗✗✗]` 6/1/0 | 86% | 1 | 0 | — | 255.5s |
| **Criação de Design de Aula** | 4 | `[█████✗✗✗✗✗⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 1/1/2 | 25% | 1 | 2 | — | 92.4s |
| **Listagem de Designs (aba Design do Modelo)** | 3 | `[████████████████████]` 3/0/0 | 100% | 0 | 0 | — | 78.5s |
| **Ações Duplicar e Drag and Drop** | 4 | `[██████████✗✗✗✗✗✗✗✗✗✗]` 2/2/0 | 50% | 2 | 0 | — | 208.3s |
| **Preview de Modelos e Designs** | 4 | `[███████████████✗✗✗✗✗]` 3/1/0 | 75% | 1 | 0 | — | 75.7s |
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
| [Carga horária obrigatória bloqueia salvamento](bug-reports/criacao-de-modelo-aba-estrutura-do-conteudo__carga-horaria-obrigatoria-bloqueia-salvamento.md) | 🧪 spec-fragil | alta | baixa | Locator bate em N elementos — seletor não-único |
| [TC6 · Switch "Incluir questionários" exibe configurações básicas](bug-reports/criacao-de-modelo-aba-estrutura-do-conteudo__switch-incluir-questionarios-exibe-configuracoes-basicas.md) | 🧪 spec-fragil | alta | baixa | Locator bate em N elementos — seletor não-único |
| [TC3 · Default "Sem imagens, somente textos"](bug-reports/criacao-de-modelo-aba-imagem__default-sem-imagens-somente-textos.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC2 · Filtrar modelos por Situação via drawer](bug-reports/filtros-e-busca-modelos__filtrar-modelos-por-situacao-via-drawer.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC2 · Conteúdo de cada item do carrossel](bug-reports/preview-de-modelos-e-designs__conteudo-de-cada-item-do-carrossel.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (8)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
