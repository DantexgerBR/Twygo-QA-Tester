# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Isolamento em Ambientes Adicionais

_2 caso(s) — 0 aprovado(s), 0 falha(s), 2 ignorado(s)_

### ⊘ Ignorado · TC1 · Reinscrição num env não afeta participants no env pareado · 🔴 Crítico

<a id="tc1-reinscricao-num-env-nao-afeta-participants-no-env-pareado"></a>_Arquivo:_ `tc1-reinscricao-num-env-nao-afeta-pareado.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): Passos 1 e 3 são DB-pura cross-tenant (SELECT COUNT em 2 bancos). Fora do escopo Playwright — aguarda agent-db. Env aditional já configurado.

**Sumário (objetivo do caso):** Validar isolamento multi-tenant: criar participant reinscrito no env principal NÃO cria ou altera registros no env secundário pareado.

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA no env principal (`staging-base-de-conhecimento`)
[object Object]
Cursos com `has_recertification = true` em ambos os envs
Aluno cadastrado em ambos os envs com mesmo e-mail (para validar isolamento)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Capturar contagem atual de participants em ambos os envs para o mesmo aluno (`SELECT COUNT(*) FROM event_participants WHERE user_id = X`). | Contagem inicial registrada por env. | ⊘ | Step não executado — Marcado para revisão (test.fixme): Passos 1 e 3 são DB-pura cross-tenant (SELECT COUNT em 2 bancos). Fora do escopo Playwright — aguarda agent-db. Env aditional já configurado. | — |
| 2 | Reinscrever o aluno no env principal pelo fluxo da suíte 2 TC3 | Novo participant criado APENAS no env principal. | ⊘ | Step não executado — Marcado para revisão (test.fixme): Passos 1 e 3 são DB-pura cross-tenant (SELECT COUNT em 2 bancos). Fora do escopo Playwright — aguarda agent-db. Env aditional já configurado. | — |
| 3 | Re-capturar a contagem em ambos os envs | Env principal: contagem aumentou em 1. Env secundário: contagem inalterada. | ⊘ | Step não executado — Marcado para revisão (test.fixme): Passos 1 e 3 são DB-pura cross-tenant (SELECT COUNT em 2 bancos). Fora do escopo Playwright — aguarda agent-db. Env aditional já configurado. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** Passos 1 e 3 são DB-pura cross-tenant (SELECT COUNT em 2 bancos). Fora do escopo Playwright — aguarda agent-db. Env aditional já configurado.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA no env principal (`staging-base-de-conhecimento`)
1. Pré: [object Object]
1. Pré: Cursos com `has_recertification = true` em ambos os envs
1. Pré: Aluno cadastrado em ambos os envs com mesmo e-mail (para validar isolamento)
1. 1. Capturar contagem atual de participants em ambos os envs para o mesmo aluno (`SELECT COUNT(*) FROM event_participants WHERE user_id = X`).
1. 2. Reinscrever o aluno no env principal pelo fluxo da suíte 2 TC3
1. 3. Re-capturar a contagem em ambos os envs

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 · Toggle da flag :recertificacao no env principal NÃO afeta env secundário · 🟡 Normal

<a id="tc2-toggle-da-flag-recertificacao-no-env-principal-nao-afeta-env-secundario"></a>_Arquivo:_ `tc2-toggle-flag-env-principal-nao-afeta-secundario.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): Exige toggle runtime da flag :recertificacao no Flipper Admin escopado por orgId + assertion cross-tenant (2 contextos com storage/baseURL distintos). Bloqueado por FlipperAdminPage não implementado + complexidade cross-tenant.

**Sumário (objetivo do caso):** Validar escopo por organização da flag Flipper: desativar a flag para a organização do env principal não desativa no env secundário (organização distinta).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA no env principal (`staging-base-de-conhecimento`)
[object Object]
Cursos com `has_recertification = true` em ambos os envs
Aluno cadastrado em ambos os envs com mesmo e-mail (para validar isolamento)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Pré-condição: flag ON em ambas as organizações (env principal e secundário). | Estado preparado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): Exige toggle runtime da flag :recertificacao no Flipper Admin escopado por orgId + assertion cross-tenant (2 contextos com storage/baseURL distintos). Bloqueado por FlipperAdminPage não implementado + complexidade cross-tenant. | — |
| 2 | Acessar Flipper Admin e remover APENAS a organização do env principal do actor da flag | Actor da org do env principal removido. | ⊘ | Step não executado — Marcado para revisão (test.fixme): Exige toggle runtime da flag :recertificacao no Flipper Admin escopado por orgId + assertion cross-tenant (2 contextos com storage/baseURL distintos). Bloqueado por FlipperAdminPage não implementado + complexidade cross-tenant. | — |
| 3 | Acessar a edição de curso no env principal | Switch "Habilitar reinscrição" NÃO está visível. | ⊘ | Step não executado — Marcado para revisão (test.fixme): Exige toggle runtime da flag :recertificacao no Flipper Admin escopado por orgId + assertion cross-tenant (2 contextos com storage/baseURL distintos). Bloqueado por FlipperAdminPage não implementado + complexidade cross-tenant. | — |
| 4 | Acessar a edição de curso no env secundário | Switch "Habilitar reinscrição" CONTINUA visível (flag ainda ON para a organização do env secundário). --- | ⊘ | Step não executado — Marcado para revisão (test.fixme): Exige toggle runtime da flag :recertificacao no Flipper Admin escopado por orgId + assertion cross-tenant (2 contextos com storage/baseURL distintos). Bloqueado por FlipperAdminPage não implementado + complexidade cross-tenant. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Normal
- **Motivo declarado pelo spec:** Exige toggle runtime da flag :recertificacao no Flipper Admin escopado por orgId + assertion cross-tenant (2 contextos com storage/baseURL distintos). Bloqueado por FlipperAdminPage não implementado + complexidade cross-tenant.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA no env principal (`staging-base-de-conhecimento`)
1. Pré: [object Object]
1. Pré: Cursos com `has_recertification = true` em ambos os envs
1. Pré: Aluno cadastrado em ambos os envs com mesmo e-mail (para validar isolamento)
1. 1. Pré-condição: flag ON em ambas as organizações (env principal e secundário).
1. 2. Acessar Flipper Admin e remover APENAS a organização do env principal do actor da flag
1. 3. Acessar a edição de curso no env principal
1. 4. Acessar a edição de curso no env secundário

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
