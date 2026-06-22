# Spike: Export em Massa de Anexos de Inscrições

---

## Checklist do Spike

- [x] Li a documentação oficial e analisei a UI.
- [x] Verifiquei limitações conhecidas.
- [x] Listei dependências externas (APIs, libs, infra) e abordei o motivo do uso.
- [x] Criei PoC mínima para validar libs, protótipos de componentes ou soluções para problemas mais críticos que ainda não há solução semelhante na aplicação.
- [x] Testei o fluxo crítico principal.
- [x] Validei edge cases importantes.
- [x] Listei riscos técnicos (futuros e atuais) e avaliei manutenção.

---

## Check de Impactos Padrão

- [x] Avaliar se a implementação impacta no ecossistema (compartilhamentos), trial e cópia de conteúdo.
- [ ] Avaliar se a implementação necessita de beta automático/manual, bem como feature flags e bloqueios de contrato.
- [x] Avaliar se a implementação necessita de novas tabelas de logs.
- [x] Avaliar se a implementação necessita de exclusão de banco histórico. Foi definido pela implementação do banco histórico que novas tabelas com registros relacionados à organização, de alguma forma, devem ter `organization_id`, salvo casos em que a tabela é compartilhada entre organizations.

---

## Objetivo

Exportar em massa os anexos de inscrições (certificados gerados pela plataforma e arquivos enviados por usuários) em um ou mais `.zip`. Para volumes grandes, o processamento ocorre em background e o admin é notificado por email e in-app quando o arquivo estiver pronto.

---

## Tópico 1: Opções Arquiteturais Avaliadas

### Contexto

Certificados são gerados pelo microserviço `certificate_exporter` (NestJS, monorepo `export-files-microservices`) via SQS e armazenados no S3. Não há export em massa hoje.

O mecanismo a implementar deve: receber a solicitação, baixar os arquivos do S3 via streaming, compactar em zip(s), fazer upload ao S3 e notificar o admin com Signed URL(s).

---

#### Opção 1: Sidekiq + Streaming S3→zip→S3

Job na fila `exports` (dedicada) dentro da infra Rails. O Sidekiq tem acesso direto ao banco, sem necessidade de manifest file, pois os argumentos ficam no Redis (sem limite de 256KB do SQS).

| | |
|---|---|
| **Prós** | Infra zero. Observabilidade (Datadog) já configurada. Retry e dead queue nativos. Menor prazo de entrega. |
| **Contras** | Concorrência limitada pelos workers disponíveis. Workers compartilhados com jobs críticos; fila exclusiva mitiga, mas aumenta custo de instâncias. |

Não é a melhor opção pelo risco de ocupar workers por longos períodos em exports grandes.

---

#### Opção 2: Lambda + Streaming S3→zip→S3

Rails publica no SQS → Lambda executa streaming S3→zip→S3 → publica resposta no SQS → Shoryuken consome e notifica o admin.

Como o SQS tem limite de 256KB por mensagem, o Rails gera um manifest JSON com as S3 keys e salva no S3. A mensagem SQS contém apenas `export_id` e `manifest_s3_key`. O Lambda lê o manifest diretamente do S3, sem precisar de acesso ao banco.

```json
{ "export_id": 123, "organization_id": 456, "manifest_s3_key": "exports/manifests/export_123.json" }
```

| | |
|---|---|
| **Prós** | Escala automática: N exports simultâneos = N Lambdas em paralelo. Isolado da aplicação. Deploy via `serverless.yml` já conhecido no monorepo. Paga apenas pelo uso. |
| **Contras** | Cold start. Timeout hard limit de 15 minutos. |

**Custo:** free tier permanente cobre ~6.600 exports/mês (512MB × 2min). O custo real é S3 e SQS, não o Lambda.

| Cenário | Custo estimado (ARM) |
|---|---|
| Até ~6.600 exports/mês | Gratuito |
| 10.000 exports/mês | ~$0,20/mês |
| 100.000 exports/mês | ~$2,00/mês |

**Complexidade:** média; requer configuração de IAM, SQS trigger e observabilidade.

**Risco de timeout:** estimativa baseada em ~75 MB/s de throughput de rede (Lambda 512MB):

| Cenário | Arquivos | Tamanho médio | Tempo estimado |
|---|---|---|---|
| Export médio | 500 | 3 MB | ~1,5 min |
| Export grande | 1.000 | 5 MB | ~3 min |
| Export muito grande | 3.000 | 5 MB | ~8 min |
| Export crítico | 5.000 | 10 MB | ~15-22 min (risco real) |

O risco só é real acima de ~3.000 arquivos ou com muitos anexos de evidência (até 10MB). **Mitigação:**

