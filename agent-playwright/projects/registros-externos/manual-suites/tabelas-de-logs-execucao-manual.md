# Roteiro de Execução Manual — Suíte "Tabelas de logs (auditoria de operações)"

> **Projeto**: Registros de Aprendizagem (`registros-externos`)
> **Suíte**: 20 — Tabelas de logs (auditoria de operações)
> **Origem**: `projects/registros-externos/inputs/test-analysis.md` (linhas 3887–3964)
> **Gerado em**: 2026-06-24

---

## Por que esta suíte é manual (não Playwright)

O frontmatter da suíte no AT declara `executor: playwright`, **mas isso é um
erro de classificação**. Os 4 TCs são todos `[Validação Manual]` com
`Tipo: db` — a *asserção* de cada caso é uma **consulta SQL a uma tabela de
log**. O agent-playwright não tem acesso a banco de dados, então a suíte não é
executável pelo fluxo planner→generate→execute.

A correção de raiz é no AT: trocar o frontmatter para `executor: agent-db`
(que hoje é esqueleto) ou marcar como suíte de validação manual de DB. As
suítes 18 (Tabelas do banco) e 19 (HistoricBaseCron) têm o mesmo problema.

> ⚠️ **Risco conhecido (verificar antes de começar)**: em outro projeto
> (`novo-estudio`, 08/06/2026) o dev confirmou que **"não tem logs ainda"** —
> tabelas de log não estavam implementadas. **Antes de rodar os TCs, confirme
> que as tabelas de log existem e gravam** (ver Passo 0). Se não existirem, a
> suíte está **bloqueada por feature não implementada** — não é falha de teste;
> documente como gap de produto e escale ao dev.

---

## ⚠️ O schema da AT/Discovery está ERRADO — usar o schema real

As tabelas `learning_records`, `learning_providers`, `learning_record_*` que a
AT/Discovery descrevem **não existem**. A feature **reusa o schema de eventos**
do Twygo. Mapeamento canônico:

| Conceito (AT fictícia) | Tabela **real** | Detalhes |
|---|---|---|
| registro / curso (`learning_records`) | **`events`** | FKs `event_source_id`, `original_event_id` (mirror), `certificate_id` → **`archives`** |
| provedor (`learning_providers`) | **`event_sources`** | enum `provider_type`: `internal` / `shared` / `external` |
| inscrição / participação | **`event_participants`** | eixo do export; `certificate_id` → **`archives`** (não `certificates`) |
| certificado | **`certificates`** | enum `situation`: `EXPIRED` / `VALID` / `REPLACED`; `archive_id` |
| evidência (`learning_record_evidences`) | **`event_participant_evidences`** | `archive_id` |
| arquivo no S3 | **`archives`** | `attachment_real_file_name` = key do S3 |
| job de export (novo) | **`subscription_attachments_exports`** | `status`, `zip_s3_keys`, `zip_urls`, `expires_at`, `failed_files` |

**Regra das tabelas de log**: o nome real do log é **a tabela real + sufixo
`_logs`** (ex.: `events_logs`, `event_sources_logs`, `event_participants_logs`,
`certificates_logs`). Os nomes `learning_records_logs` / `learning_providers_logs`
da AT **também são fictícios**. Confirme os nomes reais no Passo 0.

---

## Pré-requisitos

| Item | Detalhe |
|---|---|
| **Ambiente** | Stage — `https://registrosf2.stage.twygoead.com/` |
| **Organização** | org **37079** (`organization_id = 37079`) |
| **Acesso ao banco** | Conexão **read-only** ao **MySQL** do Stage (db `twygo`, porta 3306 — DBeaver/MySQL Workbench/`mysql` CLI, ou console de DBA autorizado) |
| **Usuário UI** | Admin com a feature "Registros de Aprendizagem" habilitada |
| **IA** | Crédito de IA disponível na org (para o TC4) |
| **Perfil** | Admin executando as operações que geram log |

