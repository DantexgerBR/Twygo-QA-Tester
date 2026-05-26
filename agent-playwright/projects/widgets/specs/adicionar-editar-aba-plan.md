# Adicionar/editar aba — Plano de Testes

## Application Overview

Plano para a testsuite "Adicionar/editar aba" do módulo Painéis Widgets (Twygo). Cobre 18 testcases relativos ao formulário de criação/edição de painel, com foco nas abas Identificação e Layouts, incluindo: criar painel (happy path e validações), gestão de abas dinâmicas (criação, renomeação, exclusão), modais de confirmação, e acessibilidade por teclado. Exploração live realizada em 2026-05-11 no env `staging-widgets` (org 36988).

## Test Scenarios

### 1. Adicionar/editar aba

**Seed:** `projects/widgets/tests/features/listagem-de-paineis/validar-componentes-obrigatorios.spec.ts`

#### 1.1. Acessar a tela de criação de painel

**File:** `projects/widgets/tests/features/adicionar-editar-aba/acessar-tela-criacao-painel.spec.ts`

**Steps:**
  1. Navegar para `/o/${getOrgId()}/use_modes?tab=panels-tab` via `paineisList.goToList()`. Dismiss modais oportunistas via `dismissCommonModals(page)`.
    - expect: Listagem de painéis é exibida: tab 'Painéis' selecionada, botão '+ Adicionar' visível.
  2. Clicar no botão '+ Adicionar' (`paineisList.getAddButton().click()`).
    - expect: Sistema redireciona para `/o/${getOrgId()}/panels/new`.
    - expect: Heading 'Adicionar painel' está visível.
    - expect: Tab 'Identificação' está selecionada (`aria-selected=true`).
    - expect: Tab 'Layouts' está desabilitada (`[disabled]`).

#### 1.2. Criar painel com Nome e Descrição preenchidos (happy path)

**File:** `projects/widgets/tests/features/adicionar-editar-aba/criar-painel-happy-path.spec.ts`

**Steps:**
  1. Navegar diretamente para `/o/${getOrgId()}/panels/new` via `page.goto`.
    - expect: Tab 'Identificação' ativa, tab 'Layouts' desabilitada, campo Nome* e campo Descrição visíveis.
  2. Preencher o campo 'Nome' (`#panel-form-name-input`) com o valor `data.panelName` ('Painel de Vendas Q1').
    - expect: Campo aceita o valor digitado. Contador 'X / 250' atualiza.
  3. Preencher o campo 'Descrição' (textbox com toolbar rich-text, escopo do tabpanel 'Identificação') com o valor `data.description` ('Painel para acompanhamento de KPIs de vendas').
    - expect: Campo aceita o valor digitado. Contador '41 / 500' atualiza.
  4. Clicar no botão 'Salvar' (`getByTestId('panel-form-save-button')`).
    - expect: Sistema redireciona para `/o/${getOrgId()}/panels/{id}/edit` (REVISAR: XML diz redireciona para listagem, mas comportamento real é redirect para a tela de edição do painel criado).
    - expect: Tab 'Layouts' fica ativa/habilitada.
    - expect: Heading do painel mostra 'Painel de Vendas Q1'.
  5. Clicar na tab 'Layouts' (`getByRole('tab', { name: 'Layouts' })`)
    - expect: Tab 'Layouts' fica selecionada.
    - expect: Aba 'Nova aba' é exibida automaticamente na navegação lateral de abas.
  6. Clicar no botão 'Salvar Layout' (`getByRole('button', { name: 'Salvar Layout' })`).
    - expect: // REVISAR: prosa XML diz 'Salvar layout' redireciona para listagem com painel na primeira posição — verificar comportamento real ao salvar layout. Pode ser que permaneça na tela de edição ou redirecione. Marcar se redirect para listagem acontece.

#### 1.3. Tentar salvar painel sem preencher o campo obrigatório 'Nome'

