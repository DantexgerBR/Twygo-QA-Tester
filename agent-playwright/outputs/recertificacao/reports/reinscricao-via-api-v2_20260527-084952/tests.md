# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Reinscrição via API V2

_4 caso(s) — 0 aprovado(s), 0 falha(s), 4 ignorado(s)_

### ⊘ Ignorado · TC1 · POST /api/v2/users/mass com `recertification=true` cria participants reinscritos · 🔴 Crítico

<a id="tc1-post-api-v2-users-mass-com-recertification-true-cria-participants-reinscritos"></a>_Arquivo:_ `tc1-post-users-mass-recertification-true.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2.

**Sumário (objetivo do caso):** Validar fluxo principal da API V2: payload com `recertification: true` por participant cria participants reinscritos com `recertification_number` incrementado (RN 14).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA na organização
Curso "Curso API V2 Reinscrição w{workerIndex}" com `has_recertification = true`
Curso "Curso API V2 SEM Reinscrição w{workerIndex}" com `has_recertification = false`
Pelo menos 2 alunos pré-cadastrados e elegíveis
[object Object]
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Preparar payload JSON `{"participants": [{"email":"aluno1@example.com", "event_id": <id_com_recertification>, "recertification": true}]}` | Payload pronto. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2. | — |
| 2 | Disparar `POST /api/v2/users/mass` com o payload, autenticado com token de admin | Response retorna HTTP 200 ou 207 (multi-status). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2. | — |
| 3 | Inspecionar o corpo da resposta | Item correspondente ao aluno aparece com status de sucesso, sem erro. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2. | — |
| 4 | Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}" | "aluno1@example.com" aparece com `recertification_number = N+1`, `progress_score = 0`, status "Pendente". | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA na organização
1. Pré: Curso "Curso API V2 Reinscrição w{workerIndex}" com `has_recertification = true`
1. Pré: Curso "Curso API V2 SEM Reinscrição w{workerIndex}" com `has_recertification = false`
1. Pré: Pelo menos 2 alunos pré-cadastrados e elegíveis
1. Pré: [object Object]
1. 1. Preparar payload JSON `{"participants": [{"email":"aluno1@example.com", "event_id": <id_com_recertification>, "recertification": true}]}`
1. 2. Disparar `POST /api/v2/users/mass` com o payload, autenticado com token de admin
1. 3. Inspecionar o corpo da resposta
1. 4. Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}"

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 · Item com `recertification=true` em curso com `has_recertification=false` retorna erro por item (HTTP 207) · 🔴 Crítico

<a id="tc2-item-com-recertification-true-em-curso-com-has-recertification-false-retorna-erro-por-item-http-207"></a>_Arquivo:_ `tc2-recertification-true-em-conteudo-sem-has-recertification.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2.

**Sumário (objetivo do caso):** Validar resposta multi-status: payload misto com itens válidos e itens inválidos retorna sucessos e erros por item (RN 14.1).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA na organização
Curso "Curso API V2 Reinscrição w{workerIndex}" com `has_recertification = true`
Curso "Curso API V2 SEM Reinscrição w{workerIndex}" com `has_recertification = false`
Pelo menos 2 alunos pré-cadastrados e elegíveis
[object Object]
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Preparar payload JSON com 2 items: item A: `{"email":"aluno_valido@example.com", "event_id": <id_com_recertification>, "recertification": true}` item B: `{"email":"aluno_invalido@example.com", "event_id": <id_SEM_recertification>, "recertification": true}` | Payload pronto. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2. | — |
| 2 | Disparar `POST /api/v2/users/mass` autenticado | Response retorna HTTP 207 (multi-status). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2. | — |
| 3 | Inspecionar o corpo da resposta | Array de resultados: item A com sucesso e participant criado; item B com erro estruturado contendo chave I18n `reenroll_participant.errors.recertification_disabled_for_event`. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA na organização
1. Pré: Curso "Curso API V2 Reinscrição w{workerIndex}" com `has_recertification = true`
1. Pré: Curso "Curso API V2 SEM Reinscrição w{workerIndex}" com `has_recertification = false`
1. Pré: Pelo menos 2 alunos pré-cadastrados e elegíveis
1. Pré: [object Object]
1. 1. Preparar payload JSON com 2 items: item A: `{"email":"aluno_valido@example.com", "event_id": <id_com_recertification>, "recertification": true}` item B: `{"email":"aluno_invalido@example.com", "event_id": <id_SEM_recertification>, "recertification": true}`
1. 2. Disparar `POST /api/v2/users/mass` autenticado
1. 3. Inspecionar o corpo da resposta

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 · Payload sem `recertification` segue fluxo legado (regressão) · 🔴 Crítico

