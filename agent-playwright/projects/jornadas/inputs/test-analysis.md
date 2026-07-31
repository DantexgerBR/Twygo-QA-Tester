---
contract_version: 1.1
at_version: 1
project: jornadas
project_name: "Jornadas"
generated_at: 2026-07-31T15:00:00-03:00
source_docs:
  - "docs/discovery.md"
  - "docs/spike.md"
  - "docs/documentacao-completa.md"
  - "docs/especificacao.docx"
  - "docs/regras.txt"
env: staging
prototypeUrl: "https://www.figma.com/make/gXnDK5r5aV0dBxLF2uK4To/Jornadas?p=f&fullscreen=1"
totals:
  suites: 24
  test_cases: 72
  steps: 124
---

# Análise de Teste — Jornadas

> Aviso: recon de protótipo pulado — MCP indisponível neste motor.

## Dados de teste

### Organizações
- `org: principal` — organização padrão com Jornadas habilitado.
- `org: secundario` — organização adicional sem vínculo com os dados da principal.

### Recursos
- `journeyNameFormat`: "Jornada TC{n} w{workerIndex}-{timestamp}"
- `phaseNameFormat`: "Fase TC{n} w{workerIndex}-{timestamp}"
- `taskNameFormat`: "Tarefa TC{n} w{workerIndex}-{timestamp}"
- `progressBands`: "0–25, 26–50, 51–75, 76–99, 100%"

## Textos literais

### Navegação e ações
- "Jornada Padrão"
- "Execuções"
- "Agenda"
- "Gerenciar"
- "Duplicar"
- "Excluir"
- "Adicionar"
- "Ações em massa"
- "Extrair dados"
- "Inscreva-se"
- "Acessar"
- "Iniciar"
- "Explorar pacote"
- "Marcar como realizada"
- "Reagendar"
- "Replanejar"

### Opções e estados
- "Em desenvolvimento"
- "Liberado"
- "Suspenso"
- "Encerrado"
- "Inscritos"
- "Colaborador"
- "Usuários"
- "Atrasadas"
- "Hoje"
- "Próximas"
- "Por usuários"
- "Por jornadas"

### Textos auxiliares
- "Esta fase será executada no Xº dia da jornada."
- "Esta fase será executada do Xº dia ao Xº dia da jornada."
- "Esta tarefa será executada no Xº dia da jornada."
- "Esta tarefa será executada do Xº dia ao Xº dia da jornada."
- "As mensagens desta tarefa serão definidas na seção Ações automáticas, onde você poderá configurar o envio de mensagens automáticas para os participantes da jornada."
- "Sobre o pacote: O pacote agrupa diversos conteúdos e permite que você escolha quais deseja realizar e em quais deseja se inscrever."

## Modais relevantes

### Tarefa de Aprendizagem
- **Quando aparece**: ao clicar em uma tarefa de Aprendizagem na visão do aluno
- **Campos exibidos**: tarefa, período, tipo, descrição, critério, progresso e conteúdos
- **Botões por conteúdo**: "Iniciar" para Curso/Trilha / "Explorar pacote" para Pacote
- **Texto do Pacote**: "Sobre o pacote: O pacote agrupa diversos conteúdos e permite que você escolha quais deseja realizar e em quais deseja se inscrever."

## Campos e validações

| Campo | Tipo | Obrigatório | Limite | Observações |
|---|---|---|---|---|
| Nome da jornada | texto | Sim | Não informado | Não aceitar vazio |
| Situação | dropdown | Sim | 4 opções | "Em desenvolvimento", "Liberado", "Suspenso", "Encerrado" |
| Quem pode ver | dropdown | Sim | 3 opções | "Inscritos", "Colaborador", "Usuários" |
| Duração | número | Sim | Positivo | Bloqueado com prolongamento ativo |
| Unidade | dropdown | Sim | 3 opções | dias, semanas e meses |
| Nome da fase | texto | Sim | Não informado | Não aceitar vazio |
| Nome da tarefa | texto | Sim | Não informado | Não aceitar vazio |
| Dia de início | número | Sim | Positivo | Valor ordinal |
| Progresso de conclusão | percentual | Condicional | 1–100 | Critério de Aprendizagem/Aprovação |
| Carga horária mínima | número | Condicional | 1–999 | Critério de Aprendizagem |
| Quantidade de conteúdos | número | Condicional | 1–999 | Critério de Aprendizagem |
| E-mail de contato | e-mail | Não informado | Formato de e-mail | Contato da jornada |
| Uploads de banner/anexo | arquivo | Condicional | Não informado | Validar extensão, MIME, tamanho e carregamento visual |

---
suite: Acesso ao módulo e navegação por perfil
executor: playwright
org: principal
playbooks: [super-admin, perfil-switch, flipper]
preconditions:
  - Funcionalidade Jornadas habilitada no contrato da organização
  - Eventual feature flag do módulo ativa
  - Usuários de teste disponíveis nos perfis Administrador, Gestor de Turma, Instrutor, Líder de Equipe e Aluno
---
# Acesso ao módulo e navegação por perfil

## TC1 — Acessar o módulo Jornadas como Administrador
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.1, 3.6]

### Objetivo
Validar o bloco próprio do módulo e a ordem canônica dos submenus.

### Passos
1. Acessar o menu "Jornadas"
   → Bloco "Jornadas" é exibido fora do bloco "Conteúdos".
2. Clicar no submenu "Jornada Padrão"
   → Submenus são exibidos nesta ordem: "Jornada Padrão", "Execuções" e "Agenda".

## TC2 — Restringir o módulo quando o add-on estiver desabilitado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.1]

### Objetivo
Validar o bloqueio contratual do módulo.

### Passos
1. Acessar o menu "Jornadas"
   → Submenus "Jornada Padrão", "Execuções" e "Agenda" não são exibidos.

## TC3 — Exibir navegação compatível com o perfil
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar visões distintas para Administrador, Gestor de Turma, Instrutor, Líder de Equipe e Aluno.

### Passos
1. Acessar o menu "Jornadas"
   → Itens permitidos ao perfil autenticado são exibidos e itens sem permissão não são exibidos.
2. Clicar no submenu "Agenda"
   → Conteúdo da "Agenda" exibe somente dados pertencentes ao escopo do perfil autenticado.

---
suite: Listagem e gestão de Jornadas Padrão
executor: playwright
org: principal
playbooks: [filtro-drawer, cleanup-dados, toast-chakra]
preconditions:
  - Usuário logado como Administrador
  - Jornadas com diferentes situações, tipos, classificações, inscrições e níveis de progresso cadastradas
  - Jornada sem engajamento e jornada com engajamento disponíveis para validar exclusão
