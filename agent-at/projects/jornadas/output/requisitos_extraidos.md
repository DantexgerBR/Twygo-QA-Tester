# Requisitos Extraídos - Jornadas

## 1. Informações Gerais

- Tipo de projeto: Misto (UI funcional, regras de autorização/contrato, persistência e processamento assíncrono).
- Objetivo: disponibilizar o módulo Jornadas como add-on reutilizável para onboarding, mentoria, integração, carreira e liderança, separando Jornada Padrão (template/linha de base) da Execução individual iniciada para cada participante.
- Documentos lidos integralmente: `discovery.md`, `spike.md`, `documentacao-completa.md`, `especificacao.docx` e `regras.txt`.
- Planilha de quebra de atividades: não fornecida.
- Protótipo: configurado no Figma; recon de protótipo pulado — MCP indisponível neste motor.
- Perfis envolvidos: Administrador, Gestor de Turma, Instrutor, Líder de Equipe e Aluno; considerar convivência técnica com o perfil legado Representante.
- Organização alvo: `principal`. Não há ambiente secundário configurado; o add-on precisa estar habilitado no contrato e eventual feature flag da implementação deve estar ativa.
- Conceitos centrais: Jornada Padrão, Execução da Jornada, Linha de Base, Reagendar, Replanejar, Fase, Tarefa, Papel, Rótulo, Time, Etiqueta, Critério de Aprovação e Ações Automáticas.

## 2. Suítes de Teste (agrupamento lógico da documentação)

| # | Título | Descrição |
|---|---|---|
| 1 | Acesso ao módulo e navegação por perfil | Bloco Jornadas, ordem dos submenus, add-on e visões por perfil. |
| 2 | Listagem e gestão de Jornadas Padrão | Dashboards, busca, filtros, extração, tabela, cards, duplicação e exclusão. |
| 3 | Identificação da Jornada Padrão | Campos básicos, duração, unidade, cálculo e slider. |
| 4 | Acesso e regras de inscrição | Contato, inscrição, vigência, restrição de horário e anexos. |
| 5 | Banners da Jornada Padrão | Quatro banners e comportamento equivalente ao cadastro de conteúdo. |
| 6 | Aprovação, certificado e recálculo | Critério percentual, assinatura, modelo de certificado e recálculo. |
| 7 | Time, papéis e permissões da jornada | Vínculos fixos/dinâmicos, rótulos, pessoas e permissões locais. |
| 8 | Cronograma em Kanban | Dias ordinais, colunas, cards, scroll, engajamento e propagação. |
| 9 | Cadastro de fases | Campos, período calculado, texto auxiliar e posicionamento. |
| 10 | Cadastro de tarefas | Tipos Aprendizagem, Compromisso, Manual e Mensagem. |
| 11 | Ações automáticas | E-mail, notificação e inscrição em conteúdo. |
| 12 | Inscrições da Jornada Padrão | Listagem, filtros, ações em massa, etiqueta, responsáveis e expiração. |
| 13 | Listagem e acompanhamento de execuções | Dashboards, status, progresso, certificados e filtros. |
| 14 | Detalhe da execução e auditoria | Cabeçalho, indicadores, log e ações sobre a execução. |
| 15 | Agenda de tarefas | Calendário por usuários/jornadas, agrupamento, busca e filtros. |
| 16 | Papéis e Permissões customizados | Papéis padrão, personalizados, herança e permissões adicionais. |
| 17 | Escopo de Gestor de Turma e Instrutor | Restrição às jornadas vinculadas e permissões combinadas. |
| 18 | Escopo do Líder de Equipe | Execuções e Agenda limitadas às pessoas lideradas. |
| 19 | Jornada no catálogo Play | Cards resumido/detalhado, inscrição e acesso. |
| 20 | Página interna da jornada do aluno | Banner, calendário e carregamento da execução. |
| 21 | Interação do aluno com tarefas | Status e comportamento dos quatro tipos de tarefa. |
| 22 | Widgets de Tarefas e Calendário | Tarefas Atrasadas/Hoje/Próximas e calendário no painel do aluno. |
| 23 | Linha de base, reagendamento e replanejamento | Independência da execução, datas previstas/efetivas e recálculos. |

