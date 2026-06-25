# Runbook de Execução Manual — Suíte "Exclusão do banco histórico (HistoricBaseCron)"

> **Projeto**: Registros de Aprendizagem (`registros-externos`)
> **Suíte**: Exclusão do banco histórico (HistoricBaseCron) — `test-analysis.md:3813`
> **Gerado em**: 2026-06-24
> **Tipo de execução**: 100% **DB / Validação Manual** — `executor: playwright` no frontmatter é uma divergência da AT; os 4 TCs são `Tipo: db` + `[Validação Manual]` e **não têm superfície de UI**. Não há specs Playwright e não devem existir — pertencem ao domínio `agent-db`/QA manual.
> **RN coberta**: RN 96 (banco histórico — toda tabela nova relacionada à organização tem `organization_id`)

---

## 0. Visão geral

O worker **`HistoricBaseCron`** apaga **todos os dados de uma organização** das tabelas do projeto Registros de Aprendizagem. Esta suíte valida três coisas:

1. **Completude** — o worker remove os dados das tabelas **novas**, **atualizadas** e de **logs** da org-alvo (TC1, TC2, TC3).
2. **Isolamento** — o worker **não toca** em nenhuma outra organização (TC4).

A validação consiste sempre no mesmo padrão: **contar/consultar antes → rodar o worker → consultar depois**.

### ⚠️ Avisos críticos antes de começar

- **NÃO rode o worker contra a org principal `37079` (`staging-registros-externos`)**. Ela contém o seed compartilhado de **todas as outras suítes automatizadas** do projeto. Apagá-la quebra as demais suítes. Use uma **organização descartável dedicada** (ver §1).
- A operação é **destrutiva e irreversível** (hard-delete na maioria das tabelas). Confirme o ambiente: deve ser **Stage**, nunca produção.
- Você precisa de **acesso de leitura+execução ao banco do Stage** e de um meio de **acionar o `HistoricBaseCron` sob demanda** (Rails console / Sidekiq / rake task — ver §2).

---

## 1. Organizações usadas

| Papel | Org sugerida | Slug / host | Observação |
|---|---|---|---|
| **Alvo** (será apagada) | **org descartável dedicada** (provisionar com dados completos) | — | **Nunca** usar `37079`. Pode ser a Trial `37078` se for descartável, ou uma org seed criada só para este teste. |
| **Controle** (não pode ser afetada) | **`37080`** | `staging-registros-externos-aditional` / `registrosf2adicional` | Precisa ter dados nas mesmas tabelas para o TC4 ser significativo. |

> Defina como variáveis de sessão para reaproveitar nas queries:
> ```sql
> -- ajuste para o ID real da org descartável provisionada
> \set org_alvo     99999
> \set org_controle 37080
> ```

### Pré-condição de dados (org-alvo)

A org-alvo precisa ter dados em **todas** as famílias de tabela antes de rodar, senão o teste é vazio. Crie pela UI / seed:

- ≥1 registro de aprendizagem (gera `learning_records`, `learning_record_histories`)
- ≥1 evidência anexada (`learning_record_evidences`)
- ≥1 provedor (`learning_providers`)
- ≥1 extração de dados disparada (`data_exports`, `export_jobs`)
- ≥1 preenchimento com IA (`organization_ai_credits`, `ai_consumptions`, `ai_credit_consumption_breakdowns`)
- ações que gerem log (`*_logs`)

---

## 2. Como acionar o `HistoricBaseCron` sob demanda

> O nome exato da classe/método e a forma de enfileiramento devem ser **confirmados com Dev/Infra** — abaixo estão os padrões canônicos de um app Rails+Sidekiq como o Twygo. Anote o comando real validado e atualize este runbook.

**Opção A — Rails console (mais direto para teste sob demanda):**
```ruby
# rails console no ambiente Stage
HistoricBaseCron.new.perform(<org_alvo_id>)
# OU, se for um Sidekiq::Worker:
HistoricBaseCron.perform_async(<org_alvo_id>)
```

**Opção B — Rake task / job agendado disparado manualmente:** confirmar com Infra se há `rake historic_base:run[org_id]` ou painel Sidekiq para enfileirar.

**Critério de conclusão (passo 1 de TC1):** worker conclui **sem erro** (sem exceção no console / job marcado como `done` no Sidekiq, sem entradas em `retry`/`dead`).

---

## TC1 — Exclusão de `learning_records` e dependências (tabelas novas)

**Prioridade**: critical · **RN**: 96

### Objetivo
O worker remove os dados das **tabelas novas** da org-alvo.

### Passos