---
# Listagem e gestão de Jornadas Padrão

## TC4 — Exibir dashboards, tabela e ações da listagem
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.2]

### Objetivo
Validar a composição principal da listagem.

### Passos
1. Clicar no submenu "Jornada Padrão"
   → Dashboards "Situação das Jornadas", "Distribuição dos Inscritos", "Tipo de Experiência" e "Classificação" são exibidos com quantidade e percentual.
2. Aguardar "Nome da jornada" ser exibido
   → Tabela exibe colunas "Nome da jornada", "Inscrições", "Progresso médio", "Situação", "Tipo de experiência" e "Classificação", sem coluna "teste".

## TC5 — Combinar busca e filtros com validações do campo "Situação"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.1, 3.2]
**Validation matrix**:
| Cenário | Campo | Categoria | Input | Esperado |
|---|---|---|---|---|
| Sem situação selecionada | Situação | A | "" | Dropdown "Situação" permanece sem seleção e a listagem não aplica esse critério |
| Valor documentado | Situação | A | "Liberado" | Dropdown "Situação" exibe "Liberado" e filtra a listagem |

### Objetivo
Validar busca nominal ao filtrar por situação e filtrar por tipo de experiência simultaneamente.

### Passos
1. Preencher o campo "Buscar" com "Jornada Liderança"
   → Listagem exibe somente jornadas cujo nome contém "Jornada Liderança".
2. Selecionar "Liberado" no dropdown "Situação"
   → Filtro "Situação" exibe "Liberado" e a listagem mantém somente jornadas liberadas.
3. Selecionar "Liderança" no dropdown "Tipo de experiência"
   → Listagem mantém somente jornadas chamadas "Jornada Liderança", liberadas e do tipo "Liderança".

## TC6 — Duplicar e proteger exclusão por engajamento
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.1, 3.2]

### Objetivo
Validar cópia sem inscrições e bloqueio de exclusão com histórico.

### Passos
1. Clicar no botão "Duplicar"
   → Nova linha exibe o nome da jornada original acrescido de "(cópia)" e o valor "0" na coluna "Inscrições".
2. Clicar no botão "Excluir"
   → A jornada com engajamento permanece exibida na tabela.

---
suite: Identificação da Jornada Padrão
executor: playwright
org: principal
playbooks: [switch-chakra, cleanup-dados, toast-chakra, beforeunload]
preconditions:
  - Usuário logado como Administrador com permissão para criar e editar jornadas
  - Tipos de experiência, classificações e categorias previamente cadastrados
---
# Identificação da Jornada Padrão

## TC7 — Cadastrar identificação válida
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.2]

### Objetivo
Validar o caminho feliz da identificação.

### Passos
1. Preencher o campo "Nome" com "Jornada de Liderança"
   → Campo "Nome" exibe "Jornada de Liderança".
2. Selecionar "Liberado" no dropdown "Situação"
   → Dropdown "Situação" exibe "Liberado".
3. Selecionar "Usuários" no dropdown "Quem pode ver"
   → Dropdown "Quem pode ver" exibe "Usuários".

## TC8 — Validar os campos "Nome da jornada", "Situação", "Quem pode ver", "Duração" e "Unidade"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.2]
**Validation matrix**:
| Cenário | Campo | Categoria | Input | Esperado |
|---|---|---|---|---|
| Nome vazio | Nome da jornada | A | "" | Campo "Nome" exibe estado de validação inválida e botão "Salvar" permanece desabilitado |
| Nome só com espaços | Nome da jornada | A | "   " | Campo "Nome" exibe estado de validação inválida e botão "Salvar" permanece desabilitado |
| Nome com um caractere | Nome da jornada | B | "J" | Campo "Nome" aceita "J" |
| Nome com acentos e emoji | Nome da jornada | C | "Jornada de Ações 🎯" | Campo "Nome" preserva acentos e emoji sem quebrar a codificação |
| Nome com script | Nome da jornada | D | "<script>alert(1)</script>" | Conteúdo é exibido escapado e nenhum alerta é executado |
| Situação vazia | Situação | A | "" | Dropdown "Situação" exibe estado de validação inválida e botão "Salvar" permanece desabilitado |
| Situação fora da lista | Situação | A | "Arquivado" | Opção "Arquivado" não é exibida no dropdown "Situação" |
| Visibilidade vazia | Quem pode ver | A | "" | Dropdown "Quem pode ver" exibe estado de validação inválida e botão "Salvar" permanece desabilitado |
| Visibilidade fora da lista | Quem pode ver | A | "Público" | Opção "Público" não é exibida no dropdown "Quem pode ver" |
| Duração vazia | Duração | A | "" | Campo "Duração" exibe estado de validação inválida |
| Duração mínima | Duração | B | "1" | Campo "Duração" aceita "1" |
| Duração zero | Duração | B | "0" | Campo "Duração" exibe estado de validação inválida |
| Duração textual | Duração | E | "abc" | Campo "Duração" rejeita texto e exibe estado de validação inválida |
| Unidade vazia | Unidade | A | "" | Dropdown "Unidade" exibe estado de validação inválida |
| Unidade fora da lista | Unidade | A | "horas" | Opção "horas" não é exibida no dropdown "Unidade" |

### Objetivo
Validar a obrigatoriedade do nome sem inventar mensagem não documentada.

### Passos
1. Preencher o campo "Nome" com " "
   → Campo "Nome" exibe estado de validação inválida e botão "Salvar" permanece desabilitado.

## TC9 — Recalcular duração pelo período das tarefas
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.2]

### Objetivo
Validar switch, bloqueio de campos e unidade do slider.

### Passos
1. Ativar o switch "Prolongar duração de acordo com o período das tarefas"
   → Campos "Duração" e "Unidade" ficam desabilitados.
2. Aguardar "Duração" ser exibido
   → Valor de "Duração" corresponde ao maior período configurado nas tarefas e o slider exibe a unidade selecionada.

---
suite: Acesso e regras de inscrição
executor: playwright
org: principal
playbooks: [switch-chakra, cleanup-dados, beforeunload]
preconditions:
  - Jornada Padrão em edição
  - Usuário logado como Administrador com permissão de alteração
  - Massa com períodos de vigência, grupos e regras de confirmação disponível
---
# Acesso e regras de inscrição

## TC10 — Configurar contato e vigência válidos
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.2]

### Objetivo
Validar os dados essenciais da aba Acesso.

### Passos
1. Clicar na aba "Acesso"
   → Campos de contato, inscrição, confirmação, grupos, vigência, restrição de horário e anexos são exibidos.
