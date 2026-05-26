# Recursos de Mídia - Upload de imagens

## Application Overview

Suite de testes E2E para a funcionalidade "Recursos de Mídia - Upload de imagens" da plataforma Twygo, módulo Base de Conhecimento. Cobre upload dos formatos aceitos (PNG, JPG), rejeição de formato inválido, rejeição por tamanho excedente (>50 MB) e validação da UI do componente de upload. Todos os TCs exigem um repositório de teste criado via beforeAll e limpo via afterAll (anti-pattern G do CLAUDE.md §7.6 — skill limpar-dados-de-teste-twygo). Feature flag `habilitar_base_de_conhecimento` deve estar ativa para a org 37007 (env staging-base-de-conhecimento). Aba acessada via data-test-id `tab-resources` (confirmado no recon 2026-05-19). Fixtures físicas (sample.jpg, sample.jpeg, sample.png) devem existir em `projects/base-de-conhecimento/data/fixtures/` — specs são marcados fixme se ausentes. Arquivo oversized é gerado programaticamente no beforeAll via Buffer.alloc(51*1024*1024) e deletado no afterAll. O Page Object `KnowledgeRepositoryFormPage` é compartilhado com a suíte Criação ID; métodos de mídia (goToMidiaTab, uploadMidia, getMidiaUploadStatus, deleteMidia) são ADICIONADOS ao POM existente, não recriados. Toasts Chakra seguem padrão da skill testar-toast-chakra-twygo (.chakra-toast + .first()). URLs resolvidas via getOrgId() de src/utils/environment.ts. Nunca hardcodar orgId ou host. Navegação via safeGoto (src/utils/modals.ts) — obrigatório por modal detectado no recon.

## Test Scenarios

### 1. Recursos de Mídia - Upload de imagens

**Seed:** `tests/seed.spec.ts`

#### 1.1. Upload de arquivo PNG dentro do limite

**File:** `projects/base-de-conhecimento/tests/features/recursos-de-midia-upload-de-imagens/upload-de-arquivo-png-dentro-do-limite.spec.ts`

