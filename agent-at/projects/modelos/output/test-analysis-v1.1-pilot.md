---
contract_version: 1.1
at_version: 2
project: modelos
project_name: "Modelos de conteúdo"
generated_at: 2026-05-22T11:00:00Z
source_docs:
  - "docs/[Especificação de Requisitos] Modelos de conteúdo – v02 06.04.2026.docx"
  - "docs/Quebra de atividades - DEV - Modelos de conteúdo.xlsx"
  - "docs/Quebra de atividades - QA - Modelos.xlsx"
env: staging-base-de-conhecimento
env_secondary: null
prototypeUrl: https://prototipo-base-de-conhecimento-ge2y9l6c2.vercel.app
totals:
  suites: 5
  test_cases: 20
  steps: 60
---

# Análise de Teste — Modelos de conteúdo (PILOTO v1.1)

> **Piloto v1.1 — 5 suítes representativas** (subset das 16 da AT v1.0).
> Demonstra as 5 mudanças vinculantes de CONTRACT.md §15:
> - **RNs cobertas** explícitas por TC
> - **Validation matrix** data-driven para cobertura ampla de cenários negativos
> - Playbook `preview-visual` em suíte com previews
> - Playbook `plate-editor` em suíte do editor
> - TC combinatório obrigatório em suíte com `filtro-drawer`
>
> AT v1.0 original (16 suítes) preservada em `test-analysis.md` desta pasta.

## Dados de teste

### Organizações (chaves simbólicas)
- `org: principal` — default

### Recursos para criação (worker-isolated)
- `modeloNameFormat`: "Modelo TC{n} w{workerIndex}-{timestamp}"

### Limites de campos
- `nomeMaxLength`: 255
- `descricaoMaxLength`: 500

## Textos literais

### Toast — sucesso
- "Modelo de conteúdo duplicado com sucesso."

### Tooltips (literais da Especificação)
- Kit de marca: "Define a identidade visual aplicada ao conteúdo gerado pela IA"
- Switch Usar como modelo padrão: "Se marcado, este modelo será usado prioritariamente pela IA quando não houver uma escolha específica"
- Ícone alerta listagem/card: "Este modelo possui designs pendentes de regeração. Acesse a aba design e clique no botão 'Regerar designs'."

## Modais relevantes

### "Confirmar exclusão de modelo"
- **Header**: "Confirmar exclusão"
- **Botões**: "Cancelar" / "Excluir"

### "Preview de Modelo" (carrossel)
- **Quando aparece**: ao clicar Preview em card de modelo
- **Conteúdo por item**: Nome modelo / Thumb / Nome design / Tipo / Prompt / Indicador "Design X de Y"

## Endpoints (referência)

| Método | URL | Operação |
|---|---|---|
| `GET` | `/api/v1/o/:org_id/content_templates` | Listar |
| `POST` | `/api/v1/o/:org_id/content_templates` | Criar |
| `PATCH` | `/api/v1/o/:org_id/content_templates/:id` | Editar |

## Campos e validações

| Aba | Campo | Tipo | Obrigatório | Limite | Default |
|---|---|---|---|---|---|
| Identificação | Nome | input texto | Sim | 255 | — |
| Identificação | Descrição | textarea | Não | 500 | — |
| Identificação | Kit de marca | select | Não | — | — |
| Design Página | Nome | input texto | Sim | 255 | — |
| Design Página | Tipo | select | Não | — | — |
| Design Página | Instruções estrutura IA | textarea | Sim | 500 | — |
| Design Página | Sequência | input numérico | Sim | — | — |

---

---
suite: Listagem e Menu de Modelos
executor: playwright
org: principal
playbooks: [filtro-drawer, flipper, cleanup-dados, toast-chakra, preview-visual]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa na organização do teste
  - Pelo menos 2 modelos cadastrados
  - Usuário logado como Admin
---

# Listagem e Menu de Modelos

## TC1 — Acessar listagem via submenu Aprendizagem
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [1, 1.1]