2. Preencher o campo "E-mail de contato" com "qa.jornadas@example.com"
   → Campo "E-mail de contato" exibe "qa.jornadas@example.com" sem estado de validação inválida.

## TC11 — Validar o campo "E-mail de contato"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.2]
**Validation matrix**:
| Cenário | Campo | Categoria | Input | Esperado |
|---|---|---|---|---|
| Vazio opcional | E-mail de contato | B | "" | Campo "E-mail de contato" aceita permanecer vazio |
| Formato válido | E-mail de contato | B | "qa.jornadas@example.com" | Campo "E-mail de contato" não exibe estado de validação inválida |
| Acentos | E-mail de contato | C | "ações@example.com" | Campo "E-mail de contato" rejeita formato não suportado sem quebrar a codificação |
| Script | E-mail de contato | D | "<script>@example.com" | Conteúdo não é executado e o campo exibe estado de validação inválida |
| Sem domínio | E-mail de contato | E | "email-invalido" | Campo "E-mail de contato" exibe estado de validação inválida |

### Objetivo
Validar formato do e-mail.

### Passos
1. Preencher o campo "E-mail de contato" com "email-invalido"
   → Campo "E-mail de contato" exibe estado de validação inválida.

## TC12 — Restringir inscrição fora do horário permitido
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.2]

### Objetivo
Validar a regra temporal de acesso à inscrição.

### Passos
1. Ativar o switch "Restringir acesso fora do horário"
   → Controles de período permitido ficam habilitados.
2. Acessar o link "Inscreva-se"
   → Botão "Inscreva-se" não é exibido fora do período configurado.

---
suite: Banners da Jornada Padrão
executor: playwright
org: principal
playbooks: [cleanup-dados, toast-chakra, beforeunload]
preconditions:
  - Jornada Padrão em edição e usuário Administrador autorizado
  - Arquivos de imagem válidos e inválidos disponíveis para os quatro formatos de banner
---
# Banners da Jornada Padrão

## TC13 — Enviar os quatro formatos de banner
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.2]

### Objetivo
Validar upload e renderização real dos banners.

### Passos
1. Clicar na aba "Banner"
   → Quatro campos de banner equivalentes aos formatos de Conteúdo são exibidos.
2. Fazer upload do arquivo "banner-valido.png" no campo "Banner"
   → Prévia do arquivo "banner-valido.png" exibe imagem carregada com largura natural maior que zero.

## TC14 — Validar o campo "Uploads de banner/anexo"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.2]
**Validation matrix**:
| Cenário | Campo | Categoria | Input | Esperado |
|---|---|---|---|---|
| Extensão executável | Uploads de banner/anexo | F | "banner.exe" | Campo "Banner" exibe estado de validação inválida e nenhuma prévia é exibida |
| Extensão dupla | Uploads de banner/anexo | F | "banner.png.exe" | Campo "Banner" rejeita o arquivo e nenhuma prévia é exibida |
| Sem extensão | Uploads de banner/anexo | F | "banner" | Campo "Banner" rejeita o arquivo e nenhuma prévia é exibida |
| Extensão em caixa alta | Uploads de banner/anexo | F | "banner.PNG" | Campo "Banner" aceita o arquivo quando o MIME real é de imagem |
| Executável renomeado | Uploads de banner/anexo | G | "executavel.png" | Campo "Banner" rejeita o MIME executável apesar da extensão ".png" |
| Arquivo vazio | Uploads de banner/anexo | G | "banner-vazio.png" | Campo "Banner" rejeita arquivo de 0 bytes e nenhuma prévia é exibida |
| Arquivo mínimo | Uploads de banner/anexo | H | "banner-minimo.png" | Campo "Banner" aceita o arquivo quando ele é uma imagem válida |
| Arquivo acima do limite configurado | Uploads de banner/anexo | H | "banner-acima-limite.png" | Campo "Banner" exibe estado de validação inválida e botão "Salvar" permanece desabilitado |

### Objetivo
Validar extensão e MIME inválidos.

### Passos
1. Fazer upload do arquivo "banner-invalido.txt" no campo "Banner"
   → Campo "Banner" exibe estado de validação inválida e nenhuma prévia de imagem é exibida.

## TC15 — Cancelar alteração de banner
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.2]

### Objetivo
Validar descarte de alteração não salva.

### Passos
1. Fazer upload do arquivo "banner-novo.png" no campo "Banner"
   → Prévia do arquivo "banner-novo.png" é exibida.
2. Clicar no botão "Cancelar"
   → Banner anteriormente salvo volta a ser exibido.

---
suite: Aprovação, certificado e recálculo
executor: playwright
org: principal
playbooks: [switch-chakra, cleanup-dados]
preconditions:
  - Jornada com tarefas e participantes em percentuais de progresso distintos
  - Modelos de certificado ativos disponíveis
  - Usuário Administrador com permissão de acompanhamento e emissão
---
# Aprovação, certificado e recálculo

## TC16 — Configurar critério de aprovação válido
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.2, 3.5]

### Objetivo
Validar o único critério percentual suportado.

### Passos
1. Clicar na aba "Aprovação"
   → Critério "Progresso maior ou igual a X%" é exibido.
2. Preencher o campo "Progresso" com "80"
   → Campo "Progresso" exibe "80" sem estado de validação inválida.

## TC17 — Validar os campos "Situação" e "Progresso de conclusão"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.2]
**Validation matrix**:
| Cenário | Campo | Categoria | Input | Esperado |
|---|---|---|---|---|
| Situação vazia | Situação | A | "" | Dropdown "Situação" permanece sem seleção e nenhum critério indevido é aplicado |
| Situação documentada | Situação | A | "Liberado" | Dropdown "Situação" exibe "Liberado" |
| Percentual mínimo | Progresso de conclusão | B | "1" | Campo "Progresso" aceita "1" |
| Percentual máximo | Progresso de conclusão | B | "100" | Campo "Progresso" aceita "100" |
| Abaixo do mínimo | Progresso de conclusão | B | "0" | Campo "Progresso" exibe estado de validação inválida |
| Acima do máximo | Progresso de conclusão | B | "101" | Campo "Progresso" exibe estado de validação inválida |
| Tipo textual | Progresso de conclusão | E | "abc" | Campo "Progresso" rejeita texto e exibe estado de validação inválida |

### Objetivo
Validar os limites do percentual.

### Passos
1. Preencher o campo "Progresso" com "101"
   → Campo "Progresso" exibe estado de validação inválida e botão "Salvar" permanece desabilitado.

## TC18 — Emitir certificado somente após aprovação
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.5]

### Objetivo
Validar elegibilidade e estados de certificado.

