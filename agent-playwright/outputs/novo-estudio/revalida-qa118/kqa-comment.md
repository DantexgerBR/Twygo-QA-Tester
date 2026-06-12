# QA 1.18 (card 19722) — Exclusão do Banco Histórico — REVALIDAÇÃO 12/06 (escopo MySQL)

Escopo definido pelo QA: validar SOMENTE MySQL (PostgreSQL e DynamoDB fora do escopo desta execução).
E2E destrutivo completo repetido na Trial 37062 + leitura read-only no `twygo_db_rc`.

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage
:: Validação ::
Ciclo completo repetido em 12/06 na Trial 37062: re-semeei a org (curso 807988 + atividade Página 9296214 + geração de roteiro REAL concluída — ai_generation_tasks ganhou a linha nova, baseline pré-exclusão: 7 events / 2 event_contents / 3 ai_generation_tasks) e executei a exclusão via Sophia → "Excluir informações" → "Todas informações" (DELETE /api/v1/o/37062/delete_trial_data → 204; a exclusão agora é assíncrona, com endpoint novo trial_deletion_progress). Resultado MySQL pós-exclusão: events 7→5 (sobram só os 5 templates de sistema ✅) e event_contents 2→0 ✅; PORÉM ai_generation_tasks permanece 3→3 — TODAS as linhas retidas e agora ÓRFÃS (apontam pra events/event_contents que não existem mais), incluindo a criada hoje. Reconfirmado >10min após o 204. Mesma pendência apontada em 11/06 — não foi corrigida. 0/1 TC passando no escopo MySQL.
:: Obs ::
Demais tabelas MySQL do TC (activity_summaries, conversations, messages, studio_generation_partitions): 0 antes e depois — sem dado populável por este fluxo (cobertas como não-contrárias). Novidade estrutural: user_course_preferences agora TEM coluna event_id (migration da PR 10676) — a checagem org-scoped da AT ficou viável; estava 0→0 nesta run. Decisão pendente com o dev: se a retenção de ai_generation_tasks é intencional (auditoria/billing — a linha carrega ai_consumption_id), corrigir a AT; se não é, é retrabalho — título sugerido: "P2 [Novo estúdio de criação] Reset de dados da Trial não apaga ai_generation_tasks (linhas ficam órfãs)".
:: Evidência(s) ::
- agent-db/evidencias/qa18-tc1-org-scoped-37062-{baseline-pre-seed,baseline-pre-exclusao,pos-exclusao}-1206.txt
- agent-db/evidencias/qa18-ai-generation-tasks-37062-*-1206.txt (3 linhas órfãs pós-exclusão)
- 01-curso-criado.png · 02-page-criada.png · 03-roteiro-disparado.png (re-seed)
- 26-checkbox-marcado.png · 27-pos-exclusao.png · 28-listagem-pos-exclusao.png (Sophia)
- seed-resultado.json + revalidar-qa118-seed.mjs + qa18_trial_exclusao_1206.py
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/revalida-qa118
```
