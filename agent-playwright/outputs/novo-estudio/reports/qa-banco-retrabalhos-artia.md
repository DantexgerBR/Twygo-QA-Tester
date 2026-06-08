# Retrabalhos — Suíte "Tabelas do Banco" (Novo estúdio) — formato Artia

> Ambiente: 🧪 Stage/RC MySQL `twygo_db_rc`. Um retrabalho por falha.
> Evidência: https://github.com/DantexgerBR/Twygo-QA-Tester/blob/project/novo-estudio/agent-db/evidencias/suite-tabelas-banco.txt

---

## P3 [Novo estúdio de criação] AT do banco desatualizada — studio_generation_partitions com colunas diferentes do schema real (TC1)

:: Incidente identificado ::
A AT descreve `studio_generation_partitions` com colunas `lock_active`, `applied_to_event_content_at`, `approved_by`, `trace_id` e apenas `event_content_id` como FK. No schema real essas 4 colunas NÃO existem, e a tabela tem outras: `organization_id`, `event_id`, `conversation_id`, `retry_count`. A tabela existe e é funcional — é divergência de documentação, não bug de produto.

:: Passo a passo para reprodução ::
» Conectar read-only no MySQL twygo_db_rc
» Executar SHOW COLUMNS FROM studio_generation_partitions
» Comparar com a lista de colunas da AT (suíte "Tabelas do Banco", TC1)

:: Comportamento esperado ::
Atualizar a AT para refletir as colunas reais (ou ajustar o schema, se a AT for a fonte da verdade). Destinatário: AT/QA Lead + dev.

---

## P3 [Novo estúdio de criação] AT do banco desatualizada — org_generation_preferences não existe (é org_ai_preferences) (TC3)

:: Incidente identificado ::
A AT pede a tabela `org_generation_preferences` (colunas image_provider/audio_provider/voice_persona). No schema real ela não existe com esse nome — o equivalente é `org_ai_preferences` (image_provider, voice_persona, per_context_overrides JSON; sem audio_provider separado).

:: Passo a passo para reprodução ::
» Conectar read-only no MySQL twygo_db_rc
» Procurar a tabela: SELECT table_name FROM information_schema.tables WHERE table_name LIKE '%preference%'
» Confirmar que existe org_ai_preferences e não org_generation_preferences

:: Comportamento esperado ::
Atualizar a AT com o nome/colunas reais (org_ai_preferences). Destinatário: AT/QA Lead.

---

## P3 [Novo estúdio de criação] AT do banco desatualizada — FKs ON DELETE NO ACTION (AT dizia CASCADE) e display_label nullable (AT dizia NOT NULL) (TC10/TC7)

:: Incidente identificado ::
(1) A AT (TC10) espera `ON DELETE CASCADE` na FK `event_content_id` de `studio_generation_partitions`; o real é `NO ACTION`. (2) A AT (TC7) espera `event_contents.display_label` como NOT NULL; o real é nullable. Tabelas/colunas existem; são divergências de definição.

:: Passo a passo para reprodução ::
» Conectar read-only no MySQL twygo_db_rc
» Consultar information_schema.referential_constraints (delete_rule das FKs)
» SHOW COLUMNS FROM event_contents (nullability de display_label)

:: Comportamento esperado ::
Alinhar AT e schema: confirmar se o delete deve ser CASCADE e se display_label deve ser NOT NULL (com backfill), ou atualizar a AT. Destinatário: AT/QA Lead + dev.

---

## P3 [Novo estúdio de criação] Pendência de execução — validações de banco em DynamoDB e migrations não cobertas

Cobre: TC8, TC9 (DynamoDB), TC11 (rails migrate) — NÃO é bug; exige acesso fora do MySQL

:: Incidente identificado ::
Três TCs da suíte não puderam ser executados com acesso read-only ao MySQL: TC8 (tabela DynamoDB `studio_checkpoints`), TC9 (tabela DynamoDB `messages`) e TC11 (migrations reversíveis up/down, que exigem o app Rails). Não é defeito de produto — é cobertura pendente por falta de acesso.

:: Passo a passo para reprodução ::
» TC8/TC9: acessar o console DynamoDB do ambiente Stage e conferir as tabelas/atributos
» TC11: no ambiente Rails, rodar db:migrate:down e db:migrate:up de uma migration nova

:: Comportamento esperado ::
TC8/TC9: tabelas DynamoDB presentes com as chaves/atributos da AT. TC11: migrations sobem e descem sem erro. Validar via acesso ao DynamoDB e ao Rails. Destinatário: infra/dev.

---

## (TC4) user_course_preferences sem event_id — NÃO duplicar

O TC4 (tabela sem `event_id`, só `UNIQUE(user_id)`) é a MESMA falha já reportada no retrabalho de banco do **QA 1.3 / RN 3** ("Ordem das abas e última aba não são salvas no banco — modelo não suporta escopo por curso"). Vincular a esse card existente em vez de abrir novo.
