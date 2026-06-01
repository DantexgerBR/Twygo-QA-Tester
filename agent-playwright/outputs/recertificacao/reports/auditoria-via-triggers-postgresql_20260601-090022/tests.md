# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Auditoria via Triggers PostgreSQL

_4 caso(s) — 0 aprovado(s), 0 falha(s), 4 ignorado(s)_

### ⊘ Ignorado · TC1 — Insert em event_participants propaga recertification_number para event_participant_info_logs 

<a id="tc1-insert-em-event-participants-propaga-recertification-number-para-event-participant-info-logs"></a>_Arquivo:_ `tc1-insert-event-participants-propaga-recertification-number.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 — Update em events.has_recertification propaga para event_logs 

<a id="tc2-update-em-events-has-recertification-propaga-para-event-logs"></a>_Arquivo:_ `tc2-update-events-has-recertification-propaga-event-logs.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 — Triggers são reversíveis (migration down restaura comportamento) 

<a id="tc3-triggers-sao-reversiveis-migration-down-restaura-comportamento"></a>_Arquivo:_ `tc3-triggers-reversibles-migration-down.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC4 · Logs antigos (pré-deploy) consultáveis com COALESCE para nova coluna · 🟡 Normal

<a id="tc4-logs-antigos-pre-deploy-consultaveis-com-coalesce-para-nova-coluna"></a>_Arquivo:_ `tc4-logs-antigos-consultaveis-com-coalesce.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver.

**Sumário (objetivo do caso):** Validar compatibilidade retroativa: rows antigas têm `recertification_number = NULL` mas consultas continuam executáveis (RN 26.2).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Banco `postgres_logs` (TimescaleDB) acessível
Migrations de triggers aplicadas (`update_event_participant_info_logs_trigger_for_recertification`, `update_event_logs_trigger_with_has_recertification`)
Curso com `has_recertification = true`
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Pré-condição: tabela `event_participant_info_logs` com rows pré-deploy (sem coluna `recertification_number`) e rows pós-deploy (com a coluna). | Estado típico de staging com histórico. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver. | — |
| 2 | Executar query `SELECT COALESCE(recertification_number, 0) AS rn, COUNT(*) FROM event_participant_info_logs GROUP BY rn` | Query executa sem erro retornando agrupamento por `rn` (rows antigas com `0`, rows novas com seu valor). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver. | — |
| 3 | Executar `SELECT * FROM event_participant_info_logs ORDER BY created_at DESC LIMIT 100` | 100 rows mais recentes retornadas, mesclando rows com e sem `recertification_number` preenchido. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Normal
- **Motivo declarado pelo spec:** requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Banco `postgres_logs` (TimescaleDB) acessível
1. Pré: Migrations de triggers aplicadas (`update_event_participant_info_logs_trigger_for_recertification`, `update_event_logs_trigger_with_has_recertification`)
1. Pré: Curso com `has_recertification = true`
1. 1. Pré-condição: tabela `event_participant_info_logs` com rows pré-deploy (sem coluna `recertification_number`) e rows pós-deploy (com a coluna).
1. 2. Executar query `SELECT COALESCE(recertification_number, 0) AS rn, COUNT(*) FROM event_participant_info_logs GROUP BY rn`
1. 3. Executar `SELECT * FROM event_participant_info_logs ORDER BY created_at DESC LIMIT 100`

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
