# Reconnaissance — Atualização de KPIs em tempo real (ações, expiração e batch)

> Snapshot do DOM da área desta testsuite, capturado em 2026-06-22T17:13:02.297Z.
> Planners DEVEM consumir este arquivo + a prosa do XML, e PULAR exploração ao vivo.

## Testcases desta testsuite (do XML)

1. **Validar incremento imediato do KPI após Adicionar (Aluno)** (importance: crítico, 8 steps)
2. **Validar transição de KPI após Aprovar (-1 Pendentes, +1 Emitidos)** (importance: crítico, 6 steps)
3. **Validar transição de KPI após Recusar (-1 Pendentes, +1 Recusados)** (importance: crítico, 7 steps)
4. **Validar decremento do KPI após Excluir** (importance: crítico, 5 steps)
5. **Validar atualização do KPI após Editar com mudança de status** (importance: crítico, 5 steps)
6. **Validar refresh único do KPI após ações em massa** (importance: crítico, 5 steps)
7. **Validar KPI refletindo apenas o processado em batch parcial** (importance: crítico, 4 steps)
8. **Validar transição automática Emitido → Expirado com tela aberta** (importance: crítico, 2 steps)
9. **Validar refresh do KPI do Líder após mudança de hierarquia** (importance: normal, 3 steps)

---

# URL 1: `/o/37079/records`

- Após carregamento: `https://registrosf2.stage.twygoead.com/o/37079/records`
- Page title: Domínio padrão
- Sync alert: não · Modal aberto: SIM

## Test IDs encontrados (data-test-id)

| data-test-id | tag | role | name (aria-label/text) |
|---|---|---|---|
| `tab-records-tab` | button | tab | Registros |
| `tab-event-sources-tab` | button | tab | Provedores |
| `records-kpi-card-emitted` | div |  | 0Emitidos |
| `records-kpi-count-emitted` | p |  | 0 |
| `records-kpi-card-expired` | div |  | 0Expirados |
| `records-kpi-count-expired` | p |  | 0 |
| `records-kpi-card-pending` | div |  | 0Pendentes |
| `records-kpi-count-pending` | p |  | 0 |
| `records-kpi-card-rejected` | div |  | 0Recusados |
| `records-kpi-count-rejected` | p |  | 0 |
| `records-total-workload` | div |  | scheduleCarga horária total: 0 horas |
| `records-extraction-button` | button |  | ios_shareExtrair dados |
| `filter-control-open-button` | button |  | filter_altFiltro |
| `chat-widget-iframe` | iframe |  |  |

## Roles + accessible names

| role | name |
|---|---|
| button | OK |
| button | Continuar mesmo assim |
| button | Twygo Academy |
| button | Open chat |
| button | Users |
| button | Close |
| button | Administrador |
| button | Registros |
| button | Provedores |
| button | Adicionar |
| button | Ações em massa |
| button | ios_shareExtrair dados |
| button | filter_altFiltro |
| button | Enviar |
| link | leaderboard



Dashboard |
| link | format_list_bulleted_add


Conteúdos |
| link | send


Compartilhamentos |
| link | description


Registros

BETA |
| link | workspace_premium


Certificados |
| link | folder_open


Base de conhecimento |
| link | group



Usuários |
| link | work



Empresas |
| link | live_help



Questionários |
| link | groups



Comunidades |
| link | lan


Organograma |
| link | badge


Funções de negócio |
| link | award_star


Competências |
| link | track_changes


PDI |
| link | Organização |
| link | Navegação |
| link | electrical_services


Integrações |
| link | flash_auto


Piloto automático |
| link | Regras do Jogo |
| link | Comunicação |
| link | sell


Cobrança de inscrição |
| link | credit_card


Plano e assinatura |
| link | Segurança

NOVO |
| link | smart_toy



Controle de IA

BETA |
| link | palette


Aparência |
| link | Administração |
| link | Editar |
| link | Cancelar inscrição |
| link | Cancelar assinatura |
| link | Falar com o administrador |
| link | Twygo Academy |
| link | Twygo Connect |
| link | Falar com o suporte |
| link | Sair |
| link | Continuar mesmo assim |
| link | Registros F2 |
| link | manage_accounts


Administrador |
| link | supervisor_account


Gestor de turma |
| link | for_you


Instrutor |
| link | school



Colaborador |
| link | Rede |
| link | Adicionar |
| link | Marcar todos |
| link | Mostrar mais |
| link | Salvar e fechar |
| textbox | Digite aqui sua mensagem. |
| textbox | exemplo@email.com |
| textbox | (__) ____-____ |
| textbox | Pesquise por pessoa, conteúdo ou provedor |
| textbox | Gostei de um evento e gostaria de compartilhar com você, ace |
| tab | Registros |
| tab | Provedores |
| heading | Meu perfil |
| heading | Suporte |
| heading | Modo administrador |
| heading | Perfil

