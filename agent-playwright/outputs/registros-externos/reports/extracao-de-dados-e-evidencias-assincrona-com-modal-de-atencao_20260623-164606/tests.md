# Casos de teste — Registros de Aprendizagem

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Extração de dados e evidências (assíncrona com modal de atenção)

_9 caso(s) — 3 aprovado(s) na automação + 2 validado(s) manualmente (TC7, TC8), 3 falha(s) reais de produto (TC4, TC5, TC6), 1 falha de produto (TC9)_

> **Atualização manual (2026-06-26):** TC7 e TC8 foram validados manualmente pelo QA e **passaram** — ver seções marcadas "✅ Validado manualmente". Status efetivo da suíte: **5 OK (3 auto + 2 manual) · 4 falhas de produto reais (TC4/TC5/TC6/TC9)**.

### ✅ Aprovado · TC1 · Validar disponibilidade do botão "Extrair dados" · 🔴 Crítico

<a id="validar-disponibilidade-do-botao-extrair-dados"></a>_Arquivo:_ `tc1-disponibilidade-botao-extrair-dados.spec.ts` · _Duração:_ 16.98s · _Browser:_ chromium

**Sumário (objetivo do caso):** Garantir exclusividade do botão para Admin/Líder (RN 76.1).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Admin com acesso à caixa de e-mail de teste
Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
Worker/job de extração ativo no ambiente
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Meu histórico" como Aluno | Botão "Extrair dados" NÃO é exibido na toolbar. | ✅ | — | 6.18s |
| 2 | Acessar a tela "Aprendizagem > Registros" como Admin | Botão "Extrair dados" é exibido (outline roxo com ícone de upload). | ✅ | — | 6.37s |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC2 · Validar estrutura do drawer no branch "Dados" · 🔴 Crítico

<a id="validar-estrutura-do-drawer-no-branch-dados"></a>_Arquivo:_ `tc2-estrutura-drawer-branch-dados.spec.ts` · _Duração:_ 10.39s · _Browser:_ chromium

**Sumário (objetivo do caso):** Garantir os 3 grupos de radio do branch Dados (RN 77).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Admin com acesso à caixa de e-mail de teste
Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
Worker/job de extração ativo no ambiente
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a tela "Aprendizagem > Registros" como Admin e clicar no botão "Extrair dados" | Drawer "Configurações da extração" abre com select "Tipo de extração" = "Dados" (default). | ✅ | — | 7.33s |
| 2 | Verificar os grupos de radio "Formato", "Dados (linhas)" e "Colunas" do branch Dados | "Formato": "CSV (tabela)" / "PDF (tabela e gráficos)"; "Dados (linhas)": "Filtro atual" / "Todos"; "Colunas": "Filtro atual" / "Todos". | ✅ | — | 0.26s |
| 3 | Verificar o footer com os botões "Cancelar" e "Extrair" | Botões "Cancelar" (outline) e "Extrair" (sólido roxo). | ✅ | — | 0.16s |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC3 · Validar estrutura do drawer no branch "Evidências" · 🔴 Crítico

<a id="validar-estrutura-do-drawer-no-branch-evidencias"></a>_Arquivo:_ `tc3-estrutura-drawer-branch-evidencias.spec.ts` · _Duração:_ 10.84s · _Browser:_ chromium

**Sumário (objetivo do caso):** Garantir que o branch Evidências troca os grupos para apenas o escopo (RN 77).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Admin com acesso à caixa de e-mail de teste
Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
Worker/job de extração ativo no ambiente
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Abrir o drawer "Configurações da extração" como Admin | Drawer aberto no branch Dados. | ✅ | — | 7.81s |
| 2 | Selecionar "Evidências" no select "Tipo de extração" | Grupos de Formato/Linhas/Colunas são substituídos por um único grupo "Escopo" com radios "Filtro atual" / "Todos". | ✅ | — | 0.54s |

**Evidências:**

_Sem evidências anexadas._


---

### ❌ Falhou · TC4 · Validar extração de dados CSV com toast de variação · 🔴 Crítico

<a id="validar-extracao-de-dados-csv-com-toast-de-variacao"></a>_Arquivo:_ `tc4-extracao-dados-csv-toast.spec.ts` · _Duração:_ 21.29s · _Browser:_ chromium

> **❌ Por que falhou:** Um elemento que deveria estar oculto continuou visível.
> _Step impactado:_ **2. 3. Manter Dados+CSV+Filtro atual e clicar "Extrair" → drawer fecha + toast**

