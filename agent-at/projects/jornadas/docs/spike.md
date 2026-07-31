# Spike — Jornadas

**Origem:** [Discovery] Jornadas - v01 27.05.2026
**Status:** Aberto (S1–S9)

> Spikes detectados a partir das caixas "Validar a seguinte possibilidade" do Discovery + varredura das 5 categorias de trigger sobre as 275 RN e a spec técnica. Ordenados do mais bloqueante para o menos. As integrações externas (Teams/Calendar/Outlook) estão explicitamente fora de escopo da v1, então não geram spike nesta fase.

---

## S1 Modelar a Jornada como um novo tipo de `Event`

**Origem:** #R1 / RN 5 (e RN 6, RN 13, RN 275)

**Categoria:** Mudança estrutural de dados

**Pergunta:**
Um novo `KIND_*` de `Event` comporta cronograma de dias ordinais, linha de base copiável por execução e papéis dinâmicos, sem reescrita estrutural do `Event`?

**Contexto:**
O `Event` é o coração da plataforma (~1455 linhas, 60+ associações) e já tem 7 tipos (`course`, `catalog`, `library`, `learning_path`, `package`, `excluded`, `external`). A Jornada quer reusar inscrição, compartilhamento entre ambientes, ciclo de vida e relacionamento conteúdo/inscrição (RN 5), aparecer no histórico de aprendizagem como a Trilha (RN 275) e manter campos similares aos de conteúdo **sem componentização compartilhada** (RN 6). Toda a modelagem das demais features (cronograma, time, execução) depende dessa decisão de base.

**Hipótese inicial:**
Criar um novo `KIND_journey` em `Event` e pendurar as estruturas próprias da jornada (cronograma, fases, tarefas, ações, time) em tabelas novas relacionadas ao `Event`, em vez de sobrecarregar o `Event` com colunas específicas. `EventParticipant` (já gigante, ~1560 linhas) seria a base da inscrição/execução.

**Critério de done:**
- [ ] Validação com arquitetura (Vini — referência, pois o projeto de Widgets também usa `Event` por baixo).
- [ ] Decisão registrada: novo `KIND_*` vs. entidade própria relacionada a `Event`.
- [ ] Confirmar reuso real de inscrição, compartilhamento e ciclo de vida sem regressão nos 7 tipos existentes.
- [ ] Mapa das tabelas novas necessárias (cronograma, fase, tarefa, ação automática, papel/time, execução, log).

**Risco se ignorado:**
Reescrita tardia de toda a base do módulo; regressão nos tipos de `Event` existentes; acoplamento indevido entre cadastro de conteúdo e de jornada (proibido por RN 6).

**Estimativa de esforço:** L — 3 a 5 dias-pessoa (POC + alinhamento de arquitetura).

---

## S2 Copiar a linha de base para a execução e resolver "dia ordinal" → data real

**Origem:** #R23 / RN 271 (e RN 95, RN 113–116, RN 164.1, RN 272)

**Categoria:** Mudança estrutural de dados

**Pergunta:**
Como copiar a estrutura inteira da Jornada Padrão (fases, tarefas, períodos, ações, envolvidos) para cada execução de forma performática e **independente**, resolvendo o "Nº-ésimo dia" em data real a partir do Dia de início da inscrição?

**Contexto:**
É o conceito-base do módulo (terminologia de gerência de projetos). A Jornada Padrão usa **dias ordinais** (RN 95); cada execução tem data real própria (RN 270.2). Ao iniciar, a linha de base é COPIADA e passa a viver independente — alterações na Padrão não propagam (RN 113–116). Reagendar mantém atraso; Replanejar move a linha de base (RN 272). Uma org pode iniciar dezenas/centenas de execuções (turmas), cada uma com sua cópia.

**Hipótese inicial:**
Snapshot da estrutura no momento do início da execução (cópia materializada das tarefas/fases com data prevista resolvida = `dia_inicio_inscricao + (ordinal − 1)`), guardando data prevista (linha de base) e data efetiva separadas por tarefa para suportar Reagendar × Replanejar. Geração assíncrona (worker/Sidekiq) à semelhança das filas de duplicação de conteúdo (`CopyContentQueue`/`CopyEventQueue`).

