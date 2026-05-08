# Casos de teste — Widgets

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Listagem de painéis

_8 caso(s) — 1 aprovado(s), 7 falha(s)_

### ❌ Falhou · Acessar a listagem de Painéis a partir do Menu 

<a id="acessar-a-listagem-de-paineis-a-partir-do-menu"></a>_Arquivo:_ `acessar-listagem-paineis-menu.spec.ts` · _Duração:_ 40.80s · _Browser:_ chromium

> **❌ Por que falhou:** Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('#menu a[name="settings-main-menu"]')).
> _Step impactado:_ **1. Clicar no link 'Menu' da sidebar lateral**

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ 1. Clicar no link 'Menu' da sidebar lateral | — | ❌ | Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('#menu a[name="settings-main-menu"]')). | 38.86s |

**Evidências:**

![screenshot](../../test-artifacts/projects-widgets-tests-fea-ff427-de-Painéis-a-partir-do-Menu-chromium/test-failed-1.png)

- 📦 [Trace do Playwright (trace.zip)](../../test-artifacts/projects-widgets-tests-fea-ff427-de-Painéis-a-partir-do-Menu-chromium/trace.zip) — abra com `npx playwright show-trace`

- 📄 [Snapshot do DOM no momento da falha (`error-context.md`)](../../test-artifacts/projects-widgets-tests-fea-ff427-de-Painéis-a-partir-do-Menu-chromium/error-context.md)

#### 🐛 Pronto para registro de bug

**Descrição do BUG:** [—] Acessar a listagem de Painéis a partir do Menu — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('#menu a[name="settings-main-menu"]')).

**Passo a passo para reprodução:**
1. — (sem steps documentados no XML)

**Comportamento esperado:** —

**Comportamento atual:** Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('#menu a[name="settings-main-menu"]')).

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://widgets.stage.twygoead.com/` |
| Login | ${TWYGO_STAGING_WIDGETS_EMAIL} |
| Senha | ${TWYGO_STAGING_WIDGETS_PASSWORD} |
| orgId | 36988 |
| Outros | Browser: chromium |
| Outros | runId: listagem-de-paineis_20260508-151305 |
| Outros | Duração até a falha: 40.80s |
| Outros | Step impactado: 1. 1. Clicar no link 'Menu' da sidebar lateral |

**Evidências:**

- Screenshot capturado pelo Playwright (screenshot): ../../test-artifacts/projects-widgets-tests-fea-ff427-de-Painéis-a-partir-do-Menu-chromium/test-failed-1.png
- Snapshot do DOM/contexto da página (error-context.md): ../../test-artifacts/projects-widgets-tests-fea-ff427-de-Painéis-a-partir-do-Menu-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: ../../test-artifacts/projects-widgets-tests-fea-ff427-de-Painéis-a-partir-do-Menu-chromium/trace.zip

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[—] Acessar a listagem de Painéis a partir do Menu — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('#menu a[name="settings-main-menu"]')).

Passo a passo para reprodução
  — (sem steps documentados no XML)

Comportamento esperado
—

Comportamento atual
Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('#menu a[name="settings-main-menu"]')).

Informações
- URL: https://widgets.stage.twygoead.com/
- Login: ${TWYGO_STAGING_WIDGETS_EMAIL}
- Senha: ${TWYGO_STAGING_WIDGETS_PASSWORD}
- ID do ambiente (orgId): 36988
- Outros:
  - Browser: chromium
  - runId: listagem-de-paineis_20260508-151305
  - Duração até a falha: 40.80s
  - Step impactado: 1. 1. Clicar no link 'Menu' da sidebar lateral

Evidências
- Screenshot capturado pelo Playwright (screenshot): ../../test-artifacts/projects-widgets-tests-fea-ff427-de-Painéis-a-partir-do-Menu-chromium/test-failed-1.png
- Snapshot do DOM/contexto da página (error-context.md): ../../test-artifacts/projects-widgets-tests-fea-ff427-de-Painéis-a-partir-do-Menu-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: ../../test-artifacts/projects-widgets-tests-fea-ff427-de-Painéis-a-partir-do-Menu-chromium/trace.zip

Execução
- runId: listagem-de-paineis_20260508-151305
- environment.json: staging-widgets
- testsuite: Listagem de painéis
- testcase: Acessar a listagem de Painéis a partir do Menu

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#menu a[name="settings-main-menu"]')
    - locator resolved to <a name="settings-main-menu">…</a>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div tabindex="-1" class="chakra-modal__content-container css-wl0d9u">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div tabindex="-1" class="chakra-modal__content-container css-wl0d9u">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    57 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div tabindex="-1" class="chakra-modal__content-container css-wl0d9u">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

