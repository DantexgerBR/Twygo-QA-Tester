# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Reinscrição em Massa pelo Admin

_6 caso(s) — 0 aprovado(s), 0 falha(s), 6 ignorado(s)_

### ⊘ Ignorado · TC1 · Ação "Reinscrição em massa" aparece no drawer quando todas as condições atendidas · 🔴 Crítico

<a id="tc1-acao-reinscricao-em-massa-aparece-no-drawer-quando-todas-as-condicoes-atendidas"></a>_Arquivo:_ `tc1-acao-aparece-drawer-condicoes-atendidas.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc1-acao-aparece-drawer-condicoes-atendidas.data.ts.

**Sumário (objetivo do caso):** Validar visibilidade condicional da ação "Reinscrição em massa" no drawer de ações em massa: flag ON, `has_recertification = true` e tipo do evento ≠ pacote (RN 8).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
Sidekiq operacional (worker `MassReenrollParticipantsWorker`)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}" | Lista de alunos é exibida. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc1-acao-aparece-drawer-condicoes-atendidas.data.ts. | — |
| 2 | Selecionar 3 alunos clicando nos checkboxes correspondentes | Drawer de ações em massa é exibido na lateral com a contagem "3 selecionados". | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc1-acao-aparece-drawer-condicoes-atendidas.data.ts. | — |
| 3 | Inspecionar as opções do drawer | Opção "Reinscrição em massa" está visível e habilitada. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc1-acao-aparece-drawer-condicoes-atendidas.data.ts. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc1-acao-aparece-drawer-condicoes-atendidas.data.ts.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
1. Pré: Sidekiq operacional (worker `MassReenrollParticipantsWorker`)
1. 1. Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}"
1. 2. Selecionar 3 alunos clicando nos checkboxes correspondentes
1. 3. Inspecionar as opções do drawer

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 · Ação "Reinscrição em massa" NÃO aparece em evento do tipo pacote · 🔴 Crítico

<a id="tc2-acao-reinscricao-em-massa-nao-aparece-em-evento-do-tipo-pacote"></a>_Arquivo:_ `tc2-acao-nao-aparece-evento-pacote.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — pacoteIdRecertOn=4 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc2-acao-nao-aparece-evento-pacote.data.ts.

**Sumário (objetivo do caso):** Validar regra de visibilidade: ação não aparece se o evento for do tipo pacote (`ContentKind.package`), mesmo com flag e gate ON (RN 8).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
Sidekiq operacional (worker `MassReenrollParticipantsWorker`)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Pré-condição: pacote "Pacote Recertificação w{workerIndex}" com `has_recertification = true` e ao menos 3 alunos | Pacote pré-existe no env. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — pacoteIdRecertOn=4 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc2-acao-nao-aparece-evento-pacote.data.ts. | — |
| 2 | Acessar a lista de aprendizagem do pacote em "/learning_students?event_id={packageId}" | Lista de alunos do pacote é exibida. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — pacoteIdRecertOn=4 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc2-acao-nao-aparece-evento-pacote.data.ts. | — |
| 3 | Selecionar 3 alunos | Drawer de ações em massa é exibido. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — pacoteIdRecertOn=4 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc2-acao-nao-aparece-evento-pacote.data.ts. | — |
| 4 | Inspecionar as opções do drawer | Opção "Reinscrição em massa" NÃO está presente. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — pacoteIdRecertOn=4 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc2-acao-nao-aparece-evento-pacote.data.ts. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** seed inválido — pacoteIdRecertOn=4 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc2-acao-nao-aparece-evento-pacote.data.ts.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
1. Pré: Sidekiq operacional (worker `MassReenrollParticipantsWorker`)
1. 1. Pré-condição: pacote "Pacote Recertificação w{workerIndex}" com `has_recertification = true` e ao menos 3 alunos
1. 2. Acessar a lista de aprendizagem do pacote em "/learning_students?event_id={packageId}"
1. 3. Selecionar 3 alunos
1. 4. Inspecionar as opções do drawer

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 · Disparar reinscrição em massa enfileira worker e processa todos os alunos elegíveis · 🔴 Crítico

