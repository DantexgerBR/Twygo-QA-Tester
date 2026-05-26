# Filtros e Busca de Repositórios — Base de Conhecimento

## Application Overview

Suíte de testes para o módulo "Base de Conhecimento" da plataforma Twygo, cobrindo os 4 testcases da testsuite "Filtros e busca de repositórios" (R7–R10 do AT). Testa a busca textual por nome de repositório e o drawer de filtros Chakra slide-in por Categoria e Classificação. URL canônica: /o/{orgId}/knowledge_repositories no ambiente staging-base-de-conhecimento (host basedeconhecimento.stage.twygoead.com, orgId 37007). Pré-condição global: pelo menos 3 repositórios cadastrados com Categorias e Classificações distintas — seed via beforeAll ou seed estática confirmada no ambiente. Feature flag habilitar_base_de_conhecimento ativa. Todos os specs herdam storageState do globalSetup (anti-pattern A proibido). safeGoto obrigatório para dismissCommonModals (modal aberto observado nos dois snapshots de recon). Seletores canônicos do recon: data-test-id="filter-control-open-button" (botão Filtrar), data-test-id="knowledge-repositories-list-container" (container da lista), textbox placeholder="Buscar repositórios" (campo de busca). IDs do drawer Chakra são compartilhados entre listagens Twygo: #list-filter-apply, #list-filter-cancel, #list-filter-close, #form-filter-apply, #clear-filter. Page Objects: KnowledgeRepositoryListPage (projects/base-de-conhecimento/pages/) + FilterDrawer pode ser extraído para src/pages/ se reutilizado por outros módulos. Dados de teste isolados por TC em filtros-e-busca-de-repositorios.data.ts.

## Test Scenarios

### 1. Filtros e busca de repositórios

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC1 — Buscar repositório por nome

**File:** `projects/base-de-conhecimento/tests/features/filtros-e-busca-de-repositorios/buscar-repositorio-por-nome.spec.ts`

**Steps:**
  1. Importar dados de teste de filtros-e-busca-de-repositorios.data.ts (buscaQuery: 'Repositório TC1', nomesEsperados: ['Repositório TC1'], totalSemFiltro: número de repositórios seed).
  2. No beforeAll: verificar que a listagem contém ao menos 3 repositórios (pré-condição da suite). Se seed dinâmica for necessária, criar via API os repositórios 'Repositório TC1', 'Repositório TC2', 'Repositório TC3' com Categorias e Classificações distintas. Se seed estática já existir no env, apenas confirmar via listagem.
    - expect: Ao menos 3 repositórios visíveis na listagem antes de cada teste.
  3. Navegar para /o/{getOrgId()}/knowledge_repositories usando safeGoto (dismissCommonModals antes de interagir — modal NPS/Continuar detectado no recon).
    - expect: Listagem é exibida. data-test-id='knowledge-repositories-list-container' está visível. Múltiplos repositórios são exibidos na tabela.
  4. Localizar o campo de busca pelo placeholder 'Buscar repositórios' via getByPlaceholder('Buscar repositórios') e preencher com 'Repositório TC1' (fill + aguardar networkidle — campo tem debounce server-side).
    - expect: Listagem filtra exibindo apenas repositórios cujo nome contém 'Repositório TC1'. Repositórios com outros nomes deixam de aparecer na listagem.
  5. Asserir que todas as linhas visíveis na tabela contêm 'Repositório TC1' no nome. Usar locator dentro de data-test-id='knowledge-repositories-list-container' para tbody tr e checar texto de cada célula de nome.
    - expect: Cada linha exibida contém 'Repositório TC1' no campo Nome. Linhas de outros repositórios (TC2, TC3) não aparecem.
  6. Limpar o campo de busca: selecionar todo o texto com Ctrl+A e pressionar Backspace, ou usar .clear() / .fill('') — aguardar networkidle após limpar.
    - expect: Listagem volta a exibir todos os repositórios cadastrados (o total sem filtro é restaurado). data-test-id='knowledge-repositories-list-container' exibe o número original de linhas.

#### 1.2. TC2 — Filtrar por Categoria via drawer de filtros

**File:** `projects/base-de-conhecimento/tests/features/filtros-e-busca-de-repositorios/filtrar-por-categoria-via-drawer.spec.ts`

