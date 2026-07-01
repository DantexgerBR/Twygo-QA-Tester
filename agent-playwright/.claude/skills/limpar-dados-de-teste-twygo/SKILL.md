---
name: limpar-dados-de-teste-twygo
description: Todo spec Playwright Twygo que cria/altera estado persistente (painel, item de menu, layout, contrato, toggle) precisa de afterAll/afterEach que limpe via variant *_safe do Page Object. Sem cleanup, runs sucessivos acumulam orphans nos envs compartilhados e cascateiam falhas em outros testes — toast genérico "Não foi possível inativar o painel" disparado por orphan menu items é o sintoma clássico. Skill define template canônico de cleanup, catálogo de variants *_safe existentes, ordem de operações quando há dependência (desassociar antes de deletar), e anti-patterns. Use sempre que gerar/revisar spec novo que cria estado, ou ao auditar suite legada antes de retrofit.
when_to_use: |
  - Generator emitindo spec novo que cria/altera estado persistente
  - Auditar suite legada antes de retrofit de cleanup
  - Spec falha intermitentemente com toast genérico "Não foi possível X"
  - Env acumulou orphans (Painel TC* w0-..., menu items orphan)
triggers:
  - "cleanup obrigatório"
  - "*_safe"
  - "afterAll"
  - "deletePanelByNameSafe"
  - "disassociatePanelFromMenu_safe"
  - "Não foi possível inativar o painel"
  - "orphan"
  - "worker-isolated"
version: 1.0.0
---

# limpar-dados-de-teste-twygo

## Por que existe

Run live 2026-05-14 da suíte **Painéis dos usuários (widgets)**: ~30
specs com `afterAll` cleanup vs ~56 specs **criando estado e abandonando**.
Orgs dos envs `staging-widgets` e `staging` viraram lixão. Sintoma vivo
nos envs: dezenas de painéis `Painel TC* w0-17473...`,
`Painel QA Teste` orphan, items de menu apontando pra painéis deletados.

Pior: **orphan menu items cascateiam**. Bug `title_for#NoMethodError`
(documentado em `feedback_orphan_pollution_panels.md`) faz frontend
engolir 422 em `change_status` e disparar toast genérico "Não foi
possível inativar o painel" pra TODOS os painéis da org enquanto pelo
menos 1 orphan menu item existir. Suítes verdes na primeira run viram
red no dia seguinte por contaminação cumulativa.

**Lição**: cleanup não é opcional. É invariante do código de teste — sem
ele, o ambiente compartilhado degrada e o sinal do teste mente.

## Quando usar

- **Generator** emitindo spec novo que cria/altera estado persistente.
- **Healer** corrigindo spec que falhou — se a falha foi "elemento
  duplicado" ou "toast genérico aparece sem ação minha", suspeite de
  orphan pollution antes de mexer em seletor.
- **Code review** de suite legada — antes de marcar verde, conferir que
  toda criação tem cleanup pareado.
- **Bootstrap de testsuite nova** — design do `beforeAll`/`afterAll` é
  parte da definição da suite, não detalhe de implementação.

## Regra dura (canon)

> **Todo `test()` ou `test.describe()` que cria, vincula ou muta
> permanentemente um recurso server-side DEVE registrar um `afterAll`
> (ou `afterEach`, se a criação é por test) que reverte a operação
> usando o variant `*_safe` do Page Object.**

Categorias do que conta como "estado persistente":

| Categoria | Exemplo | Cleanup obrigatório |
|---|---|---|
| Painel criado | `painelForm.createPanel(name)` | `deletePanelByNameSafe(name)` |
| Item de menu vinculado | `paineis.associatePanelToMenu(panel, useModeId)` | `disassociatePanelFromMenu_safe(panel, useModeId)` ANTES do delete do painel |
| Toggle ativado/desativado | `paineis.toggleActiveByName(name)` (quando o estado inicial não vai ser recriado pelo `beforeAll`) | Toggle reverso no `afterAll` |
| Tabela de preços ativada | (Super Admin) | Reverter tabela ativa no `afterAll` — tabela é compartilhada entre TODAS as orgs |
| Contrato editado | (Super Admin) | Reverter valores no `afterAll` |
| Widget adicionado em painel **persistente** | painel pré-existente do env | `removeWidget` no `afterAll` |
| Widget adicionado em painel **criado no test** | painel é deletado no afterAll | NÃO precisa cleanup separado — delete do painel arrasta widgets |

