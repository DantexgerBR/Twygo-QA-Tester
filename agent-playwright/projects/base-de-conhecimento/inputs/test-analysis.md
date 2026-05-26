---
contract_version: 1.0
at_version: 1
project: base-de-conhecimento
project_name: "Base de Conhecimento"
generated_at: 2026-05-19T04:55:00Z
source_docs:
  - "docs/[Discovery] Meu base de conhecimento - v2.docx"
  - "docs/QA-Base_de_Conhecimento.xlsx"
  - "docs/Atividades_Base_de_Conhecimento_Complementada.xlsx"
env: staging-base-de-conhecimento
env_secondary: null
totals:
  suites: 9
  test_cases: 35
  steps: 150
---

# Análise de Teste — Base de Conhecimento

> **AT v1** — escopo: 9 suítes UI (executor `playwright`). As 4 suítes
> DB/MS puras (QA 2.3, 2.5, 3.1, 5.1) estão em
> [`db_validations_pending.md`](db_validations_pending.md) — fluxo
> manual TestLink até V2 do CONTRACT.
>
> **REVISAR-FIGMA**: textos literais marcados com este aviso foram
> inferidos do padrão Twygo (ListControl + Chakra) por ausência de recon
> visual nesta sessão. O agent-playwright deve fazer recon ao vivo
> (twygo-recon) antes de gerar specs para validar os textos reais.

## Dados de teste

### Organizações (chaves simbólicas)
- `org: principal` — default. Resolvido via `getOrgId()` (env `staging-base-de-conhecimento`).

### Recursos para criação (worker-isolated)
- `repoNameFormat`: "Repositório TC{n} w{workerIndex}-{timestamp}"
- `repoDescricaoExemplo`: "Repositório de teste automatizado — não excluir manualmente"
- `categoriaDefault`: "Geral" (REVISAR-FIGMA: opção real do dropdown)
- `classificacaoDefault`: "Interno" (REVISAR-FIGMA: opção real do dropdown)

### Limites de campos
- `nomeMaxLength`: 255 (REVISAR-FIGMA — inferido pelo padrão Twygo)
- `descricaoMaxLength`: 500 (REVISAR-FIGMA)
- `uploadMaxSizeMB`: 50

### Tipos de arquivo aceitos
- **Fontes de conhecimento (documentos)**: DOCX, PPTX, PDF, MP4, MP3
- **Recursos de mídia**: JPG, JPEG, PNG

## Textos literais

### Toast — sucesso (inferidos — REVISAR-FIGMA)
- "Repositório criado com sucesso"
- "Repositório atualizado com sucesso"
- "Repositório excluído com sucesso"
- "Arquivo enviado com sucesso"
- "Arquivo excluído com sucesso"

### Toast — erro (inferidos — REVISAR-FIGMA)
- "Não foi possível criar o repositório"
- "Formato de arquivo não suportado"
- "Arquivo excede o tamanho máximo permitido (50 MB)"

### Mensagens de validação (inferidas — REVISAR-FIGMA)
- "Nome é obrigatório"
- "Descrição é obrigatória"
- "Categoria é obrigatória"
- "Classificação é obrigatória"
- "Limite de 255 caracteres atingido" (Nome)
- "Limite de 500 caracteres atingido" (Descrição)

### Labels da listagem
- Menu lateral: "Aprendizagem"
- Submenu: "Base de conhecimento"
- Breadcrumb: "Aprendizagem > Base de conhecimento"
- Botão de criação: "+ Adicionar" (REVISAR-FIGMA)
- Botão filtros: "Filtrar"
- Botão exportar: "Exportar" (REVISAR-FIGMA)
- Ações por linha (REVISAR-FIGMA): "Editar", "Excluir"

### Labels do formulário — Aba Identificação
- Aba: "Identificação"
- Campo: "Nome" (obrigatório)
- Campo: "Descrição" (obrigatório)
- Campo: "Categoria" (obrigatório, dropdown)
- Campo: "Classificação" (obrigatório, dropdown)
- Botão: "Salvar"
- Botão: "Cancelar"

