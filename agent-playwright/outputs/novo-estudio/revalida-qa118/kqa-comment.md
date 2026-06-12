# QA 1.18 (card 19722) — Exclusão do Banco Histórico — REVALIDAÇÃO 12/06 (escopo MySQL)

> Veredito ajustado após alinhamento com o time (12/06): execução CONCLUÍDA → card ✅;
> a falha encontrada (retenção de ai_generation_tasks) vira RETRABALHO (descrição pronta abaixo).

Escopo definido pelo QA: validar SOMENTE MySQL (PostgreSQL e DynamoDB fora do escopo desta execução).

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Execução concluída de ponta a ponta na Trial 37062 (escopo MySQL): re-semeei a org (curso 807988 + atividade Página 9296214 + geração de roteiro REAL concluída; baseline pré-exclusão: 7 events / 2 event_contents / 3 ai_generation_tasks) e executei a exclusão via Sophia → "Excluir informações" → "Todas informações" (DELETE /api/v1/o/37062/delete_trial_data → 204; processamento assíncrono com endpoint trial_deletion_progress). Resultado: events 7→5 (sobram só os 5 templates de sistema ✅) e event_contents 2→0 ✅. Falha encontrada e destacada para retrabalho: ai_generation_tasks permanece 3→3 — todas as linhas retidas e órfãs após a exclusão (reproduzido em 11/06 e 12/06).
:: Obs ::
Conforme alinhamento, a retenção de ai_generation_tasks segue como retrabalho (descrição pronta no card linkado abaixo). Demais tabelas MySQL do TC (activity_summaries, conversations, messages, studio_generation_partitions): 0 antes e depois — sem dado populável por este fluxo. Novidade estrutural: user_course_preferences agora tem coluna event_id (migration da PR 10676), viabilizando a checagem org-scoped da AT.
Link do retrabalho: <COLAR_LINK_DO_CARD_DE_RETRABALHO>
:: Evidência(s) ::
- qa18-tc1-org-scoped-37062-{baseline-pre-seed,baseline-pre-exclusao,pos-exclusao}-1206.txt (agent-db)
- qa18-ai-generation-tasks-37062-*-1206.txt (3 linhas órfãs pós-exclusão)
- 01-curso-criado.png · 02-page-criada.png · 03-roteiro-disparado.png · 26/27/28 (fluxo Sophia)
- seed-resultado.json + scripts da execução
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/revalida-qa118
```

---

## Retrabalho proposto (pronto pra abrir no Artia)

**Título**: P2 [Novo estúdio de criação] Exclusão de dados da Trial não apaga os registros de geração de IA (ai_generation_tasks fica órfã)

**Descrição**:

    :: Incidente identificado ::
A exclusão de dados de uma organização Trial (widget Sophia → "Excluir informações" → opção "Todas informações (pré-definidas e criadas pelos administradores)") apaga os cursos (events) e as atividades (event_contents), mas NÃO apaga os registros de geração de IA da organização na tabela ai_generation_tasks (MySQL). As linhas ficam órfãs: apontam para curso e atividade que não existem mais (scope_resource_id/target_resource_id quebrados). Reproduzido duas vezes (11/06 e 12/06) na org Trial 37062 — após a segunda exclusão a tabela acumulava 3 registros órfãos.

    :: Passo a passo para reprodução ::
» Em uma org Trial, criar um curso com uma atividade do tipo Página.
» No Estúdio (aba Atividades), abrir o popover "pendentes" da Página e clicar no item "Roteiro" para gerar com o copiloto; aguardar a geração concluir (isso grava 1 registro em ai_generation_tasks com o organization_id da Trial).
» Abrir o widget Sophia → "Excluir informações" → marcar "Todas informações (pré-definidas e criadas pelos administradores)" → Excluir.
» Aguardar o processamento assíncrono concluir (DELETE /api/v1/o/{org}/delete_trial_data retorna 204; progresso em /api/v1/o/{org}/trial_deletion_progress).
» Consultar no MySQL: SELECT COUNT(*) FROM ai_generation_tasks WHERE organization_id = {org}.

    :: Comportamento esperado ::
A exclusão de dados da Trial deve apagar também os registros de ai_generation_tasks da organização, junto com events e event_contents — sem deixar linhas órfãs referenciando recursos já excluídos. (Se houver necessidade de reter algo por auditoria/billing — a linha carrega ai_consumption_id — a retenção precisa ser explícita e sem referências quebradas.)

    :: Informações ::
url: https://novoestudiotrial.stage.twygoead.com/o/37062/events?tab=events&profile=admin
login: agents.qa@claude.com
senha: 123456
org_id: 37062
banco: twygo_db_rc (read-only) — tabela ai_generation_tasks
ids órfãos reproduzidos (12/06): aa605266-c622-4145-9e1d-5b660cf151d2 (event 807988 excluído), 83b6c627-79fd-4827-a900-0b1f192cabf4 (event 807902 excluído), 5a012859-0de8-406a-9854-4744753f47fc (event 807899 excluído em 11/06)

    :: Evidência(s) ::
Baseline e pós-exclusão do MySQL + screenshots do fluxo Sophia:
https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/revalida-qa118