**Sumário (objetivo do caso):** Garantir o disparo da extração de dados com toast informando formato, contagem e escopo (RN 80).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Admin com acesso à caixa de e-mail de teste
Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
Worker/job de extração ativo no ambiente
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ 1-2. Abrir o drawer na tela Admin Registros | — | ✅ | — | 7.90s |
| 1 | Acessar a tela "Aprendizagem > Registros" como Admin com filtro atual contendo 50 registros | Lista filtrada com 50 registros. | ✅ | — | — |
| 2 | Clicar no botão "Extrair dados" | Drawer abre. | ✅ | — | — |
| 3 | Manter "Dados" + "CSV (tabela)" + Linhas "Filtro atual" + Colunas "Filtro atual" e clicar no botão "Extrair" | Drawer fecha. Toast exibida: "Extração iniciada: CSV com 50 registros (filtro atual · colunas do filtro)." | ❌ | Um elemento que deveria estar oculto continuou visível. | 10.53s |
| 4 | Aguardar a mensagem "Sua extração está sendo processada. Você receberá uma notificação quando estiver pronta." ser exibida | Flash message exibida: "Sua extração está sendo processada. Você receberá uma notificação quando estiver pronta." | ⊘ | Step não executado: o teste foi interrompido antes. Causa: Um elemento que deveria estar oculto continuou visível.. | — |

**Evidências:**

_Sem evidências anexadas._

#### 🐛 Pronto para registro de bug

> ❓ **Análise automática:** Inconclusivo (precisa investigação manual) · Confiança 🔴 baixa
> _Por quê:_ Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace
> _Bug-report estruturado:_ [`bug-reports/extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao__validar-extracao-de-dados-csv-com-toast-de-variacao.md`](bug-reports/extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao__validar-extracao-de-dados-csv-com-toast-de-variacao.md)

**Próximas ações sugeridas:**
- Sem evidência suficiente para classificar — abrir `trace.zip` (`npx playwright show-trace`) para ver passo a passo da execução.
- Reabrir o agente com o trace em mãos para reclassificar manualmente em uma das 4 categorias.

**Descrição do BUG:** [Crítico] Validar extração de dados CSV com toast de variação — Um elemento que deveria estar oculto continuou visível.

**Passo a passo para reprodução:**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário logado como Admin com acesso à caixa de e-mail de teste
1. Pré: Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
1. Pré: Worker/job de extração ativo no ambiente
1. 1. Acessar a tela "Aprendizagem > Registros" como Admin com filtro atual contendo 50 registros
1. 2. Clicar no botão "Extrair dados"
1. 3. Manter "Dados" + "CSV (tabela)" + Linhas "Filtro atual" + Colunas "Filtro atual" e clicar no botão "Extrair"
1. 4. Aguardar a mensagem "Sua extração está sendo processada. Você receberá uma notificação quando estiver pronta." ser exibida

**Comportamento esperado:** Drawer abre.

**Comportamento atual:** Um elemento que deveria estar oculto continuou visível. (falha aconteceu no passo 2: "3. Manter Dados+CSV+Filtro atual e clicar "Extrair" → drawer fecha + toast", que deveria resultar em: Drawer abre.)

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://registrosf2.stage.twygoead.com/` |
| Login | Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_EMAIL` (consulte `.env`) |
| Senha | Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_PASSWORD` (consulte `.env`) |
| orgId | — |
| Outros | Browser: chromium |
| Outros | runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606 |
| Outros | Duração até a falha: 21.29s |
| Outros | Step impactado: 2. 3. Manter Dados+CSV+Filtro atual e clicar "Extrair" → drawer fecha + toast |

**Evidências:**

_Sem anexos coletados pelo Playwright._

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[Crítico] Validar extração de dados CSV com toast de variação — Um elemento que deveria estar oculto continuou visível.

Passo a passo para reprodução
  Pré: Ambiente Stage configurado e acessível
  Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  Pré: Usuário logado como Admin com acesso à caixa de e-mail de teste
  Pré: Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
  Pré: Worker/job de extração ativo no ambiente
  1. Acessar a tela "Aprendizagem > Registros" como Admin com filtro atual contendo 50 registros
  2. Clicar no botão "Extrair dados"
  3. Manter "Dados" + "CSV (tabela)" + Linhas "Filtro atual" + Colunas "Filtro atual" e clicar no botão "Extrair"
  4. Aguardar a mensagem "Sua extração está sendo processada. Você receberá uma notificação quando estiver pronta." ser exibida

Comportamento esperado
Drawer abre.

Comportamento atual
Um elemento que deveria estar oculto continuou visível. (falha aconteceu no passo 2: "3. Manter Dados+CSV+Filtro atual e clicar "Extrair" → drawer fecha + toast", que deveria resultar em: Drawer abre.)

Informações
- URL: https://registrosf2.stage.twygoead.com/
- Login: Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_EMAIL` (consulte `.env`)
- Senha: Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_PASSWORD` (consulte `.env`)
- ID do ambiente (orgId): —
- Outros:
  - Browser: chromium
  - runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606
  - Duração até a falha: 21.29s
  - Step impactado: 2. 3. Manter Dados+CSV+Filtro atual e clicar "Extrair" → drawer fecha + toast

