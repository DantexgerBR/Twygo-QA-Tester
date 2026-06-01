# Triage Report — Recertificação — 2026-06-01 14:31

**Escopo**: Regressão (todos os testsuites) · **Ambiente**: `staging-recertificacao`

## Sumário

| Total | ✅ Passed | ❌ Failed | ⊘ Skipped | Findings exploratórios |
|---:|---:|---:|---:|---|
| 77 | 8 | 3 | 66 | 0 erros · 0 warnings · 0 info |

> **Janela única de revisão.** Marque ☑ em UMA categoria por item.
> Notas em PT-BR. Commit este arquivo após triagem.
> Categorias: `Bug produto` / `Comportamento esperado` / `Spec/seed errado` / `Flakiness`.

---

## ❌ Falhas pra triagem

### [F1] Ciclo de Vida do Certificado Substituído · "TC4 — Certificados emitidos no fluxo legado (sem reinscrição) permanecem VALID indefinidamente"

- **Arquivo**: `projects/recertificacao/tests/features/ciclo-de-vida-do-certificado-substituido/tc4-certificados-legado-permanecem-valid.spec.ts`
- **Status**: failed · **Duração**: 30.0s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\tests\features\ciclo-de-vida-do-certificado-substituido\tc4-certificados-legado-permanecem-valid.spec.ts:77`
- **🌐 URL aproximada (NÃO precisa)**: [https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard](https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard)
  - URL crua (copiar): `https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
  - 🚨 **URL não bate com escopo do teste** (nome do TC menciona painel/listagem mas URL é `https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard`). **Possível causa**: spec configurado em rota errada OU teste navegou pra lugar inesperado. **Verifique**: abrir trace + conferir `goToList()` ou rota usada pelo spec.
- **Última tela**: `test-artifacts\projects-recertificacao-te-8b492-necem-VALID-indefinidamente-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-recertificacao-te-8b492-necem-VALID-indefinidamente-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-recertificacao-te-8b492-necem-VALID-indefinidamente-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: locator('tbody tr').filter({ hasText: 'richard.sebold@twygo.com' }).filter({ hasText: /Emitido/i }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Pré-condição: aluno com recertification_number = 0 aprovado e VALID emitido → acessar lista de aprendizagem e verificar que a linha do aluno legado existe | ✅ |
| 2 | 2. Verificar que a linha do aluno legado exibe badge "Emitido" (VALID) → RN 20/21: sem reinscrição, o cert original permanece situation=2 (VALID); replace_previous_certificates_bulk não foi acionado | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F2] Configuração de Conteúdo (Switch "Habilitar reinscrição") · "TC3 — Ativar e salvar o switch persiste `has_recertification = true`"

- **Arquivo**: `projects/recertificacao/tests/features/configuracao-de-conteudo-switch-habilitar-reinscricao/tc3-ativar-e-salvar-persiste.spec.ts`
- **Status**: failed · **Duração**: 24.0s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\ContentEditPage.ts:70`
- **🌐 URL aproximada (NÃO precisa)**: [https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard](https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard)
  - URL crua (copiar): `https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
  - 🚨 **URL não bate com escopo do teste** (nome do TC menciona painel/listagem mas URL é `https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard`). **Possível causa**: spec configurado em rota errada OU teste navegou pra lugar inesperado. **Verifique**: abrir trace + conferir `goToList()` ou rota usada pelo spec.
- **Última tela**: `test-artifacts\projects-recertificacao-te-ccb33-e-has-recertification-true--chromium\test-finished-1.png`
- **Trace**: `test-artifacts\projects-recertificacao-te-ccb33-e-has-recertification-true--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-recertificacao-te-ccb33-e-has-recertification-true--chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.waitFor: Timeout 20000ms exceeded.
Call log:
  - waiting for getByRole('tab', { name: /^Acesso$/i }).or(locator('[data-test-id="tab-access"]')).first() to be visible

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar a edição de um curso com `has_recertification = false` (tab "Acesso") | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F3] Configuração de Conteúdo (Switch "Habilitar reinscrição") · "TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso"

- **Arquivo**: `projects/recertificacao/tests/features/configuracao-de-conteudo-switch-habilitar-reinscricao/tc4-desativar-com-participants.spec.ts`
- **Status**: failed · **Duração**: 0.0s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\ContentEditPage.ts:379`
- **🌐 URL aproximada (NÃO precisa)**: [https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard](https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard)
  - URL crua (copiar): `https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
  - 🚨 **URL não bate com escopo do teste** (nome do TC menciona painel/listagem mas URL é `https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard`). **Possível causa**: spec configurado em rota errada OU teste navegou pra lugar inesperado. **Verifique**: abrir trace + conferir `goToList()` ou rota usada pelo spec.
