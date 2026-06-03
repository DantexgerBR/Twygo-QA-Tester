# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Reinscrição via Importação CSV

_7 caso(s) — 0 aprovado(s), 0 falha(s), 7 ignorado(s)_

### ⊘ Ignorado · TC1 · Coluna "Reinscrever" aparece no template CSV com flag ON · 🔴 Crítico

<a id="tc1-coluna-reinscrever-aparece-no-template-csv-com-flag-on"></a>_Arquivo:_ `tc1-coluna-reinscrever-template-csv-flag-on.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.

**Sumário (objetivo do caso):** Validar que o template CSV baixado pelo admin contém a coluna "Reinscrever" quando a flag `:recertificacao` está ativa na organização (RN 11).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Usuário logado como Admin
Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a página de importação de participantes em "/o/{orgId}/events/{eventId}/import_participants" (REVISAR-FIGMA: confirmar URL) | Página de importação é exibida com link "Baixar template CSV". | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |
| 2 | Clicar em "Baixar template CSV" | Download do arquivo template.csv inicia. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |
| 3 | Abrir o arquivo template.csv baixado | Header da planilha contém a coluna "Reinscrever" (entre as colunas existentes). | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Usuário logado como Admin
1. Pré: Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
1. 1. Acessar a página de importação de participantes em "/o/{orgId}/events/{eventId}/import_participants" (REVISAR-FIGMA: confirmar URL)
1. 2. Clicar em "Baixar template CSV"
1. 3. Abrir o arquivo template.csv baixado

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 · Coluna "Reinscrever" NÃO aparece no template CSV com flag OFF (regressão) · 🔴 Crítico

<a id="tc2-coluna-reinscrever-nao-aparece-no-template-csv-com-flag-off-regressao"></a>_Arquivo:_ `tc2-coluna-reinscrever-nao-aparece-flag-off.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao OFF. Validar manualmente.

**Sumário (objetivo do caso):** Validar comportamento regressivo: com flag OFF, template CSV não contém a coluna nova (RN 11).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Usuário logado como Admin
Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Desativar a feature flag `:recertificacao` para a organização | Flag fica desativada. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao OFF. Validar manualmente. | — |
| 2 | Acessar a página de importação e baixar o template CSV | Download conclui. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao OFF. Validar manualmente. | — |
| 3 | Abrir o arquivo template.csv | Header NÃO contém a coluna "Reinscrever". Todas as demais colunas (Nome, Email, CPF, etc.) presentes. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao OFF. Validar manualmente. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer toggle runtime da flag :recertificacao OFF. Validar manualmente.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Usuário logado como Admin
1. Pré: Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
1. 1. Desativar a feature flag `:recertificacao` para a organização
1. 2. Acessar a página de importação e baixar o template CSV
1. 3. Abrir o arquivo template.csv

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 · Upload de CSV com `Reinscrever=SIM` para usuário existente cria participant reinscrito · 🔴 Crítico

<a id="tc3-upload-de-csv-com-reinscrever-sim-para-usuario-existente-cria-participant-reinscrito"></a>_Arquivo:_ `tc3-upload-csv-reinscrever-sim-cria-participant-reinscrito.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.

**Sumário (objetivo do caso):** Validar fluxo principal: linha com `Reinscrever=SIM` para usuário já cadastrado e elegível cria novo participant com `recertification_number` incrementado, bypassando o erro `:in_use` (RN 12, 13).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Usuário logado como Admin
Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Preparar arquivo "participants-reenroll.csv" com 1 linha contendo o email do "Aluno Elegível w{workerIndex}" e `Reinscrever=SIM` | Arquivo CSV criado no disco do executor. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |
| 2 | Acessar a página de importação de participantes em "/o/{orgId}/events/{eventId}/import_participants" | Página exibida com upload de arquivo. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |
| 3 | Fazer upload do arquivo "participants-reenroll.csv" | Upload é aceito. Toast "Importação iniciada" é exibido (REVISAR-FIGMA texto exato). | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |
| 4 | Aguardar até 30 segundos pelo processamento do worker `CsvImportEventParticipantWorker` | Worker conclui. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |
| 5 | Acessar a lista de aprendizagem do curso | "Aluno Elegível w{workerIndex}" aparece com `recertification_number = N+1`, `progress_score = 0`, status "Pendente". Aluno também recebe e-mail de reinscrição. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Usuário logado como Admin
1. Pré: Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
1. 1. Preparar arquivo "participants-reenroll.csv" com 1 linha contendo o email do "Aluno Elegível w{workerIndex}" e `Reinscrever=SIM`
1. 2. Acessar a página de importação de participantes em "/o/{orgId}/events/{eventId}/import_participants"
1. 3. Fazer upload do arquivo "participants-reenroll.csv"
1. 4. Aguardar até 30 segundos pelo processamento do worker `CsvImportEventParticipantWorker`
1. 5. Acessar a lista de aprendizagem do curso

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC4 · Valores de `Reinscrever` aceitos (case-insensitive: SIM/sim/true/1) · 🟡 Normal

<a id="tc4-valores-de-reinscrever-aceitos-case-insensitive-sim-sim-true-1"></a>_Arquivo:_ `tc4-valores-aceitos-case-insensitive.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.

