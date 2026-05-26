# Fontes de Conhecimento - Upload de documentos

## Application Overview

Suite de testes E2E para a funcionalidade "Fontes de Conhecimento - Upload de documentos" da plataforma Twygo, módulo Base de Conhecimento. Cobre upload de formatos aceitos (PDF, DOCX), rejeição de formato inválido, rejeição por tamanho excedente e validação da UI do componente de upload. Todos os TCs exigem um repositório de teste criado via beforeAll e limpo via afterAll (anti-pattern G do CLAUDE.md). Feature flag `habilitar_base_de_conhecimento` deve estar ativa. Ambiente: staging-base-de-conhecimento (org 37007). Fixtures físicas (sample.pdf, sample.docx, sample.exe, oversized-51mb.bin) devem existir em `projects/base-de-conhecimento/data/fixtures/` — specs são marcados fixme até serem providenciadas.

## Test Scenarios

### 1. Fontes de Conhecimento - Upload de documentos

**Seed:** `tests/seed.spec.ts`

#### 1.1. Upload de arquivo PDF dentro do limite

**File:** `projects/base-de-conhecimento/tests/features/fontes-de-conhecimento-upload-de-documentos/upload-de-arquivo-pdf-dentro-do-limite.spec.ts`

**Steps:**
  1. Configurar beforeAll: criar contexto Playwright fresco com storageState (`outputs/.auth/storage.json`), instanciar `KnowledgeRepositoryFormPage`, criar repositório worker-isolated com nome `Repositório Upload PDF w{workerIndex}-{timestamp}` via POST no form Identificação (preencher Nome, Descrição, Categoria 'Geral', Classificação 'Interno', clicar Salvar) e capturar o ID do repositório criado a partir da URL de redirect. Registrar o nome e ID em variáveis de escopo do `test.describe`.
    - expect: Repositório é criado com sucesso. Toast 'Repositório criado com sucesso' é exibido (REVISAR-FIGMA: confirmar texto exato). URL redireciona para `/o/{orgId}/knowledge_repositories/{id}/edit` permitindo capturar o ID.
  2. Verificar existência do fixture `projects/base-de-conhecimento/data/fixtures/sample.pdf` (≤ 5 MB). Se não existir, marcar test como `test.fixme(true, 'Fixture sample.pdf ausente em data/fixtures/ — providenciar antes de executar')` e encerrar.
    - expect: Arquivo sample.pdf existe em `projects/base-de-conhecimento/data/fixtures/`. Se ausente, test é marcado fixme e não prossegue.
  3. Acessar a tela de edição do repositório criado no beforeAll via `safeGoto(page, `/o/${getOrgId()}/knowledge_repositories/${repoId}/edit`)` (usando `safeGoto` de `src/utils/modals.ts` para `dismissCommonModals`). Aguardar o container `[data-test-id='knowledge-repositories-form-tabs-container']` estar visível.
    - expect: Aba 'Identificação' está selecionada. Heading 'Identificação do repositório' é visível. Tab `[data-test-id='tab-sources']` com nome 'Fontes de conhecimento' está presente.
  4. Clicar na aba 'Fontes de conhecimento' via `page.getByTestId('tab-sources').click()` (data-test-id confirmado no recon: `tab-sources`, role=tab, name='Fontes de conhecimento').
    - expect: Aba 'Fontes de conhecimento' fica selecionada (`aria-selected='true'`). Componente ListControl de fontes é exibido. REVISAR-FIGMA: verificar se botão '+ Adicionar fonte' está imediatamente visível ou se a lista de fontes é exibida primeiro.
  5. Clicar no botão '+ Adicionar fonte'. REVISAR-FIGMA: o texto exato do botão deve ser confirmado ao vivo — usar `getByRole('button', { name: /adicionar fonte/i })` como fallback caso o data-test-id do botão não esteja disponível no recon. O recon capturado em `/new` não acessou a aba Fontes, portanto test-IDs do componente de upload são desconhecidos e devem ser descobertos na primeira execução.
    - expect: Componente de upload é exibido (dropzone ou input de arquivo se torna visível/interagível). REVISAR-FIGMA: confirmar se aparece modal, drawer ou inline dropzone.
  6. Realizar upload do arquivo PDF via `setInputFiles`: localizar o `input[type='file']` dentro do componente de upload (strategy: `page.locator('input[type="file"]').last()` — fallback caso não haja data-test-id) e chamar `.setInputFiles(resolve(__dirname, '../../../../../data/fixtures/sample.pdf'))`. Aguardar a resposta da rede (`page.waitForResponse` filtrando por `/knowledge_repositories/${repoId}/resources`).
    - expect: Toast 'Arquivo enviado com sucesso' aparece (REVISAR-FIGMA: confirmar texto exato). Usar `getToast('Arquivo enviado com sucesso').first()` do padrão da skill `testar-toast-chakra-twygo`. Listagem de fontes atualiza exibindo o arquivo `sample.pdf` com status 'Pendente' ou 'Processando' (REVISAR-FIGMA: confirmar labels de status). Arquivo NÃO deve estar com status 'Erro'.
  7. Verificar que a linha do arquivo `sample.pdf` aparece na listagem de fontes. Asserir que o nome do arquivo está visível via `expect(page.getByText('sample.pdf')).toBeVisible()`.
    - expect: Linha com nome 'sample.pdf' é visível na listagem de fontes. Status exibido é 'Pendente' ou 'Processando' (ambos são aceitos — o status final 'Concluído' depende de processamento assíncrono de backend).
  8. Executar afterAll: criar contexto Playwright fresco com storageState, navegar para `/o/${getOrgId()}/knowledge_repositories`, chamar `deleteRepositoryByIdSafe(repoId)` (variant *_safe a ser criado em `KnowledgeRepositoryFormPage` ou página de listagem). Se a fonte de conhecimento bloquear a exclusão do repositório, excluir a fonte primeiro via `deleteFonteSafe(filename)` e depois o repositório.
    - expect: Repositório worker-isolated é deletado. Env não acumula orphans. Sem o repositório, env volta ao estado anterior ao teste.

