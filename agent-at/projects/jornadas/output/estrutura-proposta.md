---
aprovada: true
project: jornadas
generated_at: 2026-07-31T11:39:32-03:00
docs_lidos: [discovery.md, spike.md, documentacao-completa.md, especificacao.docx, regras.txt]
docs_pulados: []
---

# Proposta de Estrutura — Jornadas

## Suíte: Acesso ao módulo e navegação por perfil
- **Executor:** playwright
- **Playbooks:** super-admin, perfil-switch, flipper
- **Org:** principal
- **Pré-condições:**
  - Funcionalidade Jornadas habilitada no contrato da organização.
  - Eventual feature flag do módulo ativa.
  - Usuários de teste disponíveis nos perfis Administrador, Gestor de Turma, Instrutor, Líder de Equipe e Aluno.

## Suíte: Listagem e gestão de Jornadas Padrão
- **Executor:** playwright
- **Playbooks:** filtro-drawer, cleanup-dados, toast-chakra
- **Org:** principal
- **Pré-condições:**
  - Usuário logado como Administrador.
  - Jornadas com diferentes situações, tipos, classificações, inscrições e níveis de progresso cadastradas.
  - Jornada sem engajamento e jornada com engajamento disponíveis para validar exclusão.

## Suíte: Identificação da Jornada Padrão
- **Executor:** playwright
- **Playbooks:** switch-chakra, cleanup-dados, toast-chakra, beforeunload
- **Org:** principal
- **Pré-condições:**
  - Usuário logado como Administrador com permissão para criar e editar jornadas.
  - Tipos de experiência, classificações e categorias previamente cadastrados.

## Suíte: Acesso e regras de inscrição
- **Executor:** playwright
- **Playbooks:** switch-chakra, cleanup-dados, beforeunload
- **Org:** principal
- **Pré-condições:**
  - Jornada Padrão em edição.
  - Usuário logado como Administrador com permissão de alteração.
  - Massa com períodos de vigência, grupos e regras de confirmação disponível.

## Suíte: Banners da Jornada Padrão
- **Executor:** playwright
- **Playbooks:** cleanup-dados, toast-chakra, beforeunload
- **Org:** principal
- **Pré-condições:**
  - Jornada Padrão em edição e usuário Administrador autorizado.
  - Arquivos de imagem válidos e inválidos disponíveis para os quatro formatos de banner.

## Suíte: Aprovação, certificado e recálculo
- **Executor:** playwright
- **Playbooks:** switch-chakra, cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Jornada com tarefas e participantes em percentuais de progresso distintos.
  - Modelos de certificado ativos disponíveis.
  - Usuário Administrador com permissão de acompanhamento e emissão.

## Suíte: Time, papéis e permissões da jornada
- **Executor:** playwright
- **Playbooks:** perfil-switch, cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Jornada Padrão em edição.
  - Papéis padrão e personalizados cadastrados.
  - Pessoas elegíveis para vínculos fixos e dinâmicos disponíveis.

## Suíte: Cronograma em Kanban
- **Executor:** playwright
- **Playbooks:** cleanup-dados, beforeunload
- **Org:** principal
- **Pré-condições:**
  - Jornada Padrão em edição com duração configurada.
  - Massa com cronograma vazio, cronograma extenso e cronograma com engajamento disponível.

## Suíte: Cadastro de fases
- **Executor:** playwright
- **Playbooks:** cleanup-dados, toast-chakra, beforeunload
- **Org:** principal
- **Pré-condições:**
  - Jornada Padrão com aba Cronograma acessível.
  - Usuário Administrador com permissão de alteração do cronograma.

## Suíte: Cadastro de tarefas
- **Executor:** playwright
- **Playbooks:** cleanup-dados, toast-chakra, beforeunload
- **Org:** principal
- **Pré-condições:**
  - Jornada com e sem fases cadastradas.
  - Conteúdos, categorias, tipos de experiência e classificações disponíveis.
  - Papéis do Time disponíveis como envolvidos.

## Suíte: Ações automáticas
- **Executor:** playwright
- **Playbooks:** cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Tarefas dos quatro tipos disponíveis para edição.
  - Modelos de e-mail, remetentes e conteúdos elegíveis cadastrados.
  - Infraestrutura de e-mail e notificações habilitada no ambiente.

## Suíte: Inscrições da Jornada Padrão
- **Executor:** playwright
- **Playbooks:** filtro-drawer, cleanup-dados, toast-chakra
- **Org:** principal
- **Pré-condições:**
  - Jornada configurada com papéis de vínculo definido na inscrição.
  - Participantes nas situações Confirmada, Pendente, Cancelada e Desistente disponíveis.
  - Usuário Administrador com permissão de gerenciar inscrições.

