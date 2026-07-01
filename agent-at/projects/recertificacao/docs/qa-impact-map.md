# Mapa de Impactos para QA — Recertificação (`feat/add-recertification-to-participant`)

**Branch:** `feat/add-recertification-to-participant` → `master`
**Plano twy:** `allow-recertifications` (D01 → D12)
**Feature flag mestre:** `:recertificacao` (Flipper, por organização)
**Coluna gate funcional:** `events.has_recertification` (default `false` — opt-in por conteúdo)

> Para todo cenário abaixo: garantir testes **com a flag ligada** (organização habilitada via Flipper) **e desligada** (regressão — comportamento legado intacto). O sistema cai para o fluxo antigo quando a flag está off.

---

## Convenções

- **Persona**: quem dispara a ação.
- **Canal**: tela/endpoint/worker onde o fluxo entra.
- **Pré-condição**: o que precisa estar configurado.
- **Comportamento esperado**: o que mudou em relação a master.
- **Regressão**: fluxos vizinhos que podem quebrar e precisam de verificação.

---

## 1. Configuração do conteúdo — Switch "Habilitar reinscrição" (D10)

**Persona:** Admin
**Canal:**
- Tela antiga (HAML): edição de curso/trilha — aba "Detalhes" (`/e/:id/edit`) — `app/views/events/_form_details.haml`
- Tela facelift (React): formulário de conteúdo (`/contents/:id/edit`) — `app/javascript/pages/content-form/`

**Pré-condição:**
- FF `:recertificacao` habilitada para a organização.

**Comportamento esperado:**
- Switch/checkbox "Habilitar reinscrição" aparece **somente** com flag ligada.
- Ao salvar com switch ligado: `events.has_recertification = true` é persistido (param permitido em `EventsController#event_params`).
- Default em conteúdos antigos é `false` — todos os conteúdos pré-existentes começam **sem** permitir reinscrição (opt-in).
- Desativar o switch num curso que já tem reinscritos é permitido **sem aviso** (mantém histórico, apenas impede novas reinscrições).
- Tooltip de ajuda exibido (`activerecord.attributes.event.has_recertification_tooltip`).

**Regressão:** garantir que conteúdos sem a flag continuam editáveis sem o campo, e que demais checkboxes da seção (matrícula por pacote, empresa, etc.) não foram afetados.

---

## 2. Reinscrição individual pelo Admin (D02)

**Persona:** Admin
**Canal:** Tela de aprendizagem do curso → lista de alunos → menu de ações por aluno → "Reinscrever"
**Frontend:** `app/javascript/pages/learning-students/presentation/components/learning-students-list/learning-students-list.tsx`
**Backend:** `Api::V1::Contents::EventParticipantsController#create` com `recertification=true` → `EventStudentService#create_event_participant_from_user` → `ReenrollParticipantUseCase`

**Pré-condições:**
- FF `:recertificacao` ligada.
- `event.has_recertification = true` no curso.
- Aluno selecionado é elegível: `progress_score = 100` **OU** `approved_at` definido **OU** certificado expirado (`expires_at < hoje`).

**Comportamento esperado:**
- Botão "Reinscrever" visível na linha do aluno **com o maior `recertification_number`** (último participant).
- Quando `event.has_recertification = false`: botão fica **visível mas desabilitado** com tooltip "conteúdo não permite reinscrição".
- Quando aluno não está elegível (sem progresso/aprovação/expiração): botão fica desabilitado com tooltip explicativo.
- Ao clicar e confirmar:
  - Novo `EventParticipant` é criado com `recertification_number = anterior + 1`, `progress_score = 0`, `final_score = nil`, `attendance_score = nil`, `approved_at = nil`, `certificate_id = nil`, `certificate_status = PENDING`.
  - Certificado anterior é marcado como `CERTIFICATE_REPLACED (4)` (após emissão do novo).
  - **E-mail diferenciado** disparado via `RecertificationMailer#student_email` usando template de reinscrição (chave `reenrollment_mail`, assunto `recertification_mailer.reenrollment.subject`).
  - Toast de sucesso e tabela faz refetch.
- Quando a flag está desabilitada para a org: endpoint retorna **422** com `reenroll_participant.errors.feature_disabled`.
- Erros caem em `ErrorMonitorService` (Datadog/NewRelic).

