# Casos de teste — Modelos de conteúdo

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Ambientes adicionais - Modelos

_2 caso(s) — 0 aprovado(s), 0 falha(s), 2 ignorado(s)_

### ⊘ Ignorado · TC1 · Modelos criados no principal não aparecem no adicional · 🔴 Crítico

<a id="modelos-criados-no-principal-nao-aparecem-no-adicional"></a>_Arquivo:_ `tc01-isolamento-principal-para-adicional.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem).

**Sumário (objetivo do caso):** Validar isolamento de dados de modelos entre tenants pareados.

**Pré-condições:**

```
Ambiente Stage configurado com env adicional pareado
Feature flag `modelos_de_conteudo` ativa em ambas as orgs (principal e adicional)
Usuário logado como Admin
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Criar modelo "Modelo TC1 isolamento w{workerIndex}-{timestamp}" no ambiente principal | Toast exibida: "Modelo de conteúdo criado com sucesso.". Listagem do principal exibe o novo modelo. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 2 | Acessar a listagem de modelos no ambiente adicional pareado | Listagem do ambiente adicional NÃO exibe o modelo criado no principal. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo do skip / fixme:** Sem motivo registrado.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado com env adicional pareado
1. Pré: Feature flag `modelos_de_conteudo` ativa em ambas as orgs (principal e adicional)
1. Pré: Usuário logado como Admin
1. 1. Criar modelo "Modelo TC1 isolamento w{workerIndex}-{timestamp}" no ambiente principal
1. 2. Acessar a listagem de modelos no ambiente adicional pareado

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 · Modelos criados no adicional não aparecem no principal · 🔴 Crítico

<a id="modelos-criados-no-adicional-nao-aparecem-no-principal"></a>_Arquivo:_ `tc02-isolamento-adicional-para-principal.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem).

**Sumário (objetivo do caso):** Validar isolamento bidirecional.

**Pré-condições:**

```
Ambiente Stage configurado com env adicional pareado
Feature flag `modelos_de_conteudo` ativa em ambas as orgs (principal e adicional)
Usuário logado como Admin
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Criar modelo "Modelo TC2 isolamento w{workerIndex}-{timestamp}" no ambiente adicional | Toast exibida: "Modelo de conteúdo criado com sucesso.". Listagem do adicional exibe o novo modelo. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 2 | Acessar a listagem de modelos no ambiente principal | Listagem do ambiente principal NÃO exibe o modelo criado no adicional. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo do skip / fixme:** Sem motivo registrado.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado com env adicional pareado
1. Pré: Feature flag `modelos_de_conteudo` ativa em ambas as orgs (principal e adicional)
1. Pré: Usuário logado como Admin
1. 1. Criar modelo "Modelo TC2 isolamento w{workerIndex}-{timestamp}" no ambiente adicional
1. 2. Acessar a listagem de modelos no ambiente principal

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
