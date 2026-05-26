# Requisitos Extraídos - Painéis dos Usuários (Widgets)

Documento base: `[Discovery] Painéis dos usuários (Widgets) – v01 23.03.2026.docx`
Versão: 01 (criada 23.03.2026, concluída 06.04.2026 por Alexandre)

## 1. Informações Gerais

- **Tipo de projeto**: UI / Funcional (com logs, banco histórico e feature flag)
- **Objetivo**: Permitir que usuários criem, personalizem e utilizem Painéis compostos por Abas e Widgets, possibilitando a organização de informações, métricas, atalhos e visualizações dentro da plataforma de forma flexível e aderente ao contexto de uso.
- **Feature flags**: `habilitar_paineis_do_usuario`
- **Perfis envolvidos**: Admin (criação/edição de painéis), Aluno (visualização via modo de uso)
- **Módulo afetado**: Menu > Navegação (renomeado para "Menu") > Modos de uso > Painéis
- **Novos componentes**: Listagem list-control, tela de criação com abas "Identificação" e "Layouts", modais (renomear, adicionar aba), drawers (widgets disponíveis, configurações do widget), barras de ferramentas (topo da aba, rodapé de ações)
- **Dispositivos**: Edição apenas Desktop; visualização disponível Desktop / Tablet (768) / Mobile (360)

## 2. Suítes de Teste (extraídas da planilha de quebra de atividades — aba `dev-qa`, atividades do tipo "Execução de testes")

| # | Título | RNs cobertos | Origem (planilha) |
|---|--------|--------------|--------------------|
| 1 | Listagem de painéis | R1 (1-4), R2 (6,7,9,10,11,13) | QA 2.1 - Listagem |
| 2 | Ativar / Inativar painel | R2 (12, 12.1), R15 (93) | QA 2.2 - Ativar / Inativar |
| 3 | Compartilhamento de painéis | R2 (14, 15) | QA 2.3 - Compartilhamento |
| 4 | Pesquisa e Filtros | R2 (8), R3 (16-18) | QA 2.4 - Pesquisa e Filtros |
| 5 | Adicionar/editar aba | R5 (21-23), R6 (25-41) | QA 3.1 - Adicionar/editar aba |
| 6 | Layout das abas | R8 (54-65.2) | QA 3.2 - Layout das abas |
| 7 | Adicionar widgets | R9 (66-83.1) | QA 3.3 - Adicionar widgets |
| 8 | Editar/Excluir widgets | R10 (84-87) | QA 3.4 - Editar/Excluir widgets |
| 9 | Duplicar painéis | R4 (19, 20) | QA 4.1 - Duplicar painéis |
| 10 | Importar abas | R7 (42-53) | QA 5.1 - Importar abas |
| 11 | Modo de uso - Painéis do usuário | R11 (88-89.2) | QA 6.1 - Modo de uso > Painéis do usuário |
| 12 | Dashboard - Visão do aluno | — | QA 6.2 - Dashboard - Visão do aluno |
| 13 | Mobile | — | QA 6.3 - Mobile |
| 14 | Worker - Migração de painéis | — | QA 7.1 - [Workers] Criar worker para a migração dos painéis |
| 15 | Worker - Reversão | — | QA 7.2 - [Workers] Criar worker de reversão |
| 16 | Beta / Launch | — | QA 8.1 - Beta / Launch |
| 17 | Banco histórico | R13 (91) | QA 9.1 - Banco histórico |
| 18 | Logs | R14 (92) | QA 10.1 - Logs |
| 19 | Ambientes adicionais | — | QA 11.1 - Ambientes adicionais |
| 20 | Feature flag | — | QA 11.2 - Feature flag |
| 21 | Trial | — | QA 11.3 - Trial |

## 3. Regras de Negócio

### R1 — Exibir o módulo de Painéis condicionado por feature flag
- Menu "Navegação" é renomeado para **Menu**.
- Breadcrumb da tela ajustado para **"Navegação > Modos de uso"**, substituindo **"Navegação > Modo de uso"**.
- Deve existir uma aba chamada **"Painéis"** dentro do Menu.
- Aba exibida apenas quando a feature flag `habilitar_paineis_do_usuario` estiver ativa.
- Com feature flag desativada, módulo não deve ser exibido.

