---
aprovada: true
project: recertificacao
generated_at: 2026-07-27
docs_lidos: [docs/discovery.md, docs/qa-impact-map.md, docs/QA_Only_Recertificacao_v2.xlsx]
docs_pulados: []
---

# Proposta de Estrutura — Recertificação

> Mapeamento 1:1 com as atividades "Execução de testes" da planilha
> `QA_Only_Recertificacao_v2.xlsx` (aba `dev-qa`), cruzadas com as regras de
> negócio de `docs/discovery.md` (R1–R13) e o checklist de
> `docs/qa-impact-map.md`. Atividades não-QA da planilha (Análise de testes,
> Reteste/Repasse, Documentação, Review, Deploy, "QA x.x - Beta / Launch")
> não geram suíte.

## Suíte: Configuração de Conteúdo (Switch "Habilitar reinscrição")
- **Executor:** playwright
- **Playbooks:** flipper, switch-chakra, cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:recertificacao` ativa na organização do teste
  - Usuário logado como Admin
  - Pelo menos 1 curso pré-existente (para validar default `has_recertification = false`)
  - Pelo menos 1 trilha pré-existente (para validar paridade do switch entre HAML e React)

## Suíte: Reinscrição Individual pelo Admin
- **Executor:** playwright
- **Playbooks:** flipper, cleanup-dados, toast-chakra
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:recertificacao` ativa na organização
  - Curso com `has_recertification = true`
  - Usuário logado como Admin
  - Pelo menos 3 alunos cadastrados no curso em cenários distintos: elegível por progresso 100%, elegível por certificado expirado, e inelegível

## Suíte: Reinscrição em Massa pelo Admin
- **Executor:** playwright
- **Playbooks:** flipper, cleanup-dados, toast-chakra
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:recertificacao` ativa
  - Curso com `has_recertification = true`
  - Pelo menos 5 alunos elegíveis selecionáveis na lista de aprendizagem
  - Sidekiq operacional (worker `MassReenrollParticipantsWorker`)

## Suíte: Reinscrição via Importação CSV
- **Executor:** playwright
- **Playbooks:** flipper, cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:recertificacao` ativa
  - Curso com `has_recertification = true`
  - Usuário logado como Admin
  - Pelo menos 3 alunos elegíveis pré-cadastrados (para reinscrição via CSV)

## Suíte: Reinscrição via API V2
- **Executor:** playwright
- **Playbooks:** flipper, cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:recertificacao` ativa na organização
  - Curso com `has_recertification = true` e outro com `has_recertification = false` (para validar erro por item)
  - Pelo menos 2 alunos pré-cadastrados e elegíveis
  - Token de acesso à API V2 disponível em staging

## Suíte: Reinscrição pelo Aluno (Play e Link Público)
- **Executor:** playwright
- **Playbooks:** flipper, cleanup-dados, toast-chakra
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:recertificacao` ativa
  - Curso com `has_recertification = true`
  - Aluno elegível cadastrado (progresso 100% ou certificado expirado) e outro inelegível (em andamento)
  - Pacote com link público de reinscrição gerado (`/play/.../course_registrations`)

## Suíte: Cascade de Reinscrição em Trilhas
- **Executor:** playwright
- **Playbooks:** flipper, cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:recertificacao` ativa
  - Trilha com `has_recertification = true` e pelo menos 3 cursos filhos vinculados
  - Pelo menos 2 alunos elegíveis na trilha
  - Sidekiq operacional (worker `AddParticipantToLearningPath`)

## Suíte: Ciclo de Vida do Certificado Substituído
- **Executor:** playwright
- **Playbooks:** flipper, cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:recertificacao` ativa
  - Curso com `has_recertification = true`
  - Aluno com `recertification_number = 0` aprovado e certificado emitido (`CERTIFICATE_VALID`)
  - Cron `ExpiresCertificates` configurado para staging

## Suíte: Filtro Avançado Status Substituído
- **Executor:** playwright
- **Playbooks:** flipper, filtro-drawer, cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:recertificacao` ativa
  - Pelo menos 1 aluno com certificado VALID, 1 com REPLACED, 1 com EXPIRED e 1 com PENDING
  - Lista de aprendizagem com filtro avançado disponível (`/learning_students`)

## Suíte: E-mail Diferenciado de Reinscrição
- **Executor:** playwright
- **Playbooks:** flipper, cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:recertificacao` ativa
  - Mailer ativo em staging (inbox de teste acessível)
  - Curso com `has_recertification = true`
  - Aluno cadastrado com e-mail real testável

## Suíte: Isolamento de Progresso, Score e Attendance por Inscrição
- **Executor:** playwright
- **Playbooks:** flipper, cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:recertificacao` ativa
  - Curso com `has_recertification = true`
  - Aluno aprovado com `recertification_number = 0`, `progress_score = 100`, certificado VALID (para validar que não perde histórico)
  - Banco com índice `unique_participant(user_id, event_id, partner_rel, recertification_number)` aplicado

## Suíte: Comportamento da Feature Flag :recertificacao
- **Executor:** playwright
- **Playbooks:** flipper
- **Org:** principal
- **Pré-condições:**
  - Acesso à página de Flipper Admin (`/admin/manage/features/recertificacao`)
  - Curso com `has_recertification = true` (estado preparado enquanto a flag estava ligada)
  - Usuário Admin com permissão para gerenciar features

## Suíte: Auditoria via Triggers PostgreSQL
- **Executor:** playwright
- **Playbooks:** flipper, cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:recertificacao` ativa
  - Banco `postgres_logs` (TimescaleDB) acessível
  - Migrations de triggers aplicadas (`event_participant_info_logs`, `event_logs`)
  - Curso com `has_recertification = true`

## Suíte: Isolamento em Ambientes Adicionais
- **Executor:** playwright
- **Playbooks:** flipper, ambientes-adicionais, cleanup-dados
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:recertificacao` ativa no ambiente principal (`staging-base-de-conhecimento`)
  - Ambiente secundário pareado disponível (nome exato a confirmar com o time de infra)
  - Cursos com `has_recertification = true` em ambos os ambientes
  - Aluno cadastrado em ambos os ambientes com o mesmo e-mail (para validar isolamento)


## Nota QA (edição manual de verificação E2E)
- Marcador MARCA-VERIFICACAO-E2E-TASK7 — confirma que edições no textarea chegam ao test-analysis.md final.