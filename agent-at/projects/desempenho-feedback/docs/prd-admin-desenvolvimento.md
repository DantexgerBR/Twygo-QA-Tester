# PRD — Admin > Gestão de Time(s) > Desenvolvimento

| Produto | Twygo — DHO — módulo Desenvolvimento |
| --- | --- |
| Escopo desta entrega | Jornada do perfil **Admin (RH)** no orquestrador de Ciclos / Campanhas / Avaliações / 9-box |
| Audiência | Time de dev twyg-app (Rails + React Clean Arch) — dev primário: João |
| Base utilizada | Protótipo (localhost:5173, branch `main`) + `docs/glossario-rh.md` + `docs/poc-desempenho/regras-default-ciclo.md` + memória `project_ciclo_campanha_model.md` |
| Fora de escopo | Eficácia (Participativo); PDI/Competências/Sucessão (outros grupos); perfis Líder e Aluno (PRDs #3 e #5/#6); módulo Feedbacks e Anotações (PRD #2) |

## 1. Visão geral da jornada

O Admin/RH é o **dono do processo avaliativo** da organização. Estrutura ciclos (períodos com regras), opera campanhas (cada rodada aplicada a um grupo) dentro deles, acompanha o progresso da resposta, faz a calibração final (9-box) e consolida feedbacks pós-avaliação.

A jornada do Admin se divide em **5 momentos**:
1. **Estruturar o ciclo** — definir nome, período, tipos de avaliação incluídos, configurações de pares, método de finalização, threshold de discrepância.
2. **Configurar campanhas dentro do ciclo** — período específico (sub-intervalo do Ciclo) e participantes. Campanha herda toda configuração avaliativa do Ciclo. *(Público-alvo como campo de seleção está fora de escopo nesta fase — ver RN 16.)*
3. **Acompanhar progresso** — dashboard de "Status dos times" pra ver adesão, atrasos, pendências de líderes e liderados.
4. **Calibrar resultados** — sessão de calibração 9-box dentro do ciclo, alinhamento Performance × Potencial.
5. **Consolidar e gerar análise** — pós-fim de ciclo, consolidar avaliações por colaborador, decidir nota final pelo método configurado, gerar visão analítica.

Existe ainda uma **ferramenta de análise 9-box standalone** (fora de ciclo) — visão consolidada da organização ao longo do tempo, independente de ciclo ativo, pra acompanhamento contínuo de talento.

## 2. Mapa do fluxo principal

| Etapa | Ator | Ação | Tela / Local na UI |
|-------|------|------|---------------------|
| 1 | Admin | Acessa o módulo | Sidebar > "Gestão de Time(s)" > "Desenvolvimento" |
| 2 | Admin | Vê listagem de ciclos (default) | Tab "Todos os ciclos" |
| 3 | Admin | Cria ciclo novo | Botão "+ Novo ciclo" → form `CicloConfigForm` |
| 4 | Admin | Configura campanhas | Linha de ciclo → menu "…" → "Ver campanhas" → `CampanhasList` |
| 5 | Admin | Acompanha progresso | Tab "Status dos times" |
| 6 | Admin | Consolida feedback de colaborador | Sub-screen `ConsolidarFeedbackPage` (a partir da listagem de avaliações) |
| 7 | Admin | Calibra 9-box (dentro de ciclo) | Sub-screen `MatrizPage` (a partir do ciclo) |
| 8 | Admin | Analisa 9-box standalone | Tab "Visão 9-box" |

## 3. Modelo de dados envolvido

**Entidades centrais:**
- **Ciclo** — container temporal/estratégico. Campos: nome, dataInicio, dataFim, tipo (derivado das datas: Mensal/Trimestral/Semestral/Anual/Personalizado — campo interno, **não exibido na UI do form**), status (Rascunho/Programado/Em andamento/Finalizado), tiposAvaliacao incluídos, tiposColeta, configPares `{modo, qtdEsperada, minimoEncerrar}`, metodoFinalizacao (consenso/ponderado/adocao), thresholdDiscrepancia (default 1.5), `dataInicioPlanejada`/`dataFimPlanejada` imutáveis, `historicoMudancasDatas[]`.
- **Campanha** — rodada concreta dentro de um Ciclo. Varia apenas: período (sub-intervalo dentro do Ciclo) e participantes. Herda toda configuração avaliativa do Ciclo. Status: Rascunho / Agendada / Aguardando pares / Em andamento / Encerrada. **Público-alvo fora de escopo desta fase** (ver RN 16).
- **Avaliação individual** — uma resposta de um avaliador sobre um avaliado, dentro de uma Campanha. Tipos: Auto, Líder, Pares, Liderado. *(Gestor matricial removido — decisão Twygo review 2026-05-08: "não existe na realidade"; cada Pessoa tem 1 `liderDiretoId` único — ver PRD #7.)*
- **AvaliacaoConsolidada** — agregação por colaborador no fim da campanha, com notas por sessão e papel, threshold de discrepância aplicado.
- **Resumo do ciclo** (`ResumoCiclo` no protótipo) — **não é uma entidade paralela ao Ciclo**. O Ciclo Finalizado JÁ É o registro read-only definitivo; o "resumo" é apenas uma foto de métricas derivadas do ciclo fechado (completude, score médio, top/bottom sessão) exibida no card de Consolidação. Imutável. A decisão de materializar on-the-fly (calcular na query) ou persistir (gravar ao encerrar) é de implementação no twyg-app real.

**Princípios** (canonizados em review 2026-05-08 com Rovina; atualizado 2026-05-26):
- **Estados terminais não reabrem** (decisão 2026-05-26 — reverte o princípio de reversibilidade do Rovina): Ciclo **Finalizado** e Campanha **Encerrada** são terminais; não há ação "Reabrir". Reabrir quebrava a consistência de status/ações encadeadas.
- **Tipo de ciclo é derivado do período**, não escolhido manualmente. Faixas: 25-35d=Mensal, 80-100d=Trimestral, 170-200d=Semestral, 330-400d=Anual, resto=Personalizado. **Tag de tipo foi removida da UI** (era derivada do período, sem uso na tela — decisão 2026-05-15).
- **Configuração toda no Ciclo**. Campanha só varia período e participantes. Tipos de avaliação são definidos no Ciclo e herdados pela Campanha como read-only (não configuráveis na Campanha).
- **Plano original × situação atual** — `dataInicioPlanejada` e `dataFimPlanejada` são imutáveis após criação; mudanças vão em `historicoMudancasDatas[]`.

## 4. Épico

| **Épico** | Permitir que o Admin/RH **estruture, opere, acompanhe, calibre e consolide** o processo avaliativo da organização, com flexibilidade de método de finalização. |
| --- | --- |
| **Valor esperado** | Transformar avaliação de desempenho de um processo burocrático em ferramenta de gestão estratégica — orquestrando múltiplos tipos de avaliação (Desempenho, Experiência, Pares, 9-box), aplicando-os a públicos distintos, acompanhando adesão em tempo real, e gerando insights consolidados pra decisões de carreira, sucessão e desenvolvimento. |

## 5. Histórias do Usuário

### HU-01 — Listar e filtrar ciclos

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | ver todos os ciclos da organização com status, período e progresso, |
| **Para** | identificar rapidamente o que está ativo, o que terminou, e onde preciso agir. |

**Ref no protótipo:** Sidebar > "Gestão de Time(s)" > "Desenvolvimento" → tab **"Todos os ciclos"** (default do Admin).

**Fluxo detalhado:**
1. Admin entra no módulo e vê tab "Todos os ciclos" ativa.
2. Sistema exibe **tabela de ciclos** com colunas: Nome, Período (dataInicio—dataFim), Tipo (derivado), Status (chip colorido), Avaliações incluídas, Campanhas (contador), Ações.
3. Toolbar superior: busca por nome, filtros por status, botão **"+ Novo ciclo"** (entra HU-02).
4. Cada linha tem **menu "…"** com: Editar, Ver campanhas (entra HU-03), Prorrogar prazo (se Em andamento), Ver histórico (se Em andamento ou Finalizado), Duplicar, Excluir (apenas se Rascunho).

**Regras de negócio:**

- **RN 1** — Status do Ciclo: Rascunho / Programado / Em andamento / Finalizado. Chip visual distinto por status.
- **RN 2** — Ciclo "Finalizado" é estado **terminal** — não há ação "Reabrir" (decisão 2026-05-26; reverte o princípio de reversibilidade do Rovina).
- **RN 3** — Apenas ciclos em Rascunho podem ser excluídos. Ciclos com Campanhas em andamento exigem confirmação adicional pra Finalizar.
- **RN 4** — Tipo do ciclo é **derivado** das datas (não escolhido). **Tag de tipo foi removida da UI** (decisão 2026-05-15 — derivação é cálculo interno, usuário não vê na listagem nem no form). Campo `tipo` continua persistido no modelo pra uso futuro.
- **RN 5** — Filtros: busca por nome (substring), filtro por status (multi-select).
- **RN 6** — Ordenação default: por dataInicio decrescente (mais recente primeiro).
- **RN 6.1 — Duplicar ciclo** (#4, decisão 2026-05-26): a ação "Duplicar" (menu "…", disponível em qualquer status) cria um novo ciclo em **Rascunho**, nome **"Cópia de {original}"**, com **período sugerido no próximo intervalo equivalente** — mesma duração, deslocada pra logo após o fim do original (ex.: Anual 2026 → 2027), **editável** pra ajuste fino (por isso nasce Rascunho). As **campanhas do ciclo são copiadas junto**, com suas datas deslocadas proporcionalmente à nova data-referência do ciclo. Histórico de mudanças de datas e progresso nascem **zerados** (a cópia não herda audit trail).

**Critérios de aceite:**

- **CA-01** — DADO o Admin entra em Desenvolvimento, ENTÃO vê a tab "Todos os ciclos" ativa por default com a tabela carregada.
- **CA-02** — DADO um ciclo no status "Finalizado", QUANDO o Admin abre menu "…", ENTÃO NÃO há opção "Reabrir" (estado terminal).
- **CA-03** — DADO um ciclo em Rascunho, QUANDO o Admin clica em "Excluir", ENTÃO sistema pede confirmação antes de deletar.
- **CA-04** — DADO um ciclo em "Em andamento" com Campanhas em andamento, QUANDO o Admin tenta Finalizar, ENTÃO confirm dialog avisa sobre impacto + lista campanhas afetadas.
- **CA-04.1** — DADO um ciclo qualquer, QUANDO o Admin clica "Duplicar" no menu "…", ENTÃO um novo ciclo é criado em Rascunho com nome "Cópia de {nome}", período no próximo intervalo equivalente (editável) e campanhas copiadas com datas deslocadas.

**Edge cases / fora de escopo:** organização sem ciclos → empty state com CTA "Criar primeiro ciclo". Bulk actions fora desta HU.

**Resultado:** Admin tem visão consolidada de todos os ciclos e decide próximo passo (criar, editar, configurar campanhas, etc).

**Pontos de atenção:** ordenação e contagem de campanhas devem ser eficientes pra organizações com volume alto de histórico.

---

### HU-02 — Criar e editar ciclo

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | configurar um novo ciclo com todas as regras avaliativas (tipos incluídos, pares, método de finalização, threshold), |
| **Para** | que campanhas subsequentes herdem essa configuração sem precisar repetir setup. |

**Ref no protótipo:** Botão "+ Novo ciclo" da listagem (HU-01) → form `CicloConfigForm` (multi-step). Editar via menu "…" → "Editar" da linha.

**Fluxo detalhado:**
1. Admin clica em "+ Novo ciclo".
2. Sistema abre form multi-step com **4 abas** no topo (estado atual `CicloConfigForm.tsx:370-375`):
   - **Identificação** (`required`): nome, dataInicio, dataFim. Tipo derivado das datas persiste no modelo (RN 7) mas a UI **não mostra** chip "Tipo detectado" durante a edição — derivação é só interna.
   - **Avaliações** (`required`): checkbox por tipo de avaliação (Desempenho / Experiência / 9-box). Quando "Avaliação de Desempenho" é marcada, **modelo de formulário obrigatório** (FormularioPicker logo abaixo do checkbox; sem ele a aba fica pendente). Demais tipos não exigem modelo.
   - **Etapas** (`required`): `tiposColeta` (Auto/Líder/Pares/Liderado — quais participam), `configPares` (modo sorteio/manual + qtdEsperada + minimoEncerrar) e `metodoFinalizacao` (consenso/ponderado/adocao).
   - **Configurações adicionais** (`required: false`, renomeado de "Resultados" em 2026-05-15 pra evitar conflito com o conceito "Resultados" definido na aba Etapas): Threshold de discrepância (checkbox de ativação **default desmarcado** desde 2026-05-15, slider só aparece quando ativado, default do valor é 1.5) e Calibração 9-box (checkbox default desmarcado, abre modal de config quando ativado).
3. Em cada aba, validação inline. Footer com **Voltar / Próximo / Salvar como Rascunho / Salvar e Programar**. Pendências aparecem como `!` amarelo no header da aba; abas válidas ganham ✅.
4. Ao Salvar e Programar: ciclo entra em status Programado, fica disponível pra criação de Campanhas. Transiciona automaticamente pra "Em andamento" quando `dataInicio` é atingida.
5. Edição: mesmo form pré-preenchido. Campos `dataInicioPlanejada`/`dataFimPlanejada` ficam visíveis mas read-only; mudanças nas datas atuais geram entrada em `historicoMudancasDatas[]`.

**Regras de negócio:**

- **RN 7** — Tipo do Ciclo (Mensal/Trimestral/etc) é **derivado das datas** e persistido no modelo do ciclo (`tipo` no record final). Faixas: 25-35d=Mensal, 80-100d=Trimestral, 170-200d=Semestral, 330-400d=Anual, resto=Personalizado. **Importante (2026-05-15)**: o chip "Tipo detectado: X" foi **removido da UI** durante a edição — derivação é cálculo interno, usuário não vê preview do tipo no form. Se a porta no twyg-app quiser sinalizar o tipo, prefira mostrar APÓS o ciclo ser criado (listagem/detalhe), não no form de edição.
- **RN 7.1** — Quando "Avaliação de Desempenho" estiver marcada na aba Avaliações, é **obrigatório selecionar um modelo de formulário** (FormularioPicker). Sem modelo, a aba fica como pendente (`!` amarelo no header) e Salvar e Ativar é bloqueado — ciclo sem modelo de formulário não tem como ser respondido.
- **RN 8** — Campos imutáveis após criação: `dataInicioPlanejada`, `dataFimPlanejada`. Mudanças de data atual após criação registram entrada em `historicoMudancasDatas[]` (com justificativa opcional).
- **RN 9** — `configPares` tem 3 sub-campos: `modo` (sorteio | manual), `qtdEsperada` (number, default 5), `minimoEncerrar` (number, default 2).
- **RN 10** — `metodoFinalizacao` é select obrigatório com 3 opções: consenso, ponderado, adocao.
- **RN 11** — Validação de pesos: se método=ponderado, soma dos pesos dos tipos de coleta deve dar 100% (validação client + server).
- **RN 12** — Salvar como Rascunho é permitido mesmo com campos incompletos. Salvar e Programar exige todos os campos obrigatórios.
- **RN 13** — Não é possível Salvar e Programar se houver outro ciclo Em andamento com período sobreposto (validação server).

**Critérios de aceite:**

- **CA-05** — DADO o Admin preenche dataInicio=01/01/2026 e dataFim=31/03/2026 (90 dias), QUANDO salva o ciclo, ENTÃO o registro persistido recebe `tipo: "Trimestral"` no modelo. (UI do form **não exibe** chip de detecção durante a edição — derivação é interna.)
- **CA-06** — DADO o Admin preenche datas com 50 dias de range, QUANDO salva, ENTÃO o registro persistido recebe `tipo: "Personalizado"`.
- **CA-06.1** — DADO "Avaliação de Desempenho" marcada na aba Avaliações sem FormularioPicker preenchido, QUANDO Admin tenta Salvar e Ativar, ENTÃO sistema bloqueia e mantém aba "Avaliações" com indicador de pendência. Helper text vermelho "Selecione um modelo de formulário pra continuar." aparece abaixo do picker; borda do card fica vermelha (`#E53E3E`).
- **CA-07** — DADO o Admin escolheu método=ponderado e os pesos somam 80%, QUANDO tenta Salvar e Ativar, ENTÃO sistema bloqueia com erro "Pesos devem somar 100%".
- **CA-08** — DADO o Admin usa "Prorrogar prazo" em um ciclo Em andamento, QUANDO confirma a nova dataFim, ENTÃO entrada é adicionada em `historicoMudancasDatas[]` com timestamp + log de auditoria visível via "Ver histórico".
- **CA-09** — DADO o Admin tenta Salvar como Rascunho com nome vazio, ENTÃO sistema bloqueia campo Nome (único obrigatório no Rascunho).

**Nota (ciclo Em andamento — #5)**: Ciclo no status "Em andamento" **só permite prorrogar prazo** (alterar `dataFim`) via ação "Prorrogar prazo" + gera entrada em `historicoMudancasDatas[]` com log de auditoria. Nenhum outro campo é editável nesse status.

**Fora de escopo:** notificações automáticas pros participantes ao Ativar ciclo (operacional fora deste PRD).

**Resultado:** ciclo criado/editado com configuração completa, pronto pra receber Campanhas.

---

### HU-03 — Configurar campanhas dentro de ciclo

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | criar uma ou mais campanhas dentro de um ciclo, cada uma com período e público específico, |
| **Para** | aplicar a configuração do ciclo a recortes diferentes da organização (ex: time A em janeiro, time B em fevereiro). |

**Ref no protótipo:** Menu "…" da linha do ciclo → "Ver campanhas" → tela `CampanhasList` (sub-screen dentro de Desenvolvimento).

**Fluxo detalhado:**
1. Admin abre a listagem de campanhas de um ciclo específico.
2. Sistema mostra tabela de campanhas + chip de referência ao ciclo pai (clicável pra voltar ao ciclo).
3. Botão "+ Nova campanha" abre form `CampanhaConfigForm`.
   > **Quando se pode criar campanha (#3, decisão 2026-05-26):** a ação de gerenciar/criar campanhas só aparece em ciclos **Programado** ou **Em andamento** — nunca em Rascunho ou Finalizado. Como um ciclo só chega a "Programado" depois que o form valida todos os campos obrigatórios que a campanha herda (tipos de avaliação, coleta, configPares…), **a guarda por status já garante que os obrigatórios existem** — não há "Programado incompleto". Por isso NÃO foi adicionada validação extra de completude; a guarda por status cobre o caso. *(Nota pro dev/QA: ao testar, não existe cenário de ciclo Programado com campos herdáveis vazios.)*
4. Form da campanha tem apenas: **Nome**, **Período** (sub-intervalo dentro do período do ciclo), **Configuração de pares** (se modo=manual no ciclo, líderes indicarão depois; se sorteio, sistema faz seleção aleatória automática — ver RN 16).
   > **Público-alvo FORA DE ESCOPO nesta fase** (decisão 2026-05-26): campo removido do form — não há como inferir de forma confiável pra todos os clientes (cada um usa campos/hierarquias diferentes). Revisitar em v2.
5. Status da campanha — depende de ter coleta de **pares**:
   - **Sem pares**: Rascunho → Agendada → Em andamento → Encerrada.
   - **Com pares**: Rascunho → **Aguardando pares** (define + aprova os pares) → Agendada → Em andamento → Encerrada. A campanha **não vai pra "Agendada" enquanto os pares não forem aprovados** (RN 17/18).
6. Cada campanha tem menu "…" com: Ver detalhes (drawer), Editar (se Rascunho ou Agendada), Alterar pares (se Em andamento — ver RN 16), Excluir (se Rascunho).
   > **Encerrar antecipadamente** e **Iniciar antecipadamente** foram movidos para v2 (decisão 2026-05-26 — ver seção "Fora de escopo / v2" ao final desta HU).

**Regras de negócio:**

- **RN 14** — Campanha herda do Ciclo: tipos de avaliação, tipos de coleta, configPares.modo+qtd+minimo, metodoFinalizacao, thresholdDiscrepancia. Esses NÃO aparecem no form da campanha e **não são configuráveis na Campanha** (read-only herdado).
- **RN 15** — Período da Campanha tem que ser sub-intervalo do período do Ciclo (validação).
- **RN 16** — **Público-alvo FORA DE ESCOPO nesta fase** (decisão 2026-05-26). Campo removido da UI. Revisitar em v2.
- **RN 16.1 — Configuração de pares**: dois modos — **sorteio** (sistema faz seleção aleatória automática dos avaliadores; Fisher-Yates / random selection) e **manual** (líderes indicam os pares). **Em AMBOS os modos é obrigatória a APROVAÇÃO** (clique de "Aprovar pares") antes da campanha avançar — não existe mais conclusão automática só no sorteio. A coluna "Pares" na listagem tem **3 estados unificados, iguais pros dois modos**: **"Definir pares"** (ainda não atribuídos) → **"Aguardando aprovação"** (atribuídos, esperando o clique de aprovar) → **"✓ Aprovado"**.
- **RN 17** — Status transitions:
  - **Sem coleta de pares**: Rascunho → Agendada → Em andamento (ao atingir data início) → Encerrada (ao atingir dataFim).
  - **Com coleta de pares**: Rascunho → **Aguardando pares** (a campanha entra aqui ao ser salva, **não** em "Agendada") → [define + aprova pares] → Agendada → Em andamento → Encerrada.
  - **Trava (#8)**: a campanha **não pode ir pra "Agendada" enquanto os pares não estiverem "✓ Aprovado"**.
  - **Encerrada é terminal — não é possível reabrir.**
- **RN 18 — Aprovação de pares (ambos os modos)**: depois de atribuir (manual: líderes indicam; sorteio: sistema sorteia), o Admin/líder revisa e clica **"Aprovar pares"**. Só após a aprovação a campanha sai de "Aguardando pares". No modo manual, o Admin acompanha o progresso das indicações dos líderes antes de aprovar.
- **RN 19** — Drawer "Ver detalhes" mostra: período, status, progresso de respostas, chips do ciclo pai com contexto. **Coluna/campo público-alvo não exibido** (fora de escopo — ver RN 16).

**Critérios de aceite:**

- **CA-10** — DADO uma campanha em modo pares=sorteio, QUANDO o sistema sorteia os avaliadores, ENTÃO a coluna Pares fica "Aguardando aprovação" e a campanha só avança depois do Admin clicar "Aprovar pares".
- **CA-11** — DADO uma campanha em modo pares=manual, QUANDO os líderes concluem as indicações, ENTÃO a coluna Pares fica "Aguardando aprovação" e a campanha só avança depois do clique de "Aprovar pares".
- **CA-11.1** — DADO uma campanha com coleta de pares cujos pares ainda **não** foram aprovados, QUANDO se tenta agendá-la, ENTÃO o sistema a mantém em "Aguardando pares" (não permite "Agendada").
- **CA-12** — [REMOVIDO — v2] DADO modo Aguardando pares com 70% dos líderes tendo concluído indicações, QUANDO Admin clica "Iniciar antecipadamente", ENTÃO Campanha vai pra Em andamento. *(Movido pra v2 junto com #16/17 — funcionalidade de antecipação fora de escopo.)*
- **CA-13** — DADO o Admin tenta criar Campanha com período 01/06—30/06 num Ciclo que vai de 01/01 a 31/05, ENTÃO sistema bloqueia com erro "Período fora do ciclo".
- **CA-15 — Excluir campanha em Rascunho**
  - **DADO** Admin logado, com campanha no status "Rascunho"
  - **QUANDO** Admin abre menu "…" da campanha e clica "Excluir"
  - **ENTÃO** sistema exibe diálogo de confirmação ("Excluir campanha?")
  - **E** ao confirmar, campanha é removida permanentemente e lista é atualizada
  - **E** ao cancelar, campanha permanece inalterada

**Fora de escopo / v2:**
- **Público-alvo como campo/coluna** — removido do escopo desta fase (ver RN 16); revisitar em v2
- **Iniciar antecipadamente** (era CA-12) — movido pra v2
- **Encerrar antecipadamente** — movido pra v2
- **Reabrir Campanha Encerrada** — Campanha Encerrada é estado terminal (decisão 2026-05-26); sem previsão de reversão nesta fase
- **Edição em massa de participantes**; **notificações**; "colocar cada pessoa em avaliações diferentes" (futuro — menu 3 pontos da listagem)

**Resultado:** uma ou mais campanhas configuradas e prontas pra rodar dentro do ciclo.

---

### HU-04 — Acompanhar status dos times

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | dashboard consolidado do progresso de respostas das campanhas ativas, segmentado por time/área/cargo, |
| **Para** | identificar gargalos, acionar líderes com baixa adesão, e garantir cumprimento de prazos. |

**Ref no protótipo:** Tab **"Status dos times"** dentro de Desenvolvimento.

**Fluxo detalhado:**
1. Admin clica na tab "Status dos times".
2. Sistema mostra dashboard com KPIs gerais no topo (% concluído, % iniciado, % pendente) + gráfico de progresso por área/time.
3. Tabela detalhada por campanha ativa: nome, status, progresso (%), avaliações concluídas/total, prazo, ação ("Ver detalhes").
4. Filtros: por ciclo, por status da campanha, por período.
5. Drill-down de uma campanha: lista de avaliações individuais com status (A iniciar / Iniciado / Concluído), avaliador, avaliado, prazo, dias até prazo.

**Regras de negócio:**

- **RN 20** — KPIs são calculados em tempo real (cada request faz query consolidada).
- **RN 21** — Indicadores destacam atrasos: avaliação com `diasAtePrazo < 0` recebe badge de atraso visual.
- **RN 22** — Filtros são acumulativos (AND).
- **RN 23** — Drill-down por campanha mostra avaliações individuais ordenadas por status (atrasadas primeiro, depois pendentes, depois concluídas).

**Critérios de aceite:**

- **CA-14** — DADO duas campanhas ativas, ENTÃO KPIs do topo somam dados das duas (visão consolidada).
- **CA-15** — DADO uma avaliação com prazo vencido há 3 dias, ENTÃO ela aparece com badge "Atrasada" e cor de atenção.
- **CA-16** — DADO filtro por ciclo = "Ciclo Semestral 2026.1", ENTÃO dashboard mostra apenas campanhas desse ciclo.

**Fora de escopo:** envio de lembretes automáticos; export de relatório (futuro).

**Resultado:** Admin tem visão de quem ainda não respondeu o quê e pode acionar/cobrar.

---

### HU-05 — Consolidar feedback pós-avaliação

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | abrir a consolidação de avaliações de um colaborador específico após o término da campanha, e (opcionalmente) registrar a devolutiva, |
| **Para** | aplicar o método de finalização configurado (consenso/ponderado/adoção) e fechar formalmente o ciclo daquela pessoa. |

**Ref no protótipo:** A partir da listagem de avaliações concluídas (drill-down da HU-04) → ação "Consolidar" → sub-screen `ConsolidarFeedbackPage` (com tabs Consolidação + Feedback).

**Fluxo detalhado:**
1. Admin acessa drill-down de uma campanha concluída, clica em "Consolidar" pra um colaborador.
2. Sistema navega pra `ConsolidarFeedbackPage` com 2 tabs:
   - **Consolidação** — `AvaliacaoConsolidada` por sessão do formulário, com notas por papel (Auto/Líder/Pares/Liderado) + gráfico comparativo + threshold de discrepância destacando divergências.
   - **Feedback** — `RegistrarFeedbackLider` embedded (modo `embedded=true`) — form de devolutiva com Copiloto IA.
3. Na aba Consolidação: Admin vê dados, decide nota final conforme método configurado (consenso/ponderado/adocao) — interface varia por método.
4. Na aba Feedback: registra devolutiva (cria Registro tipo Devolutiva — ver PRD #2 HU-05 pra detalhes).
5. Botão "Concluir consolidação" finaliza a avaliação individual.

**Regras de negócio:**

- **RN 24** — A aba Consolidação respeita o `metodoFinalizacao` do Ciclo pai:
   - **consenso** → tela de reunião final com campos editáveis pra nota final + justificativa
   - **ponderado** → nota final é calculada automaticamente (média ponderada pelos pesos do Ciclo); Admin valida e confirma
   - **adocao** → Admin escolhe qual papel adota como nota final (Auto, Líder, Pares, Liderado)
- **RN 25** — Threshold de discrepância (`thresholdDiscrepancia` do Ciclo, default 1.5) destaca pares de notas com delta ≥ threshold (visual: cor de alerta na linha da sessão).
- **RN 26** — A aba Feedback referencia diretamente o fluxo de Devolutiva do PRD #2 (HU-05) — mesma estrutura de 4 campos + Copiloto IA, mesma regra de visibilidade ao colab.
- **RN 27** — "Concluir consolidação" só fica habilitado se nota final foi definida (e devolutiva, se exigida pela política do ciclo — campo futuro).

**Critérios de aceite:**

- **CA-17** — DADO Ciclo com metodoFinalizacao=ponderado, QUANDO Admin abre Consolidação, ENTÃO nota final é pré-calculada e exibida read-only com possibilidade de validar.
- **CA-18** — DADO Ciclo com metodoFinalizacao=adocao, QUANDO Admin abre Consolidação, ENTÃO há select pra escolher qual papel adotar (Auto/Líder/Pares/Liderado).
- **CA-19** — DADO uma sessão com Auto=2.5 e Líder=4.5 (delta=2, acima de threshold 1.5), ENTÃO a linha da sessão recebe destaque visual de discrepância.
- **CA-20** — DADO o Admin clica "Concluir consolidação" sem ter definido a nota final, ENTÃO botão fica desabilitado.

**Fora de escopo:** comparação visual entre ciclos diferentes do mesmo colaborador (futuro).

**Resultado:** avaliação individual fica formalmente consolidada com nota final + (opcional) devolutiva entregue.

---

### HU-06 — Calibração 9-box (dentro de ciclo)

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | abrir a sessão de calibração 9-box de um ciclo, ver posicionamento automático de cada colaborador na matriz Performance × Potencial, e ajustar manualmente quando necessário, |
| **Para** | gerar a calibração oficial do ciclo, alinhando time/área antes de fechar resultados. |

**Ref no protótipo:** A partir da listagem de ciclos ou de uma campanha específica → "Calibrar 9-box" → sub-screen `MatrizPage` (com `BoxMatrix`).

**Fluxo detalhado:**
1. Admin abre a calibração 9-box de um Ciclo (ou Campanha) específico.
2. Sistema mostra **matriz 3×3** (default — Ciclo pode definir outras: 16-box, 6-box, 3-box) com eixos Performance (Y) × Potencial (X).
3. Cada colaborador da campanha aparece como **chip movível** posicionado automaticamente pela nota da avaliação consolidada.
4. Admin pode **arrastar chips** pra reposicionar manualmente. Sistema registra histórico de movimentações (auditoria).
5. Painel lateral: filtros (por área/líder), legenda, contagem por box, botão "Salvar snapshot da calibração".
6. Ao salvar: gera entrada em `MatrizSnapshot` — read-only após Encerrar o ciclo.

**Regras de negócio:**

- **RN 28** — Matriz default é 9-box (3×3). Ciclo pode estar configurado com **16-box, 6-box ou 3-box** — sistema renderiza conforme configuração do Ciclo.
- **RN 29** — Eixos configuráveis no Ciclo: "média final" (default) OU "resultado por sessão" do formulário.
- **RN 30** — Posicionamento automático: chip é colocado no box correspondente à combinação Performance × Potencial calculada das avaliações consolidadas.
- **RN 31** — Reposicionamento manual: Admin pode arrastar chip pra outro box. Sistema registra movimento (`{de, para, timestamp, autor}`).
- **RN 32** — Salvar snapshot trava as posições pra histórico — mas calibração continua editável até Encerrar o ciclo (princípio reversibilidade).
- **RN 33** — Após Encerrar o ciclo, o snapshot de calibração (posições do 9-box) vira read-only. ⚠️ Nota: "snapshot de calibração" (posições travadas, específico do 9-box) ≠ "Resumo do ciclo" (métricas agregadas do Ciclo Finalizado — ver §3 modelo de dados). São conceitos distintos.

**Critérios de aceite:**

- **CA-21** — DADO Ciclo configurado com 9-box, QUANDO Admin abre Calibração, ENTÃO matriz 3×3 é renderizada com chips de colaboradores nas posições calculadas.
- **CA-22** — DADO Ciclo configurado com 6-box, ENTÃO matriz 2×3 é renderizada.
- **CA-23** — DADO o Admin arrasta o chip de "Paula" do box "Estrela" pra "Especialista", ENTÃO sistema registra movimentação + atualiza posição visualmente.
- **CA-24** — DADO o Admin clica "Salvar snapshot", ENTÃO posições atuais são gravadas como snapshot timestamped.
- **CA-25** — DADO Ciclo no status Finalizado, QUANDO Admin abre Calibração, ENTÃO matriz é renderizada read-only (sem drag).

**Fora de escopo:** comparação entre snapshots diferentes do mesmo ciclo; export PDF.

**Resultado:** calibração oficial do ciclo gerada, com histórico de movimentações pra auditoria.

---

### HU-07 — Visão 9-box standalone (análise contínua)

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | ver uma matriz 9-box consolidada da organização inteira, fora do contexto de ciclo específico, |
| **Para** | acompanhar evolução de talento ao longo do tempo, identificar concentrações em quadrantes-chave (estrelas, especialistas, em risco) e direcionar ações de sucessão/desenvolvimento. |

**Ref no protótipo:** Tab **"Visão 9-box"** dentro de Desenvolvimento.

> **Diferença crítica vs HU-06:** Calibração 9-box (HU-06) é **operacional** — vive dentro de um ciclo, gera snapshot oficial. Visão 9-box (HU-07) é **analítica** — agrega dados de múltiplos ciclos/períodos, não tem "Salvar snapshot", é visualização contínua pro Admin/RH navegar e filtrar.

**Fluxo detalhado:**
1. Admin clica na tab "Visão 9-box".
2. Sistema mostra matriz consolidada da organização com dados agregados:
   - Posicionamento por último snapshot disponível de cada colaborador
   - OR cálculo on-the-fly baseado em avaliações recentes (decisão de implementação)
3. Filtros: por período (últimos 6m/12m/24m), por área, por cargo, por líder.
4. Cada chip mostra colaborador. Clique no chip abre side panel com histórico de movimentações ao longo do tempo (de quais snapshots veio essa posição).
5. Modo de visualização: matriz padrão OR mapa de calor (count por box).

**Regras de negócio:**

- **RN 34** — Dados agregados dos snapshots disponíveis de cada colaborador. Quando há múltiplos ciclos, usa o snapshot mais recente do filtro ativo.
- **RN 35** — Visualização é **read-only** — não permite arrastar chips (essa é operação de calibração, HU-06).
- **RN 36** — Filtros são acumulativos (AND).
- **RN 37** — Side panel do chip mostra timeline de movimentações entre boxes ao longo dos ciclos.
- **RN 38** — Modo "mapa de calor" mostra densidade (count por box) sem revelar identidades — útil pra apresentações executivas.

**Critérios de aceite:**

- **CA-26** — DADO o Admin clica em "Visão 9-box", ENTÃO matriz é renderizada com dados consolidados (read-only).
- **CA-27** — DADO filtro área="Engenharia" + período="últimos 12m", ENTÃO matriz mostra apenas colaboradores de Engenharia com base nos snapshots dos últimos 12 meses.
- **CA-28** — DADO o Admin clica no chip de "Paula", ENTÃO side panel abre com timeline das posições dela ao longo dos ciclos.
- **CA-29** — DADO o Admin alterna pra "mapa de calor", ENTÃO matriz mostra apenas counts por box, sem identidade.

**Fora de escopo:** ações sobre o chip (mover, anotar) — analítico, não operacional.

**Resultado:** Admin tem visão estratégica do talento da organização ao longo do tempo, pra direcionar planos de carreira/sucessão.

## 6. Spike

> **S1 — Modelagem de histórico de mudanças de datas (`historicoMudancasDatas[]`)**
>
> **Pergunta**: como representar lista de mudanças sem inflar a tabela `cycles` com JSON gigante? Tabela própria `cycle_date_changes`?
>
> **Risco**: queries de auditoria caras se serializado como JSON; histórico perdido se modelagem fraca.
>
> **Critério de done**: estratégia validada com volume realista (ciclos podem ter dezenas de mudanças).

> **S2 — Cálculo de matriz 9-box com volume real**
>
> **Pergunta**: posicionamento automático e snapshots de matriz pra ciclos com 1000+ colaboradores são performáticos em request síncrono ou exigem pré-computação?
>
> **Critério de done**: estratégia (síncrono / job / cache) validada.

> **S3 — Composição da Visão 9-box standalone**
>
> **Pergunta**: a visão analítica (HU-07) usa snapshots já gerados de ciclos ou recalcula tudo on-the-fly? Como tratar colaboradores sem snapshot ativo (novos contratos, sem ciclo concluído ainda)?
>
> **Critério de done**: regra clara sobre fonte de dado + tratamento de outliers.

> **S4 — Validação de período sobreposto entre ciclos Em andamento**
>
> **Pergunta**: a regra de "não permitir 2 ciclos Em andamento com período sobreposto" (RN 13) é estrita ou tem exceções (ciclos paralelos pra públicos disjuntos)? Valida no backend como?
>
> **Critério de done**: regra de negócio confirmada + implementada como constraint ou check em código.

---

## 7. Como testar

### Tags Playwright

- `@admin @desenvolvimento @critical` — golden paths (CRUD ciclo, criar campanha, encerrar ciclo)
- `@admin @desenvolvimento @high` — calibração 9-box, consolidação
- `@admin @desenvolvimento @medium` — filtros, ordenação

### Pré-requisitos

- Admin/RH logado
- Feature flag `performance_module_enabled` ON
- DB com fixtures carregadas

### Rodar local

```bash
cd frontend && yarn dev   # localhost:5173 (smoke visual)
# ou
cd ../twyg-app && make start && yarn playwright test --grep "@admin @desenvolvimento"
```

---

## 8. Cross-references

### HUs com gap aberto no protótipo

- **HU-05** (Consolidação por método): [gap-02](../gaps/gap-02-consolidacao-branching-rn24.md) RN 24 — branching ausente
- **HU-05** (Discrepância threshold): [gap-11](../gaps/gap-11-threshold-todos-papeis-rn25.md) RN 25 parcial
- **HU-06** (Sessão de Calibração): [gap-07](../gaps/gap-07-sessao-calibracao-em-breve.md) — botão "em breve" no proto (já implementado no twyg-app via D10)
- **HU-07** (9-box standalone): [gap-12](../gaps/gap-12-9box-timeline-mapa-calor.md) RN 37/38 parciais
- **HU-06/HU-07** (matrizes): [gap-14](../gaps/gap-14-celloverrides-todas-matrizes.md) RN 28 cobertura parcial
- **Geral** (status enums): [gap-08](../gaps/gap-08-status-enums-divergentes.md) — **RESOLVIDO** (2026-05-26): enums do proto adotados como canônicos; PRD/glossário alinhados
- **Geral** (tipo experiência): [gap-13](../gaps/gap-13-experiencia-checkbox-invisivel.md)
- **Geral** (Salvar rascunho): [gap-15](../gaps/gap-15-salvar-rascunho-nao-persiste.md)

### Modelo compartilhado com outros PRDs

- **Ciclo / Campanha**: usados também em [PRD #3](./prd-lider-desenvolvimento.md) (Líder vê times) e [PRD #5](./prd-aluno-avaliacoes.md) (Aluno vê suas avaliações)
- **9-box**: lido também em PRD #3 (Líder vê 9-box do time, read-only)
- **Devolutiva**: gerada na consolidação aqui (HU-05) e exibida em [PRD #6](./prd-aluno-feedbacks-recebidos.md)

### Glossário e regras

- Status enums canônicos: [`glossary.md § 5`](../glossary.md#5-status-enums-canônicos)
- Tipos de matriz: [`glossary.md § 6`](../glossary.md#6-tipos-de-matriz-boxmatrix)
- Regras default hardcoded: [`regras-default-ciclo.md`](../regras-default-ciclo.md)

### Twy plan (twyg-app)

- D01 (Ciclo CRUD), D02 (Campanha), D04 (Avaliação Responder), D05 (Dashboards), D06 (Encerramento), D07 (9-box), D10 (Sessões de Calibração) — ver `../../twyg-app/.twy/performance-module/deliverables/`
