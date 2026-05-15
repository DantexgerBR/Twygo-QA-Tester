# Casos de teste — Widgets

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Trial

_4 caso(s) — 0 aprovado(s), 2 falha(s), 2 ignorado(s)_

### ⊘ Ignorado · TC2 · Criação de trial via API com painéis pré-definidos · 🔴 Crítico

<a id="criacao-de-trial-via-api-com-paineis-pre-definidos"></a>_Arquivo:_ `criacao-trial-api-paineis-predefinidos.spec.ts` · _Duração:_ 1.33s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): Out-of-scope para Playwright: validação via API direta pertence a uma API test suite ou contract test. Ver _README.md.

**Sumário (objetivo do caso):** Validar inclusão via API.

**Pré-condições:**

```
Ambiente Stage configurado Token de acesso válido para 'https://stage.twygo.com/api/v2/external_onboarding'
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Enviar POST 'https://stage.twygo.com/api/v2/external_onboarding' com payload de criação de trial | API responde com status 201/200 e cria o trial | ⊘ | Step não executado — Marcado para revisão (test.fixme): Out-of-scope para Playwright: validação via API direta pertence a uma API test suite ou contract test. Ver _README.md. | — |
| 2 | Realizar login no trial criado como Admin | Usuário acessa o trial | ⊘ | Step não executado — Marcado para revisão (test.fixme): Out-of-scope para Playwright: validação via API direta pertence a uma API test suite ou contract test. Ver _README.md. | — |
| 3 | Acessar a aba 'Painéis' | Listagem exibe os painéis pré-definidos do trial<br /> E também os demais painéis criados na base cópia | ⊘ | Step não executado — Marcado para revisão (test.fixme): Out-of-scope para Playwright: validação via API direta pertence a uma API test suite ou contract test. Ver _README.md. | — |
| 4 | Acessar o menu de painéis como aluno do novo ambiente | Menu é acessado com sucesso | ⊘ | Step não executado — Marcado para revisão (test.fixme): Out-of-scope para Playwright: validação via API direta pertence a uma API test suite ou contract test. Ver _README.md. | — |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/`](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/test-finished-1.png)

  ![](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/widgets/reports/trial_20260515-130625/artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/video-1.webm)

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo do skip / fixme:** Out-of-scope para Playwright: validação via API direta pertence a uma API test suite ou contract test. Ver _README.md.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado Token de acesso válido para 'https://stage.twygo.com/api/v2/external_onboarding'
1. 1. Enviar POST 'https://stage.twygo.com/api/v2/external_onboarding' com payload de criação de trial
1. 2. Realizar login no trial criado como Admin
1. 3. Acessar a aba 'Painéis'
1. 4. Acessar o menu de painéis como aluno do novo ambiente

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC1 · Criação de trial via URL com painéis pré-definidos · 🔴 Crítico

<a id="criacao-de-trial-via-url-com-paineis-pre-definidos"></a>_Arquivo:_ `criacao-trial-url-paineis-predefinidos.spec.ts` · _Duração:_ 1.29s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): Criação de trial requer setup Super Admin com impacto em estado global. Estratégia de revert/isolamento pendente. Ver _README.md.

**Sumário (objetivo do caso):** Validar inclusão de painéis na criação de trial (Dev 8.4, QA 11.3).

**Pré-condições:**

```
Ambiente Stage configurado Ambiente de base cópia com Painéis com abas configurados completamente (utilizando todas as configurações de abas e widgets possíveis)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a URL 'https://stage.twygoead.com/new/register/steps?1' e completar o cadastro | Trial é criado com sucesso | ⊘ | Step não executado — Marcado para revisão (test.fixme): Criação de trial requer setup Super Admin com impacto em estado global. Estratégia de revert/isolamento pendente. Ver _README.md. | — |
| 2 | Realizar login no trial recém-criado como Admin | Usuário acessa o trial<br /> Ambiente é populado corretamente | ⊘ | Step não executado — Marcado para revisão (test.fixme): Criação de trial requer setup Super Admin com impacto em estado global. Estratégia de revert/isolamento pendente. Ver _README.md. | — |
| 3 | Acessar a aba 'Painéis' em Configurações > Menu | Listagem exibe os painéis pré-definidos do trial (dashboard do aluno migrado)<br /> E também os demais painéis criados na base cópia | ⊘ | Step não executado — Marcado para revisão (test.fixme): Criação de trial requer setup Super Admin com impacto em estado global. Estratégia de revert/isolamento pendente. Ver _README.md. | — |
| 4 | Acessar o menu de painéis como aluno do novo ambiente | Menu é acessado com sucesso | ⊘ | Step não executado — Marcado para revisão (test.fixme): Criação de trial requer setup Super Admin com impacto em estado global. Estratégia de revert/isolamento pendente. Ver _README.md. | — |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/`](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/test-finished-1.png)

  ![](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/widgets/reports/trial_20260515-130625/artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/video-1.webm)

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo do skip / fixme:** Criação de trial requer setup Super Admin com impacto em estado global. Estratégia de revert/isolamento pendente. Ver _README.md.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado Ambiente de base cópia com Painéis com abas configurados completamente (utilizando todas as configurações de abas e widgets possíveis)
1. 1. Acessar a URL 'https://stage.twygoead.com/new/register/steps?1' e completar o cadastro
1. 2. Realizar login no trial recém-criado como Admin
1. 3. Acessar a aba 'Painéis' em Configurações > Menu
1. 4. Acessar o menu de painéis como aluno do novo ambiente

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ❌ Falhou · TC4 · Exclusão de trial: dados criados pelo Admin removidos · 🔴 Crítico

