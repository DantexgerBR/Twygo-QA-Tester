---
contract_version: 1.1
at_version: 1
project: registros-externos
project_name: "Registros de Aprendizagem"
generated_at: 2026-06-03T20:00:00Z
generated_by: agent-at@manual
source_docs:
  - "docs/Documentação completa - Registros de Aprendizagem.md"
  - "docs/[Discovery] Registros de Aprendizagem - v02 25.05.2026.md"
  - "docs/[Spike] Registros de Aprendizagem.md"
  - "docs/Registros de Aprendizagem.xlsx"
  - "docs/extract.md"
  - "docs/spike-mass-download-certificates.md"
env: staging-registros-externos
prototypeUrl: http://localhost:5173/
totals:
  suites: 21
  test_cases: 187
  steps: 628
---

# Análise de Teste — Registros de Aprendizagem

## Dados de teste

### Organizações (chaves simbólicas — resolvidas pelo consumidor)
- `org: principal` — org default do env; usada em todas as suítes que não declaram override
- `org: trial` — org Trial dedicada (suíte de Trial)

> Valores concretos (orgIds, hosts) ficam em `.env` do consumidor (gitignored)
> e referenciados em `config/environment.json`.

### Recursos para criação
- `registroNameFormat`: "Registro TC{n} w{workerIndex}-{timestamp}"
- `provedorNameFormat`: "Provedor TC{n} w{workerIndex}-{timestamp}"
- `justificativaPadrao`: "Justificativa de teste automatizado TC{n}"
- `provedoresPadrao`: Alura, Coursera, FGV, LinkedIn Learning, Udemy, USP
- `tiposExperiencia`: Curso, Trilha, Workshop, Mentoria, Palestra, Evento, Aula, Outro
- `categoriasPadrao`: Liderança, Comunicação, Tecnologia, Gestão, Soft skills, Compliance, Idiomas, Saúde e bem-estar, Diversidade
- `statusRegistro` (6): Emitido, Expirado, Pendente, Recusado, Substituído, "Em andamento"
- `origens` (3): Interno, Externo, Compartilhado
- `uploadFormatosAceitos`: .pdf, .docx, .xlsx, .csv, .jpg, .jpeg, .png
- `uploadTamanhoMaximoMB`: 10
- `uploadQuantidadeMaxima`: 5
- `paginacaoOpcoes`: 25 (default), 50, 100

### Usuários (perfis — resolvidos via `.env` do consumidor)
- Admin: usuário administrador da org principal
- Líder: usuário com liderados diretos cadastrados na estrutura organizacional
- Aluno: usuário colaborador comum (sem liderados)
- Aluno fora da equipe do Líder: para cenários negativos de escopo

### Massa de dados mínima (registros por combinação origem × status)
- Externo + Pendente (do Aluno e de liderado do Líder)
- Externo + Emitido, Externo + Recusado (com justificativa), Externo + Expirado (com data de validade vencida), Externo + Substituído
- Interno + Emitido, Interno + "Em andamento"
- Compartilhado + Emitido (replicado via SharedEvent de org parceira)
- Pessoa inativada com registros (para cenários #R27)

## Textos literais

### Toast — sucesso
- "Registro enviado para aprovação"
- "Registro adicionado — O registro entrou como aprovado no histórico do colaborador."
- "Edição salva"
- "Registro salvo"
- "Registro aprovado"
- "Registro recusado — A justificativa ficou visível pro colaborador."
- "Registro excluído"
- "{X} registros aprovados ({Y} ignorados por não atender aos critérios da ação)"
- "{X} registros recusados ({Y} ignorados)"
- "{X} registros excluídos ({Y} ignorados)"
- "Provedor adicionado"
- "Provedor salvo"
- "Provedor ativado"
- "Provedor desativado"
- "Provedor excluído"
- "Extração iniciada: CSV com {N} registros (filtro atual · colunas do filtro)."
- "Extração iniciada: baixando evidências de {comEv} registros ({semEv} sem evidência ignorados)."
- "Sua extração está sendo processada. Você receberá uma notificação quando estiver pronta."
- "Campos preenchidos pela IA" / "Tipo de experiência e Categorias foram sugeridos com base na evidência. Revise antes de salvar."

### Toast — erro / aviso
- "Não foi possível aprovar — registro não encontrado"
- "Sem permissão pra atuar nesse registro"
- "Essa funcionalidade não foi habilitada para esse ambiente. Ative ou consulte o responsável para liberar o acesso a essa funcionalidade no menu de Créditos de IA."
- "Não foi possível preencher com IA. Tente novamente."
- "Em breve"
- "Marque registros na tabela ou troque pra 'Todos do filtro atual'."

### Mensagens inline e empty states
- "Campo obrigatório" (inline vermelho sob campo inválido)
- "Você ainda não tem registros. Adicione o primeiro pelo botão acima."
- "Nenhum registro encontrado"
- "Sem evidências anexadas."
- "Em breve — filtros criados pela equipe vão aparecer aqui."
- "Em breve — filtros que você criar ou duplicar ficam aqui."

### Banners do formulário
- Amarelo (avaliação): "Avaliação pendente" + "Edite Tipo de experiência e Categorias, depois clique em Aprovar ou Recusar."
- Vermelho (recusado): "Registro de aprendizagem recusado" + justificativa do evento de recusa
- Verde (emitido): "Certificado aprovado"
- Amarelo (ações em massa): "Nenhum registro no escopo atende aos critérios pra essa ação."

### Tooltips — KPI cards (Aluno, tom "você")
- Emitidos: "Certificados emitidos e dentro do prazo de validade."
- Expirados: "Certificados cuja data de validade já passou. Pode ser hora de recertificar."
- Pendentes: "Registros externos que você enviou aguardando avaliação do Admin."
- Recusados: "Registros externos que foram recusados pelo Admin. Veja o motivo no detalhe."

### Tooltips — KPI cards (Admin/Líder, tom institucional)
- Emitidos: "Registros aprovados e dentro do prazo de validade na organização."
- Expirados: "Registros cuja data de validade já passou. Sinaliza necessidade de recertificação."
- Pendentes: "Registros externos aguardando avaliação. Use o menu de ação ou as ações em massa pra aprovar/recusar."
- Recusados: "Registros externos recusados na avaliação. Veja o motivo na ficha individual."

### Tooltips — diversos
- "Disponível após a conclusão" (item "Visualizar" disabled em status "Em andamento")
- "Marque registros na tabela pra ativar" (radio "Selecionados" com 0 marcados)
- "Arraste para reordenar" (drag handle de colunas)
- "Não é possível excluir — vinculado a {N} registros" (Excluir de provedor com vínculo)
- Header coluna Provedor: "Instituição responsável pela formação. Pode ser o emissor de um certificado externo ou quem compartilhou o conteúdo."
- Header coluna Origem: "Onde esse registro foi gerado. Interno = pelo LMS; Externo = adicionado por você; Compartilhado = veio de organização parceira."

### Labels e botões
- Título tela Aluno: "Meu histórico" · Breadcrumb Admin: "Aprendizagem" > "Registros"
- Label de carga: "Carga horária total: {X} horas"
- Tabs: "Registros" / "Provedores"
- Toolbar: "Adicionar" / "Ações em massa" / "Extrair dados" / "Filtro" / busca "Pesquise aqui"
- Form Aluno: "Adicionar registro de aprendizagem" · "Editar registro de aprendizagem" · botão "Enviar para aprovação" / "Salvar edição"
- Form Admin: "Adicionar registro" · "Editar registro" · "Avaliar registro" · "Visualizar registro" · botões "Salvar e aprovar" / "Salvar" / "Aprovar" / "Recusar" / "Cancelar" / "Excluir" / "Voltar"
- Upload: "Formato aceito: .pdf, .docx, .xlsx, .csv, .jpg, .jpeg, .png. Tamanho máximo: 10 MB. Quantidade máxima: 5 arquivos." + "Arraste o arquivo ou clique para selecionar"
- Card IA: "Facilite seu trabalho com a nossa IA" + "Preencher com IA" + "A IA pode cometer erros, verifique as informações"
- Standalone: "CERTIFICADO DE CONCLUSÃO" · "Validação de certificado" · "{token} é um certificado válido" · "Baixar o certificado" / "Validar outro certificado" / "Compartilhar no LinkedIn"
- Drawer filtros: "Lista de filtros" / "Filtro rápido" / "Novo" / "Colunas para filtrar" / "Opções de filtro" / "Colunas para exibir" / "Salvar filtro" / "Aplicar" / "Cancelar" / filtros padrão "Válidos", "Expirados", "Pendentes", "Recusados"
- Drawer massa: "Ações em massa" / "Ação" ("Aprovar registros", "Recusar registros", "Excluir registros") / "Selecionados ({N})" / "Todos do filtro atual ({M})"
- Drawer extração: "Configurações da extração" / "Tipo de extração" ("Dados", "Evidências") / "CSV (tabela)" / "PDF (tabela e gráficos)" / "Filtro atual" / "Todos" / "Extrair"
- Drawer evidências: "Evidências - {conteúdo}" / "Baixar" / "Baixar todas"
- Drawer histórico: "Histórico - {conteúdo}"

## Modais relevantes

### "Recusar registro"
- **Quando aparece**: clicar "Recusar" no form de avaliação (modo `admin-avaliar`)
- **Header**: "Recusar registro"
- **Body**: "Esta ação não pode ser desfeita." + "A justificativa fica visível no histórico do registro pro colaborador." + campo "Justificativa" obrigatório (placeholder "Explique por que o registro foi recusado")
- **Botões**: "Cancelar" / "Recusar registro" (desabilitado enquanto Justificativa vazia)

### "Recusar registros" (em massa)
- **Quando aparece**: Aplicar ação "Recusar registros" no drawer de Ações em massa
- **Header**: "Recusar registros"
- **Body**: Textarea "Justificativa" obrigatória — o mesmo texto aplica a todos os registros do batch
- **Botões**: "Cancelar" / "Recusar registros" (desabilitado enquanto vazia)

### "Excluir registro?"
- **Quando aparece**: item "Excluir" do menu 3 pontos OU botão "Excluir" do rodapé do form de edição
- **Header**: "Excluir registro?"
- **Body**: Alert vermelho "Esta ação não pode ser desfeita." + "Você está excluindo o registro: **{título do conteúdo}**."
- **Botões**: "Cancelar" / "Excluir" (sólido vermelho)

### Exclusão em massa
- **Quando aparece**: Aplicar ação "Excluir registros" no drawer de Ações em massa
- **Header**: vermelho destrutivo
- **Body**: Alert vermelho "Esta ação não pode ser desfeita." + "Você está excluindo **{N} registros**."
- **Botões**: "Cancelar" / confirmar exclusão

### "Atenção" (extração de evidências)
- **Quando aparece**: Extrair com Tipo "Evidências" e escopo contendo registros sem evidência
- **Header**: "Atenção" (ícone warning amarelo)
- **Body**: "{N} de {M} registros no escopo não têm evidência anexada. Eles serão ignorados na extração."
- **Botões**: "Cancelar" (volta pro drawer) / "Continuar"

### Exclusão de provedor sem vínculo
- **Quando aparece**: clicar "Excluir" em provedor sem registros vinculados
- **Header**: confirmação destrutiva (pattern "Excluir registro?")
- **Botões**: "Cancelar" / "Excluir" — confirmar exibe toast "Provedor excluído"

### Provedor com vínculo (informativo)
- **Quando aparece**: clicar "Excluir" em provedor com registros vinculados
- **Header**: ícone amarelo informativo
- **Body**: "Provedor não pode ser excluído. Existem {N} registros vinculados."
- **Botões**: "Entendi" (botão único)

### "Limite de créditos atingido" (Admin)
- **Quando aparece**: clicar "Preencher com IA" com funcionalidade habilitada e sem crédito (perfil Admin)
- **Header**: "Limite de créditos atingido" (com X de dismiss)
- **Body**: "Todos os créditos disponíveis foram utilizados. Para continuar, entre em contato com o suporte ou aguarde a renovação."
- **Botões**: "Contato" (roxo sólido)

### "Limite de créditos atingido" (Aluno)
- **Quando aparece**: idem, perfil Aluno
- **Header**: "Limite de créditos atingido" (com X de dismiss)
- **Body**: "Todos os créditos disponíveis foram utilizados."
- **Botões**: "Fechar" (roxo sólido)

## Endpoints (referência)

| Método | URL | Sucesso | Erro |
|---|---|---|---|
| `GET` | `/learning_records` | 200 lista escopada por perfil | 401 |
| `GET` | `/learning_records/stats` | 200 contagens dos KPIs | 401 |
| `POST` | `/learning_records` | 201 | 422 (obrigatórios) |
| `PATCH` | `/learning_records/:id` | 200 | 403 fora do escopo / 404 |
| `POST` | `/learning_records/:id/approve` | 200 | 403 / 404 "registro não encontrado" |
| `POST` | `/learning_records/:id/reject` | 200 | 422 sem justificativa / 403 |
| `DELETE` | `/learning_records/:id` | 200 (soft-delete) | 403 |
| `POST` | `/learning_records/bulk_actions` | 200 com ratio X/Y | 403 |
| `POST` | `/learning_records/export` | 202 (assíncrono) | 403 |
| `GET/POST/PATCH/DELETE` | `/learning_providers` | 200/201 | 422 "Campo obrigatório" (Nome) |

> Endpoints são hipótese do Spike S2/S5 — confirmar nomes reais no Stage antes da execução automatizada.

## Campos e validações

| Campo | Tipo | Obrigatório | Limite | Observações |
|---|---|---|---|---|
| Pessoa | select com busca | Sim (form admin) | — | só no form Admin/Líder; Líder vê só liderados; disabled em edição |
| Provedor de aprendizagem | select criável | Sim | — | 6 padrão + criação inline "Criar {nome}" |
| Tipo de experiência | select single | Sim | 8 opções fixas | Curso, Trilha, Workshop, Mentoria, Palestra, Evento, Aula, Outro |
| Categorias | multi-select criável | Não | — | 9 padrão + criação inline; chips removíveis |
| Descrição do conteúdo | rich text | Não | — | placeholder "Descreva os assuntos abordados" |
| Carga horária | input number | Sim | > 0 | placeholder "Ex: 40" |
| Data de início | input date | Não | — | dd/mm/aaaa |
| Data de término | input date | Sim | — | — |
| Data de aprovação | input date | Não | — | presente no protótipo (form admin) |
| Data do certificado | input date | Não | — | — |
| Data de validade | input date | Não | — | vazio = certificado permanente |
| Nota | input number | Não | 0–100 (%) | placeholder "Ex: 85", sufixo "%" |
| Website | input url | Não | — | placeholder "http://website.com" |
| Valor do conteúdo | input moeda | Não | — | placeholder "Informe o valor investido (ex: 1.500,00)" |
| Anotações | rich text | Não | — | placeholder "Adicione suas anotações aqui" |
| Comprovação de aprendizagem | upload múltiplo | Não | 10 MB/arquivo · 5 arquivos · .pdf .docx .xlsx .csv .jpg .jpeg .png | obrigatório para habilitar "Preencher com IA" |
| Justificativa (recusa) | textarea | Sim | — | botão de confirmação desabilitado enquanto vazia |
| Nome (provedor) | input texto | Sim | — | "Campo obrigatório" |
| Website (provedor) | input url | Não | — | placeholder "https://..." |
| Descrição (provedor) | textarea | Não | — | truncada na listagem |
| Ativo (provedor) | switch | — | — | default ligado na criação |

---

---
suite: Listagem "Meu histórico" do Aluno — tabela, busca e mobile
executor: playwright
org: principal
playbooks:
  - perfil-switch
  - filtro-drawer
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuário logado como Aluno (colaborador sem perfil administrativo)
  - Aluno possui ao menos 8 registros distribuídos entre origens (Interno, Externo, Compartilhado) e status (Emitido, Expirado, Pendente, Recusado), com provedores distintos (ex. "Alura", "FGV")
  - Ao menos 26 registros cadastrados para o cenário de paginação (ou pageSize ajustável)
---

# Listagem "Meu histórico" do Aluno — tabela, busca e mobile

## TC1 — Validar estrutura geral da tela "Meu histórico"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [1, 1.1, 1.2, 1.3, 1.4]

### Objetivo
Garantir que a tela "Meu histórico" renderiza, de cima pra baixo: título, label de carga horária, faixa de 4 KPI cards, toolbar completa e lista em modo tabela (R1).

### Passos
1. Clicar no menu lateral "Meu histórico"
   → Sistema exibe a tela com título "Meu histórico" no topo e breadcrumb "Meu histórico".
2. Aguardar a faixa de KPI cards ser exibida
   → 4 cards são exibidos na ordem: "Emitidos", "Expirados", "Pendentes", "Recusados".
3. Verificar o label "Carga horária total: {X} horas" à direita do título
   → Label "Carga horária total: {X} horas" é exibido, onde {X} é a soma das cargas horárias dos registros do aluno na organização ativa.
4. Verificar a toolbar com o botão "Adicionar", a busca, o toggle de visualização e o botão "Filtro"
   → Toolbar exibe, da esquerda pra direita: botão "Adicionar" (roxo sólido), campo de busca, toggle de visualização tabela/grid e botão "Filtro".
5. Verificar o modo de exibição default "Lista" da listagem
   → Lista é exibida em formato tabela (modo default em desktop).

## TC2 — Validar colunas, conteúdo e tooltips da tabela do Aluno
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [2]

### Objetivo
Garantir que a tabela do Aluno exibe as colunas padrão na ordem documentada, com formato de conteúdo e tooltips de header corretos (RN 2).

### Passos
1. Acessar a tela "Meu histórico"
   → Tabela é exibida com as colunas na ordem: "Origem", "Conteúdo", "Provedor", "Situação do registro", "Progresso", "Situação do certificado", "Carga horária", "Emitido em", "Expira em", coluna de ações.
2. Verificar a coluna "Origem" de um registro Interno, um Externo e um Compartilhado
   → Cada linha exibe chip com ícone e texto correspondente: "Interno", "Externo" ou "Compartilhado".
3. Passar o mouse sobre o header da coluna "Origem"
   → Tooltip exibida: "Onde esse registro foi gerado. Interno = pelo LMS; Externo = adicionado por você; Compartilhado = veio de organização parceira."
4. Passar o mouse sobre o header da coluna "Provedor"
   → Tooltip exibida: "Instituição ou plataforma onde o conteúdo foi realizado (ex: Alura, FGV, USP)."
5. Verificar a coluna "Situação do registro" de um registro Aprovado e de um Pendente
   → Chip sólido verde com texto "Aprovado" para registro aprovado; chip sólido laranja com texto "Pendente" para registro pendente.
6. Verificar a coluna "Progresso" de um registro com progresso e de um sem dado
   → Registro com progresso exibe barra roxa + percentual (ex: "100%"); registro sem dado exibe "—".
7. Verificar a coluna "Situação do certificado" de um registro de origem Externa
   → Coluna exibe "—" (externos não têm status de certificado).
8. Verificar a coluna "Carga horária" de um registro com 40 horas
   → Coluna exibe "40h".
9. Verificar as colunas "Emitido em" e "Expira em" de um registro sem data de expiração
   → "Emitido em" exibe data no formato dd/mm/yyyy; "Expira em" exibe "—".

## TC3 — Validar empty state da lista sem registros
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3]

### Objetivo
Garantir que aluno sem registros vê a mensagem de empty state e que a faixa de KPIs permanece visível com 4 cards zerados (RN 3, RN 36.2).

### Passos
1. Acessar a tela "Meu histórico" com usuário Aluno sem nenhum registro cadastrado
   → Lista exibe a mensagem "Você ainda não tem registros. Adicione o primeiro pelo botão acima."
2. Verificar a faixa de KPI cards "Emitidos", "Expirados", "Pendentes" e "Recusados"
   → 4 cards permanecem visíveis, todos com número "0" e anel cinza claro completo no lugar do donut.

## TC4 — Validar empty state de filtro sem resultados
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [3]

### Objetivo
Garantir que busca sem correspondência exibe o empty state de resultado vazio.

### Passos
1. Acessar a tela "Meu histórico"
   → Tabela exibe os registros do aluno.
2. Preencher o campo de busca da toolbar com "zzzzz-inexistente-99"
   → Lista exibe a mensagem "Nenhum registro encontrado".

## TC5 — Validar conteúdo do card no modo grid
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [4]

### Objetivo
Garantir que o card do modo grid reúne todos os elementos documentados (RN 4).

### Passos
1. Acessar a tela "Meu histórico"
   → Tabela é exibida.
2. Clicar no botão de toggle "Grid" da toolbar
   → Tabela é substituída por grid de cards responsivo.
3. Verificar um card de registro "Interno" com tipo de experiência preenchido
   → Card exibe: chips "Interno" + tipo de experiência no topo, título do conteúdo, nome do provedor, chip de "Situação do registro", carga horária, chip de "Situação do certificado" e datas "Emitido em" / "Expira em" no rodapé.
