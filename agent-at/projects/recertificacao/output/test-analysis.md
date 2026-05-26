---
contract_version: 1.1
at_version: 1
project: recertificacao
project_name: "Recertificação"
generated_at: 2026-05-25T00:00:00Z
source_docs:
  - "docs/discovery.md"
  - "docs/qa-impact-map.md"
  - "docs/QA_Only_Recertificacao_v2.xlsx"
env: staging-base-de-conhecimento
env_secondary: null
totals:
  suites: 14
  test_cases: 62
  steps: 211
---

# Análise de Teste — Recertificação

> **AT v1 (contract_version 1.1)** — escopo: 14 suítes cobrindo os 6 canais
> de reinscrição (admin individual, massa, CSV, API V2, link público, Play),
> cascade em trilhas, ciclo de vida do certificado `REPLACED`, filtro
> avançado, e-mail diferenciado, isolamento de progresso por inscrição,
> comportamento da feature flag `:recertificacao`, auditoria via triggers
> PostgreSQL, e isolamento em ambientes adicionais.
>
> **Executor primário**: todas as suítes declaram `executor: playwright`
> (única opção em v1 do CONTRACT). Suítes com tipo `db`/`api` rodam via
> Playwright invocando validação secundária (V2 do contrato — manual
> hoje).
>
> **Cenários transversais embutidos como playbooks**:
> - `flipper` — toda suíte que dependa da `:recertificacao`
> - `cleanup-dados` — suítes que criam participants reinscritos
> - `ambientes-adicionais` — suíte 14 (isolamento entre tenants)
> - `toast-chakra` — suítes UI que validam toasts
> - `filtro-drawer` — suíte 9 (filtro avançado de status)
> - `switch-chakra` — suíte 1 (switch "Habilitar reinscrição")

## Dados de teste

### Organizações (chaves simbólicas)
- `org: principal` — default. Resolvido via `getOrgId()` (env `staging-base-de-conhecimento`).
- `org: secundario` — opcional, para suíte 14 (ambientes adicionais).

### Feature flag e gate funcional
- `featureFlag`: `:recertificacao` (Flipper, escopo por organização)
- `gateConteudo`: `events.has_recertification` (boolean, default `false`, `null: false`)

### Recursos para criação (worker-isolated)
- `cursoNameFormat`: "Curso Recertificação TC{n} w{workerIndex}-{timestamp}"
- `trilhaNameFormat`: "Trilha Recertificação TC{n} w{workerIndex}-{timestamp}"
- `alunoEmailFormat`: "aluno-tc{n}-w{workerIndex}-{timestamp}@example.com"

### Cenários de elegibilidade (RN 6)
- `cenarioAprovadoCompleto`: aluno com `progress_score = 100`
- `cenarioAprovadoManual`: aluno com `approved_at NOT NULL`
- `cenarioCertificadoExpirado`: aluno com `expires_at NOT NULL AND expires_at < hoje`
- `cenarioInelegivelEmAndamento`: aluno com `progress_score < 100`, sem `approved_at`, sem certificado expirado (REVISAR-FIGMA: confirmar texto exato do tooltip de inelegibilidade)

### Limites e defaults
- `recertificationNumberDefault`: 0 (conteúdo legado sem reinscrição)
- `csvReinscreverAceitos`: ["SIM", "sim", "true", "1"] (case-insensitive)
- `csvReinscreverIgnorados`: ["NÃO", "nao", "false", "0", "", null]
- `massReenrollWorkerRetries`: 3
- `cascadeJobsLimitTrilha`: ver throughput Sidekiq antes de pico (premissa)

### Status do certificado
- `CERTIFICATE_VALID`: 2
- `CERTIFICATE_EXPIRED`: 1
- `CERTIFICATE_REPLACED`: 4 (novo)
- `CERTIFICATE_STATUS_DESCRIPTIONS.replaced`: "replaced" (chave I18n)

### Tipos de conteúdo
- `cursoSimples`: `Event::KIND_COURSE` (eventos individuais)
- `trilha`: `Event::KIND_LEARNING_PATH` (cursos filhos)
- `pacote`: `ContentKind.package` (NÃO permite reinscrição em massa — RN 8)

## Textos literais

### Switch / formulário de conteúdo
- Label: "Habilitar reinscrição" (REVISAR-FIGMA: confirmar texto exato)
- Tooltip: chave I18n `activerecord.attributes.event.has_recertification_tooltip`

### Botões de ação
- "Reinscrever" — menu de ações por aluno (linha do participant na lista de aprendizagem)
- "Reinscrição em massa" — drawer de ações em massa (REVISAR-FIGMA: texto exato pode variar)
- "Reinscreva-se" — banner do Play (botão abaixo do botão original)

### Tooltips de estado dos botões
- "conteúdo não permite reinscrição" — tooltip quando `event.has_recertification = false` (RN 4.2)
- (REVISAR-FIGMA) — tooltip quando aluno não elegível (RN 4.3)

### Mensagens de erro (HTTP / I18n)
- `reenroll_participant.errors.feature_disabled` — HTTP 422 quando flag OFF chega ao controller
- `reenroll_participant.errors.recertification_disabled_for_event` — erro em linha CSV ou item API quando conteúdo sem `has_recertification`
- (REVISAR-FIGMA) — mensagem de inelegibilidade retornada pelo `CheckReenrollmentEligibilityUseCase`

### Status do certificado na UI
- "Substituído" — badge na coluna de status + opção no filtro avançado (RN 23.2, 23.1)
- (Outros status legado): "Emitido", "Pendente", "Expirado", "Aguardando assinatura"

### CSV
- Header da coluna: "Reinscrever"
- Valores aceitos: "SIM", "sim", "true", "1"
- Mensagem de erro de linha (conteúdo sem `has_recertification`): chave `reenroll_participant.errors.recertification_disabled_for_event`

### Toasts (a confirmar nos componentes do facelift React)
- "Reinscrição realizada com sucesso" (REVISAR-FIGMA — confirmar texto exato)
- "Reinscrição em massa iniciada" (REVISAR-FIGMA)
- Toast de erro genérico de feature flag OFF (REVISAR-FIGMA)

### Assuntos e templates de e-mail
- Reinscrição (`recertification_number > 0`):
  - Assunto I18n: `recertification_mailer.reenrollment.subject`
  - Template: `reenrollment_mail`
- Aviso de expiração próxima (legado, `recertification_number = 0`):
  - Assunto I18n: `recertification_mailer.expiration_reminder.subject`
  - Template: `recertification_mail`

## Modais relevantes

### "Confirmar reinscrição individual" (RN 5 — inferido, REVISAR-FIGMA)
- **Quando aparece**: ao clicar em "Reinscrever" na linha do aluno
- **Header**: "Confirmar reinscrição" (REVISAR-FIGMA)
- **Body**: "Deseja realmente reinscrever o aluno {nome do aluno} no curso?" (REVISAR-FIGMA)
- **Botões**: "Cancelar" / "Confirmar"
- **Pós-confirmar**: cria novo `EventParticipant`, dispara e-mail, exibe toast, refetch da tabela

### "Confirmação de Reinscrição em massa" (RN 8 — inferido)
- **Quando aparece**: ao clicar em "Reinscrição em massa" no drawer com alunos selecionados
- **Header**: "Reinscrição em massa" (REVISAR-FIGMA)
- **Body**: "Você está prestes a reinscrever {N} aluno(s). Esta ação dispara um worker assíncrono e não pode ser desfeita." (REVISAR-FIGMA)
- **Botões**: "Cancelar" / "Confirmar"

### NPS Sofia (oportunístico — playbook genérico)
- **Quando aparece**: navegação em Twygo (não específico desta feature)
- **Comportamento**: `safeGoto` + `dismissCommonModals` cobrem (CLAUDE.md raiz §7.6)

### Sync alert "Processamento em andamento" (RN 9 — inferido)
- **Quando aparece**: após disparar reinscrição em massa, enquanto worker processa
- **Comportamento**: pode bloquear interação com outros botões da tela enquanto ativo

## Endpoints (referência)

| Método | URL | Camada | Sucesso | Erro principal |
|---|---|---|---|---|
| `POST` | `/api/v1/contents/:event_id/event_participants` (com `recertification=true`) | Admin individual | 201 | 422 `feature_disabled` |
| `POST` | `/api/v1/learning_students/action_mass` (`action_type=mass_reenroll_participants`) | Admin massa | 202 | 422 `feature_disabled` |
| `POST` | `/api/v2/users/mass` (com array de `recertification: true` por item) | API V2 pública | 200/207 | 207 multi-status por item |
| `POST` | `/play/.../course_registrations?recertification=true` | Link público | 201 | 404 (flag off) / 422 (inelegível) |
| `POST` | `/api/v1/play/.../subscribe` (com `recertification=true`) | Play (aluno) | 201 | 404 |
| `GET` | `/api/v1/play/events/:id` | Play (aluno) | 200 (com `eligibleForRecertification`) | 401 |
| `GET` | `/learning_students` | Admin UI | 200 | — |
| `GET` | `/e/:id/edit`, `/contents/:id/edit` | Admin UI | 200 | — |
| Worker | `MassReenrollParticipantsWorker.perform_async(ids, options)` | Sidekiq | enfileira | — |
| Worker | `AddParticipantToLearningPath.perform_async(participant_id, org_id, recertification)` | Sidekiq | enfileira | — |
| Cron | `ExpiresCertificates` (diário) | Sidekiq | n/a | — |