**Regressão:**
- Inscrição original do mesmo endpoint (`recertification` ausente) continua funcionando normalmente.
- Demais ações do menu (gerar certificado, expirar, ver detalhes) intactas.

---

## 3. Reinscrição em massa (D03)

**Persona:** Admin
**Canal:** Tela de aprendizagem → seleção múltipla → drawer de ações em massa → "Reinscrever selecionados"
**Frontend:** `app/javascript/pages/learning-students/presentation/components/configs/learning-students-mass-action-configs.ts`
**Backend:** `Api::V1::LearningStudentsController#action_mass` com `action_type=mass_reenroll_participants` → `EventStudentService` → `MassReenrollParticipantsWorker` (Sidekiq) → `MassReenrollParticipantsUseCase` → `ReenrollParticipantUseCase` por aluno

**Pré-condições:**
- FF `:recertificacao` ligada.
- `event.has_recertification = true`.
- `eventKind !== ContentKind.package` (não aparece em pacotes).

**Comportamento esperado:**
- Opção "Reinscrição em massa" aparece **apenas** com flag + has_recertification + tipo de evento ≠ pacote.
- Worker é **idempotente**: alunos já reinscritos com sucesso na mesma janela são pulados sem erro.
- Erro de aluno individual é reportado ao Datadog/NewRelic e **não interrompe** os demais.
- Quando a flag está off mas o action_type chega ao controller: retorna **422** com mensagem `reenroll_participant.errors.feature_disabled`.

**Regressão:**
- Demais ações em massa (gerar certificado, atualizar status, expirar, lista de presença) inalteradas.

---

## 4. Reinscrição via importação CSV (D04)

**Persona:** Admin
**Canal:** Importação CSV de participantes em curso → coluna **"Reinscrever"** (`reenroll`) com valor `SIM`/`NÃO`
**Backend:** `CsvImportEventParticipantWorker` (Sidekiq) → `CheckReenrollmentEligibilityUseCase` por linha

**Pré-condições:**
- FF `:recertificacao` ligada.
- `event.has_recertification = true`.
- Template do CSV agora inclui a coluna `Reinscrever` (condicional à flag — gerado por `EventParticipant.import_csv_examples(organization:)`).

**Comportamento esperado:**
- Linhas com `Reinscrever=SIM` para usuário existente: cria novo participant com `recertification_number` incrementado, sem ser bloqueado pelo erro "email/cpf já cadastrado" (`error.type == :in_use` é ignorado).
- Linhas com `Reinscrever=SIM` para usuário **inexistente**: cai no fluxo normal de criação (sem reinscrição).
- Linhas com `Reinscrever=NÃO` ou vazio: comportamento legado.
- Conteúdo sem `has_recertification`: linha registra erro `validation_errors` com mensagem `reenroll_participant.errors.recertification_disabled_for_event`.
- Após o processo, **e-mails de reinscrição** são disparados (via `RecertificationMailer.student_email.deliver_later`) só para os participants com `recertification_number > 0` criados nesta execução.

**Regressão:**
- Importação CSV sem a flag (ou sem a coluna) preserva fluxo atual (`user_exists_action`, ignore vs. update vs. block).
- Demais validações (taken, formato, e-mail) seguem ativas para linhas que não são reinscrição.

---

## 5. Reinscrição via importação em massa API V2 (D06)

**Persona:** Admin / integração externa
**Canal:** `POST /api/v2/users/mass` com `recertification: true` no payload do participant
**Backend:** `Api::V2::AttendeesController` → `import_event_participants_from_json` → `EventParticipantService`

**Pré-condições:**
- FF `:recertificacao` ligada.
- `event.has_recertification = true`.

**Comportamento esperado:**
- Para cada item com `recertification=true`:
  - Verifica elegibilidade do aluno (status, progress, approved_at, expires_at).
  - Cria participant com `recertification_number` incrementado.
- Item com `recertification=true` em evento com `has_recertification=false` → erro estruturado para aquele item (resposta HTTP 207 multi-status).
- Demais itens do mesmo payload sem `recertification` seguem fluxo normal.

**Regressão:** payloads sem o parâmetro `recertification` mantêm comportamento legado.

---

## 6. Reinscrição via link de pacote (D05)

**Persona:** Aluno (link público)
**Canal:** `Api::V1::Play::CourseRegistrationsController#create` com `recertification=true` na query string → `ParticipantEnrollmentService#create`