- **Opção A: Limite no produto:** máximo de arquivos por export (ex: 1.000). UI avisa e divide em múltiplas solicitações. Simples, sem lógica extra no backend.
- **Opção B: Auto-split por threshold:** Rails divide o manifest em lotes. Cada lote = uma mensagem SQS = um Lambda = um zip. Sem restrição visível ao usuário.

  ```
  5.000 arquivos → 5 lotes de 1.000 → 5 Lambdas em paralelo → 5 zips → 1 notificação com 5 links
  ```

  A notificação única é garantida pelo registro de export: o Shoryuken incrementa `parts_done` a cada Lambda que termina e só dispara email/in-app quando `parts_done == total_parts`. O incremento deve ser atômico (`UPDATE ... SET parts_done = parts_done + 1`) para evitar race condition.

---

#### Opção 3: Novo microserviço `file_exporter` no monorepo

Novo serviço NestJS no monorepo `export-files-microservices`, seguindo o padrão do `certificate_exporter`. Mesmo fluxo da Opção 2 (manifest S3 + SQS), mas sem timeout de 15 minutos.

| | |
|---|---|
| **Prós** | SQS, S3, IAM e deploy pipeline já configurados. Padrão NestJS + SQS consumer/producer já estabelecido. Sem timeout. Escalável de forma independente. |
| **Contras** | Mais um serviço para manter. Observabilidade precisa ser configurada para o novo serviço. |

O monorepo já possui `certificate_exporter` (AWS SDK S3/SQS, `@ssut/nestjs-sqs`, `serverless.yml`, IAM roles). Criar o `file_exporter` é replicar a estrutura com responsabilidade diferente.

**Custo:** equivalente ao `certificate_exporter`. **Complexidade:** baixa a média.

---

#### EFS (Elastic File System) como disco intermediário

Filesystem de rede (NFS) montado nos containers. Em vez de streaming, o worker baixa os arquivos para o EFS, compacta localmente e faz upload ao S3. Precisa ser combinado com Sidekiq ou Lambda.

| | |
|---|---|
| **Prós** | Sem pressão de memória. Persiste arquivos entre retries. |
| **Contras** | Infra adicional (VPC, mount targets, security groups). Não resolve o gargalo: o bottleneck é a transferência S3↔worker, que existe com ou sem EFS. Custo de armazenamento mesmo fora de uso. Requer limpeza dos arquivos temporários. |

Só vale a pena se já houver um EFS provisionado. O streaming S3→zip→S3 resolve o problema de memória sem I/O extra.

| Categoria | Preço |
|---|---|
| Armazenamento padrão (GB/mês) | USD 0,30 |
| Leituras (por GB transferido) | USD 0,03 |
| Gravações (por GB transferido) | USD 0,06 |

---

### Fluxo: Opção 1 (Sidekiq)

```
Admin aciona export
  → Rails consulta Archive pelas inscrições → cria registro Export (pending)
  → Enfileira job Sidekiq com lista de S3 keys (Redis, sem limite de tamanho)
  → Worker: streaming S3→zip→S3, registra failed_files
  → Atualiza Export (done) → email + notificação in-app com Signed URL(s)
```

### Fluxo: Opções 2 e 3 (Lambda / Microserviço)

```
Admin aciona export
  → Rails consulta Archive → cria registro Export (pending)
  → Gera manifest JSON → salva no S3
  → Publica no SQS: { export_id, manifest_s3_key }
  → Lambda/Microserviço: lê manifest → streaming S3→zip→S3 → registra failed_files
  → Publica resposta no SQS
  → Shoryuken: incrementa parts_done → se parts_done == total_parts:
      atualiza Export (done) → email + notificação in-app com todos os links
```

---

## Tópico 2: Onde ficam os arquivos hoje

- **Certificado atual:** `EventParticipant.certificate_id`
- **Certificados expirados:** `certificates.archive_id`
- **Anexos de evidência:** `event_participant_evidences.archive_id`

### Conteúdos compartilhados (mirror events)

Eventos podem ser espelhados (`shared_type = 1`). Participantes são inscritos no evento espelhado, não no original, e o certificado tem `event_id` do mirror. Para exportar certificados de um evento, é necessário incluir também os participants dos mirrors, caso contrário alunos de conteúdo compartilhado não aparecem.

O `event_student_service.rb` resolve isso com UNION no WHERE:

```sql
WHERE event_participants.event_id IN (
  SELECT id FROM (
    SELECT :event_id AS id
    UNION ALL
    SELECT e.id FROM events e WHERE e.shared_type = 1 AND e.original_event_id = :event_id
  ) AS combined_ids
)
```

O JOIN com certificados pega apenas o mais recente por participante:

```sql
LEFT JOIN (
  SELECT id, event_participant_id, archive_id
  FROM certificates c1
  WHERE id = (SELECT MAX(id) FROM certificates c2 WHERE c2.event_participant_id = c1.event_participant_id)
) latest_certificates ON latest_certificates.event_participant_id = event_participants.id
```

`latest_certificates.archive_id` aponta para o arquivo na tabela `archives` (onde está o `s3_key`).

| Arquivo | Papel |
|---|---|
| `lib/application/services/event_student_service.rb` | JOINs e WHEREs com lógica de mirror |
| `app/models/event.rb` | `find_event_id_shared()`, scope `child_shared_events` |
| `app/models/event_participant.rb` | Scopes `with_mirror_events`, `from_combined_events` |
| `lib/application/repository/certificate_repository.rb` | Queries de certificados por participante/organização |