## Campos e validações

| Contexto | Campo | Tipo | Obrigatório | Default / regra |
|---|---|---|---|---|
| Edição de conteúdo (HAML/React) | "Habilitar reinscrição" | switch | — | `false` por default; visível só com flag ON |
| EventParticipant | `recertification_number` | integer | sim | default `0`, NOT NULL |
| EventParticipant | `progress_score` (reinscrito) | integer | — | `0` ao criar participant reinscrito |
| EventParticipant | `final_score`, `attendance_score`, `approved_at`, `certificate_id` | — | — | `nil` ao criar reinscrito |
| EventParticipant | `certificate_status` (reinscrito) | enum | — | `PENDING` ao criar |
| Event | `has_recertification` | boolean | — | default `false`, NOT NULL |
| EventContentUser | `event_participant_id` | integer | — | `NULL` permitido (legado); novo registro sempre vincula ao participant ativo |
| Certificate | `situation` | enum | — | aceita `1` (EXPIRED), `2` (VALID), `4` (REPLACED — novo) |
| Índice DB | `unique_participant` em `event_participants` | — | — | `(user_id, event_id, partner_rel, recertification_number)` (recriado) |
| Validação Rails | `email` em `EventParticipant` | uniqueness | — | scope `[:event_id, :recertification_number, ...]` |
| Validação Rails | `cpf` em `EventParticipant` | uniqueness | — | mesmo scope acima |
| CSV (template) | coluna "Reinscrever" | string | — | aparece apenas com flag ON; aceita SIM/sim/true/1 |
| API V2 (payload) | `recertification` por participant | boolean | — | default false; ignorado silenciosamente se flag OFF |

---

---
suite: Configuração de Conteúdo (Switch "Habilitar reinscrição")
executor: playwright
org: principal
playbooks: [flipper, switch-chakra, cleanup-dados]
preconditions:
  - Feature flag `:recertificacao` ATIVA na organização do teste
  - Usuário logado como Admin
  - Pelo menos 1 curso pré-existente (para validar default `has_recertification = false`)
  - Pelo menos 1 trilha pré-existente (para validar paridade do switch)
---

# Configuração de Conteúdo (Switch "Habilitar reinscrição")

## TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [1, 1.1, 1.2, 2]

### Objetivo
Validar que o switch "Habilitar reinscrição" é exibido na tela de edição do curso quando a feature flag `:recertificacao` está habilitada para a organização (RN 1, 1.1, 1.2, 2).

### Passos
1. Acessar a URL "/o/{orgId}/dashboard"
   → Dashboard padrão é exibido contendo o menu lateral.
2. Navegar até a listagem de cursos da organização
   → Listagem de cursos é exibida com pelo menos 1 curso pré-existente.
3. Clicar em "Editar" no menu de ações do curso
   → Página de edição do curso é exibida na rota "/e/:id/edit" (HAML) ou "/contents/:id/edit" (React facelift).
4. Localizar a seção "Detalhes" ou seção principal do formulário
   → Switch "Habilitar reinscrição" está visível no formulário.
5. Posicionar o cursor sobre o ícone de ajuda do switch "Habilitar reinscrição"
   → Tooltip de ajuda é exibido com o texto da chave I18n "activerecord.attributes.event.has_recertification_tooltip".

## TC2 — Switch "Habilitar reinscrição" NÃO aparece com flag OFF (regressão)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [flipper]
**RNs cobertas**: [1, 2]

### Objetivo
Validar comportamento regressivo: com a feature flag desativada, o switch "Habilitar reinscrição" não é exibido na edição do conteúdo (RN 1 — kill switch global).

### Passos
1. Desativar a feature flag `:recertificacao` para a organização via Flipper Admin
   → Feature flag fica desativada na organização atual.
2. Acessar a tela de edição de um curso existente em "/e/{eventId}/edit"
   → Página de edição do curso é exibida normalmente.
3. Inspecionar o formulário em busca do label "Habilitar reinscrição"
   → Label "Habilitar reinscrição" NÃO está presente em nenhum lugar do formulário.
4. Salvar o curso sem alterações
   → Curso é salvo com sucesso e atributo `events.has_recertification` permanece `false` (default).

## TC3 — Ativar e salvar o switch persiste `has_recertification = true`
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: [2, 2.1, 2.2]

### Objetivo
Validar persistência: ao ativar o switch e salvar, o atributo `events.has_recertification` é atualizado para `true` no backend (RN 2, 2.1).

### Passos
1. Acessar a edição de um curso com `has_recertification = false`
   → Página de edição é exibida e switch "Habilitar reinscrição" está visível e desligado.
2. Clicar no switch "Habilitar reinscrição"
   → Switch transita para o estado ligado (ON).
3. Clicar no botão "Salvar"
   → Toast de sucesso é exibido (REVISAR-FIGMA: texto exato do toast).
4. Recarregar a página de edição do mesmo curso
   → Switch "Habilitar reinscrição" continua no estado ligado, refletindo o valor persistido `has_recertification = true`.

## TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]
**RNs cobertas**: [2.3]

### Objetivo
Validar que desativar o switch num curso que já possui participants reinscritos é permitido sem qualquer modal/aviso de bloqueio, preservando o histórico (RN 2.3).

### Passos
1. Pré-condição: curso "Curso com Reinscritos w{workerIndex}" com `has_recertification = true` e ao menos 1 participant com `recertification_number > 0`.
   → Curso e participants pré-existem no env.
2. Acessar a edição deste curso em "/e/{eventId}/edit"
   → Página de edição é exibida com switch ligado.
3. Clicar no switch "Habilitar reinscrição" para desligá-lo
   → Switch transita para o estado desligado. Nenhum modal de confirmação ou aviso é exibido.
4. Clicar em "Salvar"
   → Curso é salvo. `events.has_recertification` passa para `false`. Participants existentes mantêm seu `recertification_number > 0` no banco (histórico preservado).

## TC5 — Paridade do switch entre formulário HAML e formulário React (facelift)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [2.1]

### Objetivo
Validar que o switch tem comportamento equivalente nas duas telas (`_form_details.haml` e `event-form.tsx`), gravando na mesma coluna (RN 2.1).

### Passos
1. Editar um curso na tela HAML em "/e/{eventId}/edit", ativar o switch e salvar
   → Switch ativado, salvo com sucesso, `has_recertification = true` persiste.
2. Acessar o MESMO curso pela tela React em "/contents/{eventId}/edit"
   → Tela facelift carrega com switch "Habilitar reinscrição" no estado ligado.
3. Desativar o switch na tela React e salvar
   → Switch desativado, salvo com sucesso.
4. Recarregar a edição na tela HAML
   → Switch aparece desligado, confirmando que ambas escrevem em `events.has_recertification`.

---

---
suite: Reinscrição Individual pelo Admin
executor: playwright
org: principal
playbooks: [flipper, cleanup-dados, toast-chakra]
preconditions:
  - Feature flag `:recertificacao` ATIVA na organização
  - Curso com `has_recertification = true`
  - Usuário logado como Admin
  - Pelo menos 3 alunos cadastrados no curso em cenários distintos:
      (a) elegível por `progress_score = 100`
      (b) elegível por certificado expirado (`expires_at < hoje`)
      (c) inelegível (em andamento, `progress_score < 100`, sem aprovação, sem certificado expirado)
---

# Reinscrição Individual pelo Admin

## TC1 — Botão "Reinscrever" visível e habilitado apenas para aluno elegível
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [4, 4.1, 6]

### Objetivo
Validar visibilidade e habilitação do botão "Reinscrever" no menu de ação da linha do aluno, conforme regras de elegibilidade (RN 4, 4.1, 6).

### Passos
1. Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}"
   → Lista de alunos é exibida com pelo menos os 3 alunos pré-condicionados.
2. Abrir o menu de ações da linha do aluno "(a) elegível por progresso 100%"
   → Menu de ações é exibido contendo o item "Reinscrever" habilitado (sem tooltip de bloqueio).
3. Clicar fora para fechar o menu e abrir o menu da linha do aluno "(b) elegível por certificado expirado"
   → Menu exibe o item "Reinscrever" habilitado.
4. Abrir o menu da linha do aluno "(c) inelegível em andamento"
   → Item "Reinscrever" é exibido mas DESABILITADO; ao posicionar o cursor sobre o item, tooltip explicativo de inelegibilidade é exibido (REVISAR-FIGMA: confirmar texto).

## TC2 — Botão "Reinscrever" visível apenas na linha do participant com maior `recertification_number`
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [4]

### Objetivo
Validar que para um aluno com múltiplas inscrições históricas, o botão "Reinscrever" aparece APENAS na linha do participant com maior `recertification_number` (RN 4).

### Passos
1. Pré-condição: aluno "Aluno Multi-Reinscrição w{workerIndex}" com 2 participants no curso: `recertification_number = 0` e `recertification_number = 1`.
   → Backend tem ambos os registros.
2. Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}"
   → Listagem padrão exibe apenas a inscrição com maior `recertification_number` (campo `is_latest_recertification = 1`).
3. Aplicar filtro para exibir histórico completo (REVISAR-FIGMA: confirmar como exibir histórico)
   → Ambas as inscrições do aluno são exibidas.
