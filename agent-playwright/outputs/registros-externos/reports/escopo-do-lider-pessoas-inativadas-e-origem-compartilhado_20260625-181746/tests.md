# Casos de teste — Registros de Aprendizagem

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Escopo do Líder, pessoas inativadas e origem Compartilhado

_10 caso(s) — 1 aprovado(s), 0 falha(s), 9 ignorado(s)_

### ⊘ Ignorado · TC1 · Validar matriz de escopo Líder vs Admin · 🔴 Crítico

<a id="validar-matriz-de-escopo-lider-vs-admin"></a>_Arquivo:_ `tc1-2-3-escopo-lider.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario.

**Sumário (objetivo do caso):** Garantir a tabela de permissões por ação: listagem, adicionar, visualizar/editar, aprovar/recusar, excluir e provedores (RN 93).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
Usuário Admin com acesso a toda a organização
Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Aprendizagem > Registros" como Admin | Lista exibe registros de todas as pessoas ativas da organização. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 2 | Acessar a mesma tela logado como Líder | Lista exibe apenas registros dos liderados diretos. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 3 | Clicar no botão "Adicionar" como Líder e abrir o dropdown "Pessoa" | Dropdown lista somente os liderados diretos. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 4 | Clicar na tab "Provedores" como Líder | Listagem de provedores completa é exibida (provedores são compartilhados, não filtram por liderado). | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Categoria:** ⚠️ Não declarada
- **Motivo declarado pelo spec:** _ausente_
- **Próximo passo:** Editar o spec para declarar `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario). Sem declaração, leitor leigo não sabe quem precisa agir.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
1. Pré: Usuário Admin com acesso a toda a organização
1. Pré: Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
1. Pré: Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
1. Pré: Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
1. 1. Acessar a tela "Aprendizagem > Registros" como Admin
1. 2. Acessar a mesma tela logado como Líder
1. 3. Clicar no botão "Adicionar" como Líder e abrir o dropdown "Pessoa"
1. 4. Clicar na tab "Provedores" como Líder

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 · Validar 403 e toast ao atuar fora do escopo do Líder · 🔴 Crítico

<a id="validar-403-e-toast-ao-atuar-fora-do-escopo-do-lider"></a>_Arquivo:_ `tc1-2-3-escopo-lider.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario.

**Sumário (objetivo do caso):** Garantir validação de escopo no submit: Líder atuando sobre registro de não-liderado recebe 403 com toast (RN 94).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
Usuário Admin com acesso a toda a organização
Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Enviar request de aprovação como Líder para um registro de pessoa fora da sua equipe (via API direta, simulando bypass do front) | Resposta HTTP 403. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 2 | Verificar o toast "Sem permissão pra atuar nesse registro" exibido pelo front ao receber 403 em uma ação de avaliação | Toast vermelho exibida: "Sem permissão pra atuar nesse registro"; registro permanece inalterado. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Categoria:** ⚠️ Não declarada
- **Motivo declarado pelo spec:** _ausente_
- **Próximo passo:** Editar o spec para declarar `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario). Sem declaração, leitor leigo não sabe quem precisa agir.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
1. Pré: Usuário Admin com acesso a toda a organização
1. Pré: Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
1. Pré: Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
1. Pré: Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
1. 1. Enviar request de aprovação como Líder para um registro de pessoa fora da sua equipe (via API direta, simulando bypass do front)
1. 2. Verificar o toast "Sem permissão pra atuar nesse registro" exibido pelo front ao receber 403 em uma ação de avaliação

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 · Validar preservação de ações antigas após mudança de hierarquia · 🔴 Crítico

