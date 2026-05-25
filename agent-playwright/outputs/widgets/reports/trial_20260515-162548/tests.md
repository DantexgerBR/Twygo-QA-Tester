# Casos de teste — Widgets

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Trial

_4 caso(s) — 2 aprovado(s), 2 falha(s)_

### ✅ Aprovado · TC2 · Criação de trial via API com painéis pré-definidos · 🔴 Crítico

<a id="criacao-de-trial-via-api-com-paineis-pre-definidos"></a>_Arquivo:_ `criacao-trial-api-paineis-predefinidos.spec.ts` · _Duração:_ 42.23s · _Browser:_ chromium

**Sumário (objetivo do caso):** Validar inclusão via API.

**Pré-condições:**

```
Ambiente Stage configurado Token de acesso válido para 'https://stage.twygo.com/api/v2/external_onboarding'
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Enviar POST 'https://stage.twygo.com/api/v2/external_onboarding' com payload de criação de trial | API responde com status 201/200 e cria o trial | ✅ | — | 0.36s |
| 2 | Realizar login no trial criado como Admin | Usuário acessa o trial | ✅ | — | 2.09s |
| 3 | Acessar a aba 'Painéis' | Listagem exibe os painéis pré-definidos do trial<br /> E também os demais painéis criados na base cópia | ✅ | — | 10.05s |
| 4 | Acessar o menu de painéis como aluno do novo ambiente | Menu é acessado com sucesso | ✅ | — | 9.46s |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/`](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/)

- 📸 **Screenshot (step-01-1-pr--condi-o-Trial-criada-via-API-external_onboarding-assum)** — [`step-01-1-pr--condi-o-Trial-criada-via-API-external-onboarding-assum-cd4f91d8ad004bc8f964e910c5e0674a860b8f6b.png`](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/step-01-1-pr--condi-o-Trial-criada-via-API-external-onboarding-assum-cd4f91d8ad004bc8f964e910c5e0674a860b8f6b.png)

  ![](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/step-01-1-pr--condi-o-Trial-criada-via-API-external-onboarding-assum-cd4f91d8ad004bc8f964e910c5e0674a860b8f6b.png)

- 📸 **Screenshot (step-02-2-Realizar-login-no-trial-criado-como-Admin)** — [`step-02-2-Realizar-login-no-trial-criado-como-Admin-00c891f6c22c46e8a257e378b7dc45b1ffe903f3.png`](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/step-02-2-Realizar-login-no-trial-criado-como-Admin-00c891f6c22c46e8a257e378b7dc45b1ffe903f3.png)

  ![](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/step-02-2-Realizar-login-no-trial-criado-como-Admin-00c891f6c22c46e8a257e378b7dc45b1ffe903f3.png)

- 📸 **Screenshot (step-03-3-Acessar-a-aba-Pain-is-listagem-exibe-os-pain-is)** — [`step-03-3-Acessar-a-aba-Pain-is-listagem-exibe-os-pain-is-73692bfb2d482213b971c24670ea0ab68100802a.png`](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/step-03-3-Acessar-a-aba-Pain-is-listagem-exibe-os-pain-is-73692bfb2d482213b971c24670ea0ab68100802a.png)

  ![](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/step-03-3-Acessar-a-aba-Pain-is-listagem-exibe-os-pain-is-73692bfb2d482213b971c24670ea0ab68100802a.png)

- 📸 **Screenshot (step-04-4-Acessar-o-menu-de-pain-is-como-aluno-do-novo-ambiente)** — [`step-04-4-Acessar-o-menu-de-pain-is-como-aluno-do-novo-ambiente-769c1fb01cc571508c1d1e33e347ae6f017d6ac4.png`](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/step-04-4-Acessar-o-menu-de-pain-is-como-aluno-do-novo-ambiente-769c1fb01cc571508c1d1e33e347ae6f017d6ac4.png)

  ![](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/step-04-4-Acessar-o-menu-de-pain-is-como-aluno-do-novo-ambiente-769c1fb01cc571508c1d1e33e347ae6f017d6ac4.png)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/test-finished-1.png)

  ![](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/widgets/reports/trial_20260515-162548/artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-widgets-tests-fea-c77b9-I-com-painéis-pré-definidos-chromium/video-1.webm)


---

### ✅ Aprovado · TC1 · Criação de trial via URL com painéis pré-definidos · 🔴 Crítico

<a id="criacao-de-trial-via-url-com-paineis-pre-definidos"></a>_Arquivo:_ `criacao-trial-url-paineis-predefinidos.spec.ts` · _Duração:_ 42.29s · _Browser:_ chromium

**Sumário (objetivo do caso):** Validar inclusão de painéis na criação de trial (Dev 8.4, QA 11.3).

**Pré-condições:**