Evidências
  (sem anexos)

Execução
- runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606
- environment.json: staging-registros-externos
- testsuite: Extração de dados e evidências (assíncrona com modal de atenção)
- testcase: Validar extração de dados CSV com toast de variação

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
Error: expect(locator).toBeHidden() failed

Locator:  locator('.chakra-modal__content.chakra-slide')
Expected: hidden
Received: visible
Timeout:  10000ms

Call log:
  - Expect "toBeHidden" with timeout 10000ms
  - waiting for locator('.chakra-modal__content.chakra-slide')
    14 × locator resolved to <div role="dialog" tabindex="-1" aria-modal="true" id="chakra-modal-:r23:" data-test-id="records-extraction-drawer" aria-describedby="chakra-modal--body-:r23:" aria-labelledby="chakra-modal--header-:r23:" class="chakra-slide chakra-modal__content css-26fghr">…</div>
       - unexpected value "visible"

```

</details>

---

### ❌ Falhou · TC5 · Validar modal de Atenção para evidências faltantes · 🔴 Crítico

<a id="validar-modal-de-atencao-para-evidencias-faltantes"></a>_Arquivo:_ `tc5-modal-atencao-evidencias-faltantes.spec.ts` · _Duração:_ 23.68s · _Browser:_ chromium

> **❌ Por que falhou:** O elemento esperado não apareceu na tela (locator: locator('[role="alertdialog"], [role="dialog"]').filter({ hasText: /n[ãa]o t[êe]m evid[êe]ncia anexada|ser[ãa]o ignorados na extra/i })).
> _Step impactado:_ **1. 1-2. Disparar extração de Evidências (Filtro atual) → modal "Atenção"**

**Sumário (objetivo do caso):** Garantir o modal com ratio de registros sem evidência e os caminhos Cancelar/Continuar (RN 78).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Admin com acesso à caixa de e-mail de teste
Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
Worker/job de extração ativo no ambiente
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ 1-2. Disparar extração de Evidências (Filtro atual) → modal "Atenção" | — | ❌ | O elemento esperado não apareceu na tela (locator: locator('[role="alertdialog"], [role="dialog"]').filter({ hasText: /n[ãa]o t[êe]m evid[êe]ncia anexada\|ser[ãa]o ignorados na extra/i })). | 18.89s |
| 1 | Acessar a tela "Aprendizagem > Registros" como Admin com filtro contendo 32 registros, sendo 5 sem evidência | Lista filtrada. | ⊘ | Step não executado: o teste foi interrompido antes. Causa: O elemento esperado não apareceu na tela (locator: locator('[role="alertdialog"], [role="dialog"]').filter({ hasText: /n[ãa]o t[êe]m evid[êe]ncia anexada\|ser[ãa]o ignorados na extra/i })).. | — |
| 2 | Disparar a extração com Tipo "Evidências" + escopo "Filtro atual" pelo botão "Extrair" | Modal "Atenção" abre com o texto "5 de 32 registros no escopo não têm evidência anexada. Eles serão ignorados na extração." | ⊘ | Step não executado: o teste foi interrompido antes. Causa: O elemento esperado não apareceu na tela (locator: locator('[role="alertdialog"], [role="dialog"]').filter({ hasText: /n[ãa]o t[êe]m evid[êe]ncia anexada\|ser[ãa]o ignorados na extra/i })).. | — |
| 3 | Clicar no botão "Cancelar" do modal | Modal fecha e o drawer de configurações permanece aberto. | ⊘ | Step não executado: o teste foi interrompido antes. Causa: O elemento esperado não apareceu na tela (locator: locator('[role="alertdialog"], [role="dialog"]').filter({ hasText: /n[ãa]o t[êe]m evid[êe]ncia anexada\|ser[ãa]o ignorados na extra/i })).. | — |
| 4 | Disparar novamente a extração pelo botão "Extrair" confirmando no botão "Continuar" do modal | Toast exibida: "Extração iniciada: baixando evidências de 27 registros (5 sem evidência ignorados)." | ⊘ | Step não executado: o teste foi interrompido antes. Causa: O elemento esperado não apareceu na tela (locator: locator('[role="alertdialog"], [role="dialog"]').filter({ hasText: /n[ãa]o t[êe]m evid[êe]ncia anexada\|ser[ãa]o ignorados na extra/i })).. | — |

**Evidências:**

_Sem evidências anexadas._

#### 🐛 Pronto para registro de bug

> ❓ **Análise automática:** Inconclusivo (precisa investigação manual) · Confiança 🔴 baixa
> _Por quê:_ Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace
> _Bug-report estruturado:_ [`bug-reports/extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao__validar-modal-de-atencao-para-evidencias-faltantes.md`](bug-reports/extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao__validar-modal-de-atencao-para-evidencias-faltantes.md)

**Próximas ações sugeridas:**
- Sem evidência suficiente para classificar — abrir `trace.zip` (`npx playwright show-trace`) para ver passo a passo da execução.
- Reabrir o agente com o trace em mãos para reclassificar manualmente em uma das 4 categorias.

**Descrição do BUG:** [Crítico] Validar modal de Atenção para evidências faltantes — O elemento esperado não apareceu na tela (locator: locator('[role="alertdialog"], [role="dialog"]').filter({ hasText: /n[ãa]o t[êe]m evid[êe]ncia anexada|ser[ãa]o ignorados na extra/i })).

**Passo a passo para reprodução:**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário logado como Admin com acesso à caixa de e-mail de teste
1. Pré: Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
1. Pré: Worker/job de extração ativo no ambiente
1. 1. Acessar a tela "Aprendizagem > Registros" como Admin com filtro contendo 32 registros, sendo 5 sem evidência
1. 2. Disparar a extração com Tipo "Evidências" + escopo "Filtro atual" pelo botão "Extrair"
1. 3. Clicar no botão "Cancelar" do modal
1. 4. Disparar novamente a extração pelo botão "Extrair" confirmando no botão "Continuar" do modal

**Comportamento esperado:** Lista filtrada.

**Comportamento atual:** O elemento esperado não apareceu na tela (locator: locator('[role="alertdialog"], [role="dialog"]').filter({ hasText: /n[ãa]o t[êe]m evid[êe]ncia anexada|ser[ãa]o ignorados na extra/i })). (falha aconteceu no passo 1: "1-2. Disparar extração de Evidências (Filtro atual) → modal "Atenção"", que deveria resultar em: Lista filtrada.)

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://registrosf2.stage.twygoead.com/` |
| Login | Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_EMAIL` (consulte `.env`) |
| Senha | Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_PASSWORD` (consulte `.env`) |
| orgId | — |
| Outros | Browser: chromium |
| Outros | runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606 |
| Outros | Duração até a falha: 23.68s |
| Outros | Step impactado: 1. 1-2. Disparar extração de Evidências (Filtro atual) → modal "Atenção" |

