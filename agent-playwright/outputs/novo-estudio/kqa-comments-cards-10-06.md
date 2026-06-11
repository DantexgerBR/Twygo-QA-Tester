# Comentários KQA — cards Novo Estúdio (reconfirmado ao vivo 10/06/2026)

Org 37061 (`novoestudio.stage.twygoead.com`) · curso 807533 "Construindo times de alta performance".
Rota real do Estúdio: `/o/37061/contents/807533/edit?tab=studio` (aba "Atividades").

---

## Card 19716 — QA 1.12 Renderizar versão publicada de forma assíncrona

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage
:: Validação ::
Reconfirmado ao vivo em 10/06 (org 37061, curso 807533). A suíte (12 TCs) parte
toda do gatilho "Publicar alterações" no topo do Estúdio, que dispara o render
assíncrono da versão publicada. Esse botão NÃO existe na UI: varredura por texto
e aria-label em botões/links/menuitems retornou 0 ocorrências de "Publicar". O
topo só tem "Voltar", "Visualizar como aluno", "Abrir copiloto" e ações por
atividade ("Concluir geração com IA", "Editar"). Sem o gatilho, os 12 TCs são
inexecutáveis.
:: Obs ::
Funcionalidade de publicação/render assíncrono ausente nesta entrega — NÃO é bug
(projeto em andamento; #R12 é P2 no Discovery). A alinhar com João Miguel Gorski.
Ressalva honesta: checagem read-only; não testei se "Publicar" só apareceria após
uma edição pendente (gating por dirty-state) — confirmar com o dev. TC10 (logs) já
estava bloqueado na própria AT (logging não implementado).
:: Evidência(s) ::
- estudio-real-807533.png (10/06 — topo do Estúdio sem "Publicar")
- recon-1.12-estudio.png (09/06)
- recon-renderizar-versao-publicada.md
```

---

## Card 19719 — QA 1.15 Coexistir com tela antiga via rota nova e feature flag

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Reconfirmado ao vivo em 10/06. A rota nova do Estúdio carrega e funciona (aba
"Atividades" em /o/37061/contents/807533/edit?tab=studio → layout 3 colunas) —
TC1 e TC4 ✅. PORÉM a mecânica central da suíte (coexistência/gating via feature
flag Flipper "creation_studio") NÃO se confirma: a flag está Disabled (No actors
enabled, 0% of actors/time) e mesmo assim o Estúdio funciona; e não há rota antiga
distinta — /o/37061/events/807533/edit/activities retorna HTTP 404.
:: Obs ::
Execução concluída (2 TCs ✅); as demais validações viram alinhamento/retrabalho.
GATE REAL IDENTIFICADO (10/06, confirmado com o QA dono do ambiente): o Estúdio é
gateado por OUTRA feature flag Flipper — NÃO a "creation_studio" (que está OFF). Logo
os TCs de roteamento-por-flag e estado-OFF (TC2, TC3, TC5–TC11) precisam ser reescritos
apontando para a flag correta; e a AT/skill que assumem "creation_studio" estão
desatualizadas. Não é bug — divergência de premissa, agora resolvida. TC10 é métrica
de CS (dashboard externo). A confirmar com João o nome exato da flag.
:: Evidência(s) ::
- flipper-creation_studio.png (flag Disabled)
- rota-antiga-activities.png (HTTP 404)
- estudio-real-807533.png (Estúdio carrega com a flag OFF)
- recon-coexistir-rota-flag.md
```

---

## Card 19720 — QA 1.16 Duplicar curso a partir do Estúdio

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage
:: Validação ::
Reconfirmado ao vivo em 10/06. A suíte (12 TCs) parte do botão "Salvar como novo"
no menu secundário do topo do Estúdio. Esse controle NÃO existe: varredura por
"Salvar como novo", "Duplicar" e "Publicar" retornou 0 ocorrências; o topo só tem
"Voltar", "Visualizar como aluno", "Abrir copiloto" e ações por atividade. Não há
menu secundário de duplicação. Sem o gatilho, os 12 TCs são inexecutáveis.
:: Obs ::
Duplicação a partir do Estúdio ("Salvar como novo") ausente nesta entrega — NÃO é
bug (projeto em andamento; #R16 é P3 "se der tempo" no Discovery). Coerente com a
1.12 (mesma ausência de menu secundário do topo). A alinhar com João.
:: Evidência(s) ::
- estudio-real-807533.png (10/06 — topo do Estúdio sem "Salvar como novo")
- recon-1.16-estudio.png (09/06)
- recon-duplicar-curso.md
```

---

## Card 19722 — QA 1.18 Exclusão do Banco Histórico (Tipo: db) — FINAL 11/06

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage
:: Validação ::
E2E destrutivo COMPLETO executado em 11/06 na Trial 37062: criei curso (807899) +
atividade Page (9295604) no Estúdio, disparei geração de IA real (roteiro) via
copiloto — populou ai_generation_tasks=1 (status completed) —, tirei baseline no
MySQL twygo_db_rc, executei Sophia → "Excluir informações" → "Todas informações"
(DELETE /api/v1/o/37062/delete_trial_data → HTTP 204, comprovado na rede) e
reconsultei. Resultado: events do usuário e event_contents foram APAGADOS (1→0,
cascata ok; UI vazia), MAS ai_generation_tasks foi RETIDA e ficou ÓRFÃ (aponta
pra curso/atividade que não existem mais). É a única tabela MySQL nova que a
feature realmente escreve — e não entra na cascata de exclusão.
:: Obs ::
Não cravo bug: a retenção pode ser intencional (auditoria/billing — a linha carrega
ai_consumption_id) e o mecanismo disponível testado foi RESET de dados de Trial, não
"exclusão de organização" como descreve o TC — a alinhar com João (se a intenção é
apagar → retrabalho; se é reter → corrigir AT). Das 9 tabelas do TC: 4 não recebem
escrita da feature (conversations/messages MySQL são legado — copiloto grava DynamoDB;
studio_generation_partitions vazia global; user_course_preferences sem coluna de
evento/org) e 3 estão fora do alcance (studio_checkpoints + messages no DynamoDB;
org_generation_preferences no PostgreSQL). AT precisa de correção no mapeamento
tabela→datastore + incluir ai_generation_tasks. Detalhes no laudo
qa-1.18-exclusao-banco-historico-laudo.md.
:: Evidência(s) ::
- evidencias-1106/ (28 prints: criação, geração, modal Sophia, pós-exclusão)
- qa18-tc1-org-scoped-37062-baseline-pre-exclusao-1106.txt / -pos-exclusao-1106.txt
- qa18-ai-generation-tasks-37062-baseline-pre-exclusao-1106.txt / -pos-exclusao-1106.txt
- qa18-events-restantes-37062-pos-exclusao-1106.txt
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/commit/4497fb428d69fd52b31c99d9df77493ca38437f0
```
