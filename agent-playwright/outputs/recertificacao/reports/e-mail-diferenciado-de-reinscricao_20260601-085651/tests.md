# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## E-mail Diferenciado de Reinscrição

_4 caso(s) — 0 aprovado(s), 0 falha(s), 4 ignorado(s)_

### ⊘ Ignorado · TC1 · Criação de participant com `recertification_number > 0` dispara `RecertificationMailer#student_email` · 🔴 Crítico

<a id="tc1-criacao-de-participant-com-recertification-number-0-dispara-recertificationmailer-student-email"></a>_Arquivo:_ `tc1-recertification-number-positivo-dispara-recertification-mailer.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer.

**Sumário (objetivo do caso):** Validar disparo do mailer com template `reenrollment_mail` para participants com `recertification_number > 0` (RN 24, 24.1).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Mailer ativo em staging (inbox de teste acessível)
Curso com `has_recertification = true`
Aluno cadastrado com e-mail real testável
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Reinscrever um aluno individualmente pelo fluxo da suíte 2 TC3 | Toast de sucesso é exibido. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |
| 2 | Aguardar até 30 segundos pelo e-mail | E-mail chega na inbox do aluno. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |
| 3 | Inspecionar o assunto do e-mail | Assunto corresponde à chave I18n `recertification_mailer.reenrollment.subject` (texto traduzido conforme locale do aluno). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |
| 4 | Inspecionar o corpo do e-mail | Corpo é renderizado a partir do template `reenrollment_mail` (NÃO `recertification_mail` legado). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Mailer ativo em staging (inbox de teste acessível)
1. Pré: Curso com `has_recertification = true`
1. Pré: Aluno cadastrado com e-mail real testável
1. 1. Reinscrever um aluno individualmente pelo fluxo da suíte 2 TC3
1. 2. Aguardar até 30 segundos pelo e-mail
1. 3. Inspecionar o assunto do e-mail
1. 4. Inspecionar o corpo do e-mail

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 · Participant com `recertification_number = 0` em fluxo de aviso de expiração usa template legado · 🔴 Crítico

<a id="tc2-participant-com-recertification-number-0-em-fluxo-de-aviso-de-expiracao-usa-template-legado"></a>_Arquivo:_ `tc2-recertification-number-zero-usa-template-legado.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer.

**Sumário (objetivo do caso):** Validar que mailer mantém compatibilidade com fluxo legado de aviso de expiração próxima (RN 24, 24.2).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Mailer ativo em staging (inbox de teste acessível)
Curso com `has_recertification = true`
Aluno cadastrado com e-mail real testável
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Pré-condição: aluno com `recertification_number = 0` e certificado VALID com `expires_at = hoje + 7 dias` (próximo do vencimento). | Estado preparado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |
| 2 | Disparar manualmente o cron de aviso de expiração que chama `RecertificationMailer#student_email` | Worker processa. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |
| 3 | Inspecionar inbox do aluno | E-mail recebido com assunto da chave `recertification_mailer.expiration_reminder.subject` e corpo do template legado `recertification_mail`. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Mailer ativo em staging (inbox de teste acessível)
1. Pré: Curso com `has_recertification = true`
1. Pré: Aluno cadastrado com e-mail real testável
1. 1. Pré-condição: aluno com `recertification_number = 0` e certificado VALID com `expires_at = hoje + 7 dias` (próximo do vencimento).
1. 2. Disparar manualmente o cron de aviso de expiração que chama `RecertificationMailer#student_email`
1. 3. Inspecionar inbox do aluno

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 · E-mail respeita bloqueio de `organization.mailer_block?` · 🟡 Normal

<a id="tc3-e-mail-respeita-bloqueio-de-organization-mailer-block"></a>_Arquivo:_ `tc3-respeita-bloqueio-mailer-block.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer.

**Sumário (objetivo do caso):** Validar que mailer não envia e-mail quando organização tem `mailer_block? = true` (RN 25).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Mailer ativo em staging (inbox de teste acessível)
Curso com `has_recertification = true`
Aluno cadastrado com e-mail real testável
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Pré-condição: organização com `mailer_block = true` (REVISAR: como definir em staging). | Estado preparado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |
| 2 | Reinscrever um aluno individualmente pelo fluxo da suíte 2 TC3 | Toast de sucesso é exibido (criação ocorre normalmente). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |
| 3 | Aguardar 60 segundos pelo e-mail | Nenhum e-mail é recebido na inbox do aluno. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |
| 4 | Inspecionar os logs do mailer no Sidekiq UI em "/sidekiq" filtrando por "RecertificationMailer" | Job aparece como completed sem envio efetivo — registro com tag "skipped: mailer_block?". | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Normal
- **Motivo declarado pelo spec:** requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Mailer ativo em staging (inbox de teste acessível)
1. Pré: Curso com `has_recertification = true`
1. Pré: Aluno cadastrado com e-mail real testável
1. 1. Pré-condição: organização com `mailer_block = true` (REVISAR: como definir em staging).
1. 2. Reinscrever um aluno individualmente pelo fluxo da suíte 2 TC3
1. 3. Aguardar 60 segundos pelo e-mail
1. 4. Inspecionar os logs do mailer no Sidekiq UI em "/sidekiq" filtrando por "RecertificationMailer"

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC4 · E-mail respeita locale do aluno (pt-BR/en/es) · 🟡 Normal

<a id="tc4-e-mail-respeita-locale-do-aluno-pt-br-en-es"></a>_Arquivo:_ `tc4-respeita-locale-do-aluno.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer.

**Sumário (objetivo do caso):** Validar internacionalização do mailer: assunto e corpo no locale configurado para o aluno (RN 24.1).

**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Locale pt-BR | aceito | locale="pt-BR" | Assunto e corpo em português brasileiro |
| Locale en | aceito | locale="en" | Assunto e corpo em inglês |
| Locale es | aceito | locale="es" | Assunto e corpo em espanhol |
| Locale fr (não suportado) | fallback | locale="fr" | Fallback para "en" |

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Mailer ativo em staging (inbox de teste acessível)
Curso com `has_recertification = true`
Aluno cadastrado com e-mail real testável
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Configurar locale do aluno para "pt-BR" (perfil do usuário) | Estado preparado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |
| 2 | Reinscrever o aluno e aguardar e-mail | E-mail recebido com texto em português brasileiro. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |
| 3 | Repetir para "en" e "es" usando alunos com locales correspondentes | E-mail recebido nos idiomas respectivos. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |
| 4 | Configurar locale "fr" (não oficialmente suportado) e reinscrever | E-mail recebido em inglês (fallback `en` do Rails). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Normal
- **Motivo declarado pelo spec:** requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Mailer ativo em staging (inbox de teste acessível)
1. Pré: Curso com `has_recertification = true`
1. Pré: Aluno cadastrado com e-mail real testável
1. 1. Configurar locale do aluno para "pt-BR" (perfil do usuário)
1. 2. Reinscrever o aluno e aguardar e-mail
1. 3. Repetir para "en" e "es" usando alunos com locales correspondentes
1. 4. Configurar locale "fr" (não oficialmente suportado) e reinscrever

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