### R2 — Listagem de painéis
- Usar componente padrão **list-control**.
- Deve possuir botão **"+ Adicionar"**.
- Deve possuir campo de pesquisa.
- Deve possuir visualização em **lista** e **cards**; padrão é lista.
- Colunas da lista: **Nome, Descrição, Provedora, Data de criação, Ativo?, Ações**.
- Coluna "Ativo?" é um **switch** representando ativo/inativo.
  - Se painel estiver associado a um ou mais menus de modo de uso, sistema exibe modal informativo (similar ao modal de créditos) listando os menus que utilizam o painel e informando que não pode ser desativado enquanto houver associações ativas.
- Coluna "Ações" possui: **Editar, Duplicar, Excluir**.
- Painéis **compartilhados** não podem ser editados nem excluídos.

### R3 — Filtrar e pesquisar painéis
- Todas as colunas da listagem devem ser passíveis de filtro.
- Filtros padrão: **Painéis próprios, Painéis compartilhados, Painéis ativos, Painéis inativos**.
- Pesquisa considera: **Nome, Descrição**.

### R4 — Duplicar painéis
- Ao duplicar, **abas, widgets e configurações devem ser copiadas**.
- Novo painel aparece no final da lista com o padrão `[Cópia] nome do painel duplicado`.

### R5 — Criar painéis personalizados
- Botão **"+ Adicionar"** direciona para nova tela de criação de painel.
- Tela de criação/edição possui duas abas: **Identificação** e **Layouts**.
- Aba Identificação:
  - **Nome** — input, obrigatório, até 255 caracteres.
  - **Descrição** — textarea, opcional, até 500 caracteres.

### R6 — Gerenciar abas do painel
- Aba **Layouts** existe como parte da estrutura da tela de criação/edição.
- Ao acessar Layouts, sistema exibe aba inicial criada automaticamente chamada **"Nova aba"**.
- Aba inicial não pode ser excluída enquanto for a única; nesse estado, apenas renomear está disponível.
- Renomear aba (via ícone de lápis ao lado do nome) abre modal com:
  - Título: **"Renomear aba"**
  - Subtítulo: **"Altere o nome da aba selecionada"**
  - Campo: **Nome da aba** (input, até 255 caracteres)
  - Ações: **Cancelar, Renomear**
  - Ao confirmar: atualiza nome e exibe toast **"Aba renomeada com sucesso"**.
- Botão **"Adicionar aba"** ao lado direito da última aba.
- Clicar em "Adicionar aba" abre modal:
  - Título: **"Adicionar nova aba"**
  - Subtítulo: **"Escolha como deseja criar a nova aba"**
  - Opções:
    - **Criar nova aba** — ícone de adição — descrição **"Crie uma nova aba vazia e adicione widgets manualmente"**.
    - **Importar de outro painel** — ícone de download — descrição **"Reutilize uma aba existente de outro painel"**.
- Ao selecionar "Criar nova aba", novo modal:
  - Título: **"Adicionar nova aba"**
  - Subtítulo: **"Crie uma nova aba vazia"**
  - Campos: **Nome da aba** (input, até 255 caracteres), **Categoria** (select com opções: Aprendizagem).
  - Ações: **Voltar, Cancelar, Criar aba**. Voltar retorna ao modal anterior de seleção de tipo.
- Ao criar a aba, sistema adiciona-a ao painel e disponibiliza para edição no layout.
- Ao existir mais de uma aba, todas permitem exclusão e edição (renomeação).
- Ao excluir uma aba, caso reste apenas uma, a ação de exclusão é desabilitada na restante.
- Sistema garante que **sempre exista pelo menos uma aba ativa** no painel.

### R7 — Importar abas de outro painel
- Ao selecionar "Importar de outro painel", novo step do modal:
  - Título: **"Adicionar nova aba"**
  - Subtítulo: **"Importar de outro painel"**
- Campo obrigatório **"Painel de origem"** — select buscável, lista painéis disponíveis para o usuário exibindo o nome do painel.
- Após selecionar o painel, exibe campo **"Aba disponível"** que lista as abas do painel selecionado:
  - Nome da aba
  - Quantidade de widgets (ex: "2 widgets", "3 widgets")