**Steps:**
  1. Configurar beforeAll: criar contexto Playwright fresco com storageState (`outputs/.auth/storage.json`) via `browser.newContext({ storageState: STORAGE_STATE, viewport: { width: 1280, height: 720 } })`. Instanciar `KnowledgeRepositoryListPage` e `KnowledgeRepositoryFormPage`. Criar repositório worker-isolated com nome `Repositório Mídia PNG w{workerIndex}-{timestamp}` navegando via `safeGoto` para `/o/${getOrgId()}/knowledge_repositories/new`, preenchendo Nome, Descrição ('Repositório de teste automatizado — não excluir manualmente'), selecionando Categoria 'Geral' e Classificação 'Interno', clicando Salvar e capturando o ID da URL de redirect (`/o/{orgId}/knowledge_repositories/{id}/edit`). Registrar `repoId` e `repoName` em variáveis de escopo do `test.describe`.
    - expect: Repositório é criado com sucesso. Toast 'Repositório criado com sucesso' é exibido (REVISAR-FIGMA: confirmar texto exato — usar `.chakra-toast` + `.first()` conforme skill testar-toast-chakra-twygo).
    - expect: URL redireciona para `/o/{orgId}/knowledge_repositories/{id}/edit`, permitindo capturar o ID via `page.url().match(/knowledge_repositories\/([0-9]+)\/edit/)[1]`.
    - expect: `repoId` e `repoName` armazenados para uso nos passos seguintes e no afterAll.
  2. Verificar existência do fixture `projects/base-de-conhecimento/data/fixtures/sample.png` (arquivo PNG válido, ≤ 50 MB, recomendado ~2 MB). Se o arquivo não existir, marcar o test como `test.fixme(true, 'Fixture sample.png ausente em projects/base-de-conhecimento/data/fixtures/ — providenciar antes de executar')` e encerrar o teste sem falha.
    - expect: Arquivo `sample.png` existe em `projects/base-de-conhecimento/data/fixtures/`. Se ausente, test é marcado fixme e não prossegue — relatório mostra amarelo, não vermelho.
  3. Acessar a tela de edição do repositório criado no beforeAll: chamar `safeGoto(page, `/o/${getOrgId()}/knowledge_repositories/${repoId}/edit`)` (usando `safeGoto` de `src/utils/modals.ts` para garantir `dismissCommonModals` — modal detectado no recon). Aguardar container `[data-test-id='knowledge-repositories-form-tabs-container']` estar visível.
    - expect: Página carrega mostrando heading 'Identificação do repositório'.
    - expect: Aba 'Identificação' está selecionada como padrão.
    - expect: Tabs visíveis: `[data-test-id='tab-identification']`, `[data-test-id='tab-sources']`, `[data-test-id='tab-resources']` — todos confirmados no recon de 2026-05-19.
  4. Clicar na aba 'Recursos de mídia' via `page.getByTestId('tab-resources').click()` (data-test-id `tab-resources` confirmado no recon: role=tab, name='Recursos de mídia'). Aguardar a aba ficar ativa via `expect(page.getByTestId('tab-resources')).toHaveAttribute('aria-selected', 'true')`.
    - expect: Aba 'Recursos de mídia' fica selecionada (`aria-selected='true'`).
    - expect: Componente ListControl de mídias é exibido (container da aba de recursos).
    - expect: REVISAR-FIGMA: confirmar se o botão '+ Adicionar mídia' está imediatamente visível sem scroll, ou se aparece somente após a aba carregar conteúdo (pode ser lazy).
  5. Clicar no botão '+ Adicionar mídia' para abrir o componente de upload. REVISAR-FIGMA: o texto exato deve ser confirmado ao vivo — usar `getByRole('button', { name: /adicionar mídia/i })` como locator primário (sem data-test-id específico no recon da aba de mídia). Aguardar o componente de upload (input type='file' ou dropzone) aparecer.
    - expect: Componente de upload de mídia fica visível (dropzone ou input de arquivo interagível).
    - expect: REVISAR-FIGMA: confirmar se aparece modal, drawer ou inline dropzone — impacta o seletor do `input[type='file']`.
  6. Realizar upload do arquivo PNG via `setInputFiles`: localizar `input[type='file']` dentro do componente de upload (estratégia: `page.locator('input[type="file"]').last()` como fallback quando não há data-test-id; se o componente expõe data-test-id, usar `getByTestId`). Chamar `.setInputFiles(resolve(__dirname, '../../../../../data/fixtures/sample.png'))`. Aguardar resposta da rede via `page.waitForResponse(resp => resp.url().includes('/knowledge_repositories/') && resp.url().includes('/resources') && resp.request().method() === 'POST')`.
    - expect: Toast 'Arquivo enviado com sucesso' aparece (REVISAR-FIGMA: confirmar texto exato). Usar `page.locator('.chakra-toast').filter({ hasText: /enviado com sucesso/i }).first()` conforme skill testar-toast-chakra-twygo.
    - expect: Listagem de mídias atualiza exibindo o arquivo `sample.png` (ou o nome original do arquivo) com algum indicador de status.
    - expect: Nenhum toast de erro ('Formato não suportado', 'tamanho excedido') é exibido.
  7. Asserir que a linha do arquivo PNG aparece na listagem de mídias via `expect(page.getByText('sample.png')).toBeVisible()`. Adicionalmente verificar via `KnowledgeRepositoryFormPage.getMidiaUploadStatus('sample.png')` (método a ser adicionado ao POM) que o status não é 'Erro'.
    - expect: Nome do arquivo 'sample.png' é visível na listagem de mídias.
    - expect: Status exibido é 'Pendente' ou 'Processando' (ambos aceitos — status 'Concluído' depende de processamento assíncrono de backend e não é garantido em tempo de teste).
    - expect: Status NÃO é 'Erro'.
  8. Executar afterAll: criar contexto Playwright fresco com storageState (`STORAGE_STATE`). Navegar para `/o/${getOrgId()}/knowledge_repositories/${repoId}/edit`. Deletar a mídia carregada via `KnowledgeRepositoryFormPage.deleteMidia('sample.png')` (método a ser adicionado ao POM — variant `*_safe` para ser tolerante a falhas). Em seguida deletar o repositório via `deleteRepositoryByIdSafe(repoId)` (ou equivalente na listagem). Fechar o contexto no bloco `finally`.
    - expect: Mídia 'sample.png' é removida da listagem de mídias do repositório.
    - expect: Repositório worker-isolated é deletado da listagem.
    - expect: Env não acumula orphans — volta ao estado anterior ao teste.

#### 1.2. Upload de arquivo JPG dentro do limite

**File:** `projects/base-de-conhecimento/tests/features/recursos-de-midia-upload-de-imagens/upload-de-arquivo-jpg-dentro-do-limite.spec.ts`

