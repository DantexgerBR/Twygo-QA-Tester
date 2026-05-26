# Relatório de Execução — Twygo QA

**Projeto:** Modelos de conteúdo · **Ambiente:** `staging-base-de-conhecimento` · **Browsers:** chromium · **Gerado em:** 25/05/2026, 11:14:55

> **Escopo:** Regressivo completo (todas as testsuites)

> ❌ **37 caso(s) com falha precisam de atenção (30 críticos)**
>
> - 🔴 Crítico [TC1 · Duplicar modelo com cópia profunda](tests.md#duplicar-modelo-com-copia-profunda) — O elemento esperado não apareceu na tela (locator: locator('[data-test-id="content-models-page"] p.css-1mjnzuf').filter({ hasText: 'Modelo Seed Ativo' }).locator('xpath=ancestor::div[contains(@class, "css-fuvrtk")][1]').first()).
> - 🔴 Crítico [TC3 · Auto-preenchimento ao selecionar tipo "Capa"](tests.md#auto-preenchimento-ao-selecionar-tipo-capa) — O elemento esperado não apareceu na tela (locator: getByText('0 / 500').first()).
> - 🔴 Crítico [TC5 · Carga horária exibe 5 opções literais](tests.md#carga-horaria-exibe-5-opcoes-literais) — O valor obtido não é igual ao esperado. Esperado: ArrayContaining ["Micro", "Curto", "Médio", "Estendido", "Longo"] · Atual: ["Selecione", "Micro (30 segundos a 5 minutos)", "Curto (5 a 15 minutos)", "Médi
... [truncado, 155 chars total].
> - 🔴 Crítico [TC6 · Switch "Incluir questionários" exibe configurações básicas](tests.md#switch-incluir-questionarios-exibe-configuracoes-basicas) — Não foi possível preencher o elemento — ele não ficou disponível em 30s (locator: locator('#play-interest-search')).
> - 🔴 Crítico [TC7 · Switch "Configurações avançadas" exibe campos adicionais](tests.md#switch-configuracoes-avancadas-exibe-campos-adicionais) — Não foi possível preencher o elemento — ele não ficou disponível em 30s (locator: locator('#play-interest-search')).
> - 🔴 Crítico [TC8 · Switch "Incluir prova final"](tests.md#switch-incluir-prova-final) — Não foi possível preencher o elemento — ele não ficou disponível em 30s (locator: locator('#play-interest-search')).
> - 🔴 Crítico [TC1 · Criar modelo com dados válidos](tests.md#criar-modelo-com-dados-validos) — O elemento esperado não apareceu na tela (locator: getByRole('tab', { name: 'Identificação', exact: true })).
> - 🔴 Crítico [TC2 · Badge "Dica" aparece somente na criação](tests.md#badge-dica-aparece-somente-na-criacao) — O elemento esperado não apareceu na tela (locator: getByRole('tab', { name: 'Identificação', exact: true })).
> - …e mais 29 caso(s). Veja [Casos de teste](tests.md).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 78 | 24 | 37 | 17 | 2723.3s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Listagem e Menu de Modelos** | 6 | `[✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗]` 0/6/0 | 0% | 6 | 0 | — | 406.5s |
| **Filtros e Busca - Modelos** | 5 | `[✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗]` 0/5/0 | 0% | 5 | 0 | — | 349.4s |
| **Criação de Modelo - Aba Identificação** | 9 | `[✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗⊘⊘]` 0/8/1 | 0% | 8 | 1 | — | 497.8s |
| **Criação de Modelo - Aba Estilo do Conteúdo** | 2 | `[████████████████████]` 2/0/0 | 100% | 0 | 0 | — | 40.2s |
| **Criação de Modelo - Aba Estrutura do Conteúdo** | 8 | `[██████████✗✗✗✗✗✗✗✗✗✗]` 4/4/0 | 50% | 4 | 0 | — | 223.3s |
| **Criação de Modelo - Aba Imagem** | 3 | `[✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗]` 0/3/0 | 0% | 3 | 0 | — | 129.4s |
| **Criação de Modelo - Aba Áudio** | 4 | `[████████████████████]` 4/0/0 | 100% | 0 | 0 | — | 78.9s |
| **Criação de Design de Página** | 11 | `[█████████████✗✗⊘⊘⊘⊘⊘]` 7/1/3 | 64% | 1 | 3 | — | 291.2s |
| **Criação de Design de Aula** | 6 | `[███████⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 2/0/4 | 33% | 0 | 4 | — | 52.7s |
| **Listagem de Designs (aba Design do Modelo)** | 4 | `[✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗]` 0/4/0 | 0% | 4 | 0 | — | 175.1s |
| **Ações Duplicar e Drag and Drop** | 4 | `[███████████████✗✗✗✗✗]` 3/1/0 | 75% | 1 | 0 | — | 95.9s |
| **Preview de Modelos e Designs** | 5 | `[✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗]` 0/5/0 | 0% | 5 | 0 | — | 332.8s |
| **Sincronização e Regeração de Previews** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Bloqueio Exclusão Cores Kit de Marca** | 2 | `[████████████████████]` 2/0/0 | 100% | 0 | 0 | — | 50.0s |
| **Feature flag modelos_de_conteudo** | 3 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/3 | 0% | 0 | 3 | — | 0.0s |
| **Ambientes adicionais - Modelos** | 2 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/2 | 0% | 0 | 2 | — | 0.0s |

## Bug Reports prontos pra task

_37 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **25** inconclusivo · **12** spec-fragil

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC1 · Duplicar modelo com cópia profunda](bug-reports/acoes-duplicar-e-drag-and-drop__duplicar-modelo-com-copia-profunda.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC3 · Auto-preenchimento ao selecionar tipo "Capa"](bug-reports/criacao-de-design-de-pagina__auto-preenchimento-ao-selecionar-tipo-capa.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC5 · Carga horária exibe 5 opções literais](bug-reports/criacao-de-modelo-aba-estrutura-do-conteudo__carga-horaria-exibe-5-opcoes-literais.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC6 · Switch "Incluir questionários" exibe configurações básicas](bug-reports/criacao-de-modelo-aba-estrutura-do-conteudo__switch-incluir-questionarios-exibe-configuracoes-basicas.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC7 · Switch "Configurações avançadas" exibe campos adicionais](bug-reports/criacao-de-modelo-aba-estrutura-do-conteudo__switch-configuracoes-avancadas-exibe-campos-adicionais.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC8 · Switch "Incluir prova final"](bug-reports/criacao-de-modelo-aba-estrutura-do-conteudo__switch-incluir-prova-final.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC1 · Criar modelo com dados válidos](bug-reports/criacao-de-modelo-aba-identificacao__criar-modelo-com-dados-validos.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC2 · Badge "Dica" aparece somente na criação](bug-reports/criacao-de-modelo-aba-identificacao__badge-dica-aparece-somente-na-criacao.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC3 · Badge "Dica" NÃO aparece na edição](bug-reports/criacao-de-modelo-aba-identificacao__badge-dica-nao-aparece-na-edicao.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC4 · Validações negativas do campo Nome (matriz A-D)](bug-reports/criacao-de-modelo-aba-identificacao__validacoes-negativas-do-campo-nome-matriz-a-d.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC5 · Validações negativas do campo Descrição (matriz B-D)](bug-reports/criacao-de-modelo-aba-identificacao__validacoes-negativas-do-campo-descricao-matriz-b-d.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC6 · Switch "Usar designs sugeridos" exibido somente na criação](bug-reports/criacao-de-modelo-aba-identificacao__switch-usar-designs-sugeridos-exibido-somente-na-criacao.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC7 · Defaults dos switches na criação](bug-reports/criacao-de-modelo-aba-identificacao__defaults-dos-switches-na-criacao.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC9 · Validação do campo Kit de marca obrigatório (matriz A)](bug-reports/criacao-de-modelo-aba-identificacao__validacao-do-campo-kit-de-marca-obrigatorio-matriz-a.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC1 · Aba Imagem exibe título e subtítulo literais](bug-reports/criacao-de-modelo-aba-imagem__aba-imagem-exibe-titulo-e-subtitulo-literais.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC2 · Opções de padrão de imagem disponíveis](bug-reports/criacao-de-modelo-aba-imagem__opcoes-de-padrao-de-imagem-disponiveis.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC3 · Default "Sem imagens, somente textos"](bug-reports/criacao-de-modelo-aba-imagem__default-sem-imagens-somente-textos.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC1 · Buscar modelo por nome](bug-reports/filtros-e-busca-modelos__buscar-modelo-por-nome.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC2 · Filtrar modelos por Situação via drawer](bug-reports/filtros-e-busca-modelos__filtrar-modelos-por-situacao-via-drawer.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [Aplicar filtro padrão Modelos próprios](bug-reports/filtros-e-busca-modelos__aplicar-filtro-padrao-modelos-proprios.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC4 · Limpar filtros aplicados](bug-reports/filtros-e-busca-modelos__limpar-filtros-aplicados.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC5 · Combinação de filtros + busca textual](bug-reports/filtros-e-busca-modelos__combinacao-de-filtros-busca-textual.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [Listagem exibe elementos obrigatórios por design](bug-reports/listagem-de-designs-aba-design-do-modelo__listagem-exibe-elementos-obrigatorios-por-design.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC2 · Ações da listagem de designs](bug-reports/listagem-de-designs-aba-design-do-modelo__acoes-da-listagem-de-designs.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC3 · Filtrar designs por Tipo (Aula/Página)](bug-reports/listagem-de-designs-aba-design-do-modelo__filtrar-designs-por-tipo-aula-pagina.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC4 · Combinação de filtros + busca textual na listagem de designs](bug-reports/listagem-de-designs-aba-design-do-modelo__combinacao-de-filtros-busca-textual-na-listagem-de-designs.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC1 · Acessar listagem via submenu Aprendizagem](bug-reports/listagem-e-menu-de-modelos__acessar-listagem-via-submenu-aprendizagem.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC2 · Visualização padrão em Cards](bug-reports/listagem-e-menu-de-modelos__visualizacao-padrao-em-cards.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC3 · Alternância entre visualização Cards e Lista](bug-reports/listagem-e-menu-de-modelos__alternancia-entre-visualizacao-cards-e-lista.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC4 · Coluna Descrição truncada com tooltip completo (visão Lista)](bug-reports/listagem-e-menu-de-modelos__coluna-descricao-truncada-com-tooltip-completo-visao-lista.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC5 · Botão Adicionar redireciona para criação](bug-reports/listagem-e-menu-de-modelos__botao-adicionar-redireciona-para-criacao.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC6 · Indicador de cor lateral reflete status ativo/inativo no card](bug-reports/listagem-e-menu-de-modelos__indicador-de-cor-lateral-reflete-status-ativo-inativo-no-card.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC1 · Abrir Preview de Modelo via card](bug-reports/preview-de-modelos-e-designs__abrir-preview-de-modelo-via-card.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC2 · Conteúdo de cada item do carrossel](bug-reports/preview-de-modelos-e-designs__conteudo-de-cada-item-do-carrossel.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC3 · Navegar entre slides no carrossel](bug-reports/preview-de-modelos-e-designs__navegar-entre-slides-no-carrossel.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC4 · Preview de Design tipo Página tem zoom com scroll](bug-reports/preview-de-modelos-e-designs__preview-de-design-tipo-pagina-tem-zoom-com-scroll.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC5 · Preview falha graciosamente quando imagem do design não carrega](bug-reports/preview-de-modelos-e-designs__preview-falha-graciosamente-quando-imagem-do-design-nao-carrega.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (37)
- 📊 [Allure (regressivo, com trend histórico)](../../allure-report/index.html) — relatório executivo HTML built-in do Allure

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
