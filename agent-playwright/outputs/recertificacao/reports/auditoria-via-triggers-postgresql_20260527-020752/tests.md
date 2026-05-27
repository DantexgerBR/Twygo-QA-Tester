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

### ⊘ Ignorado · TC4 — Logs antigos (pré-deploy) consultáveis com COALESCE para nova coluna 

<a id="tc4-logs-antigos-pre-deploy-consultaveis-com-coalesce-para-nova-coluna"></a>_Arquivo:_ `tc4-logs-antigos-consultaveis-com-coalesce.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

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
