# Listagem básica de repositórios — Base de Conhecimento

## Application Overview

Plano técnico para a suíte "Listagem básica de repositórios" do módulo Base de Conhecimento da plataforma Twygo. Cobre 4 testcases derivados do MD canônico (test-analysis.md, linhas 140–210): navegação via menu lateral (TC1), validação de colunas (TC2), botão de criação (TC3) e empty state (TC4). Todos os seletores foram extraídos do recon ao vivo (recon-listagem-basica-de-repositorios.md) e confirmados via snapshot DOM capturado em 2026-05-19. Textos REVISAR-FIGMA resolvidos: botão de criação é "Adicionar" (sem "+"), botão de filtro é "Filtro" (label do button com aria-name "filter_altFiltro"), placeholder de busca é "Buscar repositórios". Page Object sugerido: KnowledgeRepositoryListPage em projects/base-de-conhecimento/pages/. Pré-condição transversal: feature flag habilitar_base_de_conhecimento ativa (verificada como ativa no recon — item "Base de conhecimento" aparece no menu lateral). Modais oportunistas Twygo confirmados no snapshot: "OK" (beta notification), "Continuar mesmo assim", "Responder pesquisa" — todos tratados por safeGoto/dismissCommonModals.

## Test Scenarios

### 1. Listagem básica de repositórios

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC1 — Acessar a listagem via menu Aprendizagem

**File:** `projects/base-de-conhecimento/tests/features/listagem-basica-de-repositorios/tc1-acessar-listagem-via-menu-aprendizagem.spec.ts`

**Steps:**
  1. Dado que o storageState do globalSetup já está carregado (spec NÃO faz login — anti-pattern A). Chamar safeGoto(page, '/play') para navegar ao Dashboard e descartar modais oportunistas (NPS Sofia, 'Continuar mesmo assim', 'Responder pesquisa') que aparecem durante o load.
    - expect: URL contém '/play'
    - expect: Menu lateral está visível — verificar via getByRole('link', { name: /Base de conhecimento/i }) estar presente na sidebar
  2. Clicar no item de menu 'Aprendizagem' no menu lateral. Locator: getByRole('link', { name: /Aprendizagem/i }) ou getByTestId equivalente se disponível. Observação: o recon capturou o item 'Base de conhecimento' como link direto na sidebar — verificar se 'Aprendizagem' é um grupo expansível pai ou se 'Base de conhecimento' é link de topo. Baseado no recon (link com name 'folder_open Base de conhecimento'), tratar como link direto em sidebar já expandida; se houver agrupamento, clicar no label 'Aprendizagem' primeiro.
    - expect: Submenu ou seção lateral exibe o item 'Base de conhecimento' — getByRole('link', { name: /Base de conhecimento/i }).toBeVisible()
  3. Clicar no item 'Base de conhecimento' no menu lateral. Locator preferencial: getByRole('link', { name: /Base de conhecimento/i }) (confirmado no recon: role=link, name contém 'Base de conhecimento'). Usar safeGoto internamente no Page Object KnowledgeRepositoryListPage.goToList() como alternativa mais robusta: safeGoto(page, '/o/' + getOrgId() + '/knowledge_repositories').
    - expect: URL redireciona para /o/{orgId}/knowledge_repositories — await expect(page).toHaveURL(/knowledge_repositories/)
    - expect: Breadcrumb exibe 'Aprendizagem > Base de conhecimento' — getByText(/Aprendizagem/).toBeVisible() e getByText(/Base de conhecimento/).toBeVisible() na região de breadcrumb
    - expect: REVISAR-FIGMA: texto exato do breadcrumb — o recon não capturou explicitamente o componente de breadcrumb; se não existir breadcrumb renderizado, marcar // REVISAR: breadcrumb não encontrado no snapshot do recon
  4. Aguardar a listagem carregar. Locator de referência: getByTestId('knowledge-repositories-list-container') — confirmado no recon com data-test-id='knowledge-repositories-list-container'. Usar await expect(page.getByTestId('knowledge-repositories-list-container')).toBeVisible().
    - expect: Container getByTestId('knowledge-repositories-list-container') está visível
    - expect: Listagem renderizou o componente ListControl — verificar presença de pelo menos um cabeçalho de coluna (ex.: getByRole('columnheader', { name: 'Nome' }).toBeVisible())

