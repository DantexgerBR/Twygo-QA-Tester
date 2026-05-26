# Extração de dados de repositórios — Base de Conhecimento

## Application Overview

Suíte "Extração de dados de repositórios" do módulo Base de Conhecimento da plataforma Twygo. Cobre 2 testcases que validam o comportamento do botão "Exportar" na listagem de repositórios: TC1 valida o download completo sem filtros; TC2 valida que o download respeita o filtro de Categoria "Geral" aplicado via drawer. URL canônica: /o/{orgId}/knowledge_repositories (env staging-base-de-conhecimento, orgId 37007). Pré-condições: feature flag `habilitar_base_de_conhecimento` ativa, pelo menos 1 repositório cadastrado com Categoria "Geral" para TC2. Ambos os TCs usam `page.waitForEvent('download')` antes do click no botão Exportar — nunca `waitForTimeout`. A suíte não precisa de `afterAll` de cleanup pois não cria nem altera dados persistentes (operações read-only + download).

## Test Scenarios

### 1. Extração de dados de repositórios

**Seed:** `tests/seed.spec.ts`

#### 1.1. Exportar listagem completa

**File:** `projects/base-de-conhecimento/tests/features/extracao-de-dados-de-repositorios/exportar-listagem-completa.spec.ts`

**Steps:**
  1. Importar dados do arquivo '.data.ts' adjacente: { orgId via getOrgId(), nenhum filtro aplicado }. Confirmar que o spec NÃO faz login (storageState já configurado no playwright.config.ts via global-setup).
    - expect: Sem ação de UI neste passo — é preparação de contexto.
  2. Acessar a URL '/o/{orgId}/knowledge_repositories' usando safeGoto(page, url) para disparar dismissCommonModals imediatamente após domcontentloaded, evitando travamento por modais NPS Sofia ou 'Continuar mesmo assim'.
    - expect: Página carrega e o container data-test-id='knowledge-repositories-list-container' fica visível.
    - expect: Nenhum modal oportunista bloqueando a tela (dismiss aplicado pelo safeGoto).
  3. Aguardar a listagem de repositórios renderizar: expect(page.getByTestId('knowledge-repositories-list-container')).toBeVisible(). Verificar que há pelo menos 1 linha de repositório exibida (pré-condição da suite).
    - expect: Container data-test-id='knowledge-repositories-list-container' está visível.
    - expect: Pelo menos 1 repositório aparece na listagem (pré-condição satisfeita).
  4. Preparar captura de download ANTES do click: const downloadPromise = page.waitForEvent('download'). Em seguida, clicar no botão 'Exportar' via getByRole('button', { name: 'Exportar' }). NOTA REVISAR-FIGMA: o botão 'Exportar' não apareceu no snapshot do recon (DOM capturado com modal aberto). Se o botão tiver data-test-id, preferir getByTestId(). Se o texto real for diferente (ex: 'Exportar dados', 'Download'), ajustar o locator e adicionar comentário '// REVISAR: nome real do botão Exportar'.
    - expect: O evento 'download' é disparado pelo browser (downloadPromise resolve sem timeout).
    - expect: Sistema inicia o download do arquivo de extração (CSV ou XLSX) contendo os repositórios listados.
    - expect: Nenhum modal de confirmação intermediário aparece bloqueando o download — se aparecer, deve ser tratado pelo POM antes de resolver o download.
  5. Aguardar a resolução de downloadPromise: const download = await downloadPromise. Capturar o nome sugerido do arquivo via download.suggestedFilename(). Asserir que o filename termina com '.csv' ou '.xlsx' usando expect(filename).toMatch(/\.(csv|xlsx)$/i). NOTA: o formato exato (CSV vs XLSX) será confirmado em runtime — o regex aceita ambos.
    - expect: download.suggestedFilename() retorna uma string não-vazia.
    - expect: O nome do arquivo termina com '.csv' ou '.xlsx' (formato confirmado em runtime).
    - expect: Arquivo está disponível no diretório de downloads do browser (download.path() não é null após aguardar).

#### 1.2. Exportação respeita filtros aplicados