**Comportamento esperado:**
- Link com `recertification=true`: valida elegibilidade via `CheckReenrollmentEligibilityUseCase` antes de enrolar.
- Inelegível: resposta com a mensagem de erro do use case, **sem** criar participant.
- Elegível: novo participant criado com `recertification_number` incrementado.
- Caminho legado (sem `recertification=true`): inalterado.

**Regressão:** fluxo de pagamento via pagseguro (FF `:pagseguro`) usa outro branch e não foi tocado — verificar.

---

## 7. Reinscrição pelo aluno no Play (D02 + D10)

**Persona:** Aluno
**Canal:** Página do curso no Play → banner principal → botão "Reinscreva-se"
**Frontend:** `app/javascript/pages/play/components/banner/banner.tsx` + `subscribe-button.tsx` + `participant-enrollment-*`
**Backend:** `Api::V1::Play::CourseRegistrationsController#subscribe` (com `recertification=true`) → `CourseStarterService#subscribe`

**Pré-condições:**
- FF `:recertificacao` ligada para a org.
- `event.has_recertification = true`.
- Aluno autenticado e elegível (`eligibleForRecertification` calculado no controller via `CheckReenrollmentEligibilityUseCase`).

**Comportamento esperado:**
- Botão "Reinscreva-se" aparece **abaixo** do botão de inscrição original quando o aluno é elegível (banner exibe dois botões empilhados).
- Inelegível **ou** flag off **ou** `has_recertification=false` → botão **não aparece**.
- Ao acionar: cria participant em fluxo de subscribe, retorna `participant` na resposta para o FE atualizar contexto.
- Sem flag, o endpoint retorna 404 (`{}, status: :not_found`) para tentativas de reinscrição.

**Regressão:**
- Botão de inscrição original (sem reinscrição) inalterado para quem nunca se inscreveu.
- Página de pacote (`isPackageSeeAll`) não exibe nada novo.
- Conteúdo bloqueado por `block_update_professional` ou `validate_access_ip` segue bloqueado.

---

## 8. Cascade de reinscrição em trilhas para cursos filhos (D09)

**Persona:** Admin (via qualquer um dos canais 3, 4, 5)
**Canal:** Quando o conteúdo reinscrito é uma **trilha de aprendizagem** (`kind = KIND_LEARNING_PATH`)
**Backend:**
- `EventParticipantService#subscription_bulk` → enfileira `AddParticipantToLearningPath` por participant criado
- `EventService#register_in_event_with_recertification` (API V2) → mesmo padrão
- `LearningPathActionMassService#create_course_participants` (CSV import) → cascade síncrona inline
- `LearningPathContentService#associate_learning_path_participant_in_courses(recertification: true)` → cálculo agrupado de `recertification_number` por curso filho

**Comportamento esperado:**
- Ao reinscrever em uma trilha: cada curso filho também recebe novo `EventParticipant` com `recertification_number` correto (incrementado **por curso**, não pela trilha).
- Cascade é **assíncrona** em API V2 e mass action; **síncrona** dentro do worker do CSV.
- Caminho legado (inscrição original): comportamento inalterado.
- N+1 evitado: uma única query agrupada `.group(:event_id).maximum(:recertification_number)` por job.

**Regressão crítica:**
- Inscrição original em trilha (sem `recertification`) **não pode** disparar o cascade com flag → continua usando o fluxo `associate_courses_for_initial_enrollment`.
- Worker `AddParticipantToLearningPath.perform_async(id, org_id)` **sem o 3º argumento** mantém comportamento atual (default `recertification = false`).
- Performance: fan-out de 1000 alunos em trilha = 1000 jobs `AddParticipantToLearningPath` — validar fila Sidekiq não estoura.

---

## 9. Filtro avançado "Status Substituído" na lista de aprendizagem (D08)

**Persona:** Admin
**Canal:** Tela de aprendizagem → filtro avançado → coluna **Status do certificado** → opção "Substituído"
**Backend:** `EventStudentService#certificate_status_for_filters` agora inclui `replaced` quando `recertification_enabled?(org)`

**Comportamento esperado:**
- Opção **"Substituído"** aparece no filtro **apenas** com a flag ligada.
- Selecionando "Substituído": lista filtra `event_participants.certificate_status = 4` (REPLACED).
- Coluna de status no listing exibe o badge "Substituído" para esses participants (componente `certificate-student-badge.tsx`).

