# Duplicar painéis — Plano de Testes

## Application Overview

Área "Duplicar painéis" do módulo Widgets da plataforma Twygo (ambiente staging-widgets, orgId 36988). A funcionalidade é acessada na listagem de Painéis (`/o/{orgId}/use_modes?tab=panels-tab`), na coluna de Ações de cada linha em modo Lista — ícone `content_copy` (data-icon="content_copy"). Ao clicar, a duplicação ocorre imediatamente sem modal de confirmação: o painel é criado como cópia INATIVA, aparece na primeira posição da listagem (ordenação por data decrescente), com toast "Painel duplicado com sucesso". Padrão de nome confirmado live (2026-05-12): sufixo ` (cópia)` (com acento em ó) concatenado ao nome original. Duplicar a cópia gera ` (cópia) (cópia)` — sem numeração sequencial. A UI NÃO possui ícone separado de "Inativar"; o controle de ativação é o switch (checkbox) na coluna "Ativo?" da listagem, mapeado em `PaineisListPage.toggleActiveByName()`. Compartilhamento de painéis e o eixo "painéis próprios / provedora" são out-of-scope deste projeto (decisão de QA 2026-05-12); além disso, a feature de compartilhamento tampouco existe na UI atual (listagem tem apenas 3 ações: edit / content_copy / delete; form de edição tem apenas tabs Identificação e Layouts). Pré-condições globais garantidas pelo globalSetup + env `staging-widgets`: usuário logado como Admin, feature flag `habilitar_paineis_do_usuario` ativa, módulo Gestão de Painéis habilitado.

## Test Scenarios

### 1. Duplicar painéis

**Seed:** `projects/widgets/tests/features/ativar-inativar-painel/ativar-painel-inativo.spec.ts`

#### 1.1. Duplicar painel próprio com várias abas e widgets

**File:** `projects/widgets/tests/features/duplicar-paineis/duplicar-painel-varias-abas-widgets.spec.ts`

**Steps:**
  1. Pré-condição (beforeAll): criar painel 'Painel Original' via `painelFormPage.createPanel(data.panelName)` — retorna panelId. Navegar para edição de layouts via `painelFormPage.goToEdit(panelId, 'layouts')`. Criar 2 abas extras via `painelFormPage.addTab('Aba 2')` e `painelFormPage.addTab('Aba 3')` — totalizando 3 abas. Em cada aba, abrir drawer e adicionar widget via `painelFormPage.openWidgetDrawer()` + `painelFormPage.addWidget(id)` usando os 4 widgets disponíveis: `activity_summary` (aba 1), `in_progress_contents` (aba 2), `ranking` (aba 3), `my_certificates` (aba 3 — segundo widget). // REVISAR: XML pede 5 widgets mas Aprendizagem tem apenas 4 IDs disponíveis; o teste usa 4 widgets distribuídos em 3 abas.
    - expect: Painel criado e redirecionado para `/panels/{id}/edit`
    - expect: Abas 'Nova aba', 'Aba 2' e 'Aba 3' visíveis na navegação de layouts
    - expect: Widgets adicionados com sucesso em cada aba (grid não-vazio)
  2. Acessar a listagem de painéis via `paineisList.goToList()` + `paineisList.setViewMode('lista')`
    - expect: Listagem visível com a linha do 'Painel Original' presente: `paineisList.getRowByName(data.panelName)` está visível
  3. Clicar no ícone 'Duplicar' (content_copy) da linha do 'Painel Original' via `paineisList.getRowActionIcon(rowIdx, 'duplicar').click()` — ou via `paineisList.getRowByName(data.panelName).locator('[data-icon="content_copy"]').click()`
    - expect: Toast 'Painel duplicado com sucesso' exibido: `page.locator('.chakra-toast').filter({ hasText: 'Painel duplicado com sucesso' })` visível
    - expect: Linha `[Painel Original] (cópia)` aparece na listagem: `paineisList.getRowByName(data.copyName)` visível onde `data.copyName = data.panelName + ' (cópia)'`
    - expect: Cópia aparece antes do original na listagem (posição mais recente)
  4. Abrir o painel duplicado clicando no ícone 'Editar' da linha da cópia: `paineisList.getRowByName(data.copyName).locator('[data-icon="edit"]').click()`. Navegar para aba Layouts: aguardar redirect para `/panels/{copyId}/edit` e depois navegar com `painelFormPage.goToEdit(copyId, 'layouts')`
    - expect: Painel duplicado abre em modo de edição
    - expect: 3 abas visíveis na navegação de layouts do painel duplicado (mesmos nomes do original: 'Nova aba', 'Aba 2', 'Aba 3')
    - expect: Aba 1 ('Nova aba') contém widget 'Resumo de atividades': `painelFormPage.getWidgetGridTitle('Resumo de atividades')` visível
    - expect: Aba 2 ('Aba 2') contém widget 'Conteúdos em andamento': `painelFormPage.getWidgetGridTitle('Conteúdos em andamento')` visível após clicar na aba
    - expect: Aba 3 ('Aba 3') contém widgets 'Ranking' e 'Meus certificados': `painelFormPage.getGridItems()` tem count 2 após clicar na aba