4. Abrir o menu de ações da linha com `recertification_number = 0`
   → Item "Reinscrever" NÃO está presente no menu (apenas demais ações como "Ver detalhes").
5. Abrir o menu de ações da linha com `recertification_number = 1`
   → Item "Reinscrever" está presente no menu, habilitado (assumindo aluno elegível).

## TC3 — Reinscrever aluno individualmente cria novo participant zerado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados, toast-chakra]
**RNs cobertas**: [5, 7]

### Objetivo
Validar criação de novo `EventParticipant` com campos zerados após reinscrição individual (RN 5, 7).

### Passos
1. Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}"
   → Lista exibe aluno "(a) elegível" com `recertification_number = N`.
2. Clicar no item "Reinscrever" no menu da linha
   → Modal de confirmação "Confirmar reinscrição" é exibido (REVISAR-FIGMA: header e body exatos).
3. Clicar em "Confirmar"
   → Modal fecha, toast de sucesso é exibido (REVISAR-FIGMA: texto exato); tabela faz refetch automático.
4. Localizar a linha do aluno na listagem
   → Aluno aparece com `recertification_number = N+1`, `progress_score = 0`, badge de status "Pendente" (REVISAR-FIGMA: texto exato), sem nota e sem certificado.

## TC4 — Botão "Reinscrever" fica visível mas DESABILITADO quando `event.has_recertification = false`
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [4.2]

### Objetivo
Validar que em conteúdo com `has_recertification = false`, o botão "Reinscrever" aparece visível mas desabilitado com tooltip explicativo (RN 4.2).

### Passos
1. Pré-condição: curso "Curso sem Reinscrição w{workerIndex}" com `has_recertification = false` e ao menos 1 aluno elegível por progresso 100%.
   → Curso e aluno pré-existem no env.
2. Acessar a lista de aprendizagem deste curso em "/learning_students?event_id={eventId}"
   → Lista exibe o aluno elegível.
3. Abrir o menu de ações da linha do aluno
   → Item "Reinscrever" é exibido mas DESABILITADO.
4. Posicionar o cursor sobre o item "Reinscrever"
   → Tooltip "conteúdo não permite reinscrição" é exibido.

## TC5 — Reinscrição com flag OFF retorna HTTP 422 `feature_disabled`
**Prioridade**: high
**Tipo**: api
**Playbooks adicionais**: [flipper]
**RNs cobertas**: [1, 10]

### Objetivo
Validar comportamento defensivo do backend: mesmo se a ação chegar ao controller com a flag desativada (cenário de exploit / tela em cache), o endpoint retorna HTTP 422 estruturado (RN 1, RN 10).

### Passos
1. Desativar a feature flag `:recertificacao` para a organização via Flipper Admin
   → Flag fica desativada.
2. Disparar via API um `POST /api/v1/contents/{eventId}/event_participants` com body `{ user_id: {alunoId}, recertification: true }`
   → Response retorna status HTTP 422.
3. Inspecionar o corpo da resposta
   → Body contém chave de erro `reenroll_participant.errors.feature_disabled` (chave I18n).
4. Consultar a tabela "event_participants" via Rails console com "EventParticipant.where(user_id: X, event_id: Y).count"
   → Contagem retorna o valor anterior — nenhum novo `EventParticipant` foi criado para o par `(user_id, event_id)`.

## TC6 — Após reinscrição, e-mail diferenciado é disparado (validação cross-suite)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [7, 24, 24.1]

### Objetivo
Validar que ao concluir reinscrição individual, o `RecertificationMailer#student_email` é disparado com template `reenrollment_mail` (RN 7, 24.1). Validação detalhada em suíte 10.

### Passos
1. Acessar a lista de aprendizagem com a inbox de teste aberta em paralelo (REVISAR-FIGMA: tooling de inbox em staging)
   → Lista de aprendizagem é exibida.
2. Reinscrever um aluno elegível pelo fluxo do TC3
   → Toast de sucesso é exibido.
3. Aguardar até 30 segundos pelo e-mail na inbox do aluno
   → E-mail é recebido na caixa de entrada.
4. Inspecionar o assunto e o corpo do e-mail
   → Assunto corresponde à chave I18n `recertification_mailer.reenrollment.subject`; corpo corresponde ao template `reenrollment_mail` (não ao `recertification_mail` legado).

---

---
suite: Reinscrição em Massa pelo Admin
executor: playwright
org: principal
playbooks: [flipper, cleanup-dados, toast-chakra]
preconditions:
  - Feature flag `:recertificacao` ATIVA
  - Curso com `has_recertification = true`
  - Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
  - Sidekiq operacional (worker `MassReenrollParticipantsWorker`)
---

# Reinscrição em Massa pelo Admin

## TC1 — Ação "Reinscrição em massa" aparece no drawer quando todas as condições atendidas
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [8]

### Objetivo
Validar visibilidade condicional da ação "Reinscrição em massa" no drawer de ações em massa: flag ON, `has_recertification = true` e tipo do evento ≠ pacote (RN 8).

### Passos
1. Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}"
   → Lista de alunos é exibida.
2. Selecionar 3 alunos clicando nos checkboxes correspondentes
   → Drawer de ações em massa é exibido na lateral com a contagem "3 selecionados".
3. Inspecionar as opções do drawer
   → Opção "Reinscrição em massa" está visível e habilitada.

## TC2 — Ação "Reinscrição em massa" NÃO aparece em evento do tipo pacote
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [8]

### Objetivo
Validar regra de visibilidade: ação não aparece se o evento for do tipo pacote (`ContentKind.package`), mesmo com flag e gate ON (RN 8).

### Passos
1. Pré-condição: pacote "Pacote Recertificação w{workerIndex}" com `has_recertification = true` e ao menos 3 alunos
   → Pacote pré-existe no env.
2. Acessar a lista de aprendizagem do pacote em "/learning_students?event_id={packageId}"
   → Lista de alunos do pacote é exibida.
3. Selecionar 3 alunos
   → Drawer de ações em massa é exibido.
4. Inspecionar as opções do drawer
   → Opção "Reinscrição em massa" NÃO está presente.

## TC3 — Disparar reinscrição em massa enfileira worker e processa todos os alunos elegíveis
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]
**RNs cobertas**: [9, 9.2]

### Objetivo
Validar que ao confirmar reinscrição em massa, o worker `MassReenrollParticipantsWorker` é enfileirado e processa todos os alunos selecionados criando participants reinscritos (RN 9).

### Passos
1. Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}"
   → Lista de alunos é exibida com pelo menos 5 alunos elegíveis.
2. Selecionar 5 alunos elegíveis nos checkboxes
   → Drawer exibe contagem "5 selecionados".
3. Clicar em "Reinscrição em massa" no drawer
   → Modal de confirmação é exibido (REVISAR-FIGMA: texto exato do modal).
4. Clicar em "Confirmar"
   → Modal fecha, toast "Reinscrição em massa iniciada" é exibido (REVISAR-FIGMA texto exato).
5. Aguardar até 60 segundos e recarregar a lista
   → Os 5 alunos aparecem com `recertification_number = N+1`, `progress_score = 0`, status "Pendente".

## TC4 — Worker é idempotente: alunos já reinscritos na mesma janela são pulados
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]
**RNs cobertas**: [9.1]

### Objetivo
Validar idempotência: re-disparar reinscrição em massa para alunos já reinscritos no mesmo curso não cria participants duplicados nem retorna erro (RN 9.1).

### Passos
1. Executar o fluxo do TC3 reinscrevendo 5 alunos (estado: todos com `recertification_number = N+1`)
   → 5 participants reinscritos criados.
2. Selecionar os mesmos 5 alunos novamente na listagem
   → Drawer exibe "5 selecionados".
3. Clicar em "Reinscrição em massa" e confirmar
   → Toast de sucesso/processamento é exibido sem erro visível.
4. Aguardar até 60 segundos e recarregar a lista
   → Cada um dos 5 alunos continua com `recertification_number = N+1` (nenhum incremento adicional). Worker pulou silenciosamente.

## TC5 — Erro em aluno individual não interrompe o lote
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [9.2]

### Objetivo
Validar que erro de processamento em 1 aluno (ex: aluno desativado entre seleção e processamento) não impede a criação dos demais participants do mesmo lote (RN 9.2).

### Passos
1. Pré-condição: 4 alunos elegíveis + 1 aluno marcado como `deleted_at` recente.
   → 5 alunos selecionáveis aparecem na lista.
2. Selecionar os 5 alunos e disparar reinscrição em massa pelo fluxo do TC3
   → Toast de processamento é exibido.
3. Aguardar até 60 segundos e recarregar a lista
   → 4 alunos aparecem com `recertification_number = N+1`. O aluno deletado não aparece na listagem padrão e seu erro foi reportado ao Datadog/NewRelic (verificar fora do teste).

## TC6 — Disparo de reinscrição em massa com flag OFF retorna HTTP 422 `feature_disabled`
**Prioridade**: high
**Tipo**: api
**Playbooks adicionais**: [flipper]
**RNs cobertas**: [10]

### Objetivo
Validar bloqueio defensivo do controller `Api::V1::LearningStudentsController#action_mass` quando flag OFF (RN 10).

### Passos
1. Desativar a feature flag `:recertificacao` para a organização
   → Flag fica desativada.
