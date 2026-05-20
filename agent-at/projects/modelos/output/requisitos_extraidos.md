# Requisitos Extraídos — Modelos de conteúdo

> Intermediário (consumido pelo `/generate-md-canonical`). Não é a saída final.
> Gerado em 2026-05-20 a partir de:
> - `docs/[Especificação de Requisitos] Modelos de conteúdo – v02 06.04.2026.docx`
> - `docs/Quebra de atividades - DEV - Modelos de conteúdo.xlsx`
> - `docs/Quebra de atividades - QA - Modelos.xlsx`

## 1. Informações Gerais

- **Tipo de projeto**: UI + Backend (Rails) + Vector DB + Microsserviço
- **Objetivo**: Permitir que organizações estruturem identidade de marca e modelos pedagógicos para que a IA gere cursos padronizados, governáveis e reutilizáveis
- **Feature flag**: `modelos_de_conteudo` (RN 1.2 da Especificação) — *atenção: planilha QA usa `habilitar_modelos_de_conteudos`; Especificação é fonte oficial*
- **Perfis envolvidos**: Admin
- **Módulo/Menu afetado**: `Aprendizagem` → submenu `Modelos de conteúdo` (com ícone Material `browse`)
- **Componentes novos**: ListControl com cards+lista, drag&drop reordenação, Plate Editor + customizações de kit de marca, editor de Aula + ferramentas customizadas (logo, espaços IA, cores/fontes kit), modal de preview com carrossel
- **Dispositivos suportados**: Desktop (inferido)
- **Protótipo**: https://prototipo-base-de-conhecimento-ge2y9l6c2.vercel.app (Vercel — cobre Base de Conhecimento + Modelos + Kit de marca)

## 2. Suítes de Teste (da planilha QA)

| # | Suíte | RNs cobertos | Categoria |
|---|---|---|---|
| QA 1.1 | Criação Modelo - Aba Identificação | 7, 8, 9 | UI |
| QA 1.2 | Criação Modelo - Aba Estilo do Conteúdo | 12, 13 | UI |
| QA 1.3 | Criação Modelo - Aba Estrutura do Conteúdo | 14-26, 53-56 | UI |
| QA 1.4 | Criação Modelo - Aba Imagem | 57.x | UI |
| QA 1.5 | Criação Modelo - Aba Áudio | 58.x | UI |
| QA 1.6 | Criação Design de Página (Plate Editor) | 32-37 | UI |
| QA 1.7 | Criação Design de Aula | 38-43 | UI |
| **QA 1.8** | **Indexação Designs (Vector DB)** | — | **DB/MS — fora v1** |
| QA 1.9 | Listagem e Menu (Modelos e Designs) | 1-6, 29-31, 44-46, 51 | UI |
| QA 2.1 | Filtros e Busca | 48-50, 60-62 | UI |
| QA 2.2 | Duplicar + Drag & Drop | 6.1, 63.x | UI |
| QA 2.3 | Preview de Modelos e Designs | 5.2, 51, 51.2 | UI |
| QA 3.1 | Sincronização e Regeração de Previews | 59.x | UI |
| QA 3.2 | Bloqueio Exclusão Cores Kit de Marca | 64 | UI |
| **QA 4.1** | **Transversais (Histórico + Trial + Logs)** | 44-47.x | **DB/UI misto — fora v1** |
| QA 7.1 | Feature Flag `modelos_de_conteudo` | — | UI |
| QA 7.2 | Ambientes Adicionais / Beta | — | UI |

**Escopo da AT v1**: 15 suítes UI. As 2 DB/MS (QA 1.8, 4.1) ficam em `db_validations_pending.md`.

## 3. Regras de Negócio (64 RNs)

### #R1 — Submenu (RN 1, 1.1, 1.2)
- Submenu "Modelos de conteúdo" dentro do menu "Aprendizagem"
- Ícone Material Icons: `browse`
- Visibilidade gated por feature flag `modelos_de_conteudo`

### #R2 — Listagem (RN 2, 3, 4, 4.1.*, 4.2)
- Componente ListControl com Campo de busca + Alternância Cards/Lista + Filtro + Botão "Adicionar"
- Default: visualização em **Cards**
- Colunas (visão lista): Nome / Descrição (max 50 chars + tooltip completo) / Nome do provedor / Designs / Aplicação / Situação (Switch) / Ações
- Indicador de alerta ao lado do nome quando design pendente de regeração (tooltip: *"Este modelo possui designs pendentes de regeração. Acesse a aba design e clique no botão 'Regerar designs'."*)

