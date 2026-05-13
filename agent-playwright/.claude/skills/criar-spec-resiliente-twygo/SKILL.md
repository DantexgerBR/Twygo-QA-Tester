---
name: criar-spec-resiliente-twygo
description: Princípios pra generator/healer emitir specs Playwright Twygo que não viram flaky. Cobre asserção por invariante (não por count exato do seed), timeouts explícitos pós-hydration de SPA Chakra/React, retry transparente de rede via safeGoto, e independência de ordem de cards/rows. Use sempre que gerar/corrigir spec novo OU ao revisar spec existente que falhou e quer entender se é falha real ou só fragilidade do código de teste.
version: 1.0.0
---

# criar-spec-resiliente-twygo

## Quando usar

- **Generator** emitindo `.spec.ts` novo a partir de XML TestLink.
- **Healer** consertando spec que falhou — antes de "trocar seletor",
  verifique se a falha cabe num dos 3 padrões aqui (assertion frágil,
  timing pós-hydration, flakiness de rede).
- **Code review** de spec antes de mergear — checklist de "isso vai
  quebrar quando o seed mudar?".

## Por que existe

Run live 2026-05-13 da suíte **Listagem de painéis** (projeto widgets):
3 testes falharam, **2 sem nenhum bug de produto envolvido**. Padrão
canônico de fragilidade do código de teste, não do produto.

Evidência completa: [`outputs/widgets/debug-cobertura-vs-playwright.md`](../../../outputs/widgets/debug-cobertura-vs-playwright.md)

Resumo dos 3 casos vivos:

| Caso | Sintoma Playwright | Reprodução chrome-mcp | Causa real | Categoria |
|---|---|---|---|---|
| **F1** Paginação | `expect(cardsAfter).not.toEqual(cardsBefore)` falha (25 == 25) | ✅ pág 2 carrega, mas TAMBÉM com 25 rows | Spec assume seed com 30 painéis (pág 2 com 5). Env real tem 100+. | **Assert acoplado a count exato do seed** |
| **F2** Validar colunas | `getByRole('tab', { name: 'Painéis' }).waitFor()` timeout 30s | ✅ tab visível + selected | React hidrata tab tardiamente após `domcontentloaded`. 30s frágil. | **Timing pós-hydration sem timeout explícito** |
| **F3** Validar componentes | `page.goto: net::ERR_NETWORK_CHANGED` | ✅ todos os componentes presentes | Rede mudou durante navegação. Spec não retentou. | **Flakiness de rede no goto** |

Lição: dos 3, só F1 é spec realmente errado; F2 e F3 são padrões de
fragilidade evitáveis. Generator/healer devem nunca emitir esses padrões
de novo.

## Princípio 1 — Não acoplar a count exato do seed

❌ **Ruim** (quebra quando o seed muda de tamanho):

```ts
const cardsBefore = await paineis.getCardCount();
await paineis.goToNextPage();
const cardsAfter = await paineis.getCardCount();
expect(cardsAfter).not.toEqual(cardsBefore);  // 25 == 25 → falha
```

✅ **Bom** (invariante: "primeiro item mudou após paginação"):

```ts
const firstBefore = await paineis.getRow(0).locator('td:first-child p').textContent();
await paineis.goToNextPage();
await expect(paineis.getPageButton(2)).toBeVisible();
const firstAfter = await paineis.getRow(0).locator('td:first-child p').textContent();
expect(firstAfter).not.toEqual(firstBefore);
```

Outras invariantes resilientes pra "algo mudou":

- **URL mudou**: `await expect(page).toHaveURL(/page=2/)`
- **Novo botão de página ativo**: `await expect(paineis.getActivePageButton()).toHaveText('2')`
- **API retornou novo conjunto** (intercepta `response`): id da 1ª linha
  diferente
- **Texto específico criado pelo próprio teste apareceu** (ver Princípio 5)

❌ **Outros assertions frágeis que generator NÃO deve emitir**:

- `expect(count).toBe(30)` — quebra com 1 painel a mais/menos no seed
- `expect(rows).toHaveLength(EXACT_NUMBER)` — só ok quando o próprio
  teste criou os N rows e isolou estado