### Passos
1. Clicar no botão "Emitir certificado"
   → Participante não aprovado mantém certificado com situação "Pendente".
2. Clicar no botão "Recalcular progresso"
   → Participante elegível exibe aprovação e certificado disponível para emissão.

---
suite: Time, papéis e permissões da jornada
executor: playwright
org: principal
playbooks: [perfil-switch, cleanup-dados]
preconditions:
  - Jornada Padrão em edição
  - Papéis padrão e personalizados cadastrados
  - Pessoas elegíveis para vínculos fixos e dinâmicos disponíveis
---
# Time, papéis e permissões da jornada

## TC19 — Adicionar vínculo fixo ao Time
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.3]

### Objetivo
Validar criação de membro fixo.

### Passos
1. Clicar na aba "Time"
   → Tabela exibe colunas "Papel", "Rótulo", "Tipo de vínculo", "Pessoa vinculada" e "Permissões".
2. Selecionar "Fixo na jornada" no dropdown "Tipo de vínculo"
   → Campo "Pessoa vinculada" fica habilitado.

## TC20 — Configurar responsável definido na inscrição
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.3, 3.4]

### Objetivo
Validar vínculo dinâmico.

### Passos
1. Selecionar "Definido na inscrição" no dropdown "Tipo de vínculo"
   → Campo "Pessoa vinculada" não exige pessoa fixa e o papel passa a ser solicitado na inscrição.

## TC21 — Preservar permissões herdadas
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.3, 3.6]

### Objetivo
Validar herança e adição de permissão local.

### Passos
1. Clicar no botão "Editar"
   → Permissões herdadas aparecem marcadas e desabilitadas.
2. Marcar "Reagendar"
   → Permissão adicional "Reagendar" fica marcada sem desmarcar permissões herdadas.

---
suite: Cronograma em Kanban
executor: playwright
org: principal
playbooks: [cleanup-dados, beforeunload]
preconditions:
  - Jornada Padrão em edição com duração configurada
  - Massa com cronograma vazio, cronograma extenso e cronograma com engajamento disponível
---
# Cronograma em Kanban

## TC22 — Exibir cronograma ordinal em Kanban
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.3]

### Objetivo
Validar colunas necessárias, cards e separadores.

### Passos
1. Clicar na aba "Cronograma"
   → Kanban inicia no primeiro dia e exibe somente colunas necessárias ao início e término cadastrados.
2. Aguardar "1º dia" ser exibido
   → Cards de fase exibem nome e período; cards de tarefa exibem nome, tipo e quantidade de ações.

## TC23 — Navegar em cronograma extenso
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.3]

### Objetivo
Validar scroll lateral e separadores semanais.

### Passos
1. Acessar a URL "/o/{org}/jornadas/cronograma"
   → Cronograma extenso exibe scroll lateral e separadores semanais sem sobrepor cards.

## TC24 — Proteger exclusão com engajamento
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.1, 3.3]

### Objetivo
Validar integridade histórica do cronograma.

### Passos
1. Clicar no botão "Excluir"
   → Card com engajamento atual ou histórico permanece exibido no Kanban.

---
suite: Cadastro de fases
executor: playwright
org: principal
playbooks: [cleanup-dados, toast-chakra, beforeunload]
preconditions:
  - Jornada Padrão com aba Cronograma acessível
  - Usuário Administrador com permissão de alteração do cronograma
---
# Cadastro de fases

## TC25 — Cadastrar fase de um dia
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.3]

### Objetivo
Validar cálculo e texto singular.

### Passos
1. Preencher o campo "Nome" com "Integração"
   → Campo "Nome" exibe "Integração".
2. Preencher o campo "Dia de início" com "2"
   → Texto auxiliar exibido: "Esta fase será executada no 2º dia da jornada.".

## TC26 — Cadastrar fase com intervalo
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.3]

### Objetivo
Validar término calculado e bloqueado.

### Passos
1. Preencher o campo "Duração" com "3"
   → Campo "Dia de término" exibe valor calculado e permanece desabilitado.
2. Aguardar "Esta fase será executada do 2º dia ao 4º dia da jornada." ser exibido
   → Texto auxiliar exibido: "Esta fase será executada do 2º dia ao 4º dia da jornada.".

## TC27 — Validar os campos "Nome da fase" e "Dia de início"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.3]
**Validation matrix**:
| Cenário | Campo | Categoria | Input | Esperado |
|---|---|---|---|---|
| Nome vazio | Nome da fase | A | "" | Campo "Nome" exibe estado de validação inválida |
| Nome só com espaços | Nome da fase | A | "   " | Campo "Nome" exibe estado de validação inválida |
| Nome com um caractere | Nome da fase | B | "F" | Campo "Nome" aceita "F" |
| Nome com acentos e emoji | Nome da fase | C | "Integração 🎯" | Campo "Nome" preserva acentos e emoji sem quebrar a codificação |
| Nome com script | Nome da fase | D | "<script>alert(1)</script>" | Conteúdo é exibido escapado e nenhum alerta é executado |
| Dia vazio | Dia de início | A | "" | Campo "Dia de início" exibe estado de validação inválida |
| Primeiro dia | Dia de início | B | "1" | Campo "Dia de início" aceita "1" |
| Dia zero | Dia de início | B | "0" | Campo "Dia de início" exibe estado de validação inválida |
| Dia negativo | Dia de início | E | "-1" | Campo "Dia de início" exibe estado de validação inválida |
| Dia textual | Dia de início | E | "abc" | Campo "Dia de início" rejeita texto e exibe estado de validação inválida |

### Objetivo
Validar obrigatoriedade e limite ordinal positivo.

### Passos
1. Preencher o campo "Nome" com " "
   → Campo "Nome" exibe estado de validação inválida.
2. Preencher o campo "Dia de início" com "0"
   → Campo "Dia de início" exibe estado de validação inválida e botão "Salvar" permanece desabilitado.

---
suite: Cadastro de tarefas
executor: playwright
org: principal
playbooks: [cleanup-dados, toast-chakra, beforeunload]
preconditions:
  - Jornada com e sem fases cadastradas
  - Conteúdos, categorias, tipos de experiência e classificações disponíveis
  - Papéis do Time disponíveis como envolvidos
---
# Cadastro de tarefas

## TC28 — Cadastrar tarefa de Aprendizagem
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.3]

### Objetivo
Validar critérios e envolvidos da aprendizagem.

### Passos
1. Selecionar "Aprendizagem" no dropdown "Tipo"
   → Critérios "Progresso", "Carga horária" e "Quantidade de conteúdos" são exibidos.
