# Requisitos Extraídos — Recertificação

> **Intermediário** — consolidado de `docs/discovery.md`, `docs/qa-impact-map.md` e `docs/QA_Only_Recertificacao_v2.xlsx`. Não é a fonte de verdade; insumo para `generate-md-canonical`.

## Contexto

Projeto **Recertificação** permite que admins reinscrevam participantes em conteúdos (cursos/trilhas) — individualmente, em massa, via CSV, via API V2, via link público — e que o próprio aluno se reinscreva pelo Play. Histórico de certificados anteriores é preservado com o novo status `REPLACED (4)`. Progresso/score/attendance são isolados por inscrição.

**Branch dev**: `feat/add-recertification-to-participant`
**Plano twy**: `allow-recertifications` (D01 → D12)

## Gates de funcionamento

| Camada | Mecanismo | Quando aplica |
|---|---|---|
| **Feature flag global** | Flipper `:recertificacao` por organização (kill switch) | Sem ela, nenhum fluxo de reinscrição funciona |
| **Atributo por conteúdo** | `events.has_recertification` (boolean, default `false`, `null: false`) | Sem ele, conteúdo específico não permite reinscrição mesmo com flag ON |
| **Helper** | `recertification_enabled?(organization)` (backend) e `useRecertificationFlag()` (frontend) | Verificação canônica |

## Regras de Negócio (resumo do discovery.md)

### R1 — Habilitar reinscrição por conteúdo (D10)
- Switch "Habilitar reinscrição" na edição de curso/trilha (HAML antigo + facelift React)
- Default `false` — conteúdos pré-existentes começam sem permitir reinscrição (opt-in)
- Desativar com participants reinscritos: permitido sem aviso; histórico preservado

### R2 — Reinscrição individual pelo admin (D02)
- Botão "Reinscrever" na lista de aprendizagem — APENAS na linha do participant com maior `recertification_number`
- Estado do botão:
  - **Habilitado** quando aluno elegível
  - **Visível + desabilitado** com tooltip "conteúdo não permite reinscrição" se `has_recertification = false`
  - **Visível + desabilitado** com tooltip explicativo se aluno não elegível
- Criação de novo `EventParticipant` com:
  - `recertification_number = anterior + 1`
  - `progress_score = 0`, `final_score = nil`, `attendance_score = nil`, `approved_at = nil`
  - `certificate_id = nil`, `certificate_status = PENDING`, `status = CONFIRMED`
- Elegibilidade: `progress_score = 100` OU `approved_at NOT NULL` OU (`expires_at NOT NULL AND expires_at < hoje`)
- Após criar: dispara e-mail diferenciado + refetch da tabela

### R3 — Reinscrição em massa (D03)
- Drawer de ações em massa — opção "Reinscrição em massa" condicional a:
  - Flag `:recertificacao` ON
  - `event.has_recertification = true`
  - Tipo do evento ≠ pacote (`ContentKind.package`)
- Worker `MassReenrollParticipantsWorker` (Sidekiq, fila dedicada, retry: 3)
- Idempotente: já reinscritos pulados sem erro
- Erro individual reportado a Datadog/NewRelic; não interrompe lote
- Flag OFF e action chega ao controller (exploit/cache): HTTP **422** com `reenroll_participant.errors.feature_disabled`

### R4 — Importação CSV (D04)
- Template `EventParticipant.import_csv_examples(organization:)` ganha coluna `Reinscrever` (`reenroll`) APENAS quando flag ON
- Valores aceitos: `SIM`/`sim`/`true`/`1` (case-insensitive). Qualquer outro = ignora
- Linhas com `Reinscrever=SIM`:
  - Usuário existente → valida elegibilidade + cria novo participant bypassando erro `:in_use`
  - Usuário não existente → fluxo normal (sem reinscrição)
  - Conteúdo `has_recertification = false` → erro `reenroll_participant.errors.recertification_disabled_for_event`
- E-mail de reinscrição enviado APENAS para participants com `recertification_number > 0` criados nesta execução

### R5 — API V2 (D06)
- `POST /api/v2/users/mass` aceita `recertification` (boolean) por item dentro do array `participants`
- `recertification=true` em evento com `has_recertification=false` → erro estruturado por item (HTTP 207 multi-status)
- Flag OFF → parâmetro `recertification` ignorado silenciosamente (compatibilidade)
- Payloads antigos sem `recertification` mantêm comportamento legado

