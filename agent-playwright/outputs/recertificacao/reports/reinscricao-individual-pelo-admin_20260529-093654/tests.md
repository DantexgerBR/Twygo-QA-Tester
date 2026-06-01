# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Reinscrição Individual pelo Admin

_6 caso(s) — 0 aprovado(s), 0 falha(s), 6 ignorado(s)_

### ⊘ Ignorado · TC1 · Botão "Reinscrever" visível e habilitado apenas para aluno elegível · 🔴 Crítico

<a id="tc1-botao-reinscrever-visivel-e-habilitado-apenas-para-aluno-elegivel"></a>_Arquivo:_ `tc1-botao-reinscrever-visivel-aluno-elegivel.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed-roadmap-fixture-composta-3-alunos: TC1 exige 3 alunos no mesmo curso em estados distintos (a) progresso 100% (b) cert expirado (c) em andamento. v1.7.0 tem cada estado coberto individualmente, mas falta fixture composta que provisione os 3 simultaneamente. Ver skill provisionar-seed v1.7.0 §"Catálogo".

**Sumário (objetivo do caso):** Validar visibilidade e habilitação do botão "Reinscrever" no menu de ação da linha do aluno, conforme regras de elegibilidade (RN 4, 4.1, 6).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA na organização
Curso com `has_recertification = true`
Usuário logado como Admin
[object Object]
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}" | Lista de alunos é exibida com pelo menos os 3 alunos pré-condicionados. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed-roadmap-fixture-composta-3-alunos: TC1 exige 3 alunos no mesmo curso em estados distintos (a) progresso 100% (b) cert expirado (c) em andamento. v1.7.0 tem cada estado coberto individualmente, mas falta fixture composta que provisione os 3 simultaneamente. Ver skill provisionar-seed v1.7.0 §"Catálogo". | — |
| 2 | Abrir o menu de ações da linha do aluno "(a) elegível por progresso 100%" | Menu de ações é exibido contendo o item "Reinscrever" habilitado (sem tooltip de bloqueio). | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed-roadmap-fixture-composta-3-alunos: TC1 exige 3 alunos no mesmo curso em estados distintos (a) progresso 100% (b) cert expirado (c) em andamento. v1.7.0 tem cada estado coberto individualmente, mas falta fixture composta que provisione os 3 simultaneamente. Ver skill provisionar-seed v1.7.0 §"Catálogo". | — |
| 3 | Clicar fora para fechar o menu e abrir o menu da linha do aluno "(b) elegível por certificado expirado" | Menu exibe o item "Reinscrever" habilitado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed-roadmap-fixture-composta-3-alunos: TC1 exige 3 alunos no mesmo curso em estados distintos (a) progresso 100% (b) cert expirado (c) em andamento. v1.7.0 tem cada estado coberto individualmente, mas falta fixture composta que provisione os 3 simultaneamente. Ver skill provisionar-seed v1.7.0 §"Catálogo". | — |
| 4 | Abrir o menu da linha do aluno "(c) inelegível em andamento" | Item "Reinscrever" é exibido mas DESABILITADO; ao posicionar o cursor sobre o item, tooltip explicativo de inelegibilidade é exibido (REVISAR-FIGMA: confirmar texto). | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed-roadmap-fixture-composta-3-alunos: TC1 exige 3 alunos no mesmo curso em estados distintos (a) progresso 100% (b) cert expirado (c) em andamento. v1.7.0 tem cada estado coberto individualmente, mas falta fixture composta que provisione os 3 simultaneamente. Ver skill provisionar-seed v1.7.0 §"Catálogo". | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** seed-roadmap-fixture-composta-3-alunos: TC1 exige 3 alunos no mesmo curso em estados distintos (a) progresso 100% (b) cert expirado (c) em andamento. v1.7.0 tem cada estado coberto individualmente, mas falta fixture composta que provisione os 3 simultaneamente. Ver skill provisionar-seed v1.7.0 §"Catálogo".
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA na organização
1. Pré: Curso com `has_recertification = true`
1. Pré: Usuário logado como Admin
1. Pré: [object Object]
1. 1. Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}"
1. 2. Abrir o menu de ações da linha do aluno "(a) elegível por progresso 100%"
1. 3. Clicar fora para fechar o menu e abrir o menu da linha do aluno "(b) elegível por certificado expirado"
1. 4. Abrir o menu da linha do aluno "(c) inelegível em andamento"

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 — Botão "Reinscrever" visível apenas na linha do participant com maior recertification_number 

<a id="tc2-botao-reinscrever-visivel-apenas-na-linha-do-participant-com-maior-recertification-number"></a>_Arquivo:_ `tc2-botao-reinscrever-apenas-maior-recertification-number.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed-roadmap-tc2-aluno-multi-recert-controlado: TC2 valida que botão Reinscrever aparece SÓ na linha mais recente com cert ativo. Richard Sebold (807287) tinha esse estado em 2026-05-28, mas state mudou após runs. Precisa fixture worker-isolated dedicada que reproduza multi-recert sem auto-recertification pendente.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** seed-roadmap-tc2-aluno-multi-recert-controlado: TC2 valida que botão Reinscrever aparece SÓ na linha mais recente com cert ativo. Richard Sebold (807287) tinha esse estado em 2026-05-28, mas state mudou após runs. Precisa fixture worker-isolated dedicada que reproduza multi-recert sem auto-recertification pendente.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 · Reinscrever aluno individualmente cria novo participant zerado · 🔴 Crítico