2. Preencher o campo "Progresso" com "100"
   → Campo "Progresso" exibe "100" sem estado de validação inválida.

## TC29 — Validar tipos Compromisso, Manual e Mensagem
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.3]

### Objetivo
Validar campos específicos dos tipos não aprendizagem.

### Passos
1. Selecionar "Compromisso" no dropdown "Tipo"
   → Campos "Descrição" e "Local/link" são exibidos sem opção de integração "Teams".
2. Selecionar "Mensagem" no dropdown "Tipo"
   → Texto auxiliar exibido: "As mensagens desta tarefa serão definidas na seção Ações automáticas, onde você poderá configurar o envio de mensagens automáticas para os participantes da jornada.".

## TC30 — Validar os campos "Nome da tarefa", "Progresso de conclusão", "Carga horária mínima" e "Quantidade de conteúdos"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.3]
**Validation matrix**:
| Cenário | Campo | Categoria | Input | Esperado |
|---|---|---|---|---|
| Nome vazio | Nome da tarefa | A | "" | Campo "Nome" exibe estado de validação inválida |
| Nome só com espaços | Nome da tarefa | A | "   " | Campo "Nome" exibe estado de validação inválida |
| Nome com um caractere | Nome da tarefa | B | "T" | Campo "Nome" aceita "T" |
| Nome com acentos e emoji | Nome da tarefa | C | "Ação 🎯" | Campo "Nome" preserva acentos e emoji sem quebrar a codificação |
| Nome com SQL injection | Nome da tarefa | D | "'; DROP TABLE tasks;--" | Conteúdo permanece sem efeito SQL e é exibido escapado |
| Progresso mínimo | Progresso de conclusão | B | "1" | Campo "Progresso" aceita "1" |
| Progresso máximo | Progresso de conclusão | B | "100" | Campo "Progresso" aceita "100" |
| Progresso fora do limite | Progresso de conclusão | B | "101" | Campo "Progresso" exibe estado de validação inválida |
| Progresso textual | Progresso de conclusão | E | "abc" | Campo "Progresso" rejeita texto |
| Carga horária mínima | Carga horária mínima | B | "1" | Campo "Carga horária" aceita "1" |
| Carga horária máxima | Carga horária mínima | B | "999" | Campo "Carga horária" aceita "999" |
| Carga horária acima do limite | Carga horária mínima | B | "1000" | Campo "Carga horária" exibe estado de validação inválida |
| Carga horária textual | Carga horária mínima | E | "abc" | Campo "Carga horária" rejeita texto |
| Quantidade mínima | Quantidade de conteúdos | B | "1" | Campo "Quantidade de conteúdos" aceita "1" |
| Quantidade máxima | Quantidade de conteúdos | B | "999" | Campo "Quantidade de conteúdos" aceita "999" |
| Quantidade acima do limite | Quantidade de conteúdos | B | "1000" | Campo "Quantidade de conteúdos" exibe estado de validação inválida |
| Quantidade textual | Quantidade de conteúdos | E | "abc" | Campo "Quantidade de conteúdos" rejeita texto |

### Objetivo
Validar limites 1–100 e 1–999.

### Passos
1. Preencher o campo "Progresso" com "0"
   → Campo "Progresso" exibe estado de validação inválida.
2. Preencher o campo "Quantidade de conteúdos" com "1000"
   → Campo "Quantidade de conteúdos" exibe estado de validação inválida e botão "Salvar" permanece desabilitado.

---
suite: Ações automáticas
executor: playwright
org: principal
playbooks: [cleanup-dados]
preconditions:
  - Tarefas dos quatro tipos disponíveis para edição
  - Modelos de e-mail, remetentes e conteúdos elegíveis cadastrados
  - Infraestrutura de e-mail e notificações habilitada no ambiente
---
# Ações automáticas

## TC31 — Configurar ação de E-mail
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.4]

### Objetivo
Validar campos e uso de modelo.

### Passos
1. Clicar no botão "E-mail"
   → Drawer exibe "Idioma", "Modelo", "Remetente", "Assunto", "Conteúdo", "Enviar e-mail teste", "Salvar" e "Cancelar".
2. Clicar no botão "Usar este modelo"
   → Campos "Assunto" e "Conteúdo" exibem os valores do modelo selecionado.

## TC32 — Configurar ação de Notificação
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.4]

### Objetivo
Validar idiomas e campos da notificação.

### Passos
1. Clicar no botão "Notificação"
   → Drawer exibe "Idioma", "Título", "Conteúdo", "Link", "Salvar" e "Cancelar".
2. Selecionar "espanhol" no dropdown "Idioma"
   → Dropdown "Idioma" exibe "espanhol".

## TC33 — Restringir ações do tipo Mensagem
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.4]

### Objetivo
Validar que Mensagem não inscreve em conteúdo.

### Passos
1. Selecionar "Mensagem" no dropdown "Tipo"
   → Ações "E-mail" e "Notificação" são exibidas e ação "Inscrição em conteúdo" não é exibida.

---
suite: Inscrições da Jornada Padrão
executor: playwright
org: principal
playbooks: [filtro-drawer, cleanup-dados, toast-chakra]
preconditions:
  - Jornada configurada com papéis de vínculo definido na inscrição
  - Participantes nas situações Confirmada, Pendente, Cancelada e Desistente disponíveis
  - Usuário Administrador com permissão de gerenciar inscrições
---
# Inscrições da Jornada Padrão

## TC34 — Cadastrar inscrição e validar o campo "Situação"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.4]
**Validation matrix**:
| Cenário | Campo | Categoria | Input | Esperado |
|---|---|---|---|---|
| Situação vazia | Situação | A | "" | Dropdown "Situação" exibe estado de validação inválida e botão "Salvar" permanece desabilitado |
| Situação válida | Situação | A | "Confirmada" | Dropdown "Situação" exibe "Confirmada" |

### Objetivo
Validar campos de inscrição e responsáveis do Time.

### Passos
1. Clicar no botão "Adicionar"
   → Formulário exibe "Participante", "Dia de início", "Etiqueta", "Situação", "Expiração" e responsáveis definidos no Time.
2. Selecionar "Confirmada" no dropdown "Situação"
   → Dropdown "Situação" exibe "Confirmada".

## TC35 — Combinar busca e filtros de inscrição
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.4]

### Objetivo
Validar busca multifonte ao filtrar por situação e filtrar por etiqueta simultaneamente.

### Passos
1. Preencher o campo "Buscar" com "aluno@example.com"
   → Tabela exibe somente participante com e-mail "aluno@example.com".
2. Selecionar "Confirmados" no dropdown "Situação"
   → Filtro "Situação" exibe "Confirmados".
