# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Ciclo de Vida do Certificado Substituído

_4 caso(s) — 0 aprovado(s), 0 falha(s), 4 ignorado(s)_

### ⊘ Ignorado · TC1 · Após emitir novo certificado, anteriores são marcados em lote como REPLACED · 🔴 Crítico

<a id="tc1-apos-emitir-novo-certificado-anteriores-sao-marcados-em-lote-como-replaced"></a>_Arquivo:_ `tc1-novo-certificado-anteriores-replaced.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer trigger de emissão de certificado + validação DB-pure de update em lote (situation=4). Validar manualmente.

**Sumário (objetivo do caso):** Validar `CertificateGenerationService#replace_previous_certificates_bulk`: ao emitir certificado VALID para participant reinscrito (`recertification_number > 0`), todos os certificados VALID anteriores do mesmo par `(user_id, event_id)` viram REPLACED em uma única query `update_all` (RN 20, 21).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso "Curso Certificado Reinscrição w{workerIndex}" com `has_recertification = true`
Aluno com `recertification_number = 0` aprovado e certificado emitido (`CERTIFICATE_VALID = 2`)
Cron `ExpiresCertificates` configurado para staging
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Pré-condição: aluno aprovado com `recertification_number = 0` e certificado `VALID` emitido. | Estado validado no banco: 1 row em `certificates` com `situation = 2 (VALID)`. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer trigger de emissão de certificado + validação DB-pure de update em lote (situation=4). Validar manualmente. | — |
| 2 | Reinscrever o aluno individualmente pelo fluxo da suíte 2 TC3 | Novo participant criado com `recertification_number = 1`. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer trigger de emissão de certificado + validação DB-pure de update em lote (situation=4). Validar manualmente. | — |
| 3 | Simular conclusão do conteúdo pelo novo participant: `progress_score = 100` | Certificado novo é emitido (queue de geração de certificados). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer trigger de emissão de certificado + validação DB-pure de update em lote (situation=4). Validar manualmente. | — |
| 4 | Aguardar até 60 segundos e consultar tabela `certificates` para o par `(user_id, event_id)` | 2 rows: certificado anterior com `situation = 4 (REPLACED)` e certificado novo com `situation = 2 (VALID)`. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer trigger de emissão de certificado + validação DB-pure de update em lote (situation=4). Validar manualmente. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer trigger de emissão de certificado + validação DB-pure de update em lote (situation=4). Validar manualmente.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso "Curso Certificado Reinscrição w{workerIndex}" com `has_recertification = true`
1. Pré: Aluno com `recertification_number = 0` aprovado e certificado emitido (`CERTIFICATE_VALID = 2`)
1. Pré: Cron `ExpiresCertificates` configurado para staging
1. 1. Pré-condição: aluno aprovado com `recertification_number = 0` e certificado `VALID` emitido.
1. 2. Reinscrever o aluno individualmente pelo fluxo da suíte 2 TC3
1. 3. Simular conclusão do conteúdo pelo novo participant: `progress_score = 100`
1. 4. Aguardar até 60 segundos e consultar tabela `certificates` para o par `(user_id, event_id)`

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 — Worker ExpiresCertificates expira VALID e propaga para REPLACED do mesmo par 

<a id="tc2-worker-expirescertificates-expira-valid-e-propaga-para-replaced-do-mesmo-par"></a>_Arquivo:_ `tc2-worker-expires-certificates-propaga.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer execução do worker ExpiresCertificates + validação direta no banco. Validar manualmente.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** requer execução do worker ExpiresCertificates + validação direta no banco. Validar manualmente.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 — Constante CERTIFICATE_REPLACED = 4 espelhada em EventParticipant::REPLACED 

<a id="tc3-constante-certificate-replaced-4-espelhada-em-eventparticipant-replaced"></a>_Arquivo:_ `tc3-constante-certificate-replaced-4.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): validação de constante Rails — fora do escopo Playwright. Validar manualmente lendo o código fonte.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** validação de constante Rails — fora do escopo Playwright. Validar manualmente lendo o código fonte.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC4 · Certificados emitidos no fluxo legado (sem reinscrição) permanecem VALID indefinidamente · 🔴 Crítico

<a id="tc4-certificados-emitidos-no-fluxo-legado-sem-reinscricao-permanecem-valid-indefinidamente"></a>_Arquivo:_ `tc4-certificados-legado-permanecem-valid.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer validação direta no banco — DB-pure. Validar manualmente.

**Sumário (objetivo do caso):** Validar comportamento regressivo: aluno com `recertification_number = 0` que concluiu o curso e recebeu VALID NÃO tem o certificado marcado como REPLACED sem reinscrição (RN 20, 21).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso "Curso Certificado Reinscrição w{workerIndex}" com `has_recertification = true`
Aluno com `recertification_number = 0` aprovado e certificado emitido (`CERTIFICATE_VALID = 2`)
Cron `ExpiresCertificates` configurado para staging
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Pré-condição: aluno com `recertification_number = 0` aprovado e VALID emitido. | Estado preparado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer validação direta no banco — DB-pure. Validar manualmente. | — |
| 2 | Esperar 1 hora (ou re-rodar cron de geração de certificados) sem disparar reinscrição. | Cron de geração processa outros casos. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer validação direta no banco — DB-pure. Validar manualmente. | — |
| 3 | Consultar tabela `certificates` | Certificado do aluno continua com `situation = 2 (VALID)`. Não foi marcado como REPLACED. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer validação direta no banco — DB-pure. Validar manualmente. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer validação direta no banco — DB-pure. Validar manualmente.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso "Curso Certificado Reinscrição w{workerIndex}" com `has_recertification = true`
1. Pré: Aluno com `recertification_number = 0` aprovado e certificado emitido (`CERTIFICATE_VALID = 2`)
1. Pré: Cron `ExpiresCertificates` configurado para staging
1. 1. Pré-condição: aluno com `recertification_number = 0` aprovado e VALID emitido.
1. 2. Esperar 1 hora (ou re-rodar cron de geração de certificados) sem disparar reinscrição.
1. 3. Consultar tabela `certificates`

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