**Evidências:**

_Sem anexos coletados pelo Playwright._

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[Crítico] Validar modal de Atenção para evidências faltantes — O elemento esperado não apareceu na tela (locator: locator('[role="alertdialog"], [role="dialog"]').filter({ hasText: /n[ãa]o t[êe]m evid[êe]ncia anexada|ser[ãa]o ignorados na extra/i })).

Passo a passo para reprodução
  Pré: Ambiente Stage configurado e acessível
  Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  Pré: Usuário logado como Admin com acesso à caixa de e-mail de teste
  Pré: Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
  Pré: Worker/job de extração ativo no ambiente
  1. Acessar a tela "Aprendizagem > Registros" como Admin com filtro contendo 32 registros, sendo 5 sem evidência
  2. Disparar a extração com Tipo "Evidências" + escopo "Filtro atual" pelo botão "Extrair"
  3. Clicar no botão "Cancelar" do modal
  4. Disparar novamente a extração pelo botão "Extrair" confirmando no botão "Continuar" do modal

Comportamento esperado
Lista filtrada.

Comportamento atual
O elemento esperado não apareceu na tela (locator: locator('[role="alertdialog"], [role="dialog"]').filter({ hasText: /n[ãa]o t[êe]m evid[êe]ncia anexada|ser[ãa]o ignorados na extra/i })). (falha aconteceu no passo 1: "1-2. Disparar extração de Evidências (Filtro atual) → modal "Atenção"", que deveria resultar em: Lista filtrada.)

Informações
- URL: https://registrosf2.stage.twygoead.com/
- Login: Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_EMAIL` (consulte `.env`)
- Senha: Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_PASSWORD` (consulte `.env`)
- ID do ambiente (orgId): —
- Outros:
  - Browser: chromium
  - runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606
  - Duração até a falha: 23.68s
  - Step impactado: 1. 1-2. Disparar extração de Evidências (Filtro atual) → modal "Atenção"

Evidências
  (sem anexos)

Execução
- runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606
- environment.json: staging-registros-externos
- testsuite: Extração de dados e evidências (assíncrona com modal de atenção)
- testcase: Validar modal de Atenção para evidências faltantes

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[role="alertdialog"], [role="dialog"]').filter({ hasText: /n[ãa]o t[êe]m evid[êe]ncia anexada|ser[ãa]o ignorados na extra/i })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[role="alertdialog"], [role="dialog"]').filter({ hasText: /n[ãa]o t[êe]m evid[êe]ncia anexada|ser[ãa]o ignorados na extra/i })