3. Selecionar "Onboarding" no dropdown "Etiqueta"
   → Tabela mantém somente inscrições confirmadas com etiqueta "Onboarding" para o participante buscado.

## TC36 — Executar alterações em massa
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.4]

### Objetivo
Validar ações em massa suportadas.

### Passos
1. Clicar no botão "Ações em massa"
   → Opções de alterar situação, recalcular progresso e alterar etiqueta são exibidas.
2. Clicar no botão "Recalcular progresso"
   → Coluna "Progresso" exibe valores recalculados para as inscrições selecionadas.

---
suite: Listagem e acompanhamento de execuções
executor: playwright
org: principal
playbooks: [filtro-drawer, cleanup-dados]
preconditions:
  - Execuções em todas as situações e faixas de progresso disponíveis
  - Participantes aprovados e não aprovados com certificados pendentes, emitidos, expirados e aguardando assinatura
  - Usuário Administrador com acesso completo às execuções
---
# Listagem e acompanhamento de execuções

## TC37 — Exibir dashboards e faixas de progresso
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.5]

### Objetivo
Validar indicadores e distribuição.

### Passos
1. Clicar no submenu "Execuções"
   → Dashboards "Total de execuções", "Em andamento", "Situação das execuções" e "Distribuição do progresso" são exibidos.
2. Aguardar "Distribuição do progresso" ser exibido
   → Faixas "0–25", "26–50", "51–75", "76–99" e "100%" são exibidas.

## TC38 — Combinar busca e filtros de execução com validações do campo "Situação"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.5]
**Validation matrix**:
| Cenário | Campo | Categoria | Input | Esperado |
|---|---|---|---|---|
| Situação vazia | Situação | A | "" | Dropdown "Situação das tarefas" permanece sem seleção e não aplica esse critério |
| Situação válida | Situação | A | "Com atraso" | Dropdown "Situação das tarefas" exibe "Com atraso" |

### Objetivo
Validar atualização conjunta ao filtrar por situação das tarefas e filtrar por aprovação com busca textual.

### Passos
1. Preencher o campo "Buscar" com "Ana QA"
   → Tabela exibe somente execuções relacionadas a "Ana QA".
2. Selecionar "Com atraso" no dropdown "Situação das tarefas"
   → Filtro "Situação das tarefas" exibe "Com atraso".
3. Selecionar "Aprovado" no dropdown "Aprovação"
   → Tabela e dashboards exibem somente execuções atrasadas e aprovadas de "Ana QA".

## TC39 — Validar estados e emissão de certificado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.5]

### Objetivo
Validar estados documentados e elegibilidade.

### Passos
1. Aguardar "Certificado" ser exibido
   → Coluna "Certificado" contém estados "Pendente", "Emitido", "Expirado" ou "Aguardando assinatura".
2. Clicar no botão "Emitir certificado"
   → Ação de emissão fica disponível somente na linha de participante aprovado.

---
suite: Detalhe da execução e auditoria
executor: playwright
org: principal
playbooks: [filtro-drawer]
preconditions:
  - Execução com histórico de ações manuais e automáticas disponível
  - Log contém ações realizadas por usuário, terceiro e Sistema
  - Usuário Administrador com permissão de visualizar detalhes
---
# Detalhe da execução e auditoria

## TC40 — Exibir resumo da execução
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.5]

### Objetivo
Validar cabeçalho e indicadores.

### Passos
1. Clicar no botão "Gerenciar"
   → Detalhe exibe membros do time com papel, progresso geral, tarefas concluídas no formato "X/Y", ações disparadas e última atividade.

## TC41 — Exibir log completo em ordem decrescente
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.5]

### Objetivo
Validar eventos e colunas de auditoria ao filtrar por tipo de ação, filtrar por responsável e realizar busca textual.

### Passos
1. Clicar na aba "Log"
   → Tabela exibe colunas "Ação", "Descrição", "Tipo de ação", "Realizada por", "Realizada em" e "IP" ordenadas do registro mais recente ao mais antigo.
2. Aguardar "Sistema" ser exibido
   → Ação automática exibe "Sistema" em "Realizada por" e "–" em "IP".
3. Preencher o campo "Buscar" com "Certificado emitido"
   → Tabela exibe registros cuja descrição contém "Certificado emitido".
4. Selecionar "Certificado emitido" no dropdown "Tipo de ação"
   → Filtro "Tipo de ação" exibe "Certificado emitido".
5. Selecionar "Sistema" no dropdown "Realizada por"
   → Tabela exibe somente registros de certificado emitido realizados por "Sistema" que correspondem à busca.

## TC42 — Restringir detalhe sem permissão
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar autorização do detalhe.

### Passos
1. Acessar a URL "/o/{org}/jornadas/execucoes/{execucaoId}"
   → Dados da execução não são exibidos ao usuário sem permissão de visualização.

---
suite: Agenda de tarefas
executor: playwright
org: principal
playbooks: [filtro-drawer]
preconditions:
  - Tarefas passadas, atuais e futuras em múltiplas jornadas e execuções disponíveis
  - Massa com tarefas repetidas para validar agrupamento
  - Usuário Administrador com acesso à Agenda
---
# Agenda de tarefas

## TC43 — Alternar modos da Agenda
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.5]

### Objetivo
Validar modos e limites do calendário.

### Passos
1. Clicar no submenu "Agenda"
   → Modos "Por usuários" e "Por jornadas" são exibidos e botão "Extrair dados" não é exibido.
2. Clicar na aba "Por jornadas"
   → Calendário inicia no dia atual e se limita ao período que contém tarefas.

## TC44 — Combinar busca e filtros da Agenda com validações do campo "Situação"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.5]
**Validation matrix**:
| Cenário | Campo | Categoria | Input | Esperado |
|---|---|---|---|---|
| Situação vazia | Situação | A | "" | Dropdown "Situação" permanece sem seleção e não aplica esse critério |
| Situação válida | Situação | A | "Pendente" | Dropdown "Situação" exibe "Pendente" |

### Objetivo
Validar busca ao filtrar por jornada e filtrar por período sem seção de colunas.

### Passos
1. Preencher o campo "Buscar" com "Tarefa Mentoria"
   → Calendário exibe somente itens relacionados a "Tarefa Mentoria".
2. Selecionar "Jornada Liderança" no dropdown "Jornada"
   → Filtro "Jornada" exibe "Jornada Liderança".
3. Selecionar "Hoje" no dropdown "Período"
   → Calendário exibe tarefas de hoje da "Jornada Liderança" relacionadas à busca e não exibe seção "Colunas".

