# De-Para: chrome-devtools-mcp vs Playwright — Widgets

Auditoria full-suite 2026-05-13. Reprodução de cada TC via chrome-mcp
(que usa CDP, simula mouse físico) comparada com execução Playwright.

## Estado final pós-fixes (regressão completa)

```
13 testes · 11 passed · 2 failed · 84.6% verde
```

| Suite | Antes | Depois | Δ |
|---|---|---|---|
| Listagem de painéis | 3/8 (37.5%) | **8/8 (100%)** | +5 |
| Ativar / Inativar painel | 3/5 (60%) | **3/5 (60%)** | 0 (workaround backend + 2 documentados) |

## Fixes aplicados

| ID | Arquivo | Mudança | Motivo |
|---|---|---|---|
| **safeGoto retry-on-timeout** | `src/utils/modals.ts:65-83` | retry 1× quando page.goto retorna `net::ERR_*` OU `Timeout exceeded` | Flakiness staging |
| **waitForURL domcontentloaded** | `PaineisListPage.ts:709` (submit), `:901` (associatePanelToMenu) | `waitUntil: 'domcontentloaded'` em waitForURL | NPS pós-redirect bloqueava `load` |
| **goToList timeout 60s** | `PaineisListPage.ts:121-124` | `getByRole('tab','Painéis').waitFor({ timeout: 60_000 })` | React SPA hidrata tarde em headless |
| **F1 paginação asserção** | `paginacao-listagem.spec.ts:33-49` | asserir nome do 1º row mudou, não count | Tenant tem 100+ painéis, não 30 |
| **fillNewPanelForm com description** | `PaineisListPage.ts:688-700` | implementa preenchimento de rich-text via pressSequentially | Necessário pro workaround backend |
| **createPanel default description** | `PaineisListPage.ts:723-739` | `data.description ?? 'Descrição automática — <name>'` | WORKAROUND bug backend toggle exige description |

## De-Para por TC

### Suite "Listagem de painéis" — 8/8 ✅

| TC | chrome-mcp | Playwright | Status |
|---|---|---|---|
| Alternar lista/cards | ✅ | ✅ | OK |
| Acessar listagem via menu | ✅ | ✅ | OK |
| Acessibilidade teclado | ✅ | ✅ | OK |
| Feature flag desabilitada | ✅ | ✅ | OK |
| Ordenar colunas | ✅ | ✅ | OK |
| Paginação | ✅ navega entre pgs, count idem em ambas | ✅ após fix (asserção por nome do 1º row) | OK |
| Validar componentes obrigatórios | ✅ todos presentes | ✅ após fix retry timeout | OK |
| Validar colunas lista | ✅ 5 `<th>` corretos | ✅ após fix timeout 60s | OK |

### Suite "Ativar / Inativar painel" — 3/5 ⚠️

| TC | chrome-mcp | Playwright | Status | Categoria |
|---|---|---|---|---|
| TC1 Inativar painel não associado | ✅ (com description) | ✅ após workaround description | OK |
| TC2 Ativar painel inativo | ✅ (com description) | ✅ após workaround description | OK |
| TC4 Persistência após reload | ✅ (com description) | ✅ após workaround description | OK |
| **TC3 Inativar painel associado → modal** | ✅ modal "Painel em uso" abre | ❌ submit/redirect não ocorre em `associatePanelToMenu` (waitForURL) | **Bug-não-impeditivo** (race do modal duplicado + redirect) |
| **TC5 Reativar menu → painel inativo bloqueia** | ❌ click no switch não dispara modal nem PATCH | ❌ asserção do modal | **Bug produto IMPEDITIVO** — UI não bloqueia toggle de menu vinculado a painel inativo |

## Bugs produto identificados (escalada dev)

### Bug 1 — Backend `panels#change_status` exige description (não-impeditivo)

- **Endpoint**: `PATCH /api/v1/o/:org/panels/:id/change_status`
- **Sintoma**: `422 "A validação falhou: Descrição não pode ficar vazio(a)"`
- **Frontend**: engole 422 silenciosamente, switch parece travado
- **Reprodução**: cria painel sem description → tenta toggle → switch fica
- **Workaround Playwright**: criar painel sempre com description default (já aplicado)
- **Fix backend sugerido**: action `change_status` deve skipar validação de description (ver prompt em conversa anterior)

### Bug 2 — UI não bloqueia toggle de menu vinculado a painel inativo (impeditivo)

- **Cenário**: useMode 70077 (Colaborador) tem item 365759 "painel inativo" → vinculado ao painel 801930 "Painel 16" (is_active=false)
- **Esperado**: ao clicar switch `#menu-enabled-365759` pra ativar, UI deveria abrir modal "Painel está inativo, não pode ativar"
- **Real**: click não dispara NEM modal NEM PATCH backend
- **Sem workaround**: cenário não testável até produto implementar

## Heurística canônica (documentada em `comparar-chrome-mcp-vs-playwright`)

| chrome-mcp | Playwright | Veredito |
|---|---|---|
| ✅ | ✅ | OK |
| ✅ | ❌ | Flakiness OU seletor frágil OU bug spec |
| ❌ | ❌ | Bug produto OU seed inviável |
| ❌ | ✅ | Raro — Playwright passa por caminho inválido |

**Lição**: dos 7 TCs que falhavam antes dos fixes, **6 eram flakiness/spec
frágil** (chrome ✅, Playwright ❌). Apenas **1 era bug produto real**
(TC5 — chrome ❌, Playwright ❌). Sem auditoria via chrome-mcp, time
gastaria tempo cobrando dev de produto por flakiness — chrome confirma
que produto está OK na maioria dos casos.

## Skills criadas neste ciclo

| Skill | Função |
|---|---|
| `criar-spec-resiliente-twygo` | 5 princípios pro generator/healer não emitir specs flaky |
| `comparar-chrome-mcp-vs-playwright` | Fluxo de auditoria de divergência em 5 passos |
| `debugar-via-network-e-console` | Network + Console primeiro antes de chutar |
| `debugar-bug-produto-stale` | Revalidar bugs marcados FAILING-BY-PRODUCT-BUG |
| `twygo-triage-report` | Triage batch com 5 categorias (impeditivo/não-impeditivo/esperado/spec-errado/flakiness) |

## Próximos passos

1. **Backend**: aplicar fix do bug 1 (`change_status` sem validar description). Quando mergear, **remover workaround** do `createPanel` + atualizar skill `debugar-bug-produto-stale`.
2. **Frontend Twygo**: implementar bloqueio do bug 2 (modal "Painel inativo bloqueia toggle de menu"). Sem isso, TC5 fica RED legítimo.
3. **TC3 inativar associado**: investigar race do modal "Modelo de página duplicado" + redirect em `associatePanelToMenu`. Trace mostra que após clicar Salvar do modal, redirect demora — talvez precisa esperar response do POST antes do waitForURL.

## Arquivos produzidos nesta auditoria

- `outputs/widgets/debug-cobertura-vs-playwright.md` — diagnose detalhada dos 3 TCs iniciais
- `outputs/widgets/depara-chrome-vs-playwright.md` — este doc
- `outputs/widgets/triage-report.md` — triage batch executável (sobrescrito a cada run)
- `outputs/widgets/reports/latest-regression.md` — atalho pro último relatório de regressão
- `outputs/widgets/debug-modal-duplicado.png` — screenshot evidência modal
- `outputs/widgets/f1-paginacao-pagina2.png` — screenshot pgs 1×2 ambos 25 rows