**Steps:**
  1. Configurar beforeAll: criar contexto Playwright fresco com storageState. Criar repositório worker-isolated com nome `Repositório Mídia JPG w{workerIndex}-{timestamp}` via `safeGoto` para `/o/${getOrgId()}/knowledge_repositories/new`, preencher Nome, Descrição 'Repositório de teste automatizado — não excluir manualmente', selecionar Categoria 'Geral' e Classificação 'Interno', clicar Salvar e capturar `repoId` da URL de redirect.
    - expect: Repositório criado com sucesso. `repoId` capturado da URL `/o/{orgId}/knowledge_repositories/{id}/edit`.
  2. Verificar existência do fixture `projects/base-de-conhecimento/data/fixtures/sample.jpg` (arquivo JPG válido, ≤ 50 MB, recomendado ~4 MB). Se ausente, marcar test como `test.fixme(true, 'Fixture sample.jpg ausente em projects/base-de-conhecimento/data/fixtures/ — providenciar antes de executar')` e encerrar.
    - expect: Arquivo `sample.jpg` existe em `projects/base-de-conhecimento/data/fixtures/`. Se ausente, test é marcado fixme.
  3. Acessar a aba 'Recursos de mídia' do repositório: chamar `safeGoto(page, `/o/${getOrgId()}/knowledge_repositories/${repoId}/edit`)`. Aguardar `[data-test-id='knowledge-repositories-form-tabs-container']` visível. Clicar em `page.getByTestId('tab-resources')`. Aguardar `aria-selected='true'` na aba.
    - expect: Aba 'Recursos de mídia' fica ativa.
    - expect: Componente de listagem de mídias é exibido.
  4. Clicar no botão '+ Adicionar mídia' via `getByRole('button', { name: /adicionar mídia/i })`. Aguardar componente de upload aparecer. Realizar upload de `sample.jpg` via `setInputFiles` no `input[type='file']` localizado dentro do componente de upload. Aguardar resposta POST para o endpoint de resources.
    - expect: Toast 'Arquivo enviado com sucesso' aparece — usar `.chakra-toast` + `.first()` conforme skill testar-toast-chakra-twygo.
    - expect: REVISAR-FIGMA: confirmar texto exato do toast de sucesso de upload de mídia.
    - expect: Listagem de mídias atualiza exibindo `sample.jpg` com status diferente de 'Erro'.
  5. Asserir via `expect(page.getByText('sample.jpg')).toBeVisible()` que o arquivo JPG aparece na listagem de mídias.
    - expect: Nome do arquivo 'sample.jpg' é visível na listagem de mídias.
    - expect: Status exibido é 'Pendente' ou 'Processando' — ambos aceitos.
  6. Executar afterAll: criar contexto Playwright fresco com storageState. Navegar para o edit do repositório. Deletar mídia 'sample.jpg' via `KnowledgeRepositoryFormPage.deleteMidia('sample.jpg')` (variant *_safe). Deletar repositório via `deleteRepositoryByIdSafe(repoId)`. Fechar contexto no bloco `finally`.
    - expect: Mídia e repositório removidos. Env limpo, sem orphans.

#### 1.3. Tentar upload de arquivo com formato não suportado

**File:** `projects/base-de-conhecimento/tests/features/recursos-de-midia-upload-de-imagens/tentar-upload-de-arquivo-com-formato-nao-suportado.spec.ts`