### Labels do formulário — Aba Fontes de conhecimento
- Aba: "Fontes de conhecimento"
- Botão upload: "+ Adicionar fonte" (REVISAR-FIGMA)
- Texto dropzone: "Arraste arquivos ou clique para selecionar" (REVISAR-FIGMA)
- Formatos exibidos: "DOCX, PPTX, PDF, MP4, MP3 (até 50 MB)"
- Status de indexação: "Pendente", "Processando", "Concluído", "Erro" (REVISAR-FIGMA)

### Labels do formulário — Aba Recursos de mídia
- Aba: "Recursos de mídia"
- Botão upload: "+ Adicionar mídia" (REVISAR-FIGMA)
- Formatos exibidos: "JPG, JPEG, PNG (até 50 MB)"

## Modais relevantes

### "Confirmar exclusão" (inferido — REVISAR-FIGMA)
- **Quando aparece**: ao clicar "Excluir" em um repositório/fonte/mídia existente
- **Header**: "Confirmar exclusão"
- **Body**: "Esta ação não pode ser desfeita. Deseja realmente excluir?"
- **Botões**: "Cancelar" / "Excluir"

### Modal "beforeunload nativo" (browser)
- **Quando aparece**: ao clicar "Cancelar" / sair com alterações pendentes no form
- **Body**: padrão do browser ("Tem certeza que deseja sair? As alterações não serão salvas.")
- **Tratamento**: spec usa `page.on('dialog')` handler

## Endpoints (referência)

| Método | URL | Sucesso | Erro provável |
|---|---|---|---|
| `GET` | `/api/v1/o/:org_id/knowledge_repositories` | 200 | 401 / 403 |
| `POST` | `/api/v1/o/:org_id/knowledge_repositories` | 201 | 422 (validação) |
| `PATCH` | `/api/v1/o/:org_id/knowledge_repositories/:id` | 200 | 422 |
| `DELETE` | `/api/v1/o/:org_id/knowledge_repositories/:id` | 200 | 404 |
| `POST` | `/api/v1/o/:org_id/knowledge_repositories/:id/resources` | 201 | 422 (tipo/tamanho) |

## Campos e validações

| Campo | Tipo | Obrigatório | Limite | Aba | Observações |
|---|---|---|---|---|---|
| Nome | input texto | Sim | 255 | Identificação | trim antes do save |
| Descrição | textarea | Sim | 500 | Identificação | aceita quebras de linha |
| Categoria | dropdown | Sim | — | Identificação | opções: REVISAR-FIGMA |
| Classificação | dropdown | Sim | — | Identificação | opções: REVISAR-FIGMA |
| Upload arquivo (Fontes) | file | Sim | 50 MB | Fontes | DOCX/PPTX/PDF/MP4/MP3 |
| Upload arquivo (Mídia) | file | Sim | 50 MB | Mídia | JPG/JPEG/PNG |

---

---
suite: Listagem básica de repositórios
executor: playwright
org: principal
playbooks: [filtro-drawer, flipper, cleanup-dados]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `habilitar_base_de_conhecimento` ativa na organização do teste
  - Usuário logado como Admin
---

# Listagem básica de repositórios

## TC1 — Acessar a listagem via menu Aprendizagem
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar acesso à listagem de repositórios de conhecimento via menu lateral, conforme R1.

### Passos
1. Acessar a URL "/play"
   → Dashboard padrão é exibido contendo o menu lateral.
2. Clicar no menu lateral "Aprendizagem"
   → Submenu lateral é exibido contendo o item "Base de conhecimento".
3. Clicar no submenu "Base de conhecimento"
   → Sistema redireciona para a listagem e exibe breadcrumb "Aprendizagem > Base de conhecimento".
4. Aguardar a listagem carregar
   → Listagem é renderizada com o componente ListControl.

## TC2 — Validar colunas obrigatórias da listagem
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que a listagem exibe as colunas esperadas (R3, R4).