```

</details>

---

### ❌ Falhou · TC6 · Validar extração de evidências sem faltantes (modal não aparece) · 🔴 Crítico

<a id="validar-extracao-de-evidencias-sem-faltantes-modal-nao-aparece"></a>_Arquivo:_ `tc6-extracao-evidencias-sem-faltantes.spec.ts` · _Duração:_ 27.03s · _Browser:_ chromium

> **❌ Por que falhou:** O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada/i }).first()).
> _Step impactado:_ **1. 1-2. Disparar Evidências (Filtro atual) → sem modal + toast direto**

**Sumário (objetivo do caso):** Garantir que com todos os registros do escopo tendo evidência o modal de Atenção não dispara (h14 cenário 03).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Admin com acesso à caixa de e-mail de teste
Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
Worker/job de extração ativo no ambiente
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ 1-2. Disparar Evidências (Filtro atual) → sem modal + toast direto | — | ❌ | O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada/i }).first()). | 23.03s |
| 1 | Acessar a tela "Aprendizagem > Registros" como Admin com filtro em que todos os registros têm evidência | Lista filtrada. | ⊘ | Step não executado: o teste foi interrompido antes. Causa: O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada/i }).first()).. | — |
| 2 | Disparar a extração com Tipo "Evidências" + escopo "Filtro atual" pelo botão "Extrair" | Nenhum modal de Atenção; toast de "Extração iniciada" exibida diretamente. | ⊘ | Step não executado: o teste foi interrompido antes. Causa: O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada/i }).first()).. | — |

**Evidências:**

_Sem evidências anexadas._

#### 🐛 Pronto para registro de bug

> ❓ **Análise automática:** Inconclusivo (precisa investigação manual) · Confiança 🔴 baixa
> _Por quê:_ Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace
> _Bug-report estruturado:_ [`bug-reports/extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao__validar-extracao-de-evidencias-sem-faltantes-modal-nao-aparece.md`](bug-reports/extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao__validar-extracao-de-evidencias-sem-faltantes-modal-nao-aparece.md)

**Próximas ações sugeridas:**
- Sem evidência suficiente para classificar — abrir `trace.zip` (`npx playwright show-trace`) para ver passo a passo da execução.
- Reabrir o agente com o trace em mãos para reclassificar manualmente em uma das 4 categorias.

**Descrição do BUG:** [Crítico] Validar extração de evidências sem faltantes (modal não aparece) — O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada/i }).first()).

**Passo a passo para reprodução:**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário logado como Admin com acesso à caixa de e-mail de teste
1. Pré: Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
1. Pré: Worker/job de extração ativo no ambiente
1. 1. Acessar a tela "Aprendizagem > Registros" como Admin com filtro em que todos os registros têm evidência
1. 2. Disparar a extração com Tipo "Evidências" + escopo "Filtro atual" pelo botão "Extrair"

**Comportamento esperado:** Lista filtrada.

**Comportamento atual:** O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada/i }).first()). (falha aconteceu no passo 1: "1-2. Disparar Evidências (Filtro atual) → sem modal + toast direto", que deveria resultar em: Lista filtrada.)

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://registrosf2.stage.twygoead.com/` |
| Login | Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_EMAIL` (consulte `.env`) |
| Senha | Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_PASSWORD` (consulte `.env`) |
| orgId | — |
| Outros | Browser: chromium |
| Outros | runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606 |
| Outros | Duração até a falha: 27.03s |
| Outros | Step impactado: 1. 1-2. Disparar Evidências (Filtro atual) → sem modal + toast direto |

**Evidências:**

_Sem anexos coletados pelo Playwright._

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[Crítico] Validar extração de evidências sem faltantes (modal não aparece) — O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada/i }).first()).

Passo a passo para reprodução
  Pré: Ambiente Stage configurado e acessível
  Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  Pré: Usuário logado como Admin com acesso à caixa de e-mail de teste
  Pré: Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
  Pré: Worker/job de extração ativo no ambiente
  1. Acessar a tela "Aprendizagem > Registros" como Admin com filtro em que todos os registros têm evidência
  2. Disparar a extração com Tipo "Evidências" + escopo "Filtro atual" pelo botão "Extrair"

Comportamento esperado
Lista filtrada.

Comportamento atual
O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada/i }).first()). (falha aconteceu no passo 1: "1-2. Disparar Evidências (Filtro atual) → sem modal + toast direto", que deveria resultar em: Lista filtrada.)

Informações
- URL: https://registrosf2.stage.twygoead.com/
- Login: Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_EMAIL` (consulte `.env`)
- Senha: Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_PASSWORD` (consulte `.env`)
- ID do ambiente (orgId): —
- Outros:
  - Browser: chromium
  - runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606
  - Duração até a falha: 27.03s
  - Step impactado: 1. 1-2. Disparar Evidências (Filtro atual) → sem modal + toast direto