Alterar seu perfil |
| heading | Enviar e-mail ao administrador |
| heading | Compartilhar evento por e-mail |
| heading | Recomende este evento para sua rede. |

## Labels

- `Assunto:`
- `Anexo:`
- `Mensagem:`
- `Desejo receber uma cópia do e-mail`
- `Para (email)`
- `Mensagem`

## Placeholders

- `Digite aqui sua mensagem.`
- `exemplo@email.com`
- `(__) ____-____`
- `Pesquise por pessoa, conteúdo ou provedor`

---

# URL 2: `/o/37079/records?in_use_mode_layout=true`

- Após carregamento: `https://registrosf2.stage.twygoead.com/o/37079/records?in_use_mode_layout=true`
- Page title: Domínio padrão
- Sync alert: não · Modal aberto: SIM

## Test IDs encontrados (data-test-id)

| data-test-id | tag | role | name (aria-label/text) |
|---|---|---|---|
| `tab-records-tab` | button | tab | Meu Histórico |
| `records-kpi-card-emitted` | div | button | 0Emitidos |
| `records-kpi-count-emitted` | p |  | 0 |
| `records-kpi-card-expired` | div | button | 0Expirados |
| `records-kpi-count-expired` | p |  | 0 |
| `records-kpi-card-pending` | div | button | 0Pendentes |
| `records-kpi-count-pending` | p |  | 0 |
| `records-kpi-card-rejected` | div | button | 0Recusados |
| `records-kpi-count-rejected` | p |  | 0 |
| `records-total-workload` | div |  | scheduleCarga horária total: 0 horas |
| `filter-control-open-button` | button |  | filter_altFiltro |
| `chat-widget-iframe` | iframe |  |  |

## Roles + accessible names

| role | name |
|---|---|
| button | OK |
| button | Continuar mesmo assim |
| button | Twygo Academy |
| button | Open chat |
| button | Users |
| button | Close |
| button | Colaborador |
| button | Meu Histórico |
| button | 0Emitidos |
| button | 0Expirados |
| button | 0Pendentes |
| button | 0Recusados |
| button | Adicionar |
| button | filter_altFiltro |
| button | Enviar |
| link | new_releases



Boas-vindas |
| link | leaderboard



Dashboard |
| link | Meus Cursos |
| link | groups



Comunidades |
| link | description



Meu Histórico

BETA |
| link | Administração |
| link | Editar |
| link | Cancelar inscrição |
| link | Cancelar assinatura |
| link | Falar com o administrador |
| link | Twygo Academy |
| link | Twygo Connect |
| link | Falar com o suporte |
| link | Sair |
| link | Continuar mesmo assim |
| link | Registros F2 |
| link | manage_accounts


Administrador |
| link | supervisor_account


Gestor de turma |
| link | for_you


Instrutor |
| link | school



Colaborador |
| link | Rede |
| link | Adicionar |
| link | Marcar todos |
| link | Mostrar mais |
| link | Salvar e fechar |
| textbox | Digite aqui sua mensagem. |
| textbox | exemplo@email.com |
| textbox | (__) ____-____ |
| textbox | Pesquise por conteúdo, origem ou provedor |
| textbox | Gostei de um evento e gostaria de compartilhar com você, ace |
| tab | Meu Histórico |
| heading | Meu perfil |
| heading | Suporte |
| heading | Modo administrador |
| heading | Perfil

Alterar seu perfil |
| heading | Enviar e-mail ao administrador |
| heading | Compartilhar evento por e-mail |
| heading | Recomende este evento para sua rede. |

## Labels

- `Assunto:`
- `Anexo:`
- `Mensagem:`
- `Desejo receber uma cópia do e-mail`
- `Para (email)`
- `Mensagem`

## Placeholders

- `Digite aqui sua mensagem.`
- `exemplo@email.com`
- `(__) ____-____`
- `Pesquise por conteúdo, origem ou provedor`

---

# Recon ao vivo dos fluxos de ação (2026-06-22, interativo)

> Complementa o dump estático acima. Capturado dirigindo a UI + API com storageState.

## Estado da massa (org principal 37079) — `GET /api/v1/o/37079/records/stats`
- `by_status`: emitted **79**, expired **0**, pending **32**, rejected **0**; total_general **111**.
- Há 32 Externos Pendentes (QA11-*) e 79 Emitidos → massa suficiente p/ aprovar/recusar/batch/editar.
- **Não há Expirados nem Recusados pré-existentes** → cenários de Expirado/Recusado precisam ser criados pelo teste.