**Critério de done:**
- [ ] Estratégia de cópia definida (materializar no início vs. resolver on-the-fly) com avaliação de custo de storage por execução.
- [ ] Modelo de datas por tarefa de execução: prevista (baseline) + efetiva + flag de atraso.
- [ ] Regra de virada de "Atrasada" sem campo de hora (ver item 3.1 da revisão) decidida.
- [ ] Comportamento de início retroativo (dia de início no passado) definido.
- [ ] Teste de carga: iniciar N execuções de uma jornada de 6 meses sem degradar.

**Risco se ignorado:**
Inconsistência entre o que o aluno vê e o que o dashboard calcula; impossibilidade de distinguir Reagendar de Replanejar; explosão de dados ou lentidão ao iniciar turmas grandes.

**Estimativa de esforço:** L — 4 a 6 dias-pessoa.

---

## S3 Verificar engajamento de tarefa/jornada cruzando `primary` + `historic`

**Origem:** #R8 / RN 110 (e RN 39)

**Categoria:** Estado legacy preservado

**Pergunta:**
Como verificar, no momento da exclusão, se uma tarefa (RN 110) ou uma jornada (RN 39) já teve engajamento "em qualquer execução, atual ou histórica", de forma performática, sabendo que execuções antigas podem estar na base `historic`?

**Contexto:**
A plataforma tem 3 bancos; orgs/dados arquivados vão para o MySQL `historic` (ex.: `event_participant_activities`, movimentos históricos). A regra de bloqueio de exclusão precisa olhar engajamento **incluindo histórico** — mas o `historic` não é consultado no fluxo operacional normal e cruzar os dois bancos numa verificação síncrona de UI é caro.

**Hipótese inicial:**
Manter um marcador de engajamento no `primary` (flag/contador "já executada por ≥1 pessoa") atualizado quando qualquer execução toca a tarefa, evitando varrer `historic` em tempo de exclusão. O arquivamento para `historic` preservaria esse marcador.

**Critério de done:**
- [ ] Definição da fonte de verdade do "engajamento" (flag no `primary` vs. consulta cruzada).
- [ ] Confirmar se execuções/movimentos de jornada realmente migram para `historic` e em quais tabelas.
- [ ] Mensagem de bloqueio validada (RN 111) e fluxo alternativo de duplicar a Padrão (RN 112).
- [ ] Custo da verificação na exclusão medido (< limite aceitável de UI).

**Risco se ignorado:**
Exclusão indevida de tarefa/jornada com histórico (perda de integridade do log de auditoria) ou verificação lenta que trava a UI de exclusão.

**Estimativa de esforço:** M — 2 a 3 dias-pessoa.

---

## S4 Persistência e volume do log de acompanhamento da execução

**Origem:** #R14 / RN 193 a RN 199

**Categoria:** Mudança estrutural de dados

**Pergunta:**
Onde persistir o log de acompanhamento (alta granularidade: visualizou/iniciou/finalizou tarefa, ações automáticas, IP, quem) — em `postgres_logs` (particionado/TimescaleDB) ou no `primary` — e como consolidá-lo para a tela de detalhe da execução com filtros e extração?

**Contexto:**
RN 193–199 definem um log por execução com 13 tipos de ação, descrição, tipo (auto/manual), autor, data/hora e IP, ordenado do mais recente. Em jornadas com muitas execuções e tarefas, o volume cresce rápido. A plataforma já tem infra de log em alta escala em `postgres_logs` (partições + TimescaleDB) e concerns transversais (`Loggable`, `StreamLogs`, `ModelPostgresLoggable`).

**Hipótese inicial:**
Reusar a infra de `postgres_logs` / concern de logging existente para o registro de auditoria, e expor a tela de detalhe (RN 185–199) via consulta filtrada por execução. Ações que também são domínio (ex.: "Foi aprovado", "Certificado emitido") podem ter espelho no `primary`.

**Critério de done:**
- [ ] Decisão de banco/tabela do log (reuso de `postgres_logs` vs. tabela própria no `primary`).
- [ ] Confirmar que filtros (RN 190–192) e extração (RN 189.1) funcionam sobre a fonte escolhida.
- [ ] Estimativa de volume por execução e retenção.

**Risco se ignorado:**
Tela de detalhe lenta, custo de storage não previsto, ou log no lugar errado dificultando filtro/extração e auditoria.

**Estimativa de esforço:** M — 2 a 3 dias-pessoa.

---

## S5 Modelar os status de finalização preparados para expansão futura

**Origem:** #R13 / RN 184

**Categoria:** Mudança estrutural de dados

