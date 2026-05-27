# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Reinscrição Individual pelo Admin

_6 caso(s) — 0 aprovado(s), 0 falha(s), 6 ignorado(s)_

### ⊘ Ignorado · TC1 — Botão "Reinscrever" visível e habilitado apenas para aluno elegível 

<a id="tc1-botao-reinscrever-visivel-e-habilitado-apenas-para-aluno-elegivel"></a>_Arquivo:_ `tc1-botao-reinscrever-visivel-aluno-elegivel.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — cursoComReinscricaoId=1 não existe (404) e e-mails são placeholders @example.com. Validar no env staging-base-de-conhecimento e atualizar tc1-botao-reinscrever-visivel-aluno-elegivel.data.ts.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** seed inválido — cursoComReinscricaoId=1 não existe (404) e e-mails são placeholders @example.com. Validar no env staging-base-de-conhecimento e atualizar tc1-botao-reinscrever-visivel-aluno-elegivel.data.ts.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 — Botão "Reinscrever" visível apenas na linha do participant com maior recertification_number 

<a id="tc2-botao-reinscrever-visivel-apenas-na-linha-do-participant-com-maior-recertification-number"></a>_Arquivo:_ `tc2-botao-reinscrever-apenas-maior-recertification-number.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — cursoMultiReinscricaoId=1 não existe (404) e e-mail é placeholder @example.com. Validar no env staging-base-de-conhecimento e atualizar tc2-botao-reinscrever-apenas-maior-recertification-number.data.ts.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** seed inválido — cursoMultiReinscricaoId=1 não existe (404) e e-mail é placeholder @example.com. Validar no env staging-base-de-conhecimento e atualizar tc2-botao-reinscrever-apenas-maior-recertification-number.data.ts.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 — Reinscrever aluno individualmente cria novo participant zerado 

<a id="tc3-reinscrever-aluno-individualmente-cria-novo-participant-zerado"></a>_Arquivo:_ `tc3-reinscrever-aluno-cria-novo-participant-zerado.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — cursoComReinscricaoId=1 não existe (404) e e-mail é placeholder @example.com. Validar no env staging-base-de-conhecimento e atualizar tc3-reinscrever-aluno-cria-novo-participant-zerado.data.ts.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** seed inválido — cursoComReinscricaoId=1 não existe (404) e e-mail é placeholder @example.com. Validar no env staging-base-de-conhecimento e atualizar tc3-reinscrever-aluno-cria-novo-participant-zerado.data.ts.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC4 — Botão "Reinscrever" fica visível mas DESABILITADO quando event.has_recertification = false 

<a id="tc4-botao-reinscrever-fica-visivel-mas-desabilitado-quando-event-has-recertification-false"></a>_Arquivo:_ `tc4-botao-reinscrever-disabled-has-recertification-false.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — cursoSemReinscricaoId=2 não existe (404) e e-mail é placeholder @example.com. Validar no env staging-base-de-conhecimento e atualizar tc4-botao-reinscrever-disabled-has-recertification-false.data.ts.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** seed inválido — cursoSemReinscricaoId=2 não existe (404) e e-mail é placeholder @example.com. Validar no env staging-base-de-conhecimento e atualizar tc4-botao-reinscrever-disabled-has-recertification-false.data.ts.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC5 — Reinscrição com flag OFF retorna HTTP 422 feature_disabled 

<a id="tc5-reinscricao-com-flag-off-retorna-http-422-feature-disabled"></a>_Arquivo:_ `tc5-flag-off-retorna-422-feature-disabled.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente HTTP 422 feature_disabled.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente HTTP 422 feature_disabled.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC6 — Após reinscrição, e-mail diferenciado é disparado (validação cross-suite) 

<a id="tc6-apos-reinscricao-e-mail-diferenciado-e-disparado-validacao-cross-suite"></a>_Arquivo:_ `tc6-pos-reinscricao-email-diferenciado.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail não configurada. Validar manualmente que e-mail de reinscrição foi disparado.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail não configurada. Validar manualmente que e-mail de reinscrição foi disparado.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
