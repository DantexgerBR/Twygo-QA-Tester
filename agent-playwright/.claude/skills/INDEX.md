# Skills do agent-playwright — Índice categorizado

> Skills agrupadas por categoria. Skills com `description` longa demais
> ou sem `triggers:` no frontmatter são **sub-utilizadas** pelo agente —
> sempre que adicionar/refatorar skill, garantir `triggers:` curtos e
> description ≤ 200 chars (vide [[evitar-reinventar-resolvidos-twygo]]).

**Total**: 47 skills ativas + 3 design docs em `docs/roadmap/` (excluídos
do namespace ativo).

---

## 🛡️ pre-edit — Antes de editar código (gates obrigatórios)

| Skill | Quando consultar |
|---|---|
| [evitar-reinventar-resolvidos-twygo](evitar-reinventar-resolvidos-twygo/SKILL.md) | **OBRIGATÓRIO** antes de Edit em `src/pages/`, `src/utils/`, `src/fixtures/`, `projects/*/pages/`. Pre-flight: grep consumidores + ler skill canônica |
| [regressao-pre-commit-twygo](regressao-pre-commit-twygo/SKILL.md) | **OBRIGATÓRIO** antes de commit que toque infra compartilhada — comparar baseline (worktree) vs HEAD |
| [validar-heal-diff](validar-heal-diff/SKILL.md) | Gate estático sobre diff do healer — bloqueia drift de intenção |
| [pull-antes-de-commit-push](pull-antes-de-commit-push/SKILL.md) | `git fetch` + análise de impacto antes de `git commit`/`git push` |

---

## 🔧 setup — Seed, trial, feature-flag, contract

| Skill | Quando consultar |
|---|---|
| [provisionar-seed](provisionar-seed/SKILL.md) | Pré-condição "X pré-existente" — declarar fixture canônica em vez de `test.fixme(true, 'seed inválido')` |
| [provisionar-trial-projeto-twygo](provisionar-trial-projeto-twygo/SKILL.md) | Provisionar org Trial dedicada ao iniciar suite Trial num projeto |
| [testar-feature-flag-twygo](testar-feature-flag-twygo/SKILL.md) | Toggle feature flag Flipper via UI (`ensureFlipperActor`) — destrava fixmes "requer toggle runtime flag" |
| [alterar-funcionalidade-contrato-twygo](alterar-funcionalidade-contrato-twygo/SKILL.md) | Toggle contrato via Super Admin (`setContractFunctionality`) — gate independente do Flipper |
| [trocar-perfil-twygo](trocar-perfil-twygo/SKILL.md) | Alternar Administrador / Aluno / Colaborador / Instrutor / Gestor via popover |
| [limpar-dados-de-teste-twygo](limpar-dados-de-teste-twygo/SKILL.md) | `afterAll`/`afterEach` com variant `*_safe` quando spec cria estado persistente |
| [configurar-ambiente](configurar-ambiente/SKILL.md) | Setup inicial de `.env` + storageState |
| [testar-ambientes-adicionais-twygo](testar-ambientes-adicionais-twygo/SKILL.md) | Specs cross-tenant em "env aditional" (org pareada com contrato compartilhado) |
| [testar-exclusao-dados-trial-twygo](testar-exclusao-dados-trial-twygo/SKILL.md) | Fluxo Sophia widget → "Excluir informações" em org Trial |

---

## 🌐 api — Trinca API (testar + auth + schema)

| Skill | Quando consultar |
|---|---|
| [testar-api-twygo](testar-api-twygo/SKILL.md) | **Skill principal**: padrão de teste API, organização `tests/api/`, clientes em `api/` |
| [provisionar-token-api-twygo](provisionar-token-api-twygo/SKILL.md) | Como obter `Authorization` header (modos `fixed_token`/`oauth_password`/`super_admin_generated`) |
| [validar-schema-api-twygo](validar-schema-api-twygo/SKILL.md) | Validar response via Ajv 8 + JSON Schema draft-2020-12 |

---

## 🧱 pom-components — Componentes Chakra Twygo

| Skill | Quando consultar |
|---|---|
| [navegar-sidebar-admin-twygo](navegar-sidebar-admin-twygo/SKILL.md) | Sidebar admin: `#menu` ancestor, `dispatchEvent` em parent expanders, `/o/{orgId}/dashboard` vs `/play` |
| [interagir-switch-chakra-twygo](interagir-switch-chakra-twygo/SKILL.md) | Switch Chakra: `setSwitch` padrão, `force:true`, `data-checked` em vez de `toBeChecked` |
| [testar-toast-chakra-twygo](testar-toast-chakra-twygo/SKILL.md) | Toasts Chakra acumulam — `getToast().first()` + `waitForToastsToClear` |
| [testar-filtro-drawer-twygo](testar-filtro-drawer-twygo/SKILL.md) | Drawer Chakra slide-in (Lista + Edição) + filtros por coluna + `#clear-filter` |
| [testar-plate-editor-twygo](testar-plate-editor-twygo/SKILL.md) | Rich-text Plate.js (kit de marca, IA, color picker) |
| [testar-upload-de-arquivo-twygo](testar-upload-de-arquivo-twygo/SKILL.md) | `setInputFiles()` + catálogo `test-assets/uploads/` + indexação async |
| [testar-beforeunload-dialog-twygo](testar-beforeunload-dialog-twygo/SKILL.md) | Dialog nativo do browser (não Chakra) em form dirty + cancel |
| [fechar-modais-twygo](fechar-modais-twygo/SKILL.md) | Catálogo geral: NPS Sofia, "Continuar mesmo assim", "Modelo de página duplicado" |
| [tratar-modal-beta-end-twygo](tratar-modal-beta-end-twygo/SKILL.md) | Modal específico "BETA teste Painéis do usuário" — ID estável + xpath fallback |
| [validar-preview-visual-twygo](validar-preview-visual-twygo/SKILL.md) | Broken images: `naturalWidth>0` + HTTP 200 |