- Ao selecionar uma aba, exibe preview com: **Nome da aba, Quantidade de widgets, Lista de widgets inclusos**.
- Após seleção da aba, exibe campo **"Nome da nova aba"** (input obrigatório, até 255 caracteres), preenchido automaticamente com o nome da aba original.
- Campo **"Categoria"** com opções: Aprendizagem.
- Ações: **Voltar, Cancelar, Importar aba**. Voltar retorna ao step anterior.
- Ao confirmar importação, sistema:
  - Cria a aba com base na aba selecionada
  - Copia os widgets da aba original
  - Muda a aba ativa para a nova importada
  - Exibe toast **"Aba importada com sucesso"**
  - Exibe a aba atualizada já com os widgets importados
- Aba importada é adicionada ao painel e disponibilizada para edição.

### R8 — Visualizar e interagir com conteúdo da aba/layout
- Cada aba possui uma barra de ferramentas **fixa no topo** da área de layout.
- Na barra, à esquerda: botão **"+ Adicionar widget"**.
- À direita, controle de visualização com opções:
  - **"Visualização: Desktop"**
  - **"Visualização: Tablet"** (768 de largura)
  - **"Visualização: Mobile"** (360 de largura)
- A alteração da visualização reflete o layout da aba conforme o dispositivo.
  - Ao selecionar **Tablet**: alerta **"Visualização (Tablet) — edição disponível no Desktop"**.
  - Ao selecionar **Mobile**: alerta **"Visualização (Mobile) — edição disponível no Desktop"**.
- Ao lado do controle de visualização: switch **"Permitir reorganizar widgets"**.
- Quando visualização for **Tablet** ou **Mobile**, switch permanece desabilitado.
  - Tooltip no switch desabilitado: **"Edição disponível apenas no modo Desktop"**.
- Switch ativo: usuário pode alterar a posição dos widgets no layout.
- Switch inativo: reorganização bloqueada.
- Quando a aba não possuir nenhum widget, estado vazio com:
  - Ícone ilustrativo centralizado
  - Título: **"Nenhum widget adicionado"**
  - Descrição: **"Clique no botão "Adicionar Widget" para começar a montar sua tela personalizada"**
  - Botão primário: **"+ Adicionar Widget"**
- Botão "+ Adicionar Widget" do estado vazio executa a mesma ação do botão da barra de ferramentas.
- Barra de ferramentas **fixa no rodapé** com ações: **Cancelar, Salvar layout**.
  - **Cancelar**: descarta alterações não salvas e retorna para listagem de painéis.
  - **Salvar layout**: persiste alterações realizadas no layout da aba.

### R9 — Adicionar widgets ao layout
- Ao clicar em "+ Adicionar widget", exibe drawer lateral com listagem de widgets disponíveis.
- Drawer possui título **"Widgets disponíveis"**.
- Abaixo do título, campo de filtros **colapsado**.
- Ao clicar no campo de filtros, conteúdo expande exibindo opções disponíveis:
  - Campo **categorias dos widgets** em formato multi select com opções: **Todos, Aprendizagem**.
- Após os filtros, campo **"Buscar"** (input de texto), placeholder **"Digite o nome do widget..."**.
- Listagem de widgets exibida abaixo dos filtros, organizada por categorias.
- Widgets agrupados nas categorias: **Aprendizagem**.
- Cada categoria exibe seus widgets em formato de lista ou grid.
- Cada widget exibe: **Nome, Descrição, Tags associadas (quando aplicável), Badge de perfil** (ex: Usuário, Instrutor, Administrador).
- Widgets da categoria **Aprendizagem**:
  - **Resumo das atividades** — "Exibe um resumo completo das atividades de aprendizagem do usuário" (Perfil: Usuário)
  - **Conteúdos em andamento** — "Exibe os conteúdos que o usuário está cursando atualmente" (Perfil: Usuário)
  - **Ranking** — "Exibe para o usuário a sua posição do ranking e o top 5 do ambiente" (Perfil: Usuário)
  - **Meus certificados** — "Exibe todos os certificados que o usuário conquistou" (Perfil: Usuário)
- Cada widget possui tag visual indicando sua categoria.
- Ao passar cursor sobre o widget, pode exibir tooltip com descrição completa.
- Ao clicar em um widget, sistema adiciona o widget ao conteúdo da aba atualmente selecionada.
- Após adicionar, exibe toast **"Widget adicionado com sucesso"**.
- Por padrão, widgets são inseridos ocupando **6 colunas**, com exceção de **Ranking** e **Resumo de atividades**.

