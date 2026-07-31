# Documentação completa — Jornadas

**Origem:** [Discovery] Jornadas - v01 27.05.2026
**Spike:** [Spike] Jornadas (S1–S9 abertos — itens de arquitetura idealmente resolvidos antes do desenvolvimento de S1/S2)

> Uma ou mais histórias por #R do Discovery. Critérios de aceite agrupados por componente de UI; cenários numerados (01 caminho feliz, 02+ variações e edge cases). Convenções globais (tabela padrão, switch verde, campos dinâmicos `#`, color picker da marca d'água) valem para todas as histórias e não são repetidas em cada uma.

---

## Acessar o módulo Jornadas e enxergar a visão correspondente ao perfil

**Como** usuário da plataforma (administrador, gestor de turma, instrutor, líder de equipe ou aluno)
**Quero** acessar o módulo Jornadas por um menu próprio com os submenus do meu perfil
**Para que** eu encontre as jornadas e execuções no lugar certo, com o escopo permitido ao meu papel.

**Protótipo:** Figma Make — bloco de menu Jornadas (padrão do módulo Skills).

### Critérios de aceite

#### Bloco de menu
- O módulo Jornadas aparece como um BLOCO de menu (não item único), com os submenus nesta ordem: Jornada Padrão, Execuções, Agenda.
- O módulo NÃO é listado dentro do menu de Conteúdos.
- A estrutura de bloco com três sub-itens segue o padrão visual do módulo Skills.

#### Visão por perfil
- Administrador vê os três submenus e todas as jornadas do ambiente.
- Gestor de Turma e Instrutor veem os três submenus, restritos às jornadas em que estão vinculados pela aba Time.
- Líder de Equipe vê apenas Execuções e Agenda, restrito às pessoas que lidera.
- Aluno não acessa os submenus administrativos — sua entrada é o catálogo Play, a página interna da jornada e os widgets.

#### Convenções de UI herdadas
- Toda listagem usa o componente padrão de tabela, com busca rápida, filtros, extração e alternância lista/grade.
- A coluna "Ações" não exibe rótulo; até três ações viram ícones diretos, acima de três vira menu de três pontinhos.
- Switches usam sempre verde; campos dinâmicos usam `#`; color picker é o da marca d'água do certificado.

### Cenários

01 — Administrador abre o menu lateral, vê o bloco Jornadas com Jornada Padrão, Execuções e Agenda e entra na listagem de Jornadas Padrão (tela inicial do módulo).

02 — Gestor de Turma abre o módulo e vê os mesmos três submenus, mas as listagens só trazem as jornadas em que ele está no Time.

03 — Líder de Equipe abre o módulo e só enxerga Execuções e Agenda, com dados das pessoas que lidera.

04 — Aluno não vê o bloco administrativo; encontra a jornada como card no Play.

---

## Visualizar e gerenciar a listagem das Jornadas Padrão

**Como** Administrador
**Quero** ver todas as Jornadas Padrão do ambiente com indicadores, filtros e ações
**Para que** eu acompanhe o portfólio de jornadas e gerencie cada uma.

**Protótipo:** Figma Make — listagem de Jornadas Padrão (tela inicial do módulo).

### Critérios de aceite

#### Estrutura da tela
- De cima para baixo: dashboards de acompanhamento, barra de pesquisa/filtros/extração, e tabela padrão.

#### Dashboards (4 indicadores, quantidade + percentual)
- Situação das Jornadas: distribuição entre Liberada, Em Desenvolvimento, Suspensa e Encerrada.
- Distribuição dos Inscritos: total agrupado por Confirmados, Pendentes, Desistentes e Cancelados, considerando todas as jornadas.
- Tipo de Experiência e Classificação: exibem os valores preenchidos; com ≤5 itens, mostra todos; com >5, mostra os 4 maiores e agrupa o resto em "Outros", sempre exibido por último (mesmo que a soma de "Outros" seja a maior).
- Tooltip/hover de detalhamento e filtragem cruzada (clique na fatia filtra a tabela) são OPCIONAIS — implementar se viável, senão registrar como melhoria futura.

#### Pesquisa, filtros e extração
- Busca rápida pesquisa apenas pelo Nome da jornada e é obrigatória pelo design system.
- Filtros padrão pré-configurados (não vazios): Liberadas, Em Desenvolvimento, Suspensas, Encerradas.
- O filtro "Autor / Ambiente Provedor" está presente mesmo sem compartilhamento entre ambientes implementado.
- Extração padrão em CSV e PDF (retrato/paisagem).

#### Tabela
- Colunas default: Nome da jornada, Inscrições, Progresso médio, Situação, Tipo de experiência, Classificação, Ações.
- "Inscrições" mostra total + totalizadores por situação, com drawer no hover.
- "Progresso médio" é barra + percentual; "Situação" é sigla colorida; Tipo e Classificação são badges.
- A coluna "teste" do protótipo é removida.
- O clique na linha leva à ação principal: Gerenciar.

#### Ações da linha
- Gerenciar abre o cadastro/edição (8 abas + Aprendizagem).
- Duplicar copia toda a estrutura cadastral, acrescenta "(cópia)" ao nome e NUNCA copia inscrições nem execuções.
- Excluir pede confirmação e é bloqueada quando há engajamento (progresso ou histórico de movimentação).

#### Grade (cards)
- Disponível, exibindo por padrão as 3 primeiras colunas + banner; campos visuais complexos podem ser custom-componentizados ou ocultados.

### Cenários

01 — Administrador abre o módulo, vê os 4 dashboards e a tabela; usa o filtro padrão "Liberadas" e a lista reduz às jornadas liberadas.

02 — Administrador duplica a jornada-modelo "Onboarding genérico"; surge "Onboarding genérico (cópia)" sem nenhuma inscrição ou execução.

03 — Administrador tenta excluir uma jornada com pessoas já engajadas; o sistema bloqueia com mensagem e sugere duplicar para criar uma versão nova.

