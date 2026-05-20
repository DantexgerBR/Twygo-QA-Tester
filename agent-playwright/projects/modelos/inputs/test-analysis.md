---
contract_version: 1.0
at_version: 1
project: modelos
project_name: "Modelos de conteúdo"
generated_at: 2026-05-20T01:30:00Z
source_docs:
  - "docs/[Especificação de Requisitos] Modelos de conteúdo – v02 06.04.2026.docx"
  - "docs/Quebra de atividades - DEV - Modelos de conteúdo.xlsx"
  - "docs/Quebra de atividades - QA - Modelos.xlsx"
env: staging-base-de-conhecimento
env_secondary: null
totals:
  suites: 16
  test_cases: 67
  steps: 174
---

# Análise de Teste — Modelos de conteúdo

> **AT v1** — escopo: 15 suítes UI (executor `playwright`). As 2 suítes
> DB/MS puras (QA 1.8 Indexação Vector DB; QA 4.1 Transversais Banco/Trial/Logs)
> estão em [`db_validations_pending.md`](db_validations_pending.md) — fluxo
> manual TestLink até V2 do CONTRACT.

## Dados de teste

### Organizações (chaves simbólicas)
- `org: principal` — default. Resolvido via `getOrgId()` (env `staging-base-de-conhecimento`).

### Recursos para criação (worker-isolated)
- `modeloNameFormat`: "Modelo TC{n} w{workerIndex}-{timestamp}"
- `modeloDescricaoExemplo`: "Modelo de teste automatizado — não excluir manualmente"
- `designNameFormat`: "Design TC{n} w{workerIndex}-{timestamp}"
- `kitDeMarcaDefault`: "Kit padrão da organização" (REVISAR-FIGMA: confirmar nome do kit default)

### Limites de campos
- `nomeMaxLength`: 255 (Modelo e Design)
- `descricaoMaxLength`: 500 (Modelo)
- `descricaoTooltipMaxChars`: 50 (truncamento na visão lista)
- `instrucoesIAMaxLength`: 500 (Estrutura/Conteúdo IA — Design)

### Opções fixas (extraídas da Especificação)
- `tipoEstrutura`: ["Atividades sequenciais (1 nível)", "Atividades agrupadas por módulos (2 níveis)"]
- `cargaHoraria`: ["Micro (30 segundos a 5 minutos)", "Curto (5 a 15 minutos)", "Médio (15 a 30 minutos)", "Estendido (30 a 60 minutos)", "Longo (1 a 2 horas)"]
- `padroesImagem`: ["Sem imagens, somente textos", "Banco de imagens aberto", "Gerador DALL-E (OpenAI)", "Gerador Imagen 4 (Google)"]
- `vozesAudio`: ["Ana", "Cris", "Carlos", "Morgan"]
- `tiposDesign`: ["Capa", "Introdução", "Corpo", "Encerramento", "Recapitulação", "Sumário"]

## Textos literais

### Toast — sucesso
- "Modelo de conteúdo duplicado com sucesso."
- "A regeração dos designs foi iniciada. Você será notificado quando for concluída."
- "Modelo de conteúdo criado com sucesso." (REVISAR-FIGMA)
- "Modelo de conteúdo atualizado com sucesso." (REVISAR-FIGMA)
- "Design criado com sucesso." (REVISAR-FIGMA)

### Toast — erro / bloqueio
- "Não é possível excluir esta cor pois ela está sendo utilizada por um ou mais modelos de conteúdo." (REVISAR-FIGMA: texto exato de RN 64)
- "Carga horária sugerida é obrigatória" (REVISAR-FIGMA: validação RN 18)
- "Nome é obrigatório" (REVISAR-FIGMA)

### Notificação assíncrona
- Header: "Regerações concluídas"
- Body: "As regerações dos designs do modelo {nome} foram concluídas."

### Badge (só na criação)
- "Dica: Para um resultado mais rápido, recomendamos duplicar um modelo existente e editar a cópia ao invés de criar um do zero."

### Tooltips (literais da Especificação)
- Kit de marca: "Define a identidade visual aplicada ao conteúdo gerado pela IA"
- Switch Usar como modelo padrão: "Se marcado, este modelo será usado prioritariamente pela IA quando não houver uma escolha específica"
- Switch Usar designs sugeridos: "Quando ativo, a IA utilizará designs pré-definidos como sugestão ao gerar o conteúdo do curso"
- Switch Ativo: "Modelos inativos não serão utilizados pela IA"
- Tipo de estrutura: "Define se o curso possui apenas atividades sequenciais ou se elas são organizadas em módulos."
- Atividades por módulo: "Número sugerido de atividades que a IA irá criar dentro de cada módulo do curso."
- Seção Questionários: "Configure questionários aplicados durante o curso, associados a atividades ou módulos."
- Seção Prova final: "Avaliação aplicada ao final do curso, cobrindo todo o conteúdo."
- Ícone alerta listagem/card: "Este modelo possui designs pendentes de regeração. Acesse a aba design e clique no botão 'Regerar designs'."
- Botão Regerar todos: "O kit de marca foi alterado. Clique em 'Regerar todos' para atualizar todos os designs com as novas configurações de cores e fontes."
- Campo Tipo do design: "Classifique este design por tipo de parte (ex: Capa, Corpo, Encerramento). Essa informação será utilizada para filtrar e organizar seus designs."
- Campo Instruções de estrutura: "Descreva em que momento e em qual contexto este design deve ser utilizado pela IA ao gerar o curso. Use os prompts sugeridos abaixo como ponto de partida e edite conforme necessário."
- Campo Instruções de conteúdo: "Descreva como a IA deve estruturar e estilizar o conteúdo exibido neste design."
- Campo Sequência: "Defina em que posição este design deve aparecer na lista. Ex.: 1 = primeiro, 2 = segundo. Se essa posição já estiver ocupada, este design entra nela e os próximos descem automaticamente."

### Textos de seção (Aba Imagem)
- Título: "Escolha o padrão de imagens para o modelo"
- Subtítulo: "Selecione como as imagens serão incluídas nos cursos gerados com este modelo. Cada opção oferece diferentes benefícios para a experiência de aprendizado."