Evidências
  (sem anexos)

Execução
- runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606
- environment.json: staging-registros-externos
- testsuite: Extração de dados e evidências (assíncrona com modal de atenção)
- testcase: Validar extração de evidências sem faltantes (modal não aparece)

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada/i }).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada/i }).first()

```

</details>

---

### ✅ Validado manualmente · TC7 · Validar entrega assíncrona: e-mail e notificação no sino · 🔴 Crítico

<a id="validar-entrega-assincrona-e-mail-e-notificacao-no-sino"></a>_Arquivo:_ `tc7-entrega-assincrona-email-e-sino.spec.ts` · _Duração:_ 25.65s · _Browser:_ chromium

> **✅ Validado manualmente pelo QA (2026-06-26) — PASSOU.** O fluxo de entrega assíncrona da RN 79 foi exercido à mão: a extração foi disparada, a **notificação chegou no sino da TopBar** com acesso ao download e o **e-mail de conclusão foi recebido com o link**. A entrega end-to-end funciona.
> **Por que a automação ficou vermelha (gap conhecido, não bug):** o spec automatizado afirma o toast imediato "Extração iniciada" no disparo de **Dados** — e esse toast não dispara na automação (botão Dados inerte, ver TC4). Os passos 2–4 (worker assíncrono, sino e e-mail) não são determinísticos em CI e dependem de caixa de e-mail externa, por isso a verificação é manual. A falha registrada abaixo refere-se apenas à asserção automatizada do passo 1, **não** ao comportamento do produto, que o QA confirmou funcionando.
> _Step impactado (automação):_ **1. Disparar uma extração de Dados CSV → toast "Extração iniciada"**

**Sumário (objetivo do caso):** Garantir que ao término do processamento o admin recebe e-mail com link e notificação no sino (RN 79). Validação de e-mail tem etapa manual.

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Admin com acesso à caixa de e-mail de teste
Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
Worker/job de extração ativo no ambiente
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Disparar uma extração de Dados CSV como Admin | Toast de "Extração iniciada" exibida. | ✅ (manual) | Validado manualmente: a extração foi disparada com sucesso. (A asserção automatizada do toast falhou por causa do botão Dados inerte — gap de automação, ver TC4.) | — |
| 2 | Aguardar a conclusão do processamento assíncrono | Notificação aparece no sino da TopBar informando que a extração está pronta, com acesso ao download. | ✅ (manual) | Validado manualmente: notificação apareceu no sino da TopBar com acesso ao download. | — |
| 3 | Clicar na notificação da extração no painel do sino | Download do pacote inicia (ou página de download abre). | ✅ (manual) | Validado manualmente: o download do pacote iniciou ao clicar na notificação. | — |
| 4 | Abrir a caixa de e-mail do Admin (etapa manual) | E-mail recebido com link de download (anexo quando menor que o limite de e-mail). | ✅ (manual) | Validado manualmente: e-mail recebido com o link de download. | — |

**Evidências:**

_Sem evidências anexadas._

#### ✅ Não é bug — validado manualmente

> **Reclassificado pelo QA (2026-06-26):** NÃO abrir bug. A entrega assíncrona (sino + e-mail com link) foi validada manualmente e funciona. A análise automática abaixo ("inconclusivo") foi gerada antes da validação manual e fica registrada apenas por histórico — a falha vermelha original era um gap de automação (toast imediato do branch Dados, ver TC4), não um defeito do produto.

**Descrição do BUG:** [Crítico] Validar entrega assíncrona: e-mail e notificação no sino — O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada: CSV com \d+ registros \(filtro atual · colunas do filtro\)\./i }).first()).

**Passo a passo para reprodução:**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário logado como Admin com acesso à caixa de e-mail de teste
1. Pré: Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
1. Pré: Worker/job de extração ativo no ambiente
1. 1. Disparar uma extração de Dados CSV como Admin
1. 2. Aguardar a conclusão do processamento assíncrono
1. 3. Clicar na notificação da extração no painel do sino
1. 4. Abrir a caixa de e-mail do Admin (etapa manual)

**Comportamento esperado:** Toast de "Extração iniciada" exibida.

**Comportamento atual:** O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada: CSV com \d+ registros \(filtro atual · colunas do filtro\)\./i }).first()). (falha aconteceu no passo 1: "Disparar uma extração de Dados CSV → toast "Extração iniciada"", que deveria resultar em: Toast de "Extração iniciada" exibida.)

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://registrosf2.stage.twygoead.com/` |
| Login | Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_EMAIL` (consulte `.env`) |
| Senha | Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_PASSWORD` (consulte `.env`) |
| orgId | — |
| Outros | Browser: chromium |
| Outros | runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606 |
| Outros | Duração até a falha: 25.65s |
| Outros | Step impactado: 1. Disparar uma extração de Dados CSV → toast "Extração iniciada" |