### #R3 — Cards (RN 5, 5.1, 5.2)
- Card contém: Imagem principal / Nome / Ações (List Control padrão) / Indicador de cor lateral (ativo/inativo)
- Ícone de alerta no canto superior direito quando design pendente (mesma tooltip do #R2)
- Ação Preview por card: modal com carrossel exibindo Nome do modelo / Thumb / Nome do design / Tipo (Aula/Página) / Prompt / Indicador "Design X de Y"
- Preview de página: opções de zoom com scroll

### #R19 — Filtros de modelos (RN 60, 61, 62)
- Filtros por coluna: Nome do provedor / Aplicação / Situação
- Filtros padrão: Modelos ativos / Modelos inativos / Modelos próprios / Modelos de terceiros

### #R4 — Criação Modelo (RN 7)
- Abas em ordem: Identificação / Estilo do conteúdo / Estrutura do conteúdo / Imagem / Áudio / Design / Compartilhar

### #R5 — Aba Identificação (RN 8, 9)

Campos:
| Campo | Tipo | Obrigatório | Default | Tooltip |
|---|---|---|---|---|
| Nome | input | Sim | — | — |
| Descrição | textarea (max 500) | — | — | — |
| Kit de marca | select | — | — | "Define a identidade visual aplicada ao conteúdo gerado pela IA" |
| Switch "Usar como modelo padrão" | switch | — | `false` | "Se marcado, este modelo será usado prioritariamente pela IA quando não houver uma escolha específica" |
| Switch "Usar designs sugeridos" | switch (só na criação) | — | `true` | "Quando ativo, a IA utilizará designs pré-definidos como sugestão ao gerar o conteúdo do curso" |
| Switch "Ativo" | switch | — | `true` | "Modelos inativos não serão utilizados pela IA" |

Badge (só na criação): *"Dica: Para um resultado mais rápido, recomendamos duplicar um modelo existente e editar a cópia ao invés de criar um do zero."*

### #R6 — Aba Estilo do conteúdo (RN 12, 13, 13.1)
- Botão "Adicionar mais dados" → menu com: Idade / Dificuldade / Tom de voz / Perfil do público / Idioma / Informações adicionais
- Comportamento dos campos: mesmo padrão do Estúdio de Criação

### #R7 — Aba Estrutura do conteúdo (RN 14-26, 53-56)

**Seção "Estrutura do conteúdo"**:
- Select "Tipo de estrutura" — tooltip: *"Define se o curso possui apenas atividades sequenciais ou se elas são organizadas em módulos."*
- Opções: `"Atividades sequenciais (1 nível)"` / `"Atividades agrupadas por módulos (2 níveis)"`
- Se 2 níveis: exibe campo "número de atividades por módulo" — tooltip: *"Número sugerido de atividades que a IA irá criar dentro de cada módulo do curso."*

**Seção "Estimativa de tamanho"**:
- Select obrigatório "Carga horária sugerida":
  - "Micro (30 segundos a 5 minutos)"
  - "Curto (5 a 15 minutos)"
  - "Médio (15 a 30 minutos)"
  - "Estendido (30 a 60 minutos)"
  - "Longo (1 a 2 horas)"
- Bloquear salvar sem seleção
- Campo "número de atividades" + "tipo de atividades" (idem Estúdio de Criação)

**Seção "Questionários ao longo do conteúdo"**:
- Tooltip: *"Configure questionários aplicados durante o curso, associados a atividades ou módulos."*
- Switch "Incluir questionários no conteúdo"
- Quando ativo: campos básicos do Estúdio + switch "Configurações avançadas" exibe campos adicionais

**Seção "Prova final"**:
- Tooltip: *"Avaliação aplicada ao final do curso, cobrindo todo o conteúdo."*
- Switch "Incluir prova final" (mesmo padrão dos questionários)

**Defaults (RN 54, 55, 56)**:
- Questionário criado como **não reutilizável**
- "Exibir perguntas aleatoriamente" marcado por padrão
- "Perguntas obrigatórias" é o único default checkado em comentários

### #R16 — Aba Imagem (RN 57.x)
- Título: *"Escolha o padrão de imagens para o modelo"*
- Subtítulo: *"Selecione como as imagens serão incluídas nos cursos gerados com este modelo. Cada opção oferece diferentes benefícios para a experiência de aprendizado."*
- Componente: mesmo do Estúdio de Criação
- Opções: Sem imagens (padrão) / Banco de imagens aberto / Gerador DALL-E (OpenAI) / Gerador Imagen 4 (Google)
- Default: **"Sem imagens, somente textos"**

### #R17 — Aba Áudio (RN 58.x)
- Título: *"Escolha a voz padrão para narrar as aulas"*
- Subtítulo: *"Selecione a voz que melhor se adequa ao tom deste modelo. Você pode ouvir uma amostra de cada voz antes de escolher."*
- Componente: mesmo do Estúdio de Criação
- Opções: Ana (default) / Cris / Carlos / Morgan
- Preview/ouvir amostra disponível por voz
- Default: **"Ana"**

### #R8 — Aba Design (RN 29-31, 51, 51.2)
- Listagem de todos os templates de design cadastrados no modelo
- Botão "Adicionar" → menu com opções: "Aula" / "Página"
- Ação Preview (ícone de olho) abre modal contendo:
  - Preview Aula: Nome do design / Preview do slide
  - Preview Página: Preview de imagem + Opção de zoom / Nome do design

### #R11 — Listagem na aba Design (RN 44-46, 63.x)
- ListControl com colunas: Nome / Formato / Tipo (Aula ou Página) / Ações
- Ações: Editar / Duplicar / Excluir
- Drag and drop para reordenação (cards e lista) — apenas na página atual
- Drag and drop **desabilitado** quando há filtro ativo
- Recálculo de sequência por página (RN 63.2): back-end mantém intervalo original da página

### #R15 — Filtros da aba Design (RN 48-50)
- Filtros por coluna: Tipo de parte / Formato
- Filtros padrão: Somente páginas / Somente aulas

### #R9 — Criação de Página (RN 32-37)

Abas: Identificação / Design

**Aba Identificação** — campos:
| Campo | Tipo | Obrigatório | Limite | Tooltip |
|---|---|---|---|---|
| Nome | input | Sim | 255 | — |
| Tipo | creatable select | Não | — | "Classifique este design por tipo de parte (ex: Capa, Corpo, Encerramento). Essa informação será utilizada para filtrar e organizar seus designs." |
| Instruções de estrutura para a IA | platejs (rich) | Sim | 500 | "Descreva em que momento e em qual contexto este design deve ser utilizado pela IA ao gerar o curso. Use os prompts sugeridos abaixo como ponto de partida e edite conforme necessário." |
| Instruções de conteúdo para a IA | platejs | Não | 500 | "Descreva como a IA deve estruturar e estilizar o conteúdo exibido neste design." |
| Sequência | numeric | Sim | — | "Defina em que posição este design deve aparecer na lista. Ex.: 1 = primeiro, 2 = segundo. Se essa posição já estiver ocupada, este design entra nela e os próximos descem automaticamente." |

**RN 33.1 — Tipos pré-definidos e auto-preenchimento**:
Opções: Capa / Introdução / Corpo / Encerramento / Recapitulação / Sumário
Ao selecionar, preenche automaticamente "Instruções de estrutura" e "Instruções de conteúdo" com textos canônicos (ver Especificação).

**RN 34**: Após salvar → redireciona automaticamente para aba "Design" da própria página.

**Aba Design** (RN 35-36.x, 37):
- Plate Editor padrão da plataforma
- Select de Kit de Marca (default: kit do modelo)
- RN 36.1.1: Ao trocar kit com menos cores, mapeia cores inexistentes para cor 1
- Color picker e seleção de fontes customizados com cores/fontes do kit
- Campo para seleção de Logo
- Campo de espaço reservado para IA → modal de prompt
- Cor default: primária do kit selecionado na Identificação
- Fonte default: primária do kit
- Ao salvar página: retorna para aba "Design" do Modelo com listagem atualizada

### #R10 — Criação de Aula (RN 38-43)
- Abas: Identificação (mesmos campos do RN 33) / Design
- Após salvar Identificação → redireciona para aba Design
- Editor de Aula padrão + customizações:
  - **RN 42.1**: Ferramenta de layout com seleção de kit (3 primeiros visíveis, scroll para demais; tooltip mostra descrição completa do kit; max 50 chars de descrição visíveis)
  - **RN 42.1.1**: Troca de kit mapeia cores inexistentes para cor 1
  - **RN 42.2-42.3**: Color picker e fontes do kit; cor default = primária do kit
  - **RN 42.4**: Ferramenta de logos do kit
  - **RN 42.5**: Ferramenta de espaços de IA (imagem ou texto) — textarea com tooltip *"Descreva o que deve ser exibido neste espaço. A IA usará esta descrição para gerar o conteúdo apropriado."*
  - **RN 42.6**: Cores de fundo do kit + padrões
- Ao salvar aula: retorna para aba "Design" do Modelo com listagem atualizada

### #R18 — Sincronização Kit de Marca x Modelos (RN 59.x)
- Quando kit alterado: ícone de alerta no card/listagem (ver R2/R3)
- Botão "Regerar todos" na aba Design — tooltip: *"O kit de marca foi alterado. Clique em 'Regerar todos' para atualizar todos os designs com as novas configurações de cores e fontes."*
- Ao clicar "Regerar todos":
  - Toast inicial: *"A regeração dos designs foi iniciada. Você será notificado quando for concluída."*
  - Processo assíncrono → notificação: *"Regerações concluídas — As regerações dos designs do modelo X foram concluídas."*
- Designs regerados com kit selecionado no modelo (por default)

### #R20 — Bloqueio Exclusão Cores Kit de Marca (RN 64)
- Bloquear exclusão de cor de um kit caso esse kit esteja em uso por algum modelo

### #R12 — Banco histórico (RN 44)
- Excluir todas as tabelas criadas nessa etapa quando organização é excluída

### #R13 — Trial (RN 45, 46)
- Cópia das informações de modelos de conteúdo para org Trial
- Exclusão das informações na exclusão pela Sophia

### #R14 — Logs (RN 47.x)
- Logs CRUD de modelos de conteúdo
- Logs CRUD de designs
- Log de duplicação de modelos

## 4. Textos Literais Catalogados

### Toast — sucesso
- "Modelo de conteúdo duplicado com sucesso." (RN 6.1)
- "A regeração dos designs foi iniciada. Você será notificado quando for concluída." (RN 59.4)
- "Regerações concluídas" / body: "As regerações dos designs do modelo X foram concluídas." (RN 59.2)

### Badge / Banner
- "Dica: Para um resultado mais rápido, recomendamos duplicar um modelo existente e editar a cópia ao invés de criar um do zero." (RN 9 — só na criação)

### Tooltips (literais)
- Kit de marca: *"Define a identidade visual aplicada ao conteúdo gerado pela IA"*
- Switch Usar como modelo padrão: *"Se marcado, este modelo será usado prioritariamente pela IA quando não houver uma escolha específica"*
- Switch Usar designs sugeridos: *"Quando ativo, a IA utilizará designs pré-definidos como sugestão ao gerar o conteúdo do curso"*
- Switch Ativo: *"Modelos inativos não serão utilizados pela IA"*
- Tipo de estrutura: *"Define se o curso possui apenas atividades sequenciais ou se elas são organizadas em módulos."*
- Atividades por módulo: *"Número sugerido de atividades que a IA irá criar dentro de cada módulo do curso."*
- Seção Questionários: *"Configure questionários aplicados durante o curso, associados a atividades ou módulos."*
- Seção Prova final: *"Avaliação aplicada ao final do curso, cobrindo todo o conteúdo."*
- Ícone alerta listagem/card: *"Este modelo possui designs pendentes de regeração. Acesse a aba design e clique no botão 'Regerar designs'."*
- Botão Regerar todos: *"O kit de marca foi alterado. Clique em 'Regerar todos' para atualizar todos os designs com as novas configurações de cores e fontes."*
- Campo Tipo do design: *"Classifique este design por tipo de parte (ex: Capa, Corpo, Encerramento). Essa informação será utilizada para filtrar e organizar seus designs."*
- Campo Instruções de estrutura: *"Descreva em que momento e em qual contexto este design deve ser utilizado pela IA ao gerar o curso. Use os prompts sugeridos abaixo como ponto de partida e edite conforme necessário."*
- Campo Instruções de conteúdo: *"Descreva como a IA deve estruturar e estilizar o conteúdo exibido neste design."*
- Campo Sequência: *"Defina em que posição este design deve aparecer na lista. Ex.: 1 = primeiro, 2 = segundo. Se essa posição já estiver ocupada, este design entra nela e os próximos descem automaticamente."*
- Campo Descrição IA (espaços): *"Descreva o que deve ser exibido neste espaço. A IA usará esta descrição para gerar o conteúdo apropriado."*

### Títulos de abas/seções
- "Identificação", "Estilo do conteúdo", "Estrutura do conteúdo", "Imagem", "Áudio", "Design", "Compartilhar"
- "Escolha o padrão de imagens para o modelo" (Aba Imagem)
- "Escolha a voz padrão para narrar as aulas" (Aba Áudio)

### Labels e botões
- Submenu: "Modelos de conteúdo" (ícone `browse`)
- Botão criação: "+ Adicionar" (REVISAR-FIGMA: confirmar prefixo)
- Botão "Filtrar"
- Botão "Regerar todos"
- Botões de menu Adicionar (aba Design): "Aula" / "Página"
- Botão "Adicionar mais dados" (aba Estilo)
- Switch "Configurações avançadas" (aba Estrutura)

## 5. Campos e Validações (consolidado)

| Aba | Campo | Tipo | Obrigatório | Limite | Default |
|---|---|---|---|---|---|
| Identificação | Nome | input | Sim | (REVISAR-FIGMA — provavelmente 255) | — |
| Identificação | Descrição | textarea | — | 500 | — |
| Identificação | Kit de marca | select | — | — | — |
| Identificação | Usar como modelo padrão | switch | — | — | false |
| Identificação | Usar designs sugeridos (só criação) | switch | — | — | true |
| Identificação | Ativo | switch | — | — | true |
| Estrutura | Tipo de estrutura | select | (REVISAR) | — | — |
| Estrutura | N. atividades por módulo (se 2 níveis) | numeric | (REVISAR) | — | — |
| Estrutura | Carga horária sugerida | select | Sim | — | — |
| Estrutura | Incluir questionários | switch | — | — | off |
| Estrutura | Incluir prova final | switch | — | — | off |
| Imagem | Padrão de imagens | radio/select | (REVISAR) | — | "Sem imagens, somente textos" |
| Áudio | Voz padrão | radio/select | (REVISAR) | — | "Ana" |
| Design > Página/Aula > Identificação | Nome | input | Sim | 255 | — |
| Design > Página/Aula > Identificação | Tipo | creatable select | Não | — | — |
| Design > Página/Aula > Identificação | Instruções de estrutura | platejs | Sim | 500 | — |
| Design > Página/Aula > Identificação | Instruções de conteúdo | platejs | Não | 500 | — |
| Design > Página/Aula > Identificação | Sequência | numeric | Sim | — | — |

## 6. Endpoints de API (inferidos pela arquitetura)

| Método | URL (inferido) | Operação |
|---|---|---|
| `GET` | `/api/v1/o/:org_id/content_templates` | Listar modelos |
| `POST` | `/api/v1/o/:org_id/content_templates` | Criar modelo |
| `PATCH` | `/api/v1/o/:org_id/content_templates/:id` | Editar modelo |
| `DELETE` | `/api/v1/o/:org_id/content_templates/:id` | Excluir modelo |
| `POST` | `/api/v1/o/:org_id/content_templates/:id/duplicate` | Duplicar modelo |
| `POST` | `/api/v1/o/:org_id/content_templates/:id/regenerate_designs` | Regerar designs (async) |
| `GET/POST/PATCH/DELETE` | `/api/v1/o/:org_id/content_templates/:id/template_designs` | CRUD designs |
| `PATCH` | `/api/v1/o/:org_id/content_templates/:id/template_designs/reorder` | Drag&drop sequência |

## 7. Banco de Dados

### Tabelas envolvidas (inferidas pelo Discovery/Spec)
- `content_templates` — modelos de conteúdo
- `template_designs` — designs (página/aula) do modelo
- `page_activity_models` — modelos de atividade de página (mencionado em QA 4.1)

### Worker
- `HistoricBaseCron` — limpa essas tabelas quando org é excluída via Sophia

### Integração externa
- AWS S3 (storage de imagens/thumbs)
- AWS SQS (fila de regeração de previews)
- Pinecone (vetor para designs — RN sobre indexação Vector DB)
- DALL-E (OpenAI) / Imagen 4 (Google) — geração de imagens conforme escolha do modelo

## 8. Observações Adicionais

- **Discrepância na feature flag**: Especificação RN 1.2 usa `modelos_de_conteudo`; planilha QA 7.1 usa `habilitar_modelos_de_conteudos`. **AT segue a Especificação** (`modelos_de_conteudo`).
- **Protótipo Vercel**: tem cobertura visual mas exige browser real para extração (recon não rodado nesta sessão — SPA pesada).
- **Plate Editor + editor de Aula são componentes reutilizados** do app, com customizações específicas (logos, espaços IA, cores/fontes do kit).
- **Drag and drop por página**: reordenação relativa ao menor `sequence` da página atual.
- **Duplicação é cópia profunda** (modelo + designs).
- **Suítes DB/MS fora do v1**: QA 1.8 (Indexação Vector DB) e QA 4.1 (Banco histórico + Trial + Logs) vão para `db_validations_pending.md`.
- **Tooltip da Descrição na visão lista**: tooltip exibe descrição completa (truncado em 50 chars na coluna).