### Textos de seção (Aba Áudio)
- Título: "Escolha a voz padrão para narrar as aulas"
- Subtítulo: "Selecione a voz que melhor se adequa ao tom deste modelo. Você pode ouvir uma amostra de cada voz antes de escolher."

## Modais relevantes

### "Confirmar exclusão de modelo" (inferido — REVISAR-FIGMA)
- **Quando aparece**: ao clicar Excluir em modelo existente
- **Header**: "Confirmar exclusão"
- **Body**: "Esta ação não pode ser desfeita. Deseja realmente excluir o modelo {nome}?"
- **Botões**: "Cancelar" / "Excluir"

### "Preview de Modelo" (RN 5.2)
- **Quando aparece**: ao clicar ícone de preview no card de modelo
- **Componente**: Modal carrossel do design system
- **Conteúdo por item**:
  - Texto: "Modelo: {nome do modelo}"
  - Thumb do design
  - "Design: {nome do design}"
  - "Tipo: {Aula | Página}"
  - "Prompt: {texto de instruções IA}"
  - Indicador: "Design X de Y"
- **Comportamento extra**: páginas têm opção de zoom com scroll
- **Botões**: Navegação carrossel (próximo/anterior) + fechar

### "Preview de Design" (RN 51, 51.2 - aba Design)
- **Quando aparece**: ao clicar ícone de olho em design da listagem
- **Aba Aula**: Nome do design + Preview do slide
- **Aba Página**: Preview da imagem + Opção de zoom + Nome do design

### "Inserir espaço reservado para IA" (RN 36.4.x - Plate Editor de Página)
- **Quando aparece**: ao clicar para inserir espaço reservado OU ao clicar no espaço já inserido
- **Conteúdo**: campo textarea para instruções de prompt para IA
- **Botões**: "Cancelar" / "Confirmar" (REVISAR-FIGMA)

### "Bloqueio de exclusão de cor" (RN 64)
- **Quando aparece**: ao tentar excluir cor de kit de marca em uso por modelo
- **Mensagem de bloqueio**: texto exato (REVISAR-FIGMA)
- **Comportamento**: bloqueia exclusão; usuário só pode "Cancelar"

## Endpoints (referência)

| Método | URL (inferido) | Operação | Sucesso | Erro |
|---|---|---|---|---|
| `GET` | `/api/v1/o/:org_id/content_models` | Listar modelos | 200 | 401/403 |
| `POST` | `/api/v1/o/:org_id/content_models` | Criar modelo | 201 | 422 |
| `PATCH` | `/api/v1/o/:org_id/content_models/:id` | Editar modelo | 200 | 422 |
| `DELETE` | `/api/v1/o/:org_id/content_models/:id` | Excluir modelo | 200 | 404 |
| `POST` | `/api/v1/o/:org_id/content_models/:id/duplicate` | Duplicar | 201 | 422 |
| `POST` | `/api/v1/o/:org_id/content_models/:id/regenerate_designs` | Regerar (async) | 202 | 422 |
| `PATCH` | `/api/v1/o/:org_id/content_models/:id/template_designs/reorder` | Reordenar | 200 | 422 |

## Campos e validações

| Aba | Campo | Tipo | Obrigatório | Limite | Default |
|---|---|---|---|---|---|
| Identificação | Nome | input | Sim | 255 | — |
| Identificação | Descrição | textarea | — | 500 | — |
| Identificação | Kit de marca | select | Sim | — | — |
| Identificação | Usar como modelo padrão | switch | — | — | false |
| Identificação | Usar designs sugeridos | switch (só criação) | — | — | true |
| Identificação | Ativo | switch | — | — | true |
| Estrutura | Tipo de estrutura | select | — | — | — |
| Estrutura | N. atividades por módulo (se 2 níveis) | numeric | — | — | — |
| Estrutura | Carga horária sugerida | select | Sim | — | — |
| Imagem | Padrão de imagens | radio | — | — | "Sem imagens, somente textos" |
| Áudio | Voz padrão | radio | — | — | "Ana" |
| Design Página/Aula | Nome | input | Sim | 255 | — |
| Design Página/Aula | Tipo | creatable select | — | — | — |
| Design Página/Aula | Instruções de estrutura para IA | platejs | Sim | 500 | (auto-fill por tipo) |
| Design Página/Aula | Instruções de conteúdo para IA | platejs | — | 500 | (auto-fill por tipo) |
| Design Página/Aula | Sequência | numeric | Sim | — | — |

---