### Passos
1. Acessar a URL "/o/{orgId}/knowledge_repositories"
   → Listagem é exibida com colunas: "Nome", "Categoria", "Classificação", "Criado em", "Atualizado em".
2. Aguardar a coluna "Ações" ser exibida
   → Cada linha da listagem exibe os botões "Editar" e "Excluir".

## TC3 — Validar botão de criação na listagem
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar presença e funcionalidade do botão de criação (R5).

### Passos
1. Acessar a URL "/o/{orgId}/knowledge_repositories"
   → Listagem é exibida.
2. Clicar no botão "+ Adicionar"
   → Sistema redireciona para a tela de criação de repositório exibindo a aba "Identificação".

## TC4 — Validar empty state quando não há repositórios
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar exibição correta da listagem vazia.

### Passos
1. Acessar a URL "/o/{orgId}/knowledge_repositories" em uma organização sem repositórios cadastrados
   → Listagem exibe o empty state com texto convidando o usuário a criar o primeiro repositório.

---

---
suite: Filtros e busca de repositórios
executor: playwright
org: principal
playbooks: [filtro-drawer, flipper]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `habilitar_base_de_conhecimento` ativa
  - Pelo menos 3 repositórios cadastrados com Categorias e Classificações distintas
  - Usuário logado como Admin
---

# Filtros e busca de repositórios

## TC1 — Buscar repositório por nome
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar busca textual por nome do repositório (R7).

### Passos
1. Acessar a URL "/o/{orgId}/knowledge_repositories"
   → Listagem é exibida com múltiplos repositórios.
2. Preencher o campo "Buscar" com "Repositório TC1"
   → Listagem filtra exibindo apenas os repositórios cujo nome contém "Repositório TC1".
3. Limpar o campo "Buscar"
   → Listagem volta a exibir todos os repositórios cadastrados.

## TC2 — Filtrar por Categoria via drawer de filtros
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar filtragem por Categoria via drawer (R8).

### Passos
1. Clicar no botão "Filtrar"
   → Drawer "Filtros" é exibido à direita.
2. Selecionar a opção "Geral" no filtro "Categoria"
   → Drawer atualiza o estado do filtro selecionado.
3. Aplicar o filtro
   → Drawer fecha. Listagem exibe apenas repositórios da Categoria "Geral".

## TC3 — Combinar filtros de Categoria e Classificação
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar combinação de múltiplos filtros (R9).

### Passos
1. Clicar no botão "Filtrar"
   → Drawer "Filtros" é exibido.
2. Selecionar a opção "Geral" no filtro "Categoria"
   → Filtro "Categoria" fica selecionado com a opção "Geral".
3. Selecionar a opção "Interno" no filtro "Classificação"
   → Filtro "Classificação" fica selecionado com a opção "Interno".
4. Aplicar o filtro
   → Drawer fecha. Listagem exibe apenas repositórios com Categoria "Geral" E Classificação "Interno".

## TC4 — Limpar todos os filtros aplicados
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar limpeza dos filtros (R10).

### Passos
1. Aplicar pelo menos 1 filtro de Categoria
   → Listagem é filtrada exibindo apenas repositórios da categoria selecionada.
2. Clicar no botão "Limpar filtros"
   → Listagem volta a exibir todos os repositórios cadastrados sem filtros aplicados.

---

---
suite: Extração de dados de repositórios
executor: playwright
org: principal
playbooks: [flipper]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `habilitar_base_de_conhecimento` ativa
  - Pelo menos 1 repositório cadastrado na organização
  - Usuário logado como Admin
---

# Extração de dados de repositórios

## TC1 — Exportar listagem completa
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar a extração de dados da listagem (R37, R38).

### Passos
1. Acessar a URL "/o/{orgId}/knowledge_repositories"
   → Listagem é exibida.
2. Clicar no botão "Exportar"
   → Sistema inicia o download do arquivo de extração (CSV ou XLSX) contendo os repositórios listados.
3. Aguardar o download concluir
   → Arquivo de extração está disponível no diretório de downloads do browser.

## TC2 — Exportação respeita filtros aplicados
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [filtro-drawer]