## TC45 — Agrupar tarefas repetidas
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.5]

### Objetivo
Validar agrupamento por dia, situação e usuários.

### Passos
1. Aguardar "Tarefa Mentoria" ser exibido
   → Tarefas repetidas no mesmo dia e situação aparecem agrupadas com a quantidade de usuários.

---
suite: Papéis e Permissões customizados
executor: playwright
org: principal
playbooks: [cleanup-dados]
preconditions:
  - Usuário logado como Administrador com acesso ao módulo auxiliar
  - Papéis padrão e ao menos um papel personalizado cadastrados
  - Catálogo de permissões de Jornada disponível
---
# Papéis e Permissões customizados

## TC46 — Visualizar papéis padrão sem edição
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar imutabilidade dos papéis padrão.

### Passos
1. Clicar no link "Administrador"
   → Papel padrão "Administrador" é exibido e botão "Salvar" não é exibido.

## TC47 — Criar papel personalizado por herança
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar herança obrigatória e permissões adicionais.

### Passos
1. Clicar no botão "Adicionar"
   → Campo "Papel padrão" é exibido como obrigatório.
2. Selecionar "Instrutor" no dropdown "Papel padrão"
   → Permissões herdadas de "Instrutor" aparecem marcadas e desabilitadas.

## TC48 — Impedir remoção de permissão herdada
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar que personalizados apenas adicionam permissões.

### Passos
1. Desmarcar "Visualizar jornada"
   → Permissão herdada "Visualizar jornada" permanece marcada.

---
suite: Escopo de Gestor de Turma e Instrutor
executor: playwright
org: principal
playbooks: [perfil-switch]
preconditions:
  - Gestor de Turma e Instrutor vinculados a algumas jornadas e não vinculados a outras
  - Permissões globais e locais configuradas em combinações distintas
---
# Escopo de Gestor de Turma e Instrutor

## TC49 — Limitar Gestor de Turma às jornadas vinculadas
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar escopo por vínculo.

### Passos
1. Clicar no submenu "Jornada Padrão"
   → Tabela exibe jornadas vinculadas ao Gestor de Turma e não exibe jornadas sem vínculo.

## TC50 — Combinar permissões globais e locais do Instrutor
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar a interseção de permissões.

### Passos
1. Clicar no botão "Gerenciar"
   → Instrutor visualiza a jornada vinculada e somente ações permitidas global e localmente ficam habilitadas.

## TC51 — Bloquear URL de jornada não vinculada
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar tentativa de acesso direto fora do escopo.

### Passos
1. Acessar a URL "/o/{org}/jornadas/{jornadaNaoVinculadaId}"
   → Dados da jornada não vinculada não são exibidos.

---
suite: Escopo do Líder de Equipe
executor: playwright
org: principal
playbooks: [perfil-switch]
preconditions:
  - Líder de Equipe com pessoas lideradas e usuários fora de sua equipe
  - Execuções e tarefas de Agenda existentes para ambos os grupos
---
# Escopo do Líder de Equipe

## TC52 — Exibir somente Execuções das pessoas lideradas
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar isolamento do escopo do líder.

### Passos
1. Clicar no submenu "Execuções"
   → Tabela exibe participantes liderados e não exibe usuários fora da equipe.

## TC53 — Exibir somente Agenda das pessoas lideradas
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar o mesmo escopo no calendário.

### Passos
1. Clicar no submenu "Agenda"
   → Calendário exibe tarefas das pessoas lideradas e não exibe tarefas de usuários fora da equipe.

## TC54 — Bloquear dados fora da equipe por URL direta
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar autorização além do filtro visual.

### Passos
1. Acessar a URL "/o/{org}/jornadas/execucoes/{execucaoForaDaEquipeId}"
   → Dados da execução fora da equipe não são exibidos.

---
suite: Jornada no catálogo Play
executor: playwright
org: principal
playbooks: [perfil-switch]
preconditions:
  - Usuário logado como Aluno
  - Jornadas visíveis com aluno inscrito e não inscrito, banners e metadados preenchidos
---
# Jornada no catálogo Play

## TC55 — Exibir card resumido e detalhado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar catálogo e metadados.

### Passos
1. Acessar a URL "/play"
   → Card resumido de jornada exibe tipo de experiência, nome e banner carregado.
2. Clicar no link "Jornada de Liderança"
   → Card detalhado exibe abas "Detalhes" e "Cronograma", metadados e lista não acionável de tarefas.

## TC56 — Inscrever aluno em jornada
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar transição do CTA.

### Passos
1. Clicar no botão "Inscreva-se"
   → Botão "Acessar" é exibido após a inscrição.

## TC57 — Restringir jornada e validar o campo "Quem pode ver"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.2, 3.6]
**Validation matrix**:
| Cenário | Campo | Categoria | Input | Esperado |
|---|---|---|---|---|
| Visibilidade vazia | Quem pode ver | A | "" | Dropdown "Quem pode ver" exibe estado de validação inválida e botão "Salvar" permanece desabilitado |
| Visibilidade de inscritos | Quem pode ver | A | "Inscritos" | Jornada é exibida no Play somente para aluno inscrito |
| Valor fora da lista | Quem pode ver | A | "Público" | Opção "Público" não é exibida no dropdown "Quem pode ver" |

### Objetivo
Validar regra "Quem pode ver".

### Passos
1. Acessar a URL "/play/jornadas/{jornadaRestritaId}"
   → Card da jornada restrita não é exibido ao aluno fora do público permitido.

---
suite: Página interna da jornada do aluno
executor: playwright
org: principal
playbooks: [perfil-switch]
preconditions:
  - Aluno inscrito em jornada com execução iniciada
  - Jornada contém banner e tarefas distribuídas em diferentes datas
---
# Página interna da jornada do aluno

## TC58 — Carregar página interna da jornada
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar loading, banner e calendário.

### Passos
1. Clicar no botão "Acessar"
   → Indicador de carregamento é exibido até os dados da execução serem carregados.
2. Aguardar "Calendário" ser exibido
   → Banner da jornada exibe imagem carregada e calendário exibe tarefas nas datas da execução.

## TC59 — Exibir estado vazio sem tarefas no período
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar período sem tarefas sem inventar mensagem.

### Passos
1. Clicar no botão "Próximo período"
   → Calendário exibe zero cards de tarefa no período sem tarefas.

## TC60 — Impedir acesso sem inscrição
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar acesso apenas à execução do aluno.

### Passos
1. Acessar a URL "/play/jornadas/{jornadaSemInscricaoId}"
   → Página interna e dados da execução não são exibidos.

