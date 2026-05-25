# Editar/Excluir widgets — Plano de Testes

## Application Overview

Área "Editar/Excluir widgets" do módulo Widgets da plataforma Twygo (ambiente staging-widgets, orgId 36988). A área é acessada através do editor de Layouts de um painel em edição (`/o/{orgId}/panels/{id}/edit?tab=layouts`). Cada aba do layout pode conter widgets (componentes visuais). Cada widget no grid tem dois botões de ação: "Editar widget" (ícone lápis, `data-test-id` dinâmico com padrão `widgets-grid-widget-{uuid}-edit-button`) e "Remover widget" (ícone x/close, `widgets-grid-widget-{uuid}-remove-button`). Clicar "Editar widget" abre o drawer Chakra "Configurações do widget" (`[role="dialog"]` com banner "Configurações do widget"), que contém: switch "Mostrar título" (`data-test-id="widget-settings-name-enabled-switch"`, label Chakra com input checkbox interno), campo Título (`data-test-id="widget-settings-name-input"`, maxlength=255, placeholder "Digite o título do widget"), switch "Mostrar ícone" (`data-test-id="widget-settings-icon-enabled-switch"`), grid de ícones (`data-test-id="widget-settings-icon-grid"`) com opções individuais `widget-settings-icon-option-{iconName}`, e botões "Cancelar" (`data-test-id="widget-settings-cancel-button"`) e "Salvar" (`data-test-id="widget-settings-save-button"`) no rodapé. Ao salvar, o drawer fecha e exibe toast `.chakra-toast` com texto "Configurações salvas com sucesso". O título do widget no grid usa seletor `[data-test-id^="widgets-grid-widget-"][data-test-id$="-title"]`. O botão "Salvar Layout" (`data-test-id="panel-layout-save-button"`) persiste as mudanças no painel. Pré-condição para todos os testes: painel existente com ao menos uma aba contendo o widget-alvo — setup via `PainelFormPage.createPanel()` + `addWidget()` no before-hook. Widget IDs: `activity_summary` (Resumo de atividades), `in_progress_contents` (Conteúdos em andamento).

## Test Scenarios

### 1. Editar/Excluir widgets

**Seed:** `projects/widgets/tests/features/adicionar-editar-aba/criar-painel-happy-path.spec.ts`

#### 1.1. Drawer de configurações ao 'Editar' Widget

**File:** `projects/widgets/tests/features/editar-excluir-widgets/drawer-configuracoes-editar-widget.spec.ts`

**Steps:**
  1. Pré-condição: criar painel de teste via `PainelFormPage.createPanel(data.panelName)`, navegar para a aba Layouts, e adicionar widget 'Resumo de atividades' via `painelForm.addWidget('activity_summary')`
    - expect: O painel é criado e redirecionado para `/panels/{id}/edit?tab=layouts`
    - expect: O widget 'Resumo de atividades' aparece no grid com `getByTestId('widgets-grid-viewport')` visível
  2. Verificar que o ícone 'Editar widget' (lápis) está visível no widget: `page.locator('[data-test-id$="-edit-button"]').first()` deve ser visível
    - expect: Botão 'Editar widget' visível no card do widget no grid
  3. Clicar no botão 'Editar widget' do widget 'Resumo de atividades': `page.locator('[data-test-id$="-edit-button"]').first().click()`
    - expect: Drawer 'Configurações do widget' é exibido: `page.getByRole('dialog').filter({ hasText: 'Configurações do widget' })` está visível
  4. Verificar presença do switch 'Mostrar título': `page.getByTestId('widget-settings-name-enabled-switch')` deve ser visível
    - expect: Switch 'Mostrar título' visível no drawer e marcado como ativo (checked) por padrão
  5. Verificar presença do campo 'Título': `page.getByTestId('widget-settings-name-input')` deve ser visível e ter valor pré-preenchido
    - expect: Input 'Título' visível com valor padrão 'Resumo de atividades' e atributo maxlength='255'
  6. Verificar presença do switch 'Mostrar ícone': `page.getByTestId('widget-settings-icon-enabled-switch')` deve ser visível
    - expect: Switch 'Mostrar ícone' visível no drawer e marcado como ativo (checked) por padrão
  7. Verificar presença do seletor de ícone: `page.getByTestId('widget-settings-icon-grid')` deve ser visível e conter opções de ícone
    - expect: Grid de ícones visível com ao menos uma opção de ícone (`widget-settings-icon-option-leaderboard` etc.)
  8. Verificar botões do rodapé do drawer: `page.getByTestId('widget-settings-cancel-button')` e `page.getByTestId('widget-settings-save-button')` devem estar visíveis
    - expect: Botão 'Cancelar' e botão 'Salvar' visíveis no rodapé do drawer
    - expect: Após verificação, fechar drawer com Cancelar para limpeza

