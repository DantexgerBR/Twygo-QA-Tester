# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Reinscrição pelo Aluno (Play e Link Público)

_7 caso(s) — 0 aprovado(s), 0 falha(s), 7 ignorado(s)_

### ⊘ Ignorado · TC1 · Botão "Reinscreva-se" aparece no banner do Play para aluno elegível · 🔴 Crítico

<a id="tc1-botao-reinscreva-se-aparece-no-banner-do-play-para-aluno-elegivel"></a>_Arquivo:_ `tc1-banner-reinscreva-se-aluno-elegivel.spec.ts` · _Duração:_ 1.65s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (curso com has_recertification=true + participant elegível).

**Sumário (objetivo do caso):** Validar exibição do botão "Reinscreva-se" no banner do Play, abaixo do botão original, para aluno elegível com flag e gate ON (RN 16, 16.1).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Aluno "Aluno Play Reinscrição w{workerIndex}" cadastrado e elegível (progresso 100% ou expirado)
Aluno "Aluno Play Inelegível w{workerIndex}" cadastrado mas em andamento
Pacote com link público gerado em "/play/.../course_registrations"
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Login com o aluno "Aluno Play Reinscrição w{workerIndex}" | Aluno autenticado e redirecionado ao Play. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (curso com has_recertification=true + participant elegível). | — |
| 2 | Acessar a página do curso elegível no Play em "/play/event/{eventId}" | Página do curso é exibida; banner principal contém o botão original (acesso/inscrição). | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (curso com has_recertification=true + participant elegível). | — |
| 3 | Inspecionar o banner do Play | Banner exibe DOIS botões empilhados: botão original em cima + botão "Reinscreva-se" abaixo. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (curso com has_recertification=true + participant elegível). | — |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/`](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/test-finished-1.png)

  ![](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/recertificacao/reports/reinscricao-pelo-aluno-play-e-link-publico_20260527-085140/artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/video-1.webm)

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (curso com has_recertification=true + participant elegível).
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Aluno "Aluno Play Reinscrição w{workerIndex}" cadastrado e elegível (progresso 100% ou expirado)
1. Pré: Aluno "Aluno Play Inelegível w{workerIndex}" cadastrado mas em andamento
1. Pré: Pacote com link público gerado em "/play/.../course_registrations"
1. 1. Login com o aluno "Aluno Play Reinscrição w{workerIndex}"
1. 2. Acessar a página do curso elegível no Play em "/play/event/{eventId}"
1. 3. Inspecionar o banner do Play

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 · Botão "Reinscreva-se" NÃO aparece para aluno inelegível (sem disabled visível) · 🔴 Crítico

<a id="tc2-botao-reinscreva-se-nao-aparece-para-aluno-inelegivel-sem-disabled-visivel"></a>_Arquivo:_ `tc2-banner-nao-aparece-aluno-inelegivel.spec.ts` · _Duração:_ 1.62s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — eventIdCursoInelegivel=1 retorna 404. NEEDS_SEED (curso + participant em andamento sem expiração).

**Sumário (objetivo do caso):** Validar que aluno inelegível NÃO vê o botão (não é exibido como disabled — simplesmente sumido) (RN 16.2).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Aluno "Aluno Play Reinscrição w{workerIndex}" cadastrado e elegível (progresso 100% ou expirado)
Aluno "Aluno Play Inelegível w{workerIndex}" cadastrado mas em andamento
Pacote com link público gerado em "/play/.../course_registrations"
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Login com o aluno "Aluno Play Inelegível w{workerIndex}" | Aluno autenticado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventIdCursoInelegivel=1 retorna 404. NEEDS_SEED (curso + participant em andamento sem expiração). | — |
| 2 | Acessar a página do curso no Play em "/play/event/{eventId}" | Página do curso é exibida. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventIdCursoInelegivel=1 retorna 404. NEEDS_SEED (curso + participant em andamento sem expiração). | — |
| 3 | Inspecionar o banner do Play | Apenas o botão original (acesso/inscrição) é exibido. Botão "Reinscreva-se" NÃO está presente nem como disabled. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventIdCursoInelegivel=1 retorna 404. NEEDS_SEED (curso + participant em andamento sem expiração). | — |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/`](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/test-finished-1.png)

  ![](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/recertificacao/reports/reinscricao-pelo-aluno-play-e-link-publico_20260527-085140/artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/video-1.webm)

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** seed inválido — eventIdCursoInelegivel=1 retorna 404. NEEDS_SEED (curso + participant em andamento sem expiração).
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Aluno "Aluno Play Reinscrição w{workerIndex}" cadastrado e elegível (progresso 100% ou expirado)
1. Pré: Aluno "Aluno Play Inelegível w{workerIndex}" cadastrado mas em andamento
1. Pré: Pacote com link público gerado em "/play/.../course_registrations"
1. 1. Login com o aluno "Aluno Play Inelegível w{workerIndex}"
1. 2. Acessar a página do curso no Play em "/play/event/{eventId}"
1. 3. Inspecionar o banner do Play

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 · Click em "Reinscreva-se" dispara subscribe com `recertification=true` e cria novo participant · 🔴 Crítico