4. Verificar o menu "3 pontos" do card
   → Menu 3 pontos é exibido no canto do card.

## TC6 — Validar que linha e card não navegam ao clicar
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [5]

### Objetivo
Garantir que clicar na linha da tabela ou no corpo do card não navega — ações são exclusivas do menu 3 pontos (RN 5).

### Passos
1. Acessar a tela "Meu histórico"
   → Tabela é exibida.
2. Clicar no centro de uma linha da tabela (fora do menu de ações)
   → Nenhuma navegação ocorre; URL permanece a mesma e nenhum form/modal abre.
3. Clicar no botão de toggle "Grid" da toolbar
   → Grid de cards é exibido.
4. Clicar no corpo de um card (fora do menu 3 pontos)
   → Nenhuma navegação ocorre.

## TC7 — Validar busca em tempo real nos campos do Aluno
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [13, 13.1]

### Objetivo
Garantir que a busca filtra em tempo real pelos campos conteúdo, origem e provedor (RN 13.1).

### Passos
1. Acessar a tela "Meu histórico"
   → Tabela exibe os registros do aluno.
2. Preencher o campo de busca com "Alura"
   → Tabela filtra em tempo real exibindo apenas registros do provedor "Alura".
3. Preencher o campo de busca com "Externo"
   → Tabela exibe apenas registros de origem "Externo".
4. Preencher o campo de busca com o título parcial de um conteúdo existente (ex: "Norma")
   → Tabela exibe apenas registros cujo conteúdo contém o termo (ex: "Norma NR10").
5. Preencher o campo de busca com texto vazio (limpar)
   → Tabela volta a exibir todos os registros do aluno.

## TC8 — Validar interseção de busca + filtro KPI + filtro do drawer
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [13.3, 28.1]

### Objetivo
Garantir que busca textual, filtro de KPI card e filtro do drawer convivem combinando como interseção (RN 13.3) — cobertura combinatória mínima do contrato 1.1.

### Passos
1. Acessar a tela "Meu histórico"
   → Tabela exibe todos os registros do aluno.
2. Clicar no KPI card "Emitidos"
   → Lista filtra para registros com status Emitido; card "Emitidos" fica com borda colorida e elevação.
3. Clicar no botão "Filtro" da toolbar
   → Drawer "Lista de filtros" é exibido com o radio correspondente ao filtro ativo já selecionado.
4. Clicar no botão "Aplicar" do drawer
   → Drawer fecha; lista permanece filtrada por Emitidos.
5. Preencher o campo de busca com "Alura"
   → Lista exibe apenas registros Emitidos do provedor "Alura" (interseção dos dois filtros).
6. Verificar o número do KPI card "Emitidos"
   → Número permanece o total de Emitidos do aluno, sem reagir à busca.

## TC9 — Validar toggle tabela/grid e não persistência entre sessões
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [14, 14.1]

### Objetivo
Garantir o comportamento do toggle de visualização e o default tabela a cada nova carga (RN 14, 14.1).

### Passos
1. Acessar a tela "Meu histórico"
   → Lista em modo tabela; botão de toggle "Lista" aparece com variante sólida (ativo).
2. Clicar no botão de toggle "Grid"
   → Tabela some e o grid de cards é exibido; botão "Grid" fica com variante sólida.
3. Recarregar a página
   → Lista volta ao modo tabela (toggle não persiste entre sessões).

## TC10 — Validar ordenação por coluna (ciclo asc → desc → none)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [11, 15, 15.1]

### Objetivo
Garantir que o sort cicla asc → desc → limpa, usa accessor cronológico para datas e envia nulos para o fim (RN 15, 15.1).

### Passos
1. Acessar a tela "Meu histórico"
   → Tabela exibida sem ordenação ativa.
2. Clicar no header da coluna "Emitido em"
   → Header exibe seta roxa de direção; linhas reordenam cronologicamente em ordem ascendente (datas dd/mm/yyyy ordenadas por valor cronológico, não alfabético).
3. Clicar novamente no header da coluna "Emitido em"
   → Direção muda para descendente (mais recente primeiro).
4. Clicar pela terceira vez no header da coluna "Emitido em"
   → Ordenação é limpa; tabela volta à ordem original.
5. Clicar no header da coluna "Expira em" (com registros sem data de expiração presentes)
   → Ordenação ascendente é aplicada e registros com "—" (sem data) aparecem no fim da lista.

## TC11 — Validar paginação da lista (25/50/100)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [1.5]

### Objetivo
Garantir paginação default de 25 itens com opções 25/50/100 (RN 1.5).

### Passos
1. Acessar a tela "Meu histórico" com mais de 25 registros cadastrados
   → Tabela exibe 25 linhas; controle de paginação exibe página "1" e o total de páginas.
2. Clicar no botão de próxima página
   → Tabela exibe a página 2 com os registros seguintes.
3. Selecionar "50 por página" no dropdown de paginação
   → Tabela passa a exibir até 50 linhas por página e o total de páginas é recalculado.
4. Selecionar "100 por página" no dropdown de paginação
   → Tabela passa a exibir até 100 linhas por página.

## TC12 — Validar visualização mobile (auto-switch, toggle escondido, KPI 1 coluna)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [16, 16.1, 16.2]

### Objetivo
Garantir que em viewport mobile a lista força modo grid, o toggle é escondido e os KPIs empilham em 1 coluna (RN 16). Pré-condição adicional: Viewport Mobile (360x740).

### Passos
1. Acessar a tela "Meu histórico" com viewport Mobile (360x740)
   → Lista é exibida automaticamente em modo grid (cards), independente do toggle.
2. Verificar a toolbar sem o toggle "Grid"/"Lista"
   → Toggle de visualização tabela/grid NÃO é exibido.
3. Verificar a faixa de KPI cards "Emitidos", "Expirados", "Pendentes" e "Recusados"
   → Cards são exibidos empilhados em 1 coluna.

## TC13 — Validar menu hamburger da sidebar em mobile
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [17]

### Objetivo
Garantir que em mobile a sidebar vira hamburger com drawer lateral e fecha ao selecionar seção (RN 17). Pré-condição adicional: Viewport Mobile (360x740).

### Passos
1. Acessar a tela "Meu histórico" com viewport Mobile (360x740)
   → Ícone de menu hamburger é exibido antes do breadcrumb; sidebar fixa não é exibida.
2. Clicar no ícone de menu hamburger
   → Drawer lateral esquerdo abre exibindo os itens da sidebar.
3. Clicar no item "Meu histórico" dentro do drawer
   → Drawer fecha automaticamente e a tela "Meu histórico" permanece exibida.

---

---
suite: Listagem "Aprendizagem > Registros" do Admin/Líder — colunas, sticky e seleção
executor: playwright
org: principal
playbooks:
  - filtro-drawer
  - perfil-switch
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuário logado como Admin
  - Usuário Líder disponível com liderados diretos cadastrados na estrutura organizacional (para o cenário de escopo)
  - Organização possui registros de múltiplas pessoas, distribuídos entre origens (Interno, Externo, Compartilhado) e status (Emitido, Expirado, Pendente, Recusado)
  - Ao menos 26 registros cadastrados para paginação e scroll
---

# Listagem "Aprendizagem > Registros" do Admin/Líder — colunas, sticky e seleção

## TC1 — Validar estrutura da tela: tabs, KPIs, carga horária e toolbar
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [6, 6.1, 6.2, 6.3]

### Objetivo
Garantir que a tela "Aprendizagem > Registros" apresenta tabs centralizadas, faixa de KPIs com label de carga horária e toolbar completa do Admin (RN 6).

### Passos
1. Clicar no submenu "Registros" dentro do menu "Aprendizagem"
   → Tela exibe breadcrumb "Aprendizagem" > "Registros" e duas tabs centralizadas: "Registros" (ativa, com destaque roxo e borda inferior) e "Provedores".
2. Verificar a faixa de KPI cards no topo da aba "Registros"
   → 4 cards exibidos: "Emitidos", "Expirados", "Pendentes", "Recusados".
3. Verificar o label "Carga horária total: {X} horas" à direita da faixa
   → Label "Carga horária total: {X} horas" é exibido.
4. Verificar a toolbar com os botões "Adicionar", "Ações em massa", "Extrair dados" e "Filtro"
   → Toolbar exibe, da esquerda pra direita: botão "Adicionar" (roxo sólido), botão "Ações em massa" (outline, sem ícone), botão "Extrair dados" (outline, com ícone de upload), campo de busca, toggle tabela/grid e botão "Filtro".

## TC2 — Validar colunas default da tabela do Admin
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [7, 7.3, 12]

### Objetivo
Garantir que a tabela do Admin exibe as 10 colunas padrão na ordem documentada, incluindo "Pessoa" e "Criado por" exclusivas do Admin/Líder (RN 7).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin
   → Tabela exibe colunas na ordem: checkbox de seleção, "Pessoa", "Conteúdo", "Origem", "Criado por", "Provedor", "Situação do registro", "Progresso", "Situação do certificado", "Carga horária", coluna de ações.
2. Verificar a coluna "Pessoa" de uma linha
   → Coluna exibe avatar, nome e e-mail da pessoa em 2 linhas.
3. Verificar a coluna "Criado por" de um registro criado pelo próprio aluno e de um criado pelo Admin
   → Coluna exibe o nome de quem cadastrou (nome do aluno ou "Administrador"/nome do admin).
4. Passar o mouse sobre o ícone de ajuda do header "Provedor"
   → Tooltip exibida: "Instituição responsável pela formação. Pode ser o emissor de um certificado externo ou quem compartilhou o conteúdo."

## TC3 — Validar seleção de linhas e checkbox tri-state do header
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [7]

### Objetivo
Garantir o comportamento do checkbox de header (selecionar todos / tri-state) e da seleção individual (RN 7).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin
   → Tabela exibida com checkboxes desmarcados.
2. Marcar o checkbox de 3 linhas da tabela
   → As 3 linhas ficam selecionadas; checkbox do header assume estado intermediário (tri-state "some-selected").
3. Marcar o checkbox do header
   → Todos os checkboxes da página atual ficam marcados; header assume estado "all-selected".
4. Desmarcar o checkbox do header
   → Todos os checkboxes da página são desmarcados.

## TC4 — Validar empty state da lista do Admin
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [8]

### Objetivo
Garantir o empty state "Nenhum registro encontrado" quando filtro/busca não retorna resultados (RN 8).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin
   → Tabela exibe registros.
2. Preencher o campo de busca com "termo-inexistente-xyz-123"
   → Lista exibe a mensagem "Nenhum registro encontrado".

## TC5 — Validar colunas sticky com dropshadow no scroll horizontal
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [9, 10]

### Objetivo
Garantir que checkbox (esquerda) e ações (direita) permanecem fixas com sombra interna durante o scroll horizontal, e que o body tem altura fixa com scroll interno (RN 9, RN 10).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin com várias colunas habilitadas
   → Tabela é exibida com scroll horizontal disponível.
2. Rolar a tabela horizontalmente para a direita
   → Coluna de checkbox (esquerda) e coluna de ações (direita) permanecem visíveis (sticky) com box-shadow interno indicando o limite de scroll.
3. Verificar o body da tabela em desktop com altura fixa de "660px"
   → Body tem altura fixa (~660px, cerca de 12 linhas) com scroll vertical interno independente da página.

## TC6 — Validar ordenação pelos headers (ciclo asc → desc → none)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [11]

### Objetivo
Garantir que o clique no header cicla as direções de ordenação com indicador visual (RN 11).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin
   → Tabela exibida sem sort ativo.
2. Clicar no header da coluna "Pessoa"
   → Coluna ordena ascendente (A→Z pelo nome); header exibe seta roxa ascendente.
3. Clicar novamente no header da coluna "Pessoa"
   → Coluna ordena descendente (Z→A); seta roxa muda de direção.
4. Clicar pela terceira vez no header da coluna "Pessoa"
   → Ordenação é limpa; tabela volta à ordem default.

## TC7 — Validar busca em tempo real nos campos do Admin
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [13, 13.2]

### Objetivo
Garantir que a busca do Admin cobre conteúdo, origem, provedor, nome da pessoa, e-mail e criado por (RN 13.2).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin
   → Tabela exibe registros de múltiplas pessoas.
2. Preencher o campo de busca com o nome de uma pessoa (ex: "Ana Silva")
   → Tabela filtra para registros da pessoa "Ana Silva".
3. Preencher o campo de busca com o e-mail de uma pessoa (ex: "ana.silva@")
   → Tabela filtra para registros da pessoa com aquele e-mail.
4. Preencher o campo de busca com um provedor (ex: "Coursera")
   → Tabela filtra para registros do provedor "Coursera".
5. Preencher o campo de busca com "Compartilhado"
   → Tabela filtra para registros de origem "Compartilhado".
6. Preencher o campo de busca com o nome de quem criou (ex: "Administrador")
   → Tabela filtra para registros cujo "Criado por" contém o termo.

## TC8 — Validar modo grid do Admin (card denso e borda de seleção)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [14]

### Objetivo
Garantir que o card do grid Admin exibe os elementos densos documentados e que a borda fica roxa quando selecionado.

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin
   → Tabela exibida.
2. Clicar no botão de toggle "Grid"
   → Grid de cards é exibido; cada card mostra: checkbox + Pessoa + menu 3 pontos no topo; Conteúdo, chips de Origem e Tipo de experiência, Provedor e Criado por, chip de Situação do registro e carga horária no meio.
3. Marcar o checkbox de um card
   → Borda do card fica roxa indicando seleção.
4. Desmarcar o checkbox do card
   → Borda volta ao estado normal.

## TC9 — Validar visão do Líder com mesmo shell e escopo reduzido
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [6.2, 22]

### Objetivo
Garantir que o Líder vê a mesma tela do Admin (tabs, toolbar, colunas), porém listando apenas registros dos liderados diretos (RN 6.2).

### Passos
1. Acessar a tela "Aprendizagem > Registros" logado como Líder
   → Tela exibe tabs "Registros" e "Provedores", faixa de KPIs e toolbar idênticas às do Admin.
2. Verificar as pessoas listadas na coluna "Pessoa"
   → Apenas pessoas que são liderados diretos do Líder aparecem na lista.
3. Verificar os números dos KPI cards "Emitidos", "Expirados", "Pendentes" e "Recusados"
   → Contagens refletem apenas os registros dos liderados diretos (menores ou iguais às da organização inteira).

## TC10 — Validar paginação da lista do Admin
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [6]

### Objetivo
Garantir paginação default de 25 com opções 25/50/100 na lista do Admin.

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin com mais de 25 registros
   → Tabela exibe 25 linhas; paginação mostra página "1" e total de páginas (ex: "de 4").
2. Clicar no botão de próxima página
   → Página 2 é exibida; botão de página anterior fica habilitado.
3. Selecionar "100 por página" no dropdown de paginação
   → Tabela exibe até 100 linhas e total de páginas recalcula.

## TC11 — Validar visualização mobile do Admin (auto-switch e hamburger)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [16, 16.1, 16.2, 17]

### Objetivo
Garantir comportamento mobile na tela do Admin: grid forçado, toggle escondido, KPIs em 1 coluna e sidebar hamburger (RN 16, 17). Pré-condição adicional: Viewport Mobile (360x740).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin com viewport Mobile (360x740)
   → Lista é exibida em modo grid (cards) automaticamente; toggle tabela/grid não é exibido.
2. Verificar a faixa de KPI cards "Emitidos", "Expirados", "Pendentes" e "Recusados"
   → Cards empilhados em 1 coluna.
3. Clicar no ícone de menu hamburger antes do breadcrumb
   → Drawer lateral esquerdo abre com a sidebar; selecionar uma seção fecha o drawer.

## TC12 — Validar viewport tablet (KPIs 2x2)
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [16.2]

### Objetivo
Garantir que em viewport tablet os KPI cards organizam em grade 2x2 (RN 16.2). Pré-condição adicional: Viewport Tablet (768x1024).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin com viewport Tablet (768x1024)
   → Faixa de KPI cards é exibida em 2 colunas (grade 2x2).

---

---
suite: KPI cards como filtro de status (Aluno)
executor: playwright
org: principal
playbooks:
  - perfil-switch
  - filtro-drawer
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuário logado como Aluno
  - Aluno possui registros com distribuição conhecida entre os status (ex. 5 Emitidos, 1 Expirado, 2 Pendentes, 0 Recusados)
  - Aluno possui ao menos 1 registro Substituído ou "Em andamento" para validar o denominador do donut
---

# KPI cards como filtro de status (Aluno)

## TC1 — Validar estrutura e cores dos 4 KPI cards
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [18, 18.1, 18.2]

### Objetivo
Garantir que cada card tem donut + número + label + tooltip, com as cores canônicas por status (RN 18).

### Passos
1. Acessar a tela "Meu histórico"
   → 4 KPI cards exibidos na ordem: "Emitidos", "Expirados", "Pendentes", "Recusados".
2. Verificar os elementos do card "Emitidos"
   → Card exibe donut chart à esquerda, número da contagem em preto bold e label "Emitidos" à direita do número.
