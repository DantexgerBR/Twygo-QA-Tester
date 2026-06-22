| Campo | Valor |
|---|---|
| **Discovery** | Registros de Aprendizagem - v02 25.05.2026 |
| **Objetivo** | Especificar a funcionalidade completa de Registros de Aprendizagem do LMS Twygo: listagem por perfil (Aluno, Líder, Admin), KPI cards, fluxos de criação/edição/avaliação/visualização/exclusão de registro, evidências, histórico, filtros, personalização de colunas, ações em massa, extração de dados, gestão de provedores, integração com crédito de IA, e regras transversais (escopo do Líder, pessoas inativadas, origem "Compartilhado"). Cobre Aluno, Líder e Admin. |
| **Figma** | N/A — referência visual no protótipo `claude-twygo-prototype` (branch `feat/registros-aprendizagem`). Telas principais: `MeuHistoricoPage` (Aluno), `AdminRegistrosPage` (Admin/Líder), `AdminProvedoresPage` (tab Provedores), `EditarCertificadoPage` (form unificado em 6 modos), `EditarProvedorPage` (form de provedor). |
| **Spec relacionada** | `docs/specs/registros-aprendizagem.md` §1 (crédito de IA), §2 (filtros 6m/12m), §3 (extração assíncrona), §4 (escopo Líder), §5 (KPI cards aluno vs admin), §6 (estado vazio KPI). Este Discovery consolida as decisões e detalha pontas de back/regra que faltavam. |

## Sumário

