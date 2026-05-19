# Validações DB/MS Pendentes — Base de Conhecimento

> **Status**: fora do escopo da AT v1 (CONTRACT.md v1 só suporta
> `executor: playwright`). Estas 4 suítes são DB/MS puras — sem UI direta.
>
> **Fluxo manual** até V2: importar este documento no TestLink (como
> referência textual) ou executar manualmente. Quando `agent-db`
> e/ou roadmap V2 (validações secundárias via filesystem + CLI) entrar
> em ativo, estas suítes serão migradas para o MD canônico.
>
> **Gerado em**: 2026-05-19 a partir da planilha
> `QA-Base_de_Conhecimento.xlsx` (linhas 705-744).

---

## Suíte QA 2.3 — Indexação de Documentos (Files Ingestor)

**Domínio**: Microsserviço (`twygo-ai-files-ingestor`) + Vector store (Pinecone)
**RNs cobertos**: R6 (referenciado na planilha)
**Executor futuro (V2)**: `agent-db` (para validação Pinecone) ou Playwright + validação secundária via API

### Pré-condições
- Ambiente Stage configurado (`staging-base-de-conhecimento`)
- Feature flag `habilitar_base_de_conhecimento` ativa na organização do teste
- Repositório de teste cadastrado com pelo menos 1 documento já enviado (DOCX/PPTX/PDF/MP4/MP3 ≤ 50 MB)
- Acesso ao Pinecone (console ou API) com credenciais de leitura
- Acesso ao log do MS `twygo-ai-files-ingestor`

### TC1 — Consumer do MS processa documento enviado
**Prioridade**: critical
**Tipo**: db/ms

**Objetivo**: validar que o consumer do `twygo-ai-files-ingestor` consome a mensagem SQS e indexa o documento no Pinecone.

**Passos**:
1. Enviar documento PDF de teste para a fila SQS via upload no UI (suíte QA 2.2 já cobre)
2. Aguardar processamento do consumer (até 2 minutos)
3. Consultar logs do `twygo-ai-files-ingestor` filtrando pelo `resource_id` do documento
4. Validar que log contém entrada de processamento bem-sucedido
5. Consultar Pinecone (índice `knowledge-base`) buscando pelos metadados do documento (resource_id, organization_id)
6. Validar que vetor existe no índice com os metadados esperados

**Resultado esperado**:
- Logs do MS: linha contendo `"status": "indexed"` com `resource_id` correto
- Pinecone: vetor presente com `metadata.organization_id` = orgId do teste e `metadata.resource_id` = id do documento

### TC2 — Re-indexação ao editar documento
**Prioridade**: high
**Tipo**: db/ms

**Objetivo**: validar que editar/substituir um documento re-indexa o Pinecone com o conteúdo novo.

**Passos**:
1. Repositório com documento já indexado
2. Substituir o documento via UI (delete + upload do mesmo nome)
3. Aguardar processamento
4. Consultar Pinecone — o vetor antigo NÃO deve existir, o novo SIM

### TC3 — Exclusão de documento limpa Pinecone
**Prioridade**: high
**Tipo**: db/ms

**Objetivo**: validar que excluir um documento via UI remove o vetor correspondente do Pinecone.

**Passos**:
1. Documento existente no repositório e indexado no Pinecone
2. Excluir documento via UI
3. Aguardar processamento do consumer de exclusão
4. Consultar Pinecone — vetor não deve mais existir

---

## Suíte QA 2.5 — Indexação de Mídias (Files Ingestor)

**Domínio**: Microsserviço + Pinecone (igual QA 2.3, mas para mídias)
**RNs cobertos**: R8 (referenciado na planilha)
**Executor futuro (V2)**: `agent-db` ou Playwright + validação secundária

### Pré-condições
- Repositório de teste com pelo menos 1 mídia já enviada (JPG/JPEG/PNG ≤ 50 MB)
- Acesso ao Pinecone com credenciais de leitura
- Acesso ao log do `twygo-ai-files-ingestor` (consumer de mídias)

### TC1 — Consumer processa imagem enviada
**Prioridade**: critical
**Tipo**: db/ms

**Objetivo**: validar consumer de mídia + indexação Pinecone com metadados Vision AI.

**Passos**:
1. Enviar imagem PNG de teste via UI
2. Aguardar processamento (até 3 minutos — Vision AI tem latência maior que texto)
3. Consultar logs do `twygo-ai-files-ingestor` (handler de imagens)
4. Validar entrada de processamento bem-sucedido com `vision_metadata` populado
5. Consultar Pinecone — vetor presente com `metadata.content_type = "image"`

**Resultado esperado**:
- Log contém payload Vision AI processado
- Pinecone: vetor com metadados de imagem (resource_id, organization_id, content_type, alt_text se gerado)

### TC2 — Re-indexação ao substituir mídia
**Prioridade**: high
**Tipo**: db/ms

**Objetivo**: validar re-indexação após substituir mídia.

**Passos**:
1. Mídia já indexada
2. Substituir via UI
3. Aguardar
4. Pinecone: vetor antigo ausente, novo presente

### TC3 — Exclusão de mídia limpa Pinecone
**Prioridade**: high
**Tipo**: db/ms

**Objetivo**: idem TC3 de QA 2.3 mas para mídia.

---

## Suíte QA 3.1 — Banco histórico (HistoricBaseCron)

**Domínio**: Worker Rails (`HistoricBaseCron`) + tabelas MySQL Twygo
**RNs cobertos**: R36
**Executor futuro (V2)**: `agent-db` (validação direta no MySQL)