**File:** `projects/widgets/tests/features/adicionar-editar-aba/validacao-campo-nome-obrigatorio.spec.ts`

**Steps:**
  1. Navegar para `/o/${getOrgId()}/panels/new`.
    - expect: Tela de criação é exibida com campo 'Nome*' vazio.
  2. Deixar o campo 'Nome' (`#panel-form-name-input`) vazio e clicar em 'Salvar' (`getByTestId('panel-form-save-button')`).
    - expect: Campo 'Nome' fica destacado em vermelho (aria-invalid=true ou classe de erro Chakra).
    - expect: Mensagem de campo obrigatório é exibida abaixo do campo (ex.: 'Nome é obrigatório' ou similar). // REVISAR: texto exato da mensagem de erro — explorar ao vivo no spec.

#### 1.4. Validar limite de 255 caracteres no campo Nome

**File:** `projects/widgets/tests/features/adicionar-editar-aba/validacao-limite-nome-255.spec.ts`

**Steps:**
  1. Navegar para `/o/${getOrgId()}/panels/new`.
    - expect: Tela de criação é exibida.
  2. Preencher o campo 'Nome' com uma string de 256 caracteres (usar `data.name256Chars`).
    - expect: // REVISAR: campo `#panel-form-name-input` tem `maxLength=250` observado live (não 255 conforme XML). Campo aceita no máximo 250 caracteres — contador mostra '250 / 250' e caractere 251+ é ignorado. Asserção: `expect(input).toHaveValue(data.name250Chars)` após preencher 256 chars.
    - expect: Alternativamente: se o app aplica validação server-side com 255, o 256° char é rejeitado ao salvar. Investigar qual dos dois é o limite real (250 maxLength DOM vs 255 documentado).

#### 1.5. Validar limite de 500 caracteres no campo Descrição

**File:** `projects/widgets/tests/features/adicionar-editar-aba/validacao-limite-descricao-500.spec.ts`

**Steps:**
  1. Navegar para `/o/${getOrgId()}/panels/new`.
    - expect: Tela de criação é exibida.
  2. Preencher o campo 'Descrição' (rich-text ProseMirror) com 501 caracteres (usar `data.description501Chars`). O campo é um `textbox` dentro do tabpanel 'Identificação'.
    - expect: Contador mostra '500 / 500' — campo aceita no máximo 500 caracteres.
    - expect: Caractere 501+ é ignorado pelo campo (limite enforced pelo componente).

#### 1.6. Validar tipos de caracteres aceitos no campo Nome

**File:** `projects/widgets/tests/features/adicionar-editar-aba/validacao-tipos-caracteres-nome.spec.ts`

**Steps:**
  1. Navegar para `/o/${getOrgId()}/panels/new`.
    - expect: Tela de criação é exibida.
  2. Preencher o campo 'Nome' com o valor `data.specialCharsName` ('Áéíóú ç ñ - _ . / 123 !@#').
    - expect: Campo exibe o valor digitado sem alteração visual (sem substituição ou remoção de caracteres).
  3. Clicar em 'Salvar' (`getByTestId('panel-form-save-button')`).
    - expect: Painel é salvo com o nome exato '`data.specialCharsName`'.
    - expect: Sistema redireciona para `/panels/{id}/edit` — heading do painel exibe o nome com caracteres especiais intactos.

#### 1.7. Validar exibição da aba inicial 'Nova aba' criada automaticamente

**File:** `projects/widgets/tests/features/adicionar-editar-aba/validar-aba-nova-aba-automatica.spec.ts`