#### 1.2. Duplicar painel ativo — status do painel duplicado

**File:** `projects/widgets/tests/features/duplicar-paineis/duplicar-painel-ativo-status-copia.spec.ts`

**Steps:**
  1. Pré-condição (beforeAll): criar painel via `paineisList.createPanel({ name: data.panelName })`. Navegar à listagem via `paineisList.goToList()` + `paineisList.setViewMode('lista')`. Garantir que o painel está ATIVO via `paineisList.ensureActive(data.panelName)`
    - expect: Painel `data.panelName` existe na listagem e switch 'Ativo?' está marcado (checked)
  2. Clicar no ícone 'Duplicar' da linha do painel via `paineisList.getRowByName(data.panelName).locator('[data-icon="content_copy"]').click()`
    - expect: Toast 'Painel duplicado com sucesso' exibido
    - expect: Linha `data.copyName` (`data.panelName + ' (cópia)'`) aparece na listagem
  3. Verificar o estado do switch 'Ativo?' da cópia via `paineisList.getRowActiveSwitchByName(data.copyName).isChecked()`
    - expect: Switch 'Ativo?' da cópia está DESMARCADO (not checked) — painel duplicado nasce INATIVO, independente do status do original. Confirmado live 2026-05-12: ao duplicar painel ativo, a cópia aparece sem `[checked]` no checkbox.
    - expect: Switch 'Ativo?' do original permanece MARCADO (checked) — a duplicação não altera o original

#### 1.3. Duplicar painel várias vezes

**File:** `projects/widgets/tests/features/duplicar-paineis/duplicar-painel-varias-vezes.spec.ts`

**Steps:**
  1. Pré-condição (beforeAll): criar painel via `paineisList.createPanel({ name: data.panelName })`. Navegar à listagem via `paineisList.goToList()` + `paineisList.setViewMode('lista')`
    - expect: Painel `data.panelName` visível na listagem
  2. Primeira duplicação: clicar no ícone 'Duplicar' da linha do painel original
    - expect: Toast 'Painel duplicado com sucesso' exibido
    - expect: Linha `data.copyName` (`data.panelName + ' (cópia)'`) aparece na listagem: `paineisList.getRowByName(data.copyName)` visível
  3. Segunda duplicação: clicar no ícone 'Duplicar' da linha da primeira cópia (`data.copyName`)
    - expect: Toast 'Painel duplicado com sucesso' exibido novamente
    - expect: Linha `data.copy2Name` (`data.panelName + ' (cópia) (cópia)'`) aparece na listagem: `paineisList.getRowByName(data.copy2Name)` visível
    - expect: Três linhas distintas presentes: original, cópia 1 e cópia 2 — todos com nomes únicos
    - expect: O padrão de nomenclatura concatena ' (cópia)' a cada duplicação sem numeração sequencial (não gera ' (2)' ou similar) — confirmado live 2026-05-12

#### 1.4. Editar painel duplicado

**File:** `projects/widgets/tests/features/duplicar-paineis/editar-painel-duplicado.spec.ts`

