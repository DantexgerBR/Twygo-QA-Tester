# Spike — Registros de Aprendizagem

**Origem:** [Discovery] Registros de Aprendizagem - v02 25.05.2026
**Status:** Aberto

---

## S1 — Cálculo do status "Expirado" em tempo real

**Origem:** #R6 / RN 25

**Categoria:** Premissa não-validada (impacto em mudança estrutural)

**Pergunta:**
Como garantir que um registro com `data_validade` cruzando a meia-noite reflita como "Expirado" no KPI no mesmo instante, sem reload, e com performance adequada em organizações com milhares de registros?

**Contexto:**
Decisão de produto (Max 2026-05-25) exige transição Emitido → Expirado instantânea — não aceita atraso de horas de um job batch noturno. Implementação pode ser cálculo on-the-fly em todas as queries (custo na consulta), materialização via job de curto intervalo (atraso de minutos aceitável?) ou estratégia híbrida.

**Hipótese inicial:**
- **Back**: status "Expirado" calculado on-the-fly via SQL (`CASE WHEN data_validade < NOW() THEN ...`) com índice em `data_validade`. Sem campo `status` materializado pra evitar drift.
- **Front**: refetch dos stats/lista em intervalo curto (ex: 60s) enquanto a tela estiver aberta.

**Critério de done:**
- [ ] POC mede latência da query do KPI count com 5k+ registros usando cálculo on-the-fly.
- [ ] ADR registra estratégia escolhida.
- [ ] Discovery RN 25 atualizado com a estratégia final + intervalo de refresh, se aplicável.

**Risco se ignorado:**
KPI exibe contagem inconsistente com a realidade. Quebra promessa de UX. Pode gerar reclamação de auditoria/compliance.

**Estimativa de esforço:** M — 1 a 2 dias-pessoa.

---

## S2 — Modelagem da entidade Registro de Aprendizagem e Provedor no banco

