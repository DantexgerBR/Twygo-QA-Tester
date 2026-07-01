# Casos de teste — Registros de Aprendizagem

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## KPI cards como filtro de status (Aluno)

_10 caso(s) — 9 aprovado(s), 0 falha(s), 1 ignorado(s)_

### ✅ Aprovado · TC9 · Validar card com contagem 0 clicável levando ao empty state · 🔴 Crítico

<a id="validar-card-com-contagem-0-clicavel-levando-ao-empty-state"></a>_Arquivo:_ `validar-card-com-contagem-zero-clicavel-levando-ao-empty-state.spec.ts` · _Duração:_ 9.66s · _Browser:_ chromium

**Sumário (objetivo do caso):** Garantir que card zerado mantém visual (anel cinza, "0" bold) e continua clicável, levando ao empty state (RN 29, RN 35).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Aluno
Aluno possui registros com distribuição conhecida entre os status (ex. 5 Emitidos, 1 Expirado, 2 Pendentes, 0 Recusados)
Aluno possui ao menos 1 registro Substituído ou "Em andamento" para validar o denominador do donut
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Meu histórico" com aluno que tem 0 registros Recusados | Card "Recusados" exibe "0" em preto bold e donut como anel sólido cinza claro, com borda/sombra/opacidade idênticas aos demais cards. | ✅ | — | 6.07s |
| 2 | Clicar no card "Recusados" | Card ganha estado ativo (borda cinza); demais ficam dimmed; lista exibe "Nenhum registro encontrado". | ✅ | — | 0.44s |
| 3 | Clicar novamente no card "Recusados" | Filtro desativa; lista volta ao estado anterior. | ✅ | — | 0.57s |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC5 · Validar clique no card aplicando filtro de status · 🔴 Crítico

<a id="validar-clique-no-card-aplicando-filtro-de-status"></a>_Arquivo:_ `validar-clique-no-card-aplicando-filtro-de-status.spec.ts` · _Duração:_ 9.06s · _Browser:_ chromium

**Sumário (objetivo do caso):** Garantir que o card do Aluno é clicável, aplica filtro na lista e apenas um card fica ativo por vez (RN 26).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Aluno
Aluno possui registros com distribuição conhecida entre os status (ex. 5 Emitidos, 1 Expirado, 2 Pendentes, 0 Recusados)
Aluno possui ao menos 1 registro Substituído ou "Em andamento" para validar o denominador do donut
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Meu histórico" | Lista exibe todos os registros; nenhum card ativo. | ✅ | — | 5.72s |
| 2 | Clicar no card "Pendentes" | Lista filtra exibindo apenas registros com status Pendente; quantidade de linhas bate com o número do card. | ✅ | — | 0.33s |
| 3 | Clicar no card "Emitidos" | Filtro troca para Emitidos (apenas um card ativo por vez); card "Pendentes" perde o estado ativo. | ✅ | — | 0.34s |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC4 · Validar denominador do donut somando os 6 status · 🔴 Crítico

<a id="validar-denominador-do-donut-somando-os-6-status"></a>_Arquivo:_ `validar-denominador-do-donut-somando-os-6-status.spec.ts` · _Duração:_ 9.35s · _Browser:_ chromium

**Sumário (objetivo do caso):** Garantir que a proporção do donut usa como total a soma dos 6 status — incluindo Substituído e "Em andamento", que não têm card (RN 23).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Aluno
Aluno possui registros com distribuição conhecida entre os status (ex. 5 Emitidos, 1 Expirado, 2 Pendentes, 0 Recusados)
Aluno possui ao menos 1 registro Substituído ou "Em andamento" para validar o denominador do donut
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Meu histórico" com aluno que possui registros Substituído e/ou "Em andamento" além dos 4 status com card | Proporção da fatia colorida de cada donut corresponde a contagem do status dividida pela soma dos 6 status (não pela soma dos 4 cards). | ✅ | — | 6.31s |
| 2 | Verificar a soma dos números dos cards "Emitidos", "Expirados", "Pendentes" e "Recusados" | Soma dos 4 cards é menor que o total geral de registros do aluno (diferença = Substituído + "Em andamento"). | ✅ | — | 0.05s |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC3 · Validar escopo da contagem e label de carga horária do Aluno · 🔴 Crítico

<a id="validar-escopo-da-contagem-e-label-de-carga-horaria-do-aluno"></a>_Arquivo:_ `validar-escopo-da-contagem-e-carga-horaria-do-aluno.spec.ts` · _Duração:_ 8.83s · _Browser:_ chromium