2. Disparar via API um `POST /api/v1/learning_students/action_mass` com `action_type=mass_reenroll_participants` e array de `participant_ids`
   → Response retorna status HTTP 422.
3. Inspecionar o corpo da resposta
   → Body contém chave de erro `reenroll_participant.errors.feature_disabled`.
4. Consultar a tabela "event_participants" via Rails console com "EventParticipant.where(id: participant_ids).count"
   → Contagem permanece a anterior — nenhum novo participant foi criado para os IDs enviados.

---

---
suite: Reinscrição via Importação CSV
executor: playwright
org: principal
playbooks: [flipper, cleanup-dados]
preconditions:
  - Feature flag `:recertificacao` ATIVA
  - Curso com `has_recertification = true`
  - Usuário logado como Admin
  - Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)
---

# Reinscrição via Importação CSV

## TC1 — Coluna "Reinscrever" aparece no template CSV com flag ON
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [11]

### Objetivo
Validar que o template CSV baixado pelo admin contém a coluna "Reinscrever" quando a flag `:recertificacao` está ativa na organização (RN 11).

### Passos
1. Acessar a página de importação de participantes em "/o/{orgId}/events/{eventId}/import_participants" (REVISAR-FIGMA: confirmar URL)
   → Página de importação é exibida com link "Baixar template CSV".
2. Clicar em "Baixar template CSV"
   → Download do arquivo template.csv inicia.
3. Abrir o arquivo template.csv baixado
   → Header da planilha contém a coluna "Reinscrever" (entre as colunas existentes).

## TC2 — Coluna "Reinscrever" NÃO aparece no template CSV com flag OFF (regressão)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [flipper]
**RNs cobertas**: [11]

### Objetivo
Validar comportamento regressivo: com flag OFF, template CSV não contém a coluna nova (RN 11).

### Passos
1. Desativar a feature flag `:recertificacao` para a organização
   → Flag fica desativada.
2. Acessar a página de importação e baixar o template CSV
   → Download conclui.
3. Abrir o arquivo template.csv
   → Header NÃO contém a coluna "Reinscrever". Todas as demais colunas (Nome, Email, CPF, etc.) presentes.

## TC3 — Upload de CSV com `Reinscrever=SIM` para usuário existente cria participant reinscrito
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]
**RNs cobertas**: [12, 13]

### Objetivo
Validar fluxo principal: linha com `Reinscrever=SIM` para usuário já cadastrado e elegível cria novo participant com `recertification_number` incrementado, bypassando o erro `:in_use` (RN 12, 13).

### Passos
1. Preparar arquivo "participants-reenroll.csv" com 1 linha contendo o email do "Aluno Elegível w{workerIndex}" e `Reinscrever=SIM`
   → Arquivo CSV criado no disco do executor.
2. Acessar a página de importação de participantes em "/o/{orgId}/events/{eventId}/import_participants"
   → Página exibida com upload de arquivo.
3. Fazer upload do arquivo "participants-reenroll.csv"
   → Upload é aceito. Toast "Importação iniciada" é exibido (REVISAR-FIGMA texto exato).
4. Aguardar até 30 segundos pelo processamento do worker `CsvImportEventParticipantWorker`
   → Worker conclui.
5. Acessar a lista de aprendizagem do curso
   → "Aluno Elegível w{workerIndex}" aparece com `recertification_number = N+1`, `progress_score = 0`, status "Pendente". Aluno também recebe e-mail de reinscrição.

## TC4 — Valores de `Reinscrever` aceitos (case-insensitive: SIM/sim/true/1)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]
**RNs cobertas**: [11.1]

### Objetivo
Validar matriz de valores aceitos na coluna "Reinscrever" — todos resultam em reinscrição (RN 11.1).

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

### Passos
1. Preparar arquivo CSV contendo 7 linhas com os 7 valores da matriz acima para 7 alunos distintos
   → Arquivo CSV criado.
2. Fazer upload pela página de importação
   → Worker processa.
3. Aguardar processamento e abrir lista de aprendizagem
   → 4 alunos (SIM/sim/true/1) aparecem com `recertification_number > 0`. Os 3 alunos com valor "NÃO", vazio ou inválido NÃO aparecem como reinscritos (fluxo normal de inscrição).

## TC5 — Linha com `Reinscrever=SIM` em conteúdo com `has_recertification=false` registra erro estruturado
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [12]

### Objetivo
Validar erro por linha quando o conteúdo de destino não permite reinscrição (RN 12).

### Passos
1. Pré-condição: curso "Curso sem Reinscrição w{workerIndex}" com `has_recertification = false`.
   → Curso pré-existe.
2. Preparar CSV com 1 linha contendo email de aluno existente, curso destino "Curso sem Reinscrição" e `Reinscrever=SIM`
   → Arquivo CSV criado.
3. Fazer upload na página de importação
   → Upload aceito; worker processa.
4. Aguardar processamento e acessar a tela de "Resultado da importação" (REVISAR-FIGMA: URL exata)
   → Linha aparece como erro com mensagem da chave `reenroll_participant.errors.recertification_disabled_for_event`. Nenhum participant criado para esta linha.

## TC6 — Linha com `Reinscrever=SIM` para usuário INEXISTENTE cai no fluxo normal de criação (sem reinscrição)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]
**RNs cobertas**: [12]

### Objetivo
Validar que reinscrição via CSV requer usuário pré-existente. Linha com `Reinscrever=SIM` para email novo cria participant com `recertification_number = 0` (fluxo legado) (RN 12).

### Passos
1. Preparar CSV com 1 linha contendo email "novo-aluno-w{workerIndex}-{ts}@example.com" e `Reinscrever=SIM`
   → CSV criado.
2. Fazer upload do CSV
   → Upload aceito; worker processa.
3. Aguardar e verificar a lista de aprendizagem em "/learning_students?event_id={eventId}"
   → Novo usuário foi criado. Aparece no curso com `recertification_number = 0` (não como reinscrição — fluxo de criação original).
4. Inspecionar a caixa de entrada "inbox" do novo aluno em busca do e-mail "Bem-vindo ao curso"
   → E-mail recebido é o de inscrição original (assunto da chave "events.welcome_subject", NÃO o template `reenrollment_mail`).

## TC7 — Pós-importação, e-mails são enviados APENAS para participants com `recertification_number > 0` criados nesta execução
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [13]

### Objetivo
Validar escopo do disparo de e-mails: apenas os recém-criados como reinscritos recebem o e-mail diferenciado (RN 13).

### Passos
1. Preparar CSV com 3 linhas: linha A (`Reinscrever=SIM` user existente — cria reinscrito), linha B (`Reinscrever=NÃO` user existente — não cria nada porque já está inscrito), linha C (`Reinscrever=SIM` user novo — cria com `recertification_number = 0`)
   → CSV criado.
2. Fazer upload e aguardar processamento
   → Worker processa as 3 linhas.
3. Inspecionar inboxes dos 3 alunos
   → Apenas o aluno A recebe e-mail com assunto `recertification_mailer.reenrollment.subject` (template `reenrollment_mail`). Alunos B e C não recebem este e-mail diferenciado.

---

---
suite: Reinscrição via API V2
executor: playwright
org: principal
playbooks: [flipper, cleanup-dados]
preconditions:
  - Feature flag `:recertificacao` ATIVA na organização
  - Curso "Curso API V2 Reinscrição w{workerIndex}" com `has_recertification = true`
  - Curso "Curso API V2 SEM Reinscrição w{workerIndex}" com `has_recertification = false`
  - Pelo menos 2 alunos pré-cadastrados e elegíveis
  - Token de acesso à API V2 disponível (REVISAR: como obter token em staging)
---

# Reinscrição via API V2

## TC1 — POST /api/v2/users/mass com `recertification=true` cria participants reinscritos
**Prioridade**: critical
**Tipo**: api
**Playbooks adicionais**: []
**RNs cobertas**: [14]

### Objetivo
Validar fluxo principal da API V2: payload com `recertification: true` por participant cria participants reinscritos com `recertification_number` incrementado (RN 14).

### Passos
1. Preparar payload JSON `{"participants": [{"email":"aluno1@example.com", "event_id": <id_com_recertification>, "recertification": true}]}`
   → Payload pronto.
2. Disparar `POST /api/v2/users/mass` com o payload, autenticado com token de admin
   → Response retorna HTTP 200 ou 207 (multi-status).
3. Inspecionar o corpo da resposta
   → Item correspondente ao aluno aparece com status de sucesso, sem erro.
4. Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}"
   → "aluno1@example.com" aparece com `recertification_number = N+1`, `progress_score = 0`, status "Pendente".

## TC2 — Item com `recertification=true` em curso com `has_recertification=false` retorna erro por item (HTTP 207)
**Prioridade**: high
**Tipo**: api
**Playbooks adicionais**: []
**RNs cobertas**: [14.1]

### Objetivo
Validar resposta multi-status: payload misto com itens válidos e itens inválidos retorna sucessos e erros por item (RN 14.1).

### Passos
1. Preparar payload JSON com 2 items:
   item A: `{"email":"aluno_valido@example.com", "event_id": <id_com_recertification>, "recertification": true}`
   item B: `{"email":"aluno_invalido@example.com", "event_id": <id_SEM_recertification>, "recertification": true}`
   → Payload pronto.
