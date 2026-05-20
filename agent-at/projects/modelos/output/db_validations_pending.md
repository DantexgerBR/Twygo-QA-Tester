# Validações DB/MS Pendentes — Modelos de conteúdo

> **Status**: fora do escopo da AT v1 (CONTRACT.md v1 só suporta
> `executor: playwright`). Estas 2 suítes são DB/MS — sem UI direta.
>
> **Fluxo manual** até V2: importar este documento no TestLink (como
> referência textual) ou executar manualmente.
>
> **Gerado em**: 2026-05-20 a partir da planilha
> `Quebra de atividades - QA - Modelos.xlsx`.

---

## Suíte QA 1.8 — Indexação de Designs (Vector DB)

**Domínio**: Microsserviço de ingestão + Vector store (Pinecone)
**Relacionado a**: Dev 1.8 e 1.10
**Referência**: discovery seção 5.5 (Fluxo de sincronização de um template)
**Executor futuro (V2)**: `agent-db` (para validação Pinecone) ou Playwright + validação secundária via API

### Pré-condições
- Ambiente Stage configurado (`staging-base-de-conhecimento`)
- Feature flag `modelos_de_conteudo` ativa na organização do teste
- Modelo de conteúdo criado com pelo menos 1 design Página e 1 design Aula
- Acesso ao Pinecone (console ou API) com credenciais de leitura
- Acesso aos logs do microsserviço de ingestão

### TC1 — Criação de design dispara sincronização Pinecone
**Prioridade**: critical
**Tipo**: db/ms

**Objetivo**: validar que criar um design (página ou aula) dispara mensagem na fila SQS e indexa no Pinecone.

**Passos**:
1. Criar um novo design de página via UI no modelo de teste
2. Aguardar processamento do consumer (até 2 minutos)
3. Consultar logs do microsserviço de ingestão filtrando pelo `template_design_id`
4. Validar que log contém entrada de processamento com `operation_type = "create"`
5. Consultar Pinecone (índice apropriado) buscando pelos metadados (template_design_id, organization_id)
6. Validar que vetor existe com metadados esperados

**Resultado esperado**:
- Logs do MS: linha contendo `"status": "indexed"` com `template_design_id` correto
- Pinecone: vetor presente com `metadata.organization_id` = orgId do teste, `metadata.template_design_id` correto e `metadata.operation_type = "create"`

### TC2 — Edição de design re-indexa Pinecone
**Prioridade**: high
**Tipo**: db/ms

**Objetivo**: validar que editar design atualiza o vetor no Pinecone com nova versão.

**Passos**:
1. Design já indexado no Pinecone
2. Editar título/instruções/conteúdo do design via UI e salvar
3. Aguardar processamento
4. Consultar Pinecone — vetor deve refletir o conteúdo atualizado (metadados ou conteúdo do vetor)

### TC3 — Exclusão de design remove do Pinecone
**Prioridade**: high
**Tipo**: db/ms

**Objetivo**: validar que excluir design via UI dispara remoção do Pinecone.

**Passos**:
1. Design existente no modelo e indexado no Pinecone
2. Excluir design via UI
3. Aguardar processamento do consumer de exclusão (`operation_type = "delete"`)
4. Consultar Pinecone — vetor não deve mais existir

### TC4 — Modelo excluído remove todos os designs do Pinecone
**Prioridade**: high
**Tipo**: db/ms

**Objetivo**: validar cascata de exclusão quando modelo é excluído.

**Passos**:
1. Modelo com múltiplos designs indexados
2. Excluir o modelo via UI (RN 6 ação Excluir)
3. Aguardar processamento
4. Pinecone: todos os vetores dos designs do modelo excluído devem ser removidos

---

## Suíte QA 4.1 — Transversais (Banco histórico + Trial + Logs)

**Domínio**: Tabelas Rails (banco histórico) + Worker `HistoricBaseCron` + Auditoria de logs
**Relacionado a**: Dev 4.1, 5.1 e 6.1
**Executor futuro (V2)**: `agent-db` (validação direta no MySQL)

> **OBS oficial da planilha**: "Aguardar Dev 6.1 documentar as tabelas e bancos impactados antes da execução."

### Pré-condições
- Ambiente Stage configurado
- Organização de teste com dados de modelos de conteúdo cadastrados:
  - Registros em `content_models`
  - Registros em `template_designs`
  - Registros em `page_activity_models`
- Acesso ao banco MySQL (leitura — `staging-base-de-conhecimento`)
- Worker `HistoricBaseCron` operacional
- Trial provisionada (1 por projeto) — ver skill `provisionar-trial-projeto-twygo`
- Acesso à tabela de logs do app

### TC1 — Banco histórico exclui 3 tabelas ao excluir organização
**Prioridade**: critical
**Tipo**: db
**RN coberto**: 44

**Objetivo**: validar que o worker `HistoricBaseCron` exclui registros das 3 tabelas envolvidas em modelos de conteúdo quando a organização é excluída.

**Passos**:
1. Confirmar que existem registros nas tabelas (consulta SQL):
   ```sql
   SELECT COUNT(*) FROM content_models WHERE organization_id = :org_id;
   SELECT COUNT(*) FROM template_designs WHERE content_template_id IN (
     SELECT id FROM content_models WHERE organization_id = :org_id
   );
   SELECT COUNT(*) FROM page_activity_models WHERE organization_id = :org_id;
   ```
   Cada contagem deve ser > 0.