**Sumário (objetivo do caso):** Garantir que contagem dos KPIs e carga horária cobrem apenas os registros do próprio aluno na organização ativa (RN 20, RN 19).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Aluno
Aluno possui registros com distribuição conhecida entre os status (ex. 5 Emitidos, 1 Expirado, 2 Pendentes, 0 Recusados)
Aluno possui ao menos 1 registro Substituído ou "Em andamento" para validar o denominador do donut
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Meu histórico" com aluno de distribuição conhecida (ex: 5 Emitidos, 1 Expirado, 2 Pendentes, 0 Recusados) | Cards exibem exatamente "5", "1", "2" e "0" respectivamente. | ✅ | — | 6.36s |
| 2 | Verificar o label "Carga horária total: {X} horas" | "Carga horária total: {X} horas" onde {X} é a soma das cargas dos registros do próprio aluno (não da organização). | ✅ | — | 0.01s |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC10 · Validar estado "tudo zero" para aluno novo · 🟡 Normal

<a id="validar-estado-tudo-zero-para-aluno-novo"></a>_Arquivo:_ `validar-estado-tudo-zero-para-aluno-novo.spec.ts` · _Duração:_ 8.38s · _Browser:_ chromium

**Sumário (objetivo do caso):** Garantir que aluno sem nenhum registro vê a faixa com os 4 cards zerados e anéis cinza completos — a faixa é permanente (RN 36).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Aluno
Aluno possui registros com distribuição conhecida entre os status (ex. 5 Emitidos, 1 Expirado, 2 Pendentes, 0 Recusados)
Aluno possui ao menos 1 registro Substituído ou "Em andamento" para validar o denominador do donut
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Meu histórico" com usuário Aluno recém-criado (0 registros) | Faixa de KPIs aparece normalmente com 4 cards exibindo "0" e anel cinza claro completo em cada donut. | ✅ | — | 5.89s |
| 2 | Verificar que não há empty state customizado no lugar da faixa de cards "Emitidos", "Expirados", "Pendentes" e "Recusados" | A faixa de cards é renderizada (não substituída por mensagem). | ✅ | — | 0.10s |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC7 · Validar estados visuais: ativo, dimmed e hover de preview · 🔴 Crítico

<a id="validar-estados-visuais-ativo-dimmed-e-hover-de-preview"></a>_Arquivo:_ `validar-estados-visuais-ativo-dimmed-e-hover-de-preview.spec.ts` · _Duração:_ 8.71s · _Browser:_ chromium

**Sumário (objetivo do caso):** Garantir os estados visuais do card ativo (borda + elevação) e dos não-ativos (grayscale + opacidade), incluindo restauração temporária no hover (RN 27).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Aluno
Aluno possui registros com distribuição conhecida entre os status (ex. 5 Emitidos, 1 Expirado, 2 Pendentes, 0 Recusados)
Aluno possui ao menos 1 registro Substituído ou "Em andamento" para validar o denominador do donut
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Meu histórico" | Todos os cards com peso visual normal. | ✅ | — | 5.87s |
| 2 | Clicar no card "Pendentes" | Card "Pendentes" ganha borda na cor do donut, leve elevação e sombra pronunciada; os outros 3 cards ficam dimmed (grayscale + opacidade reduzida). | ✅ | — | 0.56s |
| 3 | Passar o mouse sobre o card "Emitidos" (dimmed) | Card "Emitidos" restaura o visual normal temporariamente durante o hover. | ✅ | — | 0.11s |
| 4 | Retirar o mouse do card "Emitidos" | Card volta ao estado dimmed. | ✅ | — | 0.07s |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC1 · Validar estrutura e cores dos 4 KPI cards · 🔴 Crítico

<a id="validar-estrutura-e-cores-dos-4-kpi-cards"></a>_Arquivo:_ `validar-estrutura-e-cores-dos-4-kpi-cards.spec.ts` · _Duração:_ 9.66s · _Browser:_ chromium