### R10 — Editar e excluir widgets criados na aba
- Widgets adicionados terão ícones de ações: **Editar (lápis)** e **Excluir (x)**.
- Ao clicar no lápis, abre drawer **"Configurações do widget"** com os campos:
  - **Mostrar título** (switch)
  - **Título** (máx. 255 caracteres)
  - **Mostrar ícone** (switch)
  - **Ícone** (componente de ícones similar ao do modo de uso)
- Drawer possui botões **"Cancelar"** e **"Salvar"** na parte inferior:
  - Cancelar: fecha drawer sem salvar as alterações.
  - Salvar: fecha drawer e exibe toast de sucesso **"Configurações salvas com sucesso"**.
- Ao clicar no x, o widget é excluído da aba.

### R11 — Criar modos de uso para os novos painéis
- Nos modelos de página do modo de uso, existe a opção **"Painéis do usuário"**. Ao selecioná-la, sistema exibe novo campo **"Espaço"** permitindo ao usuário selecionar qual painel será exibido quando o menu estiver ativo.
- Na visão do aluno, ao acessar um menu criado com Painel do usuário, sistema exibe a mesma estrutura/layout definidos no cadastro dos widgets, porém em modo exclusivamente de **visualização**. Todas as abas configuradas devem ser apresentadas.
- Visualização nos dispositivos **tablet e mobile** se adapta automaticamente de acordo com a resolução da tela.
- **Não teremos filtros nesse primeiro momento.**

### R15 — Não permitir ativar um menu caso o painel esteja inativo
- Se usuário tentar reativar um modo cujo painel associado está inativo, sistema **bloqueia a operação** e exibe modal informando que o painel está inativo e não pode ser reativado.

### R13 — Banco histórico
- Será necessário adicionar as tabelas criadas nesse projeto à rotina de exclusão do banco histórico.

### R14 — Logs
- Será necessário registrar os logs das ações realizadas nos **widgets, abas e painéis**.

## 4. Textos Literais

### Tooltips
- Switch "Permitir reorganizar widgets" desabilitado: **"Edição disponível apenas no modo Desktop"**
- Widget (cursor sobre): descrição completa do widget

### Placeholders
- Campo "Buscar" (drawer widgets): **"Digite o nome do widget..."**

### Labels
- Menu lateral: **"Menu"** (renomeado de "Navegação")
- Breadcrumb: **"Navegação > Modos de uso"**
- Aba do Menu: **"Painéis"**
- Botão listagem: **"+ Adicionar"**
- Ações da coluna: **Editar, Duplicar, Excluir**
- Colunas lista: **Nome, Descrição, Provedora, Data de criação, Ativo?, Ações**
- Filtros padrão: **Painéis próprios, Painéis compartilhados, Painéis ativos, Painéis inativos**
- Abas da tela de criação: **Identificação, Layouts**
- Aba inicial criada automaticamente: **"Nova aba"**
- Campos aba Identificação: **Nome, Descrição**
- Campo modal renomear/criar aba: **Nome da aba**
- Botão "Adicionar aba"
- Campo select modal: **Categoria** (opções: Aprendizagem)
- Opções de modelo de criação: **Criar nova aba, Importar de outro painel**
- Campo importação: **Painel de origem, Aba disponível, Nome da nova aba**
- Controles de visualização: **"Visualização: Desktop", "Visualização: Tablet", "Visualização: Mobile"**
- Switch de layout: **"Permitir reorganizar widgets"**
- Botões barra rodapé: **Cancelar, Salvar layout**
- Botão drawer widgets: **"+ Adicionar widget"**
- Título drawer: **"Widgets disponíveis"**
- Campo categorias drawer: opções **Todos, Aprendizagem**
- Campo pesquisa drawer: **"Buscar"**
- Ações ícones widget: **Editar (Lápis), Excluir (x)**
- Título drawer edição widget: **"Configurações do widget"**
- Campos drawer widget: **Mostrar título, Título, Mostrar ícone, Ícone**
- Modelo de página modo de uso: **"Painéis do usuário"**
- Campo modo de uso: **"Espaço"**

### Toast Messages (Sucesso)
- Renomear aba: **"Aba renomeada com sucesso"**
- Importar aba: **"Aba importada com sucesso"**
- Adicionar widget: **"Widget adicionado com sucesso"**
- Salvar configurações do widget: **"Configurações salvas com sucesso"**

