# Mapa: bugs reportados → Regras de Negócio (RN) do Discovery

> Consolidado em 11/06/2026 — itens 1–9 reportados pelo time; itens 10–26 achados
> nos QAs 1.1–1.18 (Dante). Duplicados foram fundidos (ver nota em cada item).
> "Retrabalho" referencia a lista R1–R11 de `reports/retrabalhos-propostos.md`.

#: 1
Ponto reportado: Copiloto sugere, junto do nome da atividade, o id dela e variáveis do código
RN correspondente: RN 32 — "a cada interação, o copiloto recebe automaticamente o contexto da página atual: Curso (id, nome...), atividades selecionadas, conteúdo aberto". A regra prevê o contexto interno, mas vazá-lo (id + vars de código) pro texto visível ao usuário não está previsto em nenhuma RN — é defeito. O contexto interno (ids, vars) deveria ficar invisível ao usuário — vazamento desse payload pro chat é a violação.
#R: #R9
────────────────────────────────────────
#: 2
Ponto reportado: Criação de aula: após salvar e renderizar, as cenas somem e nunca renderiza
RN correspondente: RN 36.1 (sequência fixa Lesson: Roteiro→Slides→Imagens→Áudios→Renderização) + RN 46/46.2/46.3 (job assíncrono render→Bunny) + RN 48 (falhas de render: retry 1x, badge "erro", notificação). Cenas sumindo = quebra entre persistência do roteiro/slides (RN 36.5 script) e render.
#R: #R10 / #R12
────────────────────────────────────────
#: 3
Ponto reportado: Tabelas sem registros: studio_generation_partitions e user_course_preferences
RN correspondente:
• user_course_preferences → RN 7.1 / premissa #R3 (tab_order JSON + last_tab; persistência em banco, não cookie). Não gravar = RN 7.1/7.2/7.3 não funcionam. (Confirmação extra do QA 1.18: o schema real da tabela é só user_id + tab_order + last_tab — sem coluna de evento/org, divergindo da AT.)
• studio_generation_partitions → #R10 (geração particionada) + premissa de RN 34 (backend de histórico/partições, "reusa postgres_logs que já tem partições"). (Confirmação extra do QA 1.18: vazia GLOBAL no MySQL — a feature não escreve nela; o log real de geração vai em ai_generation_tasks, ver item 26.)
#R: #R3 / #R10
────────────────────────────────────────
#: 4
Ponto reportado: YouTube embed não implementado (link embed/player próprio do YT)
RN correspondente: RN 23.4 (preview de Embed igual ao aprender) + RN 49 (tipo Embed na seleção manual). Tipo Embed previsto, não entregue.
#R: #R13 / #R7
────────────────────────────────────────
#: 5
Ponto reportado: SCORM não funciona ("a página não existe")
RN correspondente: RN 22.1 (label "Conteúdo" no Play), RN 23.4 (preview SCORM), RN 49/51 (SCORM no manual, sem refactor obrigatório).
#R: #R13 / #R7
────────────────────────────────────────
#: 6
Ponto reportado: Vídeo de aula/upload não reproduz — processamento infinito
RN correspondente: RN 23.1/23.4 (preview de Lesson/Video) + RN 46.2 (assembly de vídeo + upload Bunny + VideoPlatformData) + RN 47.1 (badge "renderizando" via WebSocket/polling). "Processamento infinito" = job de render/Bunny travado sem retorno de RN 46.3.
#R: #R12 / #R7
────────────────────────────────────────
#: 7
Ponto reportado: Botão "Concluir geração com IA" desabilitado
RN correspondente: RN 41.2 — literal: botão "Concluir geração com IA" (multi-select) dispara sequência RN 36 completa para N atividades, sem aprovações. Está descrito mas inoperante.
#R: #R10
────────────────────────────────────────
#: 8
Ponto reportado: Botões "salvar como rascunho / novo / publicar alterações" não implementados
RN correspondente:
• "Salvar como rascunho" → RN 27 (EventContent paralelo is_draft=true).
• "Publicar alterações" → RN 28 (#R8) + RN 41/41.1 + RN 46 (#R12 render assíncrono). (QA 1.12 confirmou ao vivo em 10–11/06: zero ocorrências de "Publicar" na UI — 12 TCs inexecutáveis.)
• "Salvar como novo" → RN 60 (duplicação integral do curso). (QA 1.16 confirmou: menu secundário do topo não existe — 12 TCs inexecutáveis.)
#R: #R8 / #R12 / #R16
────────────────────────────────────────
#: 9
Ponto reportado: Tabelas de logs não foram implementadas
RN correspondente: RN 48.3 (#R12) — "Logs estruturados em postgres_logs para investigação". Também referenciado na premissa de RN 34 ("reusa postgres_logs que já tem partições para alta escala"). postgres_logs não existe como tabela / não recebe registros — dev confirmou "não tem logs ainda". Sem isso, RN 48.3 (investigação de falha de render) e a estratégia de histórico do copiloto (RN 34) ficam sem base.
#R: #R12 / #R10 / #R9
────────────────────────────────────────
#: 10
Ponto reportado: Cards "Trilha" e "Pacote" criam um CURSO — os cards passam o tipo como texto (kind=learning_path / kind=package), o backend não reconhece (o fluxo atual usa kind numérico 3/4) e cai no fallback "Novo curso". Usuário clicando em Trilha/Pacote cria Curso. Bug confirmado com baseline na org sem a flag (36675).
RN correspondente: RN da criação via cards (#R1) — cada card deve abrir o fluxo do tipo escolhido (Curso / Trilha / Pacote).
#R: #R1 · Retrabalho: R1 (severidade alta)
────────────────────────────────────────
#: 11
Ponto reportado: Card "Curso" não direciona ao Estúdio — abre o formulário legado de Identificação e, mesmo após salvar, o Estúdio nunca aparece no fluxo.
RN correspondente: RN da criação via cards (#R1) integrada ao Estúdio (#R2). A AT prevê chegada ao Estúdio; hoje a entrega é parcial.
#R: #R1 / #R2 · Retrabalho: R2
────────────────────────────────────────
#: 12
Ponto reportado: "Criar curso com IA" bloqueado indevidamente — clique exibe toast "funcionalidade não habilitada para esse ambiente" SEM disparar nenhuma request, mesmo com "Acesso de IA ativo" ON e saldo de créditos na org. Bloqueio client-side errado.
RN correspondente: RN da coexistência da criação por IA na página de cards (#R1).
#R: #R1 · Retrabalho: R3
────────────────────────────────────────
#: 13
Ponto reportado: Mecânica de abas persistidas ausente na UI (complementa o item 3) — sem ícone de drag no hover, arrastar não reordena, nenhuma request de persistência é disparada e a última aba aberta não é restaurada (volta sempre em Identificação). Validado com 2 usuários; RNs 2/4/6 presentes no mesmo build → ausência específica desta RN.
RN correspondente: RN 7.1/7.2/7.3 (tab_order + last_tab persistidos por usuário).
#R: #R3 · Retrabalho: R6
────────────────────────────────────────
#: 14
Ponto reportado: Rota dedicada do Estúdio diverge da documentada — /o/{org}/events/:id/edit/studio retorna 404; a rota real é /o/{org}/contents/:id/edit?tab=studio. Dev (Alexandre, 05/06) confirmou que deve seguir a doc → é defeito, não AT desatualizada.
RN correspondente: RN da rota nova (#R15 — coexistir com tela antiga via rota nova).
#R: #R15
────────────────────────────────────────
#: 15
Ponto reportado: Gate por feature flag não confere — a flag "creation_studio" está Disabled (0% actors) e o Estúdio funciona mesmo assim; o gate real é OUTRA flag Flipper (nome a confirmar com o time). Todos os TCs de roteamento-por-flag e estado-OFF ficam irrealizáveis até definir a flag correta.
RN correspondente: RN do gate por feature flag (#R15).
#R: #R15
────────────────────────────────────────
#: 16
Ponto reportado: Copiloto sem expansão — abre em overlay de ~66–70% fixo, sem botão "Expandir". Dev confirmou (05/06) o padrão correto: abrir em 50% + botão de expandir até 100%. Comportamento atual é defeito.
RN correspondente: RN do layout do copiloto no shell de 3 colunas (#R2/#R9 — AT previa coluna ~30% → ~50%).
#R: #R2 / #R9
────────────────────────────────────────
#: 17
Ponto reportado: Atalho Ctrl+J não fecha o copiloto — abre corretamente, mas o toggle de fechar pelo mesmo atalho está quebrado.
RN correspondente: RN do atalho de teclado do copiloto (#R9).
#R: #R9
────────────────────────────────────────
#: 18
Ponto reportado: FAB do copiloto não renderiza na aba Identificação — só aparece na aba Atividades.
RN correspondente: RN da disponibilidade do copiloto nas abas do curso (#R2/#R9).
#R: #R2 / #R9 · Retrabalho: R8
────────────────────────────────────────
#: 19
Ponto reportado: Sem layout responsivo abaixo de 1366px — em 1024×600 o Estúdio fica espremido com scroll horizontal (AT previa 3 tabs no rodapé no modo compacto).
RN correspondente: RN de responsividade do Estúdio (#R2, TC10) + RN de suporte mobile (#R14 — suíte própria "Suportar mobile").
#R: #R2 / #R14 · Retrabalho: R4
────────────────────────────────────────
#: 20
Ponto reportado: Sem controles de recolher/ocultar o menu lateral do Estúdio.
RN correspondente: RN dos controles de layout do shell de 3 colunas (#R2, TC5/TC6).
#R: #R2 · Retrabalho: R5
────────────────────────────────────────
#: 21
Ponto reportado: Lista de atividades do Estúdio não reflete o display_label renomeado — o form salva, o backend persiste e o Play do aluno mostra o nome customizado; só a LISTA do instrutor continua exibindo o tipo original.
RN correspondente: RN de renomear texto exibido do tipo de atividade (#R6).
#R: #R6 · Retrabalho: R9 (severidade alta)
────────────────────────────────────────
#: 22
Ponto reportado: Botão "Editar" do preview nunca habilita — não há caminho de UI pra editar uma atividade existente; o form só abre por URL direta (/studio/activities/{id}/edit?type=&eventId=).
RN correspondente: RN da edição manual de atividade a partir do preview (#R6/#R7).
#R: #R6 / #R7 · Retrabalho: R10 (severidade alta)
────────────────────────────────────────
#: 23
Ponto reportado: Escolher o tipo no "Adicionar atividade" JÁ CRIA a atividade — desistir sem salvar deixa rascunho órfão "Nova atividade" na lista.
RN correspondente: RN da criação manual de atividades por tipo (#R13).
#R: #R13 · Retrabalho: R11
────────────────────────────────────────
#: 24
Ponto reportado: GRAVE — editor de atividade Página reabre VAZIO e "Salvar" apaga conteúdo publicado: o form de edição não carrega o conteúdo salvo (editor Slate em branco) e qualquer Salvar persiste o vazio → aluno que via o conteúdo passa a ver em branco. Comprovado com 2 usuários e 5 execuções, isolado com "salvar sem alterar" (carregamento ok em apenas 1/5 tentativas). Risco real de perda de dado do cliente.
RN correspondente: regressão sobre a edição/persistência de conteúdo de Página, agravada pela ausência do rascunho paralelo (RN 27, is_draft) que protegeria o conteúdo publicado (#R8).
#R: #R8 (suíte de regressão do QA 1.8)
────────────────────────────────────────
#: 25
Ponto reportado: Section "Configurações de IA" ausente na aba Identificação — os campos de IA existem (em "Público"), salvam e persistem, mas sem o agrupamento com título e tooltip "Estes campos são usados pela IA na geração de conteúdo..." previsto.
RN correspondente: RN da section de configurações de IA na Identificação (#R4).
#R: #R4 · Retrabalho: R7
────────────────────────────────────────
#: 26
Ponto reportado: Exclusão do banco histórico retém ai_generation_tasks órfã — E2E completo (11/06, Trial 37062): a exclusão de dados apaga events/event_contents corretamente, mas a tabela ai_generation_tasks (a ÚNICA tabela MySQL nova que a feature realmente escreve — nem consta na AT) é retida apontando pra curso/atividade que não existem mais. A decidir: retenção intencional (auditoria/billing — a linha carrega ai_consumption_id) ou falha de cascata. Complementos: o mecanismo "exclusão de organização" citado no TC não está disponível pra QA (o testável é o reset de dados da Trial via Sophia), e studio_checkpoints/messages (DynamoDB) + org_generation_preferences (PostgreSQL) estão fora do alcance de validação.
RN correspondente: RN da exclusão dos registros do banco histórico ao excluir a organização (#R18).
#R: #R18
────────────────────────────────────────

## Observações relevantes para QA

- Item 8 (rascunho/publicar/salvar como novo) é P3/P2 no Discovery (#R8 e #R16 marcados "se der tempo"; #R12 é P2). Podem não ser bug — escopo conscientemente adiado pós-CBTD. Confirmar com o PO se entram no release ou ficam pra v2.
- Item 9 (logs) confirma o registrado na memória do projeto: suítes de log (TC24, TC10 render, suíte "Tabela de Logs") bloqueadas porque postgres_logs não existe e o dev confirmou que o logging não foi implementado (10/06/2026).
- Item 24 é o mais crítico da lista — envolve perda de conteúdo publicado visível ao aluno; priorizar.
- Itens 14–18 tiveram confirmação do dev (Alexandre, 05/06) de que são defeitos (não AT desatualizada); itens 10–13 e 19–23 têm retrabalho redigido em retrabalhos-propostos.md com passo a passo e evidência no GitHub.
- SCORM (item 5) tem ainda uma pendência de PRODUTO separada: o display_label default vem "Conteúdo" no form e "SCORM" na lista (nunca "Conteúdo SCORM") — nomenclatura em stand-by pós-CBTD por decisão do comitê; não abrir retrabalho até a definição.
- Itens não-bug já alinhados (fora da lista): aba "Certificado", "Dificuldade" input livre e campo "Idioma" — confirmados pelo dev como erro da DOC/AT, não do produto.