**Sumário (objetivo do caso):** Garantir que cada card tem donut + número + label + tooltip, com as cores canônicas por status (RN 18).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Aluno
Aluno possui registros com distribuição conhecida entre os status (ex. 5 Emitidos, 1 Expirado, 2 Pendentes, 0 Recusados)
Aluno possui ao menos 1 registro Substituído ou "Em andamento" para validar o denominador do donut
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Meu histórico" | 4 KPI cards exibidos na ordem: "Emitidos", "Expirados", "Pendentes", "Recusados". | ✅ | — | 5.80s |
| 2 | Verificar os elementos do card "Emitidos" | Card exibe donut chart à esquerda, número da contagem em preto bold e label "Emitidos" à direita do número. | ✅ | — | 0.06s |
| 3 | Verificar a cor do donut dos cards "Emitidos", "Expirados", "Pendentes" e "Recusados" | "Emitidos" verde (#38A169), "Expirados" vermelho (#F56565), "Pendentes" laranja (#DD6B20), "Recusados" cinza (#718096). | ✅ | — | 1.68s |

**Evidências:**

_Sem evidências anexadas._


---

### ⊘ Ignorado · TC8 · Validar independência da contagem em relação ao drawer de filtros · 🔴 Crítico

<a id="validar-independencia-da-contagem-em-relacao-ao-drawer-de-filtros"></a>_Arquivo:_ `validar-independencia-da-contagem-do-drawer-de-filtros.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario.

**Sumário (objetivo do caso):** Garantir que o número do KPI nunca reage aos filtros do drawer, e que filtro do KPI + drawer convivem na lista como interseção (RN 28).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Aluno
Aluno possui registros com distribuição conhecida entre os status (ex. 5 Emitidos, 1 Expirado, 2 Pendentes, 0 Recusados)
Aluno possui ao menos 1 registro Substituído ou "Em andamento" para validar o denominador do donut
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Meu histórico" e anotar o número do card "Pendentes" | Card exibe a contagem total de Pendentes do aluno. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 2 | Clicar no card "Pendentes" | Lista filtra por Pendentes. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 3 | Clicar no botão "Filtro" e aplicar um filtro adicional de provedor pelo drawer (quando disponível) | Lista exibe apenas Pendentes que também atendem ao filtro do drawer (interseção). | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 4 | Verificar o número do card "Pendentes" | Número permanece o total de Pendentes do aluno, inalterado pelos filtros do drawer. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |

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
1. Pré: Usuário logado como Aluno
1. Pré: Aluno possui registros com distribuição conhecida entre os status (ex. 5 Emitidos, 1 Expirado, 2 Pendentes, 0 Recusados)
1. Pré: Aluno possui ao menos 1 registro Substituído ou "Em andamento" para validar o denominador do donut
1. 1. Acessar a tela "Meu histórico" e anotar o número do card "Pendentes"
1. 2. Clicar no card "Pendentes"
1. 3. Clicar no botão "Filtro" e aplicar um filtro adicional de provedor pelo drawer (quando disponível)
1. 4. Verificar o número do card "Pendentes"

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ✅ Aprovado · TC6 · Validar toggle de desseleção do card ativo · 🔴 Crítico

<a id="validar-toggle-de-desselecao-do-card-ativo"></a>_Arquivo:_ `validar-toggle-de-desselecao-do-card-ativo.spec.ts` · _Duração:_ 9.24s · _Browser:_ chromium

**Sumário (objetivo do caso):** Garantir que clicar novamente no card ativo deseleciona o filtro (RN 26.1).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Aluno
Aluno possui registros com distribuição conhecida entre os status (ex. 5 Emitidos, 1 Expirado, 2 Pendentes, 0 Recusados)
Aluno possui ao menos 1 registro Substituído ou "Em andamento" para validar o denominador do donut
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Meu histórico" | Lista sem filtro ativo. | ✅ | — | 5.93s |
| 2 | Clicar no card "Pendentes" | Lista filtra por Pendentes; card fica ativo. | ✅ | — | 0.20s |
| 3 | Clicar novamente no card "Pendentes" | Filtro é removido; lista volta a exibir todos os registros; todos os cards voltam ao peso visual normal. | ✅ | — | 0.86s |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC2 · Validar tooltips dos cards no tom do Aluno · 🔴 Crítico

<a id="validar-tooltips-dos-cards-no-tom-do-aluno"></a>_Arquivo:_ `validar-tooltips-dos-cards-no-tom-do-aluno.spec.ts` · _Duração:_ 9.85s · _Browser:_ chromium

**Sumário (objetivo do caso):** Garantir que os tooltips do Aluno usam tom de 2ª pessoa com os textos literais documentados (RN 18.3.1).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Aluno
Aluno possui registros com distribuição conhecida entre os status (ex. 5 Emitidos, 1 Expirado, 2 Pendentes, 0 Recusados)
Aluno possui ao menos 1 registro Substituído ou "Em andamento" para validar o denominador do donut
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Meu histórico" | 4 KPI cards exibidos. | ✅ | — | 5.88s |
| 2 | Passar o mouse sobre o card "Emitidos" e aguardar o tooltip | Tooltip exibida: "Certificados emitidos e dentro do prazo de validade." | ✅ | — | 0.30s |
| 3 | Passar o mouse sobre o card "Expirados" | Tooltip exibida: "Certificados cuja data de validade já passou. Pode ser hora de recertificar." | ✅ | — | 0.47s |
| 4 | Passar o mouse sobre o card "Pendentes" | Tooltip exibida: "Registros externos que você enviou aguardando avaliação do Admin." | ✅ | — | 0.43s |
| 5 | Passar o mouse sobre o card "Recusados" | Tooltip exibida: "Registros externos que foram recusados pelo Admin. Veja o motivo no detalhe." | ✅ | — | 0.40s |

**Evidências:**

_Sem evidências anexadas._


---