> Substitua `:ORG`, `:EVENT_ID`, `:SOURCE_ID` etc. pelos valores reais nas
> queries. Em MySQL você pode definir variáveis de sessão — ex.:
> `SET @ORG := 37079;` — e usar `@ORG` no lugar de `:ORG`.

---

## Passo 0 — Descobrir e confirmar as tabelas de log reais (gate da suíte)

Como os nomes exatos são "provavelmente real + `_logs`", **descubra
empiricamente** o que existe no banco do Stage em vez de assumir.

> **Dialeto: o banco do Twygo é MySQL** (db `twygo`, porta 3306) — não Postgres.
> Por isso `table_schema = DATABASE()` (e não `'public'`).

```sql
-- Lista TODAS as tabelas de log existentes (descoberta)
SELECT table_name
FROM information_schema.tables
WHERE table_schema = DATABASE()
  AND table_name LIKE '%\_logs'
ORDER BY table_name;
```

Procure nessa lista os logs das entidades da feature. Esperado (confirmar):

| Entidade | Log esperado |
|---|---|
| registro/curso (`events`) | `events_logs` |
| provedor (`event_sources`) | `event_sources_logs` |
| participação (`event_participants`) | `event_participants_logs` |
| certificado (`certificates`) | `certificates_logs` |
| evidência (`event_participant_evidences`) | `event_participant_evidences_logs` |

- **Os logs das entidades acima existem** → prossiga para os TCs (usando os
  nomes **reais** que você encontrou).
- **Algum faltando** → registre qual; o TC que depende dele fica **bloqueado
  (feature não implementada)**. Escale ao dev antes de marcar red.