#### 1.2. Upload de arquivo DOCX dentro do limite

**File:** `projects/base-de-conhecimento/tests/features/fontes-de-conhecimento-upload-de-documentos/upload-de-arquivo-docx-dentro-do-limite.spec.ts`

**Steps:**
  1. Configurar beforeAll: criar contexto Playwright fresco com storageState, criar repositório worker-isolated `Repositório Upload DOCX w{workerIndex}-{timestamp}` via form Identificação (campos: Nome, Descrição 'Repositório de teste automatizado — não excluir manualmente', Categoria 'Geral', Classificação 'Interno', Salvar) e capturar ID do repositório da URL.
    - expect: Repositório criado com sucesso e ID capturado da URL de redirect para `/edit`.
  2. Verificar existência do fixture `projects/base-de-conhecimento/data/fixtures/sample.docx` (≤ 3 MB). Se não existir, marcar test como `test.fixme(true, 'Fixture sample.docx ausente em data/fixtures/ — providenciar antes de executar')` e encerrar.
    - expect: Arquivo sample.docx existe. Se ausente, test é marcado fixme.
  3. Acessar a aba 'Fontes de conhecimento' do repositório criado: navegar via `safeGoto` para `/o/${getOrgId()}/knowledge_repositories/${repoId}/edit`, aguardar o container de tabs, clicar em `getByTestId('tab-sources')`.
    - expect: Aba 'Fontes de conhecimento' fica ativa (aria-selected='true'). Componente de upload / listagem vazia é exibido.
  4. Realizar upload do DOCX via `setInputFiles` no `input[type='file']` do componente de upload, usando o path absoluto resolvido de `data/fixtures/sample.docx`. Aguardar resposta da rede (POST para resources endpoint).
    - expect: Toast 'Arquivo enviado com sucesso' é exibido (`.chakra-toast` filtrado por texto + `.first()`). Listagem de fontes atualiza exibindo `sample.docx` com status 'Pendente' ou 'Processando'. Arquivo não está em estado 'Erro'.
  5. Asserir que `sample.docx` aparece na listagem via `expect(page.getByText('sample.docx')).toBeVisible()`.
    - expect: Nome do arquivo DOCX é visível na listagem de fontes.
  6. Executar afterAll: contexto fresco, deletar fonte `sample.docx` via `deleteFonteSafe` (se necessário para desbloqueio), deletar repositório via `deleteRepositoryByIdSafe(repoId)`.
    - expect: Repositório e fontes são removidos do env sem orphans.