**Pergunta:**
Qual desenho de campos permite a v1 trabalhar com os status atuais (Sem pendências, Em andamento com atraso, Concluída no prazo, Concluída com atraso, Cancelada) e acomodar, **sem migration estrutural**, os status granulares futuros (Concluída Aprovado/Reprovado/Incompleta, Cancelada antes de iniciar, Desistente após início)?

**Contexto:**
RN 184 pede explicitamente que a modelagem não precise de reescrita para a expansão futura, idealmente guardando **tipo de finalização** e **motivo** em campos separados que aceitem novos valores. É uma decisão de modelagem que, se mal feita agora, custa migration depois.

**Hipótese inicial:**
Separar `situacao_execucao` (estado operacional computado: em dia/atrasado/concluído) de `tipo_finalizacao` + `motivo_finalizacao` (campos com domínio extensível), em vez de um único enum rígido. Status como "Atrasada/Concluída no prazo/com atraso" são **derivados** (não escolhidos manualmente) — alinhado ao padrão de status de ação já adotado na Twygo.

**Critério de done:**
- [ ] Esquema de campos aprovado (estado operacional vs. tipo+motivo de finalização).
- [ ] Confirmar que os 5 status da v1 são deriváveis do esquema.
- [ ] Validar que os status futuros entram só com novo valor de domínio (sem alterar schema).

**Risco se ignorado:**
Migration estrutural cara na fase futura; retrabalho de relatórios e dashboards de Execuções.

**Estimativa de esforço:** S — 1 a 2 dias-pessoa (decisão de modelagem).

---

## S6 Conviver os Papéis Personalizados com o RBAC duplo e o perfil legado "Representante"

**Origem:** #R16 / RN 216 a RN 225 (e RN 93, RN 234)

**Categoria:** Estado legacy preservado

**Pergunta:**
Onde persistir os Papéis Personalizados e suas permissões de jornada, de forma a conviver com os dois RBACs existentes (Rolify + `AccessProfile`) e com o perfil legado "Representante", sem conflitar com a reestruturação de menus/perfis que o Caio fará depois?

**Contexto:**
A tela de Papéis e Permissões é **temporária/"gambiarra"** (RN 216) e alimenta a aba Time. A plataforma já tem RBAC duplo (Rolify + `access_profiles`/`access_profile_permissions`/`access_profile_users`) e um perfil legado "Representante" pouco usado, citado na spec como algo a considerar. Papel personalizado herda de 1 dos 4 padrão e só adiciona permissões (RN 224–225). A permissão também é configurável localmente na aba Time, com herança marcada+desabilitada (RN 93).

**Hipótese inicial:**
Apoiar os papéis personalizados no `AccessProfile` existente (permissões finas), tratando "herdar de papel padrão" como base + permissões extras de jornada. Não tocar no Rolify nem migrar "Representante" agora — apenas garantir que a modelagem não impeça a futura reestruturação.

**Critério de done:**
- [ ] Decisão de persistência (reuso de `AccessProfile` vs. estrutura própria temporária).
- [ ] Mapa de como a herança "marcada+desabilitada" (RN 93/224.4) se traduz no modelo.
- [ ] Alinhamento com o Caio para não criar dívida que atrapalhe a reestruturação.
- [ ] Decisão sobre conviver/migrar o perfil "Representante".

**Risco se ignorado:**
Terceiro RBAC paralelo virando dívida técnica; retrabalho na reestruturação do Caio; comportamento inconsistente de permissão entre módulo global e aba Time.

**Estimativa de esforço:** M — 2 a 4 dias-pessoa.

---

## S7 Reuso e evolução coordenada da tela React de inscrição do Pacote

**Origem:** #R12 / RN 153 e RN 154

**Categoria:** Premissa não-validada (risco de regressão)

**Pergunta:**
A tela React de inscrição do Pacote suporta as novidades da jornada (etiqueta, recalcular progresso, papéis dinâmicos como responsáveis, novas ações em massa) e como versionar essa evolução compartilhada sem regressão no Pacote?

**Contexto:**
RN 153 manda reusar a tela NOVA de inscrição do Pacote (não a antiga de Curso/Trilha, que tem bug) e RN 154 exige **replicar** as novidades também no Pacote, mantendo o mesmo componente React. Logo, qualquer mudança afeta dois produtos ao mesmo tempo.

