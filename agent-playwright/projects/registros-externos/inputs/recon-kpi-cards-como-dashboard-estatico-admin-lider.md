# Reconnaissance — KPI cards como dashboard estático (Admin/Líder)

> Snapshot da área desta testsuite, capturado em 2026-06-22 (Admin, org 37079).
> Tela real: **Aprendizagem > Registros** = rota `/o/37079/records`
> (a recon anterior `recon-kpi-cards-como-filtro-de-status-aluno.md` ficou
> na rota `/dashboard` genérica e não cobre a tela de Registros).

## Rota e contexto

- URL: `/o/{orgId}/records` (ex.: `/o/37079/records`)
- Perfil: Admin (botão de perfil "Administrador" no canto sup. direito)
- Abas no topo do conteúdo: **Registros** (`tab-records-tab`) / **Provedores** (`tab-event-sources-tab`)

## Test IDs confirmados (data-test-id) — área KPI + toolbar + lista

| data-test-id | papel |
|---|---|
| `records-kpi-card-emitted` | card "Emitidos" (container) |
| `records-kpi-card-expired` | card "Expirados" |
| `records-kpi-card-pending` | card "Pendentes" |
| `records-kpi-card-rejected` | card "Recusados" |
| `records-kpi-count-emitted` | número da contagem "Emitidos" |
| `records-kpi-count-expired` | número "Expirados" |
| `records-kpi-count-pending` | número "Pendentes" |
| `records-kpi-count-rejected` | número "Recusados" |
| `records-total-workload` | label "Carga horária total: {X} horas" |
| `tab-records-tab` / `tab-event-sources-tab` | abas Registros / Provedores |
| `records-extraction-button` | botão "Extrair dados" |
| `records-{recordId}-actions-kebab` | menu de ação por linha (more_vert) |
| `records-list-view-action` / `records-list-evidences-action` / `records-list-history-action` | ações por linha |
| `record-origin-badge-internal` | badge "Externo"/origem por linha |

> Atributo é `data-test-id` (com hífen) — já configurado em `playwright.config.ts`
> via `use.testIdAttribute`. `getByTestId('records-kpi-card-emitted')` resolve.

## Toolbar (roles)

- `button` "Adicionar", "Ações em massa", "Extrair dados", "Filtro"
- `textbox` placeholder "Pesquise por pessoa, conteúdo ou provedor" (campo de busca)
- toggle de view (grid/lista) ao lado da busca

## Dados observados na org 37079 (dinâmicos — NÃO acoplar a valores exatos)

- Emitidos: 77 (donut **verde**) · Expirados: 0 (anel cinza) ·
  Pendentes: 32 (donut **laranja**) · Recusados: 0 (anel cinza)
- "Carga horária total: 543 horas" (variou entre runs — 76/543; é dinâmico)
- ~25+ linhas na lista (org tem massa de dados)
- Cores batem com a RN 18 (Emitidos verde, Pendentes laranja).

## Gotchas críticos para os specs

1. **Cards renderizam TARDE** (>10s após `domcontentloaded`). Usar
   `waitFor({ state:'visible', timeout: 60_000 })` no card "Emitidos"
   como gate de "tela pronta" (Princípio 2 de `criar-spec-resiliente-twygo`).
2. **Banner "Continuar mesmo assim"** (sessão duplicada) aparece sob
   contenção de sessão e BLOQUEIA o render dos cards até ser fechado.
   `safeGoto` → `dismissCommonModals` já trata. Specs SEMPRE via `safeGoto`.
3. **Twygo = 1 sessão por usuário**: rodar a suite com `--workers=1`
   (per-suite o orchestrator já faz). Abrir múltiplos contextos com o
   mesmo storage invalida sessões e os cards param de renderizar.
4. **Widget de chat (Sophia/HubSpot)** no canto inferior direito pode
   interceptar clicks perto do canto (skill `debugar-chat-widget-hubspot`).

## Feasibility por TC (massa/credenciais)

| TC | Feasível agora? | Observação |
|---|---|---|
| TC1 estrutura/cores/carga | ✅ | org 37079 tem dados; assert estrutura + label formato + cores |
| TC2 tooltips institucionais | ✅ | hover → tooltip; textos literais na AT |
| TC3 não-clicabilidade | ✅ | invariante: click não filtra, sem classe ativa |
| TC4 contagem ñ reage a filtro | ✅ | captura counts → filtra → counts iguais |
| TC5 escopo Líder (18/0/2/0) | ❌ fixme | sem credencial/seed de Líder com liderados de distribuição conhecida |
| TC6 exclui inativados | ❌ fixme | sem pessoa inativada com registros + nome conhecido na massa |
| TC7 transição Emitido→Expirado | ❌ fixme | Spike S1: massa manipulada + refresh async não-determinístico |
| TC8 org zerada (Admin) | ❌ fixme | sem org Admin garantidamente sem nenhum registro |
| TC9 Líder 0 liderados | ❌ fixme | sem credencial/seed de Líder sem time |
