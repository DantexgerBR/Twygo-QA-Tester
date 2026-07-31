| Campo | Valor |
|---|---|
| **Discovery** | Jornadas - v01 27.05.2026 |
| **Objetivo** | Disponibilizar na plataforma Twygo um módulo de Jornadas com estrutura genérica e reutilizável para múltiplos cenários (onboarding de novos colaboradores, mentoria, integração, mudança de carreira, jornada de liderança, entre outros), separando o conceito de **Jornada Padrão** (template/linha de base criada pelo administrador) da **Execução individual** da jornada (instância iniciada a partir da inscrição de cada participante). |
| **Por que é importante** | O módulo será comercializado como add-on separado da plataforma base, integrando a estratégia comercial da Twygo, e atende a uma demanda recorrente dos clientes por estruturar processos de onboarding, mentoria e desenvolvimento de pessoas de forma sistemática, com cronograma, acompanhamento, métricas e certificação. A separação entre Jornada Padrão e Execução permite que uma única estrutura sirva múltiplas turmas iniciadas em momentos diferentes, sem retrabalho de configuração. |
| **Figma** | Protótipo no Figma (Ctrl + clique para acessar) |
| **Artia** | Projeto no Artia (Ctrl + clique para acessar) |

## Sumário

- [#R1 Acessar o módulo Jornadas por menu próprio com três submenus e visão por perfil](#r1)
- [#R2 Visualizar e gerenciar a listagem das Jornadas Padrão](#r2)
- [#R3 Configurar os dados de identificação da Jornada Padrão (aba Identificação)](#r3)
- [#R4 Configurar parâmetros de acesso e inscrição (aba Acesso)](#r4)
- [#R5 Configurar os banners da Jornada Padrão (aba Banner)](#r5)
- [#R6 Configurar critérios de conclusão e certificado (aba Aprovação)](#r6)
- [#R7 Configurar o time da Jornada Padrão (aba Time)](#r7)
- [#R8 Construir o cronograma via Kanban de dias ordinais (aba Cronograma)](#r8)
- [#R9 Adicionar e configurar fases no cronograma](#r9)
- [#R10 Adicionar e configurar tarefas em quatro tipos](#r10)
- [#R11 Configurar ações automáticas vinculadas às tarefas](#r11)
- [#R12 Gerenciar as inscrições da Jornada Padrão (aba Inscrição)](#r12)
- [#R13 Acompanhar todas as execuções do ambiente (menu Execuções)](#r13)
- [#R14 Acessar o detalhe individual de uma execução, com log de auditoria](#r14)
- [#R15 Visualizar as tarefas em formato de calendário (menu Agenda)](#r15)
- [#R16 Gerenciar papéis e permissões customizados (módulo auxiliar)](#r16)
- [#R17 Acesso de Gestor de Turma e Instrutor com escopo restrito pela aba Time](#r17)
- [#R18 Acesso de Líder de Equipe a Execuções e Agenda das pessoas que lidera](#r18)
- [#R19 Aluno visualiza e acessa jornadas no catálogo (Play)](#r19)
- [#R20 Aluno executa a jornada por página interna com banner e calendário](#r20)
- [#R21 Aluno interage com cada tipo de tarefa](#r21)
- [#R22 Widgets de Tarefas e Calendário para o aluno](#r22)
- [#R23 Regras conceituais de Linha de Base, Reagendamento, Replanejamento e Recálculo](#r23)
- [Itens Fora de Escopo desta Versão](#fora-de-escopo)
- [Pontos a Validar e Decisões Pendentes](#pontos-a-validar)
- [Controle de versão](#controle-de-versao)

---

## #R1 Permitir que o administrador acesse o módulo Jornadas por menu próprio com três submenus (Jornada Padrão, Execuções e Agenda) e que cada perfil de usuário tenha sua visão correspondente {#r1}

**RN 1** — O módulo Jornadas deve ser exibido como um BLOCO de menu na plataforma Twygo, contendo três submenus, nesta ordem: Jornada Padrão, Execuções e Agenda.

**RN 2** — O módulo Jornadas NÃO deve ser listado dentro do menu de Conteúdos.

**RN 3** — O módulo Jornadas será comercializado como add-on separado da plataforma base; sua estrutura de bloco com três sub-itens segue o padrão visual e de navegação adotado no módulo Skills.

**RN 4** — O módulo deve contemplar cinco visões distintas, conforme o perfil do usuário logado:

- **RN 4.1** — Administrador: acesso completo a todos os submenus e a todas as jornadas do ambiente.
- **RN 4.2** — Gestor de Turma: mesma visualização do administrador, restrita às jornadas em que estiver vinculado pela aba Time, conforme detalhado em #R17.
- **RN 4.3** — Instrutor: mesma visualização do administrador, restrita às jornadas em que estiver vinculado pela aba Time, conforme detalhado em #R17.
- **RN 4.4** — Líder de Equipe: acesso aos submenus Execuções e Agenda, restrito às pessoas que ele lidera, conforme detalhado em #R18.
- **RN 4.5** — Aluno: visão restrita ao catálogo Play, à página interna da jornada e aos widgets, conforme detalhado em #R19, #R20, #R21 e #R22.

**RN 5** — A Jornada deve ser modelada internamente como um novo tipo de Event, à semelhança de Curso, Trilha e Pacote, reaproveitando a infraestrutura existente de compartilhamento entre ambientes, relacionamento conteúdo/inscrição, persistência e ciclo de vida, e lógica de inscrições.

> **Validar a seguinte possibilidade:** modelar a Jornada como novo tipo de `Event`.
> - O `Event` já tem 7 `KIND_*` (course, catalog, library, learning_path, package, excluded, external) e 60+ associações. Confirmar com arquitetura (Vini) se um novo kind comporta cronograma de dias ordinais, linha de base copiável e papéis dinâmicos sem reescrita.

**RN 6** — Os campos do formulário de cadastro da jornada devem ser visualmente similares aos do cadastro de conteúdo, mas NÃO devem ser componentizados de forma compartilhada: alterações no cadastro de conteúdo NÃO podem refletir automaticamente no cadastro de jornada (e vice-versa).

**RN 7** — Toda listagem do módulo deve utilizar o componente padrão de tabela da Twygo, incluindo busca rápida, filtros e extração de dados.

**RN 8** — As listagens devem permitir alternância entre visualização em lista e visualização em grade (cards), exibindo na grade por padrão as três primeiras colunas mais o banner.

**RN 9** — A coluna "Ações" NÃO deve exibir cabeçalho/rótulo visível, seguindo o padrão atual da plataforma. Quando houver até três ações, exibir os ícones diretamente; acima de três ações, exibir menu de "três pontinhos" conforme o Style Guide.

**RN 10** — Switches devem utilizar SEMPRE a cor verde (e não a cor primária do ambiente), reservando o switch para ações com efeito imediato (habilita seção ou função na tela) e o checkbox para permissões ou comportamentos que serão acionados posteriormente.

**RN 11** — O componente de Color Picker utilizado em todas as telas do módulo deve ser o mesmo já implementado na funcionalidade de marca d'água do certificado.

**RN 12** — Campos dinâmicos em e-mails, notificações e demais conteúdos editáveis devem utilizar o formato # (hashtag), seguindo o padrão dos certificados. NÃO utilizar chaves `{ }`.

**RN 13** — Os filtros das listagens devem incluir os filtros padrão já existentes na plataforma, mais o filtro "Autor / Ambiente Provedor" mesmo sem a funcionalidade de compartilhamento entre ambientes estar implementada nesta versão, deixando o filtro pronto para uso futuro.

**RN 14** — A extração de dados deve utilizar o componente padrão, oferecendo formatos PDF (print da tela, retrato ou paisagem) e CSV (lista).

**RN 15** — Os componentes citados (tabela padrão, filtros, busca, extração) devem ser utilizados mesmo onde o protótipo Figma Make não os exibir explicitamente, pois o protótipo foi gerado a partir de prints e nem sempre reflete os componentes padrão da plataforma.

---

## #R2 Permitir que o administrador visualize e gerencie a listagem das Jornadas Padrão cadastradas no ambiente {#r2}

**RN 16** — A tela inicial do módulo Jornadas deve ser a listagem das Jornadas Padrão, organizada de cima para baixo na seguinte ordem: dashboards de acompanhamento, barra de pesquisa e filtros, e tabela padrão com a listagem das jornadas.

### Dashboards de acompanhamento

**RN 17** — A parte superior da tela deve conter quatro dashboards de indicadores resumidos: Situação das Jornadas, Distribuição dos Inscritos, Tipo de Experiência e Classificação.

**RN 18** — O dashboard "Situação das Jornadas" deve mostrar a distribuição entre Liberada, Em Desenvolvimento, Suspensa e Encerrada, exibindo quantidade e percentual de cada situação.

**RN 19** — O dashboard "Distribuição dos Inscritos" deve mostrar o total de inscrições agrupadas por situação (Confirmados, Pendentes, Desistentes e Cancelados), considerando todas as jornadas do ambiente e exibindo quantidade e percentual.

**RN 20** — O dashboard "Tipo de Experiência" deve exibir os tipos de experiência preenchidos nas jornadas. Caso existam mais de cinco tipos, exibir os quatro com maior quantidade e agrupar os demais em uma opção chamada "Outros", que deve ser sempre exibida por último — mesmo que o valor somado dos "Outros" seja maior do que os quatro destacados.

**RN 21** — O dashboard "Classificação" deve seguir o mesmo padrão do dashboard "Tipo de Experiência": exibir as quatro classificações com maior quantidade e agrupar as demais em "Outros", sempre por último.

**RN 22** — Como comportamento OPCIONAL: avaliar a implementação de tooltip/hover sobre os dashboards exibindo detalhamento dos valores (similar ao drawer atualmente exibido na coluna "Equipe" da lista de conteúdos). Caso seja inviável tecnicamente, registrar como melhoria futura.

**RN 23** — Como comportamento OPCIONAL: avaliar a implementação de filtragem cruzada — ao clicar em uma fatia do gráfico, filtrar a tabela abaixo pelas jornadas correspondentes (incluindo a fatia "Outros"). Caso seja inviável tecnicamente, registrar como melhoria futura.

### Pesquisa, filtros e extração

**RN 24** — A busca rápida deve permitir pesquisar apenas pelo NOME da jornada e é obrigatória por padrão do design system — não pode ser omitida.

**RN 25** — O componente de filtro deve seguir o padrão da Twygo, oferecer filtros padrão pré-configurados (Liberadas, Em Desenvolvimento, Suspensas, Encerradas) e expor os seguintes campos para filtragem: Nome da jornada, Progresso, Situação, Tipo de experiência, Classificação, Código da jornada, Duração, Carga horária, Categoria, Quem pode ver, Permite grupo de inscrições, Vigência, Exige confirmação de inscrição, Duração de acordo com tarefas, Restringir o acesso fora do horário, Permite registro de inscrição por, Publicada em, Última atualização em, Criada em e Criada por.

**RN 26** — O filtro deve permitir configurar as colunas a exibir na tabela, entre: Nome da jornada, Inscrições, Progresso, Situação, Tipo de experiência, Classificação, Time, Código da jornada, Duração, Carga horária, Categoria, Link da jornada, Quem pode ver, Grupo de inscrição, Vigência, Confirmação de inscrição, Duração de acordo com tarefas, Restringir o acesso fora do horário, Permite registro de inscrição por, Curtidas, Salvamentos, Modelo do certificado, Publicada em, Última atualização em, Criada em e Criada por.

**RN 27** — Devem ser entregues filtros padrão JÁ pré-configurados (não vazios), uma vez que a maioria dos usuários não cria filtros customizados e a ausência de filtros padrão gera reclamação recorrente.

**RN 28** — A extração de dados deve utilizar o componente padrão da Twygo, oferecendo CSV e PDF.

### Tabela de listagem

**RN 29** — A tabela deve exibir por padrão as seguintes colunas: Nome da jornada, Inscrições, Progresso médio, Situação, Tipo de experiência, Classificação e Ações.

**RN 30** — A coluna "Inscrições" deve mostrar o total de inscrições com totalizadores por situação (Pendentes, Confirmadas, Desistentes e Canceladas), seguindo o mesmo padrão visual da lista de conteúdos. Pode abrir drawer com detalhes ao passar o mouse (hover).

**RN 31** — A coluna "Progresso médio" deve mostrar uma barra de progresso com o valor percentual ao lado.

**RN 32** — A coluna "Situação" deve mostrar, no mesmo padrão da lista de conteúdos, uma abreviação da situação da jornada, identificada pela cor e pela sigla da letra inicial da situação.

**RN 33** — As colunas "Tipo de experiência" e "Classificação" devem ser exibidas no formato de badge, com o valor preenchido no cadastro da jornada.

**RN 34** — A coluna "Ações" deve oferecer três ações: Gerenciar, Duplicar e Excluir.

**RN 35** — A ação Gerenciar deve direcionar para a página de criação/edição da jornada, contendo as oito abas detalhadas em #R3 a #R12 mais a aba Aprendizagem (acompanhamento).

**RN 36** — A ação Duplicar deve criar uma cópia da Jornada Padrão com todas as suas informações cadastrais (Identificação, Acesso, Banner, Aprovação, Time, Cronograma), acrescentando a palavra "(cópia)" ao final do nome da jornada para diferenciação na listagem.

**RN 37** — A ação Duplicar NUNCA deve copiar as Inscrições nem as Execuções da jornada de origem — apenas a estrutura da Jornada Padrão.

**RN 38** — A ação Duplicar terá uso intenso na operação, pois a Twygo disponibilizará jornadas-modelo prontas (ex.: onboarding genérico, jornada de liderança) que os clientes irão copiar e adaptar.

**RN 39** — A ação Excluir deve sempre exibir mensagem de confirmação antes da exclusão e NÃO deve permitir excluir jornadas que possuam algum engajamento (dados de progresso ou histórico de movimentação de usuários).

> **Validar a seguinte possibilidade:** definição de "engajamento" que bloqueia exclusão (RN 39).
> - Confirmar a fonte do dado de engajamento (movimento histórico em `historic` vs. progresso em `primary`) e como consultá-lo de forma performática na listagem.

**RN 40** — A coluna "teste" eventualmente exibida no protótipo Figma Make DEVE SER REMOVIDA na versão final.

**RN 41** — A visualização em grade (cards) deve estar disponível, exibindo por padrão as três primeiras colunas mais o banner da jornada. Campos visuais complexos (progresso, sequência de ícones etc.) podem ser custom-componentizados ou ocultados na grade caso prejudiquem a leitura.

**RN 42** — O clique em uma linha da tabela deve levar à ação principal da tela: Gerenciar a jornada.

---

## #R3 Permitir que o administrador configure os dados de identificação da Jornada Padrão (aba Identificação) {#r3}

**RN 43** — A aba Identificação deve ser a primeira aba do cadastro da Jornada Padrão e deve reutilizar o mesmo layout visual da criação de conteúdos, com as diferenças descritas nas regras seguintes.

**RN 44** — A aba Identificação deve conter os seguintes campos compartilhados com a criação de conteúdo, seguindo o mesmo padrão de comportamento: Nome da jornada, Tipo de experiência, Classificação, Situação, Quem pode ver (visualização), Carga horária, Descrição e Categorias.

**RN 45** — O campo Nome da jornada é de texto livre e obrigatório.

**RN 46** — O campo Tipo de experiência deve permitir selecionar um tipo já existente ou criar um novo, seguindo o padrão de conteúdos.

**RN 47** — O campo Classificação deve permitir selecionar uma classificação já existente ou criar uma nova, seguindo o padrão de conteúdos.

**RN 48** — O campo Situação deve conter, nesta ordem, as opções: Em desenvolvimento, Liberado, Suspenso e Encerrado.

**RN 49** — O campo Quem pode ver (visualização) deve conter, nesta ordem, as opções: Inscritos, Colaborador e Usuários. Sem a opção "Público" nesta versão.

**RN 50** — O campo Categorias deve permitir selecionar uma categoria já existente ou criar uma nova, seguindo o padrão de conteúdos.

> **Premissa:** o campo Carga horária é apenas informativo nesta versão — NÃO influencia cálculo de progresso, gamificação ou critério de aprovação. Serve para preenchimento manual e exibição (card do aluno, filtros, colunas). Integração com lógica de progresso/esforço fica para versões futuras.

### Campos exclusivos da Jornada

**RN 51** — A aba Identificação deve incluir os campos exclusivos da Jornada: "Prolongar duração de acordo com o período das tarefas", "Duração" e "Unidade".

**RN 52** — O campo "Prolongar duração de acordo com o período das tarefas" deve ser do tipo switch e deve vir por default DESABILITADO.

**RN 53** — Quando o campo "Prolongar duração de acordo com o período das tarefas" estiver HABILITADO, os campos "Duração" e "Unidade" devem ficar bloqueados para edição, e a duração da jornada deve ser calculada automaticamente pela soma dos períodos das tarefas configuradas no cronograma. A cada alteração de tarefa (adição, edição, remoção), o sistema recalcula e atualiza o campo.

**RN 54** — O campo "Duração" deve ser numérico e definir a duração padrão da jornada, podendo ser alterado também através de um slider de ajuste rápido posicionado logo abaixo do campo.

**RN 55** — O campo "Unidade" deve oferecer APENAS as opções: dias, semanas e meses. NÃO devem ser oferecidas as opções minutos ou horas, mesmo que o protótipo Figma Make as exiba.

**RN 56** — O slider de ajuste rápido (componente reaproveitado da plataforma) deve ter comportamento de "slider infinito": deve nascer com uma margem útil (sugestão de 90 unidades) e, caso o usuário chegue ao final, o limite deve crescer automaticamente para permitir valores maiores.

**RN 57** — O rótulo do slider de ajuste rápido deve refletir a unidade selecionada entre parênteses (ex.: "Ajuste rápido (dias)", "Ajuste rápido (semanas)", "Ajuste rápido (meses)").

---

## #R4 Permitir que o administrador configure os parâmetros de acesso e de inscrição da Jornada Padrão (aba Acesso) {#r4}

**RN 58** — A aba Acesso deve seguir o mesmo padrão visual e comportamental da aba Acesso da criação de conteúdos, com as exceções e novidades descritas nas regras seguintes.

### Seção Contato

**RN 59** — A seção Contato deve conter o campo "E-mail de contato", utilizado para informar o e-mail responsável pela jornada.

### Seção Inscrição

**RN 60** — A seção Inscrição deve conter os seguintes parâmetros:

- **RN 60.1** — Exigir confirmação de inscrição (checkbox).
- **RN 60.2** — Permitir registro de grupo de inscrições (checkbox).
- **RN 60.3** — Permitir registro de inscrição por: Pessoa física e/ou Pessoa jurídica (empresa com CNPJ).
- **RN 60.4** — Dias de acesso individual (vigência) — campo numérico que define por quantos dias o inscrito terá acesso individual à jornada.
- **RN 60.5** — Atualizar dias de acesso individual dos inscritos atuais (checkbox que propaga a atualização aos inscritos já existentes).

### Seção Acesso fora de horário

**RN 61** — A seção Acesso fora de horário deve conter o parâmetro "Restringir o acesso fora do horário configurado no modo de uso".

### Seção Anexos

**RN 62** — A seção Anexos deve conter o parâmetro "Habilitar o envio de anexos na inscrição" como switch.

**RN 63** — Quando "Habilitar o envio de anexos na inscrição" estiver ativo, deve ser exibido um editor de texto para a "Mensagem de solicitação de anexos", que será apresentada ao inscrito no momento da inscrição.

> **Premissa:** a aba Acesso deve manter ganchos prontos (ocultos nesta versão) para a futura venda de inscrição em jornada (cobrança), seguindo a direção futura registrada na spec.

---

## #R5 Permitir que o administrador configure os banners da Jornada Padrão (aba Banner) {#r5}

**RN 64** — A aba Banner deve oferecer os mesmos quatro banners do cadastro de conteúdos, uma vez que a Jornada será exibida nos mesmos locais em que os conteúdos são exibidos.

**RN 65** — As quatro posições de banner são:

- **RN 65.1** — Banner superior da página do conteúdo (1296 x 486 px).
- **RN 65.2** — Banner do card resumido do Play (867 x 486 px).
- **RN 65.3** — Banner do card expandido do Play (1294 x 486 px).
- **RN 65.4** — Banner em destaque do Play (1482 x 486 px).

**RN 66** — A aba Banner deve oferecer a opção "Personalizar banner" e a pré-visualização do banner selecionado, seguindo o mesmo padrão do cadastro de conteúdos.

---

## #R6 Permitir que o administrador configure os critérios de conclusão e o certificado da Jornada Padrão (aba Aprovação) {#r6}

**RN 67** — A aba Aprovação deve seguir o mesmo padrão visual e comportamental da aba Aprovação da criação de conteúdos, com as exceções descritas nas regras seguintes.

**RN 68** — O rótulo da seção de critérios deve ser exibido na UI como "Critério de Conclusão" e NÃO como "Critério de Aprovação", pois a jornada não necessariamente envolve aprovação/reprovação — o que existe é o critério para considerar a jornada como concluída e emitir o certificado.

**RN 69** — A seção "Critérios de Conclusão" deve oferecer APENAS o critério "Progresso maior ou igual a" (valor percentual). NÃO devem ser oferecidos os critérios "Desempenho" e "Frequência" nesta versão.

**RN 70** — A aba Aprovação deve incluir o parâmetro "Exigir assinatura do aluno", reaproveitando a funcionalidade já entregue em projeto anterior.

### Certificado

**RN 71** — A aba Aprovação deve permitir habilitar a emissão de certificado, gerar o certificado automaticamente e notificar responsáveis sobre novos alunos certificados, no mesmo padrão da criação de conteúdo.

**RN 72** — A aba Aprovação deve permitir a escolha do modelo de certificado entre os modelos disponíveis, e oferecer a opção "Usar modelo de certificado por empresa", igual ao cadastro de conteúdo.

**RN 73** — A jornada deve emitir um certificado PRÓPRIO ao final, independente dos certificados emitidos por conteúdos individuais consumidos durante a jornada.

### Expiração do certificado

**RN 74** — A aba Aprovação deve permitir habilitar a expiração do certificado e configurar:

- **RN 74.1** — Data para cálculo da expiração: data de emissão do certificado ou data de aprovação no curso.
- **RN 74.2** — Tempo para expiração: campo numérico com unidade (dia(s), mês(es), ano(s)).

### Recálculo dos Critérios de Conclusão

**RN 75** — Quando o administrador modificar o Critério de Conclusão de uma jornada que já possui execuções, deve haver recálculo das execuções em andamento, seguindo a mesma lógica já aplicada hoje em conteúdos:

- **RN 75.1** — Quem JÁ FOI APROVADO mantém a aprovação. O movimento de aprovado para reprovado NÃO acontece, mesmo que o novo critério seja mais rigoroso.
- **RN 75.2** — Quem ainda NÃO FOI aprovado entra no recálculo e pode passar a ser aprovado se atender aos novos critérios.
- **RN 75.3** — Reprovados pelo critério antigo que atendem aos novos critérios podem ser reavaliados e passar a aprovados.

**RN 76** — Execuções já concluídas, canceladas ou desistentes NÃO devem ser afetadas pelo recálculo — o histórico de quem já finalizou não pode ser modificado.

**RN 77** — Toda modificação de critério de conclusão e o respectivo recálculo deve gerar registro no log da Jornada Padrão, com autor, data e descrição, dado que a falta dessa visibilidade gera dúvidas recorrentes de clientes ("essa pessoa não está nos critérios e está aprovada").

**RN 78** — Deve ser oferecida a ação de recálculo INDIVIDUAL na tela de detalhe da execução, para corrigir cenários pontuais sem afetar todas as execuções da jornada (ver #R14).

---

## #R7 Permitir que o administrador configure o time da Jornada Padrão, vinculando papéis, pessoas e permissões (aba Time) {#r7}

**RN 79** — A aba Time é um conceito novo do módulo Jornadas e unifica os antigos conceitos de "Gestor" e "Instrutor" do cadastro de conteúdo. Esta mesma tela está planejada para ser, no futuro, reaproveitada em Curso, Trilha e Pacote.

**RN 80** — A aba Time deve apresentar uma tabela de listagem com os papéis vinculados à jornada, com:

- **RN 80.1** — Botão Adicionar.
- **RN 80.2** — Campo de busca por papel ou usuário.
- **RN 80.3** — Botão para alternar entre visualização em cards e em lista.
- **RN 80.4** — Filtro.

**RN 81** — Os filtros padrão da aba Time devem ser: "Vínculo definido na inscrição" e "Vínculo fixo na jornada".

**RN 82** — Os campos disponíveis para filtragem na aba Time são: Papel, Rótulo, Tipo de vínculo, Pessoa vinculada e Permissões.

**RN 83** — As colunas configuráveis para exibição na aba Time são: Papel, Rótulo, Tipo de vínculo, Pessoa vinculada, Permissões e Ações.

**RN 84** — A tabela da aba Time deve exibir por padrão as seguintes colunas:

- **RN 84.1** — Papel — nome do papel listado.
- **RN 84.2** — Rótulo — rótulo de exibição escolhido para este papel.
- **RN 84.3** — Tipo de vínculo — "Fixo na jornada" ou "Definido na inscrição", exibido em badge.
- **RN 84.4** — Pessoa vinculada — nome da pessoa vinculada (quando aplicável).
- **RN 84.5** — Permissões — quantidade de permissões atribuídas ao papel.
- **RN 84.6** — Ações — Editar e Excluir.

### Adicionar papel

**RN 85** — Ao clicar em Adicionar, o usuário deve ser direcionado para a página de adição de papel, contendo os campos:

- **RN 85.1** — Papel — select com os papéis cadastrados no módulo de Papéis e Permissões (#R16).
- **RN 85.2** — Rótulo — campo de texto onde o administrador define como o papel será exibido (ex.: papel base "Gestor de Turma" pode ter rótulo "Gerente").
- **RN 85.3** — Tipo de preenchimento do papel — seleção única com as opções "Pessoa definida na inscrição do participante" e "Pessoa definida na criação da jornada".

**RN 86** — Quando o tipo de preenchimento for "Pessoa definida na criação da jornada", deve ser exibido um campo adicional "Pessoa vinculada" para seleção dos usuários no momento do cadastro.

**RN 87** — Quando o tipo de preenchimento for "Pessoa definida na inscrição do participante", a pessoa específica deve ser informada no momento da inscrição de cada participante (ver #R12), permitindo que cada inscrito tenha sua própria pessoa vinculada (ex.: cada novo colaborador com um mentor diferente).

### Permissões do papel

**RN 88** — A página de adição de papel deve apresentar a seção "Permissões deste papel", agrupada em quatro blocos.

**RN 89** — Bloco "Acesso à jornada padrão":

- **RN 89.1** — Visualizar a jornada — acesso à jornada sem permissão de edição (semelhante a vincular um instrutor hoje).
- **RN 89.2** — Editar dados cadastrais — edição da Identificação, Banner, Aprovação e demais dados básicos.
- **RN 89.3** — Alterar o Time da jornada — criar e atribuir papéis.
- **RN 89.4** — Alterar o cronograma.

**RN 90** — Bloco "Comunicação":

- **RN 90.1** — Receber notificações da jornada.
- **RN 90.2** — Receber alertas de atraso.
- **RN 90.3** — Ser notificado sobre conclusão da jornada.

**RN 91** — Bloco "Acompanhamento da execução":

- **RN 91.1** — Visualizar execução da jornada.
- **RN 91.2** — Criar tarefas.
- **RN 91.3** — Reagendar compromissos.
- **RN 91.4** — Marcar tarefas manuais como concluídas.

**RN 92** — Bloco "Inscrições":

- **RN 92.1** — Visualizar inscritos — com variantes "Todos os inscritos" ou "Apenas aqueles que ele acompanha" (seguindo a mesma lógica do Gestor de Turma hoje).
- **RN 92.2** — Inscrever pessoas.
- **RN 92.3** — Alterar a situação da inscrição.
- **RN 92.4** — Excluir inscrições — com restrição: o papel só pode excluir inscrições SEM engajamento.

### Sincronia com Papéis e Permissões

**RN 93** — As permissões podem ser configuradas em DOIS lugares: globalmente no módulo Papéis e Permissões (#R16) e localmente na aba Time da jornada. As permissões herdadas do papel global devem aparecer MARCADAS e DESABILITADAS (não removíveis) na aba Time; o administrador pode apenas ADICIONAR permissões extras específicas para a jornada — nunca remover as herdadas.

---

## #R8 Permitir que o administrador construa o cronograma da Jornada Padrão por meio de um Kanban de dias ordinais (aba Cronograma) {#r8}

**RN 94** — A aba Cronograma deve ser um componente visual do tipo Kanban, onde as colunas representam DIAS (períodos ordinais) da jornada e os cards são tarefas e/ou fases.

**RN 95** — As colunas devem representar o N-ésimo dia da jornada (1º dia, 2º dia, 5º dia etc.), e NÃO datas reais do calendário. A jornada padrão é uma estrutura genérica; a data real é resolvida quando cada participante inicia sua execução.

**RN 96** — Devem ser exibidos APENAS os dias em que algo inicia ou termina (start ou end de fases e tarefas) — NÃO devem ser exibidos todos os dias possíveis da jornada, sob pena de tornar a tela inviável (uma jornada de seis meses teria mais de 180 colunas).

**RN 97** — As colunas do cronograma devem poder ser excluídas automaticamente quando não houver nenhuma tarefa ou fase iniciando ou terminando naquele dia.

**RN 98** — O cronograma deve apresentar separadores de SEMANA (e não de mês, pois meses têm 28, 30 ou 31 dias e a jornada padrão não tem datas reais). A cada 7 dias deve haver uma linha divisória mais forte e um rótulo "Semana 1", "Semana 2" etc. acima das colunas do bloco.

**RN 99** — As linhas divisórias de semana devem estender-se até o final do espaço disponível da página e não cortar em altura curta.

**RN 100** — Por default, ao abrir a aba Cronograma com a jornada nova, o cronograma deve exibir o primeiro dia.

**RN 101** — Quando o cronograma contiver muitas colunas, deve ser exibido um scroll lateral acessível independentemente do scroll vertical (o bug atual da tabela padrão, onde é preciso descer com o scroll vertical antes de usar o scroll lateral, deve ser corrigido nesta tela).

### Botão Adicionar

**RN 102** — A aba Cronograma deve oferecer um botão "Adicionar" que, ao ser clicado, deve apresentar duas opções: Fase ou Tarefa.

**RN 103** — Em cada coluna do Kanban deve haver também um botão "Adicionar tarefa" — grande quando a coluna está vazia (para incentivar a primeira inclusão) e reduzido quando já houver tarefas.

**RN 104** — Toda nova tarefa adicionada deve ser posicionada no FINAL (parte de baixo) da coluna correspondente.

**RN 105** — A reordenação manual de tarefas (drag and drop) NÃO está disponível nesta versão. O ícone de arrastar exibido no protótipo Figma Make deve ser REMOVIDO.

### Visualização dos cards

**RN 106** — O card de uma fase deve exibir: nome da fase, dia de início, dia de término, e ações Editar e Excluir.

**RN 107** — O card de uma tarefa deve exibir: ícone do tipo da tarefa, nome do tipo (Aprendizagem, Compromisso, Manual ou Mensagem), badge com a quantidade de ações automáticas configuradas na tarefa, nome da tarefa, e ações Duplicar, Editar e Excluir.

**RN 108** — Visualmente, fases e tarefas devem ter borda colorida e fundo branco (não preencher com cor sólida, pois confunde a leitura do Kanban). A tarefa deve possuir barra lateral mais grossa na cor escolhida, mantendo o padrão visual já utilizado em outras telas do sistema.

**RN 109** — A ação Duplicar tarefa deve criar uma cópia LITERAL da tarefa de origem, posicionada abaixo dela na coluna.

### Bloqueio de exclusão por engajamento

**RN 110** — Se uma tarefa da Jornada Padrão JÁ FOI EXECUTADA por pelo menos uma pessoa (em qualquer execução, atual ou histórica), o administrador NÃO PODE excluir essa tarefa.

> **Validar a seguinte possibilidade:** verificar engajamento de tarefa "em qualquer execução, atual ou histórica" (RN 110).
> - Execuções históricas podem estar na base `historic`. Confirmar como verificar engajamento de tarefa cruzando `primary` + `historic` de forma performática no momento da exclusão.

**RN 111** — Ao tentar excluir uma tarefa com engajamento, o sistema deve bloquear a ação e exibir mensagem clara, do tipo: "Esta tarefa não pode ser excluída porque já possui engajamento (foi executada por uma ou mais pessoas)."

**RN 112** — Como alternativa, o sistema deve sugerir ao usuário a duplicação da Jornada Padrão e a criação de uma nova versão sem a tarefa indesejada. As execuções antigas permanecem vinculadas à jornada original; novas inscrições podem ocorrer na nova versão.

### Propagação de alterações

**RN 113** — Alterações feitas na Jornada Padrão (adicionar tarefa, remover, alterar período, alterar critério etc.) NÃO devem propagar para execuções já em andamento. Cada execução, após iniciada, vive de forma independente da Jornada Padrão.

**RN 114** — Ao salvar uma alteração na Jornada Padrão que possui execuções em andamento, deve ser exibida mensagem clara para o administrador, do tipo: "Atenção: não é possível determinar em quais execuções as alterações seriam aplicáveis. Você precisa executá-las uma por uma, caso seja cabível."

**RN 115** — Toda alteração relevante na Jornada Padrão deve gerar registro no log de modificação, com autor, data e ação.

**RN 116** — Alterações na Jornada Padrão afetam APENAS as próximas execuções iniciadas após a alteração.

> **Premissa:** a modelagem do cronograma deve permitir a futura "inativação de tarefa" (mantém histórico mas oculta para novas execuções) e a opção "ocultar inativos", sem reescrita estrutural — direção futura registrada na spec.

---

## #R9 Permitir que o administrador adicione e configure fases dentro do cronograma da Jornada Padrão {#r9}

**RN 117** — Ao escolher Adicionar > Fase, o usuário deve ser direcionado para uma página de cadastro de fase com os campos descritos nas regras seguintes.

**RN 118** — A fase deve ter os seguintes campos:

- **RN 118.1** — Nome da fase — campo de texto, obrigatório.
- **RN 118.2** — Cor — Color Picker padrão da Twygo.
- **RN 118.3** — Descrição — campo de texto opcional.
- **RN 118.4** — Dia de início — campo numérico obrigatório.
- **RN 118.5** — Duração — campo numérico obrigatório.
- **RN 118.6** — Unidade — opções: dias, semanas ou meses.
- **RN 118.7** — Dia de término (calculado) — campo de texto bloqueado para edição, calculado automaticamente a partir do dia de início mais a duração.

**RN 119** — Logo abaixo do campo Duração da fase deve haver um slider de ajuste rápido, seguindo o mesmo comportamento de slider infinito descrito em RN 56.

**RN 120** — Abaixo do período da fase, deve haver um texto auxiliar indicando o intervalo de dias da fase:

- **RN 120.1** — Quando o dia de início e o dia de término forem IGUAIS: "Esta fase será executada no Xº dia da jornada."
- **RN 120.2** — Quando o dia de início e o dia de término forem DIFERENTES: "Esta fase será executada do Xº dia ao Xº dia da jornada."

**RN 121** — Ao salvar a fase, o usuário deve ser redirecionado para a página do cronograma, e a fase deve ser representada como um card com o período informado. O cronograma deve criar uma coluna para o dia de início e outra para o dia de término da fase, caso ainda não existam — os dias intermediários NÃO devem ser criados automaticamente.

**RN 122** — O visual da fase deve ter borda colorida e fundo branco — não preencher com cor sólida, para não confundir a leitura do Kanban.

---

## #R10 Permitir que o administrador adicione e configure tarefas dentro do cronograma da Jornada Padrão, em quatro tipos (Aprendizagem, Compromisso, Manual e Mensagem) {#r10}

**RN 123** — Ao escolher Adicionar > Tarefa, o usuário deve ser direcionado para uma página de cadastro de tarefa organizada em seções: Dados Básicos, Período e Duração, Envolvidos, Tipo da Tarefa e Ações Automáticas.

### Seção Dados Básicos

**RN 124** — A seção Dados Básicos deve conter:

- **RN 124.1** — Nome da tarefa — campo de texto, obrigatório.
- **RN 124.2** — Cor — Color Picker padrão da Twygo.
- **RN 124.3** — Fase — select com as fases já criadas. Caso ainda não exista nenhuma fase criada, o campo deve ficar bloqueado para seleção exibindo a opção "Sem fase".
- **RN 124.4** — Descrição — campo de texto opcional.

### Seção Período e Duração

**RN 125** — A seção Período e Duração deve conter:

- **RN 125.1** — Dia de início — campo numérico obrigatório.
- **RN 125.2** — Duração — campo numérico obrigatório.
- **RN 125.3** — Unidade — opções: dias, semanas ou meses.
- **RN 125.4** — Dia de término (calculado) — campo de texto bloqueado para edição, calculado automaticamente.
- **RN 125.5** — Permitir que esta tarefa seja reagendada pelo inscrito — checkbox.

**RN 126** — Logo abaixo do campo Duração da tarefa deve haver um slider de ajuste rápido com o mesmo comportamento descrito em RN 56.

**RN 127** — Abaixo do período da tarefa, deve haver um texto auxiliar indicando o intervalo de execução:

- **RN 127.1** — Quando os dias de início e término forem IGUAIS: "Esta tarefa será executada no Xº dia da jornada."
- **RN 127.2** — Quando forem DIFERENTES: "Esta tarefa será executada do Xº dia ao Xº dia da jornada."

**RN 128** — Ao salvar a tarefa, o usuário deve ser redirecionado para a página do cronograma, e a tarefa deve ser representada como card no período informado. Caso a tarefa pertença a uma fase, deve ser adicionada DENTRO do card da fase; caso contrário, deve ficar fora da área pertencente à fase.

**RN 129** — Assim como na fase, devem ser criadas colunas para o dia de início e o dia de término da tarefa, caso ainda não existam. Os dias intermediários NÃO devem ser criados automaticamente.

### Seção Envolvidos

**RN 130** — A seção Envolvidos deve conter o campo "Quem deve executar ou receber esta tarefa", de múltipla seleção, com as seguintes opções:

- **RN 130.1** — Inscrito na jornada.
- **RN 130.2** — Demais papéis configurados na aba Time da jornada (ex.: Mentor, Gestor de Turma etc.).

### Seção Tipo da Tarefa

**RN 131** — A seção Tipo da Tarefa deve oferecer, em seleção única, quatro tipos: Aprendizagem, Compromisso, Manual e Mensagem.

#### Tipo Aprendizagem

**RN 132** — Quando selecionada a opção Aprendizagem, devem ser exibidos os seguintes campos:

- **RN 132.1** — Conteúdos — campo de múltipla seleção, exibido por default.
- **RN 132.2** — Botão "Adicionar mais critérios", contendo as opções Categoria, Tipo de experiência e Classificação — todos de múltipla seleção.
- **RN 132.3** — Como considerar a tarefa concluída — seleção única entre: "Progresso maior ou igual a" (1 a 100%), "Carga horária mínima" (1 a 999) e "Quantidade de conteúdos" (1 a 999).

**RN 133** — O campo "Conteúdos" vem exibido por default. O usuário pode adicionar outros critérios (Categoria, Tipo de experiência ou Classificação) por meio do botão "Adicionar mais critérios". Quando outros critérios forem adicionados, o usuário pode remover o campo Conteúdos. Pelo menos UMA das quatro opções (Conteúdos, Categoria, Tipo de experiência ou Classificação) deve estar selecionada — ou seja, quando apenas uma estiver presente, ela não poderá ser removida.

**RN 134** — Quando o aluno atingir o critério configurado, a tarefa do tipo Aprendizagem deve ser automaticamente marcada como CONCLUÍDA.

#### Tipo Compromisso

**RN 135** — Quando selecionada a opção Compromisso, devem ser exibidos os seguintes campos:

- **RN 135.1** — Descrição do compromisso — campo de texto.
- **RN 135.2** — Local ou link — campo de texto livre (ex.: endereço presencial, sala fixa do Teams, link de videoconferência).

**RN 136** — Nesta versão do módulo, NÃO há integração com Teams, Google Calendar ou Outlook. O compromisso é apenas uma sinalização — a integração automática para colocar o compromisso na agenda do aluno fica fora de escopo (ver seção "Itens Fora de Escopo").

#### Tipo Manual

**RN 137** — Quando selecionada a opção Manual, deve ser exibido apenas o campo "Descrição da tarefa" (texto livre).

**RN 138** — A tarefa do tipo Manual deve ser concluída por check manual do aluno (ou do responsável envolvido, conforme configuração).

#### Tipo Mensagem

**RN 139** — Quando selecionada a opção Mensagem, NÃO devem ser exibidos campos próprios além das Ações Automáticas. O sistema deve exibir o texto informativo: "As mensagens desta tarefa serão definidas na seção Ações automáticas, onde você poderá configurar o envio de mensagens automáticas para os participantes da jornada."

**RN 140** — A tarefa do tipo Mensagem NÃO possui ação para o aluno executar — é apenas um disparo automático de comunicação e pode ser exibida no calendário do aluno como informativa.

---

## #R11 Permitir que o administrador configure ações automáticas vinculadas às tarefas (envio de e-mail, envio de notificação e inscrição em conteúdo) {#r11}

**RN 141** — Toda tarefa deve oferecer uma seção "Ações Automáticas", configurável por meio de um drawer lateral, seguindo o mesmo padrão visual e regras do Piloto Automático da Twygo.

**RN 142** — As opções disponíveis na seção Ações Automáticas dependem do tipo de tarefa selecionado:

- **RN 142.1** — Tarefas dos tipos Aprendizagem, Compromisso e Manual: Enviar e-mail, Enviar notificação interna, Inscrever em conteúdo.
- **RN 142.2** — Tarefa do tipo Mensagem: Enviar e-mail e Enviar notificação interna APENAS (Inscrever em conteúdo NÃO se aplica).

### Ação Enviar e-mail

**RN 143** — Ao clicar em "Enviar e-mail", deve ser aberto um drawer lateral com os campos:

- **RN 143.1** — Idioma — opções: Português (Brasil), Inglês e Espanhol. O sistema NÃO traduz automaticamente o conteúdo; cabe ao usuário definir o conteúdo no idioma escolhido.
- **RN 143.2** — Modelo de e-mail — select com sugestões de modelos prontos (ready-to-use).
- **RN 143.3** — Remetente — listagem dos remetentes cadastrados no ambiente; caso não haja, exibir "Twygo" como default.
- **RN 143.4** — Assunto do e-mail — campo de texto, obrigatório.
- **RN 143.5** — Conteúdo do e-mail — editor de texto, obrigatório.
- **RN 143.6** — Botão "Enviar e-mail teste" — envia o e-mail configurado para o próprio usuário que está configurando, igual ao Piloto Automático.
- **RN 143.7** — Botões Salvar e Cancelar.

**RN 144** — Quando o usuário selecionar um modelo de e-mail, deve ser aberta uma caixa de texto logo abaixo do campo, contendo um texto de exemplo, com um botão "Usar este modelo". Ao clicar no botão, o texto deve ser preenchido automaticamente no campo Conteúdo do e-mail.

**RN 145** — Os campos dinâmicos devem utilizar o formato # (hashtag), igual ao usado nos certificados — NÃO usar chaves `{ }`. O conjunto de modelos prontos serve também como evidência visual da existência de campos dinâmicos.

### Ação Enviar notificação

**RN 146** — Ao clicar em "Enviar notificação", deve ser aberto um drawer lateral com os campos:

- **RN 146.1** — Idioma — opções: Português (Brasil), Inglês e Espanhol.
- **RN 146.2** — Título — campo de texto, obrigatório.
- **RN 146.3** — Conteúdo — campo de texto, obrigatório.
- **RN 146.4** — Link (endereço URL) — campo de texto opcional.
- **RN 146.5** — Botões Salvar e Cancelar.

**RN 147** — A função Enviar notificação deve seguir o mesmo padrão e regras do disparo de notificações do Piloto Automático.

### Ação Inscrever em conteúdo

**RN 148** — Ao clicar em "Inscrever em conteúdo", deve ser aberto um drawer lateral com os campos:

- **RN 148.1** — Tipo de conteúdo — opções: Todos, Cursos, Trilhas e Pacotes. "Todos" selecionado por default.
- **RN 148.2** — Situação — opções: Todos, Em desenvolvimento, Liberados, Suspensos. "Todos" selecionado por default.
- **RN 148.3** — Conteúdo — campo de múltipla seleção.
- **RN 148.4** — Enviar notificação de inscrição — checkbox.
- **RN 148.5** — Botões Salvar e Cancelar.

**RN 149** — Os campos "Tipo de conteúdo" e "Situação" devem funcionar como filtros do campo "Conteúdo".

**RN 150** — Quando o parâmetro "Enviar notificação de inscrição" estiver DESMARCADO, o aluno NÃO deve receber e-mails de inscrição nos conteúdos vinculados. Esta é a regra padrão (default desmarcado), para evitar inundar o aluno com e-mails em jornadas com muitas inscrições automáticas.

**RN 151** — A seleção de conteúdos da ação "Inscrever em conteúdo" é INDEPENDENTE da seleção de conteúdos configurada no Tipo de Tarefa Aprendizagem — o administrador pode, por exemplo, ter colocado um pacote de 100 conteúdos como critério de aprendizagem, mas configurar a inscrição automática em apenas alguns deles (ou em nenhum).

**RN 152** — O componente de seleção de conteúdos da ação "Inscrever em conteúdo" deve seguir o mesmo padrão visual do componente de "busca de pessoas" utilizado em registro/inscrição, para facilitar busca, filtragem e seleção em lote. Os itens já adicionados devem ser apresentados em tabela padrão dentro do drawer.

---

## #R12 Permitir que o administrador gerencie as inscrições da Jornada Padrão (aba Inscrição) {#r12}

**RN 153** — A aba Inscrição deve reutilizar a tela NOVA de inscrição em React já implementada em Pacotes (acessada por "Gerenciar" de um Pacote). NÃO deve ser utilizada a versão antiga de Curso/Trilha, que apresenta bug.

**RN 154** — Novas funções adicionadas na aba Inscrição da jornada devem ser replicadas também para a tela de inscrição de Pacote.

> **Validar a seguinte possibilidade:** reuso e evolução coordenada da tela de inscrição React do Pacote (RN 153–154).
> - As duas telas continuam compartilhando o mesmo componente React. Confirmar com arquitetura como versionar a evolução compartilhada sem regressões no Pacote.

### Listagem de inscritos

**RN 155** — A aba Inscrição deve apresentar uma tabela com as seguintes colunas exibidas por default: Participante, Inscrito em, Ambiente, Situação da Inscrição, Etiqueta, e as ações Editar, Excluir e Recalcular progresso.

**RN 156** — As opções disponíveis na aba devem ser: Adicionar, Ações em massa, Extrair dados, Busca rápida, alternância entre visualização Lista e Cards, e Filtro.

**RN 157** — A busca rápida deve permitir pesquisar por Nome, E-mail, CPF ou Código do participante.

**RN 158** — Os filtros padrão devem ser: Confirmados, Pendentes, Cancelados e Desistentes.

**RN 159** — Os campos disponíveis para filtragem devem ser: Participante, Inscrito em, Ambiente, Situação da inscrição, Etiqueta e Expiração da inscrição.

**RN 160** — As colunas configuráveis para exibição são: Participante, Inscrito em, Ambiente, Situação da inscrição, Etiqueta e Expiração da inscrição.

### Ações em massa

**RN 161** — O botão "Ações em massa" deve oferecer as seguintes ações:

- **RN 161.1** — Atualizar para Confirmados.
- **RN 161.2** — Atualizar para Pendentes.
- **RN 161.3** — Atualizar para Cancelados.
- **RN 161.4** — Atualizar para Desistentes.
- **RN 161.5** — Recalcular progresso.
- **RN 161.6** — Alterar a etiqueta — ao selecionar essa opção, deve haver um campo de texto "Alterar para" onde o usuário informa o novo valor da etiqueta.

### Adicionar inscrição

**RN 162** — Ao clicar em Adicionar, o usuário deve ser direcionado a uma página de inscrição com as seguintes seções.

**RN 163** — Seção "Identificação do participante":

- **RN 163.1** — Participante — select de usuário.

**RN 164** — Seção "Controle da inscrição":

- **RN 164.1** — Dia de início da jornada — data.
- **RN 164.2** — Etiqueta — campo de texto livre, exclusivo da inscrição (não existe na Jornada Padrão). Serve para agrupar inscrições por turma, lote ou qualquer critério arbitrário (ex.: "Turma 25/01", "Lote Janeiro", "Pessoal de Loja - 25/01").
- **RN 164.3** — Situação — define a situação inicial da inscrição.
- **RN 164.4** — Expiração da inscrição — data de expiração da inscrição.

**RN 165** — Seção "Responsáveis":

- **RN 165.1** — Devem ser exibidos como campos dinâmicos os papéis definidos na aba Time da jornada que tiverem marcada a opção "Pessoa definida na inscrição do participante". Aparecem APENAS os papéis com essa marcação — podem ser um, vários ou nenhum.

**RN 166** — O campo Etiqueta deve estar disponível também para edição em massa, conforme RN 161.6.

**RN 167** — O filtro de Execuções (#R13) deve permitir filtrar por essa etiqueta — viabilizando o acompanhamento de uma turma específica em todas as suas execuções.

---

## #R13 Permitir que o administrador acompanhe todas as execuções de jornadas do ambiente (menu Execuções) {#r13}

**RN 168** — O menu Execuções deve apresentar dashboards de acompanhamento no topo da tela, seguidos por opções de extração, busca, filtros, alternância de visualização e tabela de execuções.

### Dashboards

**RN 169** — Os dashboards do topo do menu Execuções devem ser, em ordem:

- **RN 169.1** — Total de execuções — contabiliza todas as execuções de jornadas do ambiente.
- **RN 169.2** — Em andamento — contabiliza todas as jornadas que possuem alguma tarefa com status diferente de Concluída ou Cancelada.
- **RN 169.3** — Situação das execuções — distribuição entre quatro situações (RN 170).
- **RN 169.4** — Distribuição do progresso — quantidade de jornadas por faixa de progresso (RN 171).

**RN 170** — O dashboard "Situação das execuções" deve apresentar as quatro situações na seguinte ordem:

- **RN 170.1** — Sem pendências — execução está dentro do período esperado e em dia.
- **RN 170.2** — Em andamento com atraso — execução já passou do dia em que deveria ter executado uma tarefa.
- **RN 170.3** — Concluídas no prazo — execução finalizada (manual ou pelos critérios) dentro do prazo.
- **RN 170.4** — Concluídas com atraso — execução finalizada após o prazo.

**RN 171** — O dashboard "Distribuição do progresso" deve contemplar as faixas: 0 a 25%, 26 a 50%, 51 a 75%, 76 a 99% e 100%.

**RN 172** — Os dashboards do topo devem refletir os filtros aplicados na tabela. Se o administrador filtrar por uma jornada específica ou por uma pessoa, os indicadores devem recalcular para o escopo filtrado.

### Opções da tela

**RN 173** — O menu Execuções deve oferecer as seguintes opções:

- **RN 173.1** — Extrair dados.
- **RN 173.2** — Busca rápida — permite pesquisar por participante ou jornada.
- **RN 173.3** — Alternância entre visualização em Lista e em Cards.
- **RN 173.4** — Filtro.

**RN 174** — Os filtros padrão devem ser: Sem pendências, Com atraso, Concluídas no prazo e Concluídas com atraso.

**RN 175** — Os campos para filtrar devem ser: Participante, Jornada, Time, Progresso, Situação das tarefas, Aprovação, Certificado, Iniciada em, Finalizada em, Duração, Última atividade e Inscrito em.

**RN 176** — As colunas configuráveis para exibição devem ser: Participante, Jornada, Time, Progresso, Situação das tarefas, Aprovação, Certificado, Iniciada em, Finalizada em, Duração, Última atividade, Inscrito em, Tarefas concluídas e Ações disparadas.

### Tabela de Execuções

**RN 177** — A tabela deve listar todas as execuções de jornadas do ambiente — todos os participantes de todas as jornadas — ordenando por default pela data de inscrição do participante (mais recentes no topo).

**RN 178** — A tabela deve exibir por default as colunas: Participante, Jornada, Time, Progresso, Situação das tarefas, Aprovação, Certificado, e os botões "Emitir/Expirar certificado", "Histórico de certificados" e "Ver detalhes".

**RN 179** — A coluna "Certificado" deve exibir as situações: Pendente, Emitido, Expirado ou Aguardando assinatura.

**RN 180** — A ação associada à coluna "Certificado" deve variar conforme o estado atual:

- **RN 180.1** — Quando o certificado está Pendente — ação "Emitir certificado".
- **RN 180.2** — Quando o certificado está Emitido — ação "Expirar certificado".
- **RN 180.3** — Quando o certificado está Expirado — ação "Emitir certificado".

**RN 181** — Um certificado só pode ser emitido se o participante estiver Aprovado. Aplicam-se as mesmas regras já existentes na tela de Aprendizagem dos conteúdos.

**RN 182** — Ao clicar em "Histórico de certificados", o usuário deve ser direcionado para a tela já existente em Aprendizagem dos conteúdos, contendo a listagem de todos os certificados já emitidos para a jornada, com as colunas: Situação, Emitido em, Expirado em, Versão do certificado, e ícones de Visualizar e Baixar.

**RN 183** — A visualização em grade (cards), além da lista, deve estar disponível e exibir cards com FOTO da pessoa, nome, jornada e progresso — esse modo é particularmente relevante para o acompanhamento de pessoas.

### Status de finalização (modelagem)

**RN 184** — Esta versão (v1) trabalha com os status: Sem pendências, Em andamento com atraso, Concluída no prazo, Concluída com atraso, e Cancelada (estado da inscrição). A modelagem de dados deve permitir, sem reescrita estrutural, a expansão futura para status mais granulares (ex.: Concluída Aprovado, Concluída Reprovado, Concluída Incompleta, Cancelada antes de iniciar, Desistente após início), idealmente armazenando o motivo e o tipo de finalização em campos separados que possam acomodar novos valores.

> **Validar a seguinte possibilidade:** modelagem dos status de finalização preparada para expansão (RN 184).
> - Confirmar o desenho de campos (tipo de finalização + motivo em campos separados) que acomode novos valores sem migration estrutural na fase futura.

---

## #R14 Permitir que o administrador acesse o detalhe individual de uma execução, com log de auditoria e ações específicas {#r14}

**RN 185** — Ao clicar em "Ver detalhes" na linha de uma execução, o usuário deve ser direcionado para uma página com os detalhes da execução daquele participante.

### Topo e cabeçalho

**RN 186** — No topo da página de detalhe da execução deve ser exibido o Nome do usuário.

**RN 187** — O cabeçalho da página deve exibir:

- **RN 187.1** — Jornada.
- **RN 187.2** — Inscrito em.
- **RN 187.3** — Iniciada em.
- **RN 187.4** — Finalizada em.
- **RN 187.5** — Duração total.
- **RN 187.6** — Situação das tarefas.
- **RN 187.7** — Aprovação.
- **RN 187.8** — Certificado.
- **RN 187.9** — Nome dos membros do time com seu respectivo papel.

### Dashboards da execução

**RN 188** — A página de detalhe deve apresentar os seguintes dashboards:

- **RN 188.1** — Progresso geral — em formato percentual.
- **RN 188.2** — Tarefas concluídas — no formato X/Y.
- **RN 188.3** — Ações disparadas — quantidade de ações automáticas disparadas.
- **RN 188.4** — Última atividade — data e hora da última atividade/ação realizada pelo usuário na jornada.

### Opções da tela de detalhe

**RN 189** — A tela de detalhe deve oferecer as opções:

- **RN 189.1** — Extrair dados.
- **RN 189.2** — Busca rápida — permite pesquisar por ação ou descrição.
- **RN 189.3** — Filtro.

**RN 190** — Os filtros padrão devem ser: Ações automáticas e Ações manuais.

**RN 191** — Os campos para filtrar devem ser: Ação, Tipo de ação, Realizada por, Realizada em e IP.

**RN 192** — As colunas configuráveis para exibição devem ser: Ação, Descrição, Tipo de ação, Realizada por, Realizada em e IP.

### Log de Acompanhamento

**RN 193** — A tabela de log deve listar todas as ações/atividades realizadas referentes à execução da jornada do usuário, sejam elas ações realizadas por ele, por terceiros (ex.: líder, gestor de turma) ou automáticas pelo sistema, ordenando da mais recente para a mais antiga.

**RN 194** — A tabela deve exibir por padrão as colunas: Ação, Descrição, Tipo de ação, Realizada por, Realizada em e IP.

**RN 195** — A coluna "Ação" pode assumir os seguintes valores:

- **RN 195.1** — Iniciou a jornada.
- **RN 195.2** — Finalizou a jornada.
- **RN 195.3** — Iniciou uma fase.
- **RN 195.4** — Finalizou uma fase.
- **RN 195.5** — Visualizou uma tarefa.
- **RN 195.6** — Iniciou uma tarefa.
- **RN 195.7** — Finalizou uma tarefa.
- **RN 195.8** — Reagendou uma tarefa.
- **RN 195.9** — Inscrição realizada.
- **RN 195.10** — Notificação enviada.
- **RN 195.11** — E-mail enviado.
- **RN 195.12** — Foi aprovado.
- **RN 195.13** — Certificado emitido.

**RN 196** — A coluna "Descrição" deve exibir a tarefa ou ação realizada de acordo com a ação registrada:

- **RN 196.1** — Iniciou a jornada → Nome da jornada.
- **RN 196.2** — Finalizou a jornada → Nome da jornada.
- **RN 196.3** — Iniciou uma fase → Nome da fase.
- **RN 196.4** — Finalizou uma fase → Nome da fase.
- **RN 196.5** — Visualizou uma tarefa → Nome da tarefa.
- **RN 196.6** — Iniciou uma tarefa → Nome da tarefa.
- **RN 196.7** — Finalizou uma tarefa → Nome da tarefa.
- **RN 196.8** — Reagendou uma tarefa → Nome da tarefa.
- **RN 196.9** — Inscrição realizada → Nome do conteúdo.
- **RN 196.10** — Notificação enviada → Título da notificação.
- **RN 196.11** — E-mail enviado → Título do e-mail.
- **RN 196.12** — Foi aprovado → sem descrição.
- **RN 196.13** — Certificado emitido → sem descrição.

**RN 197** — A coluna "Tipo de ação" deve assumir os valores Automática ou Manual.

**RN 198** — A coluna "Realizada por" deve exibir o nome do usuário responsável pela ação ou "Sistema" em caso de ações automáticas.

**RN 199** — A coluna "IP" deve exibir o IP do usuário responsável pela ação ou "–" em caso de ações automáticas.

> **Validar a seguinte possibilidade:** volume e persistência do log de acompanhamento (RN 193–199).
> - O log registra ações por execução em alta granularidade (visualizou/iniciou/finalizou tarefa, ações automáticas, IP). Confirmar se persiste em `postgres_logs` (alto volume, partições) ou em `primary`, e como consolidar para o detalhe da execução.

### Ações disponíveis na execução

**RN 200** — A tela de detalhe da execução deve oferecer as seguintes ações específicas:

- **RN 200.1** — Recalcular esta execução (individual) — força o recálculo do critério de conclusão somente para esta pessoa. Aplicam-se as regras de recálculo descritas em RN 75 a RN 77.
- **RN 200.2** — Reagendar tarefas — sujeito à permissão configurada no Time.
- **RN 200.3** — Adicionar tarefa específica para este aluno — customização da execução, sem afetar a Jornada Padrão (ver #R23).
- **RN 200.4** — Cancelar inscrição.

---

## #R15 Permitir que o administrador visualize as tarefas das jornadas em formato de calendário (menu Agenda) {#r15}

**RN 201** — O menu Agenda deve oferecer as seguintes opções:

- **RN 201.1** — Modo de exibição — "Por usuários" ou "Por jornadas".
- **RN 201.2** — Busca rápida — permite pesquisar por usuário, jornada ou tarefa.
- **RN 201.3** — Filtro.

**RN 202** — Na primeira fase do projeto, a opção Extrair Dados NÃO está disponível no menu Agenda — será reavaliada em fase posterior (CSV de calendário fica ruim de visualizar).

**RN 203** — Os filtros padrão devem ser: Sem pendências, Com atraso, Concluídas no prazo e Concluídas com atraso.

**RN 204** — Os campos para filtrar devem ser: Usuário, Jornada, Situação da tarefa, Fase, Tarefa, Tipo de tarefa e Ação automática.

**RN 205** — No filtro da Agenda, a seção de "Colunas para exibir" NÃO se aplica e deve ser ocultada.

### Comportamento do calendário

**RN 206** — A tabela deve ser exibida em formato de calendário, mostrando por default o dia atual como primeira coluna.

**RN 207** — O usuário deve poder navegar para dias passados e futuros, limitando a navegação ao período em que existam tarefas configuradas.

**RN 208** — NÃO deve haver ordenação por hora (uma vez que tarefas não possuem campo de hora — apenas dia). A ordenação deve ser por ordem de criação da tarefa.

### Modo Por Usuários

**RN 209** — Quando o modo de exibição "Por usuários" estiver selecionado, a tabela deve exibir na primeira coluna o usuário (um por linha) e nas demais colunas os dias subsequentes ao dia atual, com as tarefas contidas em cada dia.

**RN 210** — O card da tarefa no modo Por Usuários deve conter:

- **RN 210.1** — Nome da tarefa.
- **RN 210.2** — Ícone indicando a situação.
- **RN 210.3** — Nome da jornada.
- **RN 210.4** — Badge com nome da fase (quando aplicável).
- **RN 210.5** — Ícone do tipo da tarefa.
- **RN 210.6** — Quantidade de ações contidas na tarefa.

### Modo Por Jornadas

**RN 211** — Quando o modo de exibição "Por jornadas" estiver selecionado, a tabela deve exibir na primeira coluna a jornada (uma por linha) e nas demais colunas os dias subsequentes ao dia atual, com as tarefas contidas em cada dia.

**RN 212** — O card da tarefa no modo Por Jornadas deve conter:

- **RN 212.1** — Nome da tarefa.
- **RN 212.2** — Ícone indicando a situação.
- **RN 212.3** — Badge com nome da fase (quando aplicável).
- **RN 212.4** — Ícone do tipo da tarefa.
- **RN 212.5** — Quantidade de ações contidas na tarefa.
- **RN 212.6** — Usuários vinculados à tarefa.

**RN 213** — As tarefas repetidas devem estar agrupadas por dia, situação e usuários. Quando várias execuções têm a mesma tarefa no mesmo dia, exibir uma única ocorrência com os usuários listados, em vez de N cards idênticos.

**RN 214** — Na visão Por Jornadas, é esperado que tarefas apareçam DUPLICADAS em datas diferentes para o mesmo card de tarefa (ex.: o mesmo bate-papo configurado para o dia 21 da jornada aparecerá em datas distintas para pessoas inscritas em meses diferentes).

**RN 215** — O componente de calendário deve reaproveitar a POC já desenvolvida (referência: Alexandre), com complemento conforme necessário.

> **Validar a seguinte possibilidade:** reaproveitamento da POC de calendário (RN 215).
> - Não há certeza se a POC do Alexandre está de fato implementada. Confirmar maturidade da POC e o esforço de complemento para suportar os modos Por Usuários / Por Jornadas, agrupamento e limite de navegação.

---

## #R16 Permitir que o administrador gerencie papéis e permissões customizados, complementares aos papéis padrão da plataforma (módulo auxiliar de Papéis e Permissões) {#r16}

**RN 216** — O módulo de Papéis e Permissões faz parte do escopo deste projeto e é uma tela TEMPORÁRIA. Uma reestruturação completa de menus e perfis está prevista em projeto separado (Caio); esta tela é necessária agora para alimentar a aba Time da jornada.

**RN 217** — A tela de Papéis e Permissões deve ser dividida em duas seções/abas:

- **RN 217.1** — Papéis Padrão — perfis fixos da plataforma (Administrador, Gestor, Instrutor, Aluno).
- **RN 217.2** — Papéis Personalizados — criados pelo administrador (ex.: Gerente, Mentor, Par, Líder, Tech Lead, Professor).

**RN 218** — A separação visual entre Papéis Padrão e Personalizados deve deixar claro quais são editáveis e quais não são, evitando confusão durante o atendimento pelo time de Vendas/CS.

### Papéis Padrão

**RN 219** — Os Papéis Padrão (Administrador, Gestor, Instrutor e Aluno) NÃO podem ser editados nesta versão — apenas visualizados.

**RN 220** — A ação disponível para Papéis Padrão é apenas Visualizar.

**RN 221** — Ao visualizar um Papel Padrão, devem ser listadas as permissões que o papel possui hoje, organizadas por menu (Usuários: o que pode fazer; Conteúdos: o que pode fazer; Aprendizagem: o que pode fazer; Certificados etc.), bem como o que o papel NÃO tem acesso, deixando explícito.

**RN 222** — Para o módulo de Jornadas, devem ser exibidas as permissões disponíveis com possibilidade de habilitação para o papel padrão (visualização da jornada, criação, alteração de cronograma, alteração de inscrição etc. — as mesmas permissões da aba Time descritas em #R7).

> **Premissa:** o descritivo de cada Papel Padrão foi gerado por IA a partir das anotações da Angelica e precisa de revisão final dela antes do release.

### Papéis Personalizados

**RN 223** — O administrador deve poder criar quantos Papéis Personalizados quiser.

**RN 224** — O cadastro de um Papel Personalizado deve conter os campos:

- **RN 224.1** — Nome do papel (rótulo) — campo de texto livre.
- **RN 224.2** — Descrição padrão — campo de texto opcional.
- **RN 224.3** — Herdar permissão de — select obrigatório com os quatro papéis padrão (Administrador, Gestor, Instrutor, Aluno). Internamente, todo papel personalizado é uma extensão de um dos quatro.
- **RN 224.4** — Permissões herdadas — vêm marcadas e DESABILITADAS (não removíveis).
- **RN 224.5** — Permissões adicionais para Jornada — configuráveis (as permissões da aba Time, descritas em #R7).

**RN 225** — Após herdar as permissões do papel base, o administrador pode SOMENTE ADICIONAR permissões — NUNCA remover permissões padrão herdadas. O comportamento é idêntico ao padrão usado em funcionalidades do contrato (o que vem da tabela de preço fica marcado e bloqueado; o administrador só pode acrescentar).

### Visual e ações

**RN 226** — A tela deve utilizar a tabela padrão com busca, filtros e extração.

**RN 227** — As ações disponíveis devem ser: Editar e Excluir para Papéis Personalizados; Visualizar APENAS para Papéis Padrão.

**RN 228** — O clique em uma linha da tabela deve levar à ação principal — Editar para personalizado e Visualizar para padrão.

**RN 229** — A tabela deve apresentar uma coluna "Permissões ativas" que conte a quantidade de permissões habilitadas no papel.

**RN 230** — Dada a extensão da tela (muitas permissões), o layout deve usar seções com expansão/colapso, similar ao padrão usado em Créditos.

**RN 231** — Para Papéis Personalizados, NÃO deve haver ação "Visualizar" separada de "Editar" — a ação Editar já contempla a visualização, e oferecer ambas gera redundância.

> **Validar a seguinte possibilidade:** convivência dos novos Papéis Personalizados com o RBAC existente e o perfil legado "Representante" (RN 216–225).
> - A plataforma tem dois RBACs coexistindo (Rolify + `AccessProfile`) e um perfil legado "Representante" pouco usado. Confirmar onde os papéis personalizados são persistidos e como conviver/migrar o legado sem conflitar com a reestruturação do Caio.

---

## #R17 Permitir que os perfis Gestor de Turma e Instrutor acessem o módulo Jornadas com escopo restrito às jornadas em que estiverem vinculados pela aba Time {#r17}

**RN 232** — Os perfis Gestor de Turma e Instrutor devem ter acesso ao mesmo menu Jornadas do administrador (Jornada Padrão, Execuções e Agenda).

**RN 233** — O escopo de visualização desses perfis deve ser restrito APENAS às jornadas em que estão vinculados pela aba Time.

**RN 234** — As permissões disponíveis para esses perfis dependem do que foi configurado no papel global (módulo de Papéis e Permissões, #R16) somado ao que foi configurado na aba Time da jornada específica (#R7).

**RN 235** — Dashboards, listagens e Agenda dos perfis Gestor de Turma e Instrutor devem ser os mesmos do administrador, porém com os dados filtrados pelas jornadas a que esses perfis têm acesso.

---

## #R18 Permitir que o perfil Líder de Equipe acesse Execuções e Agenda apenas das pessoas que ele lidera {#r18}

**RN 236** — O perfil Líder de Equipe deve ter acesso apenas aos menus Execuções e Agenda.

**RN 237** — O Líder de Equipe deve visualizar APENAS as informações das pessoas que ele lidera (escopo restrito à sua equipe).

**RN 238** — Internamente, o "Líder de Equipe" é um Aluno com permissões extras, motivo pelo qual o menu "Equipe" aparece para esse perfil. Para fins do módulo Jornadas, ele tem visão sob escopo da sua equipe.

---

## #R19 Permitir que o aluno visualize e acesse jornadas no catálogo de conteúdos (Play) {#r19}

**RN 239** — No Play (catálogo de conteúdos), deve ser exibido um novo card do tipo "Jornada", visualmente similar aos cards de conteúdo já existentes.

### Card resumido da Jornada

**RN 240** — O card resumido da Jornada deve exibir:

- **RN 240.1** — Tipo de experiência (badge).
- **RN 240.2** — Nome da jornada.
- **RN 240.3** — Banner.

### Card detalhado da Jornada

**RN 241** — O card detalhado da Jornada deve ter as abas "Detalhes" e "Cronograma".

**RN 242** — A aba Detalhes deve exibir:

- **RN 242.1** — Botão de acesso (RN 244).
- **RN 242.2** — Botão Curtir.
- **RN 242.3** — Botão Salvar.
- **RN 242.4** — Botão Visualizar certificado.
- **RN 242.5** — Nome da jornada.
- **RN 242.6** — Badge com o tipo de experiência.
- **RN 242.7** — Badge com a classificação.
- **RN 242.8** — Duração da jornada (em dias/semanas/meses conforme configuração) — NÃO exibir datas, pois a jornada padrão não tem data fixa; a data depende da inscrição.
- **RN 242.9** — Carga horária.
- **RN 242.10** — Descrição da jornada.
- **RN 242.11** — Quantidade de tarefas.
- **RN 242.12** — Categorias.

**RN 243** — A aba Cronograma do card detalhado deve listar as tarefas contidas na jornada — porém as tarefas NÃO devem ser acessadas por este card. O acesso completo ocorre apenas após a inscrição, na página interna da jornada (#R20).

### Botão de acesso

**RN 244** — O botão de acesso do card pode assumir as seguintes nomenclaturas:

- **RN 244.1** — "Inscreva-se" — quando o usuário ainda NÃO está inscrito na jornada (abre o formulário de inscrição padrão).
- **RN 244.2** — "Acessar" — quando o usuário JÁ está inscrito na jornada (abre a página interna da jornada — ver #R20).

**RN 245** — Antes da inscrição, o card exibe apenas as informações resumidas (descrição, quantidade de tarefas, categorias, tipo, classificação e duração). NÃO deve ser exibida nesta versão uma miniatura/preview do calendário/cronograma — esse formato foi avaliado e descartado para v1.

---

## #R20 Permitir que o aluno execute uma jornada por meio de uma página interna com banner e calendário de tarefas {#r20}

**RN 246** — Ao clicar no botão "Acessar" do card da jornada, deve ser aberta uma nova página interna contendo, do topo para baixo:

- **RN 246.1** — Banner da jornada.
- **RN 246.2** — Componente de calendário (o mesmo da Agenda, #R15) listando as tarefas.

**RN 247** — A transição para a página interna deve apresentar um indicador visual de carregamento (loading) durante a abertura, melhorando o feedback ao usuário em relação ao comportamento atual do Pacote, que apresenta transição seca.

**RN 248** — O comportamento de carregamento desta página deve manter o mesmo padrão do Pacote nesta versão. A refatoração completa do card de Pacote NÃO está no escopo.

---

## #R21 Permitir que o aluno interaja com cada tipo de tarefa (Aprendizagem, Compromisso, Manual e Mensagem) conforme a regra do tipo {#r21}

**RN 249** — Os status possíveis de uma tarefa, na visão do aluno, são:

- **RN 249.1** — Pendente / No prazo — ainda dentro do período esperado.
- **RN 249.2** — Atrasada — já passou do dia em que deveria ter sido executada.
- **RN 249.3** — Concluída — manual ou automaticamente concluída pelos critérios. Exibir check (✓) quando concluída.

**RN 250** — NÃO existe o estado "Em andamento" para tarefas — a tarefa é Concluída ou não.

### Tarefa de Aprendizagem (visão aluno)

**RN 251** — Ao clicar em uma tarefa de Aprendizagem, deve ser aberto um modal contendo:

- **RN 251.1** — Nome da tarefa.
- **RN 251.2** — Data de início e término para a realização.
- **RN 251.3** — Tipo da tarefa.
- **RN 251.4** — Descrição.
- **RN 251.5** — Critério de conclusão — destacado no topo do modal.
- **RN 251.6** — Progresso atual — barra de progresso compatível com o critério (não é necessariamente percentual).
- **RN 251.7** — Lista de conteúdos vinculados à tarefa.

**RN 252** — Para cada conteúdo da lista devem ser exibidos: a ordenação, o banner do conteúdo, o nome, o tipo e a descrição do conteúdo. Conteúdos já concluídos anteriormente pelo aluno devem aparecer como Concluídos — não há necessidade de refazê-los.

**RN 253** — Quando a lista contiver APENAS conteúdos do tipo Curso ou Trilha, deve ser exibido o botão "Iniciar" no modal, que ao ser clicado deve redirecionar o aluno para o PRIMEIRO conteúdo da lista que ainda não esteja concluído.

**RN 254** — Quando a tarefa contiver APENAS um conteúdo do tipo Pacote, o botão "Iniciar" deve ser substituído por "Explorar pacote" — ao clicar, o aluno é redirecionado para a página do pacote, onde escolhe quais conteúdos quer realizar.

**RN 255** — Quando houver algum conteúdo do tipo Pacote, deve ser exibida uma seção informativa ao final do modal com o texto: "Sobre o pacote: O pacote agrupa diversos conteúdos e permite que você escolha quais deseja realizar e em quais deseja se inscrever."

**RN 256** — Ao clicar sobre um conteúdo do tipo Pacote, o aluno deve ser redirecionado para a página atual de listagem dos conteúdos do pacote.

### Tarefa de Compromisso ou Manual (visão aluno)

**RN 257** — Ao clicar em uma tarefa do tipo Compromisso ou Manual, deve ser aberto um modal contendo:

- **RN 257.1** — Nome da tarefa.
- **RN 257.2** — Data para realização.
- **RN 257.3** — Descrição da tarefa.
- **RN 257.4** — Link ou local de realização (quando preenchido).
- **RN 257.5** — Opção de Reagendar a tarefa, caso o usuário tenha essa permissão configurada.
- **RN 257.6** — Opção de "Marcar como realizada" — conclusão manual.

**RN 258** — Quando o reagendamento NÃO estiver habilitado para a tarefa (parâmetro "Permitir que esta tarefa seja reagendada pelo inscrito"), deve ser exibida apenas a opção "Marcar como realizada". Se passar do dia, a tarefa permanece marcada como Atrasada até ser concluída.

### Tarefa de Mensagem (visão aluno)

**RN 259** — A tarefa do tipo Mensagem NÃO possui ação para o aluno executar — é apenas um disparo automático (e-mail e/ou notificação). Pode ser exibida no calendário do aluno como informativa, sem modal de execução.

---

## #R22 Disponibilizar widgets de Tarefas e de Calendário para acompanhamento das tarefas da jornada pelo aluno {#r22}

**RN 260** — O módulo de Jornadas depende do projeto de Painéis Personalizados (Widgets), que internamente também utiliza a estrutura de Event.

> **Validar a seguinte possibilidade:** dependência do projeto de Widgets do Vini (RN 260–269).
> - Os widgets do aluno (Tarefas ampliado e Calendário novo) dependem de um projeto paralelo. Confirmar prontidão e contrato de integração com o time do Vini antes de comprometer o escopo do aluno.

**RN 261** — O administrador deve poder configurar painéis personalizáveis para o aluno (escolhendo nome do menu, abas e widgets disponíveis).

### Widget de Tarefas

**RN 262** — O widget de Tarefas (já existente) deve ser AMPLIADO para incluir as tarefas das Jornadas, com as seções: Atrasadas, Hoje e Próximas.

**RN 263** — O widget de Tarefas deve mostrar todas as tarefas com data atribuída ao aluno corrente.

**RN 264** — O escopo do widget deve ser RESTRITO às tarefas em que o aluno é o responsável (envolvido).

**RN 265** — O widget de Tarefas é o lugar centralizador onde o aluno tem visão geral de suas tarefas — em outras telas, ele precisa entrar em cada jornada individualmente.

### Widget de Calendário

**RN 266** — Deve ser criado um novo widget de Calendário equivalente à Agenda do administrador, porém com escopo do aluno.

**RN 267** — O widget de Calendário deve reaproveitar o mesmo componente de calendário utilizado nas demais telas do módulo (Agenda, página interna da jornada).

**RN 268** — O escopo do widget de Calendário deve ser RESTRITO às tarefas em que o aluno é o responsável.

**RN 269** — O administrador deve poder optar por disponibilizar o widget de Calendário no painel do aluno.

---

## #R23 Garantir as regras conceituais de Linha de Base, Reagendamento, Replanejamento e Recálculo de critérios de conclusão entre Jornada Padrão e Execuções {#r23}

### Separação Padrão x Execução

**RN 270** — O módulo deve separar conceitualmente em dois momentos distintos:

- **RN 270.1** — Jornada Padrão — estrutura/template criada pelo administrador (ex.: o RH monta o onboarding genérico da empresa ou de uma área).
- **RN 270.2** — Execução da Jornada — instância individual da execução da estrutura padrão, iniciada a partir da inscrição de cada participante. Pessoas inscritas em janeiro, fevereiro ou março terão o "dia 1", "dia 15" etc. relativos à sua própria data de inscrição.

**RN 271** — A Jornada Padrão funciona como a linha de base original. Quando uma execução é iniciada, a linha de base deve ser COPIADA para a execução. A partir desse momento, a execução vive de forma independente da Jornada Padrão e pode ser personalizada por participante (adicionar tarefas específicas, alterar datas etc.) sem afetar a Jornada Padrão.

> **Validar a seguinte possibilidade:** estratégia de cópia da linha de base para a execução (RN 271).
> - Confirmar com arquitetura como copiar a estrutura inteira (fases, tarefas, ações, períodos) por execução de forma performática e independente, e como o "dia ordinal" é resolvido em data real a partir do Dia de início da inscrição. Esse é o conceito-base do módulo.

### Reagendar x Replanejar

**RN 272** — Devem existir duas ações distintas para mudança de datas em uma execução, com efeitos diferentes:

- **RN 272.1** — Reagendar — muda a data efetiva da tarefa, mas a tarefa continua ATRASADA se a nova data ultrapassar a data prevista da linha de base. Exemplo: a reunião com a Adriana estava marcada para quinta-feira, ela não pôde, e foi remarcada para terça da semana seguinte — a tarefa permanece atrasada.
- **RN 272.2** — Replanejar — muda a LINHA DE BASE (a data prevista), e a tarefa NÃO fica atrasada. Aplicável quando há justificativa válida (ex.: a data caiu em feriado ou em evento da empresa). É uma mudança formal de cronograma.

**RN 273** — A permissão para Reagendar tarefas e Replanejar é controlada pela configuração de papel da aba Time da jornada (ver #R7), seguindo a mesma estrutura de permissão — sem criar perfil dedicado.

### Alterações na Jornada Padrão x Execuções em andamento

**RN 274** — Conforme regra v1 detalhada em RN 113 a RN 116: alterações feitas na Jornada Padrão NÃO PROPAGAM para execuções já em andamento. A regra simplifica a v1 e será reavaliada conforme feedback de cliente.

### Integrações com telas existentes

**RN 275** — A Jornada deve passar a aparecer nas telas existentes do sistema que exibem o histórico de aprendizagem de um usuário (tela detalhada do usuário do administrador), no mesmo padrão visual usado atualmente para Trilha:

- **RN 275.1** — Card do tipo "Jornada" listado junto com cursos, trilhas e pacotes consumidos pela pessoa, com status (Concluída, Em andamento, Cancelada) e link para detalhe.
- **RN 275.2** — Conteúdos consumidos dentro das tarefas de Aprendizagem da jornada continuam aparecendo individualmente também, da mesma forma como hoje a Trilha exibe a trilha em si e os cursos dela.

---

## Itens Fora de Escopo desta Versão {#fora-de-escopo}

Os itens abaixo NÃO fazem parte do escopo desta versão e devem ser registrados como melhorias futuras ou backlog do produto:

- Integração com Microsoft Teams (criar reunião automaticamente).
- Integração com Google Calendar / Outlook (sincronizar compromissos automaticamente na agenda do aluno).
- Tarefas com hora (apenas dia).
- Pontuação para jornadas.
- Resposta de questionário em jornadas.
- Frequência e Desempenho como critérios de conclusão.
- Tradução automática de e-mails e notificações.
- Reordenação de tarefas no cronograma via drag and drop.
- Refatoração da página interna do Pacote (manter a transição atual com apenas o ajuste de adicionar loading).
- Componentização global do campo multi-select de conteúdo — criar apenas para esta tela; tornar global em fase futura.
- Gatilhos específicos de inscrição automática ("quando terminar X, inscrever em Y").
- Edição dos Papéis Padrão (Administrador, Gestor, Instrutor, Aluno) — apenas Visualizar nesta versão.
- Status granulares de finalização (Concluída Aprovado, Reprovado, Incompleta, Desistente após início) — modelagem prepara, implementação fica para fase futura.
- Inativação de tarefa do cronograma — a modelagem deve permitir a evolução, mas a funcionalidade não está nesta versão.
- Compartilhamento de jornadas entre ambientes via Twygo Studio — o filtro Autor/Ambiente Provedor entra preparado, mas a funcionalidade fica para fase futura.
- Venda de inscrição em jornada — manter ganchos prontos na aba Acesso, oculto nesta versão.
- Tipos de tarefa especializados (Pesquisa, Avaliação, Prova) — em análise para fases futuras.
- Conteúdo adaptativo (fluxo da jornada ajustado dinamicamente por mini-assessments) — direção futura, fora desta versão.
- Extração de dados (CSV) no menu Agenda — a primeira fase não inclui Extrair dados na Agenda; será reavaliado.

---

## Pontos a Validar e Decisões Pendentes {#pontos-a-validar}

### A definir pelo time de Produto

- Switch x Checkbox em permissões: revisar o padrão final com Caio e Max.
- CSV no menu Agenda: incluir ou manter apenas PDF.
- Aba Aprendizagem da jornada: confirmar se mantém ou oculta a sub-aba "Histórico".
- Definir filtros padrão da tela de Papéis e Permissões.
- Componente Ajuste Rápido final: slider infinito vs. number picker estilo iPhone (proposta a testar usabilidade).
- Comportamento ao concluir um conteúdo dentro de uma tarefa de Aprendizagem: como retornar à modal/tela correta da tarefa.

### A validar com Arquitetura

- Modelagem da Jornada como Event — confirmar com a referência de arquitetura (Vini).
- Reaproveitamento do componente de Calendário (POC do Alexandre).
- Reuso do widget de Tarefas (projeto do Vini).

### Bugs a investigar / corrigir durante o desenvolvimento

- Visualização em grade da tabela padrão exibindo as três primeiras colunas: comportamento inconsistente — investigar.
- Scroll lateral + vertical em tabelas: bug atual em que o scroll lateral só fica acessível após descer com o scroll vertical. Deve ser corrigido ao construir o componente do cronograma.

---

## Controle de versão {#controle-de-versao}

| Versão | Data | Alterado por | O que foi alterado |
|---|---|---|---|
| 01 | 27.05.2026 | Equipe Produto Twygo | Criação do documento: RN 1 a RN 275. |