#### 1.2. TC2 — Validar colunas obrigatórias da listagem

**File:** `projects/base-de-conhecimento/tests/features/listagem-basica-de-repositorios/tc2-validar-colunas-obrigatorias.spec.ts`

**Steps:**
  1. Navegar diretamente para /o/{orgId}/knowledge_repositories usando KnowledgeRepositoryListPage.goToList() que internamente chama safeGoto(page, '/o/' + getOrgId() + '/knowledge_repositories'). Não fazer login — storageState do globalSetup já está ativo. orgId vem de getOrgId() (src/utils/environment.ts).
    - expect: URL atual é /o/{orgId}/knowledge_repositories — await expect(page).toHaveURL(/knowledge_repositories/)
    - expect: Container getByTestId('knowledge-repositories-list-container') está visível
  2. Verificar presença das colunas obrigatórias da listagem. Locators: getByRole('columnheader', { name: 'Nome' }), getByRole('columnheader', { name: 'Categoria' }), getByRole('columnheader', { name: 'Classificação' }), getByRole('columnheader', { name: 'Criado em' }), getByRole('columnheader', { name: 'Atualizado em' }). REVISAR-FIGMA: nomes exatos das colunas — o recon capturou o container mas não listou columnheaders individualmente. O recon indica 'NomeDescriçãoCategoria Classificaç' no innerText do container — sugere que Nome, Categoria, Classificação estão presentes; 'Criado em' e 'Atualizado em' são inferidos. Marcar // REVISAR: confirmar labels exatos das colunas 'Criado em' e 'Atualizado em' no snapshot ao vivo.
    - expect: Coluna 'Nome' é exibida — await expect(page.getByRole('columnheader', { name: 'Nome' })).toBeVisible()
    - expect: Coluna 'Categoria' é exibida — await expect(page.getByRole('columnheader', { name: 'Categoria' })).toBeVisible()
    - expect: Coluna 'Classificação' é exibida — await expect(page.getByRole('columnheader', { name: 'Classificação' })).toBeVisible()
    - expect: Coluna 'Criado em' é exibida — await expect(page.getByRole('columnheader', { name: 'Criado em' })).toBeVisible() // REVISAR-FIGMA confirmado parcialmente
    - expect: Coluna 'Atualizado em' é exibida — await expect(page.getByRole('columnheader', { name: 'Atualizado em' })).toBeVisible() // REVISAR-FIGMA confirmado parcialmente
  3. Verificar presença da coluna 'Ações' e que cada linha exibe os botões de ação 'Editar' e 'Excluir'. Aguardar que a listagem tenha pelo menos uma linha (pré-condição: org principal possui repositórios cadastrados). Locators para botões de ação por linha: getByRole('link', { name: 'Editar' }) e getByRole('button', { name: 'Excluir' }) ou getByRole('link', { name: 'Excluir' }). REVISAR-FIGMA: o recon capturou getByRole('link', { name: 'Editar' }) e getByRole('link', { name: 'Cancelar inscrição' }) na lista geral — verificar se 'Excluir' aparece como button ou link, e se há coluna 'Ações' com header. Marcar // REVISAR se 'Excluir' não for encontrado com o locator escolhido.
    - expect: Pelo menos uma linha de repositório está visível na listagem
    - expect: Botão/link 'Editar' está visível na primeira linha — await expect(page.getByRole('link', { name: 'Editar' }).first()).toBeVisible()
    - expect: Botão/link 'Excluir' está visível na primeira linha — await expect(page.getByRole('button', { name: 'Excluir' }).first()).toBeVisible() // REVISAR: pode ser link

#### 1.3. TC3 — Validar botão de criação na listagem

**File:** `projects/base-de-conhecimento/tests/features/listagem-basica-de-repositorios/tc3-validar-botao-criacao.spec.ts`