<a id="validar-preservacao-de-acoes-antigas-apos-mudanca-de-hierarquia"></a>_Arquivo:_ `tc1-2-3-escopo-lider.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario.

**Sumário (objetivo do caso):** Garantir que registros já aprovados pelo Líder continuam válidos após ele perder o liderado (RN 95).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
Usuário Admin com acesso a toda a organização
Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Aprovar um registro de um liderado como Líder | Toast "Registro aprovado"; registro fica Emitido. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 2 | Remover o liderado da equipe do Líder via estrutura organizacional | Operação concluída. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 3 | Acessar a lista como Admin e localizar o registro aprovado | Registro permanece Emitido/Aprovado (a aprovação antiga não é revertida). | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 4 | Acessar a lista como Líder | Registro não aparece mais na lista do Líder (perdeu capacidade de novas ações sobre a pessoa). | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Categoria:** ⚠️ Não declarada
- **Motivo declarado pelo spec:** _ausente_
- **Próximo passo:** Editar o spec para declarar `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario). Sem declaração, leitor leigo não sabe quem precisa agir.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
1. Pré: Usuário Admin com acesso a toda a organização
1. Pré: Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
1. Pré: Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
1. Pré: Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
1. 1. Aprovar um registro de um liderado como Líder
1. 2. Remover o liderado da equipe do Líder via estrutura organizacional
1. 3. Acessar a lista como Admin e localizar o registro aprovado
1. 4. Acessar a lista como Líder

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC4 · Validar sumiço completo de pessoas inativadas · 🔴 Crítico

<a id="validar-sumico-completo-de-pessoas-inativadas"></a>_Arquivo:_ `tc4-inativar-pessoa.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario.

**Sumário (objetivo do caso):** Garantir que registros de pessoa inativada somem do KPI, da lista e da extração, sem toggle de exibição (RN 96).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
Usuário Admin com acesso a toda a organização
Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Aprendizagem > Registros" como Admin e anotar KPIs e a presença dos registros da pessoa-alvo (ex: 3 Emitidos + 1 Pendente) | Registros visíveis; KPIs contabilizam. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 2 | Inativar a pessoa na administração de usuários da organização | Pessoa inativada com sucesso. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 3 | Recarregar a tela "Aprendizagem > Registros" | KPIs decrementados (-3 Emitidos, -1 Pendentes); registros da pessoa não aparecem na lista; busca pelo nome retorna "Nenhum registro encontrado". | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 4 | Verificar a interface por um eventual filtro "mostrar inativos" | Nenhum toggle de exibição de inativos existe (regra silenciosa). | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 5 | Disparar extração de Dados CSV com escopo "Todos" e conferir o pacote (etapa manual) | Registros da pessoa inativada NÃO constam no arquivo extraído. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Categoria:** ⚠️ Não declarada
- **Motivo declarado pelo spec:** _ausente_
- **Próximo passo:** Editar o spec para declarar `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario). Sem declaração, leitor leigo não sabe quem precisa agir.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
1. Pré: Usuário Admin com acesso a toda a organização
1. Pré: Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
1. Pré: Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
1. Pré: Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
1. 1. Acessar a tela "Aprendizagem > Registros" como Admin e anotar KPIs e a presença dos registros da pessoa-alvo (ex: 3 Emitidos + 1 Pendente)
1. 2. Inativar a pessoa na administração de usuários da organização
1. 3. Recarregar a tela "Aprendizagem > Registros"
1. 4. Verificar a interface por um eventual filtro "mostrar inativos"
1. 5. Disparar extração de Dados CSV com escopo "Todos" e conferir o pacote (etapa manual)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ✅ Aprovado · TC5 · Validar coerência permanente entre KPI e lista · 🔴 Crítico

<a id="validar-coerencia-permanente-entre-kpi-e-lista"></a>_Arquivo:_ `tc5-coerencia-kpi-lista.spec.ts` · _Duração:_ 1.47s · _Browser:_ chromium

