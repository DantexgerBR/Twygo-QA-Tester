# Modo de uso - Painéis do usuário — Plano de Testes

## Application Overview

Plano de testes para a testsuite "Modo de uso - Painéis do usuário" do módulo Painéis Widgets (Twygo). Cobre 3 testcases relativos à área Configurações > Menu > Modos de uso: (1) selecionar o modelo "Painéis do usuário" e vincular um painel ao criar/editar um item de menu; (2) validar que o dropdown "Espaço" lista apenas painéis ativos; (3) validar bloqueio ao tentar reabilitar menu inativado cujo painel vinculado está inativo. Exploração realizada com base em recon live de 2026-05-12 (recon-ativar-inativar-painel.md) + POM PaineisListPage.ts (validado com fluxo manual Jam 2026-05-12) no env staging-widgets (org 36988, https://widgets.stage.twygoead.com).

CONTEXTO CRÍTICO — BUG BLOQUEANTE TC3 (bug_title_for_linked_menus.md + feedback_orphan_pollution_panels.md):
O seed do TC3 exige inativar painel que tem menu vinculado. Em sessão automatizada como user "Claude Agents", GET /panels/{id}/linked_menus retorna 500 (NoMethodError em title_for) impedindo PATCH /panels/{id}/change_status → 422. Fluxo manual no mesmo env passa (Jam: jam.dev/c/89dc08fe-9048-4701-a018-9b34c1ddcc80). O spec deve ser marcado como fixme com justificativa (seed ausente — bug de backend bloqueia ensureInactive() no automático). Toda a infra de POM já existe em PaineisListPage.ts.

CONTEXTO ROTA "MODOS DE USO":
- Aba "Modos de uso" na URL: /o/{orgId}/use_modes?tab=list-tab (confirmado via goToModosDeUso() no POM)
- Aba "Painéis" na URL: /o/{orgId}/use_modes?tab=panels-tab
- Editor de modo de uso (sub-tabs Identificação / Menu / Acesso / Feriados): /o/{orgId}/use_modes/{useModeId}/edit?tab=items
- Form de novo item de menu: /o/{orgId}/use_modes/{useModeId}/use_mode_itens/new
- IDs dos modos de uso da org 36988: 70077 (Colaborador), 70078 (Aluno)

SELETORES CONFIRMADOS VIA POM E RECON (recon-ativar-inativar-painel.md + PaineisListPage.ts):
- Aba "Modos de uso" (tab da área /use_modes): getByRole('tab', { name: 'Modos de uso' })
- Aba "Menu" (sub-tab do editor): getByRole('tab', { name: 'Menu' }) OU button role "Menu"
- Campo Nome do item: #title (placeholder "Nome do menu", maxLength=25 — backend TRUNCA)
- Campo Modelo de página: #page_model (select, option value="user_panels" = "Painéis do usuário")
- Campo Espaço (react-select): container #panel; input input[id^="react-select-"][id$="-input"].first()
- Opções do react-select: [id^="react-select-"][id$="-option-{idx}"].first()
- Botão Salvar do form: #use-model-submit
- Switch ativo do item de menu: input[type="checkbox"] dentro de getMenuItemRowByName(name)
- Label do switch: label.chakra-switch dentro da row (click no label, não no input — input tem clip 1×1px)
- Toast de bloqueio ao tentar reativar: #toast-inactive-panel (id estável, confirmado via Jam 2026-05-12)
- Modal "Modelo de página duplicado" (ao criar 2º item user_panels no mesmo modo): [id^="duplicated-page-"].filter(hasText: /^salvar$/i)
- Botão "Adicionar" da lista de itens: getByRole('button', { name: 'Adicionar' })
- Sidebar link "Menu": page.locator('#menu a#navigation-menu') (precisa expandir "Configurações" primeiro via '#menu a[name="settings-main-menu"]')

ANTI-PATTERNS PROIBIDOS (CLAUDE.md §7.6):
- A: Nunca fazer login no spec — storageState já cobre (outputs/.auth/storage.json).
- B: Nunca hardcodar URL/orgId — usar getOrgId() de src/utils/environment.ts; useModeId vai em *.data.ts.
- C: Nunca criar inline helpers de UI dentro do test() — métodos novos vão em PaineisListPage.ts.
- D: Comentários só justificam WHY, nunca WHAT.
- E: Constantes de domínio (useModeId, panelName) em arquivos *.data.ts adjacentes ao spec, nunca inline.
- F: Nunca usar fixme para esconder bug de produto — TC3 usa fixme legítimo por "seed ausente" (bug backend bloqueia ensureInactive() no automático). Quando o backend fixar title_for#NoMethodError, remover fixme destrava o teste.

PADRÃO DE SETUP OBRIGATÓRIO (PaineisListPage.ts — mesmos helpers do suite Ativar/Inativar):
- createPanel(data.panelName) → painel criado ativo, redirect para /panels/{id}/edit
- associatePanelToMenu(panelName, useModeId) → item de menu criado, page_model="user_panels", Espaço=painel
- ensureMenuItemInactive(useModeId, itemName) → switch inativo + PATCH bulk_update persistido + reload verificado
- ensureInactive(panelName) → BLOQUEADO pelo bug title_for (TC3 fixme)
- Cleanup: afterAll chama disassociatePanelFromMenu_safe + deletePanelByNameSafe na ordem correta

## Test Scenarios

### 1. Modo de uso - Painéis do usuário

**Seed:** `tests/seed.spec.ts`

#### 1.1. Selecionar 'Painéis do usuário' como modelo de página no modo de uso

**File:** `projects/widgets/tests/features/modo-de-uso-paineis-do-usuario/selecionar-paineis-usuario-modelo-pagina.spec.ts`

**Steps:**
  1. Pré-condição: garantir que existe ao menos um painel ativo na org. O painel de referência é 'Painel Aluno' (existente no env staging-widgets). Dados no arquivo selecionar-paineis-usuario-modelo-pagina.data.ts: { useModeId: 70077, panelName: 'Painel Aluno' }. Não criar painel novo — usar painel estável do env. Navegar para o form de novo item de menu via page.goto('/o/' + getOrgId() + '/use_modes/' + data.useModeId + '/use_mode_itens/new'). Chamar dismissCommonModals(page) antes de qualquer ação (NPS Sofia intercepta clicks). Aguardar getMenuItemNameInput() estar visível (#title).
    - expect: URL está em /use_modes/{useModeId}/use_mode_itens/new
    - expect: Campo Nome do menu (#title) está visível e editável
    - expect: Campo Modelo de página (#page_model select) está visível
    - expect: Campo Espaço (#panel react-select) NÃO está visível ainda (aparece apenas após selecionar page_model='user_panels')
  2. Preencher o campo Nome do menu (#title) com um nome único gerado em runtime (ex: 'TC1 Modelo ' + Date.now() com prefixo de até 25 chars — backend trunca silenciosamente nomes >25). O dado de nome vai em selecionar-paineis-usuario-modelo-pagina.data.ts como prefixo 'TC1 Modelo' (10 chars, deixando margem para timestamp truncado). Obs: itemName real deve ser gerado dinamicamente no beforeEach ou no início do test com timestamp para isolamento.
    - expect: Campo #title preenchido com texto visível
    - expect: Não há validação de erro ao preencher nome válido
  3. Selecionar a opção 'Painéis do usuário' no campo Modelo de página: page.locator('#page_model').selectOption('user_panels'). Aguardar visibilidade do container react-select #panel (campo Espaço condicional — só renderiza quando page_model='user_panels').
    - expect: Campo #page_model exibe 'Painéis do usuário' como opção selecionada
    - expect: Container #panel (campo 'Espaço') aparece no DOM e está visível (waitFor state: 'visible')
    - expect: Label ou texto 'Espaço' está visível acima do react-select container #panel
    - expect: Nenhum outro campo extra inesperado aparece junto com Espaço
  4. Clicar no container react-select #panel para abrir o dropdown. Digitar o início do nome do painel no input input[id^='react-select-'][id$='-input'].first() para filtrar (ex: 'Painel Aluno'). Clicar na primeira opção disponível [id^='react-select-'][id$='-option-0'].first(). Confirmar a seleção no campo Espaço. Clicar em #use-model-submit para salvar. Aguardar redirect para /use_modes/{useModeId}/edit?tab=items (ou tratar modal 'Modelo de página duplicado' via [id^='duplicated-page-'].filter({hasText:/^salvar$/i}) antes do redirect).
    - expect: Opção 'Painel Aluno' fica selecionada e visível no react-select (texto aparece no container #panel)
    - expect: Click em Salvar (#use-model-submit) dispara POST para /use_modes/{useModeId}/use_mode_itens
    - expect: Redirect para /use_modes/{useModeId}/edit?tab=items após salvar
    - expect: Item de menu criado aparece na tabela da aba Menu com o nome fornecido (truncado em 25 chars)
    - expect: Item de menu mostra 'Painéis do usuário' como modelo na coluna correspondente
    - expect: Cleanup: afterEach chama disassociatePanelFromMenu_safe(panelName, useModeId, itemName) para remover o item criado pelo TC

#### 1.2. Listar painéis disponíveis no campo 'Espaço'

**File:** `projects/widgets/tests/features/modo-de-uso-paineis-do-usuario/listar-paineis-campo-espaco.spec.ts`

**Steps:**
  1. Pré-condição: confirmar que o env staging-widgets (org 36988) tem painéis ATIVOS e INATIVOS cadastrados. Não criar novos painéis no setup — a org já tem >25 painéis (confirmado via recon-ativar-inativar-painel.md: IDs como 802869, 802868, ... em quantidade suficiente). Dados em listar-paineis-campo-espaco.data.ts: { useModeId: 70077, knownActivePanelName: 'Painel Aluno' }. Navegar para o form de novo item via page.goto('/o/' + getOrgId() + '/use_modes/' + data.useModeId + '/use_mode_itens/new'). Chamar dismissCommonModals(page) antes de qualquer ação.
    - expect: URL está em /use_modes/{useModeId}/use_mode_itens/new
    - expect: Campo #page_model (Modelo de página) está visível
    - expect: Campo #panel (Espaço) NÃO está visível (condicional)
  2. Selecionar 'Painéis do usuário' no campo Modelo de página: page.locator('#page_model').selectOption('user_panels'). Aguardar container #panel aparecer (waitFor state: 'visible').
    - expect: Container #panel (campo Espaço) está visível após selecionar 'Painéis do usuário'
    - expect: Campo Espaço exibe placeholder ou estado vazio (nenhuma opção pré-selecionada)
  3. Clicar no container react-select #panel para abrir o dropdown. Aguardar que as opções sejam renderizadas ([id^='react-select-'][id$='-option-0'].first() waitFor visible). Capturar todos os textos das opções visíveis usando page.locator('[id^="react-select-"][id$="-option-"]').allTextContents().
    - expect: Dropdown abre e exibe lista de painéis disponíveis
    - expect: Pelo menos uma opção visível no dropdown (a org tem painéis ativos)
    - expect: Painel de referência 'Painel Aluno' aparece como opção na lista (confirma que painéis ativos são listados)
    - expect: NENHUM painel com status inativo aparece na lista (validação negativa crítica: o campo Espaço só lista painéis ativos — RN88)
    - expect: Não há opção '(vazio)' ou placeholder fake na lista de opções reais
    - expect: // NOTA: para validar ausência de painéis inativos de forma precisa, o spec deve first chamar paineis.goToList() + setViewMode('lista') e capturar nomes dos painéis com switch desmarcado (inativos), DEPOIS navegar ao form e abrir o dropdown — comparando as duas listas. Caso a lista de inativos seja longa, usar abordagem alternativa: verificar que pelo menos 1 painel conhecido inativo não aparece no dropdown. Documentar painel inativo de referência em listar-paineis-campo-espaco.data.ts.

#### 1.3. Não permitir reabilitar menu inativado quando 'Espaço' do 'Painel do usuário' inativo

**File:** `projects/widgets/tests/features/modo-de-uso-paineis-do-usuario/nao-reabilitar-menu-painel-inativo.spec.ts`

**Steps:**
  1. Pré-condição (seed via beforeAll — 4 passos, espelhando TC4 da suite Ativar/Inativar que já tem POM completo):
1. panelName = 'Painel ReabTc3 w{workerIndex}-{Date.now()}' (único por run)
2. itemName = 'Item ' + panelName (truncado em 25 chars pelo backend)
3. paineis.createPanel({ name: panelName }) — POST /panels + redirect /panels/{id}/edit
4. paineis.associatePanelToMenu(panelName, data.useModeId) — POST /use_mode_itens + redirect /edit?tab=items
5. paineis.ensureMenuItemInactive(data.useModeId, itemName) — click switch + Salvar (#use-model-submit) + PATCH bulk_update + reload verificado
6. paineis.ensureInactive(panelName) — BLOQUEADO pelo bug title_for 500 / change_status 422 (mesmo do TC4 da suite Ativar/Inativar). Spec marcado test.fixme(true, 'seed ausente: ...'). Quando backend fixar title_for#NoMethodError, descomentar este passo e remover o fixme.
Dados em nao-reabilitar-menu-painel-inativo.data.ts: { useModeId: 70077 }.
AfterAll: paineis.ensureActive(panelName) + disassociatePanelFromMenu_safe + deletePanelByNameSafe (nesta ordem).
    - expect: Painel criado ativo (POST /panels retorna 201)
    - expect: Item de menu criado com page_model='user_panels' (POST /use_mode_itens retorna 201)
    - expect: PATCH bulk_update persistiu inativação do menu (reload confirma switch off)
    - expect: BLOQUEADO: PATCH /panels/{id}/change_status → 422 (bug title_for — mesmo da suite anterior)
  2. Acessar edição do modo de uso: page.goto('/o/' + getOrgId() + '/use_modes/' + data.useModeId + '/edit?tab=items'). Clicar na aba 'Menu' (getByRole('tab', { name: 'Menu' }) OU navegar para sub-tab items). Aguardar tabela de itens renderizar. Localizar a row do item criado via getMenuItemRowByName(itemName). Verificar estado inicial do switch (deve estar OFF — inativo, conforme seed do beforeAll).
    - expect: URL está em /use_modes/{useModeId}/edit?tab=items
    - expect: Row do item de menu (nome truncado em 25 chars) está visível na tabela
    - expect: Switch do item (getMenuItemActiveSwitchInput(itemName)) está desmarcado (not.toBeChecked()) — estado seed inativo confirmado
    - expect: Coluna 'Modelo de página' da row exibe 'Painéis do usuário' (user_panels)
  3. Clicar no label do switch de ativação do item de menu (getMenuItemActiveSwitchLabel(itemName).click()). Aguardar que o toast #toast-inactive-panel apareça (waitFor state: 'visible', timeout: 10_000). Validar mensagem do toast.
    - expect: Toast #toast-inactive-panel aparece após click no switch do item
    - expect: Toast exibe mensagem: 'Painel está inativo e não pode ser reativado' (texto exato — RN93)
    - expect: Switch permanece desmarcado (not.toBeChecked()) — o produto NÃO permite a reativação
    - expect: Nenhum modal Chakra aparece (o bloqueio é via toast, NÃO modal — confirmado via Jam 2026-05-12)
    - expect: // NOTA: se o produto mudar para modal Chakra no futuro, atualizar para getBlockedModal() em vez de #toast-inactive-panel
  4. Aguardar o toast auto-dismissar (waitFor state: 'hidden', timeout: 10_000). Verificar que o switch permanece inativo após o dismiss do toast.
    - expect: Toast #toast-inactive-panel desaparece (auto-dismiss ~5s — comportamento Chakra padrão)
    - expect: Switch getMenuItemActiveSwitchInput(itemName) ainda desmarcado (not.toBeChecked()) após dismiss
    - expect: Estado do modo de uso não foi alterado (menu permanece inativo)
    - expect: Cleanup afterAll: paineis.ensureActive(panelName) + disassociatePanelFromMenu_safe + deletePanelByNameSafe