Confirme também as **colunas** de cada log antes de montar as queries:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name = 'events_logs'   -- repita por tabela de log encontrada
ORDER BY ordinal_position;
```

Colunas que cada log deve ter: **vínculo à entidade** (ex. `event_id`,
`event_source_id`, `event_participant_id`), **autor** (`user_id` / `author_id`),
**tipo de operação/evento**, **dados alterados** (quando edição) e **timestamp**
(`created_at`). **Ajuste os nomes de tabela e coluna dos TCs aos reais** que
você confirmou aqui.

> **Filtro por organização**: nem toda tabela de evento tem `organization_id`
> direto. Se a coluna não existir no log, filtre pela FK da entidade (ex.: o
> `event_id` do registro de teste, obtido via UI/rede) em vez de por org.

---

## TC1 — Logs do registro (`events_logs`) — criação, edição, avaliação, exclusão

**Prioridade**: critical · **RNs**: 41, 53, 57
**Tabela real**: `events_logs` (registro = linha em `events`)
**Objetivo**: cada operação CRUD/avaliação em registro gera linha em
`events_logs` com autor e timestamp.

> Capture o **`event_id`** do registro de teste pela rede (resposta do
> `POST /learning_records` → id) ou pela URL ao abrir o registro. Use-o no
> filtro abaixo (mais confiável que filtrar por org).

### Execução

| # | Ação na UI | Query de verificação | Resultado esperado |
|---|---|---|---|
| 1 | Logado como **Admin**, em `Aprendizagem > Registros`, **criar** um registro Externo. Anote o `event_id`. | `SELECT * FROM events_logs WHERE event_id = :EVENT_ID ORDER BY created_at DESC LIMIT 5;` | Linha de **criação** com `user_id` = Admin autor e `created_at` recente. |
| 2 | **Editar** o registro recém-criado (mudar p.ex. Carga horária) e salvar. | (mesma query — observar a nova linha no topo) | Linha de **edição** registrada com os dados alterados. |
| 3 | Em um registro **Pendente**, **Aprovar** (botão Aprovar). | (mesma query) | Linha de **avaliação/aprovação** registrada. |
| 4 | **Excluir** o registro (soft-delete). | (mesma query) | Linha de **exclusão** registrada. |

Query de apoio focada no registro:

```sql
SELECT id, user_id, created_at, *  -- ajustar colunas ao schema real (Passo 0)
FROM events_logs
WHERE event_id = :EVENT_ID            -- id do registro de teste (events.id)
ORDER BY created_at ASC;
```

**Critério de aprovação**: 4 linhas (criação, edição, aprovação, exclusão), em
ordem cronológica, cada uma com autor e timestamp.

- [ ] Passos 1–4 verificados — **PASS / FAIL** — Evidência: __________

---

## TC2 — Logs do provedor (`event_sources_logs`)

**Prioridade**: high · **RNs**: 84, 85, 86
**Tabela real**: `event_sources_logs` (provedor = linha em `event_sources`,
`provider_type = external`)
**Objetivo**: logs de criação, edição, ativação/desativação e exclusão de
provedor em `event_sources_logs`.

> Capture o **`event_source_id`** do provedor pela rede (`/learning_providers`)
> ou pela URL.

### Execução

| # | Ação na UI (`Aprendizagem > Registros > aba Provedores`) | Query | Esperado |
|---|---|---|---|
| 1 | **Criar** um provedor (Nome obrigatório). Anote o `event_source_id`. | `SELECT * FROM event_sources_logs WHERE event_source_id = :SOURCE_ID ORDER BY created_at DESC LIMIT 10;` | Linha de **criação**. |
| 2 | **Editar** o provedor (mudar descrição/website). | (mesma query) | Linha de **edição**. |
| 3 | Alternar o switch **"Ativo"** (desativar). | (mesma query) | Linha de **mudança de status**. |
| 4 | **Excluir** o provedor. | (mesma query) | Linha de **exclusão**. |

```sql
SELECT id, user_id, created_at, *  -- ajustar ao schema real (Passo 0)
FROM event_sources_logs
WHERE event_source_id = :SOURCE_ID    -- id do provedor de teste (event_sources.id)
ORDER BY created_at ASC;
```

**Critério de aprovação**: linhas de edição, mudança de status e exclusão
**em ordem**, além da criação.

- [ ] Passos 1–4 verificados — **PASS / FAIL** — Evidência: __________

---

## TC3 — Logs atualizados das tabelas de evento/certificado existentes

**Prioridade**: medium · **RNs**: 41
**Tabelas reais**: `event_participants_logs`, `certificates_logs`
(e `event_sources_logs`, já coberto no TC2)
**Objetivo**: alterações do projeto refletem nos logs das entidades reais
atualizadas (participação, certificado).

> O AT lista `event_sources_logs` aqui também, mas isso é redundância da
> análise (a AT tratou "provedor" e "event_source" como tabelas distintas —
> são a mesma). A cobertura de `event_sources_logs` já está no TC2. Aqui, foque
> em **participação** (`event_participants`) e **certificado** (`certificates`).

### Execução

| # | Ação na UI | Query | Esperado |
|---|---|---|---|
| 1 | Executar operação que toca eventos internos — ex.: **emitir certificado interno** vinculado a um registro (fluxo de evento/curso interno na org). Anote o `event_participant_id` / `certificate_id` envolvido. | ver queries abaixo | Linhas registradas refletindo a operação nas entidades atualizadas. |

```sql
-- rodar cada uma após a operação e conferir linha nova recente
-- (filtre pela FK da entidade tocada; ajuste nomes ao Passo 0)
SELECT * FROM certificates_logs        WHERE certificate_id      = :CERT_ID ORDER BY created_at DESC LIMIT 5;
SELECT * FROM event_participants_logs  WHERE event_participant_id = :PART_ID ORDER BY created_at DESC LIMIT 5;
```

> **Nota**: este TC depende de existir fluxo de evento interno/certificado
> ativo na org de teste. Se a org não tiver evento interno configurado,
> registre como **dependência de seed** e escale ao QA Lead (não é falha de
> teste).

**Critério de aprovação**: pelo menos a tabela de log correspondente à
operação executada recebeu linha nova vinculada à org, com timestamp.

- [ ] Verificado — **PASS / FAIL / BLOCKED(seed)** — Evidência: __________

---

## TC4 — Rastreio de consumo de IA (`ai_consumptions`)

**Prioridade**: high · **RNs**: 89
**Tabela real (confirmar no Passo 0)**: provavelmente **`ai_consumptions`**
(com `organization_ai_credits` para o saldo) — a suíte 18 cita essas como as
tabelas reais. O nome `ai_credit_consumption_breakdowns` da AT **é suspeito**;
descubra o real:
> ```sql
> SELECT table_name FROM information_schema.tables
> WHERE table_schema = DATABASE() AND (table_name LIKE 'ai\_%' OR table_name LIKE '%ai\_credit%')
> ORDER BY table_name;
> ```
**Objetivo**: o uso do "Preencher com IA" registra consumo; salvamento sem IA
não consome; falhas também são rastreadas.

### Execução

| # | Ação na UI | Query | Esperado |
|---|---|---|---|
| 1 | No form de registro, anexar comprovação e usar **"Preencher com IA"** com **sucesso**; salvar. | `SELECT * FROM ai_consumptions WHERE organization_id = :ORG ORDER BY created_at DESC LIMIT 10;` | **Nova linha** de consumo vinculada à org e ao tipo de geração do preenchimento automático. |
| 2 | Criar/salvar um registro **SEM** usar IA (preenchimento manual). | (mesma query — comparar contagem antes/depois) | **Nenhuma linha nova** de consumo. |
| 3 | Forçar **falha de IA** (timeout simulado — ver nota). | (mesma query) | **Tentativa registrada com status de falha** (h16 cenário 05). |

Contagem para o passo 2 (antes/depois):

```sql
SELECT count(*) FROM ai_consumptions WHERE organization_id = :ORG;  -- ajustar nome ao real
```

> **Nota passo 3 (forçar falha)**: combine com o dev/infra para simular
> timeout/erro do provedor de IA (ex.: indisponibilidade temporária ou flag de
> teste). Sem mecanismo de simulação, o passo 3 fica **BLOCKED(infra)** — não
> red.

**Critério de aprovação**: linha de consumo no sucesso, ausência de linha no
manual, e linha com status de falha no erro.

- [ ] Passos 1–3 verificados — **PASS / FAIL / BLOCKED(infra)** — Evidência: __________

---

## Planilha de resultado (preencher ao executar)

| TC | Tabela-alvo (real) | Status | Executor | Data | Observações / link de evidência |
|---|---|---|---|---|---|
| TC1 | `events_logs` | ☐ PASS ☐ FAIL ☐ BLOCKED | | | |
| TC2 | `event_sources_logs` | ☐ PASS ☐ FAIL ☐ BLOCKED | | | |
| TC3 | `event_participants_logs`, `certificates_logs` | ☐ PASS ☐ FAIL ☐ BLOCKED | | | |
| TC4 | `ai_consumptions` (confirmar) | ☐ PASS ☐ FAIL ☐ BLOCKED | | | |

**Como evidenciar**: print do resultado de cada query (com a linha de log
visível) + print da ação na UI. Anexe ao registro de execução manual / TestLink.

---

## Resumo de rastreabilidade

| TC | Operação UI (geradora) | Tabela de log validada (real) | Suítes UI que já cobrem a operação |
|---|---|---|---|
| TC1 | criar / editar / aprovar / excluir registro | `events_logs` | Adicionar, Editar, Avaliar, Excluir registro |
| TC2 | CRUD + switch ativo de provedor | `event_sources_logs` | CRUD de Provedores |
| TC3 | emissão de certificado / evento interno | `event_participants_logs`, `certificates_logs` | — (fluxo interno) |
| TC4 | Preencher com IA (sucesso/manual/falha) | `ai_consumptions` (confirmar) | Preenchimento com IA e crédito |

> A **metade de UI** de cada TC já tem (ou terá) cobertura E2E nas suítes
> listadas. O valor **exclusivo** desta suíte é a **asserção de log no banco** —
> que é justamente o que exige execução manual/SQL ou o agent-db.