---

## Tópico 3: Modelo de Dados

Nova tabela para controle dos exports:

| Campo             | Tipo     | Descrição                                                        |
| ----------------- | -------- | ---------------------------------------------------------------- |
| id                | integer  | PK                                                               |
| organization_id   | integer  | FK, obrigatório para banco histórico                             |
| user_id           | integer  | FK (admin que solicitou)                                         |
| status            | enum     | `pending`, `processing`, `done`, `failed`                        |
| total_files       | integer  | Total de arquivos selecionados                                   |
| total_parts       | integer  | Total de lotes (para auto-split)                                 |
| parts_done        | integer  | Lotes concluídos; notificação disparada quando `== total_parts`  |
| estimated_size_mb | decimal  | Tamanho estimado                                                 |
| zip_urls          | json     | Array de Signed URLs                                             |
| expires_at        | datetime | Validade dos links                                               |
| failed_files      | json     | Arquivos que falharam                                            |
| created_at        | datetime | —                                                                |
| finished_at       | datetime | —                                                                |

#### Decisões de negócio

| Decisão | Definição |
|---|---|
| Cancelamento | Não permitido |
| Falha parcial | Continua: erros registrados em `failed_files` e informados ao admin |
| Permissão | Somente admins |
| Notificação | Email + in-app ao concluir (única, com todos os links) |
| Formato | Zip (múltiplos se necessário) |
| Tamanho dos arquivos | Certificados: < 5MB / Anexos de usuário: até 10MB |

### Estrutura interna do zip

```
export_123.zip
  ├── joao_silva/
  │   ├── certificado.pdf
  │   └── evidencia_01.pdf
  ├── maria_santos/
  │   └── certificado.pdf
  └── export_errors.txt   ← gerado apenas se houver falhas
```

### Riscos técnicos

| Risco                                | Impacto                      | Mitigação                                                     |
| ------------------------------------ | ---------------------------- | ------------------------------------------------------------- |
| Exports de grande volume             | Alto consumo de memória      | Streaming S3→zip→S3                                           |
| Arquivo corrompido ou removido do S3 | Export parcialmente inválido | Registrar `failed_files`                                      |
| Signed URL expirada                  | Admin não consegue baixar    | TTL adequado + lifecycle policy. Depois gera nova exportação. |
| Zip muito grande para o browser      | Falha silenciosa             | Split em múltiplos zips                                       |
| Fila SQS sobrecarregada              | Delay no processamento       | Fila dedicada para exports                                    |
| Falha total do export                | Admin sem feedback           | Status `failed` + `error_message` visível na plataforma       |

---

## Tópico 4: PoC: Streaming S3→zip→S3

### Objetivo

Validar streaming S3→zip→S3 sem carregar todos os arquivos na memória. Risco técnico central de qualquer opção arquitetural, sem precedente na aplicação hoje.

### O que foi implementado

Use case em `app/application/use_cases/subscription_exports/streaming_zip_export_use_case.rb` usando `zip_kit` + `upload_stream`:

- Cada arquivo é baixado do S3 em chunks e escrito diretamente no zip
- O zip sobe ao S3 via multipart upload gerenciado pelo `upload_stream`
- RAM consumida: tamanho de um chunk, independente do número de arquivos
- Falhas são registradas em `failed_files` sem interromper o processo
- RAM é logada a cada arquivo via `Rails.logger.debug`

**Como rodar:**
```ruby
files = [
  { s3_key: "path/no/s3/cert.pdf", filename: "joao_silva/certificado.pdf" },
  { s3_key: "path/no/s3/anexo.pdf", filename: "maria_santos/anexo.pdf" }
]

result = Application::UseCases::SubscriptionExports::StreamingZipExportUseCase
           .new
           .execute(files: files, export_id: 1)
```

**O que observar:**
- `data[:failed_files]` lista arquivos que falharam
- Zip gerado em `exports/poc/export_<id>_<timestamp>.zip` no bucket

### Próximo passo: implementação no monorepo

A PoC em Ruby valida a abordagem. Para as Opções 2 (Lambda) e 3 (microserviço), o código de processamento precisa ser implementado em **Node.js/TypeScript** no monorepo `export-files-microservices`, seguindo o padrão do `certificate_exporter`.

Equivalentes Node.js para o streaming:
- `@aws-sdk/lib-storage` (classe `Upload`) no lugar do `upload_stream`
- `archiver` no lugar do `zip_kit` para geração do zip em stream

O Rails continua responsável por: consultar o banco, gerar o manifest, publicar no SQS e disparar a notificação ao admin via Shoryuken.

---

## Pontos em Aberto

| # | Questão | Impacto |
|---|---|---|
| 1 | Limite de tamanho por zip (threshold) | Define split logic e quantos links o admin recebe |
| 2 | TTL dos zips e manifests no S3 | Custo de armazenamento + lifecycle policy |
| 3 | Opção arquitetural final | Define stack, prazo e complexidade |