## Suíte: Listagem e acompanhamento de execuções
- **Executor:** playwright
- **Playbooks:** filtro-drawer, cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Execuções em todas as situações e faixas de progresso disponíveis.
  - Participantes aprovados e não aprovados com certificados pendentes, emitidos, expirados e aguardando assinatura.
  - Usuário Administrador com acesso completo às execuções.

## Suíte: Detalhe da execução e auditoria
- **Executor:** playwright
- **Playbooks:** filtro-drawer
- **Org:** principal
- **Pré-condições:**
  - Execução com histórico de ações manuais e automáticas disponível.
  - Log contém ações realizadas por usuário, terceiro e Sistema.
  - Usuário Administrador com permissão de visualizar detalhes.

## Suíte: Agenda de tarefas
- **Executor:** playwright
- **Playbooks:** filtro-drawer
- **Org:** principal
- **Pré-condições:**
  - Tarefas passadas, atuais e futuras em múltiplas jornadas e execuções disponíveis.
  - Massa com tarefas repetidas para validar agrupamento.
  - Usuário Administrador com acesso à Agenda.

## Suíte: Papéis e Permissões customizados
- **Executor:** playwright
- **Playbooks:** cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Usuário logado como Administrador com acesso ao módulo auxiliar.
  - Papéis padrão e ao menos um papel personalizado cadastrados.
  - Catálogo de permissões de Jornada disponível.

## Suíte: Escopo de Gestor de Turma e Instrutor
- **Executor:** playwright
- **Playbooks:** perfil-switch
- **Org:** principal
- **Pré-condições:**
  - Gestor de Turma e Instrutor vinculados a algumas jornadas e não vinculados a outras.
  - Permissões globais e locais configuradas em combinações distintas.

## Suíte: Escopo do Líder de Equipe
- **Executor:** playwright
- **Playbooks:** perfil-switch
- **Org:** principal
- **Pré-condições:**
  - Líder de Equipe com pessoas lideradas e usuários fora de sua equipe.
  - Execuções e tarefas de Agenda existentes para ambos os grupos.

## Suíte: Jornada no catálogo Play
- **Executor:** playwright
- **Playbooks:** perfil-switch
- **Org:** principal
- **Pré-condições:**
  - Usuário logado como Aluno.
  - Jornadas visíveis com aluno inscrito e não inscrito, banners e metadados preenchidos.

## Suíte: Página interna da jornada do aluno
- **Executor:** playwright
- **Playbooks:** perfil-switch
- **Org:** principal
- **Pré-condições:**
  - Aluno inscrito em jornada com execução iniciada.
  - Jornada contém banner e tarefas distribuídas em diferentes datas.

## Suíte: Interação do aluno com tarefas
- **Executor:** playwright
- **Playbooks:** perfil-switch, cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Aluno inscrito em jornada com tarefas de Aprendizagem, Compromisso, Manual e Mensagem.
  - Massa contém Curso, Trilha e Pacote, incluindo conteúdo concluído previamente.
  - Há tarefas com e sem permissão de reagendamento.

## Suíte: Widgets de Tarefas e Calendário
- **Executor:** playwright
- **Playbooks:** perfil-switch
- **Org:** principal
- **Pré-condições:**
  - Projeto de Painéis Personalizados/Widgets disponível e integrado a Jornadas.
  - Painel do Aluno configurado com widgets de Tarefas e Calendário.
  - Aluno possui tarefas atrasadas, de hoje e futuras, próprias e de terceiros.

## Suíte: Linha de base, reagendamento e replanejamento
- **Executor:** playwright
- **Playbooks:** cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Jornada Padrão com fases, tarefas, ações automáticas e time configurados.
  - Execuções iniciadas em datas distintas, incluindo uma anterior a alterações na Jornada Padrão.
  - Usuários com e sem permissões de reagendar e replanejar disponíveis.

## Suíte: Isolamento entre organizações
- **Executor:** playwright
- **Playbooks:** ambientes-adicionais, perfil-switch
- **Org:** secundario
- **Pré-condições:**
  - Jornadas habilitado em DUAS organizações (a principal e a secundária).
  - Qual org faz o papel de secundária NÃO é fixada aqui: o QA escolhe o profile e informa e-mail/senha em Conexão → "organizações adicionais". A AT só declara que a suíte precisa de uma.
  - Jornada, execuções, inscrições e tarefas existentes em cada uma das duas orgs, com nomes distinguíveis.
  - Usuário da org secundária SEM nenhum vínculo com os dados da principal.