## 3. Regras de Negócio Consolidadas

### 3.1 Convenções transversais

- O módulo é um bloco próprio, fora de Conteúdos, com submenus nesta ordem: "Jornada Padrão", "Execuções" e "Agenda".
- Todas as listagens usam tabela, busca, filtros e extração padrão Twygo; devem permitir lista e grade quando previsto. Ações não têm cabeçalho visível; até três ações aparecem como ícones, acima disso em menu de três pontos.
- Busca da listagem de jornadas pesquisa somente o nome. Extração oferece CSV e PDF (retrato/paisagem); Agenda não oferece extração na fase 1.
- Switches são verdes e representam efeito imediato; checkboxes representam permissões/comportamentos posteriores. Color picker é o mesmo da marca d'água de certificado. Campos dinâmicos usam `#`, nunca `{}`.
- Jornadas devem ser novo tipo de `Event`, preservando inscrição, ciclo de vida, compartilhamento e histórico, mas cadastro de conteúdo e jornada não podem compartilhar componentização que propague mudanças entre si.
- Alterações na Jornada Padrão não propagam para execuções iniciadas. Jornada/tarefa com engajamento atual ou histórico não pode ser excluída.

### 3.2 Jornada Padrão e cadastro

- Listagem começa com dashboards "Situação das Jornadas", "Distribuição dos Inscritos", "Tipo de Experiência" e "Classificação", sempre com quantidade e percentual. Tipo/Classificação mostram os quatro maiores e "Outros" por último quando houver mais de cinco valores.
- Colunas padrão: "Nome da jornada", "Inscrições", "Progresso médio", "Situação", "Tipo de experiência", "Classificação" e ações "Gerenciar", "Duplicar", "Excluir". Remover qualquer coluna "teste" do protótipo.
- Duplicar copia Identificação, Acesso, Banner, Aprovação, Time e Cronograma, acrescenta "(cópia)" ao nome e nunca copia inscrições ou execuções.
- Abas na ordem: Identificação, Acesso, Banner, Aprovação, Time, Cronograma, Inscrição e Aprendizagem; Aprendizagem é a última.
- Identificação: Nome obrigatório; Tipo de experiência, Classificação e Categorias selecionáveis/criáveis; Situação em "Em desenvolvimento", "Liberado", "Suspenso", "Encerrado"; Quem pode ver em "Inscritos", "Colaborador", "Usuários"; Carga horária apenas informativa; Descrição.
- Campos exclusivos: switch "Prolongar duração de acordo com o período das tarefas" desabilitado por padrão; Duração numérica; Unidade somente dias, semanas e meses. Com switch ativo, duração/unidade ficam bloqueadas e a duração recalcula pelas tarefas. Slider infinito reflete a unidade no rótulo.
- Acesso contém e-mail de contato, regras de inscrição/confirmacão/grupos/vigência, restrição fora do horário e anexos segundo o padrão de Conteúdo.
- Banner contém quatro formatos equivalentes aos do Conteúdo e precisa validar upload e renderização real da imagem.
- Aprovação oferece somente "Progresso maior ou igual a X%"; pode exigir assinatura do aluno e selecionar modelo de certificado. Mudanças no cronograma/critério exigem recálculo coerente.

### 3.3 Time, cronograma e tarefas