### R6 — Link público de pacote (D05)
- `POST /play/.../course_registrations` aceita `?recertification=true`
- Elegível → cria novo participant
- Inelegível → mensagem de erro do use case, sem criar
- Flag OFF → HTTP **404** com payload vazio

### R7 — Reinscrição pelo aluno no Play (D02 + D10)
- Banner do Play exibe **dois botões empilhados** quando aluno elegível:
  - Botão original (acima)
  - Botão "Reinscreva-se" (abaixo)
- Inelegível / flag OFF / `has_recertification=false` → botão **não aparece** (não é exibido como disabled)
- Elegibilidade calculada server-side em `Api::V1::Play::Events::EventsController#show` via `CheckReenrollmentEligibilityUseCase`
- Propagada ao FE como `eligibleForRecertification`
- Click → `POST /api/v1/play/.../subscribe` com `recertification=true`

### R8 — Cascade em trilhas (D09)
- Trilha (`Event::KIND_LEARNING_PATH`) → propagação para cursos filhos
- Canais admin/play/API V2/mass action: cascade **assíncrona** via worker `AddParticipantToLearningPath`
- CSV import: cascade **síncrona inline** dentro do worker do CSV
- `recertification_number` calculado **por par (user_id, course_id)** via query única agrupada
- Filtro `event_and_user_id_subscribed` bypassado em fluxos de reinscrição
- Worker aceita 3º argumento `recertification` (default `false`) — compatibilidade retroativa

### R9 — Ciclo de vida do certificado REPLACED (D01)
- Nova constante `Certificate::CERTIFICATE_REPLACED = 4`
- Espelhamento `EventParticipant::REPLACED`
- `CertificateGenerationService#replace_previous_certificates_bulk` atualiza em lote (`update_all`) certificados VALID anteriores para REPLACED após emissão de novo certificado
- Worker `ExpiresCertificates` (cron diário): ao expirar VALID, também marca REPLACED do mesmo par como EXPIRED

### R10 — Filtro "Status Substituído" (D08)
- Lista de aprendizagem `/learning_students` ganha opção "Substituído" no filtro avançado de Status do certificado APENAS com flag ON
- Query: `event_participants.certificate_status = 4`
- Badge "Substituído" na coluna de status (componente `certificate-student-badge.tsx`)
- Listagem padrão exibe APENAS o último participant (campo computado `is_latest_recertification`)

### R11 — E-mail diferenciado (RecertificationMailer)
- Sempre que `EventParticipant` criado com `recertification_number > 0` → `RecertificationMailer#student_email(event, participant)`
- `recertification_number > 0`: assunto `recertification_mailer.reenrollment.subject` + corpo `reenrollment_mail`
- `recertification_number = 0` (legado de aviso de expiração): assunto `recertification_mailer.expiration_reminder.subject` + corpo `recertification_mail`
- Bloqueios respeitados: `organization.mailer_block?`, `is_fake_email?`, e-mail vazio
- Locales suportados: pt-BR, en, es (fallback en)

### R12 — Logs PostgreSQL (D11 + D12)
- Triggers `event_participant_info_logs` ganha coluna `recertification_number`
- Triggers `event_logs` ganha coluna `has_recertification`
- Triggers reversíveis (migration tem `down`)
- Logs antigos: `NULL` nas colunas novas (usar `COALESCE`)

### R13 — Isolamento por inscrição (D10)
- `event_content_users` ganha coluna `event_participant_id` (integer, nullable, indexed)
- Registros históricos (event_participant_id IS NULL) → tratados como pertencentes ao participant com `recertification_number = 0`
- Queries de progresso/score/attendance escopadas por `participant_id`
- Índice único `unique_participant` recriado: `(user_id, event_id, partner_rel)` → `(user_id, event_id, partner_rel, recertification_number)`
- Validação `validates :email, uniqueness: { scope: [:event_id, :recertification_number] }` (idem CPF)

## Textos literais relevantes

### Switch / formulário de conteúdo
- Label: "Habilitar reinscrição"
- Tooltip: chave `activerecord.attributes.event.has_recertification_tooltip`

### Botões de ação
- "Reinscrever" — menu de ações por aluno
- "Reinscrição em massa" — drawer de ações em massa
- "Reinscreva-se" — banner do Play