### Toast Messages (Erro)
- Não há textos literais de erro explicitados no documento (validar via comportamento padrão do sistema).

### Modais (Título + Subtítulo + Botões)

| Modal | Título | Subtítulo | Campos | Ações |
|-------|--------|-----------|--------|-------|
| Renomear aba | "Renomear aba" | "Altere o nome da aba selecionada" | Nome da aba (input, até 255) | Cancelar, Renomear |
| Adicionar nova aba (seleção de tipo) | "Adicionar nova aba" | "Escolha como deseja criar a nova aba" | — | (seleção entre duas opções) |
| Adicionar nova aba (criar vazia) | "Adicionar nova aba" | "Crie uma nova aba vazia" | Nome da aba, Categoria | Voltar, Cancelar, Criar aba |
| Adicionar nova aba (importar) | "Adicionar nova aba" | "Importar de outro painel" | Painel de origem, Aba disponível, Nome da nova aba, Categoria | Voltar, Cancelar, Importar aba |
| Desativar painel associado a modo de uso | (modal informativo tipo créditos — textos literais não explicitados) | — | lista de menus que utilizam o painel | — |
| Painel inativo ao reativar modo de uso | (modal informativo — textos literais não explicitados) | — | — | — |

### Alertas / Estados vazios

| Contexto | Texto |
|----------|-------|
| Estado vazio da aba sem widgets (título) | "Nenhum widget adicionado" |
| Estado vazio da aba sem widgets (descrição) | 'Clique no botão "Adicionar Widget" para começar a montar sua tela personalizada' |
| Alerta Tablet | "Visualização (Tablet) — edição disponível no Desktop" |
| Alerta Mobile | "Visualização (Mobile) — edição disponível no Desktop" |

## 5. Campos e Validações

| Campo | Tipo | Obrigatório | Limite | Observações |
|-------|------|-------------|--------|-------------|
| Nome (aba Identificação) | input texto | Sim | 255 | — |
| Descrição (aba Identificação) | textarea | Não | 500 | — |
| Nome da aba (modal renomear) | input texto | Sim | 255 | — |
| Nome da aba (modal criar) | input texto | Sim | 255 | — |
| Categoria (modal criar/importar) | select | Sim | — | Opções: Aprendizagem |
| Painel de origem (modal importar) | select buscável | Sim | — | Lista painéis disponíveis |
| Aba disponível (modal importar) | select | Sim | — | Lista abas do painel; mostra "N widgets" |
| Nome da nova aba (modal importar) | input texto | Sim | 255 | Preenchido automaticamente |
| Categorias (drawer widgets) | multi select | Não | — | Opções: Todos, Aprendizagem |
| Buscar (drawer widgets) | input texto | Não | — | Placeholder "Digite o nome do widget..." |
| Mostrar título (drawer widget) | switch | — | — | — |
| Título (drawer widget) | input texto | — | 255 | — |
| Mostrar ícone (drawer widget) | switch | — | — | — |
| Ícone (drawer widget) | seletor ícones | — | — | Componente similar ao modo de uso |

## 6. Endpoints de API

- Documento Discovery não especifica endpoints. Validação será feita via comportamento da UI (persistência, reload, listagem).

## 7. Banco de Dados

- Novas tabelas serão criadas para painéis, abas e widgets (nomes específicos não documentados no Discovery).
- Tabelas devem ser incluídas na rotina de exclusão do **banco histórico** (Worker `HistoricBaseCron`).

## 8. Observações Adicionais

- Discovery menciona "OBS: o detalhamento dos widgets está no documento de discovery" — este documento é o próprio discovery; detalhamento interno dos widgets específicos (Ranking, Meus certificados etc.) não foi fornecido, portanto casos de teste cobrirão **adição/configuração do widget** e **exibição conforme layout**, sem validar internamente cada widget.
- Widgets **Ranking** e **Resumo de atividades** têm largura padrão diferente dos demais (os demais ocupam 6 colunas).
- A edição de layout é permitida **apenas no modo Desktop**; Tablet e Mobile são **somente visualização**.
- Painéis **compartilhados** (provedora externa) têm restrições: não podem ser editados nem excluídos.
- Não há planilha de quebra de atividades — suítes definidas a partir dos agrupamentos lógicos do Discovery.
