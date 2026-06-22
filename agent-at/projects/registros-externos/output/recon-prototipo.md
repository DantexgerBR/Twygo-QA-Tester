---
status: complete
skip_reason: null
prototype_url: http://localhost:5173/
host_handler: generic
captured_screens: 14
skipped_screens: 0
captured_at: 2026-06-03T19:45:00Z
---

# Recon Visual — Registros de Aprendizagem

> Protótipo local `claude-twygo-prototype` (Vite, http://localhost:5173/).
> Navegado live via playwright-mcp em 2026-06-03. Perfis: Administrador,
> Aluno, Aluno (Líder) — troca via dropdown de perfil na TopBar.

## 1. Hierarquia de navegação

- **Admin/Líder** (`LMSAdminShell`): sidebar "Dashboard, Biblioteca, Aprendizagem (Conteúdos, Compartilhamentos, **Registros** [badge "new"], Certificados), Usuários, Empresas, Comunidades, Configuração". Breadcrumb: "Aprendizagem > Registros". Tabs centralizadas: "Registros" (default) e "Provedores".
- **Aluno**: sidebar "Dashboard, Conteúdos, Play, Meus cursos, **Meu histórico**, Minhas trilhas, Catálogo de cursos, Equipe, Comunidades". Breadcrumb: "Meu histórico".
- TopBar (todos os perfis): toggle crédito de IA (sparkle) + chat (disabled) + sino de notificações + avatar/nome + dropdown de perfil ("Administrador" / "Aluno (Líder)" / "Aluno").
- Form Adicionar (admin): breadcrumb vira "Aprendizagem > Registros > Adicionar", header "Adicionar registro" + botão "Voltar".
- Form Avaliar: breadcrumb "... > Avaliar", header "Avaliar registro".

## 2. Textos literais por tela

### Listagem Admin/Líder (tab "Registros")
- KPI cards: "43" Emitidos / "12" Expirados / "2" Pendentes / "4" Recusados + label "Carga horária total: 1345 horas".
- Tooltips KPI (Admin — tom institucional):
  - Emitidos: "Registros com certificado emitido — formação aprovada ou documento aceito."
  - Expirados: "Registros cuja data de validade já passou — precisam de recertificação."
  - Pendentes: "Registros externos aguardando avaliação pelo Admin."
  - Recusados: "Registros externos que foram recusados na avaliação."
- Toolbar: "Adicionar" (roxo, ícone +) · "Ações em massa" (outline) · "Extrair dados" (outline, ícone upload) · busca "Pesquise aqui" · toggle Grid/Lista · "Filtro".
- Colunas default: Checkbox, Pessoa (avatar+nome+e-mail), Conteúdo, Origem (chip "Externo"/"Interno"/"Compartilhado"), Criado por, Provedor (header com tooltip "?"), Situação do registro (chip "Aprovado"/"Pendente"), Situação do certificado (chip "Emitido"/"Em andamento"/"—"), Carga horária ("40h"), Ações (3 pontos).
- Tooltip header "Provedor": "Instituição responsável pela formação. Pode ser o emissor de um certificado externo ou quem compartilhou o conteúdo."
- Paginação: textbox página + "de 4" + prev/next + select "25 por página" / "50 por página" / "100 por página".
- Com filtro aplicado: toolbar ganha "Editar filtro aplicado" (ícone) + "Limpar filtro".

### Listagem Aluno ("Meu histórico")
- Título: "Meu histórico". KPIs: "13" Emitidos / "5" Expirados / "2" Pendentes / "2" Recusados + "Carga horária total: 707 horas".
- KPI cards são `<button>` clicáveis: clicar em "Pendentes" eleva o card (translateY) e aplica `grayscale` nos outros 3; lista filtra.
- Toolbar: "Adicionar" + busca "Pesquise por nome, curso ou origem" + toggle Grid/Lista. **Botão "Filtro" NÃO presente** (divergência §6).
- Colunas: Tipo (chip "Curso"), Conteúdo, Origem, Provedor, Situação do registro, Progresso ("100%"), Situação do certificado, Emitido em, **"Expirado em"**, Ações.

### Form "Adicionar registro" (admin)
- Header: "Adicionar registro" + botão "Voltar".
- Campos (ordem real do protótipo): Pessoa* ("Selecione o colaborador") → Website ("http://website.com") → Comprovação de aprendizagem (upload) → card IA → Provedor de aprendizagem* ("Escolha ou adicione um provedor de aprendizagem. Exemplo: FGV") → Descrição do conteúdo (rich text, "Descreva os assuntos abordados") → Tipo de experiência* (select) → Categorias ("Selecione ou crie categorias") → Carga horária* ("Ex: 40") → Nota ("Ex: 85" + sufixo "%") → Valor do conteúdo ("Informe o valor investido (ex: 1.500,00)") → Datas (Data de início, Data de término *, Data de aprovação, Data do certificado, Data de validade — inputs type=date "dd/mm/aaaa") → Anotações (rich text, "Adicione suas anotações aqui").
- Upload: "Formato aceito: .pdf, .docx, .xlsx, .csv, .jpg, .jpeg, .png. Tamanho máximo: 10 MB. Quantidade máxima: 5 arquivos." + "Dica: envie certificados, listas de presença ou outros comprovantes para que a IA reconheça e preencha os dados automaticamente." + "Arraste o arquivo ou clique para selecionar".
- Card IA: título "Facilite seu trabalho com a nossa IA" + "Com base nas informações fornecidas como a website da atividade e evidências de aprendizagem, nossa IA poderá preencher os campos abaixo. Quer uma ajuda?" + disclaimer "A IA pode cometer erros, verifique as informações" + botão "Preencher com IA" (disabled até upload).
- Tooltips dos campos (ícone "?" ao lado do label):
  - Pessoa: "Colaborador dono do registro. Em adicionar, escolha quem ganhará o registro."
  - Website: "Endereço web da formação ou do conteúdo"
  - Comprovação de aprendizagem: "Anexe certificados, listas de presença e outros comprovantes"
  - Provedor de aprendizagem: "Instituição responsável pela formação"
  - Descrição do conteúdo: "Descreva os principais assuntos abordados"
  - Tipo de experiência: "Formato da experiência (curso, workshop, mentoria etc.)"
  - Categorias: "Marque uma ou mais categorias que classificam o conteúdo."
  - Carga horária: "Total de horas da formação"
  - Nota: "Nota obtida (em %)"
  - Valor do conteúdo: "Valor investido na formação (R$)"
  - Anotações: "Anotações pessoais sobre o conteúdo"
- Select "Tipo de experiência": "Selecione o tipo" (placeholder), "Curso", "Trilha", "Workshop", "Mentoria", "Palestra", "Evento", "Aula", "Outro".
- Provedor é creatable: digitar valor novo mostra opção `Criar "{texto}"`.
- Validação: campo obrigatório vazio → borda vermelha + texto "Campo obrigatório" abaixo do campo. Sem toast de validação.
- Rodapé: "Salvar e aprovar" (roxo) + "Cancelar" (outline).
- Toast pós-salvar (admin): título "Registro adicionado" + descrição "O registro entrou como aprovado no histórico do colaborador."

### Form "Avaliar registro" (admin)
- Header "Avaliar registro" + "Voltar". Banner: título "Avaliação pendente" + texto "Edite Tipo de experiência e Categorias, depois clique em Aprovar ou Recusar."
- Todos os campos disabled exceto "Tipo de experiência*" e "Categorias". Evidências listadas read-only (ex.: "Certificado.pdf", "Boletim_de_notas.pdf", "Comprovante_pagamento.pdf").
- Rodapé: "Aprovar" + "Recusar" + "Cancelar".
- Toast pós-recusa: título "Registro recusado" + descrição "A justificativa ficou visível pro colaborador."

### Tab "Provedores"
- Toolbar: "Adicionar" + "Ações em massa" (**disabled**) + "Extrair dados" + busca + "Filtro" (sem toggle Grid/Lista).
- Colunas: Checkbox, Nome, Website (link externo), Descrição, Ativo (switch), Criado em ("02/04/2026 14:38"), Ações (Editar / Excluir inline).
- 23 provedores mock (Alura, Casa do Saber, Coursera, Cruz Vermelha, Cultura Inglesa, DeepLearning.AI, ESPM, FAAP, FGV, Google, Hospital Albert, Insper, Interaction Design, Linux Foundation, PM3, Rocketseat, Scrum.org, Sebrae, Senai, Studio Zen, Tableau, Udemy, UFSC).
- Tooltip do Excluir bloqueado: "Não é possível excluir — vinculado a 4 registros".

## 3. Modais detectados

### "Recusar registro" (AlertDialog)
- Header: "Recusar registro"
- Body: "Esta ação não pode ser desfeita." + "A justificativa fica visível no histórico do registro pro colaborador." + campo "Justificativa *" (placeholder "Explique por que o registro foi recusado")
- Botões: "Cancelar" / "Recusar registro" (disabled enquanto justificativa vazia)

## 4. Toasts e mensagens capturadas live

- "Registro adicionado — O registro entrou como aprovado no histórico do colaborador." (sucesso, pós Salvar e aprovar)
- "Registro recusado — A justificativa ficou visível pro colaborador." (sucesso, pós recusa)
- "Extração iniciada — CSV com 78 registros (filtro atual • colunas do filtro)." (sucesso, pós Extrair)
- "Campo obrigatório" (inline, vermelho, sob o campo)

## 5. Drawers capturados

### "Lista de filtros"
- Header "Lista de filtros" + Close. Busca "Pesquise aqui" + botão "Novo".
- Grupos: "Filtros padrão" (aberto: Válidos, Expirados, Pendentes, Recusados — cada um com radio + ícone info + botão "Duplicar {nome}") · "Filtros compartilhados" (vazio: "Em breve — filtros criados pela equipe vão aparecer aqui.") · "Meus filtros" (vazio: "Em breve — filtros que você criar ou duplicar ficam aqui.").
- Footer: "Cancelar" / "Aplicar".

### "Filtro rápido" (via "Novo")
- Header muda para "Filtro rápido"; link "Lista de filtros" volta.
- "Colunas para filtrar" (botão "+ Opções de filtro") · "Colunas para exibir": 18 colunas com checkbox + drag handle — marcadas default: Pessoa, Conteúdo, Origem, Criado por, Provedor, Situação do registro, Situação do certificado, Carga horária; desmarcadas: Tipo de experiência, Website, Evidências, Progresso, Valor do conteúdo, Data de início, Data de término, Data de aprovação, Data do certificado, Data de validade.
- Botão "Salvar filtro". Footer "Cancelar" / "Aplicar".

### "Ações em massa"
- Campos: "Ação *" (select: "Aprovar registros" [default], "Recusar registros", "Excluir registros") + "Opções" (radios: "Selecionados" / "Todos do filtro atual (78)").
- Footer: "Cancelar" / "Aplicar".

### "Configurações da extração"
- "Tipo de extração*" (select: "Dados" [default] / "Evidências") + "Formato*" (radios: "CSV (tabela)" / "PDF (tabela e gráficos)") + "Dados (linhas)*" (radios: "Filtro atual" / "Todos") + "Colunas*" (radios: "Filtro atual" / "Todos").
- Footer: "Cancelar" / "Extrair".

### "Evidências - {conteúdo}"
- Lista de arquivos com ícone + nome + botão "Baixar {arquivo}". Footer: "Cancelar" / "Baixar todas".

### "Histórico - {conteúdo}"
- Trilha de eventos: ex. "Submetido - 12/05/2026" / "Registro criado - 08/05/2026".

### Painel do sino (Notificações)
- Header "Notificações" + "fechar". Itens com título + subtítulo + tempo relativo (ex.: "Extração de dados concluída ... há um mês").

## 6. Menus de ação (3 pontos) capturados live

| Perfil + Origem + Status | Itens do menu |
|---|---|
| Admin + Externo + Aprovado/Emitido | Editar, Visualizar, Evidências, Histórico, Excluir |
| Admin + Externo + Pendente | **Avaliar** (primário), Visualizar, Evidências, Histórico |
| Admin + Interno + Pendente | Visualizar, Histórico |
| Admin + Compartilhado + Emitido | Visualizar, Histórico |
| Aluno + Externo + Pendente | Editar, Visualizar, Evidências, Histórico, Excluir |

## 7. Divergência protótipo vs Discovery

| # | Item | Discovery/Doc diz | Protótipo mostra | Resolução sugerida |
|---|---|---|---|---|
| 1 | Filtro "Pendentes" (admin) | Linhas filtradas devem exibir chip "Pendente" | 2 linhas retornadas exibem chip "Aprovado" (badge errado; menu mostra "Avaliar" confirmando que o dado é pendente) | Bug do protótipo — seguir Discovery (chip "Pendente") |
| 2 | RN 32 — KPI atualiza imediatamente após ação | -1/+1 nos cards após Adicionar/Recusar | KPIs permaneceram 43/12/2/4 após adicionar e recusar registro | Seguir Discovery (RN 32); protótipo mock não implementa |
| 3 | RN 1.3 — toolbar do Aluno tem botão "Filtro" | Botão Filtro presente | Toolbar Aluno sem botão "Filtro" | Seguir Discovery; sinalizar gap no protótipo |
| 4 | RN 2 — colunas Aluno começam em "Origem", incluem "Carga horária" e "Expira em" | — | Protótipo tem coluna extra "Tipo" no início, sem "Carga horária", e header "Expirado em" | Seguir Discovery na AT; registrar divergência |
| 5 | RN 22 — KPI do Líder cobre só liderados | Números menores que Admin | Perfil "Aluno (Líder)" mostra mesmos KPIs do Admin (43/12/2/4) | Seguir Discovery (escopo do líder); protótipo não implementa |
| 6 | RN 39 — campos do form | Sem campos "Website", "Valor do conteúdo", "Anotações", "Data de aprovação" | Protótipo tem esses 4 campos extras | Seguir protótipo (mais recente) e cobrir os campos extras na AT |
| 7 | RN 59 (Spike S7) — limites de evidência "a definir" | sugestão 10 MB / 10 arquivos | Protótipo fixa: ".pdf, .docx, .xlsx, .csv, .jpg, .jpeg, .png · 10 MB · 5 arquivos" | Seguir protótipo (5 arquivos) como referência atual |
| 8 | RN 68 — 17 colunas no Filtro rápido, 10 default | — | 18 colunas, 8 marcadas default | Seguir protótipo; asserções devem usar a lista real |
| 9 | RN 74 — toast com ratio "X processados (Y ignorados...)" | — | Toast de extração usa "•" como separador: "(filtro atual • colunas do filtro)" | Texto literal do protótipo |
| 10 | Provedor criado inline no form (RN 39.3) | Persistido ao salvar | "Recon QA Provider" criado no form não apareceu na tab Provedores | Verificar em Stage; protótipo só mantém em provedoresExtras local |
| 11 | Drawer Evidências (h11) | Header "Evidências de {conteúdo}", ação "Baixar" por arquivo | Header "Evidências - {conteúdo}" + botão extra "Baixar todas" | Seguir protótipo (inclui "Baixar todas") |
| 12 | Modal recusa (RN 52) placeholder | "Explique ao colaborador o motivo da recusa." | "Explique por que o registro foi recusado" | Seguir protótipo (texto literal real) |

## 8. Notas e limitações do recon

- Botão "+ Opções de filtro" do Filtro rápido não abre conteúdo no protótipo (doc confirma: toast "Em breve" — filtro avançado fora desta leva).
- Extração disparada não gerou notificação nova no sino (item "Extração de dados concluída" é mock antigo).
- Endpoints `/api/models`, `/api/scales`, `/api/forms`, `/api/competencias` retornam 500 — são de OUTRA feature (competências); não afetam Registros.
- Tela standalone de certificado (`?cert=ID`) não foi aberta (window.open em nova aba); estrutura confirmada via Discovery RN 49.
- Visão mobile (<md) não exercitada neste recon (viewport desktop 1280px).