04 — Ambiente com 7 tipos de experiência: o dashboard mostra os 4 maiores e "Outros" por último, mesmo "Outros" somando mais que qualquer destacado.

---

## Configurar a Identificação da Jornada Padrão

**Como** Administrador
**Quero** preencher os dados de identificação e a duração da jornada
**Para que** a jornada tenha nome, classificação, visibilidade e duração corretas.

**Protótipo:** Figma Make — aba Identificação (layout reaproveitado da criação de conteúdo).

### Critérios de aceite

#### Campos compartilhados com conteúdo
- Ordem: Nome (texto, obrigatório), Tipo de experiência (selecionar/criar), Classificação (selecionar/criar), Situação, Quem pode ver, Carga horária, Descrição, Categorias.
- Situação tem as opções, nesta ordem: Em desenvolvimento, Liberado, Suspenso, Encerrado.
- Quem pode ver tem, nesta ordem: Inscritos, Colaborador, Usuários (sem "Público" nesta versão).
- Carga horária é apenas informativa — não influencia progresso, gamificação ou aprovação.

#### Campos exclusivos da jornada
- "Prolongar duração de acordo com o período das tarefas" é switch e vem desabilitado por default.
- Quando o switch está ativo, Duração e Unidade ficam bloqueados e a Duração passa a ser a soma dos períodos das tarefas do cronograma, recalculada a cada alteração de tarefa.
- Unidade oferece apenas dias, semanas e meses (sem minutos/horas).

#### Ajuste rápido (slider)
- Abaixo de Duração há um slider de ajuste rápido com comportamento de "slider infinito" (margem inicial ~90; cresce ao chegar no fim).
- O rótulo reflete a unidade entre parênteses: "Ajuste rápido (dias|semanas|meses)".

### Cenários

01 — Administrador cria a jornada "Onboarding Comercial", seleciona Tipo de experiência existente, define Unidade = semanas e Duração = 6 pelo slider; salva e a jornada aparece na listagem.

02 — Administrador ativa "Prolongar duração de acordo com o período das tarefas"; Duração e Unidade travam e passam a refletir a soma das tarefas do cronograma.

03 — Administrador arrasta o slider até o fim (90); o limite cresce automaticamente para permitir um valor maior.

04 — Administrador tenta salvar sem Nome; o formulário bloqueia indicando o campo obrigatório.

---

## Configurar Acesso e Inscrição da Jornada Padrão

**Como** Administrador
**Quero** configurar contato, regras de inscrição, acesso fora de horário e anexos
**Para que** a jornada controle quem entra, por quanto tempo e com quais exigências.

**Protótipo:** Figma Make — aba Acesso (padrão da aba Acesso de conteúdos).

### Critérios de aceite

#### Seção Contato
- Campo "E-mail de contato" para o responsável pela jornada.

#### Seção Inscrição
- Exigir confirmação de inscrição (checkbox).
- Permitir registro de grupo de inscrições (checkbox).
- Permitir registro de inscrição por Pessoa física e/ou Pessoa jurídica (CNPJ).
- Dias de acesso individual (vigência) — numérico.
- Atualizar dias de acesso individual dos inscritos atuais (checkbox) — propaga a vigência aos inscritos existentes.

#### Seção Acesso fora de horário
- "Restringir o acesso fora do horário configurado no modo de uso".

#### Seção Anexos
- "Habilitar o envio de anexos na inscrição" (switch); quando ativo, exibe editor de texto para a "Mensagem de solicitação de anexos" mostrada ao inscrito.

> **Premissa:** ganchos de venda de inscrição em jornada ficam preparados na estrutura da aba, ocultos nesta versão (direção futura).

### Cenários

01 — Administrador define vigência de 90 dias e marca "Exigir confirmação de inscrição"; ao inscrever alguém, a inscrição nasce pendente de confirmação.

02 — Administrador altera a vigência e marca "Atualizar dias de acesso individual dos inscritos atuais"; a nova vigência propaga aos já inscritos.

03 — Administrador habilita anexos na inscrição e escreve a mensagem de solicitação; o inscrito vê essa mensagem ao se inscrever.

04 — Ambiente com restrição de horário no modo de uso: com o parâmetro ativo, o aluno fora da janela é bloqueado conforme o modo de uso.

---

## Configurar Banners da Jornada Padrão

**Como** Administrador
**Quero** configurar os banners da jornada
**Para que** ela apareça com identidade visual nos mesmos lugares dos conteúdos.

**Protótipo:** Figma Make — aba Banner (padrão de conteúdos).

### Critérios de aceite

#### Quatro banners
- Banner superior da página (1296 x 486), card resumido do Play (867 x 486), card expandido do Play (1294 x 486), destaque do Play (1482 x 486).
- Opção "Personalizar banner" com pré-visualização do banner selecionado.

### Cenários

01 — Administrador faz upload dos quatro banners e vê a pré-visualização de cada posição.

02 — Administrador não personaliza um banner; a posição usa o padrão e a jornada aparece normalmente no Play.

---

## Configurar Aprovação, certificado e recálculo de conclusão

**Como** Administrador
**Quero** definir o critério de conclusão, o certificado e como o recálculo afeta execuções
**Para que** a jornada emita certificado de forma consistente e auditável.

**Protótipo:** Figma Make — aba Aprovação (padrão de conteúdos, com diferenças).

### Critérios de aceite

#### Critério de conclusão
- O rótulo na UI é "Critério de Conclusão" (não "Aprovação"), porque a jornada conclui, não necessariamente aprova/reprova.
- Oferece apenas "Progresso maior ou igual a" (percentual). Desempenho e Frequência não são oferecidos.
- Parâmetro "Exigir assinatura do aluno" disponível (reaproveitado de projeto anterior).

#### Certificado
- Permite habilitar emissão, gerar automaticamente e notificar responsáveis sobre novos certificados.
- Permite escolher modelo e usar "modelo de certificado por empresa".
- A jornada emite certificado PRÓPRIO ao final, independente dos certificados de conteúdos consumidos.
- Expiração configurável: data-base (emissão ou aprovação) + tempo com unidade (dia/mês/ano).