**Regressão:** demais filtros de status (`emitted`, `pending`, `expired`, `awaiting_signature`) inalterados.

---

## 10. Status `CERTIFICATE_REPLACED` (D01)

**Persona:** Sistema/worker (automático)
**Onde aparece:**
- Constante `Certificate::CERTIFICATE_REPLACED = 4` (`app/models/certificate.rb`)
- Constante `EventParticipant::REPLACED = Certificate::CERTIFICATE_REPLACED`
- `EventParticipant::CERTIFICATE_STATUS_DESCRIPTIONS` ganha `'replaced' => REPLACED`

**Quando o sistema marca como REPLACED:**
1. **Em bulk após geração de certificado novo** (`CertificateGenerationService#replace_previous_certificates_bulk`): ao emitir certificado válido para um participant com `recertification_number > 0`, todos os certificados `VALID` dos participants anteriores do **mesmo usuário/conteúdo** viram `REPLACED`.
2. **Por ação manual** ou outra rota — verificar `CertificateRepository#find_replaced_by_user_and_content`.

**Regressão:** certificados emitidos no fluxo legado (sem reinscrição) continuam ficando como `CERTIFICATE_VALID (2)` indefinidamente.

---

## 11. Worker `ExpiresCertificates` (D01)

**Persona:** Sistema (cron)
**Quando:** diariamente

**Comportamento esperado:**
- Ao expirar um certificado `VALID` cuja `expires_at <= hoje`:
  - Chama `expire_replaced_certificates(user_id, event_id)`.
  - Todos os certificados `REPLACED` do mesmo `user_id + event_id` viram `CERTIFICATE_EXPIRED (1)`.
- Trabalho ainda lida com `certified_signature.destroy` e `delete_student_records` como antes.

**Regressão:** participants sem reinscrição expiram exatamente como em master.

---

## 12. E-mail de reinscrição (RecertificationMailer)

**Persona:** Aluno (destinatário)
**Trigger:** sempre que um `EventParticipant` é criado com `recertification_number > 0`
**Arquivo:** `app/mailers/recertification_mailer.rb` + `app/views/recertification_mailer/student_email.haml`

**Comportamento esperado:**
- Quando `participant.recertification_number > 0`:
  - Assunto: `recertification_mailer.reenrollment.subject` (chave nova em pt/en/es).
  - Corpo: `reenrollment_mail` (template diferenciado do e-mail de recertificação automática original).
- Quando `recertification_number = 0` (e-mail "tradicional" de aviso de recertificação enviado pelo cron de expiração — comportamento legado):
  - Assunto: `recertification_mailer.expiration_reminder.subject`.
  - Corpo: `recertification_mail`.
- Bloqueios respeitados: `organization.mailer_block?`, `is_fake_email?`, e-mail vazio.

**Cenário de QA:** confirmar visualmente os dois templates em pt/en/es e os links de acesso ao curso (`event_access_url_for_email`).

---

## 13. Cálculo de progresso, score e attendance pós-reinscrição

**Persona:** Aluno (efeito) / Sistema (cálculo)
**Onde:**
- `app/models/event_participant.rb` — query principal de `with_score_and_attendance_*` agora faz `LEFT JOIN event_content_users` com `eu.event_participant_id = event_participants.id OR (eu.event_participant_id IS NULL AND COALESCE(event_participants.recertification_number, 0) = 0)`
- `app/models/event_content.rb` — `for_user(..., participant_id: ...)` cria/lê `event_content_users` escopado por participant
- `app/models/event_content_user.rb` — scope `contents(user, event, participant_id:)` filtra por participant
- `app/controllers/learn_controller.rb` e `app/controllers/api/v1/learn_devise_controller.rb` — todas as queries de "participant atual" agora ordenam por `recertification_number DESC` e usam `participant.id` ao filtrar `event_content_users`

**Comportamento esperado:**
- Aluno reinscrito (recertification_number > 0) tem **progress, score e attendance zerados** porque o `event_content_user` é criado novo, vinculado ao novo `participant_id`.
- Aluno **não reinscrito** (recertification_number = 0) mantém o histórico atual — registros `event_content_users` com `event_participant_id IS NULL` continuam contando (compatibilidade retroativa).
- Pré-requisitos (`load_content`) são reavaliados considerando apenas o participant atual.
- Reset de PDF (`generate_participant_pdf`) e download pegam o participant correto.