**File:** `projects/base-de-conhecimento/tests/features/extracao-de-dados-de-repositorios/exportacao-respeita-filtros-aplicados.spec.ts`

**Steps:**
  1. Importar dados do arquivo '.data.ts' adjacente: { filterCategory: 'Geral', expectedFileExtensionRegex: /\.(csv|xlsx)$/i }. O spec parte de estado limpo — nenhum filtro pré-aplicado. Pré-condição: pelo menos 1 repositório com Categoria 'Geral' deve existir na org (verificar ou criar via beforeAll se necessário; preferir seed pré-existente no ambiente Stage).
    - expect: Sem ação de UI neste passo — é preparação de contexto.
  2. Acessar a URL '/o/{orgId}/knowledge_repositories' usando safeGoto(page, url) (dismissCommonModals automático). Aguardar container data-test-id='knowledge-repositories-list-container' ficar visível.
    - expect: Listagem carrega sem bloqueios.
    - expect: Container 'knowledge-repositories-list-container' visível.
  3. Abrir o drawer de filtros clicando no botão Filtrar: page.getByTestId('filter-control-open-button').click(). O data-test-id 'filter-control-open-button' foi confirmado no recon. Aguardar o drawer aparecer: expect(page.getByRole('dialog')).toBeVisible() OU expect(page.getByText('Filtros')).toBeVisible() — usar o locator que ficar estável após exploração ao vivo.
    - expect: Drawer de filtros é exibido à direita da tela.
    - expect: Seção 'Categoria' fica visível no drawer.
  4. Selecionar a opção 'Geral' no filtro 'Categoria' do drawer. Usar getByLabel('Categoria') ou getByRole dentro do drawer, seguido de .selectOption('Geral') ou .click() conforme o tipo de controle (radio/checkbox/select). NOTA REVISAR-FIGMA: tipo exato do controle de Categoria no drawer não foi capturado no recon — adicionar comentário '// REVISAR: tipo do controle Categoria no drawer (radio/checkbox/select)'.
    - expect: Opção 'Geral' fica selecionada/marcada no filtro Categoria.
  5. Aplicar o filtro clicando no botão de confirmação do drawer (ex: 'Aplicar', 'Filtrar', 'OK' — REVISAR-FIGMA o texto real). Aguardar o drawer fechar: expect(drawer).toBeHidden(). Aguardar a listagem atualizar exibindo apenas repositórios da Categoria 'Geral'.
    - expect: Drawer fecha após aplicar o filtro.
    - expect: Listagem exibe apenas repositórios da Categoria 'Geral' (filtro ativo visível na UI, se houver badge/chip de filtro aplicado).
  6. Preparar captura de download ANTES do click: const downloadPromise = page.waitForEvent('download'). Clicar no botão 'Exportar' via getByRole('button', { name: 'Exportar' }) (ou getByTestId se disponível — REVISAR-FIGMA). O filtro de Categoria 'Geral' deve permanecer ativo neste momento.
    - expect: O evento 'download' é disparado pelo browser (downloadPromise resolve sem timeout).
    - expect: Sistema inicia o download do arquivo de extração com o filtro aplicado.
  7. Aguardar const download = await downloadPromise. Asserir download.suggestedFilename().match(/\.(csv|xlsx)$/i). Salvar o arquivo em disco via download.saveAs(path) para inspeção posterior (opcional — evidência exploratória). NOTA: a validação do conteúdo do arquivo (que contém apenas repositórios 'Geral') é out-of-scope para o spec Playwright puro; a asserção primária é que o download ocorreu após o filtro estar ativo. Adicionar annotation allure: allure.tag('NEEDS_CONTENT_VALIDATION') para sinalizar que validação de conteúdo do CSV/XLSX requer agente de DB ou API.
    - expect: download.suggestedFilename() retorna string não-vazia terminando em '.csv' ou '.xlsx'.
    - expect: Download completou com sucesso após filtro 'Categoria: Geral' aplicado.
    - expect: Nenhum erro de rede (4xx/5xx) disparado durante o download (verificar via fixture exploratória).
