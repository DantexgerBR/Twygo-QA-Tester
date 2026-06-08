# Retrabalhos QA 1.3 — RN 3 (Artia 19707) — formato Artia

> Critério: RN documentada (persistência de abas por usuário × curso). Card de execução
> PASSOU; estes são os retrabalhos das falhas. Ambiente: 🧪 Stage, org 37061, curso 807533.

---

## P1 [Novo estúdio de criação] Abas da edição de curso não reordenam por arraste e não lembram a última aba aberta

> Prioridade P1 (doc "Classificação de Prioridade de Bugs"): bug em RC herda a prioridade da
> entrega (geralmente P0/P1); não é P0 (não derruba sistema, não bloqueia QA, sem perda de
> dado). Rebaixar pra P2 se o time tratar reordenar/última-aba como conveniência de baixo impacto.

:: Incidente identificado ::
Na tela "Editar curso", a RN 3 não está implementada: não é possível reordenar as abas por
drag & drop e a última aba aberta não é restaurada ao reabrir o curso. As abas são tabs
comuns, sem ícone de arraste e sem atributo `draggable`; arrastar não muda a ordem e não
dispara nenhuma requisição de persistência. (As RNs 2/4/6 estão presentes no mesmo build —
a ausência é específica da RN 3.)

:: Passo a passo para reprodução ::
» Logar como administrador na org 37061 (flag creation_studio ON)
» Acessar /o/37061/events/807533/edit (tela "Editar curso")
» Passar o mouse sobre o título da aba "Modelo" → nenhum ícone de drag aparece
» Arrastar a aba "Modelo" para a posição de "Banner" → a ordem permanece inalterada
» Clicar na aba "Banner", sair do curso e retornar via "Editar curso"
» O curso reabre na aba "Identificação" (e não na última aba usada, "Banner")

:: Comportamento esperado ::
Conforme a RN 3: as abas (exceto "Identificação", travada) devem ser reordenáveis por
drag & drop com ícone de arraste no hover, a nova ordem deve persistir após reload e troca
de sessão, e ao reabrir o curso a UI deve carregar na última aba usada.

---

## P1 [Novo estúdio de criação] Ordem das abas e última aba não são salvas no banco (modelo de dados não suporta escopo por curso)

> Prioridade P1 (doc "Classificação de Prioridade de Bugs"): bug em RC herda a prioridade da
> entrega (geralmente P0/P1); não é P0 (sem perda de dado / sistema no ar). Envolve mudança de
> modelo de dados (migration) — o PO pode reavaliar. Rebaixar pra P2 se tratado como conveniência.

:: Incidente identificado ::
A persistência em banco exigida pela RN 3 não acontece. Validação read-only no MySQL
(twygo_db_rc): a tabela `user_course_preferences` existe (campos `tab_order` JSON +
`last_tab` varchar) mas está VAZIA — 0 linhas para qualquer usuário — confirmando que o
front não grava nada. Além disso, o schema não atende a RN documentada (escopo por usuário
× curso): não há coluna `event_id`/`course_id` e há `UNIQUE(user_id)` (no máximo 1 linha
por usuário); `last_tab` é um único valor por usuário, então não comporta "última aba por
curso". Consequência colateral: a query do TC12 (`WHERE user_id = X AND event_id = Y`) é
impossível como está, pois `event_id` não existe.

:: Passo a passo para reprodução ::
» Como administrador na org 37061, abrir /o/37061/events/807533/edit
» Reordenar abas e clicar em uma aba específica (ações da RN 3 na UI)
» Consultar no banco: SELECT * FROM user_course_preferences WHERE user_id = <id do usuário>
» Resultado: nenhum registro (tabela com 0 linhas no total)
» Conferir o schema: SHOW CREATE TABLE user_course_preferences
» Resultado: sem coluna event_id/course_id; UNIQUE(user_id); last_tab varchar(255) único

:: Comportamento esperado ::
Conforme a RN 3: ao reordenar abas e abrir uma aba, o back-end deve gravar a ordem
(`tab_order`) e a última aba (`last_tab`) por usuário × curso. O modelo de dados deve
suportar esse escopo (dimensão de curso) e o TC12 deve conseguir consultar o registro do
par usuário+curso. Ajuste paralelo na AT: corrigir a query do TC12 para apontar à estrutura
real que vier a ser implementada.

:: Obs ::
Gotcha pro dev (não é o foco do retrabalho, mas vale): no curso seed, "Tipo de experiência"
(obrigatório) vazio faz o botão Salvar falhar silenciosamente (sem toast de erro global).
Evidência de banco:
https://github.com/DantexgerBR/Twygo-QA-Tester/blob/project/novo-estudio/agent-db/evidencias/tc12-user_course_preferences.txt