**Steps:**
  1. Navegar para `/o/${getOrgId()}/panels/new` (painel em branco, ainda não salvo).
    - expect: Tela de criação é exibida com tab 'Identificação' ativa.
  2. Tentar clicar na tab 'Layouts' (`getByRole('tab', { name: 'Layouts' })`) — tab está desabilitada.
    - expect: Tab 'Layouts' tem atributo `disabled` — não é possível navegar para ela antes de salvar.
    - expect: `expect(getByRole('tab', { name: 'Layouts' })).toBeDisabled()` passa.
  3. Preencher campo 'Nome' com `data.panelName` e clicar em 'Salvar' (`getByTestId('panel-form-save-button')`).
    - expect: Sistema redireciona para `/panels/{id}/edit`.
    - expect: Tab 'Layouts' fica habilitada (não mais `[disabled]`).
  4. Clicar na tab 'Layouts'.
    - expect: Tab 'Layouts' fica selecionada.
    - expect: Aba 'Nova aba' é exibida na lista de abas do painel (`paragraph 'Nova aba'` visível dentro do tabpanel 'Layouts').

#### 1.8. Renomear aba existente via ícone de lápis

**File:** `projects/widgets/tests/features/adicionar-editar-aba/renomear-aba-icone-lapis.spec.ts`

**Steps:**
  1. Pré-condição: painel já salvo em edição. Navegar para `/o/${getOrgId()}/panels/{data.panelId}/edit?tab=layouts`. A aba 'Nova aba' está presente.
    - expect: Aba 'Nova aba' é exibida. `button 'Renomear'` com ícone `edit` está visível ao lado do nome da aba.
  2. Clicar no `button 'Renomear'` (ícone `edit`) ao lado de 'Nova aba' (`getByRole('button', { name: 'Renomear' })` escopo dentro do grupo de tabs).
    - expect: Modal Chakra abre com título 'Renomear aba' e subtítulo 'Altere o nome da aba selecionada'.
    - expect: Campo 'Nome da aba*' está visível com valor pré-preenchido 'Nova aba'.
    - expect: Botões 'Cancelar' e 'Renomear' estão visíveis no footer do modal.
  3. Limpar o campo 'Nome da aba' e preencher com `data.newTabName` ('Resumo Geral').
    - expect: Campo exibe 'Resumo Geral'.
  4. Clicar no botão 'Renomear' do modal (`getByRole('button', { name: 'Renomear' }).last()` — ou escopo no dialog).
    - expect: Modal é fechado.
    - expect: Aba é renomeada: `paragraph` que antes exibia 'Nova aba' agora exibe 'Resumo Geral'.
    - expect: Toast de sucesso é exibida com texto 'Aba renomeada com sucesso'. // REVISAR: confirmar texto exato do toast ao vivo no spec.

#### 1.9. Validar 255 caracteres para o 'Nome da aba'

**File:** `projects/widgets/tests/features/adicionar-editar-aba/validar-limite-nome-aba-255.spec.ts`

**Steps:**
  1. Pré-condição: painel já salvo, aba 'Nova aba' presente. Navegar para `?tab=layouts`.
    - expect: Aba 'Nova aba' é exibida.
  2. Clicar em 'Renomear', aguardar modal abrir.
    - expect: Modal 'Renomear aba' é exibido com campo 'Nome da aba*'.
  3. Limpar o campo e preencher com `data.name255Chars` (string de exatamente 255 caracteres).
    - expect: Campo aceita os 255 caracteres — `expect(input).toHaveValue(data.name255Chars)`.
  4. Clicar em 'Renomear'.
    - expect: Modal fecha. Toast 'Aba renomeada com sucesso' exibida.
    - expect: Aba renomeada com os 255 caracteres.
  5. Abrir modal 'Renomear' novamente. Tentar acrescentar um 256° caractere ao valor atual.
    - expect: Campo não aceita mais que 255 caracteres (`maxLength=255`). Valor permanece com 255 chars.
    - expect: `expect(input.value.length).toBe(255)` após tentativa de fill com 256 chars.

#### 1.10. Cancelar renomeação de aba

**File:** `projects/widgets/tests/features/adicionar-editar-aba/cancelar-renomeacao-aba.spec.ts`