#### Recálculo dos critérios
- Ao mudar o critério de uma jornada com execuções, recalcula as execuções em andamento.
- Quem já foi aprovado mantém a aprovação (nunca aprovado → reprovado).
- Quem não foi aprovado entra no recálculo; reprovados que atendem ao novo critério podem virar aprovados.
- Execuções concluídas, canceladas ou desistentes não são afetadas.
- Há recálculo individual na tela de detalhe da execução.
- Toda modificação de critério e recálculo gera registro no log da Jornada Padrão (autor, data, descrição).

### Cenários

01 — Administrador define conclusão = "Progresso ≥ 80%", habilita certificado e expiração de 1 ano a partir da emissão; salva.

02 — Administrador endurece o critério de 70% para 85% em uma jornada com execuções; quem já estava aprovado permanece aprovado, e quem não atingia 85% e não estava aprovado entra no recálculo.

03 — Administrador corrige um erro pontual de uma pessoa via recálculo individual na tela de detalhe, sem afetar as demais execuções.

04 — Administrador consulta o log da jornada e vê o registro do recálculo (quem alterou, quando, de que critério para qual).

---

## Configurar o Time da Jornada Padrão

**Como** Administrador
**Quero** vincular papéis, pessoas e permissões à jornada
**Para que** mentores, gestores e instrutores atuem com o escopo certo, inclusive papéis definidos por inscrito.

**Protótipo:** Figma Make — aba Time.

### Critérios de aceite

#### Listagem e funções
- Tabela com os papéis vinculados; funções: Adicionar, busca (papel/usuário), alternar cards/lista, Filtro.
- Filtros padrão: "Vínculo definido na inscrição" e "Vínculo fixo na jornada".
- Colunas default: Papel, Rótulo, Tipo de vínculo (badge), Pessoa vinculada, Permissões (contador), Ações (Editar, Excluir).