#### 1.3. Tentar upload de arquivo com formato não suportado

**File:** `projects/base-de-conhecimento/tests/features/fontes-de-conhecimento-upload-de-documentos/tentar-upload-de-arquivo-com-formato-nao-suportado.spec.ts`

**Steps:**
  1. Configurar beforeAll: criar contexto Playwright fresco, criar repositório worker-isolated `Repositório Formato Invalido w{workerIndex}-{timestamp}` e capturar ID.
    - expect: Repositório criado com sucesso.
  2. Verificar existência do fixture `projects/base-de-conhecimento/data/fixtures/sample.exe`. Este é um arquivo binário simples (1 KB) gerado via `fs.writeFileSync` no beforeAll se não existir, ou usar `Buffer.alloc(1024)` com extensão `.exe`. Se a fixture não puder ser gerada automaticamente, marcar test como `test.fixme(true, 'Fixture sample.exe ausente — criar arquivo binário com extensão .exe em data/fixtures/')`.
    - expect: Arquivo sample.exe existe (pode ser um buffer vazio renomeado). O conteúdo não importa — apenas a extensão é validada pelo frontend.
  3. Acessar a aba 'Fontes de conhecimento' do repositório: `safeGoto` para `/o/${getOrgId()}/knowledge_repositories/${repoId}/edit`, clicar em `getByTestId('tab-sources')`. Aguardar componente de upload estar visível.
    - expect: Aba 'Fontes de conhecimento' ativa. Componente de upload pronto.
  4. Realizar upload do arquivo `sample.exe` via `setInputFiles`. Não aguardar resposta de rede (formato inválido deve ser rejeitado no cliente antes do POST, ou o backend deve retornar 422).
    - expect: Toast de erro exibido: 'Formato de arquivo não suportado' (REVISAR-FIGMA: confirmar texto exato — pode ser 'Tipo de arquivo não permitido' ou similar). Usar `getToast(/formato.*suportado|tipo.*permitido/i).first()`. Arquivo EXE NÃO aparece na listagem de fontes.
  5. Asserir ausência de `sample.exe` na listagem de fontes: `expect(page.getByText('sample.exe')).toBeHidden()` ou `not.toBeVisible()`.
    - expect: Nenhuma linha com 'sample.exe' é visível na listagem de fontes.
  6. Executar afterAll: contexto fresco, deletar repositório via `deleteRepositoryByIdSafe(repoId)` (sem fontes criadas, o delete é direto).
    - expect: Repositório removido. Env limpo.

#### 1.4. Tentar upload de arquivo acima do limite de 50 MB

**File:** `projects/base-de-conhecimento/tests/features/fontes-de-conhecimento-upload-de-documentos/tentar-upload-de-arquivo-acima-do-limite-de-50-mb.spec.ts`