- `expect(text).toBe('Painel 16')` — texto específico do seed; troca
  por `toContain` ou texto que o próprio teste cria

## Princípio 2 — Timeouts explícitos em waitFor pós-hydration

SPA Twygo é React + Chakra. `safeGoto` resolve com `domcontentloaded`
porque `networkidle` é flaky em apps com long-polling. Resultado: o DOM
inicial está pronto, mas componentes críticos (tabs, breadcrumbs,
painéis primários) podem renderizar **>30s depois** em headless lento ou
runner sobrecarregado.

❌ **Ruim** (timeout default 30s — frágil em SPA Twygo):

```ts
async goToList(): Promise<void> {
  await safeGoto(this.page, `/o/${getOrgId()}/use_modes?tab=panels-tab`);
  await this.page.getByRole('tab', { name: 'Painéis' }).waitFor();  // 30s default
}
```

✅ **Bom** (timeout explícito 60s para elementos crítico-rotativos):

```ts
async goToList(): Promise<void> {
  await safeGoto(this.page, `/o/${getOrgId()}/use_modes?tab=panels-tab`);
  await this.page.getByRole('tab', { name: 'Painéis' }).waitFor({ timeout: 60_000 });
}
```

**Onde aplicar timeout 60s**:

- Tabs do useMode (renderizam após fetch de useModeItens)
- Breadcrumbs (`#page-breadcrumb` — renderiza após resolver
  hierarquia menu)
- Tabela de painéis (1ª linha) — renderiza após fetch paginado
- Qualquer elemento que o chrome-mcp confirma "está lá" mas Playwright
  às vezes não pega em 30s

**Quando NÃO precisa 60s** (default 30s OK):

- Inputs/botões em forms já abertos (sem fetch pendente)
- Modais que aparecem imediatamente após click
- Toasts (que vivem 5s e somem)

## Princípio 3 — Retry transparente de rede vive só no safeGoto

`src/utils/modals.ts#safeGoto` já retenta automaticamente em:

- `net::ERR_NETWORK_CHANGED`
- `net::ERR_FAILED`
- `net::ERR_TIMED_OUT`
- `net::ERR_CONNECTION_RESET`

❌ **Ruim** (spec encapsula goto fora do safeGoto):

```ts
test('...', async ({ page }) => {
  for (let i = 0; i < 3; i++) {
    try {
      await page.goto('/o/...');
      break;
    } catch (e) { /* retry manual */ }
  }
});
```

✅ **Bom** (sempre via Page Object que chama safeGoto):

```ts
test('...', async ({ page }) => {
  const paineis = new PaineisListPage(page);
  await paineis.goToList();  // chama safeGoto internamente
});
```

Regra: **specs nunca chamam `page.goto` diretamente**. Page Object usa
`safeGoto`. Se um spec gerado tem `page.goto` literal, generator
violou a regra — refator pra Page Object.

## Princípio 4 — Asserções expressam invariante, não estado exato

✅ **Bom**: "elemento aparece + texto contém X"

```ts
await expect(toast).toBeVisible();
await expect(toast).toContainText('sucesso');
```

❌ **Ruim**: "elemento aparece + texto === 'Painel 16'"

```ts
await expect(card).toHaveText('Painel 16');  // quebra quando seed troca
```

✅ **Bom**: "linha com nome único que eu criei aparece"

```ts
const nomeUnico = `Painel teste ${Date.now()}`;
await paineis.create(nomeUnico);
await expect(paineis.getRowByName(nomeUnico)).toBeVisible();
```

A invariante captura **intenção** ("sucesso aconteceu") sem amarrar a
**estado** que o seed pode mudar.

## Princípio 5 — Não depender de ordem de cards/rows

A listagem de painéis (e a maioria das listagens Twygo) ordena por
`created_at DESC`. Spec que olha "1ª linha" assume implicitamente que
nada foi criado depois — falso em tenant compartilhado.

❌ **Ruim**:

```ts
const primeiroPainel = paineis.getRow(0);
await expect(primeiroPainel).toContainText('Pesquisa Widget');  // outro teste criou 1 mais recente
```

✅ **Bom** — criar dado próprio com nome único e navegar via search:

```ts
const nomeUnico = `Painel TC-${Date.now()}`;
await paineis.create({ nome: nomeUnico, descricao: 'TC self-seed' });
await paineis.searchByName(nomeUnico);
const minhaLinha = paineis.getRowByName(nomeUnico);
await expect(minhaLinha).toBeVisible();
```

✅ **Bom** alternativo — navegar via filtro pelo nome:

```ts
await paineis.applyFilter({ nome: nomeUnico });
await expect(paineis.getRow(0)).toContainText(nomeUnico);
// Aqui getRow(0) é seguro: filtro garantiu que só essa linha aparece
```

Regra: **se você precisa de "1ª linha", primeiro filtre/pesquise** pra
garantir que essa 1ª linha é determinística.

## Tabela "Sintoma → Causa → Fix"

| Sintoma | Causa | Fix |
|---|---|---|
| `expect(cardsAfter).not.toEqual(cardsBefore)` falha com mesmo número | Seed real tem mais itens que esperado; ambas páginas estão "cheias" | Asserir nome/id do 1º item mudou (Princípio 1) |
| `waitFor: Timeout 30000ms` em tab/breadcrumb | React hidrata tardiamente após `domcontentloaded` | `waitFor({ timeout: 60_000 })` (Princípio 2) |
| `net::ERR_NETWORK_CHANGED` no `goto` | Conexão mudou durante navegação | Garantir que goto vai pelo Page Object → safeGoto retenta sozinho (Princípio 3) |
| Spec verde local, vermelho CI quando seed troca | Asserção amarrada a texto/count específico do seed | Reescrever como invariante (Princípio 4) |
| `getRow(0)` retorna painel "errado" em tenant compartilhado | Outro teste/usuário criou painel depois; ordem é `created_at DESC` | Filtrar/pesquisar por nome único antes de pegar `getRow(0)` (Princípio 5) |

## Anti-patterns que generator NÃO deve emitir

- ❌ `expect(items.length).toBe(30)` — count amarrado ao seed
- ❌ `expect(cardsAfter).not.toEqual(cardsBefore)` quando ambos podem ser
  iguais (paginação cheia)
- ❌ `getByText('Painel 16')` — texto literal do seed
- ❌ `waitFor()` sem timeout em tab/breadcrumb/painel primário pós-`safeGoto`
- ❌ `page.goto(...)` direto no spec (deve ser via Page Object → safeGoto)
- ❌ Loop manual de retry em volta de `page.goto`
- ❌ `getRow(0)` sem filtrar/pesquisar antes em tenant compartilhado
- ❌ `expect(toast).toHaveText('exact phrase')` (use `toContainText`)

## Checklist pré-merge de spec novo

Antes de aprovar um spec gerado, responda 5 perguntas. Se qualquer uma
for "sim", aplique o fix correspondente:

1. **Existe `.toBe(<número>)` ou `.toHaveLength(<número>)` onde o
   número vem do seed atual?** → reescrever como invariante.
2. **Existe `waitFor()` sem `{ timeout: ... }` em tab/breadcrumb/painel
   primário após `safeGoto`?** → adicionar `timeout: 60_000`.
3. **Existe `page.goto(...)` literal no spec?** → mover para Page
   Object com `safeGoto`.
4. **Existe `getRow(0)` ou `getCard(0)` sem filtro/search precedente?**
   → adicionar filter/search por nome único do teste.
5. **Existe `expect(...).toHaveText('literal-do-seed')` ou
   `getByText('literal-do-seed')`?** → trocar por `toContainText` ou
   por texto que o próprio teste criou.

## Skills relacionadas

- [`debugar-via-network-e-console`](../debugar-via-network-e-console/SKILL.md)
  — quando o spec falha e quer entender se é frontend, rede ou backend
- [`comparar-chrome-mcp-vs-playwright`](../comparar-chrome-mcp-vs-playwright/SKILL.md)
  — fluxo de auditoria pra categorizar falha (flakiness vs bug vs seed)
- [`twygo-triage-report`](../twygo-triage-report/SKILL.md) — onde
  categorizar a falha após o diagnóstico
- [`fechar-modais-twygo`](../fechar-modais-twygo/SKILL.md) — modais
  oportunistas (NPS Sofia, etc) também podem mascarar falhas como
  "timing"; resolver antes de aplicar Princípio 2