### Objetivo
Validar que a extração respeita os filtros aplicados (R38).

### Passos
1. Aplicar o filtro Categoria "Geral"
   → Listagem é filtrada exibindo apenas repositórios da Categoria "Geral".
2. Clicar no botão "Exportar"
   → Sistema inicia o download do arquivo de extração.
3. Aguardar o download concluir
   → Arquivo extraído contém apenas os repositórios da Categoria "Geral", refletindo o filtro aplicado.

---

---
suite: Criação de repositório - Aba Identificação
executor: playwright
org: principal
playbooks: [beforeunload, cleanup-dados, flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `habilitar_base_de_conhecimento` ativa
  - Usuário logado como Admin
---

# Criação de repositório - Aba Identificação

## TC1 — Criar repositório com dados válidos
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar criação de repositório (happy path) preenchendo todos os campos obrigatórios da aba Identificação (R11, R12, R13, R14).

### Passos
1. Acessar a URL "/o/{orgId}/knowledge_repositories"
   → Listagem é exibida.
2. Clicar no botão "+ Adicionar"
   → Sistema redireciona para a tela de criação exibindo a aba "Identificação".
3. Preencher o campo "Nome" com "Repositório TC1 w{workerIndex}-{timestamp}"
   → Campo "Nome" exibe o texto digitado.
4. Preencher o campo "Descrição" com "Repositório de teste automatizado"
   → Campo "Descrição" exibe o texto digitado.
5. Selecionar "Geral" no dropdown "Categoria"
   → Dropdown "Categoria" exibe a opção "Geral" selecionada.
6. Selecionar "Interno" no dropdown "Classificação"
   → Dropdown "Classificação" exibe a opção "Interno" selecionada.
7. Clicar no botão "Salvar"
   → Toast exibida: "Repositório criado com sucesso". Sistema redireciona para a listagem (ou permanece na tela de edição com mensagem de sucesso).

## TC2 — Validar campo Nome obrigatório
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que o campo "Nome" é obrigatório (R15).

### Passos
1. Acessar a tela de criação de repositório
   → Aba "Identificação" é exibida.
2. Preencher o campo "Descrição" com "Teste sem nome"
   → Campo "Descrição" exibe o texto digitado.
3. Selecionar "Geral" no dropdown "Categoria"
   → Dropdown "Categoria" exibe a opção "Geral" selecionada.
4. Selecionar "Interno" no dropdown "Classificação"
   → Dropdown "Classificação" exibe a opção "Interno" selecionada.
5. Clicar no botão "Salvar"
   → Mensagem de validação exibida: "Nome é obrigatório". Repositório NÃO é criado.

## TC3 — Validar campo Descrição obrigatório
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que o campo "Descrição" é obrigatório (R16).

### Passos
1. Acessar a tela de criação de repositório
   → Aba "Identificação" é exibida.
2. Preencher o campo "Nome" com "Repositório sem descrição"
   → Campo "Nome" exibe o texto digitado.
3. Selecionar "Geral" no dropdown "Categoria"
   → Dropdown "Categoria" exibe a opção "Geral" selecionada.
4. Selecionar "Interno" no dropdown "Classificação"
   → Dropdown "Classificação" exibe a opção "Interno" selecionada.
5. Clicar no botão "Salvar"
   → Mensagem de validação exibida: "Descrição é obrigatória". Repositório NÃO é criado.

## TC4 — Validar limite de caracteres do campo Nome
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar limite máximo de 255 caracteres no campo "Nome".

### Passos
1. Acessar a tela de criação de repositório
   → Aba "Identificação" é exibida.
2. Preencher o campo "Nome" com uma string de 256 caracteres
   → Campo "Nome" trunca o input em 255 caracteres OU exibe mensagem "Limite de 255 caracteres atingido".

## TC5 — Cancelar criação com alterações pendentes dispara beforeunload
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [beforeunload]

### Objetivo
Validar diálogo nativo de saída com alterações não salvas (R42).

### Passos
1. Acessar a tela de criação de repositório
   → Aba "Identificação" é exibida.
2. Preencher o campo "Nome" com "Teste cancelamento"
   → Campo "Nome" exibe o texto digitado e o estado do form fica "sujo".
3. Clicar no botão "Cancelar"
   → Diálogo nativo do browser é exibido perguntando se o usuário deseja sair sem salvar.
4. Confirmar manter na página no diálogo
   → Usuário permanece na tela de criação com os dados preenchidos.

## TC6 — Editar repositório existente
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]

