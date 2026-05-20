# Casos de teste — Modelos de conteúdo

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Sincronização e Regeração de Previews

_3 caso(s) — 0 aprovado(s), 0 falha(s), 3 ignorado(s)_

### ⊘ Ignorado · TC1 · Alterar Kit de Marca exibe ícone de alerta no card · 🔴 Crítico

<a id="alterar-kit-de-marca-exibe-icone-de-alerta-no-card"></a>_Arquivo:_ `tc01-alterar-kit-exibe-alerta.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem).

**Sumário (objetivo do caso):** Validar exibição do ícone de alerta na listagem após alteração do kit de marca (RN 59, RN 59.1).

**Pré-condições:**

```
Ambiente Stage configurado
Feature flag `modelos_de_conteudo` ativa
Modelo de teste cadastrado com pelo menos 1 design e Kit de Marca selecionado
Pelo menos 2 kits de marca distintos cadastrados na organização
Usuário logado como Admin
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a aba "Identificação" do modelo de teste | Aba "Identificação" é exibida com o kit de marca atual selecionado. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 2 | Selecionar um Kit de Marca diferente no dropdown "Kit de marca" | Dropdown exibe a nova opção selecionada. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 3 | Clicar no botão "Salvar" | Toast de sucesso é exibida (REVISAR-FIGMA: texto exato). | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 4 | Acessar a listagem de modelos | Card do modelo exibe ícone de alerta no canto superior direito. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 5 | Aguardar a tooltip do ícone de alerta ser exibida ao posicionar o mouse | Tooltip exibida: "Este modelo possui designs pendentes de regeração. Acesse a aba design e clique no botão 'Regerar designs'.". | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo do skip / fixme:** Sem motivo registrado.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado
1. Pré: Feature flag `modelos_de_conteudo` ativa
1. Pré: Modelo de teste cadastrado com pelo menos 1 design e Kit de Marca selecionado
1. Pré: Pelo menos 2 kits de marca distintos cadastrados na organização
1. Pré: Usuário logado como Admin
1. 1. Acessar a aba "Identificação" do modelo de teste
1. 2. Selecionar um Kit de Marca diferente no dropdown "Kit de marca"
1. 3. Clicar no botão "Salvar"
1. 4. Acessar a listagem de modelos
1. 5. Aguardar a tooltip do ícone de alerta ser exibida ao posicionar o mouse

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 · Botão "Regerar todos" exibe tooltip correto · 🔴 Crítico

<a id="botao-regerar-todos-exibe-tooltip-correto"></a>_Arquivo:_ `tc02-botao-regerar-todos-tooltip.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem).

**Sumário (objetivo do caso):** Validar exibição do botão "Regerar todos" na aba Design com tooltip literal (RN 59.2, RN 59.3).

**Pré-condições:**

```
Ambiente Stage configurado
Feature flag `modelos_de_conteudo` ativa
Modelo de teste cadastrado com pelo menos 1 design e Kit de Marca selecionado
Pelo menos 2 kits de marca distintos cadastrados na organização
Usuário logado como Admin
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a aba "Design" do modelo após alteração de kit de marca | Aba "Design" exibe a listagem de designs e o botão "Regerar todos". | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 2 | Aguardar a tooltip do botão "Regerar todos" ser exibida ao posicionar o mouse | Tooltip exibida: "O kit de marca foi alterado. Clique em 'Regerar todos' para atualizar todos os designs com as novas configurações de cores e fontes.". | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo do skip / fixme:** Sem motivo registrado.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado
1. Pré: Feature flag `modelos_de_conteudo` ativa
1. Pré: Modelo de teste cadastrado com pelo menos 1 design e Kit de Marca selecionado
1. Pré: Pelo menos 2 kits de marca distintos cadastrados na organização
1. Pré: Usuário logado como Admin
1. 1. Acessar a aba "Design" do modelo após alteração de kit de marca
1. 2. Aguardar a tooltip do botão "Regerar todos" ser exibida ao posicionar o mouse

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 · Clicar "Regerar todos" inicia processo assíncrono · 🔴 Crítico

<a id="clicar-regerar-todos-inicia-processo-assincrono"></a>_Arquivo:_ `tc03-clicar-regerar-todos-toast.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem).

**Sumário (objetivo do caso):** Validar inicio do processo de regeração com toast (RN 59.4).

**Pré-condições:**

```
Ambiente Stage configurado
Feature flag `modelos_de_conteudo` ativa
Modelo de teste cadastrado com pelo menos 1 design e Kit de Marca selecionado
Pelo menos 2 kits de marca distintos cadastrados na organização
Usuário logado como Admin
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a aba "Design" do modelo após alteração de kit de marca | Botão "Regerar todos" é exibido. | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |
| 2 | Clicar no botão "Regerar todos" | Toast exibida: "A regeração dos designs foi iniciada. Você será notificado quando for concluída.". | ⊘ | Step não executado — Caso ignorado pelo Playwright sem justificativa registrada (test.skip/fixme sem mensagem). | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo do skip / fixme:** Sem motivo registrado.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado
1. Pré: Feature flag `modelos_de_conteudo` ativa
1. Pré: Modelo de teste cadastrado com pelo menos 1 design e Kit de Marca selecionado
1. Pré: Pelo menos 2 kits de marca distintos cadastrados na organização
1. Pré: Usuário logado como Admin
1. 1. Acessar a aba "Design" do modelo após alteração de kit de marca
1. 2. Clicar no botão "Regerar todos"

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