- Time lista Papel, Rótulo, Tipo de vínculo, Pessoa vinculada, quantidade de Permissões e ações Editar/Excluir. Vínculo pode ser fixo na jornada ou definido na inscrição.
- Permissões herdadas ficam marcadas e bloqueadas; permissões adicionais de Jornada podem ser acrescentadas. O conjunto controla visualizar/editar jornada, cronograma, inscrições, execução, reagendar e replanejar.
- Cronograma é Kanban de dias ordinais, começa pelo primeiro dia, cria colunas apenas para início/término necessários, admite separadores semanais e scroll lateral. Cards de fase contêm nome, período, editar/excluir; cards de tarefa contêm nome, badges de tipo e quantidade de ações, duplicar/editar/excluir.
- Fase: Nome, Cor, Descrição, Dia de início, Duração, Unidade e Dia de término calculado/bloqueado. Texto literal singular: "Esta fase será executada no Xº dia da jornada."; intervalo: "Esta fase será executada do Xº dia ao Xº dia da jornada."
- Tarefa: Nome, Cor, Fase ("Sem fase" bloqueado quando não houver fase), Descrição, Dia de início, Duração, Unidade, término calculado e checkbox de reagendamento. Textos equivalentes usam "Esta tarefa...".
- Envolvidos incluem "Inscrito na jornada" e papéis criados em Time.
- Aprendizagem: conteúdos e critérios opcionais Categoria/Tipo de experiência/Classificação; ao menos um critério permanece; conclusão por progresso 1–100%, carga horária 1–999 ou quantidade 1–999.
- Compromisso: descrição e local/link; sem integração Teams/Calendário na v1. Manual: descrição livre. Mensagem: apenas disparo, sem inscrição em conteúdo.
- Exclusão de tarefa com engajamento é bloqueada; mudanças na padrão só afetam novas execuções.

### 3.4 Ações automáticas e inscrições

- Aprendizagem, Compromisso e Manual permitem E-mail, Notificação e Inscrição em conteúdo; Mensagem permite somente E-mail e Notificação.
- Drawer E-mail: Idioma (português, inglês, espanhol), Modelo, Remetente, Assunto, Conteúdo, "Enviar e-mail teste", "Salvar" e "Cancelar"; modelo exibe exemplo e botão "Usar este modelo".
- Drawer Notificação: Idioma, Título, Conteúdo, Link, "Salvar" e "Cancelar".
- Drawer Inscrição: Tipo de conteúdo (Todos/Cursos/Trilhas/Pacotes), Situação (Todos/Em desenvolvimento/Liberados/Suspensos), Conteúdo múltiplo e "Enviar notificação de inscrição"; os dois primeiros filtram Conteúdo.
- Inscrições reutilizam a tela React de Pacotes e replicam nela as novas funções. Colunas: Participante, Inscrito em, Ambiente, Situação da Inscrição, Etiqueta e ações Editar/Excluir/Recalcular progresso.
- Busca por nome, e-mail, CPF ou código. Filtros padrão: Confirmados, Pendentes, Cancelados, Desistentes. Ações em massa alteram situação, recalculam progresso e alteram etiqueta.
- Nova inscrição contém Participante, Dia de início, Etiqueta, Situação, Expiração e responsáveis definidos dinamicamente pelo Time.

### 3.5 Execuções, auditoria e Agenda

- Execuções mostra "Total de execuções", "Em andamento", "Situação das execuções" e "Distribuição do progresso" nas faixas 0–25, 26–50, 51–75, 76–99 e 100%. Dashboards refletem filtros.
- Status operacionais: Sem pendências, Com atraso, Concluídas no prazo e Concluídas com atraso; Cancelada decorre da inscrição. Modelagem deve permitir futura separação de tipo e motivo de finalização.
- Tabela padrão: Participante, Jornada, Time, Progresso, Situação das tarefas, Aprovação, Certificado e ações. Certificado: Pendente, Emitido, Expirado, Aguardando assinatura; só pode ser emitido com aprovação.
- Detalhe mostra dados da execução, membros do time com papel, progresso geral, tarefas concluídas X/Y, ações disparadas e última atividade.
- Log ordenado do mais recente registra: Iniciou/Finalizou jornada, Iniciou/Finalizou fase, Visualizou/Iniciou/Finalizou/Reagendou tarefa, Inscrição realizada, Notificação/E-mail enviado, Foi aprovado e Certificado emitido. Colunas: Ação, Descrição, Tipo de ação, Realizada por, Realizada em, IP; automações usam "Sistema" e IP "–".
- Agenda permite modos "Por usuários" e "Por jornadas", busca por usuário/jornada/tarefa, filtros sem seção de colunas e calendário iniciado no dia atual, limitado ao período com tarefas, sem ordenação por hora. Tarefas repetidas agrupam por dia, situação e usuários.