## Endpoints (cookie auth via browser context; mesma origem)
| Ação | Método + rota | Notas |
|---|---|---|
| Listar | `GET /api/v1/o/<org>/records?per_page=200` | `{ data: [ {id, content, situation, can_delete, ...} ] }` |
| Stats | `GET /api/v1/o/<org>/records/stats` | `{ data: { by_status, total_general, workload_total_seconds } }` |
| Criar | `POST /api/v1/o/<org>/records` | 201. **Cria Pendente** (modo admin "Salvar"). Payload abaixo |
| Excluir | `DELETE /api/v1/o/<org>/records/<listId>` | usar o **id da listagem**, NÃO o id retornado pelo POST (esse dá 404) |

Payload de criação (Pendente, externo):
```json
{"record":{"endDate":"2026-05-10T00:00:00.000Z","categories":[{"label":"Tecnologia","value":"63"}],
"learningExperience":[{"label":"Curso","value":"848"}],"workload_seconds":"0040:00:00","workload":"1",
"provider":[{"label":"Alura","value":"1057"}],"content":[{"label":"<marker>","value":"<marker>","__isNew__":true}],
"people":[4298404],"description":[{"children":[{"text":""}],"type":"p","id":"x"}],"website":null,
"startDate":null,"approvalDate":null,"certificateDate":null,"expirationDate":null,"grade":null,"contentValue":null}}
```
> Limpeza: listar → filtrar `content` por marker único → DELETE por id da listagem.

## Seletores dos fluxos de ação
- **KPI cards (Admin)**: MESMOS testids do Aluno — `records-kpi-card-<status>`, `records-kpi-count-<status>`, `records-total-workload`. Tela admin = `/o/<org>/records` (sem `in_use_mode_layout`).
- **Kebab da linha**: `records-<recordId>-actions-kebab`. Itens (text, sem testid): Avaliar, Editar, Excluir, Visualizar, Evidências, Histórico.
  - ⚠️ Chakra renderiza o menu de TODAS as linhas no DOM (todos "visíveis" por bounding box). `getByRole('menuitem')` global é ambíguo → **escopar pelo menu aberto** via `aria-controls` do kebab: `page.locator('[id="<aria-controls>"]')` (o id tem `:` → usar `[id="..."]`, não `#`).
- **Avaliar**: rota `/records/<id>/edit?mode=admin-avaliar`. Botões `record-form-approve-button` ("Aprovar"), `record-form-reject-button` ("Recusar"), `record-form-cancel-button`.
- **Recusar (modal)**: header "Recusar registro" + textarea "Justificativa*" + botão "Recusar registro".
- **Excluir (modal)**: AT diz "Excluir registro?" + alerta "Esta ação não pode ser desfeita." + botão "Excluir". ⚠️ Em recon dirigido por script, o click no menuitem "Excluir" NÃO abriu modal detectável — candidato a heal (talvez exija `dispatchEvent` como [[clicar-parent-expander-sem-href-twygo]], ou interação real). Validar no audit/heal.
- **Ações em massa (drawer)**: checkbox por linha (`table input[type=checkbox]`) → botão "Ações em massa" → drawer com label "Ação*" (combo, default "Aprovar registros"), "Opção de envio*"/escopo radios **"Selecionados"** / "Todos do filtro atual", botão **"Executar"** (⚠️ AT diz "Aplicar" — divergência).
- **Adicionar (form)**: header "Novo conteúdo externo". Pessoas via drawer (`people-selector-input` → `resource-selector-drawer-search-input` → `people-selector-checkbox-<id>` → `resource-selector-drawer-confirm-button`). Combos react-select (`.creatable-select-field__control` dentro do `.chakra-form-control` do label): Provedor, Conteúdo, Tipo de experiência, Categorias. `record-form-save-button` / `record-form-cancel-button`.

## Divergências produto × AT (findings, não esconder com fixme)
1. **Carga horária** é máscara `HH:MM:SS` (input `workload_seconds`) — digitar "40" vira `0000:00:40` (40s!); 40h = digitar `400000` → `0040:00:00`. AT diz "preencher 40".
2. **Batch**: botão é **"Executar"**, AT diz "Aplicar".
3. **Header do form Adicionar**: "Novo conteúdo externo" (AT: "Adicionar registro de aprendizagem"/"Adicionar registro").
4. **Form Aluno (in_use_mode_layout)**: exibe campo "Pessoas*" + botão "Salvar" — pois o user de teste é Admin. AT espera Aluno SEM Pessoa + "Enviar para aprovação". Persona Aluno real não validada (ver [[trocar-perfil-twygo]]).
5. **Header Avaliar**: "Editar conteúdo externo".