<a id="tc3-click-em-reinscreva-se-dispara-subscribe-com-recertification-true-e-cria-novo-participant"></a>_Arquivo:_ `tc3-click-reinscreva-se-dispara-subscribe.spec.ts` · _Duração:_ 1.61s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (mesmo seed do TC1).

**Sumário (objetivo do caso):** Validar fluxo de auto-reinscrição: click no botão dispara `POST /api/v1/play/.../subscribe` com `recertification=true` e o backend cria novo participant (RN 17).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Aluno "Aluno Play Reinscrição w{workerIndex}" cadastrado e elegível (progresso 100% ou expirado)
Aluno "Aluno Play Inelegível w{workerIndex}" cadastrado mas em andamento
Pacote com link público gerado em "/play/.../course_registrations"
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Login com "Aluno Play Reinscrição w{workerIndex}" e acessar a página do curso | Botão "Reinscreva-se" está visível. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (mesmo seed do TC1). | — |
| 2 | Clicar no botão "Reinscreva-se" | Request `POST /api/v1/play/.../subscribe` é enviada com body contendo `recertification: true`. Response retorna HTTP 201 com o objeto `participant` criado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (mesmo seed do TC1). | — |
| 3 | Aguardar refresh do contexto `PlaySubscriptionContext` | Banner do Play é atualizado refletindo o novo participant (`recertification_number = N+1`, `progress_score = 0`). | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (mesmo seed do TC1). | — |
| 4 | Em sessão separada como admin, acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}" | Novo participant aparece para o aluno com `recertification_number = N+1`. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (mesmo seed do TC1). | — |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/`](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/test-finished-1.png)

  ![](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/recertificacao/reports/reinscricao-pelo-aluno-play-e-link-publico_20260527-085140/artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/video-1.webm)

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (mesmo seed do TC1).
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Aluno "Aluno Play Reinscrição w{workerIndex}" cadastrado e elegível (progresso 100% ou expirado)
1. Pré: Aluno "Aluno Play Inelegível w{workerIndex}" cadastrado mas em andamento
1. Pré: Pacote com link público gerado em "/play/.../course_registrations"
1. 1. Login com "Aluno Play Reinscrição w{workerIndex}" e acessar a página do curso
1. 2. Clicar no botão "Reinscreva-se"
1. 3. Aguardar refresh do contexto `PlaySubscriptionContext`
1. 4. Em sessão separada como admin, acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}"

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC4 — Flag OFF na org: banner do Play NÃO exibe "Reinscreva-se" (regressão) 

