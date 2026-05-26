# Criação de repositório - Aba Identificação

## Application Overview

Suíte de testes para o módulo "Base de conhecimento" da plataforma Twygo, cobrindo a aba "Identificação" do form de criação/edição de repositórios de conhecimento. Ambiente: staging-base-de-conhecimento (https://basedeconhecimento.stage.twygoead.com, orgId 37007). Pré-condição global: Feature flag `habilitar_base_de_conhecimento` ativa na org; usuário logado como Admin via storageState do globalSetup (sem login no spec). Page Object central: KnowledgeRepositoryFormPage em projects/base-de-conhecimento/pages/. Seletores chave validados no recon ao vivo (2026-05-19): data-test-id com hífen conforme playwright.config.ts. Playbooks ativos: beforeunload, cleanup-dados, toast-chakra. Nomes de recursos worker-isolated: `Repositório TC{n} w${testInfo.workerIndex}-${Date.now()}`.

## Test Scenarios

### 1. Criação de repositório - Aba Identificação

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC1 — Criar repositório com dados válidos

**File:** `projects/base-de-conhecimento/tests/features/criacao-de-repositorio-aba-identificacao/criar-repositorio-com-dados-validos.spec.ts`

**Steps:**
  1. Importar dados do arquivo `.data.ts` adjacente: `repoName` (worker-isolated: `Repositório TC1 w${testInfo.workerIndex}-${Date.now()}`), `descricao` ('Repositório de teste automatizado'), `categoria` ('Geral'), `classificacao` ('Interno'). Importar `getOrgId` de `src/utils/environment.ts`. Registrar `afterAll` com contexto fresco que chama `KnowledgeRepositoryListPage.deleteRepositoryByNameSafe(repoName)` para cleanup obrigatório.
    - expect: Arquivo .data.ts existe ao lado do spec com todos os campos nomeados semanticamente. afterAll está registrado antes de qualquer test()
  2. Acessar a URL de listagem: `safeGoto(page, `/o/${getOrgId()}/knowledge_repositories`)` usando `safeGoto` de `src/utils/modals.ts` para dispensar modais oportunistas (NPS Sofia, etc.). Aguardar que `page.getByTestId('knowledge-repositories-list-container')` seja visível.
    - expect: Listagem é exibida — elemento com data-test-id='knowledge-repositories-list-container' está visível.
  3. Clicar no botão 'Adicionar': `page.getByRole('button', { name: 'Adicionar' }).click()`. Aguardar redirect para a URL `/knowledge_repositories/new` via `expect(page).toHaveURL(/knowledge_repositories\/new/)`. Aguardar que `page.getByTestId('knowledge-repositories-form-identification')` seja visível.
    - expect: Sistema redireciona para a tela de criação. Aba 'Identificação' é exibida — elemento com data-test-id='knowledge-repositories-form-identification' está visível. Tab 'Identificação' está selecionado (`getByTestId('tab-identification')` com `aria-selected='true'`).
  4. Preencher o campo 'Nome': `page.getByLabel('Nome*').fill(data.repoName)`. Verificar que o campo exibe o texto digitado via `expect(page.getByLabel('Nome*')).toHaveValue(data.repoName)`. Alternativa de seletor se getByLabel ambíguo: `page.getByPlaceholder('Digite o nome do repositório').fill(data.repoName)`.
    - expect: Campo 'Nome' exibe o texto digitado (valor igual a `data.repoName`).
  5. Preencher o campo 'Descrição': `page.getByLabel('Descrição*').fill(data.descricao)`. Alternativa: `page.getByPlaceholder('Descreva o conteúdo deste repositório').fill(data.descricao)`. Verificar via `expect(page.getByLabel('Descrição*')).toHaveValue(data.descricao)`.
    - expect: Campo 'Descrição' exibe o texto digitado.
  6. Selecionar 'Geral' no dropdown 'Categoria': `page.getByLabel('Categoria').selectOption(data.categoria)`. Se o dropdown for Chakra (não select nativo), usar `page.getByRole('combobox', { name: 'Categoria' }).click()` seguido de `page.getByRole('option', { name: data.categoria }).click()`. Marcar com `// REVISAR: confirmar se Categoria é select nativo ou Chakra Select ao vivo`.
    - expect: Dropdown 'Categoria' exibe a opção 'Geral' selecionada.
  7. Selecionar 'Interno' no dropdown 'Classificação': `page.getByLabel('Classificação').selectOption(data.classificacao)`. Mesma ressalva sobre Chakra Select — marcar `// REVISAR: confirmar tipo de Classificação`. Verificar que a opção selecionada exibe 'Interno'.
    - expect: Dropdown 'Classificação' exibe a opção 'Interno' selecionada.
  8. Clicar em 'Salvar': `page.getByTestId('knowledge-repositories-form-save-button').click()`. Aguardar toast de sucesso via `formPage.getToast('Repositório criado com sucesso').first()` — `expect(toast).toBeVisible()`. Aguardar redirect ou permanência em tela de edição via URL check (`/knowledge_repositories` OU `/knowledge_repositories/\d+/edit`). — REVISAR-FIGMA: texto exato do toast de sucesso na criação.
    - expect: Toast com texto 'Repositório criado com sucesso' é exibido (REVISAR-FIGMA — texto canônico a confirmar no produto). Sistema redireciona para a listagem ou permanece na tela de edição do repositório recém-criado. Repositório NÃO está duplicado na listagem.

#### 1.2. TC2 — Validar campo Nome obrigatório

**File:** `projects/base-de-conhecimento/tests/features/criacao-de-repositorio-aba-identificacao/validar-campo-nome-obrigatorio.spec.ts`

**Steps:**
  1. Importar dados do `.data.ts` adjacente: `descricao` ('Teste sem nome'), `categoria` ('Geral'), `classificacao` ('Interno'). Nenhum repositório é criado neste TC — sem afterAll de cleanup.
    - expect: Arquivo .data.ts existe e não contém nome de repositório (campo omitido intencionalmente).
  2. Acessar a tela de criação diretamente via `safeGoto(page, `/o/${getOrgId()}/knowledge_repositories/new`)`. Aguardar que `page.getByTestId('knowledge-repositories-form-identification')` seja visível.
    - expect: Aba 'Identificação' é exibida. Campo 'Nome' está vazio.
  3. Preencher o campo 'Descrição' com `data.descricao`: `page.getByPlaceholder('Descreva o conteúdo deste repositório').fill(data.descricao)`.
    - expect: Campo 'Descrição' exibe o texto 'Teste sem nome'.
  4. Selecionar 'Geral' no dropdown 'Categoria' usando o mesmo padrão do TC1 (Chakra ou select nativo — marcar `// REVISAR`).
    - expect: Dropdown 'Categoria' exibe a opção 'Geral' selecionada.
  5. Selecionar 'Interno' no dropdown 'Classificação' usando o mesmo padrão do TC1.
    - expect: Dropdown 'Classificação' exibe a opção 'Interno' selecionada.
  6. Clicar em 'Salvar': `page.getByTestId('knowledge-repositories-form-save-button').click()`. Aguardar mensagem de validação: `expect(formPage.getValidationMessage('nome')).toBeVisible()` onde `getValidationMessage` busca texto próximo ao campo Nome (ex: `page.getByText('Nome é obrigatório')`). — REVISAR-FIGMA: texto exato da mensagem de validação do campo Nome.
    - expect: Mensagem de validação 'Nome é obrigatório' é exibida junto ao campo Nome (REVISAR-FIGMA). Repositório NÃO é criado — URL permanece em `/knowledge_repositories/new`.

#### 1.3. TC3 — Validar campo Descrição obrigatório

**File:** `projects/base-de-conhecimento/tests/features/criacao-de-repositorio-aba-identificacao/validar-campo-descricao-obrigatorio.spec.ts`

**Steps:**
  1. Importar dados do `.data.ts` adjacente: `nomeRepo` ('Repositório sem descrição'), `categoria` ('Geral'), `classificacao` ('Interno'). Nenhum repositório é criado com sucesso neste TC — sem afterAll de cleanup.
    - expect: Arquivo .data.ts existe sem campo de descrição.
  2. Acessar a tela de criação diretamente via `safeGoto(page, `/o/${getOrgId()}/knowledge_repositories/new`)`. Aguardar que `page.getByTestId('knowledge-repositories-form-identification')` seja visível.
    - expect: Aba 'Identificação' é exibida. Campo 'Descrição' está vazio.
  3. Preencher o campo 'Nome' com `data.nomeRepo`: `page.getByPlaceholder('Digite o nome do repositório').fill(data.nomeRepo)`. Verificar `expect(page.getByPlaceholder('Digite o nome do repositório')).toHaveValue(data.nomeRepo)`.
    - expect: Campo 'Nome' exibe o texto 'Repositório sem descrição'.
  4. Selecionar 'Geral' no dropdown 'Categoria' usando o mesmo padrão (Chakra ou select nativo — marcar `// REVISAR`).
    - expect: Dropdown 'Categoria' exibe a opção 'Geral' selecionada.
  5. Selecionar 'Interno' no dropdown 'Classificação' usando o mesmo padrão.
    - expect: Dropdown 'Classificação' exibe a opção 'Interno' selecionada.
  6. Clicar em 'Salvar': `page.getByTestId('knowledge-repositories-form-save-button').click()`. Aguardar mensagem de validação próxima ao campo Descrição: `expect(page.getByText('Descrição é obrigatória')).toBeVisible()`. — REVISAR-FIGMA: texto exato da mensagem ('Descrição é obrigatória' ou 'Descrição é obrigatório').
    - expect: Mensagem de validação 'Descrição é obrigatória' é exibida junto ao campo Descrição (REVISAR-FIGMA). Repositório NÃO é criado — URL permanece em `/knowledge_repositories/new`.

#### 1.4. TC4 — Validar limite de caracteres do campo Nome

**File:** `projects/base-de-conhecimento/tests/features/criacao-de-repositorio-aba-identificacao/validar-limite-caracteres-campo-nome.spec.ts`

**Steps:**
  1. Importar dados do `.data.ts` adjacente: `nome255` (string de exatamente 255 caracteres — 'A'.repeat(255)), `nome256` (string de exatamente 256 caracteres — 'A'.repeat(256)). Gerar via constante no .data.ts, nunca inline no spec. Nenhum repositório é criado — sem afterAll de cleanup.
    - expect: Arquivo .data.ts contém `nome255` e `nome256` como constantes nomeadas semanticamente. `nome255.length === 255` e `nome256.length === 256` são verificáveis por leitura.
  2. Acessar a tela de criação diretamente via `safeGoto(page, `/o/${getOrgId()}/knowledge_repositories/new`)`. Aguardar que `page.getByTestId('knowledge-repositories-form-identification')` seja visível.
    - expect: Aba 'Identificação' é exibida com campo 'Nome' vazio.
  3. Preencher o campo 'Nome' com `data.nome256` (256 caracteres): `page.getByPlaceholder('Digite o nome do repositório').fill(data.nome256)`. Verificar o valor real do campo após fill: `const actualValue = await page.getByPlaceholder('Digite o nome do repositório').inputValue()`. Assertar que `actualValue.length <= 255` (truncamento via maxLength HTML) OU que mensagem de limite seja exibida.
    - expect: Campo 'Nome' trunca o input em 255 caracteres (comportamento via atributo maxLength=255 no input HTML) OU exibe mensagem 'Limite de 255 caracteres atingido' (REVISAR-FIGMA). `actualValue.length` deve ser 255, não 256.

#### 1.5. TC5 — Cancelar criação com alterações pendentes dispara beforeunload

**File:** `projects/base-de-conhecimento/tests/features/criacao-de-repositorio-aba-identificacao/cancelar-criacao-com-alteracoes-pendentes-dispara-beforeunload.spec.ts`

**Steps:**
  1. Importar dados do `.data.ts` adjacente: `nomeSujo` ('Teste cancelamento'). Nenhum repositório é criado — sem afterAll de cleanup.
    - expect: Arquivo .data.ts existe com campo `nomeSujo`.
  2. Acessar a tela de criação diretamente via `safeGoto(page, `/o/${getOrgId()}/knowledge_repositories/new`)`. Aguardar que `page.getByTestId('knowledge-repositories-form-identification')` seja visível.
    - expect: Aba 'Identificação' é exibida com form vazio.
  3. Preencher o campo 'Nome' com `data.nomeSujo` para deixar o form 'sujo': `page.getByPlaceholder('Digite o nome do repositório').fill(data.nomeSujo)`. Verificar `expect(page.getByPlaceholder('Digite o nome do repositório')).toHaveValue(data.nomeSujo)`.
    - expect: Campo 'Nome' exibe 'Teste cancelamento'. Form está no estado 'dirty' (alterações pendentes não salvas).
  4. Registrar handler de dialog ANTES do click (padrão canônico da skill `testar-beforeunload-dialog-twygo`): `let dialogTriggered = false; page.on('dialog', async (dialog) => { dialogTriggered = true; await dialog.dismiss(); });`. Em seguida clicar no botão 'Cancelar': `page.getByTestId('knowledge-repositories-form-cancel-button').click()`. O handler resolve o dialog inline — o `click()` retorna após o dismiss.
    - expect: Diálogo nativo beforeunload do browser é disparado (evento 'dialog' no page é capturado). Handler invoca `dialog.dismiss()` — usuário 'mantém na página'. O click retorna sem timeout.
  5. Após o click retornar, verificar que o usuário permaneceu na tela de criação: `expect(page).toHaveURL(/knowledge_repositories\/new/)`. Verificar que `dialogTriggered === true`. Verificar que o campo 'Nome' ainda contém `data.nomeSujo` (dados preservados após dismiss).
    - expect: URL permanece em `/knowledge_repositories/new`. Flag `dialogTriggered` é `true` (confirma que beforeunload foi disparado). Campo 'Nome' ainda exibe 'Teste cancelamento' (dismiss não apaga dados).

#### 1.6. TC6 — Editar repositório existente

**File:** `projects/base-de-conhecimento/tests/features/criacao-de-repositorio-aba-identificacao/editar-repositorio-existente.spec.ts`

**Steps:**
  1. Importar dados do `.data.ts` adjacente: `repoNameOriginal` (worker-isolated: `Repositório TC6 w${testInfo.workerIndex}-${Date.now()}`), `repoNameEditado` (`Repositório TC6 editado w${testInfo.workerIndex}-${Date.now()}`). Registrar `beforeAll` que cria o repositório alvo via API ou via UI (`KnowledgeRepositoryFormPage.goToCreate()` + preenchimento mínimo + save), armazenando o nome original. Registrar `afterAll` com contexto fresco que chama `KnowledgeRepositoryListPage.deleteRepositoryByNameSafe(data.repoNameEditado)` — usar o nome editado pois é o estado final.
    - expect: Arquivo .data.ts contém `repoNameOriginal` e `repoNameEditado` como constantes nomeadas. afterAll está registrado com `deleteRepositoryByNameSafe` usando o nome final.
  2. Acessar a URL de listagem via `safeGoto(page, `/o/${getOrgId()}/knowledge_repositories`)`. Aguardar que `page.getByTestId('knowledge-repositories-list-container')` seja visível. Verificar que o repositório alvo (`data.repoNameOriginal`) aparece na listagem.
    - expect: Listagem é exibida com o repositório alvo cadastrado e visível na tabela.
  3. Localizar o botão 'Editar' na linha do repositório alvo. Seletor: linha que contém o texto `data.repoNameOriginal` + botão Editar nela: `page.getByRole('row', { name: new RegExp(data.repoNameOriginal) }).getByRole('link', { name: 'Editar' }).click()` — alternativamente `page.getByRole('row').filter({ hasText: data.repoNameOriginal }).getByRole('link', { name: 'Editar' }).click()`. Aguardar redirect para tela de edição via `expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/)`.
    - expect: Sistema redireciona para a tela de edição. Aba 'Identificação' é exibida com os dados atuais do repositório — campo 'Nome' contém `data.repoNameOriginal`.
  4. Limpar e atualizar o campo 'Nome': `page.getByPlaceholder('Digite o nome do repositório').clear()` + `page.getByPlaceholder('Digite o nome do repositório').fill(data.repoNameEditado)`. Verificar via `expect(page.getByPlaceholder('Digite o nome do repositório')).toHaveValue(data.repoNameEditado)`.
    - expect: Campo 'Nome' exibe o texto atualizado `data.repoNameEditado`.
  5. Clicar em 'Salvar': `page.getByTestId('knowledge-repositories-form-save-button').click()`. Aguardar toast de sucesso: `expect(formPage.getToast('Repositório atualizado com sucesso').first()).toBeVisible()`. Após toast, navegar para a listagem e verificar que `data.repoNameEditado` aparece e `data.repoNameOriginal` não aparece mais. — REVISAR-FIGMA: texto exato do toast de atualização.
    - expect: Toast com texto 'Repositório atualizado com sucesso' é exibido (REVISAR-FIGMA). Listagem exibe o repositório com o novo nome `data.repoNameEditado`. O nome antigo `data.repoNameOriginal` não aparece mais na listagem.