### Objetivo
Validar edição dos dados de um repositório (R43).

### Passos
1. Acessar a URL "/o/{orgId}/knowledge_repositories"
   → Listagem é exibida com repositórios cadastrados.
2. Clicar no botão "Editar" da linha do repositório alvo
   → Sistema redireciona para a tela de edição exibindo os dados atuais do repositório.
3. Atualizar o campo "Nome" para "Repositório TC6 editado"
   → Campo "Nome" exibe o texto atualizado.
4. Clicar no botão "Salvar"
   → Toast exibida: "Repositório atualizado com sucesso". Listagem reflete o novo nome.

---

---
suite: Fontes de Conhecimento - Upload de documentos
executor: playwright
org: principal
playbooks: [cleanup-dados, flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `habilitar_base_de_conhecimento` ativa
  - Repositório de teste cadastrado no setup do spec (via beforeAll) seguindo a convenção de naming worker-isolated; o spec é responsável por criar e limpar via cleanup-dados
  - Usuário logado como Admin
---

# Fontes de Conhecimento - Upload de documentos

## TC1 — Upload de arquivo PDF dentro do limite
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar upload de PDF (≤ 50 MB) via aba "Fontes de conhecimento" (R17, R18).

### Passos
1. Acessar a tela de edição do repositório de teste
   → Aba "Identificação" é exibida.
2. Clicar na aba "Fontes de conhecimento"
   → Aba "Fontes de conhecimento" fica selecionada exibindo o componente ListControl de fontes.
3. Clicar no botão "+ Adicionar fonte"
   → Componente de upload é exibido.
4. Fazer upload do arquivo "documento-teste.pdf" (5 MB) no campo de upload
   → Toast exibida: "Arquivo enviado com sucesso". Listagem de fontes atualiza exibindo o arquivo enviado com status "Pendente" ou "Processando".

## TC2 — Upload de arquivo DOCX dentro do limite
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar upload de DOCX (R19).

### Passos
1. Acessar a aba "Fontes de conhecimento" do repositório de teste
   → Aba "Fontes de conhecimento" é exibida.
2. Fazer upload do arquivo "documento-teste.docx" (3 MB) no campo de upload
   → Toast exibida: "Arquivo enviado com sucesso". Listagem atualiza com o DOCX enviado.

## TC3 — Tentar upload de arquivo com formato não suportado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar rejeição de tipo inválido (R20).

### Passos
1. Acessar a aba "Fontes de conhecimento" do repositório de teste
   → Aba "Fontes de conhecimento" é exibida.
2. Fazer upload do arquivo "executavel-teste.exe" no campo de upload
   → Toast exibida: "Formato de arquivo não suportado". Arquivo NÃO é adicionado à listagem.

## TC4 — Tentar upload de arquivo acima do limite de 50 MB
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar rejeição de arquivos acima de 50 MB (R21).

### Passos
1. Acessar a aba "Fontes de conhecimento" do repositório de teste
   → Aba "Fontes de conhecimento" é exibida.
2. Fazer upload do arquivo "documento-grande.pdf" (60 MB) no campo de upload
   → Toast exibida: "Arquivo excede o tamanho máximo permitido (50 MB)". Arquivo NÃO é adicionado à listagem.

## TC5 — Validar exibição dos formatos aceitos no componente de upload
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que o componente de upload exibe os formatos aceitos (R22).

### Passos
1. Acessar a aba "Fontes de conhecimento" do repositório de teste
   → Aba "Fontes de conhecimento" é exibida.
2. Aguardar o texto informativo "DOCX, PPTX, PDF, MP4, MP3 (até 50 MB)" ser exibido
   → Texto "DOCX, PPTX, PDF, MP4, MP3 (até 50 MB)" é exibido no componente de upload.

---

---
suite: Recursos de Mídia - Upload de imagens
executor: playwright
org: principal
playbooks: [cleanup-dados, flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `habilitar_base_de_conhecimento` ativa
  - Repositório de teste cadastrado no setup do spec (via beforeAll) seguindo a convenção de naming worker-isolated; o spec é responsável por criar e limpar via cleanup-dados
  - Usuário logado como Admin
---

# Recursos de Mídia - Upload de imagens

## TC1 — Upload de arquivo PNG dentro do limite
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar upload de PNG (≤ 50 MB) via aba "Recursos de mídia" (R25, R26).

### Passos
1. Acessar a tela de edição do repositório de teste
   → Aba "Identificação" é exibida.
2. Clicar na aba "Recursos de mídia"
   → Aba "Recursos de mídia" fica selecionada exibindo o componente ListControl de mídias.
3. Clicar no botão "+ Adicionar mídia"
   → Componente de upload é exibido.
4. Fazer upload do arquivo "imagem-teste.png" (2 MB) no campo de upload
   → Toast exibida: "Arquivo enviado com sucesso". Listagem de mídias atualiza exibindo o arquivo enviado.

## TC2 — Upload de arquivo JPG dentro do limite
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar upload de JPG (R27).

### Passos
1. Acessar a aba "Recursos de mídia" do repositório de teste
   → Aba "Recursos de mídia" é exibida.
2. Fazer upload do arquivo "imagem-teste.jpg" (4 MB) no campo de upload
   → Toast exibida: "Arquivo enviado com sucesso". Listagem atualiza com a imagem enviada.

## TC3 — Tentar upload de arquivo com formato não suportado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar rejeição de tipo inválido (R28).

### Passos
1. Acessar a aba "Recursos de mídia" do repositório de teste
   → Aba "Recursos de mídia" é exibida.
2. Fazer upload do arquivo "video-teste.mp4" no campo de upload
   → Toast exibida: "Formato de arquivo não suportado". Arquivo NÃO é adicionado à listagem.

## TC4 — Tentar upload de imagem acima do limite de 50 MB
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar rejeição de imagens acima de 50 MB (R29).

### Passos
1. Acessar a aba "Recursos de mídia" do repositório de teste
   → Aba "Recursos de mídia" é exibida.
2. Fazer upload do arquivo "imagem-grande.jpg" (60 MB) no campo de upload
   → Toast exibida: "Arquivo excede o tamanho máximo permitido (50 MB)". Arquivo NÃO é adicionado à listagem.

## TC5 — Validar exibição dos formatos aceitos
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que o componente de upload exibe os formatos aceitos.

### Passos
1. Acessar a aba "Recursos de mídia" do repositório de teste
   → Aba "Recursos de mídia" é exibida.
2. Aguardar o texto informativo "JPG, JPEG, PNG (até 50 MB)" ser exibido
   → Texto "JPG, JPEG, PNG (até 50 MB)" é exibido no componente de upload.

---

---
suite: Trial - Cópia e exclusão de base de conhecimento
executor: playwright
org: principal
playbooks: [trial, flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `habilitar_base_de_conhecimento` ativa na organização modelo
  - Organização modelo possui pelo menos 1 repositório cadastrado com fontes e mídias
  - Trial dedicada do projeto provisionada
---

# Trial - Cópia e exclusão de base de conhecimento

## TC1 — Trial criada herda repositórios da organização modelo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que uma Trial recém-criada recebe a cópia dos repositórios da organização modelo (R39).

### Passos
1. Acessar a Trial provisionada
   → Trial carrega com Dashboard inicial.
2. Acessar a URL "/o/{trialOrgId}/knowledge_repositories"
   → Listagem é exibida contendo os repositórios copiados da organização modelo.
3. Clicar no botão "Editar" da linha do primeiro repositório
   → Tela de edição é exibida com a aba "Fontes de conhecimento" listando os arquivos copiados da organização modelo, e a aba "Recursos de mídia" listando as mídias correspondentes.

## TC2 — Exclusão total via Sophia remove dados de base de conhecimento
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que a exclusão total da Sophia exclui todos os dados de base de conhecimento da Trial (R40).

### Passos
1. Acessar a Trial provisionada com repositórios criados
   → Listagem em "/o/{trialOrgId}/knowledge_repositories" exibe repositórios cadastrados.
2. Clicar no ícone "Sophia" no canto inferior esquerdo
   → Popover Sophia é exibido.
3. Clicar em "Excluir informações"
   → Modal de exclusão é exibido com 4 opções de granularidade.
4. Selecionar a opção "Tudo" e confirmar
   → Toast exibida: "Exclusão concluída". Trial é resetada.
5. Acessar novamente "/o/{trialOrgId}/knowledge_repositories"
   → Listagem fica vazia ou exibe empty state. Nenhum repositório, fonte ou mídia anterior está presente.

---

---
suite: Feature flag habilitar_base_de_conhecimento
executor: playwright
org: principal
playbooks: [flipper, super-admin]
preconditions:
  - Ambiente Stage configurado
  - Usuário logado como Admin com flag elevada para Flipper-UI
  - Feature flag `habilitar_base_de_conhecimento` controlável via Super Admin
---

# Feature flag habilitar_base_de_conhecimento

## TC1 — Acesso bloqueado com feature flag desabilitada
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que o submenu "Base de conhecimento" não aparece quando a flag está desabilitada (R2).

### Passos
1. Desabilitar a feature flag `habilitar_base_de_conhecimento` para a organização do teste via Flipper-UI
   → Flag fica como "Conditionally enabled" sem actor `Organization;{orgId}`.
2. Acessar a URL "/play"
   → Dashboard padrão é exibido.
3. Clicar no menu lateral "Aprendizagem"
   → Submenu lateral é exibido SEM o item "Base de conhecimento".

## TC2 — Acesso liberado com feature flag habilitada
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que a funcionalidade fica acessível quando a flag é habilitada (R2).

### Passos
1. Habilitar a feature flag `habilitar_base_de_conhecimento` para a organização do teste via Flipper-UI
   → Flag fica como "Conditionally enabled" com actor `Organization;{orgId}`.
2. Acessar a URL "/play"
   → Dashboard padrão é exibido.
3. Clicar no menu lateral "Aprendizagem"
   → Submenu lateral é exibido COM o item "Base de conhecimento".
4. Clicar no submenu "Base de conhecimento"
   → Sistema redireciona para a listagem de repositórios de conhecimento.

## TC3 — Transição off → on durante a sessão
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que ativar a flag durante uma sessão libera a funcionalidade após refresh.

### Passos
1. Iniciar sessão com a flag desabilitada para a organização do teste
   → Submenu "Base de conhecimento" NÃO é exibido em "Aprendizagem".
2. Habilitar a flag `habilitar_base_de_conhecimento` para a organização via Flipper-UI
   → Flag fica como "Conditionally enabled" com actor `Organization;{orgId}`.
3. Recarregar a página "/play"
   → Dashboard é exibido novamente.
4. Clicar no menu lateral "Aprendizagem"
   → Submenu lateral agora exibe o item "Base de conhecimento".

---

---
suite: Ambientes adicionais - Isolamento de repositórios
executor: playwright
org: principal
playbooks: [ambientes-adicionais, flipper, toast-chakra, cleanup-dados]
preconditions:
  - Ambiente Stage configurado com env adicional pareado
  - Feature flag `habilitar_base_de_conhecimento` ativa em ambas orgs (principal e adicional)
  - Usuário logado como Admin
---

# Ambientes adicionais - Isolamento de repositórios

## TC1 — Repositórios criados no ambiente principal não aparecem no adicional
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]

### Objetivo
Validar isolamento de dados entre tenants pareados.

### Passos
1. Criar repositório "Repositório TC1 isolamento w{workerIndex}-{timestamp}" no ambiente principal
   → Toast exibida: "Repositório criado com sucesso". Listagem do principal exibe o novo repositório.
2. Acessar a listagem no ambiente adicional pareado
   → Listagem do ambiente adicional NÃO exibe o repositório criado no principal.

## TC2 — Repositórios criados no ambiente adicional não aparecem no principal
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]

### Objetivo
Validar isolamento bidirecional.

### Passos
1. Criar repositório "Repositório TC2 isolamento w{workerIndex}-{timestamp}" no ambiente adicional
   → Toast exibida: "Repositório criado com sucesso". Listagem do adicional exibe o novo repositório.
2. Acessar a listagem no ambiente principal
   → Listagem do ambiente principal NÃO exibe o repositório criado no adicional.

## TC3 — Bulk-create de repositórios com conteúdo rico no adicional não vaza pro principal
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados, testar-upload-de-arquivo-twygo]

