# Apontamento — fechar QA 1.18 (Exclusão do Banco Histórico) amanhã (11/06)

## ⏩ PROGRESSO 11/06 (sessão da manhã)

Passos 1 e 2 do plano CONCLUÍDOS via Playwright (evidências em `evidencias-1106/`):
- **Curso criado na Trial 37062**: id **807899** "QA 1.18 E2E - curso descartavel 1106"
  (form legado `/contents/new?kind=course`; gotchas: Tipo de experiência react-select
  obrigatório + Descrição CKEditor só sincroniza via API `CKEDITOR.setData`).
- **Atividade Page criada no Estúdio**: event_content_id **9295604** "QA118-GERACAO roteiro"
  (badge "3 pendentes").
- **Geração de roteiro DISPARADA e ENFILEIRADA** via popover de pendências → linha
  `roteiro` → copiloto confirmou: "🚀 Disparei a geração do roteiro… A tarefa está em
  andamento" (sem RAG — org sem base de conhecimento). Deve popular `ai_generation_tasks`.

**BLOQUEIO ATUAL**: VPN desligada → MySQL `twygo-rc` inacessível. Faltam os passos:
baseline (confirmar `ai_generation_tasks > 0`) → Sophia "Excluir Tudo" → reconsulta.
NÃO executar a exclusão antes do baseline.

Status hoje (10/06): **❌ em aberto** — investigação concluída, falta só o E2E destrutivo
final. Tudo abaixo já está preparado; amanhã é executar.

## O que já está pronto (commitado no fork, branch project/novo-estudio)
- Conexão MySQL read-only validada (`twygo_db_rc`) + scripts em `agent-db/scripts/`:
  - `qa18_tc1_exclusao_historico.py` — presença/baseline das 9 tabelas (ORG_ID env).
  - `qa18_tc1_org_scoped.py` — contagem org-scoped via joins (events/event_contents/etc).
- Descobertas (em `findings.md`): copiloto→DynamoDB; Sophia "Tudo"=reset de dados (não
  exclusão de org); AT com mapeamento tabela→datastore errado; gate do Estúdio = outra
  flag Flipper.

## Pré-requisitos (já resolvidos hoje, confirmar amanhã que seguem de pé)
1. VPN ligada (MySQL `twygo-rc...` acessível). Testar: `python agent-db/scripts/qa18_tc1_org_scoped.py`.
2. Créditos de IA na Trial 37062 (liberados hoje).
3. Estúdio ATIVADO na Trial 37062 (flag Flipper — feito hoje; **porém re-semeou a Trial e
   a listagem de Conteúdos ficou VAZIA**). → amanhã: garantir que há **pelo menos 1 curso**.

## Passo a passo pra fechar (sessão interativa)
1. **Garantir 1 curso na Trial 37062** (a listagem está vazia): criar via "+ Adicionar →
   Curso", OU re-semear a SophiaTech. Anotar o `event_id` real do curso.
2. **Popular as tabelas novas verificáveis no MySQL**:
   - Abrir o Estúdio do curso → copiloto → pedir pra **gerar uma atividade/roteiro**
     (geração real, não só chat) → cria linha em `ai_generation_tasks` (org 37062).
   - (opcional) "Criar resumo" → `activity_summaries`.
3. **Baseline ANTES**: rodar `ORG_ID=37062 python qa18_tc1_org_scoped.py` e confirmar
   `ai_generation_tasks > 0` (e events/event_contents > 0). Salvar evidência.
4. **Excluir**: rodar **Sophia → Excluir informações → Tudo** (mecanismo de reset). ⚠️ Se
   o time confirmar que o TC é sobre **exclusão de organização** (não reset), usar o
   mecanismo real de exclusão de org (Super Admin?) — alinhar com João.
5. **Verificar DEPOIS**: rodar o mesmo script e conferir o que zerou:
   - `event_contents`/`events` → devem cair (cascata de conteúdo).
   - `ai_generation_tasks` → ver se é removido ou retido (log de IA pode ser mantido).
6. **DynamoDB + PostgreSQL** (`studio_checkpoints`, `messages` Dynamo;
   `org_generation_preferences` PG): pedir acesso ou validar com o dev — fora do MySQL.

## Perguntas a alinhar com João (solicitante)
- Nome exato da **feature flag** que gateia o Estúdio (resolve também a 1.15).
- O TC 1.18 é sobre **exclusão de organização** ou **reset de dados** (Sophia)? Mecanismos
  e cascatas podem diferir.
- Corrigir a AT: conversations/messages do copiloto são **DynamoDB**;
  `org_generation_preferences` é **PostgreSQL**; `studio_generation_partitions` não recebe
  escrita (vazia global). Tabela real do log de geração no MySQL = `ai_generation_tasks`
  (não está na AT).