<a id="tc4-flag-off-na-org-banner-do-play-nao-exibe-reinscreva-se-regressao"></a>_Arquivo:_ `tc4-flag-off-banner-nao-aparece.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC5 · POST em link público com `?recertification=true` para aluno elegível cria participant · 🔴 Crítico

<a id="tc5-post-em-link-publico-com-recertification-true-para-aluno-elegivel-cria-participant"></a>_Arquivo:_ `tc5-post-link-publico-aluno-elegivel-cria-participant.spec.ts` · _Duração:_ 1.14s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e eligibleStudent é placeholder. NEEDS_SEED (pacote com link público + aluno com histórico elegível).

**Sumário (objetivo do caso):** Validar fluxo de link público de pacote: POST com `recertification=true` valida elegibilidade e cria participant se elegível (RN 15).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Aluno "Aluno Play Reinscrição w{workerIndex}" cadastrado e elegível (progresso 100% ou expirado)
Aluno "Aluno Play Inelegível w{workerIndex}" cadastrado mas em andamento
Pacote com link público gerado em "/play/.../course_registrations"
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Preparar URL do pacote público com query `?recertification=true` | URL pronta: `/play/{packageSlug}/course_registrations?recertification=true`. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e eligibleStudent é placeholder. NEEDS_SEED (pacote com link público + aluno com histórico elegível). | — |
| 2 | Disparar `POST` na URL acima com payload do aluno elegível (email, nome, cpf) | Response retorna HTTP 201 com o participant criado contendo `recertification_number = N+1`. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e eligibleStudent é placeholder. NEEDS_SEED (pacote com link público + aluno com histórico elegível). | — |
| 3 | Acessar a lista de aprendizagem como admin | Aluno aparece reinscrito no curso correspondente ao pacote. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e eligibleStudent é placeholder. NEEDS_SEED (pacote com link público + aluno com histórico elegível). | — |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/`](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/test-finished-1.png)

  ![](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/recertificacao/reports/reinscricao-pelo-aluno-play-e-link-publico_20260527-085140/artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/video-1.webm)

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e eligibleStudent é placeholder. NEEDS_SEED (pacote com link público + aluno com histórico elegível).
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Aluno "Aluno Play Reinscrição w{workerIndex}" cadastrado e elegível (progresso 100% ou expirado)
1. Pré: Aluno "Aluno Play Inelegível w{workerIndex}" cadastrado mas em andamento
1. Pré: Pacote com link público gerado em "/play/.../course_registrations"
1. 1. Preparar URL do pacote público com query `?recertification=true`
1. 2. Disparar `POST` na URL acima com payload do aluno elegível (email, nome, cpf)
1. 3. Acessar a lista de aprendizagem como admin

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC6 · POST em link público com `recertification=true` para aluno inelegível retorna erro sem criar participant · 🟡 Normal

<a id="tc6-post-em-link-publico-com-recertification-true-para-aluno-inelegivel-retorna-erro-sem-criar-participant"></a>_Arquivo:_ `tc6-post-link-publico-aluno-inelegivel-erro.spec.ts` · _Duração:_ 0.82s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e ineligibleStudent é placeholder. NEEDS_SEED (mesmo pacote do TC5 + aluno em andamento).

**Sumário (objetivo do caso):** Validar resposta de erro para aluno inelegível via link público (RN 15).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Aluno "Aluno Play Reinscrição w{workerIndex}" cadastrado e elegível (progresso 100% ou expirado)
Aluno "Aluno Play Inelegível w{workerIndex}" cadastrado mas em andamento
Pacote com link público gerado em "/play/.../course_registrations"
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Preparar payload de aluno inelegível (em andamento, sem expiração) no POST com `?recertification=true` | Payload pronto. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e ineligibleStudent é placeholder. NEEDS_SEED (mesmo pacote do TC5 + aluno em andamento). | — |
| 2 | Disparar `POST /play/{packageSlug}/course_registrations?recertification=true` | Response retorna HTTP 422 com mensagem de erro do `CheckReenrollmentEligibilityUseCase`. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e ineligibleStudent é placeholder. NEEDS_SEED (mesmo pacote do TC5 + aluno em andamento). | — |
| 3 | Consultar a tabela "event_participants" via Rails console com "EventParticipant.where(user_id: X, event_id: Y).count" | Contagem permanece a anterior — nenhum novo participant criado para o par `(user_id, event_id)`. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e ineligibleStudent é placeholder. NEEDS_SEED (mesmo pacote do TC5 + aluno em andamento). | — |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/`](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/test-finished-1.png)

  ![](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/recertificacao/reports/reinscricao-pelo-aluno-play-e-link-publico_20260527-085140/artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/video-1.webm)

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Normal
- **Motivo declarado pelo spec:** seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e ineligibleStudent é placeholder. NEEDS_SEED (mesmo pacote do TC5 + aluno em andamento).
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Aluno "Aluno Play Reinscrição w{workerIndex}" cadastrado e elegível (progresso 100% ou expirado)
1. Pré: Aluno "Aluno Play Inelegível w{workerIndex}" cadastrado mas em andamento
1. Pré: Pacote com link público gerado em "/play/.../course_registrations"
1. 1. Preparar payload de aluno inelegível (em andamento, sem expiração) no POST com `?recertification=true`
1. 2. Disparar `POST /play/{packageSlug}/course_registrations?recertification=true`
1. 3. Consultar a tabela "event_participants" via Rails console com "EventParticipant.where(user_id: X, event_id: Y).count"

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC7 — POST em link público com flag OFF retorna HTTP 404 com payload vazio (regressão) 

<a id="tc7-post-em-link-publico-com-flag-off-retorna-http-404-com-payload-vazio-regressao"></a>_Arquivo:_ `tc7-post-link-publico-flag-off-404.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao OFF. Validar manualmente HTTP 404.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** requer toggle runtime da flag :recertificacao OFF. Validar manualmente HTTP 404.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
