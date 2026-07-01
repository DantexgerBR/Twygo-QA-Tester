# Recon — Filtros via drawer e personalização de colunas (DnD)

> Suíte AT: "Filtros via drawer e personalização de colunas (DnD)" (TC1–TC10).
> Tela: Admin **Aprendizagem > Registros** — `/o/{orgId}/records` (org principal 37079,
> env `staging-registros-externos`, `https://registrosf2.stage.twygoead.com/`).
> Recon ao vivo 2026-06-23 via Playwright (3 passadas). Drawer é o componente
> compartilhado Twygo (`#open-filter` / `#form-filter-*`) — mesmo da suíte widgets
> "Pesquisa e Filtros", ver skill `testar-filtro-drawer-twygo`.

## ⚠️ Divergências AT × produto (build atual) — IMPACTO ALTO

1. **Filtros padrão NÃO existem neste build.** Os 3 grupos do drawer
   ("Filtros padrão", "Filtros compartilhados", "Meus filtros") exibem TODOS
   o empty state literal **"Não há filtros nessa seção."** — `radioCount = 0`.
   A AT (TC1–TC5, TC10) assume 4 radios "Válidos/Expirados/Pendentes/Recusados"
   com ícone de info + botão duplicar. **Ausentes.** Logo:
   - TC1: só a abertura do drawer + estados do botão são exercíveis; aplicar
     filtro padrão é impossível.
   - TC2: header/busca/Novo/3 grupos/footer existem; os 4 radios + duplicar +
     toast "Em breve" no duplicar **não existem**; copy do empty state diverge
     ("Não há filtros nessa seção." ≠ "Em breve — filtros criados pela equipe…").
   - TC3 (busca filtra a lista de filtros) — **bloqueado** (sem filtros).
   - TC4 (pending do radio aplicar/cancelar/ressincronizar) — **bloqueado**.
   - TC5 (sync KPI ↔ radio do drawer, Aluno) — **bloqueado** (lado do drawer ausente).
   - TC10: parte "aplicar filtro padrão Válidos" bloqueada; coluna + busca ok.
   → Destinatário do sinal: **AT / QA Lead** (feature de filtros salvos/padrão
     não entregue no BETA). Categoria fixme legítima (UI/feature × AT).

2. **"+ Opções de filtro" abre menu de colunas funcional, não toast "Em breve".**
   AT TC6 passo 3 espera toast "Em breve". Na verdade `#menu-button-plus-options-filters`
   abre `#menu-list-plus-options-filters` com 18 colunas filtráveis (Pessoa,
   Conteúdo, Origem, … Data de validade). Filtro avançado por coluna ESTÁ
   implementado. → Divergência de expectativa.

3. **Customização de colunas PERSISTE após reload.** AT TC9 passo 4 espera
   "Tabela volta às colunas default (customização não persistida entre sessões)".
   Recon: desmarquei "Provedor" + Aplicar → recarreguei a página → coluna
   "Provedor" continuou ausente. A personalização persiste (localStorage por
   usuário). → Divergência. Implica que specs que mexem em colunas devem
   **restaurar o default** ao final (preferência reversível de UI — exceção à
   regra "sem cleanup" deste projeto, que vale para registros/seed, não p/ prefs).

## Seletores canônicos (validados)

### Botão e estado
- Abrir drawer: `#open-filter` · testid `filter-control-open-button` (texto "Filtro",
  ícone `filter_alt`). Variante outline class `css-it72td`.
- Limpar filtro: `#clear-filter` · testid `filter-control-clear-button`. Aparece
  após Aplicar (filtro OU customização de coluna). Some ao limpar.
- Estado ativo: ao aplicar, o `#open-filter` troca de classe (outline `css-it72td`
  → sólida `css-1py8e62`) e `#clear-filter` passa a existir. (O sufixo "(N)" da AT
  não foi observado como texto; o sinal confiável é o par classe-sólida +
  `#clear-filter` visível.)

