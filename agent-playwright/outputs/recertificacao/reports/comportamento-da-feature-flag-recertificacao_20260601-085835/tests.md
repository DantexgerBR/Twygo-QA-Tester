# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Comportamento da Feature Flag :recertificacao

_4 caso(s) — 0 aprovado(s), 0 falha(s), 4 ignorado(s)_

### ⊘ Ignorado · TC1 · Habilitar flag exibe switch "Habilitar reinscrição" em conteúdos · 🔴 Crítico

<a id="tc1-habilitar-flag-exibe-switch-habilitar-reinscricao-em-conteudos"></a>_Arquivo:_ `tc1-habilitar-flag-exibe-switch.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito.

**Sumário (objetivo do caso):** Validar gating UI: habilitar a flag para a organização exibe o switch "Habilitar reinscrição" nas telas de edição de conteúdo (RN 1, 1.1).

**Pré-condições:**

```
Acesso à página de Flipper Admin "/admin/manage/features/recertificacao"
Curso com `has_recertification = true` (estado preparado quando flag estava ON)
Usuário Admin com permissão para gerenciar features
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar Flipper Admin em "/admin/manage/features/recertificacao" | Página da feature `recertificacao` é exibida. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |
| 2 | Adicionar a organização atual ao actor da flag via "Add" → tipo "Organization" → "Organization;{orgId}" | Actor "Organization;{orgId}" aparece na lista de actors com flag ON. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |
| 3 | Acessar a edição de um curso em "/e/{eventId}/edit" (em nova aba ou janela limpa) | Switch "Habilitar reinscrição" está visível no formulário (validado em detalhe na suíte 1). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Acesso à página de Flipper Admin "/admin/manage/features/recertificacao"
1. Pré: Curso com `has_recertification = true` (estado preparado quando flag estava ON)
1. Pré: Usuário Admin com permissão para gerenciar features
1. 1. Acessar Flipper Admin em "/admin/manage/features/recertificacao"
1. 2. Adicionar a organização atual ao actor da flag via "Add" → tipo "Organization" → "Organization;{orgId}"
1. 3. Acessar a edição de um curso em "/e/{eventId}/edit" (em nova aba ou janela limpa)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 · Desabilitar flag oculta switch e desativa fluxos (cenário de rollback) · 🔴 Crítico

<a id="tc2-desabilitar-flag-oculta-switch-e-desativa-fluxos-cenario-de-rollback"></a>_Arquivo:_ `tc2-desabilitar-flag-oculta-switch-rollback.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito.

**Sumário (objetivo do caso):** Validar gating UI e funcional: remover a organização do actor da flag deve esconder o switch, esconder ações de reinscrição na lista de aprendizagem, esconder filtro "Substituído", e fazer backends rejeitarem reinscrição via API (RN 1, 10).

**Pré-condições:**

```
Acesso à página de Flipper Admin "/admin/manage/features/recertificacao"
Curso com `has_recertification = true` (estado preparado quando flag estava ON)
Usuário Admin com permissão para gerenciar features
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Pré-condição: organização com flag ON, curso com `has_recertification = true` e ao menos 1 aluno reinscrito (`recertification_number > 0`). | Estado preparado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |
| 2 | Acessar Flipper Admin e remover a organização do actor da flag (Remove actor "Organization;{orgId}") | Actor removido da lista. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |
| 3 | Acessar a edição do mesmo curso em "/e/{eventId}/edit" | Switch "Habilitar reinscrição" NÃO está visível no formulário. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |
| 4 | Acessar a lista de aprendizagem em "/learning_students?event_id={eventId}" | Lista é exibida mas SEM os elementos de reinscrição: filtro "Substituído" some, item "Reinscrever" some do menu, ação "Reinscrição em massa" some do drawer. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |
| 5 | Disparar `POST /api/v1/contents/{eventId}/event_participants` com `recertification: true` autenticado | Response retorna HTTP 422 com `reenroll_participant.errors.feature_disabled`. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Acesso à página de Flipper Admin "/admin/manage/features/recertificacao"
1. Pré: Curso com `has_recertification = true` (estado preparado quando flag estava ON)
1. Pré: Usuário Admin com permissão para gerenciar features
1. 1. Pré-condição: organização com flag ON, curso com `has_recertification = true` e ao menos 1 aluno reinscrito (`recertification_number > 0`).
1. 2. Acessar Flipper Admin e remover a organização do actor da flag (Remove actor "Organization;{orgId}")
1. 3. Acessar a edição do mesmo curso em "/e/{eventId}/edit"
1. 4. Acessar a lista de aprendizagem em "/learning_students?event_id={eventId}"
1. 5. Disparar `POST /api/v1/contents/{eventId}/event_participants` com `recertification: true` autenticado

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 · Re-habilitar flag restaura todos os fluxos (sem perda de dados) · 🔴 Crítico