### Objetivo
Validar isolamento de conteúdo rico (Fontes de conhecimento + Recursos de mídia anexados) entre tenants pareados. Cobre cenário de migração/produção onde o adicional recebe carga em massa.

### Pré-condição
Catálogo `uploadFixtures` (src/utils/test-assets.ts) carregado: PDF, DOCX, MP4 (Fontes); JPG, PNG (Recursos).

### Passos
1. Criar 10 repositórios sequencialmente no ambiente ADICIONAL (orgId 36690). Para cada repo "Bulk TC3 #{i} w{workerIndex}-{timestamp}":
   a. Preencher Nome e Descrição → clicar Salvar
      → Redirect pra /knowledge_repositories/{id}/edit. Toast/URL confirma persistência.
   b. Abrir aba "Fontes de conhecimento" → clicar Adicionar → preencher Nome + anexar 1 arquivo do catálogo (alterna PDF/DOCX/MP4 entre repos) → Salvar
      → Redirect pra /edit?tab=sources. Linha aparece na tabela de Fontes do repo.
   c. Abrir aba "Recursos de mídia" → clicar Adicionar → preencher Nome + anexar 1 arquivo do catálogo (alterna JPG/PNG entre repos) → Salvar
      → Redirect pra /edit?tab=resources. Linha aparece na tabela de Recursos do repo.