**Sumário (objetivo do caso):** Validar matriz de valores aceitos na coluna "Reinscrever" — todos resultam em reinscrição (RN 11.1).

**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Valor "SIM" maiúsculo | aceito | "SIM" | Reinscrição criada |
| Valor "sim" minúsculo | aceito | "sim" | Reinscrição criada |
| Valor "true" | aceito | "true" | Reinscrição criada |
| Valor "1" | aceito | "1" | Reinscrição criada |
| Valor "NÃO" | ignorado | "NÃO" | Fluxo normal sem reinscrição |
| Valor vazio | ignorado | "" | Fluxo normal sem reinscrição |
| Valor inválido | ignorado | "talvez" | Fluxo normal sem reinscrição |

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Usuário logado como Admin
Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Preparar arquivo CSV contendo 7 linhas com os 7 valores da matriz acima para 7 alunos distintos | Arquivo CSV criado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |
| 2 | Fazer upload pela página de importação | Worker processa. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |
| 3 | Aguardar processamento e abrir lista de aprendizagem | 4 alunos (SIM/sim/true/1) aparecem com `recertification_number > 0`. Os 3 alunos com valor "NÃO", vazio ou inválido NÃO aparecem como reinscritos (fluxo normal de inscrição). | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Normal
- **Motivo declarado pelo spec:** seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Usuário logado como Admin
1. Pré: Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
1. 1. Preparar arquivo CSV contendo 7 linhas com os 7 valores da matriz acima para 7 alunos distintos
1. 2. Fazer upload pela página de importação
1. 3. Aguardar processamento e abrir lista de aprendizagem

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC5 · Linha com `Reinscrever=SIM` em conteúdo com `has_recertification=false` registra erro estruturado · 🔴 Crítico

<a id="tc5-linha-com-reinscrever-sim-em-conteudo-com-has-recertification-false-registra-erro-estruturado"></a>_Arquivo:_ `tc5-linha-sim-conteudo-sem-has-recertification-erro.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.

**Sumário (objetivo do caso):** Validar erro por linha quando o conteúdo de destino não permite reinscrição (RN 12).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Usuário logado como Admin
Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Pré-condição: curso "Curso sem Reinscrição w{workerIndex}" com `has_recertification = false`. | Curso pré-existe. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |
| 2 | Preparar CSV com 1 linha contendo email de aluno existente, curso destino "Curso sem Reinscrição" e `Reinscrever=SIM` | Arquivo CSV criado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |
| 3 | Fazer upload na página de importação | Upload aceito; worker processa. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |
| 4 | Aguardar processamento e acessar a tela de "Resultado da importação" (REVISAR-FIGMA: URL exata) | Linha aparece como erro com mensagem da chave `reenroll_participant.errors.recertification_disabled_for_event`. Nenhum participant criado para esta linha. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Usuário logado como Admin
1. Pré: Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
1. 1. Pré-condição: curso "Curso sem Reinscrição w{workerIndex}" com `has_recertification = false`.
1. 2. Preparar CSV com 1 linha contendo email de aluno existente, curso destino "Curso sem Reinscrição" e `Reinscrever=SIM`
1. 3. Fazer upload na página de importação
1. 4. Aguardar processamento e acessar a tela de "Resultado da importação" (REVISAR-FIGMA: URL exata)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC6 · Linha com `Reinscrever=SIM` para usuário INEXISTENTE cai no fluxo normal de criação (sem reinscrição) · 🟡 Normal

<a id="tc6-linha-com-reinscrever-sim-para-usuario-inexistente-cai-no-fluxo-normal-de-criacao-sem-reinscricao"></a>_Arquivo:_ `tc6-linha-sim-usuario-inexistente-fluxo-criacao.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.

