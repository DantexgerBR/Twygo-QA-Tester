# Requisitos Extraídos — Base de Conhecimento

> Intermediário (consumido pelo `/generate-md-canonical`). Não é a saída final.
> Gerado em 2026-05-19 a partir de:
> - `docs/[Discovery] Meu base de conhecimento - v2.docx`
> - `docs/QA-Base_de_Conhecimento.xlsx`
> - `docs/Atividades_Base_de_Conhecimento_Complementada.xlsx`

## 1. Informações Gerais

- **Tipo de projeto**: UI + Backend (Rails) + Microserviço (twygo-ai-files-ingestor) + Vector store (Pinecone)
- **Objetivo**: Centralizar conteúdos institucionais, técnicos e multimídia para uso por IA na geração de cursos/aulas/questionários (RAG)
- **Feature flag**: `habilitar_base_de_conhecimento`
- **Perfis envolvidos**: Admin (criação/edição de repositórios)
- **Módulo/Menu afetado**: `Aprendizagem` → submenu `Base de conhecimento`
- **Componentes novos**: ListControl (listagem), formulário de criação/edição com abas, upload de arquivos (S3+SQS), banco vetorial (Pinecone)
- **Dispositivos suportados**: Desktop (assumido — sem menção explícita a mobile no Discovery)

## 2. Suítes de Teste (da planilha QA)

| # | Suíte | RNs cobertos | Categoria (v1) |
|---|---|---|---|
| 1 | QA 1.1 — Listagem Básica | 1, 2, 3, 4, 5, 6 | UI ✅ |
| 2 | QA 1.2 — Filtros e Busca | 7, 8, 9, 10 | UI ✅ |
| 3 | QA 1.3 — Extração de Dados | 37, 38 | UI ✅ |
| 4 | QA 2.1 — Criação de Repositório (Aba Identificação) | 11-16, 42, 43 | UI ✅ |
| 5 | QA 2.2 — Fontes de Conhecimento (Documentos) | 17-24, 34, 35, 39 | UI ✅ |
| 6 | QA 2.3 — Indexação Documentos (Files Ingestor) | R6 | DB/MS — fora v1 |
| 7 | QA 2.4 — Recursos de Mídia | 25-35 | UI ✅ |
| 8 | QA 2.5 — Indexação Mídias (Files Ingestor) | R8 | DB/MS — fora v1 |
| 9 | QA 3.1 — Banco histórico | 36 | DB — fora v1 |
| 10 | QA 4.1 — Trial | 39, 40 | UI (playbook `trial`) ✅ |
| 11 | QA 5.1 — Logs | 41 (41.1-41.3) | DB — fora v1 |
| 12 | QA x.x — Feature flag | — | UI (playbook `flipper`) ✅ |
| 13 | QA x.x — Ambientes adicionais | — | UI (playbook `ambientes-adicionais`) ✅ |

**Escopo da AT v1**: 9 suítes UI. As 4 suítes DB/MS vão para arquivo separado
(`db_validations_pending.md`) — fluxo manual via TestLink até V2 do CONTRACT.

## 3. Regras de Negócio (inferidas — sem catálogo explícito numerado no Discovery)

Os RNs numerados (1-43) são referenciados na planilha mas o texto integral
não foi extraído do Discovery (provavelmente vive na Spike obsoleta ou em
documento separado). Inferências baseadas no contexto da planilha:

**Listagem (RN 1-6)**:
- R1: Submenu `Base de conhecimento` dentro de `Aprendizagem`
- R2: Gated por feature flag `habilitar_base_de_conhecimento`
- R3: Listagem via componente `ListControl`
- R4: Colunas: Nome, Categoria, Classificação, Criado em, Atualizado em
- R5: Botões de ação por linha (Editar, Excluir) — *[REVISAR-FIGMA]*
- R6: Acesso só para Admin — *[REVISAR-FIGMA]*

**Filtros/Busca (RN 7-10)**:
- R7-10: Busca textual + filtros por Categoria/Classificação — *[REVISAR-FIGMA]*

**Extração (RN 37-38)**:
- R37-38: Botão "Exportar" gera arquivo com mesmas colunas da listagem — *[REVISAR-FIGMA]*

**Criação/Identificação (RN 11-16, 42-43)**:
- R11-16: Campos obrigatórios: Nome, Descrição, Categoria, Classificação — *[REVISAR-FIGMA]*
- R42-43: Comportamento Cancel/Save (provável beforeunload em dirty form)

**Fontes de Conhecimento (RN 17-24, 34, 35, 39)**:
- R17-24: Upload de arquivos via aba "Fontes de conhecimento" com ListControl
- Tipos aceitos: **DOCX, PPTX, PDF, MP4, MP3**
- Limite: **50 MB por arquivo**
- R34-35: Status de indexação (Pendente / Processando / Concluído / Erro) — *[REVISAR-FIGMA]*
- R39: Envio para fila SQS após upload

**Recursos de Mídia (RN 25-35)**:
- R25-33: Upload via aba "Recursos de mídia" com ListControl
- Tipos aceitos: **JPG, JPEG, PNG**
- Limite: **50 MB por arquivo**
- R34-35: Mesmas regras de status

**Banco histórico (RN 36)**:
- Tabelas excluídas pelo worker `HistoricBaseCron`:
  - `knowledge_repositories`
  - `knowledge_resources`
  - `knowledge_resources_archives`

**Trial (RN 39-40)**:
- Trial criada via URL ou API recebe cópia da base de conhecimento da org modelo
- Exclusão total na Sophia exclui informações de base de conhecimento

**Logs (RN 41)**:
- 41.1: Logs CRUD de repositórios
- 41.2: Logs CRUD de fontes de conhecimento
- 41.3: Logs CRUD de recursos de mídia