**Hipótese inicial:**
Estender o componente compartilhado com os novos campos sob feature/config, garantindo que o Pacote continue funcionando, e cobrir ambos os fluxos com testes antes do release.

**Critério de done:**
- [ ] Inventário do que o componente do Pacote já suporta vs. o que falta (etiqueta, responsáveis dinâmicos, recalcular, ações em massa).
- [ ] Estratégia de evolução compartilhada definida (sem fork, sem regressão no Pacote).
- [ ] Plano de teste cobrindo inscrição de Pacote e de Jornada.

**Risco se ignorado:**
Regressão silenciosa na inscrição de Pacotes (produto em produção) ao evoluir o componente para a jornada.

**Estimativa de esforço:** M — 2 a 3 dias-pessoa.

---

## S8 Maturidade da POC de calendário (Alexandre)

**Origem:** #R15 / RN 215 (e RN 206–214, RN 246, RN 267)

**Categoria:** Premissa não-validada

**Pergunta:**
A POC de calendário do Alexandre está de fato implementada e suporta os modos Por Usuários / Por Jornadas, agrupamento de tarefas repetidas, limite de navegação e o reuso na página interna do aluno e no widget?

**Contexto:**
RN 215 assume reaproveitar a POC, mas a própria spec registra "não há certeza se está implementado de fato". O mesmo componente é reusado em três lugares (Agenda do admin, página interna do aluno em RN 246, widget de Calendário em RN 267), então a maturidade dele afeta múltiplos #R.

**Hipótese inicial:**
A POC cobre o calendário base; será necessário complemento para os dois modos, agrupamento (RN 213) e limite de navegação (RN 207). Avaliar antes de estimar o esforço dos #R15, #R20 e #R22.

**Critério de done:**
- [ ] Levantamento do estado real da POC (existe? roda? o que cobre?).
- [ ] Lista do que falta para atender RN 206–214.
- [ ] Estimativa do complemento incorporada ao planejamento.

**Risco se ignorado:**
Estimativa furada de 3 telas (Agenda, página interna, widget) por assumir um componente que talvez não exista.

**Estimativa de esforço:** S — 1 a 2 dias-pessoa (levantamento).

---

## S9 Dependência do projeto de Widgets (Vini)

**Origem:** #R22 / RN 260 a RN 269

**Categoria:** Premissa não-validada

**Pergunta:**
O projeto de Painéis Personalizados (Widgets) do Vini estará pronto e com contrato de integração definido a tempo de ampliar o widget de Tarefas e criar o widget de Calendário do aluno?

**Contexto:**
RN 260 declara que o módulo **depende** do projeto de Widgets (que também usa `Event` por baixo). O widget de Tarefas precisa ser ampliado (RN 262) e o de Calendário criado (RN 267). É dependência externa ao time da jornada e condiciona toda a entrega da visão do aluno centralizada.

**Hipótese inicial:**
Alinhar contrato e cronograma com o Vini cedo; se o projeto de Widgets atrasar, a visão do aluno via widgets vira entrega faseada (a página interna da jornada em #R20 não depende de widget e pode seguir).

**Critério de done:**
- [ ] Confirmação de prontidão e cronograma do projeto de Widgets com o Vini.
- [ ] Contrato de integração (como a jornada injeta tarefas no widget) definido.
- [ ] Plano B de faseamento caso o projeto de Widgets atrase.

**Risco se ignorado:**
Bloqueio da visão centralizada do aluno (#R22) por dependência externa não gerida.

**Estimativa de esforço:** S — 1 a 2 dias-pessoa (alinhamento + contrato).

---

## Resumo

| Spike | Origem | Categoria | Risco | Esforço |
|---|---|---|---|---|
| S1 | #R1 / RN 5 | Mudança estrutural | Alto | L |
| S2 | #R23 / RN 271 | Mudança estrutural | Alto | L |
| S3 | #R8 / RN 110 | Estado legacy | Alto | M |
| S4 | #R14 / RN 193-199 | Mudança estrutural | Médio-Alto | M |
| S5 | #R13 / RN 184 | Mudança estrutural | Médio | S |
| S6 | #R16 / RN 216-225 | Estado legacy | Médio | M |
| S7 | #R12 / RN 153-154 | Premissa (regressão) | Médio | M |
| S8 | #R15 / RN 215 | Premissa não-validada | Médio | S |
| S9 | #R22 / RN 260-269 | Premissa não-validada | Médio | S |
