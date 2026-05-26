# Listagem e Menu de Modelos

## Application Overview

Plano técnico Playwright para a testsuite "Listagem e Menu de Modelos" do projeto Twygo Modelos de conteúdo. Cobre 6 TCs que validam acesso à listagem via menu lateral, visualização padrão em Cards, alternância Cards/Lista, truncamento de Descrição com tooltip, redirecionamento do botão Adicionar e indicador de cor nos cards. Ambiente: staging-base-de-conhecimento (https://basedeconhecimento.stage.twygoead.com/). Feature flag `modelos_de_conteudo` ativada manualmente na org 37007. Suíte é 100% read-only — não há criação/alteração de estado persistente, portanto não há `afterAll` de cleanup necessário (confirmado pela análise dos passos: todos os TCs são navegação + asserção).

## Test Scenarios

### 1. Listagem e Menu de Modelos

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC1 — Acessar listagem via submenu Aprendizagem

**File:** `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc01-acessar-listagem-via-submenu-aprendizagem.spec.ts`

**Steps:**
  1. Pré-condições: storageState global carregado (globalSetup). Feature flag `modelos_de_conteudo` ativa na org 37007. Nenhum login no spec (Anti-pattern A). Criar instância de ContentModelsListPage que internamente usa `safeGoto` (dismissCommonModals incluso).
    - expect: Instância criada sem erro. storageState válido para https://basedeconhecimento.stage.twygoead.com/
  2. Navegar para `/play` usando `safeGoto(page, '/play')` via Page Object (ContentModelsListPage.goToPlay()). Aguardar URL conter '/play' com `await expect(page).toHaveURL(/\/play/, { timeout: 60_000 })`.
    - expect: Dashboard padrão carregado. URL contém '/play'. Menu lateral visível.
  3. Localizar e clicar no item 'Aprendizagem' no menu lateral. Seletor preferido: `page.getByRole('link', { name: /Aprendizagem/i })` OU `page.getByRole('button', { name: /Aprendizagem/i })`. // REVISAR: seletor não confirmado no recon — o recon captura os sub-itens mas não o item pai 'Aprendizagem' com role explícito. Verificar via DOM live se é <a>, <button> ou <div>.
    - expect: Submenu lateral expandido exibindo itens filhos de 'Aprendizagem'.
  4. Clicar no link 'Modelos de conteúdo' no submenu. Seletor do recon (confirmado): `page.getByRole('link', { name: /Modelos de conteúdo/ })`. O recon confirma: role=link, name='browse\n\n\nModelos de conteúdo'.
    - expect: Sistema redireciona para /o/{orgId}/content_models. URL contém 'content_models'. `await expect(page).toHaveURL(/content_models/, { timeout: 60_000 })`.
  5. Verificar breadcrumb 'Aprendizagem > Modelos de conteúdo'. Seletor: `page.getByText('Modelos de conteúdo')` dentro do breadcrumb. // REVISAR: seletor exato do breadcrumb não confirmado no recon — marcar com `allure.tag('REVIEW_NEEDED')` se não encontrado.
    - expect: Heading 'Modelos de conteúdo' visível (confirmado no recon: heading role com name 'Modelos de conteúdo'). `await expect(page.getByRole('heading', { name: 'Modelos de conteúdo' })).toBeVisible({ timeout: 60_000 })`.

#### 1.2. TC2 — Visualização padrão em Cards

**File:** `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc02-visualizacao-padrao-em-cards.spec.ts`

**Steps:**
  1. Pré-condições: storageState global. Pelo menos 1 modelo cadastrado na org 37007 (ativo ou inativo). // FIXME: seed ausente — se a org não tiver modelos, os TCs TC2/TC3/TC4/TC6 vão falhar em asserções de card. Confirmar com QA Lead se há modelos seedados.
    - expect: Pré-condição anotada. Spec NÃO faz criação de modelo (read-only).
  2. Navegar para `/o/${getOrgId()}/content_models` via Page Object (ContentModelsListPage.goToList()) usando `safeGoto`. getOrgId() retorna '37007' para o env staging-base-de-conhecimento. Aguardar container da página: `await page.getByTestId('content-models-page').waitFor({ timeout: 60_000 })` (testId confirmado no recon).
    - expect: Página de listagem carregada. Container `content-models-page` visível.
  3. Verificar que a visualização padrão é Cards. Invariante: o botão de toggle 'grid_view' (Cards) está ativo/selecionado por padrão. Seletor para o botão Cards: `page.getByRole('button', { name: /grid_view/ })` OU `page.locator('[data-test-id="content-models-page"] button').filter({ hasText: 'grid_view' })`. // REVISAR: o recon captura 'grid_viewreorderfilter_alt' no texto do container — indica que grid_view e reorder são botões de toggle dentro do container. Seletores exatos de cada botão precisam ser confirmados via DOM live.
    - expect: Botão 'grid_view' visível e ativo (estado selecionado). Asserção de invariante: `await expect(cardsToggle).toBeVisible()`.
  4. Verificar que cards são renderizados na listagem. Invariante resiliente (Princípio 1 da skill criar-spec-resiliente-twygo): ao menos 1 card renderizado, sem acoplar ao count exato do seed. Seletor: `page.getByTestId('content-models-page').locator('[data-test-id="content-model-card"]')` OU `page.locator('.content-model-card')`. // REVISAR: testId individual de cada card não confirmado no recon — precisa de confirmação via DOM live. Fallback: `page.getByTestId('content-models-page').locator('[role="listitem"]')` ou container de cards.
    - expect: Pelo menos 1 card renderizado. `expect(await page.locator('<card-selector>').count()).toBeGreaterThan(0)`. Cada card exibe nome do modelo visível.
  5. Verificar que cada card exibe: imagem principal (img), nome do modelo (texto visível), ações (List Control / menu de ações), indicador de cor lateral. // REVISAR: seletores internos do card (imagem, menu de ações, indicador de cor) não confirmados no recon — marcar asserções com `// REVISAR: estrutura interna do card`.
    - expect: Pelo menos 1 card com nome visível. `await expect(page.locator('<card-name-selector>').first()).toBeVisible()`.

#### 1.3. TC3 — Alternância entre visualização Cards e Lista

**File:** `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc03-alternancia-visualizacao-cards-lista.spec.ts`

**Steps:**
  1. Pré-condições: storageState global. Pelo menos 1 modelo cadastrado. // FIXME: seed ausente — mesmo que TC2.
    - expect: Pré-condição anotada.
  2. Navegar para `/o/${getOrgId()}/content_models` via ContentModelsListPage.goToList(). Aguardar container: `await page.getByTestId('content-models-page').waitFor({ timeout: 60_000 })`.
    - expect: Página carregada em visualização Cards (padrão). Container `content-models-page` visível.
  3. Clicar no botão de alternância para visualização 'Lista' (ícone 'reorder'). Seletor: `page.getByRole('button', { name: /reorder/ })` OU `page.getByTestId('content-models-page').getByRole('button', { name: /reorder/ })`. // REVISAR: seletor exato não confirmado no recon. O texto 'reorder' aparece no conteúdo do container — provavelmente é o aria-label ou o ícone Material Icon. Verificar via DOM live se é button com aria-label='Lista' ou aria-label='reorder'.
    - expect: Listagem alterna para formato Lista. Colunas visíveis: 'Nome', 'Descrição', 'Nome do provedor', 'Designs', 'Aplicação', 'Situação', 'Ações'. Asserção: `await expect(page.getByRole('columnheader', { name: 'Nome' })).toBeVisible()` e `await expect(page.getByRole('columnheader', { name: 'Descrição' })).toBeVisible()`.
  4. Verificar todas as colunas esperadas na visão Lista usando assertions individuais por coluna: 'Nome', 'Descrição', 'Nome do provedor', 'Designs', 'Aplicação', 'Situação', 'Ações'. Seletor de coluna: `page.getByRole('columnheader', { name: '<nome-coluna>' })`.
    - expect: Cada coluna com heading correspondente visível. Invariante: presença de headers (não count de linhas).
  5. Clicar no botão de alternância para retornar à visualização 'Cards' (ícone 'grid_view'). Seletor: `page.getByRole('button', { name: /grid_view/ })`.
    - expect: Listagem retorna ao formato Cards. Container de cards visível novamente. `await expect(page.getByTestId('content-models-page')).toBeVisible()`.

#### 1.4. TC4 — Coluna Descrição truncada com tooltip completo (visão Lista)

**File:** `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc04-descricao-truncada-tooltip.spec.ts`

**Steps:**
  1. Pré-condições: storageState global. Pelo menos 1 modelo com Descrição maior que 50 caracteres seedado na org 37007. // FIXME: seed ausente — requer modelo com descrição > 50 chars. Se não existe, este TC não pode ser executado. Anotar: `test.fixme(true, 'seed ausente: requer modelo com descricao > 50 chars em org 37007')` e aguardar confirmação do QA Lead.
    - expect: Pré-condição documentada. Fixme aplicado se seed ausente.
  2. Navegar para `/o/${getOrgId()}/content_models` e alternar para visão Lista: ContentModelsListPage.goToList() + ContentModelsListPage.switchToListView(). Aguardar coluna 'Descrição' visível: `await expect(page.getByRole('columnheader', { name: 'Descrição' })).toBeVisible({ timeout: 60_000 })`.
    - expect: Visão Lista carregada com coluna Descrição.
  3. Localizar a célula de Descrição de um modelo com > 50 chars. Filtrar pelo modelo seedado via campo de busca: `page.getByPlaceholder('Pesquise aqui pelo nome do modelo').fill('<nome-do-modelo-seed>')` (seletor do placeholder confirmado no recon). Aguardar resultado único. Invariante: a célula exibe os primeiros 50 chars seguidos de '...' (truncamento). Seletor da célula: `page.getByRole('cell').filter({ hasText: /^.{1,53}\.\.\.$/ })` ou via testId específico da célula se disponível.
    - expect: Coluna Descrição exibe texto truncado (50 chars + '...'). `await expect(descricaoCell).toContainText('...')`.
  4. Posicionar o mouse sobre a Descrição truncada usando `await descricaoCell.hover()`. Aguardar tooltip aparecer: `await expect(page.locator('[role="tooltip"]')).toBeVisible()`. // REVISAR: seletor exato do tooltip não confirmado no recon. Tooltip pode ser Chakra UI `[data-theme][class*="tooltip"]` ou `[role="tooltip"]`. Verificar via DOM live após hover.
    - expect: Tooltip visível com texto completo da Descrição. `await expect(page.locator('[role="tooltip"]')).toBeVisible()`. Texto do tooltip deve conter o texto completo sem truncamento.

#### 1.5. TC5 — Botão Adicionar redireciona para criação

**File:** `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc05-botao-adicionar-redireciona-criacao.spec.ts`

**Steps:**
  1. Pré-condições: storageState global. Nenhum modelo precisa estar seedado (TC read-only de navegação).
    - expect: Pré-condição: apenas sessão autenticada necessária.
  2. Navegar para `/o/${getOrgId()}/content_models` via ContentModelsListPage.goToList(). Aguardar botão Adicionar: `await expect(page.getByRole('button', { name: 'Adicionar' })).toBeVisible({ timeout: 60_000 })`. Seletor confirmado no recon: role=button, name='Adicionar'.
    - expect: Listagem exibida. Botão 'Adicionar' visível.
  3. Clicar no botão '+ Adicionar': `await page.getByRole('button', { name: 'Adicionar' }).click()`. Aguardar redirecionamento para a tela de criação.
    - expect: Sistema redireciona para a URL de criação de modelo. Asserção: `await expect(page).toHaveURL(/content_models\/new|content_models\/.+\/edit/, { timeout: 60_000 })`. // REVISAR: padrão exato da URL de criação não confirmado — pode ser /content_models/new ou outro padrão. Marcar com `allure.tag('REVIEW_NEEDED')` se URL não conhecida.
  4. Verificar que a aba 'Identificação' é a primeira aba exibida na tela de criação. Seletor: `page.getByRole('tab', { name: 'Identificação' })`. // REVISAR: nome exato da aba e testId não confirmados no recon para a tela de criação.
    - expect: Aba 'Identificação' visível e ativa (selected). `await expect(page.getByRole('tab', { name: 'Identificação' })).toBeVisible({ timeout: 60_000 })`.

#### 1.6. TC6 — Indicador de cor lateral reflete status ativo/inativo no card

**File:** `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc06-indicador-cor-status-card.spec.ts`

**Steps:**
  1. Pré-condições: storageState global. Pelo menos 1 modelo ATIVO e 1 modelo INATIVO seedados na org 37007. // FIXME: seed ausente — requer 1 modelo ativo E 1 modelo inativo na listagem. Confirmar com QA Lead. Se não houver ambos, aplicar `test.fixme(true, 'seed ausente: requer 1 modelo ativo e 1 inativo em org 37007')`.
    - expect: Pré-condição documentada.
  2. Navegar para `/o/${getOrgId()}/content_models` via ContentModelsListPage.goToList(). Confirmar visualização Cards ativa. Aguardar `content-models-page` visível com `{ timeout: 60_000 }`.
    - expect: Listagem em Cards carregada.
  3. Localizar card de modelo ATIVO (pesquisar pelo nome do modelo ativo seedado via campo de busca: `page.getByPlaceholder('Pesquise aqui pelo nome do modelo').fill('<nome-modelo-ativo>')`, seletor do placeholder confirmado no recon). Aguardar card aparecer. Verificar indicador de cor lateral: `await expect(activeCard.locator('<color-indicator-selector>')).toBeVisible()`. // REVISAR: seletor exato do indicador de cor lateral não confirmado no recon. Prováveis candidatos: `[data-test-id*="status"]`, `[class*="active"]`, ou elemento com atributo de cor específico (Chakra UI usa background-color inline). Verificar via DOM live.
    - expect: Card do modelo ativo visível. Indicador de cor lateral verde/ativo visível. Invariante: o indicador existe e é visível (não assertar cor exata, que pode mudar com tema).
  4. Limpar busca e localizar card de modelo INATIVO (pesquisar pelo nome do modelo inativo seedado). Aguardar card aparecer. Verificar indicador de cor lateral distinto (diferente do ativo). Invariante: o indicador do modelo inativo tem estado visual diferente do ativo. // REVISAR: como distinguir ativo/inativo via DOM — pode ser atributo data-status, classe CSS, ou cor diferente.
    - expect: Card do modelo inativo visível. Indicador de cor lateral com estado visual distinto do ativo. Asserção de invariante: indicador visível e diferente — usar `not.toHaveClass(<active-class>)` ou `not.toHaveAttribute('data-status', 'active')` dependendo do que o DOM expõe.