<a id="tc3-disparar-reinscricao-em-massa-enfileira-worker-e-processa-todos-os-alunos-elegiveis"></a>_Arquivo:_ `tc3-disparar-reinscricao-massa-enfileira-worker.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc3-disparar-reinscricao-massa-enfileira-worker.data.ts.

**Sumário (objetivo do caso):** Validar que ao confirmar reinscrição em massa, o worker `MassReenrollParticipantsWorker` é enfileirado e processa todos os alunos selecionados criando participants reinscritos (RN 9).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
Sidekiq operacional (worker `MassReenrollParticipantsWorker`)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}" | Lista de alunos é exibida com pelo menos 5 alunos elegíveis. | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc3-disparar-reinscricao-massa-enfileira-worker.data.ts. | — |
| 2 | Selecionar 5 alunos elegíveis nos checkboxes | Drawer exibe contagem "5 selecionados". | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc3-disparar-reinscricao-massa-enfileira-worker.data.ts. | — |
| 3 | Clicar em "Reinscrição em massa" no drawer | Modal de confirmação é exibido (REVISAR-FIGMA: texto exato do modal). | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc3-disparar-reinscricao-massa-enfileira-worker.data.ts. | — |
| 4 | Clicar em "Confirmar" | Modal fecha, toast "Reinscrição em massa iniciada" é exibido (REVISAR-FIGMA texto exato). | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc3-disparar-reinscricao-massa-enfileira-worker.data.ts. | — |
| 5 | Aguardar até 60 segundos e recarregar a lista | Os 5 alunos aparecem com `recertification_number = N+1`, `progress_score = 0`, status "Pendente". | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc3-disparar-reinscricao-massa-enfileira-worker.data.ts. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc3-disparar-reinscricao-massa-enfileira-worker.data.ts.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
1. Pré: Sidekiq operacional (worker `MassReenrollParticipantsWorker`)
1. 1. Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}"
1. 2. Selecionar 5 alunos elegíveis nos checkboxes
1. 3. Clicar em "Reinscrição em massa" no drawer
1. 4. Clicar em "Confirmar"
1. 5. Aguardar até 60 segundos e recarregar a lista

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC4 · Worker é idempotente: alunos já reinscritos na mesma janela são pulados · 🔴 Crítico

<a id="tc4-worker-e-idempotente-alunos-ja-reinscritos-na-mesma-janela-sao-pulados"></a>_Arquivo:_ `tc4-worker-idempotente-pulam-ja-reinscritos.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer execução do worker Sidekiq + validação direta no banco. Cobertura UI cobre dispatch; idempotência é DB-pure. Validar manualmente.

**Sumário (objetivo do caso):** Validar idempotência: re-disparar reinscrição em massa para alunos já reinscritos no mesmo curso não cria participants duplicados nem retorna erro (RN 9.1).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
Sidekiq operacional (worker `MassReenrollParticipantsWorker`)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Executar o fluxo do TC3 reinscrevendo 5 alunos (estado: todos com `recertification_number = N+1`) | 5 participants reinscritos criados. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer execução do worker Sidekiq + validação direta no banco. Cobertura UI cobre dispatch; idempotência é DB-pure. Validar manualmente. | — |
| 2 | Selecionar os mesmos 5 alunos novamente na listagem | Drawer exibe "5 selecionados". | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer execução do worker Sidekiq + validação direta no banco. Cobertura UI cobre dispatch; idempotência é DB-pure. Validar manualmente. | — |
| 3 | Clicar em "Reinscrição em massa" e confirmar | Toast de sucesso/processamento é exibido sem erro visível. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer execução do worker Sidekiq + validação direta no banco. Cobertura UI cobre dispatch; idempotência é DB-pure. Validar manualmente. | — |
| 4 | Aguardar até 60 segundos e recarregar a lista | Cada um dos 5 alunos continua com `recertification_number = N+1` (nenhum incremento adicional). Worker pulou silenciosamente. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer execução do worker Sidekiq + validação direta no banco. Cobertura UI cobre dispatch; idempotência é DB-pure. Validar manualmente. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer execução do worker Sidekiq + validação direta no banco. Cobertura UI cobre dispatch; idempotência é DB-pure. Validar manualmente.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
1. Pré: Sidekiq operacional (worker `MassReenrollParticipantsWorker`)
1. 1. Executar o fluxo do TC3 reinscrevendo 5 alunos (estado: todos com `recertification_number = N+1`)
1. 2. Selecionar os mesmos 5 alunos novamente na listagem
1. 3. Clicar em "Reinscrição em massa" e confirmar
1. 4. Aguardar até 60 segundos e recarregar a lista

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC5 · Erro em aluno individual não interrompe o lote · 🟡 Normal