### Drawer — Modo A "Lista de filtros"
- `[role="dialog"].chakra-modal__content.chakra-slide`
- `#list-filter-title` ("Lista de filtros") · `#list-filter-close` (X)
- `#icon-search-filter` (input "Pesquise aqui" — busca de filtros salvos)
- `#list-filter-new` (botão "Novo" → vai p/ Modo B)
- Accordions: `#expand-default-filters` ("Filtros padrão", aberto por default),
  `#expand-shared-filters` ("Filtros compartilhados"), `#expand-my-filters` ("Meus filtros")
  — **todos vazios** ("Não há filtros nessa seção.")
- Footer: `#list-filter-cancel` ("Cancelar") · `#list-filter-apply` ("Aplicar")

### Drawer — Modo B "Filtro rápido"
- `#form-filter-title` ("Filtro rápido") · `#form-filter-close` (X)
- `#form-filter-list-button` (link/botão "Lista de filtros" → volta p/ Modo A)
- Accordions:
  - `#accordion-button-expand-columns-filters` ("Colunas para filtrar")
    - `#menu-button-plus-options-filters` ("+ Opções de filtro") → `#menu-list-plus-options-filters`
  - `#accordion-button-expand-columns-show` ("Colunas para exibir")
  - `#accordion-button-expand-submit-filter` ("Salvar filtro") → `#filter_name` (nome),
    `#is_shared_in_organization` ("Compartilhar com o ambiente"), `#save_filter_list`
- Footer: `#form-filter-cancel` · `#form-filter-apply`

### "Colunas para exibir" — checkboxes `#show-<key>` + DnD
Cada linha: `<div draggable="true" role="button" data-rbd-draggable-id="<key>"
data-rbd-drag-handle-draggable-id="<key>">` (react-beautiful-dnd; ícone `reorder`).
A linha INTEIRA é o drag handle. **DnD confiável = teclado**: focar o handle →
`Space` (levanta) → `ArrowUp`/`ArrowDown` (move 1 posição) → `Space` (solta).

Mapa key → label → default (visível na tabela):

| `#show-` key | Label | Default |
|---|---|---|
| person | Pessoa | ON |
| content | Conteúdo | ON |
| origin | Origem | ON |
| created_by | Criado por | ON |
| learning_experience | Experiência | ON |
| provider | Provedor | ON |
| website | Website | ON |
| evidences | Evidências | ON |
| workload_seconds | Carga horária | ON |
| situation | Situação | ON |
| certificate_situation | Situação do certificado | ON |
| progress_score | Progresso | OFF |
| final_score | Desempenho | OFF |
| content_value | Valor do conteúdo | OFF |
| start_date | Data de início | OFF |
| end_date | Data de término | OFF |
| approved_at | Data de aprovação | OFF |
| certificate_date | Data do certificado | OFF |
| expiration_date | Data de validade | OFF |

> Nota: o default visível diverge do que a AT (suíte "Listagem Admin", TC2) lista
> como default — produto inclui Experiência/Website/Evidências e exclui Progresso.
> Para ESTA suíte importa o comportamento de toggle/DnD, não o conjunto default.

Headers da tabela (default, ordem): ⃞(checkbox), Pessoa, Conteúdo, Origem,
Criado por, Experiência, Provedor, Website, Evidências, Carga horária, Situação,
Situação do certificado, ⋯(ações). Checkbox de seleção 1ª; ações última (fixas).

## Implicações para os specs
- TC7: AT manda "marcar Website" mas Website já é default-ON. Adaptar: desmarcar
  Provedor (ON) + marcar Progresso (OFF→ON) e validar reflexo na tabela.
- TC8: arrastar "Carga horária" para antes de "Origem" via DnD de teclado.
- TC9: reabrir drawer cai em Modo A ✓; "Novo" reseta a view de edição ✓; passo
  de reload→default **falha** (persiste) — reportar como divergência, não forçar.
- Restaurar colunas default em `afterAll` das specs que customizam (pref reversível).
- Sessão concorrente clobbera outputs/sessão neste projeto → rodar isolado.