**Steps:**
  1. Configurar beforeAll: criar contexto Playwright fresco com storageState. Criar repositório worker-isolated com nome `Repositório Mídia Formato Inv w{workerIndex}-{timestamp}` via `safeGoto` + form Identificação (Nome, Descrição, Categoria 'Geral', Classificação 'Interno', Salvar). Capturar `repoId`. Adicionalmente, verificar se `projects/base-de-conhecimento/data/fixtures/sample.mp4` existe — se não existir, gerar arquivo mp4 falso (1 KB) via `fs.writeFileSync(mp4Path, Buffer.alloc(1024))` e registrar flag `generatedMp4 = true` para cleanup. MP4 é o formato inválido canônico para a aba de Recursos de Mídia (aceita JPG/JPEG/PNG; MP4 é aceito em Fontes de Conhecimento, não em Mídia).
    - expect: Repositório criado com sucesso. `repoId` capturado.
    - expect: Arquivo `sample.mp4` existe em `data/fixtures/` (gerado ou pré-existente).
  2. Acessar a aba 'Recursos de mídia' do repositório: `safeGoto` para `/o/${getOrgId()}/knowledge_repositories/${repoId}/edit`, clicar em `page.getByTestId('tab-resources')`, aguardar `aria-selected='true'` na aba.
    - expect: Aba 'Recursos de mídia' ativa.
    - expect: Componente de upload pronto.
  3. Clicar no botão '+ Adicionar mídia' via `getByRole('button', { name: /adicionar mídia/i })`. Aguardar componente de upload aparecer. Realizar upload do arquivo `sample.mp4` via `setInputFiles` no `input[type='file']`. NÃO aguardar resposta de rede (a rejeição pode ocorrer client-side antes do POST, ou o backend retorna 422). Aguardar toast de erro aparecer via `page.locator('.chakra-toast').filter({ hasText: /formato|suportado|permitido/i }).first().waitFor({ state: 'visible', timeout: 10_000 })`.
    - expect: Toast de erro é exibido com mensagem sobre formato não suportado (REVISAR-FIGMA: confirmar texto exato — 'Formato de arquivo não suportado' é inferido do padrão Twygo).
    - expect: Usar locator regex `/formato.*suportado|tipo.*permitido/i` para tolerância a variações de texto.
    - expect: Arquivo MP4 NÃO aparece na listagem de mídias.
  4. Asserir ausência de linha com 'sample.mp4' na listagem de mídias via `expect(page.getByText('sample.mp4')).toBeHidden()` ou `not.toBeVisible()`.
    - expect: Nenhuma linha com 'sample.mp4' visível na listagem de mídias.
    - expect: Listagem permanece vazia (ou com mídias anteriores, se houver) — o arquivo inválido não foi adicionado.
  5. Executar afterAll: criar contexto Playwright fresco com storageState. Deletar repositório via `deleteRepositoryByIdSafe(repoId)` (sem mídias criadas, delete é direto). Se `generatedMp4 === true`, deletar `data/fixtures/sample.mp4` via `fs.unlinkSync`. Fechar contexto no bloco `finally`.
    - expect: Repositório removido do env sem orphans.
    - expect: Arquivo gerado no beforeAll removido do disco (evitar commitar arquivo desnecessário).

#### 1.4. Tentar upload de imagem acima do limite de 50 MB

**File:** `projects/base-de-conhecimento/tests/features/recursos-de-midia-upload-de-imagens/tentar-upload-de-imagem-acima-do-limite-de-50-mb.spec.ts`

**Steps:**
  1. Configurar beforeAll com duas operações paralelas: (1) criar contexto Playwright fresco com storageState, criar repositório worker-isolated com nome `Repositório Mídia Oversized w{workerIndex}-{timestamp}` via form Identificação e capturar `repoId`; (2) verificar se `projects/base-de-conhecimento/data/fixtures/oversized-51mb.png` existe — se não existir, gerar via `fs.writeFileSync(oversizedPath, Buffer.alloc(51 * 1024 * 1024))` (arquivo binário com extensão `.png`, 53.477.376 bytes), registrar flag `generatedOversized = true`. Usar extensão `.png` para garantir que a rejeição seja por tamanho e não por formato.
    - expect: Repositório criado com sucesso. `repoId` capturado da URL de redirect.
    - expect: Arquivo `oversized-51mb.png` existe em `data/fixtures/` com 51 MB exatos.
    - expect: Flag `generatedOversized` registrada para controle de cleanup no afterAll.
  2. Acessar a aba 'Recursos de mídia' do repositório criado: `safeGoto(page, `/o/${getOrgId()}/knowledge_repositories/${repoId}/edit`)`. Aguardar container de tabs. Clicar em `page.getByTestId('tab-resources')`. Aguardar `aria-selected='true'` na aba.
    - expect: Aba 'Recursos de mídia' ativa.
    - expect: Componente ListControl de mídias é exibido.
  3. Clicar no botão '+ Adicionar mídia' via `getByRole('button', { name: /adicionar mídia/i })`. Aguardar componente de upload aparecer. Realizar upload do arquivo `oversized-51mb.png` via `setInputFiles` no `input[type='file']` do componente. Aguardar toast de erro aparecer via `page.locator('.chakra-toast').filter({ hasText: /excede|tamanho|50.*MB/i }).first().waitFor({ state: 'visible', timeout: 15_000 })` (timeout maior pois o arquivo de 51 MB pode levar mais tempo para ser processado pelo frontend/backend antes da rejeição).
    - expect: Toast de erro é exibido com mensagem sobre tamanho excedido (REVISAR-FIGMA: confirmar texto exato — 'Arquivo excede o tamanho máximo permitido (50 MB)' é inferido).
    - expect: Usar locator regex `/excede|tamanho máximo|50 ?MB/i` para tolerância.
    - expect: Arquivo `oversized-51mb.png` NÃO aparece na listagem de mídias.
  4. Asserir ausência de linha com 'oversized-51mb.png' na listagem de mídias: `expect(page.getByText('oversized-51mb.png')).toBeHidden()` ou `not.toBeVisible()`.
    - expect: Nenhuma linha com 'oversized-51mb.png' visível na listagem.
    - expect: Listagem permanece vazia ou com mídias anteriores — o arquivo oversized não foi adicionado.
  5. Executar afterAll: (1) criar contexto Playwright fresco com storageState, deletar repositório via `deleteRepositoryByIdSafe(repoId)`, fechar contexto no bloco `finally`; (2) se `generatedOversized === true`, deletar `data/fixtures/oversized-51mb.png` via `fs.unlinkSync` (evitar commitar arquivo de 51 MB no git — este arquivo NÃO deve ser versionado).
    - expect: Repositório removido do env sem orphans.
    - expect: Arquivo `oversized-51mb.png` deletado do disco se foi gerado no beforeAll — env não acumula arquivo de 51 MB entre runs.