### 3.6 Papéis, perfis e visão do aluno

- Papéis Padrão (Administrador, Gestor, Instrutor, Aluno) são apenas visualizáveis. Personalizados herdam obrigatoriamente de um padrão, só adicionam permissões e podem ser editados/excluídos; tela usa seções expansíveis.
- Gestor de Turma e Instrutor veem a experiência de administrador apenas nas jornadas vinculadas em Time, respeitando permissões globais + locais. Líder vê apenas Execuções e Agenda das pessoas lideradas.
- No Play, card resumido mostra tipo de experiência, nome e banner. Card detalhado tem abas "Detalhes" e "Cronograma", com botões de acesso, curtir, salvar, certificado, metadados e lista não acionável de tarefas.
- Botão é "Inscreva-se" antes da inscrição e "Acessar" depois. A página interna exibe loading, banner e calendário.
- Tarefas não têm estado "Em andamento": são pendentes/atrasadas/concluídas conforme datas e conclusão.
- Modal Aprendizagem mostra tarefa, período, tipo, descrição, critério, progresso e conteúdos. Curso/Trilha usa "Iniciar" e abre o primeiro não concluído; Pacote usa "Explorar pacote" e o texto literal "Sobre o pacote: O pacote agrupa diversos conteúdos e permite que você escolha quais deseja realizar e em quais deseja se inscrever." Conteúdos já concluídos contam.
- Compromisso/Manual permite marcar como realizada e, quando autorizado, reagendar. Mensagem é informativa, sem modal de execução.
- Widget Tarefas agrega jornadas em "Atrasadas", "Hoje" e "Próximas" somente para o aluno responsável. Widget Calendário reutiliza Agenda e é configurável pelo administrador.

### 3.7 Linha de base e processamento

- Ao iniciar uma execução, fases/tarefas/ações/envolvidos são copiados e dias ordinais viram datas reais a partir do dia inicial. A execução passa a ser independente.
- Reagendar muda a data efetiva sem alterar a prevista e pode manter atraso; Replanejar muda a linha de base e recalcula atraso, condicionado a permissão.
- Recalcular progresso e aprovação considera mudanças válidas; jornada deve aparecer no histórico de aprendizagem do usuário como uma Trilha.
- Processamentos de cópia, recálculo e disparos devem preservar idempotência, isolamento por organização e integridade dos registros.

## 4. Textos Literais

### Labels, opções e botões essenciais

- "Jornada Padrão", "Execuções", "Agenda", "Gerenciar", "Duplicar", "Excluir", "Adicionar", "Ações em massa", "Extrair dados".
- "Em desenvolvimento", "Liberado", "Suspenso", "Encerrado"; "Inscritos", "Colaborador", "Usuários".
- "Inscreva-se", "Acessar", "Iniciar", "Explorar pacote", "Marcar como realizada", "Reagendar", "Replanejar".
- "Atrasadas", "Hoje", "Próximas"; "Por usuários", "Por jornadas".

### Mensagens e textos documentados

- "Esta fase será executada no Xº dia da jornada."
- "Esta fase será executada do Xº dia ao Xº dia da jornada."
- "Esta tarefa será executada no Xº dia da jornada."
- "Esta tarefa será executada do Xº dia ao Xº dia da jornada."
- "As mensagens desta tarefa serão definidas na seção Ações automáticas, onde você poderá configurar o envio de mensagens automáticas para os participantes da jornada."
- "Sobre o pacote: O pacote agrupa diversos conteúdos e permite que você escolha quais deseja realizar e em quais deseja se inscrever."
- Mensagens exatas de validação, toast e confirmação de exclusão não foram especificadas nos documentos e não devem ser inventadas; validar no produto/protótipo quando disponível.