<a id="exclusao-de-trial-dados-criados-pelo-admin-removidos"></a>_Arquivo:_ `exclusao-trial-dados-admin.spec.ts` · _Duração:_ 31.65s · _Browser:_ chromium

> **❌ Por que falhou:** O elemento esperado não apareceu na tela (locator: locator('tbody tr').filter({ has: locator('td:first-child p').filter({ hasText: /^Painel do Admin Trial$/ }) })).
> _Step impactado:_ **Pré: Admin cria "Painel do Admin Trial"**

**Sumário (objetivo do caso):** Validar limpeza de dados manuais do Admin.

**Pré-condições:**

```
Trial criado, Admin criou painel 'Painel do Admin Trial'
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ Pré: Admin cria "Painel do Admin Trial" | — | ❌ | O elemento esperado não apareceu na tela (locator: locator('tbody tr').filter({ has: locator('td:first-child p').filter({ hasText: /^Painel do Admin Trial$/ }) })). | 20.04s |
| 1 | Executar a rotina de exclusão do trial | Rotina executa | ⊘ | Step não executado: o teste foi interrompido antes. Causa: O elemento esperado não apareceu na tela (locator: locator('tbody tr').filter({ has: locator('td:first-child p').filter({ hasText: /^Painel do Admin Trial$/ }) })).. | — |
| 2 | Verificar a base após exclusão | Painel 'Painel do Admin Trial' (criado manualmente) também é removido junto com pré-definidos | ⊘ | Step não executado: o teste foi interrompido antes. Causa: O elemento esperado não apareceu na tela (locator: locator('tbody tr').filter({ has: locator('td:first-child p').filter({ hasText: /^Painel do Admin Trial$/ }) })).. | — |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/`](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/)

- 📸 **Screenshot (screenshot)** — [`test-failed-1.png`](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/test-failed-1.png)

  ![](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/test-failed-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/widgets/reports/trial_20260515-130625/artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video-1.webm)

- 📄 **DOM no momento da falha** — [`error-context.md`](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/error-context.md)

#### 🐛 Pronto para registro de bug

**Descrição do BUG:** [Crítico] Exclusão de trial: dados criados pelo Admin removidos — O elemento esperado não apareceu na tela (locator: locator('tbody tr').filter({ has: locator('td:first-child p').filter({ hasText: /^Painel do Admin Trial$/ }) })).

**Passo a passo para reprodução:**
1. Pré: Trial criado, Admin criou painel 'Painel do Admin Trial'
1. 1. Executar a rotina de exclusão do trial
1. 2. Verificar a base após exclusão

**Comportamento esperado:** Rotina executa

**Comportamento atual:** O elemento esperado não apareceu na tela (locator: locator('tbody tr').filter({ has: locator('td:first-child p').filter({ hasText: /^Painel do Admin Trial$/ }) })).

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://widgets.stage.twygoead.com/` |
| Login | ${TWYGO_STAGING_WIDGETS_EMAIL} |
| Senha | ${TWYGO_STAGING_WIDGETS_PASSWORD} |
| orgId | 36981 |
| Outros | Browser: chromium |
| Outros | runId: trial_20260515-130625 |
| Outros | Duração até a falha: 31.65s |
| Outros | Step impactado: 1. Pré: Admin cria "Painel do Admin Trial" |

**Evidências:**

- Screenshot capturado pelo Playwright (screenshot): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/test-failed-1.png
- Vídeo da execução (video-1.webm): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video-1.webm
- Vídeo da execução (video.webm): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video.webm
- Snapshot do DOM/contexto da página (error-context.md): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/trace.zip

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[Crítico] Exclusão de trial: dados criados pelo Admin removidos — O elemento esperado não apareceu na tela (locator: locator('tbody tr').filter({ has: locator('td:first-child p').filter({ hasText: /^Painel do Admin Trial$/ }) })).