### Mensagens de erro/tooltip
- "conteúdo não permite reinscrição" — tooltip quando `has_recertification = false`
- `reenroll_participant.errors.feature_disabled` — HTTP 422 com flag OFF
- `reenroll_participant.errors.recertification_disabled_for_event` — CSV em curso sem `has_recertification`

### Status do certificado
- "Substituído" — badge + filtro
- Constante: `CERTIFICATE_REPLACED = 4`

### CSV
- Coluna `Reinscrever` (rótulo do header)
- Valores aceitos: `SIM`, `sim`, `true`, `1` (case-insensitive)

### Filtros
- "Status do certificado" — coluna com filtro avançado
- Opções: emitted / pending / expired / awaiting_signature / **replaced** (nova)

### Toasts (a confirmar nos componentes)
- "Reinscrição realizada com sucesso" — após R2 individual
- "Reinscrição em massa iniciada" — após R3
- Toast de erro genérico quando flag OFF

## Endpoints relevantes

| Método | Path | Camada | Uso |
|---|---|---|---|
| POST | `/api/v1/contents/.../event_participants` (com `recertification=true`) | Admin UI → Backend | Reinscrição individual |
| POST | `/api/v1/learning_students/.../action_mass` (`action_type=mass_reenroll_participants`) | Admin UI → Backend | Reinscrição em massa |
| POST | `/api/v2/users/mass` (com `recertification: true` por item) | API pública | Importação em massa via API |
| POST | `/play/.../course_registrations?recertification=true` | Link público | Reinscrição via link |
| POST | `/api/v1/play/.../subscribe` (com `recertification=true`) | Play (aluno) | Aluno se reinscreve |
| GET | `/learning_students` | Admin UI | Lista de aprendizagem |
| GET | `/e/:id/edit`, `/contents/:id/edit` | Admin UI | Edição de conteúdo (switch) |

## Modais relevantes

- **Modal de confirmação de reinscrição individual** — clique em "Reinscrever" → modal pedindo confirmação antes de criar participant
- **Modal NPS Sofia** — pode aparecer durante navegação Twygo (não específico desta feature; dismissar)
- **Sync alert** — banner amarelo de status de processamento (pode aparecer durante mass action)

## Workers e jobs

| Worker | Fila | Retry | Quando dispara |
|---|---|---|---|
| `MassReenrollParticipantsWorker` | `MassReenrollParticipants` | 3 | Reinscrição em massa (D03) |
| `AddParticipantToLearningPath` | (default) | (default) | Cascade trilha → cursos filhos |
| `CsvImportEventParticipantWorker` | (default) | (default) | Importação CSV (D04) |
| `ExpiresCertificates` (cron diário) | (default) | (default) | Expiração + propagação REPLACED → EXPIRED |
| `CertificateGenerationService` (job de emissão) | (default) | (default) | Emite certificado + marca anteriores como REPLACED |

## Migrations e mudanças de schema

1. `add_recertification_number_to_event_participants` — INT DEFAULT 0 NOT NULL
2. `update_unique_participant_index_for_recertification` — recria índice (lento em prod)
3. `add_event_participant_id_to_event_content_users` — INT NULL + índice
4. `add_certificate_replaced_situation_to_certificates` — sem schema, dados
5. `add_has_recertification_to_events` — BOOLEAN DEFAULT false NOT NULL
6. Triggers postgres ×6 — `event_participant_info_logs` e `event_logs`

## Cenários de regressão (flag OFF — comportamento legado)

- Inscrição original em curso individual funciona
- Inscrição em massa pelo drawer (sem reinscrição) funciona
- Importação CSV sem coluna `Reinscrever` funciona
- Trilha inscreve participants nos cursos filhos sem cascade de reinscrição
- Aluno antigo com progresso 100% **mantém** progresso 100% após deploy
- `ExpiresCertificates` segue expirando normalmente
- Tela de aprendizagem lista todos os participants atuais (sem `is_latest_recertification`)
- Tela de edição de curso não exibe switch de reinscrição
- Tela `/e/:id/edit` para curso sem `recertificacao` renderiza normal (`@can_reenroll = false`)

## Quebra de atividades QA (planilha)

Mapeamento Atividade QA → Suíte AT (uma para uma; transversais consolidadas em playbooks):