## 4. Textos Literais

> **GAP CRÍTICO**: o Discovery não tem catálogo de textos literais. Os
> textos abaixo são inferidos do padrão Twygo (ListControl + Chakra) e
> marcados `[REVISAR-FIGMA]` quando 100% inventados.

### Labels e botões — listagem (inferidos)
- Menu lateral: `Aprendizagem` → submenu `Base de conhecimento`
- Breadcrumb: `Aprendizagem > Base de conhecimento`
- Botão criar: `+ Adicionar` *[REVISAR-FIGMA]*
- Botão filtros: `Filtrar`
- Botão exportar: `Exportar` *[REVISAR-FIGMA]*
- Botão por linha: `Editar`, `Excluir` *[REVISAR-FIGMA]*

### Labels — formulário (Aba Identificação)
- Aba: `Identificação`
- Campo: `Nome` (obrigatório)
- Campo: `Descrição` (obrigatório)
- Campo: `Categoria` (obrigatório, dropdown) — *[REVISAR-FIGMA opções]*
- Campo: `Classificação` (obrigatório, dropdown) — *[REVISAR-FIGMA opções]*
- Botão: `Salvar`
- Botão: `Cancelar`

### Aba Fontes de Conhecimento (inferidos)
- Aba: `Fontes de conhecimento`
- Botão: `+ Adicionar fonte` *[REVISAR-FIGMA]*
- Texto upload: `Arraste arquivos ou clique para selecionar` *[REVISAR-FIGMA]*
- Formatos aceitos: `DOCX, PPTX, PDF, MP4, MP3 (até 50MB)`

### Aba Recursos de Mídia (inferidos)
- Aba: `Recursos de mídia`
- Botão: `+ Adicionar mídia` *[REVISAR-FIGMA]*
- Formatos aceitos: `JPG, JPEG, PNG (até 50MB)`

### Toasts (todos inferidos — *[REVISAR-FIGMA]*)
- Sucesso criação: `Repositório criado com sucesso`
- Sucesso edição: `Repositório atualizado com sucesso`
- Sucesso exclusão: `Repositório excluído com sucesso`
- Sucesso upload: `Arquivo enviado com sucesso`
- Erro upload tipo inválido: `Formato não suportado`
- Erro upload tamanho: `Arquivo excede 50MB`
- Erro validação: `<campo> é obrigatório`

### Modais (inferidos)
- `Confirmar exclusão` *[REVISAR-FIGMA]*: header + body "Deseja excluir o repositório <nome>?" + botões `Cancelar` / `Excluir`
- `Sair sem salvar` (beforeunload nativo): "Deseja sair sem salvar as alterações?"

## 5. Campos e Validações

| Campo | Tipo | Obrigatório | Limite | Observações |
|---|---|---|---|---|
| Nome | input texto | Sim | *[REVISAR-FIGMA]* | provavelmente 255 chars |
| Descrição | textarea | Sim | *[REVISAR-FIGMA]* | provavelmente 500 chars |
| Categoria | dropdown | Sim | — | opções *[REVISAR-FIGMA]* |
| Classificação | dropdown | Sim | — | opções *[REVISAR-FIGMA]* |
| Upload arquivo (Fontes) | file | Sim | 50MB | tipos: DOCX/PPTX/PDF/MP4/MP3 |
| Upload arquivo (Mídia) | file | Sim | 50MB | tipos: JPG/JPEG/PNG |

## 6. Endpoints de API (inferidos pela arquitetura)

> Padrão Rails Twygo: `/api/v1/o/:org_id/knowledge_repositories`. Textos
> abaixo são inferidos.

| Método | URL | Sucesso | Erro provável |
|---|---|---|---|
| `GET` | `/api/v1/o/:org_id/knowledge_repositories` | 200 (lista) | 401 / 403 |
| `POST` | `/api/v1/o/:org_id/knowledge_repositories` | 201 | 422 (validação) |
| `PATCH` | `/api/v1/o/:org_id/knowledge_repositories/:id` | 200 | 422 |
| `DELETE` | `/api/v1/o/:org_id/knowledge_repositories/:id` | 200 | 404 |
| `POST` | `/api/v1/o/:org_id/knowledge_repositories/:id/resources` | 201 (upload + SQS) | 422 (tipo/tamanho) |

## 7. Banco de Dados

### Tabelas envolvidas (inferidas pelo Discovery)
- `knowledge_repositories` — repositórios de conhecimento
- `knowledge_resources` — fontes e mídias (assets)
- `knowledge_resources_archives` — histórico/arquivamento

### Worker
- `HistoricBaseCron` — limpa as 3 tabelas acima quando org é excluída via Sophia

### Integração externa
- AWS S3 (storage de arquivos)
- AWS SQS (fila para o Files Ingestor)
- Pinecone (vector store após indexação)

## 8. Observações Adicionais

- **Discovery v2** focou em arquitetura técnica; UI/UX detalhada está no
  Figma protótipo (referenciado mas não acessível via WebFetch).
- **Recon ao vivo recomendado** antes da execução para validar textos
  literais reais vs inferidos.
- **Divergência protótipo vs Stage**: se durante execução for detectada
  divergência, tratar como **bug-produto** (não corrigir AT pra fazer
  passar — falar com Dev).
- **RNs 1-43 numeradas explicitamente apenas na planilha**; os textos
  integrais das RNs podem estar na Spike obsoleta mencionada no
  cabeçalho do Discovery (não consumida nesta análise).
- **Suítes DB/MS fora do v1**: QA 2.3, 2.5, 3.1, 5.1 vão para
  `db_validations_pending.md` — execução manual via TestLink até V2 do
  CONTRACT (quando agent-db estiver standalone).