---
suite: Listagem e Menu de Modelos
executor: playwright
org: principal
playbooks: [filtro-drawer, flipper, cleanup-dados, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa na organização do teste
  - Pelo menos 2 modelos cadastrados (1 ativo, 1 inativo) para validar visualizações
  - Usuário logado como Admin
---

# Listagem e Menu de Modelos

## TC1 — Acessar listagem via submenu Aprendizagem
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar acesso à listagem via menu lateral, conforme RN 1, 1.1.

### Passos
1. Acessar a URL "/o/{orgId}/dashboard"
   → Dashboard padrão é exibido contendo o menu lateral.
2. Clicar no menu lateral "Aprendizagem"
   → Submenu lateral é exibido contendo o item "Modelos de conteúdo" com ícone Material "browse".
3. Clicar no submenu "Modelos de conteúdo"
   → Sistema redireciona para a listagem e exibe breadcrumb "Aprendizagem > Modelos de conteúdo".

## TC2 — Visualização padrão em Cards
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que a visualização padrão da listagem é em formato Cards, conforme RN 3.

### Passos
1. Acessar a URL "/o/{orgId}/content_models"
   → Listagem é exibida em formato Cards por padrão.
2. Aguardar a renderização dos cards
   → Cada card exibe imagem principal, nome do modelo, ações (List Control) e indicador de cor lateral para status.

## TC3 — Alternância entre visualização Cards e Lista
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar alternância de visualização entre Cards e Lista, conforme RN 2.

### Passos
1. Acessar a URL "/o/{orgId}/content_models"
   → Listagem é exibida em formato Cards.
2. Clicar no botão de alternância para visualização "Lista"
   → Listagem alterna para formato Lista exibindo colunas: "Nome", "Descrição", "Provedor", "Designs", "Aplicação", "Situação", "Atualizado em".
3. Clicar no botão de alternância para visualização "Cards"
   → Listagem retorna para formato Cards.

## TC4 — Coluna Descrição truncada com tooltip completo (visão Lista)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que a Descrição na visão Lista é truncada em 50 caracteres com tooltip exibindo o texto completo (RN 4.1.2).

### Passos
1. Acessar a listagem em formato Lista para um modelo com Descrição maior que 50 caracteres
   → Coluna "Descrição" exibe os primeiros 50 caracteres da descrição seguidos de reticências.
2. Posicionar o mouse sobre a Descrição truncada
   → Tooltip exibido com o texto completo da Descrição.

## TC5 — Botão Adicionar redireciona para criação
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que o botão "Adicionar" inicia o fluxo de criação de modelo, conforme RN 2 e RN 7.

### Passos
1. Acessar a listagem de modelos
   → Listagem é exibida.
2. Clicar no botão "+ Adicionar"
   → Sistema redireciona para a tela de criação exibindo a aba "Identificação" como primeira aba.

## TC6 — Indicador de cor lateral reflete status ativo/inativo no card
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que o indicador de cor lateral dos cards reflete o status ativo/inativo do modelo (RN 5).

### Passos
1. Acessar a listagem em formato Cards com modelos ativos e inativos
   → Listagem exibe cards com indicadores de cor lateral distintos para modelos ativos e inativos.
2. Aguardar o card de um modelo ativo ser exibido
   → Card exibe indicador de cor lateral indicando estado "Ativo".
3. Aguardar o card de um modelo inativo ser exibido
   → Card exibe indicador de cor lateral indicando estado "Inativo".

---

---
suite: Filtros e Busca - Modelos
executor: playwright
org: principal
playbooks: [filtro-drawer, flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Pelo menos 4 modelos cadastrados (ativos, inativos, próprios e de terceiros) para validar filtros
  - Usuário logado como Admin
---

# Filtros e Busca - Modelos

## TC1 — Buscar modelo por nome
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar busca textual por nome do modelo na listagem.

### Passos
1. Acessar a URL "/o/{orgId}/content_models"
   → Listagem é exibida com múltiplos modelos.
2. Preencher o campo "Buscar" com "Modelo TC1"
   → Listagem filtra exibindo apenas modelos cujo nome contém "Modelo TC1".
3. Limpar o campo "Buscar"
   → Listagem volta a exibir todos os modelos cadastrados.

## TC2 — Filtrar modelos por Situação via drawer
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar filtragem por Situação (Ativo/Inativo) via drawer de filtros, conforme RN 60.

### Passos
1. Clicar no botão "Filtrar"
   → Drawer "Filtros" é exibido à direita.
2. Selecionar a opção "Ativo" no filtro "Situação"
   → Filtro "Situação" exibe a opção "Ativo" selecionada.
3. Aplicar o filtro
   → Drawer fecha. Listagem exibe apenas modelos com Situação "Ativo".

## TC3 — Aplicar filtro padrão "Modelos próprios"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar filtro padrão "Modelos próprios", conforme RN 62.

### Passos
1. Clicar no botão "Filtrar"
   → Drawer "Filtros" é exibido com os filtros padrão "Modelos ativos", "Modelos inativos", "Modelos próprios", "Modelos de terceiros".
2. Selecionar o filtro padrão "Modelos próprios"
   → Filtro fica marcado.
3. Aplicar o filtro
   → Drawer fecha. Listagem exibe apenas modelos próprios da organização.

## TC4 — Limpar filtros aplicados
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar limpeza dos filtros aplicados.

### Passos
1. Aplicar o filtro padrão "Modelos ativos"
   → Listagem é filtrada exibindo apenas modelos ativos.
2. Clicar no botão "Limpar filtros"
   → Listagem volta a exibir todos os modelos cadastrados sem filtros aplicados.

---

---
suite: Criação de Modelo - Aba Identificação
executor: playwright
org: principal
playbooks: [beforeunload, cleanup-dados, flipper, toast-chakra, switch-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Pelo menos 1 kit de marca cadastrado na organização
  - Usuário logado como Admin
---

# Criação de Modelo - Aba Identificação

## TC1 — Criar modelo com dados válidos
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar criação de modelo (happy path) preenchendo todos os campos da aba Identificação (RN 7, RN 8).

### Passos
1. Acessar a URL "/o/{orgId}/content_models"
   → Listagem é exibida.
2. Clicar no botão "+ Adicionar"
   → Sistema redireciona para a tela de criação exibindo a aba "Identificação".
3. Preencher o campo "Nome" com "Modelo TC1 w{workerIndex}-{timestamp}"
   → Campo "Nome" exibe o texto digitado.
4. Preencher o campo "Descrição" com "Modelo de teste automatizado"
   → Campo "Descrição" exibe o texto digitado.
5. Selecionar "Kit padrão da organização" no dropdown "Kit de marca"
   → Dropdown "Kit de marca" exibe a opção selecionada.
6. Clicar no botão "Salvar"
   → Toast exibida: "Modelo de conteúdo criado com sucesso.". Sistema permanece na tela de edição ou redireciona para listagem.

## TC2 — Badge "Dica" aparece somente na criação
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que a badge "Dica: Para um resultado mais rápido..." aparece apenas na criação de novo modelo (RN 9).

### Passos
1. Acessar a tela de criação de modelo
   → Aba "Identificação" é exibida.
2. Aguardar a badge "Dica" ser renderizada
   → Badge exibida com o texto: "Dica: Para um resultado mais rápido, recomendamos duplicar um modelo existente e editar a cópia ao invés de criar um do zero.".

## TC3 — Badge "Dica" NÃO aparece na edição
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que a badge "Dica" NÃO é exibida em modo edição (RN 9).

### Passos
1. Acessar a listagem com pelo menos 1 modelo cadastrado
   → Listagem é exibida.
2. Clicar na ação "Editar" do modelo alvo
   → Sistema redireciona para a tela de edição exibindo a aba "Identificação".
3. Aguardar a tela de edição carregar completamente
   → Badge "Dica" NÃO é exibida na tela de edição.

## TC4 — Validar campo Nome obrigatório
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que o campo "Nome" é obrigatório (RN 8).

### Passos
1. Acessar a tela de criação de modelo
   → Aba "Identificação" é exibida.
2. Preencher o campo "Descrição" com "Teste sem nome"
   → Campo "Descrição" exibe o texto digitado.
3. Clicar no botão "Salvar"
   → Mensagem de validação exibida: "Nome é obrigatório". Modelo NÃO é criado.

## TC5 — Validar limite de 500 caracteres da Descrição
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar limite máximo de 500 caracteres no campo "Descrição".

### Passos
1. Acessar a tela de criação de modelo
   → Aba "Identificação" é exibida.
2. Preencher o campo "Descrição" com uma string de 501 caracteres
   → Campo "Descrição" trunca o input em 500 caracteres OU exibe mensagem de limite atingido.

## TC6 — Switch "Usar designs sugeridos" exibido somente na criação
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que o switch "Usar designs sugeridos" só aparece na criação (RN 8).

### Passos
1. Acessar a tela de criação de modelo
   → Aba "Identificação" é exibida com o switch "Usar designs sugeridos" visível, marcado como ativo por padrão.
2. Aguardar a tooltip do switch ser exibida ao posicionar o mouse
   → Tooltip exibida: "Quando ativo, a IA utilizará designs pré-definidos como sugestão ao gerar o conteúdo do curso".

## TC7 — Defaults dos switches na criação
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar valores default dos switches: "Usar como modelo padrão" = false, "Usar designs sugeridos" = true, "Ativo" = true (RN 8).

### Passos
1. Acessar a tela de criação de modelo
   → Aba "Identificação" é exibida.
2. Aguardar os switches serem renderizados
   → Switch "Usar como modelo padrão" exibido desativado, switch "Usar designs sugeridos" exibido ativado, switch "Ativo" exibido ativado.

## TC8 — Cancelar criação com alterações pendentes
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [beforeunload]

### Objetivo
Validar diálogo nativo de saída com alterações não salvas.

### Passos
1. Acessar a tela de criação de modelo
   → Aba "Identificação" é exibida.
2. Preencher o campo "Nome" com "Teste cancelamento"
   → Campo "Nome" exibe o texto digitado e o estado do form fica "sujo".
3. Clicar no botão "Cancelar"
   → Diálogo nativo do browser é exibido perguntando se o usuário deseja sair sem salvar.
4. Confirmar manter na página no diálogo
   → Usuário permanece na tela de criação com os dados preenchidos.

---

---
suite: Criação de Modelo - Aba Estilo do Conteúdo
executor: playwright
org: principal
playbooks: [cleanup-dados, flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Modelo de teste cadastrado no setup do spec (via beforeAll)
  - Usuário logado como Admin
---

# Criação de Modelo - Aba Estilo do Conteúdo

## TC1 — Botão "Adicionar mais dados" exibe menu com 6 opções
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que o botão exibe menu com as 6 opções de estilo (RN 12, RN 13).

### Passos
1. Acessar a aba "Estilo do conteúdo" do modelo de teste
   → Aba "Estilo do conteúdo" fica selecionada.
2. Clicar no botão "Adicionar mais dados"
   → Menu suspenso é exibido contendo as opções: "Idade", "Dificuldade", "Tom de voz", "Perfil do público", "Idioma", "Informações adicionais".

## TC2 — Adicionar campo Idade via menu
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar adição de campo via menu (RN 13, RN 13.1).

### Passos
1. Acessar a aba "Estilo do conteúdo" do modelo de teste
   → Aba "Estilo do conteúdo" é exibida.
2. Clicar no botão "Adicionar mais dados"
   → Menu suspenso é exibido.
3. Clicar na opção "Idade" no menu
   → Menu fecha e novo campo "Idade" é inserido na seção de estilo, seguindo o mesmo padrão do Estúdio de Criação.

---

---
suite: Criação de Modelo - Aba Estrutura do Conteúdo
executor: playwright
org: principal
playbooks: [switch-chakra, cleanup-dados, flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Modelo de teste cadastrado no setup do spec (via beforeAll)
  - Usuário logado como Admin
---

# Criação de Modelo - Aba Estrutura do Conteúdo

## TC1 — Tipo de estrutura exibe 2 opções
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar opções do dropdown "Tipo de estrutura" (RN 15, RN 16).

### Passos
1. Acessar a aba "Estrutura do conteúdo" do modelo de teste
   → Aba "Estrutura do conteúdo" fica selecionada.
2. Clicar no dropdown "Tipo de estrutura"
   → Dropdown exibe as opções "Atividades sequenciais (1 nível)" e "Atividades agrupadas por módulos (2 níveis)".

## TC2 — Tooltip do Tipo de estrutura
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar texto literal da tooltip (RN 15).

### Passos
1. Acessar a aba "Estrutura do conteúdo"
   → Aba é exibida.
2. Aguardar a tooltip do campo "Tipo de estrutura" ser exibida ao posicionar o mouse
   → Tooltip exibida: "Define se o curso possui apenas atividades sequenciais ou se elas são organizadas em módulos.".

## TC3 — Selecionar "2 níveis" exibe campo de atividades por módulo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar comportamento condicional ao selecionar 2 níveis (RN 16.1).

### Passos
1. Acessar a aba "Estrutura do conteúdo"
   → Aba é exibida.
2. Selecionar "Atividades agrupadas por módulos (2 níveis)" no dropdown "Tipo de estrutura"
   → Dropdown exibe a opção selecionada.
3. Aguardar o campo "Número de atividades por módulo" ser exibido
   → Campo numérico "Número de atividades por módulo" é exibido com tooltip: "Número sugerido de atividades que a IA irá criar dentro de cada módulo do curso.".

## TC4 — Carga horária obrigatória bloqueia salvamento
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que sem "Carga horária sugerida" o salvamento é bloqueado (RN 18).

### Passos
1. Acessar a aba "Estrutura do conteúdo" do modelo de teste sem carga horária preenchida
   → Aba é exibida.
2. Clicar no botão "Salvar"
   → Mensagem de validação exibida: "Carga horária sugerida é obrigatória". Modelo NÃO é salvo.

## TC5 — Carga horária exibe 5 opções literais
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar as 5 opções literais de carga horária (RN 18).

### Passos
1. Acessar a aba "Estrutura do conteúdo"
   → Aba é exibida.
2. Clicar no dropdown "Carga horária sugerida"
   → Dropdown exibe as opções "Micro (30 segundos a 5 minutos)", "Curto (5 a 15 minutos)", "Médio (15 a 30 minutos)", "Estendido (30 a 60 minutos)", "Longo (1 a 2 horas)".

## TC6 — Switch "Incluir questionários" exibe configurações básicas
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que ativar o switch exibe os campos básicos de questionário (RN 21, RN 22).

### Passos
1. Acessar a aba "Estrutura do conteúdo"
   → Aba é exibida com a seção "Questionários ao longo do conteúdo".
2. Ativar o switch "Incluir questionários no conteúdo"
   → Seção expande exibindo os campos básicos de configuração de questionário.

## TC7 — Switch "Configurações avançadas" exibe campos adicionais
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que ativar configurações avançadas exibe campos adicionais (RN 22.1).

### Passos
1. Ativar o switch "Incluir questionários no conteúdo"
   → Campos básicos de questionário são exibidos.
2. Ativar o switch "Configurações avançadas"
   → Campos adicionais de configuração são exibidos.

## TC8 — Switch "Incluir prova final"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar exibição da seção "Prova final" e campos básicos (RN 25, RN 26).

### Passos
1. Acessar a aba "Estrutura do conteúdo"
   → Aba é exibida com a seção "Prova final".
2. Aguardar a tooltip da seção "Prova final" ser exibida ao posicionar o mouse
   → Tooltip exibida: "Avaliação aplicada ao final do curso, cobrindo todo o conteúdo.".
3. Ativar o switch "Incluir prova final"
   → Seção expande exibindo os campos básicos de configuração de prova final.

---

---
suite: Criação de Modelo - Aba Imagem
executor: playwright
org: principal
playbooks: [cleanup-dados, flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Modelo de teste cadastrado no setup do spec (via beforeAll)
  - Usuário logado como Admin
---

# Criação de Modelo - Aba Imagem

## TC1 — Aba Imagem exibe título e subtítulo literais
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar textos literais da aba Imagem (RN 57.1, RN 57.2).

### Passos
1. Acessar a aba "Imagem" do modelo de teste
   → Aba "Imagem" fica selecionada.
2. Aguardar a renderização da seção
   → Título exibido: "Escolha o padrão de imagens para o modelo". Subtítulo exibido: "Selecione como as imagens serão incluídas nos cursos gerados com este modelo. Cada opção oferece diferentes benefícios para a experiência de aprendizado.".

## TC2 — Opções de padrão de imagem disponíveis
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar 4 opções de padrão de imagem (RN 57).

### Passos
1. Acessar a aba "Imagem"
   → Aba é exibida.
2. Aguardar as opções serem renderizadas
   → Opções exibidas: "Sem imagens, somente textos", "Banco de imagens aberto", "Gerador DALL-E (OpenAI)", "Gerador Imagen 4 (Google)".

## TC3 — Default "Sem imagens, somente textos"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que o padrão selecionado por default é "Sem imagens, somente textos" (RN 57.4).

### Passos
1. Acessar a aba "Imagem" em um novo modelo recém-criado
   → Aba é exibida.
2. Aguardar a seleção default ser renderizada
   → Opção "Sem imagens, somente textos" é exibida como selecionada por padrão.

---

---
suite: Criação de Modelo - Aba Áudio
executor: playwright
org: principal
playbooks: [cleanup-dados, flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Modelo de teste cadastrado no setup do spec (via beforeAll)
  - Usuário logado como Admin
---

# Criação de Modelo - Aba Áudio

## TC1 — Aba Áudio exibe título e subtítulo literais
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar textos literais da aba Áudio (RN 58.1, RN 58.2).

### Passos
1. Acessar a aba "Áudio" do modelo de teste
   → Aba "Áudio" fica selecionada.
2. Aguardar a renderização da seção
   → Título exibido: "Escolha a voz padrão para narrar as aulas". Subtítulo exibido: "Selecione a voz que melhor se adequa ao tom deste modelo. Você pode ouvir uma amostra de cada voz antes de escolher.".

## TC2 — Opções de voz disponíveis
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar 4 opções de voz (RN 58).

### Passos
1. Acessar a aba "Áudio"
   → Aba é exibida.
2. Aguardar as opções de voz serem renderizadas
   → Opções exibidas: "Ana", "Cris", "Carlos", "Morgan".

## TC3 — Default voz "Ana"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que a voz default selecionada é "Ana" (RN 58.4).

### Passos
1. Acessar a aba "Áudio" em um novo modelo recém-criado
   → Aba é exibida.
2. Aguardar a seleção default ser renderizada
   → Opção "Ana" é exibida como selecionada por padrão.

## TC4 — Botão de preview de voz funcional
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que o botão de preview/ouvir amostra está disponível para cada voz (RN 58 — quebra QA 1.5).

### Passos
1. Acessar a aba "Áudio"
   → Aba é exibida com as 4 opções de voz.
2. Clicar no botão de preview da voz "Cris"
   → Sistema inicia reprodução da amostra de áudio da voz "Cris".

---

---
suite: Criação de Design de Página
executor: playwright
org: principal
playbooks: [cleanup-dados, flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Modelo de teste cadastrado no setup do spec, com pelo menos 1 kit de marca selecionado
  - Usuário logado como Admin
---

# Criação de Design de Página

## TC1 — Acessar criação de Página via menu Adicionar
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar fluxo de criação de Página (RN 30, RN 31, RN 32).

### Passos
1. Acessar a aba "Design" do modelo de teste
   → Aba "Design" exibe a listagem de designs (vazia ou com designs cadastrados).
2. Clicar no botão "Adicionar"
   → Menu suspenso é exibido com as opções "Aula" e "Página".
3. Clicar na opção "Página"
   → Sistema redireciona para a tela de criação de Página exibindo a aba "Identificação".

## TC2 — Validar campos obrigatórios da aba Identificação - Página
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar campos obrigatórios da aba Identificação de design de Página (RN 33).

### Passos
1. Acessar a tela de criação de Página com a aba "Identificação"
   → Aba "Identificação" é exibida com campos vazios.
2. Clicar no botão "Salvar" sem preencher nada
   → Mensagens de validação exibidas para os campos obrigatórios: "Nome", "Instruções de estrutura para a IA", "Sequência". Página NÃO é criada.

## TC3 — Auto-preenchimento ao selecionar tipo "Capa"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar auto-preenchimento dos campos de instruções ao selecionar o tipo "Capa" (RN 33.1).

### Passos
1. Acessar a tela de criação de Página com a aba "Identificação"
   → Aba "Identificação" é exibida.
2. Selecionar "Capa" no campo "Tipo"
   → Campo "Tipo" exibe "Capa" selecionado.
3. Aguardar o auto-preenchimento dos campos de instruções
   → Campo "Instruções de estrutura para a IA" é preenchido automaticamente com: "Usar sempre como primeira parte de qualquer aula.". Campo "Instruções de conteúdo para a IA" é preenchido automaticamente com texto canônico da Capa.

## TC4 — Tooltip do campo Tipo
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar texto da tooltip do campo Tipo (RN 33).

### Passos
1. Acessar a tela de criação de Página com a aba "Identificação"
   → Aba é exibida.
2. Aguardar a tooltip do campo "Tipo" ser exibida ao posicionar o mouse
   → Tooltip exibida: "Classifique este design por tipo de parte (ex: Capa, Corpo, Encerramento). Essa informação será utilizada para filtrar e organizar seus designs.".

## TC5 — Salvar Identificação redireciona para aba Design
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar redirecionamento automático após salvar Identificação (RN 34).

### Passos
1. Acessar a tela de criação de Página com a aba "Identificação"
   → Aba "Identificação" é exibida.
2. Preencher o campo "Nome" com "Design TC5 w{workerIndex}-{timestamp}"
   → Campo "Nome" exibe o texto digitado.
3. Selecionar "Corpo" no campo "Tipo"
   → Campos de instrução são auto-preenchidos.
4. Preencher o campo "Sequência" com "1"
   → Campo "Sequência" exibe o valor digitado.
5. Clicar no botão "Salvar"
   → Toast exibida: "Design criado com sucesso.". Sistema redireciona automaticamente para a aba "Design" da própria Página.

## TC6 — Aba Design exibe Plate Editor com Kit de Marca default
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que a aba Design exibe o Plate Editor com kit de marca selecionado (RN 35, RN 36.1).

### Passos
1. Acessar a aba "Design" de uma Página recém-salva
   → Aba "Design" é exibida com o Plate Editor renderizado.
2. Aguardar o select de Kit de Marca ser renderizado
   → Select de Kit de Marca exibe o mesmo kit que está selecionado no Modelo por padrão.

## TC7 — Salvar Página retorna para aba Design do Modelo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar retorno à aba Design do Modelo com listagem atualizada (RN 37).

### Passos
1. Acessar a aba "Design" da Página em criação
   → Plate Editor é exibido.
2. Clicar no botão "Salvar" da Página
   → Sistema retorna para a aba "Design" do Modelo de conteúdo.
3. Aguardar a listagem de designs do Modelo carregar
   → Listagem exibe a nova Página criada na lista de designs.

---

---
suite: Criação de Design de Aula
executor: playwright
org: principal
playbooks: [cleanup-dados, flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Modelo de teste cadastrado no setup do spec, com pelo menos 1 kit de marca selecionado
  - Usuário logado como Admin
---

# Criação de Design de Aula

## TC1 — Acessar criação de Aula via menu Adicionar
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar fluxo de criação de Aula (RN 30, RN 31, RN 38).

### Passos
1. Acessar a aba "Design" do modelo de teste
   → Aba "Design" exibe a listagem de designs.
2. Clicar no botão "Adicionar"
   → Menu suspenso é exibido com as opções "Aula" e "Página".
3. Clicar na opção "Aula"
   → Sistema redireciona para a tela de criação de Aula exibindo a aba "Identificação".

## TC2 — Salvar Aula com dados válidos
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar criação de Aula com campos da Identificação (RN 39, RN 40).

### Passos
1. Acessar a tela de criação de Aula com a aba "Identificação"
   → Aba "Identificação" é exibida.
2. Preencher o campo "Nome" com "Aula TC2 w{workerIndex}-{timestamp}"
   → Campo "Nome" exibe o texto digitado.
3. Selecionar "Introdução" no campo "Tipo"
   → Campos de instruções são auto-preenchidos com textos canônicos de Introdução.
4. Preencher o campo "Sequência" com "1"
   → Campo "Sequência" exibe o valor digitado.
5. Clicar no botão "Salvar"
   → Sistema redireciona automaticamente para a aba "Design" da Aula.

## TC3 — Aba Design da Aula exibe editor padrão com customizações
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que a aba Design exibe o editor de Aula padrão com customizações de kit de marca (RN 41, RN 42).

### Passos
1. Acessar a aba "Design" de uma Aula recém-salva
   → Editor de Aula padrão da plataforma é exibido.
2. Aguardar a ferramenta de layout com seleção de kit de marca ser renderizada
   → Ferramenta de layout exibe os 3 primeiros kits de marca cadastrados, com possibilidade de scroll para acessar os demais.

## TC4 — Salvar Aula retorna para aba Design do Modelo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar retorno à aba Design do Modelo (RN 43).

### Passos
1. Acessar a aba "Design" da Aula em criação
   → Editor é exibido.
2. Clicar no botão "Salvar" da Aula
   → Sistema retorna para a aba "Design" do Modelo de conteúdo.
3. Aguardar a listagem de designs do Modelo carregar
   → Listagem exibe a nova Aula criada na lista de designs.

---

---
suite: Listagem de Designs (aba Design do Modelo)
executor: playwright
org: principal
playbooks: [filtro-drawer, flipper, cleanup-dados, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Modelo de teste cadastrado com pelo menos 3 designs (mix de Aula e Página)
  - Usuário logado como Admin
---

# Listagem de Designs (aba Design do Modelo)

## TC1 — Listagem exibe colunas obrigatórias
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar colunas da listagem de designs (RN 44, RN 45).

### Passos
1. Acessar a aba "Design" do modelo de teste
   → Aba "Design" é exibida.
2. Aguardar a listagem de designs ser renderizada
   → Listagem exibe colunas: "Nome", "Formato", "Tipo", "Ações".

## TC2 — Ações da listagem de designs
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar ações disponíveis em cada linha da listagem de designs (RN 46).

### Passos
1. Acessar a aba "Design" do modelo de teste
   → Listagem é exibida.
2. Aguardar a coluna "Ações" de cada linha ser renderizada
   → Cada linha da listagem exibe os botões "Editar", "Duplicar" e "Excluir".

## TC3 — Filtrar designs por Tipo (Aula/Página)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar filtro padrão "Somente aulas" (RN 50).

### Passos
1. Clicar no botão "Filtrar"
   → Drawer "Filtros" é exibido com os filtros padrão "Somente páginas" e "Somente aulas".
2. Selecionar o filtro padrão "Somente aulas"
   → Filtro fica marcado.
3. Aplicar o filtro
   → Drawer fecha. Listagem exibe apenas designs do Tipo "Aula".

---

---
suite: Ações Duplicar e Drag and Drop
executor: playwright
org: principal
playbooks: [cleanup-dados, flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Modelo de teste cadastrado com pelo menos 3 designs cadastrados
  - Usuário logado como Admin
---

# Ações Duplicar e Drag and Drop

## TC1 — Duplicar modelo com cópia profunda
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que duplicar modelo cria cópia profunda com nome "[Cópia] <original>" (RN 6.1).

### Passos
1. Acessar a listagem de modelos com o modelo de teste
   → Listagem é exibida.
2. Clicar na ação "Duplicar" do modelo de teste
   → Toast exibida: "Modelo de conteúdo duplicado com sucesso.".
3. Aguardar a listagem ser atualizada
   → Listagem exibe novo modelo com nome no formato "[Cópia] {nome original do modelo}", listado imediatamente.

## TC2 — Duplicar design individual
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar duplicação individual de design (RN 6.1 estendido pela QA 2.2).

### Passos
1. Acessar a aba "Design" do modelo de teste
   → Listagem de designs é exibida.
2. Clicar na ação "Duplicar" de um design existente
   → Listagem atualiza exibindo cópia do design com nome no formato "[Cópia] {nome original do design}".

## TC3 — Drag and drop reorder designs (visão Lista)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar drag and drop de reordenação na visão Lista (RN 63).

### Passos
1. Acessar a aba "Design" do modelo de teste em visualização Lista
   → Listagem é exibida com pelo menos 3 designs.
2. Arrastar o ícone de drag do segundo item para a primeira posição
   → Listagem reflete a nova ordem com o item arrastado na primeira posição.
3. Aguardar a nova sequência ser persistida
   → Listagem mantém a nova ordem após recarregar a página.

## TC4 — Drag and drop desabilitado quando filtro ativo
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [filtro-drawer]

### Objetivo
Validar que drag and drop fica desabilitado com filtro ativo (RN 63.1).

### Passos
1. Acessar a aba "Design" do modelo de teste
   → Listagem é exibida.
2. Aplicar o filtro padrão "Somente páginas"
   → Listagem exibe apenas designs do Tipo Página.
3. Aguardar o ícone de drag ser renderizado
   → Ícone de drag exibido em estado desabilitado nas linhas/cards da listagem filtrada.

---

---
suite: Preview de Modelos e Designs
executor: playwright
org: principal
playbooks: [cleanup-dados, flipper]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Modelo de teste cadastrado com pelo menos 2 designs com previews gerados (1 Aula e 1 Página)
  - Usuário logado como Admin
---

# Preview de Modelos e Designs

## TC1 — Abrir Preview de Modelo via card
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar abertura do modal carrossel de preview do modelo (RN 5.2).

### Passos
1. Acessar a listagem de modelos em visualização Cards
   → Listagem é exibida.
2. Clicar na ação "Preview" do modelo de teste
   → Modal de preview é exibido com carrossel contendo o primeiro design.

## TC2 — Conteúdo de cada item do carrossel
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar campos exibidos em cada slide do carrossel (RN 5.2).

### Passos
1. Abrir o modal de Preview do modelo de teste
   → Modal exibe o primeiro slide do carrossel.
2. Aguardar a renderização do slide
   → Slide exibe: texto "Modelo: {nome do modelo}", Thumb do design, texto "Design: {nome do design}", texto "Tipo: {Aula ou Página}", texto "Prompt: {prosa de instruções}", indicador "Design 1 de 2".

## TC3 — Navegar entre slides no carrossel
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar navegação entre slides (RN 5.2).

### Passos
1. Abrir o modal de Preview do modelo de teste
   → Modal exibe "Design 1 de 2".
2. Clicar no botão de navegação "Próximo" do carrossel
   → Modal exibe o slide seguinte com indicador "Design 2 de 2".

## TC4 — Preview de Design tipo Página tem zoom com scroll
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar opção de zoom com scroll apenas em designs do tipo Página (RN 5.2).

### Passos
1. Abrir o modal de Preview de um design tipo Página
   → Modal exibe o preview da Página.
2. Aguardar a opção de zoom ser renderizada
   → Componente de zoom com scroll é exibido sobre o preview da Página.

---

---
suite: Sincronização e Regeração de Previews
executor: playwright
org: principal
playbooks: [flipper, toast-chakra, cleanup-dados]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Modelo de teste cadastrado com pelo menos 1 design e Kit de Marca selecionado
  - Pelo menos 2 kits de marca distintos cadastrados na organização
  - Usuário logado como Admin
---

# Sincronização e Regeração de Previews

## TC1 — Alterar Kit de Marca exibe ícone de alerta no card
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar exibição do ícone de alerta na listagem após alteração do kit de marca (RN 59, RN 59.1).

### Passos
1. Acessar a aba "Identificação" do modelo de teste
   → Aba "Identificação" é exibida com o kit de marca atual selecionado.
2. Selecionar um Kit de Marca diferente no dropdown "Kit de marca"
   → Dropdown exibe a nova opção selecionada.
3. Clicar no botão "Salvar"
   → Toast de sucesso é exibida (REVISAR-FIGMA: texto exato).
4. Acessar a listagem de modelos
   → Card do modelo exibe ícone de alerta no canto superior direito.
5. Aguardar a tooltip do ícone de alerta ser exibida ao posicionar o mouse
   → Tooltip exibida: "Este modelo possui designs pendentes de regeração. Acesse a aba design e clique no botão 'Regerar designs'.".

## TC2 — Botão "Regerar todos" exibe tooltip correto
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar exibição do botão "Regerar todos" na aba Design com tooltip literal (RN 59.2, RN 59.3).

### Passos
1. Acessar a aba "Design" do modelo após alteração de kit de marca
   → Aba "Design" exibe a listagem de designs e o botão "Regerar todos".
2. Aguardar a tooltip do botão "Regerar todos" ser exibida ao posicionar o mouse
   → Tooltip exibida: "O kit de marca foi alterado. Clique em 'Regerar todos' para atualizar todos os designs com as novas configurações de cores e fontes.".

## TC3 — Clicar "Regerar todos" inicia processo assíncrono
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar inicio do processo de regeração com toast (RN 59.4).

### Passos
1. Acessar a aba "Design" do modelo após alteração de kit de marca
   → Botão "Regerar todos" é exibido.
2. Clicar no botão "Regerar todos"
   → Toast exibida: "A regeração dos designs foi iniciada. Você será notificado quando for concluída.".

---

---
suite: Bloqueio Exclusão Cores Kit de Marca
executor: playwright
org: principal
playbooks: [flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Kit de marca cadastrado e associado a pelo menos 1 modelo de conteúdo
  - Usuário logado como Admin
---

# Bloqueio Exclusão Cores Kit de Marca

## TC1 — Bloqueio de exclusão de cor em uso por modelo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que cor de kit de marca em uso por modelo não pode ser excluída (RN 64).

### Passos
1. Acessar a tela de edição do kit de marca utilizado pelo modelo de teste
   → Tela de edição é exibida com as cores cadastradas.
2. Clicar no botão de excluir da cor que está em uso pelo modelo
   → Mensagem de bloqueio exibida indicando que a cor está em uso por um ou mais modelos de conteúdo. Cor NÃO é excluída.

## TC2 — Exclusão permitida de cor sem modelos associados
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que cor sem modelos associados pode ser excluída normalmente (RN 64).

### Passos
1. Acessar a tela de edição de um kit de marca com cor não utilizada por nenhum modelo
   → Tela de edição é exibida.
2. Clicar no botão de excluir da cor não utilizada
   → Cor é excluída e Toast de sucesso é exibida (REVISAR-FIGMA: texto exato).

---

---
suite: Feature flag modelos_de_conteudo
executor: playwright
org: principal
playbooks: [flipper, super-admin]
preconditions:
  - Ambiente Stage configurado
  - Usuário logado como Admin com flag elevada para Flipper-UI
  - Feature flag `modelos_de_conteudo` controlável via Super Admin
---

# Feature flag modelos_de_conteudo

## TC1 — Acesso bloqueado com flag desabilitada
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que o submenu "Modelos de conteúdo" não aparece quando a flag está desabilitada (RN 1.2).

### Passos
1. Desabilitar a feature flag `modelos_de_conteudo` para a organização do teste via Flipper-UI
   → Flag fica como "Conditionally enabled" sem actor `Organization;{orgId}`.
2. Acessar a URL "/o/{orgId}/dashboard"
   → Dashboard padrão é exibido.
3. Clicar no menu lateral "Aprendizagem"
   → Submenu lateral é exibido SEM o item "Modelos de conteúdo".

## TC2 — Acesso liberado com flag habilitada
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que a funcionalidade fica acessível quando a flag está habilitada (RN 1.2).

### Passos
1. Habilitar a feature flag `modelos_de_conteudo` para a organização do teste via Flipper-UI
   → Flag fica como "Conditionally enabled" com actor `Organization;{orgId}`.
2. Acessar a URL "/o/{orgId}/dashboard"
   → Dashboard padrão é exibido.
3. Clicar no menu lateral "Aprendizagem"
   → Submenu lateral é exibido COM o item "Modelos de conteúdo".
4. Clicar no submenu "Modelos de conteúdo"
   → Sistema redireciona para a listagem de modelos de conteúdo.

## TC3 — Transição off → on durante a sessão
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar que ativar a flag durante uma sessão libera a funcionalidade após refresh.

### Passos
1. Iniciar sessão com a flag desabilitada para a organização do teste
   → Submenu "Modelos de conteúdo" NÃO é exibido.
2. Habilitar a flag `modelos_de_conteudo` para a organização via Flipper-UI
   → Flag fica como "Conditionally enabled" com actor `Organization;{orgId}`.
3. Recarregar a página "/o/{orgId}/dashboard"
   → Dashboard é exibido novamente.
4. Clicar no menu lateral "Aprendizagem"
   → Submenu lateral agora exibe o item "Modelos de conteúdo".

---

---
suite: Ambientes adicionais - Modelos
executor: playwright
org: principal
playbooks: [ambientes-adicionais, flipper, toast-chakra, cleanup-dados]
preconditions:
  - Ambiente Stage configurado com env adicional pareado
  - Feature flag `modelos_de_conteudo` ativa em ambas as orgs (principal e adicional)
  - Usuário logado como Admin
---

# Ambientes adicionais - Modelos

## TC1 — Modelos criados no principal não aparecem no adicional
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]

### Objetivo
Validar isolamento de dados de modelos entre tenants pareados.

### Passos
1. Criar modelo "Modelo TC1 isolamento w{workerIndex}-{timestamp}" no ambiente principal
   → Toast exibida: "Modelo de conteúdo criado com sucesso.". Listagem do principal exibe o novo modelo.
2. Acessar a listagem de modelos no ambiente adicional pareado
   → Listagem do ambiente adicional NÃO exibe o modelo criado no principal.

## TC2 — Modelos criados no adicional não aparecem no principal
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]

### Objetivo
Validar isolamento bidirecional.

### Passos
1. Criar modelo "Modelo TC2 isolamento w{workerIndex}-{timestamp}" no ambiente adicional
   → Toast exibida: "Modelo de conteúdo criado com sucesso.". Listagem do adicional exibe o novo modelo.
2. Acessar a listagem de modelos no ambiente principal
   → Listagem do ambiente principal NÃO exibe o modelo criado no adicional.