### Objetivo
Validar acesso à listagem via menu lateral, conforme RN 1 e RN 1.1.

### Passos
1. Acessar a URL "/play"
   → Dashboard padrão é exibido contendo o menu lateral.
2. Clicar no menu lateral "Aprendizagem"
   → Submenu lateral é exibido contendo o item "Modelos de conteúdo" com ícone Material "browse".
3. Clicar no submenu "Modelos de conteúdo"
   → Sistema redireciona para a listagem e exibe breadcrumb "Aprendizagem > Modelos de conteúdo".

## TC2 — Card exibe thumb carregada corretamente
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [5, 5.1]

### Objetivo
Validar que a imagem principal do card carrega visualmente (não apenas elemento DOM visível). Endereça Bug 3 do exploratório de Modelos.

### Passos
1. Acessar a listagem de modelos em formato Cards
   → Listagem exibe cards com imagem principal em cada um.
2. Aguardar a imagem principal do primeiro card carregar
   → Imagem do card está exibida com `naturalWidth > 0` e HTTP 200 (validar via `expectImageLoaded`).

## TC3 — Indicador de alerta no card quando designs pendentes
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [4.2, 5.1]

### Objetivo
Validar ícone de alerta + tooltip literal quando designs estão pendentes de regeração.

### Passos
1. Acessar a listagem de modelos em formato Cards
   → Listagem é exibida com o modelo que tem designs pendentes.
2. Aguardar o ícone de alerta ser exibido no card
   → Ícone de alerta é exibido no canto superior direito do card.
3. Aguardar a tooltip do ícone ser exibida ao posicionar o mouse
   → Tooltip exibida: "Este modelo possui designs pendentes de regeração. Acesse a aba design e clique no botão 'Regerar designs'.".

## TC4 — Alternar entre visualização Cards e Lista
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [2, 3]

### Objetivo
Validar alternância entre Cards (default) e Lista.

### Passos
1. Acessar a URL "/o/{orgId}/content_templates"
   → Listagem é exibida em formato Cards por padrão.
2. Clicar no botão de alternância para visualização "Lista"
   → Listagem alterna para formato Lista exibindo colunas: "Nome", "Descrição", "Nome do provedor", "Designs", "Aplicação", "Situação", "Ações".

---

