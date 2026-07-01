# Runbook DB-manual — Suíte "Tabelas do banco de dados (schema das entidades novas e atualizadas)"

> **Projeto**: Registros de Aprendizagem (`registros-externos`)
> **Suíte**: Tabelas do banco de dados (schema das entidades novas e atualizadas) — suíte 18/21
> **Gerado em**: 2026-06-24 14:40 · **revisado** 2026-06-24 (schema real corrigido pelo QA Lead)
> **Executor real**: **DB-manual / SQL** (ver §Veredito) — NÃO Playwright
> **Ambiente alvo**: Stage `staging-registros-externos` · org principal `organization_id = 37079` · app `registrosf2.stage.twygoead.com`
> **Banco**: **MySQL** — database `twygo`, porta `3306`, usuário read-only (conforme `agent-db/.env.example`).
> **Host do MySQL**: NÃO está no repo (gitignored por política; `agent-db` só tem `.env.example` com placeholder). Obter com DevOps/infra — não é derivável da URL do app.

---

## ⚠️ Correção de schema (2026-06-24) — a AT e o Discovery estão errados

A AT (e o Discovery) descrevem tabelas **`learning_records` / `learning_providers` / `learning_record_evidences` / `learning_record_histories` que NÃO existem**. A feature "Registros de Aprendizagem" foi implementada **reaproveitando o modelo `events` / `event_sources` / `event_participants`** já existente do Twygo + tabelas de certificados/arquivos, e **uma** tabela nova de export. Mapa real (fornecido pelo QA Lead):

| Conceito na AT/Discovery | Tabela REAL | Notas-chave |
|---|---|---|
| Provedor (`learning_providers`) | **`event_sources`** | origem via enum `provider_type`: `internal` / `shared` / `external` |
| Registro / curso (`learning_records`) | **`events`** | FKs: `event_source_id`, `original_event_id` (mirror), **`certificate_id` → `archives`** |
| Inscrição (eixo do export) | **`event_participants`** | **`certificate_id` → `archives`** (NÃO `certificates`) |
| Certificado: histórico/metadados | **`certificates`** | `situation`: `EXPIRED` / `VALID` / `REPLACED`; `archive_id` → `archives` |
| Evidências (`learning_record_evidences`) | **`event_participant_evidences`** | `archive_id` → `archives` |
| Arquivo no S3 | **`archives`** | `attachment_real_file_name` = key do S3 |
| Job de export (novo) | **`subscription_attachments_exports`** | `status`, `zip_s3_keys`, `zip_urls`, `expires_at`, `failed_files` |
| Trilha de eventos (`learning_record_histories`) | **❓ sem tabela dedicada confirmada** | "criado/submetido/aprovado/recusado" provavelmente em status de `event_participants`; "expirado/substituído" = `certificates.situation` (`EXPIRED`/`REPLACED`). **VERIFICAR** — é a parte "misturada" |

> **Gotcha crítico**: a coluna chama-se `certificate_id` mas **referencia `archives`** (o arquivo), **não** a tabela `certificates`. Confirmar via FK (query abaixo) antes de assumir o vínculo.

### Recomendação (forte) para a AT/Discovery