Passo a passo para reprodução
  Pré: Trial criado, Admin criou painel 'Painel do Admin Trial'
  1. Executar a rotina de exclusão do trial
  2. Verificar a base após exclusão

Comportamento esperado
Rotina executa

Comportamento atual
O elemento esperado não apareceu na tela (locator: locator('tbody tr').filter({ has: locator('td:first-child p').filter({ hasText: /^Painel do Admin Trial$/ }) })).

Informações
- URL: https://widgets.stage.twygoead.com/
- Login: ${TWYGO_STAGING_WIDGETS_EMAIL}
- Senha: ${TWYGO_STAGING_WIDGETS_PASSWORD}
- ID do ambiente (orgId): 36981
- Outros:
  - Browser: chromium
  - runId: trial_20260515-130625
  - Duração até a falha: 31.65s
  - Step impactado: 1. Pré: Admin cria "Painel do Admin Trial"

Evidências
- Screenshot capturado pelo Playwright (screenshot): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/test-failed-1.png
- Vídeo da execução (video-1.webm): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video-1.webm
- Vídeo da execução (video.webm): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video.webm
- Snapshot do DOM/contexto da página (error-context.md): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/trace.zip

Execução
- runId: trial_20260515-130625
- environment.json: staging-widgets
- testsuite: Trial
- testcase: Exclusão de trial: dados criados pelo Admin removidos

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
Error: expect(locator).toBeVisible() failed

Locator: locator('tbody tr').filter({ has: locator('td:first-child p').filter({ hasText: /^Painel do Admin Trial$/ }) })
Expected: visible
Error: strict mode violation: locator('tbody tr').filter({ has: locator('td:first-child p').filter({ hasText: /^Painel do Admin Trial$/ }) }) resolved to 5 elements:
    1) <tr class="css-0" data-item-id="803698" data-item-name="Painel do Admin Trial">…</tr> aka getByRole('row', { name: 'Painel do Admin Trial 15/05/' }).first()
    2) <tr class="css-0" data-item-id="803696" data-item-name="Painel do Admin Trial">…</tr> aka getByRole('row', { name: 'Painel do Admin Trial 15/05/' }).nth(1)
    3) <tr class="css-0" data-item-id="803695" data-item-name="Painel do Admin Trial">…</tr> aka getByRole('row', { name: 'Painel do Admin Trial 15/05/' }).nth(2)
    4) <tr class="css-0" data-item-id="803694" data-item-name="Painel do Admin Trial">…</tr> aka getByRole('row', { name: 'Painel do Admin Trial 15/05/' }).nth(3)
    5) <tr class="css-0" data-item-id="803691" data-item-name="Painel do Admin Trial">…</tr> aka getByRole('row', { name: 'Painel do Admin Trial 15/05/' }).nth(4)

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('tbody tr').filter({ has: locator('td:first-child p').filter({ hasText: /^Painel do Admin Trial$/ }) })