**1. Contar ANTES (org-alvo) — todas devem ser > 0:**
```sql
SELECT 'learning_records'            AS tabela, COUNT(*) FROM learning_records            WHERE organization_id = :org_alvo
UNION ALL SELECT 'learning_providers',          COUNT(*) FROM learning_providers          WHERE organization_id = :org_alvo
UNION ALL SELECT 'learning_record_evidences',   COUNT(*) FROM learning_record_evidences   e
          WHERE EXISTS (SELECT 1 FROM learning_records r WHERE r.id = e.learning_record_id AND r.organization_id = :org_alvo)
UNION ALL SELECT 'learning_record_histories',   COUNT(*) FROM learning_record_histories   h
          WHERE EXISTS (SELECT 1 FROM learning_records r WHERE r.id = h.learning_record_id AND r.organization_id = :org_alvo);
```
> `learning_record_evidences` e `learning_record_histories` podem **não** ter `organization_id` direto (derivam via FK `learning_record_id`). Se o schema real tiver a coluna direta (confirmar via suíte "Tabelas do banco" TC6), simplifique para `WHERE organization_id = :org_alvo`.

**2. Rodar o worker** para `:org_alvo` (ver §2) → conclui sem erro.

**3. Contar DEPOIS (org-alvo) — todas devem ser 0:**
> Reexecutar exatamente a query do passo 1.

### ✅ Critério de aprovação
- Antes: todas as contagens > 0.
- Depois: **`learning_records`, `learning_record_evidences`, `learning_record_histories` = 0**.
- `learning_providers` da org-alvo removidos conforme a política do banco histórico (esperado **0**; se a política for preservar provedor sem vínculo, anotar como exceção documentada da RN).
- **Atenção ao soft-delete**: `learning_records` usa `deleted_at` no fluxo normal de UI, mas o banco histórico faz **hard-delete**. Conte **linhas físicas** (sem filtrar `deleted_at IS NULL`), senão um registro soft-deleted pré-existente mascara o resultado.

---

## TC2 — Exclusão nas tabelas atualizadas

**Prioridade**: high · **RN**: 96

### Objetivo
Dados da org nas tabelas **atualizadas** pelo projeto também são excluídos: `event_participants`, `event_sources`, `filters`, `filter_options`, `active_filters`, `data_exports`, `export_jobs`, `organization_ai_credits`, `ai_consumptions`.

### Passos

**1. Contar ANTES e DEPOIS (org-alvo):**
```sql
SELECT 'event_participants'      AS tabela, COUNT(*) FROM event_participants      WHERE organization_id = :org_alvo
UNION ALL SELECT 'event_sources',          COUNT(*) FROM event_sources           WHERE organization_id = :org_alvo
UNION ALL SELECT 'filters',                COUNT(*) FROM filters                 WHERE organization_id = :org_alvo
UNION ALL SELECT 'filter_options',         COUNT(*) FROM filter_options          fo
          WHERE EXISTS (SELECT 1 FROM filters f WHERE f.id = fo.filter_id AND f.organization_id = :org_alvo)
UNION ALL SELECT 'active_filters',         COUNT(*) FROM active_filters          WHERE organization_id = :org_alvo
UNION ALL SELECT 'data_exports',           COUNT(*) FROM data_exports            WHERE organization_id = :org_alvo
UNION ALL SELECT 'export_jobs',            COUNT(*) FROM export_jobs             WHERE organization_id = :org_alvo
UNION ALL SELECT 'organization_ai_credits',COUNT(*) FROM organization_ai_credits WHERE organization_id = :org_alvo
UNION ALL SELECT 'ai_consumptions',        COUNT(*) FROM ai_consumptions         WHERE organization_id = :org_alvo;
```
> Para colunas sem `organization_id` direto (ex.: `filter_options`, `export_jobs`), derive via FK ao pai como no exemplo. Confirmar o caminho real de cada tabela com Dev — algumas tabelas "atualizadas" podem ter políticas de retenção parciais (nem tudo zera).

**2. Rodar o worker** para `:org_alvo`.

### ✅ Critério de aprovação
Linhas vinculadas à org-alvo excluídas **conforme a política de cada tabela**. Onde a política for "zerar", contagem depois = 0. Onde a política for retenção parcial, anotar o esperado por tabela (alinhar com Dev) e validar contra ele — **não** assumir 0 cego para todas.

---

## TC3 — Exclusão das tabelas de logs

**Prioridade**: high · **RN**: 96

### Objetivo
Logs novos e atualizados da org também são removidos: `learning_records_logs`, `learning_providers_logs`, `event_sources_logs`, `event_participant_logs`, `certificates_logs`, `ai_credit_consumption_breakdowns`.

### Passos

