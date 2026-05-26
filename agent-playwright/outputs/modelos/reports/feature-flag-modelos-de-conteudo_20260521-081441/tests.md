# Casos de teste — Modelos de conteúdo

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Feature flag modelos_de_conteudo

_3 caso(s) — 0 aprovado(s), 0 falha(s), 3 ignorado(s)_

### ⊘ Ignorado · TC1 · Acesso bloqueado com flag desabilitada · 🔴 Crítico

<a id="acesso-bloqueado-com-flag-desabilitada"></a>_Arquivo:_ `tc01-acesso-bloqueado-flag-off.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem).

**Sumário (objetivo do caso):** Validar que o submenu "Modelos de conteúdo" não aparece quando a flag está desabilitada (RN 1.2).

**Pré-condições:**

```
Ambiente Stage configurado
Usuário logado como Admin com flag elevada para Flipper-UI
Feature flag `modelos_de_conteudo` controlável via Super Admin
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Desabilitar a feature flag `modelos_de_conteudo` para a organização do teste via Flipper-UI | Flag fica como "Conditionally enabled" sem actor `Organization;{orgId}`. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 2 | Acessar a URL "/o/{orgId}/dashboard" | Dashboard padrão é exibido. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 3 | Clicar no menu lateral "Aprendizagem" | Submenu lateral é exibido SEM o item "Modelos de conteúdo". | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo do skip / fixme:** Sem motivo registrado.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado
1. Pré: Usuário logado como Admin com flag elevada para Flipper-UI
1. Pré: Feature flag `modelos_de_conteudo` controlável via Super Admin
1. 1. Desabilitar a feature flag `modelos_de_conteudo` para a organização do teste via Flipper-UI
1. 2. Acessar a URL "/o/{orgId}/dashboard"
1. 3. Clicar no menu lateral "Aprendizagem"

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 · Acesso liberado com flag habilitada · 🔴 Crítico

<a id="acesso-liberado-com-flag-habilitada"></a>_Arquivo:_ `tc02-acesso-liberado-flag-on.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem).

**Sumário (objetivo do caso):** Validar que a funcionalidade fica acessível quando a flag está habilitada (RN 1.2).

**Pré-condições:**

```
Ambiente Stage configurado
Usuário logado como Admin com flag elevada para Flipper-UI
Feature flag `modelos_de_conteudo` controlável via Super Admin
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Habilitar a feature flag `modelos_de_conteudo` para a organização do teste via Flipper-UI | Flag fica como "Conditionally enabled" com actor `Organization;{orgId}`. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 2 | Acessar a URL "/o/{orgId}/dashboard" | Dashboard padrão é exibido. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 3 | Clicar no menu lateral "Aprendizagem" | Submenu lateral é exibido COM o item "Modelos de conteúdo". | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 4 | Clicar no submenu "Modelos de conteúdo" | Sistema redireciona para a listagem de modelos de conteúdo. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo do skip / fixme:** Sem motivo registrado.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado
1. Pré: Usuário logado como Admin com flag elevada para Flipper-UI
1. Pré: Feature flag `modelos_de_conteudo` controlável via Super Admin
1. 1. Habilitar a feature flag `modelos_de_conteudo` para a organização do teste via Flipper-UI
1. 2. Acessar a URL "/o/{orgId}/dashboard"
1. 3. Clicar no menu lateral "Aprendizagem"
1. 4. Clicar no submenu "Modelos de conteúdo"

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 · Transição off → on durante a sessão · 🟡 Normal

<a id="transicao-off-on-durante-a-sessao"></a>_Arquivo:_ `tc03-transicao-off-on-sessao.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem).

**Sumário (objetivo do caso):** Validar que ativar a flag durante uma sessão libera a funcionalidade após refresh.

**Pré-condições:**

```
Ambiente Stage configurado
Usuário logado como Admin com flag elevada para Flipper-UI
Feature flag `modelos_de_conteudo` controlável via Super Admin
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Iniciar sessão com a flag desabilitada para a organização do teste | Submenu "Modelos de conteúdo" NÃO é exibido. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 2 | Habilitar a flag `modelos_de_conteudo` para a organização via Flipper-UI | Flag fica como "Conditionally enabled" com actor `Organization;{orgId}`. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 3 | Recarregar a página "/o/{orgId}/dashboard" | Dashboard é exibido novamente. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 4 | Clicar no menu lateral "Aprendizagem" | Submenu lateral agora exibe o item "Modelos de conteúdo". | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Normal
- **Motivo do skip / fixme:** Sem motivo registrado.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado
1. Pré: Usuário logado como Admin com flag elevada para Flipper-UI
1. Pré: Feature flag `modelos_de_conteudo` controlável via Super Admin
1. 1. Iniciar sessão com a flag desabilitada para a organização do teste
1. 2. Habilitar a flag `modelos_de_conteudo` para a organização via Flipper-UI
1. 3. Recarregar a página "/o/{orgId}/dashboard"
1. 4. Clicar no menu lateral "Aprendizagem"

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