---
suite: Filtros e Busca - Modelos
executor: playwright
org: principal
playbooks: [filtro-drawer, flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Pelo menos 4 modelos cadastrados (ativos, inativos, próprios, terceiros)
  - Usuário logado como Admin
---

# Filtros e Busca - Modelos

## TC1 — Buscar modelo por nome
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [2]

### Objetivo
Validar busca textual por nome do modelo.

### Passos
1. Acessar a URL "/o/{orgId}/content_templates"
   → Listagem é exibida com múltiplos modelos.
2. Preencher o campo "Buscar" com "Modelo TC1"
   → Listagem filtra exibindo apenas modelos cujo nome contém "Modelo TC1".

## TC2 — Filtrar modelos por Situação
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [60, 60.3]

### Objetivo
Validar filtragem por Situação via drawer.

### Passos
1. Clicar no botão "Filtrar"
   → Drawer "Filtros" é exibido à direita.
2. Selecionar a opção "Ativo" no filtro "Situação"
   → Filtro "Situação" exibe a opção "Ativo" selecionada.
3. Aplicar o filtro
   → Drawer fecha. Listagem exibe apenas modelos com Situação "Ativo".

## TC3 — Combinatória: 2 filtros + busca textual simultâneos
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [60, 60.2, 60.3, 62]

### Objetivo
Validar combinação de múltiplos filtros (Aplicação + Situação) com busca textual simultânea. Endereça Bug 5 do exploratório de Modelos (filtros combinatórios falharam).

### Passos
1. Clicar no botão "Filtrar"
   → Drawer "Filtros" é exibido.
2. Filtrar por "Aplicação" selecionando uma opção disponível
   → Filtro "Aplicação" fica selecionado com a opção escolhida.
3. Filtrar por "Situação" selecionando "Ativo"
   → Filtro "Situação" fica marcado em "Ativo".
4. Aplicar os filtros combinados
   → Drawer fecha. Listagem aplica os 2 filtros combinados.
5. Preencher o campo "Buscar" com "Modelo"
   → Listagem combina os 2 filtros aplicados COM a busca textual e exibe apenas modelos cuja Aplicação + Situação + Nome bate todos os critérios.

## TC4 — Limpar filtros aplicados
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [62]

### Objetivo
Validar limpeza dos filtros.

### Passos
1. Aplicar o filtro padrão "Modelos ativos"
   → Listagem é filtrada exibindo apenas modelos ativos.
2. Clicar no botão "Limpar filtros"
   → Listagem volta a exibir todos os modelos cadastrados sem filtros.

---

---
suite: Criação de Modelo - Aba Identificação
executor: playwright
org: principal
playbooks: [beforeunload, cleanup-dados, flipper, toast-chakra, switch-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Pelo menos 1 kit de marca cadastrado
  - Usuário logado como Admin
---

# Criação de Modelo - Aba Identificação

## TC1 — Criar modelo com dados válidos (happy path)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [7, 8]

### Objetivo
Validar criação de modelo preenchendo todos os campos da aba Identificação.

### Passos
1. Acessar a URL "/o/{orgId}/content_templates"
   → Listagem é exibida.
2. Clicar no botão "+ Adicionar"
   → Sistema redireciona para a tela de criação exibindo a aba "Identificação".
3. Preencher o campo "Nome" com "Modelo TC1 w{workerIndex}-{timestamp}"
   → Campo "Nome" exibe o texto digitado.
4. Preencher o campo "Descrição" com "Modelo de teste automatizado"
   → Campo "Descrição" exibe o texto digitado.
5. Selecionar o kit de marca disponível no dropdown "Kit de marca"
   → Dropdown exibe a opção selecionada.
6. Clicar no botão "Salvar"
   → Toast de sucesso é exibida.

## TC2 — Validações do campo "Nome" (matriz data-driven)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [8]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Vazio | A | "" | Erro "Nome é obrigatório" + foco no campo |
| Só espaços | A | "   " | Erro "Nome é obrigatório" |
| 1 char | B | "X" | Aceito |
| 254 chars | B | "X" repetido 254x | Aceito |
| 255 chars (limite) | B | "X" repetido 255x | Aceito |
| 256 chars (estouro) | B | "X" repetido 256x | Truncado a 255 OU erro |
| Emoji | C | "🎓 Modelo IA" | Aceito (não quebra encoding) |
| Acento | C | "Modelo de Ações" | Aceito |
| Script tag | D | "<script>alert(1)</script>" | Sanitizado (sem alert real) |
| SQL injection | D | "'; DROP TABLE--" | Salvo escapado |

### Objetivo
Validar matriz completa de entradas no campo "Nome" — cobertura de categorias A, B, C, D conforme `cenarios-negativos-twygo`. Endereça Bug 1 do exploratório de Modelos (validações de obrigatórios sub-cobertas).

### Passos
1. Acessar a tela de criação de modelo
   → Aba "Identificação" é exibida.
2. Para cada linha da Validation matrix, preencher o campo "Nome" com o `<input>` e clicar "Salvar"
   → Comportamento bate com o `<esperado>` da matriz.

## TC3 — Validações do campo "Descrição" (matriz data-driven)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [8]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| 0 chars (vazio) | B | "" | Aceito (não obrigatório) |
| 499 chars | B | "X" repetido 499x | Aceito |
| 500 chars (limite) | B | "X" repetido 500x | Aceito |
| 501 chars (estouro) | B | "X" repetido 501x | Truncado a 500 OU erro |
| Emoji | C | "🎓 Descrição com emoji" | Aceito |
| Acento | C | "Descrição com Ações" | Aceito |
| Script tag | D | "<script>alert(1)</script>" | Sanitizado |

### Objetivo
Validar matriz de entradas na Descrição — boundary 500 chars + caracteres + injection.

### Passos
1. Acessar a tela de criação de modelo
   → Aba "Identificação" é exibida.
2. Para cada linha da Validation matrix, preencher o campo "Descrição" com o `<input>` e clicar "Salvar"
   → Comportamento bate com o `<esperado>` da matriz.

## TC4 — Defaults dos switches na criação
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [8]

### Objetivo
Validar valores default dos 3 switches da aba Identificação.

### Passos
1. Acessar a tela de criação de modelo
   → Aba "Identificação" é exibida com os switches renderizados.
2. Aguardar os switches serem renderizados
   → Switch "Usar como modelo padrão" exibido desativado, switch "Usar designs sugeridos" exibido ativado, switch "Ativo" exibido ativado.

## TC5 — Cancelar criação com alterações pendentes
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [beforeunload]
**RNs cobertas**: [8]

### Objetivo
Validar diálogo nativo de saída com alterações não salvas.

### Passos
1. Acessar a tela de criação de modelo
   → Aba "Identificação" é exibida.
2. Preencher o campo "Nome" com "Teste cancelamento"
   → Campo "Nome" exibe o texto digitado e o estado do form fica "sujo".
3. Clicar no botão "Cancelar"
   → Diálogo nativo do browser é exibido perguntando se o usuário deseja sair sem salvar.
4. Confirmar manter na página no diálogo
   → Usuário permanece na tela de criação com os dados preenchidos.

---

---
suite: Criação de Design de Página (Plate Editor)
executor: playwright
org: principal
playbooks: [plate-editor, cleanup-dados, flipper, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Modelo de teste cadastrado com kit de marca selecionado
  - Usuário logado como Admin
---

# Criação de Design de Página (Plate Editor)

## TC1 — Acessar criação de Página via menu Adicionar
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [30, 31, 32]

### Objetivo
Validar fluxo de criação de Página.

### Passos
1. Acessar a aba "Design" do modelo de teste
   → Aba "Design" exibe a listagem de designs.
2. Clicar no botão "Adicionar"
   → Menu suspenso é exibido com as opções "Aula" e "Página".
3. Clicar na opção "Página"
   → Sistema redireciona para a tela de criação de Página exibindo a aba "Identificação".

## TC2 — Auto-preenchimento ao selecionar tipo "Capa"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [33, 33.1]

### Objetivo
Validar auto-preenchimento das instruções ao selecionar tipo pré-definido "Capa".

### Passos
1. Acessar a tela de criação de Página com a aba "Identificação"
   → Aba "Identificação" é exibida.
2. Selecionar "Capa" no campo "Tipo"
   → Campo "Tipo" exibe "Capa" selecionado.
3. Aguardar o auto-preenchimento dos campos de instruções
   → Campo "Instruções de estrutura para a IA" é preenchido automaticamente com "Usar sempre como primeira parte de qualquer aula.".

## TC3 — Validações do campo "Nome" do design (matriz data-driven)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [33]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Vazio | A | "" | Erro "Nome é obrigatório" |
| 255 chars (limite) | B | "X" repetido 255x | Aceito |
| 256 chars (estouro) | B | "X" repetido 256x | Truncado OU erro |
| Acento | C | "Capa de Aulação" | Aceito |
| Script tag | D | "<script>" | Sanitizado |

### Objetivo
Validar matriz de Nome — categorias A, B, C, D.

### Passos
1. Acessar a tela de criação de Página
   → Aba "Identificação" é exibida.
2. Para cada cenário da Validation matrix, preencher o campo "Nome" e tentar salvar
   → Comportamento bate com o `<esperado>` da matriz.

## TC4 — Plate Editor: inserir texto + persistência
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [35, 36, 37]

### Objetivo
Validar interação básica no Plate Editor (não tratar como caixa preta). Endereça Bug 4 do exploratório de Modelos.

### Passos
1. Salvar a aba "Identificação" da Página com dados válidos
   → Sistema redireciona automaticamente para a aba "Design" da Página.
2. Aguardar o Plate Editor ser hidratado (contenteditable="true")
   → Plate Editor é exibido em estado editável.
3. Preencher o editor com "Conteúdo da capa do curso"
   → Texto digitado é exibido no editor.
4. Clicar no botão "Salvar"
   → Sistema retorna para a aba "Design" do Modelo e listagem é atualizada com a nova Página.
5. Reabrir a Página criada na aba Design
   → Plate Editor exibe o conteúdo "Conteúdo da capa do curso" persistido.

## TC5 — Plate Editor: inserir espaço reservado para IA
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [36.4, 36.4.1, 36.4.2]

### Objetivo
Validar inserção de espaço reservado para IA + modal de prompt.

### Passos
1. Acessar a aba "Design" de uma Página em edição
   → Plate Editor é exibido em estado editável.
2. Clicar no botão de espaço reservado para IA na toolbar
   → Modal de prompt é exibido para inserir descrição.
3. Preencher o textarea de descrição com "Imagem que ilustre o tema da aula"
   → Textarea exibe o texto digitado.
4. Confirmar a inserção no modal
   → Modal fecha. Espaço reservado é inserido no editor com indicação visual.

## TC6 — Plate Editor: upload de imagem inválida
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [36]

### Objetivo
Validar rejeição de tipo inválido no upload do Plate Editor. Endereça Bug 4 do exploratório de Modelos (upload de tipos errados no platejs).

### Passos
1. Acessar a aba "Design" de uma Página em edição
   → Plate Editor é exibido.
2. Tentar fazer upload de arquivo "documento.exe" via componente de imagem
   → Sistema rejeita o arquivo exibindo mensagem específica indicando o tipo inválido. Arquivo NÃO é inserido no editor.

---

---
suite: Preview de Modelos e Designs
executor: playwright
org: principal
playbooks: [cleanup-dados, flipper, preview-visual]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `modelos_de_conteudo` ativa
  - Modelo de teste cadastrado com pelo menos 2 designs com previews gerados (1 Aula e 1 Página)
  - Usuário logado como Admin
---

# Preview de Modelos e Designs

## TC1 — Abrir Preview de Modelo via card + thumb carregado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [5.2]

### Objetivo
Validar abertura do modal carrossel + carregamento visual do thumb. Endereça Bug 3 do exploratório de Modelos (preview não carregava).

### Passos
1. Acessar a listagem de modelos em visualização Cards
   → Listagem é exibida.
2. Clicar na ação "Preview" do modelo de teste
   → Modal de preview é exibido com o carrossel.
3. Aguardar a thumb do primeiro design carregar no carrossel
   → Thumb é exibida com `naturalWidth > 0` (validar via `expectImageLoaded`).

## TC2 — Conteúdo de cada item do carrossel
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [5.2]

### Objetivo
Validar campos exibidos em cada slide do carrossel.

### Passos
1. Abrir o modal de Preview do modelo de teste
   → Modal exibe o primeiro slide do carrossel.
2. Aguardar a renderização do slide
   → Slide exibe: texto "Modelo: {nome do modelo}", Thumb do design carregado, texto "Design: {nome do design}", texto "Tipo: {Aula ou Página}", texto "Prompt: {prosa}", indicador "Design 1 de 2".

## TC3 — Navegar entre slides do carrossel
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [5.2]

### Objetivo
Validar navegação entre slides.

### Passos
1. Abrir o modal de Preview do modelo de teste
   → Modal exibe "Design 1 de 2" e a thumb do primeiro design.
2. Clicar no botão de navegação "Próximo" do carrossel
   → Modal exibe o slide seguinte com indicador "Design 2 de 2" e thumb do segundo design carregada.
