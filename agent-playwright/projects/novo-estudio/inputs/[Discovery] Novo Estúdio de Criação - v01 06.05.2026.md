| Campo | Valor |
|---|---|
| **Discovery** | Novo Estúdio de Criação - v01 06.05.2026 |
| **Objetivo** | Substituir a tela atual de edição de atividades por um Estúdio unificado em que o instrutor lista atividades, faz preview inline e edita/gera conteúdo via copiloto IA com geração particionada (roteiro → slides → imagens → áudios → renderização) e versionamento rascunho/publicado, mantendo a possibilidade de criação 100% manual. O Estúdio convive com a tela antiga durante migração gradual via feature flag — sem big bang. |
| **Figma** | [Cloud Twygo Prototype — Novo Estúdio](#) (Ctrl + clique para acessar — branch experimental do Caio, link a definir) |
| **Fontes** | 8 transcrições em `transcricoes/transcricao-*.md` (Freela 26/02 → Refinamento 06/05/2026, ~08h17 de reunião) |
| **Entrega-alvo** | CBTD (Congresso Brasileiro de T&D) — Junho/2026, São Paulo |
| **Esforço estimado (freela)** | 115 h para o projeto 1 (Estúdio + Kit de Marca + Modelo) |

## Sumário

- [Prioridade de entrega — P1, P2, P3](#prioridade-de-entrega)
- [#R1 Iniciar criação via cards de Curso, Trilha e Pacote](#r1)
- [#R2 Apresentar Estúdio de Criação como tela única em três colunas](#r2)
- [#R3 Reordenar e persistir abas por usuário; renomear "Gerenciar" → "Editar"](#r3)
- [#R4 Configurar identificação do curso com seções e campos para IA](#r4)
- [#R5 Listar atividades com card-rich, badges de etapa, scroll infinito e jump-to](#r5)
- [#R6 Renomear tipo e ícone por atividade](#r6)
- [#R7 Pré-visualizar atividade selecionada inline](#r7)
- [#R8 Versionar conteúdo via rascunho paralelo (P3)](#r8)
- [#R9 Operar copiloto contextual com Canva Mode e histórico por usuário×curso](#r9)
- [#R10 Gerar conteúdo de aula/página via IA em sequência fixa](#r10)
- [#R11 Adicionar múltiplas atividades em massa via copiloto](#r11)
- [#R12 Renderizar versão publicada de forma assíncrona](#r12)
- [#R13 Manter criação 100% manual (paridade com fluxo atual)](#r13)
- [#R14 Suportar mobile minimamente como requisito de venda (P3)](#r14)
- [#R15 Coexistir com tela antiga via rota nova e feature flag](#r15)
- [#R16 Duplicar curso a partir do Estúdio ("Salvar como novo") (P3)](#r16)
- [Controle de versão](#controle-de-versão)

---

## Prioridade de entrega

Decisão de cronograma firmada na reunião de refinamento de 06/05/2026: a entrega do CBTD junho/2026 prioriza **P1** (núcleo) e **P2** (desejável). Itens **P3** entram **se houver tempo no fim do release**; caso contrário, ficam para release seguinte sem comprometer a apresentação no congresso.

| Prioridade | #Rs | Motivo |
|---|---|---|
| **P1 — Bloqueante (release CBTD)** | #R1, #R2, #R3, #R4, #R5, #R7, #R9, #R10, #R11, #R13, #R15 | Núcleo do Estúdio: criação, layout, copiloto, geração IA básica, manual e coexistência com a tela antiga. Sem isso não tem demo. |
| **P2 — Desejável** | #R6, #R12 | Renomeio de tipo/ícone e renderização assíncrona. Útil mas não bloqueia a primeira demo. |
| **P3 — Última prioridade ("se der tempo")** | #R8, #R14, #R16 | Versionamento rascunho/publicado, mobile e "Salvar como novo". Time concordou em 06/05 que estes têm o maior esforço marginal e podem ser despriorizados se o cronograma apertar. |

> **Premissa:** rebaixar #R8 para P3 vai contra o desejo original da Adriana (08/04) de evitar "aluno consumindo aula em renderização" — mas o time aceitou em 06/05 que o risco é conhecido e administrável até a entrega de v2 (pós-CBTD). Caso o cronograma permita, #R8 entra; caso não, fica documentado para release seguinte (Spike S1 fica em standby).

---

## #R1 Iniciar criação via cards de Curso, Trilha e Pacote

A entrada para criação muda de "botão Adicionar com select de tipo" para uma tela de **3 cards explicativos** (Curso, Trilha, Pacote), com texto curto abaixo de cada card explicando o que é. Motivo: cliente confirmou em campo (Karen) que não sabe o que é "Pacote" — texto contextual evita o suporte ter que explicar caso a caso.

**RN 1** — A ação "Adicionar" na listagem de Conteúdos abre uma página dedicada com 3 cards, na ordem fixa: **Curso**, **Trilha**, **Pacote**. Cada card tem ícone, título e parágrafo curto descritivo (1-2 linhas) explicando para que serve.

- **RN 1.1** — Pacote sempre é o último card.
- **RN 1.2** — Os cards substituem a abertura direta da tela de edição. A nova tela é uma página própria (não modal/drawer), seguindo o padrão atual do produto.
- **RN 1.3** — Selecionar **Curso** leva ao Estúdio de Criação (#R2) com curso vazio. Selecionar **Trilha** ou **Pacote** segue o caminho atual da plataforma (não muda neste PRD).
- **RN 1.4** — A ação atual "Criar curso com IA" (assistente de 4 passos) **continua existindo** como caminho alternativo, acessível a partir de uma chamada complementar dentro da listagem de Conteúdos. O Estúdio coexiste com o assistente — não substitui.

> **Premissa:** o assistente atual (4 passos) só será revisitado em PRD futuro, quando houver feedback dos clientes do CBTD. Confirmado por Adriana e Rovino no comitê 08/04 ("não vamos mexer no que já está pronto sem ouvir o cliente").

---

## #R2 Apresentar Estúdio de Criação como tela única em três colunas

O Estúdio é a substituição da aba "Atividades" do gerenciamento de curso. Centraliza: lista de atividades, preview do que o aluno vê, e copiloto IA. Resolve o problema atual de fragmentação (criar curso → sair → reentrar → editar separadamente).

**RN 2** — A aba/tela atual chamada "Atividades" do gerenciamento de curso é **substituída** pelo Estúdio de Criação. As demais abas (Identificação, Modelo, Banner, Certificado, etc.) continuam existindo no mesmo nível, irmãs do Estúdio.

**RN 3** — O Estúdio tem layout em 3 colunas:

- **RN 3.1** — Esquerda: lista de atividades (#R5).
- **RN 3.2** — Centro: preview da atividade selecionada (#R7).
- **RN 3.3** — Direita: copiloto IA em formato de **drawer** (#R9), expansível até ~50% da largura da tela. Pode ser fechado para dar foco ao conteúdo.

**RN 4** — O menu lateral principal da plataforma deve ser **colapsável** (recolher para ícones ou ocultar inteiramente) para liberar espaço horizontal — o Estúdio é uma tela com muita informação simultânea.

**RN 5** — O Estúdio é otimizado para resolução **1366 × 720** (mediana real dos clientes da Twygo). Resoluções maiores são cobertas, mas o layout-base não pode quebrar em 1366. Resoluções menores caem em #R14 (mobile).

> **Premissa:** o redesenho do menu lateral colapsável fica como tarefa transversal — o Estúdio é o primeiro consumidor desse padrão, e ele pode ser estendido para outras telas posteriormente.

---

## #R3 Reordenar e persistir abas por usuário; renomear "Gerenciar" → "Editar"

A reclamação dos clientes (e do time interno) é que cada vez que se edita um curso, é preciso navegar pelas mesmas abas na mesma ordem. A nova abordagem deixa o instrutor reorganizar as abas como preferir e abrir o curso na última aba que usou.

**RN 6** — A ação atualmente chamada "Gerenciar curso" na listagem é renomeada para **"Editar curso"**. Reflete melhor a operação real (o que o usuário faz é editar, não gerenciar).

**RN 7** — As abas dentro de "Editar curso" passam a ser **reordenáveis via drag & drop**. O ícone de drag aparece ao passar o mouse sobre o título da aba.

- **RN 7.1** — A nova ordem fica salva por **usuário** (não por organização nem por curso). Persistência em banco — não em cookie/local storage.
- **RN 7.2** — Ao abrir um curso para edição, a UI carrega a ordem que aquele usuário definiu.
- **RN 7.3** — Cada usuário também tem registrada a **última aba aberta** naquele curso. Próxima abertura do mesmo curso retorna a essa aba (não para a primeira da lista).
- **RN 7.4** — A primeira aba (Identificação) **fica travada** — não pode ser movida. Motivo: ao criar curso novo, o ponto de partida deve ser sempre a Identificação, evitando estado em que o instrutor abre um curso novo direto na aba "Atividades" sem nome cadastrado. Decisão registrada em 06/05.

**RN 8** — Cada aba mantém o comportamento atual de **salvar independente** (botão "Salvar" próprio por aba; modificar uma aba e ir para outra sem salvar pede confirmação ou descarta).

> **Premissa:** o modelo de persistência reusa o conceito existente de `OrganizationSetting` ou similar, no escopo `User × Organization` — implementação via tabela `user_course_preferences` com colunas `tab_order` (JSON array) e `last_tab` (string). Confirmar reuso versus nova tabela em S2.

---

## #R4 Configurar identificação do curso com seções e campos para IA

A aba "Identificação" continua existindo, mas ganha campos novos que nutrem a geração por IA, organizados em seções para não poluir.

**RN 9** — A aba "Identificação" preserva os campos atuais (nome, descrição, idioma, etc.) e ganha **3 campos novos** dedicados ao contexto da IA:

- **RN 9.1** — `Idade` — faixa etária do público-alvo (input livre ou select de faixas).
- **RN 9.2** — `Dificuldade` — nível esperado (iniciante, intermediário, avançado, ou similar).
- **RN 9.3** — `Tom de voz` — formal, descontraído, técnico, etc.

**RN 10** — Os campos são organizados em **seções** (não em sub-abas). Sections agrupadas por tema (ex.: "Básico", "Caracterização", "Configurações de IA"). Cada section tem cabeçalho e tooltip explicativo.

**RN 11** — A section "Configurações de IA" tem tooltip indicando explicitamente: "Estes campos são usados pela IA na geração de conteúdo. Quanto mais preenchidos, melhor o resultado."

**RN 12** — O copiloto está disponível também na aba Identificação, mas **isolado** (sem manipular o formulário diretamente). O instrutor pede sugestões de descrição/objetivo, recebe texto, e copia/cola manualmente. Justificativa: manipular formulário via IA é complexidade alta para retorno baixo neste release.

> **Premissa:** o campo "Plano de conteúdo" discutido em reuniões anteriores **não vira aba separada** — foi descartado por confundir o usuário (Rovino se confundiu na demo de 08/04). Os campos de plano de conteúdo entram nas seções da Identificação ou são preenchidos no chat com o copiloto.

---

## #R5 Listar atividades com card-rich, badges de etapa, scroll infinito e jump-to

O coração do Estúdio. Cada atividade vira um card-rich na coluna esquerda, com indicação visual do que está pronto e do que falta. Suporta cursos de 3000+ atividades sem perder usabilidade.

**RN 13** — A coluna esquerda do Estúdio lista as atividades verticalmente. Cada atividade é renderizada como **card-rich** contendo:

- **RN 13.1** — Checkbox de seleção (para ações em massa).
- **RN 13.2** — Drag handle (mãozinha + ícone) para reordenação por drag & drop.
- **RN 13.3** — Posição numérica (1, 2, 3...) — calculada automaticamente, sem campo editável.
- **RN 13.4** — Tipo da atividade (renomeável — ver #R6).
- **RN 13.5** — Nome da atividade.
- **RN 13.6** — Badges de etapas indicando o status de cada parte do conteúdo (ver RN 14).

**RN 14** — As **badges de etapa** dependem do tipo da atividade:

- **RN 14.1** — Para `Lesson` (aula): 5 badges — `Roteiro`, `Slides`, `Imagens`, `Áudios`, `Renderização`. Letras curtas no card (R, S, I, U, R) com tooltip do nome completo.
- **RN 14.2** — Para `Page` (página): 3 badges — `Roteiro`, `Conteúdo`, `Imagens`.
- **RN 14.3** — Para os demais tipos (Vídeo, PDF, SCORM, Game, Questionário, Texto): apenas badge de "Pendente" ou "Pronto" (sem subdivisão em etapas).
- **RN 14.4** — Cor verde quando a etapa está completa, cinza/laranja quando pendente, cinza-claro quando opcional (ver RN 36.4).
- **RN 14.5** — Card sem nenhuma pendência (todas verdes ou opcionais resolvidas) **não exibe** as badges (limpa visualmente).
- **RN 14.6** — Tooltip ao passar mouse sobre uma badge mostra o detalhe da etapa (ex.: "Roteiro: 4 cenas geradas, aguardando aprovação").
- **RN 14.7** — As badges são **clicáveis**. Click em uma badge específica (ex.: "I" da aula 3) abre o copiloto **já contextualizado** para gerar/regerar aquela etapa, com prompt-template do tipo "Você quer que eu gere as imagens da aula 3? Confirme abaixo." Reduz fricção de localizar a ação no chat. Decisão registrada em 06/05.

**RN 15** — A reordenação via drag & drop dispara uma chamada de API ao soltar (não em batch). Resposta de sucesso atualiza a posição visualmente.

**RN 16** — A lista usa **scroll infinito real** (decisão D4): backend pagina (50 atividades por página por padrão). Ao rolar para o final da página atual, próxima leva é carregada automaticamente.

- **RN 16.1** — Suporta clientes Enterprise com 3000+ atividades sem comprometer performance percebida.
- **RN 16.2** — Reordenação em curso parcialmente carregado mantém a hierarquia correta (resolve bug atual da paginação que perde relação pai-filho ao mover atividade entre páginas não-carregadas).

**RN 17** — Botão **"Ir para atividade X"** no topo da lista permite jump direto via número de posição. Útil em cursos longos.

- **RN 17.1** — O input aceita número da posição. Ao confirmar, o backend retorna a página que contém essa posição e o frontend rola até o card.

**RN 18** — Adicionar nova atividade pelo botão "Adicionar":
- **RN 18.1** — Se houver atividade selecionada na lista, a nova é criada **logo depois dela** (não no final).
- **RN 18.2** — Se nada estiver selecionado, vai para o final (comportamento atual).
- **RN 18.3** — Resolve a reclamação atual de "criei e ficou no final, agora preciso arrastar 100 posições para cima".
- **RN 18.4** — Ações simples (excluir atividade, salvar, criar nova) **não pedem confirmação extra**. Feedback explícito do PO em 06/05 ("não tem razão pedir confirmação no salvar"). Edição destrutiva (ex.: descartar rascunho — quando #R8 estiver entregue) mantém confirmação.

> **Validar a seguinte possibilidade:**
> - Performance do scroll infinito + drag & drop + reorder API em listas de 5000+ atividades. Caso real reportado: cliente com 3000 atividades hoje sofre.
> - Modelo de paginação no backend: keyset (cursor) ou offset? Como tratar reordenação que cruza fronteiras de página?
> - Hierarquia pai-filho: drag & drop pode mover uma atividade-filha para fora da pai? Atividade pai inteira leva os filhos junto?

---

## #R6 Renomear tipo e ícone por atividade

O nome técnico do tipo de atividade ("Vídeo Upload", "SCORM", "Texto") vaza hoje para o aluno em vários lugares (card no Play, lista de progresso). Solução: cada atividade ganha um label e ícone customizáveis pelo instrutor.

**RN 19** — Cada `EventContent` ganha dois campos novos: `display_label` (string) e `display_icon` (chave de ícone do conjunto Google Icons).

- **RN 19.1** — Default `display_label` = nome do tipo atual ("Vídeo Upload", "SCORM", "Aula", "Página", etc.).
- **RN 19.2** — Default `display_icon` = ícone atual do tipo.
- **RN 19.3** — `display_label` é obrigatório; `display_icon` herda do tipo se não for setado.

**RN 20** — A escolha de label/ícone é feita **na atividade individual** (campo no formulário de cadastro/edição da atividade). Não há configuração no nível organização nem curso (decisão D3).

**RN 21** — Onde o tipo aparece para o instrutor (lista de atividades do estúdio, card de criação) — usa `display_label`.

**RN 22** — Onde o tipo aparece para o aluno (card no Play, lista de conteúdo do curso, breadcrumb) — usa `display_label`.

- **RN 22.1** — Exceção: para `SCORM`, o `display_label` default no Play do aluno é **"Conteúdo"** (não "Conteúdo SCORM"). O instrutor vê "Conteúdo SCORM" na sua interface; o aluno vê "Conteúdo".

> **Validar a seguinte possibilidade:**
> - Migração: para registros existentes (`EventContent` que não tem `display_label`), o que fazer? Backfill com nome do tipo atual via runner, ou render condicional no app (`display_label || tipo.name`)?
> - i18n triplo: o `display_label` é texto livre — assumir que o instrutor escreve no idioma do conteúdo, ou suportar fallback por organização default?

---

## #R7 Pré-visualizar atividade selecionada inline

A coluna central do Estúdio mostra a atividade selecionada exatamente como o aluno veria, sem precisar abrir "Visualizar como aluno" em nova tela.

**RN 23** — Ao selecionar uma atividade na lista esquerda, a coluna central renderiza o **preview do conteúdo**:

- **RN 23.1** — `Lesson` (aula): player de vídeo navegável (cenas).
- **RN 23.2** — `Page` (página): render do template com conteúdo, igual ao aprender.
- **RN 23.3** — `Questionnaire` (questionário): preview com aviso "perguntas em modo aleatório" se configurado.
- **RN 23.4** — `Video`, `PDF`, `SCORM`, `Game`, `Embed`: igual ao componente do aprender.

**RN 24** — Preview é **simplificado** — não simula timer mínimo de permanência, não dispara modais de aprovação, não marca progresso. Para isso o instrutor abre "Visualizar como aluno" (#R24.1).

- **RN 24.1** — A ação "Visualizar como aluno" continua existindo separadamente (nova tela cheia, simula a UX completa do aluno).

**RN 25** — O preview reage a edições no copiloto em tempo real (Canva Mode — ver RN 35).

**RN 26** — Botão "Editar" sobre o preview leva o instrutor à edição da atividade (modal/drawer com Plate.js para `Page`, Fabric para `Lesson`). O editor não é alterado neste release (premissa firmada em D4 do extract).

- **RN 26.1** — O ato de **editar manualmente** o conteúdo da página (Plate.js) ou da aula (Fabric.js) **conclui automaticamente a etapa "Roteiro"** do card (ver RN 36.6). Permite ao instrutor que escreve à mão avançar no fluxo sem passar pela IA.

> **Premissa:** SCORM com timer mínimo de permanência, embed com iframe externo e SCORM com tracking de progresso continuam exigindo "Visualizar como aluno" para teste completo. Preview central é só leitura visual.

---

## #R8 Versionar conteúdo via rascunho paralelo (P3)

> **Prioridade de release: P3 — última prioridade.** Decisão de 06/05: pode ficar para release seguinte se o cronograma do CBTD apertar. As RNs abaixo definem a arquitetura-alvo. Spike S1 fica em standby até o sinal verde. Sem #R8 entregue, o comportamento atual (edição em produção é imediata) é mantido — risco conhecido pelo time.

Quando entregue, edições no conteúdo viram **rascunho** paralelo, e só são vistas pelo aluno após "Publicar".

**RN 27** — O `EventContent` ganha mecânica de rascunho via novo registro paralelo:

- **RN 27.1** — Quando o instrutor edita um conteúdo, o sistema cria/atualiza um `EventContent` separado com FK para o original (`parent_event_content_id`) e flag `is_draft = true`.
- **RN 27.2** — O aluno consome **somente** os `EventContent` com `is_draft = false` (publicados). Rascunhos são invisíveis para o aluno.
- **RN 27.3** — O instrutor enxerga o rascunho no Estúdio (com indicação visual "rascunho").

**RN 28** — O instrutor publica o rascunho via botão **"Publicar alterações"** no topo do Estúdio.

- **RN 28.1** — Publicar dispara: a) renderização (#R12), b) marca o rascunho como `is_draft = false` ao concluir, c) o `EventContent` anteriormente publicado ganha flag de versão antiga (não é descartado — vira histórico).
- **RN 28.2** — Histórico de versões publicadas é mantido como linhas distintas, permitindo rollback futuro (não implementado neste PRD, mas a estrutura suporta).

**RN 29** — Aluno em meio a uma aula quando uma nova versão é publicada **continua na versão antiga** que estava consumindo. Não é forçado para a nova nem vê aviso. Próxima sessão dele pega a versão atual.

- **RN 29.1** — Tracking de progresso e tentativas continuam atrelados ao `EventContent` que o aluno estava consumindo (não migram automaticamente para a nova versão).

> **Validar a seguinte possibilidade:**
> - Modelagem detalhada: o `parent_event_content_id` aponta para a versão original ou para o que estava publicado no momento da edição? Como tratar ramificações (instrutor edita, abandona, edita de novo — vai criar 2 rascunhos paralelos ou substituir o anterior)?
> - Limpeza: rascunhos não publicados há X dias são descartados? Storage/`historic` se a versão tem assets pesados (vídeo renderizado).
> - Migração: `EventContent` existente vira `is_draft = false` por default. Não há cópia — o registro existente é a "versão publicada inicial".

---

## #R9 Operar copiloto contextual com Canva Mode e histórico por usuário×curso

O copiloto é o motor de IA do Estúdio. Drawer lateral, contextual, com histórico privado por usuário×curso, modo Canva (split com geração ao vivo) e atalhos.

**RN 30** — O copiloto fica disponível como **drawer à direita** no Estúdio, com 3 formas de abrir:

- **RN 30.1** — Ícone flutuante com pulse animation (estrela) no canto inferior direito.
- **RN 30.2** — Atalho de teclado **`Ctrl+J`** (escolha não conflita com padrões comuns Ctrl+B/C/V/F).
- **RN 30.3** — Pode ser fechado/colapsado via X ou outro Ctrl+J.

**RN 31** — O drawer ocupa por padrão ~30% da largura. Pode ser **expandido até ~50%** via botão. Em mobile, vira tela cheia (#R14).

**RN 32** — A cada interação, o copiloto recebe automaticamente o **contexto da página atual**:
- Curso (id, nome, identificação preenchida).
- Aba ativa (Atividades vs Identificação vs Modelo etc.).
- Atividades selecionadas na lista.
- Conteúdo da atividade aberta no preview.

**RN 33** — Conversas são separadas por contexto de aba — uma conversa para "Atividades", outra para as demais abas. Trocar de aba **troca automaticamente** a conversa visível.

**RN 34** — Histórico é por **usuário × curso** (decisão D5):

- **RN 34.1** — Cada instrutor tem seu próprio histórico naquele curso (instrutor A não vê chat de instrutor B no mesmo curso).
- **RN 34.2** — Possibilidade de **criar nova conversa** (estilo ChatGPT). Conversa antiga fica no histórico, acessível via list lateral dentro do drawer.
- **RN 34.3** — **Título** da conversa gerado automaticamente nas primeiras 1-2 interações (LLM gera título curto baseado no início).
- **RN 34.4** — **Resumo automático** de contexto quando a conversa fica grande (estilo Cloud Code: "vou resumir esta conversa"). Necessário para evitar contexto inflado nas chamadas LLM.
- **RN 34.5** — Retenção: 90 dias após a última interação. Após isso, conversa é sumarizada (mensagem-resumo única) e mensagens individuais descartadas para liberar storage.
- **RN 34.6** — Ao **duplicar/copiar** um curso (#R16), o histórico de chat **não é copiado** — começa zerado no novo curso.

**RN 35** — Quando o copiloto inicia uma geração que afeta o conteúdo, a tela entra em **Canva Mode**:

- **RN 35.1** — Chat à esquerda (drawer expandido), preview central reage em tempo real à medida que a IA gera.
- **RN 35.2** — Tela escurece ligeiramente o resto da UI para focar atenção no que está sendo gerado.
- **RN 35.3** — Cada chamada de IA é uma **transação fechada (monotarefa)**: termina, chat exibe "Concluído", abre nova interação para a próxima ação. Decisão explícita da Adriana ("uma coisa de cada vez") em 08/04.

> **Validar a seguinte possibilidade:**
> - Backend de histórico: a discussão técnica em 09/04 mencionou DynamoDB. Confirmar tecnicamente se DynamoDB é a escolha ou se reusa `postgres_logs` (já tem partições para alta escala).
> - Resumo de contexto: prompt de sumarização tem custo. Em qual janela disparar (X mensagens? Y tokens?). Reusa `AiConsumption` da geração 2025?
> - Estimativa de custo no botão (procrastinada): registrar como item de roadmap, não bloquear este release.
> - Renderização de imagens geradas no histórico de chat (Archive/Mongo): pode ser rebaixada a P3 se complicar — em 06/05 o time cogitou manter imagens só no contexto da atividade, sem render no chat.

---

## #R10 Gerar conteúdo de aula/página via IA em sequência fixa

A geração com IA é particionada em etapas fixas, cada uma com aprovação. O usuário não pode pular etapas — a IA bloqueia educadamente.

**RN 36** — A geração de conteúdo segue **sequência fixa** (decisão D2), variando por tipo:

- **RN 36.1** — `Lesson` (aula): `Roteiro` → `Slides` → `Imagens` → `Áudios` → `Renderização`.
- **RN 36.2** — `Page` (página): `Roteiro` → `Conteúdo` → `Imagens`.
- **RN 36.3** — Tentativa de gerar etapa fora de ordem (ex.: pedir imagens antes de existir roteiro): IA responde "preciso do roteiro primeiro, vou gerar?" e oferece confirmação para gerar a etapa anterior.
- **RN 36.4** — **Imagens são opcionais** em `Lesson` e `Page`. UI marca a etapa "Imagens" como `opcional` (badge cinza-claro) em vez de `pendente`. O instrutor pode declarar a atividade como pronta sem gerar imagens. Decisão registrada em 06/05.
- **RN 36.5** — O **roteiro** persiste no campo `script` existente em `EventContent` (a confirmar em S3 — possivelmente reaproveitando estrutura atual em vez de criar tabela nova). Não é uma entidade separada.
- **RN 36.6** — **Edição manual** do conteúdo da página (Plate.js) ou da aula (Fabric.js) **marca o roteiro como concluído automaticamente** via trigger no `update`. Permite ao instrutor que prefere escrever na mão avançar no fluxo sem precisar passar pela IA. Reforça #R26.1.

**RN 37** — Cada etapa concluída tem 3 ações disponíveis no chat:

- **RN 37.1** — **Aprovar** (default): segue para a próxima etapa.
- **RN 37.2** — **Regerar**: dispara nova geração da mesma etapa. Permite (opcionalmente) prompt customizado ("regere com tom mais informal").
- **RN 37.3** — **Rejeitar e descartar**: cancela a etapa, instrutor pode tentar abordagem diferente.

**RN 38** — Modos de geração inicial:

- **RN 38.1** — **Assistente por etapas** (default para smart user): instrutor aprova passo a passo.
- **RN 38.2** — **Automático pela IA** (light user): IA gera todas as etapas sequencialmente sem aprovações intermediárias. Instrutor revisa o resultado final e regera o que não gostou.
- **RN 38.3** — A escolha do modo é feita ao iniciar a geração (radio ou select no primeiro prompt).

**RN 39** — Regerar imagem específica de uma cena:
- **RN 39.1** — Botão "regerar imagem" em cada slide individual (não só no chat).
- **RN 39.2** — Permite prompt customizado por imagem ("imagem mais escura", "estilo cartoon").

**RN 40** — Editar roteiro: ao editar texto de roteiro de uma cena, **áudio dependente é invalidado** automaticamente — usuário precisa regerar o áudio para refletir o novo roteiro.

- **RN 40.1** — UI mostra badge "áudio desatualizado" enquanto não regerado.

**RN 41** — Renderização final só dispara via "Publicar alterações" (#R12), não em cada aprovação de etapa.

- **RN 41.1** — Quando #R8 não estiver entregue (P3 não-priorizado), "Publicar" salva direto na atividade publicada (sem rascunho intermediário). Comportamento atual da plataforma é preservado.
- **RN 41.2** — Botão **"Concluir geração com IA"** (multi-select): com 1 ou mais atividades selecionadas, dispara a sequência completa de RN 36 para todas as atividades, sem aprovações intermediárias. Atividades ficam bloqueadas durante o processo (assíncrono via WebSocket — ver S3). Decisão registrada em 06/05 ("é como se ele tivesse vindo no chat e mandado gerar e concordasse na primeira opção, repetindo para todas").

> **Validar a seguinte possibilidade:**
> - Arquitetura técnica de orquestração: roteador + mini-agentes (gerar resumo, gerar roteiro, gerar imagem, gerar áudio, renderizar). Avaliar OpenCloud como base ou implementação custom em Sidekiq.
> - WebSocket para streaming de geração ao chat (UX ao vivo). Hoje a Twygo não tem WebSocket — precisa stack nova (ActionCable do Rails).
> - Custo: cada etapa consome créditos. Estimativa antes de executar (procrastinada — RN 34.6 do extract).
> - Reuso do campo `script` para persistir roteiro vs. tabela nova — confirmar em S3.

---

## #R11 Adicionar múltiplas atividades em massa via copiloto

Em vez de criar atividade-a-atividade no menu manual, o instrutor pede ao copiloto: "adicionar 5 atividades sobre user experience".

**RN 42** — Comando "adicionar N atividades" no copiloto:

- **RN 42.1** — `N` é configurável (não é fixo em valores tipo 5/10).
- **RN 42.2** — Pode especificar tema livre por linguagem natural ("5 atividades sobre user experience nível iniciante").
- **RN 42.3** — IA respeita o contexto do curso (idade, dificuldade, tom de voz, modelo de marca) preenchidos em #R4.

**RN 43** — Modos disponíveis:

- **RN 43.1** — **Apenas estrutura**: cria N atividades só com título e resumo. Conteúdo fica vazio (instrutor preenche depois manualmente ou pelo copiloto via #R10).
- **RN 43.2** — **Estrutura + conteúdo**: cria N atividades e dispara a sequência completa de geração para cada uma (segue #R10).
- **RN 43.3** — **Geração de questionário pelo chat fica fora do escopo deste release.** O cadastro de questionário continua existindo no fluxo manual (#R13) e no gerador de IA legado (assistente de 4 passos preservado em #R1.4). Decisão de 06/05 ("ainda não é nessa fase aqui").

**RN 44** — Posicionamento na lista:

- **RN 44.1** — Se houver atividade selecionada quando o instrutor pede "adicionar 5", as 5 são criadas **imediatamente após** a selecionada.
- **RN 44.2** — Se nada selecionado, vão para o final da lista.

**RN 45** — Cada atividade nova entra como `EventContent` em modo **rascunho** (`is_draft = true`) por padrão — só vira visível para o aluno após publicar (#R8). Quando #R8 não estiver entregue (P3 não-priorizado), a atividade entra direto como publicada.

> **Premissa:** o limite atual de 30 atividades por curso (vindo do assistente IA) **não se aplica** ao Estúdio (decisão D4). Estúdio aceita N qualquer, limitado apenas por créditos do plano. Em planos baixos, o sistema avisa antes de gerar.

---

## #R12 Renderizar versão publicada de forma assíncrona

Quando o instrutor clica em "Publicar alterações", a renderização (vídeo final, integração com Bunny, conversão de slides) roda em background. Instrutor não fica bloqueado.

**RN 46** — "Publicar alterações" dispara um job assíncrono que:

- **RN 46.1** — Marca o rascunho (ou a atividade — se #R8 não estiver entregue) como em renderização (`is_rendering = true`).
- **RN 46.2** — Inicia worker Sidekiq que orquestra: render dos slides + assembly do vídeo (caso aula com avatar/áudio) + upload para Bunny.net + atualização de `VideoPlatformData`.
- **RN 46.3** — Ao concluir, marca `is_draft = false` e `is_rendering = false`. Aluno passa a consumir a nova versão (a partir da próxima sessão dele).

**RN 47** — Durante a renderização:

- **RN 47.1** — Estado da atividade no estúdio mostra badge "renderizando" + barra de progresso (consumida via WebSocket ou polling).
- **RN 47.2** — Instrutor pode continuar editando outras atividades do mesmo curso.
- **RN 47.3** — Editar a atividade que está renderizando bloqueia até finalizar (ou cria novo rascunho se forçar — discutir em S5).

**RN 48** — Falhas de renderização:

- **RN 48.1** — Retentativa automática (1x) com delay.
- **RN 48.2** — Em caso de falha definitiva, badge "erro" + notificação ao instrutor por e-mail / `NotificationHistory`.
- **RN 48.3** — Logs estruturados em `postgres_logs` para investigação.

> **Validar a seguinte possibilidade:**
> - Bunny.net: contrato de upload assíncrono — webhook de "render completo" ou polling? Como invalidar versão antiga sem quebrar alunos no meio (RN 29)?
> - Estado intermediário: se o instrutor editar a atividade renderizando, criar novo rascunho ou bloquear?
> - Cleanup: vídeos antigos no Bunny.net consomem storage. Política de retenção (manter X versões, descartar resto)?

---

## #R13 Manter criação 100% manual (paridade com fluxo atual)

Para clientes em planos sem créditos de IA, e para instrutores que preferem criar tudo na mão, a paridade com o fluxo atual de cadastro de atividade é mantida.

**RN 49** — O botão **"Adicionar atividade"** no Estúdio (sem usar copiloto) abre uma seleção de tipos (Aula, Página, Vídeo Upload, PDF, SCORM, Embed, Texto, Game, Questionário) — igual ao atual.

**RN 50** — Ao selecionar tipo, abre o cadastro da atividade. Para `Lesson` e `Page`, o cadastro é refatorado para React + ganhar **2 abas internas** dentro do modal:

- **RN 50.1** — Aba **"Dados"**: título, descrição, configurações (visibilidade, peso, etc.).
- **RN 50.2** — Aba **"Conteúdo"**: editor (Plate.js para `Page`, Fabric para `Lesson`).

**RN 51** — Para os outros tipos (`Vídeo`, `PDF`, `SCORM`, etc.), o cadastro continua como hoje (sem refactor obrigatório neste release).

**RN 52** — Operações que **não consomem créditos** continuam funcionando normalmente em planos sem IA: cadastrar atividade, upload de vídeo/PDF/SCORM, configurar questionário, etc.

**RN 53** — Configurações de **questionário** ganham ajustes cosméticos junto deste release:

- **RN 53.1** — Separar dropdown atual em 2 toggles independentes:
  - Toggle "Exibir perguntas em ordem aleatória" (default off).
  - Toggle "Perguntas diferentes a cada tentativa" (default off).
- **RN 53.2** — Pontuação mínima default = **70%** (hoje vem vazio).
- **RN 53.3** — Campos "peso" e "percentual na pontuação final" saem do bloco de pontuação mínima e vão para outra section ("Avaliação no curso").

> **Premissa:** o editor `Fabric.js` (aula) e `Plate.js` (página) **não são refatorados** neste release. Isso foi explicitamente colocado fora do escopo em 07/04 — mexer no editor adia muito o projeto. O copiloto fica isolado nessas telas (RN 12). Refactor do editor entra em release futuro.

---

## #R14 Suportar mobile minimamente como requisito de venda (P3)

> **Prioridade de release: P3 — última prioridade.** Decisão de 06/05: pode ficar para release seguinte se o cronograma do CBTD apertar. Mobile mínimo é requisito de venda (cliente em trial pode estar testando no celular), mas não bloqueia a primeira demo.

Mobile não é o caso de uso primário, mas precisa funcionar — é requisito de venda (cliente em trial pode estar testando no celular).

**RN 54** — Em telas mobile (largura < 768px), o Estúdio reorganiza:

- **RN 54.1** — Drawer do copiloto vira **tela cheia** quando aberto.
- **RN 54.2** — Lista de atividades, preview e copiloto viram **tabs no rodapé** (3 ícones), alternando o que ocupa o conteúdo principal.
- **RN 54.3** — Reordenação por drag & drop é mantida em mobile (touch-drag), mas com handle ampliado para usabilidade.

**RN 55** — Operações de geração com IA estão disponíveis em mobile, mas com tempo de renderização possivelmente maior (rede móvel).

**RN 56** — Edição inline no Plate.js (página) e Fabric.js (aula) **não é otimizada** para mobile no primeiro release — o instrutor pode até abrir, mas a UX não é prioridade. Cobre o caso "trial mobile" sem prometer experiência ótima.

> **Premissa:** gravar aula direto pelo celular (instrutor na fábrica gravando em campo) é visão de futuro — fora deste PRD. O suporte mobile aqui é para cobrir trial e edições rápidas, não criação completa.

---

## #R15 Coexistir com tela antiga via rota nova e feature flag

O Estúdio entra em rota nova; a tela atual de edição de atividades não é desligada imediatamente. Convivência controlada por feature flag, com rollout gradual. Permite migração suave sem big bang. Decisão consolidada em 06/05 ("é melhor uma rota nova. Deixa essa daqui aí mesmo. Cria uma nova. Até pra migrar aos pouquinhos").

**RN 57** — O Estúdio fica em **nova rota** dentro de `events/:id/edit/studio` (caminho exato a definir em S7). A rota antiga `events/:id/edit/activities` continua acessível.

- **RN 57.1** — Acesso ao Estúdio é controlado por uma **feature flag** (provavelmente `OrganizationSetting` ou `UseMode` — a decidir em S7).
- **RN 57.2** — Quando a flag está habilitada para a organização, o link "Atividades" no menu lateral de edição de curso aponta para a nova rota; quando desabilitada, aponta para a antiga.
- **RN 57.3** — Aluno (lado do `aprender`) consome conteúdos publicados independente de onde o instrutor editou. A flag afeta apenas a UI do criador.

**RN 58** — A tela antiga **não recebe novas funcionalidades** durante a transição. Bugs críticos são corrigidos; melhorias só vão para o Estúdio.

**RN 59** — Migração gradual:

- **RN 59.1** — Rollout escalonado por organização (orgs piloto primeiro, depois geral). Decisão de quem entra em piloto vai para o time de CS.
- **RN 59.2** — **Rollback** para a tela antiga é viável ao desligar a flag (zero perda de dados — o `EventContent` é o mesmo nas duas telas).
- **RN 59.3** — Métrica de adoção monitorada: % de instrutores usando o Estúdio vs o antigo. Decisão de desativar a tela antiga (release futuro) baseada nessa métrica + feedback de CS.

> **Validar a seguinte possibilidade:**
> - Mecanismo de feature flag: reusar `OrganizationSetting`, `UseMode` (já existe), ou criar um `feature_flags` próprio? Trade-off em S7.
> - Rotas duplicadas no React + Rails: como os dois caminhos compartilham serviços/use-cases (criar/atualizar atividade)? A nova rota não pode quebrar contratos da antiga durante a coexistência.
> - i18n triplo: nomes diferentes nos dois fluxos (antiga "Atividades", novo "Estúdio") — manter ambos coerentes em pt-BR/en/es ou unificar a label "Atividades" para evitar confusão de quem migra?

---

## #R16 Duplicar curso a partir do Estúdio ("Salvar como novo") (P3)

> **Prioridade de release: P3 — última prioridade.** Decisão de 06/05: pode ficar para release seguinte se o cronograma do CBTD apertar. Junto com #R8 (rascunho) e #R14 (mobile), forma o bloco "se der tempo".

Quando o instrutor quer iterar sobre um curso existente sem perder a versão atual, "Salvar como novo" cria uma cópia integral do curso e direciona o instrutor para a edição da nova cópia. Útil para criar variações (ex.: mesmo curso adaptado para outro público).

**RN 60** — O botão **"Salvar como novo"** fica em um menu secundário no topo do Estúdio (junto com "Publicar alterações"), visível apenas em cursos já criados (não em curso novo em branco).

- **RN 60.1** — Click dispara um job assíncrono que cria um novo `Event` com cópia integral de:
  - Identificação (nome com sufixo "(cópia)").
  - `EventContent`s e seus assets (vídeos, imagens, slides — referência ou cópia conforme S5).
  - `Question`s, `QuestionList`s associados.
  - Banner, certificado, modelo de marca aplicado.
- **RN 60.2** — Ao concluir, o instrutor é redirecionado para o Estúdio do novo curso.
- **RN 60.3** — Não copia: histórico de chat (RN 34.6), inscrições, pagamentos, registros de aluno, métricas, certificados emitidos.

**RN 61** — Estado da cópia:

- **RN 61.1** — Tudo que estava publicado no original vira publicado na cópia.
- **RN 61.2** — Tudo que estava em rascunho no original vira rascunho na cópia (#R8 — só aplicável quando #R8 estiver entregue).
- **RN 61.3** — A cópia parte com `is_draft = false` em todos os `EventContent`s caso #R8 não esteja entregue (rollout sem versionamento).

> **Validar a seguinte possibilidade:**
> - Cópia de assets pesados (vídeos no Bunny.net): por referência (mesmo asset compartilhado) ou cópia física (storage em dobro)? Trade-off em S5.
> - Atomicidade: se a cópia falhar no meio (ex.: 100 atividades, falha na 80), o que acontece? Job rollback ou estado parcial?
> - Permissões: quem é o "criador" do curso copiado? O instrutor que clicou ou o criador original?
> - Reuso: existe `CopyEventQueue` na arquitetura atual (filas de duplicação) — verificar reuso vs. extensão.

---

## Controle de versão

| Versão | Data | Alterado por | O que foi alterado |
|---|---|---|---|
| 01 | 06/05/2026 | Alexandre Kumagae | Substitui o v01 anterior (04/05/2026). Consolida 8 transcrições de reuniões (Freela 26/02 → Refinamento 06/05, ~08h17 totais). Incorpora ajustes do refinamento 06/05: (a) #R8 (rascunho), #R14 (mobile) e #R16 (salvar como novo) marcados como **P3 — "se der tempo"**, com nova seção "Prioridade de entrega" no topo classificando #Rs em P1/P2/P3; (b) novo **#R15 — coexistência via rota nova + feature flag** (rollout gradual, sem big bang); (c) novo **#R16 — Salvar como novo** (P3); (d) #R5 ganha RN 14.7 (badges clicáveis abrem copiloto contextualizado) e RN 18.4 (sem confirmação extra em ações simples); (e) #R7 ganha RN 26.1 (edição manual conclui roteiro automaticamente); (f) #R10 ganha RN 36.4 (imagens opcionais), RN 36.5 (reuso do campo `script`), RN 36.6 (edição manual conclui roteiro), RN 41.1 (publish funciona sem #R8) e RN 41.2 (botão "Concluir geração com IA" multi-select); (g) #R11 ganha RN 43.3 (questionário via chat fora-de-escopo); (h) #R3 ganha RN 7.4 (primeira aba travada); (i) #R14 marcado P3. Atalho **Ctrl+J mantido**. Spike correspondente (`[Spike] Novo Estúdio de Criação.md`) ganha S7 (feature flag/coexistência) e atualiza S1 (estrutura de "etapa opcional"), S3 (reuso `script`) e S5 (cópia de assets). |
| 02 | | | |