1. **Schema**: reescrever os TCs da suíte 18 (e qualquer referência a `learning_*` no Discovery) para as tabelas reais acima. As 4 tabelas `learning_*` documentadas são fictícias.
2. **Executor**: mismatch sistêmico — suítes 18/19/20 declaram `executor: playwright` mas são 100% `Tipo: db` / `[Validação Manual]`. Corrigir para `executor: db`.
3. Ambas as correções nascem no **MD canônico do `agent-at`** (`agent-at/projects/registros-externos/output/test-analysis.md`) — não na cópia `inputs/` daqui (regra dura #6 + CONTRACT.md).

---

## Veredito da execução (por que não há specs Playwright)

Fase 1 (Init) parou o fluxo Playwright: os 6 TCs são `Tipo: db` + `[Validação Manual]`, com asserções 100% a nível de schema/persistência (MySQL), que o agente de UI não enxerga. Não há `agent-db` funcional (esqueleto, sem connection string). As ações de UI embutidas já são cobertas por outras suítes Playwright. **Decisão confirmada (QA Lead, 2026-06-24): DB-manual** — entregar este runbook, não specs.

---

## Como executar este runbook

1. Conectar (read-only) ao **MySQL** do Stage — porta `3306`, database `twygo`. Host vem do DevOps/infra. Em seguida:
   ```sql
   USE twygo;
   -- confirme que as tabelas REAIS existem (NÃO procure learning_*):
   SHOW TABLES WHERE Tables_in_twygo IN (
     'events','event_sources','event_participants','certificates',
     'event_participant_evidences','archives','subscription_attachments_exports');
   ```
   - `events`/`event_sources`/`event_participants`/`certificates`/`archives` são **pré-existentes** do Twygo (devem existir sempre). O foco do projeto são **colunas novas** nelas + a tabela nova `subscription_attachments_exports`.
   - Se `subscription_attachments_exports` não existir → migration do projeto não aplicada no Stage (blocker de ambiente, reportar dev/devops).
2. TCs com etapa de UI: executar a ação na UI primeiro (perfil indicado), anotar o id do recurso.
3. Rodar as queries de schema e de dados de cada TC.
4. Marcar PASS/FAIL no checklist comparando com o "Critério de aceite".

> **Dialeto MySQL**: todas as queries de `information_schema` filtram por `table_schema = DATABASE()` (= `'twygo'` após `USE twygo`). Sem o filtro o MySQL varre todos os schemas e parece "vazio".
> **Substitua** `:org_id` por `37079`; `:event_id` / `:source_id` / `:participant_id` pelos ids retornados na etapa de UI.

---

## TC1 — Registro / curso → `events` (+ origem em `event_sources`) · RN 41, 57 · **critical**

**Objetivo (revisado)**: a entidade do registro de aprendizagem é `events`, com FKs novas e soft-delete; a origem (interno/compartilhado/externo) vem de `event_sources.provider_type`.

### 1a. Schema — colunas de `events`
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name = 'events'
ORDER BY ordinal_position;
```
**Critério de aceite**: presença das colunas novas/centrais — `organization_id`, `event_source_id`, `original_event_id` (mirror), `certificate_id`, título/conteúdo, tipo de experiência, carga horária, progresso, datas (início, término, certificado/emissão, validade) e **soft-delete (`deleted_at`)**.

### 1b. Schema — FKs de `events`
```sql
SELECT column_name, referenced_table_name, referenced_column_name
FROM information_schema.key_column_usage
WHERE table_schema = DATABASE() AND table_name = 'events'
  AND referenced_table_name IS NOT NULL;
```
**Critério de aceite**: `event_source_id` → `event_sources`; `original_event_id` → `events` (self-FK p/ mirror); **`certificate_id` → `archives`** (confirmar que NÃO aponta p/ `certificates`); `organization_id` → `organizations`.

### 1c. Persistência + soft-delete (etapa de UI)
- **UI**: como Aluno, criar registro **Externo**. Anotar `:event_id`.
```sql
SELECT e.id, e.organization_id, e.event_source_id, es.provider_type, e.deleted_at
FROM events e
JOIN event_sources es ON es.id = e.event_source_id
WHERE e.id = :event_id;
```
→ linha persiste; `provider_type = external`; `organization_id = 37079`; `deleted_at IS NULL`.
- **UI**: excluir o registro.
```sql
SELECT id, deleted_at FROM events WHERE id = :event_id;
```
**Critério de aceite**: linha **permanece** com `deleted_at` preenchido (soft-delete).

---

## TC2 — Provedor → `event_sources` · RN 84, 85 · **critical**

**Objetivo (revisado)**: o "provedor" é `event_sources`; a natureza interno/compartilhado/externo é o enum `provider_type`.

### 2a. Schema + tipo do enum `provider_type`
```sql
SELECT column_name, data_type, column_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name = 'event_sources'
ORDER BY ordinal_position;
```
**Critério de aceite**: colunas `organization_id`, nome, website, descrição, flag de ativo (`active`/`enabled`), `provider_type` e timestamps.
> **VERIFICAR enum**: olhe `column_type` de `provider_type`. Se `enum('internal','shared','external')` → enum nativo MySQL. Se `tinyint`/`int` → **Rails enum** (mapeamento `internal/shared/external` vive no model `event_source.rb`, tipicamente `0/1/2`) — confirmar a ordem no model, não dá pra inferir só pelo banco.

### 2b. Persistência (etapa de UI)
- **UI**: criar provedor. Anotar `:source_id`.
```sql
SELECT id, organization_id, name, website, description, active, provider_type, created_at
FROM event_sources WHERE id = :source_id;
```
- **UI**: desativar (switch) e reconsultar.
```sql
SELECT id, active FROM event_sources WHERE id = :source_id;
```
**Critério de aceite**: cria com `active = true`; após desativar, `active = false`.

---

## TC3 — Evidências → `event_participant_evidences` (+ `archives`) · RN 58, 59 · **high**

**Objetivo (revisado)**: evidências ficam em `event_participant_evidences`, vinculadas à inscrição e ao arquivo no S3 (`archives`).

### 3a. Schema + FKs
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name = 'event_participant_evidences'
ORDER BY ordinal_position;

SELECT column_name, referenced_table_name, referenced_column_name
FROM information_schema.key_column_usage
WHERE table_schema = DATABASE() AND table_name = 'event_participant_evidences'
  AND referenced_table_name IS NOT NULL;
```
**Critério de aceite**: FK para a inscrição (`event_participant_id` → `event_participants`) e **`archive_id` → `archives`**; metadados do arquivo.

### 3b. Persistência + arquivo no S3 (etapa de UI)
- **UI**: anexar evidência a um registro. Anotar `:participant_id`.
```sql
SELECT ev.id, ev.event_participant_id, ev.archive_id, a.attachment_real_file_name AS s3_key
FROM event_participant_evidences ev
JOIN archives a ON a.id = ev.archive_id
WHERE ev.event_participant_id = :participant_id;
```
**Critério de aceite**: linha criada; `archive_id` resolve em `archives` com `attachment_real_file_name` (key do S3) preenchido.

---

## TC4 — Trilha de eventos ("learning_record_histories") · RN 61 · **high** · ⚠️ MAPEAMENTO INCERTO

**Objetivo (AT)**: trilha com tipos canônicos (criado, submetido, aprovado, recusado, expirado, substituído).

> **Atenção**: o mapa fornecido **não inclui** uma tabela de histórico dedicada. A trilha provavelmente está distribuída — **VERIFICAR no banco/model antes de dar veredito**:
> - **expirado / substituído** → `certificates.situation` (`EXPIRED` / `REPLACED`).
> - **criado / submetido / aprovado / recusado** → provavelmente um campo de status em `event_participants` (workflow de aprovação do registro externo) e/ou justificativa de recusa numa coluna de `event_participants`/`certificates`.

### 4a. Estado / situação do certificado
```sql
SELECT column_name, data_type, column_type
FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name = 'certificates'
  AND column_name IN ('situation','archive_id','organization_id','event_participant_id','created_at','updated_at')
ORDER BY ordinal_position;
```
> **VERIFICAR enum `situation`**: `column_type` mostra `enum('EXPIRED','VALID','REPLACED')` (nativo) ou inteiro (Rails enum → confirmar no model `certificate.rb`).

### 4b. Workflow de aprovação na inscrição
```sql
SELECT column_name, data_type, column_type
FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name = 'event_participants'
ORDER BY ordinal_position;
```
**Critério de aceite (provisório)**: localizar a coluna de status do workflow (criado/submetido/aprovado/recusado) e a de justificativa de recusa. **Se não houver tabela/colunas que cubram a trilha completa, registrar como divergência AT × implementação** (a AT presume `learning_record_histories`, que não existe).

### 4c. Ciclo via UI (após confirmar onde mora o status)
- **UI**: executar criar → submeter → recusar (com justificativa) p/ `:participant_id`. Consultar as colunas/tabelas confirmadas em 4a/4b e validar transição + justificativa persistida.

---

## TC5 — tabelas existentes atualizadas (RN 41, 79) · **high**

```sql
-- inscrição / origem (eixo do registro e do export)
SELECT table_name, column_name FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name IN ('event_participants','event_sources')
ORDER BY table_name, ordinal_position;

-- filtros salvos da listagem
SELECT table_name, column_name FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name IN ('filters','filter_options','active_filters')
ORDER BY table_name, ordinal_position;

-- extração assíncrona — tabela NOVA do projeto
SELECT column_name, data_type, is_nullable FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name = 'subscription_attachments_exports'
ORDER BY ordinal_position;

-- crédito de IA e consumo do preenchimento automático
SELECT table_name, column_name FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name IN ('organization_ai_credits','ai_consumptions')
ORDER BY table_name, ordinal_position;
```
**Critério de aceite**:
- `event_participants`/`event_sources`: colunas do projeto (vínculo registro/origem, `provider_type`).
- `filters`/`filter_options`/`active_filters`: suportam filtros salvos.
- **`subscription_attachments_exports`**: tem `status`, `zip_s3_keys`, `zip_urls`, `expires_at`, `failed_files` (job de export em massa).
- `organization_ai_credits`/`ai_consumptions`: saldo/consumo de IA.
> Nota: a AT lista `data_exports`/`export_jobs` para a extração assíncrona — confirmar se existem OU se foram substituídas por `subscription_attachments_exports`. Provável que o export de anexos seja só esta última.

---

## TC6 — `organization_id` nas tabelas do projeto (RN 96) · **critical**

```sql
SELECT table_name,
       MAX(column_name = 'organization_id') AS tem_organization_id
FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name IN (
  'events','event_sources','event_participants','certificates',
  'event_participant_evidences','archives','subscription_attachments_exports')
GROUP BY table_name
ORDER BY table_name;
```
**Critério de aceite**: `organization_id` presente **direto** OU derivável via **FK obrigatória** (ex.: `event_participant_evidences` → `event_participants`/`events` → `organization_id`; `archives` pode herdar via owner polimórfico). Para as sem coluna direta, confirmar a cadeia de FK obrigatória.

---

## Checklist de execução (preencher após rodar no Stage)

| TC | Tabela REAL / foco | Schema OK | Dados/Persistência OK | Resultado |
|---|---|---|---|---|
| TC1 | `events` + `event_sources` + soft-delete | ☐ | ☐ | ☐ PASS ☐ FAIL |
| TC2 | `event_sources` (`provider_type`, active) | ☐ | ☐ | ☐ PASS ☐ FAIL |
| TC3 | `event_participant_evidences` + `archives` | ☐ | ☐ | ☐ PASS ☐ FAIL |
| TC4 | trilha (⚠️ `certificates.situation` + status em `event_participants` — VERIFICAR) | ☐ | ☐ | ☐ PASS ☐ FAIL ☐ DIVERGÊNCIA-AT |
| TC5 | atualizadas + `subscription_attachments_exports` | ☐ | n/a | ☐ PASS ☐ FAIL |
| TC6 | `organization_id` nas tabelas do projeto | ☐ | n/a | ☐ PASS ☐ FAIL |

---

## Status desta run

- **Specs Playwright gerados**: 0 (intencional — suíte é DB-manual).
- **TCs executados automaticamente**: 0 (sem acesso DB no monorepo hoje).
- **Schema corrigido**: AT/Discovery descreviam tabelas `learning_*` fictícias; runbook agora aponta as tabelas reais (`events`/`event_sources`/`event_participants`/`certificates`/`event_participant_evidences`/`archives`/`subscription_attachments_exports`).
- **Pendências de verificação (precisam de acesso ao banco/model)**: (a) tipo dos enums `provider_type`/`situation` (nativo vs Rails-int); (b) onde mora a trilha do TC4; (c) `certificate_id`→`archives` confirmado via FK; (d) se `data_exports`/`export_jobs` existem ou foram substituídas.
- **Bloqueio p/ automação futura**: implementar `agent-db` (connection read-only MySQL ao Stage).