**1. Contar ANTES e DEPOIS (org-alvo):**
```sql
SELECT 'learning_records_logs'   AS tabela, COUNT(*) FROM learning_records_logs   WHERE organization_id = :org_alvo
UNION ALL SELECT 'learning_providers_logs',          COUNT(*) FROM learning_providers_logs   WHERE organization_id = :org_alvo
UNION ALL SELECT 'event_sources_logs',               COUNT(*) FROM event_sources_logs        WHERE organization_id = :org_alvo
UNION ALL SELECT 'event_participant_logs',           COUNT(*) FROM event_participant_logs    WHERE organization_id = :org_alvo
UNION ALL SELECT 'certificates_logs',                COUNT(*) FROM certificates_logs         WHERE organization_id = :org_alvo
UNION ALL SELECT 'ai_credit_consumption_breakdowns', COUNT(*) FROM ai_credit_consumption_breakdowns WHERE organization_id = :org_alvo;
```
> ⚠️ **Pré-checagem**: a memória do projeto registra que **logging pode não estar implementado** neste build (suíte "Tabelas de logs" provavelmente bloqueada — algumas dessas tabelas podem não existir / estar vazias). **Primeiro** rode `SELECT to_regclass('public.<tabela>')` para confirmar que cada tabela existe. Se a tabela não existe ou está sempre vazia, marque o respectivo passo como **BLOQUEADO (logging não implementado)**, não como falha do worker.

**2. Rodar o worker** para `:org_alvo`.

### ✅ Critério de aprovação
Para cada tabela de log **que existe e tinha linhas**: contagem depois = 0. Para tabela inexistente/sempre-vazia: BLOQUEADO documentado (não conta como reprovação do worker).

---

## TC4 — Isolamento: outras organizações intactas

**Prioridade**: critical · **RN**: 96

### Objetivo
O worker **não afeta** dados de outras organizações.

### Passos

**1. Snapshot ANTES (org-controle `:org_controle`)** — rode o "censo" completo das tabelas do projeto e **guarde o resultado**:
```sql
-- Censo da org de controle (tabelas novas + atualizadas + logs existentes)
SELECT 'learning_records'        AS tabela, COUNT(*) AS antes FROM learning_records        WHERE organization_id = :org_controle
UNION ALL SELECT 'learning_providers',       COUNT(*) FROM learning_providers       WHERE organization_id = :org_controle
UNION ALL SELECT 'event_participants',        COUNT(*) FROM event_participants      WHERE organization_id = :org_controle
UNION ALL SELECT 'event_sources',             COUNT(*) FROM event_sources           WHERE organization_id = :org_controle
UNION ALL SELECT 'filters',                   COUNT(*) FROM filters                 WHERE organization_id = :org_controle
UNION ALL SELECT 'active_filters',            COUNT(*) FROM active_filters          WHERE organization_id = :org_controle
UNION ALL SELECT 'data_exports',              COUNT(*) FROM data_exports            WHERE organization_id = :org_controle
UNION ALL SELECT 'export_jobs',               COUNT(*) FROM export_jobs             WHERE organization_id = :org_controle
UNION ALL SELECT 'organization_ai_credits',   COUNT(*) FROM organization_ai_credits WHERE organization_id = :org_controle
UNION ALL SELECT 'ai_consumptions',           COUNT(*) FROM ai_consumptions         WHERE organization_id = :org_controle
ORDER BY tabela;
```

**2. Rodar o worker** para `:org_alvo` (NÃO para a controle).

**3. Snapshot DEPOIS (org-controle)** — reexecutar a query do passo 1.

### ✅ Critério de aprovação
Contagens **idênticas** antes vs depois para **todas** as tabelas da org-controle. Qualquer diferença = **reprovação crítica** (vazamento do worker entre organizações).

> Dica para diff automático: salve as duas saídas em arquivos e compare, ou rode `SELECT ... EXCEPT SELECT ...` entre dois snapshots materializados em tabela temporária.

---

## 3. Resumo / folha de resultados

Preencher ao executar:

| TC | Foco | Resultado esperado | Status | Observações |
|---|---|---|---|---|
| TC1 | Tabelas novas zeram | records/evidences/histories = 0; providers conforme política | ☐ pass ☐ fail ☐ bloqueado | |
| TC2 | Tabelas atualizadas | excluídas conforme política por tabela | ☐ pass ☐ fail ☐ bloqueado | |
| TC3 | Tabelas de logs | logs existentes zeram | ☐ pass ☐ fail ☐ bloqueado | logging pode não estar implementado |
| TC4 | Isolamento org-controle | contagens idênticas antes/depois | ☐ pass ☐ fail | |

### Itens a confirmar com Dev/Infra antes da execução
1. Nome exato e assinatura do `HistoricBaseCron` (classe, método, como passar `organization_id`) + forma de acionar sob demanda no Stage.
2. Quais tabelas têm `organization_id` **direto** vs **derivado por FK** (cruzar com suíte "Tabelas do banco" TC6).
3. **Política por tabela** nas "atualizadas" (TC2): quais zeram totalmente vs retenção parcial.
4. Quais tabelas de log realmente existem neste build (TC3) — logging pode não estar implementado.
5. Qual org descartável usar como alvo (NUNCA `37079`).