```

</details>

---

### ❌ Falhou · Validar acessibilidade por teclado (TAB / setas / ENTER / ESC) 

<a id="validar-acessibilidade-por-teclado-tab-setas-enter-esc"></a>_Arquivo:_ `acessibilidade-teclado.spec.ts` · _Duração:_ 40.33s · _Browser:_ chromium

> **❌ Por que falhou:** TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
> _Step impactado:_ **1. Acessar a listagem de Painéis**

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ 1. Acessar a listagem de Painéis | — | ❌ | TimeoutError: locator.waitFor: Timeout 30000ms exceeded. | 38.49s |

**Evidências:**

![screenshot](../../test-artifacts/projects-widgets-tests-fea-b00fe-eclado-TAB-setas-ENTER-ESC--chromium/test-failed-1.png)

- 📦 [Trace do Playwright (trace.zip)](../../test-artifacts/projects-widgets-tests-fea-b00fe-eclado-TAB-setas-ENTER-ESC--chromium/trace.zip) — abra com `npx playwright show-trace`

- 📄 [Snapshot do DOM no momento da falha (`error-context.md`)](../../test-artifacts/projects-widgets-tests-fea-b00fe-eclado-TAB-setas-ENTER-ESC--chromium/error-context.md)

#### 🐛 Pronto para registro de bug

**Descrição do BUG:** [—] Validar acessibilidade por teclado (TAB / setas / ENTER / ESC) — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

**Passo a passo para reprodução:**
1. — (sem steps documentados no XML)

**Comportamento esperado:** —

**Comportamento atual:** TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://widgets.stage.twygoead.com/` |
| Login | ${TWYGO_STAGING_WIDGETS_EMAIL} |
| Senha | ${TWYGO_STAGING_WIDGETS_PASSWORD} |
| orgId | 36988 |
| Outros | Browser: chromium |
| Outros | runId: listagem-de-paineis_20260508-151305 |
| Outros | Duração até a falha: 40.33s |
| Outros | Step impactado: 1. 1. Acessar a listagem de Painéis |

**Evidências:**

- Screenshot capturado pelo Playwright (screenshot): ../../test-artifacts/projects-widgets-tests-fea-b00fe-eclado-TAB-setas-ENTER-ESC--chromium/test-failed-1.png
- Snapshot do DOM/contexto da página (error-context.md): ../../test-artifacts/projects-widgets-tests-fea-b00fe-eclado-TAB-setas-ENTER-ESC--chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: ../../test-artifacts/projects-widgets-tests-fea-b00fe-eclado-TAB-setas-ENTER-ESC--chromium/trace.zip

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[—] Validar acessibilidade por teclado (TAB / setas / ENTER / ESC) — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

Passo a passo para reprodução
  — (sem steps documentados no XML)

Comportamento esperado
—

Comportamento atual
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

Informações
- URL: https://widgets.stage.twygoead.com/
- Login: ${TWYGO_STAGING_WIDGETS_EMAIL}
- Senha: ${TWYGO_STAGING_WIDGETS_PASSWORD}
- ID do ambiente (orgId): 36988
- Outros:
  - Browser: chromium
  - runId: listagem-de-paineis_20260508-151305
  - Duração até a falha: 40.33s
  - Step impactado: 1. 1. Acessar a listagem de Painéis

Evidências
- Screenshot capturado pelo Playwright (screenshot): ../../test-artifacts/projects-widgets-tests-fea-b00fe-eclado-TAB-setas-ENTER-ESC--chromium/test-failed-1.png
- Snapshot do DOM/contexto da página (error-context.md): ../../test-artifacts/projects-widgets-tests-fea-b00fe-eclado-TAB-setas-ENTER-ESC--chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: ../../test-artifacts/projects-widgets-tests-fea-b00fe-eclado-TAB-setas-ENTER-ESC--chromium/trace.zip

Execução
- runId: listagem-de-paineis_20260508-151305
- environment.json: staging-widgets
- testsuite: Listagem de painéis
- testcase: Validar acessibilidade por teclado (TAB / setas / ENTER / ESC)

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('tab', { name: 'Painéis' }) to be visible