| # | Atividade QA (planilha) | Relacionado a | RNs | Suíte AT |
|---|---|---|---|---|
| 1 | QA 1.1 — Configuração de Conteúdo (Switch) | D10 | 1, 2, 2.1, 2.2, 2.3 | Configuração de Conteúdo (Switch "Habilitar reinscrição") |
| 2 | QA 2.1 — Reinscrição Individual pelo Admin | D02 | 4, 4.1, 4.2, 4.3, 5, 6, 7 | Reinscrição Individual pelo Admin |
| 3 | QA 3.1 — Reinscrição em Massa pelo Admin | D03 | 8, 9, 9.1, 9.2, 10 | Reinscrição em Massa pelo Admin |
| 4 | QA 4.1 — Reinscrição via Importação CSV | D04 | 11, 11.1, 12, 13 | Reinscrição via Importação CSV |
| 5 | QA 5.1 — Reinscrição via API V2 | D06 | 14, 14.1, 14.2 | Reinscrição via API V2 |
| 6 | QA 6.1 — Reinscrição pelo Aluno (Play e Link Público) | D02, D05, D10 | 15, 16, 16.1, 16.2, 17 | Reinscrição pelo Aluno (Play e Link Público) |
| 7 | QA 7.1 — Cascade de Reinscrição em Trilhas | D09 | 18, 18.1, 18.2, 19 | Cascade de Reinscrição em Trilhas |
| 8 | QA 8.1 — Ciclo de Vida do Certificado (REPLACED) e Expiração | D01 | 20, 21, 22, 22.1 | Ciclo de Vida do Certificado Substituído |
| 9 | QA 9.1 — Filtro Avançado 'Status Substituído' | D08 | 23, 23.1, 23.2 | Filtro Avançado Status Substituído |
| 10 | QA 10.1 — E-mail Diferenciado (RecertificationMailer) | D02, D04 | 24, 24.1, 24.2, 25 | E-mail Diferenciado de Reinscrição |
| 11 | QA 11.1 — Isolamento de Progresso, Score e Attendance | D10 | 27, 27.1, 28, 29 | Isolamento de Progresso, Score e Attendance por Inscrição |
| 12 | QA x.x — Feature Flag | transversal | gate global | Comportamento da Feature Flag :recertificacao |
| 13 | QA x.x — Logs | D11, D12 | 26, 26.1, 26.2 | Auditoria via Triggers PostgreSQL |
| 14 | QA x.x — Ambientes adicionais | transversal | — | Isolamento em Ambientes Adicionais |
| 15 | QA x.x — Beta / Launch | processo de release | — | (não compõe AT — processo de deploy) |

## Playbooks Twygo aplicáveis (canônica CONTRACT.md §6)

- `flipper` — toda suíte que dependa de toggle da `:recertificacao`
- `super-admin` — não diretamente aplicável (sem alteração de contrato)
- `cleanup-dados` — suítes que criam participants reinscritos
- `ambientes-adicionais` — suíte 14
- `toast-chakra` — suítes UI que validam toasts de sucesso/erro
- `filtro-drawer` — suíte 9 (filtro avançado de status)
- `switch-chakra` — suíte 1 (switch "Habilitar reinscrição")

## Riscos e pontos de atenção

1. **Recriação do índice `unique_participant`** em produção: tabela grande → `pt-online-schema-change` ou janela
2. **Fan-out 1000 alunos × trilha** → 1000 jobs `AddParticipantToLearningPath` (validar throughput Sidekiq)
3. **Estado intermediário de schema** (coluna nova + índice antigo) mantém legado funcionando, mas reinscrição ainda falha → schema completo antes de habilitar flag
4. **Janela de inconsistência** entre "trilha reinscrita" e "cursos filhos reinscritos" (cascade assíncrona): segundos a minutos
5. **Progresso histórico** (alunos com `recertification_number = 0` pré-deploy): validar manualmente que NÃO perdem progresso após deploy

## Premissas / decisões (devem ser confirmadas)

- Aluno enxerga APENAS a inscrição corrente no Play; histórico fica apenas no admin
- Trilha+curso filho ambos com `has_recertification=true` — botão de reinscrição aparece no nível em que o admin habilitou
- Locales: pt-BR / en / es (resto cai em en fallback)
- Aluno final NÃO tem acesso a listagem de certificados REPLACED (apenas admin via filtro avançado)