**Steps:**
  1. Pré-condição: painel já salvo com aba renomeada 'Resumo Geral' (ou reutilizar setup do TC8). Navegar para `?tab=layouts`.
    - expect: Aba 'Resumo Geral' é exibida.
  2. Clicar em 'Renomear' ao lado de 'Resumo Geral'.
    - expect: Modal 'Renomear aba' é exibido.
  3. Preencher o campo 'Nome da aba' com 'Outro nome'.
    - expect: Campo exibe 'Outro nome'.
  4. Clicar em 'Cancelar' (`getByRole('button', { name: 'Cancelar' })` escopo no dialog).
    - expect: Modal é fechado.
    - expect: Nome da aba permanece 'Resumo Geral' (não alterado para 'Outro nome').
    - expect: `expect(getByText('Resumo Geral')).toBeVisible()` dentro do tabpanel 'Layouts'.

#### 1.11. Adicionar nova aba via opção 'Criar nova aba'

**File:** `projects/widgets/tests/features/adicionar-editar-aba/adicionar-nova-aba-criar.spec.ts`

**Steps:**
  1. Pré-condição: painel já salvo. Navegar para `?tab=layouts`.
    - expect: Aba existente ('Nova aba' ou similar) é exibida na lista de abas.
  2. Clicar no botão 'Adicionar aba' (`getByTestId('tabs-navigation-add-button')`).
    - expect: Modal 'Adicionar nova aba' abre com título 'Adicionar nova aba' e subtítulo 'Escolha como deseja criar a nova aba'.
    - expect: Opção 'Criar nova aba' visível com ícone `add` e descrição 'Crie uma nova aba vazia e adicione widgets manualmente'.
    - expect: Opção 'Importar de outro painel' visível com ícone `download`.
    - expect: Botão 'Cancelar' visível no footer.
  3. Verificar o botão da opção 'Criar nova aba' (`getByTestId('add-tab-type-modal-create-new-button')`).
    - expect: Ícone `add` é exibido.
    - expect: Texto 'Criar nova aba' e 'Crie uma nova aba vazia e adicione widgets manualmente' são visíveis.
  4. Clicar na opção 'Criar nova aba' (`getByTestId('add-tab-type-modal-create-new-button')`).
    - expect: Modal avança para step 2 com título 'Adicionar nova aba' e subtítulo 'Crie uma nova aba vazia'.
    - expect: Campo 'Nome da aba*' visível com placeholder 'Digite o nome da aba'.
    - expect: Campo 'Categoria*' visível como select com opção padrão 'Aprendizagem'.
    - expect: Botões 'Voltar' (`create-tab-modal-back-button`), 'Cancelar' (`create-tab-modal-cancel-button`), 'Criar aba' (`create-tab-modal-create-button`, disabled) visíveis.
  5. Preencher 'Nome da aba' com `data.newTabName` ('Engajamento').
    - expect: Campo exibe 'Engajamento'. Botão 'Criar aba' fica habilitado.
  6. Selecionar 'Aprendizagem' no dropdown 'Categoria' (já selecionado por padrão — verificar com `selectOption('0')` se necessário).
    - expect: Opção 'Aprendizagem' está selecionada no select.
  7. Clicar em 'Criar aba' (`getByTestId('create-tab-modal-create-button')`).
    - expect: Modal é fechado.
    - expect: Nova aba 'Engajamento' aparece na lista de abas do painel.
    - expect: Aba 'Engajamento' fica ativa/selecionada para edição.

#### 1.12. Cancelar criação de nova aba a partir da seleção de tipo

**File:** `projects/widgets/tests/features/adicionar-editar-aba/cancelar-criacao-nova-aba.spec.ts`