- **Última tela**: `test-artifacts\projects-recertificacao-te-ad265-ritos-é-permitido-sem-aviso-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-recertificacao-te-ad265-ritos-é-permitido-sem-aviso-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-recertificacao-te-ad265-ritos-é-permitido-sem-aviso-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('label.chakra-checkbox').filter({ has: locator('#has_recertification') }).first() to be visible

```

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

## ⊘ Skips legítimos pra revalidação periódica

> Items com `test.fixme` + reason. Se o motivo já não vale (seed criado, bug corrigido), abrir e re-rodar. Ver skill `debugar-bug-produto-stale`.

| TC | Tipo | Motivo |
|---|---|---|
| TC1 — Insert em event_participants propaga recertification_number para event_participant_info_logs | fixme | requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver. |
| TC2 — Update em events.has_recertification propaga para event_logs | fixme | requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver. |
| TC3 — Triggers são reversíveis (migration down restaura comportamento) | fixme | requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver. |
| TC4 — Logs antigos (pré-deploy) consultáveis com COALESCE para nova coluna | fixme | requer acesso direto ao banco PostgreSQL — validação DB-pure fora do escopo Playwright. agent-db ainda não implementado (V2 do CONTRACT.md). Validar manualmente via psql ou DBeaver. |
| TC1 — Reinscrever trilha individualmente cria participants nos cursos filhos com recertification_number correto por curso | fixme | requer validação de worker AddParticipantToLearningPath + DB-pure de recertification_number por curso filho. UI cobre só dispatch. Validar manualmente via Sidekiq monitor + psql. |
| TC2 — Filtro "já inscrito" é bypassado em fluxos de reinscrição (cria segunda/N-ésima inscrição) | fixme | requer validação DB-pure de filter bypass + presença de N inscrições com recertification_number distintos. Validar manualmente. |
| TC3 — Cascade NÃO acontece em inscrição original (sem recertification) — regressão crítica | fixme | regressão DB-pure — exige validação direta no banco que recertification_number=0 nos filhos. Validar manualmente. |
| TC4 — Cascade síncrona inline no fluxo CSV | fixme | cross-suite com Suite 04 (CSV) + cascade DB. Compound test — validar manualmente após Suite 04 estar verde + DB checks. |
| TC1 — Após emitir novo certificado, anteriores são marcados em lote como REPLACED | fixme | state-dependent: refatorado de DB-pure pra UI esperando seed manual de 2026-05-28 (Richard Sebold no curso 807287 com recert_num=0/1). Quando o env não tem o par exato em REPLACED+Emitido, a linha com |
| TC2 — Worker ExpiresCertificates expira VALID e propaga para REPLACED do mesmo par | fixme | — |
| TC3 — Constante CERTIFICATE_REPLACED = 4 espelhada em EventParticipant::REPLACED | fixme | TC declarado Tipo: db no MD canônico (test-analysis.md §TC3). Validação de constantes Rails (Certificate::CERTIFICATE_REPLACED, EventParticipant::REPLACED) exige Rails console em staging — fora do esc |
| TC1 — Habilitar flag exibe switch "Habilitar reinscrição" em conteúdos | fixme | requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. |
| TC2 — Desabilitar flag oculta switch e desativa fluxos (cenário de rollback) | fixme | requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. |
| TC3 — Re-habilitar flag restaura todos os fluxos (sem perda de dados) | fixme | requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. |
| TC4 — Flag OFF: comportamento legado completo de inscrição/listagem mantido (regressão geral) | fixme | requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito. |
| TC2 — Switch "Habilitar reinscrição" NÃO aparece com flag OFF (regressão) | fixme | requer toggle runtime da flag :recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente OFF. |
| TC5 — Paridade do switch entre formulário HAML e formulário React (facelift) | fixme | — |
| TC1 — Criação de participant com `recertification_number > 0` dispara `RecertificationMailer#student_email` | fixme | requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. |
| TC2 — Participant com `recertification_number = 0` em fluxo de aviso de expiração usa template legado | fixme | requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. |
| TC3 — E-mail respeita bloqueio de `organization.mailer_block?` | fixme | requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. |
| TC4 — E-mail respeita locale do aluno (pt-BR/en/es) | fixme | requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer. |
| TC1 — Aluno reinscrito tem progress/score/attendance zerados na nova inscrição | fixme | — |
| TC2 — Aluno NÃO reinscrito (recertification_number = 0) mantém progresso histórico após deploy | fixme | DB-only: requer aluno pré-deploy com event_content_users.event_participant_id IS NULL — artefato de backfill da migration. Não provisionável via UI (criar um aluno hoje já grava event_participant_id p |
| TC3 — Índice único `unique_participant` rejeita duplicata `(user_id, event_id, partner_rel, recertification_number)` | fixme | Tipo: db (MD §1409). Valida índice PostgreSQL unique_participant via psql/Rails console — não há fluxo UI que tente inserir dois participants idênticos (UI sempre incrementa recertification_number). E |
| TC4 — Validações Rails de email/cpf escopam por `[:event_id, :recertification_number]` | fixme | Tipo: db (MD §1426). Valida Rails uniqueness validator (scope: [:event_id, :recertification_number]) via Rails console — não observável via menu Aprendizagem (UI não expõe erros de validação do modelo |
| TC1 — Reinscrição num env não afeta participants no env pareado | fixme | Passos 1 e 3 são DB-pura cross-tenant (SELECT COUNT em 2 bancos). Fora do escopo Playwright — aguarda agent-db. Env aditional já configurado. |
| TC2 — Toggle da flag :recertificacao no env principal NÃO afeta env secundário | fixme | Exige toggle runtime da flag :recertificacao no Flipper Admin escopado por orgId + assertion cross-tenant (2 contextos com storage/baseURL distintos). Bloqueado por FlipperAdminPage não implementado + |
| TC1 — Ação "Reinscrição em massa" aparece no drawer quando todas as condições atendidas | fixme | seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc1-acao-aparece-drawer-condicoes-atendidas.data.ts. |
| TC2 — Ação "Reinscrição em massa" NÃO aparece em evento do tipo pacote | fixme | seed inválido — pacoteIdRecertOn=4 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc2-acao-nao-aparece-evento-pacote.data.ts. |
| TC3 — Disparar reinscrição em massa enfileira worker e processa todos os alunos elegíveis | fixme | seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc3-disparar-reinscricao-massa-enfileira-worker.data.ts. |
| TC4 — Worker é idempotente: alunos já reinscritos na mesma janela são pulados | fixme | requer execução do worker Sidekiq + validação direta no banco. Cobertura UI cobre dispatch; idempotência é DB-pure. Validar manualmente. |
| TC5 — Erro em aluno individual não interrompe o lote | fixme | requer monitoramento do worker + validação de DLQ/logs. Validar manualmente. |
| TC6 — Disparo de reinscrição em massa com flag OFF retorna HTTP 422 `feature_disabled` | fixme | requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente HTTP 422. |
| TC1 — Botão "Reinscrever" visível e habilitado apenas para aluno elegível | fixme | seed-roadmap-fixture-composta-3-alunos: TC1 exige 3 alunos no mesmo curso em estados distintos (a) progresso 100% (b) cert expirado (c) em andamento. v1.7.0 tem cada estado coberto individualmente, ma |
| TC2 — Botão "Reinscrever" visível apenas na linha do participant com maior recertification_number | fixme | seed-roadmap-tc2-aluno-multi-recert-controlado: TC2 valida que botão Reinscrever aparece SÓ na linha mais recente com cert ativo. Richard Sebold (807287) tinha esse estado em 2026-05-28, mas state mud |
| TC3 — Reinscrever aluno individualmente cria novo participant zerado | fixme | AT inferiu modal "Confirmar reinscrição" (REVISAR-FIGMA) que NÃO existe no produto. Validado live 2026-05-29 com bug Chakra menu já corrigido: click "Iniciar reinscrição" dispara POST imediato sem mod |
| TC4 — Botão "Reinscrever" fica visível mas DESABILITADO quando event.has_recertification = false | fixme | seed-roadmap-atividade-aula-1: pré-condição "aluno elegível por progresso 100%" exige curso com atividades pra completar — helper de criação de atividades ainda não implementado. cursoSeed default (ha |
| TC5 — Reinscrição com flag OFF retorna HTTP 422 feature_disabled | fixme | requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente HTTP 422 feature_disabled. |
| TC6 — Após reinscrição, e-mail diferenciado é disparado (validação cross-suite) | fixme | cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail não configurada. Validar manualmente que e-mail de reinscrição foi disparado. |
| TC1 — Botão "Reinscreva-se" aparece no banner do Play para aluno elegível | fixme | seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (curso com has_recertification=true + participant elegível). |
| TC2 — Botão "Reinscreva-se" NÃO aparece para aluno inelegível (sem disabled visível) | fixme | seed inválido — eventIdCursoInelegivel=1 retorna 404. NEEDS_SEED (curso + participant em andamento sem expiração). |
| TC3 — Click em "Reinscreva-se" dispara subscribe com `recertification=true` e cria novo participant | fixme | seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (mesmo seed do TC1). |
| TC4 — Flag OFF na org: banner do Play NÃO exibe "Reinscreva-se" (regressão) | fixme | requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente. |
| TC5 — POST em link público com `?recertification=true` para aluno elegível cria participant | fixme | seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e eligibleStudent é placeholder. NEEDS_SEED (pacote com link público + aluno com histórico elegível). |
| TC6 — POST em link público com `recertification=true` para aluno inelegível retorna erro sem criar participant | fixme | seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e ineligibleStudent é placeholder. NEEDS_SEED (mesmo pacote do TC5 + aluno em andamento). |
| TC7 — POST em link público com flag OFF retorna HTTP 404 com payload vazio (regressão) | fixme | requer toggle runtime da flag :recertificacao OFF. Validar manualmente HTTP 404. |
| TC1 — POST /api/v2/users/mass com `recertification=true` cria participants reinscritos | fixme | requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token A |
| TC2 — Item com `recertification=true` em curso com `has_recertification=false` retorna erro por item (HTTP 207) | fixme | requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token A |
| TC3 — Payload sem `recertification` segue fluxo legado (regressão) | fixme | requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token A |
| TC4 — Com flag OFF, parâmetro `recertification` é ignorado silenciosamente | fixme | requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token A |
| TC1 — Coluna "Reinscrever" aparece no template CSV com flag ON | fixme | seed-roadmap-bloqueio-canonical: refactor pra fixture cursoComRecertificacaoSeed (válida em si) bloqueado por bug state-dependent em SeedAdminPage.setHasRecertification → openEditReactAccessById (tab  |
| TC2 — Coluna "Reinscrever" NÃO aparece no template CSV com flag OFF (regressão) | fixme | requer toggle runtime da flag :recertificacao OFF. Validar manualmente. |
| TC3 — Upload de CSV com `Reinscrever=SIM` para usuário existente cria participant reinscrito | fixme | seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. |
| TC4 — Valores de `Reinscrever` aceitos (case-insensitive: SIM/sim/true/1) | fixme | seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. |
| TC5 — Linha com `Reinscrever=SIM` em conteúdo com `has_recertification=false` registra erro estruturado | fixme | seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. |
| TC6 — Linha com `Reinscrever=SIM` para usuário INEXISTENTE cai no fluxo normal de criação (sem reinscrição) | fixme | seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento. |
| TC7 — Pós-importação, e-mails são enviados APENAS para participants com `recertification_number > 0` criados nesta execução | fixme | cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail. Validar manualmente. |
| deletePacoteByIdSafe(807420) | skip | opt-in via RUN_CLEANUP_PACOTE_PILOTO=1 |
| dump 807287 (Richard Sebold) + 807403 (Curso com atividades) | skip | opt-in via RUN_RECON_ALUNOS_REINSCREVER=1 |
| row kebab Atividades → tela gerenciar → dump wizard | skip | opt-in via RUN_RECON_WIZARD_ATIVIDADE=1 |
| Pipeline completo: criar + login + completar curso + cert | skip | One-shot. RUN_SEED_ENGAJAMENTO_COMPLETO=1 npx playwright test ... |
| Bootstrap aluno com senha pra fluxo de engajamento | skip | Spec one-shot. Roda só com: RUN_SEED_ALUNO_ENGAJAMENTO=1 npx playwright test --project=chromium tests/setup/seed-aluno-engajamento.spec.ts --reporter=list |
| alunoAprovadoNoCursoFixoSeed atinge 100% e emite cert | skip | opt-in via RUN_SEED_PILOTO_807403=1 |
| createPacote retorna eventId válido | skip | opt-in via RUN_SEED_PILOTO_CREATE_PACOTE=1 |
| Bootstrap seed: ativar switch Habilitar reinscrição no curso Rec V2 | skip | Spec one-shot. Roda só com: RUN_SEED_REC_V2=1 npx playwright test --project=chromium tests/setup/seed-rec-v2-curso.spec.ts --reporter=list |
| TC2 — Recertificação de user não-aprovado retorna 422 com mensagem descritiva | fixme | dep-externa: backend API V2 Beta aceita recertification:true silenciosamente — retorna 422 mas sem populate de participants.error[content_id] e sem a mensagem "Aluno já inscrito mas não aprovado — rec |

---

## 🐛 Findings exploratórios não-fatais (informativo)

> Console errors, HTTP 5xx, axe critical. Não bloqueiam, mas merecem leitura — podem indicar bug latente.

---

## Próximos passos

1. Marque ☑ em **uma** categoria por falha acima.
2. Preencha "Notas QA" em PT-BR — vira input do agente.
3. Commit este arquivo (`outputs/<slug>/triage-report.md`).
4. Próxima sessão do agente lê o report e aplica patches conforme decisão.

> Categorias mutuamente exclusivas — se duvidar entre duas, escolha a mais conservadora (geralmente "Flakiness" ou "Spec errado").