**Steps:**
  1. Pré-condição (beforeAll): criar painel original via `paineisList.createPanel({ name: data.panelName })`. Navegar à listagem, duplicar o painel clicando no ícone 'Duplicar' da linha do original. Aguardar toast 'Painel duplicado com sucesso' e confirmar que `data.copyName` existe na listagem
    - expect: Painel original e cópia visíveis na listagem
  2. Clicar no ícone 'Editar' da linha da cópia (`data.copyName`) via `paineisList.getRowByName(data.copyName).locator('[data-icon="edit"]').click()`
    - expect: Navegação para `/panels/{copyId}/edit` — form de edição do painel duplicado é aberto
    - expect: Campo Nome exibe `data.copyName` (`data.panelName + ' (cópia)'`)
  3. Limpar o campo Nome e preencher com `data.editedName` ('Painel Editado'): `painelFormPage.getNomeInput().fill(data.editedName)`. Salvar via `painelFormPage.getSaveButton().click()`
    - expect: Salvo com sucesso — URL permanece em `/panels/{copyId}/edit` (não redireciona de volta para listagem)
    - expect: Campo Nome exibe `data.editedName` após salvar
  4. Navegar de volta à listagem via `paineisList.goToList()` + `paineisList.setViewMode('lista')`. Verificar os nomes presentes
    - expect: Linha com `data.editedName` ('Painel Editado') está visível: `paineisList.getRowByName(data.editedName)` presente
    - expect: Linha com `data.copyName` NÃO está mais visível (foi renomeada): `paineisList.getRowByName(data.copyName)` tem count 0
    - expect: Linha com `data.panelName` (original) permanece inalterada: `paineisList.getRowByName(data.panelName)` visível — a edição da cópia não afeta o original

#### 1.5. Excluir painel duplicado

**File:** `projects/widgets/tests/features/duplicar-paineis/excluir-painel-duplicado.spec.ts`

**Steps:**
  1. Pré-condição (beforeAll): criar painel original via `paineisList.createPanel({ name: data.panelName })`. Navegar à listagem, duplicar o painel. Aguardar toast e confirmar que `data.copyName` existe na listagem
    - expect: Painel original e cópia visíveis na listagem
  2. Clicar no ícone 'Excluir' (delete) da linha da cópia via `paineisList.getRowByName(data.copyName).locator('[data-icon="delete"]').click()`
    - expect: Modal de confirmação de exclusão exibido: `paineisList.getDeleteConfirmModal()` (role='alertdialog') está visível
  3. Confirmar a exclusão clicando em `paineisList.getDeleteConfirmButton().click()` (`#panels-delete-confirm-button`)
    - expect: Modal fecha
    - expect: Linha da cópia `data.copyName` desaparece da listagem: `paineisList.getRowByName(data.copyName)` tem count 0
    - expect: Linha do painel original `data.panelName` permanece visível — a exclusão da cópia não afeta o original

#### 1.6. Inativar painel duplicado

**File:** `projects/widgets/tests/features/duplicar-paineis/inativar-painel-duplicado.spec.ts`

**Steps:**
  1. Pré-condição (beforeAll): criar painel original via `paineisList.createPanel({ name: data.panelName })`. Navegar à listagem, duplicar o painel. Confirmar que `data.copyName` existe. // NOTA SOBRE TC6: a UI NÃO possui ícone 'Inativar' separado conforme observado live 2026-05-12; o controle de ativação é o switch checkbox na coluna 'Ativo?' — já mapeado em `PaineisListPage`. O painel duplicado já nasce INATIVO — este TC valida que é possível ativá-lo E depois inativá-lo.
    - expect: Painel original e cópia visíveis na listagem
    - expect: Switch 'Ativo?' da cópia está DESMARCADO (cópia nasce inativa)
  2. Ativar o painel duplicado via `paineisList.toggleActiveByName(data.copyName)`. Aguardar mudança de estado.
    - expect: Switch 'Ativo?' da cópia fica MARCADO (checked): `paineisList.getRowActiveSwitchByName(data.copyName)` isChecked() === true
  3. Inativar o painel duplicado via `paineisList.toggleActiveByName(data.copyName)`. Aguardar mudança de estado.
    - expect: Switch 'Ativo?' da cópia fica DESMARCADO (not checked): `paineisList.getRowActiveSwitchByName(data.copyName)` isChecked() === false
    - expect: Painel inativado com sucesso — sem modal de bloqueio (painel duplicado não está associado a menus)

#### 1.7. Compartilhar painel duplicado — REMOVIDO (out-of-scope)

TC removido em 2026-05-12 por decisão de escopo do projeto: compartilhamento
e painéis próprios/provedores não fazem parte deste escopo de QA. A
funcionalidade tampouco existe na UI atual.