<a id="tc3-reinscrever-aluno-individualmente-cria-novo-participant-zerado"></a>_Arquivo:_ `tc3-reinscrever-aluno-cria-novo-participant-zerado.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): AT inferiu modal "Confirmar reinscrição" (REVISAR-FIGMA) que NÃO existe no produto. Validado live 2026-05-29 com bug Chakra menu já corrigido: click "Iniciar reinscrição" dispara POST imediato sem modal. AT/QA Lead deve revisar a AT pra remover step do modal e substituir por assert de toast.

**Sumário (objetivo do caso):** Validar criação de novo `EventParticipant` com campos zerados após reinscrição individual (RN 5, 7).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA na organização
Curso com `has_recertification = true`
Usuário logado como Admin
[object Object]
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}" | Lista exibe aluno "(a) elegível" com `recertification_number = N`. | ⊘ | Step não executado — Marcado para revisão (test.fixme): AT inferiu modal "Confirmar reinscrição" (REVISAR-FIGMA) que NÃO existe no produto. Validado live 2026-05-29 com bug Chakra menu já corrigido: click "Iniciar reinscrição" dispara POST imediato sem modal. AT/QA Lead deve revisar a AT pra remover step do modal e substituir por assert de toast. | — |
| 2 | Clicar no item "Reinscrever" no menu da linha | Modal de confirmação "Confirmar reinscrição" é exibido (REVISAR-FIGMA: header e body exatos). | ⊘ | Step não executado — Marcado para revisão (test.fixme): AT inferiu modal "Confirmar reinscrição" (REVISAR-FIGMA) que NÃO existe no produto. Validado live 2026-05-29 com bug Chakra menu já corrigido: click "Iniciar reinscrição" dispara POST imediato sem modal. AT/QA Lead deve revisar a AT pra remover step do modal e substituir por assert de toast. | — |
| 3 | Clicar em "Confirmar" | Modal fecha, toast de sucesso é exibido (REVISAR-FIGMA: texto exato); tabela faz refetch automático. | ⊘ | Step não executado — Marcado para revisão (test.fixme): AT inferiu modal "Confirmar reinscrição" (REVISAR-FIGMA) que NÃO existe no produto. Validado live 2026-05-29 com bug Chakra menu já corrigido: click "Iniciar reinscrição" dispara POST imediato sem modal. AT/QA Lead deve revisar a AT pra remover step do modal e substituir por assert de toast. | — |
| 4 | Localizar a linha do aluno na listagem | Aluno aparece com `recertification_number = N+1`, `progress_score = 0`, badge de status "Pendente" (REVISAR-FIGMA: texto exato), sem nota e sem certificado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): AT inferiu modal "Confirmar reinscrição" (REVISAR-FIGMA) que NÃO existe no produto. Validado live 2026-05-29 com bug Chakra menu já corrigido: click "Iniciar reinscrição" dispara POST imediato sem modal. AT/QA Lead deve revisar a AT pra remover step do modal e substituir por assert de toast. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** AT inferiu modal "Confirmar reinscrição" (REVISAR-FIGMA) que NÃO existe no produto. Validado live 2026-05-29 com bug Chakra menu já corrigido: click "Iniciar reinscrição" dispara POST imediato sem modal. AT/QA Lead deve revisar a AT pra remover step do modal e substituir por assert de toast.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA na organização
1. Pré: Curso com `has_recertification = true`
1. Pré: Usuário logado como Admin
1. Pré: [object Object]
1. 1. Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}"
1. 2. Clicar no item "Reinscrever" no menu da linha
1. 3. Clicar em "Confirmar"
1. 4. Localizar a linha do aluno na listagem

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC4 — Botão "Reinscrever" fica visível mas DESABILITADO quando event.has_recertification = false 

<a id="tc4-botao-reinscrever-fica-visivel-mas-desabilitado-quando-event-has-recertification-false"></a>_Arquivo:_ `tc4-botao-reinscrever-disabled-has-recertification-false.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed-roadmap-atividade-aula-1: pré-condição "aluno elegível por progresso 100%" exige curso com atividades pra completar — helper de criação de atividades ainda não implementado. cursoSeed default (has_recertification=false) cobre o curso mas alunoMatriculadoSeed cru não cobre o aluno. Ver skill provisionar-seed v1.6.1.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** seed-roadmap-atividade-aula-1: pré-condição "aluno elegível por progresso 100%" exige curso com atividades pra completar — helper de criação de atividades ainda não implementado. cursoSeed default (has_recertification=false) cobre o curso mas alunoMatriculadoSeed cru não cobre o aluno. Ver skill provisionar-seed v1.6.1.
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

