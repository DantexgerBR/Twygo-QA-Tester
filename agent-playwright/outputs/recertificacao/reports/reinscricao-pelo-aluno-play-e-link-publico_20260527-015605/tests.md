# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Reinscrição pelo Aluno (Play e Link Público)

_7 caso(s) — 0 aprovado(s), 0 falha(s), 7 ignorado(s)_

### ⊘ Ignorado · TC1 — Botão "Reinscreva-se" aparece no banner do Play para aluno elegível 

<a id="tc1-botao-reinscreva-se-aparece-no-banner-do-play-para-aluno-elegivel"></a>_Arquivo:_ `tc1-banner-reinscreva-se-aluno-elegivel.spec.ts` · _Duração:_ 1.73s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (curso com has_recertification=true + participant elegível).

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/`](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/test-finished-1.png)

  ![](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/recertificacao/reports/reinscricao-pelo-aluno-play-e-link-publico_20260527-015605/artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-recertificacao-te-7fd30-do-Play-para-aluno-elegível-chromium/video-1.webm)

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (curso com has_recertification=true + participant elegível).
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 — Botão "Reinscreva-se" NÃO aparece para aluno inelegível (sem disabled visível) 

<a id="tc2-botao-reinscreva-se-nao-aparece-para-aluno-inelegivel-sem-disabled-visivel"></a>_Arquivo:_ `tc2-banner-nao-aparece-aluno-inelegivel.spec.ts` · _Duração:_ 1.79s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — eventIdCursoInelegivel=1 retorna 404. NEEDS_SEED (curso + participant em andamento sem expiração).

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/`](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/test-finished-1.png)

  ![](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/recertificacao/reports/reinscricao-pelo-aluno-play-e-link-publico_20260527-015605/artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-recertificacao-te-79407-gível-sem-disabled-visível--chromium/video-1.webm)

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** seed inválido — eventIdCursoInelegivel=1 retorna 404. NEEDS_SEED (curso + participant em andamento sem expiração).
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 — Click em "Reinscreva-se" dispara subscribe com `recertification=true` e cria novo participant 

<a id="tc3-click-em-reinscreva-se-dispara-subscribe-com-recertification-true-e-cria-novo-participant"></a>_Arquivo:_ `tc3-click-reinscreva-se-dispara-subscribe.spec.ts` · _Duração:_ 1.75s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (mesmo seed do TC1).

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/`](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/test-finished-1.png)

  ![](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/recertificacao/reports/reinscricao-pelo-aluno-play-e-link-publico_20260527-015605/artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/video-1.webm)

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (mesmo seed do TC1).
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

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

### ⊘ Ignorado · TC5 — POST em link público com `?recertification=true` para aluno elegível cria participant 

<a id="tc5-post-em-link-publico-com-recertification-true-para-aluno-elegivel-cria-participant"></a>_Arquivo:_ `tc5-post-link-publico-aluno-elegivel-cria-participant.spec.ts` · _Duração:_ 1.23s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e eligibleStudent é placeholder. NEEDS_SEED (pacote com link público + aluno com histórico elegível).

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/`](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/test-finished-1.png)

  ![](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/recertificacao/reports/reinscricao-pelo-aluno-play-e-link-publico_20260527-015605/artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-recertificacao-te-6bff7-o-elegível-cria-participant-chromium/video-1.webm)

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e eligibleStudent é placeholder. NEEDS_SEED (pacote com link público + aluno com histórico elegível).
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC6 — POST em link público com `recertification=true` para aluno inelegível retorna erro sem criar participant 

<a id="tc6-post-em-link-publico-com-recertification-true-para-aluno-inelegivel-retorna-erro-sem-criar-participant"></a>_Arquivo:_ `tc6-post-link-publico-aluno-inelegivel-erro.spec.ts` · _Duração:_ 0.91s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e ineligibleStudent é placeholder. NEEDS_SEED (mesmo pacote do TC5 + aluno em andamento).

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/`](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/test-finished-1.png)

  ![](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/recertificacao/reports/reinscricao-pelo-aluno-play-e-link-publico_20260527-015605/artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/video-1.webm)

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e ineligibleStudent é placeholder. NEEDS_SEED (mesmo pacote do TC5 + aluno em andamento).
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

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
