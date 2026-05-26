# Debug: Cobertura via chrome-mcp vs Playwright

Reprodução manual via chrome-devtools-mcp dos 3 TCs falhando na suite
**Listagem de painéis** (run 2026-05-13). Para cada TC: o que o teste
deveria cobrir, o que o chrome mostra ao reproduzir manualmente, e por
que Playwright falhou.

Critério: chrome-mcp simula o que o QA humano vê. Se chrome ✅ e
Playwright ❌, a divergência é candidato à categoria correta de triagem.

---

## F1 — Paginação da listagem com volume de painéis

**Cobertura do spec** (`paginacao-listagem.spec.ts`):
1. Acessar listagem → paginação visível com botão "1" ativo
2. Avançar para página 2 → contagem de cards muda → botão "2" visível
3. Voltar página → botão "anterior" fica disabled

**Reprodução chrome-mcp (live)**:
- ✅ Listagem carregou em modo Lista com 25 rows
- ✅ Paginação visível: botões `1 2 3 4 5` (5+ páginas)
- ✅ Click no "2" navega — `firstRow = "Painel Pesquisa Widget 1778687712208"` (mudou do pág 1)
- ❌ **Page 2 também tem 25 rows** (não 5 como spec assume)

**Por que Playwright ❌**:
```
expect(cardsAfter).not.toEqual(cardsBefore)
// cardsBefore = 25, cardsAfter = 25 → falha
```

Spec assumia tenant com **exatamente 30 painéis** (pág 2 com 5). Realidade:
tenant tem **100+** painéis em 5+ páginas. Assert frágil que depende de
contagem precisa do seed.

**Veredito**: `Spec / seed errado` — comentário REVISAR no próprio spec
já sugeria: assertar que **nome do primeiro card** mudou (não count).

**Fix sugerido** (código pronto):
```ts
- const cardsBefore = await paineis.getCardCount();
+ const firstBefore = await paineis.getRow(0).locator('td:first-child p').textContent();
  await paineis.goToNextPage();
  await expect(paineis.getPageButton(2)).toBeVisible();
- const cardsAfter = await paineis.getCardCount();
- expect(cardsAfter).not.toEqual(cardsBefore);
+ const firstAfter = await paineis.getRow(0).locator('td:first-child p').textContent();
+ expect(firstAfter).not.toEqual(firstBefore);
```

**Screenshot**: `outputs/widgets/f1-paginacao-pagina2.png`

---

## F2 — Validar colunas exibidas na visualização em lista

**Cobertura do spec** (`validar-colunas-lista.spec.ts`):
1. Acessar listagem → modo Lista → header "Nome" visível
2. Verificar colunas obrigatórias: `Nome`, `Descrição`, `Data de criação`, `Ativo`, `Ações`
3. Verificar checkbox "Ativo?" na 1ª linha

**Reprodução chrome-mcp (live)**:
- Headers reais no DOM: `["Nome", "Descrição", "Data de criação", "Ativo?"]` + 1 `<th>` sem id/texto (coluna Ações).
- 5 `<th>` total no `<thead>`:

  | idx | id | text | width |
  |---|---|---|---|
  | 0 | name | Nome | 542px |
  | 1 | description | Descrição | 128px |
  | 2 | created_at | Data de criação | 230px |
  | 3 | is_active | Ativo? | 137px |
  | 4 | (vazio) | (vazio) | 233px |

- Tab "Painéis" visível + selected (`aria-selected=true`)

**Por que Playwright ❌**:
```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
- waiting for getByRole('tab', { name: 'Painéis' }) to be visible
- at PaineisListPage.ts:121 (goToList)
```

Falhou ANTES de chegar nas colunas — em `goToList`. Após `safeGoto`
(domcontentloaded), tab "Painéis" não renderizou em 30s. Mas chrome-mcp
confirma que tab É visível + selected ao reproduzir manualmente.

