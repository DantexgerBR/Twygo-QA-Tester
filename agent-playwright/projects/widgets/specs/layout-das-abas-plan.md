# Layout das Abas — Plano de Testes

## Application Overview

Plano de testes para a testsuite "Layout das abas" do módulo Painéis Widgets (Twygo). Cobre 11 testcases relativos à toolbar da área de Layouts, modos de visualização Desktop/Tablet/Mobile, switch de reorganização de widgets, drag-and-drop, estado vazio, Salvar Layout, Cancelar edição, comportamento sticky/fixed da barra de rodapé e acessibilidade por teclado. Exploração live realizada em 2026-05-13 no env `staging-widgets` (org 36988, host https://widgets.stage.twygoead.com), painel de referência `/o/36988/panels/803018/edit?tab=layouts`.

CONTEXTO CRÍTICO — BUG DE PERSISTÊNCIA (feedback_panel_layout_save_no_persist.md):
O botão "Salvar Layout" (data-test-id="panel-layout-save-button") executa apenas localmente. Trace de rede confirmado em 2026-05-13: ZERO POST/PATCH enviados ao backend ao clicar Salvar Layout (somente analytics de terceiros). TC 8 testa persistência — vai FALHAR vermelho legitimamente. TC 5 (mover widget): reorganização funciona no DOM mas reload perde o estado.

ANTI-PATTERNS PROIBIDOS (CLAUDE.md §7.6):
- A: Nunca fazer login no spec — storageState já cobre.
- B: Nunca hardcodar URL/orgId — usar getOrgId() de src/utils/environment.ts.
- C: Nunca criar inline helpers de UI dentro do test() — métodos novos vão em PainelFormPage.ts.
- D: Comentários só justificam WHY, nunca WHAT.
- E: Constantes-de-domínio em arquivos .data.ts adjacentes ao spec, nunca inline.
- F: Nunca usar fixme para esconder bug de produto — deixar falhar vermelho com comentário de causa raiz.

SELETORES CONFIRMADOS VIA DOM LIVE (2026-05-13):

Toolbar / Actions area:
- Container principal: data-test-id="widgets-grid-container" (engloba tabs-nav + actions + viewport)
- Barra de ações: data-test-id="widgets-grid-actions" (position: static, dentro do container)
- Botão "Adicionar widget" (header): data-test-id="widgets-grid-add-button"
- Navegação de abas: data-test-id="tabs-navigation"
- Botão "Adicionar aba": data-test-id="tabs-navigation-add-button"

Visualização Desktop/Tablet/Mobile:
- Container dos 3 botões: data-test-id="widgets-grid-view-selector"
- Botão Desktop: getByRole('button', { name: 'Visualização: Desktop' }) — sem data-test-id
- Botão Tablet: getByRole('button', { name: 'Visualização: Tablet' }) — sem data-test-id
- Botão Mobile: getByRole('button', { name: 'Visualização: Mobile' }) — sem data-test-id
- Botão ativo tem classe CSS css-1ei05do; inativo tem css-46557t (sem aria-pressed/data-active)
- Alerta de modo não-Desktop: data-test-id="widgets-grid-view-alert", role="alert"
  - Tablet: texto "Visualização (Tablet) — edição disponível no Desktop"
  - Mobile: texto "Visualização (Mobile) — edição disponível no Desktop"
- Switch reorganizar: data-test-id="widgets-grid-reorganize-switch" fica data-disabled="" e input.disabled=true em Tablet/Mobile

Switch reorganizar:
- Container: data-test-id="widgets-grid-reorganize-switch"
- Label Chakra: .chakra-switch dentro do container (intercepta pointer events — usar .click({ force: true }))
- Estado ON: label tem data-checked=""; input.checked=true
- Estado OFF: label sem data-checked; input.checked=false
- Grid item com switch ON: classe "react-draggable" presente no div
- Grid item com switch OFF: classe "react-resizable-hide" presente, "react-draggable" ausente

Drag handles dos widgets:
- Padrão: data-test-id="widgets-grid-widget-{uuid}-drag-handle" (classe: widget-drag-handle)
- Visível em ambos estados do switch, mas arrastar só funciona com switch ON (react-draggable class)

Rodapé / Footer:
- Botão "Salvar Layout": data-test-id="panel-layout-save-button"
- Botão "Cancelar": data-test-id="panel-layout-cancel-button"
- Container do rodapé: position: fixed (classe css-1bvxcno) — sempre visível independente do scroll

Estado vazio (sem widgets):
- Container: data-test-id="widgets-grid-empty-state"
- Título: "Nenhum widget adicionado"
- Descrição: 'Clique no botão "Adicionar Widget" para começar a montar sua tela personalizada'
- Botão CTA: data-test-id="widgets-grid-empty-state-add-button"

Grid de widgets:
- Items: data-test-id^="widgets-grid-item-" (prefixo, UUID dinâmico)
- Toast "Widget adicionado": chakra-toast com id="toast-widget-added-toast-description" e data-status="success"
- Viewport: data-test-id="widgets-grid-viewport"

Comportamento Cancelar:
- Sem alterações não salvas: redireciona diretamente para /o/{orgId}/use_modes?tab=panels-tab (sem dialog)
- Com alterações não salvas: browser beforeunload dialog nativo dispara antes do redirect
- Destino do redirect: /o/{orgId}/use_modes?tab=panels-tab

Acessibilidade (TC11):
Elementos focusáveis dentro do widgets-grid-container (com grid vazio):
1. Botão "Renomear" (da aba ativa) — role="button", aria-label="Renomear"
2. Botão "Adicionar aba" — data-test-id="tabs-navigation-add-button"
3. Botão "Adicionar widget" (header) — data-test-id="widgets-grid-add-button"
4. Botão "Visualização: Desktop" — aria-label="Visualização: Desktop"
5. Botão "Visualização: Tablet" — aria-label="Visualização: Tablet"
6. Botão "Visualização: Mobile" — aria-label="Visualização: Mobile"
7. Switch checkbox reorganizar — input[type="checkbox"] dentro de widgets-grid-reorganize-switch
8. Botão "Adicionar Widget" (empty state) — data-test-id="widgets-grid-empty-state-add-button"
9. Botão "Cancelar" (footer fixo) — data-test-id="panel-layout-cancel-button"
10. Botão "Salvar Layout" (footer fixo) — data-test-id="panel-layout-save-button"

PADRÃO DE SETUP OBRIGATÓRIO para TCs que precisam de painel com layout:
1. painelForm.goToNew() + createPanel(data.panelName) — retorna panelId
2. getLayoutsTab().click() para entrar na aba Layouts
3. Dados de nome de painel em <test-case>.data.ts (anti-pattern E — sem inline)
4. NÃO usar painelId hardcoded — extrair da URL via createPanel()

## Test Scenarios

### 1. Layout das abas

**Seed:** `projects/widgets/tests/features/adicionar-editar-aba/criar-painel-happy-path.spec.ts`

#### 1.1. Validar barra de ferramentas fixa no topo da área de layout

**File:** `projects/widgets/tests/features/layout-das-abas/validar-toolbar-fixa.spec.ts`

**Steps:**
  1. Pré-condição: navegar para edição de painel na aba Layouts via painelForm.goToNew() + createPanel(data.panelName) + getLayoutsTab().click(). Dados em validar-toolbar-fixa.data.ts.
    - expect: Aba Layouts está ativa (tab com aria-selected='true').
    - expect: Container data-test-id='widgets-grid-container' está visível.
    - expect: Área de ações (data-test-id='widgets-grid-actions') está visível contendo: botão 'Adicionar widget' (data-test-id='widgets-grid-add-button'), container de botões de visualização (data-test-id='widgets-grid-view-selector') com os 3 botões Desktop/Tablet/Mobile, e switch 'Permitir reorganizar widgets' (data-test-id='widgets-grid-reorganize-switch').
    - expect: Navegação de abas (data-test-id='tabs-navigation') está visível com a aba 'Nova aba' e botão 'Adicionar aba' (data-test-id='tabs-navigation-add-button').
    - expect: Rodapé com botões 'Cancelar' (data-test-id='panel-layout-cancel-button') e 'Salvar Layout' (data-test-id='panel-layout-save-button') está visível.
  2. Verificar que o rodapé (container dos botões Cancelar e Salvar Layout) tem posicionamento fixo — permanece visível mesmo sem scroll.
    - expect: O container pai do botão 'Salvar Layout' tem position: fixed (confirmado via CSS class css-1bvxcno) — getByTestId('panel-layout-save-button').isVisible() retorna true independente do conteúdo da página.
    - expect: Botão 'Salvar Layout' está visível e habilitado.
    - expect: Botão 'Cancelar' está visível e habilitado.

#### 1.2. Trocar visualização para Tablet (768) e validar alerta

**File:** `projects/widgets/tests/features/layout-das-abas/trocar-visualizacao-tablet.spec.ts`

**Steps:**
  1. Pré-condição: painel aberto na aba Layouts em modo Desktop (default). Verificar que o botão Desktop está ativo (classe CSS css-1ei05do, outros com css-46557t). Dados em trocar-visualizacao-tablet.data.ts.
    - expect: Botão 'Visualização: Desktop' tem aria-label='Visualização: Desktop' e está visualmente destacado (classe css-1ei05do).
    - expect: Botões Tablet e Mobile têm classe css-46557t (inativo).
    - expect: Alerta data-test-id='widgets-grid-view-alert' NÃO está presente no DOM.
    - expect: Switch 'Permitir reorganizar widgets' está habilitado (input.disabled=false).
    - expect: Container data-test-id='widgets-grid-actions' está visível.
  2. Clicar no botão 'Visualização: Tablet' (getByRole('button', { name: 'Visualização: Tablet' }).click()).
    - expect: Botão 'Visualização: Tablet' passa a ter classe css-1ei05do (ativo).
    - expect: Botão 'Visualização: Desktop' passa a ter classe css-46557t (inativo).
    - expect: Alerta data-test-id='widgets-grid-view-alert' aparece com role='alert' e texto 'Visualização (Tablet) — edição disponível no Desktop'.
    - expect: Switch 'Permitir reorganizar widgets': label .chakra-switch tem data-disabled='' e input[type='checkbox'] tem disabled=true.
    - expect: A área de widgets permanece visível mas em modo somente-leitura (sem edição de widgets).
    - expect: Botões de footer 'Cancelar' e 'Salvar Layout' permanecem visíveis (rodapé é fixed).
  3. Verificar que o alerta exibido em modo Tablet é informativo (não bloqueia a navegação na área de Layouts).
    - expect: Alerta data-test-id='widgets-grid-view-alert' contém exatamente o texto 'Visualização (Tablet) — edição disponível no Desktop'.
    - expect: O switch 'Permitir reorganizar widgets' não pode ser ativado enquanto Tablet está selecionado (input.disabled=true).
    - expect: Botão 'Adicionar widget' (data-test-id='widgets-grid-add-button') NÃO está presente em modo Tablet (edição desabilitada). // REVISAR: confirmar se botão Adicionar widget fica oculto ou apenas desabilitado em Tablet/Mobile.

#### 1.3. Trocar visualização para Mobile (360) e validar alerta

**File:** `projects/widgets/tests/features/layout-das-abas/trocar-visualizacao-mobile.spec.ts`

**Steps:**
  1. Pré-condição: painel aberto na aba Layouts em modo Desktop (default). Dados em trocar-visualizacao-mobile.data.ts.
    - expect: Botão 'Visualização: Desktop' está ativo (classe css-1ei05do).
    - expect: Alerta data-test-id='widgets-grid-view-alert' NÃO presente.
    - expect: Switch reorganizar habilitado (input.disabled=false).
  2. Clicar no botão 'Visualização: Mobile' (getByRole('button', { name: 'Visualização: Mobile' }).click()).
    - expect: Botão 'Visualização: Mobile' passa a ter classe css-1ei05do (ativo).
    - expect: Botões Desktop e Tablet passam a ter classe css-46557t (inativo).
    - expect: Alerta data-test-id='widgets-grid-view-alert' aparece com texto 'Visualização (Mobile) — edição disponível no Desktop'.
    - expect: Switch 'Permitir reorganizar widgets': label .chakra-switch tem data-disabled='' e input.disabled=true.
  3. Verificar que o comportamento em Mobile é consistente com o Tablet (mesmo alerta e mesma desativação do switch).
    - expect: Alerta contém exatamente 'Visualização (Mobile) — edição disponível no Desktop' (texto diferente de Tablet).
    - expect: Switch reorganizar não pode ser ativado (input.disabled=true).
    - expect: Botões de footer 'Cancelar' e 'Salvar Layout' permanecem visíveis (rodapé é fixed).

#### 1.4. Voltar para visualização Desktop após Tablet/Mobile

**File:** `projects/widgets/tests/features/layout-das-abas/voltar-desktop.spec.ts`

**Steps:**
  1. Pré-condição: painel aberto na aba Layouts. Clicar em 'Visualização: Tablet' para sair do modo Desktop. Dados em voltar-desktop.data.ts.
    - expect: Botão Tablet ativo (classe css-1ei05do).
    - expect: Alerta data-test-id='widgets-grid-view-alert' visível com texto 'Visualização (Tablet) — edição disponível no Desktop'.
    - expect: Switch reorganizar desabilitado (input.disabled=true).
  2. Clicar no botão 'Visualização: Desktop' (getByRole('button', { name: 'Visualização: Desktop' }).click()) para voltar ao modo Desktop.
    - expect: Botão 'Visualização: Desktop' volta a ter classe css-1ei05do (ativo).
    - expect: Botões Tablet e Mobile voltam a ter classe css-46557t (inativo).
    - expect: Alerta data-test-id='widgets-grid-view-alert' NÃO está mais presente no DOM (removido ao retornar para Desktop).
    - expect: Switch 'Permitir reorganizar widgets' volta a estar habilitado (label sem data-disabled, input.disabled=false).
  3. Repetir o fluxo para Mobile: clicar 'Visualização: Mobile' e depois 'Visualização: Desktop'.
    - expect: Após clicar Mobile: alerta com texto 'Visualização (Mobile) — edição disponível no Desktop' visível.
    - expect: Após clicar Desktop: alerta removido e switch habilitado novamente.
  4. Verificar que após retornar ao Desktop a área de edição de widgets está totalmente funcional.
    - expect: Botão 'Adicionar widget' (data-test-id='widgets-grid-add-button') está visível e habilitado.
    - expect: Switch 'Permitir reorganizar widgets' pode ser ativado via click({ force: true }) no label .chakra-switch.

#### 1.5. Ativar switch 'Permitir reorganizar widgets' e mover widget

**File:** `projects/widgets/tests/features/layout-das-abas/ativar-switch-reorganizar-mover-widget.spec.ts`

**Steps:**
  1. Pré-condição: painel aberto em Layouts (modo Desktop) com pelo menos 2 widgets adicionados. Dados em ativar-switch-reorganizar-mover-widget.data.ts. Setup via painelForm.goToNew() + createPanel() + addWidget('activity_summary') + addWidget('ranking') (esperando drawer fechar entre cada adição). Switch está OFF (input.checked=false).
    - expect: Grid com 2 itens (getByTestId que começa com 'widgets-grid-item-') visíveis.
    - expect: Switch label (.chakra-switch dentro de widgets-grid-reorganize-switch) sem data-checked (OFF).
    - expect: Grid items têm classe 'react-resizable-hide' (não-draggable).
    - expect: Drag handles (data-test-id$='-drag-handle') visíveis porém inativos.
  2. Ativar o switch 'Permitir reorganizar widgets': clicar no label .chakra-switch dentro de data-test-id='widgets-grid-reorganize-switch' usando click({ force: true }) (Chakra Switch intercepta pointer events — ver §7.5 do CLAUDE.md).
    - expect: Label .chakra-switch passa a ter data-checked='' (ON).
    - expect: input[type='checkbox'] passa a ter checked=true.
    - expect: Grid items passam a ter classe 'react-draggable' (draggable ativo).
    - expect: Drag handles (data-test-id$='-drag-handle', classe 'widget-drag-handle') ficam interativos.
  3. Mover o primeiro widget via drag-and-drop: usar page.dragAndDrop() do drag handle do widget 1 para a posição do widget 2. // NOTA: drag pode funcionar localmente no DOM mas reload perde o estado (feedback_panel_layout_save_no_persist.md). Verificar reorganização visual sem recarregar a página.
    - expect: Drag handle (seletor: getByTestId que termina com '-drag-handle').first() responde ao drag.
    - expect: Posição dos widgets no grid muda visualmente (transform CSS atualizado).
    - expect: Ambos widgets permanecem visíveis no grid após o drag.
    - expect: // REVISAR: confirmar se há toast 'Reorganização salva' ou equivalente após drag. Se persistência está com bug (zero POST/PATCH), não asserir persist — apenas asserir mudança visual local.

#### 1.6. Switch desativado: tentar arrastar widget

**File:** `projects/widgets/tests/features/layout-das-abas/switch-desativado-tentar-arrastar.spec.ts`

**Steps:**
  1. Pré-condição: painel aberto em Layouts (modo Desktop) com pelo menos 1 widget no grid. Switch está OFF (estado inicial default). Dados em switch-desativado-tentar-arrastar.data.ts.
    - expect: Switch label (.chakra-switch em widgets-grid-reorganize-switch) sem data-checked (OFF).
    - expect: Grid item tem classe 'react-resizable-hide' (não-draggable confirmado via DOM).
    - expect: Drag handle (data-test-id$='-drag-handle') visível na tela.
  2. Tentar arrastar o widget via drag-and-drop enquanto switch está desativado: usar page.mouse.move() + page.mouse.down() + page.mouse.move() + page.mouse.up() no drag handle.
    - expect: Widget NÃO se move (posição permanece igual antes e depois do drag attempt).
    - expect: Drag handle não responde ao drag (classe 'react-resizable-hide' bloqueia o comportamento draggable).
    - expect: Nenhum toast de erro é exibido (o bloqueio é silencioso via CSS/classe).
  3. Verificar que ativar o switch após o bloqueio restaura a funcionalidade de drag.
    - expect: Após clicar no label .chakra-switch com force:true: data-checked='' aparece no label.
    - expect: Grid item passa a ter classe 'react-draggable'.
    - expect: Drag handle fica funcional para arrastar.

#### 1.7. Estado vazio da aba sem widgets

**File:** `projects/widgets/tests/features/layout-das-abas/estado-vazio-sem-widgets.spec.ts`

**Steps:**
  1. Pré-condição: criar painel novo e abrir aba Layouts SEM adicionar nenhum widget. O estado vazio é o estado inicial de qualquer aba recém-criada. Dados em estado-vazio-sem-widgets.data.ts. Setup: painelForm.goToNew() + createPanel(data.panelName) + getLayoutsTab().click().
    - expect: Aba Layouts aberta com a aba padrão 'Nova aba'.
    - expect: Container data-test-id='widgets-grid-empty-state' visível.
    - expect: Nenhum item com data-test-id que começa com 'widgets-grid-item-' presente (count=0).
  2. Verificar o conteúdo do estado vazio: título, descrição e botão CTA.
    - expect: Texto 'Nenhum widget adicionado' visível dentro de data-test-id='widgets-grid-empty-state'.
    - expect: Texto 'Clique no botão "Adicionar Widget" para começar a montar sua tela personalizada' visível dentro do container.
    - expect: Botão 'Adicionar Widget' (data-test-id='widgets-grid-empty-state-add-button') visível e habilitado.
    - expect: Ícone 'add' (material-symbols) visível no container de estado vazio.
  3. Clicar no botão 'Adicionar Widget' do estado vazio para verificar que abre o drawer de seleção de widgets.
    - expect: Drawer de widgets (data-test-id='widget-selector-drawer') abre após click.
    - expect: O estado vazio some após abertura do drawer (ou após adição de widget).
    - expect: // REVISAR: verificar se o estado vazio e o botão header 'Adicionar widget' coexistem (ambos presentes) ou se são mutuamente exclusivos.

#### 1.8. Salvar layout pela barra de rodapé

**File:** `projects/widgets/tests/features/layout-das-abas/salvar-layout-rodape.spec.ts`

**Steps:**
  1. Pré-condição: painel aberto em Layouts com pelo menos 1 widget adicionado. Aguardar toast 'Widget adicionado com sucesso' sumir (painelForm.waitForToastsToClear()) antes de prosseguir. Dados em salvar-layout-rodape.data.ts.
    - expect: Grid com ao menos 1 item (data-test-id^='widgets-grid-item-') visível.
    - expect: Toast de 'Widget adicionado' não está mais visível.
    - expect: Botão 'Salvar Layout' (data-test-id='panel-layout-save-button') visível e habilitado.
  2. // BUG SERVIDOR (2026-05-13): Save Layout NÃO persiste no backend. Trace de rede confirmou zero POST/PATCH ao clicar o botão. A causa raiz está na lógica de submit do componente de Layouts — o handler de save não despacha a chamada de API. Este teste DEVE falhar vermelho enquanto o bug não for corrigido. Asserção de persistência deve ser verificada via reload da página. Clicar no botão 'Salvar Layout' (data-test-id='panel-layout-save-button') usando click({ force: true }) para contornar o iframe do chat HubSpot que intercepta eventos.
    - expect: // BUG ESPERADO: após clicar Salvar Layout, NENHUM toast de sucesso é exibido (zero request à API — silent failure).
    - expect: // QUANDO BUG CORRIGIDO: toast de sucesso com texto 'Layout salvo com sucesso' (ou equivalente) deve aparecer.
    - expect: URL permanece em /o/{orgId}/panels/{id}/edit?tab=layouts (não redireciona).
  3. Recarregar a página (page.reload()) e verificar persistência do layout.
    - expect: // BUG ESPERADO: após reload, grid retorna vazio (estado persistido = vazio, sem os widgets adicionados). Este é o sinal vermelho do teste — se o layout salvou corretamente, o widget deveria estar presente.
    - expect: // QUANDO BUG CORRIGIDO: grid deve exibir o mesmo widget adicionado antes do save, confirmando persistência no backend.

#### 1.9. Cancelar edição com alterações não salvas

**File:** `projects/widgets/tests/features/layout-das-abas/cancelar-edicao-com-alteracoes.spec.ts`

**Steps:**
  1. Pré-condição: painel aberto em Layouts. Adicionar 1 widget via openWidgetDrawer() + addWidget() para criar alterações não salvas. Aguardar toast 'Widget adicionado com sucesso' aparecer (confirma alteração pendente). Dados em cancelar-edicao-com-alteracoes.data.ts.
    - expect: Grid com 1 widget visível (data-test-id^='widgets-grid-item-' count=1).
    - expect: Alteração não salva existe (widget adicionado mas Save Layout não clicado).
    - expect: Botão 'Cancelar' (data-test-id='panel-layout-cancel-button') visível.
  2. Clicar no botão 'Cancelar' (data-test-id='panel-layout-cancel-button'). O browser nativo dispara beforeunload dialog quando há alterações não salvas.
    - expect: Dialog nativo beforeunload aparece (page.waitForEvent('dialog') captura o evento).
    - expect: Dialog NÃO é um modal Chakra UI — é o dialog padrão do browser.
    - expect: Enquanto o dialog estiver aberto, a URL permanece em /o/{orgId}/panels/{id}/edit?tab=layouts.

#### 1.10. Toolbar permanece fixa ao rolar a área de layout

**File:** `projects/widgets/tests/features/layout-das-abas/toolbar-sticky-rolar.spec.ts`

**Steps:**
  1. Pré-condição: painel aberto em Layouts com conteúdo suficiente para gerar scroll. Adicionar múltiplos widgets para preencher o grid e gerar altura. Dados em toolbar-sticky-rolar.data.ts. Verificar o posicionamento do rodapé antes do scroll.
    - expect: Rodapé (container classe css-1bvxcno com data-test-id='panel-layout-save-button' dentro) tem position: fixed.
    - expect: Botões 'Cancelar' e 'Salvar Layout' estão visíveis no viewport antes do scroll.
  2. Realizar scroll para baixo na página usando page.mouse.wheel(0, 500) ou page.keyboard.press('End').
    - expect: Botão 'Salvar Layout' (data-test-id='panel-layout-save-button') permanece visível no viewport após scroll (position: fixed — gruda no bottom da tela).
    - expect: Botão 'Cancelar' (data-test-id='panel-layout-cancel-button') permanece visível no viewport após scroll.
    - expect: Rodapé NÃO rola com o conteúdo da página.
  3. Rolar de volta para o topo (page.keyboard.press('Home')) e verificar que a toolbar de ações também permanece acessível.
    - expect: Área data-test-id='widgets-grid-actions' (botões Desktop/Tablet/Mobile e switch) está visível no topo após scroll up.
    - expect: Botões de footer continuam fixos na parte inferior.
    - expect: // REVISAR: verificar se widgets-grid-actions tem algum comportamento sticky durante scroll intermediário, ou se só o footer é fixed. Inspecionar comportamento durante scroll intermediário.

#### 1.11. Validar acessibilidade por teclado aba 'Layout'

**File:** `projects/widgets/tests/features/layout-das-abas/acessibilidade-teclado-layout.spec.ts`

**Steps:**
  1. Pré-condição: painel aberto em Layouts (grid vazio — estado inicial). Focar o primeiro elemento interativo da área de Layouts via Tab a partir do campo de título do painel. Dados em acessibilidade-teclado-layout.data.ts.
    - expect: A aba Layouts está ativa e a área de widgets-grid-container está renderizada.
    - expect: Área de Layouts contém elementos focusáveis via teclado (Tab).
  2. Pressionar Tab sequencialmente e verificar a ordem de foco entre os elementos da área de Layouts. Ordem esperada de elementos focusáveis dentro do widgets-grid-container (confirmada via DOM live 2026-05-13): (1) botão 'Renomear' da aba ativa, (2) botão 'Adicionar aba' (tabs-navigation-add-button), (3) botão 'Adicionar widget' (header — widgets-grid-add-button), (4) botão 'Visualização: Desktop', (5) botão 'Visualização: Tablet', (6) botão 'Visualização: Mobile', (7) switch 'Permitir reorganizar widgets' (input[type='checkbox']), (8) botão 'Adicionar Widget' (empty state — widgets-grid-empty-state-add-button).
    - expect: Cada elemento na ordem acima recebe foco visível quando Tab é pressionado.
    - expect: Botão 'Renomear' é focável via teclado.
    - expect: Botão 'Adicionar aba' (tabs-navigation-add-button) é ativável via Enter/Space.
    - expect: Botões de visualização Desktop/Tablet/Mobile são focáveis e ativáveis via Enter.
    - expect: Switch reorganizar é focável e alternável via Space.
    - expect: Botão do empty state é focável.
  3. Verificar que os botões do rodapé fixo (Cancelar e Salvar Layout) também são acessíveis via teclado.
    - expect: Botão 'Cancelar' (panel-layout-cancel-button) recebe foco via Tab.
    - expect: Botão 'Salvar Layout' (panel-layout-save-button) recebe foco via Tab.
    - expect: Pressionar Enter no botão focado executa a ação correspondente.
  4. Verificar que elementos desabilitados (ex: switch em modo Tablet) não recebem foco no tab order quando estão disabled.
    - expect: Ao trocar para modo Tablet (click em botão Tablet via keyboard), o switch reorganizar não recebe foco via Tab (input.disabled=true).
    - expect: Tab pula o switch desabilitado e vai para o próximo elemento habilitado.
    - expect: // REVISAR: confirmar comportamento exato do tab order quando o switch está disabled — pode ser que o label ainda receba foco.