## Catálogo de variants `*_safe` existentes

| Variant | Localização | O que faz |
|---|---|---|
| `deletePanelByNameSafe(name)` | `projects/widgets/pages/PaineisListPage.ts:786` | Deleta painel; se não existe, vira no-op com `console.warn` |
| `disassociatePanelFromMenu_safe(panelName, useModeId, itemName?)` | `projects/widgets/pages/PaineisListPage.ts:933` | Remove item de menu vinculado ao painel; se já removido, no-op |

**Faltando** (criar quando demandado pela retrofit ou suite nova):

- `PainelFormPage.removeWidgetSafe(widgetId)` — necessário pra suites
  que adicionam widget em painel pré-existente que NÃO pode ser deletado
  (cenários do `staging` com painel oficial). Hoje só
  `editar-excluir-widgets` precisaria — todas criam painel próprio, então
  delete do painel arrasta widget; variant não-prioritário.
- `SuperAdminPage.revertActivePricingTableSafe(originalTableName)` —
  prioritário pra suite `beta-launch` quando ela ativar tabela de preços
  em testes (hoje só lê, então variant não emergiu ainda).

## Protocolo pra criar variant `*_safe` novo

Quando aparece operação de cleanup ainda não coberta, **NÃO inlinar
try/catch no afterAll** — adiciona variant no POM:

```ts
// projects/widgets/pages/MinhaPage.ts

async operacaoOriginal(arg: string): Promise<void> {
  // lógica que estoura se pré-condição não bate
}

/**
 * Versão tolerante a falhas — usado em afterAll para cleanup robusto.
 * Se o recurso já foi removido (test falhou antes de criar OU outro test
 * já limpou), vira no-op em vez de mascarar a falha original do test.
 */
async operacaoOriginalSafe(arg: string): Promise<void> {
  try {
    const exists = (await this.getLocatorParaRecurso(arg).count()) > 0;
    if (!exists) {
      // eslint-disable-next-line no-console -- diagnóstico em afterAll
      console.warn(`[operacaoOriginalSafe] recurso "${arg}" não existe — cleanup no-op`);
      return;
    }
    await this.operacaoOriginal(arg);
  } catch (err) {
    // eslint-disable-next-line no-console -- diagnóstico em afterAll
    console.warn(
      `[operacaoOriginalSafe] falha ao limpar "${arg}": ${(err as Error).message}`,
    );
  }
}
```

Regras do variant:
1. Sempre nome `<operacao>Safe` ou `<operacao>_safe` (segue padrão do
   POM existente — `deletePanelByNameSafe` camelCase,
   `disassociatePanelFromMenu_safe` snake; ambos aceitos por compatibilidade).
2. Try/catch envolve TUDO. Erro nunca vaza pro Playwright.
3. `console.warn` (com `// eslint-disable no-console -- diagnóstico em afterAll`)
   pra leitor do log saber se cleanup virou no-op.
4. Check de existência ANTES de operar quando barato (`.count() > 0`) —
   evita warn ruidoso quando cleanup roda em test que falhou antes da
   criação.

## Template canônico do `afterAll`

Usar **contexto Playwright fresco** (não a `page` do test) — `afterAll`
roda depois do close natural da `page` do test:

```ts
import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.use({ viewport: { width: 1920, height: 1080 } });
const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Minha suite', () => {
  let panelName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    // worker-isolated: evita colisão em runs paralelos
    panelName = `Painel TCX w${testInfo.workerIndex}-${Date.now()}`;
    const ctx = await browser.newContext({
      storageState: STORAGE_STATE,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      await paineis.createPanel({ name: panelName });
    } finally {
      await ctx.close();
    }
  });

  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({
      storageState: STORAGE_STATE,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      await paineis.goToList();
      await paineis.deletePanelByNameSafe(panelName);
    } finally {
      await ctx.close();
    }
  });

  test('...', async ({ page, step }) => { /* ... */ });
});
```

**Referência viva**: `projects/widgets/tests/features/ativar-inativar-painel/inativar-painel-nao-associado.spec.ts` é o exemplo canônico — copia/adapta dele.

## Ordem de cleanup quando há dependência

`afterAll` é executado em ordem reversa de aquisição (LIFO). Quando o
test associou painel a menu, **desassociar ANTES de deletar o painel**,
senão o backend bloqueia delete com modal "Painel em uso":

```ts
test.afterAll(async ({ browser }) => {
  const ctx = await browser.newContext({ storageState: STORAGE_STATE });
  const page = await ctx.newPage();
  try {
    const paineis = new PaineisListPage(page);
    // 1. PRIMEIRO desassocia (senão deletePanel trava no modal "Painel em uso")
    await paineis.disassociatePanelFromMenu_safe(panelName, useModeId);
    // 2. DEPOIS deleta painel (que agora está livre)
    await paineis.goToList();
    await paineis.deletePanelByNameSafe(panelName);
  } finally {
    await ctx.close();
  }
});
```

Mesma regra vale pra qualquer FK lógica: filho antes de pai. Documentado
no CLAUDE.md §7.5 mas só pra ativar-inativar — generalizado aqui.

## Toggle reversível — cleanup é reverter, não deletar

Suites que tocam estado mas NÃO criam recurso novo (ex:
`pesquisa-e-filtros/filtro-padrao-paineis-inativos` inativa painel
pré-existente pra validar o filtro) precisam reverter o toggle:

```ts
test.afterAll(async ({ browser }) => {
  const ctx = await browser.newContext({ storageState: STORAGE_STATE });
  const page = await ctx.newPage();
  try {
    const paineis = new PaineisListPage(page);
    await paineis.goToList();
    // Reverter toggle pra estado original (Ativo)
    const sw = paineis.getRowActiveSwitchByName(panelToToggle);
    if (await sw.isChecked() === false) {
      await paineis.toggleActiveByName(panelToToggle);
    }
  } finally {
    await ctx.close();
  }
});
```

Idempotência: o check `isChecked() === false` evita warning quando o test
falhou antes de inativar o painel.

## Worker-isolated naming (não-negociável em CI paralelo)

`testInfo.workerIndex` + `Date.now()` no nome do recurso garante que
runs paralelos não colidem:

```ts
panelName = `Painel TC2 w${testInfo.workerIndex}-${Date.now()}`;
// w0-1734567890123, w1-1734567891001, etc — únicos mesmo com workers=4
```

**Nunca** usar nomes literais (`'Painel Teste'`) — colide com outros
specs e atrai o orphan acumulado do env.

## Anti-patterns proibidos

### A. Cleanup que assume teste passou

```ts
// ❌ ERRADO
test.afterAll(async ({ browser }) => {
  // ...
  await paineis.deletePanelByName(panelName);  // sem _safe
  await paineis.disassociatePanelFromMenu(panelName, useModeId);  // sem _safe
});
```

Se o test falhou antes de criar o painel, `deletePanelByName` estoura
"row not found" e mascara a falha real do test. Sempre `*Safe`.

### B. `try/catch` inline em vez de variant no POM

```ts
// ❌ ERRADO
test.afterAll(async ({ browser }) => {
  try { await paineis.deletePanelByName(panelName); } catch {}
});
```

Try/catch silencioso esconde até bug de POM (mudança de seletor que
quebra delete em TODOS os specs). Variant `*Safe` faz `console.warn`
explícito — bug aparece no log.