### Pré-condições
- Ambiente Stage configurado
- Organização de teste com dados de base de conhecimento cadastrados:
  - Repositórios em `knowledge_repositories`
  - Fontes/mídias em `knowledge_resources`
  - Registros históricos em `knowledge_resources_archives` (se aplicável)
- Acesso ao banco MySQL (leitura — `staging-base-de-conhecimento`)
- Worker `HistoricBaseCron` rodando ou capacidade de disparar manualmente

### TC1 — Worker exclui registros das 3 tabelas ao excluir organização
**Prioridade**: critical
**Tipo**: db

**Objetivo**: validar que o worker `HistoricBaseCron` exclui corretamente os dados das 3 tabelas envolvidas em base de conhecimento quando a organização é excluída.

**Passos**:
1. Confirmar que existem registros nas tabelas (consulta SQL):
   ```sql
   SELECT COUNT(*) FROM knowledge_repositories WHERE organization_id = :org_id;
   SELECT COUNT(*) FROM knowledge_resources WHERE organization_id = :org_id;
   SELECT COUNT(*) FROM knowledge_resources_archives WHERE organization_id = :org_id;
   ```
   Cada contagem deve ser > 0.
2. Marcar a organização para exclusão via Super Admin OU disparar worker manualmente
3. Aguardar conclusão do worker `HistoricBaseCron`
4. Re-rodar as 3 contagens
5. Validar que todas as 3 contagens são = 0

**Resultado esperado**:
- 0 registros remanescentes em `knowledge_repositories`, `knowledge_resources`, `knowledge_resources_archives` para a organização excluída
- Logs do worker contêm entrada de execução bem-sucedida com `deleted_count` correto

### TC2 — Worker NÃO afeta dados de outras organizações
**Prioridade**: critical
**Tipo**: db

**Objetivo**: validar isolamento — exclusão de uma org não afeta dados de outras.

**Passos**:
1. Existência de registros para 2 organizações (Org A e Org B)
2. Disparar worker excluindo apenas Org A
3. Validar:
   - 0 registros para Org A
   - Contagens preservadas para Org B

---

## Suíte QA 5.1 — Logs CRUD em base de conhecimento

**Domínio**: Tabela de auditoria/logs Twygo (provavelmente `logs` ou similar)
**RNs cobertos**: R41 (41.1, 41.2, 41.3)
**Executor futuro (V2)**: `agent-db`

### Pré-condições
- Ambiente Stage configurado
- Feature flag `habilitar_base_de_conhecimento` ativa
- Usuário Admin logado
- Acesso ao banco MySQL (leitura)

### TC1 — Log gerado ao criar repositório (R41.1)
**Prioridade**: critical
**Tipo**: db

**Objetivo**: validar que criação de repositório gera log de auditoria.

**Passos**:
1. Criar repositório via UI (suíte QA 2.1 cobre)
2. Consultar tabela de logs:
   ```sql
   SELECT * FROM logs
   WHERE resource_type = 'KnowledgeRepository'
     AND action = 'create'
     AND created_at >= :start_ts
   ORDER BY created_at DESC LIMIT 5;
   ```
3. Validar que log existe com `user_id` correto, `organization_id` correto, payload com snapshot do repositório

### TC2 — Log gerado ao editar repositório (R41.1)
**Prioridade**: high
**Tipo**: db

**Objetivo**: validar log de edição.

**Passos**: similar a TC1 mas com `action = 'update'`, validar `payload_before` e `payload_after`.

### TC3 — Log gerado ao excluir repositório (R41.1)
**Prioridade**: high
**Tipo**: db

**Objetivo**: validar log de exclusão.

### TC4 — Log gerado ao upload de fonte de conhecimento (R41.2)
**Prioridade**: high
**Tipo**: db

**Objetivo**: validar log de upload de documento.

**Passos**:
1. Upload de documento via UI (QA 2.2)
2. Consultar logs com `resource_type = 'KnowledgeResource'`, `action = 'create'`, `content_type IN ('document')`
3. Validar log presente com `resource_id`, `file_name`, `file_size`, `user_id`

### TC5 — Log gerado ao upload de recurso de mídia (R41.3)
**Prioridade**: high
**Tipo**: db

**Objetivo**: idem TC4 mas para mídia.

**Passos**:
1. Upload de mídia via UI (QA 2.4)
2. Consultar logs com `resource_type = 'KnowledgeResource'`, `action = 'create'`, `content_type IN ('image')`
3. Validar log presente

### TC6 — Log gerado ao excluir fonte/mídia (R41.2, R41.3)
**Prioridade**: medium
**Tipo**: db

**Objetivo**: validar log de exclusão de fontes/mídias.

---

## Resumo

| Suíte | Total TCs | Prioridade alta+ | Domínio | Quando rodar |
|---|---|---|---|---|
| QA 2.3 — Indexação Documentos | 3 | 3 | MS + Pinecone | Após QA 2.2 |
| QA 2.5 — Indexação Mídias | 3 | 3 | MS + Pinecone | Após QA 2.4 |
| QA 3.1 — Banco histórico | 2 | 2 | MySQL + Worker | Após criação de dados |
| QA 5.1 — Logs | 6 | 4 | MySQL | Após cada CRUD |

**Total**: 14 TCs DB/MS pendentes de execução manual ou V2.

## Próximos passos

1. **Execução manual**: QA importa este documento no TestLink (criação manual de testcases) ou usa como referência durante validação manual
2. **V2 do CONTRACT (roadmap)**: quando `agent-db` estiver standalone, migrar estas suítes para MD canônico com `executor: db`
3. **V2 alternativo — validações secundárias**: TCs UI das suítes QA 2.2/2.4 podem ganhar bloco de "validação secundária via agent-db" no MD canônico, validando indexação imediatamente após upload