```

</details>

---

### ❌ Falhou · Alternar entre visualização em lista e cards · 🟡 Normal

<a id="alternar-entre-visualizacao-em-lista-e-cards"></a>_Arquivo:_ `alternar-lista-cards.spec.ts` · _Duração:_ 42.34s · _Browser:_ chromium

> **❌ Por que falhou:** TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
> _Step impactado:_ **1. Acessar a listagem (default em 1920x1080 é 'Lista')**

**Sumário (objetivo do caso):** Validar troca de visualização lista/cards e persistência da seleção do usuário (R2).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Existem painéis previamente cadastrados na organização
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a aba 'Painéis' em Configurações > Menu | Listagem é exibida no modo 'Lista' por padrão | ❌ | TimeoutError: locator.waitFor: Timeout 30000ms exceeded. | 40.41s |
| 2 | Clicar no controle de visualização 'Cards' | Listagem é renderizada em formato de cards | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |
| 3 | Clicar no controle de visualização 'Lista' | Listagem volta a ser renderizada em formato de tabela com as colunas padrão | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |

**Evidências:**

![screenshot](../../test-artifacts/projects-widgets-tests-fea-ee775-sualização-em-lista-e-cards-chromium/test-failed-1.png)

- 📦 [Trace do Playwright (trace.zip)](../../test-artifacts/projects-widgets-tests-fea-ee775-sualização-em-lista-e-cards-chromium/trace.zip) — abra com `npx playwright show-trace`

- 📄 [Snapshot do DOM no momento da falha (`error-context.md`)](../../test-artifacts/projects-widgets-tests-fea-ee775-sualização-em-lista-e-cards-chromium/error-context.md)

#### 🐛 Pronto para registro de bug

**Descrição do BUG:** [Normal] Alternar entre visualização em lista e cards — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

**Passo a passo para reprodução:**
1. Pré: Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Existem painéis previamente cadastrados na organização
1. 1. Acessar a aba 'Painéis' em Configurações > Menu
1. 2. Clicar no controle de visualização 'Cards'
1. 3. Clicar no controle de visualização 'Lista'

**Comportamento esperado:** Listagem é exibida no modo 'Lista' por padrão

**Comportamento atual:** TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://widgets.stage.twygoead.com/` |
| Login | ${TWYGO_STAGING_WIDGETS_EMAIL} |
| Senha | ${TWYGO_STAGING_WIDGETS_PASSWORD} |
| orgId | 36988 |
| Outros | Browser: chromium |
| Outros | runId: listagem-de-paineis_20260508-151305 |
| Outros | Duração até a falha: 42.34s |
| Outros | Step impactado: 1. 1. Acessar a listagem (default em 1920x1080 é 'Lista') |

**Evidências:**

- Screenshot capturado pelo Playwright (screenshot): ../../test-artifacts/projects-widgets-tests-fea-ee775-sualização-em-lista-e-cards-chromium/test-failed-1.png
- Snapshot do DOM/contexto da página (error-context.md): ../../test-artifacts/projects-widgets-tests-fea-ee775-sualização-em-lista-e-cards-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: ../../test-artifacts/projects-widgets-tests-fea-ee775-sualização-em-lista-e-cards-chromium/trace.zip

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[Normal] Alternar entre visualização em lista e cards — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

Passo a passo para reprodução
  Pré: Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Existem painéis previamente cadastrados na organização
  1. Acessar a aba 'Painéis' em Configurações > Menu
  2. Clicar no controle de visualização 'Cards'
  3. Clicar no controle de visualização 'Lista'

Comportamento esperado
Listagem é exibida no modo 'Lista' por padrão

Comportamento atual
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

Informações
- URL: https://widgets.stage.twygoead.com/
- Login: ${TWYGO_STAGING_WIDGETS_EMAIL}
- Senha: ${TWYGO_STAGING_WIDGETS_PASSWORD}
- ID do ambiente (orgId): 36988
- Outros:
  - Browser: chromium
  - runId: listagem-de-paineis_20260508-151305
  - Duração até a falha: 42.34s
  - Step impactado: 1. 1. Acessar a listagem (default em 1920x1080 é 'Lista')

Evidências
- Screenshot capturado pelo Playwright (screenshot): ../../test-artifacts/projects-widgets-tests-fea-ee775-sualização-em-lista-e-cards-chromium/test-failed-1.png
- Snapshot do DOM/contexto da página (error-context.md): ../../test-artifacts/projects-widgets-tests-fea-ee775-sualização-em-lista-e-cards-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: ../../test-artifacts/projects-widgets-tests-fea-ee775-sualização-em-lista-e-cards-chromium/trace.zip

Execução
- runId: listagem-de-paineis_20260508-151305
- environment.json: staging-widgets
- testsuite: Listagem de painéis
- testcase: Alternar entre visualização em lista e cards

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('tab', { name: 'Painéis' }) to be visible