#### Adicionar papel
- Campos: Papel (select dos papéis de #R16), Rótulo (texto), Tipo de preenchimento (Pessoa definida na inscrição do participante / Pessoa definida na criação da jornada).
- Quando "definida na criação", exibe campo "Pessoa vinculada" para selecionar usuários no cadastro.
- Quando "definida na inscrição", a pessoa é informada na inscrição de cada participante (cada inscrito pode ter sua própria pessoa).

#### Permissões do papel (4 blocos)
- Acesso à jornada padrão: visualizar, editar dados cadastrais, alterar o Time, alterar o cronograma.
- Comunicação: receber notificações, receber alertas de atraso, ser notificado sobre conclusão.
- Acompanhamento da execução: visualizar execução, criar tarefas, reagendar compromissos, marcar tarefas manuais como concluídas.
- Inscrições: visualizar inscritos (todos / apenas os que acompanha), inscrever pessoas, alterar situação, excluir inscrições (só sem engajamento).

#### Sincronia com Papéis e Permissões
- Permissões herdadas do papel global aparecem marcadas e desabilitadas (não removíveis); o admin só pode adicionar extras para esta jornada.

### Cenários

01 — Administrador adiciona o papel base "Instrutor" com rótulo "Padrinho", tipo "definida na inscrição", e marca permissões de acompanhamento; salva e o papel aparece na tabela com badge "Definido na inscrição".

02 — Administrador adiciona um "Gestor de Turma" fixo, seleciona a pessoa no cadastro; a coluna Pessoa vinculada mostra o nome.

03 — Administrador abre um papel cujo global já concede "Visualizar inscritos"; a permissão vem marcada e desabilitada, e ele adiciona "Inscrever pessoas" só para esta jornada.

04 — Administrador tenta dar a um papel a permissão de "Excluir inscrições"; a regra deixa claro que só inscrições sem engajamento poderão ser excluídas.

---

## Construir o cronograma em Kanban de dias ordinais

**Como** Administrador
**Quero** montar o cronograma da jornada em colunas de dias ordinais com fases e tarefas
**Para que** a estrutura genérica funcione para qualquer participante, independente da data real.

**Protótipo:** Figma Make — aba Cronograma (Kanban).

### Critérios de aceite

#### Conceito de dia e colunas
- Colunas representam o N-ésimo dia (1º, 2º, 5º…), não datas reais.
- Exibe apenas os dias onde algo inicia ou termina (não todos os dias possíveis).
- Colunas sem nada iniciando/terminando podem ser excluídas automaticamente.
- Por default a jornada nova abre no primeiro dia.

#### Separadores de semana
- A cada 7 dias há linha divisória mais forte e rótulo "Semana 1", "Semana 2"…; as linhas vão até o fim da página.

#### Adicionar
- Botão "Adicionar" oferece Fase ou Tarefa.
- Cada coluna tem botão "Adicionar tarefa" (grande quando vazia, reduzido quando há tarefas).
- Nova tarefa entra no final da coluna; sem drag-and-drop nesta versão (ícone de arrastar removido).

#### Cards
- Card de fase: nome, dia de início, dia de término, Editar e Excluir.
- Card de tarefa: ícone e nome do tipo, badge com quantidade de ações automáticas, nome da tarefa, Duplicar/Editar/Excluir.
- Fases e tarefas com borda colorida e fundo branco; tarefa com barra lateral grossa na cor escolhida.
- Duplicar tarefa cria cópia literal abaixo.

#### Engajamento e propagação
- Tarefa já executada por ≥1 pessoa (qualquer execução, atual ou histórica) não pode ser excluída; ao tentar, bloqueia com mensagem e sugere duplicar a Padrão.
- Alterações na Jornada Padrão não propagam para execuções em andamento; ao salvar com execuções ativas, exibe aviso e gera log; afetam só as próximas execuções.

#### Scroll
- Com muitas colunas, o scroll lateral é acessível independente do vertical (corrigindo o bug atual da tabela padrão).

### Cenários

01 — Administrador adiciona a tarefa "Boas-vindas" no dia 1 e uma fase "Treinamentos" do dia 2 ao 4; o Kanban cria colunas só para os dias 1, 2 e 4.

02 — Administrador tenta excluir uma tarefa que já foi executada por um aluno; o sistema bloqueia e sugere duplicar a jornada para criar versão sem a tarefa.

03 — Administrador edita uma jornada com execuções em andamento; ao salvar, vê o aviso de que as alterações não se aplicam às execuções atuais e a mudança é registrada no log.

04 — Cronograma com 30 colunas: o usuário usa o scroll lateral diretamente, sem precisar descer o scroll vertical antes.

---

## Adicionar e configurar uma fase no cronograma

**Como** Administrador
**Quero** agrupar tarefas em fases com cor e período
**Para que** o cronograma fique organizado em blocos compreensíveis.

**Protótipo:** Figma Make — cadastro de fase.

### Critérios de aceite

#### Campos da fase
- Nome (obrigatório), Cor (color picker), Descrição (opcional), Dia de início (numérico obrigatório), Duração (numérico obrigatório), Unidade (dias/semanas/meses), Dia de término (calculado, bloqueado).
- Slider de ajuste rápido abaixo da Duração (comportamento de slider infinito).

#### Texto auxiliar
- Quando início = término: "Esta fase será executada no Xº dia da jornada."
- Quando diferentes: "Esta fase será executada do Xº dia ao Xº dia da jornada."

#### Comportamento ao salvar
- Redireciona ao cronograma; cria card da fase; cria colunas só para o dia de início e o de término (sem dias intermediários).
- Visual: borda colorida, fundo branco.

### Cenários

01 — Administrador cria a fase "Acompanhamento RH", dia 1, duração 5 dias; o texto auxiliar mostra "do 1º ao 5º dia" e o card aparece no cronograma com colunas 1 e 5.

02 — Administrador cria uma fase de 1 dia; o texto auxiliar mostra "no Xº dia da jornada".

03 — Administrador tenta salvar a fase sem Nome ou sem Dia de início; o formulário bloqueia indicando os obrigatórios.

---

## Adicionar e configurar uma tarefa nos quatro tipos

**Como** Administrador
**Quero** criar tarefas de Aprendizagem, Compromisso, Manual ou Mensagem com período e envolvidos
**Para que** a jornada combine consumo de conteúdo, compromissos, atividades práticas e comunicações.

**Protótipo:** Figma Make — cadastro de tarefa (seções Dados Básicos, Período e Duração, Envolvidos, Tipo da Tarefa, Ações Automáticas).

### Critérios de aceite

#### Dados básicos e período
- Dados Básicos: Nome (obrigatório), Cor, Fase (select; "Sem fase" bloqueado se não houver fase), Descrição.
- Período e Duração: Dia de início (obrigatório), Duração (obrigatório), Unidade (dias/semanas/meses), Dia de término (calculado, bloqueado), "Permitir que esta tarefa seja reagendada pelo inscrito" (checkbox), slider de ajuste rápido.
- Texto auxiliar igual ao da fase ("no Xº dia" / "do Xº ao Xº dia").

#### Envolvidos
- "Quem deve executar ou receber esta tarefa" é múltipla seleção: Inscrito na jornada + papéis configurados na aba Time.

#### Tipo Aprendizagem
- "Conteúdos" (múltipla seleção) exibido por default; botão "Adicionar mais critérios" inclui Categoria, Tipo de experiência, Classificação.
- Pelo menos uma das 4 opções deve estar selecionada; a única presente não pode ser removida.
- "Como considerar concluída": Progresso ≥ (1–100%), Carga horária mínima (1–999) ou Quantidade de conteúdos (1–999).
- Ao atingir o critério, a tarefa é marcada concluída automaticamente.

#### Tipo Compromisso
- Campos: Descrição do compromisso, Local ou link (texto livre).
- Sem integração com Teams/Calendar — é só sinalização.

#### Tipo Manual
- Campo: Descrição da tarefa; conclusão por check manual do aluno ou responsável.

#### Tipo Mensagem
- Sem campos próprios; exibe o texto "As mensagens desta tarefa serão definidas na seção Ações automáticas…"; não tem ação para o aluno executar.

#### Comportamento ao salvar
- Redireciona ao cronograma; cria card no período; dentro do card da fase se pertencer a uma; cria colunas só de início e término.

### Cenários

01 — Administrador cria tarefa de Aprendizagem no dia 2, vincula um curso, define "Progresso ≥ 100%"; quando o aluno conclui o curso, a tarefa fecha sozinha.

02 — Administrador cria um Compromisso "Reunião de boas-vindas" com link do Teams no campo Local ou link; nenhum convite automático é gerado.

03 — Administrador cria uma tarefa Manual "Fazer o primeiro café da operação"; o aluno conclui por check manual.

04 — Administrador seleciona Mensagem; nenhum campo próprio aparece e ele é direcionado a configurar a comunicação em Ações Automáticas.

05 — Administrador tenta remover o último critério de uma tarefa de Aprendizagem; o sistema impede, pois ao menos um é obrigatório.

---

## Configurar ações automáticas vinculadas às tarefas

**Como** Administrador
**Quero** vincular envio de e-mail, notificação e inscrição em conteúdo às tarefas
**Para que** a jornada dispare comunicações e inscrições no momento certo.

**Protótipo:** Figma Make — drawer de Ações Automáticas (referência: Piloto Automático).

### Critérios de aceite

#### Disponibilidade por tipo
- Aprendizagem, Compromisso e Manual: e-mail, notificação, inscrever em conteúdo.
- Mensagem: e-mail e notificação apenas (inscrever em conteúdo não se aplica).

#### Enviar e-mail (drawer)
- Campos: Idioma (PT-BR/Inglês/Espanhol, sem tradução automática), Modelo de e-mail, Remetente (cadastrados; "Twygo" se não houver), Assunto (obrigatório), Conteúdo (editor, obrigatório), "Enviar e-mail teste" (para o próprio usuário), Salvar, Cancelar.
- Ao selecionar um modelo, abre preview com botão "Usar este modelo" que preenche o conteúdo.
- Campos dinâmicos no formato `#`.

#### Enviar notificação (drawer)
- Campos: Idioma, Título (obrigatório), Conteúdo (obrigatório), Link (opcional), Salvar, Cancelar.

#### Inscrever em conteúdo (drawer)
- Campos: Tipo de conteúdo (Todos/Cursos/Trilhas/Pacotes — "Todos" default) e Situação (Todos/Em desenvolvimento/Liberados/Suspensos — "Todos" default) como filtros do campo Conteúdo (múltipla seleção).
- "Enviar notificação de inscrição" (checkbox) vem desmarcado por default; desmarcado, o aluno não recebe e-mails de inscrição nesses conteúdos.
- A seleção aqui é independente da seleção de conteúdos do tipo Aprendizagem.
- Itens adicionados aparecem em tabela padrão dentro do drawer (componente de busca de pessoas).

### Cenários

01 — Administrador adiciona ao Compromisso uma ação de e-mail em PT-BR, escolhe um modelo, clica "Usar este modelo", ajusta o assunto e envia um teste para si.

02 — Administrador adiciona "Inscrever em conteúdo" filtrando por Cursos liberados e seleciona 3 deles, deixando "Enviar notificação de inscrição" desmarcado; o aluno é inscrito sem receber e-mails.

03 — Administrador configura uma tarefa Mensagem só com notificação; a opção "Inscrever em conteúdo" não aparece.

04 — Administrador usa um campo dinâmico `#nome` no corpo do e-mail; o preview do modelo evidencia o uso de campos dinâmicos.

---

## Gerenciar as inscrições da Jornada Padrão

**Como** Administrador
**Quero** inscrever participantes, agrupá-los por etiqueta e gerenciar suas situações
**Para que** eu controle turmas e o ciclo de inscrição da jornada.

**Protótipo:** Figma Make — aba Inscrição (reuso da tela React de inscrição do Pacote).

### Critérios de aceite

#### Listagem e funções
- Reutiliza a tela NOVA de inscrição do Pacote (não a antiga de Curso/Trilha); novidades replicadas também no Pacote.
- Colunas default: Participante, Inscrito em, Ambiente, Situação da Inscrição, Etiqueta, Ações (Editar, Excluir, Recalcular progresso).
- Funções: Adicionar, Ações em massa, Extrair dados, Busca rápida (Nome/E-mail/CPF/Código), alternar Lista/Cards, Filtro.
- Filtros padrão: Confirmados, Pendentes, Cancelados, Desistentes.

#### Ações em massa
- Atualizar para Confirmados/Pendentes/Cancelados/Desistentes, Recalcular progresso, Alterar a etiqueta (com campo "Alterar para").

#### Adicionar inscrição
- Identificação do participante: Participante (select).
- Controle da inscrição: Dia de início da jornada (data), Etiqueta (texto livre), Situação, Expiração da inscrição (data).
- Responsáveis: campos dinâmicos para os papéis do Time marcados como "Pessoa definida na inscrição" (um, vários ou nenhum).
- A etiqueta é filtrável também no menu Execuções, para acompanhar uma turma.

### Cenários

01 — Administrador inscreve 30 pessoas, marca a todas com etiqueta "Turma 25/01" e, para cada uma, escolhe o respectivo mentor no campo de responsáveis.

02 — Administrador seleciona um grupo e usa "Ações em massa → Atualizar para Confirmados"; as situações mudam de uma vez.

03 — Administrador usa "Ações em massa → Alterar a etiqueta" e informa "Lote Janeiro"; todas as inscrições selecionadas recebem a nova etiqueta.

04 — Administrador filtra Execuções pela etiqueta "Turma 25/01" e acompanha só aquela turma.

---

## Acompanhar todas as execuções do ambiente

**Como** Administrador (ou Gestor/Instrutor/Líder, no seu escopo)
**Quero** ver todas as execuções em andamento com indicadores e filtros
**Para que** eu acompanhe o progresso e os atrasos das pessoas nas jornadas.

**Protótipo:** Figma Make — menu Execuções.

### Critérios de aceite

#### Dashboards
- Total de execuções; Em andamento (alguma tarefa com status diferente de concluída/cancelada); Situação das execuções (4 estados); Distribuição do progresso (5 faixas).
- Situação, nesta ordem: Sem pendências, Em andamento com atraso, Concluídas no prazo, Concluídas com atraso.
- Faixas de progresso: 0–25, 26–50, 51–75, 76–99, 100%.
- Os dashboards refletem os filtros da tabela (recalculam no escopo filtrado).

#### Funções e filtros
- Extrair dados, busca rápida (participante/jornada), alternar Lista/Cards, Filtro.
- Filtros padrão: Sem pendências, Com atraso, Concluídas no prazo, Concluídas com atraso.

#### Tabela
- Lista todas as execuções do ambiente, ordenadas por data de inscrição (mais recentes no topo).
- Colunas default: Participante, Jornada, Time, Progresso, Situação das tarefas, Aprovação, Certificado, e botões Emitir/Expirar certificado, Histórico de certificados, Ver detalhes.
- Coluna Certificado: Pendente, Emitido, Expirado ou Aguardando assinatura; ação varia (Pendente→Emitir, Emitido→Expirar, Expirado→Emitir).
- Certificado só é emitido se o participante estiver aprovado.
- Grade exibe cards com foto, nome, jornada e progresso.

### Cenários

01 — Administrador filtra por "Com atraso"; a tabela e os 4 dashboards recalculam só para as execuções atrasadas.

02 — Administrador emite o certificado de quem está aprovado e pendente; a coluna passa para "Emitido" e a ação vira "Expirar".

03 — Administrador tenta emitir certificado de alguém não aprovado; a ação é impedida pelas regras da aprendizagem.

04 — Administrador abre o "Histórico de certificados" de uma execução e cai na tela existente da aprendizagem, com situação, datas e versões.

---

## Acessar o detalhe individual de uma execução com log de auditoria

**Como** Administrador (ou membro do Time com permissão)
**Quero** ver o detalhe de uma execução, seu log e agir sobre ela
**Para que** eu entenda o histórico daquela pessoa e corrija o que for pontual.

**Protótipo:** Figma Make — detalhe da execução.

### Critérios de aceite

#### Cabeçalho e dashboards
- Topo: nome do usuário. Cabeçalho: Jornada, Inscrito em, Iniciada em, Finalizada em, Duração total, Situação das tarefas, Aprovação, Certificado, membros do time com seu papel.
- Dashboards: Progresso geral (%), Tarefas concluídas (X/Y), Ações disparadas, Última atividade (data/hora).

#### Log de acompanhamento
- Funções: extrair dados, busca rápida (ação/descrição), filtro.
- Filtros padrão: Ações automáticas, Ações manuais.
- Colunas: Ação, Descrição, Tipo de ação, Realizada por, Realizada em, IP.
- A coluna Ação cobre os 13 tipos (iniciou/finalizou jornada, iniciou/finalizou fase, visualizou/iniciou/finalizou/reagendou tarefa, inscrição realizada, notificação enviada, e-mail enviado, foi aprovado, certificado emitido).
- Descrição mapeia conforme a ação (nome da jornada/fase/tarefa/conteúdo/título; "Foi aprovado" e "Certificado emitido" sem descrição).
- Tipo de ação é Automática ou Manual; "Realizada por" é o usuário ou "Sistema"; IP é o do usuário ou "–" para automáticas; ordenação do mais recente ao mais antigo.

#### Ações da execução
- Recalcular esta execução (individual) — regras de RN 75–77.
- Reagendar tarefas (sujeito à permissão do Time).
- Adicionar tarefa específica para este aluno (sem afetar a Padrão).
- Cancelar inscrição.

### Cenários

01 — Administrador abre o detalhe de "João", vê 8/12 tarefas concluídas e o log com "Finalizou uma tarefa → Treinamento de Política".

02 — Administrador adiciona uma tarefa específica só para João; a Jornada Padrão e as outras execuções não mudam.

03 — Administrador filtra o log por "Ações automáticas" e vê os e-mails e notificações disparados pelo Sistema, com IP "–".

04 — Administrador recalcula a execução de João individualmente após corrigir um critério, sem mexer nas demais.

---

## Visualizar as tarefas das jornadas em formato de calendário (Agenda)

**Como** Administrador (ou Gestor/Instrutor/Líder, no escopo)
**Quero** ver as tarefas das jornadas em um calendário por usuários ou por jornadas
**Para que** eu acompanhe o que está previsto dia a dia.

**Protótipo:** Figma Make — menu Agenda (componente de calendário, POC do Alexandre).

### Critérios de aceite

#### Funções e filtros
- Modo de exibição: Por usuários ou Por jornadas; busca rápida (usuário/jornada/tarefa); Filtro.
- Extração NÃO disponível nesta fase.
- Filtros padrão: Sem pendências, Com atraso, Concluídas no prazo, Concluídas com atraso.
- A seção "Colunas para exibir" do filtro é ocultada (não se aplica a calendário).

#### Comportamento do calendário
- Default mostra o dia atual como primeira coluna; navega para passado e futuro, limitado ao período com tarefas.
- Sem ordenação por hora (tarefas só têm dia); ordena por ordem de criação.

#### Modo Por Usuários
- Primeira coluna: usuário (uma linha por usuário); demais colunas: dias seguintes com as tarefas.
- Card: nome da tarefa, ícone de situação, nome da jornada, badge da fase, ícone do tipo, quantidade de ações.

#### Modo Por Jornadas
- Primeira coluna: jornada; demais colunas: dias com tarefas.
- Card: nome da tarefa, ícone de situação, badge da fase, ícone do tipo, quantidade de ações, usuários vinculados.
- Tarefas repetidas agrupadas por dia, situação e usuários; é esperado que a mesma tarefa apareça em datas diferentes para inscritos em meses distintos.

### Cenários

01 — Administrador abre a Agenda no modo Por Usuários; vê hoje na primeira coluna e os próximos dias com as tarefas de cada pessoa.

02 — Administrador troca para Por Jornadas; a mesma tarefa "Bate-papo do dia 21" aparece em datas diferentes conforme o mês de inscrição de cada turma.

03 — Administrador tenta navegar para um período sem tarefas; a navegação é limitada ao intervalo com tarefas configuradas.

04 — No modo Por Jornadas, várias execuções têm a mesma tarefa no mesmo dia; o calendário mostra uma única ocorrência com os usuários listados.

---

## Gerenciar papéis e permissões customizados (módulo auxiliar)

**Como** Administrador
**Quero** criar papéis personalizados e visualizar os padrão
**Para que** a aba Time tenha papéis como Mentor, Par ou Líder, complementando os perfis fixos.

**Protótipo:** Figma Make — tela de Papéis e Permissões (temporária).

### Critérios de aceite

#### Estrutura
- Duas seções/abas: Papéis Padrão (Administrador, Gestor, Instrutor, Aluno) e Papéis Personalizados.
- Separação visual clara entre editáveis (personalizados) e não-editáveis (padrão).
- Tabela padrão com busca, filtros e extração; layout em seções com colapso (padrão de Créditos); coluna "Permissões ativas" (contador).

#### Papéis Padrão
- Não editáveis nesta versão — ação apenas Visualizar.
- Ao visualizar, lista as permissões por menu (Usuários, Conteúdos, Aprendizagem, Certificados…) e também o que o papel NÃO acessa.
- Para Jornadas, exibe as permissões disponíveis com possibilidade de habilitação (as mesmas da aba Time).

#### Papéis Personalizados
- Campos: Nome (rótulo, texto livre), Descrição padrão (opcional), "Herdar permissão de" (select obrigatório de 1 dos 4 padrão), Permissões herdadas (marcadas e desabilitadas), Permissões adicionais para Jornada (configuráveis).
- Após herdar, só é possível ADICIONAR permissões — nunca remover as herdadas.
- Ações: Editar e Excluir (sem "Visualizar" separado, pois Editar já mostra).

> **Premissa:** o descritivo de cada Papel Padrão foi gerado por IA e precisa de revisão final da Angelica antes do release.

### Cenários

01 — Administrador cria o papel "Mentor" herdando de "Instrutor", mantém as herdadas marcadas/desabilitadas e adiciona "Reagendar compromissos"; salva e usa o papel na aba Time.

02 — Administrador abre o papel padrão "Gestor"; só consegue visualizar as permissões (inclusive o que ele não acessa), sem editar.

03 — Administrador tenta desmarcar uma permissão herdada de um papel personalizado; o sistema impede (só adicionar é permitido).

04 — Administrador vê a coluna "Permissões ativas" mostrando o total habilitado por papel e usa o colapso de seções para navegar a tela longa.

---

## Acessar o módulo com escopo restrito (Gestor de Turma, Instrutor e Líder de Equipe)

**Como** Gestor de Turma, Instrutor ou Líder de Equipe
**Quero** acessar o módulo Jornadas limitado ao meu vínculo
**Para que** eu acompanhe apenas as jornadas/pessoas sob minha responsabilidade.

**Protótipo:** Figma Make — mesmas telas do administrador, com dados filtrados.

### Critérios de aceite

#### Gestor de Turma e Instrutor
- Acessam os três submenus (Jornada Padrão, Execuções, Agenda), com a mesma visualização do administrador.
- Escopo restrito às jornadas em que estão vinculados pela aba Time.
- Permissões = papel global (#R16) + configuração na aba Time da jornada (#R7).

#### Líder de Equipe
- Acessa apenas Execuções e Agenda (não acessa Jornada Padrão — não cria/edita jornadas).
- Escopo restrito às pessoas que ele lidera.
- Internamente é um Aluno com permissões extras (por isso vê o menu "Equipe").

#### Comum
- Dashboards, listagens e Agenda são os mesmos do administrador, sempre filtrados pelo escopo permitido.

### Cenários

01 — Instrutor vinculado a duas jornadas vê apenas essas duas na listagem e na Agenda; os dashboards refletem só esse escopo.

02 — Líder de Equipe abre o módulo e só enxerga Execuções e Agenda das pessoas da sua equipe; não vê o submenu Jornada Padrão.

03 — Gestor de Turma sem a permissão "Alterar o cronograma" na aba Time consegue acompanhar a execução, mas não editar o cronograma.

04 — Gestor de Turma tenta acessar uma jornada em que não está no Time; ela não aparece para ele.

---

## Visualizar e acessar jornadas no catálogo (Play)

**Como** Aluno
**Quero** encontrar a jornada no catálogo e me inscrever ou acessá-la
**Para que** eu participe da jornada disponível para mim.

**Protótipo:** Figma Make — card de Jornada no Play (resumido e detalhado).

### Critérios de aceite

#### Card resumido
- Exibe Tipo de experiência (badge), Nome da jornada e Banner.

#### Card detalhado
- Abas "Detalhes" e "Cronograma".
- Detalhes: botão de acesso, Curtir, Salvar, Visualizar certificado, Nome, badge de tipo, badge de classificação, Duração (sem datas), Carga horária, Descrição, Quantidade de tarefas, Categorias.
- Cronograma lista as tarefas, mas elas NÃO são acessadas por este card — só após a inscrição, na página interna.

#### Botão de acesso
- "Inscreva-se" quando não inscrito (abre o formulário de inscrição); "Acessar" quando já inscrito (abre a página interna).
- Não há miniatura/preview do cronograma antes da inscrição nesta versão.

### Cenários

01 — Aluno não inscrito abre o card detalhado, vê duração e quantidade de tarefas e clica "Inscreva-se", abrindo o formulário de inscrição.

02 — Aluno já inscrito vê "Acessar" e entra na página interna da jornada.

03 — Aluno abre a aba Cronograma do card e vê a lista de tarefas, mas não consegue abrir nenhuma (acesso só após inscrição).

04 — Aluno curte e salva a jornada; ela aparece nos seus salvos.

---

## Executar a jornada pela página interna

**Como** Aluno inscrito
**Quero** abrir a página interna da jornada com banner e calendário de tarefas
**Para que** eu veja e realize minhas tarefas.

**Protótipo:** Figma Make — página interna da jornada (banner + calendário).

### Critérios de aceite

#### Estrutura
- Ao clicar "Acessar", abre página com banner no topo e o componente de calendário (o mesmo da Agenda) listando as tarefas.

#### Transição
- Exibe indicador de carregamento (loading) na abertura, melhorando o feedback frente ao Pacote atual.
- O comportamento de carregamento mantém o padrão do Pacote nesta versão (refatoração completa do Pacote fora de escopo).

### Cenários

01 — Aluno clica "Acessar"; vê um loading e a página abre com o banner e o calendário das suas tarefas.

02 — Aluno navega pelo calendário interno e identifica as tarefas de hoje e as próximas.

---

## Interagir com cada tipo de tarefa (visão do aluno)

**Como** Aluno
**Quero** abrir cada tarefa e realizá-la conforme o tipo
**Para que** eu cumpra a jornada (consumir conteúdo, comparecer, marcar atividades).

**Protótipo:** Figma Make — modais de tarefa por tipo.

### Critérios de aceite

#### Status da tarefa
- Estados: Pendente / no prazo, Atrasada, Concluída (não existe "Em andamento"); exibe check (✓) quando concluída.

#### Aprendizagem
- Modal: nome, datas, tipo, descrição, critério de conclusão (destacado), progresso atual (barra compatível com o critério), lista de conteúdos.
- Cada conteúdo mostra ordenação, banner, nome, tipo e descrição; conteúdos já feitos antes aparecem concluídos.
- Só conteúdos Curso/Trilha → botão "Iniciar" leva ao primeiro conteúdo não concluído.
- Só um conteúdo Pacote → botão "Explorar pacote" leva à página do pacote.
- Havendo Pacote, seção informativa "Sobre o pacote: …" ao final; clique no Pacote leva à listagem dos conteúdos dele.

#### Compromisso ou Manual
- Modal: nome, data para realização, descrição, link/local (se preenchido), opção de Reagendar (se houver permissão), opção "Marcar como realizada".
- Sem permissão de reagendar, só aparece "Marcar como realizada"; passando do dia, fica Atrasada até concluir.

#### Mensagem
- Sem ação para o aluno; é só disparo automático; pode aparecer no calendário como informativa, sem modal de execução.

### Cenários

01 — Aluno abre uma tarefa de Aprendizagem com um curso e uma trilha, clica "Iniciar" e é levado ao primeiro conteúdo ainda não concluído.

02 — Aluno abre uma tarefa de Aprendizagem cujo único conteúdo é um Pacote; o botão é "Explorar pacote" e há a seção "Sobre o pacote".

03 — Aluno marca uma tarefa Manual como realizada; ela ganha o check de concluída.

04 — Aluno tem uma tarefa de Compromisso sem permissão de reagendar e passou do dia; ela aparece como Atrasada e só oferece "Marcar como realizada".

05 — Aluno vê uma tarefa de Mensagem no calendário como informativa; não há modal para executar.

---

## Acompanhar tarefas pelos widgets (Tarefas e Calendário)

**Como** Aluno
**Quero** ver minhas tarefas centralizadas em widgets de Tarefas e Calendário
**Para que** eu tenha visão geral sem entrar em cada jornada.

**Protótipo:** Figma Make — widgets (dependência do projeto de Painéis Personalizados do Vini).

### Critérios de aceite

#### Dependência
- Os widgets dependem do projeto de Painéis Personalizados (Widgets); o administrador configura os painéis do aluno (nome do menu, abas, widgets).

#### Widget de Tarefas (ampliado)
- Inclui as tarefas das jornadas nas seções Atrasadas, Hoje e Próximas.
- Mostra todas as tarefas com data atribuídas ao aluno corrente, restritas às tarefas em que ele é responsável.
- É o lugar centralizador das tarefas do aluno.

#### Widget de Calendário (novo)
- Equivalente à Agenda do administrador, com escopo do aluno, reusando o componente de calendário, restrito às tarefas em que o aluno é responsável.
- O administrador escolhe disponibilizá-lo no painel do aluno.

### Cenários

01 — Aluno abre o painel e vê o widget de Tarefas com suas tarefas em Atrasadas, Hoje e Próximas.

02 — Administrador disponibiliza o widget de Calendário no painel do aluno; o aluno passa a ver o calendário com escopo só das suas tarefas.

03 — Aluno tem uma tarefa em que não é o responsável; ela não aparece nos seus widgets.

---

## Garantir Linha de Base, Reagendamento, Replanejamento e independência das execuções

**Como** Administrador e Aluno
**Quero** que cada execução copie a linha de base e evolua de forma independente, com regras claras de atraso
**Para que** turmas iniciadas em momentos diferentes funcionem sem retrabalho e o atraso seja confiável.

**Protótipo:** conceitual (sem tela própria) — comportamento transversal às telas de execução.

### Critérios de aceite

#### Padrão x Execução
- A Jornada Padrão é a estrutura genérica; cada execução é a instância de um inscrito, com "dia 1, dia 15…" relativos à sua própria data de inscrição.
- Ao iniciar a execução, a linha de base é copiada; daí em diante a execução vive independente e pode ser personalizada (tarefas específicas, datas) sem afetar a Padrão.

#### Reagendar x Replanejar
- Reagendar muda a data efetiva da tarefa, mas ela continua Atrasada se a nova data ultrapassar a data prevista da linha de base.
- Replanejar muda a linha de base (a data prevista) e a tarefa não fica atrasada — usado com justificativa válida (feriado, evento da empresa).
- Ambas as permissões são controladas pela configuração de papel na aba Time, sem perfil dedicado.

#### Alterações na Padrão
- Alterações na Jornada Padrão não propagam para execuções em andamento; afetam só as próximas execuções iniciadas após a alteração.

#### Integração com telas existentes
- A Jornada aparece no histórico de aprendizagem do usuário (tela detalhada do admin) como card "Jornada", com status (Concluída/Em andamento/Cancelada) e link, no mesmo padrão da Trilha.
- Conteúdos consumidos dentro das tarefas de Aprendizagem continuam aparecendo individualmente também.

### Cenários

01 — Três pessoas se inscrevem em janeiro, fevereiro e março; cada execução resolve o "dia 1" a partir da sua própria inscrição e segue o mesmo cronograma em datas reais distintas.

02 — Mentor reagenda uma reunião de quinta para a terça seguinte; a tarefa continua marcada como Atrasada por ultrapassar a data prevista.

03 — Administrador replaneja uma tarefa que caiu em feriado; a linha de base muda e a tarefa não fica atrasada.

04 — Administrador altera o cronograma da Padrão depois que turmas já começaram; as execuções em andamento não mudam e a alteração vale só para as próximas.

05 — Administrador abre a tela detalhada de um usuário e vê a "Jornada X" listada como aprendizado, ao lado dos cursos e trilhas, com status e link.

---

> **Nota sobre lacunas:** o `_revisao.md` lista comportamentos ainda a decidir que afetam estes critérios (virada de "Atrasada" sem hora, início retroativo, vigência expirada com jornada em andamento, conclusão sem certificado, grupo de inscrições × responsáveis dinâmicos). Resolver antes de transformar os cenários em casos de teste definitivos.