2. Disparar `POST /api/v2/users/mass` autenticado
   → Response retorna HTTP 207 (multi-status).
3. Inspecionar o corpo da resposta
   → Array de resultados: item A com sucesso e participant criado; item B com erro estruturado contendo chave I18n `reenroll_participant.errors.recertification_disabled_for_event`.

## TC3 — Payload sem `recertification` segue fluxo legado (regressão)
**Prioridade**: critical
**Tipo**: api
**Playbooks adicionais**: []
**RNs cobertas**: [14]

### Objetivo
Validar compatibilidade retroativa: payloads de integrações antigas (sem chave `recertification`) seguem o fluxo de inscrição original (RN 14).

### Passos
1. Preparar payload JSON antigo `{"participants": [{"email":"aluno_legado@example.com", "event_id": <id_com_recertification>}]}` (sem `recertification`)
   → Payload pronto.
2. Disparar `POST /api/v2/users/mass` autenticado
   → Response retorna HTTP 200 com sucesso.
3. Acessar a lista de aprendizagem
   → "aluno_legado@example.com" aparece com `recertification_number = 0` (fluxo de inscrição original — sem reinscrição).

## TC4 — Com flag OFF, parâmetro `recertification` é ignorado silenciosamente
**Prioridade**: high
**Tipo**: api
**Playbooks adicionais**: [flipper]
**RNs cobertas**: [14.2]

### Objetivo
Validar compatibilidade: com flag OFF na org, payload com `recertification: true` é processado como inscrição normal sem retornar erro (RN 14.2).

### Passos
1. Desativar a feature flag `:recertificacao` para a organização
   → Flag fica OFF.
2. Disparar `POST /api/v2/users/mass` com payload contendo `recertification: true` por item
   → Response retorna HTTP 200 com sucesso. Sem erro relacionado a feature flag.
3. Acessar a lista de aprendizagem
   → Aluno aparece com `recertification_number = 0` (parâmetro foi ignorado).

---

---
suite: Reinscrição pelo Aluno (Play e Link Público)
executor: playwright
org: principal
playbooks: [flipper, cleanup-dados, toast-chakra]
preconditions:
  - Feature flag `:recertificacao` ATIVA
  - Curso com `has_recertification = true`
  - Aluno "Aluno Play Reinscrição w{workerIndex}" cadastrado e elegível (progresso 100% ou expirado)
  - Aluno "Aluno Play Inelegível w{workerIndex}" cadastrado mas em andamento
  - Pacote com link público gerado em "/play/.../course_registrations"
---

# Reinscrição pelo Aluno (Play e Link Público)

## TC1 — Botão "Reinscreva-se" aparece no banner do Play para aluno elegível
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [16, 16.1]

### Objetivo
Validar exibição do botão "Reinscreva-se" no banner do Play, abaixo do botão original, para aluno elegível com flag e gate ON (RN 16, 16.1).

### Passos
1. Login com o aluno "Aluno Play Reinscrição w{workerIndex}"
   → Aluno autenticado e redirecionado ao Play.
2. Acessar a página do curso elegível no Play em "/play/event/{eventId}"
   → Página do curso é exibida; banner principal contém o botão original (acesso/inscrição).
3. Inspecionar o banner do Play
   → Banner exibe DOIS botões empilhados: botão original em cima + botão "Reinscreva-se" abaixo.

## TC2 — Botão "Reinscreva-se" NÃO aparece para aluno inelegível (sem disabled visível)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [16.2]

### Objetivo
Validar que aluno inelegível NÃO vê o botão (não é exibido como disabled — simplesmente sumido) (RN 16.2).

### Passos
1. Login com o aluno "Aluno Play Inelegível w{workerIndex}"
   → Aluno autenticado.
2. Acessar a página do curso no Play em "/play/event/{eventId}"
   → Página do curso é exibida.
3. Inspecionar o banner do Play
   → Apenas o botão original (acesso/inscrição) é exibido. Botão "Reinscreva-se" NÃO está presente nem como disabled.

## TC3 — Click em "Reinscreva-se" dispara subscribe com `recertification=true` e cria novo participant
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados, toast-chakra]
**RNs cobertas**: [17]

### Objetivo
Validar fluxo de auto-reinscrição: click no botão dispara `POST /api/v1/play/.../subscribe` com `recertification=true` e o backend cria novo participant (RN 17).

### Passos
1. Login com "Aluno Play Reinscrição w{workerIndex}" e acessar a página do curso
   → Botão "Reinscreva-se" está visível.
2. Clicar no botão "Reinscreva-se"
   → Request `POST /api/v1/play/.../subscribe` é enviada com body contendo `recertification: true`. Response retorna HTTP 201 com o objeto `participant` criado.
3. Aguardar refresh do contexto `PlaySubscriptionContext`
   → Banner do Play é atualizado refletindo o novo participant (`recertification_number = N+1`, `progress_score = 0`).
4. Em sessão separada como admin, acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}"
   → Novo participant aparece para o aluno com `recertification_number = N+1`.

## TC4 — Flag OFF na org: banner do Play NÃO exibe "Reinscreva-se"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [flipper]
**RNs cobertas**: [16.2]

### Objetivo
Validar que sem a flag, mesmo aluno elegível não vê o botão (RN 16.2 — comportamento regressivo).

### Passos
1. Desativar a feature flag `:recertificacao` para a organização
   → Flag OFF.
2. Login com "Aluno Play Reinscrição w{workerIndex}" e acessar a página do curso
   → Página do curso é exibida.
3. Inspecionar o banner
   → Apenas o botão original é exibido. Botão "Reinscreva-se" NÃO aparece.

## TC5 — POST em link público com `?recertification=true` para aluno elegível cria participant
**Prioridade**: high
**Tipo**: api
**Playbooks adicionais**: []
**RNs cobertas**: [15]

### Objetivo
Validar fluxo de link público de pacote: POST com `recertification=true` valida elegibilidade e cria participant se elegível (RN 15).

### Passos
1. Preparar URL do pacote público com query `?recertification=true`
   → URL pronta: `/play/{packageSlug}/course_registrations?recertification=true`.
2. Disparar `POST` na URL acima com payload do aluno elegível (email, nome, cpf)
   → Response retorna HTTP 201 com o participant criado contendo `recertification_number = N+1`.
3. Acessar a lista de aprendizagem como admin
   → Aluno aparece reinscrito no curso correspondente ao pacote.

## TC6 — POST em link público com `recertification=true` para aluno inelegível retorna erro sem criar participant
**Prioridade**: medium
**Tipo**: api
**Playbooks adicionais**: []
**RNs cobertas**: [15]

### Objetivo
Validar resposta de erro para aluno inelegível via link público (RN 15).

### Passos
1. Preparar payload de aluno inelegível (em andamento, sem expiração) no POST com `?recertification=true`
   → Payload pronto.
2. Disparar `POST /play/{packageSlug}/course_registrations?recertification=true`
   → Response retorna HTTP 422 com mensagem de erro do `CheckReenrollmentEligibilityUseCase`.
3. Consultar a tabela "event_participants" via Rails console com "EventParticipant.where(user_id: X, event_id: Y).count"
   → Contagem permanece a anterior — nenhum novo participant criado para o par `(user_id, event_id)`.

## TC7 — POST em link público com flag OFF retorna HTTP 404 com payload vazio
**Prioridade**: high
**Tipo**: api
**Playbooks adicionais**: [flipper]
**RNs cobertas**: [15]

### Objetivo
Validar resposta defensiva 404 para link público quando flag desativada (RN 15).

### Passos
1. Desativar a feature flag `:recertificacao` para a organização do pacote
   → Flag OFF.
2. Disparar `POST /play/{packageSlug}/course_registrations?recertification=true` com payload válido
   → Response retorna HTTP 404 Not Found com body vazio (`{}`).
3. Consultar a tabela "event_participants" via Rails console com "EventParticipant.where(user_id: X, event_id: Y).count"
   → Contagem permanece a anterior — nenhum participant criado.

---

---
suite: Cascade de Reinscrição em Trilhas
executor: playwright
org: principal
playbooks: [flipper, cleanup-dados]
preconditions:
  - Feature flag `:recertificacao` ATIVA
  - Trilha "Trilha Reinscrição w{workerIndex}" com `has_recertification = true` e 3 cursos filhos vinculados
  - Pelo menos 2 alunos elegíveis na trilha
  - Sidekiq operacional (worker `AddParticipantToLearningPath`)
---

# Cascade de Reinscrição em Trilhas

## TC1 — Reinscrever trilha individualmente cria participants nos cursos filhos com `recertification_number` correto por curso
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]
**RNs cobertas**: [18, 18.1]

### Objetivo
Validar cascade de reinscrição: ao reinscrever aluno numa trilha, cada curso filho recebe novo participant com `recertification_number` calculado por par `(user_id, course_id)` (RN 18, 18.1).

### Passos
1. Acessar a lista de aprendizagem da trilha em "/learning_students?event_id={trilhaId}"
   → Lista de alunos da trilha é exibida.
2. Clicar em "Reinscrever" na linha do aluno elegível e confirmar
   → Modal fecha, toast de sucesso, novo participant da trilha criado com `recertification_number = N_trilha + 1`.
3. Aguardar até 60 segundos pelo processamento do worker `AddParticipantToLearningPath`
   → Worker processa.