**Sumário (objetivo do caso):** Garantir que o mesmo critério de pessoa ativa + escopo + soft-delete vale para /stats e /list — número do card bate com as linhas (RN 96.5).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
Usuário Admin com acesso a toda a organização
Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ 1-2. total da lista (paginação) == total_general dos KPIs | — | ✅ | — | 0.21s |
| — | _Pré-condição:_ Soma dos status dos cards == total_general (sem divergência) | — | ✅ | — | 0.00s |
| 1 | Acessar a tela "Aprendizagem > Registros" como Admin e somar as contagens dos 4 KPI cards mais os status sem card (via filtros) | Total geral calculado. | ✅ | — | — |
| 2 | Comparar com o total de linhas da lista sem filtros (somando a paginação) | Número de linhas é exatamente igual ao total geral dos KPIs — nenhuma divergência. | ✅ | — | — |
| 3 | Repetir a comparação logado como Líder | Contagens do Líder também batem exatamente com as linhas visíveis do seu escopo. | ✅ | — | — |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-registros-externo-38c78-ermanente-entre-KPI-e-lista-chromium/`](artifacts/projects-registros-externo-38c78-ermanente-entre-KPI-e-lista-chromium/)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-registros-externo-38c78-ermanente-entre-KPI-e-lista-chromium/test-finished-1.png)

  ![](artifacts/projects-registros-externo-38c78-ermanente-entre-KPI-e-lista-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-registros-externo-38c78-ermanente-entre-KPI-e-lista-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-registros-externo-38c78-ermanente-entre-KPI-e-lista-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-registros-externo-38c78-ermanente-entre-KPI-e-lista-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/registros-externos/reports/escopo-do-lider-pessoas-inativadas-e-origem-compartilhado_20260625-181746/artifacts/projects-registros-externo-38c78-ermanente-entre-KPI-e-lista-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-registros-externo-38c78-ermanente-entre-KPI-e-lista-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-registros-externo-38c78-ermanente-entre-KPI-e-lista-chromium/video-1.webm)


---

### ⊘ Ignorado · TC6 · Validar apresentação e menu restrito de registros Compartilhados · 🔴 Crítico

<a id="validar-apresentacao-e-menu-restrito-de-registros-compartilhados"></a>_Arquivo:_ `tc6-7-10-compartilhado.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario.

**Sumário (objetivo do caso):** Garantir chip "Compartilhado", menu com apenas Visualizar + Histórico e ausência de Evidências (RN 97, 98).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
Usuário Admin com acesso a toda a organização
Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Aprendizagem > Registros" como Admin e localizar um registro Compartilhado | Linha exibe chip "Compartilhado" na coluna Origem. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 2 | Clicar no menu 3 pontos do registro Compartilhado | Menu exibe APENAS "Visualizar" e "Histórico"; itens "Editar", "Avaliar", "Excluir" e "Evidências" NÃO são renderizados. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 3 | Clicar no item "Visualizar" | Tela standalone do certificado abre em nova aba. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 4 | Clicar no item "Histórico" do registro Compartilhado | Drawer abre com a trilha contendo apenas o evento "criado". | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Categoria:** ⚠️ Não declarada
- **Motivo declarado pelo spec:** _ausente_
- **Próximo passo:** Editar o spec para declarar `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario). Sem declaração, leitor leigo não sabe quem precisa agir.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
1. Pré: Usuário Admin com acesso a toda a organização
1. Pré: Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
1. Pré: Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
1. Pré: Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
1. 1. Acessar a tela "Aprendizagem > Registros" como Admin e localizar um registro Compartilhado
1. 2. Clicar no menu 3 pontos do registro Compartilhado
1. 3. Clicar no item "Visualizar"
1. 4. Clicar no item "Histórico" do registro Compartilhado

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC7 · Validar bloqueio de modificação de Compartilhado via API (403) · 🔴 Crítico

<a id="validar-bloqueio-de-modificacao-de-compartilhado-via-api-403"></a>_Arquivo:_ `tc6-7-10-compartilhado.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario.

**Sumário (objetivo do caso):** Garantir que tentativas de edição/exclusão de registro Compartilhado via API direta retornam 403 (RN 98.1 — h17 cenário 06).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
Usuário Admin com acesso a toda a organização
Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Enviar request PATCH de edição para um registro Compartilhado como Admin da organização receptora | Resposta HTTP 403; registro permanece inalterado. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 2 | Enviar request DELETE para o mesmo registro | Resposta HTTP 403. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Categoria:** ⚠️ Não declarada
- **Motivo declarado pelo spec:** _ausente_
- **Próximo passo:** Editar o spec para declarar `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario). Sem declaração, leitor leigo não sabe quem precisa agir.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
1. Pré: Usuário Admin com acesso a toda a organização
1. Pré: Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
1. Pré: Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
1. Pré: Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
1. 1. Enviar request PATCH de edição para um registro Compartilhado como Admin da organização receptora
1. 2. Enviar request DELETE para o mesmo registro

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC10 · Validar permanência de Compartilhados após inativação da org parceira · 🟡 Normal

<a id="validar-permanencia-de-compartilhados-apos-inativacao-da-org-parceira"></a>_Arquivo:_ `tc6-7-10-compartilhado.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario.

