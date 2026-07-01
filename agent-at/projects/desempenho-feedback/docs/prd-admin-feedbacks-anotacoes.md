# PRD — Admin > Gestão de Time(s) > Feedbacks e Anotações

> 📚 **Naming canônico (atualizado 2026-05-16)**: este PRD usa terminologia pt-BR (Registro / Devolutiva / Anotação / etc) por ser doc de produto. Em **código/DB**, o modelo canônico é `PerformanceEntry` com `kind` enum em inglês (`feedback / recognition / concern / note / wrapup / calibration`). Mapping completo: [`glossary.md § 3.7`](../glossary.md#37-performanceentry-ui-feedbacks-e-anotações). Label de produto continua "Feedbacks e Anotações" em pt-BR (zona traduzível).

| Produto | Twygo — DHO — módulo Feedbacks e Anotações |
| --- | --- |
| Escopo desta entrega | Jornada do perfil **Admin (RH)** no módulo de registros contínuos do time |
| Audiência | Time de dev twyg-app (Rails + React Clean Arch) — dev primário: João |
| Base utilizada | Protótipo (localhost:5173, branch `main`) + `docs/glossario-rh.md` § "Tipos de registro" + memória `project_modelo_registro.md` |
| Fora de escopo | Eficácia (Participativo); PDI/Competências/Sucessão (outros grupos); perfis Líder e Aluno (PRDs próprios — #3, #4, #5, #6) |

## 1. Visão geral da jornada

O Admin/RH é o **orquestrador** do módulo de Feedbacks e Anotações. Não é dono do conteúdo registrado (esse papel é do Líder, que registra cotidianamente sobre o time dele), mas tem **visão total da organização**: vê todos os colaboradores, todos os registros de todos os tipos (inclusive Anotações privadas dos líderes, que normalmente o colab não enxergaria).

A jornada do Admin se divide em quatro momentos:
1. **Acompanhamento agregado** — visão consolidada de quantos registros cada colaborador tem, por bucket (Feedbacks × Anotações), identificando rapidamente quem tá com pouca movimentação ou padrões anômalos.
2. **Drill-down individual** — abrir a timeline completa de um colaborador específico pra contextualizar antes de uma conversa de RH (calibração, sucessão, plano de carreira).
3. **Registro pontual** — registrar diretamente algo que apareceu numa conversa Admin↔colab/líder, sem precisar do líder direto fazer.
4. **Devolutiva pós-avaliação** — quando líder não está disponível ou Admin atua como observador/auditor, pode acionar a devolutiva consolidada.

O módulo é **suporte**, não imã: ninguém acessa "Feedbacks e Anotações" como destino fim. O Admin chega lá quando precisa de input pra outra ação (avaliação, ciclo, conversa de RH).

## 2. Mapa do fluxo principal

| Etapa | Ator | Ação | Tela / Local na UI |
|-------|------|------|---------------------|
| 1 | Admin | Acessa o módulo | Sidebar > "Gestão de Time(s)" > "Feedbacks e Anotações" |
| 2 | Admin | Vê lista de colaboradores com contagens agregadas | Listagem padrão (tabela) |
| 3 | Admin | Filtra/busca colaborador específico | Campo de busca + Drawer de filtros |
| 4a | Admin | Cria registro ad-hoc | Botão "Novo registro" → Modal de criação |
| 4b | Admin | Pré-visualiza registros por bucket | Clica em chip "Feedbacks" ou "Anotações" da linha → Modal de preview |
| 4c | Admin | Entra na timeline completa do colaborador | Clica em linha do colaborador OU ícone "Ver timeline" |
| 5 | Admin | (Na timeline) Adiciona registro pontual ou aciona devolutiva | Botão "Adicionar registro" / Botão "Dar devolutiva" |
| 6 | Admin | (Devolutiva) Preenche formulário consolidado de fim de ciclo | Tela `RegistrarFeedbackLider` com Copiloto IA |

## 3. Modelo de dados envolvido

**Entidade central: `Registro`** (referência: `frontend/src/mocks/registros.ts`)

Campos principais:
- `id` (chave única)
- `alvoNome`, `alvoCargo` — pessoa sobre quem o registro é
- `autorNome`, `autorCargo`, `autorPapel`, `autorCor` — quem registrou (papéis: Líder, Colega, Colaborador, RH, Sistema). *(Papel "Auto-solicitado" removido em 2026-05-14 junto com o fluxo Solicitar 1:1 — ver PRD #6 Spike S2.)*
- `data` (texto livre — exibição; o backend definirá formato canônico)
- `tipo` — um dos 5 tipos (ver `glossario-rh.md` § "Tipos de registro"): Reconhecimento, Ponto de atenção, Feedback, Devolutiva, Anotação
- `texto` — corpo do registro
- `devolutiva?` (apenas tipo Devolutiva) — struct interna com `{ciclo, fortes, areas, recomendacoes, comentario}`

**Regra de visibilidade** (`registroVisivelPara`):
- Admin (RH): **vê tudo**
- Líder: vê tudo do time dele
- Colaborador: vê só sobre si mesmo E do tipo `visivelColab=true` (exclui Anotação).

**Mapeamento dos 5 tipos** (ver `glossario-rh.md` pra cores/ícones/descrição completos):

| Tipo | `visivelColab` | Criável no `RegistroModal`? |
|------|----------------|------------------------------|
| Reconhecimento | ✅ | ✅ |
| Ponto de atenção | ✅ | ✅ |
| Feedback | ✅ | ✅ |
| Devolutiva | ✅ | ❌ (só via `RegistrarFeedbackLider`) |
| Anotação | 🔒 (só Líder + RH) | ✅ |

## 4. Épico

| **Épico** | Permitir que o Admin/RH **orquestre, acompanhe e registre** apontamentos do time (líderes sobre liderados), com visão consolidada de toda a organização. |
| --- | --- |
| **Valor esperado** | Garantir que o RH tenha visibilidade total dos sinais informais que circulam no time — reconhecimentos, pontos de atenção, conversas de feedback, devolutivas pós-avaliação e anotações privadas dos líderes — usando esses sinais como insumo pra decisões de avaliação, sucessão, plano de carreira e diagnóstico organizacional. |

## 5. Histórias do Usuário

### HU-01 — Visualizar e filtrar lista de colaboradores com agregados de registros

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | ver uma lista consolidada de todos os colaboradores da organização com a contagem de Feedbacks e Anotações de cada um, |
| **Para** | identificar rapidamente quem tem pouco movimento, quem concentra muitas anotações, e priorizar onde meu acompanhamento é mais necessário. |

**Ref no protótipo:**
- Sidebar > "Gestão de Time(s)" > "Feedbacks e Anotações" (ponto de entrada padrão do módulo)
- Tela: listagem de colaboradores em tabela

**Fluxo detalhado:**
1. Admin clica em "Feedbacks e Anotações" na sidebar.
2. Sistema apresenta tabela com **uma linha por colaborador** da organização, ordenada por colaborador.
3. Cada linha mostra: avatar/inicial + nome do colaborador, cargo, time/área, **contagem agregada de "Feedbacks"** (bucket), **contagem agregada de "Anotações"** (bucket), data do último registro.
4. Cada linha tem duas ações: **"Ver timeline"** (abre HU-03) e **"Adicionar registro"** (abre HU-02 com colaborador pré-selecionado).
5. Toolbar superior tem: campo de **busca** (filtra por nome), botão **"Filtros"** (abre Drawer lateral com filtros por área/time/cargo), botão **"Novo registro"** global (abre HU-02 sem pré-seleção).
6. Admin usa busca/filtros pra reduzir a lista quando necessário.

**Regras de negócio:**

- **RN 1** — A lista deve mostrar **todos os colaboradores da organização**, mesmo os que não têm nenhum registro (linha com contagens zeradas).
- **RN 2** — O **bucket "Feedbacks"** agrega os tipos: Reconhecimento + Ponto de atenção + Feedback + Devolutiva.
- **RN 3** — O **bucket "Anotações"** agrega apenas o tipo Anotação (privado).
- **RN 4** — A contagem dos buckets respeita a **regra de visibilidade do viewer**. Como o Admin vê tudo, todas as contagens são totais reais. *(Quando esta mesma listagem aparece no perfil Líder, contagens são apenas do time do líder — ver PRD #4.)*
- **RN 5** — A coluna "Último registro" mostra a data do registro mais recente em qualquer um dos 5 tipos, do colaborador na linha.
- **RN 6** — Ordenação default: alfabética por nome. Cabeçalhos de coluna permitem ordenar por qualquer coluna.
- **RN 7** — Busca filtra por nome do colaborador (substring case-insensitive).
- **RN 8** — Drawer de filtros oferece: filtro por **área/time**, filtro por **cargo**. Filtros são acumulativos (AND). Botão "Limpar" zera filtros.

**Critérios de aceite:**

- **CA-01** — DADO um Admin na rota inicial do módulo, QUANDO carrega a tela, ENTÃO vê a tabela com TODOS os colaboradores da organização (mesmo sem registros), ordenada alfabeticamente.
- **CA-02** — DADO colaborador "Paula Carvalho" com 3 Reconhecimentos + 2 Feedbacks + 1 Anotação, QUANDO visualiza a linha dela, ENTÃO bucket "Feedbacks" mostra 5 e bucket "Anotações" mostra 1.
- **CA-03** — DADO o Admin digitando "paula" no campo de busca, ENTÃO a tabela filtra para mostrar apenas colaboradores cujo nome contém "paula" (case-insensitive).
- **CA-04** — DADO o Admin clicando em "Filtros" e selecionando área = "Engenharia", ENTÃO a tabela mostra apenas colaboradores da área Engenharia.
- **CA-05** — DADO filtros área = "Engenharia" + cargo = "Tech Lead", ENTÃO a tabela mostra apenas Tech Leads da Engenharia (filtro AND).
- **CA-06** — DADO o Admin clicando no cabeçalho da coluna "Anotações", ENTÃO a tabela é re-ordenada por essa coluna (toggle asc/desc em cliques sucessivos).

**Edge cases / cenários de falha:**

- **Lista vazia** (organização sem colaboradores): mostrar empty state com mensagem orientativa.
- **Busca sem resultados**: mostrar mensagem "Nenhum colaborador encontrado para '{termo}'".
- **Filtros zerando lista**: mostrar mensagem "Nenhum colaborador atende aos filtros aplicados" com botão "Limpar filtros".
- **Colaborador sem time/área**: mostrar "—" na coluna correspondente.

**Fora de escopo desta HU:**
- Exportar a lista (CSV/Excel) — virá em HU futura se necessário.
- Filtros por período do "Último registro" — não está no protótipo atual.
- Bulk actions (selecionar múltiplos colaboradores) — não está no protótipo atual.

**Resultado ao final do fluxo:** Admin tem visão consolidada da organização e identificou em qual(is) colaborador(es) precisa agir (entrar na timeline, criar registro, etc.).

**Pontos de atenção:**
- A contagem dos buckets é **derivada** — não armazenar como campo no `Registro`, calcular no momento da listagem.
- A regra de "Anotação só Líder + RH" precisa virar **filtro de query** no backend (não filtro de UI), pra Anotação nunca trafegar pro cliente do colab.

---

### HU-02 — Criar registro ad-hoc

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | registrar um Reconhecimento, Ponto de atenção, Feedback ou Anotação sobre qualquer colaborador da organização, |
| **Para** | capturar sinais que aparecem em conversas Admin↔colab/líder sem depender do líder direto registrar. |

**Ref no protótipo:**
- Botão **"Novo registro"** (toolbar global da listagem) — sem colaborador pré-selecionado
- Botão **"Adicionar registro"** (ação por linha da listagem ou dentro da timeline) — colaborador pré-selecionado
- Componente: modal `RegistroModal`

**Fluxo detalhado:**
1. Admin aciona um dos pontos de entrada acima.
2. Sistema abre **modal "Adicionar registro"** com 3 campos.
3. Campo **"Para"** (obrigatório): combobox de busca por colaborador. Se aberto a partir de linha/timeline específica, vem pré-preenchido como chip read-only (com botão "trocar").
4. Campo **"Tipo"** (obrigatório): Select com 4 opções: Reconhecimento / Ponto de atenção / Feedback / Anotação. **Devolutiva é excluída** (criada apenas via fluxo de devolutiva pós-avaliação — HU-05).
5. Ao selecionar tipo, sistema mostra **hint textual** descrevendo o tipo (ex: "Anotação interna visível apenas a você e ao RH.") e **chip de visibilidade** dinâmico ("🔒 Anotação privada — só você + RH" se tipo for Anotação; "Visível para: você + RH + {nome do alvo}" pros outros tipos).
6. Campo **"Comentário"** (obrigatório): textarea livre, 4 linhas visíveis.
7. Footer: botões **Cancelar** + **Salvar**.
8. Se tipo for Feedback, footer mostra dica adicional: *"Você poderá agendar o feedback pelo menu '…' do registro na timeline."*
9. Ao salvar com campos válidos: registro é criado, modal fecha, toast de sucesso aparece com mensagem contextual por tipo (ex: "Reconhecimento adicionado à timeline de Paula.").
10. Ao fechar modal com campos parcialmente preenchidos: abrir confirm dialog **"Descartar rascunho?"** com opções "Continuar editando" e "Descartar".

**Regras de negócio:**

- **RN 9** — Tipos criáveis no modal: apenas 4 dos 5 (Reconhecimento, Ponto de atenção, Feedback, Anotação). Devolutiva **NÃO** é opção.
- **RN 10** — Os 3 campos (Para, Tipo, Comentário) são **obrigatórios**. Submit sem preencher mostra erro inline em cada campo faltante.
- **RN 11** — Comentário não pode ser apenas whitespace (trim aplicado).
- **RN 12** — Quando tipo = "Anotação", chip de visibilidade muda visualmente (ícone de cadeado + cópia "🔒 Anotação privada — só você + RH").
- **RN 13** — *(REMOVIDO em 2026-05-14)* — antes definia que tipo "Feedback" nascia sem status pra ser setado depois via solicitação do colab. Ciclo de vida `solicitado/agendado/realizado` foi removido inteiro junto com o fluxo Solicitar 1:1 — ver PRD #6 Spike S2. Feedback agora é registro neutro (texto + autor + data).
- **RN 14** — Autor do registro = o próprio Admin logado. `autorPapel` = "RH" quando o autor é Admin (vs "Líder" quando é o Líder).
- **RN 15** — Data do registro = momento de criação (servidor define).
- **RN 16** — Se modal foi aberto com colaborador pré-selecionado (`paraPre`), o campo Para vem como chip read-only. Admin pode "trocar" clicando no botão X que volta pra combobox.
- **RN 17** — Confirm dialog "Descartar rascunho?" só aparece quando há texto digitado em Comentário OU tipo selecionado diferente do inicial OU Para selecionado diferente do `paraPre`. Caso contrário, fecha direto.

**Critérios de aceite:**

- **CA-07** — DADO o Admin no modal sem preencher Tipo, QUANDO clica em "Salvar", ENTÃO botão dispara validação, campo Tipo recebe borda vermelha + erro inline "Selecione um tipo".
- **CA-08** — DADO o Admin selecionou tipo "Anotação" e preencheu o colaborador "João", ENTÃO chip de visibilidade mostra texto "🔒 Anotação privada — só você + RH" (sem mencionar João).
- **CA-09** — DADO o Admin selecionou tipo "Reconhecimento" e colaborador "João", ENTÃO chip de visibilidade mostra "Visível para: você + RH + João".
- **CA-10** — *(REMOVIDO em 2026-05-14)* — antes verificava que o footer do modal exibia a dica "Você poderá agendar o feedback pelo menu '…' do registro na timeline." Texto removido da UI junto com o fluxo de agendamento (ver RN 13 e PRD #6 Spike S2).
- **CA-11** — DADO o Admin salvou um Reconhecimento para "Paula", ENTÃO modal fecha + aparece toast "Reconhecimento adicionado à timeline de Paula." (com primeiro nome).
- **CA-12** — DADO o Admin digitou um comentário e tenta fechar o modal (botão X ou ESC), ENTÃO aparece confirm dialog "Descartar rascunho?" com botões "Continuar editando" e "Descartar".
- **CA-13** — DADO o Admin abre o modal vazio e fecha sem mexer em nada, ENTÃO modal fecha direto, sem confirm dialog.
- **CA-14** — DADO modal aberto a partir da linha de "Paula" (paraPre), QUANDO Admin vê o modal, ENTÃO campo "Para" mostra chip "Paula Carvalho" read-only com botão para limpar.

**Edge cases / cenários de falha:**

- **Buscar colaborador inexistente**: mostrar "Nenhum colaborador encontrado" na lista do combobox.
- **Salvar com falha de rede**: manter modal aberto, mostrar toast de erro com opção "Tentar novamente".
- **Colaborador inativado** (após ter sido buscado mas antes de salvar): backend rejeita, sistema mostra erro orientativo.

**Fora de escopo desta HU:**
- Editar/excluir registro após criação — virá em HU futura.
- Anexar arquivo ao registro — não está no protótipo atual.
- Mencionar outros colaboradores no comentário (@pessoa) — não está no protótipo atual.

**Resultado ao final do fluxo:** registro novo aparece na timeline do colaborador alvo, com data de hoje, autor = Admin que criou, e visibilidade correta aplicada.

**Pontos de atenção:**
- Validação de obrigatoriedade deve ser bilateral: client-side (UX rápido) + server-side (segurança).
- Anotação nunca pode trafegar pra cliente de Colaborador — filtragem no nível de query.

---

### HU-03 — Drill-down: ver timeline completa de um colaborador

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | abrir a timeline completa de registros de um colaborador específico, |
| **Para** | contextualizar antes de uma conversa de RH, calibração de avaliação ou plano de sucessão. |

**Ref no protótipo:**
- Entrada principal: clicar no nome do colaborador na listagem (HU-01) OU ícone "Ver timeline" da linha
- Entrada alternativa: a partir do modal de preview (HU-04), botão "Abrir timeline"
- Componente: `ColaboradorTimeline`

**Fluxo detalhado:**
1. Admin clica na linha do colaborador (ou no ícone correspondente).
2. Sistema navega pra tela "Timeline de {Nome do colaborador}".
3. Header da tela: botão "Voltar" + Nome do colaborador + cargo + área.
4. Body: **lista de registros do colaborador**, do mais recente pro mais antigo, com cards que mostram: tipo (com ícone e cor), autor (nome + papel), data, texto do registro.
5. Filtros: barra opcional pra filtrar por tipo (chips dos 5 tipos como toggles).
6. Toolbar: botões **"Adicionar registro"** (abre HU-02 com colaborador pré-selecionado) e **"Dar devolutiva"** (abre HU-05) — este último só visível **se o colaborador tem avaliação consolidada disponível**.
7. Cada card de registro tem **menu "…"** com ações por tipo (ex: pro tipo Feedback aparece "Agendar", "Marcar como realizado"; pra outros tipos pode aparecer "Editar", "Excluir").
8. Em registros tipo Anotação, badge visual indica privacidade ("só você + RH").
9. Em registros tipo Devolutiva, card é renderizado read-only com os 4 campos estruturados (Pontos fortes, Áreas a desenvolver, Recomendações, Comentário geral) + identificação do ciclo de origem.
10. Empty state (colaborador sem registros): mensagem "Nenhum registro ainda" + botão "Adicionar primeiro".

**Regras de negócio:**

- **RN 18** — Timeline mostra todos os registros visíveis ao Admin (que é "tudo"). Pra Líder seria filtrado pelo time; pra Colab seria filtrado pelo `visivelColab=true`.
- **RN 19** — Ordenação default: data decrescente (mais recente primeiro).
- **RN 20** — Filtro por tipo via chips: cada chip clicado é toggle (ativa/desativa o filtro). Múltiplos chips ativos = OR (registros de qualquer tipo selecionado).
- **RN 21** — Botão "Dar devolutiva" aparece **somente se** existe `AvaliacaoConsolidada` pra esse colaborador. Senão, botão oculto (não desabilitado).
- **RN 22** — Empty state aparece quando colaborador não tem nenhum registro **e** sem filtros aplicados. Se tiver filtros aplicados zerando a lista, mostrar mensagem "Nenhum registro do(s) tipo(s) selecionado(s)" + botão "Limpar filtros".
- **RN 23** — Cards de Devolutiva são read-only — não há "editar Devolutiva" pelo menu "…". Pra atualizar uma devolutiva, abre-se o fluxo HU-05 novamente.
- **RN 24** — Cards de Anotação exibem badge visual "🔒 Privado" pra reforçar que o colaborador não enxergaria esse card.

**Critérios de aceite:**

- **CA-15** — DADO o Admin clica no nome "Paula Carvalho" na listagem, ENTÃO navega pra tela "Timeline de Paula Carvalho" com lista dos registros dela.
- **CA-16** — DADO a timeline está aberta para um colaborador, ENTÃO os registros aparecem em ordem decrescente de data (mais recente no topo).
- **CA-17** — DADO o Admin clica no chip "Reconhecimento" na barra de filtros, ENTÃO a timeline filtra para mostrar apenas registros tipo Reconhecimento; clicando de novo, desativa o filtro.
- **CA-18** — DADO o colaborador tem 0 registros, ENTÃO timeline exibe empty state "Nenhum registro ainda" + botão "Adicionar primeiro".
- **CA-19** — DADO o colaborador tem `AvaliacaoConsolidada` disponível, ENTÃO botão "Dar devolutiva" aparece na toolbar.
- **CA-20** — DADO o colaborador NÃO tem `AvaliacaoConsolidada` disponível, ENTÃO botão "Dar devolutiva" NÃO aparece.
- **CA-21** — DADO um card é do tipo Anotação, ENTÃO ele exibe um badge visual "🔒 Privado" para reforçar a regra de visibilidade.
- **CA-22** — DADO um card é do tipo Devolutiva, ENTÃO ele renderiza os 4 campos estruturados (Pontos fortes, Áreas a desenvolver, Recomendações, Comentário geral) em modo read-only.

**Edge cases / cenários de falha:**

- **Colaborador inativo**: timeline ainda acessível com banner indicando inatividade; registros antigos preservados.
- **Carga lenta** (muitos registros): paginação ou infinite scroll (decisão do dev — ver "Fora de escopo").
- **Registro deletado durante visualização**: silenciosamente removido na próxima atualização.

**Fora de escopo desta HU:**
- Paginação/infinite scroll de registros — decisão do time twyg-app conforme volume real.
- Exportar timeline (PDF/CSV) — não está no protótipo atual.
- Filtros por autor ou por período — não estão no protótipo atual.
- Comentários encadeados (thread) num registro — não estão no protótipo atual.

**Resultado ao final do fluxo:** Admin tem o histórico completo do colaborador e pode decidir próximo passo (adicionar registro, dar devolutiva, voltar à lista).

**Pontos de atenção:**
- A condição "tem `AvaliacaoConsolidada`" é insumo da entidade externa Avaliação/Ciclo — backend precisa joinar essa info pra decidir se botão aparece.
- Menu "…" de cada card terá ações variáveis por tipo — definição final das ações fica detalhada em PRD adjacente (Líder), porque é cotidiano do líder.

---

### HU-04 — Pré-visualizar registros por bucket (modal de preview)

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | espiar rapidamente os últimos registros de um colaborador num bucket específico (Feedbacks ou Anotações) sem entrar na timeline completa, |
| **Para** | confirmar uma intuição ou checar contexto antes de decidir se vou aprofundar. |

**Ref no protótipo:**
- Entrada: clicar no chip de contagem "Feedbacks" ou "Anotações" da linha do colaborador na listagem (HU-01)
- Componente: `RegistrosPreviewModal`

**Fluxo detalhado:**
1. Admin clica no chip de contagem (ex: chip "Feedbacks: 5") na linha de um colaborador.
2. Sistema abre modal de preview com header "Feedbacks de {Nome do colaborador}".
3. Modal lista os registros do colaborador **filtrados pelo bucket clicado** (Feedbacks ou Anotações), do mais recente pro mais antigo, em formato compacto (sem ações por linha).
4. Footer do modal: botão **"Abrir timeline"** (navega pra HU-03) + botão "Fechar".
5. Modal fecha ao clicar fora ou no botão Fechar.

**Regras de negócio:**

- **RN 25** — Preview do bucket "Feedbacks" mostra: Reconhecimento + Ponto de atenção + Feedback + Devolutiva (mesma regra de agrupamento da HU-01).
- **RN 26** — Preview do bucket "Anotações" mostra: apenas Anotação.
- **RN 27** — Preview respeita a regra de visibilidade do viewer. Admin vê tudo — mas o modal foi reusado pra outros perfis no protótipo (Líder, Colab) onde a filtragem se aplica.
- **RN 28** — Modal **não** permite criar/editar/excluir registros — é só leitura.
- **RN 29** — Botão "Abrir timeline" sempre presente, leva pra tela da HU-03.

**Critérios de aceite:**

- **CA-23** — DADO o Admin clica no chip "Feedbacks: 5" da linha de "Paula", ENTÃO modal abre listando os 5 registros nos tipos do bucket Feedbacks dela.
- **CA-24** — DADO o modal está aberto pelo bucket "Anotações", ENTÃO mostra apenas registros tipo Anotação.
- **CA-25** — DADO o Admin clica em "Abrir timeline" no footer do modal, ENTÃO navega pra timeline completa do colaborador (HU-03).
- **CA-26** — DADO um colaborador tem 0 registros no bucket clicado (caso edge), ENTÃO modal exibe mensagem orientativa "Nenhum registro neste bucket".

**Edge cases / cenários de falha:**

- **Bucket vazio** mas contagem mostrava ≥1 (race condition): mostrar empty state dentro do modal.

**Fora de escopo desta HU:**
- Ações de criar/editar dentro do preview — explicitamente proibido (RN 28).
- Filtros adicionais dentro do modal — design escolheu manter simples.

**Resultado ao final do fluxo:** Admin teve um vislumbre dos registros sem perder o contexto da listagem global; ou decidiu aprofundar via "Abrir timeline".

**Pontos de atenção:**
- O preview reusa o mesmo dado da timeline com filtro de bucket — mesma fonte, mesma regra de visibilidade.

---

### HU-05 — Dar devolutiva pós-avaliação

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | registrar a devolutiva formal pós-avaliação de um colaborador quando o líder dele não estiver disponível ou eu precisar atuar como observador, |
| **Para** | garantir que o ciclo de avaliação se feche com a entrega da devolutiva ao colaborador. |

> **Nota:** Este fluxo é **primariamente do Líder** (registra devolutiva sobre liderado direto). O Admin tem acesso pra atuar como **backup ou observador**. A descrição detalhada vive aqui (PRD do Admin) e é **referenciada** pelo PRD do Líder (#4), evitando duplicação.

**Ref no protótipo:**
- Entrada: botão **"Dar devolutiva"** dentro da timeline do colaborador (HU-03), visível quando colaborador tem `AvaliacaoConsolidada` disponível.
- Componente: `RegistrarFeedbackLider` (tela completa, não modal)

**Fluxo detalhado:**
1. Admin abre a timeline do colaborador (HU-03) e clica em **"Dar devolutiva"**.
2. Sistema navega pra tela "Devolutiva — {Nome do colaborador} — {Ciclo}".
3. Tela tem 2 áreas lado a lado:
   - **Esquerda (form principal)**: 4 campos `Textarea` empilhados verticalmente.
   - **Direita (Copiloto IA)**: painel com sugestões automáticas geradas a partir da `AvaliacaoConsolidada`.
4. **Form principal** — 4 campos:
   - **Pontos fortes** (obrigatório): "O que essa pessoa faz muito bem? Entregas, postura, habilidades."
   - **Áreas a desenvolver** (obrigatório): "O que precisa desenvolver no próximo ciclo? Ex: liderança, técnica, comunicação."
   - **Recomendações** (opcional): "Trilhas, conteúdos, experiências recomendadas (opcional)."
   - **Comentário geral** (opcional): "Qualquer observação adicional (opcional)."
5. **Copiloto IA** (painel lateral): sugere conteúdo nos 3 primeiros campos com base na análise da consolidação (discrepâncias entre autoavaliação e avaliação do líder, "forças ocultas" e "fraquezas ocultas"). Admin clica em sugestão pra adicionar ao campo correspondente. Sugestões aceitas somem da lista.
6. Footer: botões Cancelar + Salvar.
7. Ao salvar com obrigatórios preenchidos: registro tipo "Devolutiva" é criado na timeline do colaborador (visível ao colab), tela fecha e volta pra timeline.
8. Se já existe Devolutiva pra esse colaborador + ciclo (helper `findDevolutivaExistente`), sistema oferece **editar a existente** em vez de criar nova.

**Regras de negócio:**

- **RN 30** — Devolutiva só é acessível quando colaborador tem `AvaliacaoConsolidada` no ciclo vigente.
- **RN 31** — Campos obrigatórios: Pontos fortes + Áreas a desenvolver. Recomendações e Comentário geral são opcionais.
- **RN 32** — Devolutiva criada **grava como Registro tipo "Devolutiva"** com struct interna `devolutiva: {ciclo, fortes, areas, recomendacoes, comentario}`.
- **RN 33** — Devolutiva é **visível ao colaborador** (`visivelColab=true`) — diferente de Anotação. É contrato do processo de avaliação.
- **RN 34** — Apenas Admin e Líder podem dar devolutiva. Colaborador nunca acessa este fluxo (botão "Dar devolutiva" não aparece pra ele).
- **RN 35** — Sugestões do Copiloto IA são **opcionais e descartáveis** — Admin pode salvar a devolutiva sem aceitar nenhuma sugestão.
- **RN 36** — Painel Copiloto separa sugestões em 3 baldes: pontos fortes, áreas a desenvolver, recomendações. Cada sugestão aceita é removida da lista visível.
- **RN 37** — Se já existe Devolutiva pra esse colaborador+ciclo, sistema entra em modo "edição" — campos pré-preenchidos com a devolutiva existente; botão Salvar atualiza em vez de criar novo registro.
- **RN 38** — `autorPapel` da Devolutiva = "RH" quando Admin acionou, "Líder" quando Líder acionou.

**Critérios de aceite:**

- **CA-27** — DADO o colaborador tem `AvaliacaoConsolidada`, QUANDO o Admin clica em "Dar devolutiva" na timeline, ENTÃO navega pra tela de devolutiva com form vazio (se não existe devolutiva) ou preenchido (se existe — RN 37).
- **CA-28** — DADO o Admin tenta salvar com "Pontos fortes" vazio, ENTÃO submit bloqueia + erro inline no campo.
- **CA-29** — DADO o Admin preenche apenas Pontos fortes + Áreas a desenvolver (deixando Recomendações e Comentário em branco) e clica em Salvar, ENTÃO devolutiva é criada com sucesso (campos opcionais ficam vazios na struct).
- **CA-30** — DADO o Copiloto IA mostra a sugestão "Comunicação assertiva em reuniões" no balde "Pontos fortes", QUANDO o Admin clica nela, ENTÃO o texto é adicionado ao campo Pontos fortes e a sugestão desaparece do painel.
- **CA-31** — DADO o Admin salva a devolutiva, ENTÃO um Registro tipo "Devolutiva" é criado na timeline do colaborador com a struct preenchida, visível ao próprio colaborador.
- **CA-32** — DADO já existe uma Devolutiva pro colaborador no ciclo vigente, QUANDO o Admin clica em "Dar devolutiva", ENTÃO o form abre pré-preenchido com a devolutiva existente em modo edição.

**Edge cases / cenários de falha:**

- **Consolidação atualizada durante edição**: se a `AvaliacaoConsolidada` mudar enquanto o Admin tá no form, Copiloto regenera sugestões; o que já foi digitado no form é preservado.
- **Salvar com falha de rede**: manter form aberto, mostrar toast de erro + opção "Tentar novamente".
- **Colaborador inativado após carregar a tela**: backend rejeita salvamento, mostra erro orientativo.

**Fora de escopo desta HU:**
- Exportar devolutiva em PDF — não está no protótipo atual.
- Editar devolutiva criada via menu "…" do card na timeline — atualização hoje é re-acessando este fluxo (RN 37).
- Notificações automáticas pro colaborador quando devolutiva é publicada — operacionalização fora deste PRD.
- Comparação visual entre devolutivas de ciclos diferentes do mesmo colaborador — não está no protótipo atual.

**Resultado ao final do fluxo:** colaborador tem uma Devolutiva registrada na timeline dele, visível pra ele, com os 4 campos estruturados preenchidos.

**Pontos de atenção:**
- Copiloto IA é heurístico no protótipo (mock baseado em discrepâncias da consolidação). Decisão de virar IA real ou manter heurística é do time twyg-app.
- A struct `devolutiva` é específica do tipo Devolutiva — exige modelagem que permita campos estruturados por tipo de Registro.
- A regra "Devolutiva é visível ao colab" inverte a expectativa antiga (quando era tipo "Outro" privado). Atenção redobrada com regra de visibilidade.

## 6. Spike

> **S1 — Estrutura específica por tipo de Registro**
>
> **Pergunta**: a entidade `Registro` no twyg-app deve carregar campos estruturados específicos por tipo (caso da Devolutiva, com 4 campos) ou tudo serializado num blob/JSON?
>
> **Risco se ignorado**: se serializar tudo como texto plano, perde tipagem + dificulta queries (ex: "todas as devolutivas que mencionam liderança no campo Áreas a desenvolver") + dificulta migração quando estrutura evoluir.
>
> **Critério de done**: decisão documentada no twyg-app sobre como o backend representa o `devolutiva: {ciclo, fortes, areas, recomendacoes, comentario}`. O PRD aqui é agnóstico de implementação, mas sinaliza que a estrutura existe e é semanticamente relevante.

> **S2 — Performance da listagem com agregados**
>
> **Pergunta**: a lista de colaboradores com contagens agregadas por bucket (HU-01) escala bem com organizações grandes (milhares de colaboradores, dezenas de milhares de registros)? Conta direta no banco a cada request, view materializada, cache?
>
> **Risco se ignorado**: tela inicial do módulo carregar lenta inviabiliza UX.
>
> **Critério de done**: estratégia de cálculo dos agregados validada com volume realista de dados.

> **S3 — Geração das sugestões do Copiloto IA**
>
> **Pergunta**: a geração de sugestões do painel Copiloto (HU-05) é heurística determinística (baseada em discrepâncias da consolidação) ou usa LLM real? Quando roda — síncrono ao abrir a tela ou pré-computado?
>
> **Risco se ignorado**: se for LLM real e sem cache, custo + latência por abertura de devolutiva.
>
> **Critério de done**: decisão sobre engine + estratégia de cache.

---

## 7. Como testar

### Tags Playwright

- `@admin @feedbacks @critical` — visibilidade de Anotação (RN 1), criação de Registro ad-hoc
- `@admin @feedbacks @high` — drill-down timeline, Copiloto IA (3 baldes)
- `@admin @feedbacks @visual @gap-09` — render Devolutiva uppercase roxo

### Pré-requisitos

- Admin/RH logado
- Feature flag `performance_module_enabled` ON
- DB com fixtures + ciclo encerrado (pra Devolutiva)

### Rodar local

```bash
cd frontend && yarn dev   # protótipo
# ou
cd ../twyg-app && make start && yarn playwright test --grep "@admin @feedbacks"
```

---

## 8. Cross-references

### HUs com gap aberto no protótipo

- **HU-01** (Devolutiva render): [gap-09](../gaps/gap-09-devolutiva-render-3-superficies.md) — RN 9 inconsistência visual nas 3 superfícies
- **HU-05** (Copiloto IA): [gap-03](../gaps/gap-03-copiloto-ia-3-baldes.md) — 3 baldes vs 4 accordions
- **Geral** (Salvar rascunho devolutiva): [gap-15](../gaps/gap-15-salvar-rascunho-nao-persiste.md)

### Modelo compartilhado

- **Registro** (5 tipos): consumido por [PRD #4](./prd-lider-feedbacks-anotacoes.md) (Líder filtra por papel) e [PRD #6](./prd-aluno-feedbacks-recebidos.md) (Aluno vê só visível)
- **Devolutiva**: gerada por Líder ([PRD #3](./prd-lider-desenvolvimento.md) HU-03 consolidação) → exibida aqui (Admin overview) → também em [PRD #6](./prd-aluno-feedbacks-recebidos.md)

### Glossário e regras

- 5 tipos de Registro + visibilidade: [`glossary.md § 3.7`](../glossary.md#37-registro-ui-feedbacks-e-anotações)
- Estilo Devolutiva (uppercase roxo): [`glossary.md`](../glossary.md) + PRD #6 RN 9

### Twy plan (twyg-app)

- D08 (Feedbacks e Anotações + Aluno timeline) — ver `../../twyg-app/.twy/performance-module/deliverables/D08.md`
