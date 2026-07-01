# Plano de automação — QA 1.16: Escopo do Líder, pessoas inativadas e origem Compartilhado

> **Documento OFFLINE de planejamento.** Escrito sem browser/MCP, lendo apenas
> arquivos. Guia o recon ao vivo + a geração de specs. Org alvo: **37093**
> (`staging-registros-edu`, `https://registrosexternos.stage.twygoead.com/`).
> orgId sempre via `getOrgId()` — nunca hardcode.
>
> **Conclusão antecipada (leia primeiro):** esta suíte é a mais bloqueada por
> seed/credenciais de todo o projeto. 6 dos 10 TCs exigem dados/perfis que
> a org 37093 quase certamente NÃO tem (Líder com liderados, pessoa inativável
> com registros conhecidos, registros origem "Compartilhado" replicados de org
> parceira, aluno multi-org, segunda org Admin). O recon anterior de KPI
> Admin/Líder (`recon-kpi-cards-como-dashboard-estatico-admin-lider.md`) já
> marcou os equivalentes como `fixme` por falta de seed. **Antes de gerar,
> resolver os pré-requisitos da §4.**

---

## 1. Resumo da suíte

Frontmatter: `executor: playwright`, `org: principal`, playbooks
`perfil-switch` · `ambientes-adicionais` · `cleanup-dados`.

**10 TCs** (TC1–TC10). Tipo declarado: 6 `ui`, 4 `api` (TC2, TC7, TC9 são api;
TC4/TC5/TC8/TC10 ui). Mistura forte UI + API direta.

| TC | Prio | Tipo | Objetivo (1 linha) | RNs |
|---|---|---|---|---|
| TC1 | critical | ui | Matriz de escopo: Admin vê toda a org; Líder vê só liderados diretos (listagem + dropdown "Pessoa" do Adicionar + Provedores compartilhados não filtram) | 93 |
| TC2 | critical | api | Líder atuando (aprovar) sobre registro de não-liderado → HTTP 403 + toast vermelho "Sem permissão pra atuar nesse registro" | 94 |
| TC3 | high | ui | Aprovação antiga do Líder PERMANECE após ele perder o liderado (registro segue Emitido p/ Admin; some da lista do Líder) | 95 |
| TC4 | critical | ui | Pessoa inativada SOME do KPI, da lista e da extração CSV, sem toggle "mostrar inativos" (regra silenciosa) | 96, 96.1–96.4 |
| TC5 | critical | ui | Coerência permanente KPI × lista: soma dos cards + status sem card == total de linhas (Admin e Líder) | 96.5 |
| TC6 | critical | ui | Registro Compartilhado: chip "Compartilhado" na coluna Origem; menu 3-pontos só "Visualizar" + "Histórico" (sem Editar/Avaliar/Excluir/Evidências); Visualizar abre cert em nova aba; Histórico = só evento "criado" | 97, 97.1, 97.2, 98, 98.2 |
| TC7 | high | api | PATCH/DELETE de registro Compartilhado via API → 403 (ambos) | 98.1 |
| TC8 | high | ui | Aluno multi-org: "Meu histórico" da org X (10 reg) vs org Y (4 reg) — sem consolidação | 20, 20.1 |
| TC9 | high | api | Admin da org Y: stats só conta org Y; aprovar registro da org X → 403 | 21, 94 |
| TC10 | medium | ui | Compartilhados PERMANECEM acessíveis após inativação da org parceira de origem (preservação de histórico — confirmar política com produto) | 98 |

---

## 2. Conceitos-chave da suíte

**Escopo do Líder (RN 93/94/95).** Há um perfil "Líder" cujo escopo de
visão e ação é restrito aos **liderados diretos** definidos na estrutura
organizacional. Diferenças vs Admin:
- **Listagem** (`/records`): Admin → todos da org ativa; Líder → só registros
  dos seus liderados diretos.
- **Dropdown "Pessoa"** do form Adicionar: Líder só enxerga liderados.
- **Provedores** (tab): compartilhados — NÃO filtram por liderado (Líder vê
  lista completa).
- **Submit de ação fora do escopo**: backend valida — Líder aprovando registro
  de não-liderado recebe **403** mesmo que o front fosse burlado (RN 94).