<a id="tc3-re-habilitar-flag-restaura-todos-os-fluxos-sem-perda-de-dados"></a>_Arquivo:_ `tc3-rehabilitar-flag-restaura-fluxos.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito.

**Sumário (objetivo do caso):** Validar idempotência de toggle: re-habilitar a flag restaura os fluxos UI e backend, com participants reinscritos pré-existentes intactos.

**Pré-condições:**

```
Acesso à página de Flipper Admin "/admin/manage/features/recertificacao"
Curso com `has_recertification = true` (estado preparado quando flag estava ON)
Usuário Admin com permissão para gerenciar features
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Pré-condição: organização com flag OFF após o TC2, mantendo 1 participant com `recertification_number > 0` no banco. | Estado preparado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |
| 2 | Acessar Flipper Admin e adicionar a organização novamente como actor da flag | Actor "Organization;{orgId}" volta a aparecer com ON. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |
| 3 | Acessar a lista de aprendizagem | Filtro "Substituído", item "Reinscrever" e ação "Reinscrição em massa" voltam a aparecer. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |
| 4 | Inspecionar o participant reinscrito pré-existente | Aluno aparece com `recertification_number > 0` intacto (dado preservado durante OFF). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Acesso à página de Flipper Admin "/admin/manage/features/recertificacao"
1. Pré: Curso com `has_recertification = true` (estado preparado quando flag estava ON)
1. Pré: Usuário Admin com permissão para gerenciar features
1. 1. Pré-condição: organização com flag OFF após o TC2, mantendo 1 participant com `recertification_number > 0` no banco.
1. 2. Acessar Flipper Admin e adicionar a organização novamente como actor da flag
1. 3. Acessar a lista de aprendizagem
1. 4. Inspecionar o participant reinscrito pré-existente

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC4 · Flag OFF: comportamento legado completo de inscrição/listagem mantido (regressão geral) · 🔴 Crítico

<a id="tc4-flag-off-comportamento-legado-completo-de-inscricao-listagem-mantido-regressao-geral"></a>_Arquivo:_ `tc4-flag-off-comportamento-legado-regressao.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito.

**Sumário (objetivo do caso):** Smoke regressivo geral: com flag OFF, todos os fluxos legados funcionam (inscrição original, listagem, edição, certificado VALID, expiração).

**Pré-condições:**

```
Acesso à página de Flipper Admin "/admin/manage/features/recertificacao"
Curso com `has_recertification = true` (estado preparado quando flag estava ON)
Usuário Admin com permissão para gerenciar features
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Garantir que a flag `:recertificacao` está OFF para a organização | Flag desativada. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |
| 2 | Criar curso novo, vincular aluno via inscrição original (sem `recertification`) | Aluno aparece com `recertification_number = 0` na lista de aprendizagem. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |
| 3 | Editar o curso e salvar sem alterações | Curso salvo. `events.has_recertification` permanece `false` (default). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |
| 4 | Acessar a lista de aprendizagem em "/learning_students?event_id={eventId}" | Aluno listado normalmente. Sem badge "Substituído", sem filtro adicional, sem item "Reinscrever". | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Acesso à página de Flipper Admin "/admin/manage/features/recertificacao"
1. Pré: Curso com `has_recertification = true` (estado preparado quando flag estava ON)
1. Pré: Usuário Admin com permissão para gerenciar features
1. 1. Garantir que a flag `:recertificacao` está OFF para a organização
1. 2. Criar curso novo, vincular aluno via inscrição original (sem `recertification`)
1. 3. Editar o curso e salvar sem alterações
1. 4. Acessar a lista de aprendizagem em "/learning_students?event_id={eventId}"

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