**Steps:**
  1. Pré-condição: painel já salvo. Navegar para `?tab=layouts`.
    - expect: Aba existente é exibida.
  2. Clicar em 'Adicionar aba' (`getByTestId('tabs-navigation-add-button')`).
    - expect: Modal 'Adicionar nova aba' é exibido com seleção de tipo.
  3. Fechar o modal pelo botão 'X' (Close) — `getByRole('button', { name: 'Close' })` escopo no dialog.
    - expect: Modal é fechado.
    - expect: Nenhuma aba nova é criada — count de abas permanece o mesmo.
  4. Abrir o modal novamente. Clicar fora do modal (overlay).
    - expect: Modal é fechado (Chakra fecha ao clicar no overlay por padrão).
    - expect: Nenhuma aba nova é criada.
  5. Abrir o modal novamente. Clicar no botão 'Cancelar' (`getByTestId('add-tab-type-modal-cancel-button')`).
    - expect: Modal é fechado.
    - expect: Nenhuma aba nova é criada.

#### 1.13. Voltar do step 'Criar nova aba' para a seleção de tipo

**File:** `projects/widgets/tests/features/adicionar-editar-aba/voltar-step-criar-nova-aba.spec.ts`

**Steps:**
  1. Pré-condição: painel já salvo. Navegar para `?tab=layouts`. Clicar em 'Adicionar aba'.
    - expect: Modal 'Adicionar nova aba' exibido (seleção de tipo).
  2. Clicar em 'Criar nova aba' (`getByTestId('add-tab-type-modal-create-new-button')`).
    - expect: Modal avança para step 2 de criação com campos 'Nome da aba' e 'Categoria'.
  3. Clicar no botão 'Voltar' (`getByTestId('create-tab-modal-back-button')`).
    - expect: Modal retorna ao step de seleção com título 'Adicionar nova aba' e subtítulo 'Escolha como deseja criar a nova aba'.
    - expect: Opções 'Criar nova aba' e 'Importar de outro painel' visíveis novamente.

#### 1.14. Excluir aba quando há mais de uma aba

**File:** `projects/widgets/tests/features/adicionar-editar-aba/excluir-aba-multiplas-abas.spec.ts`

**Steps:**
  1. Pré-condição: painel já salvo com duas abas ('Aba A' e 'Aba B' — criadas via `painelForm.addTab()` no beforeAll). Navegar para `?tab=layouts`.
    - expect: Abas 'Aba A' e 'Aba B' exibidas na lista.
    - expect: Ícone 'Excluir' (`button 'Excluir'`) está habilitado para as duas abas (não disabled).
  2. Clicar no ícone 'Excluir' (`getByRole('button', { name: 'Excluir' })`) da aba 'Aba B' — escopado dentro do grupo da aba 'Aba B'.
    - expect: // REVISAR: verificar se aparece modal de confirmação de exclusão ou se a aba é removida imediatamente. Explorar ao vivo no spec.
    - expect: Aba 'Aba B' é removida da lista.
    - expect: Aba 'Aba A' fica ativa.
  3. Verificar o ícone 'Excluir' na aba restante 'Aba A'.
    - expect: Botão 'Excluir' está disabled (`[disabled]`) — ícone presente mas desabilitado porque é a única aba restante.
    - expect: `expect(getByRole('button', { name: 'Excluir' })).toBeDisabled()` passa.

#### 1.15. Tentar excluir aba quando há apenas uma aba

**File:** `projects/widgets/tests/features/adicionar-editar-aba/tentar-excluir-aba-unica.spec.ts`

**Steps:**
  1. Pré-condição: painel já salvo com apenas uma aba ('Nova aba'). Navegar para `?tab=layouts`.
    - expect: 'Nova aba' é exibida como única aba na lista.
  2. Verificar presença e estado do ícone 'Excluir' na aba 'Nova aba' (`getByRole('button', { name: 'Excluir' })`).
    - expect: Botão 'Excluir' está disabled (`[disabled]`). Confirmado via exploração live: `button 'Excluir' [disabled]` com ícone `delete`.
    - expect: `expect(getByRole('button', { name: 'Excluir' })).toBeDisabled()` passa.
  3. Verificar presença e estado do ícone 'Renomear' (lápis) na aba 'Nova aba' (`getByRole('button', { name: 'Renomear' })`).
    - expect: Botão 'Renomear' está habilitado (não disabled).
    - expect: `expect(getByRole('button', { name: 'Renomear' })).toBeEnabled()` passa.