### C. Cleanup com `page` do test

```ts
// ❌ ERRADO
test.afterAll(async ({ page }) => {
  await paineis.deletePanelByNameSafe(panelName);
});
```

A `page` do test já foi fechada quando `afterAll` roda (Playwright fecha
contexto após último `test()`). Erro vira `Target page, context or
browser has been closed`. Sempre criar contexto fresco via
`browser.newContext({ storageState })`.

### D. Cleanup só no test (sem `afterAll`)

```ts
// ❌ ERRADO
test('cria painel', async ({ page }) => {
  // ... cria painel
  await paineis.deletePanelByName(panelName);  // no fim do test
});
```

Se test falhar antes da última linha, painel fica orphan. `afterAll`
roda mesmo em falha — é o único garantido.

### E. Nome literal compartilhado entre runs

```ts
// ❌ ERRADO
panelName = 'Painel Teste Importacao';
```

Cria orphan determinístico que outros specs vão encontrar como "este
painel já existe". Sempre worker-isolated.

### F. Cleanup que limpa recursos do env compartilhado

```ts
// ❌ ERRADO
test.afterAll(async () => {
  // deletar TODOS os painéis órfãos do env
  for (const p of await paineis.getAllPanels()) {
    if (p.name.startsWith('Painel TC')) await paineis.deletePanelByNameSafe(p.name);
  }
});
```

Pode deletar painéis de OUTRO test rodando em paralelo no mesmo env.
Cada test só limpa o que ele criou — escopo restrito ao `panelName`
deste describe.

## Cobertura do retrofit (2026-05-14)

Catálogo completo (specs por suite + plano de retrofit) em [`RETROFIT-CATALOG.md`](RETROFIT-CATALOG.md). Resumo: **56 specs pendentes** distribuídos em 7 suites; cobertura alvo 100%.

## Checklist pra generator (incluir no orchestrator)

Antes de salvar um spec novo:

- [ ] Spec cria/vincula/muta recurso server-side?
- [ ] Se sim, `test.afterAll` existe?
- [ ] `afterAll` cria contexto fresco via `browser.newContext`?
- [ ] Cleanup usa variant `*_safe` (não a versão estrita)?
- [ ] Se há dependência (item de menu → painel), ordem é filho-antes-de-pai?
- [ ] Nome do recurso é worker-isolated (`w${workerIndex}-${Date.now()}`)?

Failures em qualquer item ⇒ generator recusa salvar e retorna ao
planejamento.

## Quando NÃO usar

- Spec é 100% read-only (apenas lê listagem/colunas, sem create/update/delete server-side) — cleanup desnecessário.
- Spec usa `page.route()` mockando todos os requests de mutação — backend nunca é tocado, sem estado pra limpar.
- Recurso é worker-isolated efêmero descartado pelo próprio framework (storage state local, cookies de sessão) — Playwright já isola.
- TC opera em env Trial dedicado que será reciclado/zerado por outro fluxo (ver [[testar-exclusao-dados-trial-twygo]]) — cleanup duplicado.
- Mutação foi feita via API e o próprio TC tem step "Deletar X" como expectativa do cenário — não duplicar em `afterAll`.

## Referências

- CLAUDE.md §7.5 (Tabela de preços compartilhada — revert obrigatório)
- CLAUDE.md §7.6 Anti-pattern G (Spec cria estado sem afterAll)
- `feedback_orphan_pollution_panels.md` (memória — sintoma cascateando)
- `bug_title_for_linked_menus.md` (memória — bug que amplia o dano de orphans)
- Exemplo canônico: `projects/widgets/tests/features/ativar-inativar-painel/inativar-painel-nao-associado.spec.ts`
- Exemplo com dependência: `projects/widgets/tests/features/ativar-inativar-painel/tentar-inativar-painel-associado.spec.ts` (desassocia ANTES de delete)