```
Ambiente Stage configurado Ambiente de base cópia com Painéis com abas configurados completamente (utilizando todas as configurações de abas e widgets possíveis)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a URL 'https://stage.twygoead.com/new/register/steps?1' e completar o cadastro | Trial é criado com sucesso | ✅ | — | 0.37s |
| 2 | Realizar login no trial recém-criado como Admin | Usuário acessa o trial<br /> Ambiente é populado corretamente | ✅ | — | 2.01s |
| 3 | Acessar a aba 'Painéis' em Configurações > Menu | Listagem exibe os painéis pré-definidos do trial (dashboard do aluno migrado)<br /> E também os demais painéis criados na base cópia | ✅ | — | 10.01s |
| 4 | Acessar o menu de painéis como aluno do novo ambiente | Menu é acessado com sucesso | ✅ | — | 9.65s |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/`](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/)

- 📸 **Screenshot (step-01-1-pr--condi-o-Trial-criada-via-URL-new-register-steps-assumi)** — [`step-01-1-pr--condi-o-Trial-criada-via-URL-new-register-steps-assumi-00cd74b76dee1f6cdca023522913b4ff2a5c9ebe.png`](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/step-01-1-pr--condi-o-Trial-criada-via-URL-new-register-steps-assumi-00cd74b76dee1f6cdca023522913b4ff2a5c9ebe.png)

  ![](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/step-01-1-pr--condi-o-Trial-criada-via-URL-new-register-steps-assumi-00cd74b76dee1f6cdca023522913b4ff2a5c9ebe.png)

- 📸 **Screenshot (step-02-2-Realizar-login-no-trial-rec-m-criado-como-Admin)** — [`step-02-2-Realizar-login-no-trial-rec-m-criado-como-Admin-8833e3d6d6e25293094fec4cbdc3be3a1d8910d4.png`](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/step-02-2-Realizar-login-no-trial-rec-m-criado-como-Admin-8833e3d6d6e25293094fec4cbdc3be3a1d8910d4.png)

  ![](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/step-02-2-Realizar-login-no-trial-rec-m-criado-como-Admin-8833e3d6d6e25293094fec4cbdc3be3a1d8910d4.png)

- 📸 **Screenshot (step-03-3-Acessar-a-aba-Pain-is-em-Configura-es-Menu-listagem-render)** — [`step-03-3-Acessar-a-aba-Pain-is-em-Configura-es-Menu-listagem-render-44933dc754b0dbdc7a48f0a51700c2336b455832.png`](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/step-03-3-Acessar-a-aba-Pain-is-em-Configura-es-Menu-listagem-render-44933dc754b0dbdc7a48f0a51700c2336b455832.png)

  ![](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/step-03-3-Acessar-a-aba-Pain-is-em-Configura-es-Menu-listagem-render-44933dc754b0dbdc7a48f0a51700c2336b455832.png)

- 📸 **Screenshot (step-04-4-Acessar-o-menu-de-pain-is-como-aluno-do-novo-ambiente)** — [`step-04-4-Acessar-o-menu-de-pain-is-como-aluno-do-novo-ambiente-913449a5a6ea79a92380dfa62a443c66287acdfa.png`](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/step-04-4-Acessar-o-menu-de-pain-is-como-aluno-do-novo-ambiente-913449a5a6ea79a92380dfa62a443c66287acdfa.png)

  ![](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/step-04-4-Acessar-o-menu-de-pain-is-como-aluno-do-novo-ambiente-913449a5a6ea79a92380dfa62a443c66287acdfa.png)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/test-finished-1.png)

  ![](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/widgets/reports/trial_20260515-162548/artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-widgets-tests-fea-3d5d6-L-com-painéis-pré-definidos-chromium/video-1.webm)


---

### ❌ Falhou · TC4 · Exclusão de trial: dados criados pelo Admin removidos · 🔴 Crítico

<a id="exclusao-de-trial-dados-criados-pelo-admin-removidos"></a>_Arquivo:_ `exclusao-trial-dados-admin.spec.ts` · _Duração:_ 119.58s · _Browser:_ chromium

> **❌ Por que falhou:** Error: expect(locator).toHaveCount(expected) failed
> _Step impactado:_ **2. Verificar base após exclusão — painel do Admin removido junto com pré-definidos**

**Sumário (objetivo do caso):** Validar limpeza de dados manuais do Admin.

**Pré-condições:**

```
Trial criado, Admin criou painel 'Painel do Admin Trial'
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ Pré: Admin cria painel manual | — | ✅ | — | 33.65s |
| 1 | Executar a rotina de exclusão do trial | Rotina executa | ✅ | — | 1.24s |
| 2 | Verificar a base após exclusão | Painel 'Painel do Admin Trial' (criado manualmente) também é removido junto com pré-definidos | ❌ | Error: expect(locator).toHaveCount(expected) failed | 66.80s |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/`](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/)