```

</details>

---

### ❌ Falhou · TC3 · Exclusão de trial: dados pré-definidos da SophiaTech removidos · 🔴 Crítico

<a id="exclusao-de-trial-dados-pre-definidos-da-sophiatech-removidos"></a>_Arquivo:_ `exclusao-trial-dados-sophiatech.spec.ts` · _Duração:_ 23.46s · _Browser:_ chromium

> **❌ Por que falhou:** Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=4, final=4).
> _Step impactado:_ **2. Verificar base após exclusão — registros SophiaTech removidos**

**Sumário (objetivo do caso):** Validar limpeza completa na exclusão do trial.

**Pré-condições:**

```
Trial criado e populado com painéis e abas
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ Pré: contar painéis pré-definidos atuais | — | ✅ | — | 5.30s |
| 1 | Executar a rotina de exclusão do trial | Rotina executa | ✅ | — | 1.11s |
| 2 | Verificar a base de dados após exclusão | Todos os registros pré-definidos da SophiaTech (painéis, abas, widgets) são removidos da organização-trial | ❌ | Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=4, final=4). | 4.86s |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/`](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/)

- 📸 **Screenshot (step-01-Pr-contar-pain-is-pr--definidos-atuais)** — [`step-01-Pr-contar-pain-is-pr--definidos-atuais-b55d7fcda8710bdae5ec93ef53e746442307a39a.png`](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/step-01-Pr-contar-pain-is-pr--definidos-atuais-b55d7fcda8710bdae5ec93ef53e746442307a39a.png)

  ![](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/step-01-Pr-contar-pain-is-pr--definidos-atuais-b55d7fcda8710bdae5ec93ef53e746442307a39a.png)

- 📸 **Screenshot (step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Soph)** — [`step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Soph-5b3cb949394a80baa57e5bf64e84d07f8113d19f.png`](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Soph-5b3cb949394a80baa57e5bf64e84d07f8113d19f.png)

  ![](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Soph-5b3cb949394a80baa57e5bf64e84d07f8113d19f.png)

- 📸 **Screenshot (screenshot)** — [`test-failed-1.png`](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/test-failed-1.png)

  ![](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/test-failed-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/widgets/reports/trial_20260515-130625/artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/video-1.webm)

- 📄 **DOM no momento da falha** — [`error-context.md`](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/error-context.md)

#### 🐛 Pronto para registro de bug

**Descrição do BUG:** [Crítico] Exclusão de trial: dados pré-definidos da SophiaTech removidos — Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=4, final=4).

**Passo a passo para reprodução:**
1. Pré: Trial criado e populado com painéis e abas
1. 1. Executar a rotina de exclusão do trial
1. 2. Verificar a base de dados após exclusão

**Comportamento esperado:** 1. Rotina executa | 2. Todos os registros pré-definidos da SophiaTech (painéis, abas, widgets) são removidos da organização-trial

**Comportamento atual:** Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=4, final=4).

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://widgets.stage.twygoead.com/` |
| Login | ${TWYGO_STAGING_WIDGETS_EMAIL} |
| Senha | ${TWYGO_STAGING_WIDGETS_PASSWORD} |
| orgId | 36981 |
| Outros | Browser: chromium |
| Outros | runId: trial_20260515-130625 |
| Outros | Duração até a falha: 23.46s |
| Outros | Step impactado: 3. 2. Verificar base após exclusão — registros SophiaTech removidos |

**Evidências:**

- Screenshot capturado pelo Playwright (step-01-Pr-contar-pain-is-pr--definidos-atuais): artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/step-01-Pr-contar-pain-is-pr--definidos-atuais-b55d7fcda8710bdae5ec93ef53e746442307a39a.png
- Screenshot capturado pelo Playwright (step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Soph): artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Soph-5b3cb949394a80baa57e5bf64e84d07f8113d19f.png
- Screenshot capturado pelo Playwright (screenshot): artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/test-failed-1.png
- Vídeo da execução (video-1.webm): artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/video-1.webm
- Vídeo da execução (video.webm): artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/video.webm
- Snapshot do DOM/contexto da página (error-context.md): artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/trace.zip

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[Crítico] Exclusão de trial: dados pré-definidos da SophiaTech removidos — Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=4, final=4).

Passo a passo para reprodução
  Pré: Trial criado e populado com painéis e abas
  1. Executar a rotina de exclusão do trial
  2. Verificar a base de dados após exclusão

Comportamento esperado
1. Rotina executa | 2. Todos os registros pré-definidos da SophiaTech (painéis, abas, widgets) são removidos da organização-trial

Comportamento atual
Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=4, final=4).

Informações
- URL: https://widgets.stage.twygoead.com/
- Login: ${TWYGO_STAGING_WIDGETS_EMAIL}
- Senha: ${TWYGO_STAGING_WIDGETS_PASSWORD}
- ID do ambiente (orgId): 36981
- Outros:
  - Browser: chromium
  - runId: trial_20260515-130625
  - Duração até a falha: 23.46s
  - Step impactado: 3. 2. Verificar base após exclusão — registros SophiaTech removidos

Evidências
- Screenshot capturado pelo Playwright (step-01-Pr-contar-pain-is-pr--definidos-atuais): artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/step-01-Pr-contar-pain-is-pr--definidos-atuais-b55d7fcda8710bdae5ec93ef53e746442307a39a.png
- Screenshot capturado pelo Playwright (step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Soph): artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Soph-5b3cb949394a80baa57e5bf64e84d07f8113d19f.png
- Screenshot capturado pelo Playwright (screenshot): artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/test-failed-1.png
- Vídeo da execução (video-1.webm): artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/video-1.webm
- Vídeo da execução (video.webm): artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/video.webm
- Snapshot do DOM/contexto da página (error-context.md): artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/trace.zip

Execução
- runId: trial_20260515-130625
- environment.json: staging-widgets
- testsuite: Trial
- testcase: Exclusão de trial: dados pré-definidos da SophiaTech removidos

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=4, final=4).

expect(received).toBeLessThan(expected)

Expected: < 4
Received:   4
```

</details>

---