---

## 🐞 debug — Diagnóstico de specs red

| Skill | Quando consultar |
|---|---|
| [debugar-via-network-e-console](debugar-via-network-e-console/SKILL.md) | **Ritual padrão**: abrir Network + Console ANTES de chutar causa de spec red |
| [auto-auditar-fails-via-devtools](auto-auditar-fails-via-devtools/SKILL.md) | Após 3+ falhas com erro genérico — disparar chrome-devtools-mcp proativo |
| [comparar-chrome-mcp-vs-playwright](comparar-chrome-mcp-vs-playwright/SKILL.md) | Categoria heurística "bug-produto / spec-errado / flakiness / ok" antes de healer |
| [criar-spec-resiliente-twygo](criar-spec-resiliente-twygo/SKILL.md) | Princípios anti-flakiness pra generator/healer |
| [debugar-bug-produto-stale](debugar-bug-produto-stale/SKILL.md) | Spec FAILING-BY-PRODUCT-BUG continua red — revalidar se sintoma ainda acontece |
| [debugar-smoke-login](debugar-smoke-login/SKILL.md) | Smoke de login falhou — credenciais/perfil/storage |
| [debugar-mcp-playwright-env](debugar-mcp-playwright-env/SKILL.md) | MCP playwright env não responde |
| [debugar-generator-travado](debugar-generator-travado/SKILL.md) | Subagent `playwright-test-generator` travado silenciosamente |
| [debugar-chat-widget-hubspot](debugar-chat-widget-hubspot/SKILL.md) | Chat widget HubSpot interceptando clicks |
| [debugar-filename-too-long-windows](debugar-filename-too-long-windows/SKILL.md) | `git add` falha com "Filename too long" no Windows |

---

## 🛠️ orchestrator — Parser, recon, generator, report

| Skill | Quando consultar |
|---|---|
| [twygo-test-orchestrator](twygo-test-orchestrator/SKILL.md) | Orquestra planner/generator/healer com contexto Twygo. Modos `--suite` e `--regression` |
| [twygo-input-parser](twygo-input-parser/SKILL.md) | Dispatcher de parsing (.md ou .xml) |
| [twygo-md-parser](twygo-md-parser/SKILL.md) | Parser do MD canônico (test-analysis.md) |
| [twygo-xml-parser](twygo-xml-parser/SKILL.md) | Parser do XML TestLink legado |
| [twygo-recon](twygo-recon/SKILL.md) | Reconnaissance pass antes dos planners — dump test-ids/labels |
| [twygo-exploratory-validator](twygo-exploratory-validator/SKILL.md) | Agregação de findings exploratórios (Fase 5.5) |
| [twygo-report-generator](twygo-report-generator/SKILL.md) | HTML híbrido per-suite + Allure no regressivo (Fase 6) |
| [twygo-triage-report](twygo-triage-report/SKILL.md) | `triage-report.md` único com falhas estruturadas — checkboxes QA |
| [gerar-bug-report-de-tc-red](gerar-bug-report-de-tc-red/SKILL.md) | Bug-report estruturado por TC red (Fase 5.7) |

---

## 🔧 meta — Manutenção de agente

| Skill | Quando consultar |
|---|---|
| [atualizar-agents-oficiais](atualizar-agents-oficiais/SKILL.md) | Re-rodar `init-agents` quando Playwright lançou versão nova |
| [webapp-testing](webapp-testing/SKILL.md) | Skill externa Anthropic — toolkit Playwright genérico |

---

## ⚠️ Skills sub-utilizadas (precisam revisão de description ou consolidação)

Identificadas pela auditoria 2026-06-01:

- Skills com `description` >500 chars (leitor pula): `provisionar-seed` (2221), `twygo-report-generator` (1669), `gerar-bug-report-de-tc-red` (938), `provisionar-trial-projeto-twygo` (695), `testar-api-twygo` (corrigido).
- Skills com 0-1 ref externa: `debugar-generator-travado`, `pull-antes-de-commit-push`, `atualizar-agents-oficiais`, `debugar-chat-widget-hubspot`, `testar-beforeunload-dialog-twygo`.

**Plano**: refatorar descriptions monstro pra ≤200 chars + adicionar
`triggers:` em todas (vide ações Pacote C #1 e #5).

---

## 📍 Como usar este índice

1. **Antes de Edit em código de infra** (`src/pages/`, `src/utils/`,
   etc): ler [evitar-reinventar-resolvidos-twygo](evitar-reinventar-resolvidos-twygo/SKILL.md).
2. **Sintoma específico** (modal, switch, sidebar, api): localizar
   skill pela categoria acima — frontmatter `triggers:` deve casar
   com palavras-chave do sintoma.
3. **Antes de commit de infra compartilhada**: rodar regressão
   ([regressao-pre-commit-twygo](regressao-pre-commit-twygo/SKILL.md)).
4. **Não achou skill pra seu sintoma?**: lacuna documentada. Antes de
   improvisar, anote a lacuna e proponha skill nova ao QA Lead.

---

## 📐 Design docs (não-skills)

Movidos pra `docs/roadmap/` (fora do namespace ativo de skills):

- `docs/roadmap/recon-cache/` — migrar recon de `inputs/` git pra cache regenerável
- `docs/roadmap/agent-metrics/` — orchestrator emite `metrics.json` por execução
- `docs/roadmap/validar-urls-recon-vs-at/` — recon valida URLs do AT antes de planner