---
suite: Interação do aluno com tarefas
executor: playwright
org: principal
playbooks: [perfil-switch, cleanup-dados]
preconditions:
  - Aluno inscrito em jornada com tarefas de Aprendizagem, Compromisso, Manual e Mensagem
  - Massa contém Curso, Trilha e Pacote, incluindo conteúdo concluído previamente
  - Há tarefas com e sem permissão de reagendamento
---
# Interação do aluno com tarefas

## TC61 — Executar tarefa de Aprendizagem
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar modal, critérios e CTA por tipo de conteúdo.

### Passos
1. Clicar no link "Tarefa de Aprendizagem"
   → Modal exibe tarefa, período, tipo, descrição, critério, progresso e conteúdos.
2. Clicar no botão "Iniciar"
   → Primeiro Curso ou Trilha ainda não concluído é aberto.

## TC62 — Explorar Pacote e contabilizar conteúdo concluído
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar texto literal e progresso do pacote.

### Passos
1. Clicar no botão "Explorar pacote"
   → Texto exibido: "Sobre o pacote: O pacote agrupa diversos conteúdos e permite que você escolha quais deseja realizar e em quais deseja se inscrever.".
2. Aguardar "Progresso" ser exibido
   → Progresso inclui conteúdos concluídos antes do início da execução.

## TC63 — Concluir, reagendar e restringir tarefas
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6, 3.7]

### Objetivo
Validar estados sem "Em andamento" e permissões de reagendamento.

### Passos
1. Clicar no botão "Marcar como realizada"
   → Tarefa Manual ou Compromisso passa de "Pendente" ou "Atrasada" para "Concluída" sem estado "Em andamento".
2. Clicar no botão "Reagendar"
   → Controle "Reagendar" é exibido somente para tarefa e usuário autorizados; tarefa Mensagem permanece apenas informativa.

---
suite: Widgets de Tarefas e Calendário
executor: playwright
org: principal
playbooks: [perfil-switch]
preconditions:
  - Projeto de Painéis Personalizados/Widgets disponível e integrado a Jornadas
  - Painel do Aluno configurado com widgets de Tarefas e Calendário
  - Aluno possui tarefas atrasadas, de hoje e futuras, próprias e de terceiros
---
# Widgets de Tarefas e Calendário

## TC64 — Agrupar tarefas do aluno no widget
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar agrupamentos e autoria.

### Passos
1. Acessar a URL "/play/painel"
   → Widget "Tarefas" exibe grupos "Atrasadas", "Hoje" e "Próximas".
2. Clicar na aba "Hoje"
   → Lista exibe somente tarefas de hoje atribuídas ao aluno autenticado.

## TC65 — Reutilizar Agenda no widget Calendário
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar consistência entre os dois consumidores.

### Passos
1. Aguardar "Calendário" ser exibido
   → Widget "Calendário" exibe as mesmas tarefas e datas da Agenda do aluno.

## TC66 — Ocultar tarefas de terceiros
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.6]

### Objetivo
Validar privacidade do painel.

### Passos
1. Preencher o campo "Buscar" com "Tarefa de Terceiro"
   → Widgets "Tarefas" e "Calendário" exibem zero cards chamados "Tarefa de Terceiro".

---
suite: Linha de base, reagendamento e replanejamento
executor: playwright
org: principal
playbooks: [cleanup-dados]
preconditions:
  - Jornada Padrão com fases, tarefas, ações automáticas e time configurados
  - Execuções iniciadas em datas distintas, incluindo uma anterior a alterações na Jornada Padrão
  - Usuários com e sem permissões de reagendar e replanejar disponíveis
---
# Linha de base, reagendamento e replanejamento

## TC67 — Criar snapshot independente ao iniciar execução
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.1, 3.7]

### Objetivo
Validar cópia de fases, tarefas, ações, envolvidos e conversão de dias.

### Passos
1. Clicar no botão "Iniciar execução"
   → Execução exibe fases, tarefas, ações e envolvidos copiados com datas reais calculadas pelo dia inicial.
2. Clicar no botão "Salvar" da Jornada Padrão
   → Execução iniciada mantém a linha de base anterior e nova execução recebe a configuração atualizada.

## TC68 — Reagendar sem alterar data prevista
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.7]

### Objetivo
Validar separação entre datas prevista e efetiva.

### Passos
1. Clicar no botão "Reagendar"
   → Campo "Data efetiva" é alterável e campo "Data prevista" mantém o valor original.
2. Clicar no botão "Salvar"
   → Execução exibe a nova data efetiva e preserva indicador de atraso quando aplicável.

## TC69 — Replanejar somente com permissão
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.7]

### Objetivo
Validar alteração da linha de base e autorização.

### Passos
1. Clicar no botão "Replanejar"
   → Usuário autorizado altera a data prevista e indicador de atraso é recalculado.
2. Acessar a URL "/o/{org}/jornadas/execucoes/{execucaoId}/replanejar"
   → Controles de replanejamento não são exibidos ao usuário sem permissão.

---
suite: Isolamento entre organizações
executor: playwright
org: secundario
playbooks: [ambientes-adicionais, perfil-switch]
preconditions:
  - Jornadas habilitado em DUAS organizações (a principal e a secundária)
  - Qual org faz o papel de secundária NÃO é fixada aqui; o QA escolhe o profile e informa credenciais em organizações adicionais
  - Jornada, execuções, inscrições e tarefas existentes em cada uma das duas orgs, com nomes distinguíveis
  - Usuário da org secundária SEM nenhum vínculo com os dados da principal
---
# Isolamento entre organizações

## TC70 — Isolar Jornadas Padrão entre organizações
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.7]

### Objetivo
Validar isolamento multi-tenant da listagem.

### Passos
1. Clicar no submenu "Jornada Padrão"
   → Organização secundária exibe "Jornada Secundária" e não exibe "Jornada Principal".

## TC71 — Isolar execuções e inscrições
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.7]

### Objetivo
Validar isolamento dos dados derivados.

### Passos
1. Clicar no submenu "Execuções"
   → Tabela exibe execuções da organização secundária e não exibe execuções da organização principal.
2. Clicar na aba "Inscrição"
   → Tabela exibe inscrições da organização secundária e não exibe participantes exclusivos da organização principal.

## TC72 — Bloquear acesso direto a tarefa de outra organização
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3.7]

### Objetivo
Validar isolamento por autorização além das listagens.

### Passos
1. Acessar a URL "/o/{orgSecundaria}/jornadas/tarefas/{tarefaDaOrgPrincipalId}"
   → Dados da tarefa da organização principal não são exibidos na organização secundária.