4. Acessar a lista de aprendizagem de cada curso filho da trilha em "/learning_students?event_id={cursoFilhoId}"
   → Aluno aparece em cada um dos 3 cursos filhos com `recertification_number = N_curso_filho + 1` (incremento INDEPENDENTE por curso, não pelo número da trilha).

## TC2 — Filtro "já inscrito" é bypassado em fluxos de reinscrição (cria segunda/N-ésima inscrição)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]
**RNs cobertas**: [18.2]

### Objetivo
Validar que cascade não bloqueia o aluno mesmo que ele já tenha participant em algum curso filho (RN 18.2).

### Passos
1. Pré-condição: aluno com participant ativo em 2 dos 3 cursos filhos da trilha, e sem participant no 3º.
   → Estado preparado.
2. Reinscrever o aluno na trilha pelo fluxo do TC1
   → Worker processa.
3. Acessar a lista de aprendizagem de cada um dos 3 cursos filhos em "/learning_students?event_id={cursoFilhoId}"
   → Aluno aparece nos 3 cursos com `recertification_number > 0` (mesmo nos 2 onde já estava inscrito antes — filtro `event_and_user_id_subscribed` bypassado).

## TC3 — Cascade NÃO acontece em inscrição original (sem `recertification`) — regressão crítica
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [19]

### Objetivo
Validar comportamento regressivo: worker `AddParticipantToLearningPath` chamado sem 3º argumento (`recertification = false`) NÃO dispara cascade de reinscrição — segue fluxo `associate_courses_for_initial_enrollment` antigo (RN 19).

### Passos
1. Disparar inscrição original (sem reinscrição) de aluno novo na trilha via API ou UI
   → Aluno é inscrito na trilha com `recertification_number = 0`.
2. Aguardar processamento do worker
   → Worker processa.
3. Acessar a lista de aprendizagem de cada curso filho em "/learning_students?event_id={cursoFilhoId}"
   → Aluno aparece em cada curso filho com `recertification_number = 0` (fluxo original — sem incremento).

## TC4 — Cascade síncrona inline no fluxo CSV
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]
**RNs cobertas**: [18]

### Objetivo
Validar que para importação CSV em trilha, o cascade para cursos filhos é executado SÍNCRONO inline dentro do worker do CSV (RN 18 — `LearningPathActionMassService#create_course_participants`).

### Passos
1. Preparar CSV com 1 linha contendo email de aluno existente, trilha destino e `Reinscrever=SIM`
   → CSV criado.
2. Fazer upload do CSV pela tela de importação da trilha
   → Worker `CsvImportEventParticipantWorker` processa.
3. Inspecionar listagem dos 3 cursos filhos IMEDIATAMENTE após o worker concluir
   → Aluno aparece nos 3 cursos filhos com `recertification_number > 0` (cascade já completou — síncrono inline, sem job adicional).

---

---
suite: Ciclo de Vida do Certificado Substituído
executor: playwright
org: principal
playbooks: [flipper, cleanup-dados]
preconditions:
  - Feature flag `:recertificacao` ATIVA
  - Curso "Curso Certificado Reinscrição w{workerIndex}" com `has_recertification = true`
  - Aluno com `recertification_number = 0` aprovado e certificado emitido (`CERTIFICATE_VALID = 2`)
  - Cron `ExpiresCertificates` configurado para staging
---

# Ciclo de Vida do Certificado Substituído

## TC1 — Após emitir novo certificado, anteriores são marcados em lote como REPLACED
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: [cleanup-dados]
**RNs cobertas**: [20, 21]

### Objetivo
Validar `CertificateGenerationService#replace_previous_certificates_bulk`: ao emitir certificado VALID para participant reinscrito (`recertification_number > 0`), todos os certificados VALID anteriores do mesmo par `(user_id, event_id)` viram REPLACED em uma única query `update_all` (RN 20, 21).

### Passos
1. Pré-condição: aluno aprovado com `recertification_number = 0` e certificado `VALID` emitido.
   → Estado validado no banco: 1 row em `certificates` com `situation = 2 (VALID)`.
2. Reinscrever o aluno individualmente pelo fluxo da suíte 2 TC3
   → Novo participant criado com `recertification_number = 1`.
3. Simular conclusão do conteúdo pelo novo participant: `progress_score = 100`
   → Certificado novo é emitido (queue de geração de certificados).
4. Aguardar até 60 segundos e consultar tabela `certificates` para o par `(user_id, event_id)`
   → 2 rows: certificado anterior com `situation = 4 (REPLACED)` e certificado novo com `situation = 2 (VALID)`.

## TC2 — Worker `ExpiresCertificates` expira VALID e propaga para REPLACED do mesmo par
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [22, 22.1]

### Objetivo
Validar `ExpiresCertificates#expire_replaced_certificates`: ao expirar certificado VALID, todos os REPLACED do mesmo par são marcados como EXPIRED em conjunto (RN 22, 22.1).

### Passos
1. Pré-condição: aluno com 2 certificados — 1 REPLACED (do participant `recertification_number = 0`) e 1 VALID (do participant `recertification_number = 1`) com `expires_at = hoje`.
   → Estado preparado no banco.
2. Disparar manualmente o cron `ExpiresCertificates.new.perform`
   → Worker processa.
3. Consultar a tabela `certificates` para o par `(user_id, event_id)`
   → Ambos os certificados estão com `situation = 1 (EXPIRED)`: o que era VALID e o que era REPLACED.

## TC3 — Constante `CERTIFICATE_REPLACED = 4` espelhada em `EventParticipant::REPLACED`
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [20, 20.1]

### Objetivo
Validar mapeamento da constante em código Rails e na chave I18n usada pelo filtro avançado (RN 20, 20.1).

### Passos
1. Via Rails console em staging, executar `Certificate::CERTIFICATE_REPLACED`
   → Retorna o valor inteiro `4`.
2. Executar `EventParticipant::REPLACED`
   → Retorna o mesmo valor inteiro `4`.
3. Executar `EventParticipant::CERTIFICATE_STATUS_DESCRIPTIONS`
   → Hash contém a chave `'replaced' => 4`.

## TC4 — Certificados emitidos no fluxo legado (sem reinscrição) permanecem VALID indefinidamente
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [20, 21]

### Objetivo
Validar comportamento regressivo: aluno com `recertification_number = 0` que concluiu o curso e recebeu VALID NÃO tem o certificado marcado como REPLACED sem reinscrição (RN 20, 21).

### Passos
1. Pré-condição: aluno com `recertification_number = 0` aprovado e VALID emitido.
   → Estado preparado.
2. Esperar 1 hora (ou re-rodar cron de geração de certificados) sem disparar reinscrição.
   → Cron de geração processa outros casos.
3. Consultar tabela `certificates`
   → Certificado do aluno continua com `situation = 2 (VALID)`. Não foi marcado como REPLACED.

---

---
suite: Filtro Avançado Status Substituído
executor: playwright
org: principal
playbooks: [flipper, filtro-drawer, cleanup-dados]
preconditions:
  - Feature flag `:recertificacao` ATIVA
  - Pelo menos 1 aluno com certificado VALID, 1 com REPLACED, 1 com EXPIRED, 1 com PENDING
  - Lista de aprendizagem com filtro avançado disponível em "/learning_students"
---

# Filtro Avançado Status Substituído

## TC1 — Opção "Substituído" aparece no filtro avançado de Status do certificado com flag ON
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [23]

### Objetivo
Validar visibilidade condicional: opção "Substituído" no filtro avançado de Status do certificado aparece apenas com flag ativa (RN 23).

### Passos
1. Acessar a lista de aprendizagem em "/learning_students"
   → Lista é exibida com colunas Nome, Status do certificado, etc.
2. Clicar no ícone de filtro da coluna "Status do certificado"
   → Drawer de filtro avançado é exibido com lista de opções.
3. Inspecionar as opções do filtro
   → Lista contém: Emitido, Pendente, Expirado, Aguardando assinatura, **Substituído**.

## TC2 — Filtrar por "Substituído" exibe apenas alunos com `certificate_status = 4`
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [filtro-drawer]
**RNs cobertas**: [23.1]

### Objetivo
Validar query do filtro: ao selecionar "Substituído", listagem mostra apenas participants com `certificate_status = 4` (REPLACED) (RN 23.1).

### Passos
1. Acessar a lista de aprendizagem em "/learning_students"
   → Lista exibe todos os alunos.
2. Abrir o filtro avançado de "Status do certificado", marcar APENAS a opção "Substituído" e aplicar
   → Drawer fecha, listagem refilra.
3. Inspecionar as linhas listadas
   → Apenas alunos com `certificate_status = 4` aparecem. Demais (VALID, EXPIRED, PENDING) ficam ocultos.

## TC3 — Badge "Substituído" é exibido na coluna de Status para participants com `certificate_status = 4`
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [23.2]

### Objetivo
Validar componente `certificate-student-badge.tsx`: badge "Substituído" renderizado para participants com status REPLACED (RN 23.2).

### Passos
1. Acessar a lista de aprendizagem sem filtros aplicados
   → Lista é exibida.
2. Localizar a linha de um aluno com certificado REPLACED (`certificate_status = 4`)
   → Coluna "Status do certificado" exibe badge com label "Substituído".