**Sumário (objetivo do caso):** Validar que reinscrição via CSV requer usuário pré-existente. Linha com `Reinscrever=SIM` para email novo cria participant com `recertification_number = 0` (fluxo legado) (RN 12).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Usuário logado como Admin
Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Preparar CSV com 1 linha contendo email "novo-aluno-w{workerIndex}-{ts}@example.com" e `Reinscrever=SIM` | CSV criado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |
| 2 | Fazer upload do CSV | Upload aceito; worker processa. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |
| 3 | Aguardar e verificar a lista de aprendizagem em "/learning_students?event_id={eventId}" | Novo usuário foi criado. Aparece no curso com `recertification_number = 0` (não como reinscrição — fluxo de criação original). | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |
| 4 | Inspecionar a caixa de entrada "inbox" do novo aluno em busca do e-mail "Bem-vindo ao curso" | E-mail recebido é o de inscrição original (assunto da chave "events.welcome_subject", NÃO o template `reenrollment_mail`). | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Normal
- **Motivo declarado pelo spec:** seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Usuário logado como Admin
1. Pré: Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
1. 1. Preparar CSV com 1 linha contendo email "novo-aluno-w{workerIndex}-{ts}@example.com" e `Reinscrever=SIM`
1. 2. Fazer upload do CSV
1. 3. Aguardar e verificar a lista de aprendizagem em "/learning_students?event_id={eventId}"
1. 4. Inspecionar a caixa de entrada "inbox" do novo aluno em busca do e-mail "Bem-vindo ao curso"

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC7 · Pós-importação, e-mails são enviados APENAS para participants com `recertification_number > 0` criados nesta execução · 🟡 Normal

<a id="tc7-pos-importacao-e-mails-sao-enviados-apenas-para-participants-com-recertification-number-0-criados-nesta-execucao"></a>_Arquivo:_ `tc7-pos-import-emails-recertification-only.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail. Validar manualmente.

**Sumário (objetivo do caso):** Validar escopo do disparo de e-mails: apenas os recém-criados como reinscritos recebem o e-mail diferenciado (RN 13).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Usuário logado como Admin
Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Preparar CSV com 3 linhas: linha A (`Reinscrever=SIM` user existente — cria reinscrito), linha B (`Reinscrever=NÃO` user existente — não cria nada porque já está inscrito), linha C (`Reinscrever=SIM` user novo — cria com `recertification_number = 0`) | CSV criado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail. Validar manualmente. | — |
| 2 | Fazer upload e aguardar processamento | Worker processa as 3 linhas. | ⊘ | Step não executado — Marcado para revisão (test.fixme): cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail. Validar manualmente. | — |
| 3 | Inspecionar inboxes dos 3 alunos | Apenas o aluno A recebe e-mail com assunto `recertification_mailer.reenrollment.subject` (template `reenrollment_mail`). Alunos B e C não recebem este e-mail diferenciado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail. Validar manualmente. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Normal
- **Motivo declarado pelo spec:** cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail. Validar manualmente.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Usuário logado como Admin
1. Pré: Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
1. 1. Preparar CSV com 3 linhas: linha A (`Reinscrever=SIM` user existente — cria reinscrito), linha B (`Reinscrever=NÃO` user existente — não cria nada porque já está inscrito), linha C (`Reinscrever=SIM` user novo — cria com `recertification_number = 0`)
1. 2. Fazer upload e aguardar processamento
1. 3. Inspecionar inboxes dos 3 alunos

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