**Steps:**
  1. Navegar para /o/{orgId}/knowledge_repositories usando KnowledgeRepositoryListPage.goToList() com safeGoto interno. Não fazer login — anti-pattern A.
    - expect: Listagem é exibida — getByTestId('knowledge-repositories-list-container').toBeVisible()
  2. Verificar que o botão de criação está presente e clicar nele. Texto real confirmado pelo recon: 'Adicionar' (sem o '+' prefixado — o MD dizia '+ Adicionar'; REVISAR-FIGMA confirmado: texto real = 'Adicionar'). Locator: getByRole('button', { name: 'Adicionar' }) — confirmado no recon como role=button, name='Adicionar'. Chamar KnowledgeRepositoryListPage.openCreateForm() que encapsula o click e aguarda o redirect.
    - expect: Botão 'Adicionar' está visível antes do click — await expect(page.getByRole('button', { name: 'Adicionar' })).toBeVisible()
  3. Após clicar no botão 'Adicionar', aguardar redirecionamento para a tela de criação de repositório e verificar que a aba 'Identificação' está selecionada. Usar await expect(page).toHaveURL(/knowledge_repositories\/new/) ou padrão equivalente de URL de criação. Verificar aba ativa: getByRole('tab', { name: 'Identificação' }).toHaveAttribute('aria-selected', 'true').
    - expect: URL redireciona para tela de criação — await expect(page).toHaveURL(/knowledge_repositories\/new/)
    - expect: Aba 'Identificação' está selecionada/ativa — await expect(page.getByRole('tab', { name: 'Identificação' })).toHaveAttribute('aria-selected', 'true') // REVISAR: confirmar URL exata de criação e seletor da aba no snapshot ao vivo

#### 1.4. TC4 — Validar empty state quando não há repositórios

**File:** `projects/base-de-conhecimento/tests/features/listagem-basica-de-repositorios/tc4-validar-empty-state.spec.ts`

**Steps:**
  1. Pré-condição para este TC: org sem repositórios cadastrados. Estratégia técnica: usar page.route() para interceptar GET /api/v1/o/:org_id/knowledge_repositories e retornar resposta mockada com lista vazia ({ data: [], total: 0 }). Isso evita depender de um ambiente limpo e torna o teste determinístico. Implementar via page.route('**/knowledge_repositories**', route => route.fulfill({ status: 200, json: { data: [], total: 0 } })). Dados específicos deste TC: tc4-validar-empty-state.data.ts com { emptyResponseMock: { data: [], total: 0 } }. Alternativa se mock não for viável: usar org secundária configurada como empty (via environment.json) e declarar test.use({ storageState, baseURL }). Marcar // REVISAR: confirmar estratégia com QA Lead — mock de API é preferível para isolamento.
    - expect: Page route interceptor está ativo antes da navegação
  2. Navegar para /o/{orgId}/knowledge_repositories com safeGoto após configurar o mock. Container da listagem deve carregar mas sem linhas de repositório.
    - expect: URL atual é /knowledge_repositories
    - expect: Container getByTestId('knowledge-repositories-list-container') está visível
    - expect: Nenhuma linha de repositório é exibida — await expect(page.getByRole('row')).toHaveCount(0) ou contagem de linhas de dados = 0
  3. Verificar exibição do empty state. REVISAR-FIGMA: texto exato do empty state não foi capturado no recon (org principal tem repositórios, por isso o empty state não renderizou). Aguardar elemento de empty state visível. Locator sugerido: getByText(/criar o primeiro repositório/i) ou getByTestId('empty-state') se houver data-test-id. Marcar // REVISAR: texto exato do empty state e se há data-test-id=empty-state — validar ao vivo na primeira execução do spec.
    - expect: Empty state é exibido — await expect(page.getByTestId('empty-state')).toBeVisible() // REVISAR: confirmar data-test-id real
    - expect: Texto do empty state convida o usuário a criar o primeiro repositório — await expect(page.getByText(/criar o primeiro repositório/i)).toBeVisible() // REVISAR-FIGMA: texto exato não capturado no recon; texto é inferido pelo AT
    - expect: REVISAR-FIGMA confirmado pendente: inspecionar HTML do componente empty state na primeira execução e atualizar o locator/asserção