### ⊘ Ignorado · TC6 · Após reinscrição, e-mail diferenciado é disparado (validação cross-suite) · 🟡 Normal

<a id="tc6-apos-reinscricao-e-mail-diferenciado-e-disparado-validacao-cross-suite"></a>_Arquivo:_ `tc6-pos-reinscricao-email-diferenciado.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail não configurada. Validar manualmente que e-mail de reinscrição foi disparado.

**Sumário (objetivo do caso):** Validar que ao concluir reinscrição individual, o `RecertificationMailer#student_email` é disparado com template `reenrollment_mail` (RN 7, 24.1). Validação detalhada em suíte 10.

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA na organização
Curso com `has_recertification = true`
Usuário logado como Admin
[object Object]
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a lista de aprendizagem com a inbox de teste aberta em paralelo (REVISAR-FIGMA: tooling de inbox em staging) | Lista de aprendizagem é exibida. | ⊘ | Step não executado — Marcado para revisão (test.fixme): cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail não configurada. Validar manualmente que e-mail de reinscrição foi disparado. | — |
| 2 | Reinscrever um aluno elegível pelo fluxo do TC3 | Toast de sucesso é exibido. | ⊘ | Step não executado — Marcado para revisão (test.fixme): cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail não configurada. Validar manualmente que e-mail de reinscrição foi disparado. | — |
| 3 | Aguardar até 30 segundos pelo e-mail na inbox do aluno | E-mail é recebido na caixa de entrada. | ⊘ | Step não executado — Marcado para revisão (test.fixme): cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail não configurada. Validar manualmente que e-mail de reinscrição foi disparado. | — |
| 4 | Inspecionar o assunto e o corpo do e-mail | Assunto corresponde à chave I18n `recertification_mailer.reenrollment.subject`; corpo corresponde ao template `reenrollment_mail` (não ao `recertification_mail` legado). | ⊘ | Step não executado — Marcado para revisão (test.fixme): cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail não configurada. Validar manualmente que e-mail de reinscrição foi disparado. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Normal
- **Motivo declarado pelo spec:** cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail não configurada. Validar manualmente que e-mail de reinscrição foi disparado.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA na organização
1. Pré: Curso com `has_recertification = true`
1. Pré: Usuário logado como Admin
1. Pré: [object Object]
1. 1. Acessar a lista de aprendizagem com a inbox de teste aberta em paralelo (REVISAR-FIGMA: tooling de inbox em staging)
1. 2. Reinscrever um aluno elegível pelo fluxo do TC3
1. 3. Aguardar até 30 segundos pelo e-mail na inbox do aluno
1. 4. Inspecionar o assunto e o corpo do e-mail

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