#### 1.2. Salvar alterações no drawer de configurações do widget

**File:** `projects/widgets/tests/features/editar-excluir-widgets/salvar-alteracoes-drawer-widget.spec.ts`

**Steps:**
  1. Pré-condição: criar painel de teste, abrir aba Layouts, adicionar widget 'Resumo de atividades', e abrir o drawer de edição via `page.locator('[data-test-id$="-edit-button"]').first().click()`
    - expect: Drawer 'Configurações do widget' está visível: `page.getByRole('dialog').filter({ hasText: 'Configurações do widget' }).toBeVisible()`
  2. Garantir que o switch 'Mostrar título' está ativo: verificar se `widget-settings-name-enabled-switch` tem atributo `data-checked`; se não tiver, clicar o label para ativar
    - expect: Switch 'Mostrar título' está ativo (input interno checked=true, label com data-checked)
  3. Limpar e preencher o campo 'Título' com 'Resumo Personalizado': `page.getByTestId('widget-settings-name-input').clear()` e `.fill('Resumo Personalizado')`
    - expect: Campo 'Título' exibe o texto 'Resumo Personalizado'
  4. Garantir que o switch 'Mostrar ícone' está ativo: verificar `widget-settings-icon-enabled-switch` tem atributo `data-checked`; se não tiver, clicar para ativar
    - expect: Switch 'Mostrar ícone' está ativo
  5. Selecionar um ícone no grid clicando em `page.getByTestId('widget-settings-icon-option-star')`
    - expect: Ícone 'star' aparece visualmente selecionado (REVISAR: verificar se há indicação visual de seleção — classe CSS ativa ou atributo)
  6. Clicar 'Salvar': `page.getByTestId('widget-settings-save-button').click()`
    - expect: Drawer fecha: `page.getByRole('dialog').filter({ hasText: 'Configurações do widget' })` não está mais visível
    - expect: Toast de sucesso exibido: `page.locator('.chakra-toast').filter({ hasText: 'Configurações salvas com sucesso' })` está visível (ou aguardar desaparecer)
  7. Verificar que o widget no grid exibe o novo título 'Resumo Personalizado': `page.locator('[data-test-id^="widgets-grid-widget-"][data-test-id$="-title"]').filter({ hasText: 'Resumo Personalizado' }).toBeVisible()`
    - expect: Título 'Resumo Personalizado' visível no card do widget no grid
  8. Clicar 'Salvar Layout': `page.getByTestId('panel-layout-save-button').click()`
    - expect: Layout salvo com sucesso (REVISAR: confirmar toast ou feedback visual de 'Salvar Layout' — verificar se há indicador separado)

#### 1.3. Cancelar alterações no drawer de configurações do widget

**File:** `projects/widgets/tests/features/editar-excluir-widgets/cancelar-alteracoes-drawer-widget.spec.ts`

**Steps:**
  1. Pré-condição: criar painel de teste, abrir aba Layouts, adicionar widget 'Resumo de atividades'. Anotar o título original padrão do widget via `page.locator('[data-test-id^="widgets-grid-widget-"][data-test-id$="-title"]').first().textContent()`
    - expect: Widget 'Resumo de atividades' está no grid com título padrão 'Resumo de atividades'
  2. Abrir o drawer de edição do widget: `page.locator('[data-test-id$="-edit-button"]').first().click()`
    - expect: Drawer 'Configurações do widget' está visível
  3. Se switch 'Mostrar título' não estiver ativo, ativá-lo clicando em `widget-settings-name-enabled-switch`. Preencher 'Título' com 'Não vai salvar': `page.getByTestId('widget-settings-name-input').fill('Não vai salvar')`
    - expect: Campo 'Título' exibe 'Não vai salvar'
  4. Clicar 'Cancelar': `page.getByTestId('widget-settings-cancel-button').click()`
    - expect: Drawer fecha sem persistir: `page.getByRole('dialog').filter({ hasText: 'Configurações do widget' })` não está mais visível
    - expect: Nenhum toast de 'Configurações salvas' é exibido
  5. Verificar que o widget no grid mantém o título original 'Resumo de atividades': `page.locator('[data-test-id^="widgets-grid-widget-"][data-test-id$="-title"]').first().toHaveText('Resumo de atividades')`
    - expect: Título do widget no grid permanece 'Resumo de atividades' (alteração descartada)

#### 1.4. Limite de 255 caracteres no campo 'Título' do drawer

**File:** `projects/widgets/tests/features/editar-excluir-widgets/limite-titulo-drawer-widget.spec.ts`