2. Marcar a organização para exclusão via Super Admin OU disparar worker manualmente
3. Aguardar conclusão do worker `HistoricBaseCron`
4. Re-rodar as 3 contagens
5. Validar que todas as 3 contagens são = 0

**Resultado esperado**:
- 0 registros remanescentes em `content_models`, `template_designs`, `page_activity_models` para a organização excluída
- Logs do worker contêm entrada de execução bem-sucedida com `deleted_count` correto

### TC2 — Worker NÃO afeta dados de outras organizações
**Prioridade**: critical
**Tipo**: db
**RN coberto**: 44

**Objetivo**: validar isolamento de exclusão.

**Passos**:
1. Existência de registros para 2 organizações (Org A e Org B)
2. Disparar worker excluindo apenas Org A
3. Validar:
   - 0 registros para Org A
   - Contagens preservadas para Org B

### TC3 — Trial criada herda modelos de conteúdo da organização modelo
**Prioridade**: critical
**Tipo**: db
**RN coberto**: 45

**Objetivo**: validar que Trial recém-criada recebe cópia dos modelos da org modelo.

**Passos**:
1. Organização modelo possui modelos de conteúdo cadastrados
2. Criar Trial via URL/API (playbook `provisionar-trial-projeto-twygo`)
3. Consultar tabelas na Trial:
   ```sql
   SELECT COUNT(*) FROM content_models WHERE organization_id = :trial_org_id;
   SELECT COUNT(*) FROM template_designs WHERE content_template_id IN (
     SELECT id FROM content_models WHERE organization_id = :trial_org_id
   );
   ```
4. Validar que as contagens correspondem aos modelos da organização modelo

### TC4 — Exclusão total via Sophia remove modelos da Trial
**Prioridade**: high
**Tipo**: db
**RN coberto**: 46

**Objetivo**: validar exclusão de modelos na exclusão total da Sophia.

**Passos**:
1. Trial com modelos copiados da organização modelo
2. Executar exclusão total via widget Sophia (skill `testar-exclusao-dados-trial-twygo`)
3. Aguardar processamento
4. Consultar tabelas na Trial — contagens de `content_models` e `template_designs` devem ser 0

### TC5 — Log gerado ao criar modelo de conteúdo
**Prioridade**: critical
**Tipo**: db
**RN coberto**: 47.1

**Objetivo**: validar log de auditoria para criação de modelo.

**Passos**:
1. Criar modelo via UI (suíte QA 1.1 cobre)
2. Consultar tabela de logs:
   ```sql
   SELECT * FROM logs
   WHERE resource_type = 'ContentTemplate'
     AND action = 'create'
     AND created_at >= :start_ts
   ORDER BY created_at DESC LIMIT 5;
   ```
3. Validar log presente com `user_id`, `organization_id` e payload do modelo

### TC6 — Log gerado ao editar modelo de conteúdo
**Prioridade**: high
**Tipo**: db
**RN coberto**: 47.1

**Objetivo**: validar log de edição (`action = 'update'`).

**Passos**: similar a TC5 mas validar `payload_before` e `payload_after`.

### TC7 — Log gerado ao excluir modelo de conteúdo
**Prioridade**: high
**Tipo**: db
**RN coberto**: 47.1

**Objetivo**: validar log de exclusão.

### TC8 — Log gerado ao criar design de modelo
**Prioridade**: high
**Tipo**: db
**RN coberto**: 47.2

**Objetivo**: validar log para CRUD de designs.

**Passos**:
1. Criar design de página ou aula via UI (suítes QA 1.6/1.7 cobrem)
2. Consultar logs com `resource_type = 'TemplateDesign'`, `action = 'create'`
3. Validar log presente com `template_id`, `template_design_id`, `user_id`

### TC9 — Log gerado ao duplicar modelo de conteúdo
**Prioridade**: medium
**Tipo**: db
**RN coberto**: 47.3

**Objetivo**: validar log de duplicação.

**Passos**:
1. Duplicar modelo via UI (suíte QA 2.2 cobre)
2. Consultar logs com `action = 'duplicate'` ou `action = 'create'` com flag `is_duplicate = true`
3. Validar log presente referenciando o modelo original (`source_template_id`)

---

## Resumo

| Suíte | Total TCs | Prioridade alta+ | Domínio | Quando rodar |
|---|---|---|---|---|
| QA 1.8 — Indexação Designs Vector DB | 4 | 4 | MS + Pinecone | Após QA 1.6/1.7 (criação de designs) |
| QA 4.1 — Banco histórico + Trial + Logs | 9 | 8 | MySQL + Worker + Sophia | Após criação de dados E aguardar Dev 6.1 documentar tabelas |

**Total**: 13 TCs DB/MS pendentes de execução manual ou V2.

## Próximos passos

1. **Aguardar Dev 6.1**: confirmar tabelas envolvidas e bancos impactados (observação oficial da planilha).
2. **Execução manual** até V2: QA importa este documento no TestLink (criação manual de testcases).
3. **V2 do CONTRACT (roadmap)**: quando `agent-db` estiver standalone, migrar para MD canônico com `executor: db`.
4. **V2 alternativo — validações secundárias**: TCs UI das suítes QA 1.6/1.7 podem ganhar bloco de "validação secundária via agent-db" no MD canônico, validando indexação Pinecone imediatamente após criação.