- **Histórico de ações é imutável** (RN 95): aprovação feita enquanto era líder
  NÃO é revertida quando ele perde o liderado; ele apenas perde a capacidade
  de novas ações (registro some da lista dele).

> ⚠ "Líder" aqui é um perfil/escopo organizacional. O popover de perfil
> documentado em `trocar-perfil-twygo` lista Administrador / Gestor de turma /
> Instrutor / Colaborador (recon 2026-06-22) — **"Líder" não apareceu**. Há
> dois cenários possíveis a confirmar no recon: (a) "Líder" == "Gestor de
> turma" (mapeamento de rótulo) com escopo por liderados; ou (b) é um perfil
> distinto não habilitado nesta org. Isto é bloqueador — ver §4 e §5.

**Pessoas inativadas (RN 96).** Quando uma pessoa é inativada na administração
de usuários, todos os registros dela **somem silenciosamente**: do KPI
(contagem decrementa), da lista (busca pelo nome → "Nenhum registro
encontrado") e da extração CSV. **Não existe** toggle "mostrar inativos" — é
soft-delete de visibilidade, não opcional. O mesmo critério (pessoa ativa +
escopo + soft-delete) vale para `/stats` e `/list`, garantindo coerência
KPI×lista (RN 96.5).

**Origem "Compartilhado" (RN 97/98).** Registros podem ter **origem**
(coluna Origem). Hoje o recon confirmou badges `record-origin-badge-external`
e `record-origin-badge-internal`. "Compartilhado" é uma **terceira origem**:
registro **replicado de uma organização parceira** (org P) na organização
receptora, via mecanismo de compartilhamento entre orgs. Comportamento:
- Chip "Compartilhado" na coluna Origem (provável `record-origin-badge-shared`
  — **CONFIRMAR no recon**, não existe ainda).
- Menu 3-pontos **restrito**: só "Visualizar" + "Histórico". Editar/Avaliar/
  Excluir/Evidências **não renderizam** (read-only — não é o dono do dado).
- Modificação via API (PATCH/DELETE) → **403** (RN 98.1).
- Histórico do compartilhado = só o evento "criado".
- Permanece acessível mesmo após a org parceira P ser inativada (RN 98 /
  TC10 — preservação de histórico do aluno).

**Isolamento multi-org (RN 20/21).** Aluno com vínculo em 2 orgs: cada org
tem seu próprio "Meu histórico", **sem consolidação** (org X mostra só os de
X). Admin com vínculo duplo: `/stats` só conta a org corrente; aprovar
registro de outra org → 403. É isolamento de tenant, não "ambiente adicional"
no sentido da skill `testar-ambientes-adicionais-twygo` (que é par
principal↔adicional com contrato compartilhado) — aqui são **duas orgs
independentes** onde o mesmo usuário tem vínculo.

---

## 3. Mapa TC → POM/método (reuso vs novo)

POMs reusáveis confirmados:
- **`RegistrosAdminPage`** — tela Admin/Líder `/o/{org}/records`: KPIs
  (`getCount`/`getCounts`/`getStats`/`waitForCountsHydrated`), lista
  (`dataRows`/`getVisibleRecordCount`/`isEmptyState`), busca (`search`/
  `clearSearch`), drawer de filtros. `getStats()` lê `/records/stats`
  (`by_status`, `total_general`) — base do invariante KPI×lista (TC5).
- **`AdminRegistrosPage`** (compõe a anterior) — ações: `openRowMenu`/
  `clickRowMenuItem`/`rowByContent`, avaliar (`openEvaluate`/`approve`/
  `reject`), `openAddForm`/`pickPerson` (dropdown Pessoa do Adicionar → TC1.3),
  toasts (`getToast`). **Reusar fortemente em TC1/TC2/TC3.**
- **`EditarRegistroPage`** — varre linhas por origem/status:
  `scanRecords`, `findRecordByText`, `findRecordId(origin, certStatus)`,
  `menuItems(recordId)` (devolve rótulos do menu 3-pontos limpos de ícone),
  `openRowMenu`. **Reusar em TC6** (menu restrito do Compartilhado). Hoje
  `RecordOrigin` cobre external/internal — **estender p/ 'shared'**.
- **`MeuHistoricoPage`** — visão Aluno (`?in_use_mode_layout=true`): KPIs +
  lista escopadas ao aluno. **Reusar em TC8.**
- **`records-api.ts`** — `getStats`/`listRecords`/`createPendingRecord`/
  `deleteRecordsByMarker` + `RECORD_FIXTURE`. ⚠ `RECORD_FIXTURE` (Alura=1057,
  Curso=848, Tecnologia=63, personId=4298404) é da org **antiga 37079** — NÃO
  vale na 37093. Reescrever os ids no `.data.ts` da suíte após recon. O
  **padrão** (POST `/records`, payload, delete by marker) serve.
- **`ProfileSwitcher`** (skill `trocar-perfil-twygo`, `src/pages/`) — trocar
  perfil via popover/URL. Reusar/criar para alternar Admin↔Líder↔Aluno.

| TC | Reusar | Novo (proposta por intenção) |
|---|---|---|
| TC1 | `RegistrosAdminPage.dataRows/getStats`; `AdminRegistrosPage.openAddForm`+`pickPerson` (dropdown Pessoa); `ProvedoresPage.gotoList` (provedores não filtram); `ProfileSwitcher` | `LiderEscopoPage.getVisiblePersonNames()` (nomes distintos na lista) · `LiderEscopoPage.getAddPersonDropdownOptions()` (opções do dropdown Pessoa) · helper `expectScopeMatchesLeads(expectedLeadNames)` |
| TC2 | `page.request.post(.../records/{id}/approve...)` (endpoint exato → recon); `AdminRegistrosPage.getToast` | `recordsScopeApi.approveAs(recordId)` (POST aprovação via API) — devolve status; `LiderEscopoPage.expectForbiddenToast()` |
| TC3 | `AdminRegistrosPage.openEvaluate/approve`; `RegistrosAdminPage.search` | helper de hierarquia: **remover liderado da equipe** — provável fora da UI de Registros (estrutura organizacional). Provável `OrgStructurePage.removeLeadFromTeam(leaderId, leadId)` OU passo manual (ver §4/§5) |
| TC4 | `RegistrosAdminPage.getCounts/search/isEmptyState`; `getStats` | `UsersAdminPage.deactivatePersonByName(name)` (inativar pessoa na admin de usuários — POM novo) + reativar no cleanup; extração CSV = passo manual (a AT já marca "etapa manual") |
| TC5 | `RegistrosAdminPage.getStats` + soma de status sem card via filtros; `getVisibleRecordCount` paginado | `RegistrosAdminPage.countAllRowsAcrossPages()` (somar paginação) · `RegistrosAdminPage.sumAllStatusCounts()` (4 cards + status sem card). Invariante, não count fixo |
| TC6 | `EditarRegistroPage.findRecordByText('...', 'shared')`/`menuItems(recordId)`; `RegistrosAdminPage.dataRows` | estender `RecordOrigin` p/ `'shared'`; `SharedRecordPage.originChip(recordId)` (chip "Compartilhado") · `.openHistory()` (drawer trilha "criado") · `.openView()` (nova aba — usar `context.waitForEvent('page')`) |
| TC7 | `page.request.patch/delete(.../records/{id})` | `recordsScopeApi.patchRecord(id, body)` / `.deleteRecord(id)` devolvendo status (assert 403) |
| TC8 | `MeuHistoricoPage.getCounts/getVisibleRecordCount`; 2 contextos (org X / org Y) padrão skill ambientes-adicionais | `MeuHistoricoPage` já serve; precisa **2 orgs** com baseURL/orgId distintos por context |
| TC9 | `records-api.getStats`; `page.request` aprovação cross-org | `recordsScopeApi.statsForOrg(orgId)` · `.approveCrossOrg(orgX_recordId)` → 403 |
| TC10 | `EditarRegistroPage.findRecordByText('...', 'shared')`; `RegistrosAdminPage.dataRows` | `PartnerOrgAdmin.deactivateOrg(orgId)` (inativar org parceira — provável Super Admin) + assert permanência. **Alto risco** (op administrativa destrutiva) |

**POM novo recomendado:** `LiderEscopoPage` (composição de `RegistrosAdminPage`
+ helpers de escopo) e um módulo `records-scope-api.ts` (gêmeo de
`records-api.ts`) para os TCs api (TC2/TC7/TC9) com os endpoints de
aprovação/patch/delete e seus status. Para TC4/TC10 provavelmente
`UsersAdminPage` e operações de Super Admin — **confirmar rotas no recon
antes de criar**.

---

## 4. Pré-requisitos de dados/feature (CRÍTICO — vira lista de bloqueios)

Cada item: (a) como verificar, (b) como seedar, (c) ação manual do usuário.

### P1 — Perfil/escopo "Líder" com ≥2 liderados diretos (TC1, TC2, TC3, TC5-Líder)
- **(a) Verificar:** no recon, abrir popover de perfil (`button.menu-target`)
  e checar se há "Líder" (ou se "Gestor de turma" cumpre o papel com escopo
  por liderados). Conferir se a lista `/records` muda de tamanho ao trocar
  Admin→Líder. Endpoint: comparar `GET /records` Admin vs Líder.
- **(b) Seedar:** definir, na estrutura organizacional/admin de usuários,
  um usuário como **líder** de ≥2 pessoas que tenham registros, e ≥1 pessoa
  FORA da equipe (para TC2/TC3). Provável tela de "equipes"/"hierarquia".
- **(c) Manual (provável):** sim — exige configurar hierarquia organizacional
  + possivelmente habilitar o perfil Líder no contrato/flag. **Bloqueador #1.**
  Recon anterior já marcou cenário Líder como `fixme` por falta de seed.

### P2 — Pessoa inativável com registros de distribuição conhecida (TC4)
- **(a) Verificar:** `GET /professionals?per_page=N` para achar uma pessoa;
  `GET /records?...` para confirmar que ela tem N registros (ex. 3 Emitidos +
  1 Pendente). Tela admin de usuários para confirmar que é inativável.
- **(b) Seedar:** criar/escolher 1 pessoa, criar p/ ela 3 registros Emitidos +
  1 Pendente via API (`createPendingRecord` + aprovar). O spec inativa e
  **reativa no cleanup** (estado persistente → §3.1 cleanup obrigatório).
- **(c) Manual:** parcialmente — a inativação/reativação pode ser via UI no
  próprio spec (POM `UsersAdminPage`). Confirmar a rota da admin de usuários
  e se a inativação é reversível sem efeitos colaterais. **Bloqueador #2.**

### P3 — Registros origem "Compartilhado" replicados na org receptora (TC6, TC7, TC10)
- **(a) Verificar:** `GET /records` e procurar badge/origem distinta de
  external/internal; recon visual da coluna Origem por chip "Compartilhado".
  Hoje o recon **só viu external/internal** → provavelmente NÃO existe.
- **(b) Seedar:** exige uma **org parceira P** com compartilhamento configurado
  e o mecanismo de replicação ligado para a org 37093. Não é um POST simples
  de `/records` (a origem "Compartilhado" é resultado do fluxo de
  compartilhamento entre orgs, não um campo livre). **Provavelmente
  inviável via API direta.**
- **(c) Manual:** sim, forte — configurar org parceira + compartilhamento +
  replicação. **Bloqueador #3 (o mais pesado).** Sem isto, TC6/TC7/TC10 viram
  `fixme("seed ausente: registro Compartilhado / org parceira não configurada")`.

### P4 — Segunda organização (org Y) com o mesmo usuário vinculado (TC8, TC9)
- **(a) Verificar:** o usuário de teste tem vínculo em ≥2 orgs? Trocar de org
  na UI (seletor de organização) e ver se aparece org Y. Conferir
  `environment.json` por um segundo env apontando a outra org.
- **(b) Seedar:** vincular o usuário a uma org Y; criar 10 registros na X e
  4 na Y (via API por org). Precisa de baseURL/orgId de Y → entrada nova em
  `config/environment.json` + `.env` (sufixo a definir, ex.
  `staging-registros-edu-org-y`).
- **(c) Manual:** sim — provisionar/identificar org Y + vincular usuário +
  gerar storage por org. **Bloqueador #4.** Padrão de 2 contextos da skill
  `testar-ambientes-adicionais-twygo` serve de molde (mas aqui são orgs
  independentes, não par -aditional).

### P5 — Endpoints de ação reais (aprovação / patch / delete) para os TCs api (TC2, TC7, TC9)
- **(a) Verificar:** no recon, capturar via Network a rota REAL de **aprovar**
  (a UI `approve()` dispara algo como `PATCH .../records/{id}` ou
  `POST .../records/{id}/approve` — **confirmar**) e o shape do 403 + body do
  toast. Idem PATCH/DELETE de um registro.
- **(b) Seedar:** nada além dos dados; é descoberta de contrato de API.
- **(c) Manual:** não. Só recon. Risco: se a UI não expõe o botão Aprovar pro
  Líder fora de escopo, "simular bypass do front" (passo do TC2) = chamar o
  endpoint direto via `page.request` — precisa saber a rota exata.

### P6 — Extração CSV (TC4 passo 5) e abertura de certificado em nova aba (TC6 passo 3)
- TC4 passo 5 (extração CSV "Todos") a própria AT marca **"etapa manual"** —
  manter como passo manual/documentado, não automatizar o download+parse a
  menos que `records-extraction-button` + fluxo async já estejam cobertos por
  outra suíte (existe `ExtracaoDrawerPage` — checar reuso).
- TC6 passo 3 "Visualizar abre em nova aba" → `context.waitForEvent('page')`.

---

## 5. Checklist de recon AO VIVO (o que não dá pra resolver offline)

Execute no browser/MCP, na org 37093, logado pelo storageState do projeto:

1. **Perfil Líder existe?** Abrir popover (`button.menu-target`) e listar os
   perfis. Há "Líder"? "Gestor de turma" filtra `/records` por liderados?
   → decide P1 e o nome do método `switchTo(...)`.
2. **`/records` muda Admin→Líder?** Contar `dataRows()` e `getStats()` em cada
   perfil. Se idêntico, o escopo de Líder não está ativo nesta org.
3. **Dropdown "Pessoa" do Adicionar (Líder):** abrir `openAddForm` como Líder,
   abrir o seletor de pessoas (`people-selector-input` → drawer
   `resource-selector-drawer-search-input`) e capturar a lista de opções.
4. **Origem "Compartilhado":** varrer `/records` por
   `[data-test-id^="record-origin-badge-"]` e listar os sufixos presentes.
   Confirmar se existe `shared` / chip "Compartilhado". Se não, P3 confirmado
   ausente.
5. **Menu 3-pontos de um Compartilhado (se existir):** `menuItems(recordId)` →
   confirmar `["Visualizar","Histórico"]`.
6. **Drawer de Histórico:** seletor do drawer + como ler os eventos da trilha
   (testId? texto "criado"?). Hoje não mapeado.
7. **Rotas de API (Network):** capturar a chamada real de **aprovar**
   (UI `AdminRegistrosPage.approve()`), de **PATCH editar** (Salvar do form) e
   de **DELETE**. Anotar método + path + status 403 + body do erro/toast.
8. **Admin de usuários (inativar pessoa):** rota da tela, seletor do toggle/
   ação "Inativar", e se é reversível. → P2 e POM `UsersAdminPage`.
9. **Estrutura organizacional (remover liderado):** rota/tela para editar
   equipe do líder (TC3 passo 2). Pode ser Super Admin ou admin de org.
10. **Seletor de organização / multi-org:** como o usuário troca de org X→Y
    (TC8). Há seletor de org no header? `environment.json` tem org Y?
11. **`record-origin-badge-shared` / coluna Origem:** confirmar o testId/texto
    exato do chip para o POM.
12. **Toast de 403:** confirmar o literal "Sem permissão pra atuar nesse
    registro" (TC2) — a AT pode divergir do produto (Registros está em BETA).

---

## 6. Riscos / divergências AT prováveis a verificar

1. **Perfil "Líder" pode não existir / não estar habilitado** na 37093 →
   TC1/TC2/TC3/TC5-Líder bloqueados. O recon de Editar registro (2026-06-22)
   já observou que **o menu 3-pontos NÃO muda com o perfil ativo** (RN42 de
   gating por perfil não implementada no BETA) — risco real de que o escopo de
   Líder também não esteja implementado/ativo. **Confirmar antes de prometer
   esses TCs.**
2. **Origem "Compartilhado" pode não estar implementada/seedável** → o recon
   anterior listou "Compartilhado (qualquer status)" como **faltando no env**.
   TC6/TC7/TC10 são os mais prováveis de virar `fixme("seed ausente")`.
3. **Toast literal divergente** (TC2): produto em BETA frequentemente diverge
   do texto da AT. Assertar por substring/`toContainText`, marcar `// REVISAR`
   se o literal não bater.
4. **TC10 inativa uma ORG inteira** — operação administrativa destrutiva e de
   difícil reversão. Risco de contaminar o ambiente. Tratar com extremo cuidado
   (provável `fixme` + nota "requer ambiente isolado / confirmar política
   Spike S11 com produto", como a própria AT sinaliza).
5. **TC4 — extração CSV** marcada "etapa manual" pela própria AT: não
   automatizar o parse do CSV a menos que justificado; cobrir os passos 1–4
   (KPI/lista/busca/ausência de toggle) e deixar o passo 5 documentado.
6. **`RECORD_FIXTURE` em `records-api.ts` é da org 37079** — qualquer reuso de
   ids (provider/experience/category/personId) quebra na 37093. Reseedar ids
   no `.data.ts` da suíte após recon (mesma estratégia da 1.14/1.15).
7. **Sessão única Twygo** (1 sessão/usuário): TC8/TC9 com 2 orgs e os specs
   api podem precisar de contextos sequenciais, não paralelos. Rodar
   `--workers=1` (orchestrator per-suite já faz). Multi-context com mesmo
   storage pode invalidar sessão e zerar os cards (gotcha do recon KPI).

---

## 7. Estratégia de implementação sugerida (pós-recon)

- **Onda 1 (provavelmente verde):** TC5 (coerência KPI×lista como Admin —
  invariante puro, sem seed especial). Talvez TC1 passo 1+4 (Admin vê tudo;
  Provedores não filtram) já testável.
- **Onda 2 (depende de P5/recon de API):** TC2/TC7/TC9 — assim que as rotas de
  aprovar/patch/delete e o comportamento 403 forem confirmados.
- **Onda 3 (bloqueada por seed/credencial):** TC1-Líder, TC3, TC4, TC6, TC8,
  TC10 — só após resolver P1/P2/P3/P4. Onde o produto BETA não implementa
  (escopo Líder, origem Compartilhado), `fixme` com destinatário correto
  (QA Lead / produto), NUNCA `fixme` escondendo bug (Anti-pattern F).

---

## 8. Anti-patterns / gotchas aplicáveis (CLAUDE.md §7.6 e §7.5)

Aplicáveis a esta suíte:
- **A — nunca login no spec:** usar `PRIMARY_STORAGE_PATH`/storageState do
  globalSetup; nada de `loginPage.login()`.
- **B — nunca hardcodar URL/orgId:** `getOrgId()` / `getBaseUrl()` /
  `getEnvByName('staging-registros-edu')`. Org Y (TC8/9) via entrada nova em
  `environment.json`, nunca host literal.
- **E — constantes-de-domínio em `*.data.ts`:** ids de pessoa/provedor,
  nomes de liderados, recordIds de seed → `escopo-lider.shared.data.ts` +
  `*.data.ts` por TC. Nada inline no spec.
- **F — `fixme` só para seed/XML/flag/bloqueio-de-time, nunca p/ bug de
  produto:** se o escopo Líder ou origem Compartilhado simplesmente não
  funciona (bug), deixar **falhar vermelho** com comentário de causa-raiz +
  destinatário dev. Se falta seed/credencial, `fixme` com mensagem dirigida ao
  QA Lead. Esta suíte vai gerar vários `fixme` legítimos (seed) — categorizar
  cada um pela matriz da §7.6.F.
- **G — estado persistente exige `afterAll` com `*_safe` + contexto fresco:**
  TC3 (aprovar + mudar hierarquia), TC4 (inativar pessoa → **reativar**),
  TC10 (inativar org → **reativar**) criam estado. Cleanup obrigatório,
  worker-isolated, contexto fresco via `browser.newContext({ storageState })`,
  ordem filho-antes-de-pai. Reativar pessoa/org no teardown idempotente.
- **§7.5 — gotchas:** atributo `data-test-id` (com hífen); cards renderizam
  tarde (gate `waitForCountsHydrated`/timeout 60s); banner "Continuar mesmo
  assim" e NPS Sofia via `safeGoto`+`dismissCommonModals`; chat HubSpot
  intercepta clicks no canto (skill `hideChatWidget`/`debugar-chat-widget-hubspot`);
  toasts Chakra acumulam → `getToast().first()`; nova aba via
  `context.waitForEvent('page')`.
- **§3.1 — dados por teste:** criar `escopo-lider.shared.data.ts` (epic,
  suiteName, ids reseedados na 37093, nomes de liderados) + `<tc>.data.ts`.
- **Imports canônicos** (espelhar `crud-provedores`): fixture exploratória
  `../../../../../src/fixtures/exploratory-fixture.js`, `allure` de
  `allure-js-commons`, `Locator` de `@playwright/test`,
  `PRIMARY_STORAGE_PATH` de `tests/setup/global-setup.js`.

---

## 9. Recon AO VIVO 2026-06-29 — veredito final (org 37093 edu)

> Via script Playwright autenticado. Resolve a §5. **Confirma a previsão da
> §0**: suíte fortemente bloqueada por seed/feature. Decisão do usuário:
> automatizar o testável + `fixme` o resto (destinatário correto).

### Achados duros

- **KPI/stats** (`GET /api/v1/o/{org}/records/stats`): `by_status` =
  {emitted:76, expired:0, awaiting_confirmation:1, rejected:0};
  **`total_general: 89`**; `workload_total_seconds`. KPI testids:
  `records-kpi-card-{emitted|expired|awaiting_confirmation|rejected}` +
  `records-kpi-count-*`. → **TC5 testável** (invariante total_general × linhas paginadas).
- **Origens presentes**: só `record-origin-badge-external` e
  `-internal`. **NÃO existe `shared`/Compartilhado** → TC6/TC7/TC10 sem seed.
- **Perfil "Lider de equipe" EXISTE** no popover (`button.menu-target`), mas
  **trocar p/ Líder redireciona a `/dashboard_students`** (visão aluno-like) e
  **NÃO altera o escopo de `/records`**: stats do Líder == Admin (76/89),
  idênticos; ao voltar a `/records` o perfil reverte a Administrador. ⇒ **o
  escopo de Líder NÃO é aplicado à tela admin de Registros neste BETA**.
  TC1-Líder / TC2 / TC3 / TC5-Líder bloqueados (não há como produzir a condição).
- **Menu kebab** (testid `records-{recordId}-actions-kebab`): itens
  `Avaliar` (só Pendente) · `Editar` · `Visualizar` · `Evidências` ·
  `Histórico`. Sem restrição por perfil (confirma RN42 de gating não ativo).
- **`/o/{org}/professionals`** veio vazio (sem tabela) — rota de inativar
  pessoa é outra; TC4 precisa de seed específico de qualquer forma.
- **Sessão única**: scripts sequenciais dispararam modal "Continuar mesmo
  assim" (sessão duplicada) — captura do endpoint de aprovação não concluída
  (não é bloqueio: TC2/TC9 são `fixme` por outros motivos).

### Veredito por TC

| TC | Status | Destinatário / motivo |
|---|---|---|
| TC1 | ⚠️ parcial | Admin vê tudo (✅) + tab Provedores não filtra (✅). **Líder-side `fixme`** (escopo Líder não aplicado a /records — QA Lead/produto reconciliar AT×produto) |
| TC2 | ❌ fixme | Escopo Líder não aplicado ⇒ impossível gerar ação fora-de-escopo. QA Lead/produto |
| TC3 | ❌ fixme | Requer edição de hierarquia + escopo Líder. QA Lead (seed) |
| TC4 | ❌ fixme | Seed ausente: pessoa inativável com 3 Emitidos + 1 Pendente; rota users a confirmar. QA Lead (seed) |
| TC5 | ✅ testável | Invariante `total_general` × linhas paginadas (Admin). Líder-side `fixme` |
| TC6 | ❌ fixme | Seed ausente: origem Compartilhado / org parceira. QA Lead (seed) |
| TC7 | ❌ fixme | Idem TC6 (sem registro Compartilhado p/ PATCH/DELETE). QA Lead (seed) |
| TC8 | ❌ fixme | Seed ausente: 2ª org com mesmo aluno. QA Lead (seed/infra) |
| TC9 | ❌ fixme | Idem TC8 (2ª org Admin). QA Lead (seed/infra) |
| TC10 | ❌ fixme | Sem Compartilhado + operação destrutiva (inativar org). QA Lead + confirmar política produto |

**Resumo:** TC5 verde-ável; TC1 parcial (lado Admin verde). Os outros 8 são
`fixme` legítimos (categoria seed/feature-BETA), nunca escondendo bug de
produto (Anti-pattern F).