<a id="tc3-payload-sem-recertification-segue-fluxo-legado-regressao"></a>_Arquivo:_ `tc3-payload-sem-recertification-fluxo-legado.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2.

**Sumário (objetivo do caso):** Validar compatibilidade retroativa: payloads de integrações antigas (sem chave `recertification`) seguem o fluxo de inscrição original (RN 14).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA na organização
Curso "Curso API V2 Reinscrição w{workerIndex}" com `has_recertification = true`
Curso "Curso API V2 SEM Reinscrição w{workerIndex}" com `has_recertification = false`
Pelo menos 2 alunos pré-cadastrados e elegíveis
[object Object]
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Preparar payload JSON antigo `{"participants": [{"email":"aluno_legado@example.com", "event_id": <id_com_recertification>}]}` (sem `recertification`) | Payload pronto. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2. | — |
| 2 | Disparar `POST /api/v2/users/mass` autenticado | Response retorna HTTP 200 com sucesso. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2. | — |
| 3 | Acessar a lista de aprendizagem | "aluno_legado@example.com" aparece com `recertification_number = 0` (fluxo de inscrição original — sem reinscrição). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA na organização
1. Pré: Curso "Curso API V2 Reinscrição w{workerIndex}" com `has_recertification = true`
1. Pré: Curso "Curso API V2 SEM Reinscrição w{workerIndex}" com `has_recertification = false`
1. Pré: Pelo menos 2 alunos pré-cadastrados e elegíveis
1. Pré: [object Object]
1. 1. Preparar payload JSON antigo `{"participants": [{"email":"aluno_legado@example.com", "event_id": <id_com_recertification>}]}` (sem `recertification`)
1. 2. Disparar `POST /api/v2/users/mass` autenticado
1. 3. Acessar a lista de aprendizagem

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC4 · Com flag OFF, parâmetro `recertification` é ignorado silenciosamente · 🔴 Crítico

<a id="tc4-com-flag-off-parametro-recertification-e-ignorado-silenciosamente"></a>_Arquivo:_ `tc4-flag-off-recertification-ignorado.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2.

**Sumário (objetivo do caso):** Validar compatibilidade: com flag OFF na org, payload com `recertification: true` é processado como inscrição normal sem retornar erro (RN 14.2).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA na organização
Curso "Curso API V2 Reinscrição w{workerIndex}" com `has_recertification = true`
Curso "Curso API V2 SEM Reinscrição w{workerIndex}" com `has_recertification = false`
Pelo menos 2 alunos pré-cadastrados e elegíveis
[object Object]
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Desativar a feature flag `:recertificacao` para a organização | Flag fica OFF. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2. | — |
| 2 | Disparar `POST /api/v2/users/mass` com payload contendo `recertification: true` por item | Response retorna HTTP 200 com sucesso. Sem erro relacionado a feature flag. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2. | — |
| 3 | Acessar a lista de aprendizagem | Aluno aparece com `recertification_number = 0` (parâmetro foi ignorado). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA na organização
1. Pré: Curso "Curso API V2 Reinscrição w{workerIndex}" com `has_recertification = true`
1. Pré: Curso "Curso API V2 SEM Reinscrição w{workerIndex}" com `has_recertification = false`
1. Pré: Pelo menos 2 alunos pré-cadastrados e elegíveis
1. Pré: [object Object]
1. 1. Desativar a feature flag `:recertificacao` para a organização
1. 2. Disparar `POST /api/v2/users/mass` com payload contendo `recertification: true` por item
1. 3. Acessar a lista de aprendizagem

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