- [#R1 Listar registros de aprendizagem na tela do Aluno (Meu histórico)](#r1)
- [#R2 Listar registros de aprendizagem na tela do Admin/Líder (Aprendizagem > Registros)](#r2)
- [#R3 Operar a listagem: ordenar, buscar e alternar entre tabela e grid](#r3)
- [#R4 Suportar visualização mobile (auto-switch e hamburger)](#r4)
- [#R5 Apresentar 4 KPI cards na faixa superior das telas de Registros](#r5)
- [#R6 Calcular contagem dos KPIs conforme o perfil do usuário logado](#r6)
- [#R7 Aluno usa KPI cards como filtro de status sobre a lista](#r7)
- [#R8 Admin/Líder veem KPIs como dashboard estático](#r8)
- [#R9 Atualizar KPIs em resposta a ações e a transições de estado](#r9)
- [#R10 Tratar estado vazio (contagem = 0) sem perda de presença visual](#r10)
- [#R11 Adicionar novo registro de aprendizagem](#r11)
- [#R12 Editar registro de aprendizagem existente](#r12)
- [#R13 Visualizar registro de aprendizagem](#r13)
- [#R14 Avaliar registro externo pendente (Admin/Líder)](#r14)
- [#R15 Excluir registro de aprendizagem](#r15)
- [#R16 Gerenciar evidências do registro (upload, listagem)](#r16)
- [#R17 Consultar histórico (trilha de eventos) do registro](#r17)
- [#R18 Filtrar a listagem via drawer "Lista de filtros"](#r18)
- [#R19 Personalizar colunas exibidas via "Filtro rápido"](#r19)
- [#R20 Executar ações em massa (Aprovar, Recusar, Excluir)](#r20)
- [#R21 Extrair dados ou evidências da listagem](#r21)
- [#R22 Gerenciar provedores de aprendizagem (CRUD)](#r22)
- [#R23 Bloquear exclusão de provedor vinculado a registros](#r23)
- [#R24 Disponibilizar preenchimento com IA no formulário](#r24)
- [#R25 Gerenciar crédito de IA da organização (toggle TopBar)](#r25)
- [#R26 Restringir escopo do Líder a liderados diretos](#r26)
- [#R27 Tratar registros de pessoas inativadas](#r27)
- [#R28 Comportamento de registros de origem "Compartilhado"](#r28)
- [Controle de versão](#controle-de-versao)

---

## #R1 — Listar registros de aprendizagem na tela do Aluno (Meu histórico)

A tela "Meu histórico" é o ponto de partida do Aluno (Colaborador) pra ver, filtrar e cadastrar seus registros de aprendizagem. Vive no menu lateral do LMS do colaborador.

**RN 1** — A tela apresenta, de cima pra baixo: título "Meu histórico" + faixa de KPI cards + toolbar + lista (tabela ou grid).

- **RN 1.1** — Title do header da tela: "Meu histórico". Ao lado, fica o label "Carga horária total: X horas" (X = soma das cargas horárias dos registros do aluno na org ativa).
- **RN 1.2** — Faixa de KPI cards: 4 cards fixos (Emitidos, Expirados, Pendentes, Recusados) descritos em #R5–#R10.
- **RN 1.3** — Toolbar contém: botão **+ Adicionar** (roxo) à esquerda + busca + toggle de visualização tabela/grid + botão **Filtro** (drawer).
- **RN 1.4** — Lista exibida em formato **tabela** (default desktop) ou **grid de cards** (mobile e toggle manual).
- **RN 1.5** — Paginação: 25 itens por página (default), com opções `[25, 50, 100]`.

**RN 2** — Colunas padrão da tabela do Aluno, na ordem visível:

| Coluna | Conteúdo | Sort | Tooltip do header |
|---|---|---|---|
| Origem | Chip com ícone — Interno / Externo / Compartilhado | Sim | "Onde esse registro foi gerado. Interno = pelo LMS; Externo = adicionado por você; Compartilhado = veio de organização parceira." |
| Conteúdo | Título do conteúdo / curso (até 2 linhas, truncado) | Sim | — |
| Provedor | Nome do provedor de aprendizagem | Sim | "Instituição ou plataforma onde o conteúdo foi realizado (ex: Alura, FGV, USP)." |
| Situação do registro | Chip sólido — Aprovado (verde `#38A169`) ou Pendente (laranja `#DD6B20`) | Sim | "Indica se o registro foi aceito como parte da sua formação. Externos sempre 'Aprovado' após cadastro." |
| Progresso | Barra h=6px roxa `#7F27D8` + "%" à direita | Sim | "Quanto do conteúdo você concluiu." |
| Situação do certificado | Chip leve — Emitido, Expirado, Pendente, Recusado, Substituído, "Em andamento". `—` pra origem Externa. | Sim | "Status do documento de certificação. Externos não têm esse status." |
| Carga horária | "Xh" | Sim | "Total de horas declaradas no registro." |
| Emitido em | Data dd/mm/yyyy | Sim (cronológico) | — |
| Expira em | Data dd/mm/yyyy ou "—" se não tem validade | Sim (cronológico) | — |
| Ações | Menu **3 pontos** (referência em #R11–#R17) | Não | — |

**RN 3** — Empty state da lista (sem registros): mensagem "Você ainda não tem registros. Adicione o primeiro pelo botão acima." A faixa de KPIs continua visível com 4 cards zerados (#R10).

**RN 4** — Card do grid (modo grid view) reúne: chips Origem + Tipo de experiência no topo + título do conteúdo + Provedor + chip "Situação do registro" + carga horária + (se Interno) "Situação do certificado" + datas Emitido/Expira + menu 3 pontos.

**RN 5** — Lista NÃO navega ao clicar na linha/card — ações disponíveis exclusivamente via menu "3 pontos".

> **Premissa:** Não há paginação infinita. Paginação tradicional com pageSize 25/50/100. O dev pode revisar se UX de "load more" cabe em fase posterior.

---

## #R2 — Listar registros de aprendizagem na tela do Admin/Líder (Aprendizagem > Registros)

O **LMSAdminShell** (perfis Admin e Líder) abre por default em "Aprendizagem > Registros". A tela tem duas tabs: **Registros** (default) e **Provedores** (#R22).

**RN 6** — A tela apresenta, de cima pra baixo: tabs centralizadas → faixa de KPI cards + label "Carga horária total" → toolbar → lista.

- **RN 6.1** — Tabs centralizadas com padrão visual roxo (`#9349DE` ativa, `borderBottom 2px`).
- **RN 6.2** — Faixa de KPI cards segue #R5–#R10. No perfil **Admin**, a contagem cobre toda a organização; no **Líder**, cobre apenas os liderados diretos (#R26).
- **RN 6.3** — Toolbar tem: **+ Adicionar** (roxo) + **Ações em massa** (outline roxo, sem ícone) + **Extrair dados** (outline roxo, ícone `MdFileUpload`) + busca + toggle tabela/grid + **Filtro**.

**RN 7** — Colunas padrão da tabela do Admin/Líder (ordem visível):

| Coluna | Conteúdo | Sort | Notas |
|---|---|---|---|
| **Checkbox** | Seleção da linha (multi-row) | Não | Header tem checkbox "selecionar todos" tri-state (allSelected/someSelected) |
| Pessoa | Avatar + nome + e-mail (2 linhas) | Sim | — |
| Conteúdo | Título do conteúdo (até 2 linhas) | Sim | — |
| Origem | Chip — Interno / Externo / Compartilhado | Sim | Tooltip header: "Onde esse registro foi gerado." |
| Criado por | Nome de quem cadastrou (próprio aluno, admin, outro) | Sim | — |
| Provedor | Nome | Sim | Tooltip header igual ao aluno |
| Situação do registro | Chip sólido — Aprovado / Pendente | Sim | — |
| Progresso | Barra + % | Sim | — |
| Situação do certificado | Chip leve. `—` pra Externo. | Sim | — |
| Carga horária | "Xh" | Sim | — |
| Ações | Menu **3 pontos** | Não | — |

- **RN 7.1** — As colunas exibidas podem ser personalizadas via "Filtro rápido" (#R19). RN 7 acima descreve o **default**.
- **RN 7.2** — `Checkbox` e `Ações` são fixos nas pontas; todas as outras colunas podem ser ligadas/desligadas e reordenadas via DnD (#R19).
- **RN 7.3** — Coluna `Pessoa` é exclusiva do Admin/Líder (Aluno não vê).

**RN 8** — Empty state da lista (filtro sem resultados ou base vazia): "Nenhum registro encontrado".

**RN 9** — Linha tem altura aproximada de 52px. Body da tabela em desktop fica fixo em 660px (~12 linhas visíveis) com scroll interno; scroll horizontal isolado via overflow customizado.

**RN 10** — Colunas têm comportamento **sticky de borda + dropshadow** ao rolar lateralmente: a coluna "Checkbox" (esquerda) e "Ações" (direita) permanecem visíveis com sombra interna durante o scroll horizontal.

**RN 11** — Sort pelo header: clique cicla `asc → desc → none` (3º clique limpa). Headers sortable mostram setas roxas indicando direção ativa.

**RN 12** — Mock do protótipo tem 50 registros (32 Emitidos, 12 Expirados, 2 Pendentes, 4 Recusados, mais Substituído e "Em andamento" — totalGeral 78 com hidratação).

---

## #R3 — Operar a listagem: ordenar, buscar e alternar entre tabela e grid

**RN 13** — Busca por texto livre no input da toolbar filtra a lista em tempo real (debounce 200ms recomendado).

- **RN 13.1** — Campos cobertos pela busca (Aluno): `conteudo`, `origem`, `provedor`.
- **RN 13.2** — Campos cobertos pela busca (Admin/Líder): `conteudo`, `origem`, `provedor`, `pessoa.nome`, `pessoa.email`, `criadoPor`.
- **RN 13.3** — Busca convive com filtros do drawer e com filtros de KPI (Aluno) — combina como interseção.

**RN 14** — Toggle tabela/grid via 2 IconButtons (`MdViewList` e `MdGridView`). O ativo fica `variant="solid"` com `colorScheme="twygo"`.

- **RN 14.1** — Toggle não persiste entre sessões (default = tabela em cada nova carga).
- **RN 14.2** — Em mobile (< md), o toggle é escondido — auto-switch força grid (#R4).

**RN 15** — Sort funciona pra qualquer coluna marcada como `sortable`. Pra datas no formato `dd/mm/yyyy`, o sort usa accessor cronológico (`dd/mm/yyyy → yyyymmdd`).

- **RN 15.1** — Valores `null`/`undefined` sempre vão pro fim na ordenação ascendente.

---

## #R4 — Suportar visualização mobile (auto-switch e hamburger)

**RN 16** — Em viewport `< md` (768px), a tela força automaticamente o modo grid (cards), independente do toggle do usuário.

- **RN 16.1** — Toggle tabela/grid fica escondido em mobile (não tem sentido alternar).
- **RN 16.2** — KPI cards usam `SimpleGrid columns={{ base: 1, sm: 2, md: 4 }}` (1 col base, 2x2 sm-md, 4x1 ≥ md).

**RN 17** — Em mobile (< md), a sidebar do shell vira hamburger: `IconButton FiMenu` antes do breadcrumb abre Drawer `placement=left size=xs` com a mesma sidebar. Selecionar uma seção fecha o drawer automaticamente.

---

## #R5 — Apresentar 4 KPI cards na faixa superior das telas de Registros

**RN 18** — A tela "Meu histórico" (Aluno) e a aba "Registros" do LMS Admin/Líder apresentam, na faixa superior, 4 KPI cards fixos representando 4 status: **Emitidos**, **Expirados**, **Pendentes**, **Recusados**.

- **RN 18.1** — Cada card tem 4 elementos visuais: donut chart (proporção do status sobre o total geral — RN 22) + número (contagem) + label + tooltip.
- **RN 18.2** — Cores: Emitido `#38A169`, Expirado `#F56565`, Pendente `#DD6B20`, Recusado `#718096`.
- **RN 18.3** — Tooltip varia em tom por perfil:
  - **RN 18.3.1** — No Aluno, tom 2ª pessoa ("você").
  - **RN 18.3.2** — No Admin/Líder, tom institucional/descritivo.

**RN 19** — À direita da faixa, fica o label complementar "**Carga horária total: X horas**" (não é card). O valor segue o mesmo escopo do KPI: Aluno → próprio aluno; Admin → toda a org; Líder → liderados diretos.

> **Premissa:** Os 4 status fixos do KPI são sempre os mesmos nos 3 perfis. Substituído e "Em andamento" aparecem apenas na lista e no donut do denominador — nunca como card.

---

## #R6 — Calcular contagem dos KPIs conforme o perfil do usuário logado

**RN 20** — No perfil **Aluno**, a contagem cobre apenas registros do próprio usuário, escopados à organização ativa.

- **RN 20.1** — Multi-organização do Aluno **não** entra no escopo desta feature.

> **Premissa:** Cada org ativa do aluno tem seu próprio "Meu histórico" e seus próprios KPIs. Trocar de org é o mecanismo pra trocar de visão.

**RN 21** — No perfil **Admin**, a contagem cobre todos os registros da organização ativa.

**RN 22** — No perfil **Líder**, a contagem cobre apenas registros das pessoas que ele lidera diretamente (regra detalhada em #R26).

**RN 23** — O total geral (denominador do donut) é a **soma dos 6 status**: Emitido + Expirado + Pendente + Recusado + Substituído + "Em andamento".

- **RN 23.1** — A soma dos 4 KPI cards não necessariamente bate o total geral.

**RN 24** — Registros de pessoas inativadas **não** contam no KPI nem aparecem na lista (#R27).

**RN 25** — Status "Expirado" reflete no instante em que o registro cruza `data_validade`, sem reload da tela.

> **Validar a seguinte possibilidade:** Como garantir que o status "Expirado" reflita no mesmo instante que cruza a data de validade, com performance adequada em orgs grandes?
> - Cálculo on-the-fly em cada query (SQL `CASE WHEN validade < NOW()`) com índice em `data_validade`.
> - Job materializado de curto intervalo (atraso aceitável vs simplicidade da query).
> - Como o front é avisado da transição em sessão aberta (refetch periódico vs push).

---

## #R7 — Aluno usa KPI cards como filtro de status sobre a lista

**RN 26** — No perfil Aluno, cada card é clicável e funciona como filtro de status sobre a lista.

- **RN 26.1** — Clicar num card ativo deseleciona (toggle on/off). Não há filtro inicial obrigatório.
- **RN 26.2** — Apenas um card pode estar ativo por vez.

**RN 27** — Card ativo: borda colorida + leve elevação (`translateY(-3px)` + sombra). Demais ficam dimmed (`grayscale(1)` + `opacity 0.55`).

- **RN 27.1** — Hover em card dimmed restaura visual temporariamente.

**RN 28** — Contagem do KPI é **independente** do drawer "Lista de filtros" — sempre reflete o total do escopo, não o subconjunto filtrado.

- **RN 28.1** — Filtro do KPI e filtros do drawer convivem (interseção).

**RN 29** — Card vazio (contagem = 0) continua clicável; aplicar filtro leva ao empty state da lista.

---

## #R8 — Admin/Líder veem KPIs como dashboard estático

**RN 30** — No perfil Admin/Líder, cards **não respondem a clique**: sem cursor pointer, sem hover transform, sem estado "selected" nem "dimmed".

**RN 31** — Contagem é puramente informativa — não filtra a lista nem reage a filtros do drawer.

---

## #R9 — Atualizar KPIs em resposta a ações e a transições de estado

**RN 32** — Após Adicionar, Editar, Aprovar, Recusar ou Excluir um registro, o número e o donut dos KPIs atualizam **imediatamente** (sem reload).

- **RN 32.1** — Transições entre status refletem no instante da ação. Ex: Aprovar Pendente → -1 em Pendentes, +1 em Emitidos.
- **RN 32.2** — Vale pra ações individuais (menu 3 pontos) e pra ações em massa (#R20).
- **RN 32.3** — Em ações em massa de N registros, o refresh do KPI acontece **uma única vez** após o batch terminar.

> **Validar a seguinte possibilidade:** Como o back e o front se coordenam pro refresh imediato?
> - Endpoint da ação retorna stats no payload (1 roundtrip) vs refetch separado do `/stats` (2 roundtrips).
> - Concorrência entre admins (race conditions).

**RN 33** — Quando um registro cruza `data_validade` durante sessão aberta, migra automaticamente de Emitido pra Expirado nos KPIs (ver RN 25).

**RN 34** — Mudanças na hierarquia organizacional (Líder ganha/perde liderado) refletem no KPI do Líder em momento a ser definido pelo dev.

> **Premissa:** A política de refresh da hierarquia "liderados diretos" fica a critério do dev. Aceita pequena inconsistência em troca de simplicidade.

---

## #R10 — Tratar estado vazio (contagem = 0) sem perda de presença visual

**RN 35** — Card com contagem 0 mantém layout idêntico aos cards com dado.

- **RN 35.1** — Donut renderizado como anel sólido cinza claro `#EDF2F7`.
- **RN 35.2** — Número "0" em preto bold, mesmo tamanho/peso.
- **RN 35.3** — Label normal, sem alteração.
- **RN 35.4** — Borda, sombra e opacity idênticas a card com dado (sem dim/grayscale/encolhimento).

**RN 36** — Quando todos os 4 cards são 0 (cenário "tudo zero"), a faixa aparece normalmente com os 4 anéis cinza completos.

- **RN 36.1** — Não há empty state customizado da faixa — ela é permanente.
- **RN 36.2** — Aluno novo entrando na empresa vê os 4 cards zerados.

**RN 37** — A regra vale igualmente nos 3 perfis (Aluno, Líder, Admin).

- **RN 37.1** — No Aluno, card vazio segue clicável (#R7 RN 29).
- **RN 37.2** — No Admin/Líder, segue estático (#R8 RN 30).

---

## #R11 — Adicionar novo registro de aprendizagem

**RN 38** — A ação de "Adicionar" abre o formulário **EditarCertificadoPage** no modo apropriado conforme o perfil que disparou:

| Perfil | Modo do form | Cabeçalho do form | Comportamento ao Salvar |
|---|---|---|---|
| Aluno | `aluno` | "Adicionar registro de aprendizagem" | Cria registro com status inicial = **Pendente**, Situação do registro = Pendente. Toast: "Registro enviado para aprovação". |
| Admin | `admin-adicionar` | "Adicionar registro" | Cria registro com status inicial = **Emitido**, Situação = Aprovado. Toast: "Registro adicionado · entrou como aprovado". |
| Líder | `admin-adicionar` | "Adicionar registro" | Idem Admin, mas dropdown "Pessoa" restrito a liderados (#R26). |

**RN 39** — Campos do formulário (presença e edição variam por modo):

| Campo | Tipo | Aluno (`aluno`) | Admin/Líder (`admin-adicionar`) | Obrigatório? |
|---|---|---|---|---|
| **Pessoa** | CreatableSelectAle (dropdown sem criação no admin) | Não aparece | Editável | Sim no admin |
| Provedor de aprendizagem | CreatableSelectAle (criatable) | Editável | Editável | Sim |
| Tipo de experiência | Select single | Editável | Editável | Sim |
| Categorias | MultiTagSelect (criatable) | Editável | Editável | Não |
| Descrição | Textarea | Editável | Editável | Não |
| Carga horária | Input number | Editável (placeholder "Ex: 40") | Editável | Sim |
| Data de início | Input date | Editável | Editável | Não |
| Data de término | Input date | Editável | Editável | Sim |
| Data do certificado | Input date | Editável | Editável | Não |
| Data de validade | Input date | Editável | Editável | Não |
| Nota | Input number | Editável | Editável | Não |
| Evidências (drag area + lista) | File upload | Editável | Editável | Não (mas obrigatório pra IA — #R24) |

- **RN 39.1** — "Tipo de experiência" tem 8 opções fixas: Curso, Trilha, Workshop, Mentoria, Palestra, Evento, Aula, Outro.
- **RN 39.2** — "Categorias" tem 9 padrão (Liderança, Comunicação, Tecnologia, Gestão, Soft skills, Compliance, Idiomas, Saúde e bem-estar, Diversidade) + criação inline.
- **RN 39.3** — "Provedor" tem 6 padrão alfabéticos (Alura, Coursera, FGV, LinkedIn Learning, Udemy, USP) + criação inline. Provedores criados no form entram no provedoresExtras local até persistir.

**RN 40** — Validação de obrigatórios: ao tentar Salvar com campo `*` vazio, mostra `isInvalid` (borda vermelha) + "Campo obrigatório" abaixo do campo. Erro some quando user começa a digitar (`clearError(key)` no onChange).

- **RN 40.1** — Cancelar/Excluir não passam pela validação.

**RN 41** — Origem do registro é **inferida automaticamente**:

- Aluno cadastrando → origem `Externo`.
- Admin cadastrando → origem `Externo`.
- Sistema gerando após conclusão de Event interno (fora desta feature, vem do LMS) → origem `Interno`.
- Veio de outra org via `SharedEvent` → origem `Compartilhado` (#R28).

> **Premissa:** Aluno e Admin só cadastram registros do tipo "Externo". "Interno" e "Compartilhado" são gerados pelo sistema/integração — fora do form.

---

## #R12 — Editar registro de aprendizagem existente

**RN 42** — Item "Editar" do menu 3 pontos da linha abre o formulário no modo apropriado e com campos pré-populados:

| Perfil + Origem + Status | Modo do form | Cabeçalho | Disponibilidade do Editar |
|---|---|---|---|
| Aluno + Externo + Pendente | `aluno` | "Editar registro de aprendizagem" | **Sim** |
| Aluno + Externo + Recusado | `aluno` | idem | **Sim** |
| Aluno + Externo + Expirado | `aluno` | idem | **Sim** (mas sem expectativa de revalidação) |
| Aluno + Externo + Emitido | — | — | **Não** (Externo aprovado não edita; cria substituição se precisar) |
| Aluno + Interno | — | — | **Não** (gerado pelo LMS) |
| Aluno + Compartilhado | — | — | **Não** |
| Admin + Externo + Emitido | `admin-editar` | "Editar registro" | **Sim** |
| Admin + Externo + Recusado/Expirado | `admin-editar` | idem | **Sim** |
| Admin + Interno/Compartilhado | — | — | **Não** |

**RN 43** — Em modo de edição, todos os campos editáveis em criação continuam editáveis, **exceto** quando há lógica específica:

- Campo **Pessoa**: disabled em `admin-editar` (registro existente tem dono fixo).
- Datas migradas de `dd/mm/yyyy` (mock) pra `yyyy-mm-dd` (`<Input type="date">`) via helper.

**RN 44** — Botão principal do rodapé tem label dinâmico:

- Aluno editando → "Salvar edição". Toast pós-salvar: "Edição salva".
- Admin editando → "Salvar". Toast: "Registro salvo".

**RN 45** — Botão "Excluir" do rodapé (#R15) só aparece quando a regra de exclusão permite — não fica disabled com tooltip.

**RN 46** — Banners contextuais no topo do form em modo de edição/visualização:

- Status = Recusado → banner vermelho `#FED7D7` com ícone `MdError` `#C53030`, título "Registro de aprendizagem recusado" + justificativa lida do último evento `tipo: "recusado"` no `historico`.
- Status = Emitido → banner verde `#C6F6D5` com ícone `MdCheckCircle` `#22543D`, texto "Certificado aprovado".
- Ambos têm botão "Histórico" à direita (outline roxo) que abre o drawer (#R17).

---

## #R13 — Visualizar registro de aprendizagem

**RN 47** — Item "Visualizar" do menu 3 pontos da linha abre o registro **em modo somente leitura**. Sempre presente, mas com regras diferentes por origem:

| Origem + Status | Comportamento do Visualizar |
|---|---|
| Interno + Emitido/Expirado/etc. | Abre **tela standalone** em nova aba via `?cert=ID` (TopBar + view do certificado, sem sidebar). |
| Externo + qualquer status que não "Em andamento" | Abre o form **EditarCertificadoPage** em modo `aluno-visualizar` (Aluno) ou `admin-visualizar` (Admin), com inputs disabled e rodapé escondido. |
| Compartilhado | Abre tela standalone (mesmo que Interno). |
| Qualquer origem + "Em andamento" | **Disabled** com tooltip "Disponível após a conclusão". |

**RN 48** — No modo viewing do form:

- Inputs, CreatableSelectAle, MultiTagSelect e RichTextEditor ficam `isDisabled`.
- Toolbar do RichTextEditor some; bg dos campos vai pra cinza.
- Card promocional de IA (#R24) **some**.
- Drop zone de upload **some**; botão X de remover arquivo **some**. Lista de arquivos continua visível (somente leitura).
- Botões de rodapé ("Salvar", "Excluir", "Cancelar") **somem inteiramente** — saída pela seta "Voltar" do header.
- Banner verde "Certificado aprovado" aparece quando status = Emitido. Banner vermelho "Recusado" + justificativa aparece quando status = Recusado.

**RN 49** — Tela standalone do certificado (`?cert=ID`):

- Layout: TopBar + view do certificado, sem sidebar.
- Sub-card do certificado à esquerda (cintas roxas `#7f27d8` no topo e rodapé, com chanfro à direita; título "CERTIFICADO DE CONCLUSÃO"; nome + curso + data + carga horária).
- Área de validação à direita (alert verde "{token} é um certificado válido"; botões "Baixar o certificado", "Validar outro certificado", "Compartilhar no LinkedIn").
- "Validar outro certificado" → `window.close()`.

> **Premissa:** Token de validação ("Cert ID") usado na tela standalone é gerado pelo back na hora da emissão e é o mesmo usado pra compartilhamento no LinkedIn (referência cruzada com PRD "Compartilhar Certificado LinkedIn", em outro Discovery).

---

## #R14 — Avaliar registro externo pendente (Admin/Líder)

**RN 50** — Item "Avaliar" do menu 3 pontos é o item **primário** (em destaque com ícone `FiCheckCircle` na cor roxa) quando o registro é Externo + Pendente. Em outros casos, o item não aparece.

- **RN 50.1** — Disponibilidade exclusiva pra Admin/Líder. Líder só vê o "Avaliar" pra registros dos seus liderados (#R26).

**RN 51** — Clicar em "Avaliar" abre o formulário em modo `admin-avaliar`:

- Cabeçalho "Avaliar registro".
- Banner amarelo "Avaliação pendente" no topo (bg `#FEF3C7`, ícone `FiInfo`, texto `#92400E`).
- **Apenas** os campos **Tipo de experiência** e **Categorias** ficam editáveis. Demais ficam disabled (vêm preenchidos pelo aluno).
- Rodapé com 3 botões:
  - **Aprovar** (verde, `FiCheck`) — chama validação (Tipo é obrigatório), depois submete.
  - **Recusar** (vermelho outline, `FiX`) — abre modal de Recusa.
  - **Cancelar** (outline, neutro) — fecha sem mudanças.

**RN 52** — Modal de Recusa:

- `AlertDialog` com Textarea obrigatória **Justificativa**.
- Botão "Recusar registro" fica `isDisabled` enquanto Textarea vazia. Botão "Cancelar" limpa a justificativa.
- Submissão escreve a justificativa em `descricao` do evento `tipo: "recusado"` no `historico` do registro. Esse texto alimenta o banner vermelho que o aluno vê em modo de edição/visualização.

**RN 53** — Resultado da avaliação:

- Aprovar → status do registro vira **Emitido**, Situação do registro = Aprovado. Toast Admin: "Registro aprovado".
- Recusar → status vira **Recusado**. Toast Admin: "Registro recusado".

**RN 54** — Validação do form em `admin-avaliar`: só "Tipo de experiência" é obrigatório (demais campos vêm do aluno e não são editáveis).

---

## #R15 — Excluir registro de aprendizagem

**RN 55** — Disponibilidade do "Excluir" no menu 3 pontos:

| Perfil | Origem | Status que permite Excluir |
|---|---|---|
| Aluno | Externo | Apenas **Pendente** |
| Aluno | Interno / Compartilhado | Nunca |
| Admin/Líder | Externo | Emitido, Recusado, Expirado |
| Admin/Líder | Externo + Pendente | Não — usa Avaliar/Recusar |
| Admin/Líder | Externo + Substituído | Não |
| Admin/Líder | Interno / Compartilhado | Nunca |

- **RN 55.1** — Quando a regra não permite, o item simplesmente **não é renderizado** no menu — não fica disabled com tooltip.

**RN 56** — Confirmação destrutiva via `AlertDialog`:

- Header simples + body com `Alert` vermelho (ícone `MdWarningAmber`) "Esta ação não pode ser desfeita.".
- Pergunta com o conteúdo do registro em bold.
- Footer: Cancelar (outline) + Excluir (sólido vermelho).
- Pattern é o mesmo do AlertDialog acionado pelo botão "Excluir" do form em modo de edição.

**RN 57** — Após confirmar, o registro é removido (soft-delete recomendado pra rastreabilidade). KPIs atualizam imediatamente (#R9). Toast: "Registro excluído".

> **Validar a seguinte possibilidade:** Estratégia de soft-delete vs hard-delete pro registro?
> - Soft-delete via `acts_as_paranoid` (`deleted_at`) — preserva rastreio histórico, alinha com convenção twyg-app.
> - Hard-delete — apaga permanente, libera espaço, perde rastro.

---

## #R16 — Gerenciar evidências do registro (upload, listagem)

**RN 58** — O formulário em modos editáveis (`aluno`, `admin-adicionar`, `admin-editar`) tem **drag area** + **lista de arquivos** pra evidências de aprendizagem.

- **RN 58.1** — Drag area aceita arrastar arquivos ou clicar pra abrir o file picker.
- **RN 58.2** — Lista mostra arquivos anexados com nome + ícone + botão X (remover).
- **RN 58.3** — Em modo viewing (`*-visualizar`), drag area some, botão X some, lista fica somente leitura.

**RN 59** — Formatos aceitos:

> **Validar a seguinte possibilidade:** Tipos de arquivo aceitos como evidência?
> - PDF e imagens (JPG, PNG) — cobre comprovantes mais comuns.
> - Adicionalmente DOCX, XLSX — depende se RH quer aceitar planilhas/anotações.
> - Limite de tamanho por arquivo (sugestão: 10 MB).
> - Limite de quantidade por registro (sugestão: 10 arquivos).
> - Armazenamento: S3? Bunny (mesma usada pra vídeos)?

**RN 60** — O drawer "Evidências" (acessado via menu 3 pontos da linha) lista os arquivos do registro pra download/preview, sem permitir edição.

- **RN 60.1** — Disponibilidade do "Evidências" no menu: apenas Externo (Interno e Compartilhado não têm evidências — são gerados internamente).

---

## #R17 — Consultar histórico (trilha de eventos) do registro

**RN 61** — O drawer "Histórico" (acessado via menu 3 pontos OU pelo botão "Histórico" do banner contextual do form) lista a trilha de eventos do registro em ordem cronológica:

| Tipo de evento | Quando é registrado | Campo `descricao` |
|---|---|---|
| `criado` | Registro foi cadastrado | "Por {nome}" |
| `submetido` | Aluno enviou pra avaliação (Externo) | (vazio) |
| `aprovado` | Admin aprovou | "Por {nome}" |
| `recusado` | Admin recusou | Justificativa fornecida no modal de recusa |
| `expirado` | Sistema marcou como expirado | (vazio) |
| `substituido` | Novo registro substituiu este | "Substituído por {ID}" |

- **RN 61.1** — Trilha esperada por status:
  - Externo Emitido: `criado → submetido → aprovado`.
  - Externo Pendente: `criado → submetido`.
  - Externo Recusado: `criado → submetido → recusado` (com descricao = justificativa).
  - Externo Expirado: `criado → submetido → aprovado → expirado`.
  - Interno / Compartilhado: apenas `criado`.

**RN 62** — Disponibilidade do "Histórico" no menu: **sempre** presente (independente de perfil/origem/status).

---

## #R18 — Filtrar a listagem via drawer "Lista de filtros"

**RN 63** — O botão "Filtro" da toolbar abre o drawer "Lista de filtros" (`placement=right`).

- **RN 63.1** — O botão reflete estado ativo: `variant="solid"` + sufixo `(N)` quando há filtro aplicado.

**RN 64** — Drawer "Lista de filtros" — view default ("lista"):

- Busca no topo (filtra a lista de filtros pelo label).
- Link "+ Novo" abaixo da busca — abre a view "Filtro rápido" (#R19).
- 3 grupos colapsíveis (chevron up/down):
  - **Filtros padrão** (default aberto): 4 filtros radio = atalhos dos KPI (Válidos → Emitido, Expirados → Expirado, Pendentes → Pendente, Recusados → Recusado). Cada linha tem tooltip info (`FiInfo cursor=help`) + botão duplicar (`MdContentCopy` → "Em breve").
  - **Filtros compartilhados** (fechado, vazio): "Em breve — filtros criados pela equipe vão aparecer aqui."
  - **Meus filtros** (fechado, vazio): "Em breve — filtros que você criar ou duplicar ficam aqui."
- Footer: Cancelar (outline roxo) + Aplicar (sólido roxo).

**RN 65** — Comportamento de pending:

- `pending` interno do drawer ressincroniza com o filtro efetivo a cada abertura (cobre "abriu, mudou, cancelou, abriu de novo").
- `togglePending` deseleciona ao clicar no radio já selecionado.
- Aplicar → propaga pro parent. Cancelar/X → descarta pending.

**RN 66** — Sincronização KPI cards (Aluno) ↔ drawer: ambos manipulam o mesmo `filtroStatus`. Clicar num card altera o filtro, e o drawer já abre com o pending correto.

---

## #R19 — Personalizar colunas exibidas via "Filtro rápido"

**RN 67** — Clicar em "+ Novo" do drawer de filtros abre a view "Filtro rápido". Header muda pra "Filtro rápido". Botão "Voltar < Lista de filtros" aparece no topo.

**RN 68** — Estrutura da view "novo":

- **Colunas para filtrar** (default aberto): botão outline "+ Opções de filtro" (toast "Em breve" — filtro avançado fica fora desta leva).
- **Colunas para exibir** (default aberto): lista de 17 colunas com checkbox + handle de drag (`MdDragIndicator`). 10 marcadas por default (Pessoa, Conteúdo, Origem, Provedor, Situação do registro, Progresso, Situação do certificado, Carga horária, Emitido em, Expira em).
- **Salvar filtro** (default fechado): placeholder "Em breve".

**RN 69** — DnD real das colunas (libs `@dnd-kit/core` + `@dnd-kit/sortable`):

- Handle do drag é o `MdDragIndicator` (touchAction=none pra mobile).
- `PointerSensor` com `distance: 5` — drag só dispara após mover ≥5px (preserva click do checkbox).
- Linha em drag ganha `bg #F2ECFA + opacity 0.85 + cursor=grabbing`.
- Reorder é livre — itens on/off podem ser intercalados em qualquer posição.

**RN 70** — Aplicar persiste a ordem + on/off via `colunasCommitted` no parent. A tabela reflete a personalização imediatamente — `Checkbox` e `Ações` ficam fixos nas pontas; o miolo segue o array.

> **Premissa:** Persistência da customização entre sessões fica como item futuro (hoje resseta a cada nova carga). Quando virar requisito, salva como preferência do user na org.

---

## #R20 — Executar ações em massa (Aprovar, Recusar, Excluir)

**RN 71** — O botão "Ações em massa" da toolbar (texto, sem ícone) abre o drawer "Ações em massa" (`placement=right`).

- **RN 71.1** — Disponibilidade exclusiva pra Admin/Líder (Aluno não tem ações em massa).
- **RN 71.2** — Botão fica enabled mesmo sem nenhuma linha marcada — o usuário pode escolher "Todos do filtro atual" como escopo dentro do drawer.

**RN 72** — Drawer "Ações em massa" — campos:

- **Ação** (Select obrigatório com tooltip): Aprovar registros / Recusar registros / Excluir registros.
- **Opções** (radio custom):
  - "Selecionados (N)" — disabled com tooltip se 0 marcados.
  - "Todos do filtro atual (M)".
  - Default: Selecionados se há seleção; senão Todos do filtro atual.
- Banner amarelo (`FiInfo`) quando o escopo escolhido não tem registro **elegível** pra ação.
- Footer: Cancelar + Aplicar.

**RN 73** — Elegibilidade espelha a matriz do menu 3 pontos por linha — **nunca permitir em massa o que não dá pra fazer individualmente**:

- `aprovar` / `recusar` → Externo + Pendente.
- `excluir` → Externo + (Emitido | Recusado | Expirado).

**RN 74** — Fluxo por ação ao clicar Aplicar:

- Aprovar → executa direto. Toast com ratio: "X processados (Y ignorados por não atender aos critérios da ação)".
- Recusar → abre **modal de Justificativa obrigatória** (Textarea, botão "Recusar registros" disabled enquanto vazia). Justificativa aplica a todos os registros do batch.
- Excluir → abre `AlertDialog` destrutivo: header vermelho + alerta + contagem em bold ("Você está excluindo N registros."). Confirmar executa.

**RN 75** — Após o batch, `onAfterAplicar` limpa a seleção da página. KPIs atualizam **uma única vez** com todos os deltas (#R9 RN 32.3).

---

## #R21 — Extrair dados ou evidências da listagem

**RN 76** — O botão "Extrair dados" da toolbar (`MdFileUpload`) abre o drawer "Configurações da extração" (`placement=right`).

- **RN 76.1** — Disponibilidade exclusiva pra Admin/Líder.

**RN 77** — Drawer "Configurações da extração" — campos:

- **Tipo de extração** (Select com tooltip): "Dados" ou "Evidências".
- **Branch Dados** — 3 grupos de radio:
  - Formato: CSV / PDF.
  - Dados (linhas): Filtro atual / Todos.
  - Colunas: Filtro atual / Todos.
- **Branch Evidências** — 1 grupo de radio:
  - Escopo: Filtro atual / Todos.

**RN 78** — Modal de Atenção (`AlertDialog` interno) dispara quando o user pede Evidências mas o escopo contém registros sem `evidencias`:

- Mostra ratio "N de M sem evidência" (ex: "5 de 32").
- Cancelar volta pro drawer; OK continua a extração ignorando os sem evidência.

**RN 79** — Execução da extração:

- Toast inicial (flash message): "Sua extração está sendo processada. Você receberá uma notificação quando estiver pronta."
- Quando back termina: envia e-mail com link de download + dispara notificação no sino da TopBar.
- Se ZIP de evidências for muito grande pra envelopar em e-mail, a notificação leva ao link de download na plataforma.

**RN 80** — Toasts de feedback imediato (antes do processamento real):

- Dados → "Extração iniciada: {CSV|PDF} com {N} registros (filtro atual|todos · colunas {do filtro|completas})."
- Evidências → "Extração iniciada: baixando evidências de {comEv} registros[ ({semEv} sem evidência ignorados)]."

> **Validar a seguinte possibilidade:** Implementação da fila assíncrona da extração.
> - Job Sidekiq que monta o pacote (CSV/PDF/ZIP) e armazena temporariamente.
> - Notificação via `NotificationHistory` no sino + e-mail via Devise/template.
> - TTL do pacote temporário (sugestão: 7 dias).
> - Tratamento de pacotes grandes (> limite de e-mail) — só link, sem anexo.

---

## #R22 — Gerenciar provedores de aprendizagem (CRUD)

**RN 81** — A tab "Provedores" do LMSAdminShell (acessível ao Admin, ver #R26 pra Líder) lista provedores cadastrados na organização.

**RN 82** — Colunas da tabela de Provedores:

| Coluna | Conteúdo | Sort |
|---|---|---|
| Checkbox | Seleção multi-row | — |
| Nome | Texto | Sim |
| Website | Link externo (`ChakraLink isExternal`, host limpo) | Não |
| Descrição | Texto truncado | Não |
| Ativo | Switch verde (toggle direto na linha) | Não |
| Criado em | Data dd/mm/yyyy | Sim (cronológico) |
| Ações | 2 IconButtons inline — Editar (`MdEdit` roxo) e Excluir (`MdDelete` cinza → vermelho no hover) | — |

**RN 83** — Toolbar da tab Provedores tem: + Adicionar + busca + Filtro. **Sem** toggle grid/list (em mobile, vira card automaticamente).

**RN 84** — Adicionar/Editar provedor abre `EditarProvedorPage` (tela dedicada, não modal):

- Campos: Nome (obrigatório), Website (URL), Descrição (Textarea), Ativo (Switch, default ligado).
- Botões do rodapé: Cancelar (outline) + Salvar (roxo).

**RN 85** — Toggle Ativo na linha:

- Liga/desliga o provedor sem precisar abrir o form.
- Provedores inativos não aparecem no dropdown de "Provedor" do formulário de Registro (#R11). Provedores que já estão vinculados a registros existentes continuam aparecendo na coluna da lista de Registros.

---

## #R23 — Bloquear exclusão de provedor vinculado a registros

**RN 86** — Ao clicar "Excluir" num provedor que **não tem** registros vinculados:

- `AlertDialog` de confirmação destrutiva (pattern de RN 56).
- Confirmar remove o provedor. Toast: "Provedor excluído".

**RN 87** — Ao clicar "Excluir" num provedor que **tem** registros vinculados:

- `AlertDialog` informativo (não destrutivo): header com ícone amarelo + texto "Provedor não pode ser excluído. Existem N registros vinculados.".
- Botão único "Entendi" (outline).
- Provedor permanece intacto.

> **Validar a seguinte possibilidade:** Verificação de vínculo (`count(learning_records WHERE provider_id = X)`) acontece quando?
> - Ao clicar Excluir (consulta on-demand, 1 query) — mais simples.
> - Mantém um contador denormalizado em `learning_providers.records_count` — mais rápido, mais coisa pra invalidar.

---

## #R24 — Disponibilizar preenchimento com IA no formulário

**RN 88** — O formulário (em todos os modos exceto `*-visualizar` e `admin-avaliar`) tem um **card promocional de IA** entre os campos do form:

- Título "Preenchimento automático com IA".
- Descrição: oferece preenchimento de "Tipo de experiência" + "Categorias" a partir do website e das evidências anexadas.
- Botão "Preencher com IA" (roxo).

**RN 89** — Comportamento do card por estado das flags `ia_funcionalidade_habilitada` e `tem_credito_ia`:

| Funcionalidade | Créditos | Estado do botão "Preencher com IA" | Ação ao clicar |
|---|---|---|---|
| Habilitada | Sim | Default disabled; vira enabled após upload de arquivo | Dispara preenchimento real + **toast verde de sucesso** no canto inferior direito (texto em RN 89.3) |
| Habilitada | Não | Default disabled; vira enabled após upload | **Modal "Limite de créditos atingido"** (top-center) — conteúdo e CTA variam por perfil (ver RN 90). |
| Desabilitada | (n/a) | **Sempre disabled** | **Toast vermelho** no canto inferior direito: "Essa funcionalidade não foi habilitada para esse ambiente. Ative ou consulte o responsável para liberar o acesso a essa funcionalidade no menu de Créditos de IA." |

- **RN 89.1** — Card **sempre aparece** pra ambos os perfis (Aluno e Admin), independente das flags — princípio "user precisa saber que a feature existe".
- **RN 89.2** — Apenas o **botão** fica disabled; o card continua visível e legível.
- **RN 89.3** — **Toast de sucesso** (caso "Habilitada + Sim"): canto inferior direito, status success/green.
  - Título: "Campos preenchidos pela IA".
  - Descrição: "Tipo de experiência e Categorias foram sugeridos com base na evidência. Revise antes de salvar."
  - Duração: 3500ms; fechável via X.
  - Existe porque sem feedback explícito o usuário não tem como saber que a ação aconteceu — os campos sugeridos podem coincidir com algo que já estava lá e o botão volta ao estado idle sem indicação.
  - O disclaimer "A IA pode cometer erros, verifique as informações" segue dentro do card; o toast reforça a revisão.

**RN 90** — Modal "Limite de créditos atingido". Conteúdo varia por perfil:

| Perfil | Corpo | CTA |
|---|---|---|
| Admin | "Todos os créditos disponíveis foram utilizados. Para continuar, entre em contato com o suporte ou aguarde a renovação." | Botão "Contato" (roxo sólido) — dispara fluxo de suporte (canal a definir). |
| Aluno | "Todos os créditos disponíveis foram utilizados." | Botão "Fechar" (roxo sólido) — só fecha o modal. |

- Título igual pros dois perfis: "Limite de créditos atingido".
- Dismiss: X no header (ambos os perfis).
- Por que difere: aluno não tem permissão pra acionar suporte/comercial; jogar ele no fluxo de contato gera fricção sem caminho. Admin sim — quem opera a org pode falar com o canal.

> **Validar a seguinte possibilidade:** Quando o botão envia request real pro modelo de IA (caso "Habilitada + Sim"):
> - Endpoint chama qual generation_type do `AiConsumption`? (provavelmente `ai_files_ingestor` ou novo `learning_record_autofill`).
> - Schema da resposta esperada (Tipo de experiência + Categorias).
> - Tratamento de erro do modelo (timeout, baixa confiança).

---

## #R25 — Gerenciar crédito de IA da organização (toggle TopBar)

**RN 91** — A TopBar tem um toggle global de crédito de IA (IconButton sparkle `MdAutoAwesome`), entre o logo e o chat icon. Cor amarela `#FFD000` = com crédito; roxa `#7223c2` = sem crédito.

- **RN 91.1** — Tooltip explica o estado + convite pra alternar.
- **RN 91.2** — Toggle renderiza apenas se as props `temCreditoIA` + `onToggleCreditoIA` existirem (no protótipo é controlado por App.tsx; em produção, deriva da `Organization`).

**RN 92** — Flag de crédito propaga pra:

- Formulário de Registro (`EditarCertificadoPage`): controla os 3 estados do card de IA (#R24).
- Card de IA em outros forms futuros (espaço de extensão).

> **Premissa:** Em produção, o "toggle" da TopBar provavelmente é só visual pro admin testar (ou pra ambientes de homologação). A flag real vem do back via setting da Organization.

---

## #R26 — Restringir escopo do Líder a liderados diretos

**RN 93** — O perfil Líder usa o mesmo shell visual do Admin (`LMSAdminShell`). A diferença é puramente de **escopo dos dados**.

| Ação | Admin | Líder |
|---|---|---|
| Listar registros | Toda a organização | Só dos liderados diretos |
| Adicionar registro (campo Pessoa) | Qualquer colaborador | Dropdown "Pessoa" mostra **só liderados diretos** |
| Visualizar / Editar registro | Qualquer registro | Só registros cuja Pessoa esteja na lista de liderados |
| Aprovar / Recusar | Qualquer Externo Pendente | Só dos liderados |
| Excluir | Qualquer registro elegível | Só dos liderados |
| Listagem de Provedores | Todos | Todos (provedores são compartilhados, não filtram por liderado) |

**RN 94** — Validação no submit (back): ao Salvar/Aprovar/Recusar/Excluir, o back valida se a Pessoa do registro está entre os liderados do user. Se não, retorna **403** e o front exibe toast de erro ("Sem permissão pra atuar nesse registro").

**RN 95** — Se a hierarquia muda durante a sessão (líder perde um liderado), registros antigos já aprovados por ele continuam válidos. Ele só perde capacidade de novas ações sobre aquela pessoa.

> **Validar a seguinte possibilidade:** Como obter a lista de "liderados diretos" do back?
> - `OrganizationChartRole.subordinates` da estrutura organizacional do twyg-app — depende do quão preenchida a estrutura está em cada cliente.
> - Fallback: campo `lideradoPor?: user_id` no model `User` (mais simples, menos rico).
> - Política de refresh (snapshot do login / cache curto / realtime) — ver Spike S4 do PRD anterior.

---

## #R27 — Tratar registros de pessoas inativadas

**RN 96** — Registros pertencentes a pessoas inativadas (soft-delete via `deleted_at` ou flag de status na org) **somem** completamente:

- **RN 96.1** — Não contam no KPI (Admin e Líder).
- **RN 96.2** — Não aparecem na lista.
- **RN 96.3** — Não aparecem em qualquer relatório/extração.
- **RN 96.4** — Filtro é silencioso — não há toggle "mostrar inativos" nesta feature.
- **RN 96.5** — Critério único de "pessoa ativa" é aplicado tanto na query do KPI quanto na query da lista — garante que número do card sempre bate com as linhas visíveis.

> **Validar a seguinte possibilidade:** Critério único de "pessoa ativa" — onde vive?
> - Scope ActiveRecord `User.active_in_org(org_id)` reusado em todas as queries.
> - Cobertura: `deleted_at IS NULL` + status de vínculo com a org (provavelmente `EventParticipant`/`OrganizationUser`).

---

## #R28 — Comportamento de registros de origem "Compartilhado"

**RN 97** — Origem "Compartilhado" surge quando uma org parceira compartilha um registro (via `SharedEvent` do twyg-app).

- **RN 97.1** — Aparece com chip "Compartilhado" na coluna Origem.
- **RN 97.2** — Apresentação na lista é igual a Interno (não tem evidências próprias na org receptora).

**RN 98** — Ações disponíveis em registros Compartilhados:

| Perfil | Visualizar | Histórico | Editar / Avaliar / Recusar / Excluir |
|---|---|---|---|
| Aluno | Sim — abre tela standalone (`?cert=ID`) | Sim | Não |
| Admin/Líder | Sim — abre tela standalone | Sim | Não |

- **RN 98.1** — Admin **não toca** em registros compartilhados — eles vêm de outra empresa parceira e o controle de modificação vive na origem.
- **RN 98.2** — Evidências não estão disponíveis no menu (não foram propagadas no compartilhamento).

> **Validar a seguinte possibilidade:** Como o registro Compartilhado é replicado entre orgs?
> - `SharedEvent` no twyg-app tem padrão de duplicação distribuída — verificar se `LearningRecord` reusa esse mecanismo ou precisa de algo próprio.
> - Sincronização: mudanças no original propagam pro destino?

---

## Controle de versão

| Versão | Data | Alterado por | O que foi alterado |
|---|---|---|---|
| 01 | 25/05/2026 | Max Vartuli (UX como PO) | Discovery inicial focado apenas em KPI cards (escopo errado — apenas §5 e §6 da spec). |
| 02 | 25/05/2026 | Max Vartuli (UX como PO) | Reescrito após Max clarificar: escopo é a **feature inteira** de Registros de Aprendizagem. Acrescenta 22 #R cobrindo listagem (Aluno/Admin/Líder), fluxos de registro (Adicionar/Editar/Visualizar/Avaliar/Excluir), evidências, histórico, filtros, personalização de colunas, ações em massa, extração, gestão de provedores, IA, e regras transversais (escopo Líder, pessoas inativadas, "Compartilhado"). KPIs permanecem como #R5–#R10. |
| 02.1 | 26/05/2026 | Max Vartuli (UX como PO) | Em #R24: linha "Habilitada + Sim" da RN 89 agora menciona o toast de sucesso; adiciona **RN 89.3** com texto, posição (canto inferior direito) e duração do toast "Campos preenchidos pela IA". Lacuna identificada no protótipo (botão clicava sem feedback no caso de sucesso). |
| 02.2 | 26/05/2026 | Max Vartuli (UX como PO) | **RN 90** (modal "Limite de créditos atingido") agora varia por perfil: Admin mantém corpo completo + botão "Contato"; Aluno recebe corpo curto ("Todos os créditos disponíveis foram utilizados.") + botão "Fechar". Motivo: aluno não tem permissão pra acionar suporte. |