**Steps:**
  1. Pré-condição: criar painel de teste, abrir aba Layouts, adicionar qualquer widget (ex: 'Resumo de atividades'), e abrir o drawer de edição
    - expect: Drawer 'Configurações do widget' está visível
  2. Garantir que switch 'Mostrar título' está ativo. Limpar o campo 'Título' e preencher com string de 256 caracteres (string `'A'.repeat(256)`): `page.getByTestId('widget-settings-name-input').fill('A'.repeat(256))`
    - expect: O campo aceita no máximo 255 caracteres — o valor no input é truncado a 255 chars: `expect(await page.getByTestId('widget-settings-name-input').inputValue()).toHaveLength(255)`
  3. Verificar o atributo `maxlength` do input diretamente: `page.getByTestId('widget-settings-name-input').getAttribute('maxlength')`
    - expect: Atributo maxlength é '255' — confirmando a restrição HTML nativa
  4. Fechar o drawer com 'Cancelar'
    - expect: Drawer fecha sem salvar

#### 1.5. Excluir widget pelo ícone 'x'

**File:** `projects/widgets/tests/features/editar-excluir-widgets/excluir-widget-icone-x.spec.ts`

**Steps:**
  1. Pré-condição: criar painel de teste, abrir aba Layouts, adicionar widget 'Conteúdos em andamento' via `painelForm.addWidget('in_progress_contents')`
    - expect: Widget 'Conteúdos em andamento' aparece no grid: `page.locator('[data-test-id^="widgets-grid-widget-"][data-test-id$="-title"]').filter({ hasText: 'Conteúdos em andamento' }).toBeVisible()`
  2. Verificar contagem inicial de itens no grid: `page.locator('[data-test-id^="widgets-grid-item-"]').count()` deve ser 1
    - expect: Grid contém 1 widget
  3. Clicar no botão 'Remover widget' (ícone x) do widget: `page.locator('[data-test-id$="-remove-button"]').first().click()`
    - expect: Widget 'Conteúdos em andamento' é removido do grid imediatamente
    - expect: Grid fica vazio: `page.locator('[data-test-id^="widgets-grid-item-"]')` tem count 0 OU estado vazio 'Nenhum widget adicionado' é visível
  4. Clicar 'Salvar Layout': `page.getByTestId('panel-layout-save-button').click()`
    - expect: Layout salvo com sucesso (REVISAR: aguardar feedback de save — toast ou URL/redirect)
  5. Recarregar a página e navegar de volta para o Layouts do painel: `page.goto('/o/{orgId}/panels/{id}/edit?tab=layouts')`
    - expect: Após reload, o grid permanece sem o widget 'Conteúdos em andamento' — confirmando persistência da remoção

#### 1.6. Switches 'Mostrar título' e 'Mostrar ícone' desligados

**File:** `projects/widgets/tests/features/editar-excluir-widgets/switches-titulo-icone-desligados.spec.ts`

**Steps:**
  1. Pré-condição: criar painel de teste, abrir aba Layouts, adicionar widget 'Resumo de atividades', e abrir o drawer de edição
    - expect: Drawer 'Configurações do widget' está visível com ambos os switches ativos por padrão
  2. Desativar switch 'Mostrar título' clicando em `page.getByTestId('widget-settings-name-enabled-switch').click()` (REVISAR: o click via locator pode exigir `.click({ force: true })` pois o input interno é interceptado pelo label — use o método `page.getByTestId('widget-settings-name-enabled-switch').click({ force: true })` ou JavaScript click via `evaluate`)
    - expect: Switch 'Mostrar título' fica inativo: label `widget-settings-name-enabled-switch` não tem mais atributo `data-checked`
    - expect: REVISAR: verificar se o campo 'Título' fica visualmente desabilitado ou oculto — no DOM explorado o input NÃO fica `disabled`; a switch controla apenas a exibição no widget renderizado
  3. Desativar switch 'Mostrar ícone' clicando em `page.getByTestId('widget-settings-icon-enabled-switch').click({ force: true })`
    - expect: Switch 'Mostrar ícone' fica inativo: label `widget-settings-icon-enabled-switch` não tem mais atributo `data-checked`
    - expect: REVISAR: verificar se o grid de ícones fica desabilitado ou oculto no DOM
  4. Clicar 'Salvar': `page.getByTestId('widget-settings-save-button').click()`
    - expect: Drawer fecha
    - expect: Toast '.chakra-toast' com texto 'Configurações salvas com sucesso' é exibido
  5. Verificar o widget no grid após salvar com switches desligados
    - expect: REVISAR: confirmar se o título do widget no grid desaparece quando 'Mostrar título' está OFF — na exploração live o título sumiu do card após desligar o switch e salvar
    - expect: REVISAR: confirmar se o ícone do widget no grid desaparece quando 'Mostrar ícone' está OFF