```

</details>

---

### ❌ Falhou · Acessar listagem com a feature flag desabilitada · 🔴 Crítico

<a id="acessar-listagem-com-a-feature-flag-desabilitada"></a>_Arquivo:_ `feature-flag-desabilitada.spec.ts` · _Duração:_ 22.79s · _Browser:_ chromium

> **❌ Por que falhou:** O elemento esperado não apareceu na tela (locator: getByRole('tab', { name: 'Modos de uso' })).
> _Step impactado:_ **1. Acessar /use_modes e verificar tabs**

**Sumário (objetivo do caso):** Garantir que aba 'Painéis' não é exibida quando a flag está desabilitada (R1).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' DESABILITADA Usuário logado como Admin
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar Menu > Modos de uso | Tela de Modos de uso é exibida | ❌ | O elemento esperado não apareceu na tela (locator: getByRole('tab', { name: 'Modos de uso' })). | 21.16s |
| 2 | Verificar a presença da aba 'Painéis' | Aba 'Painéis' NÃO é exibida na tela de Modos de uso | ⊘ | Step não executado: o teste foi interrompido antes. Causa: O elemento esperado não apareceu na tela (locator: getByRole('tab', { name: 'Modos de uso' })).. | — |
| 3 | Acessar diretamente pela rota da aba 'Painéis' | Mensagem padrão de que a página não existe | ⊘ | Step não executado: o teste foi interrompido antes. Causa: O elemento esperado não apareceu na tela (locator: getByRole('tab', { name: 'Modos de uso' })).. | — |

**Evidências:**

![screenshot](../../test-artifacts/projects-widgets-tests-fea-0c79e-a-feature-flag-desabilitada-chromium/test-failed-1.png)

- 📦 [Trace do Playwright (trace.zip)](../../test-artifacts/projects-widgets-tests-fea-0c79e-a-feature-flag-desabilitada-chromium/trace.zip) — abra com `npx playwright show-trace`

- 📄 [Snapshot do DOM no momento da falha (`error-context.md`)](../../test-artifacts/projects-widgets-tests-fea-0c79e-a-feature-flag-desabilitada-chromium/error-context.md)

#### 🐛 Pronto para registro de bug

**Descrição do BUG:** [Crítico] Acessar listagem com a feature flag desabilitada — O elemento esperado não apareceu na tela (locator: getByRole('tab', { name: 'Modos de uso' })).

**Passo a passo para reprodução:**
1. Pré: Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' DESABILITADA Usuário logado como Admin
1. 1. Acessar Menu > Modos de uso
1. 2. Verificar a presença da aba 'Painéis'
1. 3. Acessar diretamente pela rota da aba 'Painéis'

**Comportamento esperado:** Tela de Modos de uso é exibida

**Comportamento atual:** O elemento esperado não apareceu na tela (locator: getByRole('tab', { name: 'Modos de uso' })).

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://widgets.stage.twygoead.com/` |
| Login | ${TWYGO_STAGING_WIDGETS_EMAIL} |
| Senha | ${TWYGO_STAGING_WIDGETS_PASSWORD} |
| orgId | 36989 |
| Outros | Browser: chromium |
| Outros | runId: listagem-de-paineis_20260508-151305 |
| Outros | Duração até a falha: 22.79s |
| Outros | Step impactado: 1. 1. Acessar /use_modes e verificar tabs |

**Evidências:**

- Screenshot capturado pelo Playwright (screenshot): ../../test-artifacts/projects-widgets-tests-fea-0c79e-a-feature-flag-desabilitada-chromium/test-failed-1.png
- Snapshot do DOM/contexto da página (error-context.md): ../../test-artifacts/projects-widgets-tests-fea-0c79e-a-feature-flag-desabilitada-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: ../../test-artifacts/projects-widgets-tests-fea-0c79e-a-feature-flag-desabilitada-chromium/trace.zip

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[Crítico] Acessar listagem com a feature flag desabilitada — O elemento esperado não apareceu na tela (locator: getByRole('tab', { name: 'Modos de uso' })).

Passo a passo para reprodução
  Pré: Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' DESABILITADA Usuário logado como Admin
  1. Acessar Menu > Modos de uso
  2. Verificar a presença da aba 'Painéis'
  3. Acessar diretamente pela rota da aba 'Painéis'

Comportamento esperado
Tela de Modos de uso é exibida

Comportamento atual
O elemento esperado não apareceu na tela (locator: getByRole('tab', { name: 'Modos de uso' })).

Informações
- URL: https://widgets.stage.twygoead.com/
- Login: ${TWYGO_STAGING_WIDGETS_EMAIL}
- Senha: ${TWYGO_STAGING_WIDGETS_PASSWORD}
- ID do ambiente (orgId): 36989
- Outros:
  - Browser: chromium
  - runId: listagem-de-paineis_20260508-151305
  - Duração até a falha: 22.79s
  - Step impactado: 1. 1. Acessar /use_modes e verificar tabs

Evidências
- Screenshot capturado pelo Playwright (screenshot): ../../test-artifacts/projects-widgets-tests-fea-0c79e-a-feature-flag-desabilitada-chromium/test-failed-1.png
- Snapshot do DOM/contexto da página (error-context.md): ../../test-artifacts/projects-widgets-tests-fea-0c79e-a-feature-flag-desabilitada-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: ../../test-artifacts/projects-widgets-tests-fea-0c79e-a-feature-flag-desabilitada-chromium/trace.zip