**Evidências:**

_Sem anexos coletados pelo Playwright._

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[Crítico] Validar entrega assíncrona: e-mail e notificação no sino — O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada: CSV com \d+ registros \(filtro atual · colunas do filtro\)\./i }).first()).

Passo a passo para reprodução
  Pré: Ambiente Stage configurado e acessível
  Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  Pré: Usuário logado como Admin com acesso à caixa de e-mail de teste
  Pré: Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
  Pré: Worker/job de extração ativo no ambiente
  1. Disparar uma extração de Dados CSV como Admin
  2. Aguardar a conclusão do processamento assíncrono
  3. Clicar na notificação da extração no painel do sino
  4. Abrir a caixa de e-mail do Admin (etapa manual)

Comportamento esperado
Toast de "Extração iniciada" exibida.

Comportamento atual
O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada: CSV com \d+ registros \(filtro atual · colunas do filtro\)\./i }).first()). (falha aconteceu no passo 1: "Disparar uma extração de Dados CSV → toast "Extração iniciada"", que deveria resultar em: Toast de "Extração iniciada" exibida.)

Informações
- URL: https://registrosf2.stage.twygoead.com/
- Login: Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_EMAIL` (consulte `.env`)
- Senha: Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_PASSWORD` (consulte `.env`)
- ID do ambiente (orgId): —
- Outros:
  - Browser: chromium
  - runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606
  - Duração até a falha: 25.65s
  - Step impactado: 1. Disparar uma extração de Dados CSV → toast "Extração iniciada"

Evidências
  (sem anexos)

Execução
- runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606
- environment.json: staging-registros-externos
- testsuite: Extração de dados e evidências (assíncrona com modal de atenção)
- testcase: Validar entrega assíncrona: e-mail e notificação no sino

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada: CSV com \d+ registros \(filtro atual · colunas do filtro\)\./i }).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada: CSV com \d+ registros \(filtro atual · colunas do filtro\)\./i }).first()

```

</details>

---

### ✅ Validado manualmente · TC8 · Validar pacote grande entregue apenas como link · 🟡 Normal

<a id="validar-pacote-grande-entregue-apenas-como-link"></a>_Arquivo:_ `tc8-pacote-grande-entregue-como-link.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **✅ Validado manualmente pelo QA (2026-06-26) — PASSOU.** Disparada uma extração de Evidências sobre escopo com volume acima do limite de anexo de e-mail; o **e-mail de conclusão chegou contendo apenas o link de download, sem anexo** (RN 79 — Spike S8 confirmado). O caso permanece como `test.fixme` no spec por ser uma verificação 100% manual (depende de montar volume grande + inspecionar caixa de e-mail externa) — não é automatizável pela UI.

**Sumário (objetivo do caso):** Garantir que ZIP acima do limite de e-mail chega como link, sem anexo (RN 79 — Spike S8).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Admin com acesso à caixa de e-mail de teste
Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
Worker/job de extração ativo no ambiente
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Disparar extração de Evidências como Admin sobre escopo com volume de arquivos acima do limite de anexo de e-mail | Toast de "Extração iniciada" exibida. | ✅ (manual) | Validado manualmente: extração disparada sobre escopo de volume acima do limite. | — |
| 2 | Aguardar o e-mail de conclusão (etapa manual) | E-mail chega contendo apenas o link de download, sem anexo. | ✅ (manual) | Validado manualmente: e-mail recebido contendo apenas o link, sem anexo. | — |

**Evidências:**

_Sem evidências anexadas._

#### ✅ Validado manualmente — automação intencionalmente não cobre

- **Severidade do caso (XML):** Normal
- **Categoria:** verificação manual (volume grande + caixa de e-mail externa — não automatizável pela UI)
- **Verdito manual (2026-06-26):** PASSOU — ZIP acima do limite chegou como link, sem anexo.
- **Próximo passo:** nenhum. Mantido como `test.fixme` no spec por ser manual por natureza.

**Roteiro do XML (validado manualmente):**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário logado como Admin com acesso à caixa de e-mail de teste
1. Pré: Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
1. Pré: Worker/job de extração ativo no ambiente
1. 1. Disparar extração de Evidências como Admin sobre escopo com volume de arquivos acima do limite de anexo de e-mail
1. 2. Aguardar o e-mail de conclusão (etapa manual)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ❌ Falhou · TC9 · Validar reset do drawer ao reabrir · 🟡 Normal

<a id="validar-reset-do-drawer-ao-reabrir"></a>_Arquivo:_ `tc9-reset-do-drawer-ao-reabrir.spec.ts` · _Duração:_ 12.50s · _Browser:_ chromium