**Sumário (objetivo do caso):** Garantir preservação do histórico do aluno quando a org de origem é inativada (h17 cenário 07 — política do Spike S11, confirmar com produto).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
Usuário Admin com acesso a toda a organização
Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Aprendizagem > Registros" como Admin da organização receptora com registros Compartilhados da parceira P | Registros Compartilhados visíveis. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 2 | Inativar a organização parceira P (operação administrativa) | Parceira inativada. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 3 | Recarregar a lista da organização receptora | Os registros Compartilhados PERMANECEM acessíveis (preservação de histórico do aluno). | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Normal
- **Categoria:** ⚠️ Não declarada
- **Motivo declarado pelo spec:** _ausente_
- **Próximo passo:** Editar o spec para declarar `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario). Sem declaração, leitor leigo não sabe quem precisa agir.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
1. Pré: Usuário Admin com acesso a toda a organização
1. Pré: Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
1. Pré: Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
1. Pré: Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
1. 1. Acessar a tela "Aprendizagem > Registros" como Admin da organização receptora com registros Compartilhados da parceira P
1. 2. Inativar a organização parceira P (operação administrativa)
1. 3. Recarregar a lista da organização receptora

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC8 · Validar isolamento multi-organização do Aluno · 🔴 Crítico

<a id="validar-isolamento-multi-organizacao-do-aluno"></a>_Arquivo:_ `tc8-9-multi-org.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario.

**Sumário (objetivo do caso):** Garantir que cada org tem seu próprio "Meu histórico" sem consolidação (RN 20.1 — h17 cenário 05).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
Usuário Admin com acesso a toda a organização
Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Meu histórico" como Aluno logado na organização X (com 10 registros) | Lista e KPIs exibem somente os 10 registros da organização X. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 2 | Trocar para a organização Y (onde o aluno tem 4 registros) | Lista e KPIs exibem somente os 4 registros da organização Y; nada da organização X aparece. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Categoria:** ⚠️ Não declarada
- **Motivo declarado pelo spec:** _ausente_
- **Próximo passo:** Editar o spec para declarar `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario). Sem declaração, leitor leigo não sabe quem precisa agir.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
1. Pré: Usuário Admin com acesso a toda a organização
1. Pré: Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
1. Pré: Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
1. Pré: Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
1. 1. Acessar a tela "Meu histórico" como Aluno logado na organização X (com 10 registros)
1. 2. Trocar para a organização Y (onde o aluno tem 4 registros)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC9 · Validar isolamento entre organizações no perfil Admin · 🔴 Crítico

<a id="validar-isolamento-entre-organizacoes-no-perfil-admin"></a>_Arquivo:_ `tc8-9-multi-org.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario.

**Sumário (objetivo do caso):** Garantir que Admin não atua em registros de outra org mesmo com vínculo duplo (h17 cenários 02/04).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
Usuário Admin com acesso a toda a organização
Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Consultar o endpoint de stats como Admin da organização Y | Resposta contém apenas contagens da organização Y. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 2 | Enviar request de aprovação como Admin da organização Y para registro da organização X | Resposta HTTP 403. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Categoria:** ⚠️ Não declarada
- **Motivo declarado pelo spec:** _ausente_
- **Próximo passo:** Editar o spec para declarar `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario). Sem declaração, leitor leigo não sabe quem precisa agir.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
1. Pré: Usuário Admin com acesso a toda a organização
1. Pré: Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
1. Pré: Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
1. Pré: Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
1. 1. Consultar o endpoint de stats como Admin da organização Y
1. 2. Enviar request de aprovação como Admin da organização Y para registro da organização X

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