**Regressão crítica para QA:**
- **Conteúdos antigos sem reinscrição não podem perder progresso** — todos os `event_content_users` históricos com `event_participant_id NULL` precisam continuar válidos para o participant com `recertification_number = 0`.
- Validar pelo menos um curso "completado há tempos" antes do deploy: progresso de 100% deve permanecer 100% após o deploy.
- Trilha: progresso da trilha agregado deve respeitar somente o participant ativo.

---

## 14. Lista de aprendizagem (`/learning_students`) — filtro de "última recertificação"

**Persona:** Admin
**Onde:** `EventStudentService#build_select_criterias`

**Comportamento esperado:**
- Listagem padrão agora inclui o campo computado `is_latest_recertification` (1 se este é o participant com maior `recertification_number` do par user/event, 0 caso contrário).
- O filtro/list naturalmente exibe somente o último participant — relevante para o botão "Reinscrever individual" (que aparece só na linha do último).

**Regressão:** conteúdos sem reinscritos exibem todos os participants normalmente (já que `MAX(recertification_number) = 0` para todos eles).

---

## 15. Triggers de logs PostgreSQL (D11 + D12)

**Persona:** Sistema (DB)
**Onde:**
- `db/migrate/.../update_event_participant_info_logs_trigger_for_recertification.rb` — adiciona `recertification_number` ao trigger de `event_participant_info_logs`
- `db/migrate/.../update_event_logs_trigger_with_has_recertification.rb` — adiciona `has_recertification` ao trigger de `event_logs`
- DB: `postgres_logs` (TimescaleDB)

**Comportamento esperado:**
- Insert/update em `event_participants` propaga `recertification_number` para o log.
- Insert/update em `events` propaga `has_recertification` para o log.
- Triggers reversíveis (migration tem `down`).

**Regressão crítica:** migrations rodam em ordem em ambientes que **ainda não** tinham essas colunas. Verificar:
- `bin/rails db:migrate` em DB limpa derivada de master → todas as 9 migrations da branch sobem sem erro.
- `db:rollback STEP=N` reverte cleanly.
- Logs antigos sem essas colunas continuam consultáveis.

---

## 16. Migrations de schema novas (D07 + D10)

**Persona:** Sistema (deploy)

| Migration | Tabela | Coluna/índice | Risco |
|---|---|---|---|
| `add_recertification_number_to_event_participants` | `event_participants` | `recertification_number INT DEFAULT 0 NOT NULL` | rápido em MySQL 8 |
| `update_unique_participant_index_for_recertification` | `event_participants` | recria índice `unique_participant(user_id, event_id, partner_rel, recertification_number)` | **lento** em prod — exige `pt-online-schema-change` ou janela |
| `add_event_participant_id_to_event_content_users` | `event_content_users` | `event_participant_id INT NULL` + índice | tamanho médio |
| `add_certificate_replaced_situation_to_certificates` | (sem schema change) | apenas script de rollback de dados | seguro |
| `add_has_recertification_to_events` | `events` | `boolean DEFAULT false NOT NULL` | rápido |
| Triggers postgres (×6 arquivos) | `event_participant_info_logs`, `event_logs` | redefinição de função+trigger | postgres_logs DB |

**Sequência segura (estado intermediário OK):**
1. Sobe coluna `recertification_number` — fluxo legado segue funcionando (índice antigo bloqueia duplicatas mas com `recertification_number=0`).
2. Sobe `event_participant_id` em `event_content_users`.
3. Sobe `has_recertification` em `events`.
4. **Recria índice** `unique_participant` (janela de manutenção).
5. Atualiza triggers postgres.
6. **Só então** a feature de reinscrição passa a funcionar end-to-end.

**Risco:** se o índice antigo permanecer, criar a segunda reinscrição (`recertification_number = 1`) do mesmo `user_id+event_id+partner_rel` **falha** com violação de unicidade. Validar em staging com índice novo aplicado **antes** de habilitar a flag em produção.

---

## 17. Outros tocados (atenção ao revisar regressão)