3. Posicionar o cursor sobre o badge
   → Tooltip explicativo é exibido (REVISAR-FIGMA: confirmar tooltip).

## TC4 — Opção "Substituído" NÃO aparece no filtro com flag OFF (regressão)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [flipper]
**RNs cobertas**: [23]

### Objetivo
Validar regressão: com flag OFF, opção "Substituído" não aparece no filtro (RN 23).

### Passos
1. Desativar a feature flag `:recertificacao`
   → Flag OFF.
2. Acessar a lista de aprendizagem e abrir o filtro avançado de Status do certificado
   → Drawer de filtro é exibido.
3. Inspecionar as opções
   → Lista contém apenas: Emitido, Pendente, Expirado, Aguardando assinatura. Opção "Substituído" NÃO está presente.

---

---
suite: E-mail Diferenciado de Reinscrição
executor: playwright
org: principal
playbooks: [flipper, cleanup-dados]
preconditions:
  - Feature flag `:recertificacao` ATIVA
  - Mailer ativo em staging (inbox de teste acessível)
  - Curso com `has_recertification = true`
  - Aluno cadastrado com e-mail real testável
---

# E-mail Diferenciado de Reinscrição

## TC1 — Criação de participant com `recertification_number > 0` dispara `RecertificationMailer#student_email`
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [24, 24.1]

### Objetivo
Validar disparo do mailer com template `reenrollment_mail` para participants com `recertification_number > 0` (RN 24, 24.1).

### Passos
1. Reinscrever um aluno individualmente pelo fluxo da suíte 2 TC3
   → Toast de sucesso é exibido.
2. Aguardar até 30 segundos pelo e-mail
   → E-mail chega na inbox do aluno.
3. Inspecionar o assunto do e-mail
   → Assunto corresponde à chave I18n `recertification_mailer.reenrollment.subject` (texto traduzido conforme locale do aluno).
4. Inspecionar o corpo do e-mail
   → Corpo é renderizado a partir do template `reenrollment_mail` (NÃO `recertification_mail` legado).

## TC2 — Participant com `recertification_number = 0` em fluxo de aviso de expiração usa template legado
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [24, 24.2]

### Objetivo
Validar que mailer mantém compatibilidade com fluxo legado de aviso de expiração próxima (RN 24, 24.2).

### Passos
1. Pré-condição: aluno com `recertification_number = 0` e certificado VALID com `expires_at = hoje + 7 dias` (próximo do vencimento).
   → Estado preparado.
2. Disparar manualmente o cron de aviso de expiração que chama `RecertificationMailer#student_email`
   → Worker processa.
3. Inspecionar inbox do aluno
   → E-mail recebido com assunto da chave `recertification_mailer.expiration_reminder.subject` e corpo do template legado `recertification_mail`.

## TC3 — E-mail respeita bloqueio de `organization.mailer_block?`
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [25]

### Objetivo
Validar que mailer não envia e-mail quando organização tem `mailer_block? = true` (RN 25).

### Passos
1. Pré-condição: organização com `mailer_block = true` (REVISAR: como definir em staging).
   → Estado preparado.
2. Reinscrever um aluno individualmente pelo fluxo da suíte 2 TC3
   → Toast de sucesso é exibido (criação ocorre normalmente).
3. Aguardar 60 segundos pelo e-mail
   → Nenhum e-mail é recebido na inbox do aluno.
4. Inspecionar os logs do mailer no Sidekiq UI em "/sidekiq" filtrando por "RecertificationMailer"
   → Job aparece como completed sem envio efetivo — registro com tag "skipped: mailer_block?".

## TC4 — E-mail respeita locale do aluno (pt-BR/en/es)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [24.1]

### Objetivo
Validar internacionalização do mailer: assunto e corpo no locale configurado para o aluno (RN 24.1).

**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Locale pt-BR | aceito | locale="pt-BR" | Assunto e corpo em português brasileiro |
| Locale en | aceito | locale="en" | Assunto e corpo em inglês |
| Locale es | aceito | locale="es" | Assunto e corpo em espanhol |
| Locale fr (não suportado) | fallback | locale="fr" | Fallback para "en" |

### Passos
1. Configurar locale do aluno para "pt-BR" (perfil do usuário)
   → Estado preparado.
2. Reinscrever o aluno e aguardar e-mail
   → E-mail recebido com texto em português brasileiro.
3. Repetir para "en" e "es" usando alunos com locales correspondentes
   → E-mail recebido nos idiomas respectivos.
4. Configurar locale "fr" (não oficialmente suportado) e reinscrever
   → E-mail recebido em inglês (fallback `en` do Rails).

---

---
suite: Isolamento de Progresso, Score e Attendance por Inscrição
executor: playwright
org: principal
playbooks: [flipper, cleanup-dados]
preconditions:
  - Feature flag `:recertificacao` ATIVA
  - Curso "Curso Isolamento w{workerIndex}" com `has_recertification = true`
  - Aluno aprovado com `recertification_number = 0`, `progress_score = 100`, certificado VALID
  - Banco com índice `unique_participant(user_id, event_id, partner_rel, recertification_number)` aplicado
---

# Isolamento de Progresso, Score e Attendance por Inscrição

## TC1 — Aluno reinscrito tem progress/score/attendance zerados na nova inscrição
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [cleanup-dados]
**RNs cobertas**: [27, 28]

### Objetivo
Validar que `event_content_users` criados após reinscrição são vinculados ao novo `event_participant_id` e ficam isolados do histórico (RN 27, 28).

### Passos
1. Reinscrever o aluno aprovado pelo fluxo da suíte 2 TC3
   → Novo participant criado com `recertification_number = 1`.
2. Login com o aluno e acessar a página do curso no Play
   → Banner do curso exibe progresso `0%` (NÃO 100% do anterior). Status "Pendente".
3. Avançar uma aula até `progress_score = 25` no novo participant
   → Progresso atualiza para 25% na UI do Play.
4. Acessar como admin a lista de aprendizagem
   → Listagem padrão exibe apenas o participant atual com `progress_score = 25`. Histórico (recertification_number = 0, progress_score = 100) preservado em banco mas oculto do listing default (`is_latest_recertification = 1` filtra).

## TC2 — Aluno NÃO reinscrito (`recertification_number = 0`) mantém progresso histórico após deploy
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [27.1, 28]

### Objetivo
Validar regressão crítica: alunos antigos com `event_content_users.event_participant_id IS NULL` continuam contando para o participant com `recertification_number = 0` (RN 27.1, 28).

### Passos
1. Pré-condição: aluno pré-deploy com `recertification_number = 0`, `progress_score = 100`, e registros em `event_content_users` com `event_participant_id IS NULL`.
   → Estado preparado em staging.
2. Login com este aluno e acessar a página do curso no Play
   → Banner exibe progresso `100%` (mantido do histórico).
3. Acessar como admin a lista de aprendizagem
   → Aluno aparece com `progress_score = 100`, certificado VALID — exatamente como antes do deploy.

## TC3 — Índice único `unique_participant` rejeita duplicata `(user_id, event_id, partner_rel, recertification_number)`
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [29, 29.1]

### Objetivo
Validar nova unicidade composta: tentativa de inserir 2 participants idênticos (mesmo user, event, partner_rel e recertification_number) falha com violação (RN 29).

### Passos
1. Pré-condição: 1 participant existente com `recertification_number = 1` para par `(user_id, event_id)`.
   → Estado preparado.
2. Via Rails console em staging, tentar `EventParticipant.create!(user_id: X, event_id: Y, partner_rel: P, recertification_number: 1, ...)`
   → Execução lança `ActiveRecord::RecordNotUnique` ou validação Rails de uniqueness.
3. Consultar a tabela "event_participants" via Rails console com "EventParticipant.where(user_id: X, event_id: Y, partner_rel: P, recertification_number: 1).count"
   → Contagem retorna `1` — apenas 1 row para o par `(user_id, event_id, partner_rel, recertification_number = 1)`.

## TC4 — Validações Rails de email/cpf escopam por `[:event_id, :recertification_number]`
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [29.1]

### Objetivo
Validar que validators de uniqueness de email/cpf no modelo `EventParticipant` aceitam o mesmo email/cpf em diferentes valores de `recertification_number` (RN 29.1).

### Passos
1. Via Rails console, criar participant com email "teste@example.com" e `recertification_number = 0` no curso X.
   → Participant criado com sucesso.
2. Criar segundo participant com mesmo email e `recertification_number = 1` no MESMO curso.
   → Participant criado com sucesso (validação aceita porque scope inclui `recertification_number`).
3. Tentar criar terceiro participant com mesmo email e `recertification_number = 1` no mesmo curso (duplicata exata).
   → Falha com validação de uniqueness.

---

---
suite: Comportamento da Feature Flag :recertificacao
executor: playwright
org: principal
playbooks: [flipper]
preconditions:
  - Acesso à página de Flipper Admin "/admin/manage/features/recertificacao"
  - Curso com `has_recertification = true` (estado preparado quando flag estava ON)
  - Usuário Admin com permissão para gerenciar features
---

# Comportamento da Feature Flag :recertificacao

## TC1 — Habilitar flag exibe switch "Habilitar reinscrição" em conteúdos
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [flipper]
**RNs cobertas**: [1, 1.1]

### Objetivo
Validar gating UI: habilitar a flag para a organização exibe o switch "Habilitar reinscrição" nas telas de edição de conteúdo (RN 1, 1.1).