- 📸 **Screenshot (step-01-Pr-Admin-cria-painel-manual)** — [`step-01-Pr-Admin-cria-painel-manual-756cd11c999322719fcfb47c15226dc614901d65.png`](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/step-01-Pr-Admin-cria-painel-manual-756cd11c999322719fcfb47c15226dc614901d65.png)

  ![](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/step-01-Pr-Admin-cria-painel-manual-756cd11c999322719fcfb47c15226dc614901d65.png)

- 📸 **Screenshot (step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Toda)** — [`step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Toda-fce8fa9c812b38f2303ca62ecd2d64bd29667fc4.png`](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Toda-fce8fa9c812b38f2303ca62ecd2d64bd29667fc4.png)

  ![](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Toda-fce8fa9c812b38f2303ca62ecd2d64bd29667fc4.png)

- 📸 **Screenshot (screenshot)** — [`test-failed-1.png`](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/test-failed-1.png)

  ![](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/test-failed-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/widgets/reports/trial_20260515-162548/artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video-1.webm)

- 📄 **DOM no momento da falha** — [`error-context.md`](artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/error-context.md)

#### 🐛 Pronto para registro de bug

**Descrição do BUG:** [Crítico] Exclusão de trial: dados criados pelo Admin removidos — Error: expect(locator).toHaveCount(expected) failed

**Passo a passo para reprodução:**
1. Pré: Trial criado, Admin criou painel 'Painel do Admin Trial'
1. 1. Executar a rotina de exclusão do trial
1. 2. Verificar a base após exclusão

**Comportamento esperado:** 1. Rotina executa | 2. Painel 'Painel do Admin Trial' (criado manualmente) também é removido junto com pré-definidos

**Comportamento atual:** Error: expect(locator).toHaveCount(expected) failed

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://trialagentsqa5.stage.twygoead.com/` |
| Login | ${TWYGO_TRIAL_AGENTSQA_OTHER_EMAIL} (Trial widgets / legacy-reuse) |
| Senha | ${TWYGO_TRIAL_AGENTSQA_OTHER_PASSWORD} |
| orgId | 36981 |
| Env (override via annotation) | `trial-agentsqa-other (Trial widgets)` |
| Outros | Browser: chromium |
| Outros | runId: trial_20260515-162548 |
| Outros | Duração até a falha: 119.58s |
| Outros | Step impactado: 3. 2. Verificar base após exclusão — painel do Admin removido junto com pré-definidos |

**Evidências:**

- Screenshot capturado pelo Playwright (step-01-Pr-Admin-cria-painel-manual): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/step-01-Pr-Admin-cria-painel-manual-756cd11c999322719fcfb47c15226dc614901d65.png
- Screenshot capturado pelo Playwright (step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Toda): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Toda-fce8fa9c812b38f2303ca62ecd2d64bd29667fc4.png
- Screenshot capturado pelo Playwright (screenshot): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/test-failed-1.png
- Vídeo da execução (video-1.webm): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video-1.webm
- Vídeo da execução (video.webm): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video.webm
- Snapshot do DOM/contexto da página (error-context.md): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/trace.zip

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[Crítico] Exclusão de trial: dados criados pelo Admin removidos — Error: expect(locator).toHaveCount(expected) failed

Passo a passo para reprodução
  Pré: Trial criado, Admin criou painel 'Painel do Admin Trial'
  1. Executar a rotina de exclusão do trial
  2. Verificar a base após exclusão

Comportamento esperado
1. Rotina executa | 2. Painel 'Painel do Admin Trial' (criado manualmente) também é removido junto com pré-definidos

Comportamento atual
Error: expect(locator).toHaveCount(expected) failed

Informações
- URL: https://trialagentsqa5.stage.twygoead.com/
- Login: ${TWYGO_TRIAL_AGENTSQA_OTHER_EMAIL} (Trial widgets / legacy-reuse)
- Senha: ${TWYGO_TRIAL_AGENTSQA_OTHER_PASSWORD}
- ID do ambiente (orgId): 36981
- Outros:
  - Browser: chromium
  - runId: trial_20260515-162548
  - Duração até a falha: 119.58s
  - Step impactado: 3. 2. Verificar base após exclusão — painel do Admin removido junto com pré-definidos

