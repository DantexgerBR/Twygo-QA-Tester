# Exemplo de Input — Discovery simplificado

> Conteúdo fictício, apenas para ilustrar o formato esperado pelo agente.

## Projeto: Base de Conhecimento (IA) — Fase 01

### Objetivo

Permitir que organizações criem uma **Base de Conhecimento** alimentada por documentos, indexada por embeddings vetoriais, consumida pelo Agente de Atendimento da Twygo.

### Feature flag

`base_de_conhecimento_v1`

### Regras de Negócio

**RN 1** — O submenu "Base de Conhecimento" só é exibido quando a feature flag `base_de_conhecimento_v1` está habilitada para a organização.

**RN 2** — A listagem de bases exibe: Nome, Quantidade de documentos, Última atualização, Status (Ativo/Inativo).

**RN 2.1** — A listagem suporta filtros: por status e por intervalo de datas de atualização.

**RN 3** — O usuário Admin pode criar uma nova Base via botão "Adicionar base de conhecimento".

**RN 3.1** — O formulário de criação tem duas abas: "Identificação" (Nome, Descrição) e "Documentos" (upload de arquivos PDF/DOCX/TXT).

**RN 3.2** — Limite de 50MB por arquivo. Limite de 100 arquivos por base.

**RN 4** — Ao salvar uma base com documentos, o sistema dispara o worker `FilesIngestorJob` que indexa o conteúdo em um banco vetorial (Pinecone).

**RN 5** — Logs de cada indexação são gravados em `ai_indexing_logs` (organization_id, base_id, file_id, status, timestamp).

**RN 6** — Banco histórico: ao excluir uma organização, o worker `HistoricBaseCron` remove os registros relacionados em `ai_knowledge_bases`, `ai_documents` e `ai_indexing_logs`.

### Atividades de Dev (referência da planilha)

| Bloco | ID | Título | Esforço (h) |
|---|---|---|---|
| 1 | Dev 1.1 | [Listagem] Implementar listagem de bases de conhecimento | 8 |
| 1 | Dev 1.2 | [Listagem] Filtros por status e data | 4 |
| 2 | Dev 2.1 | [Cadastro] Criação da aba "Identificação" | 8 |
| 2 | Dev 2.2 | [Cadastro] Criação da aba "Documentos" | 12 |
| 2 | Dev 2.3 | [Cadastro] Indexação de Documentos (Files Ingestor) | 16 |
| 3 | Dev 3.1 | [Logs] Gravação de logs de indexação | 4 |
| 4 | Dev 4.1 | [Banco histórico] Worker HistoricBaseCron | 6 |