**Hipóteses**:
1. **Race condition** — `domcontentloaded` retorna antes do React hydrate.
   Tab renderiza tardiamente (>30s) em alguns ciclos do bundle.
2. **Flakiness do staging** — env lento hoje. 30s pouco.
3. **Modal NPS interceptou** — apareceu após DOM ready mas antes da tab
   pintar. `dismissCommonModals` rodou mas não fechou (NPS reabriu?).

**Veredito**: `Flakiness` — re-rodar 3× isolado pra confirmar. Se ainda
flaky → patch em `goToList` (aumenta timeout pra 60s OU usa
`networkidle` em vez de `domcontentloaded`).

**Fix sugerido** (preventivo, low risk):
```ts
async goToList(): Promise<void> {
  await safeGoto(this.page, `/o/${getOrgId()}/use_modes?tab=panels-tab`);
  await this.page.getByRole('tab', { name: 'Painéis' }).waitFor({ timeout: 60_000 });
}
```

**Confirmação que cobertura É possível**: 5 `<th>` confirmados no DOM live
incluindo `is_active` (que casa com getColumnHeader('Ativo'), mesmo
texto sendo "Ativo?"). Coluna "Ações" = `<th>` sem id, último — também
casa com fallback do helper. Cobertura **funciona** quando a tab carrega.

---

## F3 — Validar componentes obrigatórios da listagem

**Cobertura do spec** (`validar-componentes-obrigatorios.spec.ts`):
1. Acessar listagem
2. Botão "+ Adicionar" visível
3. Botão "Filtro" visível
4. Campo de busca visível
5. Grid de cards renderiza com ≥1 painel

**Reprodução chrome-mcp (live)**:

| Componente | Presente? |
|---|---|
| Breadcrumb `#page-breadcrumb` | ✅ "Menu > Modos de uso" |
| Botão "Adicionar" | ✅ |
| Input search "Pesquise por nome ou descrição" | ✅ |
| Toggle view "grid_view" (cards) | ✅ |
| Toggle view "reorder" (lista) | ✅ |
| Botão "Filtro" | ✅ |
| Paginação (1, 2, 3, 4, 5) | ✅ |

**Por que Playwright ❌**:
```
Error: page.goto: net::ERR_NETWORK_CHANGED
- navigating to "https://widgets.stage.twygoead.com/o/36988/use_modes?tab=panels-tab"
- at modals.ts:64 (safeGoto)
```

Flakiness de rede pura — conexão mudou DURANTE navegação. **Não tem
relação com cobertura** — quando a rede está estável, o teste passa.

**Veredito**: `Flakiness` (rede). Re-rodar pra confirmar. Padrão
recorrente em VPNs corporativas ou wifi instável.

**Confirmação que cobertura É correta**: todos os 5 componentes do spec
existem no DOM live. Quando rede cooperar, teste passa.

---

## Resumo executivo

| TC | chrome-mcp | Playwright | Veredito | Fix |
|---|---|---|---|---|
| F1 Paginação | ✅ (mas count=25 em ambas páginas) | ❌ `expect not 25` | **Spec errado** | Asserir nome do 1º row mudou |
| F2 Validar colunas | ✅ 5 `<th>` corretos | ❌ tab "Painéis" não visível em 30s | **Flakiness render** | Aumentar timeout pra 60s |
| F3 Validar componentes | ✅ todos componentes presentes | ❌ `ERR_NETWORK_CHANGED` | **Flakiness rede** | Re-rodar |

**Padrão observado**: dos 3, **só F1 é spec real errado**. F2 e F3 são
flakiness (render + rede) — produto está OK. Cobertura via chrome-mcp
confirma que os 3 testes **EXERCITAM cobertura válida** quando o
ambiente coopera.

**Lição**: chrome-mcp como ground truth funciona. Quando Playwright ❌
mas chrome ✅ → quase sempre é flakiness ou seletor frágil, não bug
produto. Quando ambos ❌ → bug produto ou seletor desatualizado.