#### 1.5. Validar exibição dos formatos aceitos

**File:** `projects/base-de-conhecimento/tests/features/recursos-de-midia-upload-de-imagens/validar-exibicao-dos-formatos-aceitos.spec.ts`

**Steps:**
  1. Configurar beforeAll: criar contexto Playwright fresco com storageState. Criar repositório worker-isolated com nome `Repositório Mídia Formatos w{workerIndex}-{timestamp}` via `safeGoto` + form Identificação (Nome, Descrição, Categoria 'Geral', Classificação 'Interno', Salvar). Capturar `repoId` da URL de redirect.
    - expect: Repositório criado com sucesso. `repoId` capturado.
  2. Acessar a aba 'Recursos de mídia' do repositório: `safeGoto(page, `/o/${getOrgId()}/knowledge_repositories/${repoId}/edit`)`. Aguardar `[data-test-id='knowledge-repositories-form-tabs-container']` visível. Clicar em `page.getByTestId('tab-resources')`. Aguardar `aria-selected='true'` na aba.
    - expect: Aba 'Recursos de mídia' está ativa e selecionada.
    - expect: Componente de mídias é exibido.
  3. Verificar se o texto informativo de formatos aceitos está visível SEM interação adicional via `expect(page.getByText(/JPG.*JPEG.*PNG.*50.*MB/i)).toBeVisible()`. REVISAR-FIGMA: o texto pode estar inline na aba ou aparecer somente após clicar em '+ Adicionar mídia' para abrir o dropzone. Se a asserção inline falhar, clicar em `getByRole('button', { name: /adicionar mídia/i })` para abrir o componente de upload e repetir a asserção.
    - expect: Texto contendo 'JPG', 'JPEG', 'PNG' e '50 MB' (ou variação textual equivalente) é visível na aba de Recursos de Mídia.
    - expect: REVISAR-FIGMA: o texto exato do MD canônico é 'JPG, JPEG, PNG (até 50 MB)' — confirmar se o produto usa essa exata string ou uma variação (ex: 'Formatos aceitos: JPG, JPEG, PNG').
  4. Se o passo anterior exigiu clicar em '+ Adicionar mídia' para exibir o texto, asserir também que o dropzone/componente de upload está visível e contém o texto de formatos aceitos via `expect(page.locator('[role="dialog"], [data-test-id*="upload"], .chakra-modal__body').getByText(/JPG.*JPEG.*PNG/i)).toBeVisible()`.
    - expect: Componente de upload exibe claramente os formatos aceitos: JPG, JPEG, PNG.
    - expect: Limite de tamanho '50 MB' (ou '50MB') é exibido junto aos formatos aceitos.
    - expect: A informação é acessível ao usuário sem necessidade de realizar um upload primeiro.
  5. Executar afterAll: criar contexto Playwright fresco com storageState. Deletar repositório via `deleteRepositoryByIdSafe(repoId)`. Fechar contexto no bloco `finally`.
    - expect: Repositório worker-isolated removido do env.
    - expect: Env volta ao estado anterior ao teste — sem orphans.