**Steps:**
  1. Importar dados de filtros-e-busca-de-repositorios.data.ts (categoriaFiltro: 'Geral', classificacaoFiltro: 'Interno'). Confirmar seed: pelo menos 1 repositório com Categoria='Geral' e pelo menos 1 com Categoria diferente de 'Geral' devem existir.
  2. Navegar para /o/{getOrgId()}/knowledge_repositories usando safeGoto. Aguardar data-test-id='knowledge-repositories-list-container' estar visível.
    - expect: Listagem carregada com múltiplos repositórios visíveis.
  3. Verificar se botão #clear-filter está visível (indica filtro residual de teste anterior). Se visível, clicar em #clear-filter e aguardar networkidle antes de continuar — garante modo A do drawer na abertura.
    - expect: Se havia filtro aplicado, ele é limpo. Listagem mostra todos os repositórios.
  4. Clicar no botão 'Filtrar' via getByTestId('filter-control-open-button'). Aguardar o drawer aparecer (role='dialog' com classe chakra-slide).
    - expect: Drawer 'Filtros' é exibido à direita da tela. Drawer abre em modo A (lista de filtros): #list-filter-apply e #list-filter-close visíveis.
  5. Dentro do drawer, localizar o filtro 'Categoria'. Conforme padrão do drawer Chakra: o componente usa accordion 'Colunas para filtrar'. Navegar até o item de Categoria e selecionar a opção 'Geral' (radio ou checkbox conforme implementação do produto — confirmar via recon do drawer aberto se necessário; REVISAR se a seleção é radio ou checkbox).
    - expect: Opção 'Geral' fica marcada/selecionada no filtro Categoria dentro do drawer. Drawer permanece aberto.
  6. Clicar no botão de aplicar filtro (#list-filter-apply ou #form-filter-apply conforme o modo em que o drawer se encontra após a seleção). Aguardar drawer fechar + networkidle.
    - expect: Drawer fecha. Botão #clear-filter aparece na listagem (indica filtro ativo). Listagem exibe apenas repositórios da Categoria 'Geral'.
  7. Asserir que todas as linhas visíveis na coluna 'Categoria' contêm 'Geral'. Asserir que #clear-filter está visível.
    - expect: Cada linha exibida tem Categoria='Geral'. Repositórios de outras Categorias não aparecem.
  8. Cleanup (afterEach/afterAll): clicar em #clear-filter para limpar o filtro aplicado. Aguardar networkidle.
    - expect: Filtro é removido. Listagem volta ao estado completo.

#### 1.3. TC3 — Combinar filtros de Categoria e Classificação

**File:** `projects/base-de-conhecimento/tests/features/filtros-e-busca-de-repositorios/combinar-filtros-categoria-e-classificacao.spec.ts`

**Steps:**
  1. Importar dados de filtros-e-busca-de-repositorios.data.ts (categoriaFiltro: 'Geral', classificacaoFiltro: 'Interno'). Confirmar seed: ao menos 1 repositório com Categoria='Geral' E Classificacao='Interno' deve existir; ao menos 1 com Categoria='Geral' mas Classificacao diferente; ao menos 1 com Categoria diferente.
  2. Navegar para /o/{getOrgId()}/knowledge_repositories usando safeGoto. Aguardar data-test-id='knowledge-repositories-list-container'.
    - expect: Listagem carregada com múltiplos repositórios.
  3. Verificar e limpar filtro residual: se #clear-filter visível, clicar e aguardar networkidle.
    - expect: Estado limpo — listagem sem filtro aplicado.
  4. Clicar em getByTestId('filter-control-open-button'). Aguardar drawer abrir em modo A.
    - expect: Drawer 'Filtros' visível à direita. #list-filter-apply visível.
  5. Selecionar 'Geral' no filtro 'Categoria' dentro do drawer (mesmo mecanismo do TC2).
    - expect: Filtro Categoria fica com 'Geral' selecionado. Drawer permanece aberto.
  6. Selecionar 'Interno' no filtro 'Classificação' dentro do drawer — localizar o accordion ou seção de Classificação e marcar a opção 'Interno' (REVISAR: confirmar seletor real do filtro Classificação via snapshot do drawer aberto se recon não capturou o drawer).
    - expect: Filtro Classificação fica com 'Interno' selecionado. Drawer permanece aberto com ambos os filtros ativos.
  7. Clicar em #list-filter-apply (ou #form-filter-apply). Aguardar drawer fechar + networkidle.
    - expect: Drawer fecha. #clear-filter aparece. Listagem exibe apenas repositórios com Categoria='Geral' E Classificacao='Interno'.
  8. Asserir que cada linha visível tem Categoria='Geral' E Classificacao='Interno'. Asserir que #clear-filter está visível.
    - expect: Todas as linhas satisfazem ambos os critérios. Repositórios sem a combinação exata não aparecem.
  9. Cleanup (afterEach/afterAll): clicar #clear-filter, aguardar networkidle.
    - expect: Filtros são removidos. Listagem volta ao estado completo.

#### 1.4. TC4 — Limpar todos os filtros aplicados

**File:** `projects/base-de-conhecimento/tests/features/filtros-e-busca-de-repositorios/limpar-todos-os-filtros-aplicados.spec.ts`

**Steps:**
  1. Importar dados de filtros-e-busca-de-repositorios.data.ts (categoriaParaSetup: 'Geral'). Pré-condição: ao menos 1 repositório com Categoria='Geral' e ao menos 1 com Categoria diferente no env.
  2. Navegar para /o/{getOrgId()}/knowledge_repositories usando safeGoto. Aguardar data-test-id='knowledge-repositories-list-container'.
    - expect: Listagem carregada.
  3. Verificar e limpar filtro residual: se #clear-filter visível, clicar e aguardar networkidle (garante estado limpo como ponto de partida).
    - expect: Estado inicial: listagem sem filtro aplicado.
  4. Aplicar filtro de Categoria 'Geral' via drawer (mesmo fluxo do TC2: abrir drawer com getByTestId('filter-control-open-button'), selecionar 'Geral' em Categoria, clicar #list-filter-apply, aguardar drawer fechar + networkidle). Este passo implementa a pré-condição 'Aplicar pelo menos 1 filtro de Categoria' do TC4.
    - expect: Listagem filtrada exibindo apenas repositórios da Categoria 'Geral'. #clear-filter está visível na listagem.
  5. Asserir que #clear-filter (botão 'Limpar filtros') está visível antes de clicar nele.
    - expect: Botão #clear-filter é visível — confirma que filtro está aplicado.
  6. Clicar em #clear-filter ('Limpar filtros'). Aguardar networkidle.
    - expect: Listagem volta a exibir todos os repositórios cadastrados. #clear-filter desaparece (toBeHidden). Número de linhas na tabela volta ao total completo (sem filtro).
  7. Asserir que #clear-filter está oculto (toBeHidden) e que a listagem exibe o total completo de repositórios (totalSemFiltro do .data.ts).
    - expect: #clear-filter oculto — confirma ausência de filtro ativo. Listagem exibe todos os repositórios sem restrição.
