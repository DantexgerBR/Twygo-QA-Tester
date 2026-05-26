# Plan — Pesquisa e Filtros (Twygo Widgets)

> Generated 2026-05-11 by claude orchestrator. Planner subagent oficial não
> foi invocado nesta sessão porque o MCP `playwright-test` não respeitou
> `process.env.PROJECT` — ver skill **`debugar-mcp-playwright-env`** para
> diagnóstico/workaround. Plano construído via exploração direta com
> Playwright Node API + `recon-pesquisa-e-filtros.md` + análise do drawer
> documentada em **`testar-filtro-drawer-twygo`**.

## Status do contrato e dados

- Org **36988** (env `staging-widgets`) — feature `habilitar_paineis_do_usuario`
  liberada (mesma org usada pela suíte Listagem de painéis, já validada).
- ~30 painéis seedados na listagem (todos ativos por default; painéis
  6..30 têm descrição "Descrição Painel N").
- "Filtros padrão" disponíveis na UI: **Painéis ativos** e **Painéis inativos**.

## Mudança de escopo (2026-05-11)

O time decidiu **NÃO implementar compartilhamento de painéis nesta versão**.
Portanto os 3 testcases do XML que dependem dessa funcionalidade foram
**excluídos** do agente (e não serão executados):

| TC removido | Motivo |
|---|---|
| Aplicar filtro padrão 'Painéis próprios' | Filtro depende do conceito de "próprio vs compartilhado" — não implementado |
| Aplicar filtro padrão 'Painéis compartilhados' | Mesmo motivo |
| Filtrar pela coluna 'Provedora' | Coluna Provedora só faz sentido com compartilhamento (origem do painel) — não implementada |

XML/TestLink original mantém os 3 cenários (regra dura #6: `inputs/` é
imutável, fonte única de verdade). Quando o feature for retomado, basta
recriar os specs — o XML já cobre.

## Estrutura do drawer de filtro (explorada live 2026-05-11)

Botão `#open-filter` (ícone `filter_alt`) abre um drawer Chakra
(`<div role="dialog" class="chakra-slide chakra-modal__content">`). O drawer
opera em **dois modos** dependendo do estado:

### Modo A — "Lista de filtros" (sem filtro aplicado ou modo lista explícito)

Mostrado na entrada quando o usuário **não tem filtro saved aplicado**.
Estrutura:

- `#list-filter-close` — Close
- `#icon-search-filter` — search de filtros saved
- Accordion **Filtros padrão** (`accordion-button-:r157:`, expandido por default):
  - `label "Painéis ativos"` + `#default-filters-0` (radio input)
    - botões irmãos: `#default-filters-0-icon_info`, `#default-filters-0-icon_copy`
  - `label "Painéis inativos"` + `#default-filters-1`
- Accordion **Filtros compartilhados** (collapsed)
- Accordion **Meus filtros** (collapsed)
- Botão `#list-filter-cancel` — Cancelar
- Botão `#list-filter-apply` — Aplicar

Aplicação de filtro padrão: clicar no label/radio + clicar em `#list-filter-apply`.

### Modo B — "Edição de filtro" (após aplicar um filtro padrão OU clicar em "Novo")

Estrutura:

- `#form-filter-close` — Close
- `p#form-filter-title` — Nome do filtro corrente (ex.: "Painéis ativos")
- Toggle `#form-filter-list-button` — abre dropdown de presets (`Lista de filtros`)
- `form`:
  - Accordion **Colunas para filtrar** (`#accordion-button-expand-columns-filters`):
    - cada coluna selecionada vira um `<div>` com label da coluna + input/checkboxes
    - Ex.: coluna `Ativo?` → 2 checkboxes (`#option_is_active-true` Sim, `#option_is_active-false` Não)
  - Menu **Opções de filtro** (`#menu-button-plus-options-filters`) — onde se
    adicionam novas colunas ao filtro
  - Accordion **Colunas para exibir** (`#accordion-button-expand-columns-show`)
  - Accordion **Salvar filtro** (`#accordion-button-expand-submit-filter`)
- Botão `#form-filter-cancel` — Cancelar
- Botão `#form-filter-apply` — Aplicar

Botão **`#clear-filter`** (fora do drawer, na barra superior) só aparece
quando há um filtro aplicado.

## Search input

- ID estável `#play-interest-search` — placeholder
  `"Pesquise por nome ou descrição"`.
- Comportamento: filtragem client-side por debounce (~300ms). Filtra
  considerando **nome OU descrição**.

## Testcases — mapeamento

10 specs implementados; 3 TCs do XML excluídos (ver §"Mudança de escopo").