| Arquivo | Mudança | Cenário de regressão |
|---|---|---|
| `app/controllers/events_controller.rb#show` | novo `before_action :can_enroll_in_content` | abrir página `/e/:id` para um curso sem `recertificacao` deve renderizar normal (`@can_reenroll = false`) |
| `app/controllers/api/v1/play/events/events_controller.rb#show` | calcula `@eligible_for_recertification` | endpoint público do play retorna o campo no JSON sem mudar payload existente |
| `app/views/events/show/_new_participant_enrollment.haml` | passa `recertificationEnabled`/`canReenroll` ao React | tela pública de inscrição (não logado) não pode quebrar |
| `app/javascript/pages/event/presentation/event-form/event-form.tsx` | inclui `has_recertification` no schema/default values | salvar evento sem habilitar reinscrição mantém `false` |
| `app/javascript/components/contexts/feature-flags/recertification-flag/` | novo provider de FF para o FE | todas as telas que consomem `useRecertificationFlag` precisam estar dentro do provider |
| `app/controllers/api/v1/learn_devise_controller.rb` | reordenação `verify_participant!` antes de `load_content` | aluno acessando lesson antiga (sem reinscrição) não pode perder acesso |
| `lib/application/services/event_participant_service.rb` | uso de `.order(recertification_number: :desc).first` em ~10 lugares | aluno sem reinscrição: query retorna o único participant (recertification_number=0) — equivalente ao comportamento atual |
| `app/workers/generate_participant_pdf.rb` | só reformatação | nenhum impacto funcional |

---

## Checklist consolidado para o QA

### Cenários "happy path" (flag + has_recertification ligados)
- [ ] Admin habilita "Reinscrição" no curso (tela antiga e facelift)
- [ ] Admin reinscreve aluno individualmente pela tela de aprendizagem
- [ ] Admin reinscreve N alunos em massa pelo drawer
- [ ] Admin importa CSV com coluna `Reinscrever=SIM` (usuários novos e existentes)
- [ ] Integração API V2 manda payload com `recertification=true`
- [ ] Aluno reinscreve-se pelo botão no banner do Play
- [ ] Reinscrição em trilha cria participants nos cursos filhos com `recertification_number` correto
- [ ] Aluno reinscrito vê progresso/score/attendance zerados
- [ ] Aluno reinscrito completa o curso → recebe novo certificado VALID; anterior vira REPLACED
- [ ] Worker `ExpiresCertificates` expira o VALID → REPLACED também vira EXPIRED
- [ ] Filtro "Substituído" aparece e funciona na lista de aprendizagem
- [ ] E-mail de reinscrição diferenciado é enviado (pt/en/es)
- [ ] Logs `event_logs` e `event_participant_info_logs` registram `has_recertification`/`recertification_number`

### Cenários de **regressão** (flag OFF — comportamento legado)
- [ ] Inscrição original em curso individual funciona
- [ ] Inscrição em massa pelo drawer (sem reinscrição) funciona
- [ ] Importação CSV sem coluna `Reinscrever` funciona
- [ ] Trilha inscreve participants nos cursos filhos sem reinscrição
- [ ] Aluno antigo com progresso 100% **mantém** progresso 100% após deploy
- [ ] `ExpiresCertificates` segue expirando certificados normalmente
- [ ] Tela de aprendizagem lista todos os participants atuais
- [ ] Tela de edição de curso não exibe switch de reinscrição

### Cenários de erro (resposta clara)
- [ ] Reinscrição com flag desligada: 422 + `reenroll_participant.errors.feature_disabled`
- [ ] Reinscrição em curso com `has_recertification = false`: 422 + `reenroll_participant.errors.recertification_disabled_for_event`
- [ ] Aluno inelegível (sem progresso, sem aprovação, certificado válido vigente): botão desabilitado / endpoint retorna mensagem específica
- [ ] CSV em curso sem `has_recertification`: linha registra erro com mensagem traduzida

### Pontos de atenção em produção
- [ ] Recriação do índice `unique_participant` em janela controlada (tabela grande)
- [ ] Fan-out de jobs `AddParticipantToLearningPath` na reinscrição em massa de trilhas grandes (validar throughput da fila Sidekiq)
- [ ] Triggers postgres em `postgres_logs` aplicados antes do feature go-live

---

**Documentos relacionados:**
- `.twy/allow-recertifications/prd.md` — PRD
- `.twy/allow-recertifications/dag.md` — DAG dos deliverables
- `.twy/allow-recertifications/deliverables/D01..D10.md` — specs por deliverable
- `.twy/allow-recertifications/deliverables/D07-audit.md` — auditoria de migrations