3. Verificar a cor do donut dos cards "Emitidos", "Expirados", "Pendentes" e "Recusados"
   → "Emitidos" verde (#38A169), "Expirados" vermelho (#F56565), "Pendentes" laranja (#DD6B20), "Recusados" cinza (#718096).

## TC2 — Validar tooltips dos cards no tom do Aluno
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [18.3, 18.3.1]

### Objetivo
Garantir que os tooltips do Aluno usam tom de 2ª pessoa com os textos literais documentados (RN 18.3.1).

### Passos
1. Acessar a tela "Meu histórico"
   → 4 KPI cards exibidos.
2. Passar o mouse sobre o card "Emitidos" e aguardar o tooltip
   → Tooltip exibida: "Certificados emitidos e dentro do prazo de validade."
3. Passar o mouse sobre o card "Expirados"
   → Tooltip exibida: "Certificados cuja data de validade já passou. Pode ser hora de recertificar."
4. Passar o mouse sobre o card "Pendentes"
   → Tooltip exibida: "Registros externos que você enviou aguardando avaliação do Admin."
5. Passar o mouse sobre o card "Recusados"
   → Tooltip exibida: "Registros externos que foram recusados pelo Admin. Veja o motivo no detalhe."

## TC3 — Validar escopo da contagem e label de carga horária do Aluno
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [19, 20]

### Objetivo
Garantir que contagem dos KPIs e carga horária cobrem apenas os registros do próprio aluno na organização ativa (RN 20, RN 19).

### Passos
1. Acessar a tela "Meu histórico" com aluno de distribuição conhecida (ex: 5 Emitidos, 1 Expirado, 2 Pendentes, 0 Recusados)
   → Cards exibem exatamente "5", "1", "2" e "0" respectivamente.
2. Verificar o label "Carga horária total: {X} horas"
   → "Carga horária total: {X} horas" onde {X} é a soma das cargas dos registros do próprio aluno (não da organização).

## TC4 — Validar denominador do donut somando os 6 status
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [23, 23.1]

### Objetivo
Garantir que a proporção do donut usa como total a soma dos 6 status — incluindo Substituído e "Em andamento", que não têm card (RN 23).

### Passos
1. Acessar a tela "Meu histórico" com aluno que possui registros Substituído e/ou "Em andamento" além dos 4 status com card
   → Proporção da fatia colorida de cada donut corresponde a contagem do status dividida pela soma dos 6 status (não pela soma dos 4 cards).
2. Verificar a soma dos números dos cards "Emitidos", "Expirados", "Pendentes" e "Recusados"
   → Soma dos 4 cards é menor que o total geral de registros do aluno (diferença = Substituído + "Em andamento").

## TC5 — Validar clique no card aplicando filtro de status
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [26, 26.2]

### Objetivo
Garantir que o card do Aluno é clicável, aplica filtro na lista e apenas um card fica ativo por vez (RN 26).

### Passos
1. Acessar a tela "Meu histórico"
   → Lista exibe todos os registros; nenhum card ativo.
2. Clicar no card "Pendentes"
   → Lista filtra exibindo apenas registros com status Pendente; quantidade de linhas bate com o número do card.
3. Clicar no card "Emitidos"
   → Filtro troca para Emitidos (apenas um card ativo por vez); card "Pendentes" perde o estado ativo.

## TC6 — Validar toggle de desseleção do card ativo
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [26.1]

### Objetivo
Garantir que clicar novamente no card ativo deseleciona o filtro (RN 26.1).

### Passos
1. Acessar a tela "Meu histórico"
   → Lista sem filtro ativo.
2. Clicar no card "Pendentes"
   → Lista filtra por Pendentes; card fica ativo.
3. Clicar novamente no card "Pendentes"
   → Filtro é removido; lista volta a exibir todos os registros; todos os cards voltam ao peso visual normal.

## TC7 — Validar estados visuais: ativo, dimmed e hover de preview
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [27, 27.1]

### Objetivo
Garantir os estados visuais do card ativo (borda + elevação) e dos não-ativos (grayscale + opacidade), incluindo restauração temporária no hover (RN 27).

### Passos
1. Acessar a tela "Meu histórico"
   → Todos os cards com peso visual normal.
2. Clicar no card "Pendentes"
   → Card "Pendentes" ganha borda na cor do donut, leve elevação e sombra pronunciada; os outros 3 cards ficam dimmed (grayscale + opacidade reduzida).
3. Passar o mouse sobre o card "Emitidos" (dimmed)
   → Card "Emitidos" restaura o visual normal temporariamente durante o hover.
4. Retirar o mouse do card "Emitidos"
   → Card volta ao estado dimmed.

## TC8 — Validar independência da contagem em relação ao drawer de filtros
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [28, 28.1]

### Objetivo
Garantir que o número do KPI nunca reage aos filtros do drawer, e que filtro do KPI + drawer convivem na lista como interseção (RN 28).

### Passos
1. Acessar a tela "Meu histórico" e anotar o número do card "Pendentes"
   → Card exibe a contagem total de Pendentes do aluno.
2. Clicar no card "Pendentes"
   → Lista filtra por Pendentes.
3. Clicar no botão "Filtro" e aplicar um filtro adicional de provedor pelo drawer (quando disponível)
   → Lista exibe apenas Pendentes que também atendem ao filtro do drawer (interseção).
4. Verificar o número do card "Pendentes"
   → Número permanece o total de Pendentes do aluno, inalterado pelos filtros do drawer.

## TC9 — Validar card com contagem 0 clicável levando ao empty state
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [29, 35, 35.1, 35.2, 37.1]

### Objetivo
Garantir que card zerado mantém visual (anel cinza, "0" bold) e continua clicável, levando ao empty state (RN 29, RN 35).

### Passos
1. Acessar a tela "Meu histórico" com aluno que tem 0 registros Recusados
   → Card "Recusados" exibe "0" em preto bold e donut como anel sólido cinza claro, com borda/sombra/opacidade idênticas aos demais cards.
2. Clicar no card "Recusados"
   → Card ganha estado ativo (borda cinza); demais ficam dimmed; lista exibe "Nenhum registro encontrado".
3. Clicar novamente no card "Recusados"
   → Filtro desativa; lista volta ao estado anterior.

## TC10 — Validar estado "tudo zero" para aluno novo
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [36, 36.1, 36.2]

### Objetivo
Garantir que aluno sem nenhum registro vê a faixa com os 4 cards zerados e anéis cinza completos — a faixa é permanente (RN 36).

### Passos
1. Acessar a tela "Meu histórico" com usuário Aluno recém-criado (0 registros)
   → Faixa de KPIs aparece normalmente com 4 cards exibindo "0" e anel cinza claro completo em cada donut.
2. Verificar que não há empty state customizado no lugar da faixa de cards "Emitidos", "Expirados", "Pendentes" e "Recusados"
   → A faixa de cards é renderizada (não substituída por mensagem).

---

---
suite: KPI cards como dashboard estático (Admin/Líder)
executor: playwright
org: principal
playbooks:
  - perfil-switch
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuário logado como Admin
  - Usuário Líder disponível com liderados diretos cadastrados (alguns com registros)
  - Organização possui registros com distribuição conhecida entre os 6 status
  - Pessoa inativada com registros existente na organização (para o cenário de exclusão da contagem)
  - Registro Emitido com data de validade no dia corrente (para o cenário de expiração — pode exigir manipulação de massa de dados)
---

# KPI cards como dashboard estático (Admin/Líder)

## TC1 — Validar estrutura, cores e label de carga horária no Admin
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [18, 18.1, 18.2, 19, 21]

### Objetivo
Garantir que o Admin vê os 4 cards com mesma estrutura visual do Aluno e contagem cobrindo toda a organização (RN 18, RN 21).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin
   → 4 cards exibidos ("Emitidos", "Expirados", "Pendentes", "Recusados") com donut, número e label; cores: verde, vermelho, laranja e cinza respectivamente.
2. Verificar os números dos cards "Emitidos", "Expirados", "Pendentes" e "Recusados" contra a massa de dados conhecida da organização
   → Contagens refletem todos os registros da organização ativa (todas as pessoas ativas).
3. Verificar o label "Carga horária total: {X} horas"
   → "Carga horária total: {X} horas" com a soma das cargas da organização inteira.

## TC2 — Validar tooltips no tom institucional do Admin
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [18.3, 18.3.2]

### Objetivo
Garantir os textos literais institucionais dos tooltips do Admin/Líder (RN 18.3.2).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin
   → 4 cards exibidos.
2. Passar o mouse sobre o card "Emitidos"
   → Tooltip exibida: "Registros aprovados e dentro do prazo de validade na organização."
3. Passar o mouse sobre o card "Expirados"
   → Tooltip exibida: "Registros cuja data de validade já passou. Sinaliza necessidade de recertificação."
4. Passar o mouse sobre o card "Pendentes"
   → Tooltip exibida: "Registros externos aguardando avaliação. Use o menu de ação ou as ações em massa pra aprovar/recusar."
5. Passar o mouse sobre o card "Recusados"
   → Tooltip exibida: "Registros externos recusados na avaliação. Veja o motivo na ficha individual."

## TC3 — Validar não-clicabilidade dos cards no Admin
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [30, 37.2]

### Objetivo
Garantir que cards do Admin/Líder não respondem a clique, hover ou estados de seleção (RN 30).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin
   → Cards exibidos sem cursor pointer ao passar o mouse.
2. Passar o mouse sobre o card "Pendentes"
   → Nenhuma elevação/transform ocorre; cursor permanece default; apenas o tooltip aparece.
3. Clicar no card "Pendentes"
   → Nenhum efeito: lista não filtra, card não ganha estado "selected", nenhum card fica dimmed.

## TC4 — Validar que a contagem não reage a filtros do drawer
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [31]

### Objetivo
Garantir que a contagem do Admin é puramente informativa — não reage a filtros aplicados (RN 31).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e anotar os números dos 4 cards
   → Cards exibem as contagens totais da organização.
2. Aplicar o filtro padrão "Pendentes" pelo botão "Aplicar" do drawer de filtros
   → Lista filtra para registros pendentes.
3. Verificar os números dos 4 KPI cards "Emitidos", "Expirados", "Pendentes" e "Recusados"
   → Números permanecem exatamente os mesmos (não reagem ao filtro).
4. Preencher o campo de busca com o nome de uma pessoa
   → Lista filtra; números dos KPIs continuam inalterados.

## TC5 — Validar escopo da contagem do Líder (liderados diretos)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [22]

### Objetivo
Garantir que o Líder vê contagens cobrindo apenas os liderados diretos (RN 22).

### Passos
1. Acessar a tela "Aprendizagem > Registros" logado como Líder cuja equipe tem distribuição conhecida (ex: 18 Emitidos, 2 Pendentes, 0 Expirados, 0 Recusados)
   → Cards exibem "18", "0", "2", "0" — apenas registros dos liderados diretos.
2. Verificar os cards zerados ("Expirados" e "Recusados")
   → Exibem "0" com anel cinza completo, mantendo o mesmo peso visual dos demais.
3. Verificar o label "Carga horária total: {X} horas" no escopo do Líder
   → Soma cobre apenas as cargas horárias dos registros dos liderados.

## TC6 — Validar exclusão de pessoas inativadas da contagem
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [24]

### Objetivo
Garantir que registros de pessoas inativadas não contam no KPI nem aparecem na lista (RN 24).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin em organização com pessoa inativada que possui registros (ex: 3 Emitidos)
   → Números dos cards NÃO incluem os registros da pessoa inativada.
2. Preencher o campo de busca com o nome da pessoa inativada
   → Lista exibe "Nenhum registro encontrado".

## TC7 — Validar transição Emitido → Expirado ao cruzar a data de validade
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [25]

### Objetivo
Garantir que registro com data de validade vencida reflete como Expirado no KPI sem reload manual (RN 25 — Spike S1; estratégia de detecção é decisão do dev).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin com registro Emitido cuja data de validade vence no momento do teste (massa de dados manipulada)
   → Card "Emitidos" inclui o registro; card "Expirados" não.
2. Aguardar o registro cruzar a data de validade com a tela aberta (próximo ciclo de refresh)
   → Card "Emitidos" decrementa 1 e card "Expirados" incrementa 1, sem reload manual da página.

## TC8 — Validar estado "tudo zero" no Admin de organização nova
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [35, 35.4, 36, 37]

### Objetivo
Garantir que Admin de org recém-contratada (zero registros) vê os 4 cards zerados com anéis cinza completos (RN 36).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin de organização sem nenhum registro
   → Faixa exibe 4 cards com "0" em preto bold e anel cinza claro completo; sem dimming ou encolhimento.
2. Clicar em um dos cards zerados
   → Nenhum efeito (cards do Admin permanecem estáticos mesmo zerados).

## TC9 — Validar Líder com 0 liderados (todos os cards zerados)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [22, 36]

### Objetivo
Garantir que Líder recém-promovido sem time vê os 4 cards zerados (cenário 08 de h17).

### Passos
1. Acessar a tela "Aprendizagem > Registros" logado como Líder sem nenhum liderado direto
   → 4 cards exibem "0" com anéis cinza completos; lista exibe "Nenhum registro encontrado".

---

---
suite: Atualização de KPIs em tempo real (ações, expiração e batch)
executor: playwright
org: principal
playbooks:
  - toast-chakra
  - cleanup-dados
  - perfil-switch
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuário logado como Admin (cenários de avaliação/exclusão/massa) e usuário Aluno disponível (cenário de criação)
  - Registros Externos Pendentes disponíveis para aprovar/recusar (mínimo 5 para o cenário de batch)
  - Registros Externos elegíveis a exclusão (Emitido, Recusado ou Expirado)
  - Registro Emitido com data de validade no dia corrente (cenário de expiração)
  - Dados criados pelos testes são removidos ao final (cleanup)
---

# Atualização de KPIs em tempo real (ações, expiração e batch)

## TC1 — Validar incremento imediato do KPI após Adicionar (Aluno)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [32]

### Objetivo
Garantir que criar registro externo como Aluno incrementa "Pendentes" imediatamente, sem reload (RN 32).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e anotar o número do card "Pendentes"
   → Card exibe a contagem atual (ex: 2).
2. Clicar no botão "Adicionar"
   → Form "Adicionar registro de aprendizagem" é exibido.
3. Preencher o campo "Provedor de aprendizagem" com "Alura"
   → Provedor "Alura" fica selecionado.
4. Selecionar "Curso" no dropdown "Tipo de experiência"
   → Opção "Curso" fica selecionada.
5. Preencher o campo "Carga horária" com "40"
   → Campo exibe "40".
6. Preencher o campo "Data de término" com data válida (ex: "10/05/2026")
   → Campo exibe a data.
7. Clicar no botão "Enviar para aprovação"
   → Toast exibida: "Registro enviado para aprovação". Sistema retorna para a lista.
8. Verificar o número do card "Pendentes"
   → Número incrementou em 1 (ex: de 2 para 3) sem reload da página; donut redistribuiu as proporções.

## TC2 — Validar transição de KPI após Aprovar (-1 Pendentes, +1 Emitidos)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [32, 32.1]

### Objetivo
Garantir a transição imediata entre cards após aprovação individual (RN 32.1).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e anotar os números de "Pendentes" e "Emitidos"
   → Cards exibem as contagens atuais (ex: 12 Pendentes, 312 Emitidos).
2. Clicar no menu 3 pontos de um registro Externo Pendente
   → Menu exibe o item "Avaliar" em destaque.
3. Clicar no item "Avaliar"
   → Form "Avaliar registro" é exibido.
4. Selecionar "Curso" no dropdown "Tipo de experiência"
   → Opção fica selecionada.
5. Clicar no botão "Aprovar"
   → Toast exibida: "Registro aprovado". Sistema retorna para a lista.
6. Verificar os números dos cards "Pendentes" e "Emitidos"
   → "Pendentes" decrementou 1 e "Emitidos" incrementou 1 (ex: 11 e 313), no mesmo instante, sem reload.

## TC3 — Validar transição de KPI após Recusar (-1 Pendentes, +1 Recusados)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [32, 32.1]

### Objetivo
Garantir a transição imediata após recusa individual (RN 32.1).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e anotar "Pendentes" e "Recusados"
   → Cards exibem as contagens atuais.
2. Clicar no menu 3 pontos de um registro Externo Pendente
   → Menu exibe "Avaliar".
3. Clicar no item "Avaliar"
   → Form "Avaliar registro" é exibido.
4. Clicar no botão "Recusar"
   → Modal "Recusar registro" é exibido.
5. Preencher o campo "Justificativa" com "Evidências não comprovam a carga horária declarada"
   → Botão "Recusar registro" fica habilitado.
6. Clicar no botão "Recusar registro"
   → Modal fecha. Toast exibida: "Registro recusado". 
7. Verificar os números dos cards "Pendentes" e "Recusados"
   → "Pendentes" decrementou 1 e "Recusados" incrementou 1, sem reload.

## TC4 — Validar decremento do KPI após Excluir
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [32]

### Objetivo
Garantir que excluir registro decrementa o card do status atual imediatamente (RN 32).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e anotar o número do card "Recusados"
   → Card exibe a contagem atual.
2. Clicar no menu 3 pontos de um registro Externo Recusado
   → Menu exibe o item "Excluir".
3. Clicar no item "Excluir"
   → Modal "Excluir registro?" é exibido com alerta "Esta ação não pode ser desfeita.".
4. Clicar no botão "Excluir"
   → Toast exibida: "Registro excluído". Lista atualiza removendo a linha.
5. Verificar o número do card "Recusados"
   → Decrementou 1; total geral do donut também caiu em 1.

## TC5 — Validar atualização do KPI após Editar com mudança de status
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [32]

### Objetivo
Garantir que edição que altera status decrementa o card antigo e incrementa o novo (RN 32 — h05).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e anotar os números dos cards
   → Cards exibem as contagens atuais.
2. Clicar no item "Editar" do menu 3 pontos de um registro Externo Emitido
   → Form "Editar registro" é exibido pré-populado.
3. Preencher o campo "Data de validade" com data passada (ex: ontem)
   → Campo exibe a data.
4. Clicar no botão "Salvar"
   → Toast exibida: "Registro salvo".
5. Verificar os números dos cards "Emitidos" e "Expirados"
   → Card do status anterior decrementa e o do novo status incrementa conforme a transição efetiva.

## TC6 — Validar refresh único do KPI após ações em massa
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [32.2, 32.3]

### Objetivo
Garantir que batch de N registros gera UM único refresh do KPI com todos os deltas, e não N refreshes (RN 32.3).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin com 5 registros Externos Pendentes e anotar "Pendentes" e "Emitidos"
   → Cards exibem as contagens atuais (ex: 12 e 312).
2. Marcar o checkbox de 5 registros Pendentes
   → 5 linhas selecionadas.
3. Clicar no botão "Ações em massa"
   → Drawer "Ações em massa" abre com ação "Aprovar registros" e escopo "Selecionados (5)".
4. Clicar no botão "Aplicar"
   → Toast exibida: "5 registros aprovados". 
5. Verificar os números dos cards "Pendentes" e "Emitidos"
   → "Pendentes" caiu 5 e "Emitidos" subiu 5 em uma única atualização (ex: 7 e 317), sem refreshes intermediários por registro.

## TC7 — Validar KPI refletindo apenas o processado em batch parcial
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [32.3]

### Objetivo
Garantir que em batch com itens inelegíveis o KPI reflete apenas os efetivamente processados (h05 + RN 74).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e marcar 7 registros (4 Pendentes + 3 Emitidos)
   → 7 linhas selecionadas.
2. Clicar no botão "Ações em massa"
   → Drawer abre com escopo "Selecionados (7)".
3. Aplicar a ação "Aprovar registros" pelo botão "Aplicar" do drawer
   → Toast exibida: "4 registros aprovados (3 ignorados por não atender aos critérios da ação)".
4. Verificar os números dos cards "Pendentes" e "Emitidos"
   → "Pendentes" caiu exatamente 4 e "Emitidos" subiu exatamente 4 (os 3 Emitidos ignorados não geram delta).

## TC8 — Validar transição automática Emitido → Expirado com tela aberta
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [33]

### Objetivo
Garantir que registro cruzando a data de validade durante sessão aberta migra de Emitidos para Expirados sem reload (RN 33 — Spike S1).

### Passos
1. Acessar a tela "Meu histórico" como Aluno com 1 registro Emitido cuja validade expira durante o teste (massa manipulada)
   → Card "Emitidos" inclui o registro.
2. Manter a tela aberta até o registro cruzar a data de validade (próximo ciclo de refresh)
   → Card "Emitidos" decrementa 1 e "Expirados" incrementa 1 sem reload manual; donut redistribui.

## TC9 — Validar refresh do KPI do Líder após mudança de hierarquia
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [34]

### Objetivo
Garantir que adição/remoção de liderado reflete no KPI do Líder no próximo refresh natural (RN 34 — Spike S4; política exata é decisão do dev).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Líder e anotar os números dos cards
   → Cards refletem os liderados atuais.
2. Remover um liderado (com 3 Emitidos e 1 Pendente) da equipe do Líder via estrutura organizacional (operação administrativa externa)
   → Operação concluída no sistema de estrutura organizacional.
3. Aguardar o próximo refresh natural da tela do Líder (ou recarregar a página)
   → KPI do Líder reduz: -3 Emitidos, -1 Pendente; lista não exibe mais os registros daquela pessoa.

---

---
suite: Adicionar registro de aprendizagem (3 perfis, validações e origem inferida)
executor: playwright
org: principal
playbooks:
  - toast-chakra
  - cleanup-dados
  - perfil-switch
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuários disponíveis nos 3 perfis (Aluno, Admin, Líder com liderados diretos)
  - Provedores padrão cadastrados (Alura, Coursera, FGV, LinkedIn Learning, Udemy, USP)
  - Arquivo de teste "certificado_teste.pdf" (< 10 MB) disponível para upload
  - Registros criados pelos testes são removidos ao final (cleanup)
---

# Adicionar registro de aprendizagem (3 perfis, validações e origem inferida)

## TC1 — Validar acionamento e form do Aluno (modo aluno)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [38]

### Objetivo
Garantir que o Aluno abre o form em modo aluno com cabeçalho correto, sem campo Pessoa e com botões certos no rodapé (RN 38, RN 39).

### Passos
1. Acessar a tela "Meu histórico" como Aluno
   → Tela exibida com botão "Adicionar".
2. Clicar no botão "Adicionar"
   → Form abre como tela dedicada com cabeçalho "Adicionar registro de aprendizagem", seta "Voltar" à esquerda e breadcrumb com segmento "Adicionar".
3. Verificar a presença do campo "Pessoa"
   → Campo "Pessoa" NÃO é exibido (exclusivo do modo admin).
4. Verificar os botões do rodapé "Enviar para aprovação" e "Cancelar"
   → Botão principal "Enviar para aprovação" (roxo sólido) + botão "Cancelar" (outline); botão "Excluir" NÃO é exibido.

## TC2 — Validar acionamento e form do Admin (modo admin-adicionar)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [38, 39]

### Objetivo
Garantir que o Admin abre o form com cabeçalho "Adicionar registro", campo Pessoa obrigatório e botão "Salvar e aprovar" (RN 38).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin
   → Tela exibida.
2. Clicar no botão "Adicionar"
   → Form abre com cabeçalho "Adicionar registro" e breadcrumb "Aprendizagem" > "Registros" > "Adicionar".
3. Verificar o campo "Pessoa"
   → Campo "Pessoa" é exibido com asterisco de obrigatório e placeholder "Selecione o colaborador"; dropdown lista os colaboradores da organização.
4. Verificar os botões do rodapé "Salvar e aprovar" e "Cancelar"
   → Botão principal "Salvar e aprovar" (roxo sólido) + "Cancelar" (outline).

## TC3 — Validar dropdown Pessoa do Líder restrito a liderados
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [38, 93]

### Objetivo
Garantir que Líder só vê os liderados diretos no dropdown "Pessoa" (RN 38, RN 93).

### Passos
1. Acessar a tela "Aprendizagem > Registros" logado como Líder
   → Tela exibida.
2. Clicar no botão "Adicionar"
   → Form "Adicionar registro" é exibido.
3. Clicar no campo "Pessoa"
   → Dropdown exibe SOMENTE os liderados diretos do Líder; colaboradores fora da equipe não aparecem.

## TC4 — Validar presença, placeholders e tooltips de todos os campos do form
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [39]

### Objetivo
Garantir presença e propriedades dos campos do form do Admin conforme protótipo (RN 39 + recon §2).

### Passos
1. Acessar o form "Adicionar registro" como Admin
   → Form exibe os campos: "Pessoa", "Website", "Comprovação de aprendizagem" (área de upload), "Provedor de aprendizagem", "Descrição do conteúdo", "Tipo de experiência", "Categorias", "Carga horária", "Nota", "Valor do conteúdo", grupo "Datas" (Data de início, Data de término, Data de aprovação, Data do certificado, Data de validade) e "Anotações".
2. Verificar os placeholders dos campos "Pessoa", "Website", "Provedor de aprendizagem", "Carga horária", "Nota", "Valor do conteúdo" e "Categorias"
   → "Pessoa": "Selecione o colaborador"; "Website": "http://website.com"; "Provedor de aprendizagem": "Escolha ou adicione um provedor de aprendizagem. Exemplo: FGV"; "Carga horária": "Ex: 40"; "Nota": "Ex: 85" com sufixo "%"; "Valor do conteúdo": "Informe o valor investido (ex: 1.500,00)"; "Categorias": "Selecione ou crie categorias".
3. Verificar o asterisco de obrigatório nos campos "Pessoa", "Provedor de aprendizagem", "Tipo de experiência", "Carga horária" e "Data de término"
   → "Pessoa", "Provedor de aprendizagem", "Tipo de experiência", "Carga horária" e "Data de término" exibem asterisco.
4. Passar o mouse sobre o ícone de ajuda do label "Carga horária"
   → Tooltip exibida: "Total de horas da formação".
5. Verificar a área de upload "Comprovação de aprendizagem"
   → Texto exibido: "Formato aceito: .pdf, .docx, .xlsx, .csv, .jpg, .jpeg, .png. Tamanho máximo: 10 MB. Quantidade máxima: 5 arquivos." e botão "Arraste o arquivo ou clique para selecionar".

## TC5 — Validar as 8 opções fixas de "Tipo de experiência"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [39.1]

### Objetivo
Garantir a lista fixa de opções do select "Tipo de experiência" (RN 39.1).

### Passos
1. Acessar o form "Adicionar registro" como Admin
   → Form exibido.
2. Clicar no dropdown "Tipo de experiência"
   → Dropdown exibe placeholder "Selecione o tipo" e exatamente 8 opções: "Curso", "Trilha", "Workshop", "Mentoria", "Palestra", "Evento", "Aula", "Outro".

## TC6 — Validar categorias padrão e criação inline de categoria
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [39.2]

### Objetivo
Garantir as 9 categorias padrão, criação inline e remoção de chips (RN 39.2).

### Passos
1. Acessar o form "Adicionar registro" como Admin
   → Form exibido.
2. Clicar no campo "Categorias"
   → Dropdown exibe as 9 categorias padrão: "Liderança", "Comunicação", "Tecnologia", "Gestão", "Soft skills", "Compliance", "Idiomas", "Saúde e bem-estar", "Diversidade".
3. Selecionar "Tecnologia" e "Gestão"
   → Dois chips são exibidos no campo, cada um com botão de remover.
4. Preencher o campo "Categorias" com "Categoria QA Nova" e confirmar a criação inline
   → Chip "Categoria QA Nova" é adicionado ao campo.
5. Clicar no botão de remover do chip "Gestão"
   → Chip "Gestão" é removido; demais permanecem.

## TC7 — Validar provedores padrão e criação inline de provedor
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [39.3]

### Objetivo
Garantir a lista de provedores padrão e a criação inline via "Criar {nome}" (RN 39.3).

### Passos
1. Acessar o form "Adicionar registro de aprendizagem" como Aluno
   → Form exibido.
2. Clicar no campo "Provedor de aprendizagem"
   → Dropdown lista os provedores padrão (ex: "Alura", "Coursera", "FGV", "LinkedIn Learning", "Udemy", "USP") e provedores criados anteriormente.
3. Preencher o campo "Provedor de aprendizagem" com "Provedor QA Inline"
   → Opção "Criar “Provedor QA Inline”" aparece no fim do dropdown.
4. Clicar na opção "Criar “Provedor QA Inline”"
   → Provedor "Provedor QA Inline" fica selecionado no campo.

## TC8 — Validações do campo "Carga horária"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [40]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Vazio | A | "" | Borda vermelha + "Campo obrigatório"; salvamento bloqueado |
| Só espaços | A | "   " | Tratado como vazio: "Campo obrigatório" |
| Texto | E | "abc" | Valor rejeitado pelo input numérico (não aceita ou erro de validação) |
| Negativo | E | "-5" | Erro de validação; salvamento bloqueado |
| Zero | B | "0" | Erro ou rejeição (carga deve ser > 0) |
| Mínimo válido | B | "1" | Aceito; permite salvar |
| Valor alto | B | "9999" | Aceito |
| Decimal | E | "8,5" | Comportamento consistente (aceita ou rejeita com mensagem clara) |

### Objetivo
Validar a matriz completa de entradas do campo "Carga horária" — categorias A, B, E conforme cenarios-negativos-twygo.

### Passos
1. Acessar o form "Adicionar registro" como Admin
   → Form exibido com campo "Carga horária" vazio.
2. Submeter o formulário pelo botão "Salvar e aprovar" com o campo "Carga horária" preenchido com o input de cada linha da Validation matrix
   → Comportamento bate com a coluna "Esperado" da matriz; quando inválido, borda vermelha + mensagem "Campo obrigatório" (ou rejeição do input) e o registro NÃO é salvo.

## TC9 — Validações do campo "Nota"
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [39]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Vazio | A | "" | Aceito (campo opcional); permite salvar |
| Texto | E | "abc" | Rejeitado pelo input numérico |
| Negativo | E | "-10" | Erro de validação ou rejeição |
| Zero | B | "0" | Aceito |
| Limite superior | B | "100" | Aceito |
| Acima do limite | B | "101" | Erro de validação ou rejeição (nota é percentual) |

### Objetivo
Validar a matriz de entradas do campo opcional "Nota" (percentual 0–100).

### Passos
1. Acessar o form "Adicionar registro" como Admin com os campos obrigatórios preenchidos com valores válidos
   → Form pronto para submissão.
2. Submeter o formulário pelo botão "Salvar e aprovar" com o campo "Nota" preenchido com o input de cada linha da Validation matrix
   → Comportamento bate com a coluna "Esperado"; em caso válido o registro é salvo e em caso inválido o salvamento é bloqueado com feedback no campo.

## TC10 — Validações do campo "Data de término"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [40]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Vazio | A | "" | Borda vermelha + "Campo obrigatório"; salvamento bloqueado |
| Data válida passada | B | "2026-05-30" | Aceito; permite salvar |
| Data futura | B | "2027-12-31" | Comportamento consistente (aceito ou erro com mensagem clara) |
| Data inválida | E | "31/02/2026" | Input date rejeita a data inexistente |

### Objetivo
Validar a matriz do campo obrigatório "Data de término" (categorias A, B, E).

### Passos
1. Acessar o form "Adicionar registro" como Admin com os demais obrigatórios preenchidos
   → Form pronto.
2. Submeter o formulário pelo botão "Salvar e aprovar" com o campo "Data de término" preenchido com o input de cada linha da Validation matrix
   → Comportamento bate com a coluna "Esperado"; vazio bloqueia com "Campo obrigatório".

## TC11 — Validar obrigatórios do Aluno em conjunto e erro por campo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [40]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Todos vazios | A | (nenhum campo preenchido) | "Provedor de aprendizagem", "Tipo de experiência", "Carga horária" e "Data de término" exibem borda vermelha + "Campo obrigatório" simultaneamente |
| Só Provedor vazio | A | demais válidos, Provedor = "" | Apenas "Provedor de aprendizagem" exibe "Campo obrigatório" |
| Só Tipo vazio | A | demais válidos, Tipo = "Selecione o tipo" | Apenas "Tipo de experiência" exibe "Campo obrigatório" |

### Objetivo
Garantir mensagem específica por campo obrigatório no form do Aluno, inclusive com múltiplos campos vazios simultâneos (RN 40).

### Passos
1. Acessar o form "Adicionar registro de aprendizagem" como Aluno
   → Form vazio exibido.
2. Clicar no botão "Enviar para aprovação" sem preencher nenhum campo
   → Campos "Provedor de aprendizagem", "Tipo de experiência", "Carga horária" e "Data de término" exibem borda vermelha e mensagem "Campo obrigatório"; o registro não é enviado.
3. Submeter o formulário pelo botão "Enviar para aprovação" preenchido conforme a coluna Input de cada linha restante da Validation matrix
   → Apenas o campo vazio da linha exibe "Campo obrigatório"; os preenchidos não exibem erro.

## TC12 — Validar limpeza do erro ao digitar (clearError)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [40]

### Objetivo
Garantir que a mensagem de erro some assim que o usuário começa a corrigir o campo (RN 40).

### Passos
1. Acessar o form "Adicionar registro de aprendizagem" como Aluno
   → Form exibido.
2. Clicar no botão "Enviar para aprovação" com o campo "Carga horária" vazio
   → Campo "Carga horária" exibe borda vermelha + "Campo obrigatório".
3. Preencher o campo "Carga horária" com "4"
   → Mensagem "Campo obrigatório" some e a borda vermelha é removida imediatamente (sem precisar submeter de novo).

## TC13 — Validar que Cancelar bypassa a validação
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [40.1]

### Objetivo
Garantir que "Cancelar" fecha o form sem disparar validação de obrigatórios (RN 40.1).

### Passos
1. Acessar o form "Adicionar registro de aprendizagem" como Aluno
   → Form vazio exibido.
2. Preencher o campo "Carga horária" com "10" (formulário sujo, obrigatórios ainda vazios)
   → Campo exibe "10".
3. Clicar no botão "Cancelar"
   → Sistema retorna para a lista "Meu histórico" sem exibir nenhuma mensagem "Campo obrigatório" e sem criar registro.

## TC14 — Validar origem inferida e status inicial do Aluno (Externo + Pendente)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [38, 41]

### Objetivo
Garantir que registro criado pelo Aluno entra como Externo + Pendente com toast correta (RN 41, RN 38).

### Passos
1. Acessar o form "Adicionar registro de aprendizagem" como Aluno e preencher os obrigatórios (Provedor "Alura", Tipo "Curso", Carga horária "40", Data de término válida)
   → Campos exibem os valores informados; nenhuma mensagem "Campo obrigatório" é exibida.
2. Clicar no botão "Enviar para aprovação"
   → Toast exibida: "Registro enviado para aprovação". Sistema retorna para a lista.
3. Localizar o registro recém-criado na lista
   → Linha exibe chip de origem "Externo" e chip de situação "Pendente".

## TC15 — Validar origem inferida e status inicial do Admin (Externo + Emitido/Aprovado)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [38, 41]

### Objetivo
Garantir que registro criado pelo Admin entra como Externo + Emitido com situação Aprovado e toast correta (RN 38, RN 41).

### Passos
1. Acessar o form "Adicionar registro" como Admin e preencher Pessoa, Provedor, Tipo, Carga horária e Data de término com valores válidos
   → Campos exibem os valores informados; nenhuma mensagem "Campo obrigatório" é exibida.
2. Clicar no botão "Salvar e aprovar"
   → Toast exibida: "Registro adicionado — O registro entrou como aprovado no histórico do colaborador." Sistema retorna para a lista.
3. Localizar o registro recém-criado na lista
   → Linha exibe chip de origem "Externo", situação do registro "Aprovado" e o nome do Admin na coluna "Criado por".

## TC16 — Validar anexo e remoção de evidências na drag area
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [58, 58.1, 58.2]

### Objetivo
Garantir o fluxo de anexar arquivos via picker e remover via botão X (RN 58).

### Passos
1. Acessar o form "Adicionar registro de aprendizagem" como Aluno
   → Área de upload "Comprovação de aprendizagem" exibida.
2. Fazer upload do arquivo "certificado_teste.pdf" no campo "Comprovação de aprendizagem"
   → Lista de arquivos exibe "certificado_teste.pdf" com ícone e botão de remover (X).
3. Fazer upload de um segundo arquivo "evidencia_2.pdf"
   → Lista exibe os 2 arquivos.
4. Clicar no botão X do arquivo "evidencia_2.pdf"
   → Arquivo some da lista; "certificado_teste.pdf" permanece.

---

---
suite: Editar registro de aprendizagem (matriz perfil × origem × status e banners)
executor: playwright
org: principal
playbooks:
  - toast-chakra
  - cleanup-dados
  - perfil-switch
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuários disponíveis nos perfis Aluno e Admin
  - Aluno possui registros Externos nos status Pendente, Recusado (com justificativa registrada), Expirado e Emitido
  - Aluno possui ao menos 1 registro Interno e 1 Compartilhado
  - Admin tem acesso a registros Externos Emitido, Recusado, Expirado, Pendente e Substituído
  - Registro com provedor fora da lista padrão (ex. "UFSC") para o cenário de pré-população
---

# Editar registro de aprendizagem (matriz perfil × origem × status e banners)

## TC1 — Validar disponibilidade do "Editar" para o Aluno (matriz origem × status)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [42]

### Objetivo
Garantir que o item "Editar" do menu 3 pontos do Aluno aparece apenas para Externo + (Pendente | Recusado | Expirado) e não é renderizado nos demais casos (RN 42).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e clicar no menu 3 pontos de um registro Externo Pendente
   → Menu exibe o item "Editar".
2. Clicar no menu 3 pontos de um registro Externo Recusado
   → Menu exibe o item "Editar".
3. Clicar no menu 3 pontos de um registro Externo Expirado
   → Menu exibe o item "Editar".
4. Clicar no menu 3 pontos de um registro Externo Emitido
   → Item "Editar" NÃO é exibido no menu (sem disabled — simplesmente ausente).
5. Clicar no menu 3 pontos de um registro Interno
   → Item "Editar" NÃO é exibido.
6. Clicar no menu 3 pontos de um registro Compartilhado
   → Item "Editar" NÃO é exibido.

## TC2 — Validar disponibilidade do "Editar" para o Admin (matriz origem × status)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [42]

### Objetivo
Garantir que Admin vê "Editar" apenas em Externo + (Emitido | Recusado | Expirado); Pendente usa "Avaliar"; Substituído/Interno/Compartilhado não editam (RN 42).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e clicar no menu 3 pontos de um registro Externo Emitido
   → Menu exibe o item "Editar".
2. Clicar no menu 3 pontos de um registro Externo Recusado
   → Menu exibe "Editar".
3. Clicar no menu 3 pontos de um registro Externo Expirado
   → Menu exibe "Editar".
4. Clicar no menu 3 pontos de um registro Externo Pendente
   → Menu exibe "Avaliar" como item primário e NÃO exibe "Editar".
5. Clicar no menu 3 pontos de um registro Externo Substituído
   → Item "Editar" NÃO é exibido.
6. Clicar no menu 3 pontos de um registro Interno
   → Item "Editar" NÃO é exibido.

## TC3 — Validar cabeçalhos do form de edição por perfil
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [42]

### Objetivo
Garantir os cabeçalhos "Editar registro de aprendizagem" (Aluno) e "Editar registro" (Admin) (RN 42).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e clicar em "Editar" no menu de um registro Externo Pendente
   → Form abre com cabeçalho "Editar registro de aprendizagem".
2. Acessar a tela "Aprendizagem > Registros" como Admin e clicar em "Editar" no menu de um registro Externo Emitido
   → Form abre com cabeçalho "Editar registro".

## TC4 — Validar pré-população dos campos na edição
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [43]

### Objetivo
Garantir que o form abre com todos os campos preenchidos, datas convertidas para o input date e provedor fora da lista padrão pré-selecionado (RN 43).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e clicar em "Editar" de um registro Externo Pendente com todos os campos preenchidos e provedor "UFSC" (fora da lista padrão)
   → Form abre com todos os campos pré-populados com os valores do registro.
2. Verificar o campo "Provedor de aprendizagem"
   → Provedor "UFSC" aparece selecionado no dropdown (entrou via lista de provedores extras).
3. Verificar os campos de data "Data de início", "Data de término", "Data do certificado" e "Data de validade"
   → Datas exibem os valores do registro no formato do input date (dd/mm/aaaa visível).

## TC5 — Validar campo Pessoa desabilitado na edição do Admin
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [43]

### Objetivo
Garantir que registro existente tem dono fixo — campo "Pessoa" disabled em admin-editar (RN 43).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e clicar em "Editar" de um registro Externo Emitido
   → Form "Editar registro" abre pré-populado.
2. Verificar o campo "Pessoa"
   → Campo exibe a pessoa do registro e está desabilitado (não permite troca).

## TC6 — Validar validação de obrigatórios na edição
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [40, 43]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Provedor limpo | A | apagar valor do campo | Borda vermelha + "Campo obrigatório"; salvamento bloqueado |
| Carga horária limpa | A | apagar valor | "Campo obrigatório" |
| Data de término limpa | A | apagar valor | "Campo obrigatório" |

### Objetivo
Garantir que a mesma matriz de obrigatórios da criação vale na edição (RN 43 + RN 40).

### Passos
1. Acessar o form de edição de um registro Externo Pendente como Aluno
   → Form pré-populado.
2. Para cada linha da Validation matrix, limpar o campo indicado e clicar no botão "Salvar edição"
   → Campo exibe borda vermelha + "Campo obrigatório" e a edição não é salva.

## TC7 — Validar labels dinâmicos e toasts de salvamento por perfil
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [44]

### Objetivo
Garantir labels "Salvar edição"/"Salvar" e toasts "Edição salva"/"Registro salvo" conforme o perfil (RN 44).

### Passos
1. Acessar o form de edição como Aluno (registro Externo Pendente)
   → Rodapé exibe botão principal "Salvar edição" (roxo).
2. Selecionar "Workshop" no dropdown "Tipo de experiência"
   → Opção fica selecionada.
3. Clicar no botão "Salvar edição"
   → Toast exibida: "Edição salva". Sistema retorna para a lista.
4. Acessar o form de edição como Admin (registro Externo Emitido)
   → Rodapé exibe botão principal "Salvar" (roxo).
5. Selecionar "Mentoria" no dropdown "Tipo de experiência"
   → Opção fica selecionada.
6. Clicar no botão "Salvar"
   → Toast exibida: "Registro salvo". Sistema retorna para a lista; a linha reflete o valor alterado.

## TC8 — Validar presença condicional do botão "Excluir" no rodapé
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [45]

### Objetivo
Garantir que o "Excluir" do rodapé só aparece quando a regra de exclusão permite — sem disabled+tooltip (RN 45, RN 55).

### Passos
1. Acessar o form de edição como Aluno de um registro Externo Pendente
   → Rodapé exibe botão "Excluir" (vermelho) além de "Salvar edição" e "Cancelar".
2. Acessar o form de edição como Aluno de um registro Externo Recusado
   → Botão "Excluir" NÃO é exibido (aluno só exclui Pendente).
3. Acessar o form de edição como Admin de um registro Externo Emitido
   → Rodapé exibe botão "Excluir".

## TC9 — Validar banner vermelho de registro Recusado com justificativa
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [46]

### Objetivo
Garantir o banner vermelho com título, justificativa do evento de recusa e botão "Histórico" (RN 46).

### Passos
1. Acessar o form de edição como Aluno de um registro Externo Recusado (justificativa registrada: "As evidências enviadas não comprovam a carga horária declarada.")
   → Banner vermelho é exibido no topo do form com título "Registro de aprendizagem recusado" e o texto da justificativa.
2. Verificar o botão "Histórico" à direita do banner
   → Botão "Histórico" (outline roxo) é exibido.
3. Clicar no botão "Histórico"
   → Drawer "Histórico - {conteúdo}" abre exibindo a trilha do registro, incluindo o evento de recusa com a justificativa.

## TC10 — Validar banner verde de registro Emitido
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [46]

### Objetivo
Garantir o banner verde "Certificado aprovado" com botão "Histórico" em registro Emitido (RN 46).

### Passos
1. Acessar o form de edição como Admin de um registro Externo Emitido
   → Banner verde é exibido no topo com o texto "Certificado aprovado" e botão "Histórico" à direita.
2. Clicar no botão "Histórico" do banner
   → Drawer "Histórico - {conteúdo}" abre com a trilha do registro.

---

---
suite: Visualizar registro de aprendizagem (standalone vs form em modo leitura)
executor: playwright
org: principal
playbooks:
  - perfil-switch
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuários disponíveis nos perfis Aluno e Admin
  - Aluno possui registros Interno Emitido, Externo Emitido, Externo Recusado (com justificativa), Externo "Em andamento" e Compartilhado
  - Registros Internos/Compartilhados possuem token de certificado válido emitido
---

# Visualizar registro de aprendizagem (standalone vs form em modo leitura)

## TC1 — Validar matriz de disponibilidade do "Visualizar" no menu
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [47]

### Objetivo
Garantir a disponibilidade do "Visualizar" por origem/status, incluindo o disabled com tooltip para "Em andamento" (RN 47).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e clicar no menu 3 pontos de um registro Interno Emitido
   → Item "Visualizar" é exibido habilitado.
2. Clicar no menu 3 pontos de um registro Externo Emitido
   → Item "Visualizar" é exibido habilitado.
3. Clicar no menu 3 pontos de um registro Compartilhado
   → Item "Visualizar" é exibido habilitado.
4. Clicar no menu 3 pontos de um registro com status "Em andamento"
   → Item "Visualizar" aparece desabilitado; tooltip exibida: "Disponível após a conclusão".

## TC2 — Validar abertura da tela standalone para registro Interno
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [47, 49]

### Objetivo
Garantir que Interno abre a tela standalone do certificado em nova aba com layout completo (RN 49).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e clicar em "Visualizar" no menu de um registro Interno Emitido
   → Nova aba abre com URL contendo "?cert=" e layout standalone: TopBar sem sidebar.
2. Verificar o sub-card do certificado "CERTIFICADO DE CONCLUSÃO" à esquerda
   → Card exibe cintas roxas no topo e rodapé, título "CERTIFICADO DE CONCLUSÃO" em bold e texto "Certificamos que {nome}, concluiu o conteúdo {curso} no dia {data}, com carga horária total de {X}h".
3. Verificar a área "Validação de certificado" à direita
   → Área exibe título "Validação de certificado", alerta verde "{token} é um certificado válido" e botões "Baixar o certificado", "Validar outro certificado" e "Compartilhar no LinkedIn".

## TC3 — Validar "Validar outro certificado" fechando a aba
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [49]

### Objetivo
Garantir que o botão "Validar outro certificado" fecha a aba standalone (RN 49).

### Passos
1. Abrir a tela standalone de um certificado Interno via menu "Visualizar"
   → Nova aba exibe a tela do certificado.
2. Clicar no botão "Validar outro certificado"
   → A aba do certificado é fechada (window.close).

## TC4 — Validar standalone para registro Compartilhado
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [47, 98]

### Objetivo
Garantir que Compartilhado abre a mesma tela standalone do Interno (RN 47).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e clicar em "Visualizar" no menu de um registro Compartilhado
   → Nova aba abre com a tela standalone do certificado (mesmo layout do Interno).

## TC5 — Validar form em modo viewing para registro Externo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [47, 48]

### Objetivo
Garantir o modo somente leitura do form para Externo: campos disabled, elementos editáveis escondidos e rodapé ausente (RN 48).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e clicar em "Visualizar" no menu de um registro Externo Emitido
   → Form abre na mesma aba com cabeçalho "Visualizar registro".
2. Verificar os campos do form "Visualizar registro"
   → Todos os inputs/selects/editores aparecem desabilitados com fundo cinza.
3. Verificar a toolbar do editor de texto rico do campo "Descrição do conteúdo"
   → Toolbar NÃO é exibida.
4. Verificar o card promocional "Preencher com IA"
   → Card NÃO é exibido.
5. Verificar a área de upload "Comprovação de aprendizagem"
   → Drop zone NÃO é exibida; lista de arquivos permanece visível sem botão X de remoção.
6. Verificar o rodapé do form "Visualizar registro"
   → Botões "Salvar", "Excluir" e "Cancelar" NÃO são exibidos; saída apenas pela seta "Voltar" do header.
7. Verificar o banner contextual "Certificado aprovado"
   → Banner verde "Certificado aprovado" é exibido (status Emitido).

## TC6 — Validar banner vermelho no viewing de registro Recusado
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [48]

### Objetivo
Garantir banner vermelho com justificativa no modo viewing de registro Recusado (RN 48).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e clicar em "Visualizar" no menu de um registro Externo Recusado
   → Form abre em modo leitura com banner vermelho "Registro de aprendizagem recusado" + justificativa da recusa.

## TC7 — Validar viewing do Admin (modo admin-visualizar)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [47, 48]

### Objetivo
Garantir que Admin também abre Externo em modo somente leitura.

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e clicar em "Visualizar" no menu de um registro Externo Emitido
   → Form abre com cabeçalho "Visualizar registro", todos os campos desabilitados e rodapé sem botões de ação.

---

---
suite: Avaliar registro externo pendente (Aprovar/Recusar com justificativa)
executor: playwright
org: principal
playbooks:
  - toast-chakra
  - cleanup-dados
  - perfil-switch
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuário logado como Admin
  - Usuário Líder disponível com liderados diretos (e registro pendente de pessoa fora da equipe para o cenário negativo)
  - Registros Externos Pendentes disponíveis (criados por aluno, com evidências anexadas e campos preenchidos)
  - Registros usados nos testes são restaurados/removidos ao final (cleanup)
---

# Avaliar registro externo pendente (Aprovar/Recusar com justificativa)

## TC1 — Validar disponibilidade do "Avaliar" como item primário do menu
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [50, 50.1]

### Objetivo
Garantir que "Avaliar" aparece em destaque no topo do menu apenas para Externo + Pendente no perfil Admin/Líder (RN 50).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e clicar no menu 3 pontos de um registro Externo Pendente
   → Item "Avaliar" é exibido como primeiro item do menu, em destaque com ícone na cor roxa; itens "Visualizar", "Evidências" e "Histórico" aparecem abaixo; "Editar" e "Excluir" NÃO aparecem.
2. Clicar no menu 3 pontos de um registro Externo Emitido
   → Item "Avaliar" NÃO é exibido.
3. Clicar no menu 3 pontos de um registro Interno Pendente
   → Item "Avaliar" NÃO é exibido (não é Externo).
4. Acessar a tela "Meu histórico" como Aluno e clicar no menu 3 pontos de um registro Externo Pendente
   → Item "Avaliar" NÃO é exibido (exclusivo Admin/Líder).

## TC2 — Validar form em modo avaliação (banner, campos e rodapé)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [51]

### Objetivo
Garantir a estrutura do modo admin-avaliar: cabeçalho, banner amarelo, somente Tipo + Categorias editáveis e 3 botões no rodapé (RN 51).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e clicar em "Avaliar" no menu de um registro Externo Pendente
   → Form abre com cabeçalho "Avaliar registro".
2. Verificar o banner "Avaliação pendente" no topo
   → Banner amarelo "Avaliação pendente" é exibido com texto orientando a editar Tipo de experiência e Categorias antes de aprovar.
3. Verificar os campos editáveis "Tipo de experiência" e "Categorias"
   → Apenas "Tipo de experiência" e "Categorias" estão habilitados; todos os demais campos (Pessoa, Provedor, Carga horária, datas etc.) aparecem desabilitados com os valores preenchidos pelo aluno.
4. Verificar a lista de evidências do form "Avaliar registro"
   → Arquivos anexados pelo aluno são listados em modo somente leitura.
5. Verificar o rodapé com os botões "Aprovar", "Recusar" e "Cancelar"
   → 3 botões: "Aprovar" (verde), "Recusar" (vermelho outline) e "Cancelar" (outline neutro).

## TC3 — Validar obrigatoriedade do Tipo de experiência ao Aprovar
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [54]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Tipo vazio | A | "Selecione o tipo" | Borda vermelha + "Campo obrigatório" no Tipo de experiência; aprovação bloqueada |
| Tipo preenchido | A | "Curso" | Aprovação prossegue |

### Objetivo
Garantir que apenas "Tipo de experiência" é validado ao aprovar — demais campos disabled não passam pela validação (RN 54).

### Passos
1. Acessar o form "Avaliar registro" de um registro Externo Pendente sem Tipo de experiência preenchido
   → Form em modo avaliação exibido.
2. Clicar no botão "Aprovar" com o campo "Tipo de experiência" vazio
   → Campo "Tipo de experiência" exibe borda vermelha + "Campo obrigatório"; o registro NÃO é aprovado.
3. Selecionar "Curso" no dropdown "Tipo de experiência"
   → Mensagem de erro some.
4. Clicar no botão "Aprovar"
   → Aprovação prossegue (toast de sucesso).

## TC4 — Validar fluxo completo de aprovação
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [53]

### Objetivo
Garantir que aprovar transforma o registro em Emitido/Aprovado com toast e atualização do KPI (RN 53).

### Passos
1. Acessar o form "Avaliar registro" de um registro Externo Pendente como Admin
   → Form em modo avaliação.
2. Selecionar "Curso" no dropdown "Tipo de experiência"
   → Opção selecionada.
3. Marcar "Tecnologia" no campo "Categorias"
   → Chip "Tecnologia" adicionado.
4. Clicar no botão "Aprovar"
   → Toast exibida: "Registro aprovado". Sistema retorna para a lista.
5. Localizar o registro avaliado na lista
   → Linha exibe situação do registro "Aprovado" e situação do certificado "Emitido".

## TC5 — Validar estrutura e bloqueio do modal de Recusa
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [52]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Justificativa vazia | A | "" | Botão "Recusar registro" desabilitado |
| Justificativa só espaços | A | "   " | Botão permanece desabilitado (ou recusa bloqueada) |
| Justificativa preenchida | A | "Texto válido" | Botão habilitado; recusa prossegue |

### Objetivo
Garantir o modal de recusa com Justificativa obrigatória e botão desabilitado enquanto vazia (RN 52).

### Passos
1. Acessar o form "Avaliar registro" de um registro Externo Pendente e clicar no botão "Recusar"
   → Modal "Recusar registro" é exibido com aviso "Esta ação não pode ser desfeita." e texto "A justificativa fica visível no histórico do registro pro colaborador."; campo "Justificativa" com placeholder "Explique por que o registro foi recusado".
2. Verificar o botão "Recusar registro" com a Justificativa vazia
   → Botão está desabilitado.
3. Preencher o campo "Justificativa" com "As evidências não comprovam a carga horária declarada."
   → Botão "Recusar registro" fica habilitado.
4. Clicar no botão "Cancelar" do modal
   → Modal fecha sem recusar; justificativa é descartada.

## TC6 — Validar fluxo completo de recusa e visibilidade da justificativa
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [52, 53]

### Objetivo
Garantir que recusar muda o status para Recusado, exibe toast e a justificativa alimenta o histórico e o banner visto pelo aluno (RN 52, RN 53).

### Passos
1. Acessar o form "Avaliar registro" de um registro Externo Pendente como Admin e clicar no botão "Recusar"
   → Modal "Recusar registro" é exibido.
2. Preencher o campo "Justificativa" com "Plano de desenvolvimento não cobre essa formação."
   → Botão "Recusar registro" habilitado.
3. Clicar no botão "Recusar registro"
   → Modal fecha. Toast exibida: "Registro recusado". Sistema retorna para a lista.
4. Abrir o drawer "Histórico" do registro recusado
   → Trilha exibe o evento de recusa com a descrição "Plano de desenvolvimento não cobre essa formação.".
5. Acessar a tela "Meu histórico" como o Aluno dono do registro e clicar em "Visualizar" no registro recusado
   → Banner vermelho "Registro de aprendizagem recusado" exibe a justificativa do Admin.

## TC7 — Validar botão Cancelar do form de avaliação
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [51]

### Objetivo
Garantir que Cancelar fecha a avaliação sem alterar o registro (RN 51).

### Passos
1. Acessar o form "Avaliar registro" de um registro Externo Pendente como Admin
   → Form em modo avaliação.
2. Selecionar "Workshop" no dropdown "Tipo de experiência"
   → Opção selecionada (form sujo).
3. Clicar no botão "Cancelar"
   → Sistema retorna para a lista sem salvar; o registro permanece Pendente e o KPI não muda.

## TC8 — Validar escopo do Líder na avaliação
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [50.1, 93, 94]

### Objetivo
Garantir que Líder só vê "Avaliar" para registros de liderados diretos (RN 50.1).

### Passos
1. Acessar a tela "Aprendizagem > Registros" logado como Líder
   → Lista exibe apenas registros dos liderados diretos.
2. Clicar no menu 3 pontos de um registro Externo Pendente de um liderado direto
   → Item "Avaliar" é exibido como primário.
3. Verificar que registros de pessoas fora da equipe não aparecem na lista do Líder na coluna "Pessoa"
   → Nenhum registro de pessoa fora da equipe é listado (o cenário de 403 via API é coberto na suíte de escopo do Líder).

## TC9 — Validar erro ao aprovar registro excluído por outro admin
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [53]

### Objetivo
Garantir tratamento de concorrência: aprovar registro que outro admin excluiu exibe toast de erro (cenário 06 de h09).

### Passos
1. Acessar o form "Avaliar registro" de um registro Externo Pendente como Admin (sessão A)
   → Form em modo avaliação aberto.
2. Excluir o mesmo registro por outra sessão de Admin (sessão B, via ação direta no backend/segunda janela)
   → Registro removido na origem.
3. Na sessão A, aprovar o registro pelo botão "Aprovar" com "Curso" selecionado no dropdown "Tipo de experiência"
   → Toast de erro exibida: "Não foi possível aprovar — registro não encontrado". Registro não muda de status (já não existe).

---

---
suite: Excluir registro, Evidências e Histórico (drawers e trilhas de eventos)
executor: playwright
org: principal
playbooks:
  - toast-chakra
  - cleanup-dados
  - perfil-switch
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuários disponíveis nos perfis Aluno e Admin
  - Aluno possui registros Externos nos status Pendente, Emitido, Recusado e Expirado; 1 Interno; 1 Compartilhado
  - Registros Externos com evidências anexadas (mínimo 2 arquivos) e 1 Externo sem evidências
  - Arquivos de teste para a matriz de upload "evidencia_valida.pdf" (1 MB), "evidencia_grande.pdf" (11 MB), "script_malicioso.exe", "imagem_renomeada.png" (conteúdo real EXE) disponíveis
  - Registros excluídos nos testes são recriados/restaurados ao final (cleanup)
---

# Excluir registro, Evidências e Histórico (drawers e trilhas de eventos)

## TC1 — Validar disponibilidade do "Excluir" para o Aluno (apenas Pendente)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [55, 55.1]

### Objetivo
Garantir que Aluno só vê "Excluir" em Externo Pendente — nos demais casos o item não é renderizado (RN 55).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e clicar no menu 3 pontos de um registro Externo Pendente
   → Item "Excluir" é exibido no menu.
2. Clicar no menu 3 pontos de um registro Externo Emitido
   → Item "Excluir" NÃO é exibido (menu mostra apenas Visualizar, Evidências e Histórico).
3. Clicar no menu 3 pontos de um registro Interno
   → Item "Excluir" NÃO é exibido.
4. Clicar no menu 3 pontos de um registro Compartilhado
   → Item "Excluir" NÃO é exibido.

## TC2 — Validar disponibilidade do "Excluir" para o Admin (matriz de status)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [55, 55.1]

### Objetivo
Garantir a matriz de exclusão do Admin: Externo + (Emitido | Recusado | Expirado); nunca em Pendente, Substituído, Interno ou Compartilhado (RN 55).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e clicar no menu 3 pontos de um registro Externo Emitido
   → Item "Excluir" é exibido.
2. Clicar no menu 3 pontos de um registro Externo Recusado
   → Item "Excluir" é exibido.
3. Clicar no menu 3 pontos de um registro Externo Expirado
   → Item "Excluir" é exibido.
4. Clicar no menu 3 pontos de um registro Externo Pendente
   → Item "Excluir" NÃO é exibido (fluxo correto é Avaliar/Recusar).
5. Clicar no menu 3 pontos de um registro Externo Substituído
   → Item "Excluir" NÃO é exibido.
6. Clicar no menu 3 pontos de um registro Interno
   → Item "Excluir" NÃO é exibido.

## TC3 — Validar estrutura do modal de confirmação destrutiva
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [56]

### Objetivo
Garantir header, alerta vermelho, conteúdo em destaque e botões do AlertDialog de exclusão (RN 56).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e clicar em "Excluir" no menu de um registro Externo Pendente
   → Modal "Excluir registro?" é exibido.
2. Verificar o corpo do modal "Excluir registro?"
   → Alerta vermelho com texto "Esta ação não pode ser desfeita." e pergunta "Você está excluindo o registro: **{título do conteúdo}**." com o título em destaque.
3. Verificar os botões "Cancelar" e "Excluir" do rodapé do modal
   → "Cancelar" (outline) e "Excluir" (sólido vermelho).
4. Clicar no botão "Cancelar"
   → Modal fecha; registro permanece na lista.

## TC4 — Validar exclusão confirmada com toast e atualização
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [57]

### Objetivo
Garantir que confirmar a exclusão remove o registro, atualiza KPI e lista e exibe toast (RN 57).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e anotar o número do KPI "Pendentes"
   → Card exibe a contagem atual.
2. Clicar em "Excluir" no menu de um registro Externo Pendente
   → Modal "Excluir registro?" é exibido.
3. Clicar no botão "Excluir"
   → Toast exibida: "Registro excluído". Linha some da lista automaticamente; KPI "Pendentes" decrementa 1.

## TC5 — Validar exclusão pelo botão do form de edição
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [56, 57]

### Objetivo
Garantir que o botão "Excluir" do rodapé do form abre o mesmo AlertDialog e que cancelar mantém o form aberto (RN 56 — pattern compartilhado).

### Passos
1. Acessar o form de edição como Aluno de um registro Externo Pendente
   → Form exibido com botão "Excluir" no rodapé.
2. Clicar no botão "Excluir" do rodapé
   → Modal "Excluir registro?" é exibido (mesmo pattern do menu).
3. Clicar no botão "Cancelar" do modal
   → Modal fecha; form de edição continua aberto.
4. Clicar novamente no botão "Excluir" e confirmar no modal
   → Toast exibida: "Registro excluído". Sistema retorna para a lista; registro não aparece mais.

## TC6 — Validar disponibilidade do drawer "Evidências" (apenas Externo)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [60, 60.1]

### Objetivo
Garantir que o item "Evidências" só aparece para registros Externos (RN 60.1).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e clicar no menu 3 pontos de um registro Externo Emitido
   → Item "Evidências" é exibido.
2. Clicar no menu 3 pontos de um registro Interno
   → Item "Evidências" NÃO é exibido.
3. Clicar no menu 3 pontos de um registro Compartilhado
   → Item "Evidências" NÃO é exibido.

## TC7 — Validar conteúdo do drawer "Evidências" e download
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [60]

### Objetivo
Garantir a estrutura do drawer (lista somente leitura com download) e o empty state (RN 60).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e clicar em "Evidências" no menu de um registro Externo com 2 arquivos anexados
   → Drawer lateral direito abre com header "Evidências - {conteúdo}" e botão de fechar.
2. Verificar a lista de arquivos do drawer "Evidências"
   → Cada arquivo exibe ícone, nome e ação de download ("Baixar"); não há opção de adicionar ou remover arquivo.
3. Clicar na ação "Baixar" do primeiro arquivo
   → Download do arquivo inicia.
4. Clicar no botão "Baixar todas"
   → Download de todas as evidências inicia.
5. Fechar o drawer e abrir "Evidências" de um registro Externo sem anexos
   → Drawer exibe a mensagem "Sem evidências anexadas.".

## TC8 — Validar matriz de upload de evidências (extensão, MIME, tamanho e quantidade)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [58, 59]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Formato válido PDF | F | "evidencia_valida.pdf" (1 MB) | Aceito; aparece na lista |
| Formato válido imagem | F | "evidencia.jpg" | Aceito |
| Extensão proibida | F | "script_malicioso.exe" | Rejeitado com mensagem citando os formatos aceitos |
| Extensão dupla | F | "evidencia.png.exe" | Rejeitado |
| MIME mismatch | G | "imagem_renomeada.png" (conteúdo real EXE) | Rejeitado pela validação de conteúdo (não apenas extensão) |
| Arquivo vazio | G | "vazio.pdf" (0 bytes) | Rejeitado ou aviso |
| Tamanho no limite | H | "evidencia_10mb.pdf" (10 MB) | Aceito |
| Tamanho acima do limite | H | "evidencia_grande.pdf" (11 MB) | Rejeitado com mensagem citando "Tamanho máximo: 10 MB" |
| Quantidade no limite | H | 5 arquivos válidos | Aceitos |
| Quantidade acima do limite | H | 6º arquivo válido | Rejeitado com mensagem citando "Quantidade máxima: 5 arquivos" |

### Objetivo
Validar a matriz completa de upload da "Comprovação de aprendizagem" — categorias F, G, H conforme cenarios-negativos-twygo (limites do protótipo: 10 MB, 5 arquivos, formatos .pdf .docx .xlsx .csv .jpg .jpeg .png; Spike S7 pendente de confirmação).

### Passos
1. Acessar o form "Adicionar registro de aprendizagem" como Aluno
   → Área de upload exibida com o texto dos formatos aceitos.
2. Para cada linha da Validation matrix, fazer upload do arquivo indicado no campo "Comprovação de aprendizagem"
   → Comportamento bate com a coluna "Esperado": válidos entram na lista de arquivos; inválidos são rejeitados com mensagem específica.

## TC9 — Validar disponibilidade universal do drawer "Histórico"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [62]

### Objetivo
Garantir que "Histórico" está sempre presente no menu, independente de perfil/origem/status (RN 62).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e clicar no menu 3 pontos de um registro Externo Pendente
   → Item "Histórico" é exibido.
2. Clicar no menu 3 pontos de um registro Interno
   → Item "Histórico" é exibido.
3. Clicar no menu 3 pontos de um registro Compartilhado
   → Item "Histórico" é exibido.
4. Acessar a tela "Aprendizagem > Registros" como Admin e clicar no menu 3 pontos de um registro Externo Substituído
   → Item "Histórico" é exibido.

## TC10 — Validar trilhas de eventos do Histórico por status
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [61, 61.1]

### Objetivo
Garantir as trilhas cronológicas esperadas por status do registro, com ícones e descrições (RN 61).

### Passos
1. Abrir o drawer "Histórico" de um registro Externo Emitido
   → Trilha exibe 3 eventos em ordem: criado → submetido → aprovado; evento "criado" exibe descrição "Por {nome}".
2. Abrir o drawer "Histórico" de um registro Externo Pendente
   → Trilha exibe 2 eventos: criado → submetido (sem evento de aprovação).
3. Abrir o drawer "Histórico" de um registro Externo Recusado
   → Trilha exibe 3 eventos: criado → submetido → recusado; evento "recusado" exibe a justificativa como descrição.
4. Abrir o drawer "Histórico" de um registro Externo Expirado
   → Trilha exibe 4 eventos: criado → submetido → aprovado → expirado.
5. Abrir o drawer "Histórico" de um registro Interno
   → Trilha exibe apenas o evento "criado".

## TC11 — Validar abertura do Histórico pelo banner do form
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [61, 62]

### Objetivo
Garantir que o botão "Histórico" dos banners contextuais abre o mesmo drawer (RN 61 — h11 cenário 05).

### Passos
1. Acessar o form de edição como Admin de um registro Externo Recusado
   → Banner vermelho com botão "Histórico" exibido.
2. Clicar no botão "Histórico" do banner
   → Drawer "Histórico - {conteúdo}" abre com a trilha criado → submetido → recusado, idêntico ao acessado pelo menu da linha.

---

---
suite: Filtros via drawer e personalização de colunas (DnD)
executor: playwright
org: principal
playbooks:
  - filtro-drawer
  - perfil-switch
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuário logado como Admin (cenários de coluna) e usuário Aluno disponível (cenários de sincronização com KPI)
  - Registros distribuídos entre os 4 status com provedores variados para os filtros padrão e combinatórias
---

# Filtros via drawer e personalização de colunas (DnD)

## TC1 — Validar abertura do drawer e estado ativo do botão Filtro
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [63, 63.1]

### Objetivo
Garantir que o botão "Filtro" abre o drawer e reflete estado ativo com sufixo (N) quando há filtro aplicado (RN 63).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin
   → Botão "Filtro" exibido em variante outline (sem filtro ativo).
2. Clicar no botão "Filtro"
   → Drawer "Lista de filtros" abre à direita.
3. Aplicar o filtro padrão "Pendentes" pelo botão "Aplicar"
   → Drawer fecha; lista filtra; botão "Filtro" muda para variante sólida com sufixo "(1)".
4. Clicar no botão "Limpar filtro" da toolbar
   → Filtro é removido; botão "Filtro" volta à variante outline.

## TC2 — Validar estrutura do drawer "Lista de filtros"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [64]

### Objetivo
Garantir busca, link Novo, 3 grupos colapsáveis com filtros padrão e empty states (RN 64).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e clicar no botão "Filtro"
   → Drawer abre com header "Lista de filtros", campo de busca no topo e botão "Novo".
2. Verificar o grupo "Filtros padrão" (aberto por default)
   → 4 filtros radio exibidos: "Válidos", "Expirados", "Pendentes", "Recusados", cada um com ícone de informação e botão de duplicar.
3. Clicar no grupo "Filtros compartilhados"
   → Grupo expande exibindo a mensagem "Em breve — filtros criados pela equipe vão aparecer aqui."
4. Clicar no grupo "Meus filtros"
   → Grupo expande exibindo "Em breve — filtros que você criar ou duplicar ficam aqui."
5. Verificar o footer do drawer com os botões "Cancelar" e "Aplicar"
   → Botões "Cancelar" (outline) e "Aplicar" (sólido roxo).
6. Clicar no botão de duplicar do filtro "Válidos"
   → Toast exibida: "Em breve".

## TC3 — Validar busca interna da lista de filtros
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [64]

### Objetivo
Garantir que a busca do drawer filtra os filtros pelo label (RN 64).

### Passos
1. Abrir o drawer "Lista de filtros"
   → 4 filtros padrão visíveis.
2. Preencher o campo de busca do drawer com "Pend"
   → Apenas o filtro "Pendentes" permanece visível na lista.
3. Limpar o campo de busca
   → Os 4 filtros padrão voltam a aparecer.

## TC4 — Validar comportamento de pending (aplicar, cancelar, ressincronizar)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [65]

### Objetivo
Garantir que a seleção pendente só vira filtro efetivo no Aplicar, é descartada no Cancelar/X e ressincroniza a cada abertura (RN 65).

### Passos
1. Abrir o drawer "Lista de filtros" e selecionar o radio "Pendentes"
   → Radio "Pendentes" selecionado (pending).
2. Clicar no botão de fechar (X) do drawer
   → Drawer fecha; lista NÃO filtra; botão "Filtro" permanece outline.
3. Reabrir o drawer
   → Nenhum radio selecionado (pending descartado ressincronizou com o filtro efetivo vazio).
4. Aplicar o filtro "Pendentes" pelo botão "Aplicar"
   → Drawer fecha; lista filtra por Pendentes.
5. Reabrir o drawer
   → Radio "Pendentes" já aparece selecionado (pending ressincronizado com o filtro aplicado).
6. Clicar no radio "Pendentes" já selecionado
   → Radio deseleciona (toggle).
7. Clicar no botão "Aplicar"
   → Filtro é removido; lista volta a exibir todos os registros.

## TC5 — Validar sincronização KPI cards ↔ drawer (Aluno)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [66]

### Objetivo
Garantir que KPI card e radios do drawer manipulam o mesmo estado de filtro (RN 66).

### Passos
1. Acessar a tela "Meu histórico" como Aluno e clicar no KPI card "Pendentes"
   → Lista filtra por Pendentes; card fica ativo.
2. Clicar no botão "Filtro"
   → Drawer abre com o radio correspondente a "Pendentes" já selecionado.
3. Aplicar o filtro "Recusados" pelo botão "Aplicar" do drawer
   → Lista filtra por Recusados; KPI card "Recusados" assume o estado ativo e "Pendentes" perde.

## TC6 — Validar navegação para a view "Filtro rápido"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [67, 68]

### Objetivo
Garantir a navegação Lista de filtros ↔ Filtro rápido e a estrutura da view de personalização (RN 67, 68).

### Passos
1. Abrir o drawer "Lista de filtros" e clicar no botão "Novo"
   → Header do drawer muda para "Filtro rápido"; link de voltar "Lista de filtros" aparece no topo.
2. Verificar o grupo "Colunas para filtrar"
   → Grupo aberto exibindo o botão outline "+ Opções de filtro".
3. Clicar no botão "+ Opções de filtro"
   → Toast exibida: "Em breve" (filtro avançado fora desta entrega).
4. Verificar o grupo "Colunas para exibir"
   → Lista de colunas com checkbox + drag handle em cada item; colunas default marcadas (Pessoa, Conteúdo, Origem, Criado por, Provedor, Situação do registro, Situação do certificado, Carga horária).
5. Clicar no link "Lista de filtros"
   → Drawer volta para a view "Lista de filtros".

## TC7 — Validar ligar/desligar colunas e refletir na tabela
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [68, 70]

### Objetivo
Garantir que marcar/desmarcar colunas e aplicar atualiza a tabela imediatamente, com checkbox e ações fixos nas pontas (RN 70).

### Passos
1. Abrir a view "Filtro rápido" do drawer como Admin
   → Lista de colunas exibida.
2. Desmarcar o checkbox da coluna "Provedor"
   → Checkbox desmarcado.
3. Marcar o checkbox da coluna "Website"
   → Checkbox marcado.
4. Clicar no botão "Aplicar"
   → Drawer fecha; tabela remove a coluna "Provedor" e exibe a coluna "Website"; checkbox de seleção permanece como primeira coluna e ações como última.

## TC8 — Validar reordenação de colunas via drag and drop
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [69, 70]

### Objetivo
Garantir o DnD pelo handle com a tabela refletindo a nova ordem (RN 69).

### Passos
1. Abrir a view "Filtro rápido" do drawer como Admin
   → Lista de colunas com drag handle em cada linha.
2. Passar o mouse sobre o drag handle da coluna "Carga horária"
   → Tooltip exibida: "Arraste para reordenar".
3. Arrastar a coluna "Carga horária" (pelo handle) para antes da coluna "Origem"
   → Linha reposiciona na lista durante o drag com feedback visual (fundo destacado).
4. Clicar no botão "Aplicar"
   → Tabela exibe "Carga horária" antes de "Origem" na ordem das colunas.

## TC9 — Validar reset suave do drawer e não persistência da customização
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [70]

### Objetivo
Garantir que reabrir o drawer volta à view "lista" com colunas default, e que a customização não persiste entre sessões (RN 70 + premissa).

### Passos
1. Abrir a view "Filtro rápido", desmarcar "Provedor" e aplicar
   → Tabela sem a coluna "Provedor".
2. Reabrir o drawer "Filtro"
   → Drawer abre na view "Lista de filtros" (não na view "Filtro rápido").
3. Clicar no botão "Novo"
   → Lista de colunas exibe o estado default novamente (visão de edição resetada).
4. Recarregar a página
   → Tabela volta às colunas default (customização não persistida entre sessões).

## TC10 — Validar combinação de 2 filtros + busca textual (combinatória mínima)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [13.3, 64, 70]

### Objetivo
Garantir interseção de filtro padrão + colunas personalizadas + busca textual simultâneos — cobertura combinatória mínima do contrato 1.1.

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e aplicar o filtro padrão "Válidos" pelo drawer
   → Lista filtra para registros válidos (Emitidos); botão "Filtro" fica sólido "(1)".
2. Abrir a view "Filtro rápido", desmarcar a coluna "Criado por" e aplicar
   → Tabela some com a coluna "Criado por" mantendo o filtro "Válidos" ativo.
3. Preencher o campo de busca com "Coursera"
   → Lista exibe apenas registros Emitidos do provedor "Coursera" (interseção dos 3 critérios); colunas personalizadas permanecem.
4. Clicar no botão "Limpar filtro"
   → Filtro padrão é removido; busca permanece aplicada; lista mostra todos os registros "Coursera".

---

---
suite: Ações em massa (elegibilidade, escopos e toasts com ratio)
executor: playwright
org: principal
playbooks:
  - toast-chakra
  - cleanup-dados
  - filtro-drawer
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuário logado como Admin
  - Usuário Líder disponível com liderados diretos
  - Registros Externos Pendentes em volume suficiente (mínimo 7) e registros Emitidos/Recusados/Expirados para a matriz de elegibilidade
  - Registros afetados pelos testes são restaurados ao final (cleanup)
---

# Ações em massa (elegibilidade, escopos e toasts com ratio)

## TC1 — Validar disponibilidade do botão e abertura sem seleção
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [71, 71.1, 71.2]

### Objetivo
Garantir que "Ações em massa" é exclusivo do Admin/Líder e fica habilitado mesmo sem linhas marcadas (RN 71).

### Passos
1. Acessar a tela "Meu histórico" como Aluno
   → Botão "Ações em massa" NÃO é exibido na toolbar.
2. Acessar a tela "Aprendizagem > Registros" como Admin sem nenhuma linha marcada
   → Botão "Ações em massa" é exibido habilitado.
3. Clicar no botão "Ações em massa"
   → Drawer "Ações em massa" abre à direita.

## TC2 — Validar estrutura do drawer e defaults de escopo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [72]

### Objetivo
Garantir campos do drawer, radio "Selecionados" desabilitado com 0 marcados e defaults corretos (RN 72).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin sem seleção e clicar no botão "Ações em massa"
   → Drawer exibe select "Ação" com as opções "Aprovar registros", "Recusar registros" e "Excluir registros"; grupo "Opções" com radios "Selecionados" e "Todos do filtro atual ({M})".
2. Verificar o radio "Selecionados" com 0 marcados
   → Radio aparece desabilitado; tooltip exibida ao passar o mouse: "Marque registros na tabela pra ativar"; default selecionado é "Todos do filtro atual".
3. Fechar o drawer, marcar 3 linhas na tabela e reabrir o drawer
   → Radio "Selecionados (3)" aparece habilitado e selecionado por default.
4. Verificar o footer com os botões "Cancelar" e "Aplicar"
   → Botões "Cancelar" e "Aplicar".

## TC3 — Validar aprovação em massa de selecionados com toast de sucesso
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [73, 74]

### Objetivo
Garantir o fluxo direto de Aprovar em massa sobre registros elegíveis (RN 74).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e marcar 5 registros Externos Pendentes
   → 5 linhas selecionadas.
2. Clicar no botão "Ações em massa"
   → Drawer abre com "Aprovar registros" e "Selecionados (5)".
3. Clicar no botão "Aplicar"
   → Toast exibida: "5 registros aprovados". Lista atualiza com os 5 registros agora Aprovados.

## TC4 — Validar toast com ratio quando há inelegíveis no escopo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [73, 74]

### Objetivo
Garantir a elegibilidade espelhando o menu por linha e o toast com contagem de ignorados (RN 73, RN 74).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e marcar 7 registros (4 Externos Pendentes + 3 Emitidos)
   → 7 linhas selecionadas.
2. Abrir o drawer "Ações em massa" com a ação "Aprovar registros" selecionada no dropdown "Ação"
   → Drawer com escopo "Selecionados (7)".
3. Clicar no botão "Aplicar"
   → Toast exibida: "4 registros aprovados (3 ignorados por não atender aos critérios da ação)". Apenas os 4 Pendentes mudam para Aprovado.

## TC5 — Validar recusa em massa com modal de justificativa única
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [74]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Justificativa vazia | A | "" | Botão "Recusar registros" desabilitado |
| Justificativa preenchida | A | "Plano de desenvolvimento não cobre essa formação." | Botão habilitado; batch processa |

### Objetivo
Garantir o modal de justificativa obrigatória aplicada a todo o batch de recusa (RN 74).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin, aplicar o filtro padrão "Pendentes" e abrir o drawer "Ações em massa" sem marcar linhas
   → Drawer abre com escopo default "Todos do filtro atual ({M})".
2. Aplicar a ação "Recusar registros" pelo botão "Aplicar" do drawer
   → Modal de justificativa abre com Textarea obrigatória; botão "Recusar registros" desabilitado.
3. Preencher o campo "Justificativa" com "Plano de desenvolvimento não cobre essa formação."
   → Botão "Recusar registros" fica habilitado.
4. Clicar no botão "Recusar registros"
   → Modal fecha. Toast exibida: "{M} registros recusados". 
5. Abrir o drawer "Histórico" de um dos registros recusados
   → Evento de recusa exibe a justificativa "Plano de desenvolvimento não cobre essa formação." (mesma para todo o batch).

## TC6 — Validar exclusão em massa com AlertDialog de contagem
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [73, 74]

### Objetivo
Garantir o AlertDialog destrutivo com contagem em destaque antes da exclusão em massa (RN 74).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e marcar 3 registros Externos Emitidos
   → 3 linhas selecionadas.
2. Aplicar a ação "Excluir registros" pelo botão "Aplicar" do drawer "Ações em massa"
   → AlertDialog destrutivo abre com alerta vermelho "Esta ação não pode ser desfeita." e a pergunta "Você está excluindo **3 registros**." com a contagem em destaque.
3. Clicar no botão de confirmação da exclusão
   → Toast exibida: "3 registros excluídos". As 3 linhas somem da lista.

## TC7 — Validar banner amarelo de escopo sem elegíveis
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [72, 73]

### Objetivo
Garantir o banner informativo quando o escopo escolhido não tem registro elegível para a ação (RN 72).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e marcar 3 registros Emitidos (nenhum Pendente)
   → 3 linhas selecionadas.
2. Abrir o drawer "Ações em massa" com a ação "Aprovar registros" e o escopo "Selecionados (3)"
   → Banner amarelo exibido no drawer: "Nenhum registro no escopo atende aos critérios pra essa ação."
3. Selecionar "Excluir registros" no dropdown "Ação"
   → Banner amarelo some (Emitidos são elegíveis a exclusão).

## TC8 — Validar pós-aplicação: limpeza da seleção e refresh único do KPI
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [75]

### Objetivo
Garantir que após o batch a seleção é limpa e o KPI atualiza uma única vez (RN 75).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin, anotar os KPIs e marcar 4 registros Externos Pendentes
   → 4 linhas selecionadas; checkbox do header em tri-state.
2. Executar "Aprovar registros" em massa sobre os selecionados
   → Toast de sucesso exibida.
3. Verificar os checkboxes da tabela e o estado do checkbox "selecionar todos"
   → Todos desmarcados (seleção limpa); checkbox do header volta ao estado vazio.
4. Verificar os KPIs "Pendentes" e "Emitidos"
   → "Pendentes" -4 e "Emitidos" +4 aplicados de uma só vez.

## TC9 — Validar fechamento do drawer preservando a seleção
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [72]

### Objetivo
Garantir que fechar o drawer sem aplicar mantém os checkboxes marcados (h13 cenário 05).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e marcar 4 linhas
   → 4 linhas selecionadas.
2. Clicar no botão "Ações em massa"
   → Drawer abre.
3. Clicar no botão de fechar (X) do drawer
   → Drawer fecha; as 4 linhas permanecem selecionadas na tabela.

## TC10 — Validar escopo vazio com aviso de orientação
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [72]

### Objetivo
Garantir o toast de orientação quando o escopo total é vazio (edge case de h13).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin com filtro aplicado que retorna 0 registros e nenhuma linha marcada
   → Lista vazia ("Nenhum registro encontrado").
2. Clicar no botão "Ações em massa" e tentar aplicar uma ação
   → Aviso exibido orientando: "Marque registros na tabela ou troque pra 'Todos do filtro atual'." Nenhum processamento ocorre.

---

---
suite: Extração de dados e evidências (assíncrona com modal de atenção)
executor: playwright
org: principal
playbooks:
  - toast-chakra
  - filtro-drawer
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuário logado como Admin com acesso à caixa de e-mail de teste
  - Registros com evidências anexadas e registros SEM evidência no mesmo filtro (para o modal de Atenção)
  - Worker/job de extração ativo no ambiente
---

# Extração de dados e evidências (assíncrona com modal de atenção)

## TC1 — Validar disponibilidade do botão "Extrair dados"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [76, 76.1]

### Objetivo
Garantir exclusividade do botão para Admin/Líder (RN 76.1).

### Passos
1. Acessar a tela "Meu histórico" como Aluno
   → Botão "Extrair dados" NÃO é exibido na toolbar.
2. Acessar a tela "Aprendizagem > Registros" como Admin
   → Botão "Extrair dados" é exibido (outline roxo com ícone de upload).

## TC2 — Validar estrutura do drawer no branch "Dados"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [76, 77]

### Objetivo
Garantir os 3 grupos de radio do branch Dados (RN 77).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e clicar no botão "Extrair dados"
   → Drawer "Configurações da extração" abre com select "Tipo de extração" = "Dados" (default).
2. Verificar os grupos de radio "Formato", "Dados (linhas)" e "Colunas" do branch Dados
   → "Formato": "CSV (tabela)" / "PDF (tabela e gráficos)"; "Dados (linhas)": "Filtro atual" / "Todos"; "Colunas": "Filtro atual" / "Todos".
3. Verificar o footer com os botões "Cancelar" e "Extrair"
   → Botões "Cancelar" (outline) e "Extrair" (sólido roxo).

## TC3 — Validar estrutura do drawer no branch "Evidências"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [77]

### Objetivo
Garantir que o branch Evidências troca os grupos para apenas o escopo (RN 77).

### Passos
1. Abrir o drawer "Configurações da extração" como Admin
   → Drawer aberto no branch Dados.
2. Selecionar "Evidências" no select "Tipo de extração"
   → Grupos de Formato/Linhas/Colunas são substituídos por um único grupo "Escopo" com radios "Filtro atual" / "Todos".

## TC4 — Validar extração de dados CSV com toast de variação
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [79, 80]

### Objetivo
Garantir o disparo da extração de dados com toast informando formato, contagem e escopo (RN 80).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin com filtro atual contendo 50 registros
   → Lista filtrada com 50 registros.
2. Clicar no botão "Extrair dados"
   → Drawer abre.
3. Manter "Dados" + "CSV (tabela)" + Linhas "Filtro atual" + Colunas "Filtro atual" e clicar no botão "Extrair"
   → Drawer fecha. Toast exibida: "Extração iniciada: CSV com 50 registros (filtro atual · colunas do filtro)."
4. Aguardar a mensagem "Sua extração está sendo processada. Você receberá uma notificação quando estiver pronta." ser exibida
   → Flash message exibida: "Sua extração está sendo processada. Você receberá uma notificação quando estiver pronta."

## TC5 — Validar modal de Atenção para evidências faltantes
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [78, 80]

### Objetivo
Garantir o modal com ratio de registros sem evidência e os caminhos Cancelar/Continuar (RN 78).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin com filtro contendo 32 registros, sendo 5 sem evidência
   → Lista filtrada.
2. Disparar a extração com Tipo "Evidências" + escopo "Filtro atual" pelo botão "Extrair"
   → Modal "Atenção" abre com o texto "5 de 32 registros no escopo não têm evidência anexada. Eles serão ignorados na extração."
3. Clicar no botão "Cancelar" do modal
   → Modal fecha e o drawer de configurações permanece aberto.
4. Disparar novamente a extração pelo botão "Extrair" confirmando no botão "Continuar" do modal
   → Toast exibida: "Extração iniciada: baixando evidências de 27 registros (5 sem evidência ignorados)."

## TC6 — Validar extração de evidências sem faltantes (modal não aparece)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [78]

### Objetivo
Garantir que com todos os registros do escopo tendo evidência o modal de Atenção não dispara (h14 cenário 03).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin com filtro em que todos os registros têm evidência
   → Lista filtrada.
2. Disparar a extração com Tipo "Evidências" + escopo "Filtro atual" pelo botão "Extrair"
   → Nenhum modal de Atenção; toast de "Extração iniciada" exibida diretamente.

## TC7 — Validar entrega assíncrona: e-mail e notificação no sino
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [79]

### Objetivo
Garantir que ao término do processamento o admin recebe e-mail com link e notificação no sino (RN 79). Validação de e-mail tem etapa manual.

### Passos
1. Disparar uma extração de Dados CSV como Admin
   → Toast de "Extração iniciada" exibida.
2. Aguardar a conclusão do processamento assíncrono
   → Notificação aparece no sino da TopBar informando que a extração está pronta, com acesso ao download.
3. Clicar na notificação da extração no painel do sino
   → Download do pacote inicia (ou página de download abre).
4. Abrir a caixa de e-mail do Admin (etapa manual)
   → E-mail recebido com link de download (anexo quando menor que o limite de e-mail).

## TC8 — Validar pacote grande entregue apenas como link
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [79]

### Objetivo
Garantir que ZIP acima do limite de e-mail chega como link, sem anexo (RN 79 — Spike S8).

### Passos
1. Disparar extração de Evidências como Admin sobre escopo com volume de arquivos acima do limite de anexo de e-mail
   → Toast de "Extração iniciada" exibida.
2. Aguardar o e-mail de conclusão (etapa manual)
   → E-mail chega contendo apenas o link de download, sem anexo.

## TC9 — Validar reset do drawer ao reabrir
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [77]

### Objetivo
Garantir o reset suave das opções a cada abertura (h14 cenário 06).

### Passos
1. Abrir o drawer "Extrair dados", selecionar "Evidências" e fechar o drawer pelo X
   → Drawer fecha sem extrair.
2. Reabrir o drawer "Extrair dados"
   → Select "Tipo de extração" volta para "Dados" e os radios voltam aos defaults (estado anterior não mantido).

---

---
suite: CRUD de Provedores e bloqueio de exclusão com vínculo
executor: playwright
org: principal
playbooks:
  - toast-chakra
  - switch-chakra
  - cleanup-dados
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuário logado como Admin
  - Provedores cadastrados na organização, incluindo ao menos 1 com registros vinculados e 1 sem nenhum vínculo
  - Provedores criados pelos testes são removidos ao final (cleanup)
---

# CRUD de Provedores e bloqueio de exclusão com vínculo

## TC1 — Validar acesso à tab Provedores e estrutura da listagem
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [81, 82, 83]

### Objetivo
Garantir a tab, as colunas da tabela e a toolbar sem toggle grid/list (RN 81–83).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e clicar na tab "Provedores"
   → Tab "Provedores" fica ativa e exibe a listagem de provedores da organização.
2. Verificar as colunas "Nome", "Website", "Descrição", "Ativo" e "Criado em" da tabela
   → Colunas: checkbox, "Nome", "Website", "Descrição", "Ativo" (switch), "Criado em", coluna de ações com 2 botões inline (Editar e Excluir).
3. Verificar a toolbar com "Adicionar", busca e "Filtro"
   → Exibe "Adicionar", busca e "Filtro"; toggle de visualização tabela/grid NÃO é exibido.
4. Verificar a coluna "Website" de um provedor com URL
   → Link externo exibido com host limpo (sem "https://www." no display).
5. Clicar no header da coluna "Nome"
   → Lista ordena alfabeticamente; segundo clique inverte.

## TC2 — Validar criação de provedor
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [84]

### Objetivo
Garantir o fluxo completo de criação pela tela dedicada (RN 84).

### Passos
1. Acessar a tab "Provedores" como Admin e clicar no botão "Adicionar"
   → Tela "Adicionar provedor" abre com campos "Nome", "Website", "Descrição" e switch "Ativo" ligado por default.
2. Preencher o campo "Nome" com "Provedor QA Teste"
   → Campo exibe o valor.
3. Preencher o campo "Website" com "https://provedor-qa.example.com"
   → Campo exibe o valor.
4. Preencher o campo "Descrição" com "Provedor criado por teste automatizado"
   → Campo exibe o valor.
5. Clicar no botão "Salvar"
   → Toast exibida: "Provedor adicionado". Sistema retorna para a listagem; "Provedor QA Teste" aparece na tabela.

## TC3 — Validações do campo "Nome" do provedor
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [84]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Vazio | A | "" | Borda vermelha + "Campo obrigatório"; salvamento bloqueado |
| Só espaços | A | "   " | Tratado como vazio: "Campo obrigatório" |
| 1 caractere | B | "X" | Aceito |
| Acentos | C | "Fundação Getúlio Vargas" | Aceito e exibido corretamente |
| Emoji | C | "🎓 Provedor" | Aceito sem quebrar encoding |
| Script tag | D | "<script>alert(1)</script>" | Salvo escapado; nenhum alert executa |
| SQL injection | D | "'; DROP TABLE providers;--" | Salvo escapado, sem efeito no banco |

### Objetivo
Validar a matriz de entradas do campo obrigatório "Nome" do provedor — categorias A, B, C, D.

### Passos
1. Acessar a tela "Adicionar provedor" como Admin
   → Form exibido.
2. Submeter o formulário pelo botão "Salvar" com o campo "Nome" preenchido com o input de cada linha da Validation matrix
   → Comportamento bate com a coluna "Esperado"; casos válidos criam provedor (removido no cleanup) e inválidos bloqueiam com "Campo obrigatório".

## TC4 — Validações do campo "Website" do provedor
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [84]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Vazio | A | "" | Aceito (campo opcional) |
| URL válida | C | "https://alura.com.br" | Aceito; vira link externo na listagem |
| Texto sem protocolo | E | "alura.com.br" | Comportamento consistente (aceita normalizando ou rejeita com mensagem) |
| Texto inválido | E | "não é url" | Erro de validação ou rejeição |

### Objetivo
Validar a matriz do campo opcional "Website" (categoria E — tipo errado).

### Passos
1. Acessar a tela "Adicionar provedor" como Admin com o campo "Nome" preenchido
   → Form pronto.
2. Submeter o formulário pelo botão "Salvar" com o campo "Website" preenchido com o input de cada linha da Validation matrix
   → Comportamento bate com a coluna "Esperado".

## TC5 — Validar edição de provedor
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [84]

### Objetivo
Garantir a edição pela tela dedicada pré-populada (RN 84).

### Passos
1. Acessar a tab "Provedores" como Admin e clicar no botão de editar (ícone de lápis) de um provedor existente
   → Tela "Editar provedor" abre com todos os campos pré-populados.
2. Preencher o campo "Descrição" com "Descrição atualizada pelo teste"
   → Campo exibe o novo valor.
3. Clicar no botão "Salvar"
   → Toast exibida: "Provedor salvo". Listagem reflete a descrição atualizada.

## TC6 — Validar toggle Ativo na linha com toasts
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [85]

### Objetivo
Garantir liga/desliga direto na linha sem abrir o form, com toasts específicos (RN 85).

### Passos
1. Acessar a tab "Provedores" como Admin e localizar um provedor com switch "Ativo" ligado
   → Switch verde ligado.
2. Desativar o switch "Ativo" do provedor
   → Toast exibida: "Provedor desativado". Switch fica desligado sem abrir o form.
3. Ativar o switch "Ativo" do mesmo provedor
   → Toast exibida: "Provedor ativado". Switch volta a ficar verde.

## TC7 — Validar efeito do provedor inativo nos dropdowns e registros existentes
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [85]

### Objetivo
Garantir que provedor inativo some do dropdown de novos registros mas permanece visível nos registros que já o referenciam (RN 85).

### Passos
1. Acessar a tab "Provedores" como Admin e desativar o switch de um provedor vinculado a registros existentes (ex: "Coursera")
   → Toast exibida: "Provedor desativado".
2. Acessar o form "Adicionar registro" e clicar no campo "Provedor de aprendizagem"
   → Dropdown NÃO lista o provedor desativado.
3. Voltar para a tab "Registros" e localizar um registro antigo do provedor desativado
   → Coluna "Provedor" continua exibindo o nome do provedor no registro existente.
4. Reativar o switch do provedor (restauração)
   → Toast exibida: "Provedor ativado"; provedor volta ao dropdown.

## TC8 — Validar exclusão de provedor sem vínculo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [86]

### Objetivo
Garantir a confirmação destrutiva e exclusão de provedor sem registros vinculados (RN 86).

### Passos
1. Acessar a tab "Provedores" como Admin e clicar no botão de excluir (ícone de lixeira) de um provedor sem registros vinculados
   → Modal de confirmação destrutiva abre com alerta "Esta ação não pode ser desfeita.".
2. Clicar no botão "Cancelar"
   → Modal fecha; provedor permanece na lista.
3. Clicar novamente no botão de excluir e confirmar a exclusão
   → Toast exibida: "Provedor excluído". Provedor some da listagem.

## TC9 — Validar bloqueio de exclusão de provedor com vínculo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [87]

### Objetivo
Garantir o AlertDialog informativo com contagem de vínculos e botão único "Entendi" (RN 87).

### Passos
1. Acessar a tab "Provedores" como Admin e clicar no botão de excluir de um provedor COM registros vinculados
   → AlertDialog informativo abre com ícone amarelo e texto "Provedor não pode ser excluído. Existem {N} registros vinculados."
2. Verificar o botão "Entendi" do modal
   → Apenas o botão "Entendi" é exibido (sem opção de confirmação destrutiva).
3. Clicar no botão "Entendi"
   → Modal fecha; provedor permanece intacto na listagem; nenhum toast de exclusão.

## TC10 — Validar visualização mobile da tab Provedores
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [83]

### Objetivo
Garantir auto-switch para cards em mobile com os elementos do card de provedor (RN 83). Pré-condição adicional: Viewport Mobile (360x740).

### Passos
1. Acessar a tab "Provedores" como Admin com viewport Mobile (360x740)
   → Em vez de tabela, cards são exibidos com: checkbox + nome no topo, botões de Editar/Excluir, website com host limpo, descrição truncada e rodapé com switch "Ativo" + data de criação.

---

---
suite: Preenchimento com IA e crédito de IA (3 estados e modais por perfil)
executor: playwright
org: principal
playbooks:
  - toast-chakra
  - perfil-switch
  - super-admin
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Funcionalidade de IA configurável na organização (habilitada/desabilitada) e crédito de IA controlável (com/sem) — via Super Admin ou configuração da Organization
  - Usuários disponíveis nos perfis Aluno e Admin
  - Arquivo de evidência "certificado_ia.pdf" disponível para upload
---

# Preenchimento com IA e crédito de IA (3 estados e modais por perfil)

## TC1 — Validar presença do card promocional de IA nos modos editáveis
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [88, 89.1, 89.2]

### Objetivo
Garantir que o card aparece em todos os modos editáveis para ambos os perfis, e some nos modos visualizar/avaliar (RN 88, RN 89.1).

### Passos
1. Acessar o form "Adicionar registro de aprendizagem" como Aluno
   → Card de IA é exibido entre os campos com título de preenchimento automático, descrição e botão "Preencher com IA"; disclaimer "A IA pode cometer erros, verifique as informações" visível no card.
2. Acessar o form "Adicionar registro" como Admin
   → Card de IA é exibido.
3. Acessar o form de edição de um registro Externo como Admin
   → Card de IA é exibido.
4. Acessar um registro Externo em modo "Visualizar"
   → Card de IA NÃO é exibido.
5. Acessar um registro Externo Pendente em modo "Avaliar registro"
   → Card de IA NÃO é exibido.

## TC2 — Validar estado habilitada + com crédito (fluxo de sucesso)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [89, 89.3]

### Objetivo
Garantir o estado 1 da matriz: botão habilita após upload, preenche Tipo + Categorias e exibe o toast verde de sucesso (RN 89, RN 89.3).

### Passos
1. Acessar o form "Adicionar registro" como Admin em organização com IA habilitada e com crédito
   → Botão "Preencher com IA" exibido desabilitado (sem upload ainda).
2. Fazer upload do arquivo "certificado_ia.pdf" no campo "Comprovação de aprendizagem"
   → Botão "Preencher com IA" fica habilitado.
3. Clicar no botão "Preencher com IA"
   → Campos "Tipo de experiência" e "Categorias" são preenchidos com as sugestões da IA.
4. Aguardar o toast "Campos preenchidos pela IA" ser exibido
   → Toast verde exibida no canto inferior direito com título "Campos preenchidos pela IA" e descrição "Tipo de experiência e Categorias foram sugeridos com base na evidência. Revise antes de salvar."; toast fecha sozinha (~3500ms) ou pelo X.

## TC3 — Validar estado habilitada + sem crédito no Admin (modal com Contato)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [89, 90]

### Objetivo
Garantir o modal "Limite de créditos atingido" do Admin com corpo completo e CTA "Contato" (RN 90).

### Passos
1. Acessar o form "Adicionar registro" como Admin em organização com IA habilitada e SEM crédito
   → Botão "Preencher com IA" desabilitado até upload.
2. Fazer upload do arquivo "certificado_ia.pdf"
   → Botão fica habilitado.
3. Clicar no botão "Preencher com IA"
   → Modal "Limite de créditos atingido" abre (top-center) com corpo "Todos os créditos disponíveis foram utilizados. Para continuar, entre em contato com o suporte ou aguarde a renovação." e botão "Contato" (roxo sólido); X de dismiss no header.
4. Clicar no X do modal
   → Modal fecha; campos do form permanecem inalterados.

## TC4 — Validar estado habilitada + sem crédito no Aluno (modal com Fechar)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [89, 90]

### Objetivo
Garantir a variação por perfil do modal: corpo curto e botão "Fechar" para o Aluno (RN 90).

### Passos
1. Acessar o form "Adicionar registro de aprendizagem" como Aluno em organização com IA habilitada e SEM crédito
   → Card de IA visível; botão desabilitado até upload.
2. Fazer upload do arquivo "certificado_ia.pdf"
   → Botão "Preencher com IA" habilitado.
3. Clicar no botão "Preencher com IA"
   → Modal "Limite de créditos atingido" abre com corpo curto "Todos os créditos disponíveis foram utilizados." e botão "Fechar" (sem botão "Contato").
4. Clicar no botão "Fechar"
   → Modal fecha.

## TC5 — Validar estado funcionalidade desabilitada (botão sempre disabled + toast vermelho)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [89]

### Objetivo
Garantir o estado 3: botão permanece desabilitado mesmo com upload e a tentativa exibe o toast de funcionalidade desabilitada (RN 89).

### Passos
1. Acessar o form "Adicionar registro" como Admin em organização com IA DESabilitada
   → Card de IA visível e legível; botão "Preencher com IA" desabilitado.
2. Fazer upload do arquivo "certificado_ia.pdf"
   → Botão "Preencher com IA" permanece desabilitado.
3. Tentar acionar o botão "Preencher com IA"
   → Toast vermelho exibida no canto inferior direito: "Essa funcionalidade não foi habilitada para esse ambiente. Ative ou consulte o responsável para liberar o acesso a essa funcionalidade no menu de Créditos de IA."; toast fechável pelo X.

## TC6 — Validar toggle de crédito de IA na TopBar
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [91, 91.1, 91.2, 92]

### Objetivo
Garantir o toggle sparkle da TopBar: cores por estado, tooltip e propagação para o form (RN 91, 92).

### Passos
1. Acessar a aplicação como Admin com crédito de IA disponível
   → Ícone sparkle na TopBar exibido na cor amarela (com crédito).
2. Passar o mouse sobre o ícone sparkle
   → Tooltip explica o estado atual e convida a alternar.
3. Clicar no ícone sparkle (alternar para sem crédito)
   → Ícone muda para a cor roxa (sem crédito).
4. Acionar o botão "Preencher com IA" no form "Adicionar registro" após upload de arquivo
   → Modal "Limite de créditos atingido" abre (flag propagou para o form).
5. Voltar a TopBar e clicar no sparkle novamente (restaurar crédito)
   → Ícone volta ao amarelo.

## TC7 — Validar que uso manual não consome crédito de IA
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [89]

### Objetivo
Garantir que salvar registro sem usar IA não registra consumo (h16 cenário 04 — verificação complementar em logs/DB na suíte de Logs).

### Passos
1. Acessar o form "Adicionar registro de aprendizagem" como Aluno com crédito disponível
   → Card de IA visível.
2. Enviar o formulário pelo botão "Enviar para aprovação" com os campos obrigatórios preenchidos manualmente
   → Toast de sucesso exibida; nenhuma chamada de IA é disparada (sem toast de IA, sem consumo registrado).

## TC8 — Validar tratamento de timeout/erro da IA
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [89]

### Objetivo
Garantir o toast de erro genérico quando a chamada da IA falha (h16 cenário 05 — Spike S9).

### Passos
1. Acessar o form "Adicionar registro" como Admin com IA habilitada + crédito, com a integração de IA indisponível/lenta (condição simulada no ambiente)
   → Card de IA visível.
2. Acionar o botão "Preencher com IA" após upload do arquivo "certificado_ia.pdf"
   → Toast de erro exibida: "Não foi possível preencher com IA. Tente novamente."; campos não são alterados.

## TC9 — Validar bloqueio no back para request sem requisitos (403)
**Prioridade**: high
**Tipo**: api
**Playbooks adicionais**: []
**RNs cobertas**: [89]

### Objetivo
Garantir que o back valida funcionalidade + crédito independente do front, retornando 403 (RN 89 — validação no back).

### Passos
1. Enviar request direto ao endpoint de preenchimento por IA com organização SEM a funcionalidade habilitada (bypass do front)
   → Resposta HTTP 403; nenhum preenchimento ocorre e nenhum crédito é consumido.
2. Enviar request direto ao endpoint com organização habilitada mas SEM crédito disponível
   → Resposta HTTP 403.

---

---
suite: Escopo do Líder, pessoas inativadas e origem Compartilhado
executor: playwright
org: principal
playbooks:
  - perfil-switch
  - ambientes-adicionais
  - cleanup-dados
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuário Líder com liderados diretos definidos na estrutura organizacional (e usuário fora da equipe com registros)
  - Usuário Admin com acesso a toda a organização
  - Pessoa inativável com registros conhecidos (ex. 3 Emitidos + 1 Pendente)
  - Organização parceira com compartilhamento configurado e registros Compartilhados replicados na organização principal
  - Aluno com vínculo em duas organizações com registros distintos (cenário multi-org)
---

# Escopo do Líder, pessoas inativadas e origem Compartilhado

## TC1 — Validar matriz de escopo Líder vs Admin
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [93]

### Objetivo
Garantir a tabela de permissões por ação: listagem, adicionar, visualizar/editar, aprovar/recusar, excluir e provedores (RN 93).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin
   → Lista exibe registros de todas as pessoas ativas da organização.
2. Acessar a mesma tela logado como Líder
   → Lista exibe apenas registros dos liderados diretos.
3. Clicar no botão "Adicionar" como Líder e abrir o dropdown "Pessoa"
   → Dropdown lista somente os liderados diretos.
4. Clicar na tab "Provedores" como Líder
   → Listagem de provedores completa é exibida (provedores são compartilhados, não filtram por liderado).

## TC2 — Validar 403 e toast ao atuar fora do escopo do Líder
**Prioridade**: critical
**Tipo**: api
**Playbooks adicionais**: []
**RNs cobertas**: [94]

### Objetivo
Garantir validação de escopo no submit: Líder atuando sobre registro de não-liderado recebe 403 com toast (RN 94).

### Passos
1. Enviar request de aprovação como Líder para um registro de pessoa fora da sua equipe (via API direta, simulando bypass do front)
   → Resposta HTTP 403.
2. Verificar o toast "Sem permissão pra atuar nesse registro" exibido pelo front ao receber 403 em uma ação de avaliação
   → Toast vermelho exibida: "Sem permissão pra atuar nesse registro"; registro permanece inalterado.

## TC3 — Validar preservação de ações antigas após mudança de hierarquia
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [95]

### Objetivo
Garantir que registros já aprovados pelo Líder continuam válidos após ele perder o liderado (RN 95).

### Passos
1. Aprovar um registro de um liderado como Líder
   → Toast "Registro aprovado"; registro fica Emitido.
2. Remover o liderado da equipe do Líder via estrutura organizacional
   → Operação concluída.
3. Acessar a lista como Admin e localizar o registro aprovado
   → Registro permanece Emitido/Aprovado (a aprovação antiga não é revertida).
4. Acessar a lista como Líder
   → Registro não aparece mais na lista do Líder (perdeu capacidade de novas ações sobre a pessoa).

## TC4 — Validar sumiço completo de pessoas inativadas
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [96, 96.1, 96.2, 96.3, 96.4]

### Objetivo
Garantir que registros de pessoa inativada somem do KPI, da lista e da extração, sem toggle de exibição (RN 96).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e anotar KPIs e a presença dos registros da pessoa-alvo (ex: 3 Emitidos + 1 Pendente)
   → Registros visíveis; KPIs contabilizam.
2. Inativar a pessoa na administração de usuários da organização
   → Pessoa inativada com sucesso.
3. Recarregar a tela "Aprendizagem > Registros"
   → KPIs decrementados (-3 Emitidos, -1 Pendentes); registros da pessoa não aparecem na lista; busca pelo nome retorna "Nenhum registro encontrado".
4. Verificar a interface por um eventual filtro "mostrar inativos"
   → Nenhum toggle de exibição de inativos existe (regra silenciosa).
5. Disparar extração de Dados CSV com escopo "Todos" e conferir o pacote (etapa manual)
   → Registros da pessoa inativada NÃO constam no arquivo extraído.

## TC5 — Validar coerência permanente entre KPI e lista
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [96.5]

### Objetivo
Garantir que o mesmo critério de pessoa ativa + escopo + soft-delete vale para /stats e /list — número do card bate com as linhas (RN 96.5).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e somar as contagens dos 4 KPI cards mais os status sem card (via filtros)
   → Total geral calculado.
2. Comparar com o total de linhas da lista sem filtros (somando a paginação)
   → Número de linhas é exatamente igual ao total geral dos KPIs — nenhuma divergência.
3. Repetir a comparação logado como Líder
   → Contagens do Líder também batem exatamente com as linhas visíveis do seu escopo.

## TC6 — Validar apresentação e menu restrito de registros Compartilhados
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [97, 97.1, 97.2, 98, 98.2]

### Objetivo
Garantir chip "Compartilhado", menu com apenas Visualizar + Histórico e ausência de Evidências (RN 97, 98).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin e localizar um registro Compartilhado
   → Linha exibe chip "Compartilhado" na coluna Origem.
2. Clicar no menu 3 pontos do registro Compartilhado
   → Menu exibe APENAS "Visualizar" e "Histórico"; itens "Editar", "Avaliar", "Excluir" e "Evidências" NÃO são renderizados.
3. Clicar no item "Visualizar"
   → Tela standalone do certificado abre em nova aba.
4. Clicar no item "Histórico" do registro Compartilhado
   → Drawer abre com a trilha contendo apenas o evento "criado".

## TC7 — Validar bloqueio de modificação de Compartilhado via API (403)
**Prioridade**: high
**Tipo**: api
**Playbooks adicionais**: []
**RNs cobertas**: [98.1]

### Objetivo
Garantir que tentativas de edição/exclusão de registro Compartilhado via API direta retornam 403 (RN 98.1 — h17 cenário 06).

### Passos
1. Enviar request PATCH de edição para um registro Compartilhado como Admin da organização receptora
   → Resposta HTTP 403; registro permanece inalterado.
2. Enviar request DELETE para o mesmo registro
   → Resposta HTTP 403.

## TC8 — Validar isolamento multi-organização do Aluno
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [20, 20.1]

### Objetivo
Garantir que cada org tem seu próprio "Meu histórico" sem consolidação (RN 20.1 — h17 cenário 05).

### Passos
1. Acessar a tela "Meu histórico" como Aluno logado na organização X (com 10 registros)
   → Lista e KPIs exibem somente os 10 registros da organização X.
2. Trocar para a organização Y (onde o aluno tem 4 registros)
   → Lista e KPIs exibem somente os 4 registros da organização Y; nada da organização X aparece.

## TC9 — Validar isolamento entre organizações no perfil Admin
**Prioridade**: high
**Tipo**: api
**Playbooks adicionais**: []
**RNs cobertas**: [21, 94]

### Objetivo
Garantir que Admin não atua em registros de outra org mesmo com vínculo duplo (h17 cenários 02/04).

### Passos
1. Consultar o endpoint de stats como Admin da organização Y
   → Resposta contém apenas contagens da organização Y.
2. Enviar request de aprovação como Admin da organização Y para registro da organização X
   → Resposta HTTP 403.

## TC10 — Validar permanência de Compartilhados após inativação da org parceira
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [98]

### Objetivo
Garantir preservação do histórico do aluno quando a org de origem é inativada (h17 cenário 07 — política do Spike S11, confirmar com produto).

### Passos
1. Acessar a tela "Aprendizagem > Registros" como Admin da organização receptora com registros Compartilhados da parceira P
   → Registros Compartilhados visíveis.
2. Inativar a organização parceira P (operação administrativa)
   → Parceira inativada.
3. Recarregar a lista da organização receptora
   → Os registros Compartilhados PERMANECEM acessíveis (preservação de histórico do aluno).

---

---
suite: Extração de dados da Evidência (export em massa de anexos)
executor: playwright
org: principal
playbooks:
  - toast-chakra
preconditions:
  - Ambiente Stage configurado e acessível
  - Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
  - Usuário logado como Admin com acesso à caixa de e-mail de teste
  - Registros com evidências variadas (PDF, JPG) anexadas, incluindo volume suficiente para gerar múltiplos pacotes
  - Conteúdo compartilhado (mirror) com participantes e certificados para o cenário de inclusão de mirrors
  - Infraestrutura de export assíncrono ativa no ambiente
---

# Extração de dados da Evidência (export em massa de anexos)

## TC1 — Validar estrutura interna do pacote ZIP de evidências
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [79]

### Objetivo
Garantir que o ZIP de evidências organiza os arquivos por pessoa, conforme estrutura do spike de export (pasta por participante).

### Passos
1. Disparar extração de Evidências como Admin sobre escopo com registros de 2 pessoas diferentes
   → Toast de "Extração iniciada" exibida.
2. Baixar o pacote gerado via notificação do sino (etapa manual)
   → ZIP contém uma pasta por pessoa (ex: "joao_silva/", "maria_santos/") com os arquivos de evidência/certificado dentro de cada pasta.

## TC2 — Validar registro de falhas parciais no export
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [79]

### Objetivo
Garantir que arquivos com falha não interrompem o export e são informados ao admin (decisão do spike: falha parcial continua).

### Passos
1. Disparar extração de Evidências sobre escopo contendo arquivo corrompido/removido do storage (condição simulada)
   → Extração processa sem abortar.
2. Baixar o pacote e verificar o conteúdo (etapa manual)
   → Arquivo de erros (ex: "export_errors.txt") presente no ZIP listando os arquivos que falharam; demais arquivos íntegros.

## TC3 — Validar split de export grande em múltiplos pacotes com notificação única
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [79]

### Objetivo
Garantir que exports muito grandes podem gerar múltiplos ZIPs com uma única notificação contendo todos os links (decisão do spike: auto-split + notificação única).

### Passos
1. Disparar extração de Evidências sobre escopo de alto volume (acima do threshold de split)
   → Toast de "Extração iniciada" exibida.
2. Aguardar a conclusão e abrir a notificação no sino (etapa manual)
   → Uma única notificação/e-mail é recebida contendo todos os links dos pacotes gerados.

## TC4 — Validar expiração do link de download (TTL)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [79]

### Objetivo
Garantir que link expirado não permite download e o caminho é gerar nova extração (TTL sugerido: 7 dias — Spike S8).

### Passos
1. Acessar um link de download de extração com TTL expirado (massa preparada/simulada)
   → Download é negado (link inválido/expirado).
2. Disparar nova extração do mesmo escopo
   → Novo pacote é gerado com link válido.

## TC5 — Validar inclusão de participantes de conteúdos compartilhados (mirror)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [79, 97]

### Objetivo
Garantir que o export inclui anexos de alunos inscritos em eventos espelhados (lição do spike: mirrors precisam de UNION na query).

### Passos
1. Disparar extração de Evidências sobre escopo que inclui conteúdo compartilhado (mirror) com participantes e certificados
   → Extração processa.
2. Baixar o pacote e verificar as pastas (etapa manual)
   → Anexos dos participantes do conteúdo espelhado CONSTAM no pacote (não foram omitidos).

---

---
suite: Tabelas do banco de dados (schema das entidades novas e atualizadas)
executor: playwright
org: principal
playbooks: []
preconditions:
  - Acesso de leitura ao banco de dados do ambiente Stage (validação manual/SQL)
  - Migrations do projeto Registros de Aprendizagem aplicadas no ambiente
  - Registros de teste criados pela UI para inspecionar a persistência
---

# Tabelas do banco de dados (schema das entidades novas e atualizadas)

## TC1 — [Validação Manual] Validar criação da tabela learning_records
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [41, 57]

### Objetivo
Garantir que a tabela `learning_records` existe com colunas centrais, FKs e soft-delete, sustentando origem/status/situação documentados.

### Passos
1. Consultar o schema da tabela "learning_records" no banco do Stage
   → Tabela existe com colunas para: usuário (user_id), organização (organization_id), provedor (provider_id), origem, status, situação do registro, título do conteúdo, tipo de experiência, categorias, carga horária, progresso, datas (início, término, certificado, validade) e soft-delete (deleted_at).
2. Criar um registro Externo pela UI como Aluno e consultar a linha correspondente
   → Linha persiste com origem externa, status pendente e organization_id da org ativa.
3. Excluir o registro pela UI e consultar novamente
   → Linha permanece com deleted_at preenchido (soft-delete) — não é removida fisicamente.

## TC2 — [Validação Manual] Validar criação da tabela learning_providers
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [84, 85]

### Objetivo
Garantir a tabela `learning_providers` com colunas de CRUD do provedor.

### Passos
1. Consultar o schema da tabela "learning_providers"
   → Tabela existe com colunas: organization_id, nome, website, descrição, flag de ativo e timestamps.
2. Criar um provedor pela UI e consultar a linha
   → Linha persiste com os valores informados e ativo = true (default).
3. Desativar o provedor pela UI (switch) e consultar
   → Flag de ativo atualizada para false.

## TC3 — [Validação Manual] Validar criação da tabela learning_record_evidences
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [58, 59]

### Objetivo
Garantir a tabela de evidências vinculada ao registro e ao storage.

### Passos
1. Consultar o schema da tabela "learning_record_evidences"
   → Tabela existe com FK para learning_records e referência de arquivo/storage (ex: archive_id), nome e metadados do arquivo.
2. Anexar evidência a um registro pela UI e consultar
   → Linha criada vinculando o arquivo ao registro.

## TC4 — [Validação Manual] Validar criação da tabela learning_record_histories
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [61]

### Objetivo
Garantir a tabela de trilha de eventos com os tipos canônicos (criado, submetido, aprovado, recusado, expirado, substituído).

### Passos
1. Consultar o schema da tabela "learning_record_histories"
   → Tabela existe com FK para learning_records, tipo do evento, descrição e timestamp.
2. Executar o ciclo criar → submeter → recusar (com justificativa) pela UI e consultar as linhas
   → Eventos persistidos em ordem cronológica; evento de recusa contém a justificativa na descrição.

## TC5 — [Validação Manual] Validar atualizações nas tabelas existentes
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [41, 79]

### Objetivo
Garantir as alterações nas tabelas atualizadas pelo projeto: event_participants, event_sources, filters, filter_options, active_filters, data_exports, export_jobs, organization_ai_credits e ai_consumptions.

### Passos
1. Consultar o schema das tabelas "event_participants" e "event_sources"
   → Alterações do projeto presentes (vínculo com learning_records para registros internos).
2. Consultar o schema das tabelas "filters", "filter_options" e "active_filters"
   → Estruturas suportam os filtros salvos da listagem de registros.
3. Consultar o schema das tabelas "data_exports" e "export_jobs"
   → Estruturas suportam a extração assíncrona (status, partes, urls, expiração).
4. Consultar o schema das tabelas "organization_ai_credits" e "ai_consumptions"
   → Estruturas suportam o crédito de IA e o registro de consumo do preenchimento automático.

## TC6 — [Validação Manual] Validar organization_id nas tabelas novas
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [96]

### Objetivo
Garantir que toda tabela nova relacionada à organização tem organization_id — requisito do banco histórico.

### Passos
1. Consultar as colunas das tabelas "learning_records", "learning_providers", "learning_record_evidences" e "learning_record_histories"
   → Todas possuem organization_id (direto ou derivável via FK obrigatória, conforme convenção do banco histórico).

---

---
suite: Exclusão do banco histórico (HistoricBaseCron)
executor: playwright
org: principal
playbooks: []
preconditions:
  - Acesso de leitura ao banco de dados do ambiente Stage (validação manual/SQL)
  - Worker HistoricBaseCron habilitado e executável sob demanda no ambiente
  - Organização de teste descartável com dados completos do projeto (registros, provedores, evidências, históricos, logs)
  - Segunda organização com dados que NÃO deve ser afetada (controle)
---

# Exclusão do banco histórico (HistoricBaseCron)

## TC1 — [Validação Manual] Validar exclusão de learning_records e dependências da org
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [96]

### Objetivo
Garantir que o worker do banco histórico remove os dados das tabelas novas da organização-alvo.

### Passos
1. Executar o worker "HistoricBaseCron" para a organização de teste
   → Worker conclui sem erro.
2. Consultar as tabelas "learning_records", "learning_record_evidences" e "learning_record_histories" filtrando pela organização de teste
   → Nenhuma linha da organização permanece.
3. Consultar a tabela "learning_providers" da organização de teste
   → Provedores da organização removidos conforme a política do banco histórico.

## TC2 — [Validação Manual] Validar exclusão nas tabelas atualizadas
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [96]

### Objetivo
Garantir que os dados do projeto nas tabelas atualizadas também são excluídos (event_participants, event_sources, filters, filter_options, active_filters, data_exports, export_jobs, organization_ai_credits, ai_consumptions).

### Passos
1. Após executar o worker para a organização de teste, consultar as tabelas atualizadas filtrando pela organização
   → Linhas vinculadas à organização excluídas conforme a política de cada tabela.

## TC3 — [Validação Manual] Validar exclusão das tabelas de logs
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [96]

### Objetivo
Garantir que logs novos e atualizados da organização também são removidos (learning_records_logs, learning_providers_logs, event_sources_logs, event_participant_logs, certificates_logs, ai_credit_consumption_breakdowns).

### Passos
1. Após executar o worker para a organização de teste, consultar as tabelas de logs filtrando pela organização
   → Nenhuma linha de log da organização permanece.

## TC4 — [Validação Manual] Validar isolamento: outras organizações intactas
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [96]

### Objetivo
Garantir que o worker não afeta dados de outras organizações.

### Passos
1. Consultar contagens das tabelas do projeto para a organização de controle ANTES de executar o worker na organização de teste
   → Contagens anotadas.
2. Executar o worker para a organização de teste e repetir as contagens da organização de controle
   → Contagens idênticas — nenhum dado da organização de controle foi excluído.

---

---
suite: Tabelas de logs (auditoria de operações)
executor: playwright
org: principal
playbooks:
  - cleanup-dados
preconditions:
  - Acesso de leitura ao banco de dados do ambiente Stage (validação manual/SQL)
  - Funcionalidade "Registros de Aprendizagem" habilitada na organização
  - Usuário Admin disponível para executar as operações que geram logs
  - IA habilitada com crédito para o cenário de consumo
---

# Tabelas de logs (auditoria de operações)

## TC1 — [Validação Manual] Validar logs de learning_records (criação, edição, avaliação e exclusão)
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [41, 53, 57]

### Objetivo
Garantir que cada operação CRUD/avaliação em registro gera linha em `learning_records_logs` com autor e timestamp.

### Passos
1. Criar um registro pela UI como Admin e consultar a tabela "learning_records_logs"
   → Linha de criação registrada com o usuário autor e timestamp.
2. Editar o registro e consultar os logs
   → Linha de edição registrada com os dados alterados.
3. Aprovar um registro Pendente e consultar os logs
   → Linha de avaliação/aprovação registrada.
4. Excluir o registro e consultar os logs
   → Linha de exclusão registrada.

## TC2 — [Validação Manual] Validar logs de learning_providers
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [84, 85, 86]

### Objetivo
Garantir logs de criação, edição, ativação/desativação e exclusão de provedor em `learning_providers_logs`.

### Passos
1. Criar um provedor pela UI e consultar a tabela "learning_providers_logs"
   → Linha de criação registrada.
2. Editar o provedor, alternar o switch "Ativo" e excluí-lo; consultar os logs após cada operação
   → Linhas de edição, mudança de status e exclusão registradas em ordem.

## TC3 — [Validação Manual] Validar logs atualizados das tabelas existentes
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [41]

### Objetivo
Garantir que as alterações do projeto refletem nas tabelas de log atualizadas (event_sources_logs, event_participant_logs, certificates_logs).

### Passos
1. Executar operações que tocam eventos internos (ex: emissão de certificado interno vinculado a learning_record) e consultar as tabelas de log correspondentes
   → Linhas registradas refletindo as operações nas entidades atualizadas.

## TC4 — [Validação Manual] Validar rastreio de consumo de IA em ai_credit_consumption_breakdowns
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: [89]

### Objetivo
Garantir que o uso do "Preencher com IA" registra consumo, e que falhas também são rastreadas (h16 cenário 05).

### Passos
1. Usar o "Preencher com IA" com sucesso em um registro e consultar a tabela "ai_credit_consumption_breakdowns"
   → Linha de consumo registrada vinculada à organização e ao tipo de geração do preenchimento automático.
2. Salvar um registro SEM usar IA e consultar a tabela
   → Nenhuma linha nova de consumo (uso manual não consome).
3. Forçar uma falha de IA (timeout simulado) e consultar a tabela
   → Tentativa registrada com status de falha.

---

---
suite: Trial (provisionamento e exclusão de dados)
executor: playwright
org: trial
playbooks:
  - trial
  - super-admin
  - cleanup-dados
preconditions:
  - Ambiente Stage configurado e acessível
  - URL de criação de trial e API de onboarding externo acessíveis no Stage
  - Credenciais/token para a API de onboarding disponíveis no `.env` do consumidor
  - Acesso de Admin à org Trial criada durante o teste
---

# Trial (provisionamento e exclusão de dados)

## TC1 — Validar feature de Registros em trial criado via URL
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [38, 41]

### Objetivo
Garantir que org trial criada pelo fluxo de registro web tem a feature de Registros de Aprendizagem operante com dados pré-definidos da SophiaTech.

### Passos
1. Acessar a URL de criação de trial do Stage e completar o fluxo de cadastro de organização trial
   → Organização trial criada com sucesso; login do administrador trial disponível.
2. Acessar a tela "Aprendizagem > Registros" na org trial
   → Tela carrega com tabs "Registros" e "Provedores"; dados pré-definidos da SophiaTech presentes (quando aplicável à feature).
3. Criar um registro Externo pela UI na org trial
   → Toast de sucesso exibida; registro aparece na lista com KPIs atualizados.

## TC2 — Validar feature de Registros em trial criado via API
**Prioridade**: high
**Tipo**: api
**Playbooks adicionais**: []
**RNs cobertas**: [38]

### Objetivo
Garantir paridade do trial provisionado pela API de onboarding externo.

### Passos
1. Enviar request de criação de trial pela API de onboarding externo do Stage
   → Resposta de sucesso com a organização trial criada.
2. Acessar a tela "Aprendizagem > Registros" na org trial criada via API
   → Feature operante, idêntica ao trial criado via URL.

## TC3 — Validar exclusão das informações pré-definidas da SophiaTech
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [96]

### Objetivo
Garantir que o expurgo de trial remove todas as informações pré-definidas da SophiaTech relacionadas à feature.

### Passos
1. Executar o processo de exclusão de dados pré-definidos da SophiaTech para a org trial
   → Processo conclui sem erro.
2. Acessar a tela "Aprendizagem > Registros" da org trial
   → Nenhum registro pré-definido da SophiaTech permanece; KPIs zerados quando não há outros dados.

## TC4 — Validar exclusão total do trial (pré-definidas + criadas pelos admins)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [96]

### Objetivo
Garantir que o expurgo total remove também os dados criados pelos administradores do trial (registros, provedores, evidências, históricos).

### Passos
1. Criar na org trial: 1 registro Externo com evidência + 1 provedor novo pela UI
   → Dados criados com sucesso.
2. Executar o processo de exclusão total de informações do trial
   → Processo conclui sem erro.
3. Consultar no banco as tabelas "learning_records", "learning_providers", "learning_record_evidences" e "learning_record_histories" filtrando pela org trial (etapa manual)
   → Nenhuma linha remanescente em learning_records, learning_providers, learning_record_evidences e learning_record_histories para a org trial.