> **❌ Por que falhou:** Error: expect(received).toBe(expected) // Object.is equality
> _Step impactado:_ **2. Reabrir → "Tipo" volta a "Dados" e radios nos defaults**

**Sumário (objetivo do caso):** Garantir o reset suave das opções a cada abertura (h14 cenário 06).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Admin com acesso à caixa de e-mail de teste
Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
Worker/job de extração ativo no ambiente
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Abrir o drawer "Extrair dados", selecionar "Evidências" e fechar o drawer pelo X | Drawer fecha sem extrair. | ✅ | — | 8.89s |
| 2 | Reabrir o drawer "Extrair dados" | Select "Tipo de extração" volta para "Dados" e os radios voltam aos defaults (estado anterior não mantido). | ❌ | Error: expect(received).toBe(expected) // Object.is equality | 0.62s |

**Evidências:**

_Sem evidências anexadas._

#### 🐛 Pronto para registro de bug

> ❓ **Análise automática:** Inconclusivo (precisa investigação manual) · Confiança 🔴 baixa
> _Por quê:_ Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace
> _Bug-report estruturado:_ [`bug-reports/extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao__validar-reset-do-drawer-ao-reabrir.md`](bug-reports/extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao__validar-reset-do-drawer-ao-reabrir.md)

**Próximas ações sugeridas:**
- Sem evidência suficiente para classificar — abrir `trace.zip` (`npx playwright show-trace`) para ver passo a passo da execução.
- Reabrir o agente com o trace em mãos para reclassificar manualmente em uma das 4 categorias.

**Descrição do BUG:** [Normal] Validar reset do drawer ao reabrir — Error: expect(received).toBe(expected) // Object.is equality

**Passo a passo para reprodução:**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário logado como Admin com acesso à caixa de e-mail de teste
1. Pré: Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
1. Pré: Worker/job de extração ativo no ambiente
1. 1. Abrir o drawer "Extrair dados", selecionar "Evidências" e fechar o drawer pelo X
1. 2. Reabrir o drawer "Extrair dados"

**Comportamento esperado:** Select "Tipo de extração" volta para "Dados" e os radios voltam aos defaults (estado anterior não mantido).

**Comportamento atual:** Error: expect(received).toBe(expected) // Object.is equality (falha aconteceu no passo 2: "Reabrir → "Tipo" volta a "Dados" e radios nos defaults", que deveria resultar em: Select "Tipo de extração" volta para "Dados" e os radios voltam aos defaults (estado anterior não mantido).)

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://registrosf2.stage.twygoead.com/` |
| Login | Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_EMAIL` (consulte `.env`) |
| Senha | Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_PASSWORD` (consulte `.env`) |
| orgId | — |
| Outros | Browser: chromium |
| Outros | runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606 |
| Outros | Duração até a falha: 12.50s |
| Outros | Step impactado: 2. Reabrir → "Tipo" volta a "Dados" e radios nos defaults |

**Evidências:**

_Sem anexos coletados pelo Playwright._

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[Normal] Validar reset do drawer ao reabrir — Error: expect(received).toBe(expected) // Object.is equality

Passo a passo para reprodução
  Pré: Ambiente Stage configurado e acessível
  Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  Pré: Usuário logado como Admin com acesso à caixa de e-mail de teste
  Pré: Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
  Pré: Worker/job de extração ativo no ambiente
  1. Abrir o drawer "Extrair dados", selecionar "Evidências" e fechar o drawer pelo X
  2. Reabrir o drawer "Extrair dados"

Comportamento esperado
Select "Tipo de extração" volta para "Dados" e os radios voltam aos defaults (estado anterior não mantido).

Comportamento atual
Error: expect(received).toBe(expected) // Object.is equality (falha aconteceu no passo 2: "Reabrir → "Tipo" volta a "Dados" e radios nos defaults", que deveria resultar em: Select "Tipo de extração" volta para "Dados" e os radios voltam aos defaults (estado anterior não mantido).)

Informações
- URL: https://registrosf2.stage.twygoead.com/
- Login: Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_EMAIL` (consulte `.env`)
- Senha: Credenciais via env: `TWYGO_STAGING_REGISTROS_EXTERNOS_PASSWORD` (consulte `.env`)
- ID do ambiente (orgId): —
- Outros:
  - Browser: chromium
  - runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606
  - Duração até a falha: 12.50s
  - Step impactado: 2. Reabrir → "Tipo" volta a "Dados" e radios nos defaults

Evidências
  (sem anexos)

Execução
- runId: extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao_20260623-164606
- environment.json: staging-registros-externos
- testsuite: Extração de dados e evidências (assíncrona com modal de atenção)
- testcase: Validar reset do drawer ao reabrir

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Dados"
Received: "Evidências"
```

</details>

---
