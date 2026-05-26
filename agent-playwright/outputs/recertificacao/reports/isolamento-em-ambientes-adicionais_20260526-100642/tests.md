# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Isolamento em Ambientes Adicionais

_2 caso(s) — 0 aprovado(s), 0 falha(s), 2 ignorado(s)_

### ⊘ Ignorado · TC1 — Reinscrição num env não afeta participants no env pareado 

<a id="tc1-reinscricao-num-env-nao-afeta-participants-no-env-pareado"></a>_Arquivo:_ `tc1-reinscricao-num-env-nao-afeta-pareado.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): env secundário não configurado em config/environment.json (frontmatter env_secondary: null). Bloqueio de infra — configurar staging-base-de-conhecimento-aditional + senha em .env antes de habilitar este TC.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** env secundário não configurado em config/environment.json (frontmatter env_secondary: null). Bloqueio de infra — configurar staging-base-de-conhecimento-aditional + senha em .env antes de habilitar este TC.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 — Toggle da flag :recertificacao no env principal NÃO afeta env secundário 

<a id="tc2-toggle-da-flag-recertificacao-no-env-principal-nao-afeta-env-secundario"></a>_Arquivo:_ `tc2-toggle-flag-env-principal-nao-afeta-secundario.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): env secundário não configurado em config/environment.json (frontmatter env_secondary: null). Bloqueio de infra — configurar staging-base-de-conhecimento-aditional + senha em .env antes de habilitar este TC.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** env secundário não configurado em config/environment.json (frontmatter env_secondary: null). Bloqueio de infra — configurar staging-base-de-conhecimento-aditional + senha em .env antes de habilitar este TC.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
