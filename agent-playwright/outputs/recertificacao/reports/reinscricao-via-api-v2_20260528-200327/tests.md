# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Reinscrição via API V2

_3 caso(s) — 2 aprovado(s), 0 falha(s), 1 ignorado(s)_

### ✅ Aprovado · TC1 — POST /api/v2/attendees com recertification=true responde 200 e cria attendee 

<a id="tc1-post-api-v2-attendees-com-recertification-true-responde-200-e-cria-attendee"></a>_Arquivo:_ `reinscricao-via-api-v2.spec.ts` · _Duração:_ 0.79s · _Browser:_ api

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-recertificacao-te-f253e-esponde-200-e-cria-attendee-api/`](artifacts/projects-recertificacao-te-f253e-esponde-200-e-cria-attendee-api/)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-recertificacao-te-f253e-esponde-200-e-cria-attendee-api/trace.zip)

  ```bash
  npx playwright show-trace outputs/recertificacao/reports/reinscricao-via-api-v2_20260528-200327/artifacts/projects-recertificacao-te-f253e-esponde-200-e-cria-attendee-api/trace.zip
  ```


---

### ⊘ Ignorado · TC2 — Recertificação de user não-aprovado retorna 422 com mensagem descritiva 

<a id="tc2-recertificacao-de-user-nao-aprovado-retorna-422-com-mensagem-descritiva"></a>_Arquivo:_ `reinscricao-via-api-v2.spec.ts` · _Duração:_ 0.00s · _Browser:_ api

> **⊘ Por que foi ignorado:** [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Categoria:** ⚠️ Não declarada
- **Motivo declarado pelo spec:** _ausente_
- **Próximo passo:** Editar o spec para declarar `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario). Sem declaração, leitor leigo não sabe quem precisa agir.

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ✅ Aprovado · TC3 — Payload sem recertification segue fluxo legado (regressão) 

<a id="tc3-payload-sem-recertification-segue-fluxo-legado-regressao"></a>_Arquivo:_ `reinscricao-via-api-v2.spec.ts` · _Duração:_ 0.83s · _Browser:_ api

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-recertificacao-te-07911-gue-fluxo-legado-regressão--api/`](artifacts/projects-recertificacao-te-07911-gue-fluxo-legado-regressão--api/)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-recertificacao-te-07911-gue-fluxo-legado-regressão--api/trace.zip)

  ```bash
  npx playwright show-trace outputs/recertificacao/reports/reinscricao-via-api-v2_20260528-200327/artifacts/projects-recertificacao-te-07911-gue-fluxo-legado-regressão--api/trace.zip
  ```


---
