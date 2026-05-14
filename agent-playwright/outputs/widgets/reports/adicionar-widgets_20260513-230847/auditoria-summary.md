# Auditoria + Fix — Suite "Adicionar widgets"

**Data:** 13/05/2026 · **Branch:** `project/paineis-dos-usuarios-widgets-joao` · **Ambiente:** `staging-widgets` (org 36988)

---

## TL;DR

| Métrica | Antes | Depois |
|---|---:|---:|
| Testes verdes | 2/11 (18%) | **11/11 (100%)** |
| Tempo da suite | 1.9min (com 9 timeouts) | **43.6s** (4 workers) |
| Falhas residuais | 9 | **0** |
| Side-issues bloqueando relatório | 1 (Fase 6 crashava) | **0** |

---

## Causa raiz dos 9 fails iniciais

Bug produto **task 32872141** — dirty-flag stuck no form do painel:

1. Spec criava painel apenas com Nome → `panel-form-save-button` → URL muda pra `/panels/{id}/edit`
2. Spec clicava tab Layouts
3. **App abria dialog `"Tem certeza que deseja sair? Caso tenha alterações, elas não serão salvas"`** mesmo sem ter mexido em nada após Save
4. Tab Layouts não ativava, `widgets-grid-*` nunca renderizava
5. `PainelFormPage.openWidgetDrawer()` esgotava 30s em `[data-test-id="widgets-grid-empty-state-add-button"]`

**Workaround**: criar painel sempre com Nome **+** Descrição. Quando o dev corrigir o reset do dirty-flag, remover workaround.

Reproduzido manualmente via Playwright MCP (sessão limpa, fluxo humano single-shot) — 1 click no Layouts pós-Save dispara o dialog 100% das vezes sem descrição; com descrição, transição limpa pra `?tab=layouts`.

---

## Fix aplicado (12 arquivos)

### Novo
- `projects/widgets/tests/features/adicionar-widgets/adicionar-widgets.shared.data.ts` — workaround documentado com ref ao bug 32872141

### Edits (11 specs da suíte)
- 11 specs trocaram `createPanel(data.panelName)` → `createPanel(data.panelName, shared.panelDescription)` + import shared

### Robustez infra
- `projects/widgets/pages/PainelFormPage.ts:98` — bump `waitForURL` timeout 30s → 60s (evita flakiness intermitente em rodada paralela 4 workers)

---

## Pendências resolvidas no mesmo ciclo

1. **`twygo-report-generator/generator.ts:1137`** — `archiveAttachments` duplicado bloqueava Fase 6. Removida segunda declaração; mantida a versão canônica (linha 727) com canonical-folder + logging + fallback.
2. **`PaineisListPage.ts`** — 8 métodos da skill `testar-filtro-drawer-twygo` haviam sumido no refactor 69f1f6a; recuperados do commit d1b51e5 (`searchPanels`, `clearSearch`, `getEmptyStateNoResults`, `getClearFilterButton`, `clearFilter`, `applyDefaultFilter`, `applyColumnFilter`, `getFirstPanelName` + helper `menuItemTextForColumn`). Suite "Pesquisa e Filtros" volta a compilar.
3. **Flakiness `filtrar-widgets-categorias`** — passava isolado 3/3 mas falhava em rodada paralela. Bump de timeout no `createPanel` resolveu (na re-rodada full-suite passou em 12.6s, sem timeout).

---

## Evidências

- **Report estruturado**: [`index.md`](index.md) → [`tests.md`](tests.md) → [`exploratory.md`](exploratory.md)
- **Artefatos**: `artifacts/` (44 attachments arquivados — screenshots ON em sucesso E falha conforme regra QA Twygo)
- **JSON brutos**: `summary.json`, `tests.json`, `exploratory.json`, `run_context.json`

---

## Próximos passos sugeridos

- [ ] Dev produto: corrigir bug **32872141** (dirty-flag não reseta após Save sem Descrição). Quando feito, remover `adicionar-widgets.shared.data.ts` + reverter os 11 specs pra `createPanel(data.panelName)`.
- [ ] QA: validar que suite "Pesquisa e Filtros" (15 casos) volta a executar agora que POM recuperou os 8 métodos.
- [ ] Monitorar flakiness `createPanel` em ciclos futuros. Se reaparecer sob load maior, evoluir pra `waitForResponse(POST /panels)` síncrono ao click.