<a id="tc5-erro-em-aluno-individual-nao-interrompe-o-lote"></a>_Arquivo:_ `tc5-erro-aluno-individual-nao-interrompe-lote.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer monitoramento do worker + validação de DLQ/logs. Validar manualmente.

**Sumário (objetivo do caso):** Validar que erro de processamento em 1 aluno (ex: aluno desativado entre seleção e processamento) não impede a criação dos demais participants do mesmo lote (RN 9.2).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
Sidekiq operacional (worker `MassReenrollParticipantsWorker`)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Pré-condição: 4 alunos elegíveis + 1 aluno marcado como `deleted_at` recente. | 5 alunos selecionáveis aparecem na lista. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer monitoramento do worker + validação de DLQ/logs. Validar manualmente. | — |
| 2 | Selecionar os 5 alunos e disparar reinscrição em massa pelo fluxo do TC3 | Toast de processamento é exibido. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer monitoramento do worker + validação de DLQ/logs. Validar manualmente. | — |
| 3 | Aguardar até 60 segundos e recarregar a lista | 4 alunos aparecem com `recertification_number = N+1`. O aluno deletado não aparece na listagem padrão e seu erro foi reportado ao Datadog/NewRelic (verificar fora do teste). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer monitoramento do worker + validação de DLQ/logs. Validar manualmente. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Normal
- **Motivo declarado pelo spec:** requer monitoramento do worker + validação de DLQ/logs. Validar manualmente.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
1. Pré: Sidekiq operacional (worker `MassReenrollParticipantsWorker`)
1. 1. Pré-condição: 4 alunos elegíveis + 1 aluno marcado como `deleted_at` recente.
1. 2. Selecionar os 5 alunos e disparar reinscrição em massa pelo fluxo do TC3
1. 3. Aguardar até 60 segundos e recarregar a lista

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC6 · Disparo de reinscrição em massa com flag OFF retorna HTTP 422 `feature_disabled` · 🔴 Crítico

<a id="tc6-disparo-de-reinscricao-em-massa-com-flag-off-retorna-http-422-feature-disabled"></a>_Arquivo:_ `tc6-flag-off-retorna-422-feature-disabled.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente HTTP 422.

**Sumário (objetivo do caso):** Validar bloqueio defensivo do controller `Api::V1::LearningStudentsController#action_mass` quando flag OFF (RN 10).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Curso com `has_recertification = true`
Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
Sidekiq operacional (worker `MassReenrollParticipantsWorker`)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Desativar a feature flag `:recertificacao` para a organização | Flag fica desativada. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente HTTP 422. | — |
| 2 | Disparar via API um `POST /api/v1/learning_students/action_mass` com `action_type=mass_reenroll_participants` e array de `participant_ids` | Response retorna status HTTP 422. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente HTTP 422. | — |
| 3 | Inspecionar o corpo da resposta | Body contém chave de erro `reenroll_participant.errors.feature_disabled`. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente HTTP 422. | — |
| 4 | Consultar a tabela "event_participants" via Rails console com "EventParticipant.where(id: participant_ids).count" | Contagem permanece a anterior — nenhum novo participant foi criado para os IDs enviados. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente HTTP 422. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente HTTP 422.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Curso com `has_recertification = true`
1. Pré: Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
1. Pré: Sidekiq operacional (worker `MassReenrollParticipantsWorker`)
1. 1. Desativar a feature flag `:recertificacao` para a organização
1. 2. Disparar via API um `POST /api/v1/learning_students/action_mass` com `action_type=mass_reenroll_participants` e array de `participant_ids`
1. 3. Inspecionar o corpo da resposta
1. 4. Consultar a tabela "event_participants" via Rails console com "EventParticipant.where(id: participant_ids).count"

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
