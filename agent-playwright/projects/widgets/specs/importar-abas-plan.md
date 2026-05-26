# Importar abas — Plano de Testes

## Application Overview

Plano de testes para a testsuite "Importar abas" do módulo Painéis Widgets (Twygo). Cobre 11 testcases relativos ao fluxo de importar uma aba existente de outro painel para o painel em edição. Exploração live realizada em 2026-05-12 no env `staging-widgets` (org 36988, host https://widgets.stage.twygoead.com). Confirmações de data-test-ids do modal obtidas via DOM inspection ao vivo. Os painéis "Painel Origem" e "Painel Vazio" NÃO existem no env por nome — cada spec DEVE criar seu próprio painel de origem inline. Para gerar código, o generator DEVE ler CLAUDE.md §7.5 e §7.6 (anti-patterns A–E) antes de gerar qualquer spec.

ANTI-PATTERNS PROIBIDOS (CLAUDE.md §7.6):
- A: Nunca fazer login no spec — storageState já cobre.
- B: Nunca hardcodar URL/orgId — usar getOrgId() de src/utils/environment.ts.
- C: Nunca criar inline helpers de UI dentro do test() — métodos novos vão em PainelFormPage.ts.
- D: Comentários só justificam WHY, nunca WHAT.
- E: Constantes-de-domínio em arquivos .data.ts adjacentes ao spec, nunca inline.

CONTEXTO DE SELETORES (validado via DOM live em 2026-05-12):
Modal step 1 — Seleção de tipo (já coberto em PainelFormPage.ts):
- `add-tab-type-modal-create-new-button` — opção Criar nova aba
- `add-tab-type-modal-import-button` — opção Importar de outro painel
- `add-tab-type-modal-cancel-button` — Cancelar

Modal step 2 — Importar de outro painel (NOVO, não está em PainelFormPage.ts):
- `import-tab-modal-close-button` — botão X (fechar)
- `import-tab-modal-panel-select` — wrapper div do react-select "Painel de origem*"
- `import-tab-modal-tab-select` — wrapper div do react-select "Aba disponível*" (aparece somente após painel selecionado)
- `import-tab-modal-back-button` — botão Voltar (arrow_back)
- `import-tab-modal-cancel-button` — botão Cancelar
- `import-tab-modal-import-button` — botão "Importar aba" (disabled até painel+aba selecionados)
- // REVISAR: data-test-ids de "Nome da nova aba" input, "Categoria" select e área de preview não confirmados live (aparecem após seleção de aba). Inspecionar DOM durante geração.

COMPORTAMENTO CONFIRMADO LIVE:
- Título step 2: "Adicionar nova aba", Subtítulo: "Importe uma aba de outro painel"
- Campo "Aba disponível" NÃO aparece antes de painel selecionado
- "Nenhuma aba encontrada" aparece quando o painel selecionado tem apenas a aba padrão "Nova aba" (sem abas explicitamente criadas via addTab)
- "Importar aba" permanece disabled até AMBOS painel E aba estarem selecionados
- O react-select "Painel de origem" usa labels genéricos internos (ex: "Painel 1"), não os nomes reais — interagir via getByTestId('import-tab-modal-panel-select') + locator dentro dele pelo texto visível do painel criado no spec

PADRÃO DE SETUP OBRIGATÓRIO para TCs que precisam de Painel Origem:
1. Criar "Painel Origem" via painelForm.goToNew() + createPanel(data.sourcePanelName)
2. Abrir Layouts + addTab(data.tabX) + addWidget(...) para "Aba X" 
3. addTab(data.tabY) + addWidget(...) para "Aba Y"
4. getSaveLayoutButton().click() e aguardar toast/confirmação
5. Criar "Painel Destino" via goToNew() + createPanel(data.destPanelName)
6. Abrir Layouts do Painel Destino e testar o fluxo de importação

## Test Scenarios

### 1. Importar abas

**Seed:** `projects/widgets/tests/features/listagem-de-paineis/validar-componentes-obrigatorios.spec.ts`

#### 1.1. Acessar o fluxo de Importar de outro painel

**File:** `projects/widgets/tests/features/importar-abas/acessar-fluxo-importar-painel.spec.ts`

**Steps:**
  1. Pré-condição: criar Painel Destino via `painelForm.goToNew()` + `createPanel(data.destPanelName)`. Abrir tab Layouts via `getLayoutsTab().click()`. Os dados de nome são importados de `acessar-fluxo-importar-painel.data.ts` (anti-pattern E — sem inline).
    - expect: Layouts tab visível com aba padrão 'Nova aba'.
    - expect: Botão 'Adicionar aba' (`data-test-id='tabs-navigation-add-button'`) está visível.
  2. Clicar no botão 'Adicionar aba' (`painelForm.getAddTabButton().click()`).
    - expect: Modal 'Adicionar nova aba' abre.
    - expect: Título 'Adicionar nova aba' visível (`paragraph` dentro do banner).
    - expect: Subtítulo 'Escolha como deseja criar a nova aba' visível.
    - expect: Opção 'Criar nova aba' (`data-test-id='add-tab-type-modal-create-new-button'`) visível.
    - expect: Opção 'Importar de outro painel' (`data-test-id='add-tab-type-modal-import-button'`) visível.
    - expect: Botão 'Cancelar' (`data-test-id='add-tab-type-modal-cancel-button'`) visível.
  3. Verificar que a opção 'Importar de outro painel' existe e exibe texto de descrição.
    - expect: Botão `add-tab-type-modal-import-button` contém texto 'Importar de outro painel'.
    - expect: Subtexto 'Reutilize uma aba existente de outro painel' visível dentro do botão.
    - expect: Ícone `download` visível no botão.
  4. Clicar em 'Importar de outro painel' (`painelForm.getImportTabOption().click()`).
    - expect: Modal avança para step 2.
    - expect: Título permanece 'Adicionar nova aba' (mesmo dialog).
    - expect: Novo subtítulo 'Importe uma aba de outro painel' visível.
    - expect: Campo 'Painel de origem*' (`data-test-id='import-tab-modal-panel-select'`) visível com placeholder 'Selecione um painel...'.
    - expect: Campo 'Aba disponível' NÃO é exibido antes de painel ser selecionado.
    - expect: // REVISAR: confirmar se 'Nome da nova aba' e 'Categoria' também NÃO aparecem antes de seleção de aba.
    - expect: Nenhum preview é exibido antes de selecionar painel de origem.
  5. Verificar botões do step 2.
    - expect: Botão 'Voltar' (`data-test-id='import-tab-modal-back-button'`) visível com ícone `arrow_back`.
    - expect: Botão 'Cancelar' (`data-test-id='import-tab-modal-cancel-button'`) visível.
    - expect: Botão 'Importar aba' (`data-test-id='import-tab-modal-import-button'`) visível e DISABLED (antes de seleção completa).

#### 1.2. Selecionar painel de origem e listar abas disponíveis

**File:** `projects/widgets/tests/features/importar-abas/selecionar-painel-origem-listar-abas.spec.ts`

**Steps:**
  1. Pré-condição: criar Painel Origem via `painelForm.goToNew()` + `createPanel(data.sourcePanelName)`. Abrir Layouts. Criar 'Aba X' via `addTab(data.tabXName)`. Abrir drawer de widgets e adicionar `data.tabXWidgets[0]` + `data.tabXWidgets[1]`. Salvar layout (`getSaveLayoutButton().click()`). Criar 'Aba Y' via `addTab(data.tabYName)`. Adicionar `data.tabYWidgets[0]`, `data.tabYWidgets[1]`, `data.tabYWidgets[2]`. Salvar layout. Anotar panelId retornado pelo `createPanel`. Todos os nomes e widget IDs em `selecionar-painel-origem-listar-abas.data.ts` (anti-pattern E).
    - expect: Painel Origem criado com 'Aba X' (2 widgets) e 'Aba Y' (3 widgets) e layout salvo.
  2. Criar Painel Destino via `painelForm.goToNew()` + `createPanel(data.destPanelName)`. Abrir Layouts. Clicar 'Adicionar aba' + 'Importar de outro painel' para abrir step 2 do modal.
    - expect: Modal step 2 aberto com campo 'Painel de origem*' visível.
  3. Selecionar `data.sourcePanelName` no react-select 'Painel de origem' (`painelForm.selectSourcePanel(data.sourcePanelName)` — novo método em PainelFormPage.ts).
    - expect: Campo 'Aba disponível*' (`data-test-id='import-tab-modal-tab-select'`) aparece após seleção do painel.
    - expect: Dropdown 'Aba disponível' lista 'Aba X (2 widgets)' e 'Aba Y (3 widgets)' como opções (// REVISAR: formato exato do texto da opção — pode ser 'Aba X' sem contagem, verificar DOM live durante geração).
    - expect: Campo 'Aba disponível' tem placeholder 'Selecione uma aba...' antes da seleção.

#### 1.3. Visualizar preview da aba selecionada

**File:** `projects/widgets/tests/features/importar-abas/visualizar-preview-aba.spec.ts`

**Steps:**
  1. Pré-condição: mesma setup do TC2 (Painel Origem com Aba X / 2 widgets + Aba Y / 3 widgets, Painel Destino aberto no step 2 do modal de importar com Painel Origem já selecionado). Dados em `visualizar-preview-aba.data.ts`.
    - expect: Modal step 2 com Painel Origem selecionado, campo 'Aba disponível' visível.
  2. Selecionar 'Aba X' no react-select 'Aba disponível' (`painelForm.selectSourceTab(data.tabXName)` — novo método).
    - expect: Preview da aba aparece no modal após seleção (// REVISAR: verificar data-test-id da área de preview durante geração — provável `import-tab-modal-preview` ou similar).
    - expect: Preview exibe nome da aba selecionada ('Aba X').
    - expect: Preview exibe quantidade de widgets (2 widgets).
    - expect: Preview exibe lista dos widgets contidos na aba (nomes dos widgets adicionados).
    - expect: Campo 'Nome da nova aba' aparece auto-preenchido com o nome original 'Aba X' (// REVISAR: data-test-id do campo).
    - expect: Campo 'Categoria' aparece com opção padrão selecionada (// REVISAR: data-test-id e valor padrão).

#### 1.4. Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres

**File:** `projects/widgets/tests/features/importar-abas/auto-preencher-nome-aba-importada.spec.ts`

**Steps:**
  1. Pré-condição: modal step 2 aberto, Painel Origem e 'Aba X' selecionados. Dados em `auto-preencher-nome-aba-importada.data.ts`.
    - expect: Campo 'Nome da nova aba' visível e auto-preenchido com 'Aba X'.
  2. Verificar que o preview está exibido após a seleção da aba.
    - expect: Preview visível (// REVISAR: locator da área de preview).
    - expect: Botão 'Importar aba' (`data-test-id='import-tab-modal-import-button'`) está ENABLED após painel + aba selecionados.
  3. Verificar auto-preenchimento: campo 'Nome da nova aba' contém 'Aba X' (`expect(input).toHaveValue(data.tabXName)`).
    - expect: Campo aceita e exibe o valor 'Aba X' — confirmado como auto-preenchido.
  4. Limpar o campo 'Nome da nova aba' e preencher com `data.newTabName` ('Aba Importada') (// REVISAR: locator do input — provável getByTestId('import-tab-modal-tab-name-input') ou getByLabel('Nome da nova aba')).
    - expect: Campo aceita a edição e exibe 'Aba Importada'.
  5. Limpar o campo e tentar preencher com `data.name256Chars` (string de 256 caracteres).
    - expect: Campo aceita no máximo 255 caracteres (`maxLength=255` ou truncamento aplicado).
    - expect: `expect(input).toHaveValue(data.name255Chars)` após tentativa com 256 chars.

#### 1.5. Selecionar Categoria na importação

**File:** `projects/widgets/tests/features/importar-abas/selecionar-categoria-importacao.spec.ts`

**Steps:**
  1. Pré-condição: modal step 2 aberto, Painel Origem selecionado. Dados em `selecionar-categoria-importacao.data.ts`.
    - expect: Campo 'Painel de origem' preenchido.
  2. Selecionar `data.sourcePanelName` e `data.tabXName` no modal. Aguardar campo 'Categoria' ficar visível.
    - expect: Campo 'Categoria' (// REVISAR: data-test-id — provável `import-tab-modal-category-select`) exibido após aba selecionada.
    - expect: Dropdown 'Categoria' visível.
  3. Selecionar 'Aprendizagem' no dropdown 'Categoria' (`painelForm.selectImportCategory('Aprendizagem')` — novo método).
    - expect: Opção 'Aprendizagem' fica selecionada no campo 'Categoria'.
    - expect: Botão 'Importar aba' permanece habilitado após troca de categoria.

#### 1.6. Importar aba (happy path)

**File:** `projects/widgets/tests/features/importar-abas/importar-aba-happy-path.spec.ts`

**Steps:**
  1. Pré-condição: Painel Origem com 'Aba X' contendo 2 widgets criada e salva. Painel Destino aberto em Layouts. Modal step 2 aberto, `data.sourcePanelName` + 'Aba X' selecionados, campo 'Nome da nova aba' editado para `data.importedTabName` ('Aba Importada'). Dados em `importar-aba-happy-path.data.ts`.
    - expect: Modal step 2 preenchido: painel, aba, nome editado. Botão 'Importar aba' habilitado.
  2. Clicar no botão 'Importar aba' (`painelForm.getImportTabButton().click()` — novo getter).
    - expect: Modal fecha (`painelForm.getAddTabModal().waitFor({ state: 'hidden' })`).
    - expect: Nova aba `data.importedTabName` ('Aba Importada') aparece na lista de abas do Painel Destino (paragraph visível dentro do tabpanel Layouts).
    - expect: Aba importada fica ativa/selecionada.
    - expect: Toast de sucesso exibido com texto 'Aba importada com sucesso' (`painelForm.getToast('Aba importada com sucesso')`). // REVISAR: confirmar texto exato do toast durante geração.
  3. Verificar que a aba importada contém os widgets copiados da 'Aba X' do Painel Origem.
    - expect: Grid da aba 'Aba Importada' exibe 2 widgets (`expect(painelForm.getGridItems()).toHaveCount(2)`).
    - expect: Títulos dos widgets correspondem aos da 'Aba X' original.

#### 1.7. Voltar do step de importação para a seleção de tipo

**File:** `projects/widgets/tests/features/importar-abas/voltar-step-importacao.spec.ts`

**Steps:**
  1. Pré-condição: qualquer painel em edição com Layouts. Abrir modal 'Adicionar nova aba' e clicar 'Importar de outro painel' para chegar ao step 2. Dados em `voltar-step-importacao.data.ts`.
    - expect: Modal exibe step 2 (título 'Adicionar nova aba', subtítulo 'Importe uma aba de outro painel', campo 'Painel de origem' visível).
  2. Clicar no botão 'Voltar' (`painelForm.getImportTabBackButton().click()` — novo getter via `data-test-id='import-tab-modal-back-button'`).
    - expect: Modal retorna ao step 1 (seleção de tipo).
    - expect: Subtítulo volta para 'Escolha como deseja criar a nova aba' (ou 'Adicionar nova aba' com as 2 opções).
    - expect: Opções 'Criar nova aba' (`add-tab-type-modal-create-new-button`) e 'Importar de outro painel' (`add-tab-type-modal-import-button`) ficam visíveis novamente.
    - expect: Botão 'Cancelar' (`add-tab-type-modal-cancel-button`) visível.

#### 1.8. Cancelar importação

**File:** `projects/widgets/tests/features/importar-abas/cancelar-importacao.spec.ts`

**Steps:**
  1. Pré-condição: qualquer painel em edição, Layouts aberto. Abrir modal step 2 de importar. Preencher campos 'Painel de origem' e 'Aba disponível' com valores disponíveis (mesmo que retorne 'Nenhuma aba encontrada' — basta estar no step 2). Dados em `cancelar-importacao.data.ts`.
    - expect: Modal step 2 visível com campos preenchidos (ou com estado vazio se nenhuma aba disponível).
  2. Anotar o count de abas atual na lista de abas antes de cancelar (`const tabCountBefore = await painelForm.getTabChip(...).count()` ou similar).
    - expect: Count de abas registrado como baseline.
  3. Clicar no botão 'Cancelar' (`painelForm.getImportTabCancelButton().click()` — novo getter via `data-test-id='import-tab-modal-cancel-button'`).
    - expect: Modal fecha (`expect(painelForm.getAddTabModal()).toBeHidden()`).
    - expect: Nenhuma aba nova é criada — count de abas permanece igual ao baseline.
    - expect: Layout do painel não foi alterado.

#### 1.9. Tentar importar sem selecionar painel de origem

**File:** `projects/widgets/tests/features/importar-abas/tentar-importar-sem-painel.spec.ts`

**Steps:**
  1. Pré-condição: qualquer painel em edição, Layouts aberto. Abrir modal step 2 de importar SEM selecionar painel de origem. Dados em `tentar-importar-sem-painel.data.ts`.
    - expect: Modal step 2 aberto com campo 'Painel de origem' vazio (placeholder 'Selecione um painel...' visível).
  2. Verificar estado dos campos antes de selecionar painel.
    - expect: Campo 'Aba disponível' (`data-test-id='import-tab-modal-tab-select'`) NÃO é exibido enquanto 'Painel de origem' estiver vazio.
    - expect: // REVISAR: verificar se 'Nome da nova aba' e 'Categoria' também ficam ocultos.
  3. Verificar estado do botão 'Importar aba' sem painel selecionado.
    - expect: Botão 'Importar aba' (`data-test-id='import-tab-modal-import-button'`) está DISABLED (`expect(btn).toBeDisabled()`).
    - expect: Não é possível submeter o form sem painel selecionado.

#### 1.10. Importar aba com painel sem abas disponíveis

**File:** `projects/widgets/tests/features/importar-abas/importar-painel-sem-abas.spec.ts`

**Steps:**
  1. NOTA: `test.fixme(true, 'Todos os painéis no env staging-widgets que têm apenas a aba padrão Nova aba mostram Nenhuma aba encontrada no dropdown Aba disponível. A UI cria Nova aba automaticamente ao criar painel, e ela não aparece como opção importável. Confirmar com dev se painel com apenas Nova aba é o equivalente de painel sem abas para fins desta funcionalidade, ou se existe outro estado possível.')` aplicado ao test body.
    - expect: Test marcado com fixme e justificativa clara.
  2. Se o fixme for removido: pré-condição seria criar Painel Vazio sem abas explícitas. Abrir modal step 2. Selecionar Painel Vazio no campo 'Painel de origem'.
    - expect: Campo 'Aba disponível' exibe estado vazio com mensagem 'Nenhuma aba encontrada' (confirmado live: listbox react-select exibe esse texto).
    - expect: Botão 'Importar aba' permanece DISABLED.

#### 1.11. Editar aba importada

**File:** `projects/widgets/tests/features/importar-abas/editar-aba-importada.spec.ts`

**Steps:**
  1. Pré-condição: executar happy path do TC6 para criar uma aba importada. O painel destino tem a aba 'Aba Importada' criada pelo TC6. Abrir o painel destino via `painelForm.goToEdit(data.destPanelId, 'layouts')`. Dados em `editar-aba-importada.data.ts`.
    - expect: Aba 'Aba Importada' visível na lista de abas do Painel Destino.
    - expect: Botão 'Renomear' (ícone edit) habilitado para a aba importada.
  2. Renomear a aba importada: clicar em 'Renomear' da aba 'Aba Importada' (`painelForm.getRenameTabButton(data.importedTabName).click()`). Preencher novo nome `data.editedTabName`. Submeter.
    - expect: Modal 'Renomear aba' abre.
    - expect: Campo 'Nome da aba*' pré-preenchido com 'Aba Importada'.
    - expect: Após submeter, modal fecha e aba exibe o nome editado `data.editedTabName`.
    - expect: Toast de sucesso exibido. // REVISAR: confirmar texto exato 'Aba renomeada com sucesso'.
  3. Adicionar um widget à aba importada: clicar em 'Adicionar widget', selecionar `data.newWidgetId` do drawer.
    - expect: Widget `data.newWidgetId` adicionado ao grid da aba importada.
    - expect: Grid exibe widget recém-adicionado.
  4. Salvar layout (`painelForm.getSaveLayoutButton().click()`).
    - expect: Layout salvo com sucesso (toast ou redirect confirmando save). // REVISAR: confirmar comportamento após salvar layout com aba importada editada.