Evidências
- Screenshot capturado pelo Playwright (step-01-Pr-Admin-cria-painel-manual): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/step-01-Pr-Admin-cria-painel-manual-756cd11c999322719fcfb47c15226dc614901d65.png
- Screenshot capturado pelo Playwright (step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Toda): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/step-02-1-Executar-rotina-de-exclus-o-Sophia-Excluir-informa-es-Toda-fce8fa9c812b38f2303ca62ecd2d64bd29667fc4.png
- Screenshot capturado pelo Playwright (screenshot): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/test-failed-1.png
- Vídeo da execução (video-1.webm): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video-1.webm
- Vídeo da execução (video.webm): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/video.webm
- Snapshot do DOM/contexto da página (error-context.md): artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/error-context.md
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: artifacts/projects-widgets-tests-fea-63e7b-riados-pelo-Admin-removidos-chromium/trace.zip

Execução
- runId: trial_20260515-162548
- environment.json: trial-agentsqa-other (Trial widgets)
- testsuite: Trial
- testcase: Exclusão de trial: dados criados pelo Admin removidos

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('tbody tr[data-item-name="Painel do Admin Trial w2-1778873037979"]')
Expected: 0
Received: 1
Timeout:  60000ms

Call log:
  - Expect "toHaveCount" with timeout 60000ms
  - waiting for locator('tbody tr[data-item-name="Painel do Admin Trial w2-1778873037979"]')
    63 × locator resolved to 1 element
       - unexpected value "1"

```

</details>

---

### ❌ Falhou · TC3 · Exclusão de trial: dados pré-definidos da SophiaTech removidos · 🔴 Crítico

<a id="exclusao-de-trial-dados-pre-definidos-da-sophiatech-removidos"></a>_Arquivo:_ `exclusao-trial-dados-sophiatech.spec.ts` · _Duração:_ 89.22s · _Browser:_ chromium

> **❌ Por que falhou:** Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=5, final=6).
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
| — | _Pré-condição:_ Pré: contar painéis pré-definidos atuais | — | ✅ | — | 9.18s |
| 1 | Executar a rotina de exclusão do trial | Rotina executa | ✅ | — | 2.03s |
| 2 | Verificar a base de dados após exclusão | Todos os registros pré-definidos da SophiaTech (painéis, abas, widgets) são removidos da organização-trial | ❌ | Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=5, final=6). | 60.02s |

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
  npx playwright show-trace outputs/widgets/reports/trial_20260515-162548/artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/video-1.webm)

- 📄 **DOM no momento da falha** — [`error-context.md`](artifacts/projects-widgets-tests-fea-eaa8f-dos-da-SophiaTech-removidos-chromium/error-context.md)

#### 🐛 Pronto para registro de bug

**Descrição do BUG:** [Crítico] Exclusão de trial: dados pré-definidos da SophiaTech removidos — Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=5, final=6).

**Passo a passo para reprodução:**
1. Pré: Trial criado e populado com painéis e abas
1. 1. Executar a rotina de exclusão do trial
1. 2. Verificar a base de dados após exclusão

**Comportamento esperado:** 1. Rotina executa | 2. Todos os registros pré-definidos da SophiaTech (painéis, abas, widgets) são removidos da organização-trial

**Comportamento atual:** Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=5, final=6).

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://trialagentsqa5.stage.twygoead.com/` |
| Login | ${TWYGO_TRIAL_AGENTSQA_OTHER_EMAIL} (Trial widgets / legacy-reuse) |
| Senha | ${TWYGO_TRIAL_AGENTSQA_OTHER_PASSWORD} |
| orgId | 36981 |
| Env (override via annotation) | `trial-agentsqa-other (Trial widgets)` |
| Outros | Browser: chromium |
| Outros | runId: trial_20260515-162548 |
| Outros | Duração até a falha: 89.22s |
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
[Crítico] Exclusão de trial: dados pré-definidos da SophiaTech removidos — Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=5, final=6).

Passo a passo para reprodução
  Pré: Trial criado e populado com painéis e abas
  1. Executar a rotina de exclusão do trial
  2. Verificar a base de dados após exclusão

Comportamento esperado
1. Rotina executa | 2. Todos os registros pré-definidos da SophiaTech (painéis, abas, widgets) são removidos da organização-trial

Comportamento atual
Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=5, final=6).

Informações
- URL: https://trialagentsqa5.stage.twygoead.com/
- Login: ${TWYGO_TRIAL_AGENTSQA_OTHER_EMAIL} (Trial widgets / legacy-reuse)
- Senha: ${TWYGO_TRIAL_AGENTSQA_OTHER_PASSWORD}
- ID do ambiente (orgId): 36981
- Outros:
  - Browser: chromium
  - runId: trial_20260515-162548
  - Duração até a falha: 89.22s
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
- runId: trial_20260515-162548
- environment.json: trial-agentsqa-other (Trial widgets)
- testsuite: Trial
- testcase: Exclusão de trial: dados pré-definidos da SophiaTech removidos

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=5, final=6).

expect(received).toBeLessThan(expected)

Expected: < 5
Received:   6

Call Log:
- Timeout 60000ms exceeded while waiting on the predicate
```

</details>

---
