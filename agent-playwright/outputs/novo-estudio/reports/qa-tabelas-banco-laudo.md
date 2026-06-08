# Laudo — Suíte "Tabelas do Banco de Dados" (validação read-only)

- **Projeto**: Novo estúdio de criação
- **Ambiente**: 🧪 Stage/RC — MySQL `twygo_db_rc` (org 37061 / curso 807533 confirmados)
- **Execução**: 08/06/2026, acesso direto read-only (`SET SESSION TRANSACTION READ ONLY`, só SELECT)
- **Cobertura**: TC1–TC7 + TC10 (MySQL). TC8/TC9 (DynamoDB) e TC11 (`rails db:migrate`) **fora de alcance** deste acesso.
- **Evidência**: `Twygo-QA-Tester/agent-db/evidencias/suite-tabelas-banco.txt`

## Resultado: 4 ✅ · 3 ❌ · TC8/TC9/TC11 não executáveis (DynamoDB/Rails)

| TC | Tabela | Veredito |
|---|---|---|
| TC1 | studio_generation_partitions | ❌ **AT desatualizada** — tabela existe e funcional, mas colunas divergem: a AT pede `lock_active`/`applied_to_event_content_at`/`approved_by`/`trace_id` (nenhuma existe); o real tem `organization_id`/`event_id`/`conversation_id`/`retry_count`. Reconciliar AT↔impl (não é bug de produto). |
| TC2 | activity_summaries | ✅ (PK = `event_content_id` por design — não há coluna `id`; demais colunas presentes) |
| TC3 | org_generation_preferences | ❌ **AT desatualizada** — não existe com esse nome; equivalente real é **`org_ai_preferences`** (`image_provider`, `voice_persona`, `per_context_overrides` JSON). Reconciliar nome/colunas. |
| TC4 | user_course_preferences | ❌ **gap real** — falta a coluna `event_id` (há só `UNIQUE(user_id)`). Mesmo achado do QA 1.3/RN 3: persistência não comporta escopo por curso. |
| TC5 | conversations | ✅ (`organization_dataset_id` nullable, `event_id`, `user_id`, `context_type` presentes) |
| TC6 | messages | ✅ (`studio_partition_id` presente) |
| TC7 | event_contents | ✅ (`display_label` + `display_icon` existem) — *obs:* `display_label` é **nullable**; a AT esperava NOT NULL. |
| TC8 | DynamoDB studio_checkpoints | ⏭️ não executável (DynamoDB — sem acesso) |
| TC9 | DynamoDB messages | ⏭️ não executável (DynamoDB — sem acesso) |
| TC10 | FKs / ON DELETE | ❌→obs: FKs existem, mas `delete_rule = NO ACTION` (a AT esperava `ON DELETE CASCADE` em `event_content_id`); `user_course_preferences` só tem FK `user_id` (sem `event_id`, coerente com TC4). |
| TC11 | migrations up/down | ⏭️ não executável (`rails db:migrate` — sem acesso ao app Rails) |

## Leitura

- **Tema dominante: a AT da suíte "Tabelas do Banco" está desatualizada vs a implementação** (nomes e colunas mudaram: `org_ai_preferences`, partitions com outro conjunto de colunas, FKs `NO ACTION`). Isso é **reconciliação de AT** (rotear pra AT/dev), não defeito de produto.
- **Único gap com impacto de RN**: TC4 — `user_course_preferences` sem `event_id`, que sustenta o retrabalho da RN 3 (abas não persistem por curso). Ver laudo QA 1.3.
- Anti-falso-positivo aplicado: TC2 ("sem id") e TC3 ("tabela não existe") eram falsos positivos, resolvidos por cross-check (PK por `event_content_id`; tabela renomeada).

## Retrabalho sugerido (formato Artia)

```
TÍTULO: P3 [Novo estúdio de criação] Reconciliar a AT "Tabelas do Banco" com o schema real (nomes/colunas/FKs divergentes)

:: Incidente identificado ::
A análise de teste da suíte "Tabelas do Banco" descreve tabelas/colunas que não batem com o schema implementado no MySQL: org_generation_preferences está como org_ai_preferences; studio_generation_partitions não tem lock_active/approved_by/trace_id (e tem organization_id/event_id/conversation_id/retry_count); FKs estão como ON DELETE NO ACTION (AT dizia CASCADE); display_label é nullable (AT dizia NOT NULL).
:: Comportamento esperado ::
Atualizar a AT para refletir o schema real (ou ajustar o schema se a AT for a fonte da verdade). Observação: as tabelas existem e estão funcionais — é alinhamento de documentação, não bug de produto.
:: Evidência(s) ::
- https://github.com/DantexgerBR/Twygo-QA-Tester/blob/project/novo-estudio/agent-db/evidencias/suite-tabelas-banco.txt
```