### Passos
1. Acessar Flipper Admin em "/admin/manage/features/recertificacao"
   → Página da feature `recertificacao` é exibida.
2. Adicionar a organização atual ao actor da flag via "Add" → tipo "Organization" → "Organization;{orgId}"
   → Actor "Organization;{orgId}" aparece na lista de actors com flag ON.
3. Acessar a edição de um curso em "/e/{eventId}/edit" (em nova aba ou janela limpa)
   → Switch "Habilitar reinscrição" está visível no formulário (validado em detalhe na suíte 1).

## TC2 — Desabilitar flag oculta switch e desativa fluxos (cenário de rollback)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [flipper]
**RNs cobertas**: [1, 10]

### Objetivo
Validar gating UI e funcional: remover a organização do actor da flag deve esconder o switch, esconder ações de reinscrição na lista de aprendizagem, esconder filtro "Substituído", e fazer backends rejeitarem reinscrição via API (RN 1, 10).

### Passos
1. Pré-condição: organização com flag ON, curso com `has_recertification = true` e ao menos 1 aluno reinscrito (`recertification_number > 0`).
   → Estado preparado.
2. Acessar Flipper Admin e remover a organização do actor da flag (Remove actor "Organization;{orgId}")
   → Actor removido da lista.
3. Acessar a edição do mesmo curso em "/e/{eventId}/edit"
   → Switch "Habilitar reinscrição" NÃO está visível no formulário.
4. Acessar a lista de aprendizagem em "/learning_students?event_id={eventId}"
   → Lista é exibida mas SEM os elementos de reinscrição: filtro "Substituído" some, item "Reinscrever" some do menu, ação "Reinscrição em massa" some do drawer.
5. Disparar `POST /api/v1/contents/{eventId}/event_participants` com `recertification: true` autenticado
   → Response retorna HTTP 422 com `reenroll_participant.errors.feature_disabled`.

## TC3 — Re-habilitar flag restaura todos os fluxos (sem perda de dados)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [flipper, cleanup-dados]
**RNs cobertas**: [1]

### Objetivo
Validar idempotência de toggle: re-habilitar a flag restaura os fluxos UI e backend, com participants reinscritos pré-existentes intactos.

### Passos
1. Pré-condição: organização com flag OFF após o TC2, mantendo 1 participant com `recertification_number > 0` no banco.
   → Estado preparado.
2. Acessar Flipper Admin e adicionar a organização novamente como actor da flag
   → Actor "Organization;{orgId}" volta a aparecer com ON.
3. Acessar a lista de aprendizagem
   → Filtro "Substituído", item "Reinscrever" e ação "Reinscrição em massa" voltam a aparecer.
4. Inspecionar o participant reinscrito pré-existente
   → Aluno aparece com `recertification_number > 0` intacto (dado preservado durante OFF).

## TC4 — Flag OFF: comportamento legado completo de inscrição/listagem mantido (regressão geral)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [flipper]
**RNs cobertas**: [1]

### Objetivo
Smoke regressivo geral: com flag OFF, todos os fluxos legados funcionam (inscrição original, listagem, edição, certificado VALID, expiração).

### Passos
1. Garantir que a flag `:recertificacao` está OFF para a organização
   → Flag desativada.
2. Criar curso novo, vincular aluno via inscrição original (sem `recertification`)
   → Aluno aparece com `recertification_number = 0` na lista de aprendizagem.
3. Editar o curso e salvar sem alterações
   → Curso salvo. `events.has_recertification` permanece `false` (default).
4. Acessar a lista de aprendizagem em "/learning_students?event_id={eventId}"
   → Aluno listado normalmente. Sem badge "Substituído", sem filtro adicional, sem item "Reinscrever".

---

---
suite: Auditoria via Triggers PostgreSQL
executor: playwright
org: principal
playbooks: [flipper, cleanup-dados]
preconditions:
  - Feature flag `:recertificacao` ATIVA
  - Banco `postgres_logs` (TimescaleDB) acessível
  - Migrations de triggers aplicadas (`update_event_participant_info_logs_trigger_for_recertification`, `update_event_logs_trigger_with_has_recertification`)
  - Curso com `has_recertification = true`
---

# Auditoria via Triggers PostgreSQL

## TC1 — Insert em `event_participants` propaga `recertification_number` para `event_participant_info_logs`
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [26]

### Objetivo
Validar trigger atualizado: insert de novo participant grava `recertification_number` em `event_participant_info_logs` (RN 26).

### Passos
1. Criar novo participant reinscrito (`recertification_number = 1`) pelo fluxo da suíte 2 TC3.
   → Participant criado.
2. Consultar via Rails/SQL no banco `postgres_logs` a tabela `event_participant_info_logs` filtrando pelo `event_participant_id` recém-criado
   → 1 row encontrada com coluna `recertification_number = 1`.

## TC2 — Update em `events.has_recertification` propaga para `event_logs`
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [26]

### Objetivo
Validar trigger atualizado: alteração em `events.has_recertification` grava o valor novo em `event_logs` (RN 26).

### Passos
1. Editar um curso e ativar o switch "Habilitar reinscrição"
   → `events.has_recertification = true` persistido.
2. Consultar a tabela `event_logs` no banco `postgres_logs` filtrando pelo `event_id`
   → Row mais recente para o curso contém `has_recertification = true`.

## TC3 — Triggers são reversíveis (migration `down` restaura comportamento)
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [26.1]

### Objetivo
Validar que rollback da migration de trigger restaura a versão anterior do trigger (RN 26.1).

### Passos
1. Pré-condição: ambiente de staging com migrations de triggers no `STEP=último-deploy`.
   → Estado preparado.
2. Rodar `bin/rails db:rollback STEP=1` para reverter a última migration de trigger
   → Migration reverte sem erro.
3. Repetir o fluxo de TC1 (criar participant reinscrito) e consultar `event_participant_info_logs`
   → Row é gravada mas SEM a coluna `recertification_number` (ou com NULL — depende da versão anterior). Comportamento legado restaurado.
4. Rodar `bin/rails db:migrate` para reaplicar a migration
   → Trigger atualizado volta ao estado pós-deploy. Testes subsequentes voltam a gravar `recertification_number`.

## TC4 — Logs antigos (pré-deploy) consultáveis com COALESCE para nova coluna
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [26.2]

### Objetivo
Validar compatibilidade retroativa: rows antigas têm `recertification_number = NULL` mas consultas continuam executáveis (RN 26.2).

### Passos
1. Pré-condição: tabela `event_participant_info_logs` com rows pré-deploy (sem coluna `recertification_number`) e rows pós-deploy (com a coluna).
   → Estado típico de staging com histórico.
2. Executar query `SELECT COALESCE(recertification_number, 0) AS rn, COUNT(*) FROM event_participant_info_logs GROUP BY rn`
   → Query executa sem erro retornando agrupamento por `rn` (rows antigas com `0`, rows novas com seu valor).
3. Executar `SELECT * FROM event_participant_info_logs ORDER BY created_at DESC LIMIT 100`
   → 100 rows mais recentes retornadas, mesclando rows com e sem `recertification_number` preenchido.

---

---
suite: Isolamento em Ambientes Adicionais
executor: playwright
org: principal
playbooks: [flipper, ambientes-adicionais, cleanup-dados]
preconditions:
  - Feature flag `:recertificacao` ATIVA no env principal (`staging-base-de-conhecimento`)
  - Env secundário pareado (`staging-base-de-conhecimento-aditional` ou similar — REVISAR: confirmar nome do env)
  - Cursos com `has_recertification = true` em ambos os envs
  - Aluno cadastrado em ambos os envs com mesmo e-mail (para validar isolamento)
---

# Isolamento em Ambientes Adicionais

## TC1 — Reinscrição num env não afeta participants no env pareado
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [ambientes-adicionais, cleanup-dados]
**RNs cobertas**: [27, 28]

### Objetivo
Validar isolamento multi-tenant: criar participant reinscrito no env principal NÃO cria ou altera registros no env secundário pareado.

### Passos
1. Capturar contagem atual de participants em ambos os envs para o mesmo aluno (`SELECT COUNT(*) FROM event_participants WHERE user_id = X`).
   → Contagem inicial registrada por env.
2. Reinscrever o aluno no env principal pelo fluxo da suíte 2 TC3
   → Novo participant criado APENAS no env principal.
3. Re-capturar a contagem em ambos os envs
   → Env principal: contagem aumentou em 1. Env secundário: contagem inalterada.

## TC2 — Toggle da flag :recertificacao no env principal NÃO afeta env secundário
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [flipper, ambientes-adicionais]
**RNs cobertas**: [1]

### Objetivo
Validar escopo por organização da flag Flipper: desativar a flag para a organização do env principal não desativa no env secundário (organização distinta).

### Passos
1. Pré-condição: flag ON em ambas as organizações (env principal e secundário).
   → Estado preparado.
2. Acessar Flipper Admin e remover APENAS a organização do env principal do actor da flag
   → Actor da org do env principal removido.
3. Acessar a edição de curso no env principal
   → Switch "Habilitar reinscrição" NÃO está visível.
4. Acessar a edição de curso no env secundário
   → Switch "Habilitar reinscrição" CONTINUA visível (flag ainda ON para a organização do env secundário).

---