| # | XML name | Slug arquivo | Status |
|---|---|---|---|
| 1 | Pesquisar painel pelo nome | `pesquisar-painel-nome.spec.ts` | READY |
| 2 | Pesquisar painel pela descrição | `pesquisar-painel-descricao.spec.ts` | READY (busca server-side em nome OU descrição) |
| 3 | Aplicar filtro padrão 'Painéis próprios' | — | **EXCLUÍDO** (out-of-scope) |
| 4 | Aplicar filtro padrão 'Painéis compartilhados' | — | **EXCLUÍDO** (out-of-scope) |
| 5 | Aplicar filtro padrão 'Painéis ativos' | `filtro-padrao-paineis-ativos.spec.ts` | READY |
| 6 | Aplicar filtro padrão 'Painéis inativos' | `filtro-padrao-paineis-inativos.spec.ts` | READY (com setup: toggle 1 inativo + revert) |
| 7 | Filtrar pela coluna 'Nome' | `filtrar-coluna-nome.spec.ts` | READY (react-select `#option_name`) |
| 8 | Filtrar pela coluna 'Descrição' | `filtrar-coluna-descricao.spec.ts` | READY (`input#option_description`) |
| 9 | Filtrar pela coluna 'Provedora' | — | **EXCLUÍDO** (out-of-scope) |
| 10 | Filtrar pela coluna 'Data de criação' | `filtrar-coluna-data-criacao.spec.ts` | READY (date inputs `#option_created_at-from/-to`) |
| 11 | Filtrar pela coluna 'Ativo' | `filtrar-coluna-ativo.spec.ts` | READY |
| 12 | Pesquisar termo inexistente | `pesquisar-termo-inexistente.spec.ts` | READY |
| 13 | Combinar pesquisa e filtros padrão | `combinar-pesquisa-filtros.spec.ts` | READY |

## Fluxo correto "Novo > Adicionar coluna" (descoberto 2026-05-11)

O caminho que NÃO funcionava na primeira passada (combinar preset "Painéis
ativos" + Opções de filtro + click em `[role=menuitem]`) tem 2 erros
sutis. Caminho correto:

1. **Limpar filtro residual** se houver — começa em modo A.
2. **Click no botão "Novo"** dentro do drawer modo A (eu havia missed esse
   botão na primeira exploração porque o texto "Novo" vinha junto com
   ícone `add` numa única string).
3. Drawer transita para **modo B com `#form-filter-title` = "Filtro rápido"**
   e accordion vazio.
4. Click `#menu-button-plus-options-filters` → menu abre com 4 checkboxes
   (Nome, Descrição, Data de criação, Ativo?).
5. **Click na `<label class="chakra-checkbox">` do menuitem desejado, NÃO
   no `<button role="menuitem">`**. O button intercepta o click e não
   propaga para o checkbox interno; já a label aciona a semântica nativa.
6. Escape para fechar o menu (Chakra Menu mantém aberto por design para
   multi-select).
7. Preencher input específico da coluna:
   - **Nome**: react-select multi → click `#option_name`, fill no
     `input[id^="react-select-"][id$="-input"]` interno, click na
     `[id^="react-select-"][id*="-option-0"]` primeira opção.
   - **Descrição**: `input#option_description` (text simples).
   - **Data de criação**: `#option_created_at-from` (de), opcional
     `#option_created_at-to` (até). Formato ISO YYYY-MM-DD.
   - **Ativo?**: `#option_is_active-true/-false` (click na label irmã).
8. `#form-filter-apply` → drawer fecha + `#clear-filter` aparece.

## Extensões necessárias em PaineisListPage

Novos métodos adicionados nesta passada:

- `openFilterDrawer()` — clica `#open-filter`, aguarda drawer `role="dialog"`.
- `closeFilterDrawer()` — clica close button (qualquer dos dois modos).
- `getSearchInput()` (já existe) + `searchPanels(query)` — fill + debounce.
- `clearSearch()` — fill com `''` e aguarda re-renderização.
- `applyDefaultFilter(name: 'Painéis ativos' | 'Painéis inativos')` — open drawer
  + select radio + click Aplicar + aguardar fechar.
- `clearFilter()` — clica `#clear-filter` (fora do drawer).
- `getFilterTitle()` — text de `#form-filter-title` (modo B).
- `applyColumnFilter(opts)` — open drawer modo edit + escolhe coluna via
  "Opções de filtro" + preenche valor + Aplicar. Suporta `Nome`, `Data de criação`, `Ativo` (Sim/Não).
- `getEmptyStateNoResults()` — `getByText('Nenhum resultado encontrado')`.
- `getFirstPanelName()` — retorna nome do primeiro painel visível (helper p/ TC1/TC7).

## Pré-condições / setup (afterAll)

- **TC6 (Painéis inativos)**: Setup deve garantir que existe ≥1 painel inativo.
  Strategy: pegar primeiro painel, salvar nome, `toggleActiveByName` → inativar,
  rodar filtro, depois reverter no `afterAll`.
- **TC11 (filtro coluna Ativo)**: mesmo cenário — se não houver painel inativo
  na org, o "Não" produz lista vazia. Pulamos a parte específica de assertar
  contagem e validamos apenas que o filtro aplica (UI muda).
- **TC13 (combinar)**: usa filtro "Painéis ativos" + search por substring do
  primeiro painel.