## 5. Campos e Validações

| Campo | Tipo | Obrigatório | Limite/Opções | Validação |
|---|---|---|---|---|
| Nome da jornada | Texto | Sim | Não informado | Não aceitar vazio; limite exato pendente. |
| Tipo de experiência | Select/criável | Não informado | Existente ou novo | Badge/listagem e dashboards. |
| Classificação | Select/criável | Não informado | Existente ou novo | Badge/listagem e dashboards. |
| Situação | Select | Sim | Em desenvolvimento/Liberado/Suspenso/Encerrado | Ordem fixa. |
| Quem pode ver | Select | Sim | Inscritos/Colaborador/Usuários | Sem Público na v1. |
| Carga horária | Numérico | Não informado | Não informado | Somente informativo. |
| Duração | Numérico + slider | Sim | Positivo; slider expansível | Bloqueado com prolongamento ativo. |
| Unidade | Select | Sim | dias/semanas/meses | Não oferecer horas/minutos. |
| Nome da fase/tarefa | Texto | Sim | Não informado | Não aceitar vazio; limite pendente. |
| Dia de início/Duração | Numérico | Sim | Valor ordinal positivo | Término calculado e bloqueado. |
| Progresso de conclusão | Percentual | Condicional | 1–100 | Apenas para Aprendizagem/Aprovação. |
| Carga horária mínima | Numérico | Condicional | 1–999 | Critério de tarefa Aprendizagem. |
| Quantidade de conteúdos | Numérico | Condicional | 1–999 | Critério de tarefa Aprendizagem. |
| Etiqueta | Texto livre | Não | Não informado | Usada em agrupamento/filtro/massa. |
| E-mail de contato | E-mail | Não informado | Formato de e-mail | Responsável pela jornada. |
| Link | URL/texto | Não | Não informado | Validar formato quando campo for URL. |
| Uploads de banner/anexo | Arquivo | Condicional | Não informado | Extensão, MIME, tamanho e imagem carregada precisam de validação. |

## 6. Endpoints de API

- Nenhum endpoint, método HTTP, payload ou status code foi especificado nos documentos. Não inventar contratos de API.

## 7. Banco de Dados e Spikes

- S1: decidir novo `KIND_*` de `Event` versus entidade própria e mapear tabelas de cronograma, fase, tarefa, ação, time, execução e log.
- S2: materializar snapshot da linha de base por execução, com data prevista e efetiva separadas e avaliação de volume/performance.
- S3: definir fonte de verdade de engajamento entre `primary` e `historic`, preferencialmente sem consulta cruzada síncrona cara.
- S4: decidir persistência/retensão do log granular em `postgres_logs`/TimescaleDB ou `primary`.
- S5: separar estado operacional, tipo e motivo de finalização para expansão sem migration estrutural.
- S6: integrar papéis personalizados ao RBAC existente (`AccessProfile`/Rolify) e conviver com Representante.
- S7: evoluir o componente React compartilhado de inscrições sem regressão em Pacotes.
- S8: confirmar maturidade da POC de calendário e lacunas para os três consumidores.
- S9: alinhar dependência e contrato do projeto Painéis Personalizados/Widgets.

## 8. Observações Adicionais

- Fora da v1: integração Teams/Calendário/Outlook, conteúdo adaptativo, inativação de tarefa, expansão granular de status, preview de cronograma no card e refatoração completa do Pacote.
- Pontos pendentes não devem virar expectativa inventada: limites de texto/arquivo, mensagens exatas de toast/erro/exclusão, nome de feature flag, regra de virada do atraso sem hora, início retroativo e detalhes finais de arquitetura.
- O protótipo não foi reconciliado por indisponibilidade do MCP; divergências visuais precisam ser revistas antes da geração dos casos.