Execução
- runId: listagem-de-paineis_20260508-151305
- environment.json: staging-widgets
- testsuite: Listagem de painéis
- testcase: Acessar listagem com a feature flag desabilitada

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('tab', { name: 'Modos de uso' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('tab', { name: 'Modos de uso' })

```

</details>

---

### ❌ Falhou · Ordenar listagem por cada coluna · 🟡 Normal

<a id="ordenar-listagem-por-cada-coluna"></a>_Arquivo:_ `ordenar-colunas.spec.ts` · _Duração:_ 38.20s · _Browser:_ chromium

> **❌ Por que falhou:** TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
> _Step impactado:_ **1. Acessar a listagem em modo 'Lista' e capturar ordem default**

**Sumário (objetivo do caso):** Validar ordenação ascendente/descendente em cada coluna ordenável (R2).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Existem ao menos 3 painéis cadastrados
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a aba 'Painéis' em Configurações > Menu | Listagem é exibida com ordenação padrão | ❌ | TimeoutError: locator.waitFor: Timeout 30000ms exceeded. | 36.48s |
| 2 | Clicar no cabeçalho da coluna 'Nome' | Linhas são reordenadas em ordem alfabética crescente pelo nome | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |
| 3 | Clicar novamente no cabeçalho da coluna 'Nome' | Linhas são reordenadas em ordem alfabética decrescente pelo nome | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |
| 4 | Clicar no cabeçalho da coluna 'Descrição' | Linhas são reordenadas em ordem alfabética crescente pela descrição | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |
| 5 | Clicar novamente no cabeçalho da coluna 'Descrição' | Linhas são reordenadas em ordem alfabética decrescente pelo nome | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |
| 6 | Clicar no cabeçalho da coluna 'Provedora' | Linhas são reordenadas em ordem alfabética crescente pelo nome do provedor | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |
| 7 | Clicar novamente no cabeçalho da coluna 'Provedora' | Linhas são reordenadas em ordem alfabética decrescente pelo nome do provedor | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |
| 8 | Clicar no cabeçalho da coluna 'Data de criação' | Linhas são reordenadas pela data de criação na ordem de data mais antiga para a mais recente | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |
| 9 | Clicar novamente no cabeçalho da coluna 'Data de criação' | Linhas são reordenadas pela data de criação na ordem de data mais recente para a mais antiga | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |
| 10 | Clicar no cabeçalho da coluna 'Ativo' | Linhas são ordenadas de inativos para ativos | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |
| 11 | Clicar novamente no cabeçalho da coluna 'Ativo' | Linhas são ordenadas de ativos para inativos | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |

**Evidências:**

![screenshot](../../test-artifacts/projects-widgets-tests-fea-163b5-ar-listagem-por-cada-coluna-chromium/test-failed-1.png)

- 📦 [Trace do Playwright (trace.zip)](../../test-artifacts/projects-widgets-tests-fea-163b5-ar-listagem-por-cada-coluna-chromium/trace.zip) — abra com `npx playwright show-trace`

- 📄 [Snapshot do DOM no momento da falha (`error-context.md`)](../../test-artifacts/projects-widgets-tests-fea-163b5-ar-listagem-por-cada-coluna-chromium/error-context.md)

#### 🐛 Pronto para registro de bug

**Descrição do BUG:** [Normal] Ordenar listagem por cada coluna — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

**Passo a passo para reprodução:**
1. Pré: Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Existem ao menos 3 painéis cadastrados
1. 1. Acessar a aba 'Painéis' em Configurações > Menu
1. 2. Clicar no cabeçalho da coluna 'Nome'
1. 3. Clicar novamente no cabeçalho da coluna 'Nome'
1. 4. Clicar no cabeçalho da coluna 'Descrição'
1. 5. Clicar novamente no cabeçalho da coluna 'Descrição'
1. 6. Clicar no cabeçalho da coluna 'Provedora'
1. 7. Clicar novamente no cabeçalho da coluna 'Provedora'
1. 8. Clicar no cabeçalho da coluna 'Data de criação'
1. 9. Clicar novamente no cabeçalho da coluna 'Data de criação'
1. 10. Clicar no cabeçalho da coluna 'Ativo'
1. 11. Clicar novamente no cabeçalho da coluna 'Ativo'

**Comportamento esperado:** Listagem é exibida com ordenação padrão

**Comportamento atual:** TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://widgets.stage.twygoead.com/` |
| Login | ${TWYGO_STAGING_WIDGETS_EMAIL} |
| Senha | ${TWYGO_STAGING_WIDGETS_PASSWORD} |
| orgId | 36988 |
| Outros | Browser: chromium |
| Outros | runId: listagem-de-paineis_20260508-151305 |
| Outros | Duração até a falha: 38.20s |
| Outros | Step impactado: 1. 1. Acessar a listagem em modo 'Lista' e capturar ordem default |

**Evidências:**

- Screenshot capturado pelo Playwright (screenshot): ../../test-artifacts/projects-widgets-tests-fea-163b5-ar-listagem-por-cada-coluna-chromium/test-failed-1.png
- Snapshot do DOM/contexto da página (error-context.md): ../../test-artifacts/projects-widgets-tests-fea-163b5-ar-listagem-por-cada-coluna-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: ../../test-artifacts/projects-widgets-tests-fea-163b5-ar-listagem-por-cada-coluna-chromium/trace.zip

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[Normal] Ordenar listagem por cada coluna — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

Passo a passo para reprodução
  Pré: Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Existem ao menos 3 painéis cadastrados
  1. Acessar a aba 'Painéis' em Configurações > Menu
  2. Clicar no cabeçalho da coluna 'Nome'
  3. Clicar novamente no cabeçalho da coluna 'Nome'
  4. Clicar no cabeçalho da coluna 'Descrição'
  5. Clicar novamente no cabeçalho da coluna 'Descrição'
  6. Clicar no cabeçalho da coluna 'Provedora'
  7. Clicar novamente no cabeçalho da coluna 'Provedora'
  8. Clicar no cabeçalho da coluna 'Data de criação'
  9. Clicar novamente no cabeçalho da coluna 'Data de criação'
  10. Clicar no cabeçalho da coluna 'Ativo'
  11. Clicar novamente no cabeçalho da coluna 'Ativo'

Comportamento esperado
Listagem é exibida com ordenação padrão

Comportamento atual
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

Informações
- URL: https://widgets.stage.twygoead.com/
- Login: ${TWYGO_STAGING_WIDGETS_EMAIL}
- Senha: ${TWYGO_STAGING_WIDGETS_PASSWORD}
- ID do ambiente (orgId): 36988
- Outros:
  - Browser: chromium
  - runId: listagem-de-paineis_20260508-151305
  - Duração até a falha: 38.20s
  - Step impactado: 1. 1. Acessar a listagem em modo 'Lista' e capturar ordem default

Evidências
- Screenshot capturado pelo Playwright (screenshot): ../../test-artifacts/projects-widgets-tests-fea-163b5-ar-listagem-por-cada-coluna-chromium/test-failed-1.png
- Snapshot do DOM/contexto da página (error-context.md): ../../test-artifacts/projects-widgets-tests-fea-163b5-ar-listagem-por-cada-coluna-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: ../../test-artifacts/projects-widgets-tests-fea-163b5-ar-listagem-por-cada-coluna-chromium/trace.zip

Execução
- runId: listagem-de-paineis_20260508-151305
- environment.json: staging-widgets
- testsuite: Listagem de painéis
- testcase: Ordenar listagem por cada coluna

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('tab', { name: 'Painéis' }) to be visible

```

</details>

---

### ❌ Falhou · Paginação da listagem com volume de painéis · 🟡 Normal

<a id="paginacao-da-listagem-com-volume-de-paineis"></a>_Arquivo:_ `paginacao-listagem.spec.ts` · _Duração:_ 39.09s · _Browser:_ chromium

> **❌ Por que falhou:** TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
> _Step impactado:_ **1. Acessar a listagem e verificar paginação visível com botão '1' ativo**

**Sumário (objetivo do caso):** Validar paginação quando há mais painéis que o limite por página.

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Existem mais de 25 painéis cadastrados
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a aba 'Painéis' em Configurações > Menu | Listagem é exibida com paginação no rodapé | ❌ | TimeoutError: locator.waitFor: Timeout 30000ms exceeded. | 37.01s |
| 2 | Clicar no botão 'Próxima página' do paginador | Sistema avança uma página e exibe os próximos registros | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |
| 3 | Clicar no botão 'Página anterior' do paginador | Sistema retorna para a página anterior | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |

**Evidências:**

![screenshot](../../test-artifacts/projects-widgets-tests-fea-55554-tagem-com-volume-de-painéis-chromium/test-failed-1.png)

- 📦 [Trace do Playwright (trace.zip)](../../test-artifacts/projects-widgets-tests-fea-55554-tagem-com-volume-de-painéis-chromium/trace.zip) — abra com `npx playwright show-trace`

- 📄 [Snapshot do DOM no momento da falha (`error-context.md`)](../../test-artifacts/projects-widgets-tests-fea-55554-tagem-com-volume-de-painéis-chromium/error-context.md)

#### 🐛 Pronto para registro de bug

**Descrição do BUG:** [Normal] Paginação da listagem com volume de painéis — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

**Passo a passo para reprodução:**
1. Pré: Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Existem mais de 25 painéis cadastrados
1. 1. Acessar a aba 'Painéis' em Configurações > Menu
1. 2. Clicar no botão 'Próxima página' do paginador
1. 3. Clicar no botão 'Página anterior' do paginador

**Comportamento esperado:** Listagem é exibida com paginação no rodapé

**Comportamento atual:** TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://widgets.stage.twygoead.com/` |
| Login | ${TWYGO_STAGING_WIDGETS_EMAIL} |
| Senha | ${TWYGO_STAGING_WIDGETS_PASSWORD} |
| orgId | 36988 |
| Outros | Browser: chromium |
| Outros | runId: listagem-de-paineis_20260508-151305 |
| Outros | Duração até a falha: 39.09s |
| Outros | Step impactado: 1. 1. Acessar a listagem e verificar paginação visível com botão '1' ativo |

**Evidências:**

- Screenshot capturado pelo Playwright (screenshot): ../../test-artifacts/projects-widgets-tests-fea-55554-tagem-com-volume-de-painéis-chromium/test-failed-1.png
- Snapshot do DOM/contexto da página (error-context.md): ../../test-artifacts/projects-widgets-tests-fea-55554-tagem-com-volume-de-painéis-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: ../../test-artifacts/projects-widgets-tests-fea-55554-tagem-com-volume-de-painéis-chromium/trace.zip

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[Normal] Paginação da listagem com volume de painéis — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

Passo a passo para reprodução
  Pré: Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Existem mais de 25 painéis cadastrados
  1. Acessar a aba 'Painéis' em Configurações > Menu
  2. Clicar no botão 'Próxima página' do paginador
  3. Clicar no botão 'Página anterior' do paginador

Comportamento esperado
Listagem é exibida com paginação no rodapé

Comportamento atual
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

Informações
- URL: https://widgets.stage.twygoead.com/
- Login: ${TWYGO_STAGING_WIDGETS_EMAIL}
- Senha: ${TWYGO_STAGING_WIDGETS_PASSWORD}
- ID do ambiente (orgId): 36988
- Outros:
  - Browser: chromium
  - runId: listagem-de-paineis_20260508-151305
  - Duração até a falha: 39.09s
  - Step impactado: 1. 1. Acessar a listagem e verificar paginação visível com botão '1' ativo

Evidências
- Screenshot capturado pelo Playwright (screenshot): ../../test-artifacts/projects-widgets-tests-fea-55554-tagem-com-volume-de-painéis-chromium/test-failed-1.png
- Snapshot do DOM/contexto da página (error-context.md): ../../test-artifacts/projects-widgets-tests-fea-55554-tagem-com-volume-de-painéis-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: ../../test-artifacts/projects-widgets-tests-fea-55554-tagem-com-volume-de-painéis-chromium/trace.zip

Execução
- runId: listagem-de-paineis_20260508-151305
- environment.json: staging-widgets
- testsuite: Listagem de painéis
- testcase: Paginação da listagem com volume de painéis

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('tab', { name: 'Painéis' }) to be visible

```

</details>

---

### ❌ Falhou · Validar colunas exibidas na visualização em lista · 🔴 Crítico

<a id="validar-colunas-exibidas-na-visualizacao-em-lista"></a>_Arquivo:_ `validar-colunas-lista.spec.ts` · _Duração:_ 39.61s · _Browser:_ chromium

> **❌ Por que falhou:** TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
> _Step impactado:_ **1. Acessar a listagem de Painéis em modo 'Lista'**

**Sumário (objetivo do caso):** Validar colunas Nome, Descrição, Provedora, Data de criação, Ativo e Ações (R2).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Existem painéis previamente cadastrados na organização
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a aba 'Painéis' em Configurações > Menu no modo 'Lista' | Tabela exibe os cabeçalhos: 'Nome', 'Descrição', 'Provedora', 'Data de criação', 'Ativo', 'Ações' | ❌ | TimeoutError: locator.waitFor: Timeout 30000ms exceeded. | 37.60s |
| 2 | Verificar a coluna 'Ativo' | Coluna 'Ativo' apresenta um switch por linha indicando estado ativo/inativo | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |
| 3 | Verificar a coluna 'Ações' | Coluna 'Ações' exibe os ícones de 'Editar', 'Duplicar' e 'Excluir' em cada linha | ⊘ | Step não executado: o teste foi interrompido antes. Causa: TimeoutError: locator.waitFor: Timeout 30000ms exceeded.. | — |

**Evidências:**

![screenshot](../../test-artifacts/projects-widgets-tests-fea-e73d6-as-na-visualização-em-lista-chromium/test-failed-1.png)

- 📦 [Trace do Playwright (trace.zip)](../../test-artifacts/projects-widgets-tests-fea-e73d6-as-na-visualização-em-lista-chromium/trace.zip) — abra com `npx playwright show-trace`

- 📄 [Snapshot do DOM no momento da falha (`error-context.md`)](../../test-artifacts/projects-widgets-tests-fea-e73d6-as-na-visualização-em-lista-chromium/error-context.md)

#### 🐛 Pronto para registro de bug

**Descrição do BUG:** [Crítico] Validar colunas exibidas na visualização em lista — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

**Passo a passo para reprodução:**
1. Pré: Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Existem painéis previamente cadastrados na organização
1. 1. Acessar a aba 'Painéis' em Configurações > Menu no modo 'Lista'
1. 2. Verificar a coluna 'Ativo'
1. 3. Verificar a coluna 'Ações'

**Comportamento esperado:** Tabela exibe os cabeçalhos: 'Nome', 'Descrição', 'Provedora', 'Data de criação', 'Ativo', 'Ações'

**Comportamento atual:** TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://widgets.stage.twygoead.com/` |
| Login | ${TWYGO_STAGING_WIDGETS_EMAIL} |
| Senha | ${TWYGO_STAGING_WIDGETS_PASSWORD} |
| orgId | 36988 |
| Outros | Browser: chromium |
| Outros | runId: listagem-de-paineis_20260508-151305 |
| Outros | Duração até a falha: 39.61s |
| Outros | Step impactado: 1. 1. Acessar a listagem de Painéis em modo 'Lista' |

**Evidências:**

- Screenshot capturado pelo Playwright (screenshot): ../../test-artifacts/projects-widgets-tests-fea-e73d6-as-na-visualização-em-lista-chromium/test-failed-1.png
- Snapshot do DOM/contexto da página (error-context.md): ../../test-artifacts/projects-widgets-tests-fea-e73d6-as-na-visualização-em-lista-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: ../../test-artifacts/projects-widgets-tests-fea-e73d6-as-na-visualização-em-lista-chromium/trace.zip

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[Crítico] Validar colunas exibidas na visualização em lista — TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

Passo a passo para reprodução
  Pré: Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Existem painéis previamente cadastrados na organização
  1. Acessar a aba 'Painéis' em Configurações > Menu no modo 'Lista'
  2. Verificar a coluna 'Ativo'
  3. Verificar a coluna 'Ações'

Comportamento esperado
Tabela exibe os cabeçalhos: 'Nome', 'Descrição', 'Provedora', 'Data de criação', 'Ativo', 'Ações'

Comportamento atual
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.

Informações
- URL: https://widgets.stage.twygoead.com/
- Login: ${TWYGO_STAGING_WIDGETS_EMAIL}
- Senha: ${TWYGO_STAGING_WIDGETS_PASSWORD}
- ID do ambiente (orgId): 36988
- Outros:
  - Browser: chromium
  - runId: listagem-de-paineis_20260508-151305
  - Duração até a falha: 39.61s
  - Step impactado: 1. 1. Acessar a listagem de Painéis em modo 'Lista'

Evidências
- Screenshot capturado pelo Playwright (screenshot): ../../test-artifacts/projects-widgets-tests-fea-e73d6-as-na-visualização-em-lista-chromium/test-failed-1.png
- Snapshot do DOM/contexto da página (error-context.md): ../../test-artifacts/projects-widgets-tests-fea-e73d6-as-na-visualização-em-lista-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: ../../test-artifacts/projects-widgets-tests-fea-e73d6-as-na-visualização-em-lista-chromium/trace.zip

Execução
- runId: listagem-de-paineis_20260508-151305
- environment.json: staging-widgets
- testsuite: Listagem de painéis
- testcase: Validar colunas exibidas na visualização em lista

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('tab', { name: 'Painéis' }) to be visible

```

</details>

---

### ✅ Aprovado · Validar componentes obrigatórios da listagem de painéis · 🔴 Crítico

<a id="validar-componentes-obrigatorios-da-listagem-de-paineis"></a>_Arquivo:_ `validar-componentes-obrigatorios.spec.ts` · _Duração:_ 9.76s · _Browser:_ chromium

**Sumário (objetivo do caso):** Verificar presença de botão Adicionar, campo de pesquisa e visualizações lista/cards (R2).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ 5. Verificar grid de cards renderiza com pelo menos 1 painel | — | ✅ | — | 0.41s |
| 1 | Acessar a aba 'Painéis' em Configurações > Menu | Listagem de painéis é exibida | ✅ | — | 7.80s |
| 2 | Verificar a presença do botão de criação | Botão '+ Adicionar' é exibido no topo da listagem | ✅ | — | 0.11s |
| 3 | Verificar a presença do campo de pesquisa | Campo de pesquisa é exibido no topo da listagem | ✅ | — | 0.03s |
| 4 | Verificar os modos de visualização disponíveis | Controles 'Lista' e 'Cards' são exibidos; modo 'Lista' está selecionado por padrão | ✅ | — | 0.02s |

**Evidências:**

_Sem evidências anexadas._


---