2. Acessar a listagem `/knowledge_repositories` no ambiente ADICIONAL
   → Os 10 repositórios criados aparecem na listagem (filtragem por prefixo "Bulk TC3" confirma).
3. Acessar a listagem `/knowledge_repositories` no ambiente PRINCIPAL (orgId 36602)
   → NENHUM dos 10 repositórios aparece (filtragem por prefixo "Bulk TC3" retorna 0 linhas).

### Cleanup
afterAll deleta os 10 repositórios via DELETE /api/v1/o/36690/knowledge_repositories/{id} (cascade exclui Fontes/Recursos anexados).

## TC4 — Editar repositório no adicional re-anexando arquivo persiste e isola
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados, testar-upload-de-arquivo-twygo]

### Objetivo
Validar que edit + re-upload no env adicional persiste no save e continua isolado do principal.

### Passos
1. Criar repositório "Editável TC4 w{workerIndex}-{timestamp}" no ADICIONAL com 1 Fonte (PDF anexado) e 1 Recurso (JPG anexado)
   → Repositório criado com Fonte e Recurso visíveis nas respectivas abas.
2. Voltar à listagem → editar o repo (ícone "edit" da linha) → atualizar Descrição → Salvar
   → Toast de sucesso. Descrição atualizada após reload do form.
3. Adicionar 1 Fonte adicional (DOCX) no mesmo repo
   → Aba Fontes agora tem 2 linhas.
4. Adicionar 1 Recurso adicional (PNG) no mesmo repo
   → Aba Recursos agora tem 2 linhas.
5. Verificar listagem no PRINCIPAL
   → Repositório "Editável TC4 ..." NÃO aparece.

### Cleanup
afterAll deleta o repo via API (cascade exclui 2 Fontes + 2 Recursos).
