# Adicionar widgets — Plano de Testes

## Application Overview

Testsuite "Adicionar widgets" do módulo Painéis Widgets (Twygo). Cobre 11
testcases relativos ao drawer de seleção de widgets (`widget-selector-drawer`)
e à adição efetiva de widgets ao grid da aba Layouts. Recon ao vivo realizado
em 2026-05-11 no env `staging-widgets` (org 36988).

## Achados de recon (2026-05-11)

**Pré-condição comum**: painel salvo + aba Layouts aberta + clique em
`[data-test-id="widgets-grid-add-button"]` ou
`[data-test-id="widgets-grid-empty-state-add-button"]`.

### Test-IDs do drawer

| data-test-id | Elemento |
|---|---|
| `widget-selector-drawer` | container do drawer |
| `widget-selector-drawer-close` | botão fechar (X) |
| `widget-selector-filter-toggle` | toggle "Filtros" (collapse) |
| `widget-selector-search` | input pesquisar (placeholder "Digite o nome do widget...") |
| `widget-category-group-learning` | group da categoria "Aprendizagem" |
| `widget-catalog-card-activity_summary` | card "Resumo de atividades" |
| `widget-catalog-card-in_progress_contents` | card "Conteúdos em andamento" |
| `widget-catalog-card-ranking` | card "Ranking" |
| `widget-catalog-card-my_certificates` | card "Meus certificados" |
| `widget-catalog-profile-{id}` | span "Usuário" (perfil) |
| `widget-catalog-category-{id}-learning` | span "Aprendizagem" |

### Test-IDs do grid (pós-adição)

| data-test-id | Elemento |
|---|---|
| `widgets-grid-container` | container externo |
| `widgets-grid-add-button` | "Adicionar widget" (header) |
| `widgets-grid-empty-state` | empty state inicial |
| `widgets-grid-empty-state-add-button` | "Adicionar Widget" (empty state) |
| `widgets-grid-viewport` | área renderizada do grid |
| `widgets-grid-view-selector` | desktop/tablet/mobile |
| `widgets-grid-reorganize-switch` | toggle "Permitir reorganizar widgets" |
| `widgets-grid-item-{uuid}` | item adicionado (wrapper react-grid) |
| `widgets-grid-widget-{uuid}-title` | título do widget |
| `widgets-grid-widget-{uuid}-icon` | ícone (data-icon) |
| `widgets-grid-widget-{uuid}-edit-button` | aria-label="Editar widget" |
| `widgets-grid-widget-{uuid}-drag-handle` | handle pra reorder |
| `widgets-grid-widget-{uuid}-container` | wrapper interno |
| `panel-layout-save-button` | "Salvar Layout" (footer) |
| `panel-layout-cancel-button` | "Cancelar" (footer) |
| `tabs-navigation-add-button` | "Adicionar aba" |

### Comportamento confirmado

- Click em `widget-catalog-card-{id}` adiciona o widget e **fecha o drawer
  automaticamente** (não há botão "Adicionar" separado no card).
- Widget adicionado recebe um UUID dinâmico — assertions devem usar
  contagem (`getByTestId(/widgets-grid-item-/).count()`) ou title match.
- Empty state desaparece após o 1º widget.

## Testcases

### TC1 — Abrir drawer de widgets disponíveis (crítico)

- Pré-condição: painel salvo + Layouts aberto.
- Click `widgets-grid-add-button` OU `widgets-grid-empty-state-add-button`.
- Assert: `widget-selector-drawer` visível.

### TC2 — Validar componentes do drawer (crítico)

- Drawer aberto.
- Assert: heading "Widgets disponíveis", `widget-selector-search` visível,
  `widget-selector-filter-toggle` visível, `widget-category-group-learning`
  visível (default expandido).

### TC3 — Validar widgets disponíveis na categoria Aprendizagem (crítico)

- Drawer aberto. Categoria Aprendizagem.
- Assert: 4 cards visíveis (`activity_summary`, `in_progress_contents`,
  `ranking`, `my_certificates`).

### TC4 — Validar informação literal dos widgets (normal)

- Para cada card, asserir título textual e descrição:
  - Resumo de atividades / "Exibe um resumo completo das atividades..."
  - Conteúdos em andamento / "Exibe os conteúdos que o usuário está cursando..."
  - Ranking / "Exibe para o usuário a sua posição do ranking..."
  - Meus certificados / "Exibe todos os certificados que o usuário conquistou..."
  - Profile span "Usuário", category span "Aprendizagem".

### TC5 — Filtrar widgets pelo multi select 'Categorias' (normal)

- Drawer aberto.
- Click em `widget-selector-filter-toggle` (expande Filtros).
- Selecionar "Aprendizagem" no multi-select.
- Assert: lista atualizada (continua exibindo os 4 widgets de Aprendizagem).
- **REVISAR**: comportamento exato do multi-select e seletor a confirmar.

### TC6 — Pesquisar widget pelo nome (normal)

- Drawer aberto.
- `widget-selector-search`.fill("Ranking").
- Assert: só `widget-catalog-card-ranking` visível; demais ocultos.

### TC7-10 — Adicionar widget X (crítico cada)

Template — substitua `{id}` pelo id do widget (activity_summary, in_progress_contents, ranking, my_certificates):

- Drawer aberto → click `widget-catalog-card-{id}`.
- Assert: drawer fecha, `widgets-grid-item-*` count = 1, title visível.
- Salvar Layout (`panel-layout-save-button`).
- Assert: toast/notification de sucesso OU permanência sem erro.

### TC11 — Adicionar múltiplos widgets em sequência (crítico)

- Drawer aberto → adicionar 1º widget (fecha drawer).
- Reabrir drawer → adicionar 2º widget.
- Repetir até 4.
- Assert: `widgets-grid-item-*` count = 4. Cada título distinto visível.
- Salvar Layout.

## POM — métodos a adicionar em PainelFormPage

- `getAddWidgetButton()` → `[data-test-id="widgets-grid-add-button"]`
- `getEmptyStateAddButton()` → `[data-test-id="widgets-grid-empty-state-add-button"]`
- `getWidgetDrawer()` → `[data-test-id="widget-selector-drawer"]`
- `getWidgetDrawerClose()` → `[data-test-id="widget-selector-drawer-close"]`
- `getWidgetSearch()` → `[data-test-id="widget-selector-search"]`
- `getWidgetFilterToggle()` → `[data-test-id="widget-selector-filter-toggle"]`
- `getWidgetCategoryGroup(category)` → `[data-test-id="widget-category-group-{category}"]`
- `getWidgetCard(id)` → `[data-test-id="widget-catalog-card-{id}"]`
- `openWidgetDrawer()` → click add button + wait drawer visible
- `addWidget(id)` → openDrawer + click card + wait drawer hidden
- `getGridItems()` → `[data-test-id^="widgets-grid-item-"]`
- `getSaveLayoutButton()` → atualizar pra usar `[data-test-id="panel-layout-save-button"]` (era getByRole)
