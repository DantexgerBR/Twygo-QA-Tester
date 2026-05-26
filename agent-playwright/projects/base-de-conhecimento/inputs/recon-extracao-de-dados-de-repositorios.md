# Reconnaissance — Extração de dados de repositórios

> Snapshot do DOM da área desta testsuite, capturado em **2026-05-24T17:39:00Z**
> (refresh do recon original de 2026-05-19 após auditoria via chrome-devtools-mcp).
> Planners DEVEM consumir este arquivo + a prosa do XML, e PULAR exploração ao vivo.

## Histórico

- **2026-05-19**: recon inicial concluiu "botão Exportar não existe + Categoria
  não existe no drawer". Specs marcados `test.fixme` (BLOCKED-BY-PRODUCT).
- **2026-05-24**: re-auditoria confirmou que **ambos bloqueios foram entregues**.
  Botão "Extrair dados" (não "Exportar") apareceu, e o filtro Categoria é
  acessível via modo "Novo" do drawer. Fixmes removidos. Spec TC2 ainda
  falha legitimamente por bug Rails 500 do `filter_cache_key=quick_filter:*`
  (mesma causa raiz do TC2 dos Filtros — NÃO corrigido até 24/05).

## Testcases desta testsuite (do XML)

1. **Exportar listagem completa** (importance: crítico, 3 steps)
2. **Exportação respeita filtros aplicados** (importance: normal, 3 steps)

---

# URL 1: `/o/36602/knowledge_repositories`

- Após carregamento: `https://stage10.stage.twygoead.com/o/36602/knowledge_repositories`
- Org: 36602 (alinhado com `staging-base-de-conhecimento` em
  `config/environment.json`)
- Page title: "Éver" (truncado — provavelmente "Éverton Gambeta - Stage 10")
- Sync alert: não · Modal aberto: não (recon antigo capturou modal — mas
  era do globalSetup, não persistente)

## Botões de toolbar (ordem visual da esquerda pra direita)

| Posição | Botão | ID | Notas |
|---|---|---|---|
| 1 | `+ Adicionar` (link) | — | Redireciona `/knowledge_repositories/new` |
| 2 | `Extrair dados` | `#data-export-button` | **NOVO 2026-05-24**. Ícone Material `ios_share`. Abre modal "Configurações da extração" |
| 3 | Busca | placeholder `Pesquise por nome ou descrição` | textbox |
| 4 | `Filtro` | `#open-filter` | **Mudança 2026-05-24**: `data-test-id="filter-control-open-button"` foi removido — POM atualizado pra usar `#open-filter` |

## Modal "Configurações da extração" (novo)

Abre após click em `#data-export-button`. Padrão Chakra dialog `role="dialog"`
com header "Configurações da extração". Três grupos de radios obrigatórios:

| Grupo | Radios (id estável) |
|---|---|
| **Formato** | `#radio-exportFormat-csv` (default checked) · `#radio-exportFormat-pdf` |
| **Dados (linhas)** | `#radio-data-filtro_atual` · `#radio-data-todos` |
| **Colunas** | `#radio-columns-filtro_atual` · `#radio-columns-todas` |

Botões finais: `Cancelar` / `Extrair`.

Sem todos os radios marcados, click em `Extrair` resulta em validation messages
"Dados (linhas) é obrigatório e não pode ficar vazio" e "Colunas é obrigatório
e não pode ficar vazio" — modal não fecha e nenhum download dispara.

## Drawer de filtros (`#open-filter` → drawer Chakra slide-in)

**Filtros padrão** (modo A do drawer, radios):

- `Bases sem fontes` (`info` icon + `content_copy` icon)
- `Bases sem recursos` (`info` icon + `content_copy` icon)

**Meus filtros** (custom criados pelo usuário) — vide chave `select-category-filter`
do POM.

**Modo B do drawer** (criado via texto "Novo"):
- Header muda para "Filtro rápido"
- Accordion "Colunas para filtrar" com `Opções de filtro` (menu Chakra)
  expondo as 8 colunas filtráveis:

  **Nome · Descrição · Categoria · Classificação · Fontes de conhecimento ·
  Recursos de mídia · Última atualização · Data de criação**

  Cada checkbox marcada renderiza um `<div id="option_<snake_case>"
  class="basic-multi-select">` (react-select async) dentro do drawer pra
  configurar o valor. Mapas canônicos:
  - Categoria → `#option_category`
  - Classificação → `#option_classification`
  - Nome → `#option_name`
  - Descrição → `#option_description`

- IDs canônicos do drawer:
  - `#list-filter-apply` · `#list-filter-cancel` · `#list-filter-close` (modo A)
  - `#form-filter-apply` · `#form-filter-cancel` · `#form-filter-close` (modo B)
  - `#clear-filter` (botão externo "Limpar filtro", aparece após apply)
  - `#menu-button-plus-options-filters` (botão "Opções de filtro" em modo B)
  - `#accordion-button-expand-columns-filters`

## Bug aberto — backend Rails

Aplicar filtro Categoria via fluxo Novo → backend retorna **HTTP 500** no
GET `/api/v1/o/36602/knowledge_repositories?filter_cache_key=quick_filter:*`
com body `"no implicit conversion of String into Integer"`. Mesma assinatura
desde 2026-05-21 (TC2 dos Filtros). Frontend engole silencioso e mostra a
listagem completa (sem filtro). UI mostra "Limpar filtro" como se filtro
tivesse aplicado.

## Tabela da listagem — colunas

Nome · Descrição · Categoria · Classificação · Fontes de conhecimento ·
Recursos de mídia · Última atualização · Criado por · ações (`edit` / `delete`).

## Test IDs encontrados (data-test-id)

| data-test-id | tag | role | name (aria-label/text) |
|---|---|---|---|
| `knowledge-repositories-list-container` | div |  | container raiz da lista |
| ~~`filter-control-open-button`~~ | — | — | **REMOVIDO** (usar `#open-filter`) |
| `chat-widget-iframe` | iframe |  | HubSpot livechat |

## Roles + accessible names (toolbar e tabela)

| role | name |
|---|---|
| button | `Adicionar` |
| button | `ios_share Extrair dados` |
| textbox | `Pesquise por nome ou descrição` |
| button | `Filtro` |
| button | `Limpar filtro` (visível só após apply) |
| dialog | `Configurações da extração` |

## Placeholders

- `Pesquise por nome ou descrição` (busca)
- `Buscar repositórios` (campo no modo de criação — fora do escopo desta suite)
