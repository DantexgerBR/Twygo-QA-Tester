# Mapa: bugs reportados → Regras de Negócio (RN) do Discovery

> Consolidado em 11/06/2026 — itens 1–9 reportados pelo time; itens 10–26 achados
> nos QAs 1.1–1.18 (Dante). Duplicados foram fundidos (ver nota em cada item).
> "Retrabalho" referencia a lista R1–R11 de `reports/retrabalhos-propostos.md`.
>
> ATUALIZADO 12/06/2026 após a 2ª rodada de revalidação (retrabalhos 19838/19836/
> 19823/19818/19961/19814/19827/19915/19853/19855/19857 + cards de execução
> 19716/19719/19720/19722): os itens 2, 5, 7, 13, 15, 20 e 22 foram CORRIGIDOS e
> validados ✅ — saíram da lista; o item 8 encolheu (resta só "Salvar como novo");
> o item 3 encolheu (resta só studio_generation_partitions). A numeração original
> segue preservada (com lacunas) para não quebrar referências.

#: 1
Ponto reportado: Copiloto sugere, junto do nome da atividade, o id dela e variáveis do código
RN correspondente: RN 32 — "a cada interação, o copiloto recebe automaticamente o contexto da página atual: Curso (id, nome...), atividades selecionadas, conteúdo aberto". A regra prevê o contexto interno, mas vazá-lo (id + vars de código) pro texto visível ao usuário não está previsto em nenhuma RN — é defeito. O contexto interno (ids, vars) deveria ficar invisível ao usuário — vazamento desse payload pro chat é a violação.
#R: #R9
────────────────────────────────────────
#: 3
Ponto reportado: Tabela sem registros: studio_generation_partitions. [ATUALIZADO 12/06: a metade do item sobre user_course_preferences foi RESOLVIDA — a tabela agora grava tab_order/last_tab via PATCH /studio/courses/{id}/user_preferences (retrabalho 19823 ✅) e ganhou a coluna event_id (migration da PR 10676), ficando escopável por curso. Resta APENAS a studio_generation_partitions.]
RN correspondente: studio_generation_partitions → #R10 (geração particionada) + premissa de RN 34 (backend de histórico/partições). Reconfirmado em 12/06: vazia GLOBAL no MySQL — a feature não escreve nela; o log real de geração vai em ai_generation_tasks (ver item 26).
#R: #R10
────────────────────────────────────────
#: 4
Ponto reportado: YouTube embed não implementado (link embed/player próprio do YT). [ATUALIZADO 12/06: ENTREGUE via PR 10645 (merged 10/06) — campo "Player do vídeo" na atividade Externa com opções "Player da Twygo" / "Player oficial do YouTube", atrás da feature flag youtubePlayerOficialEnabled, com validação de link/iframe do YT e conclusão manual forçada no player oficial. PENDENTE DE VALIDAÇÃO dedicada (não exercitado nos QAs de 12/06).]
RN correspondente: RN 23.4 (preview de Embed igual ao aprender) + RN 49 (tipo Embed na seleção manual).
#R: #R13 / #R7
────────────────────────────────────────
#: 6
Ponto reportado: Vídeo de aula/upload não reproduz — processamento infinito. [ATUALIZADO 12/06: evidência forte de correção no pipeline — o render de Lesson agora CONCLUI (QA 1.12 revalidado: "Salvar e regerar" → badge "Renderizando..." + banner global com tempo estimado → "Pronto" em ~54s) e o processamento de SCORM também conclui com status (PR 10670). O cenário ESPECÍFICO de upload de vídeo (atividade tipo Vídeo) não foi revalidado — manter até reteste dedicado.]
RN correspondente: RN 23.1/23.4 (preview de Lesson/Video) + RN 46.2 (assembly de vídeo + upload Bunny + VideoPlatformData) + RN 47.1 (badge "renderizando" via WebSocket/polling).
#R: #R12 / #R7
────────────────────────────────────────
#: 8
Ponto reportado: Botão "Salvar como novo" não implementado. [ATUALIZADO 12/06 — o item encolheu: "Salvar como rascunho" (RN 27, is_draft) EXISTE e funciona, e o fluxo de "Publicar alterações" (RN 28/41/46) foi entregue como "Salvar e regerar" no editor da Aula, com render assíncrono validado E2E (QA 1.12 ✅ em 12/06) — esses dois saíram. Resta SÓ a duplicação:]
• "Salvar como novo" → RN 60 (duplicação integral do curso). QA 1.16 reexecutado em 12/06: menu secundário do topo segue inexistente (0 ocorrências de "Salvar como novo"/"Duplicar"); nenhuma PR no twyg-app até a data — 12 TCs inexecutáveis.
• Correção de AT decorrente: a suíte de render/publicação precisa ser reescrita pra nomenclatura entregue ("Salvar como rascunho"/"Salvar e regerar" + badges + banner global), não "Publicar alterações" no topo.
#R: #R16 (P3 "se der tempo" no Discovery — confirmar com PO se entra no release ou fica pra v2)
────────────────────────────────────────
#: 9
Ponto reportado: Tabelas de logs não foram implementadas
RN correspondente: RN 48.3 (#R12) — "Logs estruturados em postgres_logs para investigação". Também referenciado na premissa de RN 34 ("reusa postgres_logs que já tem partições para alta escala"). postgres_logs não existe como tabela / não recebe registros — dev confirmou "não tem logs ainda". Sem isso, RN 48.3 (investigação de falha de render) e a estratégia de histórico do copiloto (RN 34) ficam sem base.
#R: #R12 / #R10 / #R9
────────────────────────────────────────
#: 11
Ponto reportado: Card "Curso" não direciona ao Estúdio — abre o formulário legado de Identificação e, mesmo após salvar, o Estúdio nunca aparece no fluxo. [ATUALIZADO 12/06: PROVAVELMENTE CORRIGIDO pela PR 10601 — na matriz do QA 1.15, a CRIAÇÃO de curso (/contents/new?kind=course) em org com a flag já exibe as abas "Modelo" e "Atividades" (Estúdio) direto no form. Falta reteste dedicado do clique no card "Curso" da página de cards pra fechar.]
RN correspondente: RN da criação via cards (#R1) integrada ao Estúdio (#R2).
#R: #R1 / #R2 · Retrabalho: R2 (reteste pendente)
────────────────────────────────────────
#: 14
Ponto reportado: Rota dedicada do Estúdio diverge da documentada — /o/{org}/events/:id/edit/studio retorna 404; a rota real é /o/{org}/contents/:id/edit?tab=studio. Dev (Alexandre, 05/06) confirmou que deve seguir a doc → é defeito, não AT desatualizada. [12/06: sem mudança — todos os QAs do dia seguiram usando ?tab=studio.]
RN correspondente: RN da rota nova (#R15 — coexistir com tela antiga via rota nova).
#R: #R15
────────────────────────────────────────
#: 18
Ponto reportado: FAB do copiloto não renderiza na aba Identificação — só aparece na aba Atividades. [ATUALIZADO 12/06: ENTREGUE via PRs 10675 + 10677 "Copiloto na aba Identificação (com contexto completo do curso)" (merged 11–12/06). PENDENTE DE VALIDAÇÃO dedicada.]
RN correspondente: RN da disponibilidade do copiloto nas abas do curso (#R2/#R9).
#R: #R2 / #R9 · Retrabalho: R8 (validar e fechar)
────────────────────────────────────────
#: 19
Ponto reportado: Sem layout responsivo abaixo de 1366px. REVALIDADO 12/06 (cards 19961 ✅ e 19813 ❌) — quadro atualizado: (a) mobile ≤768px AGORA OK — barra com as 3 abas no rodapé (Atividades · Pré-visualização · Copiloto) funcional em 360px e 767px, alternância sem perder contexto (PR 10666, RN 54.2) — a interceptação do balão HubSpot sobre a aba Copiloto não reproduziu na revalidação; (b) faixa 769–1365px segue REPROVADA, mas a causa mudou: não é mais "desktop espremido" — o Estúdio aplica coluna única compacta (isCompact <1366, PR 10644) com drill-down + "Voltar", SEM as 3 abas (o código usa DOIS breakpoints: isCompact <1366 e isMobile <768 — as abas só existem <768); (c) o scroll horizontal persiste em toda a faixa e a CAUSA RAIZ foi isolada em 12/06: a fileira de abas superiores do "Editar curso" (componente desktop-tabs) estoura a largura do documento — o botão tab-studio ("Atividades") passa do viewport (104px de estouro em 1024×600; 16px até no desktop 1440×900) em vez de rolar dentro do próprio container.
RN correspondente: RN de responsividade do Estúdio (#R2, TC10) + RN de suporte mobile (#R14 — RN 54.2).
#R: #R2 / #R14 · Retrabalho: R4 (rebotes focados: corrigir overflow do desktop-tabs — bug objetivo — e ALINHAR com o time se a faixa 769–1365px com drill-down sem abas é decisão de design ou regressão da RN)
────────────────────────────────────────
#: 23
Ponto reportado: Escolher o tipo no "Adicionar atividade" JÁ CRIA a atividade — desistir sem salvar deixa rascunho órfão "Nova atividade" na lista. [12/06: comportamento inalterado — confirmado várias vezes nas seeds dos retrabalhos do dia; o curso 807533 segue com órfã "Nova atividade" de terceiros.]
RN correspondente: RN da criação manual de atividades por tipo (#R13).
#R: #R13 · Retrabalho: R11
────────────────────────────────────────
#: 25
Ponto reportado: Section "Configurações de IA" ausente na aba Identificação — os campos de IA existem (em "Público"), salvam e persistem, mas sem o agrupamento com título e tooltip "Estes campos são usados pela IA na geração de conteúdo..." previsto. [12/06: não revalidado — ao validar o item 18 (copiloto na Identificação, PRs 10675/10677), aproveitar pra reverificar este.]
RN correspondente: RN da section de configurações de IA na Identificação (#R4).
#R: #R4 · Retrabalho: R7
────────────────────────────────────────
#: 26
Ponto reportado: Exclusão do banco histórico retém ai_generation_tasks órfã. REVALIDADO 12/06 (E2E completo repetido na Trial 37062): a exclusão agora é ASSÍNCRONA (DELETE /delete_trial_data 204 + endpoint novo trial_deletion_progress); events e event_contents zeram corretamente, mas ai_generation_tasks segue retida — 3/3 linhas órfãs após a exclusão (reproduzido 2x: 11/06 e 12/06). DECISÃO TOMADA no alinhamento de 12/06: É RETRABALHO (não retenção intencional) — descrição pronta pra abrir no Artia: "P2 [Novo estúdio de criação] Exclusão de dados da Trial não apaga os registros de geração de IA (ai_generation_tasks fica órfã)" (texto completo em revalida-qa118/kqa-comment.md). O card de execução QA 1.18 (19722) fechou ✅ com a falha desmembrada nesse retrabalho. Nota estrutural: user_course_preferences ganhou event_id (PR 10676), viabilizando a checagem org-scoped da AT.
RN correspondente: RN da exclusão dos registros do banco histórico ao excluir a organização (#R18).
#R: #R18 · Retrabalho: redigido, aguardando abertura do card
────────────────────────────────────────

## Corrigidos e validados (saíram da lista)

- Itens 10, 12, 16, 17, 21 e 24 — corrigidos e validados na rodada de 11/06 (ver versão anterior deste mapa).
- **Item 2** (cenas somem / nunca renderiza) — ✅ 12/06 (QA 1.12, card 19716): pipeline de render assíncrono funcionando E2E na aula GENTMP — "Salvar e regerar" → POST 200 → badge "Renderizando..." + banner global "Há 1 atividade sendo renderizada... Tempo estimado: 2 minutos" → "Pronto" em ~54s; persistência de cenas coberta pelas PRs 10609 (salvar persiste cenas) e 10682 (cena acompanha duração do áudio).
- **Item 5** (SCORM não funciona) — ✅ núcleo em 12/06 (retrabalho 19857, PR 10670): upload ok, status amigável "em processamento" + Recarregar no lugar da tela de erro, preview do admin renderiza após ~80s e a visão do aluno reproduz o pacote (SCORM API reportou completed). RESTA rebote cosmético: texto de extensões "Formato aceito: .zip, .zip." duplicado (sugerido card P4). A pendência de PRODUTO da nomenclatura ("Conteúdo SCORM") segue em stand-by pós-CBTD — não abrir retrabalho.
- **Item 7** (botão "Concluir geração com IA" desabilitado) — ✅ sintoma em 12/06: entregue via PR 10592 (D18, merged 08/06); nas evidências do dia o botão aparece HABILITADO com atividade aberta (desabilitado só no estado vazio, que é o esperado). Caveat: a geração automática com auto-aceite não foi exercitada (custo de créditos) — cobrir quando a suíte de geração rodar.
- **Item 13** (abas persistidas ausentes) — ✅ 12/06 (retrabalho 19823, PR 10676): ícone de drag no hover (Identificação travada), drag reordena com PATCH /studio/courses/{id}/user_preferences (tab_order/last_tab), ordem persiste no reload, última aba restaurada, escopo POR USUÁRIO confirmado com 2 usuários.
- **Item 15** (gate por feature flag não confere) — ✅ esclarecido/validado em 12/06 (QA 1.15, PR 10601): o gate real é a flag Flipper `novo_estudio_criacao` ("Conditionally enabled", actors por organização) — a `creation_studio` da AT nunca foi o gate. Matriz ON/OFF comprovada (org com flag mostra abas Modelo+Atividades; org sem flag esconde e o form clássico segue). Não era defeito de gate — vira CORREÇÃO DE AT (nome da flag + modelo de coexistência por abas, não por rota).
- **Item 20** (sem controles de recolher/ocultar o menu lateral) — ✅ 12/06 (retrabalho 19814, laudo corrigido): o alvo da RN 2 é o PAINEL DA LISTA do Estúdio (não a sidebar principal do app — o ❌ de 11/06 olhou o lugar errado); o chevron "Recolher lista de atividades" existe e funciona (oculta o painel inteiro, preview em tela cheia, "Expandir" restaura). Ressalva menor: estado único de recolhimento (não há modo intermediário "só ícones") — se a RN exigir os dois modos, abrir card específico.
- **Item 22** (botão "Editar" do preview nunca habilita) — ✅ 12/06 (retrabalho 19827): Editar habilitado com atividade pai E sub-atividade selecionadas, abrindo o form de edição (/studio/activities/{id}/edit) pela UI. Fix entrou sem PR vinculada ao card.

## Observações relevantes para QA

- Item 8: agora restrito ao "Salvar como novo" (#R16, P3 "se der tempo"). Rascunho (RN 27) e render assíncrono (RN 28/46, #R8/#R12) estão entregues e validados — o que sobra é decisão de escopo com o PO, não bug.
- Item 9 (logs) segue: postgres_logs não existe; logging não implementado (dev, 10/06). Obs.: postgres está fora do escopo MySQL das validações de banco atuais.
- Item 14 segue pendente (dev confirmou que é defeito); itens 4 e 18 foram ENTREGUES por PR (10645 e 10675/10677) e aguardam validação dedicada — bons candidatos pra próxima rodada.
- Item 15 RESOLVIDO: a flag é `novo_estudio_criacao` — reescrever os TCs de roteamento-por-flag da suíte 1.15 com esse nome e com o modelo real (coexistência por ABAS no mesmo form, sem rota antiga separada).
- Itens não-bug já alinhados (fora da lista): aba "Certificado", "Dificuldade" input livre e campo "Idioma" — confirmados pelo dev como erro da DOC/AT, não do produto.
