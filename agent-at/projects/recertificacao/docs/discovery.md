| Campo | Valor |
|---|---|
| **Discovery** | Recertificação de participantes - v01 14.05.2026 |
| **Objetivo** | Permitir que o admin reinscreva participantes em conteúdos (individualmente, em massa, via CSV, via API V2, via link de pacote) e que o próprio aluno se reinscreva pelo Play, mantendo o histórico de certificados marcados como "Substituído", e isolando progresso/score por inscrição. |
| **Figma** | N/A (feature sem design novo — reaproveita componentes existentes de listagem, drawer de ações em massa e banner do Play) |

## Sumário

- [#R1 Habilitar a reinscrição por conteúdo](#r1-habilitar-a-reinscricao-por-conteudo)
- [#R2 Reinscrever participante individualmente pelo admin](#r2-reinscrever-participante-individualmente-pelo-admin)
- [#R3 Reinscrever participantes em massa pelo admin](#r3-reinscrever-participantes-em-massa-pelo-admin)
- [#R4 Reinscrever participantes via importação CSV](#r4-reinscrever-participantes-via-importacao-csv)
- [#R5 Reinscrever participantes via API V2 de importação em massa](#r5-reinscrever-participantes-via-api-v2-de-importacao-em-massa)
- [#R6 Reinscrever participante via link público de pacote](#r6-reinscrever-participante-via-link-publico-de-pacote)
- [#R7 Reinscrever o próprio aluno pelo Play](#r7-reinscrever-o-proprio-aluno-pelo-play)
- [#R8 Propagar reinscrição em trilhas para os cursos filhos](#r8-propagar-reinscricao-em-trilhas-para-os-cursos-filhos)
- [#R9 Gerenciar o ciclo de vida do certificado "Substituído"](#r9-gerenciar-o-ciclo-de-vida-do-certificado-substituido)
- [#R10 Filtrar a lista de aprendizagem pelo status "Substituído"](#r10-filtrar-a-lista-de-aprendizagem-pelo-status-substituido)
- [#R11 Notificar o aluno reinscrito por e-mail diferenciado](#r11-notificar-o-aluno-reinscrito-por-e-mail-diferenciado)
- [#R12 Auditar reinscrição nos logs de evento e participante](#r12-auditar-reinscricao-nos-logs-de-evento-e-participante)
- [#R13 Isolar progresso, score e attendance por inscrição](#r13-isolar-progresso-score-e-attendance-por-inscricao)
- [Controle de versão](#controle-de-versao)

---

<a id="r1-habilitar-a-reinscricao-por-conteudo"></a>
## #R1 Habilitar a reinscrição por conteúdo

A feature de recertificação é controlada por duas camadas: a feature flag global `:recertificacao` (por organização, via Flipper) e o atributo `events.has_recertification` (por conteúdo). Ambas precisam estar ligadas para qualquer fluxo de reinscrição funcionar — independentemente do canal (admin, CSV, API, Play).

**RN 1** — A flag `:recertificacao` é habilitada por organização e funciona como **kill switch** global. Quando desabilitada, todos os fluxos de reinscrição retornam erro estruturado e nenhum elemento de UI relativo à reinscrição é exibido.

- **RN 1.1** — A verificação no backend é feita via `recertification_enabled?(organization)` (helper de `FeatureFlagHelper`). Nunca via `Flipper.enabled?` direto fora de pontos onde o helper não está disponível.
- **RN 1.2** — A verificação no frontend é feita via `useRecertificationFlag()` (contexto React `RecertificationFlagProvider`), que recebe a flag do payload da página HAML pai.

**RN 2** — Cada curso/trilha tem um atributo booleano `events.has_recertification` (default `false`, `null: false`) controlado por um switch no formulário de edição do conteúdo. O switch só aparece quando a flag `:recertificacao` está habilitada na organização.

- **RN 2.1** — O switch existe em duas telas: o formulário antigo HAML (`_form_details.haml`) e o formulário facelift React (`event-form.tsx`). As duas telas escrevem na mesma coluna.
- **RN 2.2** — O default `false` é opt-in: conteúdos pré-existentes começam **sem permitir reinscrição**. O admin precisa habilitar explicitamente.
- **RN 2.3** — Desativar o switch num curso que **já tem participants reinscritos** é permitido sem aviso. Os participants existentes mantêm seu histórico, mas novas reinscrições ficam bloqueadas.

**RN 3** — O gate funcional de `has_recertification` é centralizado no `CheckReenrollmentEligibilityUseCase`, que é consumido por todos os canais de reinscrição (admin individual, mass action, CSV, API V2, link de pacote, Play). A checagem é a **primeira** condição avaliada, antes de status/progresso/expiração.

> **Premissa:** o admin entende que o switch é por conteúdo (curso/trilha), não por organização ou por participant. A tela atual usa o termo "Habilitar reinscrição" com tooltip explicativo, mas não há treino/documentação interna explícita prevista neste discovery.

---

<a id="r2-reinscrever-participante-individualmente-pelo-admin"></a>
## #R2 Reinscrever participante individualmente pelo admin

Fluxo principal para casos pontuais: admin acessa a lista de aprendizagem de um curso, identifica o aluno que precisa repetir o conteúdo (geralmente porque o certificado expirou ou o aluno foi aprovado e precisa renovar), e dispara a reinscrição diretamente do menu da linha.

**RN 4** — O botão "Reinscrever" aparece **somente na linha do participant com o maior `recertification_number`** do par `(user_id, event_id)`. Linhas de inscrições anteriores não exibem o botão.

- **RN 4.1** — O botão fica habilitado quando o aluno é elegível (ver RN 6).
- **RN 4.2** — Quando o conteúdo tem `has_recertification = false`, o botão fica **visível mas desabilitado** com tooltip "conteúdo não permite reinscrição".
- **RN 4.3** — Quando o aluno **não** é elegível, o botão fica desabilitado com tooltip explicando o motivo.

**RN 5** — Ao clicar e confirmar, o sistema cria um novo `EventParticipant` para o mesmo par `(user_id, event_id)` com:

- `recertification_number = anterior + 1`
- `progress_score = 0`
- `final_score = nil`
- `attendance_score = nil`
- `approved_at = nil`
- `certificate_id = nil`
- `certificate_status = PENDING`
- `status = CONFIRMED` (ou `PENDING` se o evento exige aprovação manual)

**RN 6** — O aluno é considerado elegível para reinscrição quando **pelo menos uma** das condições é verdadeira:

- `progress_score = 100` (concluiu o conteúdo)
- `approved_at` está preenchido (foi aprovado manualmente)
- `expires_at IS NOT NULL AND expires_at < hoje` (certificado expirado)

**RN 7** — Após a criação do novo participant, o sistema dispara o e-mail diferenciado de reinscrição (ver #R11) e atualiza a tabela na tela do admin (refetch automático após toast de sucesso).

> **Premissa:** o admin entende que o aluno reinscrito perde acesso aos dados de progresso anteriores na visualização do Play — o histórico continua acessível pela aba do admin, mas o aluno vê apenas a inscrição corrente.

---

<a id="r3-reinscrever-participantes-em-massa-pelo-admin"></a>
## #R3 Reinscrever participantes em massa pelo admin

Para ondas de recertificação em larga escala (ex: renovação anual de NR's, turmas inteiras), o admin pode selecionar múltiplos alunos na lista de aprendizagem e disparar reinscrição em lote via drawer de ações em massa.

**RN 8** — A ação "Reinscrição em massa" aparece no drawer de ações em massa **somente quando todas estas condições são verdadeiras**:

- Flag `:recertificacao` habilitada na organização
- `event.has_recertification = true`
- Tipo do evento ≠ pacote (`ContentKind.package`)

**RN 9** — O disparo enfileira o `MassReenrollParticipantsWorker` (Sidekiq, fila dedicada `MassReenrollParticipants`, `retry: 3`), que delega para o `MassReenrollParticipantsUseCase`. Este itera pelos IDs e, para cada participant, chama o `ReenrollParticipantUseCase`.

- **RN 9.1** — O worker é **idempotente**: alunos já reinscritos com sucesso na mesma janela são pulados sem erro.
- **RN 9.2** — Erro em um aluno individual é reportado ao Datadog/NewRelic via `ErrorMonitorService` e **não interrompe** o processamento dos demais.

**RN 10** — Quando a flag está desabilitada mas a ação chega ao controller (cenário de exploit / tela em cache), o endpoint retorna **422** com a chave `reenroll_participant.errors.feature_disabled`.

> **Validar a seguinte possibilidade:** fan-out de 1000 alunos numa trilha enfileira 1000 jobs `AddParticipantToLearningPath` adicionais (ver #R8). A capacidade da fila Sidekiq do projeto suporta o pico, mas o tempo total até consistência é não-determinístico.
> - Validar throughput em ambiente de staging com job massivo
> - Definir SLA aceitável para "cascade completa" pós-disparo

---

<a id="r4-reinscrever-participantes-via-importacao-csv"></a>
## #R4 Reinscrever participantes via importação CSV

Permite que o admin reinscreva participantes em lote a partir de uma planilha CSV — útil para casos onde a lista de candidatos à reinscrição vem de um sistema externo ou de uma seleção manual fora da plataforma.

**RN 11** — O template do CSV (`EventParticipant.import_csv_examples(organization:)`) inclui uma coluna adicional **"Reinscrever"** (`reenroll`) **somente quando** a flag `:recertificacao` está habilitada na organização que está baixando o template.

- **RN 11.1** — Os valores aceitos para reinscrição são `SIM` / `sim` / `true` / `1` (case-insensitive). Qualquer outro valor (vazio, `NÃO`, etc.) ignora a coluna e processa a linha como inscrição normal.

**RN 12** — Para cada linha com `Reinscrever=SIM`:

- Se o usuário **já existe** (`email` ou `cpf` em `@existing_users`): valida elegibilidade via `CheckReenrollmentEligibilityUseCase` e, se válido, cria novo participant com `recertification_number` incrementado, bypassando o erro `:in_use` (email/cpf já cadastrado).
- Se o usuário **não existe**: a linha cai no fluxo normal de criação (sem reinscrição) — não é considerada erro.
- Se o conteúdo tem `has_recertification = false`: registra erro `validation_errors` na linha com a mensagem `reenroll_participant.errors.recertification_disabled_for_event`.

**RN 13** — Ao final do worker, e-mails de reinscrição são enviados via `RecertificationMailer#student_email.deliver_later` **apenas** para os participants com `recertification_number > 0` criados nesta execução.

> **Premissa:** o template do CSV é gerado dinamicamente por organização. Admins de organizações sem a flag continuam baixando o template antigo (sem a coluna), e qualquer coluna `Reinscrever` num CSV upado para essas orgs é ignorada silenciosamente.

---

<a id="r5-reinscrever-participantes-via-api-v2-de-importacao-em-massa"></a>
## #R5 Reinscrever participantes via API V2 de importação em massa

Endpoint público para integrações externas (parceiros, sistemas de RH) que disparam reinscrição massiva via API REST.

**RN 14** — O endpoint `POST /api/v2/users/mass` aceita o parâmetro booleano `recertification` por item dentro do array `participants`. Quando `true`, valida elegibilidade e cria participant com `recertification_number` incrementado.

- **RN 14.1** — Item com `recertification=true` em evento com `has_recertification=false` retorna **erro estruturado por item** (HTTP 207 multi-status). Os demais itens do mesmo payload sem o flag seguem fluxo normal.
- **RN 14.2** — Quando a flag `:recertificacao` está desabilitada na organização: o parâmetro `recertification` é ignorado silenciosamente (compatibilidade com integrações antigas).

> **Validar a seguinte possibilidade:** integrações externas atuais que mandam payload no formato antigo (sem `recertification`) precisam continuar funcionando sem alteração. Verificar em produção que nenhum cliente tem parser estrito que quebra com a chave a mais na resposta.

---

<a id="r6-reinscrever-participante-via-link-publico-de-pacote"></a>
## #R6 Reinscrever participante via link público de pacote

Suporte para casos em que o aluno recebe um link público de pacote (ex: campanha de e-mail) e precisa se reinscrever em vez de criar uma nova inscrição.

**RN 15** — `POST /play/.../course_registrations` aceita query string `?recertification=true`. Quando presente:

- Valida elegibilidade via `CheckReenrollmentEligibilityUseCase`.
- Inelegível: retorna a mensagem do use case sem criar participant.
- Elegível: cria novo participant com `recertification_number` incrementado.
- Quando a flag está off para a org: retorna `404 Not Found` com payload vazio.

> **Premissa:** o link contendo `recertification=true` é gerado pelo admin ou por uma campanha pré-aprovada. Não há UI no Play hoje que gere esse link automaticamente — é um canal explicitamente programático.

---

<a id="r7-reinscrever-o-proprio-aluno-pelo-play"></a>
## #R7 Reinscrever o próprio aluno pelo Play

O aluno autenticado, ao acessar a página do curso no Play, vê um botão de auto-reinscrição quando o sistema detecta que ele é elegível.

**RN 16** — Na página do curso (Banner do Play), quando o aluno é elegível para reinscrição, o sistema exibe **dois botões empilhados** no banner:

- Botão original (inscrição/acesso) acima
- Botão "Reinscreva-se" abaixo

- **RN 16.1** — A elegibilidade é calculada server-side em `Api::V1::Play::Events::EventsController#show` via `CheckReenrollmentEligibilityUseCase` e propagada ao FE como `eligibleForRecertification` no payload do evento.
- **RN 16.2** — Aluno não elegível, flag off ou `has_recertification = false` → botão **não aparece** (não é exibido como disabled).

**RN 17** — O clique no botão dispara `POST /api/v1/play/.../subscribe` com `recertification=true`. O `CourseStarterService#subscribe` cria o novo participant e retorna o objeto `participant` no JSON de resposta para o FE atualizar o `PlaySubscriptionContext`.

> **Validar a seguinte possibilidade:** se o aluno tem múltiplos certificados (válido + substituídos), apenas o botão de reinscrição da inscrição corrente é considerado. Verificar se aluno em trilha vê o botão na trilha pai ou em cada curso filho (decisão atual: aparece apenas no nível em que o admin habilitou `has_recertification`).
> - Como aluno enxerga isso visualmente quando trilha permite reinscrição mas o curso filho não?
> - Validar com QA cenário de trilha+curso ambos com `has_recertification=true`

---

<a id="r8-propagar-reinscricao-em-trilhas-para-os-cursos-filhos"></a>
## #R8 Propagar reinscrição em trilhas para os cursos filhos

Quando o conteúdo reinscrito é uma trilha (`Event::KIND_LEARNING_PATH`), o sistema precisa propagar a reinscrição para todos os cursos filhos da trilha, com `recertification_number` correto **por curso** (não pelo número da trilha).

**RN 18** — Para cada canal de reinscrição em trilha, o sistema cria participants nos cursos filhos:

- **Admin individual / Play / API V2 / mass action listagem**: dispara o worker `AddParticipantToLearningPath` (assíncrono) para cada participant da trilha criado.
- **CSV import**: cascade **síncrona inline** dentro do próprio worker do CSV (`LearningPathActionMassService#create_course_participants`).

- **RN 18.1** — O `recertification_number` do participant em cada curso filho é calculado **por par (user_id, course_id)** via uma **única query agrupada** (`.group(:event_id).maximum(:recertification_number)`) — não emite query por curso.
- **RN 18.2** — O filtro "já inscrito" (`event_and_user_id_subscribed`) é **bypassado** quando o fluxo é de reinscrição, permitindo criar segunda/terceira/N-ésima inscrição.

**RN 19** — O worker `AddParticipantToLearningPath` aceita o 3º argumento `recertification` (default `false`) para compatibilidade retroativa. Chamadas antigas sem o argumento continuam funcionando como inscrição original.

> **Premissa:** a cascade assíncrona introduz uma janela de inconsistência (segundos a minutos, dependendo da fila) entre "trilha reinscrita" e "cursos filhos reinscritos". Esse padrão já é o mesmo dos fluxos não-massa em master e é considerado aceitável.

> **Validar a seguinte possibilidade:** para reinscrição em massa de 1000 alunos numa trilha com 10 cursos filhos, são enfileirados 1000 jobs (um por participant da trilha). Cada job faz ~3 queries (latest_numbers + insert bulk + relations). Operação ainda dentro da capacidade do Sidekiq?
> - Validar throughput esperado em janela de pico
> - Considerar batch worker se latência total ultrapassar SLA

---

<a id="r9-gerenciar-o-ciclo-de-vida-do-certificado-substituido"></a>
## #R9 Gerenciar o ciclo de vida do certificado "Substituído"

Quando um aluno é reinscrito e conclui o conteúdo novamente, o certificado anterior precisa ser marcado como "substituído" para manter o histórico sem inflar a contagem de certificados válidos do usuário.

**RN 20** — Foi introduzida a constante `Certificate::CERTIFICATE_REPLACED = 4` e o espelhamento `EventParticipant::REPLACED`. A coluna `certificates.situation` aceita os valores existentes (`CERTIFICATE_VALID=2`, `CERTIFICATE_EXPIRED=1`) mais o novo `CERTIFICATE_REPLACED=4`.

- **RN 20.1** — `EventParticipant::CERTIFICATE_STATUS_DESCRIPTIONS` ganha a chave `'replaced' => REPLACED`, usada no filtro avançado (ver #R10).

**RN 21** — Após emissão bem-sucedida de novo certificado para um participant com `recertification_number > 0`, o `CertificateGenerationService#replace_previous_certificates_bulk` atualiza em lote (`update_all`) todos os certificados `VALID` dos participants anteriores do mesmo par `(user_id, event_id)` para `REPLACED`. A operação acontece dentro do mesmo job de geração de certificados, em uma única query.

**RN 22** — O worker `ExpiresCertificates` (cron diário) ganha a responsabilidade adicional de, ao expirar um certificado `VALID` (`expires_at <= hoje`), também marcar como `EXPIRED` todos os certificados `REPLACED` do mesmo par `(user_id, event_id)`.

- **RN 22.1** — Isso garante que o histórico de um aluno cujo certificado final expira **não fique inflado** com certificados intermediários em estado "substituído" indefinidamente.

> **Premissa:** o usuário final (aluno) não tem acesso direto à listagem de certificados `REPLACED`. O histórico fica disponível apenas para o admin via filtro avançado da lista de aprendizagem.

---

<a id="r10-filtrar-a-lista-de-aprendizagem-pelo-status-substituido"></a>
## #R10 Filtrar a lista de aprendizagem pelo status "Substituído"

O admin precisa conseguir auditar quais alunos têm certificados substituídos para entender histórico de recertificações.

**RN 23** — Na lista de aprendizagem (`/learning_students`), o filtro avançado da coluna **"Status do certificado"** exibe a opção **"Substituído"** somente quando a flag `:recertificacao` está habilitada na organização.

- **RN 23.1** — Selecionando "Substituído", a query filtra `event_participants.certificate_status = 4`.
- **RN 23.2** — O badge "Substituído" é exibido na coluna de status do listing para os participants com esse `certificate_status` (via componente `certificate-student-badge.tsx`).

---

<a id="r11-notificar-o-aluno-reinscrito-por-e-mail-diferenciado"></a>
## #R11 Notificar o aluno reinscrito por e-mail diferenciado

Aluno reinscrito não pode receber o mesmo e-mail que o aluno em fluxo de "recertificação automática por expiração próxima" — a mensagem precisa ser ajustada para refletir que o admin (ou ele mesmo) iniciou a reinscrição.

**RN 24** — Sempre que um `EventParticipant` é criado com `recertification_number > 0`, o `RecertificationMailer#student_email(event, participant)` é disparado.

- **RN 24.1** — Quando `participant.recertification_number > 0` (reinscrição efetiva):
  - Assunto: `recertification_mailer.reenrollment.subject` (chave nova em pt/en/es)
  - Corpo: template `reenrollment_mail`
- **RN 24.2** — Quando `recertification_number = 0` (e-mail de aviso de expiração próxima, fluxo legado mantido):
  - Assunto: `recertification_mailer.expiration_reminder.subject`
  - Corpo: template `recertification_mail` (atual)

**RN 25** — O envio respeita os mesmos bloqueios atuais: `organization.mailer_block?`, `is_fake_email?`, e-mail vazio.

> **Premissa:** pt-BR, en e es são os três locales suportados oficialmente. Demais locales caem no fallback padrão do Rails (en).

---

<a id="r12-auditar-reinscricao-nos-logs-de-evento-e-participante"></a>
## #R12 Auditar reinscrição nos logs de evento e participante

Os logs de auditoria (`postgres_logs` / TimescaleDB) precisam carregar a nova coluna `recertification_number` e `has_recertification` para que relatórios e dashboards externos consigam analisar reinscrições retroativamente.

**RN 26** — Os triggers de PostgreSQL foram atualizados para incluir as novas colunas:

- **`event_participant_info_logs`** ganha a coluna `recertification_number` — propagada de `event_participants` em inserts/updates.
- **`event_logs`** ganha a coluna `has_recertification` — propagada de `events` em inserts/updates.

- **RN 26.1** — Os triggers são reversíveis (migration possui `down` que restaura a versão anterior do trigger).
- **RN 26.2** — Logs antigos (anteriores ao deploy) ficam com `NULL` nas novas colunas — consultas precisam tratar com `COALESCE` quando relevante.

> **Validar a seguinte possibilidade:** as 6 migrations de triggers postgres (3 versões evolutivas para cada uma das duas tabelas) precisam rodar **em ordem** em ambientes que ainda não as tinham. Confirmar `db:migrate` em DB limpa derivada de master.

---

<a id="r13-isolar-progresso-score-e-attendance-por-inscricao"></a>
## #R13 Isolar progresso, score e attendance por inscrição

Sem isolar progresso por inscrição, um aluno reinscrito veria o mesmo "100% concluído" do certificado anterior, e o cálculo de progresso da nova inscrição ficaria inconsistente. Esta capacidade é o que permite que o aluno de fato refaça o curso do zero.

**RN 27** — A tabela `event_content_users` ganha a coluna `event_participant_id` (`integer`, nullable, com índice). Toda criação de progresso/score/attendance daqui em diante vincula o registro ao participant correspondente.

- **RN 27.1** — Registros históricos (anteriores ao deploy) ficam com `event_participant_id IS NULL`. O código os trata como pertencentes ao participant com `recertification_number = 0` do par `(user_id, event_id)` — preservando 100% do histórico legado.

**RN 28** — As queries que calculam progresso, score e attendance foram ajustadas para escopar por `participant_id`:

- `EventContent#for_user(user, content_event, participant_id:)` — cria/lê registros escopados por participant.
- `EventContentUser.contents(user, event, participant_id:)` — scope filtra por participant.
- `EventParticipant#with_score_and_attendance_*` — `LEFT JOIN` agora usa `eu.event_participant_id = event_participants.id OR (eu.event_participant_id IS NULL AND COALESCE(event_participants.recertification_number, 0) = 0)`.
- Controllers `learn_controller` e `Api::V1::LearnDeviseController` — todas as queries `where(event_id:, user_id:).first` foram trocadas por `.order(recertification_number: :desc).first` para sempre apontar para o participant ativo.

**RN 29** — A unicidade de participant no banco foi reforçada: o índice único `unique_participant` em `event_participants` foi recriado de `(user_id, event_id, partner_rel)` para `(user_id, event_id, partner_rel, recertification_number)`. Sem essa mudança, o INSERT de uma segunda inscrição falha com violação de unicidade.

- **RN 29.1** — A validação `validates :email, uniqueness: { scope: [:event_id, :recertification_number] ... }` (idem para `cpf`) acompanha o novo índice.

> **Premissa:** alunos não reinscritos (recertification_number = 0) **não podem** perder progresso após o deploy. O comportamento de fallback (`event_participant_id IS NULL` conta para `recertification_number = 0`) garante isso, mas precisa ser validado manualmente com pelo menos um curso concluído pré-deploy.

> **Validar a seguinte possibilidade:** a recriação do índice `unique_participant` em produção é uma operação **pesada** em tabela grande. Pode exigir `pt-online-schema-change`, `gh-ost` ou janela de manutenção dedicada.
> - Estimar tamanho da `event_participants` em produção
> - Decidir entre operação online ou janela dedicada
> - Estado intermediário (coluna criada, índice antigo ainda no lugar) **mantém o comportamento atual** — permite separar deploy do código da janela de schema change

---

## Controle de versão

| Versão | Data | Alterado por | O que foi alterado |
|---|---|---|---|
| 01 | 14/05/2026 | Milles Schroeder | Criação deste documento (retrospectivo da feature implementada na branch `feat/add-recertification-to-participant`). |
| 02 | | | |