#### 1.16. Modal padrão de confirmação ao alternar abas com alterações não salvas

**File:** `projects/widgets/tests/features/adicionar-editar-aba/modal-confirmacao-alternar-abas.spec.ts`

**Steps:**
  1. Pré-condição: painel em edição com duas abas ('Aba A' com alterações não salvas e 'Aba B'). Estar na 'Aba A' com ao menos um widget adicionado ou modificado (estado dirty).
    - expect: Aba 'Aba A' exibida com alterações pendentes (estado dirty no componente de layout).
  2. Clicar na 'Aba B' (`paragraph` com texto 'Aba B' dentro da lista de abas, `[cursor=pointer]`).
    - expect: Modal padrão de confirmação é exibido perguntando se deseja salvar as alterações. // REVISAR: verificar texto exato e estrutura do modal ao vivo — pode ser Chakra AlertDialog ou Dialog customizado.
  3. Clicar no botão 'Sim, salvar' do modal (// REVISAR: confirmar nome exato do botão no modal ao vivo).
    - expect: Alterações são salvas.
    - expect: Modal é fechado.
    - expect: 'Aba B' fica ativa/selecionada.

#### 1.17. Modal de confirmação do navegador ao sair com alterações não salvas

**File:** `projects/widgets/tests/features/adicionar-editar-aba/modal-navegador-alteracoes-nao-salvas.spec.ts`

**Steps:**
  1. Pré-condição: painel em edição com alterações não salvas (campo Nome modificado sem salvar). Navegar para tela de edição.
    - expect: Tela de edição é exibida com estado dirty.
  2. Simular navegação para fora via `page.goBack()` ou listener `page.on('dialog', ...)` + `await page.goBack()`.
    - expect: Prompt nativo do navegador (BeforeUnload) é exibido perguntando se deseja sair sem salvar.
    - expect: // REVISAR: o comportamento de `beforeunload` em Playwright requer tratamento via `page.on('dialog', handler)` + `dialog.accept()` ou `dialog.dismiss()`. O spec deve registrar o handler antes da ação de navegação.
  3. Cancelar o prompt do navegador (`dialog.dismiss()` no handler).
    - expect: Usuário permanece na tela de edição.
    - expect: `expect(page).toHaveURL(/\/panels\/\d+\/edit/)` após dismissar.

#### 1.18. Validar acessibilidade por teclado ao criar aba

**File:** `projects/widgets/tests/features/adicionar-editar-aba/acessibilidade-teclado-criar-aba.spec.ts`

**Steps:**
  1. Pré-condição: painel em edição na aba 'Layouts'. Abrir modal 'Adicionar nova aba' clicando em 'Adicionar aba' (`getByTestId('tabs-navigation-add-button')`).
    - expect: Modal 'Adicionar nova aba' (seleção de tipo) é exibido.
  2. Pressionar a tecla 'Tab' repetidamente para percorrer os elementos focáveis do modal.
    - expect: Foco percorre os elementos em ordem lógica: opção 'Criar nova aba' → opção 'Importar de outro painel' → botão 'Cancelar' → (cicla).
    - expect: `expect(element).toBeFocused()` para cada elemento na sequência de tabs.
  3. Com foco no botão 'Criar nova aba' (`getByTestId('add-tab-type-modal-create-new-button')`), pressionar 'Enter'.
    - expect: Modal avança para step 2 de criação ('Crie uma nova aba vazia' visível).
    - expect: Foco move-se para o campo 'Nome da aba'.
  4. Pressionar 'Esc'.
    - expect: // REVISAR: XML diz 'sistema retorna para a listagem', mas ao pressionar Esc em um modal Chakra, o comportamento esperado é fechar o modal (não navegar para a listagem). Comportamento correto: modal fecha e usuário permanece na tela de edição (Layouts).
    - expect: `expect(page).toHaveURL(/\?tab=layouts/)` após Esc.