**Origem:** Feature como um todo (atravessa todos os #R)

**Categoria:** Mudança estrutural de dados

**Pergunta:**
A entidade `LearningRecord` (que sustenta tudo nesta feature) será uma tabela nova no `primary` ou estenderá entidades existentes como `Event` / `EventParticipant`? E `LearningProvider` é uma tabela nova ou reusa algo?

**Contexto:**
Hoje no twyg-app o domínio 3 (Aprendizagem) gira em torno de `Event` (90 tabelas, model central). Registro externo (aluno cadastra certificado feito fora do Twygo) NÃO se encaixa bem em `Event` (que pressupõe conteúdo criado dentro da plataforma). Registro interno (gerado pelo LMS quando aluno conclui um Event) precisa de ligação com `EventParticipant`. Registro "Compartilhado" usa o mecanismo `SharedEvent` (existente).

**Hipótese inicial:**
- Tabela nova `learning_records` com colunas: `id`, `user_id`, `organization_id`, `provider_id`, `origin` (`internal|external|shared`), `status` (`emitted|expired|pending|rejected|replaced|in_progress`), `situacao_registro` (`approved|pending`), `content_title`, `experience_type`, `categories[]`, `workload_hours`, `progress_pct`, `start_date`, `end_date`, `validity_date`, `certificate_token`, timestamps + `acts_as_paranoid`.
- Internos criados via use case que insere uma linha em `learning_records` ligada ao `EventParticipant.id`.
- Tabela `learning_providers` nova: `id`, `organization_id`, `name`, `website_url`, `description`, `active`, timestamps.
- Histórico/trilha: tabela auxiliar `learning_record_events` com tipos `created|submitted|approved|rejected|expired|replaced` (em vez de campo serializado).

**Critério de done:**
- [ ] ADR define schema final + FKs + índices necessários pra KPI count, sort por data, busca por nome de pessoa.
- [ ] Migration draft validada com o time de back.
- [ ] Decisão sobre `replaced`: coluna no `learning_records.status` ou tabela auxiliar `learning_record_replacements`?
- [ ] Política de soft-delete confirmada.

**Risco se ignorado:**
Retrabalho na hora de unificar com `EventParticipant` ou inchaço do model `Event`. Queries do KPI ficam pesadas em orgs grandes.

**Estimativa de esforço:** L — 3 a 5 dias-pessoa.

---

## S3 — Filtragem silenciosa de registros de pessoas inativadas

**Origem:** #R27 / RN 96

**Categoria:** Estado legacy preservado

**Pergunta:**
Como remover do KPI count, da lista, da extração e de todas as ações relacionadas os registros pertencentes a pessoas inativadas/desligadas, garantindo consistência entre o número do card e as linhas visíveis?

**Contexto:**
Regra de produto (Max 2026-05-25): pessoas inativadas somem completamente. No twyg-app, `User` usa `acts_as_paranoid` (`deleted_at`), e há também conceito de "inativação" no vínculo com a org. Filtragem precisa ser consistente em todos os endpoints (`/stats`, `/list`, `/export`, `/bulk_actions`).

**Hipótese inicial:**
- Scope ActiveRecord `User.active_in_org(org_id)` aplicado em todas as queries do controller `LearningRecordsController` via concern ou helper.
- Critério: `User.deleted_at IS NULL` + status ativo no vínculo com a org.

**Critério de done:**
- [ ] ADR confirma critério único + ponto de aplicação.
- [ ] Testes de integração cobrem: admin aprova → user inativado → próxima query não traz o registro.
- [ ] Discovery RN 96 atualizado com regra final.

**Risco se ignorado:**
KPI count diverge da lista. Reclamação de operações de RH.

**Estimativa de esforço:** S — meio dia a 1 dia-pessoa.

---

## S4 — Lista de liderados diretos e política de refresh

**Origem:** #R26 / RN 95 + #R9 / RN 34

**Categoria:** Premissa não-validada

**Pergunta:**
Como obter a lista de "liderados diretos" do Líder e com que frequência ela é refrescada na sessão dele?

**Contexto:**
Twyg-app tem `OrganizationChartRole`/`OrganizationChartLevel` (estrutura organizacional rica). Quão completo está preenchido em clientes reais? Pode haver fallback necessário pra clientes sem chart completo (ex: campo `lideradoPor` no `User`). Max delegou frequência de refresh ao dev.

**Hipótese inicial:**
- Fonte: `OrganizationChartRole.subordinates` quando disponível; fallback `User.lideradoPor` quando chart vazio.
- Política: snapshot do login + invalidate manual em ações administrativas.

**Critério de done:**
- [ ] ADR define fonte primária + fallback + política de refresh.
- [ ] Discovery RN 95 atualizado.
- [ ] Documentação interna explica gap aceitável.

**Risco se ignorado:**
Líder vê KPI count "errado" depois que RH muda equipe. Aluno aparece na lista do Líder antigo.

**Estimativa de esforço:** S — 1 dia-pessoa.

---

## S5 — Coordenação back ↔ front para refresh imediato do KPI após ações

**Origem:** #R9 / RN 32

**Categoria:** Premissa não-validada

**Pergunta:**
Como back e front se coordenam pro KPI count atualizar no mesmo instante em que uma ação (Aprovar/Recusar/Editar/Excluir/Adicionar) é confirmada?

**Contexto:**
Max definiu que o número do card precisa atualizar imediatamente após cada ação, sem reload. Em ações em massa que processam N registros, refresh deve ocorrer uma única vez após o batch.

**Hipótese inicial:**
Refetch separado (`GET /api/v1/learning_records/stats`) disparado pelo front após cada ação confirmada. Mesmo endpoint reusado pelo carregamento inicial e pelo refresh pós-ação.

**Critério de done:**
- [ ] ADR define padrão.
- [ ] Endpoint `/stats` documentado com schema.
- [ ] Testes cobrem ação individual, ação em massa e concorrência entre admins.

**Risco se ignorado:**
Race conditions; ação em massa pode disparar N refetches.

**Estimativa de esforço:** S — 1 dia-pessoa.

---

## S6 — Estratégia de exclusão: soft vs hard delete

**Origem:** #R15 / RN 57

**Categoria:** Mudança estrutural de dados

**Pergunta:**
Excluir um registro de aprendizagem aplica soft-delete (`deleted_at`) ou hard-delete?

**Contexto:**
Twyg-app usa `acts_as_paranoid` em vários models (User, Event, Organization, etc.). Manter coerência sugere soft-delete. Mas registros são da operação cotidiana — preservar pra auditoria pode inflar tabela. RH pode querer "limpar definitivo" (ex: GDPR/LGPD).

**Hipótese inicial:**
Soft-delete (`acts_as_paranoid`) pra rastreabilidade. Endpoint `/learning_records/:id/permanent_destroy` separado, restrito a Admin, pra hard-delete sob demanda (com confirmação extra).

**Critério de done:**
- [ ] ADR registra estratégia + casos de uso pra hard-delete.
- [ ] Discovery RN 57 atualizado.
- [ ] Política de retenção: soft-delete dura indefinido ou tem TTL?

**Risco se ignorado:**
Reclamações de LGPD; tabela infla.

**Estimativa de esforço:** S — meio dia.

---

## S7 — Formatos, limites e storage das evidências

**Origem:** #R16 / RN 59

**Categoria:** Premissa não-validada (com integração externa potencial)

**Pergunta:**
Quais formatos de arquivo são aceitos como evidência, qual o limite por arquivo / por registro, e onde os arquivos são armazenados?

**Contexto:**
Hoje o protótipo aceita placeholder genérico — sem regra real. Em produção, twyg-app usa `Archive` (S3/Box/Vimeo/Bunny) pra anexos genéricos. Precisa decidir storage (S3? Bunny?), limites e tipos. Impacto: custo, segurança, UX (mensagens de erro).

**Hipótese inicial:**
- Tipos aceitos: PDF, JPG, PNG, DOCX, XLSX.
- Limite: 10 MB por arquivo, 10 arquivos por registro.
- Storage: S3 (mesmo do `Archive`).
- Geração de URL assinada com TTL pra download.

**Critério de done:**
- [ ] ADR define tipos + limites + storage + estratégia de URL assinada.
- [ ] Discovery RN 59 atualizado.
- [ ] Copy das mensagens de erro (arquivo grande demais, formato inválido).

**Risco se ignorado:**
Aceita arquivo grande/malicioso. Custo de storage indefinido.

**Estimativa de esforço:** S — 1 dia.

---

## S8 — Fila assíncrona da extração de dados e evidências

**Origem:** #R21 / RN 79

**Categoria:** Mudança estrutural + integração externa (e-mail)

**Pergunta:**
Como modelar a fila assíncrona da extração (CSV/PDF/ZIP), notificações ao user e expiração do pacote?

**Contexto:**
Decisão Max (§3 da spec): extração em massa NÃO acontece na hora — vira job, gera pacote e notifica via e-mail + sino. ZIP de evidências pode passar do limite de e-mail; nesse caso, só link.

**Hipótese inicial:**
- Job Sidekiq monta o pacote e salva em S3 com TTL 7 dias.
- Cria `NotificationHistory` quando termina (sino da TopBar).
- Envia e-mail via templates Devise — anexo se < 10 MB, senão só link de download.
- Pacotes expiram via job batch noturno (`PurgeExpiredExtractions`).

**Critério de done:**
- [ ] ADR define worker, schema do `Extraction` (tabela ou config?), tipo de notificação, TTL.
- [ ] Implementação cobre cancelamento (user inicia, fecha browser, pacote ainda gera) e re-download.
- [ ] Discovery RN 79 atualizado com TTL final.

**Risco se ignorado:**
Pacote some antes do user pegar. Custo de storage cresce sem limpeza.

**Estimativa de esforço:** M — 2 dias.

---

## S9 — Integração com IA para preenchimento automático

**Origem:** #R24 / RN 90

**Categoria:** Integração externa (modelo de IA) + premissa não-validada

**Pergunta:**
Qual `generation_type` do `AiConsumption` cobre o "preenchimento automático com IA" do registro? Qual o schema da resposta esperada do modelo?

**Contexto:**
Twyg-app tem 2 gerações de IA. Geração 2025 usa `AiConsumption` + `AiCreditConsumptionBreakdown` (TimescaleDB hypertable). Tipos atuais (`ai_agent_support`, `course_generation`, `ai_files_ingestor`, `organization_chart_generation`, `video_generation`) não cobrem exatamente "extrair Tipo + Categorias de um registro a partir de evidências".

**Hipótese inicial:**
- Adicionar novo `generation_type` ao enum: `learning_record_autofill`.
- Modelo recebe: lista de arquivos (PDF/JPG/PNG) anexados + URL do conteúdo (se houver).
- Modelo retorna: `{ experience_type: enum, categories: string[] }` com nível de confiança.
- Confiança < threshold → mostra resultado mas com flag pro user revisar.

**Critério de done:**
- [ ] ADR define `generation_type` + schema da request/response.
- [ ] Tratamento de erros do modelo (timeout, falha de OCR, baixa confiança).
- [ ] Custo por chamada documentado pra cobrança em `AiCreditConsumptionBreakdown`.

**Risco se ignorado:**
Feature de IA não funciona; custo de IA não rastreado direito.

**Estimativa de esforço:** M — 2 dias.

---

## S10 — Verificação de vínculo de provedor a registros

**Origem:** #R23 / RN 87

**Categoria:** Premissa não-validada

**Pergunta:**
A verificação de "provedor tem registros vinculados?" acontece on-demand (query no clique de Excluir) ou via contador denormalizado?

**Contexto:**
Org pequena: query on-demand é trivial. Org grande (centenas de provedores × milhares de registros): pode ser mais eficiente manter `learning_providers.records_count` denormalizado. Contador denorm adiciona invalidação em CREATE/DELETE de `LearningRecord`.

**Hipótese inicial:**
- Query on-demand (`COUNT(*) FROM learning_records WHERE provider_id = X`).
- Provedores ativos têm volume baixo o suficiente pra não justificar denormalização.
- Se virar problema, refatorar pra contador denorm depois.

**Critério de done:**
- [ ] ADR decide on-demand vs denorm.
- [ ] Se denorm: callback em `LearningRecord` after_create/after_destroy mantém o contador.

**Risco se ignorado:**
Query lenta no clique de Excluir em orgs grandes.

**Estimativa de esforço:** S — meio dia.

---

## S11 — Registro de origem "Compartilhado" e replicação entre organizações

**Origem:** #R28 / RN 98

**Categoria:** Integração externa (entre orgs) + estado legacy

**Pergunta:**
Como o registro "Compartilhado" é replicado entre orgs parceiras? Mudanças no original propagam pro destino?

**Contexto:**
Twyg-app tem `SharedEvent` pra duplicar Event entre orgs. Não está claro se `LearningRecord` reusa esse mecanismo ou se precisa de algo próprio. Decisões em aberto: replicação one-way ou two-way? Quem é dono do registro replicado (org receptora ou origem)? Quando o aluno muda de org parceira, registro continua?

**Hipótese inicial:**
- Reutilizar pattern do `SharedEvent`: replicação one-way da org origem pra org destino. Org receptora trata como read-only (não edita, não exclui).
- Mudanças no original NÃO propagam automaticamente — copy snapshot na hora do compartilhamento.
- Quando org origem é inativada, registros compartilhados na destino permanecem (preservação de histórico do aluno).

**Critério de done:**
- [ ] ADR define mecanismo de compartilhamento.
- [ ] Discovery RN 98 atualizado com regras finais.
- [ ] Política de propagação de updates.

**Risco se ignorado:**
Dois clientes parceiros podem ter visões divergentes do mesmo registro.

**Estimativa de esforço:** M — 2 dias.

---

## Resumo

| Spike | Origem | Categoria | Risco | Esforço |
|---|---|---|---|---|
| S1 | #R6 / RN 25 | Premissa não-validada (impacto estrutural) | Alto | M |
| S2 | Feature inteira | Mudança estrutural | Alto | L |
| S3 | #R27 / RN 96 | Estado legacy preservado | Médio | S |
| S4 | #R26 / RN 95 + #R9 / RN 34 | Premissa não-validada | Baixo | S |
| S5 | #R9 / RN 32 | Premissa não-validada | Médio | S |
| S6 | #R15 / RN 57 | Mudança estrutural | Médio | S |
| S7 | #R16 / RN 59 | Premissa não-validada | Médio | S |
| S8 | #R21 / RN 79 | Mudança estrutural + integração externa | Alto | M |
| S9 | #R24 / RN 90 | Integração externa + premissa não-validada | Médio | M |
| S10 | #R23 / RN 87 | Premissa não-validada | Baixo | S |
| S11 | #R28 / RN 98 | Integração externa + estado legacy | Médio | M |