**Steps:**
  1. Configurar beforeAll: (1) criar contexto Playwright fresco, criar repositório worker-isolated `Repositório Tamanho Excedido w{workerIndex}-{timestamp}` e capturar ID; (2) gerar arquivo oversized em `projects/base-de-conhecimento/data/fixtures/oversized-51mb.bin` via `fs.writeFileSync(path, Buffer.alloc(51 * 1024 * 1024))` — se já existir, reutilizar. Registrar flag `generatedOversized` para cleanup.
    - expect: Repositório criado com sucesso. Arquivo oversized-51mb.bin gerado com exatamente 51 MB (53.477.376 bytes) em `data/fixtures/`.
  2. Acessar a aba 'Fontes de conhecimento' do repositório criado: `safeGoto` para a URL de edição, clicar em `getByTestId('tab-sources')`. Aguardar componente de upload.
    - expect: Aba 'Fontes de conhecimento' ativa. Componente de upload visível.
  3. Realizar upload do arquivo `oversized-51mb.bin` via `setInputFiles`. O arquivo tem 51 MB — acima do limite de 50 MB. Aguardar resposta ou rejeição client-side.
    - expect: Toast de erro exibido: 'Arquivo excede o tamanho máximo permitido (50 MB)' (REVISAR-FIGMA: confirmar texto exato). Usar `getToast(/excede|tamanho|50 ?MB/i).first()`. Arquivo NÃO aparece na listagem de fontes.
  4. Asserir ausência de `oversized-51mb.bin` na listagem: `expect(page.getByText('oversized-51mb.bin')).toBeHidden()` ou `not.toBeVisible()`.
    - expect: Nenhuma linha com o arquivo oversized na listagem de fontes.
  5. Executar afterAll: (1) deletar repositório via `deleteRepositoryByIdSafe(repoId)` com contexto fresco; (2) se `generatedOversized === true`, deletar `data/fixtures/oversized-51mb.bin` via `fs.unlinkSync` (evitar commitar arquivo de 51 MB no git).
    - expect: Repositório removido do env. Arquivo oversized deletado do disco se foi gerado no beforeAll.

#### 1.5. Validar exibição dos formatos aceitos no componente de upload

**File:** `projects/base-de-conhecimento/tests/features/fontes-de-conhecimento-upload-de-documentos/validar-exibicao-dos-formatos-aceitos-no-componente-de-upload.spec.ts`

**Steps:**
  1. Configurar beforeAll: criar contexto Playwright fresco, criar repositório worker-isolated `Repositório Formatos Aceitos w{workerIndex}-{timestamp}` e capturar ID.
    - expect: Repositório criado com sucesso.
  2. Acessar a aba 'Fontes de conhecimento' do repositório: `safeGoto` para `/o/${getOrgId()}/knowledge_repositories/${repoId}/edit`, aguardar tabs, clicar em `getByTestId('tab-sources')`.
    - expect: Aba 'Fontes de conhecimento' ativa (`aria-selected='true'` no botão `tab-sources`).
  3. Aguardar o texto informativo dos formatos aceitos ficar visível. O texto esperado é 'DOCX, PPTX, PDF, MP4, MP3 (até 50 MB)'. Asserir via `expect(page.getByText(/DOCX.*PPTX.*PDF.*MP4.*MP3.*50 ?MB/i)).toBeVisible()`. REVISAR-FIGMA: o texto pode estar na dropzone ou em um elemento de caption do componente de upload — se o botão '+ Adicionar fonte' precisar ser clicado primeiro para exibir o texto, adicionar esse passo antes da asserção.
    - expect: Texto 'DOCX, PPTX, PDF, MP4, MP3 (até 50 MB)' (ou variação textual equivalente) é visível no componente de upload sem interação adicional — OU após clicar em '+ Adicionar fonte' para abrir o dropzone.
  4. Se o botão '+ Adicionar fonte' precisou ser clicado (REVISAR-FIGMA), asserir também que o componente de upload / dropzone está visível e contém o texto de formatos aceitos.
    - expect: Componente de upload exibe claramente quais formatos são aceitos: DOCX, PPTX, PDF, MP4, MP3, e o limite de 50 MB.
  5. Executar afterAll: contexto fresco, deletar repositório via `deleteRepositoryByIdSafe(repoId)`.
    - expect: Repositório removido. Env limpo.
